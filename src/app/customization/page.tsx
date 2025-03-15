"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CustomizationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the prints page
    router.push("/prints");
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
