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
import {
  brandCitiesLine,
  chainLocations,
  googleMapsEmbedSrc,
  googleMapsSearchUrl,
  locationsMarqueePhrases,
  locationsPageCopy,
  type ChainLocation,
} from "@/content/locations";

const ease = [0.22, 1, 0.36, 1] as const;

const DESKTOP_LOCATION_SPREADS = [
  { left: "brand-cover" as const, right: 0, active: [0] as number[] },
  { left: 1, right: 2, active: [1, 2] as number[] },
  { left: 3, right: 4, active: [3, 4] as number[] },
  { left: 5, right: 6, active: [5, 6] as number[] },
] as const;

function LocationsMarqueeBand() {
  const segment = `${locationsMarqueePhrases.join(" · ")} · `;
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

function renderLocationsBrandCover() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#fbf8ec] px-8 text-center">
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
          Poule &amp; Poulette
        </p>
        <p className="mt-2 text-balance font-display text-[clamp(1.65rem,2.8vw,2.35rem)] leading-[0.95] tracking-[0.02em] text-pp-olive">
          Belgische vestigingen
        </p>
        <div className="relative mt-5 aspect-square w-[min(11rem,42%)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.98] drop-shadow-[0_8px_26px_rgb(28_56_52/0.16)]"
            style={{
              backgroundColor: "#1c3834",
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
        <p className="mt-5 max-w-[18rem] font-accent text-[0.62rem] leading-relaxed tracking-[0.12em] text-pp-olive/52 uppercase">
          {brandCitiesLine}
        </p>
        <p className="mt-3 max-w-[17rem] font-accent text-[0.65rem] leading-relaxed tracking-[0.06em] text-pp-olive/58">
          Zelfde merk, lokale aanwezigheid — blader verder en zoom in op elke stad.
        </p>
      </div>
    </div>
  );
}

function DesktopLocationSpread({
  leftPage,
  rightPage,
  onOpenLeft,
  onOpenRight,
}: {
  leftPage: ChainLocation | "brand-cover";
  rightPage: ChainLocation;
  onOpenLeft: () => void;
  onOpenRight: () => void;
}) {
  return (
    <div className="relative z-[2] flex min-h-0 w-[min(90vw,1120px)] max-w-full flex-1 flex-col">
      <div className="pointer-events-none absolute inset-0 rounded-[1.2rem] bg-linear-to-b from-pp-white/40 via-transparent to-pp-olive/6 blur-xl" />
      <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[1rem] border border-pp-olive/10 bg-[#f4f0e6] shadow-[0_24px_70px_rgb(28_56_52/0.12)]">
        <button
          type="button"
          onClick={onOpenLeft}
          className="group/page relative h-full w-1/2 overflow-hidden bg-[#ebe6dc] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pp-lollypop"
          aria-label={
            leftPage === "brand-cover"
              ? "Introductie vestigingen"
              : `${leftPage.city} — openen in zoom`
          }
        >
          {leftPage === "brand-cover" ? (
            renderLocationsBrandCover()
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={leftPage.imageSrc}
                alt={leftPage.imageAlt}
                fill
                className="object-cover object-center transition-transform duration-300 ease-out group-hover/page:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, 560px"
                priority
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-pp-black/65 via-pp-black/25 to-transparent px-4 pb-5 pt-16 text-left">
                <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/75 uppercase">
                  {leftPage.city}
                </p>
                <p className="font-display mt-1 text-lg text-pp-creme drop-shadow-md md:text-xl">
                  {leftPage.title}
                </p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-2 bg-linear-to-l from-pp-black/5 to-transparent" />
        </button>

        <button
          type="button"
          onClick={onOpenRight}
          className="group/page relative h-full w-1/2 overflow-hidden bg-[#ebe6dc] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pp-lollypop"
          aria-label={`${rightPage.city} — openen in zoom`}
        >
          <div className="relative h-full w-full">
            <Image
              src={rightPage.imageSrc}
              alt={rightPage.imageAlt}
              fill
              className="object-cover object-center transition-transform duration-300 ease-out group-hover/page:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, 560px"
              priority
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-pp-black/65 via-pp-black/25 to-transparent px-4 pb-5 pt-16 text-left">
              <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/75 uppercase">
                {rightPage.city}
              </p>
              <p className="font-display mt-1 text-lg text-pp-creme drop-shadow-md md:text-xl">
                {rightPage.title}
              </p>
            </div>
          </div>
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

export function LocationsVirtualExperience() {
  const reduceMotion = useReducedMotion();
  const labelId = useId();
  const zoomTitleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showLocationsNote, setShowLocationsNote] = useState(true);

  const count = chainLocations.length;
  const displayCount = isDesktop ? DESKTOP_LOCATION_SPREADS.length : count;
  const slideStepVw = 100;
  const activeSpread = isDesktop
    ? DESKTOP_LOCATION_SPREADS[Math.min(index, DESKTOP_LOCATION_SPREADS.length - 1)]
    : null;

  const activeLoc = chainLocations[Math.min(index, count - 1)];

  const { scrollYProgress } = useScroll({
    target: scrollRootRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `${-(displayCount - 1) * slideStepVw}vw`],
  );

  const stickerY1 = useTransform(scrollYProgress, [0, 1], [0, -44]);
  const stickerRot1 = useTransform(scrollYProgress, [0, 1], [-8, -14]);
  const stickerY2 = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const stickerRot2 = useTransform(scrollYProgress, [0, 1], [12, 5]);

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
    (locIdx: number) => {
      const el = scrollRootRef.current;
      if (!el) return;
      const targetIndex = isDesktop
        ? Math.max(
            0,
            DESKTOP_LOCATION_SPREADS.findIndex((s) => s.active.includes(locIdx)),
          )
        : locIdx;
      const max = Math.max(0, displayCount - 1);
      const t = max <= 0 ? 0 : Math.max(0, Math.min(1, targetIndex / max));
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

  const scrollToDisplayIndex = useCallback(
    (displayIdx: number) => {
      const el = scrollRootRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(displayCount - 1, displayIdx));
      const max = Math.max(0, displayCount - 1);
      const t = max <= 0 ? 0 : clamped / max;
      const rect = el.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const range = Math.max(0, el.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: start + t * range,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [displayCount, reduceMotion],
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
        scrollToDisplayIndex(Math.min(displayCount - 1, index + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        scrollToDisplayIndex(Math.max(0, index - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    zoomIndex,
    index,
    displayCount,
    scrollToDisplayIndex,
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

  const zoomLoc = zoomIndex !== null ? chainLocations[zoomIndex] : null;

  if (reduceMotion) {
    return (
      <div className="flex min-h-dvh flex-col bg-pp-white text-pp-black">
        <LocationsPageChrome />
        <LocationsMarqueeBand />
        {showLocationsNote ? (
          <StickyLocationsNote
            labelId={labelId}
            onDismiss={() => setShowLocationsNote(false)}
          />
        ) : null}
        <div className="flex flex-col">
          {chainLocations.map((loc, i) => (
            <article
              key={loc.id}
              className="border-b border-pp-olive/10 bg-pp-white"
            >
              <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
                <p className="font-accent text-xs tracking-[0.28em] text-pp-olive/55 uppercase">
                  {loc.city}
                </p>
                <h2 className="font-display mt-2 text-2xl text-pp-olive">
                  {loc.title}
                </h2>
                <p className="font-accent mt-3 text-sm leading-relaxed text-pp-black/70">
                  {loc.detailIntro}
                </p>
                <WavyConnector />
                <button
                  type="button"
                  onClick={() => setZoomIndex(i)}
                  className="relative mx-auto mt-6 block w-full max-w-md overflow-hidden rounded-sm border border-pp-olive/12 bg-pp-olive/5 shadow-[0_12px_40px_rgb(0_0_0/0.08)] outline-none ring-pp-lollypop focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <span className="sr-only">{loc.city} — vergroten</span>
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={loc.imageSrc}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 520px"
                      priority={i < 2}
                    />
                  </div>
                </button>
                <p className="mt-4 text-center">
                  <Link
                    href={`/locations/${loc.id}`}
                    className="font-accent text-xs tracking-[0.2em] text-pp-olive/70 uppercase underline-offset-4 transition-colors hover:text-pp-lollypop"
                  >
                    Naar locatiepagina
                  </Link>
                </p>
              </div>
              {i < chainLocations.length - 1 ? (
                <div className="flex items-center justify-center gap-3 bg-linear-to-r from-pp-olive/8 via-pp-lollypop/15 to-pp-olive/8 py-4">
                  <span className="h-px flex-1 max-w-16 bg-pp-olive/20" />
                  <span className="font-accent text-[0.65rem] tracking-[0.24em] text-pp-olive/60 uppercase">
                    Volgende stad
                  </span>
                  <span className="h-px flex-1 max-w-16 bg-pp-olive/20" />
                </div>
              ) : null}
            </article>
          ))}
        </div>
        <LocationsFooter />
        <LocationZoomModal
          location={zoomLoc}
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
      <LocationsPageChrome />
      <LocationsMarqueeBand />

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
            className="pointer-events-none absolute bottom-[14%] left-[2%] z-20 w-[clamp(4.25rem,15vw,7rem)] drop-shadow-[0_12px_28px_rgb(0_0_0/0.2)] md:left-[4%]"
            aria-hidden
          >
            <Image
              src="/images/doodle_clean_upscaled.png"
              alt=""
              width={220}
              height={220}
              className="h-auto w-full object-contain opacity-[0.92]"
              sizes="(max-width: 768px) 110px, 180px"
            />
          </motion.div>
          <motion.div
            style={{ y: stickerY2, rotate: stickerRot2 }}
            className="pointer-events-none absolute top-[20%] right-[1%] z-20 w-[clamp(4.5rem,16vw,7.5rem)] drop-shadow-[0_12px_28px_rgb(0_0_0/0.18)] md:right-[3%]"
            aria-hidden
          >
            <Image
              src="/images/ChatGPT Image 7 apr 2026, 23_06_50.png"
              alt=""
              width={200}
              height={200}
              className="h-auto w-full object-contain"
              sizes="(max-width: 768px) 120px, 200px"
            />
          </motion.div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            {showLocationsNote ? (
              <div className="shrink-0 px-3 pt-1.5 sm:px-4 md:px-5">
                <StickyLocationsNote
                  labelId={labelId}
                  compact
                  onDismiss={() => setShowLocationsNote(false)}
                />
              </div>
            ) : null}

            <div className="shrink-0 px-4 pb-0 pt-1 sm:px-5 md:pt-1">
              <div className="mx-auto max-w-3xl">
                <WavyConnector compact />
                <div className="flex items-end justify-between gap-3 pt-0.5 md:gap-4">
                  <div className="min-w-0">
                    <p className="font-accent text-[0.65rem] tracking-[0.3em] text-pp-olive/50 uppercase">
                      {isDesktop && activeSpread
                        ? activeSpread.left === "brand-cover"
                          ? "Start"
                          : chainLocations[activeSpread.left]?.city
                        : activeLoc?.city}
                    </p>
                    <p className="font-display mt-1 truncate text-xl text-pp-olive md:text-2xl">
                      {isDesktop && activeSpread
                        ? activeSpread.left === "brand-cover"
                          ? `Intro · ${chainLocations[activeSpread.right]?.city}`
                          : `${chainLocations[activeSpread.left]?.title} / ${chainLocations[activeSpread.right]?.title}`
                        : activeLoc?.title}
                    </p>
                  </div>
                  <p className="font-accent hidden max-w-xs text-right text-xs leading-relaxed text-pp-black/55 sm:block">
                    {isDesktop && activeSpread
                      ? activeSpread.left === "brand-cover"
                        ? "Welkom bij de rondreis langs al onze Belgische plekken — elke stad heeft haar eigen sfeer."
                        : (() => {
                            const t =
                              chainLocations[activeSpread.left]?.detailIntro ??
                              "";
                            return t.length > 120 ? `${t.slice(0, 120)}…` : t;
                          })()
                      : activeLoc?.detailIntro}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              className="flex min-h-0 min-w-0 flex-1 flex-row items-stretch"
              style={{ x }}
            >
              {isDesktop
                ? DESKTOP_LOCATION_SPREADS.map((spread) => (
                    <div
                      key={`${spread.left}-${spread.right}`}
                      className="relative flex h-full min-h-0 w-screen shrink-0 flex-col items-stretch justify-start px-0 pb-1 pt-0 md:px-2 md:pb-2"
                    >
                      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center">
                      <DesktopLocationSpread
                        leftPage={
                          spread.left === "brand-cover"
                            ? "brand-cover"
                            : chainLocations[spread.left]
                        }
                        rightPage={chainLocations[spread.right]}
                        onOpenLeft={() => {
                          if (spread.left !== "brand-cover") {
                            setZoomIndex(spread.left);
                          }
                        }}
                        onOpenRight={() => setZoomIndex(spread.right)}
                      />
                      <p className="font-accent mt-2 max-w-md px-2 text-center text-xs leading-relaxed text-pp-black/60 sm:hidden">
                        {spread.left === "brand-cover"
                          ? "Scroll verder voor meer steden — tik op een foto om te vergroten."
                          : `${chainLocations[spread.left]?.city} en ${chainLocations[spread.right]?.city} — tik op een helft om in te zoomen.`}
                      </p>
                      </div>
                    </div>
                  ))
                : chainLocations.map((loc, i) => (
                    <div
                      key={loc.id}
                      className="relative flex h-full min-h-0 w-screen shrink-0 flex-col items-stretch justify-start px-2 pb-1 pt-0 sm:px-3 md:px-4 md:pb-2"
                    >
                      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-stretch">
                      <button
                        type="button"
                        onClick={() => setZoomIndex(i)}
                        className="group relative z-[2] min-h-[min(52dvh,420px)] w-[min(96vw,28rem)] max-h-[calc(100dvh-11rem)] flex-1 overflow-hidden rounded-[0.35rem] border border-pp-olive/12 bg-[#ebe6dc] shadow-[0_12px_28px_rgb(28_56_52/0.08)] outline-none ring-pp-lollypop transition-shadow hover:border-pp-olive/18 hover:shadow-[0_18px_44px_rgb(28_56_52/0.12)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pp-white"
                        aria-label={`${loc.city} — tik om te vergroten`}
                      >
                        <Image
                          src={loc.imageSrc}
                          alt=""
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 92vw, 448px"
                          priority={i < 2}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-pp-black/70 via-pp-black/2 to-transparent px-4 pb-6 pt-20 text-left">
                          <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/75 uppercase">
                            {loc.city}
                          </p>
                          <p className="font-display mt-1 text-xl text-pp-creme drop-shadow-md">
                            {loc.title}
                          </p>
                        </div>
                      </button>
                      <p className="font-accent mt-2 max-w-md px-2 text-center text-xs leading-relaxed text-pp-black/60 sm:hidden">
                        {loc.detailIntro}
                      </p>
                      </div>
                    </div>
                  ))}
            </motion.div>

            <div className="shrink-0 border-t border-pp-olive/10 bg-pp-white/85 px-4 py-2 backdrop-blur-sm sm:px-8 md:py-2.5">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-2">
                <p className="font-accent text-center text-[0.62rem] tracking-[0.2em] text-pp-olive/45 uppercase">
                  {locationsPageCopy.scrollHint}
                </p>
                <nav
                  className="flex flex-wrap justify-center gap-2"
                  aria-label="Vestigingen"
                >
                  {chainLocations.map((loc, i) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => scrollToSection(i)}
                      className={`font-accent flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[0.65rem] leading-none transition-colors ${
                        isDesktop
                          ? activeSpread?.active.includes(i)
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
                      aria-label={`Ga naar ${loc.city}`}
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

      <LocationsFooter />
      <LocationZoomModal
        location={zoomLoc}
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

function LocationsPageChrome() {
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
          href="/menu"
          className="hidden w-24 text-right font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/45 uppercase transition-colors hover:text-pp-lollypop sm:block"
        >
          Menu
        </Link>
      </div>
    </header>
  );
}

function StickyLocationsNote({
  labelId,
  onDismiss,
  compact = false,
}: {
  labelId: string;
  onDismiss: () => void;
  compact?: boolean;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease }}
      className={`mx-auto flex w-full items-start justify-between gap-2 rounded-sm border border-pp-olive/10 bg-pp-white/88 backdrop-blur-sm ${
        compact ? "max-w-3xl px-2.5 py-1.5" : "max-w-4xl px-4 py-3"
      }`}
    >
      <div className="min-w-0">
        <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-olive/48 uppercase">
          {locationsPageCopy.kicker}
        </p>
        <p
          id={labelId}
          className={`font-display text-pp-olive ${
            compact ? "mt-1 text-lg md:text-xl" : "mt-1 text-2xl md:text-3xl"
          }`}
        >
          {locationsPageCopy.title}
        </p>
        <p
          className={`font-accent max-w-2xl leading-relaxed text-pp-black/68 ${
            compact ? "mt-1 text-xs md:text-sm" : "mt-2 text-sm md:text-base"
          }`}
        >
          {locationsPageCopy.intro}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="font-accent shrink-0 rounded-sm border border-pp-olive/10 px-2.5 py-1.5 text-[0.58rem] tracking-[0.2em] text-pp-olive/58 uppercase transition-colors hover:border-pp-lollypop/40 hover:text-pp-lollypop"
        aria-label="Verberg uitleg"
      >
        Sluit
      </button>
    </motion.aside>
  );
}

function LocationsFooter() {
  return (
    <footer className="shrink-0 border-t border-pp-olive/10 bg-pp-white px-5 py-8 sm:px-8">
      <p className="font-accent mx-auto max-w-lg text-center text-[0.7rem] leading-relaxed tracking-[0.04em] text-pp-black/45">
        {locationsPageCopy.footnote}
      </p>
      <p className="font-accent mt-4 text-center text-sm text-pp-olive/70">
        © Poule &amp; Poulette — België
      </p>
    </footer>
  );
}

function LocationZoomModal({
  location,
  zoomIndex,
  count,
  zoomTitleId,
  closeBtnRef,
  onPrev,
  onNext,
  onClose,
}: {
  location: ChainLocation | null;
  zoomIndex: number | null;
  count: number;
  zoomTitleId: string;
  closeBtnRef: RefObject<HTMLButtonElement | null>;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const mapsOpen = location
    ? googleMapsSearchUrl(location.mapsQuery)
    : "";
  const mapsEmbed = location
    ? googleMapsEmbedSrc(location.mapsQuery)
    : "";
  const hasTel = Boolean(location?.tel && location?.telHref);
  const hasMail = Boolean(location?.mail);

  return (
    <AnimatePresence>
      {location && zoomIndex !== null ? (
      <motion.div
        key={`locations-zoom-${location.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={zoomTitleId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease }}
        className="fixed inset-0 z-200 flex flex-col bg-pp-olive/97 backdrop-blur-md md:bg-pp-black/92"
        onClick={onClose}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-2 border-b border-pp-white/10 px-3 py-2.5 md:px-6 md:py-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={zoomIndex === 0}
              className="font-accent rounded-sm px-2.5 py-1.5 text-[0.65rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop disabled:cursor-not-allowed disabled:text-pp-creme/30 md:px-3 md:py-2 md:text-xs md:tracking-[0.2em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
            >
              ← Vorige
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={zoomIndex === count - 1}
              className="font-accent rounded-sm px-2.5 py-1.5 text-[0.65rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop disabled:cursor-not-allowed disabled:text-pp-creme/30 md:px-3 md:py-2 md:text-xs md:tracking-[0.2em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
            >
              Volgende →
            </button>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="font-accent shrink-0 rounded-sm px-3 py-1.5 text-[0.65rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop md:px-4 md:py-2 md:text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
          >
            {locationsPageCopy.zoomClose}
          </button>
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden md:flex-row md:overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <p id={zoomTitleId} className="sr-only">
            {location.city} — vestiging
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease }}
            className="relative shrink-0 md:sticky md:top-0 md:flex md:h-full md:min-h-0 md:w-[min(42%,480px)] md:max-w-[520px]"
          >
            <div className="relative aspect-[5/4] w-full sm:aspect-[16/10] md:aspect-auto md:h-full md:min-h-[200px]">
              <Image
                src={location.imageSrc}
                alt={location.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 520px"
                priority
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-black/50 via-transparent to-pp-black/10"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="font-accent text-[0.58rem] tracking-[0.3em] text-pp-creme/85 uppercase">
                  {location.city}
                </p>
                <p className="font-display mt-1 text-xl text-pp-creme drop-shadow-md md:text-2xl">
                  {location.title}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex min-w-0 flex-1 flex-col gap-5 border-pp-white/10 px-4 py-5 md:border-l md:px-8 md:py-8">
            <div>
              <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/50 uppercase">
                Over deze vestiging
              </p>
              <p className="font-accent mt-2 text-sm leading-relaxed text-pp-creme/88 md:text-base">
                {location.detailIntro}
              </p>
            </div>

            <div className="rounded-sm border border-pp-white/12 bg-pp-black/25 p-4 md:p-5">
              <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-lollypop/90 uppercase">
                Adres &amp; praktisch
              </p>
              <address className="mt-2 not-italic">
                <ul className="space-y-1 font-accent text-sm leading-relaxed text-pp-creme/85 md:text-[0.95rem]">
                  {location.addressLines.map((line, li) => (
                    <li key={`${li}-${line.slice(0, 40)}`}>{line}</li>
                  ))}
                </ul>
              </address>
              {(hasTel || hasMail) ? (
                <ul className="mt-4 space-y-2 border-t border-pp-white/10 pt-4 font-accent text-sm text-pp-creme/90">
                  {hasTel ? (
                    <li>
                      <span className="text-pp-creme/55">Tel </span>
                      <a
                        href={location.telHref}
                        className="text-pp-lollypop underline-offset-2 transition-colors hover:text-pp-creme"
                      >
                        {location.tel}
                      </a>
                    </li>
                  ) : null}
                  {hasMail ? (
                    <li>
                      <span className="text-pp-creme/55">Mail </span>
                      <a
                        href={`mailto:${location.mail}`}
                        className="break-all text-pp-lollypop underline-offset-2 transition-colors hover:text-pp-creme"
                      >
                        {location.mail}
                      </a>
                    </li>
                  ) : null}
                </ul>
              ) : (
                <p className="mt-3 font-accent text-xs text-pp-creme/50">
                  Telefoon en e-mail worden per vestiging geüpdatet.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <a
                href={mapsOpen}
                target="_blank"
                rel="noopener noreferrer"
                className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-creme/35 bg-pp-creme/10 px-4 py-2.5 text-center text-[0.62rem] tracking-[0.2em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop/60 hover:bg-pp-lollypop/15 hover:text-pp-lollypop"
              >
                Open in Google Maps
              </a>
              <Link
                href="/#reserve"
                className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-lollypop/50 bg-pp-lollypop/20 px-4 py-2.5 text-center text-[0.62rem] tracking-[0.2em] text-pp-creme uppercase transition-colors hover:bg-pp-lollypop/30"
              >
                Reserveren
              </Link>
              <Link
                href={`/locations/${location.id}`}
                className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-white/20 px-4 py-2.5 text-center text-[0.62rem] tracking-[0.2em] text-pp-creme/90 uppercase transition-colors hover:border-pp-white/40 hover:text-pp-creme"
              >
                Volledige pagina
              </Link>
            </div>

            <div className="overflow-hidden rounded-sm border border-pp-white/12 bg-pp-black/20 shadow-inner">
              <p className="border-b border-pp-white/10 px-3 py-2 font-accent text-[0.55rem] tracking-[0.24em] text-pp-creme/55 uppercase">
                Locatie op de kaart
              </p>
              <iframe
                title={`Kaart: ${location.city}`}
                src={mapsEmbed}
                className="h-[200px] w-full bg-pp-white/5 md:h-[260px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <p
          className="pointer-events-none shrink-0 border-t border-pp-white/10 py-2 text-center font-accent text-[0.58rem] tracking-[0.18em] text-pp-creme/45 uppercase md:py-2.5"
          aria-hidden
        >
          Esc sluiten · ← → andere vestiging
        </p>
      </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
