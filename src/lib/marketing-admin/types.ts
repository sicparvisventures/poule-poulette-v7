import type { ChainLocation } from "@/content/locations";
import type {
  JobOpening,
  JobsLocale,
  jobsPageCopy,
  jobsUI,
} from "@/content/jobsPage";

export type ContentStatus = "draft" | "published" | "archived";

export type ManagedLocation = ChainLocation & {
  status: ContentStatus;
  isFeatured: boolean;
  updatedAt: string;
};

export type ManagedMenuSection = {
  src: string;
  label: string;
  kicker: string;
  blurb: string;
  connector: string;
  id: string;
  order: number;
  status: ContentStatus;
  updatedAt: string;
};

export type JobsPageCopy = typeof jobsPageCopy;
export type JobsUIStrings = typeof jobsUI;

export type ManagedJob = JobOpening & {
  status: ContentStatus;
  updatedAt: string;
};

export type ManagedGroupTier = {
  id: string;
  label: string;
  tagline: string;
  blurb: string;
  src: string;
  alt: string;
  cardClass: string;
  accentDot: string;
  order: number;
  status: ContentStatus;
  updatedAt: string;
};

export type PromotionStatus = "draft" | "active" | "scheduled" | "expired";
export type PromotionPlacement =
  | "global-strip"
  | "home-hero"
  | "menu-page"
  | "locations-page"
  | "jobs-page"
  | "groups-page";

export type Promotion = {
  id: string;
  name: string;
  status: PromotionStatus;
  startAt: string;
  endAt: string;
  placement: PromotionPlacement;
  copy: Record<JobsLocale, string>;
  ctaLabel: string;
  ctaHref: string;
  priority: number;
  imageSrc?: string;
  updatedAt: string;
};

export type GlobalSettings = {
  brandTagline: string;
  brandCitiesLine: string;
  footerCopy: string;
  seoTitle: string;
  seoDescription: string;
  reserveUrl: string;
  instagramUrl: string;
  facebookUrl: string;
};

export type AuditLogEntry = {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  user: string;
  timestamp: string;
  details: string;
};

export type AdminRole = "super_admin" | "marketing_editor" | "publisher" | "viewer";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarLabel: string;
};

export type MediaAssetType = "image" | "video" | "document" | "svg";

export type MediaFolder = {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  color: string;
  updatedAt: string;
};

export type MediaAssetUsage = {
  entity: string;
  entityId: string;
  label: string;
  route?: string;
};

export type MediaAsset = {
  id: string;
  name: string;
  folderId: string;
  src: string;
  previewSrc: string;
  type: MediaAssetType;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  altText: string;
  tags: string[];
  uploadedAt: string;
  updatedAt: string;
  uploadedBy: string;
  usages: MediaAssetUsage[];
};

export type MarketingAdminState = {
  currentUserId: string;
  users: AdminUser[];
  locations: ManagedLocation[];
  locationsPageCopy: {
    kicker: string;
    title: string;
    introBar: string;
    intro: string;
    splashTitle: string;
    splashLine: string;
    scrollHint: string;
    zoomClose: string;
    footnote: string;
    marqueePhrases: string[];
  };
  menuSections: ManagedMenuSection[];
  menuPageCopy: {
    kicker: string;
    title: string;
    intro: string;
    introBar: string;
    scrollHint: string;
    zoomClose: string;
    footnote: string;
    marqueePhrases: string[];
  };
  jobs: ManagedJob[];
  jobsPageCopy: JobsPageCopy;
  jobsUi: JobsUIStrings;
  jobsMarqueePhrases: string[];
  groups: ManagedGroupTier[];
  groupsPageCopy: {
    kicker: string;
    title: string;
    intro: string;
    zoomClose: string;
    footnote: string;
    marqueePhrases: string[];
  };
  promotions: Promotion[];
  mediaFolders: MediaFolder[];
  mediaAssets: MediaAsset[];
  globalSettings: GlobalSettings;
  auditLog: AuditLogEntry[];
};
