"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useMarketingAdmin } from "@/lib/marketing-admin/store";
import type { MediaAsset } from "@/lib/marketing-admin/types";

export function MediaAssetPickerField({
  label,
  valueSrc,
  accept = ["image", "svg"],
  disabled = false,
  onSelect,
}: {
  label: string;
  valueSrc?: string;
  accept?: MediaAsset["type"][];
  disabled?: boolean;
  onSelect: (asset: MediaAsset) => void;
}) {
  const { state } = useMarketingAdmin();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const assets = useMemo(
    () =>
      state.mediaAssets.filter(
        (asset) =>
          accept.includes(asset.type) &&
          (!query.trim() ||
            [
              asset.name,
              asset.altText,
              ...asset.tags,
              ...asset.usages.map((usage) => usage.label),
            ]
              .join(" ")
              .toLowerCase()
              .includes(query.trim().toLowerCase())),
      ),
    [accept, query, state.mediaAssets],
  );

  const selected =
    state.mediaAssets.find((asset) => asset.src === valueSrc) ?? null;

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-accent uppercase text-[0.58rem] tracking-[0.18em] text-pp-olive/55">
            {label}
          </p>
          <div className="mt-2 flex min-h-[54px] items-center gap-3 border border-pp-olive/10 bg-white px-3 py-2">
            <div className="relative h-10 w-14 shrink-0 overflow-hidden border border-pp-olive/10 bg-[#f3ecd8]">
              {selected && (selected.type === "image" || selected.type === "svg") ? (
                <Image
                  src={selected.previewSrc}
                  alt={selected.altText || selected.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-pp-black/74">
                {selected?.name ?? "Nog geen asset gekoppeld"}
              </p>
              <p className="mt-1 truncate text-xs text-pp-black/45">
                {selected?.altText || valueSrc || "Kies uit de media library"}
              </p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setOpen((current) => !current)}
              className="border border-pp-olive/16 px-3 py-2 font-accent text-[0.58rem] uppercase tracking-[0.16em] text-pp-olive transition-colors hover:border-pp-lollypop hover:text-pp-lollypop disabled:cursor-not-allowed disabled:opacity-45"
            >
              {selected ? "Vervang" : "Kies asset"}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="space-y-3 border border-pp-olive/10 bg-[#fffdf6] p-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Zoek op assetnaam, alt text of usage"
            className="w-full border border-pp-olive/14 bg-white px-3 py-2.5 text-sm text-pp-black outline-none transition-colors focus:border-pp-lollypop"
          />
          <div className="grid max-h-72 gap-3 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  onSelect(asset);
                  setOpen(false);
                  setQuery("");
                }}
                className="border border-pp-olive/10 bg-white text-left transition-colors hover:border-pp-lollypop/40"
              >
                <div className="relative aspect-[4/3] border-b border-pp-olive/10 bg-[#f3ecd8]">
                  {asset.type === "image" || asset.type === "svg" ? (
                    <Image
                      src={asset.previewSrc}
                      alt={asset.altText || asset.name}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  ) : null}
                </div>
                <div className="px-3 py-3">
                  <p className="truncate text-sm text-pp-black/74">{asset.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-pp-black/45">
                    {asset.altText || "Geen alt text"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
