"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Cart } from "@/components/ui/cart";
import { useCart } from "@/contexts/CartContext";

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className }: CartButtonProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={openCart}
        className={cn("relative rounded-full", className)}
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Open cart</span>

        {itemCount > 0 && (
          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </div>
        )}
      </Button>

      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
