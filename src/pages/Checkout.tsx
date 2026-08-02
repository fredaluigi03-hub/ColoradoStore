import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePageMeta } from '@/lib/meta';

// Il pagamento avviene sul checkout Shopify del negozio: PCI, IVA, spedizioni e
// ordini sono già gestiti lì. Questa pagina esiste solo per chi arriva
// sull'URL /checkout con un link vecchio.
export default function CheckoutPage() {
  const { cart } = useCart();
  usePageMeta({ title: 'Checkout · Colorado Store', description: 'Completa il tuo ordine.', noindex: true });

  const empty = cart.lines.length === 0;

  useEffect(() => {
    if (empty) return;
    const t = setTimeout(() => {
      window.location.href = cart.checkoutUrl;
    }, 800);
    return () => clearTimeout(t);
  }, [empty, cart.checkoutUrl]);

  return (
    <div className="min-h-screen bg-inchiostro text-carta flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-md">
        {empty ? (
          <>
            <p className="display-text text-4xl text-carta/50 mb-4">Il carrello è vuoto</p>
            <Link
              to="/collezioni/new-collection"
              className="inline-flex items-center gap-2 label text-sabbia hover:text-carta transition-colors"
            >
              Esplora il catalogo <ArrowRight size={14} />
            </Link>
          </>
        ) : (
          <>
            <Loader2 size={28} className="text-sabbia animate-spin mx-auto mb-6" />
            <p className="display-text text-3xl mb-3">Ti portiamo al pagamento</p>
            <p className="text-sm text-carta/50 mb-6">Checkout sicuro Shopify.</p>
            <a href={cart.checkoutUrl} className="inline-flex items-center gap-2 label text-sabbia hover:text-carta transition-colors">
              Continua ora <ArrowRight size={14} />
            </a>
          </>
        )}
      </div>
    </div>
  );
}
