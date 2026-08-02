/**
 * Scarica il catalogo reale da Shopify e lo scrive in public/catalog.json.
 * Uso: node scripts/sync-catalog.mjs
 *
 * Usa gli endpoint pubblici .json — non serve token. Quando il cliente fornirà
 * un Storefront API token, questo script si sostituisce con chiamate live in
 * src/lib/shop/index.ts, che è già scritto contro le stesse shape.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SHOP = 'https://coloradostore.it';
const OUT = resolve(process.cwd(), 'public/catalog.json');

// Shopify rate-limita gli endpoint .json: senza backoff una richiesta su due
// torna HTML invece di JSON.
async function getJson(path, attempts = 10) {
  for (let i = 1; i <= attempts; i++) {
    await new Promise((r) => setTimeout(r, 400 * i));
    try {
      const res = await fetch(`${SHOP}${path}`);
      return await res.json();
    } catch {
      /* rate limit: riprova con attesa crescente */
    }
  }
  throw new Error(`fetch fallito: ${path}`);
}

const stripHtml = (html) =>
  (html || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&(?:quot|#34);/g, '"')
    .replace(/&(?:apos|#39);/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

// I nomi opzione nel negozio reale sono incoerenti: Taglia / TAGLIA / Numero
// scarpa / Numero di scarpa / Color / Colore. Li riduciamo a due assi.
function normalizeOptionName(name) {
  const n = name.toLowerCase().trim();
  if (/taglia|numero/.test(n)) return 'Taglia';
  if (/colou?r/.test(n)) return 'Colore';
  return null;
}

// Reparti e linee derivano dalle collection Shopify, non dai tag: 225 prodotti
// su 235 non hanno tag.
const IN = (map, handles) => (h) => handles.some((c) => map[c]?.has(h));

// Immagini scelte a mano dal negozio: stanno nei File di Shopify, non sono
// legate a un prodotto, quindi non si possono dedurre dal catalogo. Vanno
// elencate qui per non essere sovrascritte a ogni sync.
const IMAGE_OVERRIDES = {
  // Scatto hero della home di coloradostore.it — ragazzo in maglia bianca.
  streetwear: {
    url: 'https://coloradostore.it/cdn/shop/files/481A9A84-3040-4FFD-85AA-0327ADFCB046.jpg?v=1778249559',
    alt: 'Ragazzo in maglia bianca — la linea streetwear di Colorado Store',
  },
};

// Le immagini editoriali vengono dal catalogo reale: nessuna foto stock, tutto
// merce che il negozio ha davvero. Generato, non scritto a mano.
function writeEditorial(products, members) {
  const cdn = (url, w) => url.replace(/(\?|&)width=\d+/, '') + (url.includes('?') ? '&' : '?') + `width=${w}`;
  const pick = (handles, n = 1) => {
    const set = members[handles] || new Set();
    const found = products.filter((p) => set.has(p.handle) && p.images.length);
    return found.slice(0, n);
  };
  const one = (collection, offset = 0) => {
    const found = pick(collection, offset + 1);
    const p = found[offset] || found[0] || products[0];
    return { url: p.images[0].url, alt: p.title };
  };

  const pinned = (key, fallback) => IMAGE_OVERRIDES[key] ?? fallback;

  const uomo = pinned('uomoDept', one('abbigliamento-u'));
  const donna = pinned('donnaDept', one('abbigliamento-d'));
  const sneaker = pinned('sneakerDept', one('sneakers'));
  const street = pinned('streetwear', one('streetwear'));
  const oldMoney = pinned('oldMoney', one('camicie-uomo'));
  const levis = pinned('levis', one('levis'));
  const lookbook = pinned('lookbook', one('coordinati-donna', 1));

  const gallery = pick('new-collection', 8).map((p) => ({ url: cdn(p.images[0].url, 600), alt: p.title }));
  const spin = pick('sneakers', 8).map((p) => ({ url: cdn(p.images[0].url, 600), alt: p.title }));

  const body = `// GENERATO da scripts/sync-catalog.mjs — non modificare a mano.
// Tutte le immagini sono prodotti reali sul CDN Shopify del negozio.

export interface EditorialImage { url: string; alt: string }

export const editorialImages = {
  streetwear: ${JSON.stringify({ ...street, url: cdn(street.url, 1200) })},
  oldMoney: ${JSON.stringify({ ...oldMoney, url: cdn(oldMoney.url, 1200) })},
  levis: ${JSON.stringify({ ...levis, url: cdn(levis.url, 1600) })},
  lookbook: ${JSON.stringify({ ...lookbook, url: cdn(lookbook.url, 1200) })},
  uomoDept: ${JSON.stringify({ ...uomo, url: cdn(uomo.url, 1000) })},
  donnaDept: ${JSON.stringify({ ...donna, url: cdn(donna.url, 1000) })},
  sneakerDept: ${JSON.stringify({ ...sneaker, url: cdn(sneaker.url, 1000) })},
} satisfies Record<string, EditorialImage>;

export const galleryImages: EditorialImage[] = ${JSON.stringify(gallery, null, 2)};

export const spinFrames: EditorialImage[] = ${JSON.stringify(spin, null, 2)};
`;
  writeFileSync(resolve(process.cwd(), 'src/lib/shop/editorial.ts'), body);
  console.log(`editorial: ${gallery.length} gallery, ${spin.length} spin`);
}

// La sitemap va rigenerata insieme al catalogo, altrimenti punta a prodotti
// che non esistono più.
function writeSitemap(products, collections) {
  const today = new Date().toISOString().slice(0, 10);
  const paths = [
    '/',
    '/chi-siamo',
    '/negozio',
    '/contatti',
    '/privacy',
    '/cookie-policy',
    '/condizioni-di-vendita',
    '/diritto-di-recesso',
    '/spedizioni-e-resi',
    '/collezioni/streetwear',
    '/collezioni/old-money',
    ...collections.map((c) => `/collezioni/${c.handle}`),
    ...products.map((p) => `/prodotti/${p.handle}`),
  ];
  const body = [...new Set(paths)]
    .map((u) => `  <url><loc>${SHOP}${u}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  writeFileSync(
    resolve(process.cwd(), 'public/sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  );
  console.log(`sitemap: ${new Set(paths).size} url`);
}

// Su Shopify lo stesso brand compare come "LEVI'S", "Levi's" e "Levis": senza
// normalizzare, i filtri mostrano tre voci diverse per la stessa marca.
function canonicalizer(values) {
  const groups = new Map();
  for (const v of values) {
    const key = v.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(v);
  }
  const canonical = new Map();
  for (const [key, variants] of groups) {
    const distinct = [...new Set(variants)];
    // Una sola grafia: la lasciamo com'è. Riscriverla rovinerebbe gli acronimi
    // legittimi (JDY, JJXX, RRD).
    if (distinct.length === 1) continue;
    // Più grafie della stessa marca: teniamo quella con maiuscole e minuscole
    // miste, che è la scrittura curata.
    const mixed = distinct.find((v) => v !== v.toUpperCase() && v !== v.toLowerCase());
    canonical.set(key, (mixed || distinct[0]).trim());
  }
  return (v) => canonical.get(v.toLowerCase().replace(/[^a-z0-9]/g, '')) || v;
}

async function main() {
  const products = [];
  for (let page = 1; page <= 5; page++) {
    const d = await getJson(`/products.json?limit=250&page=${page}`);
    if (!d.products?.length) break;
    products.push(...d.products);
  }

  const { collections } = await getJson('/collections.json?limit=250');
  const members = {};
  for (const c of collections) {
    const d = await getJson(`/collections/${c.handle}/products.json?limit=250`);
    members[c.handle] = new Set((d.products || []).map((p) => p.handle));
    process.stdout.write(`  ${c.handle} (${members[c.handle].size})\n`);
  }

  const inAny = (...handles) => IN(members, handles);
  const isUomo = inAny('uomo', 'abbigliamento-u', 'levis-uomo', 'scarpe-uomo', 'sneakers-uomo');
  const isDonna = inAny('donna', 'abbigliamento-d', 'levis-donna', 'scarpe-donna', 'sneakers-donna');
  const isSneaker = inAny('scarpe', 'scarpe-uomo', 'scarpe-donna', 'sneakers', 'sneakers-uomo', 'sneakers-donna');
  const isOutlet = inAny('outlet', 'saldi-invernali', 'saldi-70', 'saldi-estivi-fino-50');
  const isNuovo = inAny('new-collection');
  const isBest = inAny('best-sellers', 'best-sellers-invernale');
  // Old money = i reparti sartoriali. Tutto il resto è streetwear, che è
  // l'anima prevalente del negozio.
  const isOldMoney = inAny(
    'camicie', 'camicie-uomo', 'maglieria-d', 'maglieria-u',
    'coordinati-uomo', 'coordinati-donna', 'abiti-donna', 'tailleur-e-coordinati',
  );

  const canonVendor = canonicalizer(products.map((p) => p.vendor || ''));
  const canonType = canonicalizer(products.map((p) => p.product_type || ''));

  const out = products.map((p) => {
    const h = p.handle;
    const tags = [];
    if (isUomo(h)) tags.push('uomo');
    if (isDonna(h)) tags.push('donna');
    if (isSneaker(h)) tags.push('sneaker');
    if (isOutlet(h)) tags.push('outlet');
    if (isNuovo(h)) tags.push('nuovo');
    if (isBest(h)) tags.push('best-seller');
    if (/levi/i.test(p.vendor)) tags.push('levis');

    const tagsLine = isOldMoney(h) ? ['old-money'] : ['streetwear'];

    // Ricostruiamo le opzioni dalle varianti reali, così i valori mostrati
    // esistono davvero a magazzino.
    const axes = { Taglia: [], Colore: [] };
    p.options.forEach((o, idx) => {
      const norm = normalizeOptionName(o.name);
      if (!norm) return;
      for (const v of p.variants) {
        const value = [v.option1, v.option2, v.option3][idx];
        if (value && value !== 'Default Title' && !axes[norm].includes(value)) axes[norm].push(value);
      }
    });

    const variants = p.variants.map((v) => {
      const selectedOptions = [];
      p.options.forEach((o, idx) => {
        const norm = normalizeOptionName(o.name);
        const value = [v.option1, v.option2, v.option3][idx];
        if (norm && value && value !== 'Default Title') selectedOptions.push({ name: norm, value });
      });
      return {
        id: String(v.id),
        title: v.title === 'Default Title' ? p.title : v.title,
        availableForSale: !!v.available,
        selectedOptions,
        price: v.price,
        compareAtPrice: v.compare_at_price || undefined,
      };
    });

    return {
      id: String(p.id),
      handle: h,
      title: p.title.replace(/\s+/g, ' ').trim(),
      description: stripHtml(p.body_html).slice(0, 600),
      productType: p.product_type ? canonType(p.product_type) : '',
      vendor: p.vendor ? canonVendor(p.vendor) : '',
      tags,
      tagsLine,
      images: p.images.slice(0, 3).map((i) => ({ url: i.src, altText: p.title.replace(/\s+/g, ' ').trim() })),
      options: Object.entries(axes)
        .filter(([, values]) => values.length > 0)
        .map(([name, values]) => ({ name, values })),
      variants,
    };
  });

  const keep = out.filter((p) => p.images.length > 0 && p.variants.length > 0);

  // Alcuni titoli su Shopify sono scritti senza apostrofo: li normalizziamo per
  // la visualizzazione, senza toccare i dati del negozio.
  const prettyTitle = (t) => t.replace(/\bLevi'?s\b/gi, 'Levi’s');

  const cols = collections
    .filter((c) => members[c.handle]?.size > 0)
    .map((c) => ({
      handle: c.handle,
      title: prettyTitle(c.title),
      description: stripHtml(c.body_html).slice(0, 300),
      productHandles: [...members[c.handle]].filter((h) => keep.some((p) => p.handle === h)),
    }));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ products: keep, collections: cols }));
  writeEditorial(keep, members);
  writeSitemap(keep, cols);

  console.log(`\nprodotti: ${keep.length} | collection: ${cols.length}`);
  console.log(`disponibili: ${keep.filter((p) => p.variants.some((v) => v.availableForSale)).length}`);
  console.log(`levi's: ${keep.filter((p) => p.tags.includes('levis')).length}`);
  console.log(`peso: ${(JSON.stringify({ products: keep, collections: cols }).length / 1024).toFixed(0)} kB`);
}

main();
