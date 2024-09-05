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
        "relative grow overflow-hidden rounded bg-red-600  ",
        "data-[orientation='horizontal']:h-4 data-[orientation='horizontal']:w-full",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-4",
        "overflow-hidden rounded-full"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute bg-[#00aeef] opacity-20",
          "data-[orientation='horizontal']:h-full",
          "data-[orientation='vertical']:w-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-fit w-16 rounded-lg overflow-hidden p-1 aspect-square items-center justify-center border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-red-600 flex">
      <p className="text-white">PORT6</p>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
_calibration_slider.displayName = SliderPrimitive.Root.displayName;

// export { _calibration_slider as Slider };

export default function Servo6Slider({
  className,
  ...props
}: {
  className?: string;
}) {
  const { servo6Angle, setServo6Angle } = React.useContext(BluetoothContext);

  return (
    <>
      <_calibration_slider
        className={className}
        {...props}
        orientation="vertical"
        value={[servo6Angle]}
        onValueChange={(e) => {
          console.log("trigger/ servo6 slider", e[0]);
          setServo6Angle(e[0]);
        }}
        min={0}
        max={180}
      />
    </>
  );
}
