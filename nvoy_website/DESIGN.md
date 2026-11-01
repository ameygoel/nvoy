# Nvoy — design notes

Kept in the repo so every future change stays on-brand.

## Brand
- Logo: white serif N + script "voy" with an arrow swoosh on deep navy. Files in `assets/img/`:
  `logo-white.png` (for navy backgrounds), `logo-navy.png` (for light backgrounds), `logo-original.jpg`.
- Voice: a knowledgeable friend who books hotels for a living. Plain, warm, specific. Sentence case everywhere.

## Colour tokens (CSS custom properties in `assets/css/style.css`)
| Token | Hex | Use |
|---|---|---|
| `--navy` | `#042C50` | Logo navy. Hero, "Why Nvoy" band, footer, headings on light |
| `--navy-deep` | `#021A33` | Footer bottom, hero depth |
| `--ink` | `#1C2B3A` | Body text on light |
| `--paper` | `#FFFDF9` | Page background |
| `--sand` | `#F2E5CC` | Warm band behind the enquiry form, chips |
| `--sand-deep` | `#E3CDA2` | Sand borders, postcard edge |
| `--coral` | `#F2644A` | The one accent: perk stamp, primary buttons, focus ring |
| `--coral-deep` | `#C9432E` | Button hover / pressed |
| `--sun` | `#F3B54A` | Tiny: star rating, "featured" dot |

Rule: navy is the dominant colour, sand is a band not a page, coral is used once per component at most.

## Type
- Display: **Fraunces** (variable, self-hosted). Headlines, hotel names, big numbers. Optical size on, `SOFT` axis ≈ 40 so it feels friendly, not stuffy.
- Text: **Figtree** (variable, self-hosted). Everything else.
- Scale: 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 (hero clamps up to 84 on wide screens). Body line-height 1.6, display 1.05.
- No all-caps labels, no single-word colour accents inside headlines, no "→" glued onto links.

## Layout concept
Left-aligned editorial page on a 12-column grid, max width 1200px, 24px gutters (16px on phones).

```
┌──────────────────────────────────────────────────────────┐
│ logo            Deals  Why Nvoy  About  Contact  [WhatsApp]│  nav, navy
├──────────────────────────────────────────────────────────┤
│  Hotel stays with            ┌───────────────┐            │  hero, navy
│  the good stuff included.    │ featured deal │ ← postcard │
│  sub + [See deals] [Plan]    │  photo+stamp  │   lands    │
├──────────────────────────────────────────────────────────┤
│  Deals on the board   [All] [Beach] [City] [Honeymoon]    │  paper
│  ┌postcard┐ ┌postcard┐ ┌postcard┐                         │
│  └────────┘ └────────┘ └────────┘  (3 / 2 / 1 columns)    │
├──────────────────────────────────────────────────────────┤
│  What booking through Nvoy gets you — amenity list        │  navy band
├──────────────────────────────────────────────────────────┤
│  About (photo | text)         Testimonials                │  paper
│  Instagram strip                                          │
├──────────────────────────────────────────────────────────┤
│  Plan my trip — enquiry form (2 col) + WhatsApp           │  sand band
├──────────────────────────────────────────────────────────┤
│  footer                                                   │  navy-deep
└──────────────────────────────────────────────────────────┘
```

## The one memorable thing
Deals are **postcards**. Photo on the front, a slightly rotated coral **stamp** carrying the perk ("4th night free"), typed details underneath. The hero's featured postcard is the single page-load animation: it slides in and the stamp presses on. Nothing else moves on its own.

## What was deliberately avoided
- Cream page + serif + terracotta (the generic "AI travel site"): navy leads instead, sand is a band, coral is vivid not clay.
- Identical rounded cards with one soft grey shadow: postcards have a paper edge and a stamp, not a shadow kit.
- Eyebrow labels, numbered 01/02/03 markers (nothing here is a sequence), middle-dot meta strings.
