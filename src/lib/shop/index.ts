// Livello di accesso ai dati. Legge il catalogo reale generato da
// scripts/sync-catalog.mjs. Le shape sono quelle della Shopify Storefront API:
// quando il cliente fornirà uno Storefront access token, si sostituisce solo
// loadCatalog() con le query GraphQL — il resto dell'app non cambia.

import type { Product, Collection, Cart, CartLine, CollectionFilter, ProductVariant } from './types';
import { SHOPIFY_DOMAIN } from './site';

const EUR = (amount: string | number) => ({
  amount: typeof amount === 'number' ? amount.toFixed(2) : parseFloat(amount).toFixed(2),
  currencyCode: 'EUR',
});

interface RawVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: string;
  compareAtPrice?: string;
}

interface RawProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  tagsLine: ('streetwear' | 'old-money')[];
  images: { url: string; altText: string }[];
  options: { name: string; values: string[] }[];
  variants: RawVariant[];
}

interface RawCollection {
  handle: string;
  title: string;
  description: string;
  productHandles: string[];
}

function buildProduct(raw: RawProduct): Product {
  const variants: ProductVariant[] = raw.variants.map((v) => ({
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    // products.json non espone le giacenze: teniamo solo il booleano reale.
    quantityAvailable: v.availableForSale ? 1 : 0,
    selectedOptions: v.selectedOptions,
    price: EUR(v.price),
    compareAtPrice: v.compareAtPrice ? EUR(v.compareAtPrice) : undefined,
  }));

  const prices = variants.map((v) => parseFloat(v.price.amount));
  const compares = variants
    .map((v) => v.compareAtPrice && parseFloat(v.compareAtPrice.amount))
    .filter((n): n is number => typeof n === 'number' && n > 0);

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    productType: raw.productType,
    vendor: raw.vendor,
    tags: raw.tags,
    tagsLine: raw.tagsLine,
    availableForSale: variants.some((v) => v.availableForSale),
    priceRange: { minVariantPrice: EUR(Math.min(...prices)), maxVariantPrice: EUR(Math.max(...prices)) },
    compareAtPriceRange: compares.length
      ? {
          minVariantCompareAtPrice: EUR(Math.min(...compares)),
          maxVariantCompareAtPrice: EUR(Math.max(...compares)),
        }
      : undefined,
    images: raw.images,
    variants,
    options: raw.options,
    featuredImage: raw.images[0],
  };
}

let catalogPromise: Promise<{ products: Product[]; collections: Collection[] }> | null = null;

function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(`${import.meta.env.BASE_URL}catalog.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`catalog.json: HTTP ${r.status}`);
        return r.json() as Promise<{ products: RawProduct[]; collections: RawCollection[] }>;
      })
      .then((data) => {
        const products = data.products.map(buildProduct);
        const byHandle = new Map(products.map((p) => [p.handle, p.id]));
        const collections: Collection[] = data.collections.map((c) => ({
          id: `c-${c.handle}`,
          handle: c.handle,
          title: c.title,
          description: c.description,
          productIds: c.productHandles.map((h) => byHandle.get(h)).filter((id): id is string => !!id),
        }));
        return { products, collections };
      })
      .catch((err) => {
        // Non lasciamo la promise in stato rifiutato: un retry successivo
        // resterebbe bloccato sullo stesso errore per sempre.
        catalogPromise = null;
        throw err;
      });
  }
  return catalogPromise;
}

export async function getProducts(): Promise<Product[]> {
  return (await loadCatalog()).products;
}

export async function getAllCollections(): Promise<Collection[]> {
  return (await loadCatalog()).collections;
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  return (await loadCatalog()).collections.find((c) => c.handle === handle);
}

export async function getProductsByCollection(handle: string): Promise<Product[]> {
  const { products, collections } = await loadCatalog();
  const collection = collections.find((c) => c.handle === handle);
  if (!collection) return [];
  const ids = new Set(collection.productIds);
  return products.filter((p) => ids.has(p.id));
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  return (await loadCatalog()).products.find((p) => p.handle === handle);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { products } = await loadCatalog();
  const sameVendor = products.filter((p) => p.id !== product.id && p.vendor === product.vendor && p.availableForSale);
  const sameLine = products.filter(
    (p) => p.id !== product.id && p.availableForSale && p.tagsLine.some((t) => product.tagsLine.includes(t)),
  );
  const seen = new Set<string>();
  return [...sameVendor, ...sameLine].filter((p) => !seen.has(p.id) && seen.add(p.id)).slice(0, limit);
}

export function matchesFilter(p: Product, filter: CollectionFilter): boolean {
  if (filter.productType && p.productType !== filter.productType) return false;
  if (filter.brand && p.vendor !== filter.brand) return false;
  if (filter.linea && filter.linea !== 'all' && !p.tagsLine.includes(filter.linea)) return false;
  if (filter.outlet && !p.tags.includes('outlet')) return false;
  if (filter.prezzoMax && parseFloat(p.priceRange.minVariantPrice.amount) > filter.prezzoMax) return false;
  if (filter.taglia && !p.options.some((o) => o.name === 'Taglia' && o.values.includes(filter.taglia!))) return false;
  if (
    filter.colore &&
    !p.options.some((o) => o.name === 'Colore' && o.values.some((v) => v.toLowerCase().includes(filter.colore!.toLowerCase())))
  )
    return false;
  return true;
}

export async function getFilteredProducts(filter: CollectionFilter): Promise<Product[]> {
  return (await getProducts()).filter((p) => matchesFilter(p, filter));
}

// ── Cart ──
// Il checkout è quello di Shopify. Il permalink /cart/{variantId}:{qty} crea il
// carrello lato Shopify e porta al pagamento reale, senza token né backend.
export function buildCheckoutUrl(lines: CartLine[]): string {
  if (lines.length === 0) return `${SHOPIFY_DOMAIN}/cart`;
  return `${SHOPIFY_DOMAIN}/cart/${lines.map((l) => `${l.variantId}:${l.quantity}`).join(',')}`;
}

function computeCartCost(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + parseFloat(l.price.amount) * l.quantity, 0);
  return { subtotalAmount: EUR(subtotal), totalAmount: EUR(subtotal) };
}

export function cartFromLines(cartId: string, lines: CartLine[]): Cart {
  return {
    id: cartId,
    lines,
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    cost: computeCartCost(lines),
    checkoutUrl: buildCheckoutUrl(lines),
  };
}
