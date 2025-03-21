"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { cn, getLighterColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SheetClose,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { TypographyH2 } from "@/components/ui/typography";
import { useLocale } from "@/contexts/LocaleContext";
import { Slider } from "@/components/ui/slider";

// Define interface for filter objects
interface FilterItem {
  type: string;
  value: string;
  display: string;
  handleRemove: () => void;
  color?: string; // Optional color property for color filters
}

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
  showFilters?: boolean;
  showSort?: boolean;
  showSearch?: boolean;
  initialFilters?: {
    selectedCategories?: string[];
    selectedBrands?: string[];
    priceRange?: [number, number];
    isPrintable?: boolean;
    isOnSale?: boolean;
    selectedColors?: string[];
    selectedSizes?: string[];
    selectedMaterials?: string[];
  };
}

export function ProductGrid({
  products = [],
  title,
  onAddToCart,
  className,
  hideFilters = false,
  showFilters = true,
  showSort = true,
  showSearch = true,
  initialFilters = {},
}: ProductGridProps) {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.selectedCategories || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialFilters.selectedBrands || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters.priceRange || [0, 1000]
  );
  const [printableOnly, setPrintableOnly] = useState(
    initialFilters.isPrintable || false
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialFilters.selectedColors || []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialFilters.selectedSizes || []
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    initialFilters.selectedMaterials || []
  );
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Extract unique categories, brands, colors, and sizes
  const categories = [...new Set(products.map((product) => product.category))];

  // Extract all unique materials from products
  const allMaterials = products.reduce((acc: string[], product) => {
    if (product.materials && product.materials.length > 0) {
      product.materials.forEach((material) => {
        if (!acc.includes(material)) {
          acc.push(material);
        }
      });
    }
    return acc;
  }, []);

  // Extract all unique colors from products
  const allColors = products.reduce(
    (acc: Array<{ name: string; value: string }>, product) => {
      if (product.colors && product.colors.length > 0) {
        product.colors.forEach((color) => {
          if (!acc.some((c) => c.value === color.value)) {
            acc.push(color);
          }
        });
      }
      return acc;
    },
    []
  );

  // Extract all unique sizes from products
  const allSizes = products.reduce((acc: string[], product) => {
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach((size) => {
        if (!acc.includes(size)) {
          acc.push(size);
        }
      });
    }
    return acc;
  }, []);

  // Sort sizes in a logical order (S, M, L, XL, etc.)
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  allSizes.sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  // Filter products based on search, categories, brands, price, printable, on sale, colors, and sizes
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesBrand =
      selectedBrands.length === 0 ||
      (product.brand && selectedBrands.includes(product.brand));
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesPrintable =
      !printableOnly ||
      (product.materials && product.materials.includes("Print"));
    const matchesMaterials =
      selectedMaterials.length === 0 ||
      (product.materials &&
        product.materials.some((material) =>
          selectedMaterials.includes(material)
        ));

    // Check if product has any of the selected colors
    const matchesColors =
      selectedColors.length === 0 ||
      (product.colors &&
        product.colors.some((color) => selectedColors.includes(color.value)));

    // Check if product has any of the selected sizes
    const matchesSizes =
      selectedSizes.length === 0 ||
      (product.sizes &&
        product.sizes.some((size) => selectedSizes.includes(size)));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesPrintable &&
      matchesMaterials &&
      matchesColors &&
      matchesSizes
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleColorChange = (colorValue: string, checked: boolean) => {
    if (checked) {
      setSelectedColors((prev) => [...prev, colorValue]);
    } else {
      setSelectedColors((prev) => prev.filter((c) => c !== colorValue));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes((prev) => [...prev, size]);
    } else {
      setSelectedSizes((prev) => prev.filter((s) => s !== size));
    }
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials((prev) => [...prev, material]);
    } else {
      setSelectedMaterials((prev) => prev.filter((m) => m !== material));
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setPrintableOnly(false);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    searchQuery !== "" ||
    printableOnly ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedMaterials.length > 0;

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

  // Create a function to get all active filters
  const getAllActiveFilters = (): FilterItem[] => {
    return [
      ...selectedCategories.map((category) => ({
        type: "category",
        value: category,
        display: category,
        handleRemove: () => handleCategoryChange(category, false),
      })),
      ...selectedBrands.map((brand) => ({
        type: "brand",
        value: brand,
        display: brand,
        handleRemove: () => handleBrandChange(brand),
      })),
      ...selectedMaterials.map((material) => ({
        type: "material",
        value: material,
        display: material,
        handleRemove: () => handleMaterialChange(material, false),
      })),
      ...(printableOnly
        ? [
            {
              type: "printable",
              value: "printable",
              display: t("products.printable"),
              handleRemove: () => setPrintableOnly(false),
            },
          ]
        : []),
      ...selectedColors.map((colorValue) => {
        const colorName =
          allColors.find((c) => c.value === colorValue)?.name || colorValue;
        return {
          type: "color",
          value: colorValue,
          display: colorName,
          color: colorValue,
          handleRemove: () => handleColorChange(colorValue, false),
        };
      }),
      ...selectedSizes.map((size) => ({
        type: "size",
        value: size,
        display: `${t("products.size")}: ${size}`,
        handleRemove: () => handleSizeChange(size, false),
      })),
      ...(searchQuery
        ? [
            {
              type: "search",
              value: searchQuery,
              display: `${t("products.search")}: ${searchQuery}`,
              handleRemove: () => setSearchQuery(""),
            },
          ]
        : []),
    ];
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile filter sheet */}
      <Sheet>
        <div className="flex items-center justify-between mb-4 md:hidden">
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 rounded-full">
              <Filter className="mr-2 h-4 w-4" />
              {t("products.filters.title")}
            </Button>
          </SheetTrigger>

          {showSort && (
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value)}
            >
              <SelectTrigger className="w-[180px] h-10 rounded-full">
                <SelectValue placeholder={t("products.sort.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">
                  {t("products.sort.featured")}
                </SelectItem>
                <SelectItem value="newest">
                  {t("products.sort.newest")}
                </SelectItem>
                <SelectItem value="priceAsc">
                  {t("products.sort.priceAsc")}
                </SelectItem>
                <SelectItem value="priceDesc">
                  {t("products.sort.priceDesc")}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>{t("products.filters.title")}</SheetTitle>
            <SheetDescription>
              {t("products.filters.description")}
            </SheetDescription>
          </SheetHeader>

          <div className="py-4 space-y-6">
            {/* Printable filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {t("products.filters.printable")}
                </h3>
                <Switch
                  checked={printableOnly}
                  onCheckedChange={setPrintableOnly}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("products.filters.printableDescription")}
              </p>
            </div>

            {/* Categories filter */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {t("products.filters.categories")}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        handleCategoryChange(category, !!checked);
                      }}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials filter */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {t("products.filters.materials")}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {allMaterials.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={`material-${material}`}
                      checked={selectedMaterials.includes(material)}
                      onCheckedChange={(checked) => {
                        handleMaterialChange(material, !!checked);
                      }}
                    />
                    <Label
                      htmlFor={`material-${material}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-4">
                {t("products.colors")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {allColors.map((color) => (
                  <div
                    key={color.value}
                    className="flex items-center p-3 rounded-md cursor-pointer"
                    style={{
                      backgroundColor: getLighterColor(color.value, 0.1),
                    }}
                    onClick={() => handleColorChange(color.value, true)}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full border flex-shrink-0 transition-all",
                        selectedColors.includes(color.value)
                          ? "ring-2 ring-primary ring-offset-2"
                          : "ring-0"
                      )}
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="ml-3 text-sm truncate">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Picker */}
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-4">
                {t("products.sizes")}
              </h3>
              <div className="flex flex-wrap gap-3">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size, true)}
                    className={cn(
                      "min-w-[48px] h-12 px-3 border rounded-md text-base",
                      selectedSizes.includes(size)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input hover:bg-accent"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range with Slider */}
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-4">
                {t("products.priceRange")}
              </h3>

              {/* Price histogram with slider */}
              <div className="mb-4">
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={1000}
                  step={10}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(value: number[]) =>
                    setPriceRange([value[0], value[1]])
                  }
                  className="mb-4"
                />

                {/* Price histogram visualization */}
                <div className="h-12 bg-accent/20 rounded-md relative mb-4">
                  {/* Simplified histogram bars - just for visual effect */}
                  <div className="absolute inset-0 flex items-end px-1">
                    {Array.from({ length: 10 }).map((_, i: number) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/30 mx-0.5 rounded-t-sm"
                        style={{
                          height: `${20 + Math.random() * 80}%`,
                          opacity:
                            priceRange[0] <= i * 100 && i * 100 <= priceRange[1]
                              ? 1
                              : 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Input
                    type="number"
                    min={0}
                    value={priceRange[0]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-24 h-12 text-base"
                  />
                  <span className="text-base mx-2">{t("products.to")}</span>
                  <Input
                    type="number"
                    min={0}
                    value={priceRange[1]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-24 h-12 text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with filters - desktop */}
        {!hideFilters && (
          <div className="hidden md:block w-64 space-y-8">
            <div className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto pr-4 pb-6">
              {/* Reset filters button - only visible when filters are active */}
              {hasActiveFilters && (
                <div className="sticky top-0 z-10 bg-background pt-1 pb-5">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full mb-2 py-6 text-base"
                  >
                    {t("products.clearFilters")}
                  </Button>
                </div>
              )}

              {/* Printable Switch - Simplified */}
              <div className="flex items-center justify-between py-2">
                <h3 className="text-base font-medium">
                  {t("products.printable")}
                </h3>
                <Switch
                  checked={printableOnly}
                  onCheckedChange={setPrintableOnly}
                  id="printable-desktop"
                  className="scale-125"
                />
              </div>

              {/* Categories - Now with larger heading */}
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">
                  {t("products.categories")}
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center py-1">
                      <Checkbox
                        id={`category-desktop-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category, checked)
                        }
                        className="h-5 w-5"
                      />
                      <Label
                        htmlFor={`category-desktop-${category}`}
                        className="ml-3 text-base font-normal cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials - Now with larger heading */}
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">
                  {t("products.materials")}
                </h3>
                <div className="space-y-3">
                  {allMaterials.map((material) => (
                    <div key={material} className="flex items-center py-1">
                      <Checkbox
                        id={`material-desktop-${material}`}
                        checked={selectedMaterials.includes(material)}
                        onCheckedChange={(checked) =>
                          handleMaterialChange(material, checked)
                        }
                        className="h-5 w-5"
                      />
                      <Label
                        htmlFor={`material-desktop-${material}`}
                        className="ml-3 text-base font-normal cursor-pointer"
                      >
                        {material}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">
                  {t("products.colors")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {allColors.map((color) => (
                    <div
                      key={color.value}
                      className="flex items-center p-3 rounded-md cursor-pointer"
                      style={{
                        backgroundColor: getLighterColor(color.value, 0.1),
                      }}
                      onClick={() => handleColorChange(color.value, true)}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full border flex-shrink-0 transition-all",
                          selectedColors.includes(color.value)
                            ? "ring-2 ring-primary ring-offset-2"
                            : "ring-0"
                        )}
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="ml-3 text-sm truncate">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Picker */}
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">
                  {t("products.sizes")}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size, true)}
                      className={cn(
                        "min-w-[48px] h-10 px-3 border rounded-md text-base",
                        selectedSizes.includes(size)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-input hover:bg-accent"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range with Slider */}
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">
                  {t("products.priceRange")}
                </h3>

                {/* Price histogram with slider */}
                <div className="mb-4">
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    min={0}
                    max={1000}
                    step={10}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={(value: number[]) =>
                      setPriceRange([value[0], value[1]])
                    }
                    className="mb-4"
                  />

                  {/* Price histogram visualization */}
                  <div className="h-12 bg-accent/20 rounded-md relative mb-4">
                    {/* Simplified histogram bars - just for visual effect */}
                    <div className="absolute inset-0 flex items-end px-1">
                      {Array.from({ length: 10 }).map((_, i: number) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/30 mx-0.5 rounded-t-sm"
                          style={{
                            height: `${20 + Math.random() * 80}%`,
                            opacity:
                              priceRange[0] <= i * 100 &&
                              i * 100 <= priceRange[1]
                                ? 1
                                : 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      min={0}
                      value={priceRange[0]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-24 h-12 text-base"
                    />
                    <span className="text-base mx-2">{t("products.to")}</span>
                    <Input
                      type="number"
                      min={0}
                      value={priceRange[1]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-24 h-12 text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1">
          {/* Mobile/tablet search and filters */}
          {!hideFilters && (
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6 md:mb-4">
              <div className="flex gap-2 w-full sm:w-auto">
                {/* Mobile filter sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none md:hidden rounded-full h-10 text-base"
                    >
                      <Filter className="h-5 w-5 mr-2" />
                      {t("products.filters")}
                      {hasActiveFilters && (
                        <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">
                          {selectedCategories.length +
                            selectedBrands.length +
                            (searchQuery ? 1 : 0) +
                            (printableOnly ? 1 : 0) +
                            selectedColors.length +
                            selectedSizes.length +
                            selectedMaterials.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[85vh] p-0">
                    <div className="flex flex-col h-full">
                      <SheetHeader className="px-4 py-3 border-b">
                        <SheetTitle>{t("products.filters")}</SheetTitle>
                        <SheetDescription>
                          {t("products.narrowDownProducts")}
                        </SheetDescription>
                      </SheetHeader>

                      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
                        {/* Printable Switch - Simplified for mobile */}
                        <div className="flex items-center justify-between py-2">
                          <h3 className="text-base font-medium">
                            {t("products.printable")}
                          </h3>
                          <Switch
                            checked={printableOnly}
                            onCheckedChange={setPrintableOnly}
                            id="printable-mobile"
                            className="scale-125"
                          />
                        </div>

                        {/* Categories - Now with larger heading */}
                        <div className="pt-2">
                          <h3 className="text-lg font-medium mb-4">
                            {t("products.categories")}
                          </h3>
                          <div className="space-y-3">
                            {categories.map((category) => (
                              <div
                                key={category}
                                className="flex items-center py-1"
                              >
                                <Checkbox
                                  id={`category-${category}`}
                                  checked={selectedCategories.includes(
                                    category
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleCategoryChange(category, checked)
                                  }
                                  className="h-5 w-5"
                                />
                                <Label
                                  htmlFor={`category-${category}`}
                                  className="ml-3 text-base font-normal cursor-pointer"
                                >
                                  {category}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Materials - Now with larger heading */}
                        <div className="pt-2">
                          <h3 className="text-lg font-medium mb-4">
                            {t("products.materials")}
                          </h3>
                          <div className="space-y-3">
                            {allMaterials.map((material) => (
                              <div
                                key={material}
                                className="flex items-center py-1"
                              >
                                <Checkbox
                                  id={`material-${material}`}
                                  checked={selectedMaterials.includes(material)}
                                  onCheckedChange={(checked) =>
                                    handleMaterialChange(material, checked)
                                  }
                                  className="h-5 w-5"
                                />
                                <Label
                                  htmlFor={`material-${material}`}
                                  className="ml-3 text-base font-normal cursor-pointer"
                                >
                                  {material}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Color Picker with labels */}
                        <div className="pt-2">
                          <h3 className="text-lg font-medium mb-4">
                            {t("products.colors")}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {allColors.map((color) => (
                              <div
                                key={color.value}
                                className="flex items-center p-3 rounded-md cursor-pointer"
                                style={{
                                  backgroundColor: getLighterColor(
                                    color.value,
                                    0.1
                                  ),
                                }}
                                onClick={() =>
                                  handleColorChange(color.value, true)
                                }
                              >
                                <div
                                  className={cn(
                                    "w-7 h-7 rounded-full border flex-shrink-0 transition-all",
                                    selectedColors.includes(color.value)
                                      ? "ring-2 ring-primary ring-offset-2"
                                      : "ring-0"
                                  )}
                                  style={{ backgroundColor: color.value }}
                                />
                                <span className="ml-3 text-sm truncate">
                                  {color.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Size Picker */}
                        <div className="pt-2">
                          <h3 className="text-lg font-medium mb-4">
                            {t("products.sizes")}
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {allSizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeChange(size, true)}
                                className={cn(
                                  "min-w-[48px] h-12 px-3 border rounded-md text-base",
                                  selectedSizes.includes(size)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background border-input hover:bg-accent"
                                )}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Price Range with Slider */}
                        <div className="pt-2">
                          <h3 className="text-lg font-medium mb-4">
                            {t("products.priceRange")}
                          </h3>

                          {/* Price histogram with slider for mobile */}
                          <div className="mb-4">
                            <Slider
                              defaultValue={[priceRange[0], priceRange[1]]}
                              min={0}
                              max={1000}
                              step={10}
                              value={[priceRange[0], priceRange[1]]}
                              onValueChange={(value: number[]) =>
                                setPriceRange([value[0], value[1]])
                              }
                              className="mb-4"
                            />

                            {/* Price histogram visualization */}
                            <div className="h-12 bg-accent/20 rounded-md relative mb-4">
                              {/* Simplified histogram bars - just for visual effect */}
                              <div className="absolute inset-0 flex items-end px-1">
                                {Array.from({ length: 10 }).map(
                                  (_, i: number) => (
                                    <div
                                      key={i}
                                      className="flex-1 bg-primary/30 mx-0.5 rounded-t-sm"
                                      style={{
                                        height: `${20 + Math.random() * 80}%`,
                                        opacity:
                                          priceRange[0] <= i * 100 &&
                                          i * 100 <= priceRange[1]
                                            ? 1
                                            : 0.3,
                                      }}
                                    />
                                  )
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
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
                                className="w-24 h-12 text-base"
                              />
                              <span className="text-base mx-2">
                                {t("products.to")}
                              </span>
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
                                className="w-24 h-12 text-base"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fixed bottom action area */}
                      <div className="border-t p-4 bg-background">
                        <div className="flex gap-2">
                          <SheetClose asChild>
                            <Button
                              variant="outline"
                              onClick={clearFilters}
                              className="flex-1 h-12 text-base"
                            >
                              {t("products.clearFilters")}
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button
                              variant="default"
                              className="flex-1 h-12 text-base"
                            >
                              {t("products.applyFilters")} (
                              {filteredProducts.length})
                            </Button>
                          </SheetClose>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Updated sort select to match height of Clear Filters button */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="flex-1 sm:flex-none sm:w-[180px] h-10 rounded-full text-base">
                    <SelectValue placeholder={t("products.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">
                      {t("products.featured")}
                    </SelectItem>
                    <SelectItem value="priceAsc">
                      {t("products.priceLowToHigh")}
                    </SelectItem>
                    <SelectItem value="priceDesc">
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
            <div className="flex flex-wrap gap-3 mb-4 items-center">
              {/* Clear Filters button - now first in the filter chips row */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-10 px-4 py-2 text-base"
              >
                {t("products.clearFilters")}
              </Button>

              {/* Get all active filters */}
              {(() => {
                const allActiveFilters = getAllActiveFilters();

                // Determine which filters to show
                const filtersToShow = showAllFilters
                  ? allActiveFilters
                  : allActiveFilters.slice(0, 5);

                return (
                  <>
                    {filtersToShow.map((filter: FilterItem) => (
                      <Badge
                        key={`${filter.type}-${filter.value}`}
                        variant="outline"
                        className="flex items-center gap-1 px-3 py-2 text-base"
                      >
                        {filter.type === "color" && (
                          <span
                            className="inline-block w-4 h-4 rounded-full mr-1"
                            style={{ backgroundColor: filter.color }}
                          ></span>
                        )}
                        {filter.display}
                        <button
                          onClick={filter.handleRemove}
                          className="ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-5 w-5 inline-flex items-center justify-center"
                        >
                          <span className="sr-only">
                            {t("products.remove")}
                          </span>
                          ×
                        </button>
                      </Badge>
                    ))}

                    {/* Show "View more" button if there are more than 5 filters */}
                    {allActiveFilters.length > 5 && (
                      <Button
                        variant="ghost"
                        onClick={() => setShowAllFilters(!showAllFilters)}
                        className="h-10 px-3 py-2 text-base"
                      >
                        {showAllFilters
                          ? t("products.showLess")
                          : `${t("products.viewMore")} (${
                              allActiveFilters.length - 5
                            })`}
                      </Button>
                    )}
                  </>
                );
              })()}
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
