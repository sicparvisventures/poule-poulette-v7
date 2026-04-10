# Ultra Prompt - Marketing Beheerapp + Backend + Sync voor Poule & Poulette

## 1. Korte projectanalyse (huidige state)

### Stack en architectuur
- Frontend: Next.js 16.2.2 (App Router), React 19, TypeScript strict.
- Styling: Tailwind CSS v4 + CSS design tokens in `src/app/globals.css`.
- Motion: Framer Motion.
- Huidige backend: vrijwel geen CMS-backend; alleen 1 API route voor jobs sollicitatie:
  - `src/app/api/jobs/apply/route.ts`
- Hosting/deploy: Vercel (`vercel.json`).

### Huidig contentmodel (hardcoded in code)
Content is nu voornamelijk file-based in TypeScript:
- `src/content/deckSlides.ts` (home story slides)
- `src/content/menuSlides.ts` (/menu)
- `src/content/locations.ts` (/locations + detail)
- `src/content/groupsPage.ts` (/groepen)
- `src/content/jobsPage.ts` (/jobs)
- `src/content/marqueeBand.ts` (hero/deck marquee)
- `src/content/splashPolaroids.ts` (splash/deck polaroids)

### Huidige routes/pagina's
- `/` home experience
- `/menu`
- `/locations`
- `/locations/[slug]`
- `/jobs`
- `/groepen` (+ alias `/groups`)

### Assetstructuur
- Veel media in `public/images`, `public/locations`, `public/fotookes`, `public/videos`, etc.
- Nieuwe mobile slide SVG's aanwezig in `public/fotookes/1mobile.svg` ... `7mobile.svg`.

### Kernprobleem
- Marketing-copy, beelden, promoties en pagina-inhoud wijzigen vereist codewijzigingen/deploy.
- Geen centrale media library, geen versiebeheer voor content door niet-technische gebruikers, geen preview/publish workflow.

---

## 2. Copy-paste Ultra Prompt (voor AI team / agency / internal builders)

Gebruik de prompt hieronder letterlijk als opdracht voor het bouwen van een volledige beheersapp.

---

## ULTRA PROMPT START

Je bent een senior product + full-stack team (architect, backend, frontend, DevOps, QA, UX writer, CMS specialist).
Bouw een production-ready **Marketing Beheerplatform** voor de bestaande website van **Poule & Poulette**.

### Doel
Bouw een admin-app + backend waarmee marketing zonder developers:
1. afbeeldingen/video's kan uploaden en beheren,
2. copy kan aanpassen,
3. promoties/campagnes kan plannen,
4. content kan previewen,
5. publishen naar de live site,
6. en dit alles veilig, versieerbaar en auditbaar kan doen.

De bestaande website is Next.js App Router met veel hardcoded content in `src/content/*.ts` en assets in `/public/**`.
De nieuwe oplossing moet dit vervangen door een schaalbaar CMS-achtig systeem zonder het merkdesign te verliezen.

---

### Belangrijke randvoorwaarden

#### A. Bestaande website behouden
- De publieke site blijft visueel consistent met huidige merkstijl.
- Geen regressies in desktop/mobile UX.
- Contentbron verandert van file-based naar backend-driven.

#### B. Marketing-first beheer
- Niet-technische gebruikers moeten alles in UI kunnen beheren.
- Geen code edits nodig voor dagelijkse updates.

#### C. Veilig en professioneel
- Role-based access control.
- Audit logs.
- Draft/preview/publish workflow.
- Validaties en rollback mogelijk.

---

### Productscope (MVP+)

#### 1) Admin app
Bouw een aparte admin interface (bijv. `/admin` in zelfde repo, of aparte app in monorepo) met:
- Dashboard (status, geplande promoties, recente wijzigingen)
- Media Library (images/video/SVG upload, metadata, crops/focal point, alt text)
- Content Editor per domein:
  - Home
  - Menu
  - Locations
  - Jobs
  - Groepen
  - Global (marquees, footer, labels, SEO defaults)
- Promotion Manager:
  - promoties met start/einddatum
  - promo-banner/cta/copy/image
  - targeting per pagina/locatie/taal
- Preview en Publish center
- Versiehistoriek + diff view

#### 2) Backend API + database
Bouw backend met:
- PostgreSQL + Prisma (of equivalent typed ORM)
- REST of GraphQL API (met strikte schema's)
- Auth (NextAuth/Clerk/Auth0 of enterprise equivalent)
- RBAC rollen:
  - Super Admin
  - Marketing Editor
  - Publisher
  - Viewer

#### 3) Sync/publicatie-engine
Implementeer een duidelijke publish flow:
- Draft content in DB
- Preview tokenized URL's
- Publish maakt content live
- Public site gebruikt live snapshots
- Incremental invalidation/revalidation na publish

#### 4) Media pipeline
- Upload naar object storage (S3/R2/Cloudinary)
- Server-side metadata extractie (dimensies, type, file size)
- Focal point support
- Alt text verplichting waar relevant
- Varianten/formaten (webp/avif) voor performance
- Referentiecontrole: zie waar asset gebruikt wordt

#### 5) Internationalization-ready
- Minimaal NL/EN/FR voorbereid in datamodel
- Niet alles hoeft initieel vertaald, maar model moet localized fields ondersteunen

---

### Exacte contentmapping vanuit huidige code

Je moet de volgende hardcoded bronnen migreren naar beheerde entities:

#### `src/content/deckSlides.ts`
Entiteit: `HomeDeckSlide`
Velden:
- `id`, `order`
- `desktopImage`
- `mobileImage` (nieuw, op basis van `public/fotookes/*mobile.svg`)
- `kicker`, `title`, `body`
- `anchorId`
- `fullBleedImage` (boolean)
- `stickerAsset`
- `deckPolaroidsLeft` / `deckPolaroidsRightCluster`
- `assetFooter`
- `isActive`

#### `src/content/menuSlides.ts`
Entiteiten:
- `MenuSection`
- `MenuPageCopy`
- `MenuMarqueePhrase`
Velden inclusief:
- `src`, `label`, `kicker`, `blurb`, `connector`
- page copy: `title`, `intro`, `introBar`, `scrollHint`, `zoomClose`, `footnote`

#### `src/content/locations.ts`
Entiteiten:
- `Location`
- `LocationsPageCopy`
- `LocationsMarqueePhrase`
Velden:
- `slug/id`, `city`, `title`
- `addressLines[]`, `tel`, `mail`
- `mapsQuery`, `imageSrc`, `imageAlt`
- `detailIntro`, `openingHours[]`, `videoSrc`
- flags: `isFeatured`, `isActive`

#### `src/content/jobsPage.ts`
Entiteiten:
- `JobPosting`
- `JobsPageCopy`
- `JobsUIStrings`
- `JobApplicationSettings`
Velden:
- localized copy (NL/EN/FR)
- sections: responsibilities/profile/offer/practical/process
- form labels/messages localized

#### `src/content/groupsPage.ts`
Entiteiten:
- `GroupMenuTier`
- `GroupsPageCopy`
- `GroupsMarqueePhrase`

#### `src/content/splashPolaroids.ts`
Entiteiten:
- `SplashPolaroid`
- `DeckPolaroidPhoto`

#### `src/content/marqueeBand.ts`
Entiteit:
- `HeroDeckMarqueePhrase`

---

### Promotions/campaign requirements

Bouw een flexibel promotiesysteem:
- Entiteit `Promotion`
  - `name`, `status`, `startAt`, `endAt`
  - `priority`
  - `placement` (home hero, menu page, jobs page, global strip, etc.)
  - `copy` (localized)
  - `asset(s)`
  - `ctaLabel`, `ctaHref`
  - targeting: route(s), location(s), locale(s), device type optional
- Runtime regel: actieve promotie met hoogste prioriteit wint per placement
- Scheduler: auto activate/deactivate op tijd
- Preview exact zoals live

---

### UX eisen voor admin

- Clean editorial UI, snelle form-flow, bulk edit waar nuttig
- Geen modale chaos; duidelijke navigatie per contentdomein
- Every editable field met:
  - help text
  - validation
  - preview snippet
- Reorder via drag-and-drop voor slides/sections/locations
- Unsaved changes warning
- Autosave in draft (optioneel)

---

### Backend/API eisen

- Typed contracts (Zod/Valibot + OpenAPI of GraphQL schema)
- Input validation op server
- Rate limiting op write endpoints
- CSRF bescherming voor sessie-auth flows
- Secure file upload (mime + size checks)
- Webhook/event na publish voor cache invalidatie

---

### Public site integratie

Refactor publieke site zodat pagina's data laden vanuit backend i.p.v. `src/content/*.ts` hardcoded.

#### Strategie
1. Introduceer `ContentService` abstraction:
   - `getHomeContent()`
   - `getMenuContent()`
   - `getLocationsContent()`
   - `getJobsContent()`
   - `getGroupsContent()`
2. Achter deze service:
   - live API fetch met revalidation
   - fallback naar laatst bekende snapshot indien API down
3. Gebruik feature flag `CONTENT_SOURCE=api|file` voor veilige rollout.

---

### Data model (minimum)

Maak minimaal deze tabellen/collecties:
- `users`, `roles`, `user_roles`
- `audit_logs`
- `media_assets`
- `content_versions`
- `publish_releases`
- `home_deck_slides`
- `menu_sections`, `menu_page_copy`, `menu_marquee_phrases`
- `locations`, `locations_page_copy`, `locations_marquee_phrases`
- `jobs_postings`, `jobs_page_copy`, `jobs_ui_strings`, `job_application_settings`
- `groups_tiers`, `groups_page_copy`, `groups_marquee_phrases`
- `promotions`
- `global_settings`

Gebruik `locale`-aware structures voor copy (jsonb of linked translation table).

---

### Jobs formulier professionaliseren

Bouw professionele applicant pipeline:
- Form submissions in DB (`job_applications`)
- Status flow: `new -> reviewed -> contacted -> interviewed -> hired/rejected`
- Admin inbox met filters/sort
- Export CSV
- Optional email notifications
- Optional integrations:
  - Resend / SendGrid
  - Slack webhook

---

### PWA/asset governance

- Behoud bestaande PWA basis (manifest etc.)
- Zorg dat media uit CMS correct geoptimaliseerd wordt voor mobile/desktop
- Voeg richtlijnen toe in admin voor minimale resoluties per placement

---

### Kwaliteit, testing, observability

- Unit tests voor domain logic (publish rules, promotions precedence)
- Integration tests voor API
- E2E tests voor kernflows:
  - edit -> preview -> publish
  - media upload -> assign -> live
  - promo schedule activation
- Logging + error tracking (Sentry)
- Basic analytics events in admin (optioneel)

---

### Beveiliging en compliance

- Strong auth + session management
- Least privilege RBAC
- Audit trail van alle publish actions
- Soft delete voor content waar nuttig
- Backup/restore plan (DB + media metadata)

---

### Performance targets

- Public pages moeten Lighthouse-performance niet significant schaden
- API responses voor content: p95 < 300ms (cache warm)
- Image delivery via CDN

---

### Migratieplan (verplicht)

Genereer een concreet stappenplan:
1. Schema opzetten
2. Seed script schrijven dat bestaande `src/content/*.ts` in DB importeert
3. Read path via `ContentService` toevoegen (read-only)
4. Admin app voor edit/publish bouwen
5. Gefaseerde rollout per route:
   - `/jobs`
   - `/locations`
   - `/menu`
   - `/`
   - `/groepen`
6. Hardcoded content pas verwijderen na acceptatie

---

### Deliverables die je moet opleveren

1. Architectuurdocument (ADR's)
2. ERD + datamodel
3. Werkende admin app
4. Werkende backend API
5. Public site integratie met feature flags
6. Migraties + seed scripts
7. Testsuite + CI checks
8. Runbook voor marketingteam (how-to)
9. Rollback plan
10. Definition of Done checklist

---

### Definition of Done (samenvatting)

- Marketing kan zonder code:
  - images uploaden
  - copy aanpassen
  - slides reorderen
  - promoties plannen
  - previewen en publishen
- Live site synchroniseert correct na publish
- Geen regressies in bestaande design/UX
- Audit en security op professioneel niveau

## ULTRA PROMPT END

---

## 3. Aanbevolen implementatiekeuzes (praktisch)

Als je dit promptdocument intern doorgeeft, raad ik aan om expliciet mee te geven:
- Backend: PostgreSQL + Prisma + Next.js Route Handlers
- Auth: NextAuth met enterprise provider of Clerk
- Media: Cloudflare R2 of S3 + CDN
- E-mail/jobs: Resend
- Feature flags: eenvoudige env flag + DB toggles
- Preview: signed preview token + draft mode

---

## 4. Bonus: extra eisen voor marketing comfort

- Inline beeldbewerking (crop/focal point)
- Copy templates voor seizoenscampagnes
- "Duplicate promotion" knop
- Bulk locale fallback (bijv. FR fallback op EN)
- "What changed" release summary bij publish
- "Undo publish" naar vorige release

---

## 5. Bestandsreferenties in huidige codebase

Belangrijkste huidige bronnen:
- `src/content/deckSlides.ts`
- `src/content/menuSlides.ts`
- `src/content/locations.ts`
- `src/content/jobsPage.ts`
- `src/content/groupsPage.ts`
- `src/content/marqueeBand.ts`
- `src/content/splashPolaroids.ts`
- `src/app/api/jobs/apply/route.ts`
- `src/components/**`
- `public/**`

Gebruik deze als migratiebron, niet als eindtoestand.
