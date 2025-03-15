"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocale } from "./LocaleContext";

// Define currency type
export type Currency = "USD" | "EUR" | "UAH";

// Define exchange rates (relative to USD)
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93, // 1 USD = 0.93 EUR
  UAH: 38.5, // 1 USD = 38.5 UAH
};

// Define currency context type
interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
  getCurrencySymbol: () => string;
}

// Create context with default values
const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  formatPrice: () => "",
  convertPrice: () => 0,
  getCurrencySymbol: () => "$",
});

// Custom hook to use currency context
export const useCurrency = () => useContext(CurrencyContext);

// Currency provider component
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [mounted, setMounted] = useState(false);
  const { t } = useLocale();

  // After mounting, we can access localStorage
  useEffect(() => {
    setMounted(true);

    // Load saved currency preference
    const savedCurrency = localStorage.getItem("currency") as Currency;
    if (savedCurrency && ["USD", "EUR", "UAH"].includes(savedCurrency)) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("currency", currency);
    }
  }, [currency, mounted]);

  // Get currency symbol
  const getCurrencySymbol = (): string => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "UAH":
        return "₴";
      default:
        return "$";
    }
  };

  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * EXCHANGE_RATES[currency];
  };

  // Format price with currency symbol
  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = convertPrice(priceInUSD);
    return `${getCurrencySymbol()}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}
