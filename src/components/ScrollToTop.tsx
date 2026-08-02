import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Cambiando route la SPA manteneva la posizione di scroll: si arrivava a metà
// di una scheda prodotto.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
