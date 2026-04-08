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
    "pointer-events-auto fixed left-1/2 top-[4.35rem] z-50 flex w-[min(32rem,calc(100vw-1.25rem))] -translate-x-1/2 items-center gap-2 rounded-sm border border-pp-olive/14 bg-pp-white/95 px-2 py-1 shadow-[0_8px_28px_rgb(28_56_52/0.12)] backdrop-blur-md sm:w-[min(36rem,calc(100vw-2rem))] sm:gap-2.5 sm:px-2.5 sm:py-1.5";

  const inner = (
    <>
      <div
        className="relative h-8 w-8 shrink-0 opacity-[0.92] drop-shadow-[0_3px_10px_rgb(28_56_52/0.1)] sm:h-9 sm:w-9"
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
        className="font-accent min-w-0 flex-1 text-[0.58rem] leading-snug tracking-[0.03em] text-pp-black/78 sm:text-[0.6rem]"
      >
        <span className="font-display text-pp-olive">{title}</span>
        <span className="text-pp-black/40"> · </span>
        {introBar}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="font-accent shrink-0 self-center rounded-sm border border-pp-olive/12 px-1.5 py-0.5 text-[0.52rem] tracking-[0.16em] text-pp-olive/65 uppercase transition-colors hover:border-pp-lollypop/45 hover:text-pp-lollypop sm:px-2 sm:py-1 sm:text-[0.55rem]"
        aria-label={dismissAriaLabel}
      >
        Sluit
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
