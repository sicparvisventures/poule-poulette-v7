"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  officialLocationsUrl,
  type ChainLocation,
} from "@/content/locations";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = { location: ChainLocation };

export function LocationDetailView({ location }: Props) {
  const reduceMotion = useReducedMotion();
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`;
  const hasTel = Boolean(location.tel && location.telHref);
  const hasMail = Boolean(location.mail);
  const hours = location.openingHours;

  return (
    <div className="flex min-h-dvh flex-col bg-pp-black text-pp-white">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease } }}
        className="sticky top-0 z-20 border-b border-pp-white/10 bg-pp-olive/95 px-4 py-4 backdrop-blur-md sm:px-6"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link
            href="/locations"
            className="font-accent shrink-0 text-[0.58rem] tracking-[0.24em] text-pp-creme/85 uppercase underline-offset-4 transition-colors hover:text-pp-lollypop"
          >
            ← Alle locaties
          </Link>
          <p className="font-display truncate text-center text-sm text-pp-creme sm:text-base">
            {location.city}
          </p>
          <Link
            href="/"
            className="font-accent hidden shrink-0 text-[0.58rem] tracking-[0.2em] text-pp-creme/55 uppercase transition-colors hover:text-pp-creme sm:inline"
          >
            Home
          </Link>
        </div>
      </motion.header>

      <div className="relative mx-auto w-full max-w-3xl flex-1 sm:max-w-none sm:px-6 sm:py-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.99 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease },
          }}
          className="overflow-hidden rounded-none border-pp-olive/20 bg-pp-white text-pp-black shadow-[0_24px_80px_rgb(0_0_0/0.35)] sm:rounded-sm sm:border sm:ring-1 sm:ring-pp-black/5"
        >
          <div className="relative aspect-16/10 w-full bg-pp-olive/10 sm:aspect-21/9">
            <Image
              src={location.imageSrc}
              alt={location.imageAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 896px"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-black/55 via-transparent to-pp-black/15"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <p className="font-accent text-[0.6rem] tracking-[0.35em] text-pp-creme/90 uppercase">
                Poule &amp; Poulette
              </p>
              <h1 className="font-display mt-2 text-3xl text-pp-creme md:text-4xl">
                {location.city}
              </h1>
            </div>
          </div>

          <div className="space-y-6 px-5 py-8 sm:px-10 sm:py-10">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.08, duration: 0.45, ease },
              }}
              className="font-accent text-base leading-relaxed text-pp-black/80"
            >
              {location.detailIntro}
            </motion.p>

            <div className="h-px bg-pp-olive/12" aria-hidden />

            <div>
              <h2 className="font-accent text-[0.65rem] tracking-[0.28em] text-pp-olive/70 uppercase">
                Adres
              </h2>
              <address className="font-accent mt-3 not-italic text-base leading-relaxed text-pp-black/85">
                {location.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            {hours && hours.length > 0 ? (
              <div>
                <h2 className="font-accent text-[0.65rem] tracking-[0.28em] text-pp-olive/70 uppercase">
                  Openingsuren
                </h2>
                <ul className="font-accent mt-3 space-y-1 text-base leading-relaxed text-pp-black/80">
                  {hours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {(hasTel || hasMail) && (
              <div>
                <h2 className="font-accent text-[0.65rem] tracking-[0.28em] text-pp-olive/70 uppercase">
                  Contact
                </h2>
                <div className="font-accent mt-3 flex flex-col gap-2 text-base">
                  {hasTel ? (
                    <a
                      href={location.telHref}
                      className="w-fit text-pp-christmas underline decoration-pp-christmas/35 underline-offset-2 transition-colors hover:text-pp-olive"
                    >
                      {location.tel}
                    </a>
                  ) : null}
                  {hasMail ? (
                    <a
                      href={`mailto:${location.mail}`}
                      className="w-fit text-pp-olive underline decoration-pp-olive/35 underline-offset-2 transition-colors hover:text-pp-christmas"
                    >
                      {location.mail}
                    </a>
                  ) : null}
                </div>
              </div>
            )}

            {!hasTel && !hasMail ? (
              <p className="font-accent text-sm text-pp-black/55">
                Telefoon en e-mail voor deze vestiging: zie{" "}
                <a
                  href={officialLocationsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pp-olive underline decoration-pp-olive/35 underline-offset-2 transition-colors hover:text-pp-christmas"
                >
                  poulepoulette.com/locaties
                </a>
                .
              </p>
            ) : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-olive bg-pp-olive px-5 py-3 text-center text-[0.62rem] tracking-[0.24em] text-pp-creme uppercase transition-colors hover:border-pp-christmas hover:bg-pp-christmas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-olive"
              >
                Open in Maps
              </a>
              <a
                href={officialLocationsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-olive/35 px-5 py-3 text-center text-[0.62rem] tracking-[0.22em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
              >
                Alle locaties (officieel)
              </a>
              <Link
                href="/locations"
                className="font-accent inline-flex items-center justify-center rounded-sm border border-pp-olive/35 px-5 py-3 text-center text-[0.62rem] tracking-[0.22em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
              >
                Mozaïek
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="mt-auto border-t border-pp-white/10 px-5 py-5 text-center sm:px-8">
        <p className="font-accent text-xs text-pp-creme/45">
          © Poule &amp; Poulette
        </p>
      </footer>
    </div>
  );
}
