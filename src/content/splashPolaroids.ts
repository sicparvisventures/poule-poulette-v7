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

/**
 * Unieke beelden voor het deck (gekopieerd naar /public/deck-polaroids/ uit
 * ppsitev/assets-source/images).
 */
export const deckPolaroidPhotos: readonly {
  src: string;
  caption: string;
  alt: string;
}[] = [
  {
    src: "/deck-polaroids/01-place-jourdan.jpg",
    caption: "Brussel",
    alt: "Poule & Poulette, Place Jourdan Brussel",
  },
  {
    src: "/deck-polaroids/02-place-jourdan.jpg",
    caption: "Place Jourdan",
    alt: "Terras Place Jourdan",
  },
  {
    src: "/deck-polaroids/03-place-jourdan.jpg",
    caption: "Brussel",
    alt: "Sfeer Place Jourdan",
  },
  {
    src: "/deck-polaroids/04-gent-opening.jpeg",
    caption: "Gent",
    alt: "Openingsreceptie Gent",
  },
  {
    src: "/deck-polaroids/05-gent.jpg",
    caption: "Opening",
    alt: "Poule & Poulette Gent",
  },
  {
    src: "/deck-polaroids/06-gent.jpg",
    caption: "Gent",
    alt: "Feest Gent",
  },
  {
    src: "/deck-polaroids/07-mechelen.jpeg",
    caption: "Mechelen",
    alt: "Poule & Poulette Mechelen",
  },
  {
    src: "/deck-polaroids/08-mechelen.jpg",
    caption: "Mechelen",
    alt: "Mechelen restaurant",
  },
  {
    src: "/deck-polaroids/09-mechelen.jpg",
    caption: "Mechelen",
    alt: "Sfeer Mechelen",
  },
  {
    src: "/deck-polaroids/10-autosalon.jpeg",
    caption: "Autosalon",
    alt: "Poule & Poulette Autosalon",
  },
  {
    src: "/deck-polaroids/11-sfeer.jpeg",
    caption: "Samen",
    alt: "Gasten en sfeer",
  },
  {
    src: "/deck-polaroids/12-food.jpg",
    caption: "Op tafel",
    alt: "Gerecht Poule & Poulette",
  },
  {
    src: "/deck-polaroids/13-food.jpg",
    caption: "Keuken",
    alt: "Food moment",
  },
  {
    src: "/deck-polaroids/14-food.jpg",
    caption: "Smullen",
    alt: "Eten en drinken",
  },
  {
    src: "/deck-polaroids/15-sfeer.jpg",
    caption: "Moment",
    alt: "Restaurant sfeer",
  },
  {
    src: "/deck-polaroids/16-food.jpg",
    caption: "Genieten",
    alt: "Culinaire moment",
  },
] as const;

/**
 * Mobiel slide 3: eerste vier unieke deck-foto’s, linker kolom.
 */
export const deckSlide3PolaroidItems: readonly SplashPolaroidItem[] = (() => {
  const photos = deckPolaroidPhotos;
  return [
    {
      ...photos[0],
      rotateDeg: -5,
      floatDelay: 0,
      positionClass:
        "left-[1%] top-[5%] w-[min(32vw,7rem)] sm:left-[2%] sm:top-[7%] sm:w-[min(28vw,7.5rem)]",
    },
    {
      ...photos[1],
      rotateDeg: 4,
      floatDelay: 0.22,
      positionClass:
        "left-[5%] top-[26%] w-[min(30vw,6.75rem)] sm:left-[6%] sm:top-[28%] sm:w-[min(26vw,7rem)]",
    },
    {
      ...photos[2],
      rotateDeg: 3,
      floatDelay: 0.48,
      positionClass:
        "left-[0.5%] top-[50%] w-[min(32vw,7rem)] sm:left-[1%] sm:top-[52%] sm:w-[min(28vw,7.5rem)]",
    },
    {
      ...photos[3],
      rotateDeg: -4,
      floatDelay: 0.72,
      positionClass:
        "left-[4%] bottom-[4%] top-auto w-[min(28vw,6.5rem)] sm:left-[5%] sm:bottom-[6%] sm:w-[min(24vw,7rem)]",
    },
  ];
})();

/**
 * Desktop slide 2 ↔ 3: zestien unieke polaroids — naad-rij, cluster rechts op slide 2,
 * rest verspreid over het crème deel van slide 3 (niet tegen de naad, minder overlap).
 */
const deckSlide23PolaroidBase: readonly SplashPolaroidItem[] = (() => {
  const rotations = [
    -4, 3, -3, 4, -5, 4, 3, -4, 5, -3, 4, -4, 3, -5, 4, -3,
  ] as const;
  return deckPolaroidPhotos.map((p, i) => ({
    src: p.src,
    alt: p.alt,
    caption: p.caption,
    rotateDeg: rotations[i] ?? 0,
    floatDelay: (i % 10) * 0.09,
    positionClass: "",
  }));
})();

/** Eerste rij: horizontaal op de naad (slide 2 ↔ 3). */
export const deckPolaroidSeamRowItems: readonly SplashPolaroidItem[] =
  deckSlide23PolaroidBase.slice(0, 4);

/** Slide 2 groen: rechts, boven/onder — vermijd het verticale midden (naad-rij). */
const SLIDE2_RIGHT: readonly string[] = [
  "right-[5%] top-[7%] w-[min(16vw,7.5rem)] lg:right-[6%] lg:top-[8%] lg:w-[min(14vw,7.75rem)]",
  "right-[12%] top-[22%] w-[min(15vw,7rem)] lg:right-[13%] lg:top-[23%] lg:w-[min(13vw,7.25rem)]",
  "right-[7%] top-[68%] w-[min(16vw,7.5rem)] lg:right-[8%] lg:top-[69%] lg:w-[min(14vw,7.75rem)]",
  "right-[5%] bottom-[9%] top-auto w-[min(15vw,7rem)] lg:right-[6%] lg:bottom-[10%] lg:w-[min(13vw,7.25rem)]",
];

/** Vier stuks rechts op slide 2 (desktop). */
export const deckPolaroidSlide2RightItems: readonly SplashPolaroidItem[] =
  deckSlide23PolaroidBase.slice(4, 8).map((item, i) => ({
    ...item,
    positionClass: SLIDE2_RIGHT[i] ?? item.positionClass,
  }));

/**
 * Slide 3 crème: dichter bij de naad-rij (Brussel / Gent-polaroids), nog steeds op het lichte vlak.
 * Links blijft ruim onder ~30% zodat het logo rechts vrij blijft.
 */
const SLIDE3_CREME_EXTRA: readonly string[] = [
  "left-[12%] top-[9%] w-[min(14vw,6.75rem)] lg:left-[13%] lg:top-[10%] lg:w-[min(13vw,7rem)]",
  "left-[24%] top-[13%] w-[min(14vw,6.75rem)] lg:left-[25%] lg:top-[14%] lg:w-[min(13vw,7rem)]",
  "left-[14%] top-[28%] w-[min(14vw,6.75rem)] lg:left-[15%] lg:top-[29%] lg:w-[min(13vw,7rem)]",
  "left-[26%] top-[32%] w-[min(14vw,6.75rem)] lg:left-[27%] lg:top-[33%] lg:w-[min(13vw,7rem)]",
  "left-[13%] top-[50%] w-[min(14vw,6.75rem)] lg:left-[14%] lg:top-[51%] lg:w-[min(13vw,7rem)]",
  "left-[25%] top-[54%] w-[min(14vw,6.75rem)] lg:left-[26%] lg:top-[55%] lg:w-[min(13vw,7rem)]",
  "left-[15%] bottom-[22%] top-auto w-[min(14vw,6.75rem)] lg:left-[16%] lg:bottom-[23%] lg:w-[min(13vw,7rem)]",
  "left-[23%] bottom-[11%] top-auto w-[min(14vw,6.75rem)] lg:left-[24%] lg:bottom-[12%] lg:w-[min(13vw,7rem)]",
];

/** Acht stuks op het crème paneel van slide 3 (desktop). */
export const deckPolaroidSlide3LeftExtraItems: readonly SplashPolaroidItem[] =
  deckSlide23PolaroidBase.slice(8, 16).map((item, i) => ({
    ...item,
    positionClass: SLIDE3_CREME_EXTRA[i] ?? item.positionClass,
  }));

/** Fallback als splash-polaroids/ nog niet gedeployed is (één unieke foto hergebruikt). */
export const splashPolaroidFallbackSrc = "/fotookes/PP_Mechelen-1.png" as const;
