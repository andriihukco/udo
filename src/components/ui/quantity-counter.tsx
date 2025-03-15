"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityCounterProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  compact?: boolean;
}

export function QuantityCounter({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = "md",
  className,
  compact = false,
}: QuantityCounterProps) {
  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "h-7 w-7",
      icon: "h-3 w-3",
      text: "text-sm",
      width: "w-7",
    },
    md: {
      button: "h-9 w-9",
      icon: "h-4 w-4",
      text: "text-base",
      width: "w-9",
    },
    lg: {
      button: "h-10 w-10",
      icon: "h-5 w-5",
      text: "text-base",
      width: "w-12",
    },
  };

  // If compact is true, use a different layout
  if (compact) {
    return (
      <div className={cn("flex items-center border rounded-full", className)}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(sizeConfig[size].button, "rounded-full")}
          onClick={handleDecrement}
          disabled={quantity <= min}
        >
          <Minus className={sizeConfig[size].icon} />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <span
          className={cn(
            sizeConfig[size].width,
            "text-center",
            sizeConfig[size].text
          )}
        >
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className={cn(sizeConfig[size].button, "rounded-full")}
          onClick={handleIncrement}
          disabled={quantity >= max}
        >
          <Plus className={sizeConfig[size].icon} />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
    );
  }

  // Standard layout
  return (
    <div className={cn("flex items-center", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={cn(sizeConfig[size].button, "rounded-full")}
      >
        <Minus className={sizeConfig[size].icon} />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <span
        className={cn(
          sizeConfig[size].width,
          "text-center",
          sizeConfig[size].text
        )}
      >
        {quantity}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={cn(sizeConfig[size].button, "rounded-full")}
      >
        <Plus className={sizeConfig[size].icon} />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
