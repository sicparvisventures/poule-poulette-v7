"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { DeckFloatingActions } from "@/components/home/DeckFloatingActions";
import { HeroDeckBlendBand } from "@/components/home/HeroDeckBlendBand";
import { PresentationDeck } from "@/components/home/PresentationDeck";
import { SplashPolaroidCollage } from "@/components/home/SplashPolaroidCollage";
import { Reserve4YouWidget } from "@/components/reserve/Reserve4YouWidget";

const STORAGE_KEY = "ppsite-splash-dismissed";
const WORDMARK_LAYOUT_ID = "pp-wordmark-title";
/** Splash-pulsen — andere toon dan de vaste merk-tagline elders. */
const SPLASH_SLIDES = [
  "VERS AAN TAFEL",
  "SFEER IN HUIS",
  "KETEN MET KARAKTER",
] as const;

const FADE_SEC = 0.5;
const HOLD_SEC = 1.05;
const AFTER_LAST_SLIDE_MS = 320;

const wordmarkClass =
  "font-display text-center leading-[0.95] tracking-wide text-pp-creme text-[clamp(2.15rem,6.8vw,3.65rem)]";

/** Splash: lichte achtergrond → donker woordmerk (omgekeerd t.o.v. hero-olive). */
const splashWordmarkClass =
  "font-display text-center leading-[0.95] tracking-wide text-pp-olive text-[clamp(2.15rem,6.8vw,3.65rem)]";

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
            className="font-display text-center text-[clamp(1.2rem,3.8vw,1.85rem)] tracking-[0.04em] text-pp-olive drop-shadow-[0_1px_14px_rgb(253_248_193/0.9)]"
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
  const mainRef = useRef<HTMLElement>(null);
  const [splashActive, setSplashActive] = useState(true);

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

  return (
    <LayoutGroup id="pp-home-layout">
      <div className="flex min-h-full flex-1 flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-120 focus:m-4 focus:rounded-sm focus:bg-pp-creme focus:px-4 focus:py-2 focus:text-pp-olive focus:outline-2 focus:outline-offset-2 focus:outline-pp-olive"
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
              className="fixed inset-0 z-40 bg-linear-to-b from-pp-creme via-pp-white to-pp-creme/95"
              aria-hidden
            />
          )}
        </AnimatePresence>

        {splashActive ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={splashTitleId}
            className="pointer-events-none fixed inset-0 z-45 flex flex-col px-5 sm:px-8"
          >
            <SplashPolaroidCollage reduceMotion={reduceMotion} />

            <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center pb-28 pt-10">
              <p className="mb-5 text-center font-accent text-[0.6rem] tracking-[0.4em] text-pp-olive/45 uppercase sm:mb-6 sm:text-[0.65rem] sm:tracking-[0.42em]">
                Welkom bij
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
                POULE &amp; POULETTE
              </motion.h1>

              <div className="mt-10 flex w-full justify-center px-2 sm:mt-12">
                {!reduceMotion ? (
                  <SplashSlideshow onComplete={onSlideshowFinished} />
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={dismissSplash}
              aria-label="Overslaan"
              className="pointer-events-auto absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 rounded-sm sm:bottom-8"
            >
              {!reduceMotion ? (
                <Image
                  src="/images/chicken_walk.gif"
                  alt=""
                  width={160}
                  height={160}
                  unoptimized
                  className="h-auto w-[min(42vw,7.5rem)] object-contain opacity-95 drop-shadow-[0_6px_20px_rgb(28_56_52/0.2)] sm:w-32 md:w-36"
                />
              ) : null}
              <span className="font-accent text-[0.65rem] tracking-[0.24em] text-pp-olive/40 uppercase underline decoration-pp-olive/25 underline-offset-[6px] transition-colors hover:text-pp-lollypop hover:decoration-pp-lollypop/50">
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
            <section
              className="relative flex min-h-dvh flex-1 flex-col bg-pp-olive"
              aria-label="Poule &amp; Poulette — keten België"
            >
              <div className="relative min-h-[55vh] flex-1 w-full md:min-h-[65vh]">
                {reduceMotion ? (
                  <Image
                    src="/fotookes/PP_Mechelen-1.png"
                    alt="Poule &amp; Poulette — sfeerbeeld restaurant"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                ) : (
                  <video
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/fotookes/PP_Mechelen-1.png"
                    aria-hidden
                  >
                    <source
                      src="/videos/hero-poule-poulette.mp4"
                      type="video/mp4"
                    />
                  </video>
                )}
                <div
                  className="pointer-events-none absolute inset-0 z-1 flex items-center justify-center overflow-hidden"
                  aria-hidden
                >
                  <div className="relative mx-auto h-[min(82vh,calc(min(96vw,90rem)*9/16))] w-[min(96vw,90rem)] max-w-full">
                    <Image
                      src="/images/frame_transparent.png"
                      alt=""
                      width={413}
                      height={429}
                      className="h-full w-full object-contain object-center opacity-[0.88]"
                      sizes="100vw"
                    />
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 z-2 bg-(--pp-hero-veil)"
                  aria-hidden
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-1/2 bg-linear-to-t from-pp-black/75 to-transparent" />

                <div
                  className="pointer-events-none absolute left-3 top-[max(4.5rem,12vh)] z-8 w-[min(26vw,4.25rem)] opacity-[0.92] sm:left-5 sm:top-[max(5rem,14vh)] sm:w-[min(22vw,4.75rem)] md:left-6 md:top-28 md:w-20"
                  aria-hidden
                >
                  <Image
                    src="/images/doodle_clean_upscaled.png"
                    alt=""
                    width={256}
                    height={256}
                    className="h-auto w-full object-contain drop-shadow-[0_6px_20px_rgb(0_0_0/0.5)]"
                    sizes="(max-width: 768px) 26vw, 80px"
                  />
                </div>

                {!reduceMotion ? (
                  <div
                    className="pointer-events-none absolute right-0 bottom-12 z-8 w-[min(58vw,15.5rem)] opacity-[0.95] drop-shadow-[0_10px_28px_rgb(0_0_0/0.55)] sm:bottom-14 sm:w-[min(50vw,17rem)] md:bottom-16 md:w-[min(42vw,18rem)] md:max-w-[18rem]"
                    aria-hidden
                  >
                    <Image
                      src="/images/chicken_walk.gif"
                      alt=""
                      width={288}
                      height={288}
                      unoptimized
                      className="h-auto w-full scale-x-[-1] object-contain object-bottom-right select-none"
                    />
                  </div>
                ) : null}

                <div
                  className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center px-6"
                  aria-hidden
                >
                  <Image
                    src="/images/logo-poule-hero.png"
                    alt=""
                    width={520}
                    height={520}
                    priority
                    className="h-auto w-[min(48vw,11rem)] max-w-[220px] object-contain opacity-[0.97] drop-shadow-[0_6px_32px_rgb(0_0_0/0.5)] sm:w-[min(40vw,13rem)] sm:max-w-[260px] md:max-w-[280px]"
                    sizes="(max-width: 768px) 48vw, 280px"
                  />
                </div>

                <nav
                  className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-center gap-x-10 gap-y-4 px-6 pb-10 md:gap-x-16 md:pb-14"
                  aria-label="Primaire acties"
                >
                  <a
                    href="#menu"
                    className="pointer-events-auto font-accent text-xl tracking-[0.2em] text-pp-creme uppercase underline-offset-8 transition-colors hover:text-pp-lollypop md:text-2xl"
                  >
                    Menu
                  </a>
                  <Link
                    href="/locations"
                    className="pointer-events-auto font-accent text-xl tracking-[0.2em] text-pp-creme uppercase underline-offset-8 transition-colors hover:text-pp-lollypop md:text-2xl"
                  >
                    Locations
                  </Link>
                </nav>
              </div>

              <div className="relative z-1 border-t border-pp-white/10 bg-pp-olive px-6 py-8 text-pp-white">
                <div
                  className="pointer-events-none absolute bottom-full left-[4%] z-40 w-[min(50vw,10.25rem)] translate-y-1/2 -rotate-12 sm:left-[6%] sm:w-[min(44vw,11.75rem)] sm:-rotate-11 md:left-[7%] md:w-[min(32vw,13.5rem)] md:translate-y-[48%] md:-rotate-10"
                  aria-hidden
                >
                  <Image
                    src="/fotookes/hero-sticker-seam.png"
                    alt=""
                    width={640}
                    height={640}
                    className="h-auto w-full object-contain drop-shadow-[0_12px_36px_rgb(0_0_0/0.55)]"
                    sizes="(max-width: 768px) 50vw, 216px"
                  />
                </div>
                {!splashActive ? (
                  <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,7rem)_1fr] md:gap-10 lg:grid-cols-[minmax(0,7.5rem)_1fr] lg:gap-12">
                    <div className="pointer-events-none relative z-0 flex justify-center -ml-6 sm:-ml-8 md:justify-start md:-ml-14 lg:-ml-20">
                      <Image
                        src="/images/styleguide-winter-kopie.png"
                        alt="Poule &amp; Poulette — winter"
                        width={360}
                        height={480}
                        className="h-auto w-[min(34vw,6rem)] object-contain opacity-95 drop-shadow-[0_10px_32px_rgb(0_0_0/0.35)] sm:w-28 md:w-full md:max-w-28 lg:max-w-30"
                        sizes="(max-width: 768px) 34vw, 112px"
                      />
                    </div>
                    <div className="min-w-0 text-center">
                      <motion.h1
                        id={splashTitleId}
                        layoutId={WORDMARK_LAYOUT_ID}
                        className={`relative z-10 mx-auto w-full max-w-[min(92vw,44rem)] px-4 ${wordmarkClass}`}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 38,
                          mass: 0.85,
                        }}
                      >
                        POULE &amp; POULETTE
                      </motion.h1>
                      <motion.p
                        className="font-accent mx-auto mt-6 max-w-2xl text-base text-pp-white/85"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: 0.2,
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }}
                      >
                        Dit is de hoofdsite voor elke Poule &amp; Poulette in België
                        — één merk, alle locaties. We bouwen beweging, 3D en detail
                        hier laag voor laag uit tot alles even verfijnd voelt als een
                        bezoek bij jullie.
                      </motion.p>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>

            {!splashActive ? (
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

          <footer className="border-t border-pp-olive/10 bg-pp-white px-6 py-6 text-center text-sm text-pp-olive/70">
            <p className="font-accent">© Poule &amp; Poulette</p>
          </footer>
        </div>
      </div>
    </LayoutGroup>
  );
}
