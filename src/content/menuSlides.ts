/**
 * Virtuele menu-reis: volgorde = eerste beeld op /menu, daarna scroll naar rechts.
 * Bron-PNG’s in /public/images/PP_Menu_* + stickers in /public/images/menu-sticker-*.png
 */
export const menuVirtualSections = [
  {
    src: "/images/PP_Menu_binnenwerk_ALGEMEEN/PP_Menu_binnenwerk_ALGEMEEN-01.png",
    label: "Kaft",
    kicker: "Fun loving food moments",
    blurb:
      "De Poule & Poulette-kaart zoals je ze op tafel krijgt: speels, warm en klaar om goesting te maken.",
    connector: "Open het menu",
  },
  {
    src: "/images/PP_Menu_binnenwerk_ALGEMEEN/PP_Menu_binnenwerk_ALGEMEEN-02.png",
    label: "Chicken classics",
    kicker: "Kip op smiling",
    blurb: "Signature dishes, crunchy favorieten en alles wat Poule & Poulette zo herkenbaar maakt.",
    connector: "Schenk iets in",
  },
  {
    src: "/images/PP_Menu_BIERSOORT_1/PP_Menu_BIERSOORT_1-2.png",
    label: "Bier",
    kicker: "Good drinks · good mood",
    blurb: "Bieren en pairing-momenten die perfect meegaan met chicken, sharing en lange tafels.",
    connector: "Verder tafelen",
  },
  {
    src: "/images/PP_Menu_binnenwerk_ALGEMEEN/PP_Menu_binnenwerk_ALGEMEEN-07.png",
    label: "House favorites",
    kicker: "Meer om van te houden",
    blurb: "Van guilty pleasures tot vaste favorieten: dit zijn de pagina’s die altijd goesting blijven geven.",
    connector: "Nog een pagina",
  },
  {
    src: "/images/PP_Menu_binnenwerk_ALGEMEEN/PP_Menu_binnenwerk_ALGEMEEN-05.png",
    label: "Chicken cravings",
    kicker: "Bestel wat blijft hangen",
    blurb: "De soort gerechten waarvoor je nog eens terugkomt, met vrienden, familie of gewoon veel honger.",
    connector: "Tot aan dessert",
  },
  {
    src: "/images/PP_Menu_binnenwerk_ALGEMEEN/PP_Menu_binnenwerk_ALGEMEEN-09.png",
    label: "See you at the table",
    kicker: "Reserveer je plek",
    blurb: "Zin gekregen? Kies je locatie, reserveer je tafel en laat de sfeer de rest doen.",
    connector: "",
  },
] as const;

export type MenuVirtualSection = (typeof menuVirtualSections)[number];

/** Marquee bovenaan /menu — zelfde vibe als de blend-band op home. */
export const menuMarqueePhrases = [
  "VIRTUEEL MENU · ECHTE SMAAK",
  "SCROLL NAAR BENEDEN · GLIJD NAAR RECHTS",
  "GOOD CHICKEN · GOOD MOOD",
  "ANTWERPEN · BRUSSEL · GENT · LEUVEN · MECHELEN · OOSTENDE · MERODE · BRUGGE",
  "POULE & POULETTE",
] as const;

/** Legacy: carrousel / zoom — zelfde bronnen als virtuele reis. */
export const menuSlides = menuVirtualSections.map((s) => ({
  src: s.src,
  label: s.label,
})) as { src: string; label: string }[];

export type MenuSlide = (typeof menuSlides)[number];

export const menuPageCopy = {
  kicker: "Poule & Poulette",
  title: "Virtueel menu",
  intro:
    "Blader door de kaart alsof ze open voor je ligt op tafel. Tik op een pagina om dichter in te zoomen.",
  scrollHint: "Scroll omlaag om verder te bladeren · tik om te vergroten",
  zoomClose: "Sluit vergroting",
  footnote:
    "Prijzen en aanbod kunnen per vestiging licht verschillen — vraag ter plaatse naar de actuele kaart.",
} as const;
