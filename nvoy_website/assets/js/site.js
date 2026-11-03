/* Nvoy — renders the page from config.json and deals.json, wires the enquiry form and WhatsApp links. */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let CONFIG = {};
  let DEALS = [];

  /* ---------- placeholder art: used whenever a photo is missing ---------- */
  const ART = {
    island(id) {
      return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Island illustration">
        <defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3B54A"/><stop offset=".55" stop-color="#F2644A"/><stop offset="1" stop-color="#C9432E"/></linearGradient>
        <linearGradient id="sea-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E4A78"/><stop offset="1" stop-color="#042C50"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#sky-${id})"/>
        <circle cx="290" cy="150" r="48" fill="#FFE9B8" opacity=".95"/>
        <rect y="180" width="400" height="120" fill="url(#sea-${id})"/>
        <path d="M0 184 Q100 176 200 184 T400 184 V300 H0Z" fill="#042C50" opacity=".5"/>
        <path d="M60 182 Q120 150 190 182Z" fill="#021A33"/>
        <path d="M118 158 q-26-30 -52-18 q24 2 52 18z M120 156 q-4-40 24-50 q-14 20 -24 50z M124 160 q30-26 58-10 q-30 -4 -58 10z" fill="#021A33"/>
      </svg>`;
    },
    coast(id) {
      return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Coastline illustration">
        <defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2E5CC"/><stop offset="1" stop-color="#F3B54A"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#sky-${id})"/>
        <circle cx="120" cy="110" r="34" fill="#F2644A"/>
        <rect y="200" width="400" height="100" fill="#1E4A78"/>
        <path d="M0 206 Q60 198 120 206 T240 206 T360 206 T480 206 V300 H0Z" fill="#042C50" opacity=".45"/>
        <path d="M230 200 L300 90 L360 140 L400 100 V200Z" fill="#042C50"/>
        <path d="M250 200 L300 120 L340 160 L400 130 V200Z" fill="#1E4A78"/>
        <rect x="300" y="150" width="14" height="10" fill="#F2E5CC"/><rect x="322" y="162" width="10" height="8" fill="#F2E5CC"/>
      </svg>`;
    },
    city(id) {
      return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="City skyline illustration">
        <defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#042C50"/><stop offset=".7" stop-color="#1E4A78"/><stop offset="1" stop-color="#F2644A"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#sky-${id})"/>
        <circle cx="80" cy="80" r="26" fill="#F2E5CC"/>
        <g fill="#021A33"><rect x="20" y="170" width="40" height="130"/><rect x="70" y="120" width="30" height="180"/><rect x="110" y="150" width="50" height="150"/><rect x="170" y="90" width="36" height="210"/><rect x="216" y="140" width="44" height="160"/><rect x="270" y="110" width="30" height="190"/><rect x="310" y="160" width="60" height="140"/><rect x="380" y="130" width="20" height="170"/></g>
        <g fill="#F3B54A" opacity=".9"><rect x="78" y="130" width="5" height="7"/><rect x="88" y="150" width="5" height="7"/><rect x="178" y="100" width="5" height="7"/><rect x="190" y="120" width="5" height="7"/><rect x="178" y="140" width="5" height="7"/><rect x="226" y="150" width="5" height="7"/><rect x="246" y="170" width="5" height="7"/><rect x="280" y="130" width="5" height="7"/><rect x="330" y="180" width="5" height="7"/><rect x="350" y="200" width="5" height="7"/></g>
        <rect y="260" width="400" height="40" fill="#042C50" opacity=".6"/>
      </svg>`;
    },
    mountain(id) {
      return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mountain illustration">
        <defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2644A"/><stop offset="1" stop-color="#F2E5CC"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#sky-${id})"/>
        <circle cx="300" cy="90" r="30" fill="#F3B54A"/>
        <path d="M0 300 L90 140 L160 230 L230 110 L320 240 L400 160 V300Z" fill="#1E4A78"/>
        <path d="M0 300 L60 220 L130 300Z M140 300 L230 170 L330 300Z" fill="#042C50"/>
        <path d="M230 110 L252 150 L240 146 L230 160 L220 146 L208 150Z" fill="#F2E5CC"/>
      </svg>`;
    },
    desert(id) {
      return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Desert and palace illustration">
        <defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3B54A"/><stop offset="1" stop-color="#F2644A"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#sky-${id})"/>
        <circle cx="110" cy="120" r="40" fill="#FFE9B8"/>
        <rect y="200" width="400" height="100" fill="#042C50"/>
        <path d="M0 206 Q80 196 160 206 T320 206 T480 206 V300 H0Z" fill="#1E4A78" opacity=".6"/>
        <g fill="#021A33"><rect x="230" y="150" width="120" height="52"/><rect x="240" y="130" width="16" height="22"/><rect x="324" y="130" width="16" height="22"/><path d="M262 150 q28-40 56 0z"/><circle cx="248" cy="128" r="8"/><circle cx="332" cy="128" r="8"/></g>
        <g fill="#F3B54A" opacity=".8"><rect x="270" y="170" width="8" height="12"/><rect x="302" y="170" width="8" height="12"/><rect x="286" y="170" width="8" height="12"/></g>
      </svg>`;
    },
    jungle(id) {
      return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Jungle illustration">
        <defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2E5CC"/><stop offset="1" stop-color="#F3B54A"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#sky-${id})"/>
        <circle cx="300" cy="100" r="34" fill="#F2644A"/>
        <path d="M0 300 V200 Q60 160 120 200 T240 200 T360 200 T480 200 V300Z" fill="#1E4A78"/>
        <path d="M0 300 V240 Q50 210 100 240 T200 240 T300 240 T400 240 V300Z" fill="#042C50"/>
        <path d="M30 230 q20-90 90-100 q-40 30 -50 110z M330 240 q-10-90 -80-110 q40 40 40 110z" fill="#021A33"/>
        <path d="M150 300 q10-70 60-90 q-20 40 -20 90z" fill="#042C50"/>
      </svg>`;
    },
    beach(id) { return ART.island(id); }
  };
  function art(kind, id) {
    const fn = ART[kind] || ART.island;
    return fn(String(id || "x").replace(/[^a-z0-9]/gi, ""));
  }
  /* swap an <img> for art when the file is missing */
  function attachFallback(img, kind, id) {
    img.addEventListener("error", () => {
      const wrap = document.createElement("div");
      wrap.innerHTML = art(kind, id);
      img.replaceWith(wrap.firstElementChild);
    }, { once: true });
  }

  /* ---------- helpers ---------- */
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function parseDate(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function fmt(d, withYear) {
    return d ? `${d.getDate()} ${MONTHS[d.getMonth()]}${withYear ? " " + d.getFullYear() : ""}` : "";
  }
  function datesLine(deal) {
    const parts = [];
    const by = parseDate(deal.bookBy);
    const from = parseDate(deal.travelFrom);
    const to = parseDate(deal.travelTo);
    if (by) parts.push(`Book by ${fmt(by, true)}.`);
    if (from && to) parts.push(`Travel ${fmt(from, from.getFullYear() !== to.getFullYear())} to ${fmt(to, true)}.`);
    else if (to) parts.push(`Travel until ${fmt(to, true)}.`);
    else if (from) parts.push(`Travel from ${fmt(from, true)}.`);
    return parts.join(" ");
  }
  function money(deal) {
    if (!deal.priceFrom) return "";
    const sym = { USD: "$", EUR: "€", GBP: "£", INR: "₹", AED: "AED ", THB: "฿", SGD: "S$" }[deal.currency] || (deal.currency ? deal.currency + " " : "");
    return `${sym}${deal.priceFrom}`;
  }
  function isLive(deal) {
    const by = parseDate(deal.bookBy);
    if (!by) return true;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return by >= today;
  }
  function waLink(text) {
    const n = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    const t = text || `Hi ${CONFIG.advisorName || ""}, I found Nvoy and I'd like help planning a hotel stay.`;
    return n ? `https://wa.me/${n}?text=${encodeURIComponent(t)}` : "#plan";
  }

  /* ---------- rendering ---------- */
  function ratingHtml(rating, count) {
    if (!rating) return "Reviews on Google";
    const n = Number(rating);
    return `<span class="rating-star" aria-hidden="true">★</span> ${esc(n.toFixed(1))}${count ? ` <span class="rating-count">(${esc(Number(count).toLocaleString("en-IN"))})</span>` : ""} <span class="rating-src">on Google</span>`;
  }
  function placeLine(deal) {
    const d = deal.destination || deal.city || "";
    return deal.country && !d.toLowerCase().includes(deal.country.toLowerCase()) ? `${d}, ${deal.country}` : d;
  }
  function postcard(deal, featured) {
    const img = deal.image
      ? `<img src="${esc(deal.image)}" alt="${esc(deal.hotel)}, ${esc(deal.destination)}" loading="${featured ? "eager" : "lazy"}" width="400" height="300" data-art="${esc(deal.art || "island")}" data-id="${esc(deal.id)}">`
      : art(deal.art, deal.id);
    const perks = (deal.perks && deal.perks.length ? deal.perks : deal.details || []).map((d) => `<li>${esc(d)}</li>`).join("");
    const terms = (deal.terms || []).map((d) => `<li>${esc(d)}</li>`).join("");
    return `<article class="postcard${featured ? " postcard-featured" : ""}" data-id="${esc(deal.id)}">
      <div class="postcard-photo">
        ${deal.sample ? `<span class="featured-tag sample-tag">Sample</span>` : ""}
        ${img}
        <span class="stamp">${esc(deal.perk)}</span>
      </div>
      <div class="postcard-body">
        <p class="postcard-place">${esc(placeLine(deal))}</p>
        <h3 class="postcard-hotel">${esc(deal.hotel)}</h3>
        ${deal.website || deal.reviews ? `<p class="postcard-links">
          ${deal.website ? `<a href="${esc(deal.website)}" target="_blank" rel="noopener">Hotel website</a>` : ""}
          ${deal.reviews ? `<a class="rating-link" data-rating-for="${esc(deal.id)}" href="${esc(deal.reviews)}" target="_blank" rel="noopener"${deal.rating ? ` aria-label="Rated ${esc(deal.rating)} out of 5 on Google from ${esc(deal.ratingCount || "")} reviews"` : ""}>${ratingHtml(deal.rating, deal.ratingCount)}</a>` : ""}
        </p>` : ""}
        ${deal.note ? `<p class="postcard-note">${esc(deal.note)}</p>` : ""}
        ${perks ? `<div class="postcard-block"><p class="postcard-label">Perks</p><ul class="postcard-details">${perks}</ul></div>` : ""}
        ${terms ? `<div class="postcard-block postcard-terms"><p class="postcard-label">Terms</p><ul>${terms}</ul></div>` : ""}
        <div class="postcard-meta">
          <p class="postcard-dates">${esc(datesLine(deal))}</p>
          ${deal.priceFrom ? `<p class="postcard-price">from<strong>${esc(money(deal))}<span class="postcard-per"> a night</span></strong>${deal.priceNote ? `<span class="postcard-pricenote">${esc(deal.priceNote)}</span>` : ""}</p>` : ""}
        </div>
        <div class="postcard-cta">
          <button type="button" class="btn btn-ghost-navy btn-small" data-ask="${esc(deal.id)}">Ask about this stay</button>
        </div>
      </div>
    </article>`;
  }

  let activeTag = "All", activeCity = "";
  const REGION_ORDER = ["North America", "Central America & Caribbean", "South America", "Europe", "Middle East", "Africa", "Asia", "Australia & Pacific"];
  const byRegion = (a, b) => {
    const ia = REGION_ORDER.indexOf(a), ib = REGION_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
  };
  function renderFilters(deals) {
    const counts = {};
    deals.forEach((d) => { if (d.region) counts[d.region] = (counts[d.region] || 0) + 1; });
    const extra = Object.keys(counts).filter((r) => !REGION_ORDER.includes(r)).sort();
    const list = [...REGION_ORDER, ...extra];
    const box = $("#filters");
    box.innerHTML = `<button type="button" class="chip" aria-pressed="${activeTag === "All"}" data-tag="All">All regions</button>` +
      list.map((r) => {
        const n = counts[r] || 0;
        return `<button type="button" class="chip" aria-pressed="${r === activeTag}" data-tag="${esc(r)}"${n ? "" : ' disabled title="No open offers right now"'}>${esc(r)}${n ? ` <span class="chip-count">${n}</span>` : ""}</button>`;
      }).join("");
    box.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b || b.disabled) return;
      activeTag = b.dataset.tag;
      activeCity = "";
      $$(".chip", box).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      renderCityOptions(deals);
      renderGrid(deals);
    });
    renderCityOptions(deals);
    $("#city-filter").addEventListener("change", (e) => {
      activeCity = e.target.value;
      renderGrid(deals);
    });
  }
  /* city dropdown lists the cities inside the active region */
  function renderCityOptions(deals) {
    const sel = $("#city-filter");
    const pool = deals.filter((d) => activeTag === "All" || d.region === activeTag);
    const cities = Array.from(new Set(pool.map((d) => d.city).filter(Boolean))).sort((a, b) => a.localeCompare(b));
    sel.innerHTML = `<option value="">${activeTag === "All" ? "All cities" : "All cities in " + esc(activeTag)}</option>` +
      cities.map((c) => `<option value="${esc(c)}"${c === activeCity ? " selected" : ""}>${esc(c)}</option>`).join("");
    sel.parentElement.hidden = cities.length < 2;
  }

  function renderGrid(deals) {
    const grid = $("#deal-grid");
    const shown = deals.filter((d) => (activeTag === "All" || d.region === activeTag) && (!activeCity || d.city === activeCity));
    grid.innerHTML = shown.map((d) => postcard(d, false)).join("");
    $("#deals-empty").hidden = shown.length > 0;
    hookImages(grid);
    decorateRatings(grid);
    grid.scrollLeft = 0;
    requestAnimationFrame(updateArrows);
  }

  function hookImages(root) {
    $$("img[data-art]", root).forEach((img) => attachFallback(img, img.dataset.art, img.dataset.id));
  }

  function renderPerks() {
    $("#perk-list").innerHTML = (CONFIG.perks || []).map((p) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("");
  }

  function renderAbout() {
    const a = CONFIG.about || {};
    $("#about-copy").innerHTML =
      `<h2>${esc(a.heading || "About")}</h2>` +
      (a.intro ? `<p class="about-intro">${esc(a.intro)}</p>` : "") +
      (a.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("") +
      (CONFIG.foraProfile ? `<a class="btn btn-ghost-navy" href="${esc(CONFIG.foraProfile)}" target="_blank" rel="noopener">See my advisor profile</a>` : "");
  }

  /* ---------- partner programmes ---------- */
  let PROGRAMS = [];
  function renderPrograms() {
    const box = $("#programs");
    const shown = PROGRAMS.filter((p) => p.show !== false);
    if (!shown.length) { box.hidden = true; return; }
    box.hidden = false;
    const list = $("#program-list");
    list.innerHTML = shown.map((p) => `
      <li>
        <button type="button" class="program-tile${p.logo ? " has-logo" : ""}" data-program="${esc(p.id)}" aria-pressed="false" aria-label="${esc(p.name)}: show perks">
          ${p.logo
            ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">`
            : `<span class="tile-name">${esc(p.name)}</span>`}
          <span class="tile-group">${esc(p.group || "")}</span>
        </button>
      </li>`).join("");
    list.addEventListener("click", (e) => {
      const b = e.target.closest(".program-tile");
      if (!b) return;
      const open = b.getAttribute("aria-pressed") === "true";
      $$(".program-tile", list).forEach((t) => t.setAttribute("aria-pressed", "false"));
      if (open) { $("#program-detail").hidden = true; return; }
      b.setAttribute("aria-pressed", "true");
      showProgram(b.dataset.program);
    });
    /* logos that fail to load fall back to the typeset tile */
    $$(".program-tile img", list).forEach((img) => img.addEventListener("error", () => {
      const tile = img.closest(".program-tile"); const p = progById(tile.dataset.program);
      img.replaceWith(Object.assign(document.createElement("span"), { className: "tile-name", textContent: p ? p.name : "" }));
      tile.classList.remove("has-logo");
    }, { once: true }));
    // sideways scroll controls
    const prev = $("#prog-prev"), next = $("#prog-next");
    const update = () => {
      const max = list.scrollWidth - list.clientWidth - 2;
      prev.disabled = list.scrollLeft <= 2; next.disabled = list.scrollLeft >= max;
      list.parentElement.classList.toggle("no-overflow", max <= 0);
    };
    const step = () => { const t = list.querySelector(".program-tile"); return t ? (t.getBoundingClientRect().width + 16) * 2 : list.clientWidth * .8; };
    prev.addEventListener("click", () => list.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => list.scrollBy({ left: step(), behavior: "smooth" }));
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    list.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { list.scrollBy({ left: step(), behavior: "smooth" }); e.preventDefault(); }
      if (e.key === "ArrowLeft") { list.scrollBy({ left: -step(), behavior: "smooth" }); e.preventDefault(); }
    });
    requestAnimationFrame(update);
  }
  function showProgram(id) {
    const p = progById(id); const box = $("#program-detail");
    if (!p) { box.hidden = true; return; }
    $("#pd-name").textContent = p.name;
    $("#pd-group").textContent = p.group || "";
    const brands = brandsLine(p);
    $("#pd-brands").textContent = brands ? (p.note ? brands : `Brands: ${brands}`) : "";
    $("#pd-brands").hidden = !brands;
    $("#pd-perks").innerHTML = (p.perks || []).map((x) => `<li>${esc(x)}</li>`).join("");
    const terms = (p.terms || []);
    $("#pd-terms").textContent = terms.join(" ");
    $("#pd-terms").hidden = !terms.length;
    box.hidden = false;
  }
  /* brand names for display: drop spelling variants kept only for matching */
  function brandsLine(p) {
    if (p.note) return p.note;
    const seen = new Set(), out = [];
    (p.brands || []).forEach((b) => {
      const key = b.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/^the\s+/, "").replace(/[^a-z]/g, "").replace("bvlgari", "bulgari");
      if (key.length < 3 || seen.has(key)) return;
      seen.add(key); out.push(b.replace(/^The\s+/, ""));
    });
    if (out.length === 1 && p.name.toLowerCase().includes(out[0].toLowerCase())) return "";
    return out.slice(0, 8).join(", ") + (out.length > 8 ? " and more" : "");
  }
  /* one short line of perks per programme */
  function perksLine(p) {
    return (p.perks || []).map((x) => {
      const t = x.toLowerCase();
      if (t.includes("breakfast")) return "Breakfast for two";
      if (t.includes("credit")) { const m = x.match(/[$€£]\s?\d[\d,]*/); return m ? `${m[0]} credit` : "Credit at selected hotels"; }
      if (t.includes("upgrade")) return "Upgrade when available";
      if (t.includes("check")) return "Early check-in, late check-out";
      if (t.includes("welcome")) return t.includes("gift") ? "Welcome gift" : "Welcome amenity";
      return x;
    }).join(", ");
  }

  /* ---------- explore perks by hotel ---------- */
  let HOTELS = [], COMMON_TERMS = [];
  const progById = (id) => PROGRAMS.find((p) => p.id === id);
  function perkCategory(t) {
    t = t.toLowerCase();
    if (t.includes("breakfast")) return "breakfast";
    if (t.includes("credit")) return "credit";
    if (t.includes("upgrade")) return "upgrade";
    if (t.includes("check")) return "checkinout";
    if (t.includes("welcome")) return "welcome";
    if (t.includes("vip")) return "vip";
    return t;
  }
  /* union of perks across all programmes, one per category, remembering where each came from */
  function hotelPerks(h) {
    const progs = (h.programs || []).map(progById).filter(Boolean);
    if (h.perks && h.perks.length) return h.perks.map((text) => ({ text, via: "" }));
    const out = [], seen = new Map();
    progs.forEach((p) => (p.perks || []).forEach((text) => {
      const cat = perkCategory(text);
      if (seen.has(cat)) { seen.get(cat).via.push(p.name); return; }
      const item = { text, via: [p.name] }; seen.set(cat, item); out.push(item);
    }));
    (h.extraPerks || []).forEach((text) => out.push({ text, via: ["This hotel"] }));
    return out.map((i) => ({ text: i.text, via: progs.length > 1 ? i.via.join(", ") : "" }));
  }
  const norm = (s) => String(s || "").toLowerCase().replace(/,.*$/, "").replace(/[^a-z]/g, "");
  function renderExplore() {
    const box = $("#explore");
    if (!HOTELS.length) { box.hidden = true; return; }
    box.hidden = false;
    const sel = $("#hotel-select");
    const groups = {};
    HOTELS.forEach((h) => { (groups[h.region || "Other"] = groups[h.region || "Other"] || []).push(h); });
    const order = Object.keys(groups).sort((a, b) => {
      const ia = REGION_ORDER.indexOf(a), ib = REGION_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    });
    sel.innerHTML = `<option value="">Choose a hotel</option>` + order.map((r) =>
      `<optgroup label="${esc(r)}">${groups[r].slice().sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name)).map((h) => `<option value="${esc(h.id)}">${esc(h.name)}, ${esc(h.city)}</option>`).join("")}</optgroup>`
    ).join("");
    sel.addEventListener("change", () => showHotel(sel.value));
  }
  let exploreState = null;
  function showHotel(id) {
    const h = HOTELS.find((x) => x.id === id);
    const card = $("#hotel-card");
    if (!h) { card.hidden = true; exploreState = null; return; }
    exploreState = h;
    const progs = (h.programs || []).map(progById).filter(Boolean);
    $("#hc-name").textContent = h.name;
    $("#hc-place").textContent = `${h.city}, ${h.country}`;
    $("#hc-programs").innerHTML = progs.length
      ? progs.map((p) => `<li>${esc(p.name)}</li>`).join("")
      : `<li>No chain programme; perks arranged through Nvoy's partner network</li>`;
    const note = $("#hc-note"); note.hidden = !h.note; note.textContent = h.note || "";
    const deal = DEALS.find((d) => { const a = norm(d.hotel), b = norm(h.name); return a && b && (a.includes(b) || b.includes(a)); });
    const dealEl = $("#hc-deal");
    if (deal) { dealEl.hidden = false; dealEl.innerHTML = `On the deal board right now: <strong>${esc(deal.perk)}</strong>. <a href="#deals">See the deal</a>`; }
    else dealEl.hidden = true;
    $("#hc-perks").innerHTML = hotelPerks(h).map((p) => `<li>${esc(p.text)}${p.via ? `<span class="via">${esc(p.via)}</span>` : ""}</li>`).join("");
    const terms = [].concat(h.terms || [], ...progs.map((p) => p.terms || []), COMMON_TERMS);
    $("#hc-terms").innerHTML = terms.map((t) => `<li>${esc(t)}</li>`).join("");
    card.hidden = false;
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  $("#hc-ask").addEventListener("click", () => {
    const h = exploreState; if (!h) return;
    const progs = (h.programs || []).map(progById).filter(Boolean);
    setAsking({ hotel: h.name, perk: progs.length ? progs.map((p) => p.name).join(" and ") + " perks" : "partner perks", destination: h.city, country: h.country });
    $("[name=destination]", $("#enquiry")).value = `${h.name}, ${h.city}`;
    $("#sent").hidden = true; $("#enquiry").hidden = false;
    $("#plan").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => $("[name=name]").focus({ preventScroll: true }), 500);
  });
  function renderRecent() {
    const r = CONFIG.recentBookings || [];
    const box = $("#recent");
    if (!r.length) { box.hidden = true; return; }
    box.hidden = false;
    $("#recent-list").innerHTML = r.map((b) => `
      <li class="recent-card">
        <p class="recent-place">${esc(b.place || "")}</p>
        <h4>${esc(b.hotel)}</h4>
        ${b.perks && b.perks.length ? `<p class="recent-label">Perks received</p><ul class="recent-perks">${b.perks.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${b.savings ? `<p class="recent-savings"><span>Saved</span>${esc(b.savings)}</p>` : ""}
        ${b.when ? `<p class="recent-when">${esc(b.when)}</p>` : ""}
      </li>`).join("");
  }
  function renderFaq() {
    const f = CONFIG.faq || [];
    const sec = $("#faq");
    if (!f.length) { sec.hidden = true; return; }
    $("#faq-list").innerHTML = f.map((x, i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join("");
  }

  function renderQuotes() {
    const q = CONFIG.testimonials || [];
    const sec = $("#words");
    if (!q.length) { sec.hidden = true; return; }
    $("#quote-grid").innerHTML = q.map((t) => `<blockquote class="quote"><p>“${esc(t.quote)}”</p><footer><strong>${esc(t.name)}</strong>${esc(t.trip || "")}</footer></blockquote>`).join("");
  }

  function renderFollow() {
    const handle = (CONFIG.instagram || "").replace(/^@/, "");
    const url = handle ? `https://www.instagram.com/${handle}` : "";
    const insta = $("#follow-insta");
    if (url) { insta.href = url; $("#follow-insta-handle").textContent = `@${handle}`; $("#foot-insta").href = url; }
    else { insta.hidden = true; $("#foot-insta").hidden = true; }
    const ch = CONFIG.whatsappChannel;
    const wa = $("#follow-wa"), fc = $("#foot-channel");
    if (ch) { wa.href = ch; fc.href = ch; } else { wa.hidden = true; fc.hidden = true; }
    $("#follow").hidden = !url && !ch;
  }

  function renderContact() {
    $$("[data-whatsapp]").forEach((a) => { a.href = waLink(); });
    if (CONFIG.email) { const e = $("#foot-email"); e.href = `mailto:${CONFIG.email}`; e.textContent = CONFIG.email; }
    if (CONFIG.heroNote) $("#hero-note").textContent = CONFIG.heroNote;
    if (CONFIG.advisorFullName) $("#foot-line").textContent = `Nvoy Travels is an independent travel advisory run by ${CONFIG.advisorFullName}.`;
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------- live Google ratings (only when an API key is configured) ----------
     Google's terms allow showing the rating when it is fetched live and attributed; they don't allow
     storing it in the site, so nothing is cached beyond this page view. */
  const RATINGS = {};
  async function fetchRating(deal) {
    const key = CONFIG.googlePlacesApiKey;
    if (!key) return null;
    if (RATINGS[deal.id] !== undefined) return RATINGS[deal.id];
    try {
      let res;
      if (deal.placeId) {
        res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(deal.placeId)}`, {
          headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri" }
        });
        if (!res.ok) throw new Error(res.status);
        RATINGS[deal.id] = await res.json();
      } else {
        res = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.rating,places.userRatingCount,places.googleMapsUri" },
          body: JSON.stringify({ textQuery: `${deal.hotel} ${deal.city || ""}`, maxResultCount: 1 })
        });
        if (!res.ok) throw new Error(res.status);
        const j = await res.json();
        RATINGS[deal.id] = (j.places && j.places[0]) || null;
      }
    } catch (e) { RATINGS[deal.id] = null; }
    return RATINGS[deal.id];
  }
  function decorateRatings(root) {
    if (!CONFIG.googlePlacesApiKey) return;
    $$("[data-rating-for]", root).forEach(async (a) => {
      const deal = DEALS.find((d) => d.id === a.dataset.ratingFor);
      if (!deal) return;
      const r = await fetchRating(deal);
      if (!r || !r.rating) return;
      if (r.googleMapsUri) a.href = r.googleMapsUri;
      a.innerHTML = ratingHtml(r.rating, r.userRatingCount);
      a.setAttribute("aria-label", `Rated ${r.rating.toFixed(1)} out of 5 on Google${r.userRatingCount ? ` from ${r.userRatingCount} reviews` : ""}`);
    });
  }

  /* ---------- deal board layout: one scrolling row (default) or a full grid ---------- */
  const strip = $("#deal-strip"), grid = $("#deal-grid");
  function setView(view, remember) {
    const row = view !== "grid";
    strip.classList.toggle("is-row", row);
    strip.classList.toggle("is-grid", !row);
    $("#strip-hint").hidden = !row;
    $$(".view-btn").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.view === "grid") !== row)));
    if (remember) { try { localStorage.setItem("nvoy-deal-view", row ? "row" : "grid"); } catch (e) { /* storage unavailable */ } }
    updateArrows();
  }
  function updateArrows() {
    if (!strip.classList.contains("is-row")) return;
    const max = grid.scrollWidth - grid.clientWidth - 2;
    $("#strip-prev").disabled = grid.scrollLeft <= 2;
    $("#strip-next").disabled = grid.scrollLeft >= max;
    strip.classList.toggle("no-overflow", max <= 0);
  }
  function scrollByCard(dir) {
    const card = grid.querySelector(".postcard");
    const step = card ? card.getBoundingClientRect().width + 24 : grid.clientWidth * 0.8;
    grid.scrollBy({ left: dir * step * (window.innerWidth > 1000 ? 2 : 1), behavior: "smooth" });
  }
  $$(".view-btn").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view, true)));
  $("#strip-prev").addEventListener("click", () => scrollByCard(-1));
  $("#strip-next").addEventListener("click", () => scrollByCard(1));
  grid.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  grid.addEventListener("keydown", (e) => {
    if (!strip.classList.contains("is-row")) return;
    if (e.key === "ArrowRight") { scrollByCard(1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { scrollByCard(-1); e.preventDefault(); }
  });
  (function initView() {
    let saved = null;
    try { saved = localStorage.getItem("nvoy-deal-view"); } catch (e) { /* storage unavailable */ }
    setView(saved === "grid" ? "grid" : "row", false);
  })();

  /* ---------- deal → form hand-off ---------- */
  function setAsking(deal) {
    const f = $("#f-deal"), lbl = $("#f-deal-label"), box = $("#field-deal");
    if (deal) {
      f.value = `${deal.hotel} (${deal.perk})`;
      lbl.textContent = `${deal.hotel}: ${deal.perk}`;
      box.hidden = false;
      const dest = $("[name=destination]");
      if (!dest.value) dest.value = `${deal.destination}, ${deal.country}`;
    } else {
      f.value = ""; lbl.textContent = ""; box.hidden = true;
    }
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ask]");
    if (!b) return;
    const deal = DEALS.find((d) => d.id === b.dataset.ask);
    setAsking(deal);
    $("#sent").hidden = true; $("#enquiry").hidden = false;
    $("#plan").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => $("[name=name]").focus({ preventScroll: true }), 500);
  });
  $("#f-deal-clear").addEventListener("click", () => setAsking(null));

  /* ---------- enquiry form ---------- */
  function summary(fd) {
    const g = (k) => (fd.get(k) || "").toString().trim();
    const lines = [`Hi ${CONFIG.advisorName || ""}, I'd like help with a trip.`];
    if (g("deal")) lines.push(`Deal: ${g("deal")}`);
    lines.push(`Name: ${g("name")}`);
    if (g("destination")) lines.push(`Where: ${g("destination")}`);
    if (g("checkin") || g("checkout")) lines.push(`Dates: ${g("checkin") || "?"} to ${g("checkout") || "?"}${g("flexible") ? " (flexible)" : ""}`);
    else if (g("flexible")) lines.push("Dates: flexible");
    lines.push(`Travellers: ${g("adults") || "0"} adults, ${g("children") || "0"} children`);
    if (g("budget")) lines.push(`Budget: ${g("budget")} a night`);
    if (g("notes")) lines.push(`Notes: ${g("notes")}`);
    return lines.join("\n");
  }

  const form = $("#enquiry");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $("#form-status");
    status.textContent = "";
    // validation
    let bad = null;
    $$("[required]", form).forEach((el) => {
      const ok = el.checkValidity();
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !bad) bad = el;
    });
    if (bad) {
      status.textContent = bad.type === "email" ? "That email address doesn't look right." : "A few details are missing. The highlighted fields are required.";
      bad.focus();
      return;
    }
    const fd = new FormData(form);
    if ((fd.get("_honey") || "").toString()) return; // bot
    fd.delete("_honey");
    const text = summary(fd);
    fd.append("message", text);
    fd.append("_captcha", "false");

    const btn = $("#submit-btn");
    btn.disabled = true; btn.textContent = "Sending…";
    let ok = false;
    try {
      const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: fd });
      ok = res.ok;
    } catch (err) { ok = false; }
    btn.disabled = false; btn.textContent = "Get my hotel options";

    const wa = $("#sent-wa");
    wa.href = waLink(text);
    if (ok) {
      form.hidden = true;
      const sent = $("#sent");
      sent.hidden = false;
      sent.scrollIntoView({ behavior: "smooth", block: "center" });
      $("h3", sent).focus && $("h3", sent).setAttribute("tabindex", "-1");
      $("h3", sent).focus({ preventScroll: true });
    } else {
      status.innerHTML = `The email didn't go through. <a href="${esc(waLink(text))}" target="_blank" rel="noopener">Send it on WhatsApp instead</a> or email <a href="mailto:${esc(CONFIG.email || "")}?subject=Trip%20enquiry&body=${encodeURIComponent(text)}">${esc(CONFIG.email || "me")}</a>.`;
    }
  });
  $("#sent-again").addEventListener("click", () => {
    form.reset(); setAsking(null);
    $("#sent").hidden = true; form.hidden = false;
    $("[name=name]").focus();
  });

  /* ---------- nav ---------- */
  const toggle = $(".nav-toggle"), menu = $("#nav-menu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- boot ---------- */
  const SITE_VERSION = (document.querySelector('script[src*="site.js"]') || {}).src?.split("v=")[1] || String(Date.now());
  async function load(path) {
    const res = await fetch(`${path}?v=${encodeURIComponent(SITE_VERSION)}`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    return res.json();
  }
  (async () => {
    try {
      const [cfg, data, progs, hotels] = await Promise.all([load("config.json"), load("deals.json"), load("programs.json").catch(() => ({})), load("hotels.json").catch(() => ({}))]);
      CONFIG = cfg || {};
      PROGRAMS = Array.isArray(progs.programs) ? progs.programs : [];
      COMMON_TERMS = Array.isArray(progs.commonTerms) ? progs.commonTerms : [];
      HOTELS = Array.isArray(hotels.hotels) ? hotels.hotels : [];
      if (progs.typicalPerks) CONFIG.typicalPerks = progs.typicalPerks;
      const all = Array.isArray(data.deals) ? data.deals : [];
      DEALS = all.filter(isLive);
      $("#sample-notice").hidden = !(data.sample || DEALS.some((d) => d.sample));
      renderContact();
      renderFilters(DEALS);
      renderGrid(DEALS);
      renderPerks();
      renderPrograms();
      renderExplore();
      renderRecent();
      renderAbout();
      renderQuotes();
      renderFaq();
      renderFollow();
    } catch (err) {
      console.error(err);
      $("#deals-empty").hidden = false;
      $("#deals-empty").textContent = "The deal board couldn't load. Refresh the page, or message me on WhatsApp and I'll send the current list.";
      renderContact();
    }
  })();
})();
