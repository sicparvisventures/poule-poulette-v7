"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

export type JourneyPanel = {
  id: string;
  label: string;
};

type Props = {
  panels: readonly JourneyPanel[];
  progress: MotionValue<number>;
};

export function HomeJourneyIsland({ panels, progress }: Props) {
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);
  const titleId = useId();
  const panelCount = panels.length;

  useMotionValueEvent(progress, "change", (v) => {
    setPct(Math.round(v));
  });

  const active = Math.min(
    panelCount - 1,
    Math.max(0, Math.floor((pct / 100) * panelCount)),
  );
  const current = panels[active] ?? panels[0];
  const showIsland = open || active > 0 || pct > 2;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof document === "undefined" || panelCount === 0) {
    return null;
  }

  return createPortal(
    <LayoutGroup id="pp-home-journey-island">
      <AnimatePresence>
        {open ? (
          <motion.button
            key="journey-backdrop"
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-[109] cursor-default bg-pp-black/42 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showIsland ? (
          <motion.div
            key="journey-island-surface"
            layout
            layoutId="pp-journey-island-surface"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{
              opacity: { duration: 0.16 },
              y: { duration: 0.18 },
              scale: { duration: 0.16 },
              layout: { type: "spring", stiffness: 540, damping: 44, mass: 0.86 },
            }}
            className={`fixed z-[110] overflow-hidden rounded-none border border-pp-olive/24 bg-pp-creme/[0.95] text-pp-olive shadow-[0_20px_56px_rgb(13_26_23/0.22)] backdrop-blur-md ${
              open ? "w-[min(92vw,22.5rem)]" : "w-[min(86vw,19rem)]"
            }`}
            style={{
              top: "max(0.75rem, env(safe-area-inset-top, 0px))",
              left: "50%",
              x: "-50%",
            }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {!open ? (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left outline-none transition-[box-shadow,background-color] hover:bg-pp-olive/[0.04] focus-visible:ring-2 focus-visible:ring-pp-lollypop/85 focus-visible:ring-offset-2 focus-visible:ring-offset-pp-creme"
                    aria-expanded={false}
                    aria-haspopup="dialog"
                    onClick={() => setOpen(true)}
                  >
                    <div className="min-w-0 flex-1 border-r border-pp-olive/20 pr-2.5">
                      <p className="font-accent text-[0.57rem] tracking-[0.22em] text-pp-lollypop uppercase">
                        Nu
                      </p>
                      <p className="font-display truncate text-[0.82rem] leading-tight tracking-[0.04em] text-pp-olive sm:text-[0.9rem]">
                        {current.label}
                      </p>
                    </div>
                    <span
                      className="inline-flex h-7 w-11 items-center justify-center rounded-none border border-pp-olive/28 bg-pp-creme/90"
                      aria-hidden
                    >
                      <Image
                        src="/images/doodle_clean_upscaled.png"
                        alt=""
                        width={28}
                        height={18}
                        className="h-4 w-auto object-contain opacity-95"
                      />
                    </span>
                  </button>

                  <div className="border-t border-pp-olive/16 px-3.5 py-1.5">
                    <div className="flex items-center gap-1" aria-hidden>
                      {panels.map((p, i) => (
                        <span
                          key={p.id}
                          className={`h-1 flex-1 rounded-none transition-colors duration-200 ${
                            i === active
                              ? "bg-pp-lollypop shadow-[0_0_7px_rgb(244_149_189/0.4)]"
                              : "bg-pp-olive/22"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col rounded-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-b border-pp-olive/15 px-4 py-3">
                    <p
                      id={titleId}
                      className="font-display text-base leading-snug tracking-[0.04em] text-pp-olive uppercase md:text-lg"
                    >
                      NAVIGATE
                    </p>
                    <p className="font-accent mt-0.5 text-[0.68rem] tracking-[0.1em] text-pp-lollypop uppercase">
                      POULE &amp; POULETTE
                    </p>
                  </div>

                  <nav className="px-2 py-2" aria-label="Website links">
                    <ul className="grid grid-cols-2 gap-1.5">
                      {[
                        { href: "/", label: "Home" },
                        { href: "/menu", label: "Menu" },
                        { href: "/locations", label: "Locations" },
                        { href: "/#reserve", label: "Reserve" },
                        { href: "/#contact", label: "Contact" },
                      ].map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="flex w-full items-center justify-center border border-pp-olive/24 bg-pp-olive/[0.03] px-2 py-2 text-center font-accent text-[0.66rem] tracking-[0.17em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop/44 hover:bg-pp-lollypop/10 hover:text-pp-lollypop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pp-lollypop/85"
                            onClick={() => setOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="border-t border-pp-olive/15 px-2 py-2">
                    <button
                      type="button"
                      className="w-full rounded-none px-3 py-2 font-accent text-[0.6rem] tracking-[0.2em] text-pp-olive/65 uppercase transition-colors hover:bg-pp-olive/6 hover:text-pp-olive"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LayoutGroup>,
    document.body,
  );
}
