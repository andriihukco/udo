"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { usePrints } from "@/contexts/PrintsContext";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyP,
} from "@/components/ui/typography";

export default function PrintsPage() {
  const { t } = useLocale();
  const { prints, isLoading } = usePrints();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter prints based on search query
  const filteredPrints = prints.filter(
    (print) =>
      print.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      print.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <TypographyH1 className="mb-4">
          {t("prints.title") || "Our Prints Collection"}
        </TypographyH1>
        <TypographyP className="max-w-2xl mx-auto">
          {t("prints.description") ||
            "Browse our collection of high-quality prints available for your custom products."}
        </TypographyP>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t("prints.searchPlaceholder") || "Search prints..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Prints grid */}
      {filteredPrints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrints.map((print) => (
            <div
              key={print.id}
              className="bg-background border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-64 bg-muted flex items-center justify-center p-4">
                {print.svgUrl.startsWith("/") ||
                print.svgUrl.startsWith("http") ? (
                  <img
                    src={print.svgUrl}
                    alt={print.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div
                    className="max-h-full max-w-full object-contain"
                    dangerouslySetInnerHTML={{ __html: print.svgUrl }}
                  />
                )}
              </div>
              <div className="p-4">
                <TypographyH2 className="text-xl mb-2">
                  {print.name}
                </TypographyH2>
                <TypographyP className="text-muted-foreground mb-4 line-clamp-2">
                  {print.description}
                </TypographyP>
                <Button variant="outline" className="w-full">
                  {t("prints.useThisPrint") || "Use This Print"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TypographyH2 className="text-xl mb-2">
            {t("prints.noResults") || "No prints found"}
          </TypographyH2>
          <TypographyP className="text-muted-foreground">
            {t("prints.tryDifferentSearch") ||
              "Try a different search term or browse all prints."}
          </TypographyP>
          {searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              {t("prints.clearSearch") || "Clear Search"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
