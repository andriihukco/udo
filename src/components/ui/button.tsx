"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:opacity-90 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:opacity-90 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        ios: "bg-primary text-white hover:bg-primary/90 active:scale-95 shadow-sm",
        primary:
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 active:scale-95 relative overflow-hidden",
        success:
          "bg-gradient-to-r from-green-500 to-emerald-700 text-white hover:opacity-90 active:scale-95 relative overflow-hidden",
        glowing:
          "bg-gradient-to-r from-indigo-700 to-indigo-800 text-white hover:opacity-90 active:scale-95 relative overflow-hidden",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10 p-0 aspect-square",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  showGlow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, showGlow = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // If it's not a glowing variant, render a regular button
    if (
      !variant ||
      !["primary", "success", "glowing"].includes(variant) ||
      !showGlow
    ) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    // For glowing variants, render with the blink animation
    // Using a more efficient animation approach
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:animate-shine"
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
