"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LocationCard } from "@/components/locations/LocationCard";
import {
  brandCitiesLine,
  brandTagline,
  type ChainLocation,
} from "@/content/locations";

const ease = [0.22, 1, 0.36, 1] as const;

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
} as const;

type Props = { locations: ChainLocation[] };

export function LocationsIndexContent({ locations }: Props) {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
        className="border-b border-pp-white/10 bg-linear-to-b from-pp-olive to-[#152a26] px-5 py-5 text-pp-creme sm:px-8"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="font-accent text-[0.62rem] tracking-[0.26em] text-pp-creme/80 uppercase underline-offset-4 transition-colors hover:text-pp-lollypop"
          >
            ← Home
          </Link>
          <p className="font-display text-center text-base text-pp-creme sm:text-lg">
            Poule &amp; Poulette
          </p>
          <span className="font-accent hidden text-right text-[0.58rem] tracking-[0.28em] text-pp-creme/45 uppercase sm:block sm:w-24">
            België
          </span>
        </div>
      </motion.header>

      <main className="flex flex-1 flex-col">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.55, delay: 0.05, ease } }}
          className="relative overflow-hidden border-b border-pp-olive/10 bg-pp-creme/40 px-5 py-16 md:px-8 md:py-20"
          aria-labelledby="loc-heading"
        >
          <div
            className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-sm bg-pp-lollypop/8 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-sm bg-pp-olive/10 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.12, duration: 0.45, ease },
              }}
              className="font-accent text-xs tracking-[0.32em] text-pp-olive/60 uppercase sm:text-sm"
            >
              {brandTagline}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.2, duration: 0.5, ease },
              }}
              id="loc-heading"
              className="font-display mt-5 text-4xl text-pp-olive md:text-5xl"
            >
              Locaties
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.28, duration: 0.5, ease },
              }}
              className="font-accent mx-auto mt-6 max-w-xl text-base leading-relaxed text-pp-black/78 md:text-lg"
            >
              Elke vestiging op één plek — met beeld, route en straks alle
              praktische gegevens. Zelfde merk, lokale aanwezigheid, één
              verzorgde site.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.4, duration: 0.45, ease },
              }}
              className="font-accent mt-5 text-xs tracking-[0.18em] text-pp-black/50 uppercase sm:text-sm sm:tracking-[0.2em]"
            >
              {brandCitiesLine}
            </motion.p>
          </div>
        </motion.section>

        <section
          className="px-5 py-14 md:px-8 md:py-20"
          aria-labelledby="grid-heading"
        >
          <div className="mx-auto max-w-7xl">
            <h2 id="grid-heading" className="sr-only">
              Alle vestigingen
            </h2>
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="grid gap-8 sm:grid-cols-2 sm:gap-10 xl:grid-cols-3"
            >
              {locations.map((loc) => (
                <li key={loc.id} className="flex">
                  <LocationCard location={loc} />
                </li>
              ))}
            </motion.ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-pp-olive/10 bg-pp-white px-5 py-6 text-center text-sm text-pp-olive/70 sm:px-8">
        <p className="font-accent">© Poule &amp; Poulette — België</p>
      </footer>
    </>
  );
}
