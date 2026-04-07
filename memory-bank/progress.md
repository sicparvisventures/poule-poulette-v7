# Progress — ppsite

## 2026-04-07 — Init + shell

- **Map:** `ppsite/` — Next.js 16, App Router, TypeScript, Tailwind v4, `src/`.
- **Hero:** `/` toont `public/fotookes/PP_Mechelen-1.png` via `next/image` (fill, object-cover).
- **Fonts:** `next/font/local` — `src/fonts/bacon-kingdom.ttf`, `lino-stamp-2.ttf` → CSS-variabelen `--font-bacon-kingdom`, `--font-lino-stamp`; Tailwind `font-display` / `font-accent`.
- **Tokens:** `globals.css` — OLIVE, CHRISTMAS, LOLLYPOP, CREME, PP WHITE, PP BLACK uit design system 2.0; `--pp-hero-veil`.
- **Layout:** Geen klassieke header; **Pizarro-achtige** **Menu** + **Locations** op de hero; Locations → **`/locations`** (eigen pagina, keten-breed, **geen** externe ketensite-link).
- **Splash (v1):** `SplashGate` — fullscreen OLIVE, drie regels “WELKOM / BIJ / POULE & POULETTE”, knop + klik om door; `sessionStorage` `ppsite-splash-dismissed` voor herhaalbezoek in dezelfde tab.

## 2026-04-07 — Splash v2 + documentatie + Framer

- **Documentatie:** `memory-bank/`, root `DESIGN.md` (Stitch-achtige secties), `AGENTS.md`.
- **Splash v2:** Klein “welkom bij”, gecentreerd **POULE & POULETTE**; **slideshow** in kader: FUN → LOVING → FOOD MOMENTS (crossfade); daarna **automatisch** naar site (geen verplichte klik). **Skip** + Escape blijven mogelijk; `sessionStorage` ongewijzigd.
- **Continuïteit:** Zelfde titel gebruikt **Framer Motion `layoutId`** tussen splash en hero — vloeiende overgang in positie/grootte; titel blijft goed leesbaar op OLIVE-strook onder de foto.
- **Dependency:** `framer-motion` (layout + AnimatePresence voor slideshow).
- **Component:** `HomeExperience` (`src/components/home/HomeExperience.tsx`) orkestreert splash + pagina; `page.tsx` rendert enkel `HomeExperience`. `SplashGate.tsx` verwijderd.

## 2026-04-07 — Presentatie-deck (“slide 2”)

- **Sectie:** `#presentatie` — `PresentationDeck` na de hero in `HomeExperience`.
- **Desktop (≥768px):** lange sectie (`slides × 100vh`); **sticky** viewport; **verticale scroll** stuurt **horizontale** `translateX` (Framer `useScroll` + `useSpring`), vergelijkbaar met o.a. [Taqueria Rico](https://taqueriarico.com).
- **Mobiel / `prefers-reduced-motion`:** zelfde content als **verticale stack** (geen scroll-gekoppelde horizontale beweging).
- **Placeholders:** `public/placeholders/deck/slide-0*-overgang.svg` + copy in `src/content/deckSlides.ts` — later vervangen door .webp/foto’s (alleen `imageSrc` aanpassen).
- **Deck FABs:** **Jobs** / **Reserve** als echte viewport-float: `createPortal` → `document.body` + `z-100` (omzeilt broken `fixed` door Framer/`LayoutGroup`-ancestors). Zichtbaar wanneer zone deck+jobs+reserve in beeld (`useInView` op `fabScopeRef` in `HomeExperience`). Styling: pills, ring, schaduw, safe-area, `DeckFloatingActions.tsx`.

## 2026-04-07 — Keten als hoofdsite (niet alleen Mechelen)

- **Positionering:** `ppsite` = hoofdsite voor **alle** Poule & Poulette’s in België.
- **Hero:** geen “Mechelen”-label; tagline **Fun loving food moments**; intro over keten + uitrol **beweging / 3D / detail**.
- **`/locations`:** `LocationsIndexContent` (motion hero, stagger grid), kaarten hoekig (`rounded-sm`), foto per stad onder **`public/locations/*.jpg`** (kopieën uit `ppsitev/assets-source`). **`/locations/[slug]`** — detailpagina (`LocationDetailView`): brede hero, intro `detailIntro`, Maps — mobiel full-bleed, desktop kaart-achtig op donkere achtergrond. Jobs/Reserve FAB’s: **hoekig** (`rounded-sm`, `border-2`), geen pill.
- **Assets:** o.a. `public/fotookes/PP_Mechelen-1.png`, `pp-compose-placeholder.png`.

## 2026-04-07 — Splash copy / FAB’s

- **Splash:** geen pill-rond slideshow; alleen roze regel + lichte drop-shadow. Pulsen: *Vers aan tafel / Sfeer in huis / Keten met karakter* (niet meer FUN/LOVING/FOOD). Geen extra tagline-regel op splash.
- **Polaroids:** verder naar hoeken, groter op brede schermen, onderste twee altijd zichtbaar (ook mobiel).
- **Jobs / Reserve:** altijd zichtbaar zodra splash weg (`visible` niet meer gekoppeld aan scroll); **linker en rechter onderhoek** (`justify-between` full width). `main` krijgt `pb-28` zodat content niet onder knoppen verdwijnt. Secties #jobs / #reserve compacter + korte placeholder.

## 2026-04-07 — Splash polaroids + layout

- **Polaroids:** `SplashPolaroidCollage` + `src/content/splashPolaroids.ts` — vier beelden uit `ppsitev/assets-source/images` gepubliceerd als **`public/splash-polaroids/01-terras.jpg` … `04-mechelen.jpg`** (Jourdan/Brussel, opening Gent, food shoot, Mechelen). Witte polaroid-rand, captions, lichte float (tenzij `prefers-reduced-motion`). **`Image` `onError`** valt terug op `/fotookes/PP_Mechelen-1.png` als bestanden ontbreken.
- **Splash-UI:** gradient-achtergrond OLIVE → donkerder, gecentreerde kolom (Welkom bij → woordmerk → tagline → slideshow in **pill** met blur). Geen absolute `top-40%` meer voor titel.

## 2026-04-07 — Hero video + centraal logo

- **Hero media:** `PresentationDeck`-bovenste blok gebruikt **`/videos/hero-poule-poulette.mp4`** (autoplay, muted, loop, `playsInline`) i.p.v. terrasfoto; **poster** blijft `PP_Mechelen-1.png` voor eerste frame / langzame load.
- **Logo:** gecentreerd op hero: **`/images/logo-poule-hero.png`** (kopie van `ppsitev/.../logo_poule-18996a148f.png`), boven nav, met lichte drop-shadow.
- **`prefers-reduced-motion`:** nog steeds statische **`PP_Mechelen-1.png`** i.p.v. video.
- **Lokaal:** video staat als **symlink** naar `ppsitev/assets-source/...` (schijf vol bij volledige copy); voor **deploy** het mp4-bestand in `public/videos/` zetten of symlink vervangen door echte file.

## 2026-04-07 — Blend band + FAB-fix + prompt-doc

- **`HeroDeckBlendBand`:** tussen hero en `PresentationDeck`; gradient + horizontale marquee (`globals.css` keyframes); copy `marqueeBand.ts`; `prefers-reduced-motion` → statische regel.
- **Jobs/Reserve FAB:** `useInView(fabScopeRef, { amount: "some" })` i.p.v. 6% van enorme container (anders vaak **niet zichtbaar**); portal-`z-index` **9998**.
- **#jobs / #reserve:** titels **Vacatures** / **Reserveren** + `sr-only` uitleg; ankers `#jobs` / `#reserve` ongewijzigd voor FAB-links.
- **`docs/image-generation-prompts.md`:** uitgebreide ChatGPT-/generator-prompts (palet, styleguide-paden, tape-asset, deck-lagen, negatieve prompts, export).

## Open / volgende stappen (intentie gebruiker)

- GSAP, Three.js, Anime.js — laag per laag.
- Eventueel halftone / hero-overlay volgens design system 2.0.
- Locaties: echte adressen/tel/mail/beeld/video per `chainLocations`-item.
