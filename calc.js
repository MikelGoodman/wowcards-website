/* WOW CARDS live price calculator. Published PR breaks only — no interpolated prices. */
(function () {
  "use strict";

  const FALLBACK = {
    currency: "AUD",
    gstIncluded: true,
    delivery: "Free Delivery Australia Wide",
    products: [
      {
        id: "gift",
        name: "Gift Cards",
        short: "Gift",
        blurb: "Shop, venue and promo cards. Credit-card size, printed both sides.",
        breaks: [
          { qty: 250, price: 264 },
          { qty: 500, price: 315 },
          { qty: 1000, price: 472 },
          { qty: 2000, price: 785 },
          { qty: 5000, price: 1744 },
          { qty: 10000, price: 2855 }
        ],
        pricedExtras: [],
        quoteExtras: [
          { id: "barcode", label: "Barcode" },
          { id: "magstripe", label: "Magstripe" },
          { id: "numbering", label: "Numbering" }
        ]
      },
      {
        id: "member",
        name: "Member Cards",
        short: "Member",
        blurb: "Clubs, gyms and loyalty. Same published tiers as gift and business cards.",
        breaks: [
          { qty: 250, price: 264 },
          { qty: 500, price: 315 },
          { qty: 1000, price: 472 },
          { qty: 2000, price: 785 },
          { qty: 5000, price: 1744 },
          { qty: 10000, price: 2855 }
        ],
        pricedExtras: [],
        quoteExtras: [
          { id: "barcode", label: "Barcode" },
          { id: "magstripe", label: "Magstripe" },
          { id: "numbering", label: "Numbering" }
        ]
      },
      {
        id: "business",
        name: "Business Cards",
        short: "Business",
        blurb: "Plastic business cards that outlast paper stock.",
        breaks: [
          { qty: 250, price: 264 },
          { qty: 500, price: 315 },
          { qty: 1000, price: 472 },
          { qty: 2000, price: 785 },
          { qty: 5000, price: 1744 },
          { qty: 10000, price: 2855 }
        ],
        pricedExtras: [],
        quoteExtras: [
          { id: "barcode", label: "Barcode" },
          { id: "magstripe", label: "Magstripe" },
          { id: "numbering", label: "Numbering" }
        ]
      },
      {
        id: "keytags",
        name: "Keytags",
        short: "Keytags",
        blurb: "Compact tags for gyms, keys and scan-and-go. Hole-punched.",
        breaks: [
          { qty: 250, price: 274 },
          { qty: 500, price: 428 },
          { qty: 1000, price: 603 },
          { qty: 2000, price: 784 },
          { qty: 3000, price: 987 },
          { qty: 4000, price: 1433 },
          { qty: 5000, price: 1705 },
          { qty: 10000, price: 2749 },
          { qty: 20000, price: 5047 }
        ],
        pricedExtras: [
          { id: "barcode", label: "Barcoding", price: 50, from: false },
          { id: "sequential", label: "Sequential Numbers", price: 50, from: false },
          { id: "foil", label: "Foil Stamping", price: 100, from: true }
        ],
        quoteExtras: []
      },
      {
        id: "premium",
        name: "Premium Cards",
        short: "Premium",
        blurb: "A richer card for when the stock itself needs to feel special.",
        breaks: [
          { qty: 250, price: 399 },
          { qty: 500, price: 499 },
          { qty: 1000, price: 679 },
          { qty: 2000, price: 989 },
          { qty: 5000, price: 2120 },
          { qty: 10000, price: 3498 }
        ],
        pricedExtras: [],
        quoteExtras: [
          { id: "barcode", label: "Barcode" },
          { id: "magstripe", label: "Magstripe" },
          { id: "numbering", label: "Numbering" }
        ]
      }
    ]
  };

  let prices = FALLBACK;
  const state = {
    productId: "gift",
    qty: 250,
    extras: {}
  };

  let displayedTotal = 0;
  let animFrom = 0;
  let animTo = 0;
  let animStart = 0;
  let animating = false;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel) => document.querySelector(sel);

  function product() {
    return prices.products.find((p) => p.id === state.productId) || prices.products[0];
  }

  function nearestBreak(prod, qty) {
    let best = prod.breaks[0];
    let dist = Infinity;
    for (const br of prod.breaks) {
      const d = Math.abs(br.qty - qty);
      if (d < dist) {
        dist = d;
        best = br;
      }
    }
    return best;
  }

  function currentBreak() {
    const prod = product();
    return prod.breaks.find((b) => b.qty === state.qty) || nearestBreak(prod, state.qty);
  }

  function money(n) {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(n));
  }

  function moneyEach(n) {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
  }

  function comma(n) {
    return new Intl.NumberFormat("en-AU").format(n);
  }

  function quote() {
    const prod = product();
    const br = currentBreak();
    let total = br.price;
    const lines = [{ label: comma(br.qty) + " " + prod.name.toLowerCase(), amount: br.price, live: true }];
    const extraLabels = [];

    (prod.pricedExtras || []).forEach((ex) => {
      if (state.extras[ex.id]) {
        total += ex.price;
        const tag = ex.from ? "from +$" + ex.price : "+$" + ex.price;
        lines.push({ label: ex.label + " (" + tag + ")", amount: ex.price, live: true });
        extraLabels.push(ex.label + " (" + tag + ")");
      }
    });

    (prod.quoteExtras || []).forEach((ex) => {
      if (state.extras[ex.id]) {
        lines.push({ label: ex.label + " — included in quote, we’ll confirm", amount: null, live: false });
        extraLabels.push(ex.label + " (included in quote, we’ll confirm)");
      }
    });

    return {
      product: prod,
      break: br,
      total: total,
      perCard: total / br.qty,
      lines: lines,
      extrasText: extraLabels.length ? extraLabels.join("; ") : "None"
    };
  }

  function setQty(qty) {
    const br = nearestBreak(product(), qty);
    state.qty = br.qty;
    paintSelection();
    paintTotal();
  }

  function setProduct(id) {
    const next = prices.products.find((p) => p.id === id);
    if (!next) return;
    state.productId = next.id;
    state.extras = {};
    state.qty = nearestBreak(next, state.qty).qty;
    paintChrome();
    paintTotal();
  }

  function paintChrome() {
    const prod = product();
    const tabs = $("#tabs");
    tabs.innerHTML = prices.products
      .map((p) => {
        const on = p.id === prod.id ? " is-on" : "";
        return (
          '<button type="button" class="tab' +
          on +
          '" data-product="' +
          p.id +
          '" aria-pressed="' +
          (p.id === prod.id) +
          '">' +
          p.name +
          "</button>"
        );
      })
      .join("");

    $("#product-blurb").textContent = prod.blurb;

    const chips = $("#chips");
    chips.innerHTML = prod.breaks
      .map((br) => {
        return (
          '<button type="button" class="chip" data-qty="' +
          br.qty +
          '"><span class="qty">' +
          comma(br.qty) +
          '</span><span class="aud">' +
          money(br.price) +
          "</span></button>"
        );
      })
      .join("");

    const slider = $("#qty-slider");
    slider.min = "0";
    slider.max = String(prod.breaks.length - 1);
    slider.step = "1";
    $("#slide-min").textContent = comma(prod.breaks[0].qty);
    $("#slide-max").textContent = comma(prod.breaks[prod.breaks.length - 1].qty);

    const extras = $("#extras");
    const priced = prod.pricedExtras || [];
    const quoted = prod.quoteExtras || [];
    if (!priced.length && !quoted.length) {
      extras.hidden = true;
      extras.innerHTML = "";
    } else {
      extras.hidden = false;
      let html = "<h3>Extras</h3>";
      if (priced.length) {
        html += '<p class="extra-note">Published keytag extras. These add to the live total.</p><div class="checks">';
        priced.forEach((ex) => {
          const tag = ex.from ? "from +$" + ex.price : "+$" + ex.price;
          html +=
            '<label class="check"><input type="checkbox" data-extra="' +
            ex.id +
            '"><span>' +
            ex.label +
            " <small>" +
            tag +
            "</small></span></label>";
        });
        html += "</div>";
      }
      if (quoted.length) {
        html +=
          '<p class="extra-note">Tick what you need. These do not change the live total — included in quote, we’ll confirm.</p><div class="checks">';
        quoted.forEach((ex) => {
          html +=
            '<label class="check"><input type="checkbox" data-extra="' +
            ex.id +
            '"><span>' +
            ex.label +
            " <small>included in quote, we’ll confirm</small></span></label>";
        });
        html += "</div>";
      }
      extras.innerHTML = html;
    }

    paintSelection();
  }

  function paintSelection() {
    const prod = product();
    const idx = Math.max(
      0,
      prod.breaks.findIndex((b) => b.qty === state.qty)
    );
    $("#qty-slider").value = String(idx);
    $("#slide-now").textContent = comma(state.qty);
    document.querySelectorAll(".chip").forEach((el) => {
      el.classList.toggle("is-on", Number(el.getAttribute("data-qty")) === state.qty);
    });
    document.querySelectorAll(".tab").forEach((el) => {
      const on = el.getAttribute("data-product") === state.productId;
      el.classList.toggle("is-on", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function paintTotal() {
    const q = quote();
    const totalEl = $("#total");
    const perEl = $("#per");
    const list = $("#breakdown");

    perEl.textContent = moneyEach(q.perCard) + " per card";
    list.innerHTML = q.lines
      .map((line) => {
        const right = line.live ? money(line.amount) : "on quote";
        return "<li><span>" + line.label + "</span><span>" + right + "</span></li>";
      })
      .join("");

    $("#f-product").value = q.product.name;
    $("#f-qty").value = String(q.break.qty);
    $("#f-total").value = money(q.total);
    $("#f-extras").value = q.extrasText;
    $("#f-per").value = moneyEach(q.perCard);

    animateTotal(q.total);
  }

  function animateTotal(next) {
    const el = $("#total");
    if (reduceMotion) {
      displayedTotal = next;
      el.textContent = money(next);
      return;
    }
    animFrom = displayedTotal;
    animTo = next;
    animStart = performance.now();
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
    if (!animating) {
      animating = true;
      requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    const t = Math.min(1, (now - animStart) / 380);
    const eased = 1 - Math.pow(1 - t, 3);
    displayedTotal = animFrom + (animTo - animFrom) * eased;
    $("#total").textContent = money(displayedTotal);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      displayedTotal = animTo;
      $("#total").textContent = money(animTo);
      animating = false;
    }
  }

  function bind() {
    $("#tabs").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-product]");
      if (btn) setProduct(btn.getAttribute("data-product"));
    });

    $("#chips").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-qty]");
      if (btn) setQty(Number(btn.getAttribute("data-qty")));
    });

    $("#qty-slider").addEventListener("input", (e) => {
      const prod = product();
      const i = Number(e.target.value);
      const br = prod.breaks[i];
      if (br) setQty(br.qty);
    });

    $("#extras").addEventListener("change", (e) => {
      const box = e.target.closest("[data-extra]");
      if (!box) return;
      state.extras[box.getAttribute("data-extra")] = box.checked;
      paintTotal();
    });

    document.querySelectorAll("[data-jump-product]").forEach((el) => {
      el.addEventListener("click", () => {
        setProduct(el.getAttribute("data-jump-product"));
      });
    });

    const form = $("#quote-form");
    form.addEventListener("submit", (e) => {
      if (location.protocol === "file:") {
        e.preventDefault();
        sendMailto();
        return;
      }
      // PHP path: hidden fields already filled
    });
  }

  function sendMailto() {
    const q = quote();
    const name = $("#name").value.trim();
    const business = $("#business").value.trim();
    const email = $("#email").value.trim();
    const phone = $("#phone").value.trim();
    const notes = $("#notes").value.trim();
    if (!name || !email || !phone) {
      $("#form-status").textContent = "Please add your name, email and phone.";
      return;
    }
    const body = [
      "WOW CARDS quote request",
      "",
      "Name: " + name,
      "Business: " + business,
      "Email: " + email,
      "Phone: " + phone,
      "Notes: " + notes,
      "",
      "Product: " + q.product.name,
      "Quantity: " + q.break.qty,
      "Total: " + money(q.total) + " AUD (GST and free AU delivery included)",
      "Per card: " + moneyEach(q.perCard),
      "Extras: " + q.extrasText
    ].join("\n");
    const href =
      "mailto:info@pr.com.au?subject=" +
      encodeURIComponent("WOW CARDS quote — " + q.product.name + " x " + q.break.qty) +
      "&body=" +
      encodeURIComponent(body);
    $("#form-status").textContent = "Opening your email app to send this quote to PR Australia…";
    window.location.href = href;
  }

  function requestedProduct() {
    const valid = new Set((prices.products || []).map((p) => p.id));
    const aliases = {
      gift: "gift",
      "gift-cards": "gift",
      member: "member",
      membership: "member",
      members: "member",
      "member-cards": "member",
      "membership-cards": "member",
      business: "business",
      "business-cards": "business",
      keytags: "keytags",
      keytag: "keytags",
      premium: "premium",
      "premium-cards": "premium"
    };
    function pick(raw) {
      if (!raw) return null;
      const key = String(raw).toLowerCase().trim();
      const id = aliases[key] || key;
      return valid.has(id) ? id : null;
    }
    const q = new URLSearchParams(location.search);
    let id = pick(q.get("product"));
    const hash = (location.hash || "").replace(/^#/, "");
    if (!id && hash.includes("product=")) {
      const qs = hash.includes("?") ? hash.split("?")[1] : hash;
      id = pick(new URLSearchParams(qs).get("product"));
    }
    if (!id) {
      const bare = (hash.split("?")[0] || "").replace(/^#/, "");
      if (bare && !["calc", "quote", "range", "top", "faq"].includes(bare)) {
        id = pick(bare);
      }
    }
    const lockEl = document.getElementById("calc");
    const lock = document.body.getAttribute("data-product") || (lockEl && lockEl.getAttribute("data-product"));
    if (!id) id = pick(lock);
    return id;
  }

  function fromUrl(scroll) {
    const id = requestedProduct();
    if (!id) return;
    setProduct(id);
    if (scroll) {
      const calc = document.getElementById("calc");
      const hash = (location.hash || "").replace(/^#/, "");
      if (calc && (hash.startsWith("calc") || location.search.indexOf("product=") !== -1)) {
        calc.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }
  }

  async function boot() {
    try {
      const res = await fetch("prices.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products) && data.products.length) {
          prices = data;
        }
      }
    } catch (err) {
      prices = FALLBACK;
    }
    if (!$("#tabs") || !$("#quote-form")) return;
    bind();
    fromUrl(false);
    paintChrome();
    paintTotal();
    window.addEventListener("hashchange", function () { fromUrl(true); });
    window.addEventListener("popstate", function () { fromUrl(true); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
