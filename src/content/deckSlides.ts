/**
 * Presentatie-deck (Prezi / horizontale “slides”).
 * Beeld links: o.a. /public/placeholders/deck/; stickers onder /public/images/.
 */
export type DeckSlide = {
  id: string;
  /** Publiek pad; mag .svg, .webp, .png, … */
  imageSrc: string;
  kicker: string;
  title: string;
  body: string;
  /** Optionele “sticker” op het tekstpaneel (PNG met transparantie). */
  stickerSrc?: string;
  /**
   * Eén beeld over de volle breedte van de slide (geen split paneel + tekstkolom).
   * Gebruik bij brede illustraties die over het hele scherm doorlopen.
   */
  fullBleedImage?: boolean;
  /** Polaroid-collage links (zelfde beelden als splash), o.a. slide 3. */
  deckPolaroidsLeft?: boolean;
  /** Desktop: polaroids rechts op dit paneel (slide 2 i.v.m. naad naar slide 3). */
  deckPolaroidsRightCluster?: boolean;
  /**
   * Voettekst onder het body-blok.
   * - `undefined`: standaard placeholder voor ontwerpers.
   * - `false`: geen voettekst.
   * - string: vaste copy.
   */
  assetFooter?: string | false;
};

const DEFAULT_DECK_ASSET_FOOTER =
  "Placeholder beeld — vervang in /public/placeholders/deck/";

export function deckSlideAssetFooter(slide: DeckSlide): string | null {
  if (slide.assetFooter === false) return null;
  if (typeof slide.assetFooter === "string") return slide.assetFooter;
  return DEFAULT_DECK_ASSET_FOOTER;
}

export const deckSlides: DeckSlide[] = [
  {
    id: "slide-01",
    imageSrc: "/images/slide1v2.svg",
    fullBleedImage: true,
    stickerSrc: "/images/kroonroze.png",
    kicker: "",
    title: "",
    body: "",
    assetFooter: false,
  },
  {
    id: "slide-02",
    imageSrc: "/images/slide2v2.svg",
    fullBleedImage: true,
    deckPolaroidsRightCluster: true,
    /** Alleen voor journey-nav / toegankelijkheid; niet zichtbaar op full-bleed slide. */
    kicker: "Hoofdstuk 02",
    title: "Keuken & smaak",
    body: "",
    assetFooter: false,
  },
  {
    id: "slide-03",
    imageSrc: "/images/3.svg",
    fullBleedImage: true,
    deckPolaroidsLeft: true,
    /** Alleen voor journey-nav / toegankelijkheid; niet zichtbaar op full-bleed slide. */
    kicker: "Hoofdstuk 03",
    title: "Door het land",
    body: "",
    assetFooter: false,
  },
  {
    id: "slide-04",
    imageSrc: "/images/4.svg",
    fullBleedImage: true,
    /** Alleen voor journey-nav / toegankelijkheid; niet zichtbaar op full-bleed slide. */
    kicker: "Volgende stap",
    title: "Kom langs",
    body: "",
    assetFooter: false,
  },
];
