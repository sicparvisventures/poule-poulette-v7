# Implementatieplan — `/locations`, `/menu` en later deck divider

Datum: 2026-04-08
Status: voorstel, nog niet uitgevoerd

## Doel

De site cleaner, officiëler en meer afgewerkt maken, zonder de bestaande home/deck-refactor te verstoren.

## Scopevoorstel

### Fase 1 — `/locations` en `/menu` veilig uitvoeren

Deze fase raakt alleen bestanden die momenteel geen lokale worktree-wijzigingen hebben.

Beoogde bestanden:
- `src/components/locations/LocationsVirtualExperience.tsx`
- `src/components/locations/LocationDetailView.tsx`
- `src/components/menu/MenuVirtualExperience.tsx`
- `src/components/FixedPageIntroStrip.tsx`
- `src/content/locations.ts`
- `src/content/menuSlides.ts`

### Fase 2 — deck divider / home seam apart bekijken

Deze fase pas starten na akkoord, omdat ze overlap heeft met bestaande wijzigingen.

Beoogde bestanden:
- `src/components/home/PresentationDeck.tsx`
- `src/app/globals.css`
- eventueel `src/content/deckSlides.ts`

## Fase 1 — concreet plan

### 1. Intro-strip op `/menu` en `/locations` leesbaarder maken

Probleem:
- De vaste strip met uitleg en de knop `Sluit` is nu te compact en leest onrustig.

Aanpak:
- Grotere typografie en iets meer verticale ruimte
- Betere contrastverhouding en rustiger visuele hiërarchie
- Dismiss-knop visueel meer als echte action-chip
- Copy compacter en minder technisch laten aanvoelen
- Werkt op mobile en desktop zonder de content te verstikken

Waarschijnlijke file:
- `src/components/FixedPageIntroStrip.tsx`

### 2. `/menu` ondernavigatie van bolletjes naar pijlen ombouwen

Probleem:
- De bolletjes met cijfers voelen minder natuurlijk dan links/rechts navigatie.

Aanpak:
- Onderste navigatie vervangen door duidelijke pijlen links/rechts
- Eventueel kleine contextregel met huidige spread/pagina behouden
- Zelfde patroon op mobile en desktop waar logisch
- Navigatie disabled state duidelijk tonen aan begin/einde

Waarschijnlijke file:
- `src/components/menu/MenuVirtualExperience.tsx`

### 3. `/menu` zoomweergave: vorige/volgende pijlen fixen

Probleem:
- Keyboard navigation werkt, klik op de pijlen blijkbaar niet betrouwbaar.

Waarschijnlijke oorzaak:
- Click bubbling / overlay close gedrag rond de modalheader

Aanpak:
- Klik-events lokaal afvangen waar nodig
- Vorige/volgende knoppen expliciet klikbaar maken zonder backdrop-conflict
- Ook mobiele touch targets vergroten

Waarschijnlijke file:
- `src/components/menu/MenuVirtualExperience.tsx`

### 4. `/locations` mosaic herontwerpen

Probleem:
- Desktop is oké-ish, maar het mozaïek kan moderner, cleaner en mobielvriendelijker.
- De huidige eerste splash-tile verwijst nog naar externe officiële site-logica die hier niet meer klopt.

Aanpak:
- Splash-tile ombouwen naar interne brand tile of editorial tile
- Meer uitgesproken card hierarchy
- Minder “gelijke vierkanten”, meer ritme en lucht
- Mobiel eerst: betere scanbaarheid en grotere tappable cards
- Desktop: editorial mosaic met modernere compositie
- Informatie op de cards reduceren tot wat echt nodig is

Waarschijnlijke files:
- `src/components/locations/LocationsVirtualExperience.tsx`
- `src/content/locations.ts`

### 5. `/locations` detailview opschonen

Probleem:
- Detailview is al goed, maar nog niet volledig “officiële site”-waardig.
- Externe verwijzingen naar `poulepoulette.com` moeten eruit.

Aanpak:
- CTA-set vereenvoudigen
- Verwijzingen naar “officiële site” verwijderen
- Fallback-teksten herschrijven zodat deze site zelf de primaire bron is
- Visuele verfijning van spacing, typografie en action-row
- Pagina meer polished maken zonder het huidige goede fundament te verliezen

Waarschijnlijke files:
- `src/components/locations/LocationDetailView.tsx`
- `src/content/locations.ts`

### 6. Contentlaag opschonen

Probleem:
- In de content files staan nog meerdere teksten die doorverwijzen naar `poulepoulette.com`.

Aanpak:
- Alle ongewenste externe verwijzingen verwijderen of herschrijven
- Copy aanpassen zodat deze site de canonieke ervaring wordt
- Waar contact ontbreekt: neutrale copy gebruiken in plaats van externe doorverwijzing

Waarschijnlijke files:
- `src/content/locations.ts`
- eventueel `src/content/menuSlides.ts`

## Fase 1 — acceptatiecriteria

### `/menu`
- Overlaystrip is leesbaar op mobile en desktop
- Onderste navigatie gebruikt pijlen in plaats van nummerbollen
- In zoom-modal werken vorige/volgende knoppen met muis en touch
- Keyboard navigation blijft werken

### `/locations`
- Geen ongewenste verwijzingen naar `poulepoulette.com` als “meer info”-bestemming
- Mosaic voelt moderner en mobielvriendelijker
- Detailview voelt clean en afgewerkt
- Volledige weergave behoudt de sterke onderdelen van de huidige versie

## Fase 2 — deck divider / seam sticker

Niet meteen uitvoeren zonder extra akkoord.

### Huidig vertrekpunt
- Vertical marquee bestaat al
- CHRISTMAS seam-sticker bestaat al
- Crown/full-bleed eerste slide bestaat al in worktree

### Waarom nog niet meteen doen
- Bestanden zijn al lokaal aangepast
- Jouw feedback gaat over kwaliteit van de bestaande poging, niet over afwezigheid van implementatie
- Beter eerst `/locations` en `/menu` afronden, dan de divider in een gerichte design-pass opnieuw beoordelen

### Voorstel voor latere design-pass
- divider minder “los element”, meer systemische seam
- breedte, schaduw en rand subtieler afstemmen op design system
- overlap met crown expliciet valideren
- testen op desktop breakpoint waar de seam het meest zichtbaar is
- eventueel eenvoudiger en rustiger dan de huidige marquee-uitvoering als dat visueel sterker blijkt

## Aanbevolen beslissing

Mijn voorstel:
1. Nu Fase 1 uitvoeren
2. Daarna apart Fase 2 doen voor `PresentationDeck` en `globals.css`

Dat is de veiligste route met het minste risico op het stuk werk dat al in je worktree zit.
