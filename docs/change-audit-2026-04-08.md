# Change Audit — bestaande wijzigingen in `ppsite`

Datum: 2026-04-08
Doel: in kaart brengen welke niet-gecommitte wijzigingen al aanwezig zijn, voordat we `/locations`, `/menu` en eventueel de home/deck verder aanpassen.

## Samenvatting

Er staat al een substantiële refactor klaar op de home/deck-kant. Die raakt precies de bestanden die jij eerder noemde rond de verticale seam/divider:

- `src/app/globals.css`
- `src/components/home/PresentationDeck.tsx`

Daarnaast zijn er ook nieuwe componenten en assets toegevoegd die de homepagina opdelen in herbruikbare delen. Dit betekent dat we wijzigingen aan `/locations` en `/menu` veilig apart kunnen doen, maar dat elke verdere ingreep in de deck-divider best gebeurt met respect voor deze bestaande refactor.

## Gewijzigde tracked files

### `src/app/globals.css`

Bestaande wijziging:
- Nieuwe CSS-class `.pp-deck-vertical-marquee-inner`
- Nieuwe keyframes `@keyframes pp-marquee-scroll-y`

Interpretatie:
- Dit is de basisanimatie voor de verticale seam/divider tussen deck slides.
- Deze wijziging is klein maar rechtstreeks relevant voor jouw opmerking over de CHRISTMAS-strook en divider-styling.

Risico:
- Hoog voor overlap als we de divider willen herwerken.
- Laag voor `/locations` en `/menu` op zich.

### `src/app/layout.tsx`

Bestaande wijziging:
- Toevoeging van `next/script`
- Injectie van een extern script:
  - `https://script.keak.com/v1/1589`
  - `data-domain="1589"`

Interpretatie:
- Dit lijkt los te staan van `/locations` en `/menu`.
- Mogelijk analytics, widget of third-party integratie.

Risico:
- Laag voor de gevraagde UI-opfrissing.
- Niet aanraken tenzij expliciet nodig.

### `src/components/home/HomeExperience.tsx`

Bestaande wijziging:
- Grote refactor van de home-flow
- Introductie van:
  - `DesktopHorizontalHomeStory`
  - `HomeHeroPrimary`
- Nieuwe conditionele rendering voor desktop horizontal story
- Grote hoeveelheid bestaande hero/deck markup verhuisd naar opgesplitste componenten
- Jobs / reserve / footer panelen in horizontale desktop journey geïntegreerd

Interpretatie:
- De homepagina is actief in heropbouw.
- Dit is geen kleine styling tweak maar een structurele reorganisatie.

Risico:
- Hoog voor extra home-wijzigingen zonder eerst goed af te stemmen.
- Geen directe blocker voor `/locations` of `/menu`.

### `src/components/home/PresentationDeck.tsx`

Bestaande wijziging:
- Uitbreiding van imports:
  - `deckSlideAssetFooter`
  - `DeckSlide`
  - `heroDeckMarqueePhrases`
  - `useViewportWidth`
- Nieuwe helper-functies:
  - `deckImageUnoptimized`
  - `DeckSlideBodyParagraphs`
  - `DeckSlideSticker`
  - `DeckSlideSeamSticker`
  - `DeckDesktopSlideArticle` (export)
- Mobiele deck-presentatie herwerkt
- Desktop deck-presentatie herwerkt
- Titel/copy aangepast van generieke presentatiecopy naar merkcopy
- Progress indicator visueel aangepast

Interpretatie:
- Dit bestand bevat al jouw seam/divider-richting:
  - verticale marquee
  - kerstkleurige seam-sticker
  - overlap op slide-rand
  - grotere typografie en dots
- De verandering is inhoudelijk relevant voor jouw feedback “dit ziet er raar uit niet mooi”.

Belangrijk detail:
- De huidige code gebruikt al een `DeckSlideSeamSticker` op de slide-rand, maar visuele afwerking en system-fit zijn nog niet gevalideerd.
- Het probleem lijkt dus niet “ontbreekt”, maar “implementatie bestaat al en voelt nog niet goed genoeg”.

Risico:
- Hoog voor overlap als we dit nu meteen aanpassen zonder eerst te beslissen.

### `src/content/deckSlides.ts`

Bestaande wijziging:
- `DeckSlide` type uitgebreid met:
  - `stickerSrc?`
  - `fullBleedImage?`
  - `assetFooter?`
- Nieuwe helper `deckSlideAssetFooter(...)`
- Eerste slide vervangen door nieuw full-bleed beeld:
  - `/images/slide1v2.svg`
- Sticker gekoppeld:
  - `/images/kroonroze.png`
- Eerste slide-copy uitgezet (`kicker`, `title`, `body` leeg)
- `assetFooter: false`

Interpretatie:
- Er is al actief gewerkt aan de “kroon / first slide / full bleed” setup waar jij naar verwees.

Risico:
- Hoog voor overlap met verdere deck-visuele tweaks.

## Nieuwe untracked files

### Nieuwe componenten

- `src/components/home/DesktopHorizontalHomeStory.tsx`
- `src/components/home/HomeHeroPrimary.tsx`
- `src/hooks/useViewportWidth.ts`

Interpretatie:
- Er is al begonnen met het opdelen van home in meer onderhoudbare modules.
- `useViewportWidth.ts` vervangt de eerdere inline helper en is netjes geïsoleerd.

### Nieuwe assets

- `public/images/kroonroze.png`
- `public/images/slide1.svg`
- `public/images/slide1v2.svg`

Bestandsgrootte:
- `kroonroze.png`: 1.4 MB
- `slide1.svg`: 5.5 MB
- `slide1v2.svg`: 7.7 MB

Interpretatie:
- Dit zijn zware assets, vooral de SVG’s.
- Visueel waarschijnlijk bedoeld voor de vernieuwde deck-first-slide.
- Qua performance is dit iets om later mee te nemen, maar geen onmiddellijke blocker voor de `/locations` en `/menu` fixes.

## Inhoudelijke conclusie

### Wat er al veranderd is

Er is al een duidelijke work-in-progress rond:
- de home hero
- de horizontal desktop storytelling
- de deck divider / seam
- de eerste slide met crown/full-bleed assets

### Wat nog niet in deze worktree lijkt te zitten

Ik zie nog geen lokale wijzigingen in:
- `src/components/locations/LocationsVirtualExperience.tsx`
- `src/components/locations/LocationDetailView.tsx`
- `src/components/menu/MenuVirtualExperience.tsx`
- `src/components/FixedPageIntroStrip.tsx`
- `src/content/locations.ts`
- `src/content/menuSlides.ts`

Dat is goed nieuws: de gevraagde refresh voor `/locations` en `/menu` kunnen we waarschijnlijk veilig los uitvoeren, zonder de bestaande home/deck-refactor te verstoren.

## Aanbevolen beslissingskader

### Veilig om nu los aan te pakken

- `/locations` mosaic moderner en mobielvriendelijker maken
- detailview van locaties opschonen
- alle verwijzingen naar `poulepoulette.com` uit de locations-ervaring halen waar ze fout/ongewenst zijn
- `/menu` ondernavigatie vervangen van bolletjes naar pijlen
- `/menu` zoom-modal pijltjes corrigeren
- intro-strip/pop-up leesbaarder maken op `/menu` en `/locations`

### Eerst expliciet afstemmen

- nieuwe iteratie op de home/deck seam divider
- wijzigingen aan `PresentationDeck.tsx`
- wijzigingen aan `globals.css` die de divider/vertical marquee beïnvloeden
- eventuele optimalisatie of vervanging van `slide1.svg` / `slide1v2.svg`

## Mijn advies

Beste volgorde:
1. Eerst `/locations` en `/menu` volledig afwerken.
2. Daarna apart een gerichte design-pass op de home/deck seam divider doen.

Zo vermijden we dat we tegelijk in een actieve refactor én in de requested page-refresh gaan knippen.
