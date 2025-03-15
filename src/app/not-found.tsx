"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { useLocale } from "@/contexts/LocaleContext";
import { DicesIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <FadeIn className="container mx-auto px-4 py-16 min-h-[80vh] flex flex-col items-center justify-center">
      <SlideUp delay={0.1} className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-8">
          <Image
            src="/not-found.svg"
            alt="Page not found"
            width={240}
            height={180}
            className="animate-bounce-slow"
            priority
          />
        </div>

        <TypographyH1 className="mb-6 text-3xl md:text-4xl lg:text-5xl">
          {t("error.pageNotFound") || "Сторінку не знайдено"}
        </TypographyH1>

        <TypographyP className="mb-8 text-muted-foreground">
          {t("error.pageNotFoundDescription") ||
            "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
        </TypographyP>

        <div className="flex justify-center">
          <Button variant="glowing" showGlow={true} size="lg" asChild>
            <Link href="/editor?surprise=true" className="flex items-center">
              <Icon icon={DicesIcon} size="menu" className="mr-2" />
              {t("common.surpriseMe") || "Surprise Me"}
            </Link>
          </Button>
        </div>

        <TypographyP className="mt-4 text-sm text-muted-foreground">
          {t("error.surpriseMeDescription") ||
            "The Surprise Me button will select random print and clothing variations in our builder"}
        </TypographyP>
      </SlideUp>

      <style jsx global>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </FadeIn>
  );
}
