import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Cambiando route la SPA manteneva la posizione di scroll: si arrivava a metà
// di una scheda prodotto.
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Forza lo scroll istantaneo in cima alla pagina ad ogni cambio rotta o categoria
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // Se Lenis è attivo, notifica lo scroll in cima
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, search]);

  return null;
}
