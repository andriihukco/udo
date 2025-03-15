import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Udo Druk - Product Editor",
  description: "Customize your clothing with our interactive editor.",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
