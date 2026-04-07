"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ChainLocation } from "@/content/locations";

type Props = {
  location: ChainLocation;
};

const cardEase = [0.22, 1, 0.36, 1] as const;

export function LocationCard({ location }: Props) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapsQuery)}`;
  const hasTel = Boolean(location.tel && location.telHref);
  const hasMail = Boolean(location.mail);
  const detailHref = `/locations/${location.id}`;

  return (
    <motion.article
      layout
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: cardEase },
        },
      }}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-pp-olive/14 bg-pp-white shadow-[0_2px_20px_rgb(6_7_9/0.05)] ring-1 ring-pp-black/3 transition-[border-color,box-shadow,ring-color] duration-300 hover:border-pp-olive/28 hover:shadow-[0_12px_44px_rgb(28_56_52/0.11)] hover:ring-pp-olive/10"
    >
      <Link
        href={detailHref}
        className="relative block aspect-4/3 w-full overflow-hidden bg-pp-olive/5 outline-none focus-visible:ring-2 focus-visible:ring-pp-lollypop focus-visible:ring-offset-2 focus-visible:ring-offset-pp-white"
      >
        <Image
          src={location.imageSrc}
          alt={location.imageAlt}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-pp-black/45 via-pp-black/5 to-transparent"
          aria-hidden
        />
        <p className="font-accent pointer-events-none absolute bottom-3 left-4 text-[0.62rem] tracking-[0.32em] text-pp-creme/95 uppercase drop-shadow-sm">
          {location.city}
        </p>
      </Link>

      <div className="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6">
        <h2 className="font-display text-xl leading-tight text-pp-olive md:text-2xl">
          <Link
            href={detailHref}
            className="transition-colors hover:text-pp-christmas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-olive"
          >
            {location.title}
          </Link>
        </h2>
        <address className="font-accent mt-3 not-italic text-sm leading-relaxed text-pp-black/75">
          {location.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>

        {(hasTel || hasMail) && (
          <div className="font-accent mt-4 flex flex-col gap-2 text-sm">
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
        )}

        {location.videoSrc ? (
          <div className="mt-4 overflow-hidden rounded-sm border border-pp-olive/15">
            <video
              className="aspect-video w-full object-cover"
              controls
              playsInline
              preload="metadata"
              src={location.videoSrc}
            />
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={detailHref}
            className="font-accent inline-flex items-center rounded-sm border border-pp-olive bg-pp-olive px-4 py-2.5 text-[0.62rem] tracking-[0.26em] text-pp-creme uppercase transition-colors hover:border-pp-christmas hover:bg-pp-christmas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-olive"
          >
            Meer info
          </Link>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-accent inline-flex items-center rounded-sm border border-pp-olive/35 px-4 py-2.5 text-[0.62rem] tracking-[0.22em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
          >
            Route
          </a>
        </div>
      </div>
    </motion.article>
  );
}
