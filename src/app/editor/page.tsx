"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shirt,
  Palette,
  Ruler,
  Type,
  Check,
  Eye,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useCart, CartItem } from "@/contexts/CartContext";

// Define the steps in the customization flow
type Step = "clothing" | "print";
type MobileView = "preview" | "config";

// Define the clothing options
const clothingOptions = [
  {
    id: "t-shirt",
    name: "T-Shirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHNoaXJ0fGVufDB8fDB8fHww",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9vZGllfGVufDB8fDB8fHww",
  },
  {
    id: "sweatshirt",
    name: "Sweatshirt",
    image:
      "https://images.unsplash.com/photo-1572495641004-28421ae29ed4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3dlYXRzaGlydHxlbnwwfHwwfHx8MA%3D%3D",
  },
];

// Define the color options
const colorOptions = [
  { id: "white", name: "White", value: "#ffffff" },
  { id: "black", name: "Black", value: "#000000" },
  { id: "gray", name: "Gray", value: "#808080" },
  { id: "blue", name: "Blue", value: "#0000ff" },
  { id: "red", name: "Red", value: "#ff0000" },
];

// Define the size options
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

// Define the print options
const printOptions = [
  {
    id: "udo-logo",
    name: "Udo Logo",
    text: "UDO DRUK",
    preview: "UDO DRUK",
    image: "https://placehold.co/200x100/333/white?text=UDO+DRUK",
  },
  {
    id: "premium",
    name: "Premium",
    text: "PREMIUM QUALITY",
    preview: "PREMIUM QUALITY",
    image: "https://placehold.co/200x100/333/white?text=PREMIUM",
  },
  {
    id: "original",
    name: "Original",
    text: "ORIGINAL",
    preview: "ORIGINAL",
    image: "https://placehold.co/200x100/333/white?text=ORIGINAL",
  },
  {
    id: "est-2023",
    name: "Est. 2023",
    text: "ESTABLISHED 2023",
    preview: "EST. 2023",
    image: "https://placehold.co/200x100/333/white?text=EST.2023",
  },
  {
    id: "limited",
    name: "Limited Edition",
    text: "LIMITED EDITION",
    preview: "LIMITED EDITION",
    image: "https://placehold.co/200x100/333/white?text=LIMITED",
  },
];

// Define the print positions
const printPositions = [
  { id: "center", name: "Center" },
  { id: "left-chest", name: "Left Chest" },
  { id: "right-chest", name: "Right Chest" },
  { id: "back", name: "Back" },
];

interface FormData {
  // Clothing options
  clothingType: string;
  clothingColor: string;
  clothingSize: string;

  // Print options
  printOption: string;
  printColor: string;
  printSize: string;
  printPosition: string;
}

export default function EditorPage() {
  const [currentStep, setCurrentStep] = useState<Step>("clothing");
  const [showingBack, setShowingBack] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [mobileView, setMobileView] = useState<"preview" | "config">("preview");
  const printSliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  // Get product info from URL parameters
  const productId = searchParams.get("product");
  const initialColor = searchParams.get("color") || "black";
  const initialSize = searchParams.get("size") || "M";
  const initialPrintOption = searchParams.get("printOption") || "udo-logo";
  const isSurpriseMode = searchParams.get("surprise") === "true";

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    clothingType: productId || "t-shirt",
    clothingColor: initialColor,
    clothingSize: initialSize,
    printOption: initialPrintOption,
    printColor: "white",
    printSize: "M",
    printPosition: "center",
  });

  // Initialize with random selections if in surprise mode or move to print step if print option is provided
  useEffect(() => {
    if (isSurpriseMode) {
      // Get random items from each array
      const randomClothingType =
        clothingOptions[Math.floor(Math.random() * clothingOptions.length)].id;
      const randomClothingColor =
        colorOptions[Math.floor(Math.random() * colorOptions.length)].id;
      const randomClothingSize =
        sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
      const randomPrintOption =
        printOptions[Math.floor(Math.random() * printOptions.length)].id;
      const randomPrintColor =
        colorOptions[Math.floor(Math.random() * colorOptions.length)].id;
      const randomPrintSize = ["S", "M", "L", "XL"][
        Math.floor(Math.random() * 4)
      ];
      const randomPrintPosition =
        printPositions[Math.floor(Math.random() * printPositions.length)].id;

      // Set the random form data
      setFormData({
        clothingType: randomClothingType,
        clothingColor: randomClothingColor,
        clothingSize: randomClothingSize,
        printOption: randomPrintOption,
        printColor: randomPrintColor,
        printSize: randomPrintSize,
        printPosition: randomPrintPosition,
      });

      // Show a toast notification
      toast({
        title: "Surprise Mode Activated!",
        description:
          "We've randomly selected a design for you. Feel free to customize it further!",
        duration: 5000,
      });

      // Move to the print step to show the complete design
      setCurrentStep("print");
    } else if (initialPrintOption && initialPrintOption !== "udo-logo") {
      // If a specific print option was selected, move to the print step
      setCurrentStep("print");

      // Show a toast notification
      toast({
        title: "Print Selected",
        description:
          "Your selected print has been applied. You can now customize it further.",
        duration: 3000,
      });
    }
  }, [isSurpriseMode, initialPrintOption]);

  // Get the selected clothing item
  const selectedClothing = clothingOptions.find(
    (item) => item.id === formData.clothingType
  );

  // Get the selected print option
  const selectedPrint = printOptions.find(
    (option) => option.id === formData.printOption
  );

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFlipView = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowingBack(!showingBack);
      setIsFlipping(false);
    }, 300);
  };

  const handleNextStep = () => {
    if (currentStep === "clothing") {
      setCurrentStep("print");
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "print") {
      setCurrentStep("clothing");
    }
  };

  const handleSave = () => {
    // Create a new cart item
    const selectedClothing = clothingOptions.find(
      (c) => c.id === formData.clothingType
    );

    const selectedPrint = printOptions.find(
      (p) => p.id === formData.printOption
    );

    if (!selectedClothing || !selectedPrint) return;

    // Create a custom product
    const customProduct: CartItem = {
      _id: `custom-${Date.now()}`,
      name: `Custom ${selectedClothing.name} with ${selectedPrint.name} Print`,
      price: 39.99, // Example price
      image: selectedClothing.image,
      quantity: 1,
      color: formData.clothingColor,
      size: formData.clothingSize,
    };

    // Add to cart using the cart context
    addItem(customProduct);

    // Show success message and redirect
    toast({
      title: "Product added to cart!",
      description: "Your customized product has been added to the cart.",
      action: (
        <ToastAction altText="View Cart" onClick={() => router.push("/cart")}>
          View Cart
        </ToastAction>
      ),
    });

    // Redirect to cart after a short delay
    setTimeout(() => {
      router.push("/cart");
    }, 1500);
  };

  const toggleMobileView = (view: MobileView) => {
    setMobileView(view);
  };

  const scrollPrintSlider = (direction: "left" | "right") => {
    if (printSliderRef.current) {
      const scrollAmount = 200; // Adjust as needed
      const currentScroll = printSliderRef.current.scrollLeft;
      printSliderRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-center bg-background/60 backdrop-blur-[2px]">
        {/* Mobile View Toggle - Only visible on mobile */}
        <div className="md:hidden flex space-x-2 rounded-full p-1 bg-muted">
          <Button
            variant={mobileView === "preview" ? "default" : "ghost"}
            size="sm"
            className="rounded-full px-3 h-8"
            onClick={() => toggleMobileView("preview")}
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            variant={mobileView === "config" ? "default" : "ghost"}
            size="sm"
            className="rounded-full px-3 h-8"
            onClick={() => toggleMobileView("config")}
          >
            <Settings className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>

        {/* Close Button - Right Side */}
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Link>
        </Button>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden pt-16">
        {/* Preview Area - Left Side */}
        <div
          className={cn(
            "w-full md:w-1/2 bg-muted p-6 overflow-auto flex flex-col",
            mobileView !== "preview" && "hidden md:flex"
          )}
        >
          <div className="flex justify-between mb-4">
            <span className="text-sm font-medium">
              {showingBack ? "Back View" : "Front View"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFlipView}
              disabled={isFlipping}
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Flip View
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div
              className={cn(
                "relative w-full max-w-md aspect-[3/4] bg-background rounded-lg shadow-lg overflow-hidden",
                isFlipping && "transition-transform duration-300",
                isFlipping && (showingBack ? "scale-x-0" : "scale-x-0")
              )}
            >
              {/* Clothing Preview */}
              {selectedClothing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative w-full h-full"
                    style={{
                      backgroundColor:
                        formData.clothingColor === "white"
                          ? "#f8f8f8"
                          : colorOptions.find(
                              (c) => c.id === formData.clothingColor
                            )?.value,
                    }}
                  >
                    <Image
                      src={selectedClothing.image}
                      alt={selectedClothing.name}
                      fill
                      className="object-contain mix-blend-multiply"
                    />

                    {/* Print Preview */}
                    {selectedPrint && (
                      <div
                        className={cn(
                          "absolute transform -translate-x-1/2 -translate-y-1/2 text-center font-bold",
                          formData.printPosition === "center" &&
                            !showingBack &&
                            "left-1/2 top-1/2",
                          formData.printPosition === "left-chest" &&
                            !showingBack &&
                            "left-[30%] top-[30%]",
                          formData.printPosition === "right-chest" &&
                            !showingBack &&
                            "left-[70%] top-[30%]",
                          formData.printPosition === "back" &&
                            showingBack &&
                            "left-1/2 top-1/2",
                          formData.printSize === "S" && "text-sm",
                          formData.printSize === "M" && "text-base",
                          formData.printSize === "L" && "text-lg",
                          formData.printSize === "XL" && "text-xl"
                        )}
                        style={{
                          color: colorOptions.find(
                            (c) => c.id === formData.printColor
                          )?.value,
                          display:
                            (formData.printPosition === "back" &&
                              !showingBack) ||
                            (formData.printPosition !== "back" && showingBack)
                              ? "none"
                              : "block",
                        }}
                      >
                        {selectedPrint.preview}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Flip Button - Only visible on mobile in preview mode */}
          <div className="mt-4 md:hidden flex justify-center">
            <Button
              variant="outline"
              onClick={handleFlipView}
              disabled={isFlipping}
              className="w-full max-w-xs"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              {showingBack ? "Show Front" : "Show Back"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {currentStep === "clothing"
                ? "Select your clothing type, color, and size"
                : "Customize your print design, color, size, and position"}
            </p>
          </div>
        </div>

        {/* Form Area - Right Side */}
        <div
          className={cn(
            "w-full md:w-1/2 flex flex-col h-full",
            mobileView !== "config" && "hidden md:flex"
          )}
        >
          <div className="flex-1 p-4 md:p-6 overflow-auto pb-24 md:pb-6">
            {/* Step Indicator - More Compact */}
            <div className="flex items-center mb-4 md:mb-6 mt-2 md:mt-0">
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-medium",
                  currentStep === "clothing"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                1
              </div>
              <div className="h-px flex-1 mx-2 bg-border"></div>
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-medium",
                  currentStep === "print"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                2
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === "clothing" && (
                <motion.div
                  key="clothing-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 md:space-y-6"
                >
                  <h1 className="text-xl md:text-2xl font-bold flex items-center">
                    <Shirt className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                    Select Clothing
                  </h1>

                  {/* Clothing Type */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-medium">Clothing Type</label>
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {clothingOptions.map((option) => (
                        <div
                          key={option.id}
                          className={cn(
                            "relative cursor-pointer rounded-lg overflow-hidden border-2 aspect-square",
                            formData.clothingType === option.id
                              ? "border-primary"
                              : "border-transparent hover:border-muted-foreground/30"
                          )}
                          onClick={() =>
                            handleSelectChange("clothingType", option.id)
                          }
                        >
                          <Image
                            src={option.image}
                            alt={option.name}
                            fill
                            className="object-cover"
                          />
                          {formData.clothingType === option.id && (
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                            {option.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clothing Color */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      Color
                    </label>
                    <div className="grid grid-cols-5 gap-2 md:gap-3">
                      {colorOptions.map((color) => (
                        <div
                          key={color.id}
                          className="flex flex-col items-center space-y-1"
                          onClick={() =>
                            handleSelectChange("clothingColor", color.id)
                          }
                        >
                          <div
                            className={cn(
                              "w-7 h-7 md:w-8 md:h-8 rounded-full cursor-pointer border-2",
                              formData.clothingColor === color.id
                                ? "border-primary"
                                : "border-transparent hover:border-muted-foreground/30"
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {formData.clothingColor === color.id && (
                              <div className="flex items-center justify-center h-full">
                                <Check
                                  className={cn(
                                    "h-3 w-3 md:h-4 md:w-4",
                                    color.id === "white"
                                      ? "text-black"
                                      : "text-white"
                                  )}
                                />
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-center">
                            {color.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clothing Size */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Ruler className="mr-2 h-4 w-4" />
                      Size
                    </label>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={cn(
                            "px-2 py-1 md:px-3 md:py-1 border rounded-md text-xs md:text-sm",
                            formData.clothingSize === size
                              ? "bg-primary text-white border-primary"
                              : "bg-background border-input hover:bg-accent"
                          )}
                          onClick={() =>
                            handleSelectChange("clothingSize", size)
                          }
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === "print" && (
                <motion.div
                  key="print-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 md:space-y-6"
                >
                  <h1 className="text-xl md:text-2xl font-bold flex items-center">
                    <Type className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                    Customize Print
                  </h1>

                  {/* Print Options - Horizontal Slider */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        Print Design
                      </label>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white text-gray-800 border-0 shadow-md hover:bg-white/90"
                          onClick={() => scrollPrintSlider("left")}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white text-gray-800 border-0 shadow-md hover:bg-white/90"
                          onClick={() => scrollPrintSlider("right")}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div
                      className="flex overflow-x-auto pb-2 hide-scrollbar"
                      ref={printSliderRef}
                    >
                      <div className="flex space-x-3">
                        {printOptions.map((option) => (
                          <div
                            key={option.id}
                            className={cn(
                              "flex-shrink-0 w-32 cursor-pointer",
                              "flex flex-col items-center"
                            )}
                            onClick={() =>
                              handleSelectChange("printOption", option.id)
                            }
                          >
                            <div
                              className={cn(
                                "relative w-full aspect-[2/1] rounded-md overflow-hidden border-2 mb-1",
                                formData.printOption === option.id
                                  ? "border-primary"
                                  : "border-transparent hover:border-muted-foreground/30"
                              )}
                            >
                              <Image
                                src={option.image}
                                alt={option.name}
                                fill
                                className="object-cover"
                              />
                              {formData.printOption === option.id && (
                                <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-center font-medium">
                              {option.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Print Color */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      Print Color
                    </label>
                    <div className="grid grid-cols-5 gap-2 md:gap-3">
                      {colorOptions.map((color) => (
                        <div
                          key={color.id}
                          className="flex flex-col items-center space-y-1"
                          onClick={() =>
                            handleSelectChange("printColor", color.id)
                          }
                        >
                          <div
                            className={cn(
                              "w-7 h-7 md:w-8 md:h-8 rounded-full cursor-pointer border-2",
                              formData.printColor === color.id
                                ? "border-primary"
                                : "border-transparent hover:border-muted-foreground/30"
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {formData.printColor === color.id && (
                              <div className="flex items-center justify-center h-full">
                                <Check
                                  className={cn(
                                    "h-3 w-3 md:h-4 md:w-4",
                                    color.id === "white"
                                      ? "text-black"
                                      : "text-white"
                                  )}
                                />
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-center">
                            {color.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Print Size */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-medium flex items-center">
                      <Ruler className="mr-2 h-4 w-4" />
                      Print Size
                    </label>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {["S", "M", "L", "XL"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={cn(
                            "px-2 py-1 md:px-3 md:py-1 border rounded-md text-xs md:text-sm",
                            formData.printSize === size
                              ? "bg-primary text-white border-primary"
                              : "bg-background border-input hover:bg-accent"
                          )}
                          onClick={() => handleSelectChange("printSize", size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Print Position */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-medium">
                      Print Position
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {printPositions.map((position) => (
                        <button
                          key={position.id}
                          type="button"
                          className={cn(
                            "px-2 py-1 md:px-3 md:py-2 border rounded-md text-xs md:text-sm",
                            formData.printPosition === position.id
                              ? "bg-primary text-white border-primary"
                              : "bg-background border-input hover:bg-accent"
                          )}
                          onClick={() =>
                            handleSelectChange("printPosition", position.id)
                          }
                        >
                          {position.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tip: Use the &quot;Flip View&quot; button to see how your
                      print looks on both sides.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fixed Footer with Actions */}
          <div className="fixed bottom-0 left-0 right-0 md:static border-t border-border p-3 md:p-4 bg-background">
            <div className="flex justify-between max-w-md mx-auto md:max-w-none">
              {currentStep === "clothing" ? (
                <Button variant="ghost" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={handlePrevStep}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}

              {currentStep === "print" ? (
                <Button variant="glowing" showGlow={true} onClick={handleSave}>
                  Add to Cart
                </Button>
              ) : (
                <Button variant="default" onClick={handleNextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
