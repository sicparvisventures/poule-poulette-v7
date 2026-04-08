"use client";

import Image from "next/image";
import { useState } from "react";
import {
  splashPolaroidFallbackSrc,
  type SplashPolaroidItem,
} from "@/content/splashPolaroids";

type Props = {
  item: SplashPolaroidItem;
  /** next/image sizes; deck-slide pola's zijn compacter. */
  sizes?: string;
  priority?: boolean;
  /** Kleinere padding/caption voor dichte grid op desktop. */
  compact?: boolean;
};

export function PolaroidFrame({
  item,
  sizes = "(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px",
  priority = true,
  compact = false,
}: Props) {
  const [src, setSrc] = useState(item.src);

  const shell = compact
    ? "rounded-[2px] border border-pp-white/90 bg-pp-white p-1 pb-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.5)]"
    : "rounded-[2px] border border-pp-white/85 bg-pp-white p-1.5 pb-2.5 shadow-[0_1px_0_rgb(255_255_255/0.35)_inset] sm:p-2 sm:pb-3";

  const caption = compact
    ? "font-accent mt-1 text-center text-[0.4rem] tracking-[0.22em] text-pp-olive uppercase"
    : "font-accent mt-1.5 text-center text-[0.5rem] tracking-[0.3em] text-pp-olive uppercase sm:mt-2 sm:text-[0.54rem]";

  return (
    <div className={shell}>
      <div className="relative aspect-4/5 w-full overflow-hidden bg-pp-olive/8 ring-1 ring-pp-olive/12">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
          onError={() => {
            if (src !== splashPolaroidFallbackSrc) {
              setSrc(splashPolaroidFallbackSrc);
            }
          }}
        />
      </div>
      <p className={caption}>{item.caption}</p>
    </div>
  );
}
