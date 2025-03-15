"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Test404Page() {
  const router = useRouter();

  useEffect(() => {
    // Simulate a 404 error by navigating to a non-existent route
    router.push("/this-page-does-not-exist");
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p>Redirecting to test the 404 page...</p>
    </div>
  );
}
