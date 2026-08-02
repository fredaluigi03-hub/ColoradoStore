import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// La cookie policy prometteva un banner che non esisteva. Questo raccoglie una
// scelta esplicita e la ricorda.
// Nota: nessuno script analitico è ancora installato. Quando verrà aggiunto,
// va caricato solo dentro il ramo 'accepted'.
const KEY = 'colorado-cookie-consent';

export default function CookieBanner() {
  const [choice, setChoice] = useState<string | null>('pending');

  useEffect(() => {
    try {
      setChoice(localStorage.getItem(KEY));
    } catch {
      setChoice('accepted'); // storage bloccato: non insistiamo
    }
  }, []);

  const decide = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* niente storage: la scelta vale per questa sessione */
    }
    setChoice(value);
  };

  if (choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferenze cookie"
      className="fixed bottom-0 inset-x-0 z-[90] bg-inchiostro-400/95 backdrop-blur-md border-t border-carta/15"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center gap-4">
        <p className="text-xs text-carta/70 flex-1 leading-relaxed">
          Usiamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso useremo anche
          cookie analitici per capire come viene usato.{' '}
          <Link to="/cookie-policy" className="text-sabbia hover:text-carta transition-colors underline">
            Cookie policy
          </Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => decide('rejected')}
            className="px-5 py-2.5 border border-carta/30 label text-carta/70 hover:text-carta hover:border-carta/60 transition-colors"
          >
            Rifiuta
          </button>
          <button
            onClick={() => decide('accepted')}
            className="px-5 py-2.5 bg-carta text-inchiostro label hover:bg-sabbia transition-colors"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
