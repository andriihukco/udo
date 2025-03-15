"use client";

import { useEffect, useState } from "react";
import {
  X,
  CreditCard,
  ShoppingBag,
  Check,
  AlertCircle,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/ui/cart-item";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Cart({ isOpen, onClose, className }: CartProps) {
  const { items, removeItem, updateQuantity, itemCount, total } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [promoMessage, setPromoMessage] = useState("");
  const [showPromoField, setShowPromoField] = useState(false);

  // Calculate shipping and totals
  const subtotal = total;
  const shipping = subtotal > 100 ? 0 : 10;
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal + shipping - discountAmount;

  // Handle promo code application
  const applyPromoCode = () => {
    // Reset status
    setPromoStatus("idle");
    setPromoMessage("");

    // Check if promo code matches the pattern CODE followed by numbers
    const promoRegex = /^CODE(\d{1,2})$/;
    const match = promoCode.match(promoRegex);

    if (match && match[1]) {
      const discountPercentage = parseInt(match[1], 10);
      if (discountPercentage > 0 && discountPercentage <= 99) {
        setDiscount(discountPercentage);
        setPromoStatus("success");
        setPromoMessage(`${discountPercentage}% discount applied!`);
        // Hide the promo field after successful application
        setShowPromoField(false);
      } else {
        setPromoStatus("error");
        setPromoMessage("Invalid discount percentage");
      }
    } else {
      setPromoStatus("error");
      setPromoMessage("Invalid promo code");
    }
  };

  // Toggle promo code field visibility
  const togglePromoField = () => {
    setShowPromoField(!showPromoField);
    if (showPromoField) {
      // Reset promo code when hiding the field
      setPromoCode("");
      setPromoStatus("idle");
      setPromoMessage("");
    }
  };

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-3/4 border-l sm:max-w-sm bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
      >
        <div className="flex items-center justify-between py-3 px-4 border-b">
          <div className="flex items-center">
            <TypographyH2 className="text-lg">
              Your Cart ({itemCount})
            </TypographyH2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Icon
                icon={ShoppingBag}
                size="large"
                className="text-gray-400 mb-4"
              />
              <TypographyH2 className="text-xl mb-2">
                Your cart is empty
              </TypographyH2>
              <TypographyP className="text-gray-500 mb-6 max-w-[250px]">
                Looks like you haven&apos;t added any items to your cart yet.
              </TypographyP>
              <Button variant="ios" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-border/60 py-2">
              {items.map((item) => (
                <CartItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image || ""}
                  color={item.color}
                  size={item.size}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-gradient-to-b from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900/10">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between font-medium pt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              {/* Promo Code Section */}
              {showPromoField ? (
                <div className="mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-800/30">
                  <div className="flex gap-2 mb-1">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 bg-white dark:bg-gray-800"
                    />
                    <Button
                      onClick={applyPromoCode}
                      variant="secondary"
                      className="shrink-0"
                    >
                      Apply
                    </Button>
                  </div>

                  {promoStatus === "error" && (
                    <div className="text-xs flex items-center text-red-600 dark:text-red-400 mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {promoMessage}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePromoField}
                    className="text-xs mt-1 h-auto py-1 px-2 text-muted-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  {discount > 0 && (
                    <div className="text-xs flex items-center text-green-600 dark:text-green-400 mt-1">
                      <Check className="h-3 w-3 mr-1" />
                      {promoMessage}
                    </div>
                  )}

                  {discount === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePromoField}
                      className="w-full mt-1 mb-1 text-sm flex items-center justify-center"
                    >
                      <Tag className="h-3.5 w-3.5 mr-2" />
                      Apply Promo Code
                    </Button>
                  )}
                </>
              )}

              <Link href="/checkout" onClick={onClose}>
                <Button variant="ios" size="lg" className="w-full mt-1">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
