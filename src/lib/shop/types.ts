// Tipi modellati esattamente come la Shopify Storefront API.
// Sostituendo il file mock con chiamate reali, queste interfacce restano identiche.

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface PriceRange {
  minVariantPrice: Money;
  maxVariantPrice: Money;
}

export interface CompareAtPriceRange {
  minVariantCompareAtPrice: Money;
  maxVariantCompareAtPrice: Money;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice?: Money;
  image?: { url: string; altText?: string; width?: number; height?: number };
}

export interface ProductImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

export type LineTag = 'streetwear' | 'old-money' | 'levis' | 'uomo' | 'donna' | 'sneaker' | 'nuovo' | 'best-seller' | 'outlet';

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  tagsLine: ('streetwear' | 'old-money')[];
  availableForSale: boolean;
  priceRange: PriceRange;
  compareAtPriceRange?: CompareAtPriceRange;
  images: ProductImage[];
  variants: ProductVariant[];
  options: { name: string; values: string[] }[];
  featuredImage: ProductImage;
  rating?: number;
  reviewCount?: number;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ProductImage;
  productIds: string[];
}

export interface CartLine {
  id: string;
  productId: string;
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  image: { url: string; altText: string };
  quantity: number;
  price: Money;
  compareAtPrice?: Money;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  checkoutUrl: string;
}

export interface CollectionFilter {
  productType?: string;
  taglia?: string;
  colore?: string;
  brand?: string;
  linea?: 'streetwear' | 'old-money' | 'all';
  prezzoMax?: number;
  outlet?: boolean;
}
