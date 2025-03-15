"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { SimplifiedAuthModal } from "@/components/ui/simplified-auth-modal";
import { ProductGrid } from "@/components/ui/product-grid";
import {
  TypographyH1,
  TypographyH3,
  TypographyP,
} from "@/components/ui/typography";
import { useUser } from "@/contexts/UserContext";

export default function FavoritesPage() {
  const { t } = useLocale();
  const { isAuthenticated } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mock favorite products - in a real app, this would come from your API
  const favoritedProducts = [
    {
      id: "1",
      name: "Minimalist Wooden Chair",
      price: 199.99,
      image: "/images/products/chair-1.jpg",
      rating: 4.5,
      category: "furniture",
      brand: "Udo Design",
      description: "A beautiful minimalist wooden chair for your home.",
      materials: ["Oak", "Leather"],
      colors: [
        { name: "Natural", value: "#D2B48C" },
        { name: "Black", value: "#000000" },
        { name: "Walnut", value: "#5C4033" },
      ],
      sizes: ["Standard"],
    },
    {
      id: "2",
      name: "Modern Coffee Table",
      price: 299.99,
      image: "/images/products/table-1.jpg",
      rating: 4.8,
      category: "furniture",
      brand: "Udo Design",
      description: "A sleek modern coffee table with storage.",
      materials: ["Oak", "Metal"],
      colors: [
        { name: "White", value: "#FFFFFF" },
        { name: "Black", value: "#000000" },
        { name: "Natural", value: "#D2B48C" },
      ],
      sizes: ["Small", "Large"],
    },
  ];

  useEffect(() => {
    // Show auth modal if user is not authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <TypographyH1>{t("common.favorites")}</TypographyH1>
      </div>

      {isAuthenticated ? (
        <>
          {favoritedProducts.length > 0 ? (
            <div className="space-y-8">
              <ProductGrid products={favoritedProducts} />
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <TypographyH3 className="mb-2">
                {t("favorites.noFavoritesYet")}
              </TypographyH3>
              <TypographyP className="text-muted-foreground">
                {t("favorites.startBrowsing")}
              </TypographyP>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <TypographyH3 className="mb-2">{t("auth.authRequired")}</TypographyH3>
          <TypographyP className="text-muted-foreground mb-4">
            {t("auth.pleaseSignIn")}
          </TypographyP>
        </div>
      )}

      <SimplifiedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
