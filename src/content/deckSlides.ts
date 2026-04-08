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
    imageSrc: "/placeholders/deck/slide-02.jpg",
    kicker: "Hoofdstuk 02",
    title: "Keuken & smaak",
    body: "Tweede paneel in het horizontale deck. Scroll naar beneden op desktop om horizontaal door te gaan.",
  },
  {
    id: "slide-03",
    imageSrc: "/placeholders/deck/slide-03.jpg",
    kicker: "Hoofdstuk 03",
    title: "Door het land",
    body: "Van Antwerpen tot Oostende — dezelfde sfeer op elke locatie. Locaties en beelden vul je centraal op deze site.",
  },
  {
    id: "slide-04",
    imageSrc: "/placeholders/deck/slide-04-overgang.svg",
    kicker: "Volgende stap",
    title: "Kom langs",
    body: "Call-to-action placeholder: reservatie, openingsuren, adres — nog in te vullen.",
  },
];
