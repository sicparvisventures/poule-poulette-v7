"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { deckSlides } from "@/content/deckSlides";
import { useViewportWidth } from "@/hooks/useViewportWidth";
import { HeroDeckBlendBand } from "@/components/home/HeroDeckBlendBand";
import {
  HomeJourneyIsland,
  type JourneyPanel,
} from "@/components/home/HomeJourneyIsland";
import { DeckDesktopSlideArticle } from "@/components/home/PresentationDeck";

type Props = {
  /** Voor `aria-labelledby` op de journey-sectie. */
  journeyLabelId: string;
  /** Alleen de hero; de lollypop-marquee zit rechts in de smalle rail (zelfde als horizontale band). */
  hero: React.ReactNode;
};

/**
 * Desktop: één verticale scroll-afstand stuurt alle panelen horizontaal
 * (hero + rechter olijfrail → deck-slides; geen aparte jobs/reserve/footer-panelen meer).
 */
export function DesktopHorizontalHomeStory({
  journeyLabelId,
  hero,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vw = useViewportWidth();
  const slideCount = deckSlides.length;
  const panelCount = 1 + slideCount;
  const maxShift = useMemo(() => (panelCount - 1) * vw, [panelCount, vw]);

  const journeyPanels = useMemo((): JourneyPanel[] => {
    const slidePanels = deckSlides.map((slide, i) => ({
      id: slide.id,
      label:
        slide.title?.trim() ||
        slide.kicker?.trim() ||
        (i === 0 ? "Story" : `Section ${i + 1}`),
    }));
    return [{ id: "journey-hero", label: "Home" }, ...slidePanels];
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);
  const x = useSpring(xRaw, {
    stiffness: 120,
    damping: 32,
    mass: 0.35,
  });
  const progressPct = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="hidden bg-pp-olive md:block"
      style={{ height: `${(panelCount - 1) * 100}vh` }}
      aria-labelledby={journeyLabelId}
    >
      <h2 id={journeyLabelId} className="sr-only">
        Door het merkverhaal scrollen: omlaag scrollen, horizontaal door de panelen
      </h2>
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-pp-olive shadow-[inset_0_0_120px_rgb(0_0_0/0.14)] ring-1 ring-pp-creme/[0.07]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-linear-to-b from-pp-olive/35 to-transparent"
          aria-hidden
        />
        <HomeJourneyIsland
          panels={journeyPanels}
          progress={progressPct}
        />

        <motion.div
          className="flex h-full w-max flex-row will-change-transform"
          style={{ x }}
        >
          <div className="flex h-full w-screen shrink-0 flex-row overflow-hidden bg-pp-olive">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden [scrollbar-gutter:stable]">
              {hero}
            </div>
            <HeroDeckBlendBand fadeTo="olive" layout="rail-right" />
          </div>
          {deckSlides.map((slide, i) => (
            <DeckDesktopSlideArticle
              key={slide.id}
              slide={slide}
              i={i}
              slideCount={slideCount}
              presentatieId={i === 0 ? "presentatie" : undefined}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
