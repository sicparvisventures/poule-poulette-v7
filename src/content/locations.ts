/**
 * Keten-brede locaties — bron voor /locations en gerelateerde UI.
 * Beelden onder /public/locations/ (kopieën uit ppsitev/assets-source).
 */

export const brandTagline = "Fun loving food moments" as const;

/** Korte opsomming voor meta / locations-intro; sluit aan bij poulepoulette.com/locaties. */
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
  /** Introductie op /locations/[slug]. */
  detailIntro: string;
  videoSrc?: string | null;
};

/**
 * Vaste volgorde voor het grid. Niet-Mechelen: placeholder adresregels tot definitieve data.
 */
export const chainLocations: ChainLocation[] = [
  {
    id: "antwerpen",
    city: "Antwerpen",
    title: "Poule & Poulette Antwerpen",
    addressLines: [
      "Adres en openingsuren worden op deze site geüpdatet.",
      "Reserveren: contact volgt zodra gepubliceerd.",
    ],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Antwerpen",
    imageSrc: locImg.antwerpen,
    imageAlt: "Poule & Poulette — sfeerbeeld Antwerpen",
    detailIntro:
      "Antwerpen krijgt dezelfde warme tafel als overal in de keten: straks met concreet adres, openingsuren en een vlotte route naar jullie deur.",
  },
  {
    id: "brussel",
    city: "Brussel",
    title: "Poule & Poulette Brussel",
    addressLines: [
      "Adres en openingsuren worden op deze site geüpdatet.",
      "Meerdere wijken mogelijk — check binnenkort per vestiging.",
    ],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Brussel Place Jourdan",
    imageSrc: locImg.brussel,
    imageAlt: "Terras en sfeer Poule & Poulette Brussel",
    detailIntro:
      "Van Place Jourdan tot de rest van het Brussels gewest: één merk, lokale aanwezigheid. Hier vullen we binnenkort het exacte adres en alle praktische info aan.",
  },
  {
    id: "brugge",
    city: "Brugge",
    title: "Poule & Poulette Brugge",
    addressLines: ["Adres en openingsuren worden op deze site geüpdatet."],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Brugge",
    imageSrc: locImg.brugge,
    imageAlt: "Poule & Poulette — sfeerbeeld Brugge",
    detailIntro:
      "Brugge verdient het volledige Poule & Poulette-gevoel: vers aan tafel, zonder gedoe. Adres en uren volgen zodra ze vastliggen.",
  },
  {
    id: "gent",
    city: "Gent",
    title: "Poule & Poulette Gent",
    addressLines: ["Adres en openingsuren worden op deze site geüpdatet."],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Gent",
    imageSrc: locImg.gent,
    imageAlt: "Opening en feestelijk moment Poule & Poulette Gent",
    detailIntro:
      "Gent ademt al mee met openingen en recepties bij de keten. De vaste locatiepagina groeit mee met jullie officiële gegevens en reservatiemogelijkheden.",
  },
  {
    id: "leuven",
    city: "Leuven",
    title: "Poule & Poulette Leuven",
    addressLines: ["Adres en openingsuren worden op deze site geüpdatet."],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Leuven",
    imageSrc: locImg.leuven,
    imageAlt: "Poule & Poulette — sfeerbeeld Leuven",
    detailIntro:
      "Studentenstad of niet: hier tellen dezelfde smaken en service. We werken de Leuvense vestigingspagina uit zodra adres en contact klaarstaan.",
  },
  {
    id: "mechelen",
    city: "Mechelen",
    title: "Poule & Poulette Mechelen",
    addressLines: ["IJzerenleen 36", "2800 Mechelen"],
    tel: "+32 15 52 83 51",
    telHref: "tel:+3215528351",
    mail: "IL36@poulepoulette.com",
    mapsQuery: "Poule Poulette IJzerenleen 36 Mechelen",
    imageSrc: locImg.mechelen,
    imageAlt: "Poule & Poulette Mechelen — terras en gevel",
    detailIntro:
      "Op de IJzerenleen draait alles om shared plates en een warme sfeer. Bel of mail voor reservaties en vragen — het team helpt je graag verder.",
  },
  {
    id: "oostende",
    city: "Oostende",
    title: "Poule & Poulette Oostende",
    addressLines: ["Adres en openingsuren worden op deze site geüpdatet."],
    tel: "",
    telHref: "",
    mail: "",
    mapsQuery: "Poule Poulette Oostende",
    imageSrc: locImg.oostende,
    imageAlt: "Poule & Poulette — sfeerbeeld Oostende",
    detailIntro:
      "Zeezijde of centrum: de kust krijgt de Poule & Poulette-toets. Praktische info en openingsuren verschijnen hier zodra ze definitief zijn.",
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
  "LOKALE AANWEZIGHEID · ÉÉN VERZORGDE SITE",
  "POULE & POULETTE",
] as const;

/** Teksten voor de virtuele locaties-ervaring (/locations). */
export const locationsPageCopy = {
  kicker: "Poule & Poulette",
  title: "Virtuele locaties",
  intro:
    "Scroll om door alle vestigingen te bladeren. Tik op een locatie om het beeld groter te bekijken — straks met route en alle praktische gegevens per adres.",
  scrollHint: "Scroll omlaag om verder te gaan · tik om te vergroten",
  zoomClose: "Sluit vergroting",
  footnote:
    "Adressen en openingsuren worden per vestiging geüpdatet. Voor reserveren en actuele info: open de pagina van je dichtstbijzijnde restaurant.",
} as const;
