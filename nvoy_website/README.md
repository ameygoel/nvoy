# Nvoy — website

The public site for Nvoy, an independent Fora travel advisory. A static site: no build step, no database. Everything that changes often lives in two small files.

| File | What it controls |
|---|---|
| `deals.json` | The deal board. Add, edit or remove deals here. |
| `config.json` | Your name, email, WhatsApp number, Instagram handle, the About text, perks list, recently booked stays, testimonials, FAQ. |
| `hotels.json` | The hotels in the "Explore perks by hotel" dropdown: name, city, region, which programmes each belongs to, any hotel-specific perks or terms. |
| `programs.json` | The partner programmes (Marriott STARS, Hyatt Privé, IHG Destined…), the brands under each and their typical perks. Powers the programme tiles and the perks explorer. |

Everything else (`index.html`, `assets/`) is the design. `DESIGN.md` records the palette, type and layout decisions so future changes stay on-brand.

## Adding or removing a deal

Open `deals.json` (on GitHub: click the file, then the pencil icon). Each deal looks like this:

```json
{
  "id": "six-senses-laamu",
  "hotel": "Six Senses Laamu",
  "city": "Maldives",
  "destination": "Laamu Atoll",
  "country": "Maldives",
  "region": "Asia",
  "perk": "4th night free",
  "perks": ["4th night free", "Daily breakfast for two", "$100 resort credit", "Upgrade on arrival when available"],
  "terms": ["Minimum 4 nights", "Book by 15 December 2026", "Travel 10 January to 30 April 2027"],
  "bookBy": "2026-12-15",
  "travelFrom": "2027-01-10",
  "travelTo": "2027-04-30",
  "priceFrom": "1,150",
  "currency": "USD",
  "image": "assets/img/deals/six-senses-laamu.jpg",
  "art": "island",
  "note": "The only resort in Laamu. Surf break out front, manta season from January."
}
```

- **To add a deal**: copy one block, paste it after the previous one (mind the comma between blocks), change the values. `id` must be unique.
- **To remove a deal**: delete its block, or just set `bookBy` to a past date. Expired deals hide themselves.
- **Card height**: every card is the same height (`--card-h` in style.css, 940px). A deal with a long note or many terms scrolls inside the card; the photo, dates line and button stay put, and a soft fade shows when there is more below.
- **To check every deal photo**: open `photo-check.html` on the live site (it is not linked anywhere). It loads each photo in your browser and lists the ones that fail or are too small.
- **To queue a deal that isn't bookable yet**: add `bookFrom` (YYYY-MM-DD). The card stays hidden until that date and appears on its own.
- **Perks and terms** are two separate lists on the card: `perks` is what the guest gets, `terms` the conditions (minimum nights, lead time, prepayment, blackout dates).
- **Photos**: put a JPG in `assets/img/deals/` and point `image` at it, or paste a full `https://` URL. If the photo is missing, the site draws a sunset illustration in the style named by `art` (`island`, `coast`, `city`, `mountain`, `desert`, `jungle`).
- **Region** becomes the filter chips above the board and **city** feeds the city dropdown (which only lists cities inside the chosen region). Use the same spelling across deals. All eight regions are always shown as chips; a region with no open deal is greyed out. Regions: North America, Central America & Caribbean, South America, Europe, Middle East, Africa, Asia, Australia & Pacific. `destination` is optional display text (e.g. "Kaanapali Beach, Maui") shown instead of the city on the card.
- **Dates** are `YYYY-MM-DD`. `priceFrom` is text, so `"1,150"` works. `currency` can be USD, EUR, GBP, INR, AED, THB, SGD.
- **Links under the hotel name**: `website` (the official page) and the Google rating, which links to the hotel's own Google page (`reviews`, built from its `placeId`).
- **Google star ratings**: `rating`, `ratingCount` and `ratingDate` hold the Google rating as looked up on that date, shown as "★ 4.6 (2,310) on Google". Google's terms prefer ratings to be fetched live rather than stored, so refresh these every month or two (search the hotel on Google Maps and copy the number), or paste a Google Maps Platform API key into `googlePlacesApiKey` in `config.json` and the live rating replaces the stored one automatically. Key setup: Google Cloud Console → create a project → enable "Places API (New)" → Credentials → API key → restrict it to your website's domain.
- `datesText` (optional) replaces the automatic "Book by… Travel…" line on the card when an offer has no published dates; `bookBy` still decides when the card hides.
- `source` is a private note on where the offer came from (a Fora HQ post, a partner mailing). It is not shown on the site.
- Deals marked `"sample": true` show a small "Sample" tag on the card; none are on the board at the moment.

Commit the change and the live site updates within about a minute. If your browser still shows the old version, hard-refresh (Ctrl+Shift+R, or Cmd+Shift+R on a Mac); the version number in the footer (v19, v20…) tells you which release you're looking at.

If the JSON is invalid (a missing comma is the usual culprit), the board shows "The deal board couldn't load". Paste the file into https://jsonlint.com to find the line.

## Domain

The site lives at https://nvoytravel.com. The `CNAME` file in this folder tells GitHub Pages that; keep it in every upload or the custom domain switches off. DNS at the registrar: four A records on `@` pointing at GitHub's Pages addresses (185.199.108.153, .109.153, .110.153, .111.153) and a CNAME on `www` pointing at `ameygoel.github.io`.

## Deal board layout

The board opens as one row that scrolls sideways (swipe on phones, arrows or shift-scroll on desktop) so it takes little vertical space. The Scroll / Grid switch next to the city dropdown expands it into the full grid; the visitor's choice is remembered in their browser.

## Explore perks by hotel

`hotels.json` drives the dropdown. Each hotel names the programme(s) it belongs to (`programs`, using ids from `programs.json`); the card merges their perks, one per type, and lists the common terms plus each programme's own terms. For a hotel with a special arrangement, set `perks` (replaces the programme perks) or `extraPerks` (adds to them) and `terms`. A hotel whose name matches a deal on the board shows a one-line note about that deal.

## Partner programme logos

The "partner programmes behind the perks" row scrolls sideways. Each tile shows the programme's logo if `logo` points to a file in `assets/img/programs/` (use the official marks from each partner portal; transparent background, about 3:1), otherwise the programme name set in the site's typeface. Tap a tile to see its brands, perks and terms underneath.

## Recently booked

`recentBookings` in `config.json` feeds the "Recently booked" cards under Why Nvoy: `hotel`, `place`, `perks` (what the client received), `savings` (one line) and an optional `when`. Add new stays at the top and keep three to six.

## Partner programmes

`programs.json` lists each programme with its `brands`; the perks explorer uses them to work out which programmes a hotel belongs to. Variant spellings (St. Regis / St Regis) are fine; the display line hides duplicates.

## Follow us

The "Follow us on" section shows two cards: Instagram (from `instagram` in `config.json`) and the WhatsApp channel (`whatsappChannel`). Leave either empty to hide its card.

## Photos

- `assets/img/deals/*.jpg`: deal photos, ideally 1200×900 or larger, 4:3.

Missing photos fall back to illustrations, so nothing breaks while you gather them.

## Enquiry form

The form posts to FormSubmit (`formEndpoint` in `config.json`), which emails the details to `email`. The very first submission triggers a one-time activation email from FormSubmit to that address; click the link once and all later enquiries arrive normally. After sending, the visitor gets a "Continue on WhatsApp" button that opens a chat with your number, with their details already typed in.

WhatsApp number format: digits only, country code first, no plus or spaces. India example: `919876543210`.

## Running it locally

Any static server works. For example:

```
python3 -m http.server 8000
```

then open http://localhost:8000. (Opening `index.html` directly from the file system won't load the JSON files.)

## Hosting

The site is plain files, so GitHub Pages, Netlify, Cloudflare Pages or Vercel all host it for free. For GitHub Pages: repository Settings → Pages → Source "Deploy from a branch" → `main` / root.
