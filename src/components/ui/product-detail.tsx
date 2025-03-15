"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import {
  TypographyH1,
  TypographyH2,
  TypographyP,
} from "@/components/ui/typography";
import { QuantityCounter } from "@/components/ui/quantity-counter";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductVariant {
  id: string;
  name: string;
  available: boolean;
}

interface ProductDetailProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  colors?: ProductVariant[];
  sizes?: ProductVariant[];
  onAddToCart?: (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
}

export function ProductDetail({
  id,
  name,
  description,
  price,
  originalPrice,
  images,
  rating = 0,
  reviewCount = 0,
  isNew = false,
  isSale = false,
  colors = [],
  sizes = [],
  onAddToCart,
}: ProductDetailProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colors.length > 0 ? colors[0].id : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizes.length > 0 ? sizes[0].id : undefined
  );
  const [isWishlist, setIsWishlist] = useState(false);
  const { formatPrice } = useCurrency();

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id, quantity, selectedColor, selectedSize);
    }
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };

  return (
    <FadeIn className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SlideUp delay={0.1} className="space-y-4">
          <AspectRatio
            ratio={1}
            className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800"
          >
            <Image
              src={mainImage.url}
              alt={mainImage.alt}
              fill
              className="object-cover"
            />
            {(isNew || isSale) && (
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {isNew && (
                  <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                )}
                {isSale && <Badge variant="destructive">-{discount}%</Badge>}
              </div>
            )}
          </AspectRatio>

          <div className="grid grid-cols-5 gap-2">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => setMainImage(image)}
                className={cn(
                  "overflow-hidden rounded-xl border-2 transition-all",
                  mainImage.id === image.id
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-transparent"
                )}
              >
                <AspectRatio ratio={1} className="bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </AspectRatio>
              </button>
            ))}
          </div>
        </SlideUp>

        <SlideUp delay={0.2} className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {rating > 0 && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">
                      {rating.toFixed(1)}
                    </span>
                    {reviewCount > 0 && (
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        ({reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWishlist(!isWishlist)}
                className="rounded-full"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isWishlist ? "fill-red-500 text-red-500" : ""
                  )}
                />
              </Button>
            </div>

            <TypographyH1 className="mt-2">{name}</TypographyH1>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold">{formatPrice(price)}</span>
              {originalPrice && (
                <span className="text-lg text-gray-500 line-through dark:text-gray-400">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {isSale && discount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          <TypographyP>{description}</TypographyP>

          {colors.length > 0 && (
            <div>
              <TypographyH2 className="text-sm font-medium mb-2">
                Color
              </TypographyH2>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    disabled={!color.available}
                    className={cn(
                      "h-10 px-3 rounded-full border transition-all",
                      selectedColor === color.id
                        ? "border-blue-500 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700",
                      !color.available && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <TypographyH2 className="text-sm font-medium mb-2">
                Size
              </TypographyH2>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    disabled={!size.available}
                    className={cn(
                      "h-10 min-w-[40px] px-3 rounded-full border transition-all",
                      selectedSize === size.id
                        ? "border-blue-500 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700",
                      !size.available && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <TypographyH2 className="text-sm font-medium mb-2">
              Quantity
            </TypographyH2>
            <QuantityCounter
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              size="lg"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="ios"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Buy Now
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-sm">Free shipping over $50</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-sm">30-day returns</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-sm">2-year warranty</span>
            </div>
          </div>
        </SlideUp>
      </div>

      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
          >
            Reviews ({reviewCount})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-4">
          <TypographyP>{description}</TypographyP>
        </TabsContent>
        <TabsContent value="specifications" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Material</span>
                <span>Premium Quality</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Dimensions</span>
                <span>10 x 5 x 2 inches</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Weight</span>
                <span>0.5 kg</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Manufacturer</span>
                <span>Udo Druk</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Country of Origin</span>
                <span>Netherlands</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Warranty</span>
                <span>2 Years</span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-4">
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="ml-2 text-2xl font-bold">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">
              Based on {reviewCount} reviews
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-xl">
              <div className="flex justify-between mb-2">
                <div className="font-medium">John Doe</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < 5
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Verified Purchase
              </div>
              <TypographyP>
                Great product! Exactly as described and arrived quickly. Would
                definitely recommend.
              </TypographyP>
            </div>

            <div className="p-4 border rounded-xl">
              <div className="flex justify-between mb-2">
                <div className="font-medium">Jane Smith</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Verified Purchase
              </div>
              <TypographyP>
                Good quality for the price. Shipping was fast and the packaging
                was excellent.
              </TypographyP>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </FadeIn>
  );
}
