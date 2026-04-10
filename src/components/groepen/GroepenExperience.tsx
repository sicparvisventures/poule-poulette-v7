"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import { PromotionStrip } from "@/components/marketing/PromotionStrip";
import {
  groupMenuTiers,
  groupsMarqueePhrases,
  groupsPageCopy,
} from "@/content/groupsPage";
import type { ManagedGroupTier } from "@/lib/marketing-admin/types";
import { useMarketingSnapshot } from "@/lib/marketing-admin/store";

const ease = [0.22, 1, 0.36, 1] as const;
type GroupTierLike = ManagedGroupTier | (typeof groupMenuTiers)[number];

function GroupsMarqueeBand() {
  const phrases = useMarketingSnapshot(
    (state) => state.groupsPageCopy.marqueePhrases,
  );
  const segment = `${(phrases.length ? phrases : groupsMarqueePhrases).join(" · ")} · `;
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
  const managedGroups = useMarketingSnapshot((state) => state.groups);
  const managedPageCopy = useMarketingSnapshot((state) => state.groupsPageCopy);
  const groups = managedGroups.length ? managedGroups : groupMenuTiers;
  const pageCopy = managedPageCopy.title
    ? managedPageCopy
    : { ...groupsPageCopy, marqueePhrases: [...groupsMarqueePhrases] };
  const zoomTitleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const count = groups.length;

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

  const zoomTier = zoomIndex !== null ? groups[zoomIndex] : null;

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
      <PromotionStrip placement="groups-page" />

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
              {pageCopy.kicker}
            </p>
            <h1 className="font-display mt-2 text-3xl text-pp-olive sm:text-4xl">
              {pageCopy.title}
            </h1>
            <p className="font-accent mt-4 text-sm leading-relaxed text-pp-black/72 sm:text-base">
              {pageCopy.intro}
            </p>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
            {groups.map((tier, i) => (
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
                    : { y: -4, transition: { duration: 0.22, ease } }
                }
                whileTap={
                  reduceMotion ? undefined : { scale: 0.99 }
                }
                onClick={() => setZoomIndex(i)}
                className={`group flex h-full w-full flex-col overflow-hidden rounded-[0.35rem] border text-left shadow-[0_12px_36px_rgb(28_56_52/0.08)] outline-none ring-pp-lollypop transition-[box-shadow,transform] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pp-white md:min-h-0 ${tier.cardClass}`}
                aria-label={`${tier.label} — ${tier.tagline}, vergroten`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-pp-olive/10 bg-pp-white/60 px-3 py-2.5 sm:px-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${tier.accentDot} ring-2 ring-pp-white/90 shadow-sm`}
                      aria-hidden
                    />
                    <span className="font-display text-lg text-pp-olive sm:text-xl">
                      {tier.label}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-sm bg-pp-olive/10 px-2 py-0.5 font-accent text-[0.5rem] tracking-[0.2em] text-pp-olive/70 uppercase">
                    {i + 1}/3
                  </span>
                </div>
                <div className="relative min-h-0 w-full flex-1 bg-[#f8f2dd]">
                  <div className="relative mx-auto aspect-210/297 w-full max-w-[min(100%,280px)] sm:max-w-none">
                    <Image
                      src={tier.src}
                      alt=""
                      fill
                      className="object-contain object-center p-1 transition-transform duration-300 ease-out group-hover:scale-[1.02] sm:p-1.5"
                      sizes="(max-width: 768px) 90vw, 320px"
                      priority={i < 2}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 border-t border-pp-olive/8 bg-pp-white/70 px-3 py-3 sm:px-4 sm:py-3.5">
                  <p className="font-accent text-[0.58rem] tracking-[0.24em] text-pp-olive/50 uppercase">
                    {tier.tagline}
                  </p>
                  <p className="font-accent text-sm leading-relaxed text-pp-black/72">
                    {tier.blurb}
                  </p>
                  <p className="pt-1 font-accent text-[0.55rem] tracking-[0.18em] text-pp-lollypop/85 uppercase">
                    Tik om te vergroten
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
          {pageCopy.footnote}
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
  tier: GroupTierLike | null;
  zoomIndex: number | null;
  count: number;
  zoomTitleId: string;
  closeBtnRef: RefObject<HTMLButtonElement | null>;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const pageCopy = useMarketingSnapshot((state) => state.groupsPageCopy);
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
                className="font-accent rounded-sm px-3 py-2 text-xs tracking-[0.2em] text-pp-creme uppercase ring-pp-creme transition-colors hover:text-pp-lollypop disabled:cursor-not-allowed disabled:text-pp-creme/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
              >
                ← Vorige
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={zoomIndex === count - 1}
                className="font-accent rounded-sm px-3 py-2 text-xs tracking-[0.2em] text-pp-creme uppercase ring-pp-creme transition-colors hover:text-pp-lollypop disabled:cursor-not-allowed disabled:text-pp-creme/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
              >
                Volgende →
              </button>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="font-accent rounded-sm px-4 py-2 text-xs tracking-[0.2em] text-pp-creme uppercase ring-pp-creme transition-colors hover:text-pp-lollypop focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
            >
              {pageCopy.zoomClose || groupsPageCopy.zoomClose} (Esc)
            </button>
          </div>
          <div
            className="flex min-h-0 flex-1 items-center justify-center px-4 pb-10 pt-2 md:px-10"
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
              className="relative max-h-[min(92dvh,920px)] w-full max-w-6xl"
            >
              <Image
                src={tier.src}
                alt={tier.alt}
                width={1400}
                height={1800}
                className="mx-auto h-auto max-h-[min(92dvh,920px)] w-auto max-w-full object-contain object-center drop-shadow-[0_24px_64px_rgb(0_0_0/0.5)]"
                sizes="100vw"
                priority
              />
            </motion.div>
          </div>
          <p
            className="pointer-events-none pb-6 text-center font-accent text-[0.65rem] tracking-[0.2em] text-pp-creme/50 uppercase"
            aria-hidden
          >
            Gebruik ook ← en → om tussen menu&apos;s te wisselen
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
