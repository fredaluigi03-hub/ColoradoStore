import type { Product, Collection } from './types';

// Catalogo mock — unico file da rimpiazzare con chiamate Shopify reali.
// Tutte le immagini sono URL reali da Pexels (servizio fotografico coerente).

const EUR = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: 'EUR' });

interface ProductSeed {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  tagsLine: ('streetwear' | 'old-money')[];
  availableForSale: boolean;
  images: { url: string; altText: string; width?: number; height?: number }[];
  sizes: string[];
  colors: { name: string; value: string }[];
  price: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
}

function buildProduct(seed: ProductSeed): Product {
  const variants = seed.sizes.flatMap((size, si) =>
    seed.colors.map((color, ci) => ({
      id: `${seed.id}-var-${si}-${ci}`,
      title: `${color.name} / ${size}`,
      availableForSale: seed.availableForSale,
      quantityAvailable: seed.availableForSale ? Math.floor(Math.random() * 12) + 2 : 0,
      selectedOptions: [
        { name: 'Taglia', value: size },
        { name: 'Colore', value: color.name },
      ],
      price: EUR(seed.price),
      compareAtPrice: seed.compareAtPrice ? EUR(seed.compareAtPrice) : undefined,
    })),
  );

  const prices = variants.map((v) => parseFloat(v.price.amount));
  const priceRange = {
    minVariantPrice: EUR(Math.min(...prices)),
    maxVariantPrice: EUR(Math.max(...prices)),
  };

  const comparePrices = variants
    .map((v) => v.compareAtPrice)
    .filter(Boolean) as { amount: string; currencyCode: string }[];
  const compareAtPriceRange =
    comparePrices.length > 0
      ? {
          minVariantCompareAtPrice: { amount: Math.min(...comparePrices.map((c) => parseFloat(c.amount))).toFixed(2), currencyCode: 'EUR' },
          maxVariantCompareAtPrice: { amount: Math.max(...comparePrices.map((c) => parseFloat(c.amount))).toFixed(2), currencyCode: 'EUR' },
        }
      : undefined;

  const featuredImage = seed.images[0];

  return {
    id: seed.id,
    handle: seed.handle,
    title: seed.title,
    description: seed.description,
    productType: seed.productType,
    vendor: seed.vendor,
    tags: seed.tags,
    tagsLine: seed.tagsLine,
    availableForSale: seed.availableForSale,
    priceRange,
    compareAtPriceRange,
    images: seed.images,
    variants,
    options: [
      { name: 'Taglia', values: seed.sizes },
      { name: 'Colore', values: seed.colors.map((c) => c.name) },
    ],
    featuredImage,
    rating: seed.rating,
    reviewCount: seed.reviewCount,
  };
}

const seeds: ProductSeed[] = [
  // ── STREETWEAR ──
  {
    id: 'p-501-original',
    handle: '501-original',
    title: "Jeans Levi's 501® Original",
    description:
      "Il jeans più iconico di sempre. Taglio dritto, vita media, chiusura bottoni. Denim rigido 12 oz che si modella sul corpo con il tempo. Lavaggio blu medio autentico.",
    productType: 'Pantaloni e jeans',
    vendor: "Levi's",
    tags: ['uomo', 'levis', 'streetwear', 'best-seller', 'denim'],
    tagsLine: ['streetwear'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/7764608/pexels-photo-7764608.jpeg?auto=compress&cs=tinysrgb&w=800', altText: "Jeans Levi's 501 piegati su fondo neutro", width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/4210850/pexels-photo-4210850.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Jeans blu impilati su sedia', width: 800, height: 1200 },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [{ name: 'Blu medio', value: 'blu' }],
    price: 119,
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: 'p-denim-jacket',
    handle: 'giacca-denim-classic',
    title: 'Giacca Denim Trucker',
    description:
      'La giacca denim per eccellenza. Cotone 100% lavaggio medio, bottoni metallici, due tasche petto. Indistruttibile, migliora con ogni lavaggio.',
    productType: 'Capispalla',
    vendor: 'Colorado',
    tags: ['uomo', 'streetwear', 'denim', 'nuovo'],
    tagsLine: ['streetwear'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/16428734/pexels-photo-16428734.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Giacca denim sospesa su fondo grigio', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/38561616/pexels-photo-38561616.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Dettaglio tessuto giacca denim', width: 800, height: 800 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Blu medio', value: 'blu' }],
    price: 139,
    rating: 4.7,
    reviewCount: 84,
  },
  {
    id: 'p-hoodie-navy',
    handle: 'felpa-hoodie-navy',
    title: 'Felpa con Cappuccio Oversize',
    description:
      'Felpa oversize in felpa spazzolata 400 gsm. Cappuccio doppio, coulisse in tono. Vestibilità rilassata, perfetta per il layering urbano.',
    productType: 'Maglie e felpe',
    vendor: 'Colorado',
    tags: ['uomo', 'streetwear', 'nuovo'],
    tagsLine: ['streetwear'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/37468338/pexels-photo-37468338.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Felpa blu su fondo minimale', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/37468337/pexels-photo-37468337.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Felpa blu sospesa su fondo caldo', width: 800, height: 1200 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Blu notte', value: 'navy' }],
    price: 89,
    rating: 4.6,
    reviewCount: 52,
  },
  {
    id: 'p-bomber-rosso',
    handle: 'bomber-rosso-urban',
    title: 'Bomber Rosso Urban',
    description:
      'Bomber dal taglio urbano, tessuto tecnico opaco, polsini elasticizzati. Una nota di colore che non passa inosservata.',
    productType: 'Capispalla',
    vendor: 'Colorado',
    tags: ['uomo', 'streetwear', 'nuovo'],
    tagsLine: ['streetwear'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/16069733/pexels-photo-16069733.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Bomber rosso su modello in studio', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/8454520/pexels-photo-8454520.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Giacca urbana su muro in mattoni', width: 800, height: 1200 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Rosso', value: 'rosso' }],
    price: 149,
    compareAtPrice: 199,
    rating: 4.5,
    reviewCount: 38,
  },
  {
    id: 'p-sneaker-navy',
    handle: 'sneaker-navy-low',
    title: 'Sneaker Navy Low',
    description:
      'Sneaker bassa in pelle nautica, suola in gomma vulcanizzata. Cuciture a vista, linguetta imbottita. Il comfort che dura tutta la giornata.',
    productType: 'Sneaker',
    vendor: 'Colorado',
    tags: ['uomo', 'sneaker', 'streetwear', 'best-seller'],
    tagsLine: ['streetwear'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/20755674/pexels-photo-20755674.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Sneaker blu navy su fondo neutro', width: 800, height: 1000 },
      { url: 'https://images.pexels.com/photos/14212621/pexels-photo-14212621.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Sneaker sportive su fondo bianco', width: 800, height: 1200 },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Blu navy', value: 'navy' }],
    price: 119,
    rating: 4.7,
    reviewCount: 96,
  },
  {
    id: 'p-sneaker-beige',
    handle: 'sneaker-beige-runner',
    title: 'Sneaker Beige Runner',
    description:
      'Sneaker con suola scolpita, tomaia in nubuck beige. Pensata per la città, leggera e traspirante.',
    productType: 'Sneaker',
    vendor: 'Colorado',
    tags: ['donna', 'sneaker', 'streetwear', 'nuovo'],
    tagsLine: ['streetwear'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/20191567/pexels-photo-20191567.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Sneaker beige su fondo bianco', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/14214618/pexels-photo-14214618.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Sneaker moderne con suola unica', width: 800, height: 1200 },
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [{ name: 'Beige', value: 'beige' }],
    price: 129,
    rating: 4.6,
    reviewCount: 71,
  },
  {
    id: 'p-tshirt-white',
    handle: 'tshirt-bianca-essenziale',
    title: 'T-Shirt Bianca Essenziale',
    description:
      'Cotone pettinato 200 gsm, taglio regular. La base perfetta per ogni stratificazione. Collo a giro rinforzato.',
    productType: 'Magliette e polo',
    vendor: 'Colorado',
    tags: ['uomo', 'streetwear', 'best-seller'],
    tagsLine: ['streetwear'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/8148576/pexels-photo-8148576.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'T-shirt bianca su appendiabiti', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/20669538/pexels-photo-20669538.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'T-shirt bianca su appendiabiti in studio', width: 800, height: 1200 },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Bianco', value: 'bianco' }],
    price: 39,
    rating: 4.5,
    reviewCount: 143,
  },
  {
    id: 'p-jeans-slim',
    handle: 'jeans-slim-scuro',
    title: 'Jeans Slim Scuro',
    description:
      'Taglio slim moderno, lavaggio scuro uniforme. Elastane 2% per il comfort. Dal giorno alla sera senza cambio.',
    productType: 'Pantaloni e jeans',
    vendor: 'Colorado',
    tags: ['uomo', 'streetwear', 'outlet'],
    tagsLine: ['streetwear'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/17720471/pexels-photo-17720471.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Tre jeans in vari lavaggi', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/24513278/pexels-photo-24513278.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Jeans blu piegati dettaglio', width: 800, height: 1200 },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [{ name: 'Blu scuro', value: 'blu-scuro' }],
    price: 79,
    compareAtPrice: 109,
    rating: 4.4,
    reviewCount: 67,
  },
  // ── OLD MONEY ──
  {
    id: 'p-camicia-bianca',
    handle: 'camicia-bianca-oxford',
    title: 'Camicia Bianca Oxford',
    description:
      "Cotone Oxford 140 gsm, taglio semi-slim. Collo button-down, cuciture inglesi. L'eleganza senza tempo che non conosce stagioni.",
    productType: 'Camicie',
    vendor: 'Colorado',
    tags: ['uomo', 'old-money', 'best-seller'],
    tagsLine: ['old-money'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/22441292/pexels-photo-22441292.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Camicia bianca su ramo legnoso', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/10592540/pexels-photo-10592540.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Camicia bianca drappeggiata su sedia', width: 800, height: 1200 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Bianco', value: 'bianco' }],
    price: 99,
    rating: 4.8,
    reviewCount: 112,
  },
  {
    id: 'p-maglioncino-crema',
    handle: 'maglioncino-crema-cashmere',
    title: 'Maglioncino Crema in Cashmere',
    description:
      'Cashmere 100% a doppia maglia. Collo a V, coste sulle maniche. Morbido, caldo, leggero. Il capo che trasmette eleganza silenziosa.',
    productType: 'Maglie e felpe',
    vendor: 'Colorado',
    tags: ['uomo', 'old-money', 'nuovo', 'best-seller'],
    tagsLine: ['old-money'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/14642651/pexels-photo-14642651.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Maglioni beige impilati', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/14641596/pexels-photo-14641596.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Maglioni neutri con bottoni', width: 800, height: 1200 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Crema', value: 'crema' }],
    price: 169,
    rating: 4.9,
    reviewCount: 88,
  },
  {
    id: 'p-pantalone-sigaretta',
    handle: 'pantalone-sigaretta-beige',
    title: 'Pantalone a Sigaretta Beige',
    description:
      'Cotone gabardine, taglio a sigaretta dritto. Vita media, risvolto sottile. Il pantalone elegante che sa di vissuto senza sforzo.',
    productType: 'Pantaloni e jeans',
    vendor: 'Colorado',
    tags: ['uomo', 'old-money', 'best-seller'],
    tagsLine: ['old-money'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/16238583/pexels-photo-16238583.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Pantalone beige e maglione bianco', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/12056633/pexels-photo-12056633.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Outfit beige e bianco outdoor', width: 800, height: 1200 },
    ],
    sizes: ['46', '48', '50', '52', '54'],
    colors: [{ name: 'Beige', value: 'beige' }],
    price: 119,
    rating: 4.7,
    reviewCount: 64,
  },
  {
    id: 'p-camicia-lino',
    handle: 'camicia-lino-sabbia',
    title: 'Camicia in Lino Sabbia',
    description:
      'Lino europeo 160 gsm, lavaggio naturale. Taglio rilassato, tasca a pattina. Traspirante, perfetta per le sere d\'estate in città.',
    productType: 'Camicie',
    vendor: 'Colorado',
    tags: ['uomo', 'old-money', 'nuovo'],
    tagsLine: ['old-money'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/22441297/pexels-photo-22441297.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Camicia lino su appendiabiti legnoso', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/11671275/pexels-photo-11671275.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Camicia beige su rack bianco', width: 800, height: 1200 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Sabbia', value: 'sabbia' }],
    price: 109,
    rating: 4.6,
    reviewCount: 45,
  },
  {
    id: 'p-cardigan-camoscio',
    handle: 'cardigan-camoscio-marrone',
    title: 'Cardigan in Camoscio',
    description:
      "Cardigan in camoscio morbido, bottoni in corno. Maniche a coste, tasche a filetto. Il tepore elegante delle sere d'autunno.",
    productType: 'Maglie e felpe',
    vendor: 'Colorado',
    tags: ['uomo', 'old-money', 'nuovo'],
    tagsLine: ['old-money'],
    availableForSale: false,
    images: [
      { url: 'https://images.pexels.com/photos/14641437/pexels-photo-14641437.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Maglioni neutri impilati su letto', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/14641438/pexels-photo-14641438.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Maglioni caldi neutri impilati', width: 800, height: 1200 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Marrone', value: 'marrone' }],
    price: 189,
    compareAtPrice: 229,
    rating: 4.8,
    reviewCount: 29,
  },
  {
    id: 'p-polo-beige',
    handle: 'polo-beige-cotone',
    title: 'Polo Beige in Cotone Piqué',
    description:
      'Cotone piqué 220 gsm, taglio classico. Due bottoni, colletto rinforzato. Il compromesso perfetto tra eleganza e relax.',
    productType: 'Magliette e polo',
    vendor: 'Colorado',
    tags: ['uomo', 'old-money', 'outlet'],
    tagsLine: ['old-money'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/20763273/pexels-photo-20763273.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Polo beige piegata su fondo grigio', width: 800, height: 1000 },
      { url: 'https://images.pexels.com/photos/13094187/pexels-photo-13094187.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Camicia grigia su blocco geometrico', width: 800, height: 800 },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Beige', value: 'beige' }],
    price: 69,
    compareAtPrice: 89,
    rating: 4.5,
    reviewCount: 56,
  },
  {
    id: 'p-giacca-camoscio',
    handle: 'giacca-camoscio-sabbia',
    title: 'Giacca in Camoscio Sabbia',
    description:
      'Camoscio italiano, spalla strutturata, due tasche a filetto. Fodera in seta. Il capospalla che eleva ogni silhouette.',
    productType: 'Capispalla',
    vendor: 'Colorado',
    tags: ['uomo', 'old-money', 'best-seller'],
    tagsLine: ['old-money'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/30218761/pexels-photo-30218761.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Donna con cappotto beige appoggiata a ringhiera', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/30294519/pexels-photo-30294519.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Donna con trench beige classico', width: 800, height: 1200 },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Sabbia', value: 'sabbia' }],
    price: 249,
    rating: 4.9,
    reviewCount: 41,
  },
  {
    id: 'p-trench-beige',
    handle: 'trench-beige-classic',
    title: 'Trench Beige Classico',
    description:
      "Cotone gabardine impermeabile, doppio petto, cintura in vita. Il trench che ha definito un'epoca, oggi più attuale che mai.",
    productType: 'Capispalla',
    vendor: 'Colorado',
    tags: ['donna', 'old-money', 'nuovo'],
    tagsLine: ['old-money'],
    availableForSale: true,
    images: [
      { url: 'https://images.pexels.com/photos/20284091/pexels-photo-20284091.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Donna con trench beige sotto arco metallico', width: 800, height: 1200 },
      { url: 'https://images.pexels.com/photos/19114520/pexels-photo-19114520.jpeg?auto=compress&cs=tinysrgb&w=800', altText: 'Donna con cappotto beige in strada', width: 800, height: 1200 },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Beige', value: 'beige' }],
    price: 219,
    rating: 4.8,
    reviewCount: 33,
  },
];

export const products: Product[] = seeds.map(buildProduct);

export const collections: Collection[] = [
  {
    id: 'c-nuovi-arrivi',
    handle: 'nuovi-arrivi',
    title: 'Nuovi Arrivi',
    description: 'Le ultime novità appena arrivate in negozio.',
    productIds: ['p-denim-jacket', 'p-hoodie-navy', 'p-bomber-rosso', 'p-sneaker-beige', 'p-camicia-lino', 'p-maglioncino-crema', 'p-trench-beige'],
  },
  {
    id: 'c-best-seller',
    handle: 'best-seller',
    title: 'Best Seller',
    description: 'I capi più amati dai nostri clienti.',
    productIds: ['p-501-original', 'p-sneaker-navy', 'p-tshirt-white', 'p-camicia-bianca', 'p-maglioncino-crema', 'p-pantalone-sigaretta', 'p-giacca-camoscio'],
  },
  {
    id: 'c-levis',
    handle: 'levis',
    title: "Levi's",
    description: "Selezione ufficiale Levi's — unico rivenditore della zona.",
    productIds: ['p-501-original'],
  },
  {
    id: 'c-sneaker',
    handle: 'sneaker',
    title: 'Sneaker',
    description: 'Sneaker selezionate per stile e comfort.',
    productIds: ['p-sneaker-navy', 'p-sneaker-beige'],
  },
  {
    id: 'c-uomo',
    handle: 'uomo',
    title: 'Uomo',
    description: 'Il reparto uomo: denim, camicie, capispalla.',
    productIds: products.filter((p) => p.tags.includes('uomo')).map((p) => p.id),
  },
  {
    id: 'c-donna',
    handle: 'donna',
    title: 'Donna',
    description: 'Il reparto donna: trench, sneaker, eleganza.',
    productIds: products.filter((p) => p.tags.includes('donna')).map((p) => p.id),
  },
  {
    id: 'c-streetwear',
    handle: 'streetwear',
    title: 'Streetwear',
    description: 'Denim, sneaker, capi urban. Il lato giovane del negozio.',
    productIds: products.filter((p) => p.tagsLine.includes('streetwear')).map((p) => p.id),
  },
  {
    id: 'c-old-money',
    handle: 'old-money',
    title: 'Old Money',
    description: 'Pantaloni a sigaretta, maglioncini, camicie. Eleganza senza tempo.',
    productIds: products.filter((p) => p.tagsLine.includes('old-money')).map((p) => p.id),
  },
  {
    id: 'c-outlet',
    handle: 'outlet',
    title: 'Outlet',
    description: 'Occasioni a tempo. Ultimi pezzi a prezzo speciale.',
    productIds: products.filter((p) => p.tags.includes('outlet')).map((p) => p.id),
  },
];

// Immagini editoriali e di ambiente
// Contatti e profili social del negozio.
// ⚠️ DA CONFERMARE con la titolare: l'handle Instagram e il numero WhatsApp qui
// sotto vanno verificati prima di andare online.
export const SOCIAL = {
  instagram: 'https://www.instagram.com/coloradostore.av/',
  instagramHandle: '@coloradostore.av',
  whatsapp: 'https://wa.me/393920285560',
  facebook: 'https://www.facebook.com/coloradostore',
};

export const editorialImages = {
  streetwear: 'https://images.pexels.com/photos/31988321/pexels-photo-31988321.jpeg?auto=compress&cs=tinysrgb&w=1200',
  oldMoney: 'https://images.pexels.com/photos/12056633/pexels-photo-12056633.jpeg?auto=compress&cs=tinysrgb&w=1200',
  store: 'https://images.pexels.com/photos/5531549/pexels-photo-5531549.jpeg?auto=compress&cs=tinysrgb&w=1600',
  storeInterior: 'https://images.pexels.com/photos/5531709/pexels-photo-5531709.jpeg?auto=compress&cs=tinysrgb&w=1600',
  denimBg: 'https://images.pexels.com/photos/7641026/pexels-photo-7641026.jpeg?auto=compress&cs=tinysrgb&w=1600',
  lookbook: 'https://images.pexels.com/photos/6652938/pexels-photo-6652938.jpeg?auto=compress&cs=tinysrgb&w=1600',
  uomoDept: 'https://images.pexels.com/photos/37741914/pexels-photo-37741914.jpeg?auto=compress&cs=tinysrgb&w=1000',
  donnaDept: 'https://images.pexels.com/photos/19114520/pexels-photo-19114520.jpeg?auto=compress&cs=tinysrgb&w=1000',
  sneakerDept: 'https://images.pexels.com/photos/16604063/pexels-photo-16604063.jpeg?auto=compress&cs=tinysrgb&w=1000',
};

// Immagini quadrate Instagram
export const instagramImages = [
  'https://images.pexels.com/photos/8850650/pexels-photo-8850650.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/38561616/pexels-photo-38561616.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/8967723/pexels-photo-8967723.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/13094187/pexels-photo-13094187.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/20143795/pexels-photo-20143795.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/30550128/pexels-photo-30550128.jpeg?auto=compress&cs=tinysrgb&w=600',
];

// 8 fotogrammi per il 360° (stesso capo a rotazione)
export const spinFrames = [
  'https://images.pexels.com/photos/20755674/pexels-photo-20755674.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/14212621/pexels-photo-14212621.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/16947114/pexels-photo-16947114.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/20191567/pexels-photo-20191567.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/14214618/pexels-photo-14214618.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/20191568/pexels-photo-20191568.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/16604063/pexels-photo-16604063.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/13580587/pexels-photo-13580587.jpeg?auto=compress&cs=tinysrgb&w=600',
];
