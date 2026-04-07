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
import { deckSlides } from "@/content/deckSlides";

const MD = 768;

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
          Presentatie
        </p>
        <h2 className="font-display mt-3 text-3xl text-pp-olive md:text-4xl">
          Slide per slide
        </h2>
        <p className="font-accent mt-3 max-w-2xl text-pp-black/70">
          Op dit scherm scroll je verticaal door dezelfde slides. Op desktop
          schuift het deck horizontaal mee met je scroll (zoals bij o.a.{" "}
          <a
            href="https://taqueriarico.com"
            className="text-pp-christmas underline decoration-pp-christmas/40 underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Taqueria Rico
          </a>
          ).
        </p>
      </div>
      <ol className="flex flex-col gap-0">
        {deckSlides.map((slide, i) => (
          <li
            key={slide.id}
            className="border-t border-pp-olive/10 first:border-t-0"
          >
            <article className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-4/3 w-full md:aspect-auto md:min-h-[min(70vh,520px)]">
                <Image
                  src={slide.imageSrc}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
              <div className="flex flex-col justify-center bg-pp-white px-6 py-12 md:px-12">
                <p className="font-accent text-xs tracking-[0.3em] text-pp-olive/60 uppercase">
                  {slide.kicker}
                </p>
                <h3 className="font-display mt-3 text-3xl text-pp-olive">
                  {slide.title}
                </h3>
                <p className="font-accent mt-4 text-base leading-relaxed text-pp-black/75">
                  {slide.body}
                </p>
              </div>
            </article>
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
              Presentatie — scroll omlaag
            </p>
            <h2 className="font-display mt-2 max-w-md text-2xl text-pp-creme md:text-3xl">
              Prezi-achtig deck
            </h2>
          </div>
          <DeckProgressIndicator progress={progressPct} count={slideCount} />
        </header>

        <motion.div
          className="flex h-full w-max flex-row will-change-transform"
          style={{ x }}
        >
          {deckSlides.map((slide, i) => (
            <article
              key={slide.id}
              className="relative flex h-full w-screen shrink-0 flex-col md:flex-row"
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
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-black/50 to-transparent md:bg-linear-to-r md:from-transparent md:to-pp-black/25"
                  aria-hidden
                />
              </div>
              <div className="flex flex-1 flex-col justify-center bg-pp-black px-6 py-8 md:w-[48%] md:px-12 md:py-16 lg:px-20">
                <p className="font-accent text-xs tracking-[0.32em] text-pp-lollypop/90 uppercase">
                  {slide.kicker}
                </p>
                <h3 className="font-display mt-4 text-[clamp(1.85rem,4.2vw,3.25rem)] leading-tight text-pp-creme">
                  {slide.title}
                </h3>
                <p className="font-accent mt-5 max-w-lg text-base leading-relaxed text-pp-white/78">
                  {slide.body}
                </p>
                <p className="font-accent mt-8 text-[0.65rem] tracking-[0.2em] text-pp-creme/35 uppercase">
                  Placeholder beeld — vervang in /public/placeholders/deck/
                </p>
              </div>
            </article>
          ))}
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
    <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-pp-creme/15 bg-pp-black/40 px-3 py-2 backdrop-blur-sm">
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
