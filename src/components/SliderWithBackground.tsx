import React from "react";
import styled from "styled-components";
import { inputBg, inputBgServo5, inputBgServo6 } from "../assets/icons";

interface RangeInputProps {
  onChange: (value: number) => void;
  min: number;
  max: number;
  value: number;
  bg?: string; // Optional, in case you want to pass a custom background
}

const InputRange = styled.input.attrs({
  type: "range",
})<{ bg: string }>`
  @media screen and (max-width: 750px) {
    width: 250px;
  }
  opacity: 0.5;
  width: 400px;
  -webkit-appearance: none;
  background-image: ${(props) => `url(${props.bg})`};

  &::-webkit-slider-runnable-track {
    width: 300px;
    height: 50px;
    background: #ddd;
    border: none;
    background-image: ${(props) => `url(${props.bg})`};
    background-position: center;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    height: 100%;
    width: 20px;
    background: #ff4181;
  }

  &:focus {
    outline: none;
  }

  &:focus::-webkit-slider-runnable-track {
    background-image: ${(props) => `url(${props.bg})`};
  }
`;

export const SpeedRangeInput: React.FC<RangeInputProps> = ({
  onChange,
  min,
  max,
  value,
  ...rest
}) => {
  return (
    <InputRange
      bg={inputBg}
      defaultValue={0}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      {...rest} // Spread any additional props
    />
  );
};

export const Servo5RangeInput: React.FC<RangeInputProps> = ({
  onChange,
  min,
  max,
  value,
  ...rest
}) => {
  return (
    <InputRange
      bg={inputBgServo5}
      defaultValue={0}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      {...rest} // Spread any additional props
    />
  );
};
export const Servo6RangeInput: React.FC<RangeInputProps> = ({
  onChange,
  min,
  max,
  value,
  ...rest
}) => {
  return (
    <InputRange
      bg={inputBgServo6}
      defaultValue={0}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        rotate: "-90deg",
        width: "60vh",
      }}
      {...rest} // Spread any additional props
    />
  );
};
