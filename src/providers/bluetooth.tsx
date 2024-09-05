import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BleClient,
  BleDevice,
  RequestBleDeviceOptions,
} from "@capacitor-community/bluetooth-le";
import { useAtom } from "jotai";
import { Command } from "lucide-react";
import { write } from "fs";

const initialState = {
  button: {
    up: false,
    down: false,
    left: false,
    right: false,
  },
};

export enum ConnectStateEnum {
  idling = "idling",
  disconnected = "disconnected",
  scanning = "scanning",
  paired = "paired",
  connecting = "connecting",
  connected = "connected",
}

export enum DirectionEnum {
  Forward = "F",
  Backward = "B",
  RotateLeft = "L",
  RotateRight = "R",
  TurnLeft = "I",
  TurnRight = "G",
  TurnLeftBack = "H",
  TurnRightBack = "J",
  Stop = "S",
}

export const BluetoothContext = createContext({
  connectDevice: async () => {},
  disconnectDevice: async () => {},
  requestDevice: async () => {},
  writeDevice: async (data: string) => {},
  sendCommand: (command: string, value?: number) => {},

  device: null as BleDevice | null,
  setDevice: (device: BleDevice | null) => {},
  connectionState: ConnectStateEnum.idling,
  setConnectionState: (connectionState: ConnectStateEnum) => {},

  button: initialState.button,
  setButton: (button: typeof initialState.button) => {},

  speed: 0,
  setSpeed: (speed: number) => {},
  servo5Angle: 0,
  setServo5Angle: (servo5Angle: number) => {},
  servo6Angle: 0,
  setServo6Angle: (servo6Angle: number) => {},
  forwardCalibration: 0,
  setForwardCalibration: (forwardCalibration: number) => {},
  backwardCalibration: 0,
  setBackwardCalibration: (backwardCalibration: number) => {},

  direction: DirectionEnum.Stop,
  setDirection: (direction: DirectionEnum) => {},
});

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const BluetoothProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // let device: BleDevice | null = null;
  let [button, setButton] = useState(initialState.button);

  let [device, setDevice] = useState<BleDevice | null>(null);
  let [connectionState, setConnectionState] = useState<ConnectStateEnum>(
    ConnectStateEnum.idling
  );
  let [speed, setSpeed] = useState<number>(90);
  let [servo5Angle, setServo5Angle] = useState<number>(0);
  let [servo6Angle, setServo6Angle] = useState<number>(0);
  let [forwardCalibration, setForwardCalibration] = useState<number>(0);
  let [backwardCalibration, setBackwardCalibration] = useState<number>(0);

  let [direction, setDirection] = useState<DirectionEnum>(DirectionEnum.Stop);
  let [syncedDirection, setSyncedDirection] = useState<DirectionEnum>(
    DirectionEnum.Stop
  );

  /**
   * api level 1 only exist in the plus with version > 40.
   * this api allow for precise control of the servo, speed and calibration.
   * and also reading the values
   */
  let [apiLevel, setApiLevel] = useState<number>(0);

  let reconnectInterval: ReturnType<typeof setInterval> | null = null;
  let reconnectAttemptCount = 0;
  const reconnectDelayBetweenAttempts = 5000;

  async function disconnectDevice() {
    console.log("run/ disconnect device: cleaning up");
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }

    if (device == null) return;

    try {
      await BleClient.disconnect(device.deviceId);
    } catch (e) {}
    device = null;
    reconnectAttemptCount = 0;

    setDevice(null);
    setConnectionState(ConnectStateEnum.idling);

    return;
  }

  async function requestDevice() {
    await BleClient.initialize({
      androidNeverForLocation: true,
    });

    const scanOptions: RequestBleDeviceOptions = {
      namePrefix: "G",
      optionalServices: ["0000FFE0-0000-1000-8000-00805F9B34FB"],
    };

    try {
      device = await BleClient.requestDevice(scanOptions);
    } catch (e) {
      setDevice(null);
      setConnectionState(ConnectStateEnum.idling);

      return;
    }

    if (device == null) {
      return;
    }
    setDevice(device);
    setConnectionState(ConnectStateEnum.paired);
    await connectDevice();
  }

  async function connectDevice() {
    if (device == null) return;

    await BleClient.connect(device.deviceId, async (deviceId) => {
      console.log("Disconnected from device", deviceId);

      setDevice(null);
      setConnectionState(ConnectStateEnum.disconnected);

      reconnectInterval = setInterval(async () => {
        console.log("Device/ Reconnecting");
        if (reconnectAttemptCount > 5) {
          console.log(
            "trigger/ disconnect device: failed to reconnect 5 times"
          );
          reconnectInterval && clearInterval(reconnectInterval);
          await disconnectDevice();

          return;
        }
        try {
          reconnectAttemptCount += 1;
          await connectDevice();
        } catch (e) {
          console.warn("Device/ Failed, will try again ?", e);
        }
      }, reconnectDelayBetweenAttempts);
    });

    if (device == null) return;

    reconnectInterval && clearInterval(reconnectInterval);
    console.log("Device/ Connected to device", device.deviceId);

    await sleep(1000);
    await BleClient.startNotifications(
      device.deviceId,
      "0000FFE0-0000-1000-8000-00805F9B34FB",
      "0000FFE1-0000-1000-8000-00805F9B34FB",
      (value: DataView) => {
        console.log("Device/ Data: ", value);
      }
    );
    console.log("Device/ Start Notifications");
    reconnectAttemptCount = 0;

    setDevice(device);
    setConnectionState(ConnectStateEnum.connected);
  }

  async function writeDevice(data: string) {
    // write device is a command that will have a lifo queue to always update the latest state.
    console.log("Device/ Write", data);
    if (device == null) return;
    const enc = new TextEncoder();
    const dv = enc.encode(data);
    try {
      await BleClient.writeWithoutResponse(
        device.deviceId,
        "0000FFE0-0000-1000-8000-00805F9B34FB",
        "0000FFE1-0000-1000-8000-00805F9B34FB",
        new DataView(dv.buffer)
      );
    } catch (e) {
      console.log("error", e);
    }
  }

  const sendCommand = (command: string, value?: number) => {
    // Implement the sendCommand logic here if needed
  };

  async function updateSpeedToRobot() {
    // map the speed from range 100 to range 10
    if (apiLevel < 1) {
      let mappedSpeed = Math.round((speed / 100) * 11);
      let symbol = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "q"];
      await writeDevice("x");
      await writeDevice(symbol[mappedSpeed]);
    } else {
    }
  }

  async function updateServoToRobot({
    servo,
    angle,
  }: {
    servo: number;
    angle: number;
  }) {
    if (apiLevel < 1) {
      let mappedAngle = Math.round((angle / 100) * 11);
      let symbol = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "q"];
      await writeDevice("x");
      if (servo == 5) {
        await writeDevice("E");
      } else {
        await writeDevice("e");
      }
      await writeDevice(symbol[mappedAngle]);
    } else {
      /**
       * opcode api allow for precise control of the servo angle and duraction.
       */
    }
  }

  async function updateDirectionToRobot() {
    // create a bitmap of the button state as a 4 bit number
    if (apiLevel < 1) {
      if (
        button.up == true &&
        button.down == false &&
        button.left == false &&
        button.right == false
      ) {
        setDirection(DirectionEnum.Forward);
        await writeDevice(DirectionEnum.Forward);
      } else if (
        button.up == false &&
        button.down == true &&
        button.left == false &&
        button.right == false
      ) {
        setDirection(DirectionEnum.Backward);
        await writeDevice(DirectionEnum.Backward);
      } else if (
        button.up == false &&
        button.down == false &&
        button.left == true &&
        button.right == false
      ) {
        setDirection(DirectionEnum.RotateLeft);
        await writeDevice(DirectionEnum.RotateLeft);
      } else if (
        button.up == false &&
        button.down == false &&
        button.left == false &&
        button.right == true
      ) {
        setDirection(DirectionEnum.RotateRight);
        await writeDevice(DirectionEnum.RotateRight);
      } else if (
        button.up == true &&
        button.down == false &&
        button.left == true &&
        button.right == false
      ) {
        setDirection(DirectionEnum.TurnLeft);
        await writeDevice(DirectionEnum.TurnLeft);
      } else if (
        button.up == true &&
        button.down == false &&
        button.left == false &&
        button.right == true
      ) {
        setDirection(DirectionEnum.TurnRight);
        await writeDevice(DirectionEnum.TurnRight);
      } else if (
        button.up == false &&
        button.down == true &&
        button.left == true &&
        button.right == false
      ) {
        setDirection(DirectionEnum.TurnLeftBack);
        await writeDevice(DirectionEnum.TurnLeftBack);
      } else if (
        button.up == false &&
        button.down == true &&
        button.left == false &&
        button.right == true
      ) {
        setDirection(DirectionEnum.TurnRightBack);
        await writeDevice(DirectionEnum.TurnRightBack);
      } else if (
        button.up == false &&
        button.down == false &&
        button.left == false &&
        button.right == false
      ) {
        setDirection(DirectionEnum.Stop);
        await writeDevice(DirectionEnum.Stop);
      }
    } else {
      /**
       * opcode api dictate pwm value of both motor, doesn't care of internal calibration.
       *
       */
    }
  }

  useEffect(() => {
    console.log("sub/ network: state change", connectionState);
    if (connectionState === ConnectStateEnum.scanning) {
      requestDevice();
    } else if (connectionState === ConnectStateEnum.connected) {
      syncSpeed();
    }
  }, [connectionState]);

  useEffect(() => {
    // map the speed from range 100 to range 10
    syncSpeed();
  }, [speed]);

  function syncSpeed() {
    let mappedSpeed = Math.round((speed / 100) * 11);
    let symbol = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "q"];

    setTimeout(async () => {
      await writeDevice("x");
      await writeDevice(symbol[mappedSpeed]);
    });
  }

  useEffect(() => {
    // note that do not run this in parallel. if
    updateDirectionToRobot();
  }, [button]);

  /**    ServoModeOn: "X",
    ServoModeOff: "x",
    ServoDualFlag1: "E", // dont ask
    ServoDualFlag2: "e", // dont ask
 */

  return (
    <BluetoothContext.Provider
      value={{
        device,
        setDevice,
        connectionState,
        setConnectionState,
        button,
        setButton,
        connectDevice,
        disconnectDevice,
        requestDevice,
        writeDevice,
        sendCommand,

        speed,
        setSpeed,
        servo5Angle,
        setServo5Angle,
        servo6Angle,
        setServo6Angle,
        forwardCalibration,
        setForwardCalibration,
        backwardCalibration,
        setBackwardCalibration,

        direction,
        setDirection,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

// const { connectDevice, disconnectDevice, writeDevice, sendCommand } = useContext(BluetoothContext);
