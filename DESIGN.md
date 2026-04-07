# DESIGN.md — Poule & Poulette (ppsite)

Design system document in de geest van [Google Stitch / awesome-design-md](https://github.com/VoltAgent/awesome-design-md). Agents gebruiken dit samen met `docs/design-system-2.0.md` (repo-root) en `memory-bank/progress.md`.

---

## 1. Visual theme & atmosphere

- **Merk:** Poule & Poulette — **keten** (België), horeca, warm; geen corporate “dashboard”-gevoel. Deze build is de **hoofdsite voor alle vestigingen**, niet één stad.
- **Referentie UX:** [Pizarro Slice Shop](https://pizarrosliceshop.be) — geen klassieke top-header; grote hero-acties, optionele preloader/splash, editorial typografie.
- **Dichtheid:** Rustig op wit/off-white; diepte via **OLIVE** en full-bleed fotografie.
- **Filosofie:** Canonieke kleuren uit de huisstijlgids; accenten bewust (LOLLYPOP, CHRISTMAS).

---

## 2. Color palette & roles

| Token | HEX | Rol |
|--------|-----|-----|
| **OLIVE** | `#1c3834` | Primaire donkere merklaag, splash-achtergrond, hero-onderbalk, doodle-adjacent UI |
| **CHRISTMAS** | `#93231f` | Warm accent (campagnes, bewuste rode accenten — niet “default danger button”) |
| **LOLLYPOP** | `#f495bd` | Speels accent (splash-slideshow, hover op links) |
| **CREME** | `#fdf8c1` | Warm licht accent, tekst op OLIVE |
| **PP WHITE** | `#fbfbf1` | Pagina-achtergrond, lichte vlakken |
| **PP BLACK** | `#060709` | Bodytekst op licht, dramatische gradienten op foto |
| **Hero veil** | `rgb(0 0 0 / 0.23)` | Uniforme donkere laag over hero-foto (`--pp-hero-veil`) |

Logo zelf geen willekeurige kleuren (zie styleguide); **CHRISTMAS** mag elders in UI wanneer het past.

---

## 3. Typography

| Rol | Font | Toepassing |
|-----|------|------------|
| **Display** | Bacon Kingdom (`--font-bacon-kingdom`, Tailwind `font-display`) | Woordmerk, grote titels, splash-slidewords |
| **Accent / UI** | Lino Stamp (`--font-lino-stamp`, `font-accent` / `font-sans`) | Labels, navigatie, kleine caps, footer |

**Hiërarchie (huidige site):**

- Splash titel **POULE & POULETTE:** zelfde `clamp` op splash en hero voor visuele continuïteit (layout-animatie).
- “welkom bij”: klein, uppercase, ruime tracking, CREME ~60% opacity.
- Hero-onder woordmerk: tagline **Fun loving food moments** (`brandTagline` uit `src/content/locations.ts`), uppercase accent.

---

## 4. Component styling

### Splash / preloader

- Fullscreen **OLIVE**; inhoud gecentreerd.
- **Welkomregel** boven het woordmerk; **slideshow-kader** onder het woordmerk (border CREME subtiel, LOLLYPOP op woorden).
- Einde sequentie: automatisch door naar homepage; **Skip** beschikbaar (toegankelijkheid).
- Zelfde `layoutId` als hero-titel voor naadloze overgang (Framer Motion).

### Hero

- Full-width foto; **veil** + **gradient** onderaan voor leesbare **Menu** (`#menu`) en **Locations** (`/locations`) (groot, uppercase, CREME, hover LOLLYPOP).
- Geen klassieke headerbalk.
- Copy en `aria-label` zijn **keten-breed** (België), geen enkele stad als default.

### Hero → deck blend band

- Dunne strook **tussen** OLIVE-hero en zwart Prezi-deck: **gradient** OLIVE → zwart + **marquee** (copy in `src/content/marqueeBand.ts`).
- Geen wijziging aan bestaande hero-/deck-**spacing** binnen die secties; dit is een **extra** laag ertussen.
- Toekomst: PNG/WebP **tape/texture**-overlay — prompts in `docs/image-generation-prompts.md`.

### Locaties (`/locations`)

- **Canonieke data** in `src/content/locations.ts` (`chainLocations`, `brandTagline`, `brandCitiesLine`). Geen doorverwijzing naar een externe ketensite: content (adres, tel, mail, beeld, optioneel `videoSrc`) wordt hier gevoed.
- **Grid** met `LocationCard`: OLIVE/CREME, kaarten met foto, adres, optionele tel/mail, **Route** (Google Maps-zoekquery), optionele video.
- Placeholder-copy waar adres nog ontbreekt; Mechelen heeft voorbeeldadres uit eerdere interne copy.

### Presentatie-deck (`#presentatie`)

- **Desktop:** full-viewport **sticky** “slides”; **omlaag scrollen** beweegt het paneel **horizontaal** (Prezi/PowerPoint-achtig; referentie: [Taqueria Rico](https://taqueriarico.com)).
- **Mobiel / reduced motion:** dezelfde slides **onder elkaar**; geen scroll-hijack.
- **Assets:** placeholders onder `/public/placeholders/deck/`; metadata in `src/content/deckSlides.ts`.
- **Floating acties:** **Jobs** (OLIVE) / **Reserve** (CHRISTMAS) — vast aan viewport (`document.body` portal), niet in documentflow; tonen zolang deck+jobs+reserve-zone zichtbaar; safe-area + `z-100` onder skip-link.

### Footer

- Licht (PP WHITE), subtiele top-border OLIVE ~10% opacity.

### Knoppen / links

- Skip: underline of ghost; focus zichtbaar (`focus-visible:outline`).

---

## 5. Layout principles

- **Spacing:** Ruime `px-6` op mobiel; content `max-w-6xl` waar tekstblokken het dragen.
- **Hero:** `min-height` viewport; foto ~55–65% viewport hoogte; onderbalk OLIVE met gecentreerde typografie waar passend.
- **Splash:** Woordmerk visueel centraal (~40% viewport); slideshow lager op het scherm.

---

## 6. Depth & elevation

- Geen zware schaduwen in v1; diepte via **foto**, **veil**, **gradient**, en **OLIVE** vlakken.
- Splash boven content: `z-index` 40–55; tijdens `layoutId`-overgang rekent Framer op eigen projectielaag.

---

## 7. Do’s and don’ts

**Do**

- Houd **OLIVE + CREME + PP WHITE** als basis.
- Gebruik **layout-continuïteit** voor het woordmerk tussen splash en hero.
- Bied **skip** en **reduced-motion** respect (minder / geen lange sequentie).

**Don’t**

- Geen permanente klassieke logo-nav header (tenzij expliciet herontworpen).
- Geen willekeurige extra brandkleuren buiten palet + fototinten.
- Geen splash die alleen met muis te verlaten is (keyboard users).

---

## 8. Responsive behavior

- **Breakpoints:** Tailwind defaults; typografie via `clamp` waar het woordmerk schaalt.
- **Touch:** Skip en links voldoende groot; geen micro-targets op splash.
- **Kleine viewports:** Slideshow-box `max-w-md`, woordmerk `w-[min(92vw,44rem)]`.

---

## 9. Agent prompt guide (compact)

> Bouw UI voor **Poule & Poulette** Next.js site **ppsite** (keten België): tokens **OLIVE**, **CREME**, **PP WHITE**, **PP BLACK**, **LOLLYPOP**, **CHRISTMAS**. Fonts **Bacon Kingdom** + **Lino Stamp**. Geen klassieke top-header; hero-links **Menu** + **Locations**. Locaties alleen via **`src/content/locations.ts`** en **`/locations`** — geen externe ketensite als bron-URL. Respecteer `memory-bank/progress.md` en `docs/design-system-2.0.md`.

---

*Laatste sync: zie `memory-bank/progress.md` voor implementatiedatum en bestanden.*
