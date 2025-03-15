"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconSize = "menu" | "large" | "default";

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon:
    | LucideIcon
    | React.ComponentType<{
        size?: number;
        strokeWidth?: number;
        className?: string;
      }>;
  size?: IconSize;
  className?: string;
}

const sizeConfig = {
  menu: {
    size: 24,
    strokeWidth: 1.5,
    className: "h-6 w-6", // 24px
  },
  large: {
    size: 64,
    strokeWidth: 1.25,
    className: "h-16 w-16", // 64px
  },
  default: {
    size: 20,
    strokeWidth: 2,
    className: "h-5 w-5", // 20px
  },
};

export function Icon({
  icon: IconComponent,
  size = "default",
  className,
  ...props
}: IconProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn(config.className, className)} {...props}>
      <IconComponent size={config.size} strokeWidth={config.strokeWidth} />
    </div>
  );
}
