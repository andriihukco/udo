"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Product, getProductById, getProductImage } from "@/lib/product-utils";
import { useCurrency } from "@/contexts/CurrencyContext";

// Simple skeleton component for loading states
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    />
  );
}

export default function ProductPage() {
  const params = useParams();
  const { formatPrice } = useCurrency();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Try to fetch from API first
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);

        // Fallback to sample data
        const sampleProduct = getProductById(id);

        if (sampleProduct) {
          setProduct(sampleProduct);
          setUsingSampleData(true);
        } else {
          setError("Product not found");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert className="mb-6 bg-red-50 border-red-200">
          <InfoIcon className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-700">Error</AlertTitle>
          <AlertDescription className="text-red-600">
            {error || "Product not found"}
          </AlertDescription>
        </Alert>
        <Link href="/products" className="text-blue-600 hover:underline">
          &larr; Back to products
        </Link>
      </div>
    );
  }

  const productImage = getProductImage(product);

  return (
    <div className="container mx-auto px-4 py-6">
      {usingSampleData && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Using Sample Data</AlertTitle>
          <AlertDescription className="text-blue-600">
            This product is using sample data as the API request failed. In a
            production environment, this would be fetched from a database.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {productImage ? (
            <div className="relative aspect-square">
              <Image
                src={productImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center aspect-square text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="text-2xl font-bold text-blue-600 mb-4">
            {formatPrice(product.price)}
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full ${
                product.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p>{product.description || "No description available."}</p>
          </div>

          {/* Additional details would go here */}
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
