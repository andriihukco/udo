"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/ui/product-grid";
import { FadeIn } from "@/components/ui/motion";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";
import { useLocale } from "@/contexts/LocaleContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Sample product data
export const sampleProducts = [
  {
    _id: "1",
    name: "Premium T-Shirt",
    description:
      "High-quality cotton t-shirt with a modern fit. Perfect for everyday wear and special occasions.",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHNoaXJ0fGVufDB8fDB8fHww",
    ],
    rating: 4.5,
    reviewCount: 120,
    isNew: true,
    isSale: true,
    category: "Clothing",
    brand: "FashionBrand",
    inStock: true,
    materials: ["Cotton", "Polyester"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#ffffff" },
      { name: "Blue", value: "#0000ff" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    _id: "2",
    name: "Slim Fit Jeans",
    description:
      "Classic slim fit jeans with a modern touch. These jeans are designed for comfort and style.",
    price: 59.99,
    originalPrice: 79.99,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVhbnN8ZW58MHx8MHx8fDA%3D",
    ],
    rating: 4.2,
    reviewCount: 85,
    isNew: false,
    isSale: true,
    category: "Clothing",
    brand: "DenimCo",
    inStock: true,
    materials: ["Denim", "Cotton"],
    colors: [
      { name: "Blue", value: "#0000ff" },
      { name: "Black", value: "#000000" },
      { name: "Gray", value: "#808080" },
    ],
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    _id: "3",
    name: "Wireless Headphones",
    description:
      "Premium wireless headphones with noise cancellation technology. Enjoy crystal clear sound.",
    price: 129.99,
    originalPrice: 149.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
    ],
    rating: 4.8,
    reviewCount: 230,
    isNew: true,
    isSale: false,
    category: "Electronics",
    brand: "AudioTech",
    inStock: true,
    materials: ["Plastic", "Metal", "Leather"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#ffffff" },
      { name: "Red", value: "#ff0000" },
    ],
    sizes: ["One Size"],
  },
  {
    _id: "4",
    name: "Smart Watch",
    description:
      "Feature-packed smartwatch with health monitoring, notifications, and a sleek design.",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2h8ZW58MHx8MHx8fDA%3D",
    ],
    rating: 4.6,
    reviewCount: 175,
    isNew: false,
    isSale: true,
    category: "Electronics",
    brand: "TechGear",
    inStock: true,
    materials: ["Aluminum", "Glass", "Silicone"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#c0c0c0" },
      { name: "Gold", value: "#ffd700" },
    ],
    sizes: ["S", "M", "L"],
  },
  {
    _id: "5",
    name: "Running Shoes",
    description:
      "Lightweight and comfortable running shoes designed for performance and support.",
    price: 89.99,
    originalPrice: 109.99,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D",
    ],
    rating: 4.4,
    reviewCount: 150,
    isNew: false,
    isSale: true,
    category: "Footwear",
    brand: "SportyFeet",
    inStock: true,
    materials: ["Mesh", "Rubber", "Synthetic"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#ffffff" },
      { name: "Red", value: "#ff0000" },
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    _id: "6",
    name: "Leather Wallet",
    description:
      "Handcrafted leather wallet with multiple card slots and a sleek design.",
    price: 49.99,
    originalPrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbGV0fGVufDB8fDB8fHww",
    ],
    rating: 4.3,
    reviewCount: 95,
    isNew: false,
    isSale: false,
    category: "Accessories",
    brand: "LeatherCraft",
    inStock: true,
    materials: ["Leather", "Metal"],
    colors: [
      { name: "Brown", value: "#8B4513" },
      { name: "Black", value: "#000000" },
      { name: "Tan", value: "#D2B48C" },
    ],
    sizes: ["One Size"],
  },
  {
    _id: "7",
    name: "Backpack",
    description:
      "Durable and stylish backpack with multiple compartments for all your essentials.",
    price: 79.99,
    originalPrice: 99.99,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja3BhY2t8ZW58MHx8MHx8fDA%3D",
    ],
    rating: 4.7,
    reviewCount: 210,
    isNew: true,
    isSale: true,
    category: "Accessories",
    brand: "TravelGear",
    inStock: true,
    materials: ["Canvas", "Leather", "Nylon"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Navy", value: "#000080" },
      { name: "Green", value: "#008000" },
    ],
    sizes: ["One Size"],
  },
  {
    _id: "8",
    name: "Sunglasses",
    description:
      "Stylish sunglasses with UV protection. Perfect for sunny days and outdoor activities.",
    price: 129.99,
    originalPrice: 149.99,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D",
    ],
    rating: 4.5,
    reviewCount: 120,
    isNew: false,
    isSale: false,
    category: "Accessories",
    brand: "SunStyle",
    inStock: true,
    materials: ["Metal", "Plastic", "Glass"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Gold", value: "#ffd700" },
      { name: "Silver", value: "#c0c0c0" },
    ],
    sizes: ["One Size"],
  },
];

export default function ProductsPage() {
  const { t } = useLocale();
  const [usingSampleData] = useState(true);

  const handleAddToCart = (id: string) => {
    console.log(`Added product ${id} to cart`);
  };

  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <TypographyH1>{t("products.ourProducts")}</TypographyH1>
          <TypographyLead>{t("products.browseCollection")}</TypographyLead>
        </div>

        {usingSampleData && (
          <Alert className="mb-6 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Using sample data</AlertTitle>
            <AlertDescription>
              The database connection is currently unavailable. Showing sample
              product data instead.
            </AlertDescription>
          </Alert>
        )}

        <ProductGrid products={sampleProducts} onAddToCart={handleAddToCart} />
      </div>
    </FadeIn>
  );
}
