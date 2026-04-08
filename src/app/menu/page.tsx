import type { Metadata } from "next";
import { MenuVirtualExperience } from "@/components/menu/MenuVirtualExperience";
import { menuPageCopy } from "@/content/menuSlides";

export const metadata: Metadata = {
  title: "Menu",
  description: `${menuPageCopy.title} — Poule & Poulette. ${menuPageCopy.intro}`,
};

export default function MenuPage() {
  return <MenuVirtualExperience />;
}
