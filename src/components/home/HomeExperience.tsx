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
import { HeroDeckBlendBand } from "@/components/home/HeroDeckBlendBand";
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
  const mainRef = useRef<HTMLElement>(null);
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
                  className="pointer-events-none absolute inset-0 bg-(--pp-hero-veil)"
                  aria-hidden
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-pp-black/75 to-transparent" />

                <div
                  className="pointer-events-none absolute left-5 top-[max(1.25rem,4vh)] z-8 hidden w-[min(20vw,3.35rem)] opacity-[0.72] sm:left-7 sm:top-[max(1.75rem,5.5vh)] sm:w-[min(17vw,3.5rem)] md:left-9 md:top-12 md:block md:w-15 rotate-14"
                  aria-hidden
                >
                  <Image
                    src="/images/doodle_clean_upscaled.png"
                    alt=""
                    width={256}
                    height={256}
                    className="h-auto w-full object-contain drop-shadow-[0_4px_14px_rgb(0_0_0/0.42)]"
                    sizes="(max-width: 768px) 20vw, 64px"
                  />
                </div>
                <div
                  className="pointer-events-none absolute left-3 top-[max(4.5rem,12vh)] z-8 hidden w-[min(26vw,4.25rem)] opacity-[0.92] sm:left-5 sm:top-[max(5rem,14vh)] sm:w-[min(22vw,4.75rem)] md:left-6 md:top-28 md:block md:w-20 -rotate-8"
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

                <div className="absolute inset-0 z-[25] flex flex-col items-center justify-center gap-3 px-6 sm:gap-4 md:z-5 md:gap-5">
                  <button
                    type="button"
                    onClick={triggerChickenPop}
                    className={`flex w-[min(92vw,18rem)] flex-col items-center text-center transition-[color,transform,filter] duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] sm:w-[min(78vw,21rem)] md:w-[min(46vw,22rem)] ${heroVideoWordmarkClass} cursor-pointer hover:text-pp-lollypop hover:drop-shadow-[0_0_36px_rgba(244_149_189/0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pp-lollypop/85 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent`}
                    aria-label="Poule &amp; Poulette — tik voor een korte animatie"
                  >
                    <span className="block text-[clamp(1.8rem,5.7vw,3.05rem)] leading-[0.88] tracking-[0.015em]">
                      POULE &amp;
                    </span>
                    <span className="-mt-[0.12em] block text-[clamp(1.8rem,5.7vw,3.05rem)] leading-[0.88] tracking-[0.015em]">
                      POULETTE
                    </span>
                  </button>
                  <motion.div
                    className="group pointer-events-auto relative w-[min(56vw,11.5rem)] max-w-[200px] cursor-pointer sm:w-[min(48vw,13rem)] sm:max-w-[230px] md:w-[min(42vw,14rem)] md:max-w-[250px]"
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -4,
                            rotate: -3,
                            scale: 1.04,
                          }
                    }
                    whileTap={
                      reduceMotion
                        ? undefined
                        : { scale: 0.96, rotate: -1 }
                    }
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    tabIndex={0}
                    role="button"
                    aria-label="Poule &amp; Poulette lockup — tik voor een korte animatie"
                    onClick={triggerChickenPop}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        triggerChickenPop();
                      }
                    }}
                  >
                    <div className="relative aspect-square w-full">
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-[0.98] drop-shadow-[0_8px_32px_rgb(0_0_0/0.5)] transition-all duration-300 ease-out group-hover:scale-[1.01] group-hover:opacity-0 group-focus-visible:scale-[1.01] group-focus-visible:opacity-0"
                        style={{
                          backgroundColor: "#fdf8c1",
                          WebkitMaskImage: 'url("/images/hero-pp-lockup.png")',
                          maskImage: 'url("/images/hero-pp-lockup.png")',
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          maskPosition: "center",
                          WebkitMaskSize: "contain",
                          maskSize: "contain",
                        }}
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 drop-shadow-[0_0_28px_rgb(244_149_189/0.65)] transition-all duration-300 ease-out group-hover:scale-[1.06] group-hover:opacity-100 group-focus-visible:scale-[1.06] group-focus-visible:opacity-100"
                        style={{
                          backgroundColor: "#f495bd",
                          WebkitMaskImage: 'url("/images/hero-pp-lockup.png")',
                          maskImage: 'url("/images/hero-pp-lockup.png")',
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          maskPosition: "center",
                          WebkitMaskSize: "contain",
                          maskSize: "contain",
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                <nav
                  className="absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-end justify-center gap-x-10 gap-y-4 px-6 pb-10 md:z-10 md:gap-x-16 md:pb-14"
                  aria-label="Primaire acties"
                >
                  <Link
                    href="/menu"
                    className="pointer-events-auto font-accent text-xl tracking-[0.2em] text-pp-creme uppercase underline-offset-8 transition-[color,transform,text-shadow] duration-200 hover:-translate-y-0.5 hover:scale-105 hover:text-pp-lollypop hover:drop-shadow-[0_0_20px_rgba(244_149_189/0.55)] active:scale-95 md:text-2xl"
                  >
                    Menu
                  </Link>
                  <Link
                    href="/locations"
                    className="pointer-events-auto font-accent text-xl tracking-[0.2em] text-pp-creme uppercase underline-offset-8 transition-[color,transform,text-shadow] duration-200 hover:-translate-y-0.5 hover:scale-105 hover:text-pp-lollypop hover:drop-shadow-[0_0_20px_rgba(244_149_189/0.55)] active:scale-95 md:text-2xl"
                  >
                    Locations
                  </Link>
                </nav>

                <AnimatePresence>
                  {chickenMoment && chickenSpot ? (
                    <motion.div
                      key={`hero-chicken-${chickenSpot.bottom.toFixed(1)}-${chickenSpot.right.toFixed(1)}`}
                      role="presentation"
                      aria-hidden
                      style={{
                        bottom: `${chickenSpot.bottom}%`,
                        right: `${chickenSpot.right}%`,
                      }}
                      className="pointer-events-none absolute z-[35] w-[min(34vw,7.75rem)] sm:w-[min(28vw,8.75rem)]"
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.85, x: 18, y: 18 }
                      }
                      animate={
                        reduceMotion
                          ? { opacity: 1 }
                          : {
                              opacity: 1,
                              scale: 1,
                              x: 0,
                              y: 0,
                              transition: {
                                type: "spring",
                                stiffness: 380,
                                damping: 22,
                              },
                            }
                      }
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              scale: 0.92,
                              x: 10,
                              y: 10,
                              transition: { duration: 0.22 },
                            }
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF */}
                      <img
                        src="/images/chicken_walk.gif"
                        alt=""
                        width={176}
                        height={176}
                        className="h-auto w-full object-contain object-center drop-shadow-[0_4px_18px_rgb(0_0_0/0.5)]"
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="relative z-1 overflow-x-clip border-t border-pp-white/10 bg-pp-olive px-6 py-8 text-pp-white">
                {/*
                  Doodle-textuur links & rechts: breedte-container loopt tot buiten px-6 zodat de
                  textuur tegen de echte rand van het olive-blok uitlijnt; fade naar het midden.
                */}
                <div
                  className="pointer-events-none absolute inset-y-0 -inset-x-6 z-0"
                  aria-hidden
                >
                  <div
                    className="absolute inset-y-0 left-0 w-[62%] max-w-2xl overflow-hidden sm:w-[54%] md:w-[48%] md:max-w-none lg:w-[42%]"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(90deg, black 0%, black 52%, rgba(0,0,0,0.2) 78%, transparent 100%)",
                      maskImage:
                        "linear-gradient(90deg, black 0%, black 52%, rgba(0,0,0,0.2) 78%, transparent 100%)",
                    }}
                  >
                    <div className="relative h-full min-h-48 w-full md:min-h-0">
                      <Image
                        src="/images/olive-band-doodle-overlay.png"
                        alt=""
                        fill
                        className="object-cover object-right opacity-[0.22] mix-blend-normal -scale-x-100"
                        sizes="(max-width: 768px) 65vw, 40vw"
                      />
                    </div>
                  </div>
                  <div
                    className="absolute inset-y-0 right-0 w-[62%] max-w-2xl overflow-hidden sm:w-[54%] md:w-[48%] md:max-w-none lg:w-[42%]"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 22%, black 48%)",
                      maskImage:
                        "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 22%, black 48%)",
                    }}
                  >
                    <div className="relative h-full min-h-48 w-full md:min-h-0">
                      <Image
                        src="/images/olive-band-doodle-overlay.png"
                        alt=""
                        fill
                        className="object-cover object-right opacity-[0.22] mix-blend-normal"
                        sizes="(max-width: 768px) 65vw, 40vw"
                      />
                    </div>
                  </div>
                </div>
                {/*
                  Seam-kader: alleen vanaf md. Hover/tik: lichte spring-scale + tilt (geen anim bij reduce motion).
                */}
                <motion.div
                  className="absolute bottom-full left-[6%] z-40 hidden w-[min(36vw,14.5rem)] translate-y-[46%] origin-[55%_65%] cursor-pointer md:block md:pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-creme/80 focus-visible:ring-offset-2 focus-visible:ring-offset-pp-olive"
                  style={{ rotate: -10 }}
                  aria-label="Sfeerbeeld restaurant — hover of tik voor een korte animatie"
                  role="group"
                  tabIndex={0}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 1.07,
                          rotate: -4,
                          y: -10,
                          transition: {
                            type: "spring",
                            stiffness: 420,
                            damping: 20,
                          },
                        }
                  }
                  whileTap={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 0.93,
                          rotate: -14,
                          transition: {
                            type: "spring",
                            stiffness: 550,
                            damping: 22,
                          },
                        }
                  }
                  whileFocus={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 1.05,
                          rotate: -5,
                          y: -6,
                          transition: {
                            type: "spring",
                            stiffness: 420,
                            damping: 20,
                          },
                        }
                  }
                >
                  <div className="relative aspect-[413/429] w-full drop-shadow-[0_14px_40px_rgb(0_0_0/0.5)]">
                    <div className="absolute inset-[21.2%_31.5%_16.6%_23%] z-0 overflow-hidden">
                      <Image
                        src="/fotookes/hero-seam-photo.jpg"
                        alt=""
                        fill
                        className="object-cover object-[center_42%]"
                        sizes="(max-width: 768px) 56vw, 240px"
                      />
                    </div>
                    <Image
                      src="/images/frame_transparent.png"
                      alt=""
                      fill
                      className="z-10 object-contain object-center"
                      sizes="(max-width: 768px) 56vw, 240px"
                    />
                  </div>
                </motion.div>
                {!splashActive ? (
                  <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col px-4 md:z-10 md:min-h-52 md:justify-center">
                    <div className="relative z-20 mx-auto flex w-full max-w-3xl flex-col items-center text-center md:z-10 md:py-2">
                      <motion.h1
                        id={splashTitleId}
                        layoutId={WORDMARK_LAYOUT_ID}
                        className={`relative z-10 w-full max-w-[min(92vw,44rem)] px-2 sm:px-4 [text-shadow:0_1px_28px_rgb(0_0_0/0.35)] ${wordmarkClass}`}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 38,
                          mass: 0.85,
                        }}
                      >
                        {HERO_TAGLINE}
                      </motion.h1>
                      <motion.p
                        className="font-accent mt-6 max-w-2xl text-balance text-base text-pp-white/92 [text-shadow:0_1px_18px_rgb(0_0_0/0.32)]"
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
                        {HERO_SUPPORT_COPY}
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
