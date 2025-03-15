// Translations for the application
// English and Ukrainian translations are placed side by side for easy editing

export type Locale = 'en' | 'uk' | 'pl' | 'jp';

interface Translations {
  [key: string]: {
    en: string;
    uk: string;
    pl?: string; // Polish translations may be added gradually
    jp?: string; // Japanese translations may be added gradually
  };
}

// In-memory cache for dynamically loaded translations
const dynamicTranslations: Record<string, Record<Locale, string>> = {};

// Common translations used throughout the application
export const common: Translations = {
  // Site name and tagline
  siteName: {
    en: "U:DO",
    uk: "Ю:ДУ",
    pl: "U:DO",
  },
  tagline: {
    en: "Ukrainian unisex clothing and accessories brand with in-house production and unique customizations",
    uk: "український бренд унісекс одягу та аксесуарів з власним виробництвом та унікальними кастомізаціями",
    pl: "ukraińska marka odzieży unisex i akcesoriów z własną produkcją i unikalnymi personalizacjami",
    jp: "自社生産とユニークなカスタマイズを備えたウクライナのユニセックス衣料品とアクセサリーブランド",
  },

  // Navigation
  "nav.home": {
    en: "Home",
    uk: "Головна",
    pl: "Strona główna",
    jp: "ホーム",
  },
  "nav.clothingAccessories": {
    en: "Clothing & Accessories",
    uk: "Одяг та аксесуари",
    pl: "Odzież i akcesoria",
    jp: "衣類・アクセサリー",
  },
  "nav.customization": {
    en: "Customization",
    uk: "Кастомізація",
    pl: "Personalizacja",
    jp: "カスタマイズ",
  },
  "nav.about": {
    en: "About",
    uk: "Про нас",
    pl: "O nas",
    jp: "会社概要",
  },
  "nav.prints": {
    en: "Prints",
    uk: "Принти",
    pl: "Nadruki",
    jp: "プリント",
  },
  "nav.contact": {
    en: "Contact",
    uk: "Контакти",
    pl: "Kontakt",
    jp: "お問い合わせ",
  },
  "nav.dashboard": {
    en: "Dashboard",
    uk: "Панель керування",
    pl: "Panel sterowania",
    jp: "ダッシュボード",
  },
  "nav.products": {
    en: "Products",
    uk: "Товари",
    pl: "Produkty",
    jp: "製品",
  },
  "nav.users": {
    en: "Users",
    uk: "Користувачі",
    pl: "Użytkownicy",
    jp: "ユーザー",
  },
  "nav.settings": {
    en: "Settings",
    uk: "Налаштування",
    pl: "Ustawienia",
    jp: "設定",
  },
  "nav.printIcon": {
    en: "Print Icon",
    uk: "Іконка друку",
    pl: "Ikona druku",
    jp: "プリントアイコン",
  },

  home: {
    en: "Home",
    uk: "Головна",
    pl: "Strona główna",
  },
  current: {
    en: "Current",
    uk: "Поточна",
    pl: "Bieżący",
  },
  products: {
    en: "Products",
    uk: "Товари",
    pl: "Produkty",
    jp: "製品",
  },
  prints: {
    en: "Prints",
    uk: "Друк",
    pl: "Wydruki",
    jp: "プリント",
  },
  shadcnUI: {
    en: "ShadCN UI",
    uk: "ShadCN UI",
    pl: "ShadCN UI",
  },
  componentsShowcase: {
    en: "Components",
    uk: "Компоненти",
    pl: "Komponenty",
  },
  about: {
    en: "About",
    uk: "Про нас",
    pl: "O nas",
    jp: "会社概要",
  },
  contact: {
    en: "Contact",
    uk: "Контакти",
    pl: "Kontakt",
    jp: "お問い合わせ",
  },
  openBuilder: {
    en: "Open Builder",
    uk: "Відкрити конструктор",
    pl: "Otwórz kreator",
  },
  menu: {
    en: "Menu",
    uk: "Меню",
    pl: "Menu",
  },
  backToHome: {
    en: "Back to Home",
    uk: "На головну",
    pl: "Powrót do strony głównej",
    jp: "ホームに戻る",
  },
  more: {
    en: "More",
    uk: "Більше",
    pl: "Więcej",
  },
  help: {
    en: "Help & Support",
    uk: "Допомога та підтримка",
    pl: "Pomoc i wsparcie",
  },

  // Theme
  theme: {
    en: "Theme",
    uk: "Тема",
    pl: "Motyw",
  },
  light: {
    en: "Light",
    uk: "Світла",
    pl: "Jasny",
  },
  dark: {
    en: "Dark",
    uk: "Темна",
    pl: "Ciemny",
  },
  system: {
    en: "System",
    uk: "Системна",
    pl: "Systemowy",
  },

  // Account
  account: {
    en: "Account",
    uk: "Акаунт",
    pl: "Konto",
  },
  favorites: {
    en: "Favorites",
    uk: "Улюблене",
    pl: "Ulubione",
  },
  settings: {
    en: "Settings",
    uk: "Налаштування",
    pl: "Ustawienia",
  },
  language: {
    en: "Language",
    uk: "Мова",
    pl: "Język",
  },
  currency: {
    en: "Currency",
    uk: "Валюта",
    pl: "Waluta",
  },
  signIn: {
    en: "Sign In",
    uk: "Увійти",
    pl: "Zaloguj się",
  },
  signInToAccount: {
    en: "Sign in to your account",
    uk: "Увійти в акаунт",
    pl: "Zaloguj się na swoje konto",
  },
  accessOrders: {
    en: "Access your orders, favorites, and settings",
    uk: "Доступ до замовлень, улюблених товарів та налаштувань",
    pl: "Dostęp do zamówień, ulubionych i ustawień",
  },
  dontHaveAccount: {
    en: "Don't have an account?",
    uk: "Немає акаунту?",
    pl: "Nie masz konta?",
  },
  createOne: {
    en: "Create one",
    uk: "Створити",
    pl: "Utwórz konto",
  },
  myAccount: {
    en: "My Account",
    uk: "Мій акаунт",
    pl: "Moje konto",
  },
  myOrders: {
    en: "My Orders",
    uk: "Мої замовлення",
    pl: "Moje zamówienia",
  },
  followUs: {
    en: "Follow Us",
    uk: "Слідкуйте за нами",
    pl: "Obserwuj nas",
  },
  cancel: {
    en: "Cancel",
    uk: "Скасувати",
    pl: "Anuluj",
  },
  emailAddress: {
    en: "Email Address",
    uk: "Електронна пошта",
    pl: "Adres e-mail",
  },
  yourName: {
    en: "Your Name",
    uk: "Ваше ім'я",
    pl: "Twoje imię",
  },

  // Home page banner
  "home.banner1Title": {
    en: "Summer Collection 2023",
    uk: "Літня колекція 2023",
    pl: "Kolekcja Letnia 2023",
    jp: "夏コレクション2023",
  },
  "home.banner1Description": {
    en: "Discover our latest arrivals with modern designs and premium quality materials.",
    uk: "Відкрийте для себе наші останні надходження з сучасним дизайном та матеріалами преміум-якості.",
    pl: "Odkryj nasze najnowsze produkty z nowoczesnymi wzorami i materiałami najwyższej jakości.",
    jp: "モダンなデザインと高品質な素材を使用した最新アイテムをご覧ください。",
  },
  "home.banner2Title": {
    en: "New Arrivals",
    uk: "Нові надходження",
    pl: "Nowości",
    jp: "新着商品",
  },
  "home.banner2Description": {
    en: "Check out our newest products with exclusive designs and limited editions.",
    uk: "Перегляньте наші найновіші продукти з ексклюзивним дизайном та обмеженими виданнями.",
    pl: "Sprawdź nasze najnowsze produkty z ekskluzywnymi wzorami i limitowanymi edycjami.",
    jp: "限定デザインと限定版の最新製品をチェックしてください。",
  },
  "home.banner3Title": {
    en: "Special Offers",
    uk: "Спеціальні пропозиції",
    pl: "Oferty specjalne",
    jp: "特別オファー",
  },
  "home.banner3Description": {
    en: "Get up to 40% off on selected items. Limited time offer.",
    uk: "Знижки до 40% на вибрані товари. Пропозиція обмежена в часі.",
    pl: "Zniżki do 40% na wybrane produkty. Oferta ograniczona czasowo.",
    jp: "対象商品が最大40%オフ。期間限定オファー。",
  },
  "home.shopNow": {
    en: "Shop Now",
    uk: "Купити зараз",
    pl: "Kup teraz",
    jp: "今すぐ購入",
  },
  "home.explore": {
    en: "Explore",
    uk: "Досліджувати",
    pl: "Odkryj",
    jp: "探索する",
  },
  "home.viewOffers": {
    en: "View Offers",
    uk: "Переглянути пропозиції",
    pl: "Zobacz oferty",
    jp: "オファーを見る",
  },

  // Categories translations
  "common.categories": {
    en: "Categories",
    uk: "Категорії",
    pl: "Kategorie",
    jp: "カテゴリー",
  },
  "categories.clothing": {
    en: "Clothing",
    uk: "Одяг",
    pl: "Odzież",
    jp: "衣類",
  },
  "categories.electronics": {
    en: "Electronics",
    uk: "Електроніка",
    pl: "Elektronika",
    jp: "電子機器",
  },
  "categories.accessories": {
    en: "Accessories",
    uk: "Аксесуари",
    pl: "Akcesoria",
    jp: "アクセサリー",
  },
  "categories.footwear": {
    en: "Footwear",
    uk: "Взуття",
    pl: "Obuwie",
    jp: "履物",
  },

  // Contact translations
  "contact.addressLabel": {
    en: "Address",
    uk: "Адреса",
    pl: "Adres",
    jp: "住所",
  },
  "contact.address": {
    en: "Lviv, Dzherelna, 69",
    uk: "Львів, Джерельна, 69",
    pl: "Lwów, Dzherelna, 69",
    jp: "リヴィウ、ジェレルナ、69",
  },
  "contact.phoneLabel": {
    en: "Phone",
    uk: "Телефон",
    pl: "Telefon",
    jp: "電話",
  },
  "contact.phone": {
    en: "+380 32 123 4567",
    uk: "+380 32 123 4567",
    pl: "+380 32 123 4567",
    jp: "+380 32 123 4567",
  },
  "contact.emailLabel": {
    en: "Email",
    uk: "Електронна пошта",
    pl: "Email",
    jp: "メール",
  },
  "contact.email": {
    en: "hello@u-do.store",
    uk: "hello@u-do.store",
    pl: "hello@u-do.store",
    jp: "hello@u-do.store",
  },
  "contact.contactInfo": {
    en: "Contact Information",
    uk: "Контактна інформація",
    pl: "Informacje kontaktowe",
    jp: "連絡先情報",
  },
  "contact.businessHours": {
    en: "Business Hours",
    uk: "Години роботи",
    pl: "Godziny otwarcia",
    jp: "営業時間",
  },
  "contact.mondayFriday": {
    en: "Monday-Friday: 9:00 - 18:00",
    uk: "Понеділок-П'ятниця: 9:00 - 18:00",
    pl: "Poniedziałek-Piątek: 9:00 - 18:00",
    jp: "月曜日〜金曜日：9:00 - 18:00",
  },
  "contact.saturday": {
    en: "Saturday: 10:00 - 16:00",
    uk: "Субота: 10:00 - 16:00",
    pl: "Sobota: 10:00 - 16:00",
    jp: "土曜日：10:00 - 16:00",
  },
  "contact.sunday": {
    en: "Sunday: Closed",
    uk: "Неділя: Вихідний",
    pl: "Niedziela: Zamknięte",
    jp: "日曜日：休業",
  },
  "contact.closed": {
    en: "Closed",
    uk: "Вихідний",
    pl: "Zamknięte",
    jp: "休業",
  },
  getInTouch: {
    en: "We're always open to collaboration! Send your inquiry here:",
    uk: "Завжди відкриті до співпраці! Ваш запит надсилайте сюди:",
    pl: "Zawsze jesteśmy otwarci na współpracę! Wyślij swoje zapytanie tutaj:",
    jp: "常にコラボレーションに開かれています！お問い合わせはこちらへ：",
  },
  sendMessage: {
    en: "Send us a message",
    uk: "Надіслати повідомлення",
    pl: "Wyślij nam wiadomość",
    jp: "メッセージを送信",
  },
  subject: {
    en: "Subject",
    uk: "Тема",
    pl: "Temat",
    jp: "件名",
  },
  message: {
    en: "Message",
    uk: "Повідомлення",
    pl: "Wiadomość",
    jp: "メッセージ",
  },
  sending: {
    en: "Sending...",
    uk: "Надсилання...",
    pl: "Wysyłanie...",
    jp: "送信中...",
  },
  thankYou: {
    en: "Thank You!",
    uk: "Дякуємо!",
    pl: "Dziękujemy!",
    jp: "ありがとうございます！",
  },
  messageSent: {
    en: "Your message has been sent successfully. We'll get back to you soon.",
    uk: "Ваше повідомлення успішно надіслано. Ми скоро з вами зв'яжемося.",
    pl: "Twoja wiadomość została wysłana pomyślnie. Wkrótce się z Tobą skontaktujemy.",
    jp: "メッセージが正常に送信されました。すぐにご連絡いたします。",
  },
  sendAnother: {
    en: "Send Another Message",
    uk: "Надіслати ще одне повідомлення",
    pl: "Wyślij kolejną wiadomość",
    jp: "別のメッセージを送信",
  },
  reachOut: {
    en: "Feel free to reach out to us through any of the following channels. Our customer service team is available Monday through Friday, 9am to 5pm.",
    uk: "Не соромтеся звертатися до нас через будь-який із наступних каналів. Наша служба підтримки клієнтів працює з понеділка по п'ятницю, з 9:00 до 17:00.",
    pl: "Skontaktuj się z nami za pośrednictwem dowolnego z poniższych kanałów. Nasz zespół obsługi klienta jest dostępny od poniedziałku do piątku, od 9:00 do 17:00.",
    jp: "以下のいずれかのチャネルからお気軽にお問い合わせください。カスタマーサービスチームは月曜日から金曜日の午前9時から午後5時まで対応しています。",
  },
  emailUs: {
    en: "Email Us",
    uk: "Напишіть нам",
    pl: "Napisz do nas",
    jp: "メールでのお問い合わせ",
  },
  callUs: {
    en: "Call Us",
    uk: "Зателефонуйте нам",
    pl: "Zadzwoń do nas",
    jp: "お電話でのお問い合わせ",
  },
  visitUs: {
    en: "Visit Us",
    uk: "Відвідайте нас",
    pl: "Odwiedź nas",
    jp: "店舗へのご来店",
  },

  // Common translations
  "common.allRightsReserved": {
    en: "All rights reserved",
    uk: "Всі права захищені",
    pl: "Wszelkie prawa zastrzeżone",
    jp: "無断複写・転載を禁じます",
  },

  // Slider navigation translations
  "common.previousSlide": {
    en: "Previous slide",
    uk: "Попередній слайд",
    pl: "Poprzedni slajd",
    jp: "前のスライド",
  },
  "common.nextSlide": {
    en: "Next slide",
    uk: "Наступний слайд",
    pl: "Następny slajd",
    jp: "次のスライド",
  },
  "common.goToSlide": {
    en: "Go to slide {slideNumber}",
    uk: "Перейти до слайду {slideNumber}",
    pl: "Przejdź do slajdu {slideNumber}",
    jp: "スライド{slideNumber}に移動",
  },

  // Common action translations
  "common.saving": {
    en: "Saving...",
    uk: "Збереження...",
    pl: "Zapisywanie...",
    jp: "保存中...",
  },
  "common.deleting": {
    en: "Deleting...",
    uk: "Видалення...",
    pl: "Usuwanie...",
    jp: "削除中...",
  },
  "common.cancel": {
    en: "Cancel",
    uk: "Скасувати",
    pl: "Anuluj",
    jp: "キャンセル",
  },

  close: {
    en: "Close",
    uk: "Закрити",
    pl: "Zamknij",
    jp: "閉じる",
  },
  "common.backToHome": {
    en: "Back to Home",
    uk: "На головну",
    pl: "Powrót do strony głównej",
    jp: "ホームに戻る",
  },
  "common.surpriseMe": {
    en: "Surprise Me",
    uk: "Здивуй мене",
    pl: "Zaskocz mnie",
    jp: "サプライズ",
  },
};

// Product related translations
export const products: Translations = {
  ourProducts: {
    en: "Our Products",
    uk: "Наші товари",
    pl: "Nasze produkty",
    jp: "私たちの製品",
  },
  browseCollection: {
    en: "Browse our collection of high-quality products",
    uk: "Перегляньте нашу колекцію високоякісних товарів",
    pl: "Przeglądaj naszą kolekcję wysokiej jakości produktów",
    jp: "高品質な製品コレクションをご覧ください",
  },
  addToCart: {
    en: "Add to Cart",
    uk: "Додати в кошик",
    pl: "Dodaj do koszyka",
  },
  filters: {
    en: "Filters",
    uk: "Фільтри",
    pl: "Filtry",
  },
  categories: {
    en: "Categories",
    uk: "Категорії",
    pl: "Kategorie",
  },
  brands: {
    en: "Brands",
    uk: "Бренди",
    pl: "Marki",
  },
  priceRange: {
    en: "Price Range",
    uk: "Ціновий діапазон",
    pl: "Zakres cenowy",
  },
  to: {
    en: "to",
    uk: "до",
    pl: "do",
  },
  clearFilters: {
    en: "Clear Filters",
    uk: "Очистити фільтри",
    pl: "Wyczyść filtry",
  },
  applyFilters: {
    en: "Apply Filters",
    uk: "Застосувати фільтри",
    pl: "Zastosuj filtry",
  },
  sortBy: {
    en: "Sort by",
    uk: "Сортувати за",
    pl: "Sortuj według",
  },
  featured: {
    en: "Featured",
    uk: "Рекомендовані",
    pl: "Polecane",
  },
  priceLowToHigh: {
    en: "Price: Low to High",
    uk: "Ціна: від низької до високої",
    pl: "Cena: od najniższej do najwyższej",
  },
  priceHighToLow: {
    en: "Price: High to Low",
    uk: "Ціна: від високої до низької",
    pl: "Cena: od najwyższej do najniższej",
  },
  newest: {
    en: "Newest",
    uk: "Найновіші",
    pl: "Najnowsze",
  },
  highestRated: {
    en: "Highest Rated",
    uk: "Найвищий рейтинг",
    pl: "Najwyżej oceniane",
  },
  noProductsFound: {
    en: "No products found",
    uk: "Товарів не знайдено",
    pl: "Nie znaleziono produktów",
  },
  search: {
    en: "Search",
    uk: "Пошук",
    pl: "Szukaj",
  },
  searchProducts: {
    en: "Search products...",
    uk: "Шукати товари...",
    pl: "Szukaj produktów...",
  },
  new: {
    en: "New",
    uk: "Новинка",
    pl: "Nowość",
  },
  sale: {
    en: "Sale",
    uk: "Знижка",
    pl: "Wyprzedaż",
  },
  narrowDownProducts: {
    en: "Narrow down products by applying filters",
    uk: "Звузьте пошук товарів, застосувавши фільтри",
    pl: "Zawęź produkty, stosując filtry",
  },
  remove: {
    en: "Remove",
    uk: "Видалити",
    pl: "Usuń",
  },
};

// Home page translations
export const home: Translations = {
  summerCollection: {
    en: "Summer Collection 2023",
    uk: "Літня колекція 2023",
    pl: "Kolekcja Letnia 2023",
  },
  discoverArrivals: {
    en: "Discover our latest arrivals with modern designs and premium quality materials.",
    uk: "Відкрийте для себе наші найновіші надходження з сучасним дизайном та матеріалами преміум якості.",
    pl: "Odkryj nasze najnowsze produkty z nowoczesnymi wzorami i materiałami najwyższej jakości.",
  },
  shopNow: {
    en: "Shop Now",
    uk: "Купити зараз",
    pl: "Kup teraz",
  },
  featuredProducts: {
    en: "Featured Products",
    uk: "Рекомендовані товари",
    pl: "Polecane produkty",
  },
  viewAll: {
    en: "View All",
    uk: "Переглянути все",
    pl: "Zobacz wszystko",
    jp: "すべて見る",
  },
  shopByCategory: {
    en: "Shop by Category",
    uk: "Купити за категорією",
    pl: "Kupuj według kategorii",
  },
  products: {
    en: "Products",
    uk: "Товарів",
    pl: "Produktów",
  },
  whyShopWithUs: {
    en: "Why Shop With Us",
    uk: "Чому варто купувати у нас",
    pl: "Dlaczego warto u nas kupować",
    jp: "当店をお選びいただく理由",
  },
  qualityProducts: {
    en: "Quality Products",
    uk: "Якісні товари",
    pl: "Produkty wysokiej jakości",
    jp: "高品質な製品",
  },
  qualityDescription: {
    en: "We ensure that all our products meet the highest quality standards.",
    uk: "Ми гарантуємо, що всі наші товари відповідають найвищим стандартам якості.",
    pl: "Gwarantujemy, że wszystkie nasze produkty spełniają najwyższe standardy jakości.",
    jp: "すべての製品が最高品質の基準を満たすことを保証します。",
  },
  fastDelivery: {
    en: "Fast Delivery",
    uk: "Швидка доставка",
    pl: "Szybka dostawa",
    jp: "迅速な配送",
  },
  deliveryDescription: {
    en: "Get your products delivered to your doorstep within 2-3 business days.",
    uk: "Отримайте ваші товари з доставкою до дверей протягом 2-3 робочих днів.",
    pl: "Otrzymaj swoje produkty z dostawą pod drzwi w ciągu 2-3 dni roboczych.",
    jp: "2〜3営業日以内にご自宅まで製品をお届けします。",
  },
  securePayment: {
    en: "Secure Payment",
    uk: "Безпечна оплата",
    pl: "Bezpieczna płatność",
    jp: "安全な支払い",
  },
  paymentDescription: {
    en: "All transactions are processed through secure and trusted payment gateways.",
    uk: "Всі транзакції обробляються через безпечні та надійні платіжні шлюзи.",
    pl: "Wszystkie transakcje są przetwarzane przez bezpieczne i zaufane bramki płatności.",
    jp: "すべての取引は、安全で信頼できる決済ゲートウェイを通じて処理されます。",
  },
  subscribeNewsletter: {
    en: "Subscribe to Our Newsletter",
    uk: "Підпишіться на нашу розсилку",
    pl: "Zapisz się do naszego newslettera",
  },
  stayUpdated: {
    en: "Stay updated with our latest products and exclusive offers.",
    uk: "Будьте в курсі наших найновіших товарів та ексклюзивних пропозицій.",
    pl: "Bądź na bieżąco z naszymi najnowszymi produktami i ekskluzywnymi ofertami.",
  },
  yourEmail: {
    en: "Your email address",
    uk: "Ваша електронна адреса",
    pl: "Twój adres e-mail",
  },
  subscribe: {
    en: "Subscribe",
    uk: "Підписатися",
    pl: "Zapisz się",
  },
  "home.banner2Title": {
    en: "New Arrivals",
    uk: "Нові надходження",
    pl: "Nowości",
    jp: "新着商品",
  },
  "home.banner2Description": {
    en: "Check out our newest products with exclusive designs and limited editions.",
    uk: "Перегляньте наші найновіші продукти з ексклюзивним дизайном та обмеженими виданнями.",
    pl: "Sprawdź nasze najnowsze produkty z ekskluzywnymi wzorami i limitowanymi edycjami.",
    jp: "限定デザインと限定版の最新製品をチェックしてください。",
  },
  "home.explore": {
    en: "Explore",
    uk: "Досліджувати",
    pl: "Odkryj",
    jp: "探索する",
  },
};

// About page translations
export const about: Translations = {
  ourStory: {
    en: "Our Story",
    uk: "Наша історія",
    pl: "Nasza historia",
  },
  ourValues: {
    en: "Our Values",
    uk: "Наші цінності",
    pl: "Nasze wartości",
  },
  ourTeam: {
    en: "Our Team",
    uk: "Наша команда",
    pl: "Nasz zespół",
  },
  "about.title": {
    en: "About U:DO",
    uk: "Про Ю:ДУ",
    pl: "O U:DO",
    jp: "U:DOについて",
  },
  "about.lead": {
    en: "We simply do what we love and what we live for. That's why we know exactly what comfort is.",
    uk: "Ми просто робимо те, що любимо і чим живемо. Тому точно знаємо, що таке комфорт.",
    pl: "Po prostu robimy to, co kochamy i czym żyjemy. Dlatego dokładnie wiemy, czym jest komfort.",
    jp: "私たちは単に、愛していることと生きていることをしています。だからこそ、快適さとは何かを正確に知っています。",
  },
  "about.missionTitle": {
    en: "Our Mission",
    uk: "Наша місія",
    pl: "Nasza misja",
    jp: "私たちの使命",
  },
  "about.missionDescription": {
    en: "Quality. Comfort. Uniqueness. — these are the three pillars on which the U:DO brand is built.",
    uk: "Якість. Комфорт. Унікальність. — три кити, на яких побудований бренд U:Do",
    pl: "Jakość. Komfort. Unikalność. — to trzy filary, na których zbudowana jest marka U:DO.",
    jp: "品質。快適さ。独自性。— これらはU:DOブランドが構築されている3つの柱です。",
  },
  "about.storyTitle": {
    en: "Our Story",
    uk: "Наша історія",
    pl: "Nasza historia",
    jp: "私たちの物語",
  },
  "about.storyPart1": {
    en: "We create comfortable, durable clothing that can be diversified with prints and patches.",
    uk: "Це зручний, довговічний одяг, який можна урізноманітнювати принтами та нашивками.",
    pl: "Tworzymy wygodną, trwałą odzież, którą można urozmaicać nadrukami i naszywkami.",
    jp: "プリントやパッチで多様化できる快適で耐久性のある衣類を作っています。",
  },
  "about.storyPart2": {
    en: "Accessories are a separate pleasure. The best complement to looks, with pleasant accents. We think through the details, hone our skills, choose the best materials, and perform tailoring — all as if for ourselves and friends.",
    uk: "Аксесуари — це окрема насолода. Найкраще доповнення образів, приємними акцентами. Продумуємо дрібниці, відточуємо майстерність, обираємо найкращі матеріали, виконуємо пошив — все як для себе і друзів.",
    pl: "Akcesoria to osobna przyjemność. Najlepsze uzupełnienie stylizacji, z przyjemnymi akcentami. Przemyśliwujemy szczegóły, doskonalimy umiejętności, wybieramy najlepsze materiały i wykonujemy szycie — wszystko jak dla siebie i przyjaciół.",
    jp: "アクセサリーは別の喜びです。心地よいアクセントで、ルックスを最高に補完します。細部まで考え抜き、技術を磨き、最高の素材を選び、縫製を行います — すべて自分たちや友人のためのように。",
  },
  "about.established": {
    en: "Est. 2020",
    uk: "Засн. 2020",
    pl: "Zał. 2020",
    jp: "設立 2020年",
  },
  "about.premiumQuality": {
    en: "Premium Quality",
    uk: "Преміум якість",
    pl: "Najwyższa jakość",
    jp: "プレミアム品質",
  },
  "about.customerFirst": {
    en: "Customer First",
    uk: "Клієнт перш за все",
    pl: "Klient na pierwszym miejscu",
    jp: "お客様第一",
  },
  "about.teamImageAlt": {
    en: "Our team working together",
    uk: "Наша команда працює разом",
    pl: "Nasz zespół pracujący razem",
    jp: "チームで協力する私たち",
  },
  "about.valuesTitle": {
    en: "Our Values",
    uk: "Наші цінності",
    pl: "Nasze wartości",
    jp: "私たちの価値観",
  },
  "about.valueQualityTitle": {
    en: "Quality",
    uk: "Якість",
    pl: "Jakość",
    jp: "品質",
  },
  "about.valueQualityDescription": {
    en: "We never compromise on quality. Every product in our catalog is carefully selected and tested to ensure it meets our high standards.",
    uk: "Ми ніколи не йдемо на компроміс щодо якості. Кожен продукт у нашому каталозі ретельно відібраний і перевірений, щоб переконатися, що він відповідає нашим високим стандартам.",
    pl: "Nigdy nie idziemy na kompromis w kwestii jakości. Każdy produkt w naszym katalogu jest starannie wyselekcjonowany i przetestowany, aby upewnić się, że spełnia nasze wysokie standardy.",
    jp: "私たちは品質に妥協しません。カタログ内のすべての製品は、高い基準を満たしていることを確認するために慎重に選択され、テストされています。",
  },
  "about.valueSustainabilityTitle": {
    en: "Sustainability",
    uk: "Стійкість",
    pl: "Zrównoważony rozwój",
    jp: "持続可能性",
  },
  "about.valueSustainabilityDescription": {
    en: "We're committed to reducing our environmental impact through sustainable practices, eco-friendly packaging, and partnering with responsible suppliers.",
    uk: "Ми прагнемо зменшити наш вплив на навколишнє середовище за допомогою стійких практик, екологічно чистої упаковки та партнерства з відповідальними постачальниками.",
    pl: "Jesteśmy zaangażowani w zmniejszanie naszego wpływu na środowisko poprzez zrównoważone praktyki, ekologiczne opakowania i współpracę z odpowiedzialnymi dostawcami.",
    jp: "持続可能な実践、環境に優しい包装、責任あるサプライヤーとのパートナーシップを通じて、環境への影響を減らすことに取り組んでいます。",
  },
  "about.valueCustomerTitle": {
    en: "Customer First",
    uk: "Клієнт перш за все",
    pl: "Klient na pierwszym miejscu",
    jp: "お客様第一",
  },
  "about.valueCustomerDescription": {
    en: "Your satisfaction is our priority. We strive to provide exceptional service, transparent policies, and a seamless shopping experience.",
    uk: "Ваше задоволення - наш пріоритет. Ми прагнемо забезпечити винятковий сервіс, прозорі політики та безперебійний досвід покупок.",
    pl: "Twoje zadowolenie jest naszym priorytetem. Dążymy do zapewnienia wyjątkowej obsługi, przejrzystych zasad i płynnego doświadczenia zakupowego.",
    jp: "お客様の満足は私たちの優先事項です。私たちは、優れたサービス、透明性のあるポリシー、シームレスなショッピング体験を提供するよう努めています。",
  },
  "about.faqTitle": {
    en: "Frequently Asked Questions",
    uk: "Часті запитання",
    pl: "Często zadawane pytania",
    jp: "よくある質問",
  },
  "about.faqQuestion1": {
    en: "How did Udo Druk start?",
    uk: "Як почався Удо Друк?",
    pl: "Jak powstało Udo Druk?",
    jp: "Udo Drukはどのように始まりましたか？",
  },
  "about.faqAnswer1": {
    en: "Udo Druk was founded in 2020 by a team of e-commerce enthusiasts who wanted to create a better online shopping experience. We started with just a few products and have since grown to offer a wide range of high-quality items.",
    uk: "Удо Друк був заснований у 2020 році командою ентузіастів електронної комерції, які хотіли створити кращий досвід онлайн-покупок. Ми почали з кількох продуктів і з тих пір виросли, щоб запропонувати широкий спектр високоякісних товарів.",
    pl: "Udo Druk zostało założone w 2020 roku przez zespół entuzjastów e-commerce, którzy chcieli stworzyć lepsze doświadczenie zakupów online. Zaczynaliśmy od kilku produktów, a od tego czasu rozwinęliśmy się, aby oferować szeroki zakres wysokiej jakości przedmiotów.",
    jp: "Udo Drukは、より良いオンラインショッピング体験を作りたいと考えていたeコマース愛好家のチームによって2020年に設立されました。私たちはわずか数製品から始め、それ以来、幅広い高品質のアイテムを提供するまでに成長しました。",
  },
  "about.faqQuestion2": {
    en: "What makes your products different?",
    uk: "Що робить ваші продукти особливими?",
    pl: "Co wyróżnia wasze produkty?",
    jp: "あなたの製品の違いは何ですか？",
  },
  "about.faqAnswer2": {
    en: "We carefully curate every product in our catalog, ensuring they meet our high standards for quality, sustainability, and value. We work directly with manufacturers and artisans to bring you unique items you won't find elsewhere.",
    uk: "Ми ретельно підбираємо кожен продукт у нашому каталозі, переконуючись, що вони відповідають нашим високим стандартам якості, стійкості та цінності. Ми працюємо безпосередньо з виробниками та майстрами, щоб запропонувати вам унікальні товари, яких ви не знайдете в інших місцях.",
    pl: "Starannie selekcjonujemy każdy produkt w naszym katalogu, upewniając się, że spełnia nasze wysokie standardy jakości, zrównoważonego rozwoju i wartości. Współpracujemy bezpośrednio z producentami i rzemieślnikami, aby dostarczyć Ci unikalne przedmioty, których nie znajdziesz nigdzie indziej.",
    jp: "私たちは、カタログ内のすべての製品を慎重に選定し、品質、持続可能性、価値に関する高い基準を満たしていることを確認しています。私たちは製造業者や職人と直接協力して、他では見つからないユニークなアイテムをお届けします。",
  },
  "about.faqQuestion3": {
    en: "Do you ship internationally?",
    uk: "Чи здійснюєте ви міжнародну доставку?",
    pl: "Czy wysyłacie produkty za granicę?",
    jp: "国際配送はしていますか？",
  },
  "about.faqAnswer3": {
    en: "Yes, we ship to most countries worldwide. Shipping times and costs vary depending on your location. You can view specific shipping information during checkout.",
    uk: "Так, ми доставляємо товари в більшість країн світу. Час доставки та вартість залежать від вашого місцезнаходження. Ви можете переглянути конкретну інформацію про доставку під час оформлення замовлення.",
    pl: "Tak, wysyłamy do większości krajów na całym świecie. Czasy i koszty wysyłki różnią się w zależności od Twojej lokalizacji. Możesz zobaczyć szczegółowe informacje o wysyłce podczas finalizacji zakupu.",
    jp: "はい、世界中のほとんどの国に発送しています。配送時間と費用は、お住まいの場所によって異なります。チェックアウト時に特定の配送情報を確認できます。",
  },
  "about.teamTitle": {
    en: "Our Team",
    uk: "Наша команда",
    pl: "Nasz zespół",
    jp: "私たちのチーム",
  },
  "about.teamMember1Name": {
    en: "Alex Johnson",
    uk: "Олексій Джонсон",
    pl: "Alex Johnson",
    jp: "アレックス・ジョンソン",
  },
  "about.teamMember1Role": {
    en: "Founder & CEO",
    uk: "Засновник і генеральний директор",
    pl: "Założyciel i dyrektor generalny",
    jp: "創設者兼CEO",
  },
  "about.teamMember2Name": {
    en: "Sarah Chen",
    uk: "Сара Чен",
    pl: "Sarah Chen",
    jp: "サラ・チェン",
  },
  "about.teamMember2Role": {
    en: "Head of Operations",
    uk: "Керівник операцій",
    pl: "Kierownik operacyjny",
    jp: "オペレーション責任者",
  },
  "about.teamMember3Name": {
    en: "Michael Rodriguez",
    uk: "Михайло Родрігес",
    pl: "Michael Rodriguez",
    jp: "マイケル・ロドリゲス",
  },
  "about.teamMember3Role": {
    en: "Product Manager",
    uk: "Менеджер продукту",
    pl: "Kierownik produktu",
    jp: "プロダクトマネージャー",
  },
  "about.teamMember4Name": {
    en: "Emily Patel",
    uk: "Емілі Патель",
    pl: "Emily Patel",
    jp: "エミリー・パテル",
  },
  "about.teamMember4Role": {
    en: "Customer Experience",
    uk: "Досвід клієнтів",
    pl: "Doświadczenie klienta",
    jp: "カスタマーエクスペリエンス",
  },
};

// Contact page translations
export const contact: Translations = {
  "contact.contactUs": {
    en: "Contact Us",
    uk: "Зв'язатися з нами",
    pl: "Kontakt",
    jp: "お問い合わせ",
  },
  "contact.contactInfo": {
    en: "Contact Information",
    uk: "Контактна інформація",
    pl: "Informacje kontaktowe",
    jp: "連絡先情報",
  },
  "contact.address": {
    en: "Lviv, Dzherelna, 69",
    uk: "Львів, Джерельна, 69",
    pl: "Lwów, Dzherelna, 69",
    jp: "リヴィウ、ジェレルナ、69",
  },
  "contact.phone": {
    en: "+380 32 123 4567",
    uk: "+380 32 123 4567",
    pl: "+380 32 123 4567",
    jp: "+380 32 123 4567",
  },
  "contact.email": {
    en: "hello@u-do.store",
    uk: "hello@u-do.store",
    pl: "hello@u-do.store",
    jp: "hello@u-do.store",
  },
  "contact.businessHours": {
    en: "Business Hours",
    uk: "Години роботи",
    pl: "Godziny otwarcia",
    jp: "営業時間",
  },
  "contact.mondayFriday": {
    en: "Monday-Friday: 9:00 - 18:00",
    uk: "Понеділок-П'ятниця: 9:00 - 18:00",
    pl: "Poniedziałek-Piątek: 9:00 - 18:00",
    jp: "月曜日〜金曜日：9:00 - 18:00",
  },
  "contact.saturday": {
    en: "Saturday: 10:00 - 16:00",
    uk: "Субота: 10:00 - 16:00",
    pl: "Sobota: 10:00 - 16:00",
    jp: "土曜日：10:00 - 16:00",
  },
  "contact.sunday": {
    en: "Sunday: Closed",
    uk: "Неділя: Вихідний",
    pl: "Niedziela: Zamknięte",
    jp: "日曜日：休業",
  },
  "contact.closed": {
    en: "Closed",
    uk: "Вихідний",
    pl: "Zamknięte",
    jp: "休業",
  },
  getInTouch: {
    en: "We're always open to collaboration! Send your inquiry here:",
    uk: "Завжди відкриті до співпраці! Ваш запит надсилайте сюди:",
    pl: "Zawsze jesteśmy otwarci na współpracę! Wyślij swoje zapytanie tutaj:",
    jp: "常にコラボレーションに開かれています！お問い合わせはこちらへ：",
  },
  sendMessage: {
    en: "Send us a message",
    uk: "Надіслати повідомлення",
    pl: "Wyślij nam wiadomość",
  },
  subject: {
    en: "Subject",
    uk: "Тема",
    pl: "Temat",
  },
  message: {
    en: "Message",
    uk: "Повідомлення",
    pl: "Wiadomość",
  },
  sending: {
    en: "Sending...",
    uk: "Надсилання...",
    pl: "Wysyłanie...",
  },
  thankYou: {
    en: "Thank You!",
    uk: "Дякуємо!",
    pl: "Dziękujemy!",
  },
  messageSent: {
    en: "Your message has been sent successfully. We'll get back to you soon.",
    uk: "Ваше повідомлення успішно надіслано. Ми скоро з вами зв'яжемося.",
    pl: "Twoja wiadomość została wysłana pomyślnie. Wkrótce się z Tobą skontaktujemy.",
  },
  sendAnother: {
    en: "Send Another Message",
    uk: "Надіслати ще одне повідомлення",
    pl: "Wyślij kolejną wiadomość",
  },
  reachOut: {
    en: "Feel free to reach out to us through any of the following channels. Our customer service team is available Monday through Friday, 9am to 5pm.",
    uk: "Не соромтеся звертатися до нас через будь-який із наступних каналів. Наша служба підтримки клієнтів працює з понеділка по п'ятницю, з 9:00 до 17:00.",
    pl: "Skontaktuj się z nami za pośrednictwem dowolnego z poniższych kanałów. Nasz zespół obsługi klienta jest dostępny od poniedziałku do piątku, od 9:00 do 17:00.",
    jp: "以下のいずれかのチャネルからお気軽にお問い合わせください。カスタマーサービスチームは月曜日から金曜日の午前9時から午後5時まで対応しています。",
  },
  emailUs: {
    en: "Email Us",
    uk: "Напишіть нам",
    pl: "Napisz do nas",
    jp: "メールでのお問い合わせ",
  },
  callUs: {
    en: "Call Us",
    uk: "Зателефонуйте нам",
    pl: "Zadzwoń do nas",
    jp: "お電話でのお問い合わせ",
  },
  visitUs: {
    en: "Visit Us",
    uk: "Відвідайте нас",
    pl: "Odwiedź nas",
    jp: "店舗へのご来店",
  },
};

// Authentication translations
export const auth: Translations = {
  authRequired: {
    en: "Authentication Required",
    uk: "Потрібна автентифікація",
    pl: "Wymagane uwierzytelnienie",
  },
  pleaseSignIn: {
    en: "Please sign in or create an account to continue",
    uk: "Будь ласка, увійдіть або створіть обліковий запис, щоб продовжити",
    pl: "Zaloguj się lub utwórz konto, aby kontynuować",
  },
  signUp: {
    en: "Sign Up",
    uk: "Зареєструватися",
    pl: "Zarejestruj się",
  },
  password: {
    en: "Password",
    uk: "Пароль",
    pl: "Hasło",
  },
  forgotPassword: {
    en: "Forgot password?",
    uk: "Забули пароль?",
    pl: "Zapomniałeś hasła?",
  },
  termsNotice: {
    en: "By continuing, you agree to our Terms of Service and Privacy Policy",
    uk: "Продовжуючи, ви погоджуєтеся з нашими Умовами використання та Політикою конфіденційності",
    pl: "Kontynuując, zgadzasz się na nasze Warunki korzystania z usługi i Politykę prywatności",
  },
  welcomeGuest: {
    en: "Welcome, Guest!",
    uk: "Вітаємо, Гість!",
    pl: "Witaj, Gościu!",
    jp: "ようこそ、ゲストさん！",
  },
  welcomeGuestDescription: {
    en: "In your personal account, you can track orders and add our products to your favorites",
    uk: "В особистому кабінеті ти можеш відслідковувати замовлення та додавати до улюbлених наші товари",
    pl: "W swoim koncie osobistym możesz śledzić zamówienia i dodawać nasze produkty do ulubionych",
    jp: "個人アカウントでは、注文を追跡し、お気に入りに製品を追加できます",
  },
  login: {
    en: "Login",
    uk: "Увійти",
    pl: "Zaloguj się",
    jp: "ログイン",
  },
  accountBenefits: {
    en: "Sign in to access your orders, favorites, and personalized settings.",
    uk: "Увійдіть, щоб отримати доступ до замовлень, улюбленого та персоналізованих налаштувань.",
    pl: "Zaloguj się, aby uzyskać dostęp do zamówień, ulubionych i spersonalizowanych ustawień.",
  },
};

// Favorites translations
export const favorites: Translations = {
  noFavoritesYet: {
    en: "No favorites yet",
    uk: "Поки немає улюблених",
    pl: "Brak ulubionych",
  },
  startBrowsing: {
    en: "Start browsing our products and add items to your favorites",
    uk: "Почніть переглядати наші товари та додавайте їх до улюbлених",
    pl: "Zacznij przeglądać nasze produkty i dodawaj je do ulubionych",
  },
};

// Menu translations
export const menu: Translations = {
  navigation: {
    en: "Navigation",
    uk: "Навігація",
    pl: "Nawigacja",
    jp: "ナビゲーション",
  },
  quickLinks: {
    en: "Quick Links",
    uk: "Швидкі посилання",
    pl: "Szybkie linki",
    jp: "クイックリンク",
  },
  followUs: {
    en: "Follow Us",
    uk: "Слідкуйте за нами",
    pl: "Obserwuj nas",
    jp: "フォローする",
  },
  ourLocations: {
    en: "Our Locations",
    uk: "Наші локації",
    pl: "Nasze lokalizacje",
    jp: "所在地",
  },
  contactUs: {
    en: "Contact Us",
    uk: "Зв'язатися з нами",
    pl: "Kontakt",
    jp: "お問い合わせ",
  },
  preferences: {
    en: "Preferences",
    uk: "Налаштування",
    pl: "Preferencje",
    jp: "設定",
  },
  viewAllLocations: {
    en: "View All Locations",
    uk: "Переглянути всі локації",
    pl: "Zobacz wszystkie lokalizacje",
    jp: "すべての所在地を見る",
  },
  admin: {
    en: "Admin",
    uk: "Адміністратор",
    pl: "Administrator",
    jp: "管理者",
  },
  backToHome: {
    en: "Back to Home",
    uk: "На головну",
    pl: "Powrót do strony głównej",
    jp: "ホームに戻る",
  },
  adminSettings: {
    en: "Admin Settings",
    uk: "Налаштування адміністратора",
    pl: "Ustawienia administratora",
    jp: "管理者設定",
  },
  language: {
    en: "Language",
    uk: "Мова",
    pl: "Język",
    jp: "言語",
  },
  currency: {
    en: "Currency",
    uk: "Валюта",
    pl: "Waluta",
    jp: "通貨",
  },
};

// User related translations
export const user: Translations = {
  manageAccount: {
    en: "Manage Account",
    uk: "Керувати акаунтом",
    pl: "Zarządzaj kontem",
    jp: "アカウント管理",
  },
  orders: {
    en: "Orders",
    uk: "Замовлення",
    pl: "Zamówienia",
    jp: "注文履歴",
  },
  settings: {
    en: "Settings",
    uk: "Налаштування",
    pl: "Ustawienia",
    jp: "設定",
  },
  helpSupport: {
    en: "Help & Support",
    uk: "Допомога та підтримка",
    pl: "Pomoc i wsparcie",
    jp: "ヘルプとサポート",
  },
  "user.coins": {
    en: "Coins",
    uk: "Монети",
    pl: "Monety",
    jp: "コイン",
  },
  "user.ambassador": {
    en: "Ambassador",
    uk: "Амбасадор",
    pl: "Ambasador",
    jp: "アンバサダー",
  },
  "user.viewAs": {
    en: "View as:",
    uk: "Переглянути як:",
    pl: "Wyświetl jako:",
    jp: "表示モード:",
  },
  "user.admin": {
    en: "Admin",
    uk: "Адмін",
    pl: "Admin",
    jp: "管理者",
  },
  "user.customer": {
    en: "Customer",
    uk: "Клієнт",
    pl: "Klient",
    jp: "お客様",
  },
  "user.adminMode": {
    en: "Admin mode",
    uk: "Режим адміністратора",
    pl: "Tryb administratora",
    jp: "管理者モード",
  },
  "user.customerMode": {
    en: "Customer mode",
    uk: "Режим клієнта",
    pl: "Tryb klienta",
    jp: "お客様モード",
  },
};

// Legal translations
export const legal: Translations = {
  terms: {
    en: "Terms of Service",
    uk: "Умови використання",
    pl: "Warunki korzystania z usługi",
    jp: "利用規約",
  },
  privacy: {
    en: "Privacy Policy",
    uk: "Політика конфіденційності",
    pl: "Polityka prywatności",
    jp: "プライバシーポリシー",
  },
  cookies: {
    en: "Cookie Policy",
    uk: "Політика використання файлів cookie",
    pl: "Polityka plików cookie",
    jp: "クッキーポリシー",
  },
  accessibility: {
    en: "Accessibility",
    uk: "Доступність",
    pl: "Dostępność",
    jp: "アクセシビリティ",
  },
  deliveryReturns: {
    en: "Delivery & Returns",
    uk: "Доставка та повернення",
    pl: "Dostawa i zwroty",
    jp: "配送と返品",
  },
  allRightsReserved: {
    en: "All Rights Reserved",
    uk: "Всі права захищені",
    pl: "Wszelkie prawa zastrzeżone",
  },
};

// Theme translations
export const theme: Translations = {
  light: {
    en: "Light",
    uk: "Світла",
    pl: "Jasny",
  },
  dark: {
    en: "Dark",
    uk: "Темна",
    pl: "Ciemny",
  },
};

// Currency translations
export const currency: Translations = {
  switchCurrency: {
    en: "Currency",
    uk: "Валюта",
    pl: "Waluta",
    jp: "通貨",
  },
  usd: {
    en: "US Dollar",
    uk: "Долар США",
    pl: "Dolar amerykański",
    jp: "米ドル",
  },
  eur: {
    en: "Euro",
    uk: "Євро",
    pl: "Euro",
    jp: "ユーロ",
  },
  uah: {
    en: "Ukrainian Hryvnia",
    uk: "Українська гривня",
    pl: "Hrywna ukraińska",
    jp: "ウクライナ・フリヴニャ",
  },
};

// Error messages
export const error: Translations = {
  pageNotFound: {
    en: "Page Not Found",
    uk: "Сторінку не знайдено",
    pl: "Strona nie znaleziona",
    jp: "ページが見つかりません",
  },
  pageNotFoundDescription: {
    en: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
    uk: "Сторінка, яку ви шукаєте, могла бути видалена, перейменована або тимчасово недоступна.",
    pl: "Strona, której szukasz, mogła zostać usunięta, zmieniona nazwa lub jest tymczasowo niedostępna.",
    jp: "お探しのページは削除されたか、名前が変更されたか、一時的に利用できない可能性があります。",
  },
  surpriseMeDescription: {
    en: "The Surprise Me button will select random print and clothing variations in our builder",
    uk: "Кнопка 'Здивуй мене' вибере випадкові варіанти принтів та одягу в нашому конструкторі",
    pl: "Przycisk 'Zaskocz mnie' wybierze losowe warianty nadruków i ubrań w naszym kreatorze",
    jp: "「サプライズ」ボタンを押すと、ビルダーでランダムなプリントと衣類のバリエーションが選択されます",
  },
};

// Locations
export const locations: Translations = {
  "locations.lvivOffice": {
    en: "Lviv Office",
    uk: "Офіс у Львові",
    pl: "Biuro we Lwowie",
    jp: "リヴィウオフィス",
  },
  "locations.lvivAddress": {
    en: "Shevchenko St. 123, Lviv, 79000",
    uk: "вул. Шевченка 123, Львів, 79000",
    pl: "ul. Szewczenki 123, Lwów, 79000",
    jp: "シェフチェンコ通り123、リヴィウ、79000",
  },
  "locations.lvivPhone": {
    en: "+380 32 123 4567",
    uk: "+380 32 123 4567",
    pl: "+380 32 123 4567",
    jp: "+380 32 123 4567",
  },
  "locations.zaporizhiaProduction": {
    en: "Zaporizhia Production",
    uk: "Виробництво у Запоріжжі",
    pl: "Produkcja w Zaporożu",
    jp: "ザポリージャ生産施設",
  },
  "locations.zaporizhiaAddress": {
    en: "Peremohy St. 45, Zaporizhia, 69000",
    uk: "вул. Перемоги 45, Запоріжжя, 69000",
    pl: "ul. Zwycięstwa 45, Zaporoże, 69000",
    jp: "ペレモギ通り45、ザポリージャ、69000",
  },
  "locations.zaporizhiaPhone": {
    en: "+380 61 765 4321",
    uk: "+380 61 765 4321",
    pl: "+380 61 765 4321",
    jp: "+380 61 765 4321",
  },
};

// Social media translations
export const social: Translations = {
  instagram: {
    en: "Instagram",
    uk: "Інстаграм",
    pl: "Instagram",
    jp: "インスタグラム",
  },
  tiktok: {
    en: "TikTok",
    uk: "ТікТок",
    pl: "TikTok",
    jp: "ティックトック",
  },
  telegram: {
    en: "Telegram",
    uk: "Телеграм",
    pl: "Telegram",
    jp: "テレグラム",
  },
  facebook: {
    en: "Facebook",
    uk: "Фейсбук",
    pl: "Facebook",
    jp: "フェイスブック",
  },
  twitter: {
    en: "Twitter",
    uk: "Твіттер",
    pl: "Twitter",
    jp: "ツイッター",
  },
};

// Admin translations
export const admin: Translations = {
  managePrints: {
    en: "Manage Prints",
    uk: "Управління принтами",
    pl: "Zarządzaj nadrukami",
    jp: "プリント管理",
  },
  addNewPrint: {
    en: "Add New Print",
    uk: "Додати новий принт",
    pl: "Dodaj nowy nadruk",
    jp: "新しいプリントを追加",
  },
  searchPrints: {
    en: "Search prints...",
    uk: "Пошук принтів...",
    pl: "Szukaj nadruków...",
    jp: "プリントを検索...",
  },
  preview: {
    en: "Preview",
    uk: "Перегляд",
    pl: "Podgląd",
    jp: "プレビュー",
  },
  name: {
    en: "Name",
    uk: "Назва",
    pl: "Nazwa",
    jp: "名前",
  },
  description: {
    en: "Description",
    uk: "Опис",
    pl: "Opis",
    jp: "説明",
  },
  created: {
    en: "Created",
    uk: "Створено",
    pl: "Utworzono",
    jp: "作成日",
  },
  updated: {
    en: "Updated",
    uk: "Оновлено",
    pl: "Zaktualizowano",
    jp: "更新日",
  },
  actions: {
    en: "Actions",
    uk: "Дії",
    pl: "Akcje",
    jp: "アクション",
  },
  edit: {
    en: "Edit",
    uk: "Редагувати",
    pl: "Edytuj",
    jp: "編集",
  },
  delete: {
    en: "Delete",
    uk: "Видалити",
    pl: "Usuń",
    jp: "削除",
  },
  noSearchResults: {
    en: "No prints match your search",
    uk: "Немає принтів, що відповідають вашому пошуку",
    pl: "Brak nadruków pasujących do wyszukiwania",
    jp: "検索に一致するプリントはありません",
  },
  noPrints: {
    en: "No prints available",
    uk: "Немає доступних принтів",
    pl: "Brak dostępnych nadruków",
    jp: "利用可能なプリントはありません",
  },
  editPrint: {
    en: "Edit Print",
    uk: "Редагувати принт",
    pl: "Edytuj nadruk",
    jp: "プリントを編集",
  },
  editPrintDescription: {
    en: "Update the details of this print",
    uk: "Оновити деталі цього принту",
    pl: "Zaktualizuj szczegóły tego nadruku",
    jp: "このプリントの詳細を更新する",
  },
  addPrintDescription: {
    en: "Add a new print to your collection",
    uk: "Додати новий принт до вашої колекції",
    pl: "Dodaj nowy nadruk do swojej kolekcji",
    jp: "コレクションに新しいプリントを追加する",
  },
  printName: {
    en: "Print Name",
    uk: "Назва принту",
    pl: "Nazwa nadruku",
    jp: "プリント名",
  },
  printDescription: {
    en: "Print Description",
    uk: "Опис принту",
    pl: "Opis nadruku",
    jp: "プリントの説明",
  },
  svgFile: {
    en: "SVG File",
    uk: "SVG файл",
    pl: "Plik SVG",
    jp: "SVGファイル",
  },
  uploadFile: {
    en: "Upload File",
    uk: "Завантажити файл",
    pl: "Prześlij plik",
    jp: "ファイルをアップロード",
  },
  changeFile: {
    en: "Change File",
    uk: "Змінити файл",
    pl: "Zmień plik",
    jp: "ファイルを変更",
  },
  updatePrint: {
    en: "Update Print",
    uk: "Оновити принт",
    pl: "Zaktualizuj nadruk",
    jp: "プリントを更新",
  },
  createPrint: {
    en: "Create Print",
    uk: "Створити принт",
    pl: "Utwórz nadruk",
    jp: "プリントを作成",
  },
  confirmDelete: {
    en: "Confirm Deletion",
    uk: "Підтвердити видалення",
    pl: "Potwierdź usunięcie",
    jp: "削除の確認",
  },
  deleteConfirmationMessage: {
    en: "Are you sure you want to delete this print? This action cannot be undone.",
    uk: "Ви впевнені, що хочете видалити цей принт? Цю дію не можна скасувати.",
    pl: "Czy na pewno chcesz usunąć ten nadruk? Tej akcji nie można cofnąć.",
    jp: "このプリントを削除してもよろしいですか？この操作は元に戻せません。",
  },
  deletePrint: {
    en: "Delete Print",
    uk: "Видалити принт",
    pl: "Usuń nadruk",
    jp: "プリントを削除",
  },
};

// Function to get a translation
export const getTranslation = (key: string, locale: Locale = 'en'): string => {
  // First check if we have a dynamic translation
  if (dynamicTranslations[key] && dynamicTranslations[key][locale]) {
    return dynamicTranslations[key][locale];
  }

  // Split the key by dot notation (e.g., "common.siteName")
  const parts = key.split('.');
  
  if (parts.length !== 2) {
    console.warn(`Invalid translation key format: ${key}`);
    return key;
  }
  
  const [section, translationKey] = parts;
  
  // Get the translation section
  let translationSection: Record<string, { en: string; uk: string; pl?: string; jp?: string }>;
  switch (section) {
    case 'common':
      translationSection = common;
      break;
    case 'products':
      translationSection = products;
      break;
    case 'home':
      translationSection = home;
      break;
    case 'about':
      translationSection = about;
      break;
    case 'contact':
      translationSection = contact;
      break;
    case 'auth':
      translationSection = auth;
      break;
    case 'favorites':
      translationSection = favorites;
      break;
    case 'menu':
      translationSection = menu;
      break;
    case 'user':
      translationSection = user;
      break;
    case 'legal':
      translationSection = legal;
      break;
    case 'theme':
      translationSection = theme;
      break;
    case 'currency':
      translationSection = currency;
      break;
    case 'error':
      translationSection = error;
      break;
    case 'nav':
      translationSection = common;
      break;
    case 'locations':
      translationSection = locations;
      break;
    case 'social':
      translationSection = social;
      break;
    case 'admin':
      translationSection = admin;
      break;
    default:
      console.warn(`Unknown translation section: ${section}`);
      return key;
  }
  
  // Get the translation
  const translation = translationSection[translationKey];
  
  if (!translation) {
    console.warn(`Missing translation: ${key}`);
    return key;
  }
  
  // Return the translation for the specified locale, or fallback to English
  return translation[locale] || translation.en || key;
};

// Prints page translations
export const prints: Translations = {
  title: {
    en: "Our Prints Collection",
    uk: "Наша колекція принтів",
    pl: "Nasza kolekcja nadruków",
    jp: "プリントコレクション",
  },
  description: {
    en: "Browse our collection of high-quality prints available for your custom products.",
    uk: "Перегляньте нашу колекцію високоякісних принтів для ваших індивідуальних продуктів.",
    pl: "Przeglądaj naszą kolekcję wysokiej jakości nadruków dostępnych dla Twoich niestandardowych produktów.",
    jp: "カスタム製品に使用できる高品質なプリントのコレクションをご覧ください。",
  },
  searchPlaceholder: {
    en: "Search prints...",
    uk: "Пошук принтів...",
    pl: "Szukaj nadruków...",
    jp: "プリントを検索...",
  },
  useThisPrint: {
    en: "Use This Print",
    uk: "Використати цей принт",
    pl: "Użyj tego nadruku",
    jp: "このプリントを使用",
  },
  noResults: {
    en: "No prints found",
    uk: "Принтів не знайдено",
    pl: "Nie znaleziono nadruków",
    jp: "プリントが見つかりません",
  },
  tryDifferentSearch: {
    en: "Try a different search term or browse all prints.",
    uk: "Спробуйте інший пошуковий запит або перегляньте всі принти.",
    pl: "Wypróbuj inny termin wyszukiwania lub przeglądaj wszystkie nadruki.",
    jp: "別の検索語を試すか、すべてのプリントを閲覧してください。",
  },
  clearSearch: {
    en: "Clear Search",
    uk: "Очистити пошук",
    pl: "Wyczyść wyszukiwanie",
    jp: "検索をクリア",
  },
};