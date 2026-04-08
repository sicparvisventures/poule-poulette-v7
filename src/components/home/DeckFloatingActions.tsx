"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Jobs — vastgepind aan de viewport (niet aan de documentflow).
 * Render via portal naar document.body zodat geen Framer/layout-ancestor `fixed` breekt.
 */
export function DeckFloatingActions({
  visible,
  instant,
}: {
  visible: boolean;
  instant: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="pp-deck-fab"
          initial={instant ? false : { opacity: 0, y: 20, scale: 0.96 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              duration: instant ? 0 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          exit={{
            opacity: 0,
            y: 16,
            scale: 0.96,
            transition: {
              duration: instant ? 0 : 0.32,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          role="navigation"
          aria-label="Snelkoppelingen"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-9998 flex items-end justify-start gap-4"
          style={{
            paddingBottom: "max(1.1rem, env(safe-area-inset-bottom, 0px))",
            paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
            paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
          }}
        >
          <a
            href="#vacatures"
            className="pointer-events-auto font-accent rounded-sm border-2 border-pp-creme/45 bg-pp-olive/96 px-5 py-3 text-[0.62rem] tracking-[0.32em] text-pp-creme uppercase shadow-[0_6px_24px_rgb(6_7_9/0.45)] transition-[border-color,color,transform,box-shadow] duration-200 hover:border-pp-lollypop/85 hover:text-pp-lollypop hover:shadow-[0_8px_28px_rgb(28_56_52/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-creme active:scale-[0.98] md:px-6 md:py-3.5 md:text-[0.66rem]"
          >
            Jobs
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
