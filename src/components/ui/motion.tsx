"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// Fade in animation for page load only
export const FadeIn = ({
  children,
  className,
  delay = 0,
  duration = 0.3, // Faster animation
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Simplified SlideUp (no animation)
export const SlideUp = ({
  children,
  className,
  delay = 0,
  duration = 0.3,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number; // Kept for API compatibility but not used
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Simplified Scale (no animation)
export const Scale = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  whileHover?: Record<string, unknown>; // Kept for API compatibility but not used
  whileTap?: Record<string, unknown>; // Kept for API compatibility but not used
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
};

// Staggered container for page load only (no animations on children)
export const StaggerContainer = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Static wrapper (no animations) to replace StaggerItem
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn(className)}>{children}</div>;
};

// Simplified TiltCard (no animation)
export const TiltCard = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & HTMLMotionProps<"div">) => {
  return (
    <motion.div className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
};
