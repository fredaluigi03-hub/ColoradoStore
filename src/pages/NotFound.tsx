import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-inchiostro text-carta flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-lg">
        <p className="display-text text-8xl md:text-9xl text-sabbia mb-4">404</p>
        <h1 className="display-text text-3xl md:text-4xl mb-4">Pagina non trovata</h1>
        <p className="text-carta/60 text-sm mb-8">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="px-6 py-3 bg-carta text-inchiostro label hover:bg-sabbia transition-colors">
            Torna alla home
          </Link>
          <Link to="/collezioni/uomo" className="inline-flex items-center gap-2 px-6 py-3 border border-carta/30 label text-carta hover:bg-carta/10 transition-colors">
            Esplora le collezioni <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
