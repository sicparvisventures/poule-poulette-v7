import type {
  MarketingAdminState,
  MediaAssetUsage,
  MediaFolder,
} from "@/lib/marketing-admin/types";

function slugifySegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildFolderMap(folders: MediaFolder[]) {
  return new Map(folders.map((folder) => [folder.id, folder]));
}

function buildPathForFolder(
  folder: MediaFolder,
  folderMap: Map<string, MediaFolder>,
) {
  const segments = [slugifySegment(folder.name)];
  let currentParentId = folder.parentId;

  while (currentParentId) {
    const parent = folderMap.get(currentParentId);
    if (!parent) break;
    segments.unshift(slugifySegment(parent.name));
    currentParentId = parent.parentId;
  }

  return segments.filter(Boolean).join("/");
}

function collectDescendantIds(
  folders: MediaFolder[],
  folderId: string,
  bucket = new Set<string>(),
) {
  bucket.add(folderId);
  folders
    .filter((folder) => folder.parentId === folderId)
    .forEach((folder) => collectDescendantIds(folders, folder.id, bucket));
  return bucket;
}

export function getFolderDescendantIds(
  folders: MediaFolder[],
  folderId: string,
) {
  return collectDescendantIds(folders, folderId);
}

export function rebuildFolderPaths(folders: MediaFolder[]) {
  const folderMap = buildFolderMap(folders);
  return folders.map((folder) => ({
    ...folder,
    path: buildPathForFolder(folder, folderMap),
  }));
}

export function replaceMediaUsage(
  state: MarketingAdminState,
  assetId: string,
  usage: MediaAssetUsage,
) {
  return {
    ...state,
    mediaAssets: state.mediaAssets.map((asset) => {
      const remaining = asset.usages.filter(
        (entry) =>
          !(entry.entity === usage.entity && entry.entityId === usage.entityId),
      );

      if (asset.id !== assetId) {
        return remaining.length === asset.usages.length
          ? asset
          : { ...asset, usages: remaining, updatedAt: new Date().toISOString() };
      }

      const alreadyLinked = remaining.some(
        (entry) =>
          entry.entity === usage.entity && entry.entityId === usage.entityId,
      );

      return {
        ...asset,
        usages: alreadyLinked ? remaining : [...remaining, usage],
        updatedAt: new Date().toISOString(),
      };
    }),
  };
}

export function removeMediaUsage(
  state: MarketingAdminState,
  usage: Pick<MediaAssetUsage, "entity" | "entityId">,
) {
  return {
    ...state,
    mediaAssets: state.mediaAssets.map((asset) => {
      const remaining = asset.usages.filter(
        (entry) =>
          !(entry.entity === usage.entity && entry.entityId === usage.entityId),
      );
      return remaining.length === asset.usages.length
        ? asset
        : { ...asset, usages: remaining, updatedAt: new Date().toISOString() };
    }),
  };
}

export function moveFolder(
  state: MarketingAdminState,
  folderId: string,
  nextParentId: string | null,
) {
  const descendants = getFolderDescendantIds(state.mediaFolders, folderId);
  if (nextParentId && descendants.has(nextParentId)) {
    return state;
  }

  const nextFolders = rebuildFolderPaths(
    state.mediaFolders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            parentId: nextParentId,
            updatedAt: new Date().toISOString(),
          }
        : folder,
    ),
  );

  return {
    ...state,
    mediaFolders: nextFolders,
  };
}

export function createFolder(
  state: MarketingAdminState,
  name: string,
  parentId: string | null,
  color = "#3f6d63",
) {
  const cleanName = name.trim();
  if (!cleanName) return state;

  const nextFolders = rebuildFolderPaths([
    ...state.mediaFolders,
    {
      id: `folder-${Date.now()}-${slugifySegment(cleanName)}`,
      name: cleanName,
      parentId,
      path: "",
      color,
      updatedAt: new Date().toISOString(),
    },
  ]);

  return {
    ...state,
    mediaFolders: nextFolders,
  };
}

export function deleteMediaAssets(
  state: MarketingAdminState,
  assetIds: string[],
) {
  const blockedIds = new Set(
    state.mediaAssets
      .filter((asset) => assetIds.includes(asset.id) && asset.usages.length > 0)
      .map((asset) => asset.id),
  );

  return {
    ...state,
    mediaAssets: state.mediaAssets.filter(
      (asset) => !assetIds.includes(asset.id) || blockedIds.has(asset.id),
    ),
  };
}
