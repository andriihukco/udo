# Localization System Documentation

This document explains how the localization system works in the Udo Druk application and how to use it effectively.

## Overview

The application supports multiple languages:

- English (en) - Default/fallback language
- Ukrainian (uk)
- Polish (pl)

The system is designed to be extensible, allowing for easy addition of more languages in the future.

## How It Works

### 1. Translation Files

Translations are stored in `src/translations/index.ts` and organized by sections (common, products, home, etc.). Each translation key has entries for different languages:

```typescript
export const common: Translations = {
  siteName: {
    en: "Udo Druk",
    uk: "Удо Друк",
    pl: "Udo Druk",
  },
  // ...more translations
};
```

### 2. Automatic Translation

The system includes an automatic translation feature that uses a free translation API (LibreTranslate) to translate missing strings on-the-fly:

- When a translation is missing for a non-English locale, the system will:
  1. Return the English version immediately (to avoid UI delays)
  2. Asynchronously fetch the translation from the API
  3. Store the result in memory and localStorage for future use

This approach ensures:

- The UI is never blocked waiting for translations
- Missing translations are gradually filled in as users encounter them
- Translations persist between sessions

### 3. Usage in Components

To use translations in your components:

```tsx
import { useLocale } from "@/contexts/LocaleContext";

function MyComponent() {
  const { t, locale, setLocale } = useLocale();

  return (
    <div>
      <h1>{t("common.siteName")}</h1>
      <p>{t("products.browseCollection")}</p>

      {/* Changing the language */}
      <button onClick={() => setLocale("uk")}>Switch to Ukrainian</button>
    </div>
  );
}
```

## Adding New Translations

### 1. Adding a New Translation Key

To add a new translation key:

1. Identify the appropriate section (common, products, etc.)
2. Add your key with translations for all supported languages:

```typescript
export const common: Translations = {
  // Existing translations...

  newFeature: {
    en: "New Feature",
    uk: "Нова функція",
    pl: "Nowa funkcja",
  },
};
```

### 2. Adding a New Language

To add support for a new language:

1. Update the `Locale` type in `src/translations/index.ts`:

   ```typescript
   export type Locale = "en" | "uk" | "pl" | "de"; // Adding German
   ```

2. Update the interface for translations:

   ```typescript
   interface Translations {
     [key: string]: {
       en: string;
       uk: string;
       pl?: string;
       de?: string; // Adding German
     };
   }
   ```

3. Update the locale detection in `LocaleProvider`:

   ```typescript
   // In src/contexts/LocaleContext.tsx
   if (browserLang === "uk") {
     setLocale("uk");
   } else if (browserLang === "pl") {
     setLocale("pl");
   } else if (browserLang === "de") {
     setLocale("de");
   }
   ```

4. Add the new language to the language selector in the UI.

## Best Practices

1. **Always provide English translations** - They serve as fallbacks and are used for automatic translation.

2. **Use dot notation for translation keys** - Format: `section.key` (e.g., `common.siteName`).

3. **Group related translations** - Keep translations organized by feature or section.

4. **Test with different languages** - Ensure your UI adapts well to different text lengths.

5. **Handle pluralization** - For content that changes based on count, create separate keys (e.g., `item` and `items`).

## Troubleshooting

- **Missing translations**: Check the console for warnings about missing translation keys.
- **Translation not updating**: Make sure you're using the `t` function from `useLocale()` and not hardcoding strings.
- **API translation errors**: Check network requests to the translation API in the browser console.

## Technical Details

- The translation system is implemented in `src/translations/index.ts` and `src/contexts/LocaleContext.tsx`.
- Translations are stored in memory during the session and persisted to localStorage.
- The free translation API has rate limits, so automatic translation is used sparingly.
- The system is designed to work with server-side rendering (SSR) and client-side navigation.
