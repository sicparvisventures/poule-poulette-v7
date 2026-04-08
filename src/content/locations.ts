/**
 * Keten-brede locaties — bron voor /locations en gerelateerde UI.
 * Beelden onder /public/locations/. Adressen en uren afgestemd op poulepoulette.com/locaties (2026).
 */

export const brandTagline = "Fun loving food moments" as const;

/** Officiële overzichtspagina — o.a. Etterbeek, Merode, Brussels Expo. */
export const officialLocationsUrl = "https://poulepoulette.com/locaties/" as const;

/** Korte opsomming voor meta / splash; sluit aan bij poulepoulette.com/locaties. */
export const brandCitiesLine =
  "Antwerpen Eilandje · Brussel · Etterbeek · Gent · Leuven · Mechelen · Oostende · Merode · Brugge · Brussels Expo" as const;

const locImg = {
  antwerpen: "/locations/antwerpen.jpg",
  brussel: "/locations/brussel.jpg",
  brugge: "/locations/brugge.jpg",
  gent: "/locations/gent.jpg",
  leuven: "/locations/leuven.jpg",
  mechelen: "/locations/mechelen.jpg",
  oostende: "/locations/oostende.jpg",
} as const;

export type ChainLocation = {
  id: string;
  city: string;
  title: string;
  addressLines: string[];
  tel: string;
  telHref: string;
  mail: string;
  mapsQuery: string;
  imageSrc: string;
  imageAlt: string;
  /** Introductie op /locations/[slug] en in de zoom-pop-up. */
  detailIntro: string;
  /** Optioneel: openingsurenregels zoals op de officiële site. */
  openingHours?: readonly string[];
  videoSrc?: string | null;
};

/**
 * Vaste volgorde voor het mozaïek (7 steden). Zie ook officialLocationsUrl voor extra filialen.
 */
export const chainLocations: ChainLocation[] = [
  {
    id: "antwerpen",
    city: "Antwerpen (Eilandje)",
    title: "Poule & Poulette — het Eilandje",
    addressLines: ["Godefriduskaai 2", "2000 Antwerpen"],
    tel: "+32 3 283 83 22",
    telHref: "tel:+3232838322",
    mail: "GK2@poulepoulette.com",
    mapsQuery: "Poule Poulette Godefriduskaai 2 Antwerpen",
    imageSrc: locImg.antwerpen,
    imageAlt: "Poule & Poulette Antwerpen Eilandje — terras aan het water",
    detailIntro:
      "Aan de voet van het MAS, aan het water van het Eilandje: ons Antwerpse kippenhok met zicht op de jachthaven. 7/7 open voor lunch en diner in typische Poule & Poulette-sfeer.",
    openingHours: [
      "Ma–do: 11:45–14:30 & 17:00–21:30",
      "Vr: 11:45–14:30 & 17:00–22:00",
      "Za: 11:45–22:00",
      "Zo: 11:45–21:00",
    ],
  },
  {
    id: "brussel",
    city: "Brussel",
    title: "Poule & Poulette — Sainte-Catherine",
    addressLines: [
      "Sint-Katelijneplein 2",
      "1000 Brussel",
      "Tip: ook Etterbeek (Place Jourdan), Merode en Brussels Expo — zie officiële locatiespagina.",
    ],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Sint-Katelijneplein 2 Brussel",
    imageSrc: locImg.brussel,
    imageAlt: "Poule & Poulette Brussel — Sint-Katelijneplein",
    detailIntro:
      "Centraal op het levendige Sint-Katelijneplein. Het merk heeft ook een vestiging op Place Jourdan (Etterbeek), aan Merode en een stand op Brussels Expo tijdens grote beurzen — alle praktische info en reserveren via poulepoulette.com/locaties.",
    openingHours: [
      "Ma–vr: 11:45–14:30 & 17:30–21:30",
      "Za: 11:30–22:00",
      "Zo: 11:30–21:00",
    ],
  },
  {
    id: "brugge",
    city: "Brugge",
    title: "Poule & Poulette — Simon Stevinplein",
    addressLines: ["Simon Stevinplein 3", "8000 Brugge"],
    tel: "+32 50 89 37 00",
    telHref: "tel:+3250893700",
    mail: "SS3@poulepoulette.com",
    mapsQuery: "Poule Poulette Simon Stevinplein 3 Brugge",
    imageSrc: locImg.brugge,
    imageAlt: "Poule & Poulette Brugge — historisch centrum",
    detailIntro:
      "Op het pittoreske Simon Stevinplein, tussen Steenstraat en Oude Burg: midden in het historische hart, met hetzelfde funky interieur en shared plates als overal in de keten.",
    openingHours: [
      "Ma–do: 11:00–21:00",
      "Vr–za: 11:00–22:00",
      "Zo: 11:00–21:00",
    ],
  },
  {
    id: "gent",
    city: "Gent",
    title: "Poule & Poulette — Korenmarkt",
    addressLines: ["Korenmarkt 11", "9000 Gent"],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Korenmarkt 11 Gent",
    imageSrc: locImg.gent,
    imageAlt: "Poule & Poulette Gent — Korenmarkt",
    detailIntro:
      "Net achter de Graslei, op de drukke Korenmarkt: de Gentse vestiging in het centrum. Telefoon en mail vind je op de locatiepagina van poulepoulette.com; reserveren kan via de site van de keten.",
    openingHours: [
      "Zo–do: 11:45–21:30",
      "Vr–za: 11:45–22:00",
    ],
  },
  {
    id: "leuven",
    city: "Leuven",
    title: "Poule & Poulette — Tiensestraat",
    addressLines: ["Tiensestraat 15", "3000 Leuven"],
    tel: "+32 16 79 21 52",
    telHref: "tel:+3216792152",
    mail: "TS15@poulepoulette.com",
    mapsQuery: "Poule Poulette Tiensestraat 15 Leuven",
    imageSrc: locImg.leuven,
    imageAlt: "Poule & Poulette Leuven — vlak bij de Grote Markt",
    detailIntro:
      "Midden in de Tiensestraat, op een steenworp van de Grote Markt: ideaal voor studenten, shoppers en wie na het werk wil neerploffen in de cosy zitboxen.",
    openingHours: [
      "Ma–do: 11:45–14:30 & 17:00–21:00",
      "Vr–za: 11:45–22:00",
      "Zo: 11:45–21:00",
    ],
  },
  {
    id: "mechelen",
    city: "Mechelen",
    title: "Poule & Poulette — IJzerenleen",
    addressLines: ["IJzerenleen 36", "2800 Mechelen"],
    tel: "+32 15 52 83 51",
    telHref: "tel:+3215528351",
    mail: "IL36@poulepoulette.com",
    mapsQuery: "Poule Poulette IJzerenleen 36 Mechelen",
    imageSrc: locImg.mechelen,
    imageAlt: "Poule & Poulette Mechelen — autoluwe IJzerenleen",
    detailIntro:
      "In het autoluwe hart van Mechelen: shared plates, volle terrasjes en het vertrouwde Poule & Poulette-geluid. Bel of mail voor reservaties.",
    openingHours: [
      "Ma–do: 11:45–14:00 & 16:45–21:00",
      "Vr: 11:45–14:00 & 16:45–22:00",
      "Za: 11:45–21:30",
      "Zo: 11:45–21:00",
    ],
  },
  {
    id: "oostende",
    city: "Oostende",
    title: "Poule & Poulette — aan zee",
    addressLines: ["Leopold II-laan 34", "8400 Oostende"],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Leopold II-laan 34 Oostende",
    imageSrc: locImg.oostende,
    imageAlt: "Poule & Poulette Oostende — vlak bij het strand en casino",
    detailIntro:
      "Pal in de buurt van het casino en op loopafstand van het strand: kipgerechten met een vleugje kust. Actuele openingsuren en contact staan op poulepoulette.com/locaties.",
  },
];

export function getLocationBySlug(slug: string): ChainLocation | undefined {
  return chainLocations.find((l) => l.id === slug);
}

export function getLocationSlugs(): string[] {
  return chainLocations.map((l) => l.id);
}

/** Google Maps (app / web) — zoek op vrije query. */
export function googleMapsSearchUrl(mapsQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
}

/**
 * Embed-URL zonder API-key (klassiek Google Maps iframe).
 * Werkt voor de meeste adres- en naam-queries; anders helpt de knop “Open in Google Maps”.
 */
export function googleMapsEmbedSrc(mapsQuery: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&z=15&output=embed&hl=nl&iwloc=near`;
}

/** Marquee onder de header op /locations — zelfde vibe als /menu. */
export const locationsMarqueePhrases = [
  "KIES JE STAD · ZELFDE MERK",
  "ANTWERPEN · BRUSSEL · BRUGGE · GENT · LEUVEN · MECHELEN · OOSTENDE",
  "GOOD CHICKEN · GOOD MOOD",
  "7/7 OPEN · FUN LOVING FOOD MOMENTS",
  "POULE & POULETTE",
] as const;

/** Teksten voor de virtuele locaties-ervaring (/locations). */
export const locationsPageCopy = {
  kicker: "Poule & Poulette",
  title: "Virtuele locaties",
  /** Vaste balk (overlay); kort. */
  introBar:
    "Tik een tegel voor route, contact en reserveren. Extra filialen (Etterbeek, Merode, Expo…) op de officiële site.",
  intro:
    "Elke stad hieronder heeft een tegel in het mozaïek. Voor de volledige lijst met alle adresjes, uren en reservatie: ga naar poulepoulette.com/locaties.",
  splashTitle: "Alle locaties",
  splashLine:
    "Deze site toont de zeven vaste steden. Op poulepoulette.com vind je ook Etterbeek, Merode, Brussels Expo en actuele info per zaak.",
  scrollHint:
    "Tik op een tegel voor details · nummers scrollen naar die vestiging · pijltjestoetsen wisselen de focus",
  zoomClose: "Sluit",
  footnote:
    "Openingsuren en contact kunnen wijzigen. Controleer altijd poulepoulette.com/locaties voor de laatste info en reserveren.",
} as const;
