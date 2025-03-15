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

/**
 * Creates a lighter version of a hex color
 * @param hexColor - The hex color to lighten (e.g. "#ff0000")
 * @param opacity - The opacity level (0-1) to apply
 * @returns A rgba color string with the specified opacity
 */
export function getLighterColor(hexColor: string, opacity: number = 0.1): string {
  // Handle shorthand hex colors (#fff -> #ffffff)
  if (hexColor.length === 4) {
    hexColor = `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`;
  }
  
  // Extract RGB components
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
