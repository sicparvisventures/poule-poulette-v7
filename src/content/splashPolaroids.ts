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
    rotateDeg: -8,
    positionClass:
      "-left-[2%] top-[4%] w-[min(44vw,10.5rem)] sm:-left-[1%] sm:top-[5%] sm:w-[min(38vw,12rem)] md:left-[1%] md:top-[6%] md:w-[min(32vw,13.5rem)] lg:w-[min(28vw,14rem)]",
    floatDelay: 0,
  },
  {
    src: "/splash-polaroids/02-opening.jpg",
    alt: "Opening en feestelijk moment Poule & Poulette Gent",
    caption: "Gent",
    rotateDeg: 7,
    positionClass:
      "-right-[2%] top-[6%] w-[min(44vw,10.5rem)] sm:-right-[1%] sm:top-[7%] sm:w-[min(38vw,12rem)] md:right-[1%] md:top-[8%] md:w-[min(32vw,13.5rem)] lg:w-[min(28vw,14rem)]",
    floatDelay: 0.35,
  },
  {
    src: "/splash-polaroids/03-food.jpg",
    alt: "Gerecht en presentatie Poule & Poulette",
    caption: "Op tafel",
    rotateDeg: 5,
    positionClass:
      "-left-[3%] bottom-[12%] w-[min(40vw,9.75rem)] sm:-left-[2%] sm:bottom-[14%] sm:w-[min(34vw,11.25rem)] md:left-[0%] md:bottom-[15%] md:w-[min(30vw,12.5rem)] lg:w-[min(26vw,13rem)]",
    floatDelay: 0.7,
  },
  {
    src: "/splash-polaroids/04-mechelen.jpg",
    alt: "Poule & Poulette Mechelen, sfeerbeeld",
    caption: "Mechelen",
    rotateDeg: -6,
    positionClass:
      "-right-[3%] bottom-[10%] w-[min(40vw,9.75rem)] sm:-right-[2%] sm:bottom-[12%] sm:w-[min(34vw,11.25rem)] md:right-[0%] md:bottom-[13%] md:w-[min(30vw,12.5rem)] lg:w-[min(26vw,13rem)]",
    floatDelay: 1.05,
  },
] as const;

/** Fallback als splash-polaroids/ nog niet gedeployed is (één unieke foto hergebruikt). */
export const splashPolaroidFallbackSrc = "/fotookes/PP_Mechelen-1.png" as const;
