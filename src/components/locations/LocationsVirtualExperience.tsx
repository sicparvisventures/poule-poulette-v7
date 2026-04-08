"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  brandCitiesLine,
  chainLocations,
  googleMapsSearchUrl,
  locationsMarqueePhrases,
  locationsPageCopy,
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

export function LocationsVirtualExperience() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const active = chainLocations[Math.min(index, chainLocations.length - 1)];
  const mapsHref = googleMapsSearchUrl(active.mapsQuery);

  const locationRows = useMemo(
    () =>
      chainLocations.map((loc, i) => ({
        ...loc,
        mapsHref: googleMapsSearchUrl(loc.mapsQuery),
        odd: i % 2 !== 0,
      })),
    [],
  );

  return (
    <div className="flex min-h-dvh flex-col bg-pp-white text-pp-black">
      <LocationsPageChrome />
      <LocationsMarqueeBand />

      <main className="relative flex flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <Image
            src="/images/olive-band-doodle-overlay.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <section className="relative border-b border-pp-olive/12 bg-pp-creme/35 px-5 py-10 sm:px-8 md:py-12">
          <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-stretch">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="border border-pp-olive/14 bg-pp-white/72 p-5"
            >
              <p className="font-accent text-[0.62rem] tracking-[0.3em] text-pp-olive/58 uppercase">
                {locationsPageCopy.kicker}
              </p>
              <h1 className="font-display mt-2 text-3xl text-pp-olive sm:text-4xl">
                Locaties
              </h1>
              <p className="font-accent mt-4 text-sm leading-relaxed text-pp-black/74 sm:text-base">
                {locationsPageCopy.intro}
              </p>
              <p className="font-accent mt-4 text-[0.62rem] tracking-[0.18em] text-pp-black/55 uppercase">
                {brandCitiesLine}
              </p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.44, ease, delay: reduceMotion ? 0 : 0.06 }}
              className="grid border border-pp-olive/14 bg-[#f7f2de] md:grid-cols-[0.44fr_0.56fr]"
            >
              <div className="relative min-h-52 border-b border-pp-olive/12 md:min-h-0 md:border-b-0 md:border-r">
                <Image
                  src={active.imageSrc}
                  alt={active.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 520px"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-black/58 via-pp-black/10 to-transparent" />
                <p className="font-display absolute left-4 bottom-3 text-xl text-pp-creme drop-shadow-sm">
                  {active.city}
                </p>
              </div>
              <div className="flex flex-col p-4">
                <p className="font-display text-xl text-pp-olive">{active.title}</p>
                <p className="font-accent mt-2 text-sm leading-relaxed text-pp-black/74">
                  {active.detailIntro}
                </p>
                <div className="mt-3 border-t border-pp-olive/10 pt-3">
                  {active.addressLines.map((line) => (
                    <p key={line} className="font-accent text-sm text-pp-olive/80">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/locations/${active.id}`}
                    className="font-accent border border-pp-olive bg-pp-olive px-3 py-2 text-[0.62rem] tracking-[0.2em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop/55 hover:text-pp-lollypop"
                  >
                    Detailpagina
                  </Link>
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="font-accent border border-pp-olive/26 bg-pp-white/70 px-3 py-2 text-[0.62rem] tracking-[0.2em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop/45 hover:text-pp-lollypop"
                  >
                    Open maps
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative border-b border-pp-olive/12 bg-pp-white px-5 py-5 sm:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2">
            {chainLocations.map((loc, i) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`font-accent border px-3 py-2 text-[0.62rem] tracking-[0.18em] uppercase transition-colors ${
                  i === index
                    ? "border-pp-christmas/45 bg-pp-christmas/12 text-pp-christmas"
                    : "border-pp-olive/18 bg-pp-white text-pp-olive/72 hover:border-pp-lollypop/42 hover:text-pp-lollypop"
                }`}
                aria-current={i === index ? "true" : undefined}
              >
                {loc.city}
              </button>
            ))}
          </div>
        </section>

        <section className="relative px-5 py-8 sm:px-8 md:py-10" aria-labelledby="locations-list-heading">
          <div className="mx-auto w-full max-w-6xl">
            <h2 id="locations-list-heading" className="sr-only">
              Alle vestigingen
            </h2>
            <div className="flex flex-col border border-pp-olive/12 bg-pp-white">
              {locationRows.map((loc, i) => (
                <motion.article
                  key={loc.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.03, ease }}
                  className={`grid border-t border-pp-olive/12 md:min-h-64 md:grid-cols-[0.44fr_0.56fr] ${
                    i === 0 ? "border-t-0" : ""
                  }`}
                >
                  <div className={`relative min-h-56 border-b border-pp-olive/12 md:min-h-0 ${loc.odd ? "md:order-2 md:border-b-0 md:border-l" : "md:border-b-0 md:border-r"}`}>
                    <Image
                      src={loc.imageSrc}
                      alt={loc.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 520px"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-black/55 via-transparent to-transparent" />
                    <p className="font-display absolute left-4 bottom-3 text-xl text-pp-creme drop-shadow-sm">
                      {loc.city}
                    </p>
                  </div>

                  <div className={`flex flex-col p-4 md:p-5 ${loc.odd ? "md:order-1" : ""}`}>
                    <p className="font-display text-2xl text-pp-olive">{loc.title}</p>
                    <p className="font-accent mt-2 text-sm leading-relaxed text-pp-black/74">
                      {loc.detailIntro}
                    </p>

                    <div className="mt-3 grid gap-3 border-t border-pp-olive/10 pt-3 md:grid-cols-2">
                      <div>
                        <p className="font-accent text-[0.58rem] tracking-[0.2em] text-pp-olive/55 uppercase">
                          Adres
                        </p>
                        {loc.addressLines.map((line) => (
                          <p key={line} className="font-accent mt-1 text-sm text-pp-black/72">
                            {line}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="font-accent text-[0.58rem] tracking-[0.2em] text-pp-olive/55 uppercase">
                          Openingsuren
                        </p>
                        {loc.openingHours?.length ? (
                          <ul className="mt-1 space-y-1">
                            {loc.openingHours.map((h) => (
                              <li key={h} className="font-accent text-sm text-pp-black/72">
                                {h}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="font-accent mt-1 text-sm text-pp-black/62">
                            Uren volgen per vestiging.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/locations/${loc.id}`}
                        className="font-accent border border-pp-olive bg-pp-olive px-3 py-2 text-[0.62rem] tracking-[0.2em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop/55 hover:text-pp-lollypop"
                      >
                        Bekijk vestiging
                      </Link>
                      <a
                        href={loc.mapsHref}
                        target="_blank"
                        rel="noreferrer"
                        className="font-accent border border-pp-olive/26 bg-pp-white px-3 py-2 text-[0.62rem] tracking-[0.2em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop/45 hover:text-pp-lollypop"
                      >
                        Open in maps
                      </a>
                      {loc.telHref ? (
                        <a
                          href={loc.telHref}
                          className="font-accent border border-pp-olive/22 bg-pp-creme/45 px-3 py-2 text-[0.62rem] tracking-[0.2em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop/45 hover:text-pp-lollypop"
                        >
                          Bel
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-pp-olive/10 bg-pp-white px-5 py-8 sm:px-8">
        <p className="font-accent mx-auto max-w-lg text-center text-[0.7rem] leading-relaxed tracking-[0.04em] text-pp-black/45">
          {locationsPageCopy.footnote}
        </p>
        <p className="font-accent mt-4 text-center text-sm text-pp-olive/70">
          © Poule &amp; Poulette — België
        </p>
      </footer>
    </div>
  );
}
