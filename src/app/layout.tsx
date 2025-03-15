"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider, useLocale } from "@/contexts/LocaleContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { PrintsProvider } from "@/contexts/PrintsContext";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// Simple fallback component
const Fallback = () => <div className="min-h-screen bg-background"></div>;

// Wrapper component to access locale context
function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  return (
    <html lang={locale} className="light">
      <head>
        {/* Add chunk error handling script */}
        <Script
          id="chunk-error-handler"
          src="/chunk-error-handler.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
        suppressHydrationWarning
      >
        <CartProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Fallback />}>
      <AuthProvider>
        <LocaleProvider>
          <CurrencyProvider>
            <UserProvider>
              <PrintsProvider>
                <RootLayoutContent>{children}</RootLayoutContent>
              </PrintsProvider>
            </UserProvider>
          </CurrencyProvider>
        </LocaleProvider>
      </AuthProvider>
    </Suspense>
  );
}
