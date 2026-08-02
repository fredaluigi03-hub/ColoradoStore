import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/shop/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shop/site';

export function getBadge(product: Product): { label: string; className: string } | null {
  if (!product.availableForSale) return { label: 'Esaurito', className: 'bg-inchiostro/70 text-carta' };
  if (product.compareAtPriceRange) {
    const original = parseFloat(product.compareAtPriceRange.minVariantCompareAtPrice.amount);
    const current = parseFloat(product.priceRange.minVariantPrice.amount);
    const pct = Math.round((1 - current / original) * 100);
    if (pct > 0) return { label: `-${pct}%`, className: 'bg-rame text-carta' };
  }
  if (product.tags.includes('nuovo')) return { label: 'Nuovo', className: 'bg-sabbia text-inchiostro' };
  if (product.tags.includes('best-seller')) return { label: 'Best', className: 'bg-denim text-carta' };
  return null;
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();
  const badge = getBadge(product);
  // Il quick-add deve aggiungere una variante acquistabile, non la prima in lista.
  const firstVariant = product.variants.find((v) => v.availableForSale) || product.variants[0];
  const hasDiscount =
    product.compareAtPriceRange &&
    parseFloat(product.compareAtPriceRange.minVariantCompareAtPrice.amount) >
      parseFloat(product.priceRange.minVariantPrice.amount);
  // Se il capo ha più taglie, il quick-add ne sceglierebbe una a caso: meglio
  // mandare alla scheda prodotto.
  const needsChoice = product.options.some((o) => o.values.length > 1);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.33, 1, 0.68, 1] }}
      className="group"
    >
      <div
        ref={cardRef}
        className="relative perspective-1000"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setTilt({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        data-cursor={product.availableForSale ? 'view' : undefined}
      >
        <Link
          to={`/prodotti/${product.handle}`}
          className="block relative overflow-hidden bg-inchiostro-300 preserve-3d"
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Badge */}
          {badge && (
            <span className={`absolute top-3 left-3 z-10 label px-2 py-1 ${badge.className}`}>
              {badge.label}
            </span>
          )}

          {/* Primary image */}
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText}
              loading="lazy"
              width={400}
              height={533}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                hovered ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>

          {/* Secondary image fade-in */}
          {product.images[1] && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={product.images[1].url}
                alt={product.images[1].altText}
                loading="lazy"
                width={400}
                height={533}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Quick-add */}
          {product.availableForSale && firstVariant && (
            <div
              className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
                hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              {needsChoice ? (
                <span className="block w-full py-3 bg-carta/95 backdrop-blur-sm text-inchiostro label text-center">
                  Scegli la taglia
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, firstVariant);
                  }}
                  className="w-full py-3 bg-carta/95 backdrop-blur-sm text-inchiostro label hover:bg-sabbia transition-colors"
                >
                  Aggiungi al carrello
                </button>
              )}
            </div>
          )}

          {/* Sold out overlay */}
          {!product.availableForSale && (
            <div className="absolute inset-0 bg-inchiostro/40 flex items-center justify-center">
              <span className="label text-carta bg-inchiostro/60 px-4 py-2">Esaurito</span>
            </div>
          )}
        </Link>
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="label text-sabbia">{product.vendor}</p>
            <Link to={`/prodotti/${product.handle}`} className="text-sm text-carta hover:text-sabbia transition-colors block truncate">
              {product.title}
            </Link>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-medium text-carta">
              {formatPrice(product.priceRange.minVariantPrice.amount, { round: true })}
            </p>
            {hasDiscount && (
              <p className="text-xs text-carta/40 line-through">
                {formatPrice(product.compareAtPriceRange!.minVariantCompareAtPrice.amount, { round: true })}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
