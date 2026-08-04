// Dati reali del negozio — presi da coloradostore.it (footer, /pages/contatti,
// /pages/chi-siamo). Unica fonte per contatti, indirizzo e social: se cambiano,
// si cambiano qui.

export const STORE = {
  name: 'Colorado Store',
  legalName: 'GD S.R.L.',
  vat: '03184120644',
  address: 'Via Dante Alighieri 34/36',
  zip: '83100',
  city: 'Avellino',
  province: 'AV',
  country: 'IT',
  phone: '+39 0825 37964',
  phoneHref: 'tel:+390825379640',
  email: 'gdsrlave@gmail.com',
  // Lun–Sab 9:00–13:00 e 16:30–20:00
  hours: [
    { days: 'Lunedì – Sabato', time: '9:00 – 13:00 · 16:30 – 20:00' },
    { days: 'Domenica', time: 'Chiuso' },
  ],
  openingHoursSchema: ['Mo-Sa 09:00-13:00', 'Mo-Sa 16:30-20:00'],
  // Geocodifica OpenStreetMap di Via Dante Alighieri, Avellino. OSM non mappa
  // il civico 34/36: il pin è preciso sulla via, non sulla porta. Le indicazioni
  // usano l'indirizzo testuale, che Google risolve al civico esatto.
  coords: { lat: 40.9144857, lng: 14.7858311 },
} as const;

export const STORE_FULL_ADDRESS = `${STORE.address}, ${STORE.zip} ${STORE.city} ${STORE.province}`;

export const STORE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STORE_FULL_ADDRESS)}`;

export const SOCIAL = {
  instagram: 'https://www.instagram.com/_colorado__store',
  instagramHandle: '@_colorado__store',
  tiktok: 'https://www.tiktok.com/@colorado__store',
  tiktokHandle: '@colorado__store',
  whatsapp: 'https://wa.me/393920285560',
  whatsappNumber: '+39 392 028 5560',
} as const;

// Condizioni commerciali reali pubblicate sul sito attuale.
export const SHIPPING = {
  freeThreshold: 89,
  standardCost: 6.9,
  deliveryTime: '24/48 ore',
  returnDays: 14,
} as const;

// Il negozio è dominio Shopify: il checkout è quello di Shopify, non nostro.
export const SHOPIFY_DOMAIN = 'https://coloradostore.it';

// Prezzi in formato italiano: "108,00 €", non "108.00€".
const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
const eurRound = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: string | number, { round = false } = {}): string {
  const n = typeof amount === 'number' ? amount : parseFloat(amount);
  if (!isFinite(n)) return '';
  // Nelle griglie i decimali sono rumore, ma solo quando il prezzo è tondo.
  return round && Number.isInteger(n) ? eurRound.format(n) : eur.format(n);
}
