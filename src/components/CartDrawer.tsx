import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductsByCollection } from '@/lib/shop';
import { SHIPPING, formatPrice } from '@/lib/shop/site';
import type { Product } from '@/lib/shop/types';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeLine, remainingForFreeShipping } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pool, setPool] = useState<Product[]>([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // I suggeriti servono solo a carrello aperto: niente fetch prima.
  useEffect(() => {
    if (!isOpen || pool.length) return;
    getProductsByCollection('best-sellers').then((list) => setPool(list.filter((p) => p.availableForSale)));
  }, [isOpen, pool.length]);

  const cartProductIds = new Set(cart.lines.map((l) => l.productId));
  const suggestions = pool.filter((p) => !cartProductIds.has(p.id)).slice(0, 3);

  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
  const progress = Math.min(100, (subtotal / (subtotal + remainingForFreeShipping)) * 100);

  return (
    <dialog
      ref={dialogRef}
      className="fixed right-0 top-0 h-screen m-0 p-0 bg-transparent backdrop:bg-inchiostro/60 backdrop:backdrop-blur-sm"
      style={{ maxWidth: '100%', width: '100%', maxHeight: '100vh' }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.77, 0, 0.18, 1] }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-inchiostro text-carta flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-carta/10">
              <h2 className="display-text text-2xl">
                Carrello <span className="text-sabbia text-base">({cart.totalQuantity})</span>
              </h2>
              <button onClick={closeCart} aria-label="Chiudi carrello" className="text-carta/70 hover:text-carta transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* Free shipping bar */}
            {cart.lines.length > 0 && (
              <div className="px-6 py-4 border-b border-carta/10">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={16} className="text-sabbia" />
                  <p className="text-sm text-carta/70">
                    {remainingForFreeShipping > 0 ? (
                      <>Ti mancano <strong className="text-carta">{formatPrice(remainingForFreeShipping)}</strong> alla spedizione gratuita</>
                    ) : (
                      <span className="text-sabbia">Spedizione gratuita raggiunta</span>
                    )}
                  </p>
                </div>
                <div className="h-1 bg-carta/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sabbia rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Lines */}
            <div className="flex-1 overflow-y-auto">
              {cart.lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
                  <p className="display-text text-2xl text-carta/50">Il carrello è vuoto</p>
                  <p className="text-sm text-carta/40">Scopri le nostre collezioni</p>
                  <Link
                    to="/collezioni/uomo"
                    onClick={closeCart}
                    className="mt-4 px-6 py-3 bg-sabbia text-inchiostro label hover:bg-carta transition-colors"
                  >
                    Esplora
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-carta/10">
                  {cart.lines.map((line) => (
                    <div key={line.id} className="flex gap-4 px-6 py-4">
                      <Link to={`/prodotti/${line.productHandle}`} onClick={closeCart} className="flex-shrink-0">
                        <img
                          src={line.image.url}
                          alt={line.image.altText}
                          width={80}
                          height={100}
                          className="w-20 h-24 object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/prodotti/${line.productHandle}`} onClick={closeCart} className="text-sm font-medium hover:text-sabbia transition-colors block truncate">
                          {line.productTitle}
                        </Link>
                        <p className="text-xs text-carta/50 mt-1">{line.variantTitle}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity - 1)}
                              className="w-7 h-7 border border-carta/20 flex items-center justify-center hover:border-carta/50 transition-colors"
                              aria-label="Diminuisci"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm w-6 text-center">{line.quantity}</span>
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity + 1)}
                              className="w-7 h-7 border border-carta/20 flex items-center justify-center hover:border-carta/50 transition-colors"
                              aria-label="Aumenta"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{formatPrice(parseFloat(line.price.amount) * line.quantity)}</span>
                            <button
                              onClick={() => removeLine(line.id)}
                              className="text-carta/40 hover:text-rame transition-colors"
                              aria-label="Rimuovi"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Suggestions */}
                  <div className={`px-6 py-4 ${suggestions.length ? '' : 'hidden'}`}>
                    <p className="label text-sabbia mb-3">Potrebbe interessarti</p>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar">
                      {suggestions.map((p) => (
                        <Link
                          key={p.id}
                          to={`/prodotti/${p.handle}`}
                          onClick={closeCart}
                          className="flex-shrink-0 w-24"
                        >
                          <img src={p.featuredImage.url} alt={p.featuredImage.altText} width={96} height={112} className="w-24 h-28 object-cover" />
                          <p className="text-[10px] text-carta/60 mt-1 truncate">{p.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.lines.length > 0 && (
              <div className="border-t border-carta/10 px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-carta/60 text-sm">Subtotale</span>
                  <span className="display-text text-2xl">{formatPrice(subtotal)}</span>
                </div>
                {/* Checkout reale: il permalink porta al carrello Shopify del
                    negozio, dove avviene il pagamento. */}
                <a
                  href={cart.checkoutUrl}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-carta text-inchiostro label hover:bg-sabbia transition-colors"
                >
                  Vai al checkout
                  <ArrowRight size={16} />
                </a>
                <p className="text-[10px] text-carta/40 text-center">
                  Pagamento sicuro su Shopify
                </p>
                <div className="flex items-center gap-2 text-xs text-sabbia">
                  <Truck size={14} />
                  <span>Spedizione gratuita da {SHIPPING.freeThreshold}€ · Consegna in {SHIPPING.deliveryTime}</span>
                </div>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-carta/50 hover:text-carta transition-colors"
                >
                  Continua a comprare
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
