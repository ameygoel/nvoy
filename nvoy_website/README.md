# Nvoy — website

The public site for Nvoy, an independent Fora travel advisory. A static site: no build step, no database. Everything that changes often lives in two small files.

| File | What it controls |
|---|---|
| `deals.json` | The deal board. Add, edit or remove deals here. |
| `config.json` | Your name, email, WhatsApp number, Instagram handle, the About text, perks list, testimonials. |

Everything else (`index.html`, `assets/`) is the design. `DESIGN.md` records the palette, type and layout decisions so future changes stay on-brand.

## Adding or removing a deal

Open `deals.json` (on GitHub: click the file, then the pencil icon). Each deal looks like this:

```json
{
  "id": "six-senses-laamu",
  "hotel": "Six Senses Laamu",
  "destination": "Laamu Atoll",
  "country": "Maldives",
  "perk": "4th night free",
  "details": ["Daily breakfast for two", "$100 resort credit", "Upgrade on arrival when available"],
  "bookBy": "2026-12-15",
  "travelFrom": "2027-01-10",
  "travelTo": "2027-04-30",
  "priceFrom": "1,150",
  "currency": "USD",
  "image": "assets/img/deals/six-senses-laamu.jpg",
  "art": "island",
  "tags": ["Beach", "Honeymoon"],
  "featured": true,
  "note": "The only resort in Laamu. Surf break out front, manta season from January."
}
```

- **To add a deal**: copy one block, paste it after the previous one (mind the comma between blocks), change the values. `id` must be unique.
- **To remove a deal**: delete its block, or just set `bookBy` to a past date. Expired deals hide themselves.
- **To feature a deal in the hero**: set `"featured": true` on exactly one deal.
- **Photos**: put a JPG in `assets/img/deals/` and point `image` at it, or paste a full `https://` URL. If the photo is missing, the site draws a sunset illustration in the style named by `art` (`island`, `coast`, `city`, `mountain`, `desert`, `jungle`).
- **Tags** become the filter chips above the grid. Keep them to a handful.
- **Dates** are `YYYY-MM-DD`. `priceFrom` is text, so `"1,150"` works. `currency` can be USD, EUR, GBP, INR, AED, THB, SGD.
- Deals marked `"sample": true` show a small "Sample" tag on the card and keep the sample notice visible. Delete those blocks once you have enough real deals and the notice goes away on its own.

Commit the change and the live site updates within about a minute.

If the JSON is invalid (a missing comma is the usual culprit), the board shows "The deal board couldn't load". Paste the file into https://jsonlint.com to find the line.

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
