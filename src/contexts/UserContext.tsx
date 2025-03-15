"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/use-toast";

// Define user types
export type UserRole = "user" | "admin" | "superadmin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Define the user type
interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Define context type
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkUserExists: (email: string) => Promise<boolean>;
  registerUser: (
    email: string,
    password: string,
    name?: string
  ) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  loginAsSuperadmin: () => boolean;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Export MOCK_USERS for use in auth.ts
export const MOCK_USERS: Record<string, MockUser> = {
  "admin@u-do.shop": {
    id: "1",
    name: "Admin User",
    email: "admin@u-do.shop",
    password: "admin123",
    role: "admin",
  },
  "marina@u-do.shop": {
    id: "2",
    name: "Marina",
    email: "marina@u-do.shop",
    password: "motherlord",
    role: "superadmin",
  },
  "user@example.com": {
    id: "3",
    name: "Regular User",
    email: "user@example.com",
    password: "password123",
    role: "user",
  },
};

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Check if a user with the given email exists
  const checkUserExists = async (email: string): Promise<boolean> => {
    // In a real app, this would be an API call
    console.log("checkUserExists called with:", email); // Debug log
    console.log("Email comparison:", email === "marina@u-do.shop"); // Debug log
    console.log("Available users:", Object.keys(MOCK_USERS)); // Debug log
    console.log("Direct lookup:", MOCK_USERS[email]); // Debug log

    return new Promise((resolve) => {
      setTimeout(() => {
        const exists =
          !!MOCK_USERS[email] ||
          Object.values(MOCK_USERS).some((u) => u.email === email);
        console.log("User exists result:", exists); // Debug log
        resolve(exists);
      }, 500);
    });
  };

  // Register a new user
  const registerUser = async (
    email: string,
    password: string,
    name?: string
  ): Promise<boolean> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        if (MOCK_USERS[email]) {
          toast({
            title: "Registration failed",
            description: "A user with this email already exists",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          name: name || email.split("@")[0],
          email,
          password,
          role: "user" as UserRole,
        };

        // Add to mock database
        MOCK_USERS[email] = newUser;

        // Set user in state and localStorage
        const userForState = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        };

        setUser(userForState);
        localStorage.setItem("user", JSON.stringify(userForState));

        toast({
          title: "Registration successful",
          description: `Welcome, ${newUser.name}!`,
        });

        resolve(true);
      }, 800);
    });
  };

  // Login a user
  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = MOCK_USERS[email];

        if (!mockUser || mockUser.password !== password) {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        // Set user in state and localStorage
        const userForState = {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        };

        setUser(userForState);
        localStorage.setItem("user", JSON.stringify(userForState));

        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });

        resolve(true);
      }, 800);
    });
  };

  // Logout a user
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Direct login for superadmin (for debugging purposes)
  const loginAsSuperadmin = () => {
    const superadmin = MOCK_USERS["marina@u-do.shop"];
    if (superadmin) {
      const userForState = {
        id: superadmin.id,
        name: superadmin.name,
        email: superadmin.email,
        role: superadmin.role,
      };

      setUser(userForState);
      localStorage.setItem("user", JSON.stringify(userForState));

      toast({
        title: "Superadmin Login",
        description: `Logged in as ${superadmin.name} (Superadmin)`,
      });

      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        checkUserExists,
        registerUser,
        loginUser,
        logoutUser,
        loginAsSuperadmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
