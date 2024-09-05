import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import { Bluetooth, Cone, HomeIcon } from "lucide-react";
import DirectionalButton from "./components/DirectionalButton";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonApp, IonRouterOutlet, IonFooter } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  KonstaProvider,
  Link,
  Block,
  BlockTitle,
  Button,
  List,
  ListItem,
} from "konsta/react";

import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Route } from "react-router-dom";
import { cn } from "./util";
import RangeInput from "./components/RangeInput";
import {
  SpeedRangeInput,
  Servo5RangeInput,
  Servo6RangeInput,
} from "./components/SliderWithBackground";
import { Slider } from "./components/ui/slider";
import RetroGrid from "./components/magicui/retro-grid";
import { useRef } from "react";
import { clear } from "console";
import CalibrationSlider from "./components/ui/calibration-slider";
import SpeedSlider from "./components/ui/speed-slider";
import Servo5Slider from "./components/ui/servo5-slider";
import Servo6Slider from "./components/ui/servo6-slider";
import { useAtom } from "jotai";
import { BluetoothContext, ConnectStateEnum } from "./providers/bluetooth";
import { produce } from "immer";
import backgroundImage from "./assets/images/background0.png";

setupIonicReact();

const Home: React.FC = () => {
  return (
    // Use IonPage, IonHeader, IonFooter & IonToolbar from Ionic
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My App</IonTitle>
        </IonToolbar>
      </IonHeader>
      {newFunction()}
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My App</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* In page content we can use Konsta UI components  */}
        <Block strong>
          <p className="text-bold">
            Here is your Ionic & Konsta UI app. Let's see what we have here.
            Haha
          </p>
        </Block>
        <BlockTitle>Navigation</BlockTitle>
        <List>
          <ListItem href="/about/" title="About" />
          <ListItem href="/form/" title="Form" />
        </List>

        <Block
          strong
          className="flex flex-col w-full h-40 bg-gray-100 space-x-4 "
        ></Block>
      </IonContent>
    </IonPage>
  );
};

function newFunction() {
  return (
    <IonFooter>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton>Start</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  );
}

const ControllApp = () => {
  let ref = useRef<ReturnType<typeof setInterval>>();
  let [angle, setAngle] = useState(20);
  let [direction, setDirection] = useState(1);
  // useEffect(() => {
  //   clearInterval(ref.current);
  //   ref.current = setInterval(() => {
  //     if (angle > 50) {
  //       setDirection(-1);
  //     } else if (angle == 0) {
  //       setDirection(1);
  //     }
  //     setAngle(angle + direction);
  //   }, 10);
  // });

  return (
    <div
      className="flex flex-col w-full h-full bg-slate-300 select-none "
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <TopControlSetion />
      <BottomControlSection />
    </div>
  );
};
function TopControlSetion() {
  return (
    <div className="#top-control flex flex-row w-full h-[20vh]  justify-between p-4 border-none border-red-600 space-x-8">
      <ReturnHomeButton />
      <SpeedSlider />
      <Servo5Slider />
      <BluetoothConnectButton />
    </div>
  );
}

function BottomControlSection() {
  const {
    speed,
    servo5Angle,
    servo6Angle,
    forwardCalibration,
    backwardCalibration,
    button,
    setButton,
  } = useContext(BluetoothContext);

  return (
    <div className="#bottom-setion flex flex-row w-full h-[80vh] justify-between">
      <div className="#left-control flex flex-row   h-full  ml-[10vw] justify-center items-center border-none border-red-600 my-auto space-x-8">
        <div className="relative flex flex-col space-y-8 w-fit h-full justify-center items-center">
          <DirectionalButton
            className="-rotate-90"
            onPress={() => {
              setButton(
                produce(button, (draft) => {
                  draft.up = true;
                })
              );
            }}
            onRelease={() => {
              setButton(
                produce(button, (draft) => {
                  draft.up = false;
                })
              );
            }}
          />
          <DirectionalButton
            className="rotate-90"
            onPress={() => {
              setButton(
                produce(button, (draft) => {
                  draft.down = true;
                })
              );
            }}
            onRelease={() => {
              setButton(
                produce(button, (draft) => {
                  draft.down = false;
                })
              );
            }}
          />
        </div>
        {/* <div className="h-full w-8 bg-red-600 mx-auto flex"></div> */}
      </div>

      <div className="#middle-control flex flex-row   h-full  justify-center items-center border-none border-red-600 my-auto space-x-8 flex-grow pb-8">
        <Servo6Slider />
      </div>
      <div className="#right-control flex flex-col   h-full  mr-[10vw] justify-center items-center border-none border-red-600  space-y-8 relative">
        <div className="flex flex-grow flex-row w-full h-fit justify-center items-center space-x-8 border-none border-red-600">
          <DirectionalButton
            className="rotate-180"
            onPress={() => {
              setButton(
                produce(button, (draft) => {
                  draft.left = true;
                })
              );
            }}
            onRelease={() => {
              setButton(
                produce(button, (draft) => {
                  draft.left = false;
                })
              );
            }}
          />
          <DirectionalButton
            className=""
            onPress={() => {
              setButton(
                produce(button, (draft) => {
                  draft.right = true;
                })
              );
            }}
            onRelease={() => {
              setButton(
                produce(button, (draft) => {
                  draft.right = false;
                })
              );
            }}
          />
        </div>

        <CalibrationSlider className="absolute w-full h-fit bottom-[10vh] left-0" />
      </div>
    </div>
  );
}

function BluetoothConnectButton() {
  const {
    connectDevice,
    disconnectDevice,
    setConnectionState,
    setDevice,
    connectionState,
    device,
  } = useContext(BluetoothContext);

  const handleClick = () => {
    console.log("click/ network button");
    // if (bluetoothInterface.state === ConnectStateEnum.idling) {
    //   console.log("click/ network button: trigger scanning state");
    //   setBluetoothInterface((draft) => {
    //     draft.device = null;
    //     draft.state = ConnectStateEnum.scanning;
    //   });
    // } else {
    //   setBluetoothInterface((draft) => {
    //     draft.state = ConnectStateEnum.idling;
    //     draft.device = null;
    //   });
    //   console.log("click/ network button: trigger idling state by user");
    // }

    if (connectionState === ConnectStateEnum.idling) {
      setConnectionState(ConnectStateEnum.scanning);
    } else {
      setConnectionState(ConnectStateEnum.idling);
      setDevice(null);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "h-full w-fit rounded-full flex flex-row items-center justift-start flex  bg-white border-2 border-red-600 p-4"
      )}
      // aria-label={`Bluetooth ${connectionState}`}
    >
      <Bluetooth
        className={cn(
          "w-10 h-fit aspect-square rounded-full  flex-grow p-2 m-2"
        )}
      />
      <span>
        {connectionState === ConnectStateEnum.connected
          ? device?.name || "Unknown Device"
          : connectionState}
      </span>
      {/* <span>
        {connectionState === "connected" && "Connected"}
        {connectionState === "disconnected" && "Disconnected"}
        {connectionState === "pulsing" && "Click to connect"}
      </span> */}
    </button>
  );
}

function ReturnHomeButton() {
  return (
    <button
      className={cn(
        "h-full w-fit rounded-full flex flex-row items-center justift-start flex  bg-white border-2 border-red-600 p-4"
      )}
      onClick={() => {
        window.location.href = "/learn";
      }}
    >
      <HomeIcon className="text-red-600" />
    </button>
  );
}

function App() {
  useEffect(() => {
    try {
      ScreenOrientation.lock({ orientation: "landscape" });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-blue-100 border-none border-blue-500">
      <ControllApp />
    </div>
  );
}

export default App;
