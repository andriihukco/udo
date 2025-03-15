"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[oklch(16.11%_0.2166_269.06)] text-primary-foreground mt-auto">
      {/* Top Features Bar */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-medium text-base mb-2">
                {t("home.fastDelivery")}
              </h4>
              <p className="text-sm text-primary-foreground/70 text-center md:text-left">
                {t("home.deliveryDescription")}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-medium text-base mb-2">
                {t("home.securePayment")}
              </h4>
              <p className="text-sm text-primary-foreground/70 text-center md:text-left">
                {t("home.paymentDescription")}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-medium text-base mb-2">
                {t("home.qualityProducts")}
              </h4>
              <p className="text-sm text-primary-foreground/70 text-center md:text-left">
                {t("home.qualityDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Company Info */}
          <div>
            <div className="mb-6 h-10 w-auto">
              <svg
                width="120"
                height="40"
                viewBox="0 0 1168 352"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0H128V160H160V0H288V208C288 300 223.529 352 144 352C64.471 352 0 296 0 208V0Z"
                  fill="white"
                />
                <path
                  d="M416 112C416 138.51 394.51 160 368 160C341.49 160 320 138.51 320 112C320 85.4903 341.49 64 368 64C394.51 64 416 85.4903 416 112Z"
                  fill="white"
                />
                <path
                  d="M416 256C416 282.51 394.51 304 368 304C341.49 304 320 282.51 320 256C320 229.49 341.49 208 368 208C394.51 208 416 229.49 416 256Z"
                  fill="white"
                />
                <path
                  d="M608 160H448V0H606.222C718.667 0 782.222 78.7979 782.222 176C782.222 273.202 713.778 352 606.222 352H448L448 192H608V160Z"
                  fill="white"
                />
                <path
                  d="M1166.22 176C1166.22 267.809 1095.93 343.199 1006.22 351.283V192H974.222V351.283C884.518 343.199 814.222 267.809 814.222 176C814.222 78.7979 893.02 0 990.222 0C1087.42 0 1166.22 78.7979 1166.22 176Z"
                  fill="white"
                />
              </svg>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-xs">
              {t("common.tagline")}
            </p>
            <div className="flex space-x-3">
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground overflow-hidden group"
                asChild
              >
                <Link
                  href="https://instagram.com"
                  aria-label={t("social.instagram")}
                >
                  <Image
                    src="/instagram.svg"
                    alt={t("social.instagram")}
                    width={24}
                    height={24}
                    className="w-full h-full group-hover:scale-110 transition-transform"
                  />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground overflow-hidden group"
                asChild
              >
                <Link href="https://tiktok.com" aria-label={t("social.tiktok")}>
                  <Image
                    src="/tiktok.svg"
                    alt={t("social.tiktok")}
                    width={24}
                    height={24}
                    className="w-full h-full group-hover:scale-110 transition-transform"
                  />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground overflow-hidden group"
                asChild
              >
                <Link
                  href="https://t.me/udodruk"
                  aria-label={t("social.telegram")}
                >
                  <Image
                    src="/telegram.svg"
                    alt={t("social.telegram")}
                    width={24}
                    height={24}
                    className="w-full h-full group-hover:scale-110 transition-transform"
                  />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">
              {t("menu.quickLinks")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:underline"
                >
                  {t("common.products")}
                </Link>
              </li>
              <li>
                <Link
                  href="/prints"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:underline"
                >
                  {t("common.prints")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:underline"
                >
                  {t("common.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery-returns"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:underline"
                >
                  {t("legal.deliveryReturns")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:underline"
                >
                  {t("legal.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6">
              {t("contact.contactInfo")}
            </h3>
            <div className="space-y-5">
              <div className="flex items-start">
                <MapPin
                  size={20}
                  className="mr-3 mt-1 flex-shrink-0 text-primary-foreground/70"
                />
                <Link
                  href="https://maps.google.com/?q=Львів, Джерельна, 69"
                  target="_blank"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:underline group"
                >
                  {t("contact.address")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 inline-block opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <path d="M7 17L17 7"></path>
                    <path d="M7 7h10v10"></path>
                  </svg>
                </Link>
              </div>
              <div className="flex items-center">
                <Phone
                  size={20}
                  className="mr-3 flex-shrink-0 text-primary-foreground/70"
                />
                <Link
                  href="tel:+380321234567"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:underline"
                >
                  {t("contact.phone")}
                </Link>
              </div>
              <div className="flex items-center">
                <Mail
                  size={20}
                  className="mr-3 flex-shrink-0 text-primary-foreground/70"
                />
                <Link
                  href="mailto:hello@u-do.store"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:underline"
                >
                  {t("contact.email")}
                </Link>
              </div>

              <div className="pt-2 flex items-start">
                <Clock
                  size={20}
                  className="mr-3 mt-1 flex-shrink-0 text-primary-foreground/70"
                />
                <div>
                  <div className="text-primary-foreground/80">
                    {t("contact.businessHours")}
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-primary-foreground/80 text-sm">
                      {t("contact.mondayFriday")}: 9:00 - 18:00
                    </p>
                    <p className="text-primary-foreground/80 text-sm">
                      {t("contact.saturday")}: 10:00 - 15:00
                    </p>
                    <p className="text-primary-foreground/80 text-sm">
                      {t("contact.sunday")}: {t("contact.closed")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-primary-foreground/10 my-6" />

        {/* Payment Methods and Footer Image */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Payment Methods */}
          <div>
            <h4 className="font-medium text-base mb-3 text-center md:text-left">
              {t("payment.acceptedMethods")}
            </h4>
            <div className="flex space-x-3">
              <div className="bg-primary-foreground/10 p-2 rounded h-10 w-16 flex items-center justify-center">
                <Image
                  src="/visa.svg"
                  alt="Visa"
                  width={32}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              </div>
              <div className="bg-primary-foreground/10 p-2 rounded h-10 w-16 flex items-center justify-center">
                <Image
                  src="/mastercard.svg"
                  alt="Mastercard"
                  width={32}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              </div>
              <div className="bg-primary-foreground/10 p-2 rounded h-10 w-16 flex items-center justify-center">
                <Image
                  src="/mono.svg"
                  alt="Mono"
                  width={32}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              </div>
              <div className="bg-primary-foreground/10 p-2 rounded h-10 w-16 flex items-center justify-center">
                <Image
                  src="/apple-pay.svg"
                  alt="Apple Pay"
                  width={32}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Footer Image */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/footer-image.svg"
              alt="U:DO Printing"
              width={240}
              height={120}
              className="max-w-[240px] h-auto"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[oklch(8.11%_0.2166_269.06)] border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-primary-foreground/70 mb-3 md:mb-0 text-center md:text-left">
              © {currentYear} U:DO. {t("legal.allRightsReserved")}
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
              <Link
                href="/terms"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors hover:underline"
              >
                {t("legal.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
