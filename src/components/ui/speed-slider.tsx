"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../../lib/utils";
import { CircleGauge, Icon } from "lucide-react";
import { useAtom } from "jotai";
import { BluetoothContext } from "../../providers/bluetooth";

const _speed_slider = React.forwardRef<
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
        "relative grow overflow-hidden rounded bg-gray-400",
        "data-[orientation='horizontal']:h-4 data-[orientation='horizontal']:w-full",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1.5",
        "overflow-hidden rounded-full"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute bg-[#ff6600]",
          "data-[orientation='horizontal']:h-full",
          "data-[orientation='vertical']:w-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-10 w-10 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#ff6600] flex items-center justify-center overflow-hidden">
      <CircleGauge className="text-white" />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
_speed_slider.displayName = SliderPrimitive.Root.displayName;

export default function SpeedSlider({
  className,
  ...props
}: {
  className?: string;
}) {
  const { speed, setSpeed } = React.useContext(BluetoothContext);

  return (
    <div className="w-1/3 h-full items-center justify-center flex flex-row">
      <_speed_slider
        className={className}
        {...props}
        value={[speed]}
        onValueChange={(e) => {
          console.log("trigger/ speed slider", e[0]);
          setSpeed(e[0]);
        }}
        min={0}
        max={100}
      />
    </div>
  );
}
