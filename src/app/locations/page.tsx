import type { Metadata } from "next";
import { LocationsVirtualExperience } from "@/components/locations/LocationsVirtualExperience";
import { brandCitiesLine, locationsPageCopy } from "@/content/locations";

export const metadata: Metadata = {
  title: "Locaties",
  description: `Poule & Poulette — virtuele rondreis langs alle vestigingen. ${locationsPageCopy.intro} ${brandCitiesLine}`,
};

export default function LocationsPage() {
  return <LocationsVirtualExperience />;
}
