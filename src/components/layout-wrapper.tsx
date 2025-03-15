"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { FadeIn } from "@/components/ui/fade-in";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith("/editor");
  const isAdminPage = pathname.startsWith("/admin");

  // For the editor page and its subpaths, we don't want to show the header and footer
  if (isEditorPage) {
    return (
      <>
        <FadeIn duration={800} threshold={0.01}>
          {children}
        </FadeIn>
        <Toaster />
      </>
    );
  }

  // For admin pages, show header but no footer
  if (isAdminPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-10">
          <FadeIn duration={800} threshold={0.01}>
            {children}
          </FadeIn>
        </main>
        <Toaster />
      </div>
    );
  }

  // For all other pages, show the header and footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-10">
        <FadeIn duration={800} threshold={0.01}>
          {children}
        </FadeIn>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
