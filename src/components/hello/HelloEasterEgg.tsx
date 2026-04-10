"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const PP_BRAND_URL = "https://poulepoulette.com";

const SCREEN_COUNT = 4;

/** Titels, labels, UI: Lino Stamp, altijd caps (leesbaar). */
function TitleCaps({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-accent uppercase tracking-[0.2em] ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

/** Doorlopende tekst: Bacon Kingdom — geen é/è/ë (glyph ontbreekt in font). */
function Body({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag className={`font-display ${className}`.trim()}>{children}</Tag>
  );
}

function GameCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-pp-olive/20 bg-pp-white shadow-[4px_4px_0_rgb(28_56_52/0.18)] ${className}`.trim()}
    >
      {children}
    </div>
  );
}

function CoopPhoneChrome({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-[min(260px,min(85vw,calc(72dvh_*_9_/_19.4)))] shrink-0 rounded-[2.35rem] bg-pp-black p-[9px] shadow-[0_32px_64px_rgb(0_0_0/0.22),0_0_0_1px_rgb(255_255_255/0.06)_inset] ${className}`.trim()}
    >
      <div className="pointer-events-none absolute left-1/2 top-[11px] z-20 h-[22px] w-[32%] max-w-[118px] -translate-x-1/2 rounded-full bg-pp-black shadow-[inset_0_-2px_6px_rgb(0_0_0/0.45)]" />
      <div className="relative aspect-[9/19.4] w-full overflow-hidden rounded-[1.9rem] bg-pp-white ring-1 ring-pp-olive/10">
        {children}
      </div>
    </div>
  );
}

function ScreenHome() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-pp-white">
      <div className="shrink-0 px-4 pb-2 pt-9">
        <TitleCaps className="text-[0.55rem] text-pp-lollypop">
          Poule &amp; poulette
        </TitleCaps>
        <TitleCaps
          as="h2"
          className="mt-2 block text-[0.95rem] leading-snug text-pp-olive sm:text-[1.05rem]"
        >
          The coop
        </TitleCaps>
      </div>
      <div className="shrink-0 px-4">
        <GameCard className="p-4">
          <TitleCaps className="text-[0.5rem] text-pp-olive/55">Jouw nuggets</TitleCaps>
          <Body as="p" className="mt-1 text-[2.35rem] leading-none text-pp-olive">
            2&nbsp;420
          </Body>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-pp-olive/10">
            <div className="h-full w-[68%] rounded-full bg-pp-lollypop" />
          </div>
          <TitleCaps className="mt-2 block text-[0.45rem] text-pp-olive/45">
            Nog 580 tot volgende tier
          </TitleCaps>
        </GameCard>
      </div>
      <div className="mt-3 flex shrink-0 gap-2 px-4">
        <GameCard className="flex flex-1 flex-col items-center py-3">
          <span className="text-lg leading-none" aria-hidden>
            🥚
          </span>
          <TitleCaps className="mt-1.5 text-[0.45rem] text-pp-olive/70">
            Ei van de dag
          </TitleCaps>
        </GameCard>
        <GameCard className="flex flex-1 flex-col items-center py-3">
          <span className="text-lg leading-none" aria-hidden>
            🐣
          </span>
          <TitleCaps className="mt-1.5 text-[0.45rem] text-pp-olive/70">
            Chick streak
          </TitleCaps>
        </GameCard>
      </div>
      <div className="mt-auto flex shrink-0 justify-around border-t border-pp-olive/8 bg-pp-white px-1 py-2.5">
        <TitleCaps className="text-[0.45rem] text-pp-lollypop">Home</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Rewards</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Nest</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Visit</TitleCaps>
      </div>
    </div>
  );
}

function ScreenRewards() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-pp-white">
      <div className="shrink-0 px-4 pb-2 pt-9">
        <TitleCaps className="text-[0.55rem] text-pp-olive/50">Inwisselen</TitleCaps>
        <TitleCaps as="h2" className="mt-2 block text-[1.05rem] text-pp-olive">
          Rewards
        </TitleCaps>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-4 pb-4">
        {[
          { t: "Gratis drank", cost: "800", ok: true },
          { t: "Side upgrade", cost: "1 200", ok: false },
          { t: "Birthday treat", cost: "2 000", ok: false },
        ].map((row) => (
          <GameCard key={row.t} className="flex items-center justify-between gap-2 p-3">
            <div className="min-w-0">
              <Body as="p" className="truncate text-base text-pp-olive">
                {row.t}
              </Body>
              <TitleCaps className="text-[0.45rem] text-pp-olive/45">
                {row.cost} nuggets
              </TitleCaps>
            </div>
            <span
              className={`shrink-0 rounded-lg border-2 px-2 py-1 font-accent text-[0.5rem] uppercase tracking-wider ${
                row.ok
                  ? "border-pp-lollypop bg-pp-lollypop/15 text-pp-olive"
                  : "border-pp-olive/20 text-pp-olive/35"
              }`}
            >
              {row.ok ? "Claim" : "Lock"}
            </span>
          </GameCard>
        ))}
      </div>
      <div className="mt-auto flex shrink-0 justify-around border-t border-pp-olive/8 px-1 py-2.5">
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Home</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-lollypop">Rewards</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Nest</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Visit</TitleCaps>
      </div>
    </div>
  );
}

function ScreenNest() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-linear-to-b from-pp-creme/80 to-pp-white">
      <div className="shrink-0 px-4 pb-2 pt-9">
        <TitleCaps className="text-[0.55rem] text-pp-olive/50">Jouw nest</TitleCaps>
        <TitleCaps as="h2" className="mt-2 block text-[1rem] leading-snug text-pp-olive">
          Streak &amp; eggs
        </TitleCaps>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <GameCard className="flex w-full max-w-[220px] flex-col items-center py-6">
          <div className="flex gap-2">
            {["🥚", "🥚", "🐣", "·", "·"].map((c, i) => (
              <span
                key={i}
                className={`text-2xl ${i >= 3 ? "opacity-25" : ""}`}
                aria-hidden
              >
                {c}
              </span>
            ))}
          </div>
          <TitleCaps className="mt-4 text-[0.5rem] text-pp-olive/55">Week roster</TitleCaps>
          <Body as="p" className="mt-2 text-3xl text-pp-christmas">
            12
          </Body>
          <TitleCaps className="text-[0.45rem] text-pp-olive/45">Dagen op rij</TitleCaps>
        </GameCard>
      </div>
      <div className="mt-auto flex shrink-0 justify-around border-t border-pp-olive/8 bg-pp-white/90 px-1 py-2.5">
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Home</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Rewards</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-lollypop">Nest</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Visit</TitleCaps>
      </div>
    </div>
  );
}

function ScreenVisit() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-pp-white">
      <div className="shrink-0 px-4 pb-2 pt-9">
        <TitleCaps className="text-[0.55rem] text-pp-olive/50">In restaurant</TitleCaps>
        <TitleCaps as="h2" className="mt-2 block text-[1.05rem] text-pp-olive">
          Check in
        </TitleCaps>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <GameCard className="flex aspect-square w-full max-w-[200px] flex-col items-center justify-center p-4">
          <div className="grid grid-cols-8 gap-0.5 opacity-90">
            {Array.from({ length: 64 }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-[1px] ${
                  [10, 11, 18, 27, 28, 35, 36, 37, 44, 45, 53].includes(i)
                    ? "bg-pp-olive"
                    : "bg-pp-olive/12"
                }`}
              />
            ))}
          </div>
          <TitleCaps className="mt-4 text-[0.45rem] text-pp-olive/45">
            Scan aan de toonbank
          </TitleCaps>
        </GameCard>
      </div>
      <div className="shrink-0 px-4 pb-4">
        <div className="rounded-xl border-2 border-dashed border-pp-lollypop/40 bg-pp-lollypop/5 py-3 text-center">
          <TitleCaps className="text-[0.5rem] text-pp-olive/60">
            Nuggets na elke visit
          </TitleCaps>
        </div>
      </div>
      <div className="mt-auto flex shrink-0 justify-around border-t border-pp-olive/8 px-1 py-2.5">
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Home</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Rewards</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-olive/40">Nest</TitleCaps>
        <TitleCaps className="text-[0.45rem] text-pp-lollypop">Visit</TitleCaps>
      </div>
    </div>
  );
}

const SCREENS = [
  { id: "home", label: "Home", node: <ScreenHome /> },
  { id: "rewards", label: "Rewards", node: <ScreenRewards /> },
  { id: "nest", label: "Nest", node: <ScreenNest /> },
  { id: "visit", label: "Visit", node: <ScreenVisit /> },
] as const;

function CoopScreenCarousel({
  index,
  reduceMotion,
}: {
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={SCREENS[index].id}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {SCREENS[index].node}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MiniScreenPreview({ screenIndex }: { screenIndex: number }) {
  const inner = [
    <ScreenHome key="h" />,
    <ScreenRewards key="r" />,
    <ScreenNest key="n" />,
    <ScreenVisit key="v" />,
  ][screenIndex];
  return (
    <div className="relative mx-auto h-[172px] w-[106px] overflow-hidden rounded-[1.25rem] border-2 border-pp-olive/15 bg-pp-white shadow-sm">
      <div className="pointer-events-none absolute left-0 top-0 origin-top-left scale-[0.33125]">
        <div className="h-[568px] w-[320px]">{inner}</div>
      </div>
    </div>
  );
}

export function HelloEasterEgg() {
  const reduceMotion = useReducedMotion();
  const rm = !!reduceMotion;
  const [slide, setSlide] = useState(0);

  const next = useCallback(
    () => setSlide((s) => (s + 1) % SCREEN_COUNT),
    [],
  );
  const prev = useCallback(
    () => setSlide((s) => (s - 1 + SCREEN_COUNT) % SCREEN_COUNT),
    [],
  );

  useEffect(() => {
    if (rm) return;
    const id = window.setInterval(next, 5200);
    return () => window.clearInterval(id);
  }, [rm, next]);

  return (
    <div className="relative min-h-dvh bg-pp-white text-pp-olive">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgb(28_56_52/0.07),transparent_55%)]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-pp-olive/6 bg-pp-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:py-5">
          <div>
            <TitleCaps className="text-[0.58rem] text-pp-lollypop">
              Binnenkort beschikbaar
            </TitleCaps>
            <TitleCaps
              as="p"
              className="mt-2 block text-lg tracking-[0.24em] text-pp-olive sm:text-xl"
            >
              The coop
            </TitleCaps>
          </div>
          <Link
            href="/"
            className="shrink-0 font-accent text-[0.58rem] tracking-[0.28em] text-pp-olive/55 uppercase underline-offset-4 transition-colors hover:text-pp-lollypop"
          >
            Terug
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 md:pt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-10 lg:gap-y-8 lg:pt-14 xl:gap-x-14">
        <div className="min-w-0">
          <TitleCaps className="text-[0.62rem] text-pp-olive/45">
            Loyalty app · poule &amp; poulette
          </TitleCaps>
          <TitleCaps
            as="h1"
            className="mt-4 block max-w-3xl text-balance text-[clamp(1.15rem,3.8vw,1.85rem)] leading-snug text-pp-olive"
          >
            Spaar nuggets. Claim rewards. Blijf in het nest.
          </TitleCaps>
          <Body className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-pp-olive/80 sm:text-lg">
            The Coop is de loyalty-app van Poule &amp; Poulette voor gasten in Belgie: per visit
            nuggets, duidelijke rewards, een nest dat meegroeit met jouw routine, en check-in in
            het restaurant. Wat je hier ziet is hoe de app eruit ziet — niet een kopie van de site,
            wel dezelfde olijf, crème en lollypop. Strak, mobiel eerst, klaar voor de App Store en
            Google Play.
          </Body>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3 lg:max-w-none lg:grid-cols-1 xl:grid-cols-3">
            {[
              [
                "Nuggets",
                "Al je punten op een kaart. Altijd zichtbaar na een visit.",
              ],
              [
                "Rewards",
                "Inwisselen in twee tikken. Lock en claim zijn meteen duidelijk.",
              ],
              [
                "Nest & visit",
                "Streaks, eieren in je roster, en scan aan de toonbank.",
              ],
            ].map(([t, b]) => (
              <li key={t}>
                <GameCard className="h-full p-4">
                  <TitleCaps className="text-[0.5rem] text-pp-lollypop">{t}</TitleCaps>
                  <Body className="mt-2 text-sm leading-snug text-pp-olive/85">
                    {b}
                  </Body>
                </GameCard>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={PP_BRAND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-pp-olive px-8 py-3.5 font-accent text-[0.65rem] tracking-[0.2em] text-pp-creme uppercase shadow-[0_4px_0_rgb(28_56_52/0.35)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Poulepoulette.com
            </a>
            <Link
              href="/locations"
              className="inline-flex items-center justify-center rounded-full border-2 border-pp-olive/20 bg-transparent px-8 py-3.5 font-accent text-[0.65rem] tracking-[0.2em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
            >
              Alle locaties
            </Link>
          </div>
          <TitleCaps className="mt-4 block text-[0.5rem] text-pp-olive/40">
            App store &amp; google play — registratie volgt
          </TitleCaps>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[300px] sm:mt-12 lg:mx-0 lg:mt-0 lg:w-auto lg:max-w-none lg:justify-self-end lg:self-start">
          <TitleCaps className="mb-3 block text-center text-[0.55rem] text-pp-olive/45 lg:text-right">
            App preview
          </TitleCaps>
          <CoopPhoneChrome>
            <CoopScreenCarousel index={slide} reduceMotion={rm} />
          </CoopPhoneChrome>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-pp-olive/15 px-3 py-1.5 font-accent text-[0.55rem] tracking-[0.15em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
            >
              Vorige
            </button>
            <div className="flex gap-1.5">
              {SCREENS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={s.label}
                  onClick={() => setSlide(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === slide
                      ? "bg-pp-lollypop shadow-[0_0_10px_rgb(244_149_189/0.65)]"
                      : "bg-pp-olive/15 hover:bg-pp-olive/30"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="rounded-full border border-pp-olive/15 px-3 py-1.5 font-accent text-[0.55rem] tracking-[0.15em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
            >
              Volgende
            </button>
          </div>
        </div>

        <section className="col-span-full mt-16 border-t border-pp-olive/8 pt-12 sm:mt-20 sm:pt-16">
          <TitleCaps className="text-[0.6rem] text-pp-lollypop">Schermen</TitleCaps>
          <TitleCaps
            as="h2"
            className="mt-3 block max-w-2xl text-xl leading-snug text-pp-olive sm:text-2xl"
          >
            Vier flows. Een merk.
          </TitleCaps>
          <Body className="mt-3 max-w-2xl text-sm leading-relaxed text-pp-olive/75 sm:text-base">
            Home, rewards, nest en visit delen dezelfde typografie en kleuren — klaar voor iOS,
            met het gevoel van een lichte 2D game.
          </Body>
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 md:justify-center [&::-webkit-scrollbar]:hidden">
            {SCREENS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlide(i)}
                className={`w-[140px] shrink-0 snap-center sm:w-[160px] ${
                  i === slide ? "ring-2 ring-pp-lollypop ring-offset-2 ring-offset-pp-white" : ""
                } rounded-2xl transition-shadow`}
              >
                <MiniScreenPreview screenIndex={i} />
                <TitleCaps className="mt-2 block text-center text-[0.5rem] text-pp-olive/50">
                  {s.label}
                </TitleCaps>
              </button>
            ))}
          </div>
        </section>

        <section className="col-span-full mt-14 sm:mt-16">
          <TitleCaps className="text-[0.6rem] text-pp-lollypop">Detail</TitleCaps>
          <TitleCaps
            as="h2"
            className="mt-3 block text-xl text-pp-olive sm:text-2xl"
          >
            Pixel-perfect ui
          </TitleCaps>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <GameCard className="overflow-hidden p-0">
              <div className="bg-pp-creme/90 px-4 py-8 text-center">
                <Body as="p" className="text-5xl text-pp-olive">
                  2 420
                </Body>
                <TitleCaps className="mt-2 text-[0.5rem] text-pp-olive/50">
                  Nugget counter
                </TitleCaps>
              </div>
              <div className="border-t-2 border-pp-olive/10 px-3 py-2">
                <TitleCaps className="text-[0.45rem] text-pp-olive/40">Ui fragment</TitleCaps>
              </div>
            </GameCard>
            <GameCard className="overflow-hidden p-0">
              <div className="flex flex-col items-center bg-linear-to-b from-pp-lollypop/25 to-pp-white px-4 py-8">
                <span className="text-5xl" aria-hidden>
                  🐔
                </span>
                <TitleCaps className="mt-3 text-[0.5rem] text-pp-olive/55">Tier</TitleCaps>
                <TitleCaps className="mt-2 block text-[0.85rem] text-pp-olive">Gold hen</TitleCaps>
              </div>
              <div className="border-t-2 border-pp-olive/10 px-3 py-2">
                <TitleCaps className="text-[0.45rem] text-pp-olive/40">Cosmetic</TitleCaps>
              </div>
            </GameCard>
            <GameCard className="relative overflow-hidden p-0">
              <div className="flex items-center justify-center px-4 py-6">
                <div className="flex gap-1.5 text-3xl opacity-90" aria-hidden>
                  🥚🥚🐣
                </div>
              </div>
              <div className="border-t-2 border-pp-olive/10 bg-pp-creme/50 px-3 py-3">
                <TitleCaps className="text-[0.45rem] text-pp-olive/45">Week roster</TitleCaps>
                <Body as="p" className="mt-1 text-lg text-pp-christmas">
                  12 dagen
                </Body>
              </div>
              <div className="pointer-events-none absolute bottom-2 right-2 w-14 opacity-40 sm:w-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/chicken_walk.gif"
                  alt=""
                  className="h-auto w-full object-contain"
                />
              </div>
            </GameCard>
          </div>
        </section>
      </main>

      <div className="relative z-10 border-t border-pp-olive/6 bg-pp-white py-6 text-center">
        <TitleCaps className="text-[0.5rem] text-pp-olive/35">
          The coop · preview
        </TitleCaps>
      </div>
    </div>
  );
}
