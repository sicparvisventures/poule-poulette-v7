"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

const DOODLE = "/images/doodle_clean_upscaled.png";

type Props = {
  labelId: string;
  title: string;
  introBar: string;
  reduceMotion: boolean | null;
  onDismiss: () => void;
  dismissAriaLabel?: string;
};

/**
 * Vaste intro boven de content: horizontaal gecentreerd, compact, met kippenpoot-doodle.
 * Geen flow-hoogte — `pt-[3.25rem] sm:pt-12` op de hoofdkolom als deze zichtbaar is.
 */
export function FixedPageIntroStrip({
  labelId,
  title,
  introBar,
  reduceMotion,
  onDismiss,
  dismissAriaLabel = "Verberg uitleg",
}: Props) {
  const barClass =
    "pointer-events-auto fixed left-1/2 top-[4.4rem] z-50 flex w-[min(42rem,calc(100vw-1rem))] -translate-x-1/2 items-center gap-3 rounded-2xl border border-pp-olive/12 bg-[linear-gradient(135deg,rgba(251,251,241,0.97),rgba(253,248,193,0.92))] px-3 py-2 shadow-[0_18px_44px_rgb(28_56_52/0.14)] backdrop-blur-md sm:w-[min(48rem,calc(100vw-2rem))] sm:gap-3.5 sm:px-4 sm:py-2.5";

  const inner = (
    <>
      <div
        className="relative h-9 w-9 shrink-0 opacity-[0.92] drop-shadow-[0_4px_12px_rgb(28_56_52/0.12)] sm:h-10 sm:w-10"
        aria-hidden
      >
        <Image
          src={DOODLE}
          alt=""
          fill
          className="object-contain object-center"
          sizes="36px"
        />
      </div>
      <p
        id={labelId}
        className="min-w-0 flex-1 text-[0.76rem] leading-[1.35] text-pp-black/78 sm:text-[0.84rem]"
      >
        <span className="font-display text-[0.95rem] text-pp-olive sm:text-[1.05rem]">
          {title}
        </span>
        <span className="mx-2 text-pp-black/28">•</span>
        <span className="font-accent tracking-[0.02em] text-pp-black/72">
          {introBar}
        </span>
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="font-accent shrink-0 self-center rounded-full border border-pp-olive/14 bg-pp-white/72 px-3 py-1.5 text-[0.58rem] tracking-[0.18em] text-pp-olive/72 uppercase transition-colors hover:border-pp-lollypop/45 hover:bg-pp-white hover:text-pp-lollypop sm:px-3.5 sm:text-[0.6rem]"
        aria-label={dismissAriaLabel}
      >
        Sluiten
      </button>
    </>
  );

  if (reduceMotion) {
    return (
      <aside className={barClass} role="status">
        {inner}
      </aside>
    );
  }

  return (
    <motion.aside
      role="status"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease }}
      className={barClass}
    >
      {inner}
    </motion.aside>
  );
}
