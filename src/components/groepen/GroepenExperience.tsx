"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  groupMenuTiers,
  groupsMarqueePhrases,
  groupsPageCopy,
} from "@/content/groupsPage";

const ease = [0.22, 1, 0.36, 1] as const;

function GroupsMarqueeBand() {
  const segment = `${groupsMarqueePhrases.join(" · ")} · `;
  return (
    <div
      className="relative z-10 isolate overflow-hidden border-b border-pp-white/12"
      role="presentation"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-pp-olive via-[#1e3d38] to-pp-olive" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-pp-creme/18" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-pp-creme/14" />
      <div className="relative overflow-hidden py-1.5">
        <div className="flex w-full overflow-hidden">
          <div className="pp-hero-deck-marquee-inner">
            <span className="font-display whitespace-nowrap text-xs tracking-[0.14em] text-pp-lollypop uppercase md:text-sm">
              {segment}
            </span>
            <span
              className="font-display whitespace-nowrap text-xs tracking-[0.14em] text-pp-lollypop uppercase md:text-sm"
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

export function GroepenExperience() {
  const reduceMotion = useReducedMotion();
  const zoomTitleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const count = groupMenuTiers.length;

  const openPrev = useCallback(() => {
    setZoomIndex((i) =>
      i === null ? 0 : Math.max(0, i - 1),
    );
  }, []);

  const openNext = useCallback(() => {
    setZoomIndex((i) =>
      i === null ? 0 : Math.min(count - 1, i + 1),
    );
  }, [count]);

  useEffect(() => {
    if (zoomIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomIndex(null);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        openPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        openNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIndex, openPrev, openNext]);

  useEffect(() => {
    if (zoomIndex === null) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [zoomIndex]);

  const zoomTier = zoomIndex !== null ? groupMenuTiers[zoomIndex] : null;

  return (
    <div className="flex min-h-dvh flex-col bg-pp-white text-pp-black">
      <header className="shrink-0 border-b border-pp-white/10 bg-linear-to-b from-pp-olive to-[#152a26] px-4 py-3 text-pp-creme sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="font-accent text-[0.62rem] tracking-[0.26em] text-pp-creme/80 uppercase underline-offset-4 transition-colors hover:text-pp-lollypop"
          >
            ← Home
          </Link>
          <p className="font-display text-center text-base sm:text-lg">
            Poule &amp; Poulette
          </p>
          <Link
            href="/menu"
            className="hidden w-28 text-right font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/45 uppercase transition-colors hover:text-pp-lollypop sm:block"
          >
            Menu
          </Link>
        </div>
      </header>

      <GroupsMarqueeBand />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <Image
            src="/images/olive-band-doodle-overlay.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
        </div>

        <div
          className="pointer-events-none absolute -left-8 top-[12%] z-0 hidden w-24 opacity-[0.55] md:block md:w-28"
          aria-hidden
        >
          <Image
            src="/images/doodle_clean_upscaled.png"
            alt=""
            width={200}
            height={200}
            className="h-auto w-full rotate-12 object-contain drop-shadow-[0_6px_20px_rgb(0_0_0/0.12)]"
          />
        </div>
        <div
          className="pointer-events-none absolute -right-6 bottom-[18%] z-0 w-20 opacity-[0.5] md:w-24"
          aria-hidden
        >
          <Image
            src="/images/doodle_clean_upscaled.png"
            alt=""
            width={200}
            height={200}
            className="h-auto w-full -rotate-6 scale-x-[-1] object-contain drop-shadow-[0_6px_20px_rgb(0_0_0/0.1)]"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="font-accent text-[0.62rem] tracking-[0.32em] text-pp-olive/50 uppercase">
              {groupsPageCopy.kicker}
            </p>
            <h1 className="font-display mt-2 text-3xl text-pp-olive sm:text-4xl">
              {groupsPageCopy.title}
            </h1>
            <p className="font-accent mt-4 text-sm leading-relaxed text-pp-black/72 sm:text-base">
              {groupsPageCopy.intro}
            </p>
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {groupMenuTiers.map((tier, i) => (
              <motion.button
                key={tier.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.08 * i,
                  ease,
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -6, transition: { duration: 0.22, ease } }
                }
                whileTap={
                  reduceMotion ? undefined : { scale: 0.98, y: -2 }
                }
                onClick={() => setZoomIndex(i)}
                className={`group relative flex w-full flex-col overflow-hidden rounded-[0.65rem] border-2 text-left shadow-lg outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-pp-lollypop focus-visible:ring-offset-2 focus-visible:ring-offset-pp-white ${tier.cardClass}`}
                aria-label={`${tier.label} — ${tier.tagline}, vergroten`}
              >
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${tier.accentDot} ring-2 ring-pp-white/90 shadow-sm`}
                    aria-hidden
                  />
                  <span className="rounded-sm bg-pp-olive/88 px-2 py-0.5 font-accent text-[0.55rem] tracking-[0.22em] text-pp-creme uppercase">
                    {tier.label}
                  </span>
                </div>
                <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-pp-olive/8 bg-pp-white/50">
                  <Image
                    src={tier.src}
                    alt={tier.alt}
                    fill
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                    priority={i === 0}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-olive/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                  <p className="font-accent text-[0.58rem] tracking-[0.26em] text-pp-olive/45 uppercase">
                    {tier.tagline}
                  </p>
                  <p className="font-accent text-sm leading-relaxed text-pp-black/75">
                    {tier.blurb}
                  </p>
                  <p className="mt-auto pt-2 font-accent text-[0.58rem] tracking-[0.2em] text-pp-lollypop/90 uppercase">
                    Tik om te vergroten →
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.35, duration: 0.4 }}
            className="mx-auto mt-12 max-w-xl text-center"
          >
            <Link
              href="/locations"
              className="font-accent text-xs tracking-[0.22em] text-pp-olive/60 uppercase underline-offset-4 transition-colors hover:text-pp-lollypop"
            >
              Vestigingen &amp; contact →
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-pp-olive/10 bg-pp-white/95 px-5 py-8 backdrop-blur-sm sm:px-8">
        <p className="font-accent mx-auto max-w-lg text-center text-[0.7rem] leading-relaxed tracking-[0.04em] text-pp-black/45">
          {groupsPageCopy.footnote}
        </p>
      </footer>

      <GroupMenuZoomModal
        tier={zoomTier}
        zoomIndex={zoomIndex}
        count={count}
        zoomTitleId={zoomTitleId}
        closeBtnRef={closeBtnRef}
        onPrev={openPrev}
        onNext={openNext}
        onClose={() => setZoomIndex(null)}
      />
    </div>
  );
}

function GroupMenuZoomModal({
  tier,
  zoomIndex,
  count,
  zoomTitleId,
  closeBtnRef,
  onPrev,
  onNext,
  onClose,
}: {
  tier: (typeof groupMenuTiers)[number] | null;
  zoomIndex: number | null;
  count: number;
  zoomTitleId: string;
  closeBtnRef: RefObject<HTMLButtonElement | null>;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {tier && zoomIndex !== null ? (
        <motion.div
          key="groups-zoom"
          role="dialog"
          aria-modal="true"
          aria-labelledby={zoomTitleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease }}
          className="fixed inset-0 z-200 flex flex-col bg-pp-black/88 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="flex shrink-0 items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={zoomIndex === 0}
                className="font-accent rounded-sm px-3 py-2 text-xs tracking-[0.2em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop disabled:cursor-not-allowed disabled:text-pp-creme/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
              >
                ← Vorige
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={zoomIndex === count - 1}
                className="font-accent rounded-sm px-3 py-2 text-xs tracking-[0.2em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop disabled:cursor-not-allowed disabled:text-pp-creme/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
              >
                Volgende →
              </button>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="font-accent rounded-sm px-4 py-2 text-xs tracking-[0.2em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
            >
              Sluiten (Esc)
            </button>
          </div>
          <div
            className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 pb-8 pt-2 md:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p id={zoomTitleId} className="sr-only">
              {tier.label} groepsmenu — vergroot
            </p>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="relative w-full max-w-4xl"
            >
              <div className="relative overflow-hidden rounded-sm border border-pp-white/15 shadow-[0_28px_80px_rgb(0_0_0/0.5)]">
                <Image
                  src={tier.src}
                  alt={tier.alt}
                  width={1200}
                  height={1600}
                  className="h-auto w-full object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
              </div>
              <p className="mt-4 text-center font-display text-xl text-pp-creme">
                {tier.label} — {tier.tagline}
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
