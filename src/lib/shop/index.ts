// Livello di accesso ai dati — tutte le funzioni sono tipizzate e sostituibili
// con chiamate reali alla Shopify Storefront API cambiando solo questo file.

import type { Product, Collection, Cart, CartLine, CollectionFilter } from './types';
import { products, collections } from './mock-data';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getProducts(): Promise<Product[]> {
  await delay(50);
  return products;
}

export async function getProductsByCollection(handle: string): Promise<Product[]> {
  await delay(50);
  const collection = collections.find((c) => c.handle === handle);
  if (!collection) return [];
  return products.filter((p) => collection.productIds.includes(p.id));
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  await delay(30);
  return collections.find((c) => c.handle === handle);
}

export async function getAllCollections(): Promise<Collection[]> {
  await delay(30);
  return collections;
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  await delay(50);
  return products.find((p) => p.handle === handle);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  await delay(30);
  return products
    .filter((p) => p.id !== product.id && p.tagsLine.some((t) => product.tagsLine.includes(t)))
    .slice(0, limit);
}

export async function getFilteredProducts(filter: CollectionFilter): Promise<Product[]> {
  await delay(50);
  return products.filter((p) => {
    if (filter.productType && p.productType !== filter.productType) return false;
    if (filter.brand && p.vendor !== filter.brand) return false;
    if (filter.linea && filter.linea !== 'all' && !p.tagsLine.includes(filter.linea)) return false;
    if (filter.outlet && !p.tags.includes('outlet')) return false;
    if (filter.prezzoMax && parseFloat(p.priceRange.minVariantPrice.amount) > filter.prezzoMax) return false;
    if (filter.taglia && !p.options.some((o) => o.name === 'Taglia' && o.values.includes(filter.taglia!))) return false;
    if (filter.colore && !p.options.some((o) => o.name === 'Colore' && o.values.some((v) => v.toLowerCase().includes(filter.colore!.toLowerCase())))) return false;
    return true;
  });
}

// ── Cart ──
let cartCounter = 0;

export async function createCart(): Promise<Cart> {
  await delay(20);
  return {
    id: `cart-${Date.now()}-${cartCounter++}`,
    lines: [],
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: '0.00', currencyCode: 'EUR' },
      totalAmount: { amount: '0.00', currencyCode: 'EUR' },
    },
    checkoutUrl: '#checkout',
  };
}

function computeCartCost(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + parseFloat(l.price.amount) * l.quantity, 0);
  return {
    subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'EUR' },
    totalAmount: { amount: subtotal.toFixed(2), currencyCode: 'EUR' },
  };
}

export function cartFromLines(cartId: string, lines: CartLine[]): Cart {
  return {
    id: cartId,
    lines,
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    cost: computeCartCost(lines),
    checkoutUrl: '#checkout',
  };
}

export { products, collections };
