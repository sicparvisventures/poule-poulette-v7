"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { splashPolaroidItems } from "@/content/splashPolaroids";
import { PolaroidFrame } from "@/components/home/PolaroidFrame";

type Props = { reduceMotion: boolean | null };

export function SplashPolaroidCollage({ reduceMotion }: Props) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  /** Match SSR: media query / hook can differ on first client paint vs server. */
  const still = mounted && !!(reduceMotion || prefersReduced);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {splashPolaroidItems.map((item, i) => (
        <PolaroidSlot key={item.src} item={item} index={i} still={still} />
      ))}
    </div>
  );
}

function PolaroidSlot({
  item,
  index: i,
  still,
}: {
  item: (typeof splashPolaroidItems)[number];
  index: number;
  still: boolean;
}) {
  const inner = (
    <div className="origin-center drop-shadow-[0_16px_40px_rgb(0_0_0/0.55)]">
      <PolaroidFrame item={item} />
    </div>
  );

  if (still) {
    return (
      <div
        className={`absolute ${item.positionClass}`}
        style={{ transform: `rotate(${item.rotateDeg}deg)` }}
      >
        {inner}
      </div>
    );
  }

  return (
    <motion.div
      className={`absolute ${item.positionClass}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1 + i * 0.07,
          duration: 0.52,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 5.2 + (i % 3) * 0.35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.floatDelay,
        }}
        style={{ rotate: item.rotateDeg }}
        className="origin-center drop-shadow-[0_16px_40px_rgb(0_0_0/0.55)]"
      >
        <PolaroidFrame item={item} />
      </motion.div>
    </motion.div>
  );
}
