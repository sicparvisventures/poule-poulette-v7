"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MarketingAdminProvider, useMarketingAdmin } from "@/lib/marketing-admin/store";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", shortLabel: "DB", icon: "dashboard" },
  { href: "/admin/locations", label: "Locaties", shortLabel: "LO", icon: "locations" },
  { href: "/admin/menu", label: "Menu", shortLabel: "ME", icon: "menu" },
  { href: "/admin/jobs", label: "Jobs", shortLabel: "JB", icon: "jobs" },
  { href: "/admin/groups", label: "Groepen", shortLabel: "GR", icon: "groups" },
  { href: "/admin/promotions", label: "Promoties", shortLabel: "PR", icon: "promotions" },
  { href: "/admin/media", label: "Media", shortLabel: "MD", icon: "media" },
  { href: "/admin/settings", label: "Settings", shortLabel: "ST", icon: "settings" },
  { href: "/admin/audit", label: "Audit", shortLabel: "AU", icon: "audit" },
] as const;

const SIDEBAR_STORAGE_KEY = "ppsite.admin.sidebar.collapsed";

function AdminIcon({
  icon,
  shortLabel,
}: {
  icon: (typeof NAV_ITEMS)[number]["icon"];
  shortLabel: string;
}) {
  const common = "h-[18px] w-[18px] stroke-current";

  switch (icon) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="1.75" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" strokeWidth="1.75" />
          <rect x="14" y="11" width="7" height="10" rx="1.5" strokeWidth="1.75" />
          <rect x="3" y="13" width="7" height="8" rx="1.5" strokeWidth="1.75" />
        </svg>
      );
    case "locations":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M12 21c4-4.6 6-8 6-11a6 6 0 1 0-12 0c0 3 2 6.4 6 11Z" strokeWidth="1.75" />
          <circle cx="12" cy="10" r="2.5" strokeWidth="1.75" />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4Z" strokeWidth="1.75" />
          <path d="M8 7h8M8 11h8M8 15h5" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "jobs":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" strokeWidth="1.75" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeWidth="1.75" />
          <path d="M4 12h16" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "groups":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <circle cx="8" cy="9" r="3" strokeWidth="1.75" />
          <circle cx="16.5" cy="10" r="2.5" strokeWidth="1.75" />
          <path d="M3.5 19c.7-2.5 2.7-4 5.5-4s4.8 1.5 5.5 4" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M14.5 18.5c.4-1.6 1.7-2.8 3.7-3.2" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "promotions":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M4 10V6l14-2v16l-14-2v-4" strokeWidth="1.75" />
          <path d="M4 10h4v4H4" strokeWidth="1.75" />
          <path d="M8 18l1.5 3" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "media":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.75" />
          <circle cx="9" cy="10" r="2" strokeWidth="1.75" />
          <path d="m21 16-5-5-6 6-3-3-4 4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" strokeWidth="1.75" />
          <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4.7a7.7 7.7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7.7 7.7 0 0 0-1.7 1L5.1 6l-2 3.5L5 11a7 7 0 0 0 0 2l-1.9 1.5 2 3.5 2.4-.7c.5.4 1.1.7 1.7 1l.4 2.5h4l.4-2.5c.6-.3 1.2-.6 1.7-1l2.4.7 2-3.5L18.9 13c.1-.3.1-.7.1-1Z" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "audit":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
          <path d="M12 6v6l4 2" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="12" cy="12" r="8" strokeWidth="1.75" />
        </svg>
      );
    default:
      return (
        <span className="font-accent text-[0.58rem] uppercase">{shortLabel}</span>
      );
  }
}

function Frame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resetState, state, currentUser, setCurrentUserId } = useMarketingAdmin();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/backstage");
    router.refresh();
  }

  return (
    <div className="pp-admin-shell flex min-h-screen bg-[#f6f1de] text-pp-black">
      <aside
        className={`hidden shrink-0 border-r border-pp-olive/12 bg-pp-olive px-3 py-6 text-pp-creme transition-[width,padding] duration-200 lg:block ${
          sidebarCollapsed ? "w-24" : "w-72 px-5"
        }`}
      >
        <div className="border-b border-pp-creme/10 pb-5">
          <div className={`${sidebarCollapsed ? "text-center" : ""}`}>
              <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/65 uppercase">
                {sidebarCollapsed ? "CH" : "Content Hub Pro"}
              </p>
              <p className={`font-display mt-2 text-3xl ${sidebarCollapsed ? "text-[1.7rem]" : ""}`}>
                {sidebarCollapsed ? "PP" : "Marketing Admin"}
              </p>
          </div>
          {!sidebarCollapsed ? (
            <p className="font-accent mt-3 text-sm leading-relaxed text-pp-creme/72">
              Lokale demo-store voor contentbeheer. Alles schrijft tijdelijk naar
              `localStorage`.
            </p>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              className="mt-4 flex w-full items-center justify-center rounded-sm border border-pp-creme/15 bg-pp-creme/6 px-2 py-2 text-pp-creme/80 transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" aria-hidden>
                <path d="M9 6l6 6-6 6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        <nav className="mt-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-sm font-accent text-[0.72rem] tracking-[0.18em] uppercase transition-colors ${
                  active
                    ? "bg-pp-creme text-pp-olive"
                    : "text-pp-creme/74 hover:bg-pp-creme/10 hover:text-pp-creme"
                } ${sidebarCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2"}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-sm border ${active ? "border-pp-olive/12 bg-pp-olive/8" : "border-pp-creme/12 bg-pp-creme/6"}`}>
                  <AdminIcon icon={item.icon} shortLabel={item.shortLabel} />
                </span>
                {!sidebarCollapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className={`mt-8 rounded-sm border border-pp-creme/12 bg-pp-creme/6 ${sidebarCollapsed ? "p-2" : "p-4"}`}>
          <p className="font-accent text-[0.58rem] tracking-[0.22em] text-pp-creme/60 uppercase">
            {sidebarCollapsed ? "TMP" : "Tijdelijke modus"}
          </p>
          {!sidebarCollapsed ? (
            <p className="font-accent mt-2 text-sm leading-relaxed text-pp-creme/78">
              Backend koppelen we later. Voor nu blijven edits lokaal in deze
              browser bewaard.
            </p>
          ) : null}
          <button
            type="button"
            onClick={resetState}
            className={`mt-4 w-full border border-pp-creme/20 font-accent text-[0.62rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop ${
              sidebarCollapsed ? "px-2 py-2" : "px-3 py-2"
            }`}
            title={sidebarCollapsed ? "Reset demo data" : undefined}
          >
            {sidebarCollapsed ? "RST" : "Reset demo data"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-pp-olive/10 bg-[#fff9ea]/90 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden rounded-sm border border-pp-olive/16 px-2 py-2 text-pp-olive transition-colors hover:border-pp-lollypop hover:text-pp-lollypop lg:inline-flex"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" aria-hidden>
                  {sidebarCollapsed ? (
                    <path d="M9 6l6 6-6 6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M15 6l-6 6 6 6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </button>
              <div>
              <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-olive/48 uppercase">
                Poule &amp; Poulette
              </p>
              <p className="font-display text-2xl text-pp-olive">Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="hidden lg:block">
                <span className="sr-only">Actieve admin gebruiker</span>
                <select
                  value={currentUser.id}
                  onChange={(event) => setCurrentUserId(event.target.value)}
                  className="border border-pp-olive/16 bg-white px-3 py-2 text-sm text-pp-olive outline-none"
                >
                  {state.users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · {user.role}
                    </option>
                  ))}
                </select>
              </label>
              <div className="hidden min-w-[8rem] border border-pp-olive/12 bg-white px-3 py-2 lg:block">
                <p className="font-accent text-[0.5rem] uppercase tracking-[0.16em] text-pp-olive/45">
                  Active role
                </p>
                <p className="mt-1 text-sm text-pp-olive">{currentUser.role}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="border border-pp-olive/16 px-3 py-2 font-accent text-[0.62rem] tracking-[0.18em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
              >
                Logout
              </button>
              <Link
                href="/"
                className="border border-pp-olive/16 px-3 py-2 font-accent text-[0.62rem] tracking-[0.18em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
              >
                Naar site
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <MarketingAdminProvider>
      <Frame>{children}</Frame>
    </MarketingAdminProvider>
  );
}
