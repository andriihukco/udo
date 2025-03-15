"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/use-toast";
import { signIn, signOut, useSession } from "next-auth/react";

// Define user types
export type UserRole = "user" | "admin" | "superadmin";

export interface User {
  id: string;
  name: string;
  email: string;
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
  loginAsSuperadmin: () => Promise<boolean>;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update user state when session changes
  useEffect(() => {
    if (session && session.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user.role as UserRole) || "user",
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }

    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session, status]);

  // Check if a user with the given email exists
  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/users/check?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      return false;
    }
  };

  // Register a new user
  const registerUser = async (
    email: string,
    password: string,
    name?: string
  ): Promise<boolean> => {
    try {
      // First check if user exists
      const exists = await checkUserExists(email);
      if (exists) {
        toast({
          title: "Registration failed",
          description: "A user with this email already exists",
          variant: "destructive",
        });
        return false;
      }

      // Register the user
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name: name || email.split("@")[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // Log the user in
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Registration successful",
        description: `Welcome, ${name || email.split("@")[0]}!`,
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Login a user
  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout a user
  const logoutUser = () => {
    signOut({ redirect: false });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Direct login for superadmin (for debugging purposes)
  const loginAsSuperadmin = async (): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: process.env.DEFAULT_ADMIN_EMAIL || "m@u-do.store",
        password: process.env.DEFAULT_ADMIN_PASSWORD || "motherlord",
      });

      if (result?.error) {
        toast({
          title: "Superadmin login failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Superadmin Login",
        description: "Logged in as Superadmin",
      });

      return true;
    } catch (error) {
      console.error("Superadmin login error:", error);
      toast({
        title: "Superadmin login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
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

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
