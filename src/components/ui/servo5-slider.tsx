"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../../lib/utils";
import { useAtom } from "jotai";
import { BluetoothContext } from "../../providers/bluetooth";

const _calibration_slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none",
      "data-[orientation-'horizontal']:h2 data-[orientation='horizontal']:w-full data-[orientation='horizontal']:items-center",
      "data-[orientation-'vertical']:w-1.5 data-[orientation='vertical']:h-full data-[orientation='vertical']:justify-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative grow overflow-hidden rounded bg-gray-600 opacity-80",
        "data-[orientation='horizontal']:h-4 data-[orientation='horizontal']:w-full",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1.5",
        "overflow-hidden rounded-full"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute bg-green-600 opacity-80",
          "data-[orientation='horizontal']:h-full",
          "data-[orientation='vertical']:w-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-16 w-fit p-1 rounded-lg border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-green-600 flex items-center justify-center overflow-hidden">
      <p className="text-white">PORT5</p>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
_calibration_slider.displayName = SliderPrimitive.Root.displayName;

// export { _calibration_slider as Slider };

export default function Servo5Slider({
  className,
  ...props
}: {
  className?: string;
}) {
  const { servo5Angle, setServo5Angle } = React.useContext(BluetoothContext);

  return (
    <div className="w-1/3 h-full items-center justify-center flex flex-row">
      <_calibration_slider
        className={className}
        {...props}
        value={[servo5Angle]}
        onValueChange={(e) => {
          console.log("trigger/ servo5 slider", e[0]);
          setServo5Angle(e[0]);
        }}
        min={0}
        max={180}
      />
    </div>
  );
}
