import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MenuIcon, settingIcon, volumnIcon } from "../assets/icons";

interface SwitchButtonProps {
  handleTurnOn?: () => void;
  handleTurnOff?: () => void;
  iconTurnOn?: string;
  iconTurnOff?: string;
  icon?: string;
  onClick?: () => void;
  handleSetState?: (
    setIsTurnOn: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  backgroundColorTurnOn?: string;
  backgroundColorTurnOff?: string;
}

export default function SwitchButton({
  handleTurnOn,
  handleTurnOff,
  iconTurnOn,
  iconTurnOff,
  icon,
  onClick,
  handleSetState,
  backgroundColorTurnOn = "green",
  backgroundColorTurnOff = "#CA1617",
  ...rest
}: SwitchButtonProps) {
  const [isTurnOn, setIsTurnOn] = useState(false);

  const handleClick = () => {
    if (!icon) setIsTurnOn(!isTurnOn);
    onClick?.();
    handleSetState?.(setIsTurnOn);
  };

  useEffect(() => {
    if (isTurnOn) {
      handleTurnOn?.();
    } else {
      handleTurnOff?.();
    }
  }, [isTurnOn]);

  return (
    <button
      onClick={handleClick}
      className={`w-[80px] h-[80px] cursor-pointer rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.24)]`}
      style={{
        backgroundColor: isTurnOn
          ? backgroundColorTurnOn
          : backgroundColorTurnOff,
        border: !icon ? (isTurnOn ? "none" : "2px solid #CEBDCD") : "none",
        backgroundImage: `url(${
          icon ? icon : !isTurnOn ? iconTurnOn : iconTurnOff
        })`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      {...rest}
    />
  );
}
