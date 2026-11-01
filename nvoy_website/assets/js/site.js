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
  function postcard(deal, featured) {
    const img = deal.image
      ? `<img src="${esc(deal.image)}" alt="${esc(deal.hotel)}, ${esc(deal.destination)}" loading="${featured ? "eager" : "lazy"}" width="400" height="300" data-art="${esc(deal.art || "island")}" data-id="${esc(deal.id)}">`
      : art(deal.art, deal.id);
    const details = (deal.details || []).map((d) => `<li>${esc(d)}</li>`).join("");
    return `<article class="postcard${featured ? " postcard-featured" : ""}" data-id="${esc(deal.id)}">
      <div class="postcard-photo">
        ${featured ? `<span class="featured-tag">Featured this month</span>` : deal.sample ? `<span class="featured-tag sample-tag">Sample</span>` : ""}
        ${img}
        <span class="stamp">${esc(deal.perk)}</span>
      </div>
      <div class="postcard-body">
        <p class="postcard-place">${esc(deal.destination)}${deal.country ? ", " + esc(deal.country) : ""}</p>
        <h3 class="postcard-hotel">${esc(deal.hotel)}</h3>
        ${deal.note ? `<p class="postcard-note">${esc(deal.note)}</p>` : ""}
        ${details ? `<ul class="postcard-details">${details}</ul>` : ""}
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

  function renderFeatured(deals) {
    const slot = $("#featured-slot");
    const pick = deals.find((d) => d.featured) || deals[0];
    if (!pick) { slot.hidden = true; return; }
    slot.innerHTML = postcard(pick, true);
    hookImages(slot);
  }

  let activeTag = "All";
  function renderFilters(deals) {
    const tags = new Set();
    deals.forEach((d) => (d.tags || []).forEach((t) => tags.add(t)));
    const list = ["All", ...Array.from(tags).sort()];
    const box = $("#filters");
    if (list.length <= 2) { box.hidden = true; return; }
    box.innerHTML = list.map((t) => `<button type="button" class="chip" aria-pressed="${t === activeTag}" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
    box.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      activeTag = b.dataset.tag;
      $$(".chip", box).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      renderGrid(deals);
    });
  }

  function renderGrid(deals) {
    const grid = $("#deal-grid");
    const shown = deals.filter((d) => activeTag === "All" || (d.tags || []).includes(activeTag));
    grid.innerHTML = shown.map((d) => postcard(d, false)).join("");
    $("#deals-empty").hidden = shown.length > 0;
    hookImages(grid);
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
      (a.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("") +
      (CONFIG.foraProfile ? `<a class="btn btn-ghost-navy" href="${esc(CONFIG.foraProfile)}" target="_blank" rel="noopener">See my Fora profile</a>` : "");
    const img = $("#about-photo");
    if (a.photo) img.src = a.photo;
    img.alt = `${CONFIG.advisorFullName || CONFIG.advisorName || "Your advisor"}, ${CONFIG.advisorTitle || "travel advisor"}`;
    img.addEventListener("error", () => {
      const wrap = document.createElement("div");
      wrap.innerHTML = art("coast", "about");
      img.replaceWith(wrap.firstElementChild);
    }, { once: true });
  }

  function renderMath() {
    const m = CONFIG.travelMath;
    const box = $("#travel-math");
    if (!m || !m.hotel) { box.hidden = true; return; }
    box.hidden = false;
    $("#math-sub").textContent = `${m.room ? m.room + " at " : ""}${m.hotel}.`;
    $("#math-direct-label").textContent = m.directLabel || "Booking direct";
    $("#math-direct-price").textContent = m.directPrice || "";
    $("#math-direct-items").innerHTML = (m.directItems || []).map((t) => `<li>${esc(t)}</li>`).join("");
    $("#math-nvoy-label").textContent = m.nvoyLabel || "Booked with Nvoy";
    $("#math-nvoy-price").textContent = m.nvoyPrice || "";
    $("#math-nvoy-items").innerHTML = (m.nvoyItems || []).map((t) => `<li>${esc(t)}</li>`).join("");
  }

  function renderRecent() {
    const r = CONFIG.recentBookings || [];
    const box = $("#recent");
    if (!r.length) { box.hidden = true; return; }
    box.hidden = false;
    $("#recent-list").innerHTML = r.map((b) => `<li><strong>${esc(b.hotel)}</strong><span>${esc(b.result || b.place || "")}</span></li>`).join("");
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

  function renderInsta() {
    const handle = (CONFIG.instagram || "").replace(/^@/, "");
    const url = handle ? `https://www.instagram.com/${handle}` : "#";
    $("#insta-link").href = url;
    $("#foot-insta").href = url;
    const kinds = ["island", "coast", "city", "jungle", "desert", "mountain"];
    $("#insta-strip").innerHTML = (CONFIG.instagramTiles || []).slice(0, 6).map((t, i) =>
      `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(t.alt || "Instagram photo")}"><img src="${esc(t.image)}" alt="" width="300" height="300" data-art="${kinds[i % kinds.length]}" data-id="ig${i}"></a>`
    ).join("");
    hookImages($("#insta-strip"));
  }

  function renderContact() {
    $$("[data-whatsapp]").forEach((a) => { a.href = waLink(); });
    if (CONFIG.email) { const e = $("#foot-email"); e.href = `mailto:${CONFIG.email}`; e.textContent = CONFIG.email; }
    if (CONFIG.chains) $("#hero-note").textContent = `${CONFIG.chains}. Replies within a day, usually faster.`;
    if (CONFIG.advisorFullName) $("#foot-line").textContent = `Nvoy Travels is an independent travel advisory. ${CONFIG.advisorFullName} is an advisor with Fora Travel.`;
    $("#year").textContent = new Date().getFullYear();
  }

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
    btn.disabled = false; btn.textContent = "Send my trip details";

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
  async function load(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    return res.json();
  }
  (async () => {
    try {
      const [cfg, data] = await Promise.all([load("config.json"), load("deals.json")]);
      CONFIG = cfg || {};
      const all = Array.isArray(data.deals) ? data.deals : [];
      DEALS = all.filter(isLive);
      $("#sample-notice").hidden = !(data.sample || DEALS.some((d) => d.sample));
      renderContact();
      renderFeatured(DEALS);
      renderFilters(DEALS);
      renderGrid(DEALS);
      renderPerks();
      renderMath();
      renderRecent();
      renderAbout();
      renderQuotes();
      renderFaq();
      renderInsta();
    } catch (err) {
      console.error(err);
      $("#deals-empty").hidden = false;
      $("#deals-empty").textContent = "The deal board couldn't load. Refresh the page, or message me on WhatsApp and I'll send the current list.";
      renderContact();
    }
  })();
})();
