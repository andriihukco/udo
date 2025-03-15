"use client";

import {
  TypographyH1,
  TypographyH2,
  TypographyP,
  TypographyLead,
} from "@/components/ui/typography";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { HomeIcon, ChevronRightIcon, InfoIcon, Users2Icon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <FadeIn className="container mx-auto px-4 py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <HomeIcon className="h-4 w-4 mr-1" />
              {t("nav.home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{t("nav.about")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TypographyH1 className="mb-6 text-center">
        {t("about.title")}
      </TypographyH1>

      <SlideUp delay={0.1}>
        <TypographyLead className="text-center mb-8 max-w-3xl mx-auto">
          {t("about.lead")}
        </TypographyLead>
      </SlideUp>

      <Alert className="mb-8">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>{t("about.missionTitle")}</AlertTitle>
        <AlertDescription>{t("about.missionDescription")}</AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <SlideUp delay={0.2} className="order-2 md:order-1">
          <TypographyH2 className="mb-4">{t("about.storyTitle")}</TypographyH2>
          <TypographyP className="mb-4">{t("about.storyPart1")}</TypographyP>
          <TypographyP>{t("about.storyPart2")}</TypographyP>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline">{t("about.established")}</Badge>
            <Badge>{t("about.premiumQuality")}</Badge>
            <Badge variant="secondary">{t("about.customerFirst")}</Badge>
          </div>
        </SlideUp>

        <SlideUp delay={0.3} className="order-1 md:order-2">
          <AspectRatio ratio={16 / 9} className="rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt={t("about.teamImageAlt")}
              fill
              className="object-cover"
            />
          </AspectRatio>
        </SlideUp>
      </div>

      <SlideUp delay={0.4}>
        <TypographyH2 className="mb-8 text-center">
          {t("about.valuesTitle")}
        </TypographyH2>
      </SlideUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          {
            title: t("about.valueQualityTitle"),
            description: t("about.valueQualityDescription"),
          },
          {
            title: t("about.valueSustainabilityTitle"),
            description: t("about.valueSustainabilityDescription"),
          },
          {
            title: t("about.valueCustomerTitle"),
            description: t("about.valueCustomerDescription"),
          },
        ].map((value, index) => (
          <StaggerItem key={index}>
            <Card className="h-full">
              <CardContent className="pt-6">
                <TypographyH2 className="mb-3 text-xl">
                  {value.title}
                </TypographyH2>
                <TypographyP>{value.description}</TypographyP>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <SlideUp delay={0.5} className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users2Icon className="h-5 w-5 mr-2" />
              {t("about.faqTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t("about.faqQuestion1")}</AccordionTrigger>
                <AccordionContent>{t("about.faqAnswer1")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>{t("about.faqQuestion2")}</AccordionTrigger>
                <AccordionContent>{t("about.faqAnswer2")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>{t("about.faqQuestion3")}</AccordionTrigger>
                <AccordionContent>{t("about.faqAnswer3")}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </SlideUp>

      <SlideUp delay={0.6}>
        <TypographyH2 className="mb-8 text-center">
          {t("about.teamTitle")}
        </TypographyH2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              name: t("about.teamMember1Name"),
              role: t("about.teamMember1Role"),
              image:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            },
            {
              name: t("about.teamMember2Name"),
              role: t("about.teamMember2Role"),
              image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            },
            {
              name: t("about.teamMember3Name"),
              role: t("about.teamMember3Role"),
              image:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            },
            {
              name: t("about.teamMember4Name"),
              role: t("about.teamMember4Role"),
              image:
                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <TypographyH2 className="text-xl mb-1">
                {member.name}
              </TypographyH2>
              <TypographyP className="text-muted-foreground">
                {member.role}
              </TypographyP>
            </div>
          ))}
        </div>
      </SlideUp>
    </FadeIn>
  );
}
