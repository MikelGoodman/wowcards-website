# WOW CARDS staging pages

All HTML is `noindex, nofollow`. Shared chrome: slime header, Products dropdown (Cards / Tags & combos / Badges / Holders & extras), Price it, Contact, 1800 801 901.

Upload the site folder as-is. You do **not** need to upload `_lib.py`, `_render.py`, `_pages1.json`, `_pages2.json`, `_pages3.json` — those only regenerate HTML.

## Live published price (calculator)

| Page | Product key | From |
| --- | --- | --- |
| [index.html](index.html) | gift (default) + all tabs | homepage calculator |
| [gift-cards.html](gift-cards.html) | `?product=gift` | 250 $264 … 10,000 $2,855 |
| [membership-cards.html](membership-cards.html) | `?product=member` | same as gift |
| [business-cards.html](business-cards.html) | `?product=business` | same as gift |
| [premium-cards.html](premium-cards.html) | `?product=premium` | 250 $399 … 10,000 $3,498 |
| [keytags.html](keytags.html) | `?product=keytags` | 250 $274 … 20,000 $5,047; extras barcode +$50, sequential +$50, foil from +$100 |

Deep-link: `gift-cards.html#calc?product=gift` or `index.html?product=keytags#calc`. `calc.js` also reads `body[data-product]` / `#calc[data-product]`.

## Published table (not the card slider)

| Page | Notes |
| --- | --- |
| [name-badges.html](name-badges.html) | Magnet $24.95–$6.62 ea (10–200); pin $22.85–$5.12 ea. Quote form under the table. |

## Quote only — no invented prices

| Page |
| --- |
| [loyalty-cards.html](loyalty-cards.html) |
| [rewards-cards.html](rewards-cards.html) |
| [vip-cards.html](vip-cards.html) |
| [clear-cards.html](clear-cards.html) |
| [card-keytag-combos.html](card-keytag-combos.html) |
| [rfid-cards.html](rfid-cards.html) |
| [hotel-key-cards.html](hotel-key-cards.html) |
| [id-badges.html](id-badges.html) |
| [event-badges.html](event-badges.html) |
| [gift-card-holders.html](gift-card-holders.html) |
| [hanging-gift-cards.html](hanging-gift-cards.html) |
| [paper-cards.html](paper-cards.html) |
| [plastic-postcards.html](plastic-postcards.html) |
| [table-tents.html](table-tents.html) |
| [fundraising-cards.html](fundraising-cards.html) |
| [contact.html](contact.html) |

## Shared files

- `styles.css`, `calc.js`, `site.js`, `prices.json`, `quote-submit.php`
- `assets/` slime logos + `assets/products/` PR Australia catalog photos
- Holders, paper, postcards, table tents use a branded CSS/SVG placeholder (no PR photo, no hotlinked US image)

Quotes still post to `quote-submit.php` → PR Australia, Terrigal NSW, info@pr.com.au, 1800 801 901.
