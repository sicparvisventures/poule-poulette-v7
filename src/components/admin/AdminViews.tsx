"use client";

import { useMemo } from "react";
import type { JobsLocale } from "@/content/jobsPage";
import { useMarketingAdmin } from "@/lib/marketing-admin/store";
import type {
  ContentStatus,
  ManagedJob,
  ManagedLocation,
  MarketingAdminState,
  Promotion,
} from "@/lib/marketing-admin/types";

function SectionHeader({
  title,
  intro,
}: {
  title: string;
  intro: string;
}) {
  return (
    <div className="mb-6">
      <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-olive/48 uppercase">
        Content management
      </p>
      <h1 className="font-display mt-2 text-4xl text-pp-olive">{title}</h1>
      <p className="font-accent mt-3 max-w-3xl text-sm leading-relaxed text-pp-black/68">
        {intro}
      </p>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-sm border border-pp-olive/12 bg-[#fffdf5] p-5 shadow-[0_14px_34px_rgb(28_56_52/0.06)] ${className}`}>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-accent text-[0.58rem] tracking-[0.18em] text-pp-olive/58 uppercase">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-1 w-full border border-pp-olive/14 bg-pp-white px-3 py-2 text-sm text-pp-black outline-none transition-colors focus:border-pp-lollypop ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-1 min-h-28 w-full border border-pp-olive/14 bg-pp-white px-3 py-2 text-sm text-pp-black outline-none transition-colors focus:border-pp-lollypop ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`mt-1 w-full border border-pp-olive/14 bg-pp-white px-3 py-2 text-sm text-pp-black outline-none transition-colors focus:border-pp-lollypop ${props.className ?? ""}`}
    />
  );
}

function MetaBar({ entity, count }: { entity: string; count: number }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-pp-olive/8 pb-4">
      <span className="font-accent rounded-full bg-pp-olive/7 px-3 py-1 text-[0.58rem] tracking-[0.18em] text-pp-olive/60 uppercase">
        {entity}
      </span>
      <span className="font-accent text-[0.62rem] tracking-[0.18em] text-pp-black/48 uppercase">
        {count} items
      </span>
    </div>
  );
}

const LOCALES: JobsLocale[] = ["nl", "en", "fr"];
const STATUSES: ContentStatus[] = ["draft", "published", "archived"];

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

export function DashboardView() {
  const { state } = useMarketingAdmin();
  const openJobs = state.jobs.filter((job) => job.status === "published").length;
  const activePromotions = state.promotions.filter((promo) => promo.status === "active").length;
  const featuredLocations = state.locations.filter((location) => location.isFeatured).length;

  const cards = [
    { label: "Locaties live", value: state.locations.length },
    { label: "Menu secties", value: state.menuSections.length },
    { label: "Jobs live", value: openJobs },
    { label: "Groepsmenu's", value: state.groups.length },
    { label: "Actieve promo's", value: activePromotions },
    { label: "Featured locaties", value: featuredLocations },
  ];

  return (
    <>
      <SectionHeader
        title="Dashboard"
        intro="Deze admin-zone is overgenomen uit de content-hub-aanpak en nu ingebed in jullie Next-project. Alles draait voorlopig op een gedeelde browser store."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="font-accent text-[0.58rem] tracking-[0.2em] text-pp-olive/55 uppercase">
              {card.label}
            </p>
            <p className="font-display mt-3 text-5xl text-pp-olive">{card.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <MetaBar entity="Laatste wijzigingen" count={state.auditLog.length} />
          {state.auditLog.length ? (
            <div className="space-y-3">
              {state.auditLog.slice(0, 6).map((entry) => (
                <div key={entry.id} className="border-l-2 border-pp-lollypop/45 pl-3">
                  <p className="font-accent text-xs tracking-[0.14em] text-pp-olive/68 uppercase">
                    {entry.entity} · {entry.action}
                  </p>
                  <p className="mt-1 text-sm text-pp-black/72">{entry.details}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-accent text-sm text-pp-black/58">
              Nog geen audit entries. Zodra je hier content wijzigt, loggen we dat lokaal mee.
            </p>
          )}
        </Card>

        <Card>
          <MetaBar entity="Publish model" count={1} />
          <div className="space-y-3 font-accent text-sm leading-relaxed text-pp-black/68">
            <p>Admin data wordt gesynct via `localStorage`, zodat editor en publieke pagina’s dezelfde content lezen.</p>
            <p>Dit vervangt de hardcoded content nog niet op serverniveau. Metadata en statische routes blijven voorlopig seeded uit `src/content/*`.</p>
            <p>De volgende stap later is een backend adapter achter dezelfde contentvormen hangen.</p>
          </div>
        </Card>
      </div>
    </>
  );
}

export function LocationsView() {
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Locaties"
        intro="Bewerk de locaties en de tekstblokken voor de locaties-ervaring. Wijzigingen verschijnen na refresh ook op `/locations`."
      />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <MetaBar entity="Page copy" count={1} />
          <div className="space-y-4">
            <div>
              <Label>Pagina intro</Label>
              <Textarea
                value={state.locationsPageCopy.intro}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "locationsPageCopy", "locations-copy", (current) => ({
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
              <Label>Marquee phrases</Label>
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
          </div>
        </Card>

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
    <Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <Label>Stad</Label>
          <Input value={location.city} onChange={(event) => onChange("city", event.target.value)} />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={location.status} onChange={(event) => onChange("status", event.target.value as ContentStatus)}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mt-4">
        <Label>Titel</Label>
        <Input value={location.title} onChange={(event) => onChange("title", event.target.value)} />
      </div>
      <div className="mt-4">
        <Label>Detail intro</Label>
        <Textarea value={location.detailIntro} onChange={(event) => onChange("detailIntro", event.target.value)} />
      </div>
      <div className="mt-4">
        <Label>Image src</Label>
        <Input value={location.imageSrc} onChange={(event) => onChange("imageSrc", event.target.value)} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          id={`featured-${location.id}`}
          type="checkbox"
          checked={location.isFeatured}
          onChange={(event) => onChange("isFeatured", event.target.checked)}
        />
        <label htmlFor={`featured-${location.id}`} className="font-accent text-sm text-pp-black/72">
          Featured locatie
        </label>
      </div>
    </Card>
  );
}

export function MenuView() {
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Menu"
        intro="Overgenomen uit het admin-gedeelte van content-hub-pro en aangepast voor jullie bestaande menu experience."
      />
      <Card>
        <MetaBar entity="Page copy" count={1} />
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Titel</Label>
            <Input
              value={state.menuPageCopy.title}
              onChange={(event) =>
                updateWithAudit(setState, addAuditEntry, "update", "menuPageCopy", "menu-page", (current) => ({
                  ...current,
                  menuPageCopy: {
                    ...current.menuPageCopy,
                    title: event.target.value,
                  },
                }))
              }
            />
          </div>
          <div>
            <Label>Intro bar</Label>
            <Input
              value={state.menuPageCopy.introBar}
              onChange={(event) =>
                updateWithAudit(setState, addAuditEntry, "update", "menuPageCopy", "menu-introbar", (current) => ({
                  ...current,
                  menuPageCopy: {
                    ...current.menuPageCopy,
                    introBar: event.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      </Card>

      <div className="mt-6 space-y-4">
        {state.menuSections.map((section, index) => (
          <Card key={section.id}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label>Label</Label>
                <Input
                  value={section.label}
                  onChange={(event) =>
                    updateWithAudit(setState, addAuditEntry, "update", "menuSection", section.id, (current) => ({
                      ...current,
                      menuSections: current.menuSections.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, label: event.target.value, updatedAt: new Date().toISOString() }
                          : entry,
                      ),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Image src</Label>
                <Input
                  value={section.src}
                  onChange={(event) =>
                    updateWithAudit(setState, addAuditEntry, "update", "menuSection", section.id, (current) => ({
                      ...current,
                      menuSections: current.menuSections.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, src: event.target.value, updatedAt: new Date().toISOString() }
                          : entry,
                      ),
                    }))
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <Label>Blurb</Label>
              <Textarea
                value={section.blurb}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "menuSection", section.id, (current) => ({
                    ...current,
                    menuSections: current.menuSections.map((entry, entryIndex) =>
                      entryIndex === index
                        ? { ...entry, blurb: event.target.value, updatedAt: new Date().toISOString() }
                        : entry,
                    ),
                  }))
                }
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export function JobsView() {
  const { state, setState, addAuditEntry } = useMarketingAdmin();
  const firstJob = state.jobs[0];

  return (
    <>
      <SectionHeader
        title="Jobs"
        intro="De jobs-editor stuurt nu de jobs experience op de site aan. Het sollicitatie-endpoint blijft voorlopig zoals het is."
      />
      <Card>
        <MetaBar entity="Page copy" count={1} />
        <div className="grid gap-4 lg:grid-cols-3">
          {LOCALES.map((locale) => (
            <div key={locale}>
              <Label>Intro {locale.toUpperCase()}</Label>
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
      </Card>

      <div className="mt-6 space-y-4">
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
        {!firstJob ? null : (
          <Card className="border-dashed">
            <p className="font-accent text-sm text-pp-black/58">
              Extra jobvelden zoals responsibilities/profile/offer blijven mee in de store zitten, maar deze eerste integratie focust op de velden die de publieke cards vandaag gebruiken.
            </p>
          </Card>
        )}
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
    <Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <Label>Type</Label>
          <Input value={job.type} onChange={(event) => onUpdate({ ...job, type: event.target.value, updatedAt: new Date().toISOString() })} />
        </div>
        <div>
          <Label>Plaats</Label>
          <Input value={job.place} onChange={(event) => onUpdate({ ...job, place: event.target.value, updatedAt: new Date().toISOString() })} />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={job.status} onChange={(event) => onUpdate({ ...job, status: event.target.value as ContentStatus, updatedAt: new Date().toISOString() })}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {LOCALES.map((locale) => (
          <div key={locale}>
            <Label>Titel {locale.toUpperCase()}</Label>
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
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {LOCALES.map((locale) => (
          <div key={locale}>
            <Label>Summary {locale.toUpperCase()}</Label>
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
        ))}
      </div>
    </Card>
  );
}

export function GroupsView() {
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Groepen"
        intro="Groepsmenu’s en page copy kunnen nu rechtstreeks vanuit de admin aangepast worden."
      />
      <Card>
        <MetaBar entity="Page copy" count={1} />
        <Label>Intro</Label>
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
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {state.groups.map((group, index) => (
          <Card key={group.id}>
            <Label>Label</Label>
            <Input
              value={group.label}
              onChange={(event) =>
                updateWithAudit(setState, addAuditEntry, "update", "groupTier", group.id, (current) => ({
                  ...current,
                  groups: current.groups.map((entry, entryIndex) =>
                    entryIndex === index
                      ? { ...entry, label: event.target.value, updatedAt: new Date().toISOString() }
                      : entry,
                  ),
                }))
              }
            />
            <div className="mt-4">
              <Label>Tagline</Label>
              <Input
                value={group.tagline}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "groupTier", group.id, (current) => ({
                    ...current,
                    groups: current.groups.map((entry, entryIndex) =>
                      entryIndex === index
                        ? { ...entry, tagline: event.target.value, updatedAt: new Date().toISOString() }
                        : entry,
                    ),
                  }))
                }
              />
            </div>
            <div className="mt-4">
              <Label>Blurb</Label>
              <Textarea
                value={group.blurb}
                onChange={(event) =>
                  updateWithAudit(setState, addAuditEntry, "update", "groupTier", group.id, (current) => ({
                    ...current,
                    groups: current.groups.map((entry, entryIndex) =>
                      entryIndex === index
                        ? { ...entry, blurb: event.target.value, updatedAt: new Date().toISOString() }
                        : entry,
                    ),
                  }))
                }
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export function PromotionsView() {
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Promoties"
        intro="De promo manager is mee verhuisd. Publieke pagina’s lezen de hoogste actieve promo per placement uit dezelfde browser store."
      />
      <Card>
        <button
          type="button"
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
          className="border border-pp-olive bg-pp-olive px-4 py-2 font-accent text-[0.62rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
        >
          Nieuwe promotie
        </button>
      </Card>

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
    <Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <div>
          <Label>Naam</Label>
          <Input value={promotion.name} onChange={(event) => onUpdate({ ...promotion, name: event.target.value, updatedAt: new Date().toISOString() })} />
        </div>
        <div>
          <Label>Placement</Label>
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
          <Label>Status</Label>
          <Select value={promotion.status} onChange={(event) => onUpdate({ ...promotion, status: event.target.value as Promotion["status"], updatedAt: new Date().toISOString() })}>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="scheduled">scheduled</option>
            <option value="expired">expired</option>
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {LOCALES.map((locale) => (
          <div key={locale}>
            <Label>Copy {locale.toUpperCase()}</Label>
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
    </Card>
  );
}

export function MediaView() {
  const { state } = useMarketingAdmin();
  const media = useMemo(() => {
    const items = [
      ...state.locations.map((location) => ({
        scope: `Locatie · ${location.city}`,
        src: location.imageSrc,
      })),
      ...state.menuSections.map((section) => ({
        scope: `Menu · ${section.label}`,
        src: section.src,
      })),
      ...state.groups.map((group) => ({
        scope: `Groepen · ${group.label}`,
        src: group.src,
      })),
      ...state.promotions
        .filter((promotion) => promotion.imageSrc)
        .map((promotion) => ({
          scope: `Promotie · ${promotion.name}`,
          src: promotion.imageSrc ?? "",
        })),
    ];

    return items.filter((item) => item.src);
  }, [state]);

  return (
    <>
      <SectionHeader
        title="Media"
        intro="Dit is de lichtgewicht media-library uit de admin integratie. Voor nu tonen we alle gebruikte assets en hun context."
      />
      <Card>
        <MetaBar entity="Assets in gebruik" count={media.length} />
        <div className="space-y-3">
          {media.map((item) => (
            <div key={`${item.scope}-${item.src}`} className="grid gap-1 border-b border-pp-olive/8 pb-3 last:border-b-0">
              <p className="font-accent text-[0.58rem] tracking-[0.18em] text-pp-olive/52 uppercase">
                {item.scope}
              </p>
              <code className="text-sm text-pp-black/72">{item.src}</code>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function SettingsView() {
  const { state, setState, addAuditEntry } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Settings"
        intro="Globale merk- en reserveerinstellingen zitten klaar in dezelfde content store."
      />
      <Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Brand tagline</Label>
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
            <Label>Reserve url</Label>
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
        </div>
        <div className="mt-4">
          <Label>Footer copy</Label>
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
      </Card>
    </>
  );
}

export function AuditView() {
  const { state } = useMarketingAdmin();

  return (
    <>
      <SectionHeader
        title="Audit log"
        intro="Lokale wijzigingen worden meteen mee gelogd zodat later de overgang naar een echte publish-flow minder abrupt wordt."
      />
      <Card>
        <MetaBar entity="Events" count={state.auditLog.length} />
        {state.auditLog.length ? (
          <div className="space-y-3">
            {state.auditLog.map((entry) => (
              <div key={entry.id} className="border-l-2 border-pp-olive/20 pl-3">
                <p className="font-accent text-[0.58rem] tracking-[0.18em] text-pp-olive/55 uppercase">
                  {entry.entity} · {entry.action}
                </p>
                <p className="mt-1 text-sm text-pp-black/70">{entry.details}</p>
                <p className="mt-1 text-xs text-pp-black/46">{entry.timestamp}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-accent text-sm text-pp-black/58">
            Nog geen wijzigingen gelogd.
          </p>
        )}
      </Card>
    </>
  );
}
