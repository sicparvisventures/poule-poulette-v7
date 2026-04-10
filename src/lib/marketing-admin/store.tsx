"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  createSeedMarketingState,
  seedMarketingState,
} from "@/lib/marketing-admin/seed";
import type {
  AuditLogEntry,
  MarketingAdminState,
  Promotion,
} from "@/lib/marketing-admin/types";

const STORAGE_KEY = "ppsite.marketing-admin.v1";
const STORAGE_EVENT = "ppsite:marketing-admin:update";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function dispatchStorageUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function readStoredState(): MarketingAdminState {
  const seed = seedMarketingState;
  if (!canUseStorage()) return seed;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Partial<MarketingAdminState>;
    return {
      ...seed,
      ...parsed,
      locations: parsed.locations ?? seed.locations,
      locationsPageCopy: {
        ...seed.locationsPageCopy,
        ...parsed.locationsPageCopy,
      },
      menuSections: parsed.menuSections ?? seed.menuSections,
      menuPageCopy: {
        ...seed.menuPageCopy,
        ...parsed.menuPageCopy,
      },
      jobs: parsed.jobs ?? seed.jobs,
      jobsPageCopy: {
        ...seed.jobsPageCopy,
        ...parsed.jobsPageCopy,
      },
      jobsUi: {
        ...seed.jobsUi,
        ...parsed.jobsUi,
      },
      jobsMarqueePhrases: parsed.jobsMarqueePhrases ?? seed.jobsMarqueePhrases,
      groups: parsed.groups ?? seed.groups,
      groupsPageCopy: {
        ...seed.groupsPageCopy,
        ...parsed.groupsPageCopy,
      },
      promotions: parsed.promotions ?? seed.promotions,
      globalSettings: {
        ...seed.globalSettings,
        ...parsed.globalSettings,
      },
      auditLog: parsed.auditLog ?? seed.auditLog,
    };
  } catch {
    return seed;
  }
}

function writeStoredState(state: MarketingAdminState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  dispatchStorageUpdate();
}

type MarketingAdminContextValue = {
  state: MarketingAdminState;
  setState: React.Dispatch<React.SetStateAction<MarketingAdminState>>;
  resetState: () => void;
  addAuditEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp" | "user">) => void;
};

const MarketingAdminContext = createContext<MarketingAdminContextValue | null>(null);

export function MarketingAdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MarketingAdminState>(() => readStoredState());

  useEffect(() => {
    writeStoredState(state);
  }, [state]);

  const value = useMemo<MarketingAdminContextValue>(
    () => ({
      state,
      setState,
      resetState: () => {
        const seed = createSeedMarketingState();
        setState(seed);
        writeStoredState(seed);
      },
      addAuditEntry: (entry) => {
        setState((current) => ({
          ...current,
          auditLog: [
            {
              id: `audit-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: "Local admin",
              ...entry,
            },
            ...current.auditLog,
          ],
        }));
      },
    }),
    [state],
  );

  return (
    <MarketingAdminContext.Provider value={value}>
      {children}
    </MarketingAdminContext.Provider>
  );
}

export function useMarketingAdmin() {
  const value = useContext(MarketingAdminContext);
  if (!value) {
    throw new Error("useMarketingAdmin must be used inside MarketingAdminProvider");
  }
  return value;
}

function subscribeToMarketingState(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => onStoreChange();
  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useMarketingSnapshot<T>(
  selector: (state: MarketingAdminState) => T,
) {
  return useSyncExternalStore(
    subscribeToMarketingState,
    () => selector(readStoredState()),
    () => selector(seedMarketingState),
  );
}

export function useActivePromotion(placement: Promotion["placement"]) {
  return useMarketingSnapshot((state) => {
    const now = Date.now();
    return [...state.promotions]
      .filter((promotion) => {
        if (promotion.placement !== placement) return false;
        if (promotion.status === "draft" || promotion.status === "expired") return false;
        const start = new Date(promotion.startAt).getTime();
        const end = new Date(promotion.endAt).getTime();
        return start <= now && end >= now;
      })
      .sort((left, right) => right.priority - left.priority)[0] ?? null;
  });
}
