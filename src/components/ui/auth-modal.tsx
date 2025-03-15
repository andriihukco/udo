"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/contexts/LocaleContext";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

// Mock admin credentials for demo purposes
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const SUPERADMIN_EMAIL = "superadmin@example.com";
const SUPERADMIN_PASSWORD = "super123";

export function AuthModal({
  isOpen,
  onClose,
  title,
  description,
}: AuthModalProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgot">(
    "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Check if it's an admin login attempt based on email
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Admin login successful
      console.log("Admin login successful");
      // Simulate admin login by dispatching a custom event
      window.dispatchEvent(
        new CustomEvent("admin-login", {
          detail: {
            name: "Admin User",
            email: ADMIN_EMAIL,
            role: "admin",
          },
        })
      );
      onClose();
      return;
    } else if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
      // Super admin login successful
      console.log("Super admin login successful");
      // Simulate super admin login by dispatching a custom event
      window.dispatchEvent(
        new CustomEvent("admin-login", {
          detail: {
            name: "Super Admin",
            email: SUPERADMIN_EMAIL,
            role: "superadmin",
          },
        })
      );
      onClose();
      return;
    }

    // Regular user login
    // Here you would implement actual authentication logic
    console.log("Sign in with:", { email, password });
    // For demo purposes, we'll just close the modal
    // Simulate user login by dispatching a custom event
    window.dispatchEvent(
      new CustomEvent("user-login", {
        detail: {
          name: "John Doe",
          email: email,
          role: "user",
        },
      })
    );
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError("");

    // Validate form
    if (password !== confirmPassword) {
      setRegistrationError(t("auth.passwordsDoNotMatch"));
      return;
    }

    // Here you would implement actual registration logic
    console.log("Sign up with:", { name, email, password });

    // For demo purposes, we'll simulate a successful registration
    // Simulate user login by dispatching a custom event
    window.dispatchEvent(
      new CustomEvent("user-login", {
        detail: {
          name: name,
          email: email,
          role: "user",
        },
      })
    );

    // Show success toast
    toast({
      title: t("auth.registrationSuccessful"),
      description: t("auth.welcomeMessage").replace("{name}", name),
      duration: 5000,
    });

    // Close the modal
    onClose();
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setLoginError(t("auth.emailRequired"));
      return;
    }

    // Here you would implement actual password reset logic
    console.log("Password reset requested for:", email);

    // Show success message
    setResetEmailSent(true);

    // Show success toast
    toast({
      title: t("auth.passwordResetSent"),
      description: t("auth.passwordResetInstructions"),
      duration: 5000,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || t("auth.authRequired")}</DialogTitle>
          <DialogDescription>
            {description || t("auth.pleaseSignIn")}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="signin"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "signin" | "signup" | "forgot");
            setLoginError("");
            setRegistrationError("");
            setResetEmailSent(false);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t("common.signIn")}</TabsTrigger>
            <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("common.emailAddress")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 h-auto"
                    type="button"
                    onClick={() => setActiveTab("forgot")}
                  >
                    {t("auth.forgotPassword")}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword
                        ? t("auth.hidePassword")
                        : t("auth.showPassword")}
                    </span>
                  </Button>
                </div>
              </div>
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
              <Button type="submit" className="w-full">
                {t("common.signIn")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("common.yourName")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">{t("common.emailAddress")}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{t("auth.password")}</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword
                        ? t("auth.hidePassword")
                        : t("auth.showPassword")}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  {t("auth.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword
                        ? t("auth.hidePassword")
                        : t("auth.showPassword")}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {t("auth.termsNotice")}
              </div>
              {registrationError && (
                <p className="text-sm text-red-500">{registrationError}</p>
              )}
              <Button type="submit" className="w-full">
                {t("auth.signUp")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="forgot" className="mt-4">
            {!resetEmailSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t("auth.forgotPasswordInstructions")}
                  </p>
                  <Label htmlFor="reset-email">
                    {t("common.emailAddress")}
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {loginError && (
                  <p className="text-sm text-red-500">{loginError}</p>
                )}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setActiveTab("signin")}
                  >
                    {t("common.back")}
                  </Button>
                  <Button type="submit" className="flex-1">
                    {t("auth.resetPassword")}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    {t("auth.resetEmailSent")}
                  </p>
                  <p className="mt-2 text-sm text-green-700">
                    {t("auth.checkEmailForInstructions")}
                  </p>
                </div>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setActiveTab("signin")}
                >
                  {t("common.backToSignIn")}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
