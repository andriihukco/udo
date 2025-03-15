"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loader({ size = "md", className }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex justify-center items-center w-full h-full min-h-[100px]">
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}

export function ButtonLoader({ className }: { className?: string }) {
  return <Loader size="sm" className={className} />;
}
