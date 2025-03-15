"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);

    // Check if it's a chunk loading error
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk") ||
      error.message.includes("failed") ||
      error.message.includes("timeout")
    ) {
      console.log(
        "Detected chunk loading error in global error boundary, attempting to recover..."
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
    <html lang="en" className="light">
      <head>
        <title>Something went wrong</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Chunk error handler script
              (function() {
                // Store original error handler
                var originalErrorHandler = window.onerror;
              
                // Custom error handler
                window.onerror = function(message, source, lineno, colno, error) {
                  // Check if it's a chunk loading error
                  if (error && (
                    error.name === 'ChunkLoadError' || 
                    message.includes('Loading chunk') || 
                    message.includes('failed') || 
                    message.includes('timeout')
                  )) {
                    console.log('Detected chunk loading error, attempting to recover...');
                    
                    // Clear cache in localStorage
                    try {
                      var keys = Object.keys(localStorage);
                      for (var i = 0; i < keys.length; i++) {
                        if (keys[i].startsWith('next-')) {
                          localStorage.removeItem(keys[i]);
                        }
                      }
                    } catch (e) {
                      console.error('Failed to clear localStorage cache:', e);
                    }
                    
                    // Try to reload the page after a short delay
                    setTimeout(function() {
                      console.log('Reloading page to recover from chunk loading error...');
                      window.location.reload(true); // Force reload from server
                    }, 1000);
                    
                    return true; // Error handled
                  }
                  
                  // Pass to original handler if not a chunk loading error
                  if (originalErrorHandler) {
                    return originalErrorHandler(message, source, lineno, colno, error);
                  }
                  
                  return false; // Not handled
                };
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="space-y-6 max-w-md">
            <h1 className="text-3xl font-bold tracking-tighter">
              Something went wrong!
            </h1>

            <p className="text-muted-foreground">
              {error.name === "ChunkLoadError" ||
              error.message.includes("Loading chunk") ||
              error.message.includes("failed") ||
              error.message.includes("timeout")
                ? "We had trouble loading some resources. This might be due to a network issue or a recent update."
                : "An unexpected error occurred. We've been notified and are working to fix the issue."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Refresh Page
              </button>

              <button
                onClick={() => reset()}
                className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
              >
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
