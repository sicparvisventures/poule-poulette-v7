/**
 * /groepen — groepsmenu's (goud / zilver / brons), visueel in lijn met /menu.
 */

export const groupsMarqueePhrases = [
  "GROEPSMENU'S · GOUD · ZILVER · BRONS",
  "GROTERE TAFELS · ZELFDE GOEDE MOOD",
  "RESERVEER · VRAAG NAAR MOGELIJKHEDEN",
  "POULE & POULETTE",
] as const;

export const groupsPageCopy = {
  kicker: "Poule & Poulette",
  title: "Groepen",
  intro:
    "Kies het groepsmenu dat bij jullie gezelschap past. Tik op een variant om het formaat groter te bekijken — voor prijzen en beschikbaarheid neem je best contact op met je vestiging.",
  footnote:
    "Groepsformules en voorwaarden kunnen per locatie verschillen. Reserveren en maatwerk altijd in overleg met het restaurant.",
} as const;

export const groupMenuTiers = [
  {
    id: "gold",
    label: "Goud",
    tagline: "Premium groepsformule",
    blurb:
      "Meest uitgebreide selectie — ideaal voor grote vieringen en lange tafels.",
    src: "/images/goldmenu.jpg",
    alt: "Poule & Poulette groepsmenu goud",
    cardClass:
      "border-amber-700/25 bg-linear-to-br from-amber-50/90 via-pp-white to-amber-100/40 shadow-amber-900/10 hover:border-amber-600/40 hover:shadow-[0_20px_50px_rgb(180_83_9/0.12)]",
    accentDot: "bg-amber-500",
  },
  {
    id: "silver",
    label: "Zilver",
    tagline: "Klassiek groepsmenu",
    blurb:
      "Evenwichtige keuze tussen variatie en sfeer — past bij de meeste gezelschappen.",
    src: "/images/silvermenu.jpg",
    alt: "Poule & Poulette groepsmenu zilver",
    cardClass:
      "border-slate-400/35 bg-linear-to-br from-slate-50/95 via-pp-white to-slate-100/50 shadow-slate-600/10 hover:border-slate-500/45 hover:shadow-[0_20px_50px_rgb(71_85_105/0.12)]",
    accentDot: "bg-slate-400",
  },
  {
    id: "bronze",
    label: "Brons",
    tagline: "Compact groepsmenu",
    blurb:
      "Strak en smakelijk samengesteld — perfect om kennis te maken met jullie kippenhok.",
    src: "/images/bronzemenu.jpg",
    alt: "Poule & Poulette groepsmenu brons",
    cardClass:
      "border-orange-800/30 bg-linear-to-br from-orange-50/90 via-pp-white to-amber-50/35 shadow-orange-900/10 hover:border-orange-700/40 hover:shadow-[0_20px_50px_rgb(154_52_18/0.1)]",
    accentDot: "bg-orange-700/80",
  },
] as const;

export type GroupMenuTier = (typeof groupMenuTiers)[number];
