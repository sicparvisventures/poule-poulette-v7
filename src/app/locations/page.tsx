import type { Metadata } from "next";
import { LocationsIndexContent } from "@/components/locations/LocationsIndexContent";
import {
  brandCitiesLine,
  brandTagline,
  chainLocations,
} from "@/content/locations";

export const metadata: Metadata = {
  title: "Locaties",
  description: `Poule & Poulette — alle vestigingen in België. ${brandTagline}. ${brandCitiesLine}`,
};

export default function LocationsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-pp-white text-pp-black">
      <LocationsIndexContent locations={chainLocations} />
    </div>
  );
}
