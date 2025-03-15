import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Animation utility for slow appearing elements
export const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: "easeInOut" }
};

// Animation utility for staggered children animations
export const staggerContainer = (staggerChildren: number = 0.1) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren
    }
  }
});
