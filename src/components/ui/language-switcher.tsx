"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className={locale === "en" ? "bg-accent" : ""}
        >
          <span className="mr-2">🇬🇧</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("uk")}
          className={locale === "uk" ? "bg-accent" : ""}
        >
          <span className="mr-2">🇺🇦</span>
          Українська
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("pl")}
          className={locale === "pl" ? "bg-accent" : ""}
        >
          <span className="mr-2">🇵🇱</span>
          Polski
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("jp")}
          className={locale === "jp" ? "bg-accent" : ""}
        >
          <span className="mr-2">🇯🇵</span>
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
