"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, EnhancedInput } from "@/components/ui/input";
import { ProductCard } from "@/components/ui/product-card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { TypographyH2 } from "@/components/ui/typography";
import { useLocale } from "@/contexts/LocaleContext";

interface Product {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  category: string;
  brand?: string;
  materials?: string[];
  colors?: Array<{ name: string; value: string }>;
  sizes?: string[];
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  onAddToCart?: (id: string) => void;
  className?: string;
  hideFilters?: boolean;
}

export function ProductGrid({
  products,
  title,
  onAddToCart,
  className,
  hideFilters = false,
}: ProductGridProps) {
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Extract unique categories and brands
  const categories = [...new Set(products.map((product) => product.category))];
  const brands = [...new Set(products.map((product) => product.brand))];

  // Filter products based on search, categories, brands, and price
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSearchTerm("");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    searchTerm !== "";

  // Helper function to get product ID (either _id or id)
  const getProductId = (product: Product): string => {
    return product._id || product.id || "";
  };

  // Helper function to get product image (either image or first from images array)
  const getProductImage = (product: Product): string => {
    return (
      product.image ||
      (product.images && product.images.length > 0 ? product.images[0] : "")
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <TypographyH2 className="text-2xl font-bold">{title}</TypographyH2>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with filters - desktop */}
        {!hideFilters && (
          <div className="hidden md:block w-64 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">
                {t("products.categories")}
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <Checkbox
                      id={`category-desktop-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label
                      htmlFor={`category-desktop-${category}`}
                      className="ml-2 text-sm font-normal"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">
                {t("products.brands")}
              </h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <Checkbox
                      id={`brand-desktop-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => handleBrandChange(brand)}
                    />
                    <Label
                      htmlFor={`brand-desktop-${brand}`}
                      className="ml-2 text-sm font-normal"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">
                {t("products.priceRange")}
              </h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={priceRange[0]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-20"
                />
                <span>{t("products.to")}</span>
                <Input
                  type="number"
                  min={0}
                  value={priceRange[1]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-20"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                {t("products.clearFilters")}
              </Button>
            )}
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1">
          {/* Mobile/tablet search and filters */}
          {!hideFilters && (
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6 md:mb-4">
              <div className="relative w-full">
                <EnhancedInput
                  placeholder={t("products.searchProducts")}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  icon={<Search className="h-4 w-4" />}
                  clearable
                  onClear={() => setSearchTerm("")}
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {/* Mobile filter sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none md:hidden"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {t("products.filters")}
                      {hasActiveFilters && (
                        <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">
                          {selectedCategories.length +
                            selectedBrands.length +
                            (searchTerm ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>{t("products.filters")}</SheetTitle>
                      <SheetDescription>
                        {t("products.narrowDownProducts")}
                      </SheetDescription>
                    </SheetHeader>

                    <div className="py-4 space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-3">
                          {t("products.categories")}
                        </h3>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center">
                              <Checkbox
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() =>
                                  handleCategoryChange(category)
                                }
                              />
                              <Label
                                htmlFor={`category-${category}`}
                                className="ml-2 text-sm font-normal"
                              >
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium mb-3">
                          {t("products.brands")}
                        </h3>
                        <div className="space-y-2">
                          {brands.map((brand) => (
                            <div key={brand} className="flex items-center">
                              <Checkbox
                                id={`brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => handleBrandChange(brand)}
                              />
                              <Label
                                htmlFor={`brand-${brand}`}
                                className="ml-2 text-sm font-normal"
                              >
                                {brand}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium mb-3">
                          {t("products.priceRange")}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            value={priceRange[0]}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setPriceRange([
                                Number(e.target.value),
                                priceRange[1],
                              ])
                            }
                            className="w-24"
                          />
                          <span>{t("products.to")}</span>
                          <Input
                            type="number"
                            min={0}
                            value={priceRange[1]}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setPriceRange([
                                priceRange[0],
                                Number(e.target.value),
                              ])
                            }
                            className="w-24"
                          />
                        </div>
                      </div>
                    </div>

                    <SheetFooter>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={clearFilters}>
                          {t("products.clearFilters")}
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="glowing">
                          {t("products.applyFilters")}
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1 sm:flex-none sm:w-[180px]">
                    <SelectValue placeholder={t("products.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">
                      {t("products.featured")}
                    </SelectItem>
                    <SelectItem value="price-low-high">
                      {t("products.priceLowToHigh")}
                    </SelectItem>
                    <SelectItem value="price-high-low">
                      {t("products.priceHighToLow")}
                    </SelectItem>
                    <SelectItem value="newest">
                      {t("products.newest")}
                    </SelectItem>
                    <SelectItem value="rating">
                      {t("products.highestRated")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((category) => (
                <Badge
                  key={`cat-${category}`}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {category}
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
                  >
                    <span className="sr-only">{t("products.remove")}</span>×
                  </button>
                </Badge>
              ))}

              {selectedBrands.map((brand) => (
                <Badge
                  key={`brand-${brand}`}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {brand}
                  <button
                    onClick={() => handleBrandChange(brand)}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
                  >
                    <span className="sr-only">{t("products.remove")}</span>×
                  </button>
                </Badge>
              ))}

              {searchTerm && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {t("products.search")}: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
                  >
                    <span className="sr-only">{t("products.remove")}</span>×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Product grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <StaggerItem key={getProductId(product)}>
                <ProductCard
                  id={getProductId(product)}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={getProductImage(product)}
                  isNew={product.isNew}
                  isSale={product.isSale}
                  onAddToCart={
                    onAddToCart
                      ? () => onAddToCart(getProductId(product))
                      : undefined
                  }
                  materials={product.materials}
                  colors={product.colors}
                  sizes={product.sizes}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* No results */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">
                {t("products.noProductsFound")}
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                {t("products.clearFilters")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
