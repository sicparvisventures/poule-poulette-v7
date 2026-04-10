"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { JobsLocale } from "@/content/jobsPage";
import { useMarketingAdmin } from "@/lib/marketing-admin/store";
import type {
  ContentStatus,
  ManagedJob,
  ManagedLocation,
  ManagedMenuSection,
  MarketingAdminState,
  Promotion,
} from "@/lib/marketing-admin/types";

const LOCALES: JobsLocale[] = ["nl", "en", "fr"];
const STATUSES: ContentStatus[] = ["draft", "published", "archived"];

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
      className={`mt-1 w-full rounded-[0.75rem] border border-pp-olive/14 bg-white px-3 py-2.5 text-sm text-pp-black outline-none transition-colors focus:border-pp-lollypop ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-1 min-h-28 w-full rounded-[0.95rem] border border-pp-olive/14 bg-white px-3 py-2.5 text-sm leading-relaxed text-pp-black outline-none transition-colors focus:border-pp-lollypop ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`mt-1 w-full rounded-[0.75rem] border border-pp-olive/14 bg-white px-3 py-2.5 text-sm text-pp-black outline-none transition-colors focus:border-pp-lollypop ${props.className ?? ""}`}
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
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Locations"
        intro="Werk vestigingscontent bij zoals marketing ermee denkt: hero copy bovenaan, daaronder de kaarten per locatie met beeld, status en praktische info."
      />

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
            />
          ))}
        </div>
      </div>
    </>
  );
}

function LocationEditor({
  location,
  onChange,
}: {
  location: ManagedLocation;
  onChange: (field: keyof ManagedLocation, value: ManagedLocation[keyof ManagedLocation]) => void;
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
              <Input value={location.city} onChange={(event) => onChange("city", event.target.value)} />
            </div>
            <div>
              <FieldLabel>Status</FieldLabel>
              <Select
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
              <Input value={location.title} onChange={(event) => onChange("title", event.target.value)} />
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Hero image</FieldLabel>
              <Input value={location.imageSrc} onChange={(event) => onChange("imageSrc", event.target.value)} />
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Detail intro</FieldLabel>
              <Textarea
                value={location.detailIntro}
                onChange={(event) => onChange("detailIntro", event.target.value)}
              />
            </div>
          </div>
          <label className="mt-4 inline-flex items-center gap-2 text-sm text-pp-black/68">
            <input
              type="checkbox"
              checked={location.isFeatured}
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
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Menu"
        intro="De menu-editor is nu opgezet als redactionele sequencer: page copy links, slides rechts, telkens met preview en korte copy."
      />

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
              onUpdate={(nextSection) =>
                updateWithAudit(setState, addAuditEntry, "update", "menuSection", section.id, (current) => ({
                  ...current,
                  menuSections: current.menuSections.map((entry, entryIndex) =>
                    entryIndex === index ? nextSection : entry,
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

function MenuSectionEditor({
  section,
  index,
  onUpdate,
}: {
  section: ManagedMenuSection;
  index: number;
  onUpdate: (nextSection: ManagedMenuSection) => void;
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
              <Input value={section.label} onChange={(event) => onUpdate({ ...section, label: event.target.value, updatedAt: new Date().toISOString() })} />
            </div>
            <div>
              <FieldLabel>Status</FieldLabel>
              <Select value={section.status} onChange={(event) => onUpdate({ ...section, status: event.target.value as ContentStatus, updatedAt: new Date().toISOString() })}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Image src</FieldLabel>
              <Input value={section.src} onChange={(event) => onUpdate({ ...section, src: event.target.value, updatedAt: new Date().toISOString() })} />
            </div>
            <div className="lg:col-span-2">
              <FieldLabel>Blurb</FieldLabel>
              <Textarea value={section.blurb} onChange={(event) => onUpdate({ ...section, blurb: event.target.value, updatedAt: new Date().toISOString() })} />
            </div>
          </div>
        </div>
      </div>
    </Surface>
  );
}

export function JobsView() {
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Jobs"
        intro="Copy en vacatures zijn gegroepeerd zoals marketing ze beheert: eerst de page messaging, daarna de jobcards met meertalige samenvattingen."
      />
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
  onUpdate,
}: {
  job: ManagedJob;
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
          <Input value={job.type} onChange={(event) => onUpdate({ ...job, type: event.target.value, updatedAt: new Date().toISOString() })} />
        </div>
        <div>
          <FieldLabel>Plaats</FieldLabel>
          <Input value={job.place} onChange={(event) => onUpdate({ ...job, place: event.target.value, updatedAt: new Date().toISOString() })} />
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <Select value={job.status} onChange={(event) => onUpdate({ ...job, status: event.target.value as ContentStatus, updatedAt: new Date().toISOString() })}>
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
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Groups"
        intro="Groepsformules zijn hier compacter opgezet, met preview van de kaart en kerncopy in één editorblok per formule."
      />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Surface>
          <PanelHeader
            title="Page copy"
            meta="Teksten voor de groepen-overview en de modalervaring."
          />
          <FieldLabel>Intro</FieldLabel>
          <Textarea
            value={state.groupsPageCopy.intro}
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
                      <FieldLabel>Blurb</FieldLabel>
                      <Textarea
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
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Promotions"
        intro="Promoties zijn hier opgezet als campagnes met duidelijke status, placement en meertalige copyblokken."
        actions={
          <ActionButton
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
      <div className="grid gap-4 md:grid-cols-3">
        <MiniStat label="live promo's" value={state.promotions.filter((item) => item.status === "active").length} />
        <MiniStat label="draft promo's" value={state.promotions.filter((item) => item.status === "draft").length} />
        <MiniStat label="placements" value={new Set(state.promotions.map((item) => item.placement)).size} />
      </div>
      <div className="mt-6 space-y-4">
        {state.promotions.map((promotion, index) => (
          <PromotionEditor
            key={promotion.id}
            promotion={promotion}
            onUpdate={(nextPromotion) =>
              updateWithAudit(setState, addAuditEntry, "update", "promotion", promotion.id, (current) => ({
                ...current,
                promotions: current.promotions.map((entry, entryIndex) =>
                  entryIndex === index ? nextPromotion : entry,
                ),
              }))
            }
          />
        ))}
      </div>
    </>
  );
}

function PromotionEditor({
  promotion,
  onUpdate,
}: {
  promotion: Promotion;
  onUpdate: (promotion: Promotion) => void;
}) {
  return (
    <Surface>
      <PanelHeader
        title={promotion.name}
        meta={`${promotion.placement} · prioriteit ${promotion.priority}`}
        action={<StatusBadge status={promotion.status} />}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <FieldLabel>Naam</FieldLabel>
          <Input value={promotion.name} onChange={(event) => onUpdate({ ...promotion, name: event.target.value, updatedAt: new Date().toISOString() })} />
        </div>
        <div>
          <FieldLabel>Placement</FieldLabel>
          <Select value={promotion.placement} onChange={(event) => onUpdate({ ...promotion, placement: event.target.value as Promotion["placement"], updatedAt: new Date().toISOString() })}>
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
          <Select value={promotion.status} onChange={(event) => onUpdate({ ...promotion, status: event.target.value as Promotion["status"], updatedAt: new Date().toISOString() })}>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="scheduled">scheduled</option>
            <option value="expired">expired</option>
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {LOCALES.map((locale) => (
          <div key={locale} className="rounded-[0.95rem] border border-pp-olive/9 bg-white/80 p-4">
            <FieldLabel>Copy {locale.toUpperCase()}</FieldLabel>
            <Textarea
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
    </Surface>
  );
}

type MediaEntry = {
  id: string;
  scope: string;
  src: string;
  folder: string;
  type: "image" | "video" | "document";
  usageLabel: string;
};

function inferMediaType(src: string): MediaEntry["type"] {
  const clean = src.toLowerCase();
  if (clean.endsWith(".mp4") || clean.endsWith(".mov") || clean.endsWith(".webm")) return "video";
  if (clean.endsWith(".pdf")) return "document";
  return "image";
}

function inferFolder(src: string) {
  const clean = src.startsWith("/") ? src.slice(1) : src;
  const [root, second] = clean.split("/");
  return second ? `${root}/${second}` : root;
}

export function MediaView() {
  const { state } = useMarketingAdmin();
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const media = useMemo<MediaEntry[]>(() => {
    const items = [
      ...state.locations.map((location) => ({
        id: `location-${location.id}`,
        scope: `Locatie · ${location.city}`,
        src: location.imageSrc,
        usageLabel: "Location hero",
      })),
      ...state.menuSections.map((section) => ({
        id: `menu-${section.id}`,
        scope: `Menu · ${section.label}`,
        src: section.src,
        usageLabel: "Menu slide",
      })),
      ...state.groups.map((group) => ({
        id: `group-${group.id}`,
        scope: `Groepen · ${group.label}`,
        src: group.src,
        usageLabel: "Group menu",
      })),
      ...state.promotions
        .filter((promotion) => promotion.imageSrc)
        .map((promotion) => ({
          id: `promo-${promotion.id}`,
          scope: `Promotie · ${promotion.name}`,
          src: promotion.imageSrc ?? "",
          usageLabel: "Campaign asset",
        })),
    ];

    return items
      .filter((item) => item.src)
      .map((item) => ({
        ...item,
        folder: inferFolder(item.src),
        type: inferMediaType(item.src),
      }));
  }, [state]);

  const folders = useMemo(
    () => ["all", ...Array.from(new Set(media.map((item) => item.folder))).sort()],
    [media],
  );

  const visibleMedia = useMemo(
    () => media.filter((item) => selectedFolder === "all" || item.folder === selectedFolder),
    [media, selectedFolder],
  );

  const selectedAsset =
    visibleMedia.find((item) => item.id === selectedId) ??
    visibleMedia[0] ??
    null;

  return (
    <>
      <SectionHeader
        title="Media Library"
        intro="Een media-overzicht dat meer aanvoelt als een echte bibliotheek: mapnavigatie links, previews in het midden en usage context rechts."
      />
      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
        <Surface className="p-4">
          <PanelHeader
            title="Folders"
            meta={`${media.length} assets in gebruik`}
          />
          <div className="space-y-2">
            {folders.map((folder) => {
              const count = folder === "all"
                ? media.length
                : media.filter((item) => item.folder === folder).length;
              const active = folder === selectedFolder;
              return (
                <button
                  key={folder}
                  type="button"
                  onClick={() => setSelectedFolder(folder)}
                  className={`flex w-full items-center justify-between rounded-[0.9rem] border px-3 py-2 text-left transition-colors ${
                    active
                      ? "border-pp-olive bg-pp-olive text-pp-creme"
                      : "border-pp-olive/10 bg-white text-pp-black hover:border-pp-lollypop/40"
                  }`}
                >
                  <span className="truncate text-sm">{folder === "all" ? "All assets" : folder}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[0.7rem] ${active ? "bg-pp-creme/18" : "bg-pp-olive/7 text-pp-olive/55"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Surface>

        <Surface className="p-4">
          <PanelHeader
            title="Preview grid"
            meta={selectedFolder === "all" ? "Alle gebruikte assets" : `Map: ${selectedFolder}`}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleMedia.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`overflow-hidden rounded-[1rem] border text-left transition-colors ${
                  selectedAsset?.id === item.id
                    ? "border-pp-lollypop bg-pp-lollypop/[0.06]"
                    : "border-pp-olive/10 bg-white hover:border-pp-lollypop/35"
                }`}
              >
                <div className="relative aspect-[4/3] bg-[#f3ecd8]">
                  {item.type === "image" ? (
                    <Image src={item.src} alt={item.scope} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 20vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-pp-olive/55">
                      {item.type.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="space-y-1 px-3 py-3">
                  <p className="font-accent uppercase text-[0.52rem] tracking-[0.16em] text-pp-olive/45">
                    {item.usageLabel}
                  </p>
                  <p className="line-clamp-2 text-sm text-pp-black/72">{item.scope}</p>
                </div>
              </button>
            ))}
          </div>
        </Surface>

        <Surface className="p-4">
          <PanelHeader
            title="Asset detail"
            meta={selectedAsset ? "Gebruik, map en bronpad" : "Selecteer een asset"}
          />
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-pp-olive/10 bg-[#f3ecd8]">
                {selectedAsset.type === "image" ? (
                  <Image src={selectedAsset.src} alt={selectedAsset.scope} fill className="object-cover" sizes="320px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-pp-olive/55">
                    {selectedAsset.type.toUpperCase()}
                  </div>
                )}
              </div>
              {copyRows([
                { label: "Usage", value: selectedAsset.scope },
                { label: "Folder", value: selectedAsset.folder },
                { label: "Type", value: selectedAsset.type },
                { label: "Source path", value: selectedAsset.src },
              ])}
            </div>
          ) : (
            <p className="text-sm text-pp-black/60">Geen assets gevonden in deze map.</p>
          )}
        </Surface>
      </div>
    </>
  );
}

export function SettingsView() {
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Settings"
        intro="Globale merk- en reserveerinstellingen die de site als geheel beïnvloeden."
      />
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
  const { state } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Audit"
        intro="Chronologische view van lokale wijzigingen, gegroepeerd als een professionele activity feed in plaats van ruwe logregels."
      />
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
