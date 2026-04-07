/**
 * Presentatie-deck (Prezi / horizontale “slides”).
 * Placeholder-beelden in /public/placeholders/deck/ — later vervangen door .webp of foto’s.
 */
export type DeckSlide = {
  id: string;
  /** Publiek pad; mag .svg, .webp, .png, … */
  imageSrc: string;
  kicker: string;
  title: string;
  body: string;
};

export const deckSlides: DeckSlide[] = [
  {
    id: "slide-01",
    imageSrc: "/placeholders/deck/slide-01-overgang.svg",
    kicker: "Hoofdstuk 01",
    title: "Verhaal & sfeer",
    body: "Placeholder-tekst. Vervang dit blok door echte copy wanneer de definitieve beelden klaar staan.",
  },
  {
    id: "slide-02",
    imageSrc: "/placeholders/deck/slide-02-overgang.svg",
    kicker: "Hoofdstuk 02",
    title: "Keuken & smaak",
    body: "Tweede paneel in het horizontale deck. Scroll naar beneden op desktop om horizontaal door te gaan.",
  },
  {
    id: "slide-03",
    imageSrc: "/placeholders/deck/slide-03-overgang.svg",
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
