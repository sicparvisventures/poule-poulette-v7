/**
 * Polaroid-sfeerbeelden op de splash.
 * Bronbestanden: ppsitev/assets-source/images (terras Jourdan, opening Gent, food, Mechelen).
 * Publiceer onder public/splash-polaroids/ als 01-terras.jpg … 04-mechelen.jpg (kopie of symlink).
 */
export type SplashPolaroidItem = {
  src: string;
  alt: string;
  caption: string;
  rotateDeg: number;
  positionClass: string;
  floatDelay: number;
};

export const splashPolaroidItems: readonly SplashPolaroidItem[] = [
  {
    src: "/splash-polaroids/01-terras.jpg",
    alt: "Terras en sfeer bij Poule & Poulette, Place Jourdan Brussel",
    caption: "Brussel",
    rotateDeg: -5,
    positionClass:
      "left-[2%] top-[10%] w-[min(30vw,7.25rem)] sm:left-[3%] sm:top-[11%] sm:w-[min(26vw,8.25rem)] md:left-[4%] md:top-[12%] md:w-[min(22vw,9rem)] lg:w-[min(18vw,9.5rem)]",
    floatDelay: 0,
  },
  {
    src: "/splash-polaroids/02-opening.jpg",
    alt: "Opening en feestelijk moment Poule & Poulette Gent",
    caption: "Gent",
    rotateDeg: 4,
    positionClass:
      "right-[2%] top-[11%] w-[min(30vw,7.25rem)] sm:right-[3%] sm:top-[12%] sm:w-[min(26vw,8.25rem)] md:right-[4%] md:top-[13%] md:w-[min(22vw,9rem)] lg:w-[min(18vw,9.5rem)]",
    floatDelay: 0.35,
  },
  {
    src: "/splash-polaroids/03-food.jpg",
    alt: "Gerecht en presentatie Poule & Poulette",
    caption: "Op tafel",
    rotateDeg: 3,
    positionClass:
      "left-[2%] bottom-[16%] w-[min(28vw,6.75rem)] sm:left-[3%] sm:bottom-[17%] sm:w-[min(24vw,7.75rem)] md:left-[4%] md:bottom-[18%] md:w-[min(20vw,8.5rem)] lg:w-[min(17vw,9rem)]",
    floatDelay: 0.7,
  },
  {
    src: "/splash-polaroids/04-mechelen.jpg",
    alt: "Poule & Poulette Mechelen, sfeerbeeld",
    caption: "Mechelen",
    rotateDeg: -4,
    positionClass:
      "right-[2%] bottom-[15%] w-[min(28vw,6.75rem)] sm:right-[3%] sm:bottom-[16%] sm:w-[min(24vw,7.75rem)] md:right-[4%] md:bottom-[17%] md:w-[min(20vw,8.5rem)] lg:w-[min(17vw,9rem)]",
    floatDelay: 1.05,
  },
] as const;

/** Fallback als splash-polaroids/ nog niet gedeployed is (één unieke foto hergebruikt). */
export const splashPolaroidFallbackSrc = "/fotookes/PP_Mechelen-1.png" as const;
