import {
  brandCitiesLine,
  brandTagline,
  chainLocations,
  locationsMarqueePhrases,
  locationsPageCopy,
} from "@/content/locations";
import {
  menuMarqueePhrases,
  menuPageCopy,
  menuVirtualSections,
} from "@/content/menuSlides";
import {
  jobsMarqueePhrases,
  jobsOpenings,
  jobsPageCopy,
  jobsUI,
} from "@/content/jobsPage";
import {
  groupMenuTiers,
  groupsMarqueePhrases,
  groupsPageCopy,
} from "@/content/groupsPage";
import type { MarketingAdminState } from "@/lib/marketing-admin/types";

function buildSeedMarketingState(): MarketingAdminState {
  const now = new Date().toISOString();

  return {
    locations: chainLocations.map((location) => ({
      ...location,
      status: "published",
      isFeatured: ["antwerpen", "brussel", "gent"].includes(location.id),
      updatedAt: now,
    })),
    locationsPageCopy: {
      ...locationsPageCopy,
      marqueePhrases: [...locationsMarqueePhrases],
    },
    menuSections: menuVirtualSections.map((section, index) => ({
      ...section,
      id: `menu-${index + 1}`,
      order: index,
      status: "published",
      updatedAt: now,
    })),
    menuPageCopy: {
      ...menuPageCopy,
      marqueePhrases: [...menuMarqueePhrases],
    },
    jobs: jobsOpenings.map((job) => ({
      ...job,
      status: "published",
      updatedAt: now,
    })),
    jobsPageCopy: structuredClone(jobsPageCopy),
    jobsUi: structuredClone(jobsUI),
    jobsMarqueePhrases: [...jobsMarqueePhrases],
    groups: groupMenuTiers.map((group, index) => ({
      ...group,
      order: index,
      status: "published",
      updatedAt: now,
    })),
    groupsPageCopy: {
      ...groupsPageCopy,
      marqueePhrases: [...groupsMarqueePhrases],
    },
    promotions: [
      {
        id: "promo-terrace",
        name: "Terras seizoen",
        status: "active",
        startAt: "2026-04-01T00:00:00.000Z",
        endAt: "2026-09-01T00:00:00.000Z",
        placement: "global-strip",
        copy: {
          nl: "Terrasweer? Reserveer je tafel en pak de eerste zon mee.",
          en: "Terrace weather? Reserve your table and catch the first sun.",
          fr: "Temps terrasse ? Reservez votre table et profitez du soleil.",
        },
        ctaLabel: "Reserveer",
        ctaHref: "/locations",
        priority: 10,
        imageSrc: "/fotookes/hero-seam-photo.jpg",
        updatedAt: now,
      },
    ],
    globalSettings: {
      brandTagline,
      brandCitiesLine,
      footerCopy: "De lekkerste kipgerechten in een funky interieur.",
      seoTitle: "Poule & Poulette — Fun Loving Food Moments",
      seoDescription:
        "Poule & Poulette — restaurants in België. 7/7 open in Antwerpen, Brugge, Brussel, Gent, Leuven, Mechelen en Oostende.",
      reserveUrl: "/locations",
      instagramUrl: "https://www.instagram.com/poule_poulette/",
      facebookUrl: "https://www.facebook.com/poulepoulette",
    },
    auditLog: [],
  };
}

export const seedMarketingState = buildSeedMarketingState();

export function createSeedMarketingState(): MarketingAdminState {
  return structuredClone(seedMarketingState);
}
