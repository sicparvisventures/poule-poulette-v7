"use client";

import { getLocationBySlug } from "@/content/locations";
import { LocationDetailView } from "@/components/locations/LocationDetailView";
import { useMarketingSnapshot } from "@/lib/marketing-admin/store";

export function ManagedLocationDetail({ slug }: { slug: string }) {
  const location =
    useMarketingSnapshot((state) => state.locations.find((entry) => entry.id === slug)) ??
    getLocationBySlug(slug);

  if (!location) {
    return null;
  }

  return <LocationDetailView location={location} />;
}
