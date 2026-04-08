"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import { FixedPageIntroStrip } from "@/components/FixedPageIntroStrip";
import {
  brandCitiesLine,
  chainLocations,
  googleMapsEmbedSrc,
  googleMapsSearchUrl,
  locationsMarqueePhrases,
  locationsPageCopy,
  officialLocationsUrl,
  type ChainLocation,
} from "@/content/locations";

const ease = [0.22, 1, 0.36, 1] as const;

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

/** Eerste mozaïektegel: lichte “splash”, linkt naar de officiële locatielijst. */
function LocationsSplashTile() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between gap-2 overflow-hidden bg-[#fbf8ec] p-3 text-center sm:p-4">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <Image
          src="/images/olive-band-doodle-overlay.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="200px"
        />
      </div>
      <div className="relative z-[2] flex min-h-0 w-full flex-1 flex-col items-center justify-center">
        <p className="font-accent text-[0.5rem] tracking-[0.28em] text-pp-olive/55 uppercase sm:text-[0.55rem]">
          {locationsPageCopy.kicker}
        </p>
        <p className="mt-1 font-display text-lg leading-tight text-pp-olive sm:text-xl">
          {locationsPageCopy.splashTitle}
        </p>
        <div className="relative mt-2 aspect-square w-[min(4.5rem,38%)] shrink-0 sm:mt-3 sm:w-[min(5.25rem,42%)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.98] drop-shadow-[0_6px_18px_rgb(28_56_52/0.14)]"
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
        <p className="mt-2 line-clamp-3 max-w-[11rem] font-accent text-[0.55rem] leading-snug tracking-[0.08em] text-pp-olive/55 uppercase sm:max-w-[13rem] sm:text-[0.58rem]">
          {brandCitiesLine}
        </p>
        <p className="mt-2 line-clamp-4 max-w-[13rem] font-accent text-[0.58rem] leading-relaxed tracking-[0.04em] text-pp-black/62 sm:line-clamp-3 sm:text-[0.62rem]">
          {locationsPageCopy.splashLine}
        </p>
      </div>
      <a
        href={officialLocationsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-[2] shrink-0 rounded-sm border border-pp-olive/20 bg-pp-white/90 px-3 py-1.5 font-accent text-[0.55rem] tracking-[0.18em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop/50 hover:text-pp-lollypop sm:text-[0.58rem]"
      >
        poulepoulette.com/locaties
      </a>
    </div>
  );
}

export function LocationsVirtualExperience() {
  const reduceMotion = useReducedMotion();
  const labelId = useId();
  const zoomTitleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [showLocationsNote, setShowLocationsNote] = useState(true);

  const count = chainLocations.length;
  const activeLoc = chainLocations[Math.min(index, count - 1)];
  const detailSnippet = activeLoc.detailIntro;
  const detailSnippetShort =
    detailSnippet.length > 120 ? `${detailSnippet.slice(0, 120)}…` : detailSnippet;

  const scrollTileIntoView = useCallback(
    (locIdx: number) => {
      const el = tileRefs.current[locIdx];
      el?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "nearest",
      });
    },
    [reduceMotion],
  );

  const scrollToSection = useCallback(
    (locIdx: number) => {
      const clamped = Math.max(0, Math.min(count - 1, locIdx));
      setIndex(clamped);
      requestAnimationFrame(() => scrollTileIntoView(clamped));
    },
    [count, scrollTileIntoView],
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
        scrollToSection(Math.min(count - 1, index + 1));
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
    count,
    scrollToSection,
    openPrevZoom,
    openNextZoom,
  ]);

  useEffect(() => {
    if (zoomIndex !== null) setIndex(zoomIndex);
  }, [zoomIndex]);

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

  const stickerWrapClass =
    "pointer-events-none absolute z-20 drop-shadow-[0_12px_28px_rgb(0_0_0/0.2)]";

  return (
    <div className="flex min-h-dvh flex-col bg-pp-white text-pp-black">
      <LocationsPageChrome />
      <LocationsMarqueeBand />

      <div className="relative flex min-h-0 flex-1 flex-col bg-linear-to-b from-pp-white via-pp-creme/15 to-pp-white">
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

        {reduceMotion ? (
          <>
            <div
              className={`${stickerWrapClass} bottom-[14%] left-[2%] w-[clamp(4.25rem,15vw,7rem)] md:left-[4%]`}
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
            </div>
            <div
              className={`${stickerWrapClass} top-[20%] right-[1%] w-[clamp(4.5rem,16vw,7.5rem)] md:right-[3%]`}
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
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
              className={`${stickerWrapClass} bottom-[14%] left-[2%] w-[clamp(4.25rem,15vw,7rem)] md:left-[4%]`}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.05 }}
              className={`${stickerWrapClass} top-[20%] right-[1%] w-[clamp(4.5rem,16vw,7.5rem)] md:right-[3%]`}
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
          </>
        )}

        {showLocationsNote ? (
          <FixedPageIntroStrip
            labelId={labelId}
            title={locationsPageCopy.title}
            introBar={locationsPageCopy.introBar}
            reduceMotion={reduceMotion}
            onDismiss={() => setShowLocationsNote(false)}
          />
        ) : null}

        <div
          className={`relative z-10 flex min-h-0 flex-1 flex-col ${showLocationsNote ? "pt-[3.25rem] sm:pt-12" : ""}`}
        >
          <div className="shrink-0 px-4 pb-0 pt-1 sm:px-5 md:pt-1">
            <div className="mx-auto max-w-3xl">
              <WavyConnector compact />
              <div className="flex items-end justify-between gap-3 pt-0.5 md:gap-4">
                <div className="min-w-0">
                  <p className="font-accent text-[0.65rem] tracking-[0.3em] text-pp-olive/50 uppercase">
                    Mozaïek
                  </p>
                  <p className="font-display mt-1 truncate text-xl text-pp-olive md:text-2xl">
                    {activeLoc.city} — {activeLoc.title}
                  </p>
                </div>
                <p className="font-accent hidden max-w-xs text-right text-xs leading-relaxed text-pp-black/55 sm:block">
                  {detailSnippetShort}
                </p>
              </div>
              <p className="font-accent mt-2 text-center text-xs leading-relaxed text-pp-black/60 sm:hidden">
                Tik op een tegel om te vergroten · nummers hieronder scrollen naar
                die vestiging.
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2 pt-1 sm:px-4 md:px-5">
            <div className="mx-auto w-full max-w-5xl">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-3">
                <div className="aspect-square overflow-hidden rounded-lg border border-pp-olive/10 bg-[#f4f0e6] shadow-[0_10px_28px_rgb(28_56_52/0.07)]">
                  <LocationsSplashTile />
                </div>
                {chainLocations.map((loc, i) => (
                  <button
                    key={loc.id}
                    type="button"
                    ref={(el) => {
                      tileRefs.current[i] = el;
                    }}
                    onClick={() => {
                      setIndex(i);
                      setZoomIndex(i);
                    }}
                    className={`group relative aspect-square overflow-hidden rounded-lg border border-pp-olive/12 bg-[#ebe6dc] text-left shadow-[0_8px_24px_rgb(28_56_52/0.06)] outline-none transition-[box-shadow,border-color] hover:border-pp-olive/22 hover:shadow-[0_14px_36px_rgb(28_56_52/0.1)] focus-visible:ring-2 focus-visible:ring-pp-lollypop focus-visible:ring-offset-2 focus-visible:ring-offset-pp-white ${
                      i === index
                        ? "ring-2 ring-pp-christmas/45 ring-offset-2 ring-offset-pp-white"
                        : ""
                    }`}
                    aria-label={`${loc.city} — tik om te vergroten`}
                  >
                    <Image
                      src={loc.imageSrc}
                      alt=""
                      fill
                      className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 45vw, 180px"
                      priority={i < 2}
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-pp-black/75 via-pp-black/12 to-transparent px-2 pb-3 pt-12 sm:px-3 sm:pb-3.5 sm:pt-14">
                      <p className="font-accent text-[0.5rem] tracking-[0.22em] text-pp-creme/85 uppercase sm:text-[0.55rem]">
                        {loc.city}
                      </p>
                      <p className="font-display mt-0.5 line-clamp-2 text-sm leading-tight text-pp-creme drop-shadow-md sm:text-base">
                        {loc.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

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
                      i === index
                        ? "border-pp-christmas/40 bg-pp-christmas/10 text-pp-christmas"
                        : "border-pp-olive/12 text-pp-olive/50 hover:border-pp-olive/25 hover:text-pp-olive"
                    }`}
                    aria-current={i === index ? "true" : undefined}
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
  const hours = location?.openingHours;

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
        className="fixed inset-0 z-200 flex items-end justify-center bg-pp-black/88 p-0 backdrop-blur-sm sm:items-center sm:p-3 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease }}
          className="flex max-h-[min(92dvh,720px)] w-full max-w-4xl flex-col overflow-hidden rounded-t-lg border border-pp-white/12 bg-pp-olive shadow-[0_24px_80px_rgb(0_0_0/0.45)] sm:rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-pp-white/10 px-2.5 py-1.5 sm:px-4 sm:py-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={onPrev}
                disabled={zoomIndex === 0}
                className="font-accent rounded-sm px-2 py-1 text-[0.6rem] tracking-[0.16em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop disabled:cursor-not-allowed disabled:text-pp-creme/30 sm:px-2.5 sm:py-1.5 sm:text-[0.62rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
              >
                ← Vorige
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={zoomIndex === count - 1}
                className="font-accent rounded-sm px-2 py-1 text-[0.6rem] tracking-[0.16em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop disabled:cursor-not-allowed disabled:text-pp-creme/30 sm:px-2.5 sm:py-1.5 sm:text-[0.62rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
              >
                Volgende →
              </button>
              <span className="hidden font-accent text-[0.55rem] tracking-[0.14em] text-pp-creme/40 uppercase sm:inline">
                Esc · ← →
              </span>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="font-accent shrink-0 rounded-sm px-2.5 py-1 text-[0.6rem] tracking-[0.16em] text-pp-creme uppercase transition-colors hover:text-pp-lollypop sm:px-3 sm:py-1.5 sm:text-[0.62rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-lollypop"
            >
              {locationsPageCopy.zoomClose}
            </button>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
            <p id={zoomTitleId} className="sr-only">
              {location.city} — vestiging
            </p>

            <div className="relative h-[min(26dvh,200px)] w-full shrink-0 md:h-auto md:min-h-0 md:w-[min(34%,280px)] md:max-w-[300px]">
              <Image
                src={location.imageSrc}
                alt={location.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-black/55 via-transparent to-pp-black/10"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-3.5">
                <p className="font-accent text-[0.52rem] tracking-[0.28em] text-pp-creme/85 uppercase sm:text-[0.55rem]">
                  {location.city}
                </p>
                <p className="font-display mt-0.5 line-clamp-2 text-base leading-tight text-pp-creme drop-shadow-md sm:text-lg">
                  {location.title}
                </p>
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain border-pp-white/10 px-3 py-3 md:border-l md:px-5 md:py-4">
              <div>
                <p className="font-accent text-[0.55rem] tracking-[0.26em] text-pp-creme/50 uppercase">
                  Over deze vestiging
                </p>
                <p className="font-accent mt-1.5 text-sm leading-relaxed text-pp-creme/90">
                  {location.detailIntro}
                </p>
              </div>

              <div className="rounded-sm border border-pp-white/12 bg-pp-black/25 p-3 md:p-3.5">
                <p className="font-accent text-[0.55rem] tracking-[0.26em] text-pp-lollypop/90 uppercase">
                  Adres
                </p>
                <address className="mt-1.5 not-italic">
                  <ul className="space-y-0.5 font-accent text-sm leading-relaxed text-pp-creme/88">
                    {location.addressLines.map((line, li) => (
                      <li key={`${li}-${line.slice(0, 40)}`}>{line}</li>
                    ))}
                  </ul>
                </address>
                {hours && hours.length > 0 ? (
                  <div className="mt-3 border-t border-pp-white/10 pt-3">
                    <p className="font-accent text-[0.55rem] tracking-[0.26em] text-pp-creme/50 uppercase">
                      Openingsuren
                    </p>
                    <ul className="mt-1.5 space-y-0.5 font-accent text-xs leading-relaxed text-pp-creme/82 sm:text-sm">
                      {hours.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {(hasTel || hasMail) ? (
                  <ul className="mt-3 space-y-1.5 border-t border-pp-white/10 pt-3 font-accent text-sm text-pp-creme/90">
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
                  <p className="mt-2 font-accent text-xs text-pp-creme/50">
                    Telefoon en e-mail: zie poulepoulette.com voor deze vestiging.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <a
                  href={mapsOpen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-creme/35 bg-pp-creme/10 px-3 py-2 text-center text-[0.58rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop/60 hover:bg-pp-lollypop/15 hover:text-pp-lollypop"
                >
                  Google Maps
                </a>
                <Link
                  href="/#reserve"
                  className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-lollypop/50 bg-pp-lollypop/20 px-3 py-2 text-center text-[0.58rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:bg-pp-lollypop/30"
                >
                  Reserveren
                </Link>
                <Link
                  href={`/locations/${location.id}`}
                  className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-white/20 px-3 py-2 text-center text-[0.58rem] tracking-[0.18em] text-pp-creme/90 uppercase transition-colors hover:border-pp-white/40 hover:text-pp-creme"
                >
                  Volledige pagina
                </Link>
                <a
                  href={officialLocationsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-white/15 px-3 py-2 text-center text-[0.58rem] tracking-[0.18em] text-pp-creme/80 uppercase transition-colors hover:border-pp-white/35 hover:text-pp-creme"
                >
                  Officiële site
                </a>
              </div>

              <div className="overflow-hidden rounded-sm border border-pp-white/12 bg-pp-black/20 shadow-inner">
                <p className="border-b border-pp-white/10 px-2.5 py-1.5 font-accent text-[0.52rem] tracking-[0.22em] text-pp-creme/55 uppercase">
                  Kaart
                </p>
                <iframe
                  title={`Kaart: ${location.city}`}
                  src={mapsEmbed}
                  className="h-[140px] w-full bg-pp-white/5 sm:h-[160px] md:h-[180px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
