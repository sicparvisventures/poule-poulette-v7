"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  deckPolaroidSeamRowItems,
  deckPolaroidSlide2RightItems,
  deckPolaroidSlide3LeftExtraItems,
  deckSlide3PolaroidItems,
  type SplashPolaroidItem,
} from "@/content/splashPolaroids";
import { PolaroidFrame } from "@/components/home/PolaroidFrame";

const DECK_POLAROID_SIZES =
  "(max-width: 640px) 104px, (max-width: 1024px) 128px, 168px";

const DESKTOP_POLA_SIZES =
  "(max-width: 1280px) 100px, (max-width: 1536px) 112px, 128px";

const SEAM_ROW_POLA_SIZES =
  "(max-width: 1280px) 92px, (max-width: 1536px) 104px, 118px";

/** Verticale verspringing op de naad zodat de rij minder op één hoop ligt. */
const SEAM_STAGGER = [
  "mb-0 translate-y-2",
  "mb-2 -translate-y-2",
  "mb-1 translate-y-1",
  "mb-3 -translate-y-1",
] as const;

/** Egaal, geen gradient-achtige schaduw. */
const POLA_SHADOW = "shadow-[0_6px_16px_rgba(0,0,0,0.42)]";

/** Desktop: polaroids rechts op slide 2. */
export function DeckSlide2PolaroidCluster() {
  const prefersReduced = useReducedMotion();
  const still = !!prefersReduced;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[16] hidden overflow-hidden md:block"
      aria-hidden
    >
      {deckPolaroidSlide2RightItems.map((item, i) => (
        <PolaroidAbsoluteSlot
          key={`s2-${item.src}`}
          item={item}
          index={i}
          still={still}
          sizes={DESKTOP_POLA_SIZES}
          compact={false}
        />
      ))}
    </div>
  );
}

/**
 * Slide 3: mobiel = linker kolom; desktop = naad-rij (4) + verspreiding links;
 * midden van het paneel blijft relatief vrij.
 */
export function DeckSlidePolaroidCollage() {
  const prefersReduced = useReducedMotion();
  const still = !!prefersReduced;

  return (
    <>
      {/* Mobiel: compacte linker kolom */}
      <div
        className="pointer-events-none absolute inset-0 z-[8] overflow-hidden md:hidden"
        aria-hidden
      >
        {deckSlide3PolaroidItems.map((item, i) => (
          <PolaroidAbsoluteSlot
            key={`m-${item.src}-${i}`}
            item={item}
            index={i}
            still={still}
            sizes={DECK_POLAROID_SIZES}
            compact={false}
          />
        ))}
      </div>

      {/* Desktop: linker helft — extra polaroids (niet op de naad) */}
      <div
        className="pointer-events-none absolute inset-0 z-[15] hidden overflow-hidden md:block"
        aria-hidden
      >
        {deckPolaroidSlide3LeftExtraItems.map((item, i) => (
          <PolaroidAbsoluteSlot
            key={`s3l-${item.src}`}
            item={item}
            index={i}
            still={still}
            sizes={DESKTOP_POLA_SIZES}
            compact={false}
          />
        ))}
      </div>

      {/* Desktop: eerste rij op de naad — ruime gap + stagger */}
      <div
        className="pointer-events-none absolute top-1/2 left-0 z-[17] hidden -translate-x-1/2 -translate-y-1/2 flex-row items-end gap-4 md:gap-5 lg:gap-7 md:flex"
        aria-hidden
      >
        {deckPolaroidSeamRowItems.map((item, i) => (
          <SeamRowPolaroid
            key={`seam-${item.src}`}
            item={item}
            index={i}
            still={still}
            staggerClass={SEAM_STAGGER[i] ?? ""}
          />
        ))}
      </div>
    </>
  );
}

function SeamRowPolaroid({
  item,
  index: i,
  still,
  staggerClass,
}: {
  item: SplashPolaroidItem;
  index: number;
  still: boolean;
  staggerClass: string;
}) {
  const wrap = `shrink-0 w-[min(22vmin,6.5rem)] lg:w-[min(20vmin,7rem)] ${POLA_SHADOW}`;

  const frame = (
    <div className={wrap}>
      <PolaroidFrame
        item={item}
        sizes={SEAM_ROW_POLA_SIZES}
        priority={false}
        compact={false}
      />
    </div>
  );

  const shell = <div className={staggerClass}>{frame}</div>;

  if (still) {
    return (
      <div style={{ transform: `rotate(${item.rotateDeg}deg)` }}>{shell}</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.05 + i * 0.08,
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{
          duration: 4.5 + (i % 3) * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.floatDelay,
        }}
        style={{ rotate: item.rotateDeg }}
        className={`origin-center ${staggerClass}`}
      >
        {frame}
      </motion.div>
    </motion.div>
  );
}

function PolaroidAbsoluteSlot({
  item,
  index: i,
  still,
  sizes,
  compact,
}: {
  item: SplashPolaroidItem;
  index: number;
  still: boolean;
  sizes: string;
  compact: boolean;
}) {
  const inner = (
    <div className={`origin-center ${POLA_SHADOW}`}>
      <PolaroidFrame
        item={item}
        sizes={sizes}
        priority={false}
        compact={compact}
      />
    </div>
  );

  if (still) {
    return (
      <div
        className={`absolute ${item.positionClass}`}
        style={{ transform: `rotate(${item.rotateDeg}deg)` }}
      >
        {inner}
      </div>
    );
  }

  return (
    <motion.div
      className={`absolute ${item.positionClass}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.06 + i * 0.05,
          duration: 0.48,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      <motion.div
        animate={{ y: [0, -2.5, 0] }}
        transition={{
          duration: 5 + (i % 3) * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.floatDelay,
        }}
        style={{ rotate: item.rotateDeg }}
        className={`origin-center ${POLA_SHADOW}`}
      >
        <PolaroidFrame
          item={item}
          sizes={sizes}
          priority={false}
          compact={compact}
        />
      </motion.div>
    </motion.div>
  );
}
