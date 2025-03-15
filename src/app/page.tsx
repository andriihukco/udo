"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyP,
  TypographyLead,
} from "@/components/ui/typography";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { ProductCard } from "@/components/ui/product-card";
import { Section, Grid } from "@/components/ui/section-fade";

// Banner slides data
const bannerSlides = [
  {
    id: 1,
    titleKey: "home.banner1Title",
    descriptionKey: "home.banner1Description",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    buttonTextKey: "home.shopNow",
    buttonLink: "/products",
  },
  {
    id: 2,
    titleKey: "home.banner2Title",
    descriptionKey: "home.banner2Description",
    image:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&auto=format&fit=crop&q=80",
    buttonTextKey: "home.explore",
    buttonLink: "/products/new",
  },
  {
    id: 3,
    titleKey: "home.banner3Title",
    descriptionKey: "home.banner3Description",
    image:
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1200&auto=format&fit=crop&q=80",
    buttonTextKey: "home.viewOffers",
    buttonLink: "/products/sale",
  },
];

// Featured products data
const productData = [
  {
    id: "1",
    name: "Premium T-Shirt",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHNoaXJ0fGVufDB8fDB8fHww",
    isNew: true,
    category: "clothing",
    brand: "Udo Design",
    materials: ["Cotton", "Polyester"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#ffffff" },
      { name: "Blue", value: "#0000ff" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "3",
    name: "Wireless Headphones",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
    isNew: true,
    category: "electronics",
    brand: "Udo Audio",
    materials: ["Plastic", "Metal", "Leather"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#c0c0c0" },
    ],
    sizes: ["One Size"],
  },
  {
    id: "7",
    name: "Backpack",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D",
    isNew: true,
    category: "accessories",
    brand: "Udo Travel",
    materials: ["Canvas", "Leather"],
    colors: [
      { name: "Brown", value: "#8B4513" },
      { name: "Black", value: "#000000" },
      { name: "Navy", value: "#000080" },
    ],
    sizes: ["Standard"],
  },
  {
    id: "4",
    name: "Smart Watch",
    price: 199.99,
    originalPrice: 249.99,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNtYXJ0JTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D",
    isSale: true,
    category: "electronics",
    brand: "Udo Tech",
    materials: ["Aluminum", "Silicone"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#c0c0c0" },
      { name: "Rose Gold", value: "#B76E79" },
    ],
    sizes: ["S", "M", "L"],
  },
];

export default function HomePage() {
  const { t } = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === bannerSlides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? bannerSlides.length - 1 : prev - 1
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Slider Banner */}
      <Section>
        <div className="relative h-[500px] overflow-hidden rounded-xl">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={slide.image}
                  alt={t(slide.titleKey)}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 text-white max-w-2xl">
                  <TypographyH1 className="text-white text-3xl md:text-4xl lg:text-5xl mb-4">
                    {t(slide.titleKey)}
                  </TypographyH1>
                  <TypographyP className="text-white/90 mb-8 text-lg">
                    {t(slide.descriptionKey)}
                  </TypographyP>
                  <div>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="bg-white text-gray-900 hover:bg-white/90 border-0"
                    >
                      <Link href={slide.buttonLink}>
                        {t(slide.buttonTextKey)}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation buttons - Grouped in bottom right corner */}
          <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white text-gray-800 border-0 shadow-md hover:bg-white/90"
              aria-label={t("common.previousSlide")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white text-gray-800 border-0 shadow-md hover:bg-white/90"
              aria-label={t("common.nextSlide")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={t("common.goToSlide", { slideNumber: index + 1 })}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Products Section */}
      <Section className="py-12 md:py-16" fadeDelay={200}>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-8">
          <div>
            <TypographyH2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("products.ourProducts")}
            </TypographyH2>
            <TypographyLead>{t("products.browseCollection")}</TypographyLead>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">{t("home.viewAll")}</Link>
          </Button>
        </div>
        <Grid
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8"
          staggerDelay={150}
        >
          {productData.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              isNew={product.isNew}
              isSale={product.isSale}
              onAddToCart={() => handleAddToCart(product.id)}
              materials={product.materials}
              colors={product.colors}
              sizes={product.sizes}
            />
          ))}
        </Grid>
      </Section>
    </div>
  );
}
