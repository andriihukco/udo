"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);

    // Check if it's a chunk loading error
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk") ||
      error.message.includes("failed") ||
      error.message.includes("timeout")
    ) {
      console.log(
        "Detected chunk loading error in error boundary, attempting to recover..."
      );

      // Clear cache in localStorage
      try {
        const keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].startsWith("next-")) {
            localStorage.removeItem(keys[i]);
          }
        }
      } catch (e) {
        console.error("Failed to clear localStorage cache:", e);
      }
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-3xl font-bold tracking-tighter">
          {t("error.title") || "Something went wrong!"}
        </h1>

        <p className="text-muted-foreground">
          {error.name === "ChunkLoadError" ||
          error.message.includes("Loading chunk") ||
          error.message.includes("failed") ||
          error.message.includes("timeout")
            ? t("error.chunkLoad") ||
              "We had trouble loading some resources. This might be due to a network issue or a recent update."
            : t("error.generic") ||
              "An unexpected error occurred. We've been notified and are working to fix the issue."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.reload()} variant="default">
            {t("error.refresh") || "Refresh Page"}
          </Button>

          <Button onClick={() => reset()} variant="outline">
            {t("error.tryAgain") || "Try Again"}
          </Button>

          <Button onClick={() => (window.location.href = "/")} variant="ghost">
            {t("error.goHome") || "Go to Homepage"}
          </Button>
        </div>
      </div>
    </div>
  );
}
