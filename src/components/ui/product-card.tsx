"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, ImagePlus } from "lucide-react";
import { cn, getLighterColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Scale } from "@/components/ui/motion";
import { useCart, CartItem } from "@/contexts/CartContext";
import { QuantityCounter } from "@/components/ui/quantity-counter";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductCardProps {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  isNew?: boolean;
  isSale?: boolean;
  className?: string;
  onAddToCart?: (id: string) => void;
  materials?: string[];
  colors?: Array<{ name: string; value: string }>;
  sizes?: string[];
}

export function ProductCard({
  id,
  _id,
  name,
  price,
  originalPrice,
  image,
  images,
  isNew = false,
  isSale = false,
  className,
  materials,
  colors = [],
  sizes = [],
}: ProductCardProps) {
  // Use either id or _id, with _id taking precedence
  const productId = _id || id || "";
  // Use either image or the first image from images array
  const productImage = image || (images && images.length > 0 ? images[0] : "");

  const [isWishlist, setIsWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    colors.length > 0 ? colors[0].value : ""
  );
  const [selectedSize, setSelectedSize] = useState(
    sizes.length > 0 ? sizes[0] : ""
  );
  const { addItem, removeItem, items } = useCart();
  const { formatPrice } = useCurrency();

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Check if item is already in cart
  const cartItem = items.find((item) => item._id === productId);
  const itemInCart = cartItem ? cartItem.quantity : 0;

  // Determine if this is a print or a product
  const isPrint =
    name.toLowerCase().includes("print") ||
    (materials && materials.includes("Print"));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newItem: CartItem = {
      _id: productId,
      name: name,
      price: price,
      image: productImage,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
    };

    addItem(newItem);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  const handleCustomize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/editor?product=${productId}`;
  };

  return (
    <Link href={`/products/${productId}`}>
      <Scale
        className={cn(
          "group overflow-hidden bg-white dark:bg-gray-900 transition-all duration-200",
          className
        )}
      >
        <div className="p-4">
          <div className="relative">
            <AspectRatio
              ratio={1 / 1}
              className="bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg"
            >
              <div className="w-full h-full overflow-hidden">
                <Image
                  src={productImage}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </AspectRatio>

            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
              <button
                onClick={handleWishlist}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isWishlist ? "fill-red-500 text-red-500" : ""
                  )}
                />
              </button>
            </div>

            {(isNew || isSale) && (
              <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                {isNew && (
                  <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                )}
                {isSale && <Badge variant="destructive">-{discount}%</Badge>}
              </div>
            )}
          </div>

          <div className="flex justify-between items-start mt-3">
            <div>
              <h3 className="line-clamp-2 text-base font-medium group-hover:underline">
                {name}
              </h3>

              {/* Materials display */}
              {materials && materials.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {materials.map((material) => (
                    <span
                      key={material}
                      className="inline-flex text-xs px-2 py-0.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-right flex-shrink-0">
              <span className="font-semibold">{formatPrice(price)}</span>
              {originalPrice && (
                <div className="text-sm text-gray-500 line-through dark:text-gray-400">
                  {formatPrice(originalPrice)}
                </div>
              )}
            </div>
          </div>

          {!isPrint && (
            <>
              {/* Color picker */}
              {colors.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">Color</div>
                  <div className="grid grid-cols-2 gap-1">
                    {colors.map((color) => (
                      <div
                        key={color.value}
                        className="flex items-center p-1.5 rounded-md cursor-pointer"
                        style={{
                          backgroundColor: getLighterColor(color.value, 0.1),
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedColor(color.value);
                        }}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border flex-shrink-0 transition-all",
                            selectedColor === color.value
                              ? "ring-2 ring-primary ring-offset-1"
                              : "ring-0"
                          )}
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="ml-1.5 text-xs truncate">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Size picker */}
              {sizes.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Size</div>
                  <div className="flex flex-wrap gap-1">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSize(size);
                        }}
                        className={cn(
                          "min-w-[2rem] h-6 px-2 text-xs rounded-full border transition-all",
                          selectedSize === size
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-gray-200 dark:border-gray-700"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2 mt-3">
            {itemInCart > 0 ? (
              <div className="flex-1" style={{ width: "calc(50% - 0.25rem)" }}>
                <QuantityCounter
                  quantity={quantity}
                  onQuantityChange={(newQuantity) => {
                    if (newQuantity === 0) {
                      removeItem(productId);
                    } else {
                      setQuantity(newQuantity);
                      // Update cart with new quantity
                      const newItem: CartItem = {
                        _id: productId,
                        name: name,
                        price: price,
                        image: productImage,
                        quantity: newQuantity,
                        color: selectedColor,
                        size: selectedSize,
                      };
                      addItem(newItem);
                    }
                  }}
                  min={0}
                  size="sm"
                  compact={true}
                  className="w-full"
                />
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                style={{ width: "calc(50% - 0.25rem)" }}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add
              </Button>
            )}

            {!isPrint && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                style={{ width: "calc(50% - 0.25rem)" }}
                onClick={handleCustomize}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Add Print
              </Button>
            )}
          </div>
        </div>
      </Scale>
    </Link>
  );
}
