import { sampleProducts } from "@/app/products/page";

export interface Product {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  category: string;
  brand: string;
  inStock?: boolean;
  colors?: Array<{ name: string; value: string }>;
  sizes?: string[];
  materials?: string[];
}

/**
 * Get a product by ID from sample data
 */
export function getProductById(id: string): Product | undefined {
  return sampleProducts.find(product => product._id === id);
}

/**
 * Get the product ID (handles both _id and id formats)
 */
export function getProductId(product: Product): string {
  return product._id || product.id || "";
}

/**
 * Get the product image (handles both image and images formats)
 */
export function getProductImage(product: Product): string {
  if (product.image) {
    return product.image;
  }
  
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  
  return "";
} 