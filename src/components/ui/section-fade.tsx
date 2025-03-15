"use client";

import React from "react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
  fadeDelay?: number;
  fadeDuration?: number;
}

export function Section({
  children,
  className,
  stagger = false,
  staggerDelay = 100,
  fadeDelay = 0,
  fadeDuration = 600,
  ...props
}: SectionProps) {
  if (stagger) {
    return (
      <div className={cn("py-8", className)} {...props}>
        <FadeInStagger
          staggerDelay={staggerDelay}
          duration={fadeDuration}
          delay={fadeDelay}
        >
          {children}
        </FadeInStagger>
      </div>
    );
  }

  return (
    <FadeIn
      className={cn("py-8", className)}
      duration={fadeDuration}
      delay={fadeDelay}
      {...props}
    >
      {children}
    </FadeIn>
  );
}

// Card component with fade-in animation
export function Card({
  children,
  className,
  fadeDelay = 0,
  fadeDuration = 600,
  ...props
}: SectionProps) {
  return (
    <FadeIn
      className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}
      duration={fadeDuration}
      delay={fadeDelay}
      {...props}
    >
      {children}
    </FadeIn>
  );
}

// Grid component with staggered fade-in for children
export function Grid({
  children,
  className,
  staggerDelay = 100,
  fadeDelay = 0,
  fadeDuration = 600,
  ...props
}: SectionProps) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <FadeInStagger
        staggerDelay={staggerDelay}
        duration={fadeDuration}
        delay={fadeDelay}
      >
        {children}
      </FadeInStagger>
    </div>
  );
}
