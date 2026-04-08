"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DeckFloatingActions } from "@/components/home/DeckFloatingActions";
import { DesktopHorizontalHomeStory } from "@/components/home/DesktopHorizontalHomeStory";
import { HeroDeckBlendBand } from "@/components/home/HeroDeckBlendBand";
import { HomeHeroPrimary } from "@/components/home/HomeHeroPrimary";
import { PresentationDeck } from "@/components/home/PresentationDeck";
import { SplashPolaroidCollage } from "@/components/home/SplashPolaroidCollage";
import { Reserve4YouWidget } from "@/components/reserve/Reserve4YouWidget";

const STORAGE_KEY = "ppsite-splash-dismissed";
const WORDMARK_LAYOUT_ID = "pp-wordmark-title";
/** Splash — lijnen in lijn met home / marquee (Nederlands, merkstem). */
const SPLASH_SLIDES = [
  "FUN LOVING FOOD MOMENTS",
  "GOOD CHICKEN · GOOD MOOD",
  "VERS AAN TAFEL — IN HEEL BELGIË",
] as const;

const FADE_SEC = 0.5;
const HOLD_SEC = 1.05;
const AFTER_LAST_SLIDE_MS = 320;

const wordmarkClass =
  "font-display text-center leading-[0.95] tracking-wide text-pp-creme text-[clamp(2.15rem,6.8vw,3.65rem)]";

const HERO_TAGLINE = "FUN LOVING FOOD MOMENTS";
const HERO_SUPPORT_COPY =
  "Scroll verder en ontdek onze signature dishes, alle Belgische locaties en het funky kippenhokgevoel dat Poule & Poulette zo herkenbaar maakt.";

/** Woordmerk boven video — Bacon Kingdom + pp-creme (design system 2.0). */
const heroVideoWordmarkClass =
  "font-display text-pp-creme drop-shadow-[0_3px_28px_rgb(0_0_0/0.55)]";

/** Splash: zelfde olijf + crème als video-hero (geen lichte “kaart” meer). */
const splashWordmarkClass =
  "font-display text-center leading-[0.95] tracking-wide text-pp-creme text-[clamp(2rem,6.2vw,3.5rem)] drop-shadow-[0_2px_32px_rgb(0_0_0/0.45)]";

type SlideshowProps = { onComplete: () => void };

function SplashSlideshow({ onComplete }: SlideshowProps) {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!show) return;
    const ms = (FADE_SEC + HOLD_SEC) * 1000;
    const id = window.setTimeout(() => setShow(false), ms);
    return () => window.clearTimeout(id);
  }, [show, idx]);

  const handleExitComplete = useCallback(() => {
    if (idx < SPLASH_SLIDES.length - 1) {
      setIdx((n) => n + 1);
      setShow(true);
    } else {
      window.setTimeout(onComplete, AFTER_LAST_SLIDE_MS);
    }
  }, [idx, onComplete]);

  return (
    <div
      className="pointer-events-none flex min-h-[2.85rem] w-full max-w-[min(92vw,26rem)] flex-col items-center justify-center sm:min-h-[3.1rem]"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {show ? (
          <motion.p
            key={idx}
            className="font-display text-center text-[clamp(1.05rem,3.2vw,1.65rem)] tracking-[0.08em] text-pp-lollypop/95 drop-shadow-[0_1px_20px_rgb(0_0_0/0.35)]"
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: FADE_SEC,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: -5,
              transition: {
                duration: FADE_SEC,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          >
            {SPLASH_SLIDES[idx]}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function HomeExperience() {
  const reduceMotion = useReducedMotion();
  const splashTitleId = useId();
  const homeJourneyLabelId = useId();
  const mainRef = useRef<HTMLElement>(null);
  const [desktopHorizontalJourney, setDesktopHorizontalJourney] =
    useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktopHorizontalJourney(mq.matches && !reduceMotion);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduceMotion]);
  const chickenDismissRef = useRef<number | null>(null);
  const [splashActive, setSplashActive] = useState(true);
  const [chickenMoment, setChickenMoment] = useState(false);
  const [chickenSpot, setChickenSpot] = useState<{
    bottom: number;
    right: number;
  } | null>(null);

  const dismissSplash = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setSplashActive(false);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setSplashActive(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setSplashActive(false);
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (splashActive) {
      document.documentElement.classList.add("pp-splash-open");
    } else {
      document.documentElement.classList.remove("pp-splash-open");
    }
  }, [splashActive]);

  useEffect(() => {
    if (splashActive) return;
    const t = window.setTimeout(() => {
      mainRef.current?.focus({ preventScroll: true });
    }, 100);
    return () => window.clearTimeout(t);
  }, [splashActive]);

  useEffect(() => {
    if (!splashActive) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") dismissSplash();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [splashActive, dismissSplash]);

  const onSlideshowFinished = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setSplashActive(false);
  }, []);

  const clearChickenTimer = useCallback(() => {
    if (chickenDismissRef.current) {
      window.clearTimeout(chickenDismissRef.current);
      chickenDismissRef.current = null;
    }
  }, []);

  const triggerChickenPop = useCallback(() => {
    clearChickenTimer();
    setChickenSpot({
      bottom: 14 + Math.random() * 26,
      right: 2 + Math.random() * 24,
    });
    setChickenMoment(true);
    const ms = reduceMotion ? 900 : 3200;
    chickenDismissRef.current = window.setTimeout(() => {
      setChickenMoment(false);
      setChickenSpot(null);
      chickenDismissRef.current = null;
    }, ms);
  }, [clearChickenTimer, reduceMotion]);

  useEffect(() => () => clearChickenTimer(), [clearChickenTimer]);

  return (
    <LayoutGroup id="pp-home-layout">
      <div className="flex min-h-full flex-1 flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:m-4 focus:rounded-sm focus:bg-pp-creme focus:px-4 focus:py-2 focus:text-pp-olive focus:outline-2 focus:outline-offset-2 focus:outline-pp-olive"
        >
          Ga naar de inhoud
        </a>

        <AnimatePresence>
          {splashActive && (
            <motion.div
              key="splash-chrome"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[100] bg-linear-to-b from-pp-olive via-[#1a322e] to-[#152a26]"
              aria-hidden
            />
          )}
        </AnimatePresence>

        {splashActive ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={splashTitleId}
            className="pointer-events-none fixed inset-0 z-[101] flex flex-col px-5 sm:px-8"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_42%,rgb(28_56_52/0.35)_0%,transparent_58%)]"
              aria-hidden
            />
            <SplashPolaroidCollage reduceMotion={reduceMotion} />

            <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center pb-24 pt-12 sm:pb-28 sm:pt-14">
              <p className="mb-4 text-center font-accent text-[0.62rem] tracking-[0.36em] text-pp-creme/55 uppercase sm:mb-5 sm:text-[0.68rem] sm:tracking-[0.38em]">
                Welkom
              </p>

              <motion.h1
                layoutId={WORDMARK_LAYOUT_ID}
                className={`relative z-10 mx-auto w-full max-w-[min(92vw,44rem)] px-2 text-center ${splashWordmarkClass}`}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 38,
                  mass: 0.85,
                }}
                id={splashTitleId}
              >
                Poule &amp; Poulette
              </motion.h1>

              <div className="mt-8 flex w-full justify-center px-2 sm:mt-10">
                {!reduceMotion ? (
                  <SplashSlideshow onComplete={onSlideshowFinished} />
                ) : (
                  <p className="font-display text-center text-sm tracking-[0.06em] text-pp-creme/80">
                    {SPLASH_SLIDES[0]}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={dismissSplash}
              aria-label="Overslaan"
              className="pointer-events-auto absolute bottom-8 left-1/2 z-[102] flex -translate-x-1/2 flex-col items-center rounded-sm sm:bottom-10"
            >
              <span className="font-accent text-[0.68rem] tracking-[0.28em] text-pp-creme/70 uppercase underline decoration-pp-creme/35 underline-offset-[8px] transition-colors hover:text-pp-lollypop hover:decoration-pp-lollypop/55">
                Overslaan
              </span>
            </button>
          </div>
        ) : null}

        <div
          inert={splashActive ? true : undefined}
          className="flex min-h-full flex-1 flex-col"
        >
          <main
            ref={mainRef}
            id="content"
            className={`relative flex flex-1 flex-col outline-none ${!splashActive ? "pb-28 md:pb-32" : ""}`}
            tabIndex={-1}
          >
            {(splashActive || !desktopHorizontalJourney) ? (
              <HomeHeroPrimary
                splashActive={splashActive}
                splashTitleId={splashTitleId}
                reduceMotion={reduceMotion}
                wordmarkClass={wordmarkClass}
                heroTagline={HERO_TAGLINE}
                heroSupportCopy={HERO_SUPPORT_COPY}
                heroVideoWordmarkClass={heroVideoWordmarkClass}
                wordmarkLayoutId={WORDMARK_LAYOUT_ID}
                onChickenTrigger={triggerChickenPop}
                chickenMoment={chickenMoment}
                chickenSpot={chickenSpot}
              />
            ) : null}

            {!splashActive && desktopHorizontalJourney ? (
              <>
                <DeckFloatingActions
                  visible
                  instant={!!reduceMotion}
                />
                <DesktopHorizontalHomeStory
                  journeyLabelId={homeJourneyLabelId}
                  hero={
                    <HomeHeroPrimary
                      splashActive={splashActive}
                      splashTitleId={splashTitleId}
                      reduceMotion={reduceMotion}
                      wordmarkClass={wordmarkClass}
                      heroTagline={HERO_TAGLINE}
                      heroSupportCopy={HERO_SUPPORT_COPY}
                      heroVideoWordmarkClass={heroVideoWordmarkClass}
                      wordmarkLayoutId={WORDMARK_LAYOUT_ID}
                      onChickenTrigger={triggerChickenPop}
                      chickenMoment={chickenMoment}
                      chickenSpot={chickenSpot}
                      desktopHorizontalRail
                    />
                  }
                  jobsPanel={
                    <section
                      id="jobs"
                      tabIndex={-1}
                      className="flex min-h-full flex-col scroll-mt-28 border-t border-pp-olive/10 bg-pp-white px-6 py-10 text-pp-olive md:py-12"
                      aria-labelledby="pp-jobs-heading"
                    >
                      <span className="sr-only">
                        Doel van de zwevende knop Jobs op dit scherm.
                      </span>
                      <h2
                        id="pp-jobs-heading"
                        className="font-display text-xl md:text-2xl"
                      >
                        Vacatures
                      </h2>
                      <p className="font-accent mt-2 max-w-lg text-sm text-pp-black/55">
                        Inhoud volgt.
                      </p>
                    </section>
                  }
                  reservePanel={
                    <section
                      id="reserve"
                      tabIndex={-1}
                      className="flex min-h-full flex-col scroll-mt-28 border-t border-pp-olive/10 bg-pp-creme/20 px-6 py-10 md:py-12"
                      aria-labelledby="pp-reserve-heading"
                    >
                      <h2 id="pp-reserve-heading" className="sr-only">
                        Reserveren
                      </h2>
                      <Reserve4YouWidget />
                    </section>
                  }
                  footerPanel={
                    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                      <p className="font-accent text-sm text-pp-olive/70">
                        © Poule &amp; Poulette
                      </p>
                    </div>
                  }
                />
              </>
            ) : !splashActive ? (
              <>
                <DeckFloatingActions
                  visible
                  instant={!!reduceMotion}
                />
                <div className="flex flex-col">
                  <HeroDeckBlendBand />
                  <PresentationDeck />
                  <section
                    id="jobs"
                    tabIndex={-1}
                    className="scroll-mt-28 border-t border-pp-olive/10 bg-pp-white px-6 py-10 text-pp-olive md:py-12"
                    aria-labelledby="pp-jobs-heading"
                  >
                    <span className="sr-only">
                      Doel van de zwevende knop Jobs op dit scherm.
                    </span>
                    <h2
                      id="pp-jobs-heading"
                      className="font-display text-xl md:text-2xl"
                    >
                      Vacatures
                    </h2>
                    <p className="font-accent mt-2 max-w-lg text-sm text-pp-black/55">
                      Inhoud volgt.
                    </p>
                  </section>
                  <section
                    id="reserve"
                    tabIndex={-1}
                    className="scroll-mt-28 border-t border-pp-olive/10 bg-pp-creme/20 px-6 py-10 md:py-12"
                    aria-labelledby="pp-reserve-heading"
                  >
                    <h2 id="pp-reserve-heading" className="sr-only">
                      Reserveren
                    </h2>
                    <Reserve4YouWidget />
                  </section>
                </div>
              </>
            ) : null}
          </main>

          {!desktopHorizontalJourney ? (
            <footer className="border-t border-pp-olive/10 bg-pp-white px-6 py-6 text-center text-sm text-pp-olive/70">
              <p className="font-accent">© Poule &amp; Poulette</p>
            </footer>
          ) : null}
        </div>
      </div>
    </LayoutGroup>
  );
}
