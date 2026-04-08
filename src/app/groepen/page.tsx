import type { Metadata } from "next";
import { GroepenExperience } from "@/components/groepen/GroepenExperience";
import { groupsPageCopy } from "@/content/groupsPage";

export const metadata: Metadata = {
  title: "Groepen",
  description: `${groupsPageCopy.title} — ${groupsPageCopy.intro}`,
};

export default function GroepenPage() {
  return <GroepenExperience />;
}
