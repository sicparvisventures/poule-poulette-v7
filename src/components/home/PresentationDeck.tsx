"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  type RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  deckSlideAssetFooter,
  deckSlides,
  type DeckSlide,
} from "@/content/deckSlides";
import { heroDeckMarqueePhrases } from "@/content/marqueeBand";

const MD = 768;

function deckImageUnoptimized(src: string) {
  return /\.svg$/i.test(src);
}

function DeckSlideBodyParagraphs({
  slide,
  variant,
}: {
  slide: DeckSlide;
  variant: "mobile" | "desktop";
}) {
  const parts = slide.body.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  const base =
    variant === "mobile"
      ? "font-accent text-base leading-relaxed text-pp-creme/88"
      : "font-accent text-base leading-relaxed text-pp-creme/88 max-w-lg";
  return (
    <>
      {parts.map((part, idx) => (
        <p
          key={idx}
          className={`${base} ${idx === 0 ? (variant === "mobile" ? "mt-4" : "mt-5") : "mt-4"}`}
        >
          {part}
        </p>
      ))}
    </>
  );
}

function DeckSlideSticker({
  src,
  variant,
}: {
  src: string;
  variant: "mobile" | "desktop";
}) {
  const wrap =
    variant === "mobile"
      ? "pointer-events-none absolute -right-2 bottom-44 z-[1] w-[min(46vw,9.5rem)] rotate-[11deg] drop-shadow-[0_12px_28px_rgb(0_0_0/0.35)] sm:bottom-52 sm:w-36"
      : "pointer-events-none absolute -right-1 bottom-[54%] z-[1] w-[min(40vw,11rem)] rotate-[13deg] drop-shadow-[0_14px_36px_rgb(0_0_0/0.4)] md:bottom-[60%] md:-right-2 md:w-[min(36vw,12rem)]";
  return (
    <div className={wrap} aria-hidden>
      <div className="relative aspect-square w-full">
        <Image
          src={src}
          alt=""
          fill
          className="object-contain object-center"
          sizes="(max-width: 768px) 40vw, 200px"
        />
      </div>
    </div>
  );
}

function useDesktopHorizontalDeck() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD}px)`);
    const sync = () => setOk(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return ok;
}

function useViewportWidth() {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const sync = () => setW(window.innerWidth || 1200);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return w;
}

/** Zit half op deze slide, half op de volgende — plakt secties visueel aan elkaar (geen extra scroll-breedte). */
function DeckSlideSeamSticker() {
  const textClass =
    "inline-block text-center font-display text-[0.95rem] italic leading-snug tracking-[0.12em] text-pp-creme uppercase [text-orientation:mixed] [writing-mode:vertical-rl] sm:text-[1.1rem] sm:tracking-[0.14em]";
  const dotClass =
    "inline-block font-display text-[1.6rem] not-italic leading-none text-pp-creme sm:text-[1.85rem]";

  const marqueeColumn = (suffix: string) => (
    <span className={`${textClass} shrink-0`}>
      {heroDeckMarqueePhrases.flatMap((phrase, idx) => [
        idx > 0 ? (
          <span key={`${suffix}-dot-${idx}`} className={dotClass} aria-hidden>
            ●
          </span>
        ) : null,
        <span key={`${suffix}-${phrase}`}>{phrase}</span>,
      ])}
      <span key={`${suffix}-dot-end`} className={dotClass} aria-hidden>
        ●
      </span>
    </span>
  );

  return (
    <div
      className="pointer-events-none absolute top-0 right-0 bottom-0 z-[13] w-[3.25rem] translate-x-1/2 overflow-hidden bg-pp-christmas shadow-[inset_0_0_0_1px_rgb(253_248_193/0.38),3px_0_18px_rgb(0_0_0/0.42)] sm:w-[3.75rem]"
      aria-hidden
      role="presentation"
    >
      <div className="flex h-full items-center justify-center overflow-hidden px-0.5">
        <div className="pp-deck-vertical-marquee-inner">
          {marqueeColumn("a")}
          <span className="inline-block shrink-0" aria-hidden>
            {marqueeColumn("b")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PresentationDeck() {
  const reduceMotion = useReducedMotion();
  const desktop = useDesktopHorizontalDeck();
  const sectionRef = useRef<HTMLElement | null>(null);

  return reduceMotion || !desktop ? (
    <PresentationDeckMobile sectionRef={sectionRef} />
  ) : (
    <PresentationDeckDesktop sectionRef={sectionRef} />
  );
}

function PresentationDeckMobile({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const labelId = useId();
  const slideCount = deckSlides.length;

  return (
    <section
      ref={sectionRef}
      className="bg-pp-white text-pp-black"
      aria-labelledby={labelId}
      id="presentatie"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p
          id={labelId}
          className="font-accent text-sm tracking-[0.25em] text-pp-olive/70 uppercase"
        >
          Ontdek ons verhaal
        </p>
        <h2 className="font-display mt-3 text-3xl text-pp-olive md:text-4xl">
          Welkom in het kippenhok
        </h2>
        <p className="font-accent mt-3 max-w-2xl text-pp-black/70">
          Scroll verder: op mobiel zie je elk hoofdstuk onder elkaar. Op desktop
          schuift hetzelfde verhaal horizontaal mee terwijl je omlaag gaat —
          fun loving food moments, paneel voor paneel.
        </p>
      </div>
      <ol className="flex flex-col gap-0">
        {deckSlides.map((slide, i) => (
          <li
            key={slide.id}
            className="border-t border-pp-olive/10 first:border-t-0"
          >
            {slide.fullBleedImage ? (
              <article aria-label={`Slide ${i + 1} van ${slideCount}`}>
                <div className="relative aspect-16/10 w-full min-h-[min(52vh,480px)] overflow-visible bg-pp-black md:min-h-[min(70vh,560px)]">
                  <Image
                    src={slide.imageSrc}
                    alt=""
                    fill
                    className={`z-0 object-center ${i >= 1 ? "object-cover" : "object-contain"}`}
                    sizes="100vw"
                    priority={i === 0}
                    unoptimized={deckImageUnoptimized(slide.imageSrc)}
                  />
                  {slide.stickerSrc ? (
                    <div className="pointer-events-none absolute inset-0 z-10">
                      <DeckSlideSticker
                        src={slide.stickerSrc}
                        variant="mobile"
                      />
                    </div>
                  ) : null}
                </div>
              </article>
            ) : (
              <article className="grid gap-0 md:grid-cols-2">
                <div className="relative aspect-4/3 w-full md:aspect-auto md:min-h-[min(70vh,520px)]">
                  <Image
                    src={slide.imageSrc}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                    priority={i === 0}
                    unoptimized={deckImageUnoptimized(slide.imageSrc)}
                  />
                </div>
                <div className="relative flex flex-col justify-center overflow-visible bg-pp-olive px-6 py-12 md:px-12">
                  {slide.stickerSrc ? (
                    <DeckSlideSticker src={slide.stickerSrc} variant="mobile" />
                  ) : null}
                  <div className="relative z-10">
                    <p className="font-accent text-xs tracking-[0.3em] text-pp-lollypop/90 uppercase">
                      {slide.kicker}
                    </p>
                    <h3 className="font-display mt-3 text-3xl text-pp-creme">
                      {slide.title}
                    </h3>
                    <DeckSlideBodyParagraphs slide={slide} variant="mobile" />
                    {(() => {
                      const foot = deckSlideAssetFooter(slide);
                      return foot ? (
                        <p className="font-accent mt-6 text-[0.65rem] tracking-[0.18em] text-pp-creme/40 uppercase">
                          {foot}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
              </article>
            )}
          </li>
        ))}
      </ol>
      <p className="sr-only">{slideCount} slides in dit deel</p>
    </section>
  );
}

function PresentationDeckDesktop({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const labelId = useId();
  const vw = useViewportWidth();
  const slideCount = deckSlides.length;
  const maxShift = useMemo(() => (slideCount - 1) * vw, [slideCount, vw]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);
  const x = useSpring(xRaw, {
    stiffness: 120,
    damping: 32,
    mass: 0.35,
  });

  const progressPct = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={sectionRef}
      id="presentatie"
      className="relative bg-pp-black"
      style={{ height: `${slideCount * 100}vh` }}
      aria-labelledby={labelId}
    >
      <div className="sticky top-0 flex h-dvh w-full flex-col overflow-hidden bg-pp-black">
        <header className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex items-start justify-between px-6 pt-6 md:px-10 md:pt-8">
          <div>
            <p
              id={labelId}
              className="font-accent text-[0.65rem] tracking-[0.35em] text-pp-creme/55 uppercase md:text-xs"
            >
              Ontdek ons verhaal — scroll omlaag
            </p>
            <h2 className="font-display mt-2 max-w-md text-2xl text-pp-creme md:text-3xl">
              Welkom in het kippenhok
            </h2>
          </div>
          <DeckProgressIndicator progress={progressPct} count={slideCount} />
        </header>

        <motion.div
          className="flex h-full w-max flex-row will-change-transform"
          style={{ x }}
        >
          {deckSlides.map((slide, i) => {
            /** Rode naad na slide 2 (index 1) uit: vloeiende overgang naar slide 3. */
            const showSeamAfter = i < slideCount - 1 && i !== 1;
            return slide.fullBleedImage ? (
              <article
                key={slide.id}
                className="relative h-full w-screen shrink-0 overflow-visible bg-pp-black"
                aria-label={`Slide ${i + 1} van ${slideCount}`}
              >
                <Image
                  src={slide.imageSrc}
                  alt=""
                  fill
                  className={`z-0 object-center ${i >= 1 ? "object-cover" : "object-contain"}`}
                  sizes="100vw"
                  priority={i === 0}
                  unoptimized={deckImageUnoptimized(slide.imageSrc)}
                />
                {slide.stickerSrc ? (
                  <div className="pointer-events-none absolute inset-0 z-[20]">
                    <DeckSlideSticker
                      src={slide.stickerSrc}
                      variant="desktop"
                    />
                  </div>
                ) : null}
                {showSeamAfter ? <DeckSlideSeamSticker /> : null}
              </article>
            ) : (
              <article
                key={slide.id}
                className="relative flex h-full w-screen shrink-0 flex-col overflow-visible md:flex-row"
                aria-label={`Slide ${i + 1} van ${slideCount}`}
              >
                <div className="relative h-[45%] w-full md:h-full md:w-[52%]">
                  <Image
                    src={slide.imageSrc}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 768px) 52vw, 100vw"
                    priority={i === 0}
                    unoptimized={deckImageUnoptimized(slide.imageSrc)}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-black/50 to-transparent md:bg-linear-to-r md:from-transparent md:to-pp-olive/35"
                    aria-hidden
                  />
                </div>
                <div className="relative flex flex-1 flex-col justify-center overflow-visible bg-pp-olive px-6 py-8 md:w-[48%] md:px-12 md:py-16 lg:px-20">
                  {slide.stickerSrc ? (
                    <DeckSlideSticker src={slide.stickerSrc} variant="desktop" />
                  ) : null}
                  <div className="relative z-10">
                    <p className="font-accent text-xs tracking-[0.32em] text-pp-lollypop/90 uppercase">
                      {slide.kicker}
                    </p>
                    <h3 className="font-display mt-4 text-[clamp(1.85rem,4.2vw,3.25rem)] leading-tight text-pp-creme">
                      {slide.title}
                    </h3>
                    <DeckSlideBodyParagraphs slide={slide} variant="desktop" />
                    {(() => {
                      const foot = deckSlideAssetFooter(slide);
                      return foot ? (
                        <p className="font-accent mt-8 text-[0.65rem] tracking-[0.2em] text-pp-creme/35 uppercase">
                          {foot}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
                {showSeamAfter ? <DeckSlideSeamSticker /> : null}
              </article>
            );
          })}
        </motion.div>

        <div
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-accent text-[0.65rem] tracking-[0.28em] text-pp-creme/40 uppercase"
          aria-hidden
        >
          Verticaal scrollen · horizontaal paneel
        </div>
      </div>
    </section>
  );
}

function DeckProgressIndicator({
  progress,
  count,
}: {
  progress: MotionValue<number>;
  count: number;
}) {
  const [pct, setPct] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setPct(Math.round(v));
  });

  const active = Math.min(
    count - 1,
    Math.max(0, Math.floor((pct / 100) * count)),
  );

  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-pp-creme/20 bg-pp-olive/45 px-3 py-2 backdrop-blur-sm">
      <span className="sr-only">Voortgang door het deck</span>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            i === active ? "bg-pp-lollypop" : "bg-pp-creme/25"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}
