"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, DicesIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckingOut(true);
    // In a real app, we would redirect to checkout page
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 1000);
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <Icon
              icon={ShoppingBag}
              size="large"
              className="text-gray-400 mb-4"
            />
            <TypographyH2 className="text-xl mb-2">
              Your cart is empty
            </TypographyH2>
            <TypographyP className="text-gray-500 mb-6 max-w-md mx-auto">
              Looks like you haven&apos;t added any products to your cart yet.
            </TypographyP>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="ios" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>

              <Button variant="glowing" showGlow={true} asChild>
                <Link
                  href="/editor?surprise=true"
                  className="flex items-center"
                >
                  <Icon icon={DicesIcon} size="menu" className="mr-2" />
                  Surprise Me
                </Link>
              </Button>
            </div>

            <TypographyP className="mt-4 text-sm text-muted-foreground">
              The Surprise Me button will select random print and clothing
              variations in our builder
            </TypographyP>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">Items ({items.length})</h2>
            </div>

            <ul>
              {items.map((item) => (
                <li
                  key={item._id}
                  className="p-4 border-b last:border-b-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 dark:border-gray-700"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 bg-gray-100 rounded dark:bg-gray-700">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link
                      href={`/products/${item._id}`}
                      className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {item.name}
                    </Link>
                    <div className="text-gray-600 dark:text-gray-400">
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, parseInt(e.target.value))
                      }
                      className="mr-4 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      aria-label="Remove item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-4 border-t flex justify-between dark:border-gray-700">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear Cart
              </button>
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Shipping
                </span>
                <span>Calculated at checkout</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t pt-4 mt-4 dark:border-gray-700">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
