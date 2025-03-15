"use client";

import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead,
} from "@/components/ui/typography";
import { FadeIn, SlideUp } from "@/components/ui/motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon, ChevronRightIcon, ScrollTextIcon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function TermsPage() {
  const { t } = useLocale();

  return (
    <FadeIn className="container mx-auto px-4 py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <HomeIcon className="h-4 w-4 mr-1" />
              {t("common.home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{t("legal.terms")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TypographyH1 className="mb-6 text-center flex items-center justify-center">
        <ScrollTextIcon className="mr-2 h-8 w-8" />
        {t("legal.terms")}
      </TypographyH1>

      <SlideUp delay={0.1}>
        <TypographyLead className="text-center mb-8 max-w-3xl mx-auto">
          Будь ласка, уважно прочитайте ці умови використання перед
          використанням нашого сайту та послуг.
        </TypographyLead>
      </SlideUp>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <TypographyH2 className="mb-4">1. Загальні положення</TypographyH2>
          <TypographyP className="mb-4">
            1.1. Ці Умови використання (далі - "Умови") регулюють відносини між
            U:DO (далі - "Компанія", "ми", "нас" або "наш") та користувачами
            (далі - "Користувач", "ви" або "ваш") нашого веб-сайту, мобільних
            додатків та інших пов'язаних послуг (далі - "Послуги").
          </TypographyP>
          <TypographyP className="mb-4">
            1.2. Використовуючи наші Послуги, ви погоджуєтесь з цими Умовами.
            Якщо ви не згодні з цими Умовами, будь ласка, не використовуйте наші
            Послуги.
          </TypographyP>
          <TypographyP className="mb-4">
            1.3. Ми можемо змінювати ці Умови в будь-який час. Зміни набувають
            чинності після їх публікації на нашому веб-сайті. Продовження
            використання наших Послуг після внесення змін означає вашу згоду з
            оновленими Умовами.
          </TypographyP>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <TypographyH2 className="mb-4">
            2. Реєстрація та облікові записи
          </TypographyH2>
          <TypographyP className="mb-4">
            2.1. Для використання деяких функцій наших Послуг вам може
            знадобитися створити обліковий запис. Ви зобов'язуєтесь надавати
            точну, актуальну та повну інформацію під час реєстрації та
            підтримувати її в актуальному стані.
          </TypographyP>
          <TypographyP className="mb-4">
            2.2. Ви несете відповідальність за збереження конфіденційності
            вашого пароля та за всі дії, які відбуваються під вашим обліковим
            записом.
          </TypographyP>
          <TypographyP className="mb-4">
            2.3. Ми залишаємо за собою право видалити або заблокувати ваш
            обліковий запис у разі порушення цих Умов або неактивності протягом
            тривалого періоду.
          </TypographyP>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <TypographyH2 className="mb-4">3. Замовлення та оплата</TypographyH2>
          <TypographyP className="mb-4">
            3.1. Розміщуючи замовлення через наші Послуги, ви підтверджуєте, що
            маєте законне право здійснювати покупки та використовувати обрані
            способи оплати.
          </TypographyP>
          <TypographyP className="mb-4">
            3.2. Ціни на товари та послуги вказані в українській гривні (UAH) та
            включають ПДВ, якщо не зазначено інше.
          </TypographyP>
          <TypographyP className="mb-4">
            3.3. Ми залишаємо за собою право змінювати ціни, відхиляти або
            скасовувати замовлення на наш розсуд, особливо у випадках підозри на
            шахрайство або помилки в ціноутворенні.
          </TypographyP>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <TypographyH2 className="mb-4">
            4. Доставка та повернення
          </TypographyH2>
          <TypographyP className="mb-4">
            4.1. Ми докладаємо всіх зусиль для забезпечення своєчасної доставки
            замовлень, але не гарантуємо конкретних термінів доставки, якщо це
            не зазначено окремо.
          </TypographyP>
          <TypographyP className="mb-4">
            4.2. Ризик втрати та право власності на товари переходять до вас
            після доставки.
          </TypographyP>
          <TypographyP className="mb-4">
            4.3. Повернення та обмін товарів регулюються нашою Політикою
            повернення, яка є невід'ємною частиною цих Умов.
          </TypographyP>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <TypographyH2 className="mb-4">
            5. Інтелектуальна власність
          </TypographyH2>
          <TypographyP className="mb-4">
            5.1. Усі права інтелектуальної власності на наші Послуги, включаючи,
            але не обмежуючись, авторськими правами, товарними знаками,
            логотипами, дизайном, текстами, графікою та програмним
            забезпеченням, належать нам або нашим ліцензіарам.
          </TypographyP>
          <TypographyP className="mb-4">
            5.2. Ви не маєте права копіювати, модифікувати, розповсюджувати,
            продавати, здавати в оренду або створювати похідні роботи на основі
            наших Послуг без нашого попереднього письмового дозволу.
          </TypographyP>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <TypographyH2 className="mb-4">
            6. Обмеження відповідальності
          </TypographyH2>
          <TypographyP className="mb-4">
            6.1. Наші Послуги надаються "як є" та "як доступно" без будь-яких
            гарантій, явних або неявних.
          </TypographyP>
          <TypographyP className="mb-4">
            6.2. Ми не несемо відповідальності за будь-які прямі, непрямі,
            випадкові, спеціальні або наслідкові збитки, що виникають внаслідок
            використання або неможливості використання наших Послуг.
          </TypographyP>
          <TypographyP className="mb-4">
            6.3. Наша максимальна відповідальність перед вами за будь-які збитки
            не перевищуватиме суму, сплачену вами за товари або послуги, що
            стали причиною таких збитків.
          </TypographyP>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <TypographyH2 className="mb-4">
            7. Застосовне право та вирішення спорів
          </TypographyH2>
          <TypographyP className="mb-4">
            7.1. Ці Умови регулюються та тлумачаться відповідно до законодавства
            України.
          </TypographyP>
          <TypographyP className="mb-4">
            7.2. Будь-які спори, що виникають з цих Умов або у зв'язку з ними,
            підлягають вирішенню шляхом переговорів, а у разі неможливості
            досягнення згоди - у судовому порядку відповідно до законодавства
            України.
          </TypographyP>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <TypographyH2 className="mb-4">8. Контактна інформація</TypographyH2>
          <TypographyP className="mb-4">
            8.1. Якщо у вас виникли питання або зауваження щодо цих Умов, будь
            ласка, зв'яжіться з нами за адресою:
          </TypographyP>
          <TypographyP className="mb-4">
            <strong>U:DO</strong>
            <br />
            вул. Шевченка 123, Львів, 79000
            <br />
            Електронна пошта: hello@u-do.store
            <br />
            Телефон: +380 32 123 4567
          </TypographyP>
        </CardContent>
      </Card>

      <div className="text-center text-muted-foreground text-sm mt-12">
        <p>Останнє оновлення: 1 червня 2024 року</p>
      </div>
    </FadeIn>
  );
}
