"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MediaAssetPickerField } from "@/components/admin/MediaAssetPickerField";
import type { JobsLocale } from "@/content/jobsPage";
import {
  createFolder,
  deleteMediaAssets,
  getFolderDescendantIds,
  moveFolder,
  replaceMediaUsage,
} from "@/lib/marketing-admin/media";
import { useMarketingAdmin } from "@/lib/marketing-admin/store";
import type {
  AdminRole,
  ContentStatus,
  ManagedJob,
  ManagedLocation,
  ManagedMenuSection,
  MediaAssetUsage,
  MediaFolder,
  MediaAsset,
  MarketingAdminState,
  Promotion,
} from "@/lib/marketing-admin/types";

const LOCALES: JobsLocale[] = ["nl", "en", "fr"];
const STATUSES: ContentStatus[] = ["draft", "published", "archived"];

function slugifyFolderName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatBytes(value: number) {
  if (!value) return "Seeded asset";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function mediaTypeLabel(type: MediaAsset["type"]) {
  switch (type) {
    case "svg":
      return "SVG";
    case "video":
      return "Video";
    case "document":
      return "Document";
    default:
      return "Image";
  }
}

function SectionHeader({
  title,
  intro,
  eyebrow = "Marketing Admin",
  actions,
}: {
  title: string;
  intro: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-pp-olive/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="font-accent uppercase text-[0.58rem] tracking-[0.28em] text-pp-olive/48">
          {eyebrow}
        </p>
        <h1 className="font-display mt-2 text-4xl text-pp-olive">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-pp-black/66">{intro}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[1.1rem] border border-pp-olive/12 bg-[#fffdf6] p-5 shadow-[0_16px_50px_rgb(28_56_52/0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

function PanelHeader({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3 border-b border-pp-olive/8 pb-4">
      <div>
        <p className="font-accent uppercase text-[0.58rem] tracking-[0.18em] text-pp-olive/45">
          {title}
        </p>
        {meta ? <p className="mt-1 text-sm text-pp-black/55">{meta}</p> : null}
      </div>
      {action}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-accent uppercase text-[0.58rem] tracking-[0.18em] text-pp-olive/55">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-1 w-full border border-pp-olive/14 bg-white px-3 py-2.5 text-sm text-pp-black outline-none transition-colors focus:border-pp-lollypop disabled:cursor-not-allowed disabled:bg-[#f4efdf] disabled:text-pp-black/45 ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-1 min-h-28 w-full border border-pp-olive/14 bg-white px-3 py-2.5 text-sm leading-relaxed text-pp-black outline-none transition-colors focus:border-pp-lollypop disabled:cursor-not-allowed disabled:bg-[#f4efdf] disabled:text-pp-black/45 ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`mt-1 w-full border border-pp-olive/14 bg-white px-3 py-2.5 text-sm text-pp-black outline-none transition-colors focus:border-pp-lollypop disabled:cursor-not-allowed disabled:bg-[#f4efdf] disabled:text-pp-black/45 ${props.className ?? ""}`}
    />
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border border-pp-creme/18 bg-pp-creme px-4 py-3 text-pp-olive shadow-[0_8px_24px_rgb(0_0_0/0.08)]">
      <p className="font-accent uppercase text-[0.55rem] tracking-[0.18em] text-pp-olive/62">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}

function PermissionNotice({
  role,
  mode,
}: {
  role: AdminRole;
  mode: "view" | "publish";
}) {
  const message =
    mode === "publish"
      ? `Ingelogd als ${role}. Publicatievelden zijn alleen actief voor publisher of super admin.`
      : `Ingelogd als ${role}. Deze tab staat momenteel in read-only modus.`;

  return (
    <div className="border border-amber-300/35 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {message}
    </div>
  );
}

function FlatSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-pp-olive/10 bg-[#fffdf6] ${className}`}>
      {children}
    </section>
  );
}

function attachAssetToEntity(
  current: MarketingAdminState,
  assetId: string,
  usage: MediaAssetUsage,
) {
  return replaceMediaUsage(current, assetId, usage);
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "published" || status === "active"
      ? "border-emerald-300/45 bg-emerald-50 text-emerald-800"
      : status === "scheduled"
        ? "border-sky-300/45 bg-sky-50 text-sky-800"
        : status === "archived" || status === "expired"
          ? "border-slate-300/45 bg-slate-100 text-slate-700"
          : "border-amber-300/45 bg-amber-50 text-amber-800";

  return (
    <span
      className={`font-accent inline-flex rounded-full border px-2.5 py-1 uppercase tracking-[0.16em] text-[0.54rem] ${className}`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  children,
  tone = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary";
}) {
  const toneClass =
    tone === "primary"
      ? "border-pp-olive bg-pp-olive text-pp-creme hover:border-pp-lollypop hover:text-pp-lollypop"
      : "border-pp-olive/16 bg-white text-pp-olive hover:border-pp-lollypop hover:text-pp-lollypop";

  return (
    <button
      {...props}
      className={`border px-4 py-2 font-accent uppercase tracking-[0.18em] text-[0.62rem] transition-colors ${toneClass} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

function updateWithAudit(
  setState: React.Dispatch<React.SetStateAction<MarketingAdminState>>,
  addAuditEntry: ReturnType<typeof useMarketingAdmin>["addAuditEntry"],
  action: string,
  entity: string,
  entityId: string,
  updater: (current: MarketingAdminState) => MarketingAdminState,
) {
  setState((current) => updater(current));
  addAuditEntry({
    action,
    entity,
    entityId,
    details: `${entity} ${entityId} aangepast in local demo mode.`,
  });
}

function copyRows(rows: Array<{ label: string; value: string }>) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="rounded-[0.9rem] border border-pp-olive/8 bg-white/75 px-4 py-3"
        >
          <p className="font-accent uppercase text-[0.55rem] tracking-[0.16em] text-pp-olive/45">
            {row.label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-pp-black/68">{row.value}</p>
        </div>
      ))}
    </div>
  );
}

export function DashboardView() {
  const { state } = useMarketingAdmin();
  const publishedLocations = state.locations.filter((location) => location.status === "published").length;
  const openJobs = state.jobs.filter((job) => job.status === "published").length;
  const activePromotions = state.promotions.filter((promo) => promo.status === "active").length;
  const draftPromotions = state.promotions.filter((promo) => promo.status === "draft").length;
  const recentAudit = state.auditLog.slice(0, 6);

  const contentHealth = [
    { label: "Locaties", value: `${publishedLocations}/${state.locations.length} live`, href: "/admin/locations" },
    { label: "Menu", value: `${state.menuSections.length} slides actief`, href: "/admin/menu" },
    { label: "Jobs", value: `${openJobs} live vacatures`, href: "/admin/jobs" },
    { label: "Groepen", value: `${state.groups.length} formules klaar`, href: "/admin/groups" },
    { label: "Promo's", value: `${activePromotions} live • ${draftPromotions} draft`, href: "/admin/promotions" },
  ];

  return (
    <>
      <SectionHeader
        title="Content Control"
        intro="Een compact overzicht van wat live staat, wat aandacht vraagt en waar marketing het snelst kan ingrijpen."
        actions={
          <>
            <Link href="/admin/promotions">
              <ActionButton>Nieuwe promo</ActionButton>
            </Link>
            <Link href="/admin/media">
              <ActionButton tone="secondary">Open media library</ActionButton>
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
        <Surface className="overflow-hidden p-0">
          <div className="border-b border-pp-olive/10 bg-linear-to-r from-pp-olive to-[#21453f] px-5 py-5 text-pp-creme">
            <p className="font-accent uppercase text-[0.56rem] tracking-[0.18em] text-pp-creme/65">
              Live pulse
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <MiniStat label="locaties live" value={publishedLocations} />
              <MiniStat label="jobs live" value={openJobs} />
              <MiniStat label="actieve promo's" value={activePromotions} />
              <MiniStat label="audit events" value={state.auditLog.length} />
            </div>
          </div>

          <div className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <PanelHeader
                title="Project health"
                meta="Geen generieke KPI-wall, maar snelle toegang tot de contentdomeinen die deze site echt voeden."
              />
              <div className="space-y-2">
                {contentHealth.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-[0.95rem] border border-pp-olive/10 bg-white px-4 py-3 transition-colors hover:border-pp-lollypop/40 hover:bg-pp-lollypop/[0.04]"
                  >
                    <div>
                      <p className="font-accent uppercase text-[0.55rem] tracking-[0.16em] text-pp-olive/45">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-pp-black/72">{item.value}</p>
                    </div>
                    <span className="text-xl text-pp-olive/35">›</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <PanelHeader
                title="Release note"
                meta="Wat het team vandaag waarschijnlijk het eerst wil weten."
              />
              {copyRows([
                {
                  label: "Default reserve route",
                  value: state.globalSettings.reserveUrl,
                },
                {
                  label: "Brand tagline",
                  value: state.globalSettings.brandTagline,
                },
                {
                  label: "Locations intro",
                  value: state.locationsPageCopy.intro,
                },
                {
                  label: "Menu intro bar",
                  value: state.menuPageCopy.introBar,
                },
              ])}
            </div>
          </div>
        </Surface>

        <div className="space-y-6">
          <Surface>
            <PanelHeader
              title="Recent activity"
              meta="Lokale auditlog van wijzigingen en snelle content-edit acties."
            />
            {recentAudit.length ? (
              <div className="space-y-3">
                {recentAudit.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[0.9rem] border border-pp-olive/9 bg-white/80 px-4 py-3"
                  >
                    <p className="font-accent uppercase text-[0.55rem] tracking-[0.16em] text-pp-olive/48">
                      {entry.entity} · {entry.action}
                    </p>
                    <p className="mt-1 text-sm text-pp-black/72">{entry.details}</p>
                    <p className="mt-1 text-xs text-pp-black/42">{entry.timestamp}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-pp-black/60">
                Nog geen wijzigingen gelogd. Zodra marketing iets aanpast in locaties, menu, jobs of promo&apos;s verschijnt dat hier.
              </p>
            )}
          </Surface>

          <Surface>
            <PanelHeader
              title="Quick actions"
              meta="Meest logische routes voor dit project."
            />
            <div className="grid gap-2">
              {[
                { href: "/admin/locations", label: "Open locaties", blurb: "Pas adresbeelden en featured flags aan." },
                { href: "/admin/menu", label: "Open menu", blurb: "Werk slides, introbar en sequentie bij." },
                { href: "/admin/media", label: "Open media", blurb: "Bekijk assets per map met previews." },
                { href: "/admin/settings", label: "Open settings", blurb: "Brand tagline, reserve route en footer." },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[0.9rem] border border-pp-olive/10 bg-white px-4 py-3 transition-colors hover:border-pp-lollypop/40 hover:bg-pp-lollypop/[0.04]"
                >
                  <p className="font-accent uppercase text-[0.55rem] tracking-[0.16em] text-pp-olive/48">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-pp-black/68">{item.blurb}</p>
                </Link>
              ))}
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

export function LocationsView() {
  const { state, setState, addAuditEntry, permissions, currentUser } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Locations"
        intro="Werk vestigingscontent bij zoals marketing ermee denkt: hero copy bovenaan, daaronder de kaarten per locatie met beeld, status en praktische info."
      />
      {!permissions.canEdit ? (
        <div className="mb-6">
          <PermissionNotice role={currentUser.role} mode="view" />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Surface>
          <PanelHeader
            title="Page narrative"
            meta="Deze copy stuurt de indexpagina, chips en marquee van `/locations`."
          />
          <div className="space-y-4">
            <div>
              <FieldLabel>Intro</FieldLabel>
              <Textarea
                value={state.locationsPageCopy.intro}
                disabled={!permissions.canEdit}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "locationsPageCopy", "locations-intro", (current) => ({
                    ...current,
                    locationsPageCopy: {
                      ...current.locationsPageCopy,
                      intro: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <FieldLabel>Marquee phrases</FieldLabel>
              <Textarea
                value={state.locationsPageCopy.marqueePhrases.join("\n")}
                disabled={!permissions.canEdit}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "locationsPageCopy", "locations-marquee", (current) => ({
                    ...current,
                    locationsPageCopy: {
                      ...current.locationsPageCopy,
                      marqueePhrases: event.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    },
                  }))
                }
              />
            </div>
            {copyRows([
              { label: "Scroll hint", value: state.locationsPageCopy.scrollHint },
              { label: "Footnote", value: state.locationsPageCopy.footnote },
            ])}
          </div>
        </Surface>

        <div className="space-y-4">
          {state.locations.map((location, index) => (
            <LocationEditor
              key={location.id}
              location={location}
              canEdit={permissions.canEdit}
              canPublish={permissions.canPublish}
              onChange={(field, value) =>
                updateWithAudit(setState, addAuditEntry, "update", "location", location.id, (current) => ({
                  ...current,
                  locations: current.locations.map((entry, entryIndex) =>
                    entryIndex === index
                      ? { ...entry, [field]: value, updatedAt: new Date().toISOString() }
                      : entry,
                  ),
                }))
              }
              onAssignImage={(asset) =>
                updateWithAudit(setState, addAuditEntry, "link", "location", location.id, (current) =>
                  attachAssetToEntity(
                    {
                      ...current,
                      locations: current.locations.map((entry, entryIndex) =>
                        entryIndex === index
                          ? {
                              ...entry,
                              imageSrc: asset.src,
                              imageAlt: asset.altText || entry.imageAlt,
                              updatedAt: new Date().toISOString(),
                            }
                          : entry,
                      ),
                    },
                    asset.id,
                    {
                      entity: "location",
                      entityId: location.id,
                      label: location.city,
                      route: `/locations/${location.id}`,
                    },
                  ),
                )
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}

function LocationEditor({
  location,
  canEdit,
  canPublish,
  onChange,
  onAssignImage,
}: {
  location: ManagedLocation;
  canEdit: boolean;
  canPublish: boolean;
  onChange: (field: keyof ManagedLocation, value: ManagedLocation[keyof ManagedLocation]) => void;
  onAssignImage: (asset: MediaAsset) => void;
}) {
  return (
    <Surface className="overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        <div className="relative min-h-56 border-b border-pp-olive/10 bg-[#f3ecd8] lg:min-h-full lg:border-b-0 lg:border-r">
          <Image
            src={location.imageSrc}
            alt={location.imageAlt}
            fill
            className="object-cover"
            sizes="220px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-pp-black/45 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <StatusBadge status={location.status} />
            {location.isFeatured ? <StatusBadge status="featured" /> : null}
          </div>
        </div>
        <div className="p-5">
          <PanelHeader
            title={location.city}
            meta={location.addressLines.join(" · ")}
            action={<StatusBadge status={location.status} />}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <FieldLabel>City label</FieldLabel>
              <Input disabled={!canEdit} value={location.city} onChange={(event) => onChange("city", event.target.value)} />
            </div>
            <div>
              <FieldLabel>Status</FieldLabel>
              <Select
                disabled={!canPublish}
                value={location.status}
                onChange={(event) => onChange("status", event.target.value as ContentStatus)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Page title</FieldLabel>
              <Input disabled={!canEdit} value={location.title} onChange={(event) => onChange("title", event.target.value)} />
            </div>
            <div className="lg:col-span-2">
              <MediaAssetPickerField
                label="Hero image"
                valueSrc={location.imageSrc}
                disabled={!canEdit}
                onSelect={onAssignImage}
              />
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Detail intro</FieldLabel>
              <Textarea
                disabled={!canEdit}
                value={location.detailIntro}
                onChange={(event) => onChange("detailIntro", event.target.value)}
              />
            </div>
          </div>
          <label className="mt-4 inline-flex items-center gap-2 text-sm text-pp-black/68">
            <input
              type="checkbox"
              checked={location.isFeatured}
              disabled={!canEdit}
              onChange={(event) => onChange("isFeatured", event.target.checked)}
            />
            Featured locatie op dashboard / highlight-lijsten
          </label>
        </div>
      </div>
    </Surface>
  );
}

export function MenuView() {
  const { state, setState, addAuditEntry, permissions, currentUser } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Menu"
        intro="De menu-editor is nu opgezet als redactionele sequencer: page copy links, slides rechts, telkens met preview en korte copy."
      />
      {!permissions.canEdit ? (
        <div className="mb-6">
          <PermissionNotice role={currentUser.role} mode="view" />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Surface>
          <PanelHeader
            title="Page copy"
            meta="Teksten die de ervaring rond de slide-sequentie kaderen."
          />
          <div className="space-y-4">
            <div>
              <FieldLabel>Titel</FieldLabel>
              <Input
                value={state.menuPageCopy.title}
                disabled={!permissions.canEdit}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "menuPageCopy", "title", (current) => ({
                    ...current,
                    menuPageCopy: { ...current.menuPageCopy, title: event.target.value },
                  }))
                }
              />
            </div>
            <div>
              <FieldLabel>Intro bar</FieldLabel>
              <Input
                value={state.menuPageCopy.introBar}
                disabled={!permissions.canEdit}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "menuPageCopy", "introBar", (current) => ({
                    ...current,
                    menuPageCopy: { ...current.menuPageCopy, introBar: event.target.value },
                  }))
                }
              />
            </div>
            <div>
              <FieldLabel>Footnote</FieldLabel>
              <Textarea
                value={state.menuPageCopy.footnote}
                disabled={!permissions.canEdit}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "menuPageCopy", "footnote", (current) => ({
                    ...current,
                    menuPageCopy: { ...current.menuPageCopy, footnote: event.target.value },
                  }))
                }
              />
            </div>
          </div>
        </Surface>

        <div className="space-y-4">
          {state.menuSections.map((section, index) => (
            <MenuSectionEditor
              key={section.id}
              section={section}
              index={index}
              canEdit={permissions.canEdit}
              canPublish={permissions.canPublish}
              onUpdate={(nextSection) =>
                updateWithAudit(setState, addAuditEntry, "update", "menuSection", section.id, (current) => ({
                  ...current,
                  menuSections: current.menuSections.map((entry, entryIndex) =>
                    entryIndex === index ? nextSection : entry,
                  ),
                }))
              }
              onAssignAsset={(asset) =>
                updateWithAudit(setState, addAuditEntry, "link", "menuSection", section.id, (current) =>
                  attachAssetToEntity(
                    {
                      ...current,
                      menuSections: current.menuSections.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, src: asset.src, updatedAt: new Date().toISOString() }
                          : entry,
                      ),
                    },
                    asset.id,
                    {
                      entity: "menuSection",
                      entityId: section.id,
                      label: section.label,
                      route: "/menu",
                    },
                  ),
                )
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}

function MenuSectionEditor({
  section,
  index,
  canEdit,
  canPublish,
  onUpdate,
  onAssignAsset,
}: {
  section: ManagedMenuSection;
  index: number;
  canEdit: boolean;
  canPublish: boolean;
  onUpdate: (nextSection: ManagedMenuSection) => void;
  onAssignAsset: (asset: MediaAsset) => void;
}) {
  return (
    <Surface className="overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[200px_1fr]">
        <div className="relative min-h-56 border-b border-pp-olive/10 bg-[#f4efdf] lg:min-h-full lg:border-b-0 lg:border-r">
          <Image src={section.src} alt={section.label} fill className="object-contain p-3" sizes="200px" />
        </div>
        <div className="p-5">
          <PanelHeader
            title={`Slide ${index + 1} · ${section.label}`}
            meta={section.kicker}
            action={<StatusBadge status={section.status} />}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <FieldLabel>Label</FieldLabel>
              <Input disabled={!canEdit} value={section.label} onChange={(event) => onUpdate({ ...section, label: event.target.value, updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <FieldLabel>Status</FieldLabel>
              <Select disabled={!canPublish} value={section.status} onChange={(event) => onUpdate({ ...section, status: event.target.value as ContentStatus, updatedAt: new Date().toISOString() })}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
            <div className="lg:col-span-2">
              <MediaAssetPickerField
                label="Slide asset"
                valueSrc={section.src}
                disabled={!canEdit}
                onSelect={onAssignAsset}
              />
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Blurb</FieldLabel>
              <Textarea disabled={!canEdit} value={section.blurb} onChange={(event) => onUpdate({ ...section, blurb: event.target.value, updatedAt: new Date().toISOString() })} />
            </div>
          </div>
        </div>
      </div>
    </Surface>
  );
}

export function JobsView() {
  const { state, setState, addAuditEntry, permissions, currentUser } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Jobs"
        intro="Copy en vacatures zijn gegroepeerd zoals marketing ze beheert: eerst de page messaging, daarna de jobcards met meertalige samenvattingen."
      />
      {!permissions.canEdit ? (
        <div className="mb-6">
          <PermissionNotice role={currentUser.role} mode="view" />
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Surface>
          <PanelHeader
            title="Page copy"
            meta="Hero intro en call-to-action copy per taal."
          />
          <div className="grid gap-4">
            {LOCALES.map((locale) => (
              <div key={locale} className="rounded-[0.95rem] border border-pp-olive/9 bg-white/80 p-4">
                <FieldLabel>Intro {locale.toUpperCase()}</FieldLabel>
                <Textarea
                  value={state.jobsPageCopy.intro[locale]}
                  disabled={!permissions.canEdit}
                  onChange={(event) =>
                    updateWithAudit(setState, addAuditEntry, "update", "jobsPageCopy", locale, (current) => ({
                      ...current,
                      jobsPageCopy: {
                        ...current.jobsPageCopy,
                        intro: {
                          ...current.jobsPageCopy.intro,
                          [locale]: event.target.value,
                        },
                      },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </Surface>

        <div className="space-y-4">
          {state.jobs.map((job, index) => (
            <JobEditor
              key={job.id}
              job={job}
              canEdit={permissions.canEdit}
              canPublish={permissions.canPublish}
              onUpdate={(nextJob) =>
                updateWithAudit(setState, addAuditEntry, "update", "job", job.id, (current) => ({
                  ...current,
                  jobs: current.jobs.map((entry, entryIndex) =>
                    entryIndex === index ? nextJob : entry,
                  ),
                }))
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}

function JobEditor({
  job,
  canEdit,
  canPublish,
  onUpdate,
}: {
  job: ManagedJob;
  canEdit: boolean;
  canPublish: boolean;
  onUpdate: (job: ManagedJob) => void;
}) {
  return (
    <Surface>
      <PanelHeader
        title={job.title.nl}
        meta={job.place}
        action={<StatusBadge status={job.status} />}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <FieldLabel>Type</FieldLabel>
          <Input disabled={!canEdit} value={job.type} onChange={(event) => onUpdate({ ...job, type: event.target.value, updatedAt: new Date().toISOString() })} />
        </div>
        <div>
          <FieldLabel>Plaats</FieldLabel>
          <Input disabled={!canEdit} value={job.place} onChange={(event) => onUpdate({ ...job, place: event.target.value, updatedAt: new Date().toISOString() })} />
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <Select disabled={!canPublish} value={job.status} onChange={(event) => onUpdate({ ...job, status: event.target.value as ContentStatus, updatedAt: new Date().toISOString() })}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {LOCALES.map((locale) => (
          <div key={locale} className="rounded-[0.95rem] border border-pp-olive/9 bg-white/80 p-4">
            <FieldLabel>Titel {locale.toUpperCase()}</FieldLabel>
            <Input
              disabled={!canEdit}
              value={job.title[locale]}
              onChange={(event) =>
                onUpdate({
                  ...job,
                  title: { ...job.title, [locale]: event.target.value },
                  updatedAt: new Date().toISOString(),
                })
              }
            />
            <div className="mt-4">
              <FieldLabel>Summary {locale.toUpperCase()}</FieldLabel>
              <Textarea
                disabled={!canEdit}
                value={job.summary[locale]}
                onChange={(event) =>
                  onUpdate({
                    ...job,
                    summary: { ...job.summary, [locale]: event.target.value },
                    updatedAt: new Date().toISOString(),
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

export function GroupsView() {
  const { state, setState, addAuditEntry, permissions, currentUser } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Groups"
        intro="Groepsformules zijn hier compacter opgezet, met preview van de kaart en kerncopy in één editorblok per formule."
      />
      {!permissions.canEdit ? (
        <div className="mb-6">
          <PermissionNotice role={currentUser.role} mode="view" />
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Surface>
          <PanelHeader
            title="Page copy"
            meta="Teksten voor de groepen-overview en de modalervaring."
          />
          <FieldLabel>Intro</FieldLabel>
          <Textarea
            value={state.groupsPageCopy.intro}
            disabled={!permissions.canEdit}
            onChange={(event) =>
              updateWithAudit(setState, addAuditEntry, "update", "groupsPageCopy", "groups-page", (current) => ({
                ...current,
                groupsPageCopy: {
                  ...current.groupsPageCopy,
                  intro: event.target.value,
                },
              }))
            }
          />
          <div className="mt-4">
            {copyRows([{ label: "Footnote", value: state.groupsPageCopy.footnote }])}
          </div>
        </Surface>

        <div className="space-y-4">
          {state.groups.map((group, index) => (
            <Surface key={group.id} className="overflow-hidden p-0">
              <div className="grid gap-0 lg:grid-cols-[180px_1fr]">
                <div className="relative min-h-48 border-b border-pp-olive/10 bg-[#f4efdf] lg:min-h-full lg:border-b-0 lg:border-r">
                  <Image src={group.src} alt={group.alt} fill className="object-contain p-3" sizes="180px" />
                </div>
                <div className="p-5">
                  <PanelHeader
                    title={`Formule ${index + 1} · ${group.label}`}
                    meta={group.tagline}
                    action={<StatusBadge status={group.status} />}
                  />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <FieldLabel>Label</FieldLabel>
                      <Input
                        disabled={!permissions.canEdit}
                        value={group.label}
                        onChange={(event) =>
                          updateWithAudit(setState, addAuditEntry, "update", "groupTier", group.id, (current) => ({
                            ...current,
                            groups: current.groups.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, label: event.target.value, updatedAt: new Date().toISOString() } : entry,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Tagline</FieldLabel>
                      <Input
                        disabled={!permissions.canEdit}
                        value={group.tagline}
                        onChange={(event) =>
                          updateWithAudit(setState, addAuditEntry, "update", "groupTier", group.id, (current) => ({
                            ...current,
                            groups: current.groups.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, tagline: event.target.value, updatedAt: new Date().toISOString() } : entry,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <MediaAssetPickerField
                        label="Groepen asset"
                        valueSrc={group.src}
                        disabled={!permissions.canEdit}
                        onSelect={(asset) =>
                          updateWithAudit(setState, addAuditEntry, "link", "groupTier", group.id, (current) =>
                            attachAssetToEntity(
                              {
                                ...current,
                                groups: current.groups.map((entry, entryIndex) =>
                                  entryIndex === index
                                    ? {
                                        ...entry,
                                        src: asset.src,
                                        alt: asset.altText || entry.alt,
                                        updatedAt: new Date().toISOString(),
                                      }
                                    : entry,
                                ),
                              },
                              asset.id,
                              {
                                entity: "groupTier",
                                entityId: group.id,
                                label: group.label,
                                route: "/groepen",
                              },
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <FieldLabel>Blurb</FieldLabel>
                      <Textarea
                        disabled={!permissions.canEdit}
                        value={group.blurb}
                        onChange={(event) =>
                          updateWithAudit(setState, addAuditEntry, "update", "groupTier", group.id, (current) => ({
                            ...current,
                            groups: current.groups.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, blurb: event.target.value, updatedAt: new Date().toISOString() } : entry,
                            ),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </>
  );
}

export function PromotionsView() {
  const { state, setState, addAuditEntry, permissions, currentUser } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Promotions"
        intro="Campagnes zijn hier opgezet als strakke werkrijen in plaats van losse KPI-cards. Copy, timing, image en publicatiestatus zitten in één operationele flow."
        actions={
          <ActionButton
            disabled={!permissions.canEdit}
            onClick={() =>
              updateWithAudit(setState, addAuditEntry, "create", "promotion", `promotion-${Date.now()}`, (current) => ({
                ...current,
                promotions: [
                  {
                    id: `promotion-${Date.now()}`,
                    name: "Nieuwe promotie",
                    status: "draft",
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    placement: "global-strip",
                    copy: { nl: "", en: "", fr: "" },
                    ctaLabel: "Bekijk",
                    ctaHref: "/menu",
                    priority: 1,
                    imageSrc: current.mediaAssets[0]?.src,
                    updatedAt: new Date().toISOString(),
                  },
                  ...current.promotions,
                ],
              }))
            }
          >
            Nieuwe promotie
          </ActionButton>
        }
      />
      {!permissions.canEdit ? (
        <div className="mb-6">
          <PermissionNotice role={currentUser.role} mode="view" />
        </div>
      ) : null}
      {!permissions.canPublish ? (
        <div className="mb-6">
          <PermissionNotice role={currentUser.role} mode="publish" />
        </div>
      ) : null}
      <div className="space-y-3">
        {state.promotions.map((promotion, index) => (
          <PromotionEditor
            key={promotion.id}
            promotion={promotion}
            canEdit={permissions.canEdit}
            canPublish={permissions.canPublish}
            onUpdate={(nextPromotion) =>
              updateWithAudit(setState, addAuditEntry, "update", "promotion", promotion.id, (current) => ({
                ...current,
                promotions: current.promotions.map((entry, entryIndex) =>
                  entryIndex === index ? nextPromotion : entry,
                ),
              }))
            }
            onAssignImage={(asset) =>
              updateWithAudit(setState, addAuditEntry, "link", "promotion", promotion.id, (current) =>
                attachAssetToEntity(
                  {
                    ...current,
                    promotions: current.promotions.map((entry, entryIndex) =>
                      entryIndex === index
                        ? { ...entry, imageSrc: asset.src, updatedAt: new Date().toISOString() }
                        : entry,
                    ),
                  },
                  asset.id,
                  {
                    entity: "promotion",
                    entityId: promotion.id,
                    label: promotion.name,
                    route: "/admin/promotions",
                  },
                ),
              )
            }
          />
        ))}
      </div>
    </>
  );
}

function PromotionEditor({
  promotion,
  canEdit,
  canPublish,
  onUpdate,
  onAssignImage,
}: {
  promotion: Promotion;
  canEdit: boolean;
  canPublish: boolean;
  onUpdate: (promotion: Promotion) => void;
  onAssignImage: (asset: MediaAsset) => void;
}) {
  return (
    <FlatSection>
      <div className="border-b border-pp-olive/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-2xl text-pp-olive">{promotion.name}</p>
            <p className="mt-1 text-sm text-pp-black/58">
              {promotion.placement} · prioriteit {promotion.priority}
            </p>
          </div>
          <StatusBadge status={promotion.status} />
        </div>
      </div>
      <div className="grid gap-4 px-5 py-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <FieldLabel>Naam</FieldLabel>
              <Input disabled={!canEdit} value={promotion.name} onChange={(event) => onUpdate({ ...promotion, name: event.target.value, updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <FieldLabel>Placement</FieldLabel>
              <Select disabled={!canEdit} value={promotion.placement} onChange={(event) => onUpdate({ ...promotion, placement: event.target.value as Promotion["placement"], updatedAt: new Date().toISOString() })}>
                <option value="global-strip">global-strip</option>
                <option value="home-hero">home-hero</option>
                <option value="menu-page">menu-page</option>
                <option value="locations-page">locations-page</option>
                <option value="jobs-page">jobs-page</option>
                <option value="groups-page">groups-page</option>
              </Select>
            </div>
            <div>
              <FieldLabel>Status</FieldLabel>
              <Select disabled={!canPublish} value={promotion.status} onChange={(event) => onUpdate({ ...promotion, status: event.target.value as Promotion["status"], updatedAt: new Date().toISOString() })}>
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="scheduled">scheduled</option>
                <option value="expired">expired</option>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <FieldLabel>Start</FieldLabel>
              <Input disabled={!canPublish} type="datetime-local" value={promotion.startAt.slice(0, 16)} onChange={(event) => onUpdate({ ...promotion, startAt: new Date(event.target.value).toISOString(), updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <FieldLabel>Einde</FieldLabel>
              <Input disabled={!canPublish} type="datetime-local" value={promotion.endAt.slice(0, 16)} onChange={(event) => onUpdate({ ...promotion, endAt: new Date(event.target.value).toISOString(), updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <FieldLabel>Prioriteit</FieldLabel>
              <Input disabled={!canPublish} type="number" min="1" value={promotion.priority} onChange={(event) => onUpdate({ ...promotion, priority: Number(event.target.value) || 1, updatedAt: new Date().toISOString() })} />
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {LOCALES.map((locale) => (
              <div key={locale} className="border border-pp-olive/10 bg-white px-4 py-4">
                <FieldLabel>Copy {locale.toUpperCase()}</FieldLabel>
                <Textarea
                  disabled={!canEdit}
                  value={promotion.copy[locale]}
                  onChange={(event) =>
                    onUpdate({
                      ...promotion,
                      copy: { ...promotion.copy, [locale]: event.target.value },
                      updatedAt: new Date().toISOString(),
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 border-l border-pp-olive/10 pl-0 lg:pl-5">
          <MediaAssetPickerField
            label="Campagnebeeld"
            valueSrc={promotion.imageSrc}
            disabled={!canEdit}
            onSelect={onAssignImage}
          />
          <div className="grid gap-4 lg:grid-cols-1">
            <div>
              <FieldLabel>CTA label</FieldLabel>
              <Input disabled={!canEdit} value={promotion.ctaLabel} onChange={(event) => onUpdate({ ...promotion, ctaLabel: event.target.value, updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <FieldLabel>CTA href</FieldLabel>
              <Input disabled={!canEdit} value={promotion.ctaHref} onChange={(event) => onUpdate({ ...promotion, ctaHref: event.target.value, updatedAt: new Date().toISOString() })} />
            </div>
          </div>
        </div>
      </div>
    </FlatSection>
  );
}

export function MediaView() {
  const { state, setState, addAuditEntry, permissions, currentUser } = useMarketingAdmin();
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaAsset["type"]>("all");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [bulkTargetFolderId, setBulkTargetFolderId] = useState<string>("all");
  const [dropFolderId, setDropFolderId] = useState<string | null>(null);

  const folderMap = useMemo(
    () => new Map(state.mediaFolders.map((folder) => [folder.id, folder])),
    [state.mediaFolders],
  );
  const folderChildren = useMemo(() => {
    const map = new Map<string | null, MediaFolder[]>();
    state.mediaFolders.forEach((folder) => {
      const bucket = map.get(folder.parentId) ?? [];
      bucket.push(folder);
      map.set(folder.parentId, bucket);
    });
    return map;
  }, [state.mediaFolders]);
  const media = useMemo(() => state.mediaAssets, [state.mediaAssets]);
  const activeFolderIds = useMemo(
    () =>
      selectedFolderId === "all"
        ? new Set(state.mediaFolders.map((folder) => folder.id))
        : getFolderDescendantIds(state.mediaFolders, selectedFolderId),
    [selectedFolderId, state.mediaFolders],
  );

  const filteredMedia = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return media.filter((item) => {
      const inFolder = selectedFolderId === "all" || activeFolderIds.has(item.folderId);
      const typeMatches = typeFilter === "all" || item.type === typeFilter;
      const textMatches =
        !needle ||
        [
          item.name,
          item.altText,
          item.mimeType,
          item.extension,
          ...item.tags,
          ...item.usages.map((usage) => `${usage.entity} ${usage.label}`),
          folderMap.get(item.folderId)?.path ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return inFolder && typeMatches && textMatches;
    });
  }, [activeFolderIds, folderMap, media, searchQuery, selectedFolderId, typeFilter]);

  const selectedAsset =
    filteredMedia.find((item) => item.id === selectedId) ??
    filteredMedia[0] ??
    media[0] ??
    null;

  const recentAssets = useMemo(
    () =>
      [...media]
        .sort((left, right) => new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime())
        .slice(0, 5),
    [media],
  );

  const unusedAssets = useMemo(
    () => media.filter((item) => item.usages.length === 0).slice(0, 6),
    [media],
  );

  const selectedAssets = useMemo(
    () => media.filter((item) => selectedAssetIds.includes(item.id)),
    [media, selectedAssetIds],
  );

  async function handleFiles(files: FileList | null, folderId: string) {
    if (!files || !permissions.canManageMedia) return;

    const entries = Array.from(files).slice(0, 12);
    const uploadedAt = new Date().toISOString();
    const nextAssets = await Promise.all(
      entries.map(
        (file) =>
          new Promise<MediaAsset>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = typeof reader.result === "string" ? reader.result : "";
              const type = file.type.includes("svg")
                ? "svg"
                : file.type.startsWith("video/")
                  ? "video"
                  : file.type === "application/pdf"
                    ? "document"
                    : "image";

              resolve({
                id: `asset-upload-${Date.now()}-${file.name}`,
                name: file.name,
                folderId,
                src: result,
                previewSrc: result,
                type,
                extension: file.name.split(".").pop() ?? "",
                mimeType: file.type || "application/octet-stream",
                sizeBytes: file.size,
                altText: file.name.replace(/\.[^/.]+$/, ""),
                tags: ["upload", folderMap.get(folderId)?.name ?? "media"],
                uploadedAt,
                updatedAt: uploadedAt,
                uploadedBy: currentUser.id,
                usages: [],
              });
            };
            reader.readAsDataURL(file);
          }),
      ),
    );

    setState((current) => ({
      ...current,
      mediaAssets: [...nextAssets, ...current.mediaAssets],
    }));
    addAuditEntry({
      action: "upload",
      entity: "mediaAsset",
      entityId: nextAssets.map((item) => item.id).join(","),
      details: `${nextAssets.length} asset(s) geupload naar ${folderMap.get(folderId)?.path ?? "folder"}.`,
    });
    setSelectedFolderId(folderId);
    setSelectedId(nextAssets[0]?.id ?? null);
  }

  function handleCreateFolder() {
    if (!permissions.canManageMedia || !newFolderName.trim()) return;
    const parentId = selectedFolderId === "all" ? null : selectedFolderId;
    setState((current) => createFolder(current, newFolderName, parentId));
    addAuditEntry({
      action: "create",
      entity: "mediaFolder",
      entityId: slugifyFolderName(newFolderName),
      details: `Folder ${newFolderName.trim()} aangemaakt onder ${parentId ? folderMap.get(parentId)?.path ?? parentId : "root"}.`,
    });
    setNewFolderName("");
  }

  function moveAsset(assetId: string, folderId: string) {
    if (!permissions.canManageMedia) return;
    setState((current) => ({
      ...current,
      mediaAssets: current.mediaAssets.map((asset) =>
        asset.id === assetId
          ? { ...asset, folderId, updatedAt: new Date().toISOString() }
          : asset,
      ),
    }));
    addAuditEntry({
      action: "move",
      entity: "mediaAsset",
      entityId: assetId,
      details: `Asset verplaatst naar ${folderMap.get(folderId)?.path ?? folderId}.`,
    });
  }

  function moveSelectedAssets() {
    if (!permissions.canManageMedia || !selectedAssetIds.length || bulkTargetFolderId === "all") {
      return;
    }
    setState((current) => ({
      ...current,
      mediaAssets: current.mediaAssets.map((asset) =>
        selectedAssetIds.includes(asset.id)
          ? { ...asset, folderId: bulkTargetFolderId, updatedAt: new Date().toISOString() }
          : asset,
      ),
    }));
    addAuditEntry({
      action: "bulk-move",
      entity: "mediaAsset",
      entityId: selectedAssetIds.join(","),
      details: `${selectedAssetIds.length} asset(s) verplaatst naar ${folderMap.get(bulkTargetFolderId)?.path ?? bulkTargetFolderId}.`,
    });
    setSelectedAssetIds([]);
  }

  function deleteSelectedAssets() {
    if (!permissions.canManageMedia || !selectedAssetIds.length) return;
    const deletable = selectedAssets.filter((asset) => asset.usages.length === 0);
    if (!deletable.length) return;
    setState((current) => deleteMediaAssets(current, deletable.map((asset) => asset.id)));
    addAuditEntry({
      action: "bulk-delete",
      entity: "mediaAsset",
      entityId: deletable.map((asset) => asset.id).join(","),
      details: `${deletable.length} ongebruikte asset(s) verwijderd uit de media library.`,
    });
    setSelectedAssetIds((current) => current.filter((id) => !deletable.some((asset) => asset.id === id)));
  }

  function moveTreeFolder(folderId: string, nextParentId: string | null) {
    if (!permissions.canManageMedia) return;
    setState((current) => moveFolder(current, folderId, nextParentId));
    addAuditEntry({
      action: "move",
      entity: "mediaFolder",
      entityId: folderId,
      details: `Map verplaatst naar ${nextParentId ? folderMap.get(nextParentId)?.path ?? nextParentId : "root"}.`,
    });
  }

  function renderFolderTree(parentId: string | null, depth = 0): React.ReactNode {
    const children = folderChildren.get(parentId) ?? [];
    return children.map((folder) => {
      const active = folder.id === selectedFolderId;
      const count = media.filter((item) => getFolderDescendantIds(state.mediaFolders, folder.id).has(item.folderId)).length;

      return (
        <div key={folder.id} className="space-y-1">
          <button
            type="button"
            draggable={permissions.canManageMedia}
            onDragStart={(event) => event.dataTransfer.setData("text/media-folder-id", folder.id)}
            onClick={() => setSelectedFolderId(folder.id)}
            onDragOver={(event) => {
              if (!permissions.canManageMedia) return;
              event.preventDefault();
              setDropFolderId(folder.id);
            }}
            onDragLeave={() => setDropFolderId((current) => (current === folder.id ? null : current))}
            onDrop={(event) => {
              if (!permissions.canManageMedia) return;
              event.preventDefault();
              const assetId = event.dataTransfer.getData("text/media-asset-id");
              const draggedFolderId = event.dataTransfer.getData("text/media-folder-id");
              if (assetId) moveAsset(assetId, folder.id);
              if (draggedFolderId && draggedFolderId !== folder.id) moveTreeFolder(draggedFolderId, folder.id);
              setDropFolderId(null);
            }}
            className={`flex w-full items-center justify-between border px-3 py-2 text-left transition-colors ${
              active
                ? "border-pp-olive bg-pp-olive text-pp-creme"
                : dropFolderId === folder.id
                  ? "border-pp-lollypop bg-pp-lollypop/[0.06] text-pp-black"
                  : "border-pp-olive/10 bg-white text-pp-black hover:border-pp-lollypop/40"
            }`}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <span className="truncate text-sm">{folder.name}</span>
            <span className={`px-2 py-0.5 text-[0.7rem] ${active ? "bg-pp-creme/18" : "bg-pp-olive/7 text-pp-olive/55"}`}>
              {count}
            </span>
          </button>
          {renderFolderTree(folder.id, depth + 1)}
        </div>
      );
    });
  }

  return (
    <>
      <SectionHeader
        title="Media Library"
        intro="Een lokale media workspace met echte mappenstructuur, bulkacties, previews en usage-tracking. Meer file manager, minder losse cards."
        actions={
          <label className="border px-4 py-2 font-accent uppercase tracking-[0.18em] text-[0.62rem] text-pp-olive transition-colors hover:border-pp-lollypop hover:text-pp-lollypop">
            Upload assets
            <input
              type="file"
              multiple
              className="hidden"
              disabled={!permissions.canManageMedia}
              accept="image/*,video/*,.pdf,.svg"
              onChange={(event) => {
                void handleFiles(
                  event.target.files,
                  selectedFolderId === "all" ? state.mediaFolders[0]?.id ?? "folder-root-images" : selectedFolderId,
                );
                event.currentTarget.value = "";
              }}
            />
          </label>
        }
      />
      {!permissions.canManageMedia ? (
        <div className="mb-6">
          <PermissionNotice role={currentUser.role} mode="view" />
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
        <FlatSection className="p-4">
          <PanelHeader title="Folders" meta={`${state.mediaFolders.length} mappen`} />
          <form
            className="mb-4 space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateFolder();
            }}
          >
            <FieldLabel>Nieuwe map</FieldLabel>
            <Input
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              placeholder={selectedFolderId === "all" ? "Bijv. summer-2026" : `Submap in ${folderMap.get(selectedFolderId)?.name ?? "map"}`}
              disabled={!permissions.canManageMedia}
            />
            <ActionButton type="submit" tone="secondary" disabled={!permissions.canManageMedia || !newFolderName.trim()}>
              Map aanmaken
            </ActionButton>
          </form>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setSelectedFolderId("all")}
              onDragOver={(event) => {
                if (!permissions.canManageMedia) return;
                event.preventDefault();
                setDropFolderId("all");
              }}
              onDrop={(event) => {
                if (!permissions.canManageMedia) return;
                event.preventDefault();
                const draggedFolderId = event.dataTransfer.getData("text/media-folder-id");
                if (draggedFolderId) moveTreeFolder(draggedFolderId, null);
                setDropFolderId(null);
              }}
              className={`flex w-full items-center justify-between border px-3 py-2 text-left transition-colors ${
                selectedFolderId === "all"
                  ? "border-pp-olive bg-pp-olive text-pp-creme"
                  : "border-pp-olive/10 bg-white text-pp-black hover:border-pp-lollypop/40"
              }`}
            >
              <span className="truncate text-sm">All assets</span>
              <span className="bg-pp-olive/7 px-2 py-0.5 text-[0.7rem] text-current">{media.length}</span>
            </button>
            {renderFolderTree(null)}
          </div>
        </FlatSection>

        <FlatSection className="p-4">
          <PanelHeader title="Library workspace" meta={`${filteredMedia.length} assets zichtbaar`} />
          <div className="mb-4 grid gap-3 xl:grid-cols-[1fr_180px_200px]">
            <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Zoek op naam, alt text, tags, usage of mime type" />
            <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "all" | MediaAsset["type"])}>
              <option value="all">Alle types</option>
              <option value="image">Images</option>
              <option value="svg">SVG</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
            </Select>
            <Select value={bulkTargetFolderId} onChange={(event) => setBulkTargetFolderId(event.target.value)}>
              <option value="all">Bulk move naar...</option>
              {state.mediaFolders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.path}
                </option>
              ))}
            </Select>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-2 border border-pp-olive/10 bg-white px-3 py-3 text-sm text-pp-black/65">
            <span>{selectedAssetIds.length} geselecteerd</span>
            <ActionButton tone="secondary" onClick={moveSelectedAssets} disabled={!permissions.canManageMedia || !selectedAssetIds.length || bulkTargetFolderId === "all"}>
              Bulk move
            </ActionButton>
            <ActionButton tone="secondary" onClick={deleteSelectedAssets} disabled={!permissions.canManageMedia || !selectedAssets.some((asset) => asset.usages.length === 0)}>
              Delete unused
            </ActionButton>
            <button
              type="button"
              onClick={() =>
                setSelectedAssetIds(
                  selectedAssetIds.length === filteredMedia.length ? [] : filteredMedia.map((item) => item.id),
                )
              }
              className="ml-auto border border-pp-olive/12 px-3 py-2 font-accent text-[0.58rem] uppercase tracking-[0.16em] text-pp-olive"
            >
              {selectedAssetIds.length === filteredMedia.length ? "Clear selection" : "Select visible"}
            </button>
          </div>
          <div
            className={`mb-4 border border-dashed px-4 py-5 text-center ${
              permissions.canManageMedia ? "border-pp-olive/18 bg-white/70" : "border-pp-olive/10 bg-slate-50"
            }`}
            onDragOver={(event) => {
              if (!permissions.canManageMedia) return;
              event.preventDefault();
            }}
            onDrop={(event) => {
              if (!permissions.canManageMedia) return;
              event.preventDefault();
              void handleFiles(
                event.dataTransfer.files,
                selectedFolderId === "all" ? state.mediaFolders[0]?.id ?? "folder-root-images" : selectedFolderId,
              );
            }}
          >
            <p className="text-sm text-pp-black/64">
              {permissions.canManageMedia
                ? "Sleep bestanden hierheen om ze meteen in de geselecteerde map te uploaden."
                : "Viewer role: uploads en mutaties zijn uitgeschakeld."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMedia.map((item) => (
              <div key={item.id} className={`border bg-white transition-colors ${selectedAsset?.id === item.id ? "border-pp-lollypop" : "border-pp-olive/10 hover:border-pp-lollypop/35"}`}>
                <div className="flex items-center justify-between border-b border-pp-olive/10 px-3 py-2">
                  <label className="flex items-center gap-2 text-xs text-pp-black/55">
                    <input
                      type="checkbox"
                      checked={selectedAssetIds.includes(item.id)}
                      onChange={(event) =>
                        setSelectedAssetIds((current) =>
                          event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id),
                        )
                      }
                    />
                    select
                  </label>
                  <span className="text-xs text-pp-black/45">{mediaTypeLabel(item.type)}</span>
                </div>
                <button
                  type="button"
                  draggable={permissions.canManageMedia}
                  onDragStart={(event) => event.dataTransfer.setData("text/media-asset-id", item.id)}
                  onClick={() => setSelectedId(item.id)}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[4/3] bg-[#f3ecd8]">
                    {item.type === "image" || item.type === "svg" ? (
                      <Image src={item.previewSrc} alt={item.altText || item.name} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 20vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-pp-olive/55">
                        {item.type.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 px-3 py-3">
                    <p className="font-accent uppercase text-[0.52rem] tracking-[0.16em] text-pp-olive/45">
                      {folderMap.get(item.folderId)?.path ?? "folder"}
                    </p>
                    <p className="line-clamp-2 text-sm text-pp-black/72">{item.name}</p>
                    <p className="text-xs text-pp-black/45">{item.usages.length} usage(s)</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </FlatSection>

        <FlatSection className="p-4">
          <PanelHeader title="Inspector" meta={selectedAsset ? "Metadata, usages en snelle bewerkingen" : "Selecteer een asset"} />
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden border border-pp-olive/10 bg-[#f3ecd8]">
                {selectedAsset.type === "image" || selectedAsset.type === "svg" ? (
                  <Image src={selectedAsset.previewSrc} alt={selectedAsset.altText || selectedAsset.name} fill className="object-cover" sizes="360px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-pp-olive/55">
                    {mediaTypeLabel(selectedAsset.type)}
                  </div>
                )}
              </div>
              <div>
                <FieldLabel>Bestandsnaam</FieldLabel>
                <Input
                  value={selectedAsset.name}
                  disabled={!permissions.canManageMedia}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      mediaAssets: current.mediaAssets.map((asset) =>
                        asset.id === selectedAsset.id
                          ? { ...asset, name: event.target.value, updatedAt: new Date().toISOString() }
                          : asset,
                      ),
                    }))
                  }
                />
              </div>
              <div>
                <FieldLabel>Alt text</FieldLabel>
                <Textarea
                  value={selectedAsset.altText}
                  disabled={!permissions.canManageMedia}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      mediaAssets: current.mediaAssets.map((asset) =>
                        asset.id === selectedAsset.id
                          ? { ...asset, altText: event.target.value, updatedAt: new Date().toISOString() }
                          : asset,
                      ),
                    }))
                  }
                />
              </div>
              <div>
                <FieldLabel>Map</FieldLabel>
                <Select value={selectedAsset.folderId} disabled={!permissions.canManageMedia} onChange={(event) => moveAsset(selectedAsset.id, event.target.value)}>
                  {state.mediaFolders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.path}
                    </option>
                  ))}
                </Select>
              </div>
              {copyRows([
                { label: "Type", value: mediaTypeLabel(selectedAsset.type) },
                { label: "Folder", value: folderMap.get(selectedAsset.folderId)?.path ?? selectedAsset.folderId },
                { label: "File size", value: formatBytes(selectedAsset.sizeBytes) },
                { label: "MIME", value: selectedAsset.mimeType },
                { label: "Uploaded by", value: state.users.find((user) => user.id === selectedAsset.uploadedBy)?.name ?? selectedAsset.uploadedBy },
                { label: "Source path", value: selectedAsset.src.slice(0, 80) + (selectedAsset.src.length > 80 ? "..." : "") },
              ])}
              <div>
                <PanelHeader title="Recent toegevoegd" meta="Nieuwste uploads en seeded assets." />
                <div className="space-y-2">
                  {recentAssets.map((asset) => (
                    <button key={asset.id} type="button" onClick={() => setSelectedId(asset.id)} className="flex w-full items-center justify-between border border-pp-olive/10 bg-white px-3 py-3 text-left hover:border-pp-lollypop/35">
                      <div>
                        <p className="text-sm text-pp-black/74">{asset.name}</p>
                        <p className="mt-1 text-xs text-pp-black/45">{folderMap.get(asset.folderId)?.path ?? asset.folderId}</p>
                      </div>
                      <span className="text-xs text-pp-black/45">{formatBytes(asset.sizeBytes)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <PanelHeader title="Unused assets" meta="Assets zonder usage-koppeling." />
                {unusedAssets.length ? (
                  <div className="space-y-2">
                    {unusedAssets.map((asset) => (
                      <button key={asset.id} type="button" onClick={() => setSelectedId(asset.id)} className="flex w-full items-center justify-between border border-pp-olive/10 bg-white px-3 py-3 text-left hover:border-pp-lollypop/35">
                        <div>
                          <p className="text-sm text-pp-black/74">{asset.name}</p>
                          <p className="mt-1 text-xs text-pp-black/45">{folderMap.get(asset.folderId)?.path ?? asset.folderId}</p>
                        </div>
                        <span className="font-accent text-[0.54rem] uppercase tracking-[0.16em] text-pp-christmas">unused</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-pp-black/60">Alles heeft momenteel een usage-koppeling.</p>
                )}
              </div>
              <div>
                <PanelHeader title="Usage" meta={`${selectedAsset.usages.length} references`} />
                {selectedAsset.usages.length ? (
                  <div className="space-y-2">
                    {selectedAsset.usages.map((usage) => (
                      <div key={`${usage.entity}-${usage.entityId}`} className="border border-pp-olive/8 bg-white/75 px-3 py-3">
                        <p className="font-accent uppercase text-[0.52rem] tracking-[0.16em] text-pp-olive/45">
                          {usage.entity}
                        </p>
                        <p className="mt-1 text-sm text-pp-black/72">{usage.label}</p>
                        {usage.route ? <p className="mt-1 text-xs text-pp-black/45">{usage.route}</p> : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-pp-black/58">Nog niet gekoppeld aan content.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-pp-black/60">Geen assets gevonden in deze map.</p>
          )}
        </FlatSection>
      </div>
    </>
  );
}

export function SettingsView() {
  const { state, setState, addAuditEntry, permissions, currentUser } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Settings"
        intro="Globale merk- en reserveerinstellingen die de site als geheel beïnvloeden."
      />
      {!permissions.canEdit ? (
        <div className="mb-6">
          <PermissionNotice role={currentUser.role} mode="view" />
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Surface>
          <PanelHeader
            title="Brand controls"
            meta="Deze waarden zijn sitebreed bruikbaar en vormen de basis voor latere backend-sync."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <FieldLabel>Brand tagline</FieldLabel>
              <Input
                value={state.globalSettings.brandTagline}
                disabled={!permissions.canEdit}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "globalSettings", "brandTagline", (current) => ({
                    ...current,
                    globalSettings: {
                      ...current.globalSettings,
                      brandTagline: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <FieldLabel>Reserve route</FieldLabel>
              <Input
                value={state.globalSettings.reserveUrl}
                disabled={!permissions.canEdit}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "globalSettings", "reserveUrl", (current) => ({
                    ...current,
                    globalSettings: {
                      ...current.globalSettings,
                      reserveUrl: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Footer copy</FieldLabel>
              <Textarea
                value={state.globalSettings.footerCopy}
                disabled={!permissions.canEdit}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "globalSettings", "footerCopy", (current) => ({
                    ...current,
                    globalSettings: {
                      ...current.globalSettings,
                      footerCopy: event.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </Surface>

        <Surface>
          <PanelHeader
            title="Current outputs"
            meta="Snel overzicht van de waarden die publiek kunnen doorsijpelen."
          />
          {copyRows([
            { label: "SEO title", value: state.globalSettings.seoTitle },
            { label: "SEO description", value: state.globalSettings.seoDescription },
            { label: "Instagram", value: state.globalSettings.instagramUrl },
            { label: "Facebook", value: state.globalSettings.facebookUrl },
          ])}
        </Surface>
      </div>
    </>
  );
}

export function AuditView() {
  const { state, currentUser } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Audit"
        intro="Chronologische view van lokale wijzigingen, gegroepeerd als een professionele activity feed in plaats van ruwe logregels."
      />
      <div className="mb-6">
        <PermissionNotice role={currentUser.role} mode="view" />
      </div>
      <Surface>
        <PanelHeader
          title="Activity feed"
          meta={`${state.auditLog.length} events gelogd`}
        />
        {state.auditLog.length ? (
          <div className="space-y-3">
            {state.auditLog.map((entry) => (
              <div
                key={entry.id}
                className="rounded-[0.95rem] border border-pp-olive/9 bg-white/80 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={entry.action} />
                  <p className="font-accent uppercase text-[0.55rem] tracking-[0.16em] text-pp-olive/45">
                    {entry.entity}
                  </p>
                </div>
                <p className="mt-2 text-sm text-pp-black/72">{entry.details}</p>
                <p className="mt-2 text-xs text-pp-black/42">{entry.timestamp}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-pp-black/60">
            Nog geen wijzigingen gelogd.
          </p>
        )}
      </Surface>
    </>
  );
}
