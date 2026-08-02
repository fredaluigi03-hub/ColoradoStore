import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Truck, ZoomIn } from 'lucide-react';
import { getProductByHandle, getRelatedProducts } from '@/lib/shop';
import { SHIPPING, STORE, formatPrice } from '@/lib/shop/site';
import { usePageMeta, useJsonLd } from '@/lib/meta';
import type { Product, ProductVariant } from '@/lib/shop/types';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const { handle } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>('descrizione');
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const sizes = product?.options.find((o) => o.name === 'Taglia')?.values ?? [];
  const colors = product?.options.find((o) => o.name === 'Colore')?.values ?? [];

  useEffect(() => {
    if (!handle) return;
    let alive = true;
    setProduct(null);
    setNotFound(false);
    setSelectedImage(0);
    getProductByHandle(handle).then((p) => {
      if (!alive) return;
      if (!p) {
        setNotFound(true);
        return;
      }
      setProduct(p);
      // Preseleziona la prima combinazione davvero acquistabile.
      const first = p.variants.find((v) => v.availableForSale) || p.variants[0];
      setSelectedColor(first?.selectedOptions.find((o) => o.name === 'Colore')?.value || '');
      setSelectedSize(first?.selectedOptions.find((o) => o.name === 'Taglia')?.value || '');
      getRelatedProducts(p).then((r) => alive && setRelated(r));
    });
    return () => {
      alive = false;
    };
  }, [handle]);

  // Molti prodotti reali hanno un solo asse (solo taglia) o nessuno: la ricerca
  // deve reggere tutti e tre i casi, non solo taglia+colore.
  const selectedVariant: ProductVariant | null = useMemo(() => {
    if (!product) return null;
    if (product.variants.length === 1) return product.variants[0];
    return (
      product.variants.find(
        (v) =>
          (!sizes.length || v.selectedOptions.some((o) => o.name === 'Taglia' && o.value === selectedSize)) &&
          (!colors.length || v.selectedOptions.some((o) => o.name === 'Colore' && o.value === selectedColor)),
      ) || null
    );
  }, [product, selectedSize, selectedColor, sizes.length, colors.length]);

  const currentPrice = selectedVariant?.price || product?.priceRange.minVariantPrice || { amount: '0', currencyCode: 'EUR' };
  const currentCompare = selectedVariant?.compareAtPrice || product?.compareAtPriceRange?.minVariantCompareAtPrice;
  const isAvailable = selectedVariant ? selectedVariant.availableForSale : (product?.availableForSale ?? false);

  usePageMeta({
    // Molti capi hanno "Colorado Store" come vendor: evitiamo il titolo doppio.
    title: product
      ? [product.title, product.vendor === STORE.name ? null : product.vendor, STORE.name]
          .filter(Boolean)
          .join(' · ')
      : 'Prodotto · Colorado Store',
    description: product
      ? `${product.description.slice(0, 155) || `${product.title} di ${product.vendor}.`}`
      : 'Dettaglio prodotto.',
    image: product?.featuredImage.url,
  });

  const structuredData = useMemo(
    () =>
      product
        ? {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.images.map((i) => i.url),
            brand: { '@type': 'Brand', name: product.vendor },
            offers: {
              '@type': 'Offer',
              url: window.location.href,
              price: parseFloat(currentPrice.amount).toFixed(2),
              priceCurrency: 'EUR',
              itemCondition: 'https://schema.org/NewCondition',
              availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: STORE.name },
            },
          }
        : null,
    [product, currentPrice.amount, isAvailable],
  );
  useJsonLd(structuredData, 'ld-product');

  const handleZoomMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-inchiostro px-4">
        <div className="text-center">
          <p className="display-text text-4xl text-carta/60 mb-4">Prodotto non disponibile</p>
          <Link to="/collezioni/new-collection" className="label text-sabbia hover:text-carta transition-colors">
            Vedi i nuovi arrivi
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-inchiostro">
        <p className="text-carta/50">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="bg-inchiostro text-carta min-h-screen pt-16 md:pt-20">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-carta/40 mb-8">
          <Link to="/" className="hover:text-carta transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/collezioni/${product.tagsLine[0]}`} className="hover:text-carta transition-colors">
            {product.tagsLine[0] === 'old-money' ? 'Old Money' : 'Streetwear'}
          </Link>
          <span>/</span>
          <span className="text-carta/70">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <div>
            <div
              ref={imgRef}
              className="relative aspect-[3/4] overflow-hidden bg-inchiostro-300 cursor-zoom-in"
              onMouseEnter={() => setZoomOpen(true)}
              onMouseLeave={() => setZoomOpen(false)}
              onMouseMove={handleZoomMove}
            >
              <img
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.altText}
                width={800}
                height={1067}
                className="w-full h-full object-cover transition-transform duration-300"
                style={zoomOpen ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
              />
              <span className="absolute top-4 right-4 label text-carta/60 flex items-center gap-1 bg-inchiostro/50 px-2 py-1">
                <ZoomIn size={12} /> Zoom
              </span>
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-sabbia' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img.url} alt={img.altText} width={80} height={96} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-4">
            <p className="label text-sabbia">{product.vendor}</p>
            <h1 className="display-text text-carta text-4xl md:text-5xl mt-2">{product.title}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mt-6">
              <span className="display-text text-3xl text-carta">{formatPrice(currentPrice.amount)}</span>
              {currentCompare && (
                <span className="text-lg text-carta/40 line-through">{formatPrice(currentCompare.amount)}</span>
              )}
            </div>

            <p className="text-carta/60 text-sm mt-4 leading-relaxed">{product.description}</p>

            {/* Color */}
            {colors.length > 0 && (
              <div className="mt-8">
                <p className="label text-carta/60 mb-2">Colore: <span className="text-carta">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-sm border transition-colors ${selectedColor === color ? 'border-sabbia text-sabbia' : 'border-carta/20 text-carta/60 hover:border-carta/50'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="label text-carta/60">Taglia: <span className="text-carta">{selectedSize}</span></p>
                <button
                  onClick={() => setOpenAccordion('taglie')}
                  className="label text-sabbia hover:text-carta transition-colors"
                >
                  Guida taglie
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const sizeVariant = product.variants.find(
                    (v) =>
                      v.selectedOptions.some((o) => o.name === 'Taglia' && o.value === size) &&
                      (!colors.length || v.selectedOptions.some((o) => o.name === 'Colore' && o.value === selectedColor)),
                  );
                  const available = sizeVariant?.availableForSale ?? false;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!available}
                      className={`min-w-[3rem] px-3 py-2.5 text-sm border transition-colors ${
                        selectedSize === size
                          ? 'border-sabbia text-sabbia'
                          : available
                          ? 'border-carta/20 text-carta/60 hover:border-carta/50'
                          : 'border-carta/10 text-carta/20 line-through cursor-not-allowed'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
            )}

            {/* Availability — il negozio espone solo il booleano, non le giacenze */}
            <div className="mt-6">
              {isAvailable ? (
                <p className="text-sm text-sabbia flex items-center gap-2">
                  <Check size={14} /> Disponibile
                </p>
              ) : (
                <p className="text-sm text-carta/40 flex items-center gap-2">
                  <span className="w-2 h-2 bg-carta/40 rounded-full" />
                  Esaurito
                </p>
              )}
            </div>

            {/* Add to cart */}
            <button
              onClick={() => selectedVariant && addToCart(product, selectedVariant)}
              disabled={!isAvailable}
              className="w-full mt-6 py-4 bg-carta text-inchiostro label hover:bg-sabbia transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAvailable ? 'Aggiungi al carrello' : 'Esaurito'}
            </button>

            {/* Spedizione e ritiro */}
            <div className="mt-4 flex items-center gap-3 border border-sabbia/20 bg-sabbia/5 px-4 py-3">
              <Truck size={18} className="text-sabbia flex-shrink-0" />
              <div>
                <p className="text-sm text-carta">Spedizione gratuita da {SHIPPING.freeThreshold}€</p>
                <p className="text-xs text-carta/50">Consegna in {SHIPPING.deliveryTime} · oppure ritiro in negozio ad {STORE.city}</p>
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-8 border-t border-carta/10">
              <Accordion id="descrizione" title="Descrizione" open={openAccordion} setOpen={setOpenAccordion}>
                <p className="text-sm text-carta/60 leading-relaxed">
                  {product.description || `${product.title} di ${product.vendor}.`}
                </p>
              </Accordion>
              <Accordion id="spedizione" title="Spedizione" open={openAccordion} setOpen={setOpenAccordion}>
                <p className="text-sm text-carta/60 leading-relaxed">
                  Spedizione gratuita per ordini sopra {SHIPPING.freeThreshold}€, altrimenti{' '}
                  {formatPrice(SHIPPING.standardCost)}. Consegna in {SHIPPING.deliveryTime} con
                  tracking. Ritiro gratuito in negozio ad {STORE.city}.
                </p>
              </Accordion>
              <Accordion id="resi" title="Resi e cambi" open={openAccordion} setOpen={setOpenAccordion}>
                <p className="text-sm text-carta/60 leading-relaxed">
                  Hai {SHIPPING.returnDays} giorni per il reso. Il capo deve essere in perfette condizioni con
                  etichette intatte. Per il cambio taglia scrivici su WhatsApp.
                </p>
              </Accordion>
              {sizes.length > 0 && (
                <Accordion id="taglie" title="Guida taglie" open={openAccordion} setOpen={setOpenAccordion}>
                  <div className="text-sm text-carta/60 space-y-1">
                    <p>Taglie disponibili: {sizes.join(', ')}</p>
                    <p>Per dubbi sulla vestibilità, contattaci su WhatsApp: ti rispondiamo dal negozio.</p>
                  </div>
                </Accordion>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 md:mt-28">
            <h2 className="display-text text-carta text-3xl md:text-5xl mb-8">
              Ti potrebbe <em className="text-sabbia">piacere</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Accordion({ id, title, open, setOpen, children }: {
  id: string;
  title: string;
  open: string | null;
  setOpen: (v: string | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <div className="border-b border-carta/10">
      <button
        onClick={() => setOpen(isOpen ? null : id)}
        className="flex items-center justify-between w-full py-4 label-lg text-carta/80 hover:text-carta transition-colors"
      >
        {title}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
