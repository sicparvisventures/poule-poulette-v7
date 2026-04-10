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
  AdminRole,
  AdminUser,
  AuditLogEntry,
  MarketingAdminState,
  Promotion,
} from "@/lib/marketing-admin/types";

const STORAGE_KEY = "ppsite.marketing-admin.v1";
const STORAGE_EVENT = "ppsite:marketing-admin:update";

let cachedRawState: string | null = null;
let cachedState: MarketingAdminState = seedMarketingState;

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
    if (!raw) {
      cachedRawState = null;
      cachedState = seed;
      return seed;
    }
    if (raw === cachedRawState) {
      return cachedState;
    }
    const parsed = JSON.parse(raw) as Partial<MarketingAdminState>;
    const nextState = {
      ...seed,
      ...parsed,
      currentUserId: parsed.currentUserId ?? seed.currentUserId,
      users: parsed.users ?? seed.users,
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
      mediaFolders: parsed.mediaFolders ?? seed.mediaFolders,
      mediaAssets: parsed.mediaAssets ?? seed.mediaAssets,
      globalSettings: {
        ...seed.globalSettings,
        ...parsed.globalSettings,
      },
      auditLog: parsed.auditLog ?? seed.auditLog,
    };
    cachedRawState = raw;
    cachedState = nextState;
    return nextState;
  } catch {
    return seed;
  }
}

function writeStoredState(state: MarketingAdminState) {
  if (!canUseStorage()) return;
  const raw = JSON.stringify(state);
  cachedRawState = raw;
  cachedState = state;
  window.localStorage.setItem(STORAGE_KEY, raw);
  dispatchStorageUpdate();
}

type MarketingAdminContextValue = {
  state: MarketingAdminState;
  setState: React.Dispatch<React.SetStateAction<MarketingAdminState>>;
  resetState: () => void;
  currentUser: AdminUser;
  setCurrentUserId: (userId: string) => void;
  permissions: {
    canEdit: boolean;
    canPublish: boolean;
    canManageMedia: boolean;
    canManageUsers: boolean;
  };
  addAuditEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp" | "user">) => void;
};

const MarketingAdminContext = createContext<MarketingAdminContextValue | null>(null);

export function MarketingAdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MarketingAdminState>(() => readStoredState());

  useEffect(() => {
    writeStoredState(state);
  }, [state]);

  const value = useMemo<MarketingAdminContextValue>(
    () => {
      const currentUser =
        state.users.find((user) => user.id === state.currentUserId) ??
        state.users[0] ??
        {
          id: "fallback-user",
          name: "Local admin",
          email: "local@admin",
          role: "super_admin" as AdminRole,
          avatarLabel: "LA",
        };

      const permissions = {
        canEdit: currentUser.role !== "viewer",
        canPublish: currentUser.role === "super_admin" || currentUser.role === "publisher",
        canManageMedia: currentUser.role !== "viewer",
        canManageUsers: currentUser.role === "super_admin",
      };

      return {
        state,
        setState,
        currentUser,
        setCurrentUserId: (userId: string) =>
          setState((current) => ({ ...current, currentUserId: userId })),
        permissions,
        resetState: () => {
          const seed = createSeedMarketingState();
          setState(seed);
          writeStoredState(seed);
        },
        addAuditEntry: (entry) => {
          setState((current) => {
            const actor =
              current.users.find((user) => user.id === current.currentUserId)?.name ??
              "Local admin";
            return {
              ...current,
              auditLog: [
                {
                  id: `audit-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  user: actor,
                  ...entry,
                },
                ...current.auditLog,
              ],
            };
          });
        },
      };
    },
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
  const snapshot = useSyncExternalStore(
    subscribeToMarketingState,
    readStoredState,
    () => seedMarketingState,
  );

  return useMemo(() => selector(snapshot), [selector, snapshot]);
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
