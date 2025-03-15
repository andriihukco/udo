"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    setIsLoading(false);

    // If not authenticated or not an admin, redirect to login
    if (!session || session.user.role !== "admin") {
      router.push("/auth/signin?callbackUrl=/admin");
    }
  }, [session, status, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated or not an admin, don't render anything
  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="prints" className="mb-8">
        <TabsList>
          <Link href="/admin">
            <TabsTrigger value="prints">Prints</TabsTrigger>
          </Link>
          <Link href="/admin/profile">
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
