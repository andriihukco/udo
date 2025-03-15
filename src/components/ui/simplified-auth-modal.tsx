"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Check, Mail } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useLocale } from "@/contexts/LocaleContext";

interface SimplifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSuccess?: () => void;
  initialEmail?: string;
}

type AuthStep = "email" | "login" | "register";

export function SimplifiedAuthModal({
  isOpen,
  onClose,
  title,
  description,
  onSuccess,
  initialEmail = "",
}: SimplifiedAuthModalProps) {
  const { t } = useLocale();
  const { checkUserExists, loginUser, registerUser } = useUser();

  // Form state
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [currentStep, setCurrentStep] = useState<AuthStep>(
    initialEmail ? "email" : "email"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Set initial email when provided
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Check if email exists and set the appropriate step
  const checkIfUserExists = useCallback(async () => {
    if (!email) return;

    console.log("Checking if user exists:", email); // Debug log
    console.log("Email comparison:", email === "marina@u-do.shop"); // Debug log
    setIsLoading(true);
    try {
      const exists = await checkUserExists(email);
      console.log("User exists:", exists); // Debug log
      setCurrentStep(exists ? "login" : "register");
    } catch (err) {
      console.error(err);
      setError(t("auth.errorOccurred"));
    } finally {
      setIsLoading(false);
    }
  }, [email, checkUserExists, setCurrentStep, t]);

  // Handle the email step submission
  const handleEmailStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError(t("auth.emailRequired"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t("auth.validEmailRequired"));
      return;
    }

    await checkIfUserExists();
  };

  // Handle the login step submission
  const handleLoginStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }

    setIsLoading(true);

    try {
      const success = await loginUser(email, password);

      if (success) {
        handleClose();
        onSuccess?.();
      }
    } catch (err) {
      setError(t("auth.errorOccurred"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the registration step submission
  const handleRegisterStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError(t("auth.nameRequired"));
      return;
    }

    if (!phone) {
      setError(t("auth.phoneRequired"));
      return;
    }

    if (!/^\+?[0-9\s-()]{10,15}$/.test(phone)) {
      setError(t("auth.validPhoneRequired"));
      return;
    }

    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.passwordTooShort"));
      return;
    }

    if (!hasLetter || !hasNumber) {
      setError(t("auth.passwordRequirements"));
      return;
    }

    setIsLoading(true);

    try {
      // Store the phone number in the name field for now
      // In a real app, you would have a separate field for phone
      const userInfo = `${name} (${phone})`;
      const success = await registerUser(email, password, userInfo);

      if (success) {
        handleClose();
        onSuccess?.();
      }
    } catch (err) {
      setError(t("auth.errorOccurred"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Reset the form when the modal is closed
  const handleClose = () => {
    setPassword("");
    setName("");
    setPhone("");
    setError("");
    if (!initialEmail) {
      setEmail("");
      setCurrentStep("email");
    }
    onClose();
  };

  // Go back to email step
  const handleBackToEmail = () => {
    setCurrentStep("email");
    setError("");
  };

  // Password validation
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-none shadow-xl">
        <DialogHeader>
          <DialogTitle>
            {title ||
              (currentStep === "email"
                ? t("auth.welcomeToUDO") || "Welcome to U:DO"
                : currentStep === "login"
                ? t("auth.welcomeBack") || "Welcome Back"
                : t("auth.createAccount") || "Create Account")}
          </DialogTitle>
          <DialogDescription>
            {description ||
              (currentStep === "email"
                ? t("auth.enterEmail") || "Enter your email to continue"
                : currentStep === "login"
                ? t("auth.enterPassword") || "Enter your password to sign in"
                : t("auth.completeDetails") || "Complete your account details")}
          </DialogDescription>
        </DialogHeader>

        {/* Email Step */}
        {currentStep === "email" && (
          <form onSubmit={handleEmailStep} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email") || "Email"}</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  required
                  autoFocus
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.checking") || "Checking..."}
                </>
              ) : (
                t("auth.continue") || "Continue"
              )}
            </Button>
          </form>
        )}

        {/* Login Step */}
        {currentStep === "login" && (
          <form onSubmit={handleLoginStep} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("auth.signingInAs") || "Signing in as"}
                </p>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-xs text-primary hover:underline"
                >
                  {t("auth.changeEmail") || "Change"}
                </button>
              </div>
              <p className="font-medium">{email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {t("auth.password") || "Password"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword
                      ? t("auth.hidePassword") || "Hide password"
                      : t("auth.showPassword") || "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.signingIn") || "Signing in..."}
                </>
              ) : (
                t("auth.signIn") || "Sign In"
              )}
            </Button>
          </form>
        )}

        {/* Register Step */}
        {currentStep === "register" && (
          <form onSubmit={handleRegisterStep} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("auth.creatingAccountFor") || "Creating account for"}
                </p>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-xs text-primary hover:underline"
                >
                  {t("auth.changeEmail") || "Change"}
                </button>
              </div>
              <p className="font-medium">{email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                {t("auth.fullName") || "Full Name"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t("auth.fullNamePlaceholder") || "Your full name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {t("auth.phoneNumber") || "Phone Number"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+380 XX XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">
                {t("auth.createPassword") || "Create Password"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword
                      ? t("auth.hidePassword") || "Hide password"
                      : t("auth.showPassword") || "Show password"}
                  </span>
                </Button>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div
                  className={`flex items-center ${
                    hasMinLength ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  <Check
                    className={`h-3 w-3 mr-1 ${
                      hasMinLength ? "opacity-100" : "opacity-30"
                    }`}
                  />
                  <span>{t("auth.passwordLength") || "Min 6 characters"}</span>
                </div>
                <div
                  className={`flex items-center ${
                    hasLetter ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  <Check
                    className={`h-3 w-3 mr-1 ${
                      hasLetter ? "opacity-100" : "opacity-30"
                    }`}
                  />
                  <span>{t("auth.passwordLetter") || "Contains letter"}</span>
                </div>
                <div
                  className={`flex items-center ${
                    hasNumber ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  <Check
                    className={`h-3 w-3 mr-1 ${
                      hasNumber ? "opacity-100" : "opacity-30"
                    }`}
                  />
                  <span>{t("auth.passwordNumber") || "Contains number"}</span>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.creatingAccount") || "Creating account..."}
                </>
              ) : (
                t("auth.createAccount") || "Create Account"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
