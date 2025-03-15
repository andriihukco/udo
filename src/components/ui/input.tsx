"use client";

import * as React from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  showPasswordToggle?: boolean;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      className,
      type = "text",
      icon,
      clearable,
      onClear,
      showPasswordToggle,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [inputType, setInputType] = React.useState(type);
    const [inputValue, setInputValue] = React.useState(value || "");

    React.useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const handleClear = () => {
      setInputValue("");
      if (onClear) {
        onClear();
      }
      // Create a synthetic event to pass to onChange
      const syntheticEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      if (onChange) {
        onChange(syntheticEvent);
      }
    };

    const togglePasswordVisibility = () => {
      setInputType(inputType === "password" ? "text" : "password");
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={inputType}
          value={inputValue}
          onChange={handleChange}
          className={cn(
            icon && "pl-9",
            (clearable || showPasswordToggle) && "pr-9",
            className
          )}
          {...props}
        />

        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        {showPasswordToggle && inputType === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-6 w-6 flex items-center justify-center rounded-full hover:bg-muted/50"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Show password</span>
          </button>
        )}

        {showPasswordToggle && inputType === "text" && type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-6 w-6 flex items-center justify-center rounded-full hover:bg-muted/50"
          >
            <EyeOff className="h-4 w-4" />
            <span className="sr-only">Hide password</span>
          </button>
        )}

        {clearable && inputValue && !showPasswordToggle && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-6 w-6 flex items-center justify-center rounded-full hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear input</span>
          </button>
        )}
      </div>
    );
  }
);
EnhancedInput.displayName = "EnhancedInput";

export { Input, EnhancedInput };
