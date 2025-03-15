"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeBanner() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-[72px] left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border h-8 flex items-center justify-center shadow-sm">
      <div className="flex items-center gap-2">
        <Sun
          className={cn(
            "h-3 w-3",
            theme === "light" ? "text-amber-500" : "text-muted-foreground"
          )}
        />
        <Switch
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
          className="h-4 w-7"
        />
        <Moon
          className={cn(
            "h-3 w-3",
            theme === "dark" ? "text-indigo-400" : "text-muted-foreground"
          )}
        />
      </div>
    </div>
  );
}
