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
import { ThemeProvider } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

// Wrapper component to access locale context
function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  return (
    <html lang={locale} className="light">
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
    <AuthProvider>
      <LocaleProvider>
        <CurrencyProvider>
          <UserProvider>
            <PrintsProvider>
              <ThemeProvider>
                <RootLayoutContent>{children}</RootLayoutContent>
              </ThemeProvider>
            </PrintsProvider>
          </UserProvider>
        </CurrencyProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}
