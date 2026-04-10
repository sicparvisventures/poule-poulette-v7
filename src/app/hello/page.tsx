import type { Metadata } from "next";
import { HelloEasterEgg } from "@/components/hello/HelloEasterEgg";

export const metadata: Metadata = {
  title: "The Coop | Poule & Poulette",
  description:
    "The Coop — de loyalty-app van Poule & Poulette. Binnenkort in de App Store en op Google Play.",
  robots: { index: false, follow: true },
};

export default function HelloPage() {
  return <HelloEasterEgg />;
}
