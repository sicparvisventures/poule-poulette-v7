"use client";

import Link from "next/link";
import { useActivePromotion } from "@/lib/marketing-admin/store";
import type { Promotion } from "@/lib/marketing-admin/types";

export function PromotionStrip({
  placement,
}: {
  placement: Promotion["placement"];
}) {
  const promotion = useActivePromotion(placement);

  if (!promotion?.copy.nl) {
    return null;
  }

  return (
    <div className="border-b border-pp-lollypop/20 bg-pp-lollypop/12 px-4 py-2 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-accent text-[0.64rem] tracking-[0.2em] text-pp-olive uppercase">
          {promotion.copy.nl}
        </p>
        <Link
          href={promotion.ctaHref}
          className="font-accent text-[0.62rem] tracking-[0.18em] text-pp-christmas uppercase underline underline-offset-4"
        >
          {promotion.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
