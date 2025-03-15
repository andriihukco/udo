"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  User as UserIcon,
  Settings,
  ShoppingBag,
  Menu,
  Heart,
  Mail,
  Home,
  Printer,
  ChevronRight,
  Sparkles,
  LogOut,
  DollarSign,
  Euro,
  CreditCard,
  X,
  Shirt,
  BadgeInfo,
  Search,
  Loader2,
  ArrowRight,
  Coins,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/ui/cart-button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";
import { SimplifiedAuthModal } from "@/components/ui/simplified-auth-modal";
import { Icon } from "@/components/ui/icon";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Locale } from "@/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";

// Add type definition for User with isAmbassador
interface ExtendedUser {
  name?: string;
  email?: string;
  role?: string;
  isAmbassador?: boolean;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale } = useLocale();
  const { currency, setCurrency } = useCurrency();
  const { user, isAuthenticated, logoutUser, checkUserExists } = useUser();
  const [headerEmail, setHeaderEmail] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSheetMenu, setShowSheetMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const typedUser = user as ExtendedUser | null;

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      // Comment out unused variables
      // const [profileData, setProfileData] = useState({
      //   name: "",
      //   email: "",
      //   currentPassword: "",
      //   newPassword: "",
      //   confirmPassword: "",
      // });
    }
  }, [user]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Navigation items with icons - different for admin and regular users
  const navItems = isAdmin
    ? [{ href: "/admin/prints", icon: Printer, label: t("nav.prints") }]
    : [
        { href: "/", icon: Home, label: t("nav.home") },
        { href: "/products", icon: Shirt, label: t("nav.clothingAccessories") },
        {
          href: "/prints",
          icon: () => (
            <div className="relative w-5 h-5 flex-shrink-0">
              <Image
                src="/print-icon.svg"
                alt={t("nav.printIcon")}
                fill
                className="object-contain"
              />
            </div>
          ),
          label: t("nav.customization"),
        },
        { href: "/prints", icon: Printer, label: t("nav.prints") },
        { href: "/about", icon: BadgeInfo, label: t("nav.about") },
      ];

  // Mock locations data
  const locations = [
    {
      name: t("locations.lvivOffice"),
      address: t("locations.lvivAddress"),
      phone: t("locations.lvivPhone"),
      icon: "/images/svg/lviv.svg",
    },
    {
      name: t("locations.zaporizhiaProduction"),
      address: t("locations.zaporizhiaAddress"),
      phone: t("locations.zaporizhiaPhone"),
      icon: "/images/svg/zaporizhia.svg",
    },
  ];

  // Language options with emojis
  const languages = [
    { code: "uk" as Locale, name: "Українська", emoji: "🇺🇦" },
    { code: "en" as Locale, name: "English", emoji: "🇬🇧" },
    { code: "pl" as Locale, name: "Polski", emoji: "🇵🇱" },
    { code: "jp" as Locale, name: "日本語", emoji: "🇯🇵" },
  ];

  // Currency options with symbols
  const currencies = [
    {
      code: "USD" as Currency,
      name: t("currency.usd"),
      symbol: "$",
      icon: DollarSign,
    },
    {
      code: "EUR" as Currency,
      name: t("currency.eur"),
      symbol: "€",
      icon: Euro,
    },
    {
      code: "UAH" as Currency,
      name: t("currency.uah"),
      symbol: "₴",
      icon: CreditCard,
    },
  ];

  // Handle language change
  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  // Handle currency change
  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  // These functions are currently unused but might be needed in the future
  /*
  // Handle profile form input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Implementation details...
    setIsLoading(false);
  };
  */

  // Handle continue button click for auth
  const handleContinueClick = async () => {
    if (!headerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }

    console.log("Checking email:", headerEmail); // Debug log

    setIsLoading(true);
    try {
      const exists = await checkUserExists(headerEmail);
      console.log("Email exists:", exists); // Debug log

      // If the email exists, show the auth modal for password entry
      if (exists) {
        setShowAuthModal(true);
      } else {
        // If email doesn't exist, show the auth modal for registration
        setShowAuthModal(true);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email key down event
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleContinueClick();
    }
  };

  // Mock user levels data - commented out as not currently used
  /*
  const levels = [
    { level: 1, name: "Bronze", xp: 0 },
    { level: 2, name: "Silver", xp: 1000 },
    { level: 3, name: "Gold", xp: 2500 },
    { level: 4, name: "Platinum", xp: 5000 },
    { level: 5, name: "Diamond", xp: 10000 },
  ];

  // Get current level based on XP
  const userXP = 1200; // This would come from the user object in a real app
  const currentLevel = levels.find((l) => l.xp <= userXP && (!levels.find((next) => next.level === l.level + 1) || levels.find((next) => next.level === l.level + 1)?.xp > userXP)) || levels[0];
  
  // Comment out unused variables
  // const nextLevel = levels.find((l) => l.level === currentLevel.level + 1);
  // const progress = (currentLevel.xp / (nextLevel?.xp || 1000)) * 100;
  */

  // Social media links
  const socialLinks = [
    {
      icon: () => (
        <Image
          src="/instagram.svg"
          alt={t("social.instagram")}
          width={24}
          height={24}
          className="w-full h-full group-hover:scale-110 transition-transform"
        />
      ),
      href: "https://instagram.com/u_do.shop",
      label: t("social.instagram"),
    },
    {
      icon: () => (
        <Image
          src="/tiktok.svg"
          alt={t("social.tiktok")}
          width={24}
          height={24}
          className="w-full h-full group-hover:scale-110 transition-transform"
        />
      ),
      href: "https://tiktok.com/@u_do.shop",
      label: t("social.tiktok"),
    },
    {
      icon: () => (
        <Image
          src="/telegram.svg"
          alt={t("social.telegram")}
          width={24}
          height={24}
          className="w-full h-full group-hover:scale-110 transition-transform"
        />
      ),
      href: "https://t.me/udo_shop",
      label: t("social.telegram"),
    },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo with Admin Badge */}
            <div className="flex items-center mr-4">
              <Link
                href={isAdmin ? "/admin" : "/"}
                className="relative h-10 flex items-center"
              >
                <Image
                  src="/logo.svg"
                  alt={t("common.siteName")}
                  width={120}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm transition-colors hover:bg-accent group flex items-center",
                    isActive(item.href)
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon
                    icon={item.icon}
                    size="menu"
                    className="mr-2 text-primary group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={cn(
                      "group-hover:underline",
                      isActive(item.href) ? "underline" : ""
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Builder Button - Only show for non-admin users and on non-mobile screens */}
            {(!isAdmin || typedUser?.role === "user") && (
              <div className="hidden md:block">
                <Button
                  variant="glowing"
                  showGlow={true}
                  className="rounded-full px-4 py-2 font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-md hover:shadow-lg transition-all"
                >
                  <Link href="/editor" className="flex items-center">
                    <Icon
                      icon={Sparkles}
                      size="default"
                      className="mr-2 animate-pulse"
                    />
                    <span className="relative">
                      {t("common.openBuilder")}
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
                      </span>
                    </span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                // Implement search functionality
                console.log("Search clicked");
              }}
            >
              <Icon icon={Search} size="default" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Cart Button - Only show for regular users */}
            {(!isAdmin || typedUser?.role === "user") && <CartButton />}

            {/* Auth Modal */}
            <SimplifiedAuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              initialEmail={headerEmail}
            />

            {/* User Profile Menu */}
            <Sheet open={showSheetMenu} onOpenChange={setShowSheetMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon icon={Menu} size="default" />
                  <span className="sr-only">{t("common.menu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md overflow-y-auto p-0"
              >
                <div className="flex flex-col h-full">
                  {/* Sheet Header */}
                  <div className="flex items-center justify-between py-3 px-4 border-b">
                    <div className="flex items-center">
                      <SheetTitle className="text-lg">
                        {t("common.menu")}
                      </SheetTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-muted-foreground hover:text-rose-500"
                          onClick={logoutUser}
                        >
                          <Icon icon={LogOut} size="default" />
                          <span className="sr-only">{t("user.logout")}</span>
                        </Button>
                      )}
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Icon icon={X} size="default" />
                          <span className="sr-only">{t("common.close")}</span>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>

                  {/* Main Content Area - Scrollable */}
                  <div className="flex-1 overflow-y-auto">
                    {/* User Profile Banner Section */}
                    <div className="p-0">
                      {isAuthenticated && typedUser ? (
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                              <UserIcon className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-lg">
                                {typedUser.name}
                              </p>
                              {typedUser.role && (
                                <p className="text-sm text-muted-foreground">
                                  {typedUser.role.charAt(0).toUpperCase() +
                                    typedUser.role.slice(1)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Admin/Customer Switcher */}
                          {(typedUser.role === "admin" ||
                            typedUser.role === "superadmin") && (
                            <div className="mb-4 bg-muted/30 p-4 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <p className="text-sm font-medium">
                                    {t("user.viewAs") || "View as:"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {pathname.startsWith("/admin")
                                      ? t("user.adminMode") || "Admin mode"
                                      : t("user.customerMode") ||
                                        "Customer mode"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    <span
                                      className={cn(
                                        "text-xs",
                                        !pathname.startsWith("/admin")
                                          ? "font-medium text-foreground"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      {t("user.customer") || "Customer"}
                                    </span>
                                    {!pathname.startsWith("/admin") && (
                                      <span className="ml-1 w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    )}
                                  </div>
                                  <Switch
                                    checked={pathname.startsWith("/admin")}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        router.push("/admin/prints");
                                      } else {
                                        router.push("/");
                                      }
                                    }}
                                    className="h-6 w-11 data-[state=checked]:bg-primary/90"
                                  />
                                  <div className="flex items-center">
                                    <span
                                      className={cn(
                                        "text-xs",
                                        pathname.startsWith("/admin")
                                          ? "font-medium text-foreground"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      {t("user.admin") || "Admin"}
                                    </span>
                                    {pathname.startsWith("/admin") && (
                                      <span className="ml-1 w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {!isAdmin && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center bg-primary/5 hover:bg-primary/10 transition-colors rounded-full px-3 py-1 cursor-pointer">
                                <Icon
                                  icon={Coins}
                                  size="default"
                                  className="mr-1.5 text-primary"
                                />
                                <span className="text-sm font-medium">
                                  250 {t("user.coins")}
                                </span>
                              </div>
                              {typedUser?.isAmbassador && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-100/80 border-amber-300 text-amber-800 animate-pulse"
                                >
                                  <span className="flex items-center">
                                    <Icon
                                      icon={Sparkles}
                                      size="default"
                                      className="mr-1 text-amber-600"
                                    />
                                    {t("user.ambassador")}
                                  </span>
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex-shrink-0">
                              <Image
                                src="/welcome.svg"
                                alt="Welcome"
                                width={100}
                                height={100}
                                className="rounded-full"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">
                                {t("auth.welcomeGuest")}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {t("auth.welcomeGuestDescription")}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                id="header-email"
                                type="email"
                                placeholder="your.email@example.com"
                                className="bg-background flex-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                                value={headerEmail}
                                onChange={(e) => setHeaderEmail(e.target.value)}
                                onKeyDown={handleEmailKeyDown}
                              />
                              <div
                                className={cn(
                                  "transition-opacity duration-300",
                                  headerEmail &&
                                    /\S+@\S+\.\S+/.test(headerEmail)
                                    ? "opacity-100"
                                    : "opacity-50 pointer-events-none"
                                )}
                              >
                                <SheetClose asChild>
                                  <Button
                                    type="button"
                                    variant="default"
                                    className="h-10 bg-primary text-primary-foreground"
                                    onClick={handleContinueClick}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Icon
                                        icon={ArrowRight}
                                        className="text-primary-foreground"
                                        size="default"
                                      />
                                    )}
                                  </Button>
                                </SheetClose>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile Builder Button - Only visible on mobile and for non-admin users */}
                    {(!isAdmin || typedUser?.role === "user") && (
                      <div className="md:hidden px-6 py-4 bg-muted/30">
                        <div className="flex gap-2">
                          <SheetClose asChild>
                            <Button
                              variant="glowing"
                              showGlow={true}
                              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all"
                            >
                              <Link
                                href="/editor"
                                className="flex items-center justify-center w-full"
                              >
                                <Icon
                                  icon={Sparkles}
                                  size="menu"
                                  className="mr-2 animate-pulse"
                                />
                                <span className="relative">
                                  {t("common.openBuilder")}
                                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
                                  </span>
                                </span>
                              </Link>
                            </Button>
                          </SheetClose>
                        </div>
                      </div>
                    )}

                    {/* Mobile Navigation - Mobile Only */}
                    <div className="md:hidden px-6 py-4 bg-accent/10">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                        {t("menu.navigation")}
                      </h3>
                      <nav className="grid grid-cols-1 gap-1">
                        {navItems.map((item) => (
                          <SheetClose key={item.href} asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center p-3 rounded-full transition-colors group w-full",
                                isActive(item.href)
                                  ? "bg-accent text-foreground font-medium"
                                  : "hover:bg-accent hover:text-foreground text-muted-foreground"
                              )}
                            >
                              <Icon
                                icon={item.icon}
                                size="menu"
                                className="mr-3 text-primary group-hover:scale-110 transition-transform"
                              />
                              <span className="group-hover:underline">
                                {item.label}
                              </span>
                              {isActive(item.href) && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                              )}
                            </Link>
                          </SheetClose>
                        ))}
                      </nav>
                    </div>

                    {/* Full width divider */}
                    <div className="h-px w-full bg-border"></div>

                    {/* Admin Settings Section - Only for admin users */}
                    {isAdmin && (
                      <div className="px-6 py-4 bg-accent/10">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                          {t("menu.adminSettings")}
                        </h3>
                        <nav className="grid grid-cols-1 gap-1">
                          <SheetClose asChild>
                            <Link
                              href="/admin/settings"
                              className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground w-full"
                            >
                              <Icon
                                icon={Settings}
                                size="menu"
                                className="mr-3 text-primary group-hover:scale-110 transition-transform"
                              />
                              <span className="group-hover:underline">
                                {t("nav.settings")}
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                            </Link>
                          </SheetClose>
                        </nav>
                      </div>
                    )}

                    {/* Combined Quick Links and Settings Section - Only for non-admin users */}
                    {(!isAdmin || typedUser?.role === "user") && (
                      <>
                        {/* Quick Links Section */}
                        <div className="px-6 py-4 bg-accent/10">
                          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                            {t("menu.quickLinks")}
                          </h3>
                          <nav className="grid grid-cols-1 gap-1">
                            {/* Favorites */}
                            {isAuthenticated ? (
                              <SheetClose asChild>
                                <Link
                                  href="/favorites"
                                  className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground w-full"
                                >
                                  <Icon
                                    icon={Heart}
                                    size="menu"
                                    className="mr-3 text-primary group-hover:scale-110 transition-transform"
                                  />
                                  <span className="group-hover:underline">
                                    {t("common.favorites")}
                                  </span>
                                  <div className="ml-auto flex items-center">
                                    <Badge variant="outline" className="mr-2">
                                      0
                                    </Badge>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                </Link>
                              </SheetClose>
                            ) : (
                              <button
                                onClick={() => setShowAuthModal(true)}
                                className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground w-full text-left"
                              >
                                <Icon
                                  icon={Heart}
                                  size="menu"
                                  className="mr-3 text-primary group-hover:scale-110 transition-transform"
                                />
                                <span className="group-hover:underline">
                                  {t("common.favorites")}
                                </span>
                                <div className="ml-auto flex items-center">
                                  <Badge variant="outline" className="mr-2">
                                    0
                                  </Badge>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </button>
                            )}

                            {/* Orders */}
                            {isAuthenticated ? (
                              <SheetClose asChild>
                                <Link
                                  href="/orders"
                                  className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground text-muted-foreground w-full"
                                >
                                  <Icon
                                    icon={ShoppingBag}
                                    size="menu"
                                    className="mr-3 text-primary group-hover:scale-110 transition-transform"
                                  />
                                  <span className="group-hover:underline">
                                    {t("user.orders")}
                                  </span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                                </Link>
                              </SheetClose>
                            ) : (
                              <button
                                onClick={() => setShowAuthModal(true)}
                                className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground text-muted-foreground w-full text-left"
                              >
                                <Icon
                                  icon={ShoppingBag}
                                  size="menu"
                                  className="mr-3 text-primary group-hover:scale-110 transition-transform"
                                />
                                <span className="group-hover:underline">
                                  {t("user.orders")}
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                              </button>
                            )}

                            {/* Settings - Only show for authenticated users */}
                            {typedUser && (
                              <SheetClose asChild>
                                <Link
                                  href="/settings"
                                  className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground text-muted-foreground w-full"
                                >
                                  <Icon
                                    icon={Settings}
                                    size="menu"
                                    className="mr-3 text-primary group-hover:scale-110 transition-transform"
                                  />
                                  <span className="group-hover:underline">
                                    {t("user.settings")}
                                  </span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                                </Link>
                              </SheetClose>
                            )}
                          </nav>
                        </div>

                        {/* Full width divider */}
                        <div className="h-px w-full bg-border"></div>

                        {/* Social Media Links - Before locations */}
                        <div className="px-6 py-4 bg-accent/10">
                          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                            {t("menu.followUs")}
                          </h3>
                          <div className="flex gap-2 mb-4">
                            {socialLinks.map((social) => (
                              <SheetClose key={social.label} asChild>
                                <Link
                                  href={social.href}
                                  className="flex items-center justify-center h-12 w-12 rounded-full border border-border bg-background hover:bg-accent hover:text-foreground transition-colors group overflow-hidden"
                                  target="_blank"
                                >
                                  {social.icon()}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Full width divider */}
                    <div className="h-px w-full bg-border"></div>

                    {/* Locations Section - Separate Section */}
                    <div className="px-6 py-4 bg-muted/30">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                        {t("menu.ourLocations")}
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {locations.map((location, index) => (
                          <SheetClose key={index} asChild>
                            <Link
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                location.address
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground text-muted-foreground w-full"
                            >
                              <div className="w-10 h-10 relative border border-border rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-background mr-3">
                                <Image
                                  src={location.icon}
                                  alt={location.name}
                                  width={30}
                                  height={30}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-base text-foreground group-hover:text-primary group-hover:underline transition-all">
                                  {location.name}
                                </h4>
                                <span className="text-xs text-muted-foreground block">
                                  {location.address}
                                </span>
                              </div>
                              <Icon
                                icon={ArrowRight}
                                className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all"
                                size="default"
                              />
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>

                    {/* Full width divider */}
                    <div className="h-px w-full bg-border"></div>

                    {/* Contact Info - Separate Section */}
                    <div className="px-6 py-4 bg-accent/10">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                        {t("menu.contactUs")}
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <SheetClose asChild>
                          <Link
                            href="mailto:hi@u-do.shop"
                            className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground text-muted-foreground w-full"
                          >
                            <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center mr-3">
                              <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-base font-medium text-foreground group-hover:text-primary group-hover:underline transition-all">
                              hi@u-do.shop
                            </span>
                            <Icon
                              icon={ArrowRight}
                              className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all"
                              size="default"
                            />
                          </Link>
                        </SheetClose>

                        <SheetClose asChild>
                          <Link
                            href="tel:+380630703307"
                            className="flex items-center p-3 rounded-full transition-colors group hover:bg-accent hover:text-foreground text-muted-foreground w-full"
                          >
                            <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center mr-3">
                              <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-base font-medium text-foreground group-hover:text-primary group-hover:underline transition-all">
                              +38 063 070 33 07
                            </span>
                            <Icon
                              icon={ArrowRight}
                              className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all"
                              size="default"
                            />
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  </div>

                  {/* Minimalistic Footer with Language/Currency */}
                  <div className="border-t bg-muted/30 py-4 px-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-1">
                          {t("menu.language")}
                        </h3>
                        <Select
                          value={locale}
                          onValueChange={(value) =>
                            handleLanguageChange(value as Locale)
                          }
                        >
                          <SelectTrigger className="w-full h-10 text-sm">
                            <span className="flex items-center">
                              <span className="mr-2">
                                {
                                  languages.find((l) => l.code === locale)
                                    ?.emoji
                                }
                              </span>
                              {languages.find((l) => l.code === locale)?.name}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                <span className="flex items-center">
                                  <span className="mr-2">{lang.emoji}</span>
                                  {lang.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-1">
                          {t("menu.currency")}
                        </h3>
                        <Select
                          value={currency}
                          onValueChange={(value) =>
                            handleCurrencyChange(value as Currency)
                          }
                        >
                          <SelectTrigger className="w-full h-10 text-sm">
                            <span className="flex items-center">
                              <span className="mr-2 font-bold">
                                {
                                  currencies.find((c) => c.code === currency)
                                    ?.symbol
                                }
                              </span>
                              {
                                currencies.find((c) => c.code === currency)
                                  ?.name
                              }
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((curr) => (
                              <SelectItem key={curr.code} value={curr.code}>
                                <span className="flex items-center">
                                  <span className="mr-2 font-bold">
                                    {curr.symbol}
                                  </span>
                                  {curr.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
