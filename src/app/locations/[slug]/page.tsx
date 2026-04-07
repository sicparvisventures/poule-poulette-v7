import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationDetailView } from "@/components/locations/LocationDetailView";
import {
  brandTagline,
  getLocationBySlug,
  getLocationSlugs,
} from "@/content/locations";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) {
    return { title: "Locatie" };
  }
  const desc = `${loc.title} — ${brandTagline}. ${loc.detailIntro}`;
  return {
    title: `${loc.city} | Locaties`,
    description:
      desc.length > 155 ? `${desc.slice(0, 152).trim()}…` : desc,
  };
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) {
    notFound();
  }
  return <LocationDetailView location={loc} />;
}
