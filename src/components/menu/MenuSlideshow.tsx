"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  menuPageCopy,
  menuSlides,
} from "@/content/menuSlides";

const ease = [0.22, 1, 0.36, 1] as const;

/** Zachte focus 0–1 voor subtiele schaal (geen 3D-carrousel). */
function smoothFocus(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function MenuSlideshow() {
  const labelId = useId();
  const zoomTitleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const count = menuSlides.length;
  const rafRef = useRef<number>(0);
  const lastIndexRef = useRef(-1);

  const scrollToIndex = useCallback((i: number, behavior?: ScrollBehavior) => {
    const el = slideRefs.current[Math.max(0, Math.min(count - 1, i))];
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const b =
      behavior ?? (prefersReduced ? ("auto" as ScrollBehavior) : "smooth");
    el?.scrollIntoView({
      behavior: b,
      inline: "center",
      block: "nearest",
    });
  }, [count]);

  const go = useCallback(
    (dir: -1 | 1) => {
      scrollToIndex(index + dir);
    },
    [index, scrollToIndex],
  );

  const handleCardActivate = useCallback(
    (i: number) => {
      if (i === index) setZoomIndex(i);
      else scrollToIndex(i);
    },
    [index, scrollToIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoomIndex !== null) {
        if (e.key === "Escape") setZoomIndex(null);
        return;
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, zoomIndex]);

  useEffect(() => {
    if (zoomIndex === null) return;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomIndex]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tick = () => {
      const rootRect = root.getBoundingClientRect();
      const midX = rootRect.left + rootRect.width / 2;
      const halfW = Math.max(rootRect.width * 0.45, 180);

      let best = 0;
      let bestDist = Infinity;

      slideRefs.current.forEach((slot, i) => {
        const inner = innerRefs.current[i];
        if (!slot || !inner) return;

        const r = slot.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const distPx = cx - midX;
        const d = Math.min(1, Math.abs(distPx) / halfW);
        const focus = smoothFocus(1 - d);

        if (Math.abs(distPx) < bestDist) {
          bestDist = Math.abs(distPx);
          best = i;
        }

        if (prefersReduced) {
          inner.style.transform = "";
          inner.style.opacity = "1";
          slot.style.zIndex = "1";
          return;
        }

        const scale = 0.94 + focus * 0.06;
        const opacity = 0.78 + focus * 0.22;

        inner.style.transform = `scale(${scale})`;
        inner.style.opacity = String(opacity);
        slot.style.zIndex = String(5 + Math.round(focus * 15));
      });

      if (best !== lastIndexRef.current) {
        lastIndexRef.current = best;
        setIndex(best);
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        tick();
      });
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    tick();

    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  const zoomSlide =
    zoomIndex !== null ? menuSlides[zoomIndex] : null;

  return (
    <div className="flex min-h-dvh flex-col bg-pp-white text-pp-black">
      <header className="shrink-0 border-b border-pp-white/10 bg-linear-to-b from-pp-olive to-[#152a26] px-5 py-5 text-pp-creme sm:px-8">
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
          <span className="hidden w-24 text-right font-accent text-[0.58rem] tracking-[0.28em] text-pp-creme/45 uppercase sm:block">
            Menu
          </span>
        </div>
      </header>

      <section
        className="shrink-0 border-b border-pp-olive/10 bg-pp-creme/35 px-5 py-10 sm:px-8 md:py-12"
        aria-labelledby={labelId}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-accent text-xs tracking-[0.32em] text-pp-olive/60 uppercase sm:text-sm">
            {menuPageCopy.kicker}
          </p>
          <h1
            id={labelId}
            className="font-display mt-3 text-3xl text-pp-olive md:text-4xl"
          >
            {menuPageCopy.title}
          </h1>
          <p className="font-accent mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-pp-black/72 md:text-base">
            {menuPageCopy.intro}
          </p>
        </div>
      </section>

      <div
        className="flex min-h-0 flex-1 flex-col bg-pp-white"
        role="region"
        aria-roledescription="carrousel"
        aria-labelledby={labelId}
      >
        <div className="relative flex min-h-[52vh] flex-1 flex-col border-b border-pp-olive/8 bg-pp-white">
          <p
            className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-center font-accent text-[0.62rem] tracking-[0.22em] text-pp-olive/40 uppercase"
            aria-hidden
          >
            {menuPageCopy.scrollHint}
          </p>

          <div
            ref={scrollRef}
            className="menu-strip-scroll flex min-h-0 flex-1 snap-x snap-mandatory flex-row items-center gap-0 overflow-x-auto scroll-px-6 py-10 pl-6 pr-6 [scrollbar-color:rgba(28_56_52/0.2)_transparent] [scrollbar-width:thin] md:scroll-px-12 md:py-12 md:pl-12 md:pr-12 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-pp-olive/25 [&::-webkit-scrollbar-track]:bg-transparent"
            tabIndex={0}
            aria-label="Menu-pagina’s horizontaal scrollen"
          >
            {menuSlides.map((slide, i) => (
              <div
                key={slide.src}
                ref={(node) => {
                  slideRefs.current[i] = node;
                }}
                className="relative flex h-[min(72vh,760px)] w-[calc(min(72vh,760px)*210/297+clamp(2rem,5vw,3.5rem))] shrink-0 snap-center items-center justify-center"
              >
                <div
                  ref={(node) => {
                    innerRefs.current[i] = node;
                  }}
                  className="relative h-[min(72vh,760px)] w-[calc(min(72vh,760px)*210/297)] origin-center will-change-transform"
                >
                  <button
                    type="button"
                    onClick={() => handleCardActivate(i)}
                    className={`relative h-full w-full overflow-hidden rounded-sm border border-pp-olive/12 bg-pp-white shadow-[0_12px_40px_rgb(0_0_0/0.08)] outline-none ring-pp-lollypop transition-shadow focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pp-white ${
                      i === index
                        ? "cursor-zoom-in hover:border-pp-olive/25 hover:shadow-[0_16px_48px_rgb(0_0_0/0.12)]"
                        : "cursor-pointer hover:border-pp-olive/20"
                    }`}
                    aria-label={
                      i === index
                        ? `${slide.label} — tik om te vergroten`
                        : `${slide.label} — tik om naar deze pagina te gaan`
                    }
                  >
                    <Image
                      src={slide.src}
                      alt=""
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 768px) 80vw, min(760px, 50vw)"
                      priority={i < 2}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="shrink-0 border-t border-pp-olive/10 bg-pp-white px-5 py-8 sm:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
            <div className="flex w-full flex-wrap items-center justify-center gap-x-12 gap-y-4">
              <button
                type="button"
                onClick={() => go(-1)}
                className="font-accent text-sm tracking-[0.22em] text-pp-olive uppercase underline decoration-pp-olive/25 underline-offset-10 transition-colors hover:text-pp-christmas hover:decoration-pp-christmas/40"
              >
                Vorige
              </button>
              <p className="font-accent text-xs tracking-[0.2em] text-pp-black/45 uppercase">
                Pagina {index + 1} / {count}
              </p>
              <button
                type="button"
                onClick={() => go(1)}
                className="font-accent text-sm tracking-[0.22em] text-pp-olive uppercase underline decoration-pp-olive/25 underline-offset-10 transition-colors hover:text-pp-christmas hover:decoration-pp-christmas/40"
              >
                Volgende
              </button>
            </div>

            <nav
              className="flex max-w-full flex-wrap justify-center gap-x-1 gap-y-2"
              aria-label="Ga naar menu-pagina"
            >
              {menuSlides.map((s, i) => (
                <span key={s.src} className="inline-flex items-center">
                  {i > 0 ? (
                    <span
                      className="mx-1 text-pp-olive/20"
                      aria-hidden
                    >
                      ·
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => scrollToIndex(i)}
                    className={`font-accent min-w-8 px-1.5 py-1 text-xs tabular-nums transition-colors ${
                      i === index
                        ? "text-pp-christmas"
                        : "text-pp-olive/40 hover:text-pp-olive"
                    }`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    {i + 1}
                  </button>
                </span>
              ))}
            </nav>

            <p className="font-accent max-w-lg text-center text-[0.7rem] leading-relaxed tracking-[0.04em] text-pp-black/45">
              {menuPageCopy.footnote}
            </p>
          </div>
        </footer>
      </div>

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
            onClick={() => setZoomIndex(null)}
          >
            <div className="flex shrink-0 items-center justify-end px-4 py-4 md:px-8">
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setZoomIndex(null)}
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
              Tik buiten het beeld om te sluiten
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
