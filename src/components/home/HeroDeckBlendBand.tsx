"use client";

import { heroDeckMarqueePhrases } from "@/content/marqueeBand";

type HeroDeckBlendBandProps = {
  /**
   * `black` = klassieke overgang naar zwart deck (verticale home).
   * `olive` = alleen olijf, geen zwarte band (desktop horizontale journey → slide 01).
   */
  fadeTo?: "black" | "olive";
  /**
   * `bottom` = horizontale balk onder de hero (standaard).
   * `rail-right` = dezelfde horizontale marquee, fysiek in de smalle rechterkolom
   * (geroteerd −90°) — op de plek van de oude verticale olijfstreep.
   */
  layout?: "bottom" | "rail-right";
};

function MarqueeSegment({ segment }: { segment: string }) {
  return (
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
  );
}

/**
 * Overgangsband tussen hero (OLIVE) en Prezi-deck: gradient + horizontale marquee (lollypop).
 * Marquee altijd actief (ook bij OS “verminder beweging”).
 */
export function HeroDeckBlendBand({
  fadeTo = "black",
  layout = "bottom",
}: HeroDeckBlendBandProps = {}) {
  const segment = `${heroDeckMarqueePhrases.join(" · ")} · `;
  const fadeClass =
    fadeTo === "olive"
      ? "from-pp-olive via-pp-olive/95 to-pp-olive"
      : "from-pp-olive via-pp-olive/90 to-pp-black";

  const barInterior = (railCompact: boolean) => (
    <>
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-b ${fadeClass}`}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-pp-creme/22" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-pp-creme/18" />
      <div
        className={`relative overflow-hidden ${railCompact ? "py-0.5" : "py-1"}`}
      >
        <MarqueeSegment segment={segment} />
      </div>
    </>
  );

  if (layout === "rail-right") {
    return (
      <div
        className="relative z-10 isolate h-full w-[2.5rem] shrink-0 overflow-hidden border-l border-pp-white/18 bg-pp-olive"
        role="presentation"
        aria-hidden
      >
        {/*
          Horizontale marquee (zelfde CSS-animatie), −90° in een smalle rail — nauw aansluitend
          op de geroteerde balkhoogte zodat er minimaal olijf “schouder” links/rechts is.
        */}
        <div className="absolute top-1/2 left-1/2 h-[2.5rem] w-[100dvh] -translate-x-1/2 -translate-y-1/2 -rotate-90">
          <div className="relative h-full w-full overflow-hidden border-t border-pp-white/12">
            {barInterior(true)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative z-10 isolate shrink-0 overflow-hidden border-t border-pp-white/15"
      role="presentation"
      aria-hidden
    >
      {barInterior(false)}
    </div>
  );
}
