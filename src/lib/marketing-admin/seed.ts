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

  const mediaFolders = [
    { id: "folder-root-images", name: "images", parentId: null, path: "images", color: "#1c3834", updatedAt: now },
    { id: "folder-root-locations", name: "locations", parentId: null, path: "locations", color: "#93231f", updatedAt: now },
    { id: "folder-root-fotookes", name: "fotookes", parentId: null, path: "fotookes", color: "#f495bd", updatedAt: now },
    { id: "folder-root-groups", name: "groups", parentId: null, path: "groups", color: "#c49a3a", updatedAt: now },
    { id: "folder-root-campaigns", name: "campaigns", parentId: null, path: "campaigns", color: "#3f6d63", updatedAt: now },
  ] as const;

  const users = [
    {
      id: "user-super-admin",
      name: "Dietmar",
      email: "dietmar@local",
      role: "super_admin" as const,
      avatarLabel: "DI",
    },
    {
      id: "user-marketing",
      name: "Marketing Team",
      email: "marketing@local",
      role: "marketing_editor" as const,
      avatarLabel: "MK",
    },
    {
      id: "user-publisher",
      name: "Publisher",
      email: "publisher@local",
      role: "publisher" as const,
      avatarLabel: "PB",
    },
    {
      id: "user-viewer",
      name: "Viewer",
      email: "viewer@local",
      role: "viewer" as const,
      avatarLabel: "VW",
    },
  ];

  const mediaAssets = [
    ...chainLocations.map((location) => ({
      id: `asset-location-${location.id}`,
      name: `${location.id}.jpg`,
      folderId: "folder-root-locations",
      src: location.imageSrc,
      previewSrc: location.imageSrc,
      type: "image" as const,
      extension: "jpg",
      mimeType: "image/jpeg",
      sizeBytes: 0,
      altText: location.imageAlt,
      tags: ["location", location.id],
      uploadedAt: now,
      updatedAt: now,
      uploadedBy: "user-super-admin",
      usages: [
        {
          entity: "location",
          entityId: location.id,
          label: location.city,
          route: `/locations/${location.id}`,
        },
      ],
    })),
    ...menuVirtualSections.map((section, index) => ({
      id: `asset-menu-${index + 1}`,
      name: section.src.split("/").pop() ?? `menu-${index + 1}.png`,
      folderId: "folder-root-images",
      src: section.src,
      previewSrc: section.src,
      type: "image" as const,
      extension: "png",
      mimeType: "image/png",
      sizeBytes: 0,
      altText: section.label,
      tags: ["menu", "slide"],
      uploadedAt: now,
      updatedAt: now,
      uploadedBy: "user-super-admin",
      usages: [
        {
          entity: "menuSection",
          entityId: `menu-${index + 1}`,
          label: section.label,
          route: "/menu",
        },
      ],
    })),
    ...groupMenuTiers.map((group) => ({
      id: `asset-group-${group.id}`,
      name: group.src.split("/").pop() ?? `${group.id}.jpg`,
      folderId: "folder-root-groups",
      src: group.src,
      previewSrc: group.src,
      type: "image" as const,
      extension: "jpg",
      mimeType: "image/jpeg",
      sizeBytes: 0,
      altText: group.alt,
      tags: ["groups", group.id],
      uploadedAt: now,
      updatedAt: now,
      uploadedBy: "user-super-admin",
      usages: [
        {
          entity: "groupTier",
          entityId: group.id,
          label: group.label,
          route: "/groepen",
        },
      ],
    })),
    {
      id: "asset-promo-terrace",
      name: "hero-seam-photo.jpg",
      folderId: "folder-root-campaigns",
      src: "/fotookes/hero-seam-photo.jpg",
      previewSrc: "/fotookes/hero-seam-photo.jpg",
      type: "image" as const,
      extension: "jpg",
      mimeType: "image/jpeg",
      sizeBytes: 0,
      altText: "Terras sfeerbeeld",
      tags: ["campaign", "terrace"],
      uploadedAt: now,
      updatedAt: now,
      uploadedBy: "user-super-admin",
      usages: [
        {
          entity: "promotion",
          entityId: "promo-terrace",
          label: "Terras seizoen",
          route: "/admin/promotions",
        },
      ],
    },
  ];

  return {
    currentUserId: "user-super-admin",
    users,
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
    mediaFolders: [...mediaFolders],
    mediaAssets,
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
