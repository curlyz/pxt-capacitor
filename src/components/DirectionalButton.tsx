import React, { useRef, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

export default function DirectionalButton({
  onPress,
  onRelease,
  className,
  children,
}: {
  onPress?: () => void;
  onRelease?: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  const [isActive, setIsPressed] = useState(false);

  return (
    <button
      className={cn(
        "w-24 h-24 rounded-full   flex items-center justify-center p-0 border-2 border-red-600 select-none bg-gray-300 ring-2 ring-black",
        isActive ? "bg-orange-500" : "bg-gray-300",
        className
      )}
      aria-label="Play"
      // onMouseDown={() => {
      //   setIsPressed(true);
      //   onPress && onPress();
      // }}
      // onMouseUp={() => {
      //   setIsPressed(false);
      //   onRelease && onRelease();
      // }}
      onTouchStart={() => {
        setIsPressed(true);
        onPress && onPress();
      }}
      onTouchEnd={() => {
        setIsPressed(false);
        onRelease && onRelease();
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 12L36 24L18 36V12Z"
          fill={isActive ? "#FFFFFF" : "#FFA500"}
          stroke={isActive ? "#FFFFFF" : "#FFA500"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
