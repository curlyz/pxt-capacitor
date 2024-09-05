"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../../lib/utils";
import { BluetoothContext, DirectionEnum } from "../../providers/bluetooth";

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
        "relative grow overflow-hidden rounded bg-[#00aeef] opacity-20",
        "data-[orientation='horizontal']:h-4 data-[orientation='horizontal']:w-full",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1.5",
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
    <SliderPrimitive.Thumb className="block h-10 w-10 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#00aeef]" />
  </SliderPrimitive.Root>
));
_calibration_slider.displayName = SliderPrimitive.Root.displayName;

// export { _calibration_slider as Slider };

export default function CalibrationSlider({
  className,
  ...props
}: {
  className?: string;
}) {
  const {
    forwardCalibration,
    setForwardCalibration,
    direction,
    setBackwardCalibration,
    backwardCalibration,
  } = React.useContext(BluetoothContext);

  /**
   * this slider only show up when the direction is forward or backward after a period of time of two seconds
   * if the direction is not forward or backward, the slider will not show up
   * so it need to track of time
   *
   * also, the value is either forwardCalibration or backwardCalibration respectively
   */

  let timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    if (
      direction === DirectionEnum.Forward ||
      direction === DirectionEnum.Backward
    ) {
      timeoutRef.current = setTimeout(() => {
        setShow(true);
      }, 2000);
    } else {
      setShow(false);
      clearTimeout(timeoutRef.current);
    }
  }, [direction]);

  let [show, setShow] = React.useState(false);

  return (
    <_calibration_slider
      className={cn(
        className,
        "transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0"
      )}
      {...props}
      value={
        direction === DirectionEnum.Forward
          ? [forwardCalibration]
          : [backwardCalibration]
      }
      onValueChange={(value) =>
        direction === DirectionEnum.Forward
          ? setForwardCalibration(value[0])
          : setBackwardCalibration(value[0])
      }
    />
  );
}
