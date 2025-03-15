"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { QuantityCounter } from "@/components/ui/quantity-counter";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
  onRemove?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  className?: string;
}

export function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  color,
  size,
  onRemove,
  onUpdateQuantity,
  className,
}: CartItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [previousQuantity, setPreviousQuantity] = useState(quantity);

  const handleRemove = () => {
    if (onRemove) {
      setIsRemoved(true);
      // We don't immediately remove the item to allow for undo
    }
  };

  const handleUndo = () => {
    setIsRemoved(false);
    if (onUpdateQuantity) {
      onUpdateQuantity(id, previousQuantity);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (onUpdateQuantity) {
      if (newQuantity === 0) {
        // Store the previous quantity for potential undo
        setPreviousQuantity(quantity);
        setIsRemoved(true);
      } else if (newQuantity >= 1) {
        onUpdateQuantity(id, newQuantity);
      }
    }
  };

  // Actually remove the item after a delay if not undone
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isRemoved && onRemove) {
      timeoutId = setTimeout(() => {
        onRemove(id);
      }, 5000); // 5 seconds delay before actual removal
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isRemoved, onRemove, id]);

  // Helper function to get color display name
  const getColorName = (colorId?: string) => {
    if (!colorId) return null;

    const colorMap: Record<string, string> = {
      white: "White",
      black: "Black",
      gray: "Gray",
      blue: "Blue",
      red: "Red",
    };

    return colorMap[colorId] || colorId;
  };

  return (
    <div
      className={cn(
        "flex gap-3 py-3 border-b last:border-b-0 relative",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
        <AspectRatio ratio={1 / 1}>
          <Image src={image} alt={name} fill className="object-cover" />
        </AspectRatio>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-base line-clamp-1">{name}</h3>
            {(color || size) && (
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center flex-wrap gap-1">
                {color && (
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-1 border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                    <span>{getColorName(color)}</span>
                  </div>
                )}
                {color && size && <span className="mx-1">•</span>}
                {size && <span>Size: {size}</span>}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 rounded-full opacity-0 transition-opacity -mr-1 -mt-1",
              isHovered && "opacity-100"
            )}
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <QuantityCounter
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            size="sm"
            compact={true}
            min={0}
          />

          <div className="font-medium">${(price * quantity).toFixed(2)}</div>
        </div>
      </div>

      {/* Removed overlay */}
      {isRemoved && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-md">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Item removed
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            className="bg-white dark:bg-gray-800"
          >
            Undo
          </Button>
        </div>
      )}
    </div>
  );
}
