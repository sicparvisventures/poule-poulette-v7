"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const DOODLE_MASK_STYLE = {
  WebkitMaskImage: 'url("/images/doodle_clean_upscaled.png")',
  maskImage: 'url("/images/doodle_clean_upscaled.png")',
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
} as const;

function HeroDoodleFootLink({
  href,
  ariaLabel,
  wrapperClassName,
  restRotation,
  reduceMotion,
  baseDropShadowClass,
}: {
  href: string;
  ariaLabel: string;
  wrapperClassName: string;
  restRotation: number;
  reduceMotion: boolean | null;
  /** Zelfde patroon als kip-lockup: crème laag → lollypop bij hover (mask, geen blob). */
  baseDropShadowClass: string;
}) {
  const hoverRot = restRotation + (restRotation >= 0 ? 9 : -9);
  return (
    <motion.div
      className={wrapperClassName}
      initial={false}
      animate={{ rotate: restRotation }}
      whileHover={
        reduceMotion
          ? undefined
          : { rotate: hoverRot, scale: 1.12, y: -4 }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 19 }}
    >
      <Link
        href={href}
        className="group block opacity-[0.88] transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pp-lollypop focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label={ariaLabel}
      >
        <div className="relative aspect-square w-full">
          <div
            aria-hidden
            className={`absolute inset-0 opacity-[0.92] transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:opacity-0 group-focus-visible:scale-[1.02] group-focus-visible:opacity-0 ${baseDropShadowClass}`}
            style={{
              backgroundColor: "#fdf8c1",
              ...DOODLE_MASK_STYLE,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 drop-shadow-[0_0_24px_rgb(244_149_189/0.7)] transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:opacity-100 group-focus-visible:scale-[1.05] group-focus-visible:opacity-100"
            style={{
              backgroundColor: "#f495bd",
              ...DOODLE_MASK_STYLE,
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export type HomeHeroPrimaryProps = {
  splashActive: boolean;
  splashTitleId: string;
  reduceMotion: boolean | null;
  wordmarkClass: string;
  heroTagline: string;
  heroSupportCopy: string;
  heroVideoWordmarkClass: string;
  wordmarkLayoutId: string;
  onChickenTrigger: () => void;
  chickenMoment: boolean;
  chickenSpot: { bottom: number; right: number } | null;
  /** Desktop horizontale journey: geen min-h-dvh, past in sticky viewport zonder interne page-scroll. */
  desktopHorizontalRail?: boolean;
};

export function HomeHeroPrimary({
  splashActive,
  splashTitleId,
  reduceMotion,
  wordmarkClass,
  heroTagline,
  heroSupportCopy,
  heroVideoWordmarkClass,
  wordmarkLayoutId,
  onChickenTrigger,
  chickenMoment,
  chickenSpot,
  desktopHorizontalRail = false,
}: HomeHeroPrimaryProps) {
  return (
    <section
      className={
        desktopHorizontalRail
          ? "relative flex h-full min-h-0 flex-1 flex-col bg-pp-olive"
          : "relative flex min-h-dvh flex-1 flex-col bg-pp-olive"
      }
      aria-label="Poule &amp; Poulette — keten België"
    >
      <div
        className={
          desktopHorizontalRail
            ? "relative min-h-0 w-full flex-1 basis-0"
            : "relative min-h-[55vh] flex-1 w-full md:min-h-[65vh]"
        }
      >
        {reduceMotion ? (
          <Image
            src="/fotookes/PP_Mechelen-1.png"
            alt="Poule &amp; Poulette — sfeerbeeld restaurant"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            poster="/fotookes/PP_Mechelen-1.png"
            aria-hidden
          >
            <source
              src="/videos/hero-poule-poulette.mp4"
              type="video/mp4"
            />
          </video>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-(--pp-hero-veil)"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-pp-black/75 to-transparent" />

        <HeroDoodleFootLink
          href="/backstage"
          ariaLabel="Ga naar Backstage"
          wrapperClassName="absolute left-5 top-[max(1.25rem,4vh)] z-[26] hidden w-[min(20vw,3.35rem)] sm:left-7 sm:top-[max(1.75rem,5.5vh)] sm:w-[min(17vw,3.5rem)] md:left-9 md:top-12 md:block md:w-15"
          restRotation={14}
          reduceMotion={reduceMotion}
          baseDropShadowClass="drop-shadow-[0_4px_14px_rgb(0_0_0/0.42)]"
        />
        <HeroDoodleFootLink
          href="/hello"
          ariaLabel="Easter egg — loyalty app preview"
          wrapperClassName="absolute left-3 top-[max(4.5rem,12vh)] z-[26] hidden w-[min(26vw,4.25rem)] sm:left-5 sm:top-[max(5rem,14vh)] sm:w-[min(22vw,4.75rem)] md:left-6 md:top-28 md:block md:w-20"
          restRotation={-8}
          reduceMotion={reduceMotion}
          baseDropShadowClass="drop-shadow-[0_6px_20px_rgb(0_0_0/0.5)]"
        />

        <div className="absolute inset-0 z-[25] flex flex-col items-center justify-center gap-3 px-6 sm:gap-4 md:z-5 md:gap-5">
          <button
            type="button"
            onClick={onChickenTrigger}
            className={`flex w-[min(92vw,18rem)] flex-col items-center text-center transition-[color,transform,filter] duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] sm:w-[min(78vw,21rem)] md:w-[min(46vw,22rem)] ${heroVideoWordmarkClass} cursor-pointer hover:text-pp-lollypop hover:drop-shadow-[0_0_36px_rgba(244_149_189/0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pp-lollypop/85 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent`}
            aria-label="Poule &amp; Poulette — tik voor een korte animatie"
          >
            <span className="block text-[clamp(1.8rem,5.7vw,3.05rem)] leading-[0.88] tracking-[0.015em]">
              POULE &amp;
            </span>
            <span className="-mt-[0.12em] block text-[clamp(1.8rem,5.7vw,3.05rem)] leading-[0.88] tracking-[0.015em]">
              POULETTE
            </span>
          </button>
          <motion.div
            className="group pointer-events-auto relative w-[min(56vw,11.5rem)] max-w-[200px] cursor-pointer sm:w-[min(48vw,13rem)] sm:max-w-[230px] md:w-[min(42vw,14rem)] md:max-w-[250px]"
            whileHover={
              reduceMotion
                ? undefined
                : {
                    y: -4,
                    rotate: -3,
                    scale: 1.04,
                  }
            }
            whileTap={
              reduceMotion
                ? undefined
                : { scale: 0.96, rotate: -1 }
            }
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            tabIndex={0}
            role="button"
            aria-label="Poule &amp; Poulette lockup — tik voor een korte animatie"
            onClick={onChickenTrigger}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChickenTrigger();
              }
            }}
          >
            <div className="relative aspect-square w-full">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.98] drop-shadow-[0_8px_32px_rgb(0_0_0/0.5)] transition-all duration-300 ease-out group-hover:scale-[1.01] group-hover:opacity-0 group-focus-visible:scale-[1.01] group-focus-visible:opacity-0"
                style={{
                  backgroundColor: "#fdf8c1",
                  WebkitMaskImage: 'url("/images/hero-pp-lockup.png")',
                  maskImage: 'url("/images/hero-pp-lockup.png")',
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 drop-shadow-[0_0_28px_rgb(244_149_189/0.65)] transition-all duration-300 ease-out group-hover:scale-[1.06] group-hover:opacity-100 group-focus-visible:scale-[1.06] group-focus-visible:opacity-100"
                style={{
                  backgroundColor: "#f495bd",
                  WebkitMaskImage: 'url("/images/hero-pp-lockup.png")',
                  maskImage: 'url("/images/hero-pp-lockup.png")',
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
            </div>
          </motion.div>
        </div>

        <nav
          className={
            desktopHorizontalRail
              ? "absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-end justify-center gap-x-10 gap-y-3 px-6 pb-6 md:z-10 md:gap-x-14 md:pb-8"
              : "absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-end justify-center gap-x-10 gap-y-4 px-6 pb-10 md:z-10 md:gap-x-16 md:pb-14"
          }
          aria-label="Primaire acties"
        >
          <Link
            href="/menu"
            className="pointer-events-auto font-accent text-xl tracking-[0.2em] text-pp-creme uppercase underline-offset-8 transition-[color,transform,text-shadow] duration-200 hover:-translate-y-0.5 hover:scale-105 hover:text-pp-lollypop hover:drop-shadow-[0_0_20px_rgba(244_149_189/0.55)] active:scale-95 md:text-2xl"
          >
            Menu
          </Link>
          <Link
            href="/locations"
            className="pointer-events-auto font-accent text-xl tracking-[0.2em] text-pp-creme uppercase underline-offset-8 transition-[color,transform,text-shadow] duration-200 hover:-translate-y-0.5 hover:scale-105 hover:text-pp-lollypop hover:drop-shadow-[0_0_20px_rgba(244_149_189/0.55)] active:scale-95 md:text-2xl"
          >
            Locations
          </Link>
        </nav>

        <AnimatePresence>
          {chickenMoment && chickenSpot ? (
            <motion.div
              key={`hero-chicken-${chickenSpot.bottom.toFixed(1)}-${chickenSpot.right.toFixed(1)}`}
              role="presentation"
              aria-hidden
              style={{
                bottom: `${chickenSpot.bottom}%`,
                right: `${chickenSpot.right}%`,
              }}
              className="pointer-events-none absolute z-[35] w-[min(34vw,7.75rem)] sm:w-[min(28vw,8.75rem)]"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.85, x: 18, y: 18 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 380,
                        damping: 22,
                      },
                    }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.92,
                      x: 10,
                      y: 10,
                      transition: { duration: 0.22 },
                    }
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF */}
              <img
                src="/images/chicken_walk.gif"
                alt=""
                width={176}
                height={176}
                className="h-auto w-full object-contain object-center drop-shadow-[0_4px_18px_rgb(0_0_0/0.5)]"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div
        className={
          desktopHorizontalRail
            ? "relative z-1 shrink-0 overflow-x-clip border-t border-pp-white/10 bg-pp-olive px-4 py-4 text-pp-white md:px-5 md:py-4"
            : "relative z-1 overflow-x-clip border-t border-pp-white/10 bg-pp-olive px-6 py-8 text-pp-white"
        }
      >
        {/*
          Doodle-textuur links & rechts: breedte-container loopt tot buiten px-6 zodat de
          textuur tegen de echte rand van het olive-blok uitlijnt; fade naar het midden.
        */}
        <div
          className="pointer-events-none absolute inset-y-0 -inset-x-6 z-0"
          aria-hidden
        >
          <div
            className="absolute inset-y-0 left-0 w-[62%] max-w-2xl overflow-hidden sm:w-[54%] md:w-[48%] md:max-w-none lg:w-[42%]"
            style={{
              WebkitMaskImage:
                "linear-gradient(90deg, black 0%, black 52%, rgba(0,0,0,0.2) 78%, transparent 100%)",
              maskImage:
                "linear-gradient(90deg, black 0%, black 52%, rgba(0,0,0,0.2) 78%, transparent 100%)",
            }}
          >
            <div
              className={
                desktopHorizontalRail
                  ? "relative h-full min-h-28 w-full md:min-h-0"
                  : "relative h-full min-h-48 w-full md:min-h-0"
              }
            >
              <Image
                src="/images/olive-band-doodle-overlay.png"
                alt=""
                fill
                className="object-cover object-right opacity-[0.22] mix-blend-normal -scale-x-100"
                sizes="(max-width: 768px) 65vw, 40vw"
              />
            </div>
          </div>
          <div
            className="absolute inset-y-0 right-0 w-[62%] max-w-2xl overflow-hidden sm:w-[54%] md:w-[48%] md:max-w-none lg:w-[42%]"
            style={{
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 22%, black 48%)",
              maskImage:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 22%, black 48%)",
            }}
          >
            <div
              className={
                desktopHorizontalRail
                  ? "relative h-full min-h-28 w-full md:min-h-0"
                  : "relative h-full min-h-48 w-full md:min-h-0"
              }
            >
              <Image
                src="/images/olive-band-doodle-overlay.png"
                alt=""
                fill
                className="object-cover object-right opacity-[0.22] mix-blend-normal"
                sizes="(max-width: 768px) 65vw, 40vw"
              />
            </div>
          </div>
        </div>
        {/*
          Seam-kader: alleen vanaf md. Hover/tik: lichte spring-scale + tilt (geen anim bij reduce motion).
        */}
        <motion.div
          className={`absolute bottom-full left-[6%] z-40 hidden w-[min(46vw,19rem)] translate-y-[46%] origin-[55%_65%] cursor-pointer md:block md:pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-creme/80 focus-visible:ring-offset-2 focus-visible:ring-offset-pp-olive ${desktopHorizontalRail ? "md:hidden" : ""}`}
          style={{ rotate: -10 }}
          aria-label="Sfeerbeeld restaurant — hover of tik voor een korte animatie"
          role="group"
          tabIndex={0}
          whileHover={
            reduceMotion
              ? undefined
              : {
                  scale: 1.07,
                  rotate: -4,
                  y: -10,
                  transition: {
                    type: "spring",
                    stiffness: 420,
                    damping: 20,
                  },
                }
          }
          whileTap={
            reduceMotion
              ? undefined
              : {
                  scale: 0.93,
                  rotate: -14,
                  transition: {
                    type: "spring",
                    stiffness: 550,
                    damping: 22,
                  },
                }
          }
          whileFocus={
            reduceMotion
              ? undefined
              : {
                  scale: 1.05,
                  rotate: -5,
                  y: -6,
                  transition: {
                    type: "spring",
                    stiffness: 420,
                    damping: 20,
                  },
                }
          }
        >
          <div className="relative aspect-[413/429] w-full drop-shadow-[0_14px_40px_rgb(0_0_0/0.5)]">
            <div className="absolute inset-[21.2%_31.5%_16.6%_23%] z-0 overflow-hidden">
              <Image
                src="/fotookes/hero-seam-photo.jpg"
                alt=""
                fill
                className="object-cover object-[center_42%]"
                sizes="(max-width: 768px) 65vw, 360px"
              />
            </div>
            <Image
              src="/images/frame_transparent.png"
              alt=""
              fill
              className="z-10 object-contain object-center"
              sizes="(max-width: 768px) 65vw, 360px"
            />
          </div>
        </motion.div>
        {!splashActive ? (
          <div
            className={
              desktopHorizontalRail
                ? "relative z-20 mx-auto flex w-full max-w-6xl flex-col px-2 md:z-10 md:min-h-0 md:justify-center"
                : "relative z-20 mx-auto flex w-full max-w-6xl flex-col px-4 md:z-10 md:min-h-52 md:justify-center"
            }
          >
            <div
              className={
                desktopHorizontalRail
                  ? "relative z-20 mx-auto flex w-full max-w-3xl flex-col items-center text-center md:z-10 md:py-1"
                  : "relative z-20 mx-auto flex w-full max-w-3xl flex-col items-center text-center md:z-10 md:py-2"
              }
            >
              <motion.h1
                id={splashTitleId}
                layoutId={wordmarkLayoutId}
                className={`relative z-10 w-full max-w-[min(92vw,44rem)] px-2 sm:px-4 [text-shadow:0_1px_28px_rgb(0_0_0/0.35)] ${desktopHorizontalRail ? "font-display text-center text-[clamp(1.55rem,3.8vw,2.45rem)] leading-[0.98] tracking-wide text-pp-creme" : wordmarkClass}`}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 38,
                  mass: 0.85,
                }}
              >
                {heroTagline}
              </motion.h1>
              <motion.p
                className={
                  desktopHorizontalRail
                    ? "font-accent mt-3 max-w-2xl text-balance text-sm leading-snug text-pp-white/90 [text-shadow:0_1px_18px_rgb(0_0_0/0.32)] line-clamp-4"
                    : "font-accent mt-6 max-w-2xl text-balance text-base text-pp-white/92 [text-shadow:0_1px_18px_rgb(0_0_0/0.32)]"
                }
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.2,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
              >
                {heroSupportCopy}
              </motion.p>
            </div>
          </div>
        ) : null}
      </div>
    </section>

  );
}
