"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/use-toast";

// Define Print interface
export interface Print {
  id: string;
  name: string;
  description: string;
  svgUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Define context type
interface PrintsContextType {
  prints: Print[];
  isLoading: boolean;
  addPrint: (
    print: Omit<Print, "id" | "createdAt" | "updatedAt">
  ) => Promise<Print>;
  updatePrint: (id: string, print: Partial<Print>) => Promise<Print | null>;
  deletePrint: (id: string) => Promise<boolean>;
  getPrintById: (id: string) => Print | undefined;
}

// Create context
const PrintsContext = createContext<PrintsContextType | undefined>(undefined);

// Initial mock data
const INITIAL_PRINTS: Print[] = [
  {
    id: "1",
    name: "Abstract Pattern",
    description: "Modern abstract pattern for t-shirts",
    svgUrl: "/prints/abstract-pattern.svg",
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 6, 20).toISOString(),
  },
  {
    id: "2",
    name: "Mountain Landscape",
    description: "Minimalist mountain landscape design",
    svgUrl: "/prints/mountain.svg",
    createdAt: new Date(2023, 4, 10).toISOString(),
    updatedAt: new Date(2023, 4, 10).toISOString(),
  },
  {
    id: "3",
    name: "Geometric Shapes",
    description: "Collection of geometric shapes and patterns",
    svgUrl: "/prints/geometric.svg",
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 7, 12).toISOString(),
  },
];

// Provider component
export function PrintsProvider({ children }: { children: ReactNode }) {
  const [prints, setPrints] = useState<Print[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load prints from localStorage on mount
  useEffect(() => {
    const loadPrints = () => {
      try {
        const storedPrints = localStorage.getItem("prints");
        if (storedPrints) {
          setPrints(JSON.parse(storedPrints));
        } else {
          // Initialize with default prints if none exist
          setPrints(INITIAL_PRINTS);
          localStorage.setItem("prints", JSON.stringify(INITIAL_PRINTS));
        }
      } catch (error) {
        console.error("Failed to load prints:", error);
        setPrints(INITIAL_PRINTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrints();
  }, []);

  // Save prints to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("prints", JSON.stringify(prints));
    }
  }, [prints, isLoading]);

  // Add a new print
  const addPrint = async (
    printData: Omit<Print, "id" | "createdAt" | "updatedAt">
  ): Promise<Print> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPrint: Print = {
          ...printData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPrints((prevPrints) => [...prevPrints, newPrint]);

        toast({
          title: "Success",
          description: "New print created successfully",
        });

        resolve(newPrint);
      }, 500);
    });
  };

  // Update an existing print
  const updatePrint = async (
    id: string,
    printData: Partial<Print>
  ): Promise<Print | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let updatedPrint: Print | null = null;

        setPrints((prevPrints) => {
          const updated = prevPrints.map((p) => {
            if (p.id === id) {
              updatedPrint = {
                ...p,
                ...printData,
                updatedAt: new Date().toISOString(),
              };
              return updatedPrint;
            }
            return p;
          });

          return updated;
        });

        if (updatedPrint) {
          toast({
            title: "Success",
            description: "Print updated successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Print not found",
            variant: "destructive",
          });
        }

        resolve(updatedPrint);
      }, 500);
    });
  };

  // Delete a print
  const deletePrint = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const printExists = prints.some((p) => p.id === id);

        if (printExists) {
          setPrints((prevPrints) => prevPrints.filter((p) => p.id !== id));

          toast({
            title: "Success",
            description: "Print deleted successfully",
          });

          resolve(true);
        } else {
          toast({
            title: "Error",
            description: "Print not found",
            variant: "destructive",
          });

          resolve(false);
        }
      }, 500);
    });
  };

  // Get a print by ID
  const getPrintById = (id: string): Print | undefined => {
    return prints.find((p) => p.id === id);
  };

  return (
    <PrintsContext.Provider
      value={{
        prints,
        isLoading,
        addPrint,
        updatePrint,
        deletePrint,
        getPrintById,
      }}
    >
      {children}
    </PrintsContext.Provider>
  );
}

// Custom hook to use the context
export function usePrints() {
  const context = useContext(PrintsContext);
  if (context === undefined) {
    throw new Error("usePrints must be used within a PrintsProvider");
  }
  return context;
}
