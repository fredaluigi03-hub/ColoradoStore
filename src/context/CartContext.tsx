import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Cart, CartLine, Product, ProductVariant } from '@/lib/shop/types';
import { cartFromLines } from '@/lib/shop';

const FREE_SHIPPING_THRESHOLD = 99;
const CART_STORAGE_KEY = 'colorado-cart';

interface CartContextValue {
  cart: Cart;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartLine[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string>('');
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    setLines(stored);
    setCartId(`cart-${Date.now()}`);
  }, []);

  useEffect(() => {
    if (cartId) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    }
  }, [lines, cartId]);

  const addToCart = useCallback((product: Product, variant: ProductVariant, quantity = 1) => {
    const lineId = `${variant.id}-line`;
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === variant.id);
      if (existing) {
        return prev.map((l) =>
          l.variantId === variant.id ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      const newLine: CartLine = {
        id: lineId,
        productId: product.id,
        variantId: variant.id,
        productHandle: product.handle,
        productTitle: product.title,
        variantTitle: variant.title,
        image: { url: product.featuredImage.url, altText: product.featuredImage.altText },
        quantity,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
      };
      return [...prev, newLine];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((prev) => prev.filter((l) => l.id !== lineId));
      return;
    }
    setLines((prev) => prev.map((l) => (l.id === lineId ? { ...l, quantity } : l)));
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const cart = cartFromLines(cartId || 'cart-empty', lines);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - parseFloat(cart.cost.subtotalAmount.amount));

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        updateQuantity,
        removeLine,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        remainingForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
