# Image & asset prompts — Poule & Poulette (ppsite)

Dit document is geschreven zodat **ChatGPT (of een andere image-generator) zonder projectcontext** bruikbare beelden kan maken die passen bij **Design System 2.0** en de **ppsite**-build. Kopieer de blokken **integraal** naar je generator; voeg eventueel “no text in image” toe als je generator zelf tekst lelijk tekent — dan gebruik je alleen vorm/texture en laat je copy in CSS/HTML lopen.

---

## 0. Lees dit eerst (context voor de AI)

- **Wat is dit:** De nieuwe **hoofdwebsite** voor de restaurantketen **Poule & Poulette** in **België** (meerdere steden). Geen enkel-stad site.
- **Merkgevoel:** Warm, speels, **handgetekend** waar het kan, **niet** corporate SaaS. Denk: terras, kip/gerechten, mensen, **doodles** in donkergroen op lichte achtergrond (zoals in de officiële styleguide).
- **Referentiesites (gedrag, geen kleurovername):**
  - **pizarrosliceshop.be** — zeer **editorial** typografie, **grote woorden** op de hero, **minimale klassieke header**, soms **preloader**, **horizontale storytelling**-gevoel.
  - **taqueriarico.com** — bij scrollen voelt de site als **presentatie**: secties die **breed** en **bold** zijn, soms **horizontale beweging** gekoppeld aan verticale scroll.
- **Onze technische opzet:** Boven een **donkergroene (OLIVE) hero**, daaronder een **smalle overgangsband** (deze prompts), dan een **zwarte “Prezi-achtige” deck-sectie** met horizontaal schuivende slides. We willen dat de band visueel **lijmt** tussen groen en zwart.
- **Bestaande code:** Er is al een **CSS-marquee** met tekst; een **gegenereerde texture/illustratie** kan als **overlay** boven die gradient (PNG met transparantie of multiply-blend) geplaatst worden.

---

## 1. Canoniek kleurpalet (altijd in prompts vermelden)

Gebruik deze **exacte HEX-codes** (Design System 2.0):

| Token | HEX | Gebruik in beeld |
|--------|-----|-------------------|
| **OLIVE** | `#1c3834` | Diep bosgroen — achtergronden, doodles, tape-rand |
| **CHRISTMAS** | `#93231f` | Diep bordeaux — spaarzaam, accent |
| **LOLLYPOP** | `#f495bd` | Fel roze — kleine accenten, geen neon |
| **CREME** | `#fdf8c1` | Zacht geel-crème — highlights, “papier” |
| **PP WHITE** | `#fbfbf1` | Off-white — lichte vlakken |
| **PP BLACK** | `#060709` | Bijna zwart — onderkant overgang, diepte |

**Verboden in merkbeelden:** fel neon, generieke “AI gradient paars”, stock-foto watermerken, logo’s van andere merken.

---

## 2. Typografie (beschrijving voor sfeer — geen fontbestanden in de generator)

- **Display / woordmerk-stijl:** Dik, **organisch**, licht **ongeveer** / “brushy”, vergelijkbaar met een **custom display font** (in productie: *Bacon Kingdom*). Geen strak Helvetica als hoofdlook in illustraties.
- **UI / kleine tekst:** Iets **monoline** of **stempelachtig**, informeel (in productie: *Lino Stamp*).
- **In gegenereerde beelden:** Liever **geen leesbare lange zinnen** tenzij je generator tekst goed kan; gebruik anders **abstracte typografie-vormen** of **latijnse placeholder**.

---

## 3. Lokale inspiratiebestanden (repo — paden om te bestuderen vóór je ontwerpt)

Onder **`/Users/dietmar/ppwebsitev5/public/`** (monorepo-root, niet alleen `ppsite/`):

- **`public/images/Styleguide_PP-01.png` … `Styleguide_PP-18.png`** — logo-regels, **kleurtable**, **doodles**, social voorbeelden.
- **`public/images/generated/`** o.a.:
  - `olive-halftone-01.png` — **halftone** in merkgroen.
  - `olive-texture-01.png` — textuur referentie.
  - `tape-pack-01.png` — **tape / plakband**-esthetiek.
  - `polaroid-frames-01.png` — **polaroid**-compositie.
  - `styleguide-summer-sheet.png`, `styleguide-winter-sheet.png` — campagne-sfeer.
- **Food / sfeer:** `bronzemenu.jpg`, `goldmenu.jpg`, `silvermenu.jpg` — warme hout/metaal-tonen (niet als vaste hex, wel als harmonie-check).
- **Foto’s keten:** `public/fotookes/` — terras, sfeer (o.a. `PP_Mechelen-1.png`).

**Prompt-instructie aan de AI:** “Study the *color discipline* and *doodle density* of a multi-page restaurant brand PDF exported as PNGs named Styleguide_PP-09 (palette) and Styleguide_PP-11 (doodles on light background).”

---

## 4. Masterprompt — horizontale “tape / band” tussen OLIVE en BLACK

**Doel:** Één **breed** beeld dat **boven** donkergroen en **onder** bijna-zwart visueel **overvloeit**. Gebruik als **header strip** (full width), eventueel **tileable** horizontaal.

**Technische specificaties (voor web):**

- **Aspectverhouding:** `16:1` tot `12:1` (bijv. **3840 × 240 px** of **4096 × 256 px**).
- **Modus:** PNG met **alpha** waar nodig, of **onderste helft fade naar pure black** `#060709` en **bovenkant fade naar** `#1c3834`.
- **Seamless:** Linker- en rechterrand **naadloos te tegelen** (herhalend patroon) voor brede schermen.
- **Inhoud (stijl):**
  - Dunne **washi-tape** of **gerimpelde papieren strip** in **CREME** `#fdf8c1` met **subtiele schaduw** op OLIVE.
  - **Lichte paper fiber** noise, niet vuil.
  - **Micro-doodles** in OLIVE (kleine hartjes, sterretjes, kippetjes-silhouet **abstract**, geen gedetailleerde anatomie) — **5–8%** oppervlak, niet druk.
  - **Optioneel:** zeer zachte **halftone dots** in OLIVE (`#1c3834`) die naar transparant vervagen richting zwart — referentie: “olive halftone restaurant brand”.
- **Geen** grote contrasterende rode vlakken behalve **max 2%** CHRISTMAS `#93231f` als **accentstreepje**.

**Engelse prompt (copy-paste):**

> Ultra-wide horizontal seamless web banner, 3840×240 pixels, RGB. Top 45% blends from deep forest green #1c3834 (OLIVE) downward; bottom 55% transitions smoothly into near-black #060709 (PP BLACK). Subtle washi-tape or torn paper strip motif in warm cream #fdf8c1 with soft shadow. Very light paper texture. Tiny hand-drawn doodle silhouettes in #1c3834 only (abstract stars, hearts, simple chicken shapes) covering less than 8% of area. Optional soft halftone dot fade in olive green, like a premium fast-casual restaurant brand guideline. Seamless left-right tiling, no text, no logos, no watermark, no purple gradients, photorealistic paper lighting, high resolution.

**Negatieve prompt (toevoegen):**

> text, letters, watermark, stock photo, people faces, neon colors, purple, cyan magenta gradients, 3D glossy UI, Apple-style minimalism, other restaurant logos.

---

## 5. Variant — “marquee tape” met **lege** vlaggen voor eigen tekst (optioneel)

Als je wél een **visueel spoor** wilt waar later HTML-tekst overheen ligt:

- Zelfde afmetingen, maar **centrale strook** **CREME** `#fdf8c1` als **vlak veld** (60% hoogte band) met **licht gerafelde boven/onderrand** (torn paper).
- **Geen tekst** in het beeld — alleen **negatieve ruimte** voor marquee.

**Prompt:**

> Same dimensions and palette as previous. Horizontal brand divider strip. Center 60% height is flat cream #fdf8c1 “blank label” area with subtle torn-paper top and bottom edges for a scrolling text overlay in CSS. Outer areas blend #1c3834 into #060709. Seamless horizontal tile. No typography in image.

---

## 6. Prezi-deck: laagstructuur (hoe we composities later opbouwen)

Per **slide** (full viewport op desktop) voorzien we **lagen** (Z-order):

1. **Achtergrondlaag** — effen `#060709` of zeer donkere foto met **veil** (zwart 23% opacity).
2. **Texture / halftone** — `olive-halftone` stijl, **low opacity** (10–18%).
3. **Fotolaag** — terras / gerecht / team; **crop** editorial (niet altijd gecentreerd).
4. **Doodle-overlay** — losse PNG **OLIVE** op transparant, **multiply** of **normal** 35–70%.
5. **Polaroid / frame-laag** — optioneel `polaroid-frames` stijl.
6. **Typografie** — in code (Framer/React), niet in de render van de foto.

**Prompt-set — “slide achtergrond module” (herbruikbaar):**

> Full-bleed 16:9 restaurant editorial background, near-black #060709 base, subtle olive #1c3834 halftone dots in upper third fading out, soft vignette, warm analog grain, Belgian casual dining mood, no text, no logo, high-end website hero, not gloomy.

**Prompt-set — “doodle sheet fragment” (transparante PNG):**

> Transparent PNG, isolated hand-drawn doodles in solid #1c3834 only, playful restaurant icons (abstract chicken drumstick, heart, star, leaf), chunky ink brush, scattered composition for overlay on dark photo, no background fill, no text.

**Prompt-set — “polaroid stack”:**

> Transparent PNG, three slightly rotated polaroid frames empty white centers, soft shadow, cream tape pieces #fdf8c1, brand colors only #1c3834 #fdf8c1 #060709 accents, no photos inside frames, no text.

---

## 7. Per-slide richting (inhoudelijk — placeholders in code blijven tot vervanging)

| Slide-rol | Visuele richting | Prompt-kern |
|-----------|------------------|-------------|
| Verhaal & sfeer | Terras / mensen / warm licht | “outdoor dining Belgium, warm sunset, olive green color grade touches, not stock-smiling actors” |
| Keuken & smaak | Close-up food, hout/marmer | “rustic chicken dish, shallow depth of field, steam, wooden table, colors harmonize with #1c3834 and #93231f accents sparingly” |
| Door het land | Collage / kaart-abstract | “abstract Belgium map made of food photography tiles, no readable map labels, brand colors” |
| Kom langs | CTA-sfeer, deur / neon zacht | “restaurant entrance dusk, one subtle pink accent #f495bd small highlight only” |

Voeg steeds toe: **no text, no logo, no watermark**.

---

## 8. Interactieve / motion elementen (niet als statische PNG)

Voor **later** (GSAP / Three.js / Lottie):

- **Micro-interactie prompt (concept art):** “isometric chicken icon in #1c3834 line art, three frames subtle wing flap, flat colors, sprite sheet 512×512, transparent.”
- **Cursor / hover state:** niet nu verplicht; houd **contrast op OLIVE en BLACK** aan.

---

## 9. Floating knoppen (Jobs / Reserve) — design richtlijn

Deze zijn **UI in code** (pill buttons), geen render nodig. Als je toch een **texture** wilt:

> Two rounded pill buttons left and right, left pill fill #1c3834 with cream #fdf8c1 border, right pill fill #93231f with cream border, soft shadow on #060709 backdrop, isometric light from top-left, no text on buttons in image (text added in HTML).

---

## 10. Export- en implementatiechecklist

- [ ] **Tape/band:** PNG, **breed**, test op **retina** (2× export).
- [ ] **Transparantie:** Alpha alleen waar nodig; anders harde onderkant `#060709`.
- [ ] **Bestandsnaam suggestie:** `public/images/generated/pp-hero-deck-tape-01.png`
- [ ] In Next.js: `Image` of `background-image` met `mix-blend-mode: multiply` of `opacity` — **niet** de marquee-tekst vervangen tenzij je tekst in het beeld wilt (meestal **nee**).
- [ ] **Contrast:** WCAG voor **tekst op band** blijft in CSS (creme op groen/zwart).

---

## 11. Korte “system prompt” voor ChatGPT vóór je genereert

> You are generating brand assets for Poule & Poulette, a Belgian multi-city casual restaurant chain. Strict palette: OLIVE #1c3834, CHRISTMAS #93231f, LOLLYPOP #f495bd, CREME #fdf8c1, PP WHITE #fbfbf1, PP BLACK #060709. Style: warm, hand-drawn doodles allowed sparingly, editorial food photography mood, no generic AI purple gradients, no text unless explicitly requested, no third-party logos. Output specs will follow per image.

---

## 12. Onderhoud

Wanneer nieuwe **foto’s of video’s** per locatie binnenkomen: voeg **niet** automatisch vreemde kleuren toe — check tegen **Styleguide_PP-09** (palette sheet). Update **`src/content/deckSlides.ts`** en **`chainLocations`** met echte paden; dit document blijft de **prompt-bibliotheek**.
