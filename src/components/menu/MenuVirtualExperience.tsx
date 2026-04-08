"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { RefObject } from "react";
import { FixedPageIntroStrip } from "@/components/FixedPageIntroStrip";
import {
  menuMarqueePhrases,
  menuPageCopy,
  menuVirtualSections,
} from "@/content/menuSlides";

const ease = [0.22, 1, 0.36, 1] as const;
const DESKTOP_MENU_SPREADS = [
  { left: "brand-cover" as const, right: 0, active: [0] as number[] },
  { left: 1, right: 2, active: [1, 2] as number[] },
  { left: 3, right: 4, active: [3, 4] as number[] },
  { left: "brand-endnote" as const, right: "brand-back" as const, active: [5] as number[] },
] as const;

function MenuMarqueeBand() {
  const segment = `${menuMarqueePhrases.join(" · ")} · `;
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

function WavyConnector({ compact }: { compact?: boolean }) {
  return (
    <svg
      className={`${compact ? "h-3" : "h-6"} w-full text-pp-olive/20`}
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 12 Q50 4 100 12 T200 12 T300 12 T400 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 18 Q80 10 160 18 T320 18 T400 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.45"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function DesktopMenuSpread({
  leftPage,
  rightPage,
  onOpenLeft,
  onOpenRight,
}: {
  leftPage:
    | (typeof menuVirtualSections)[number]
    | "brand-cover"
    | "brand-endnote"
    | "brand-back";
  rightPage:
    | (typeof menuVirtualSections)[number]
    | "brand-cover"
    | "brand-endnote"
    | "brand-back";
  onOpenLeft: () => void;
  onOpenRight: () => void;
}) {
  const renderBrandPage = (
    mode: "brand-cover" | "brand-endnote" | "brand-back",
  ) => (
    <div className="relative flex h-full w-full items-center justify-center bg-[#fbf8ec] px-10 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <Image
          src="/images/olive-band-doodle-overlay.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="50vw"
        />
      </div>
      <div className="pointer-events-none absolute inset-[4%] rounded-[0.85rem] border border-pp-olive/8" />
      <div className="pointer-events-none absolute inset-[6.5%] rounded-[0.65rem] border border-pp-olive/6" />

      <div className="relative z-[2] flex max-w-[20rem] flex-col items-center">
        <p className="font-accent text-[0.58rem] tracking-[0.3em] text-pp-olive/55 uppercase">
          {mode === "brand-cover"
            ? "Poule & Poulette"
            : mode === "brand-endnote"
              ? "Reserveer je tafel"
              : "See You Soon"}
        </p>
        <p className="mt-2 text-balance font-display text-[clamp(2rem,3.1vw,3rem)] leading-[0.92] tracking-[0.02em] text-pp-olive">
          {mode === "brand-cover"
            ? "Poule & Poulette"
            : mode === "brand-endnote"
              ? "Kies Je Locatie"
              : "Tot Aan Tafel"}
        </p>
        <div className="relative mt-6 aspect-square w-[min(14rem,48%)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.98] drop-shadow-[0_8px_26px_rgb(28_56_52/0.16)]"
            style={{
              backgroundColor:
                mode === "brand-cover" || mode === "brand-endnote"
                  ? "#1c3834"
                  : "#f495bd",
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
        <p className="mt-6 font-accent text-[0.7rem] tracking-[0.28em] text-pp-olive/68 uppercase">
          {mode === "brand-cover"
            ? "Fun Loving Food Moments"
            : mode === "brand-endnote"
              ? "Antwerpen · Brussel · Gent · Leuven"
              : "Good Chicken · Good Mood"}
        </p>
        <p className="mt-2 max-w-[18rem] font-accent text-[0.68rem] leading-relaxed tracking-[0.06em] text-pp-olive/58">
          {mode === "brand-cover"
            ? "Belgian chicken. Funky interieur. Good mood aan tafel."
            : mode === "brand-endnote"
              ? "Mechelen, Oostende, Brugge en meer. Reserveer je tafel en laat de sfeer de rest doen."
              : "Kies je locatie, reserveer je tafel en kom terug voor meer Poule & Poulette."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative z-[2] flex min-h-0 w-[min(90vw,1120px)] max-w-full flex-1 flex-col">
      <div className="pointer-events-none absolute inset-0 rounded-[1.2rem] bg-linear-to-b from-pp-white/40 via-transparent to-pp-olive/6 blur-xl" />
      <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[1rem] border border-pp-olive/10 bg-[#fbf8ec] shadow-[0_24px_70px_rgb(28_56_52/0.12)]">
        <button
          type="button"
          onClick={onOpenLeft}
          className="group/page relative h-full w-1/2 overflow-hidden bg-[#fbf8ec] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pp-lollypop"
          aria-label={
            leftPage === "brand-cover" ||
            leftPage === "brand-endnote" ||
            leftPage === "brand-back"
              ? "Poule & Poulette branded pagina"
              : `${leftPage.label} — openen in zoom`
          }
        >
          {leftPage === "brand-cover" ||
          leftPage === "brand-endnote" ||
          leftPage === "brand-back" ? (
            renderBrandPage(leftPage)
          ) : (
            <Image
              src={leftPage.src}
              alt={leftPage.label}
              fill
              className="object-contain object-center p-0 transition-transform duration-300 ease-out group-hover/page:scale-[1.01]"
              sizes="(max-width: 768px) 50vw, 560px"
              priority
            />
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-2 bg-linear-to-l from-pp-black/5 to-transparent" />
        </button>

        <button
          type="button"
          onClick={onOpenRight}
          className="group/page relative h-full w-1/2 overflow-hidden bg-[#fbf8ec] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pp-lollypop"
          aria-label={
            rightPage === "brand-cover" ||
            rightPage === "brand-endnote" ||
            rightPage === "brand-back"
              ? "Poule & Poulette branded pagina"
              : `${rightPage.label} — openen in zoom`
          }
        >
          {rightPage === "brand-cover" ||
          rightPage === "brand-endnote" ||
          rightPage === "brand-back" ? (
            renderBrandPage(rightPage)
          ) : (
            <Image
              src={rightPage.src}
              alt={rightPage.label}
              fill
              className="object-contain object-center p-0 transition-transform duration-300 ease-out group-hover/page:scale-[1.01]"
              sizes="(max-width: 768px) 50vw, 560px"
              priority
            />
          )}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-linear-to-r from-pp-black/5 to-transparent" />
        </button>

        <div
          className="pointer-events-none absolute inset-y-[4%] left-1/2 z-[3] w-[6px] -translate-x-1/2"
          aria-hidden
        >
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-pp-black/10" />
          <div className="absolute inset-y-[8%] left-1/2 w-[4px] -translate-x-1/2 rounded-full bg-linear-to-b from-pp-black/4 via-pp-black/9 to-pp-black/4 blur-[0.5px]" />
        </div>
      </div>
    </div>
  );
}

export function MenuVirtualExperience() {
  const reduceMotion = useReducedMotion();
  const labelId = useId();
  const zoomTitleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showMenuNote, setShowMenuNote] = useState(true);
  const count = menuVirtualSections.length;
  const displayCount = isDesktop ? DESKTOP_MENU_SPREADS.length : count;
  const slideStepVw = 100;
  const activeSpread = isDesktop
    ? DESKTOP_MENU_SPREADS[Math.min(index, DESKTOP_MENU_SPREADS.length - 1)]
    : null;

  const { scrollYProgress } = useScroll({
    target: scrollRootRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `${-(displayCount - 1) * slideStepVw}vw`],
  );

  const stickerY1 = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const stickerRot1 = useTransform(scrollYProgress, [0, 1], [-6, -12]);
  const stickerY2 = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const stickerRot2 = useTransform(scrollYProgress, [0, 1], [10, 4]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const max = Math.max(1, displayCount - 1);
    const i = Math.round(v * max);
    setIndex(Math.min(displayCount - 1, Math.max(0, i)));
  });

  useLayoutEffect(() => {
    const el = scrollRootRef.current;
    if (!el) return;
    const max = Math.max(1, displayCount - 1);
    const rect = el.getBoundingClientRect();
    const rootTop = window.scrollY + rect.top;
    const range = Math.max(0, el.offsetHeight - window.innerHeight);
    if (range <= 0) return;
    const p = (window.scrollY - rootTop) / range;
    const i = Math.round(Math.max(0, Math.min(1, p)) * max);
    setIndex(Math.min(displayCount - 1, Math.max(0, i)));
  }, [displayCount]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const scrollToSection = useCallback(
    (i: number) => {
      const el = scrollRootRef.current;
      if (!el) return;
      const targetIndex = isDesktop
        ? Math.max(
            0,
            DESKTOP_MENU_SPREADS.findIndex((spread) => spread.active.includes(i)),
          )
        : i;
      const max = Math.max(0, displayCount - 1);
      const t =
        max <= 0 ? 0 : Math.max(0, Math.min(1, targetIndex / max));
      const rect = el.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const range = Math.max(0, el.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: start + t * range,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [displayCount, isDesktop, reduceMotion],
  );

  const openPrevZoom = useCallback(() => {
    setZoomIndex((current) =>
      current === null ? 0 : Math.max(0, current - 1),
    );
  }, []);

  const openNextZoom = useCallback(() => {
    setZoomIndex((current) =>
      current === null ? 0 : Math.min(count - 1, current + 1),
    );
  }, [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoomIndex !== null) {
        if (e.key === "Escape") setZoomIndex(null);
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          openPrevZoom();
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          openNextZoom();
        }
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        scrollToSection(Math.min(displayCount - 1, index + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        scrollToSection(Math.max(0, index - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    zoomIndex,
    index,
    displayCount,
    scrollToSection,
    openPrevZoom,
    openNextZoom,
  ]);

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

  const zoomSlide =
    zoomIndex !== null ? menuVirtualSections[zoomIndex] : null;

  if (reduceMotion) {
    return (
      <div className="flex min-h-dvh flex-col bg-pp-white text-pp-black">
        <MenuPageChrome />
        <MenuMarqueeBand />
        {showMenuNote ? (
          <FixedPageIntroStrip
            labelId={labelId}
            title={menuPageCopy.title}
            introBar={menuPageCopy.introBar}
            reduceMotion={reduceMotion}
            onDismiss={() => setShowMenuNote(false)}
            dismissAriaLabel="Verberg menu-uitleg"
          />
        ) : null}
        <div
          className={`flex flex-col ${showMenuNote ? "pt-[3.25rem] sm:pt-12" : ""}`}
        >
          {menuVirtualSections.map((section, i) => (
            <article
              key={section.src}
              className="border-b border-pp-olive/10 bg-pp-white"
            >
              <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
                <p className="font-accent text-xs tracking-[0.28em] text-pp-olive/55 uppercase">
                  {section.kicker}
                </p>
                <h2 className="font-display mt-2 text-2xl text-pp-olive">
                  {section.label}
                </h2>
                <p className="font-accent mt-3 text-sm leading-relaxed text-pp-black/70">
                  {section.blurb}
                </p>
                <WavyConnector />
                <button
                  type="button"
                  onClick={() => setZoomIndex(i)}
                  className="relative mx-auto mt-6 block w-full max-w-md overflow-hidden rounded-sm border border-pp-olive/12 bg-pp-white shadow-[0_12px_40px_rgb(0_0_0/0.08)] outline-none ring-pp-lollypop focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <span className="sr-only">{section.label} — vergroten</span>
                  <div className="relative aspect-[210/297] w-full">
                    <Image
                      src={section.src}
                      alt=""
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 768px) 100vw, 520px"
                      priority={i < 2}
                    />
                  </div>
                </button>
              </div>
              {section.connector ? (
                <div className="flex items-center justify-center gap-3 bg-linear-to-r from-pp-olive/8 via-pp-lollypop/15 to-pp-olive/8 py-4">
                  <span className="h-px flex-1 max-w-[4rem] bg-pp-olive/20" />
                  <span className="font-accent text-[0.65rem] tracking-[0.24em] text-pp-olive/60 uppercase">
                    {section.connector}
                  </span>
                  <span className="h-px flex-1 max-w-[4rem] bg-pp-olive/20" />
                </div>
              ) : null}
            </article>
          ))}
        </div>
        <MenuFooter />
        <ZoomModal
          zoomSlide={zoomSlide}
          zoomIndex={zoomIndex}
          count={count}
          zoomTitleId={zoomTitleId}
          closeBtnRef={closeBtnRef}
          onPrev={openPrevZoom}
          onNext={openNextZoom}
          onClose={() => setZoomIndex(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-pp-white text-pp-black">
      <MenuPageChrome />
      <MenuMarqueeBand />

      <div
        ref={scrollRootRef}
        className="relative"
        style={{ height: `${displayCount * 100}vh` }}
      >
        <div className="sticky top-0 flex h-dvh flex-col overflow-hidden bg-linear-to-b from-pp-white via-pp-creme/15 to-pp-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
            <Image
              src="/images/olive-band-doodle-overlay.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={false}
            />
          </div>

          <motion.div
            style={{ y: stickerY1, rotate: stickerRot1 }}
            className="pointer-events-none absolute bottom-[12%] left-[2%] z-20 w-[clamp(4.5rem,16vw,7.5rem)] drop-shadow-[0_12px_28px_rgb(0_0_0/0.18)] md:left-[4%]"
            aria-hidden
          >
            <Image
              src="/images/menu-sticker-chicken.png"
              alt=""
              width={200}
              height={200}
              className="h-auto w-full object-contain"
              sizes="(max-width: 768px) 120px, 200px"
            />
          </motion.div>
          <motion.div
            style={{ y: stickerY2, rotate: stickerRot2 }}
            className="pointer-events-none absolute top-[22%] right-[1%] z-20 w-[clamp(4rem,14vw,6.5rem)] drop-shadow-[0_12px_28px_rgb(0_0_0/0.15)] md:right-[3%]"
            aria-hidden
          >
            <div className="relative aspect-square w-full">
              <div
                className="absolute inset-0 drop-shadow-[0_0_24px_rgb(244_149_189/0.28)]"
                style={{
                  backgroundColor: "#f495bd",
                  WebkitMaskImage:
                    'url("/images/ChatGPT Image 7 apr 2026, 23_06_50.png")',
                  maskImage:
                    'url("/images/ChatGPT Image 7 apr 2026, 23_06_50.png")',
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

          <div
            className={`relative z-10 flex min-h-0 flex-1 flex-col ${showMenuNote ? "pt-[3.25rem] sm:pt-12" : ""}`}
          >
            {showMenuNote ? (
              <FixedPageIntroStrip
                labelId={labelId}
                title={menuPageCopy.title}
                introBar={menuPageCopy.introBar}
                reduceMotion={reduceMotion}
                onDismiss={() => setShowMenuNote(false)}
                dismissAriaLabel="Verberg menu-uitleg"
              />
            ) : null}

            <div className="shrink-0 px-4 pb-0 pt-1 sm:px-5 md:pt-1">
              <div className="mx-auto max-w-3xl">
                <WavyConnector compact />
                <div className="flex items-end justify-between gap-3 pt-0.5 md:gap-4">
                  <div className="min-w-0">
                    <p className="font-accent text-[0.65rem] tracking-[0.3em] text-pp-olive/50 uppercase">
                      {isDesktop
                        ? typeof activeSpread?.left === "number"
                          ? menuVirtualSections[activeSpread.left]?.kicker
                          : "Poule & Poulette"
                        : menuVirtualSections[index]?.kicker}
                    </p>
                    <p className="font-display mt-1 truncate text-xl text-pp-olive md:text-2xl">
                      {isDesktop
                        ? typeof activeSpread?.left === "number"
                          ? `${menuVirtualSections[activeSpread.left]?.label} / ${
                              typeof activeSpread.right === "number"
                                ? menuVirtualSections[activeSpread.right]?.label
                                : "Back cover"
                            }`
                          : activeSpread?.left === "brand-cover"
                            ? `Cover / ${
                                typeof activeSpread?.right === "number"
                                  ? menuVirtualSections[activeSpread.right]?.label
                                  : "Back cover"
                              }`
                            : "Reserveer / Back cover"
                        : menuVirtualSections[index]?.label}
                    </p>
                  </div>
                  <p className="font-accent hidden max-w-xs text-right text-xs leading-relaxed text-pp-black/55 sm:block">
                    {isDesktop
                      ? typeof activeSpread?.left === "number"
                        ? menuVirtualSections[activeSpread.left]?.blurb
                        : activeSpread?.left === "brand-cover"
                          ? "Start met de kaft en blader daarna verder door het menu alsof het open voor je ligt."
                          : "Kies je locatie, reserveer je tafel en sluit af in echte Poule & Poulette-sfeer."
                      : menuVirtualSections[index]?.blurb}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              className="flex min-h-0 min-w-0 flex-1 flex-row items-stretch"
              style={{ x }}
            >
              {isDesktop
                ? DESKTOP_MENU_SPREADS.map((section, i) => (
                    <div
                      key={`spread-${i}`}
                      className="relative flex h-full min-h-0 w-screen shrink-0 flex-col items-stretch justify-start px-0 pb-1 pt-0 md:px-2 md:pb-2"
                    >
                      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center">
                        <DesktopMenuSpread
                          leftPage={
                            section.left === "brand-cover"
                              ? "brand-cover"
                              : section.left === "brand-endnote"
                                ? "brand-endnote"
                                : menuVirtualSections[section.left]
                          }
                          rightPage={
                            section.right === "brand-back"
                              ? "brand-back"
                              : menuVirtualSections[section.right]
                          }
                          onOpenLeft={() => {
                            if (typeof section.left === "number") {
                              setZoomIndex(section.left);
                            }
                          }}
                          onOpenRight={() => {
                            if (typeof section.right === "number") {
                              setZoomIndex(section.right);
                            }
                          }}
                        />
                        <p className="font-accent mt-2 max-w-md px-2 text-center text-xs leading-relaxed text-pp-black/60 sm:hidden">
                          {typeof section.left === "number"
                            ? menuVirtualSections[section.left].blurb
                            : section.left === "brand-cover"
                              ? "Start met de kaft en blader daarna verder door het menu."
                              : "Kies je locatie, reserveer je tafel en sluit af in stijl."}
                        </p>
                      </div>
                    </div>
                  ))
                : menuVirtualSections.map((section, i) => (
                    <div
                      key={section.src}
                      className="relative flex h-full min-h-0 w-screen shrink-0 flex-col items-stretch justify-start px-2 pb-1 pt-0 sm:px-3 md:px-5 md:pb-2"
                    >
                      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center">
                        <button
                          type="button"
                          onClick={() => setZoomIndex(i)}
                          className="group relative z-[2] min-h-[min(52dvh,440px)] w-[min(98vw,calc(min(82vh,920px)*210/297+1rem))] max-h-[calc(100dvh-11rem)] max-w-none flex-1 overflow-hidden rounded-[0.2rem] border border-pp-olive/10 bg-[#f8f2dd] shadow-[0_12px_28px_rgb(28_56_52/0.06)] outline-none ring-pp-lollypop transition-shadow hover:border-pp-olive/16 hover:shadow-[0_18px_44px_rgb(28_56_52/0.12)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pp-white"
                          aria-label={`${section.label} — tik om te vergroten`}
                        >
                          <Image
                            src={section.src}
                            alt=""
                            fill
                            className="object-contain object-center p-0"
                            sizes="(max-width: 768px) 92vw, min(780px, 55vw)"
                            priority={i < 2}
                          />
                        </button>
                        <p className="font-accent mt-2 max-w-md px-2 text-center text-xs leading-relaxed text-pp-black/60 sm:hidden">
                          {section.blurb}
                        </p>
                      </div>
                    </div>
                  ))}
            </motion.div>

            <div className="shrink-0 border-t border-pp-olive/10 bg-pp-white/85 px-4 py-2 backdrop-blur-sm sm:px-8 md:py-2.5">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-2">
                <p className="font-accent text-center text-[0.62rem] tracking-[0.2em] text-pp-olive/45 uppercase">
                  {menuPageCopy.scrollHint}
                </p>
                <nav
                  className="flex flex-wrap justify-center gap-2"
                  aria-label="Secties van het menu"
                >
                  {menuVirtualSections.map((s, i) => (
                    <button
                      key={s.src}
                      type="button"
                      onClick={() => scrollToSection(i)}
                      className={`font-accent flex h-8 w-8 items-center justify-center rounded-full border text-[0.7rem] leading-none transition-colors ${
                        isDesktop
                          ? !!activeSpread?.active.includes(i)
                            ? "border-pp-christmas/40 bg-pp-christmas/10 text-pp-christmas"
                            : "border-pp-olive/12 text-pp-olive/50 hover:border-pp-olive/25 hover:text-pp-olive"
                          : i === index
                          ? "border-pp-christmas/40 bg-pp-christmas/10 text-pp-christmas"
                          : "border-pp-olive/12 text-pp-olive/50 hover:border-pp-olive/25 hover:text-pp-olive"
                      }`}
                      aria-current={
                        isDesktop
                          ? activeSpread?.active.includes(i)
                            ? "true"
                            : undefined
                          : i === index
                            ? "true"
                            : undefined
                      }
                      aria-label={`Ga naar pagina ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MenuFooter />
      <ZoomModal
        zoomSlide={zoomSlide}
        zoomIndex={zoomIndex}
        count={count}
        zoomTitleId={zoomTitleId}
        closeBtnRef={closeBtnRef}
        onPrev={openPrevZoom}
        onNext={openNextZoom}
        onClose={() => setZoomIndex(null)}
      />
    </div>
  );
}

function MenuPageChrome() {
  return (
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
          href="/groepen"
          className="hidden w-28 text-right font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/45 uppercase transition-colors hover:text-pp-lollypop sm:block"
        >
          Groepen
        </Link>
      </div>
    </header>
  );
}

function MenuFooter() {
  return (
    <footer className="shrink-0 border-t border-pp-olive/10 bg-pp-white px-5 py-8 sm:px-8">
      <p className="font-accent mx-auto max-w-lg text-center text-[0.7rem] leading-relaxed tracking-[0.04em] text-pp-black/45">
        {menuPageCopy.footnote}
      </p>
    </footer>
  );
}

function ZoomModal({
  zoomSlide,
  zoomIndex,
  count,
  zoomTitleId,
  closeBtnRef,
  onPrev,
  onNext,
  onClose,
}: {
  zoomSlide: (typeof menuVirtualSections)[number] | null;
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
      {zoomSlide && zoomIndex !== null ? (
        <motion.div
          key="menu-zoom"
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
              {menuPageCopy.zoomClose} (Esc)
            </button>
          </div>
          <div
            className="flex min-h-0 flex-1 items-center justify-center px-4 pb-10 pt-2 md:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p id={zoomTitleId} className="sr-only">
              {zoomSlide.label} — vergroot
            </p>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="relative max-h-[min(92dvh,920px)] w-full max-w-6xl"
            >
              <Image
                src={zoomSlide.src}
                alt={zoomSlide.label}
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
            Gebruik ook ← en → om tussen pagina&apos;s te gaan
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
