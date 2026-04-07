"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  splashPolaroidFallbackSrc,
  splashPolaroidItems,
} from "@/content/splashPolaroids";

type Props = { reduceMotion: boolean | null };

export function SplashPolaroidCollage({ reduceMotion }: Props) {
  const prefersReduced = useReducedMotion();
  const still = !!(reduceMotion || prefersReduced);

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
    <div className="origin-center drop-shadow-[0_14px_32px_rgb(0_0_0/0.38)]">
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
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 4.1 + (i % 3) * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.floatDelay,
        }}
        style={{ rotate: item.rotateDeg }}
        className="origin-center drop-shadow-[0_14px_32px_rgb(0_0_0/0.38)]"
      >
        <PolaroidFrame item={item} />
      </motion.div>
    </motion.div>
  );
}

function PolaroidFrame({
  item,
}: {
  item: (typeof splashPolaroidItems)[number];
}) {
  const [src, setSrc] = useState(item.src);

  return (
    <div className="rounded-[2px] border border-pp-white/30 bg-pp-white p-2 pb-3 shadow-[0_1px_0_rgb(255_255_255/0.08)_inset] sm:p-2.5 sm:pb-3.5">
      <div className="relative aspect-4/5 w-full overflow-hidden bg-pp-black/10 ring-1 ring-pp-black/6">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px"
          priority
          onError={() => {
            if (src !== splashPolaroidFallbackSrc) {
              setSrc(splashPolaroidFallbackSrc);
            }
          }}
        />
      </div>
      <p className="font-accent mt-2 text-center text-[0.52rem] tracking-[0.28em] text-pp-olive/78 uppercase sm:text-[0.58rem]">
        {item.caption}
      </p>
    </div>
  );
}
