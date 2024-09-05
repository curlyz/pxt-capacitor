import React from "react";
import styled from "styled-components";
import { inputBg } from "../assets/icons";

interface RangeInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  value: number;
  bg: string;
}

export default function RangeInput({
  onChange,
  min,
  max,
  value,
  bg,
  ...rest
}: RangeInputProps) {
  return (
    <input
      type="range"
      className={`w-[400px] sm:w-[250px] appearance-none focus:outline-none`}
      style={{
        backgroundImage: `url(${bg})`,
        WebkitAppearance: "none",
      }}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}
