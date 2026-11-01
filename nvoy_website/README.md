# Nvoy — website

The public site for Nvoy, an independent Fora travel advisory. A static site: no build step, no database. Everything that changes often lives in two small files.

| File | What it controls |
|---|---|
| `deals.json` | The deal board. Add, edit or remove deals here. |
| `config.json` | Your name, email, WhatsApp number, Instagram handle, the About text, perks list, testimonials, the real-booking example, FAQ. |
| `hotels.json` | The hotels in the "Explore perks by hotel" dropdown: name, city, region, which programmes each belongs to, any hotel-specific perks or terms. |
| `programs.json` | The partner programmes (Marriott STARS, Hyatt Privé, IHG Destined…), the brands under each and their typical perks. Powers the programme list and the travel-math tool's brand recognition. |

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
- **Perks and terms** are two separate lists on the card: `perks` is what the guest gets, `terms` the conditions (minimum nights, lead time, prepayment, blackout dates).
- **The hero postcard** shows one open deal chosen at random on each visit, with a "Show me another" link. Nothing to configure.
- **Photos**: put a JPG in `assets/img/deals/` and point `image` at it, or paste a full `https://` URL. If the photo is missing, the site draws a sunset illustration in the style named by `art` (`island`, `coast`, `city`, `mountain`, `desert`, `jungle`).
- **Region** becomes the filter chips above the board and **city** feeds the city dropdown (which only lists cities inside the chosen region). Use the same spelling across deals. All eight regions are always shown as chips; a region with no open deal is greyed out. Regions: North America, Central America & Caribbean, South America, Europe, Middle East, Africa, Asia, Australia & Pacific. `destination` is optional display text (e.g. "Kaanapali Beach, Maui") shown instead of the city on the card.
- **Dates** are `YYYY-MM-DD`. `priceFrom` is text, so `"1,150"` works. `currency` can be USD, EUR, GBP, INR, AED, THB, SGD.
- `website` is the hotel's official page and `reviews` a Google Maps link, both shown as small links under the card's button.
- **Google star ratings**: paste a Google Maps Platform API key into `googlePlacesApiKey` in `config.json` and the "Reviews on Google" link turns into the live rating ("★ 4.6 (2,310) on Google"), linked to the hotel's Google page. Google's terms require the rating to be fetched live rather than typed into the site, which is why it works this way. Set up: Google Cloud Console → create a project → enable "Places API (New)" → Credentials → API key → restrict it to your website's domain (HTTP referrer). Adding each hotel's `placeId` to `deals.json` makes lookups exact and cheaper. Google's free monthly allowance covers roughly a few hundred visits a month at 18 hotels; beyond that it's pay-as-you-go.
- `source` is a private note on where the offer came from (a Fora HQ post, a partner mailing). It is not shown on the site.
- Deals marked `"sample": true` show a small "Sample" tag on the card; none are on the board at the moment.

Commit the change and the live site updates within about a minute.

If the JSON is invalid (a missing comma is the usual culprit), the board shows "The deal board couldn't load". Paste the file into https://jsonlint.com to find the line.

## Deal board layout

The board opens as one row that scrolls sideways (swipe on phones, arrows or shift-scroll on desktop) so it takes little vertical space. The Scroll / Grid switch next to the city dropdown expands it into the full grid; the visitor's choice is remembered in their browser.

## Explore perks by hotel

`hotels.json` drives the dropdown. Each hotel names the programme(s) it belongs to (`programs`, using ids from `programs.json`); the card merges their perks, one per type, and lists the common terms plus each programme's own terms. For a hotel with a special arrangement, set `perks` (replaces the programme perks) or `extraPerks` (adds to them) and `terms`. A hotel whose name matches a deal on the board gets a "See the deal" link automatically.

## Partner programmes and the travel-math tool

`programs.json` lists each programme with its `brands`. When a visitor types a hotel name into the travel-math tool, the site looks for any of those brand words in the name (longest match wins) and shows that programme's perks. To teach it a new brand, add the word to the right programme's `brands` list. Variant spellings (St. Regis / St Regis) are fine; the display line hides duplicates.

The tool cannot fetch live prices (Google has no public hotel-price API for a static site), so it opens Google's hotel search for the exact dates in a new tab and lets the visitor paste the nightly rate back in. The "extras" estimate uses typical values for breakfast and the hotel credit per currency; adjust `CREDIT_IN` and `BREAKFAST_IN` in `assets/js/site.js` if you want different assumptions.

## Photos

- `assets/img/advisor.jpg`: a portrait of you, roughly 4:5. Shown in the About section.
- `assets/img/ig/1.jpg` to `6.jpg`: six square photos for the Instagram strip.
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
