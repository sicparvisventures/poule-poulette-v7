"use client";

import { heroDeckMarqueePhrases } from "@/content/marqueeBand";

/**
 * Overgangsband tussen hero (OLIVE) en Prezi-deck (zwart): gradient + marquee.
 * Marquee altijd actief (ook bij OS “verminder beweging”).
 */
export function HeroDeckBlendBand() {
  const segment = `${heroDeckMarqueePhrases.join(" · ")} · `;

  return (
    <div
      className="relative z-10 isolate overflow-hidden border-t border-pp-white/15"
      role="presentation"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-pp-olive via-pp-olive/90 to-pp-black"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-pp-creme/22" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-pp-creme/18" />

      {/*
        Marquee-tekst lollypop + display-font; streepjes creme/geelachtig.
      */}
      <div className="relative overflow-hidden py-1">
        <div className="flex w-full overflow-hidden">
          <div className="pp-hero-deck-marquee-inner">
            <span className="font-display whitespace-nowrap text-sm tracking-[0.12em] text-pp-lollypop uppercase md:text-base">
              {segment}
            </span>
            <span
              className="font-display whitespace-nowrap text-sm tracking-[0.12em] text-pp-lollypop uppercase md:text-base"
              aria-hidden
            >
              {segment}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
