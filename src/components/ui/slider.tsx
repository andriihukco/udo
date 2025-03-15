"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  className?: string;
  value?: number[];
  defaultValue?: number[];
  min: number;
  max: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    { className, value, defaultValue, min, max, step = 1, onValueChange },
    ref
  ) => {
    const [localValue, setLocalValue] = React.useState<number[]>(
      value || defaultValue || [min, max]
    );
    const trackRef = React.useRef<HTMLDivElement>(null);

    // Update local value when prop value changes
    React.useEffect(() => {
      if (value) {
        setLocalValue(value);
      }
    }, [value]);

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current || !onValueChange) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newValue = min + Math.round(((max - min) * percent) / step) * step;

      // Determine which thumb to move (closest to click)
      const distToLower = Math.abs(newValue - localValue[0]);
      const distToUpper = Math.abs(newValue - localValue[1]);

      const newValues = [...localValue];
      if (distToLower <= distToUpper) {
        newValues[0] = newValue;
      } else {
        newValues[1] = newValue;
      }

      // Ensure values are in order
      if (newValues[0] > newValues[1]) {
        [newValues[0], newValues[1]] = [newValues[1], newValues[0]];
      }

      setLocalValue(newValues);
      onValueChange(newValues);
    };

    const handleThumbDrag = (
      index: number,
      e: React.MouseEvent<HTMLDivElement>
    ) => {
      e.preventDefault();

      if (!trackRef.current || !onValueChange) return;

      const rect = trackRef.current.getBoundingClientRect();
      const thumbWidth = 20; // Approximate thumb width

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const percent = Math.max(
          0,
          Math.min(
            1,
            (moveEvent.clientX - rect.left - thumbWidth / 2) /
              (rect.width - thumbWidth)
          )
        );
        const newValue =
          min + Math.round(((max - min) * percent) / step) * step;

        const newValues = [...localValue];
        newValues[index] = newValue;

        // Ensure values are in order
        if (index === 0 && newValue > localValue[1]) {
          newValues[0] = localValue[1];
        } else if (index === 1 && newValue < localValue[0]) {
          newValues[1] = localValue[0];
        }

        setLocalValue(newValues);
        onValueChange(newValues);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    // Calculate positions
    const range = max - min;
    const leftPercent = ((localValue[0] - min) / range) * 100;
    const rightPercent = ((localValue[1] - min) / range) * 100;
    const rangeWidth = rightPercent - leftPercent;

    return (
      <div
        ref={ref}
        className={cn("relative h-10 w-full touch-none select-none", className)}
      >
        <div
          ref={trackRef}
          className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-secondary"
          onClick={handleTrackClick}
        >
          <div
            className="absolute h-full rounded-full bg-primary"
            style={{ left: `${leftPercent}%`, width: `${rangeWidth}%` }}
          />
        </div>

        {/* Left thumb */}
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background"
          style={{ left: `${leftPercent}%` }}
          onMouseDown={(e) => handleThumbDrag(0, e)}
        />

        {/* Right thumb */}
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background"
          style={{ left: `${rightPercent}%` }}
          onMouseDown={(e) => handleThumbDrag(1, e)}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";
