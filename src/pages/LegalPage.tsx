import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { STORE } from '@/lib/shop/site';
import { usePageMeta } from '@/lib/meta';

interface LegalPageProps {
  title: string;
  intro?: string;
  sections: { heading: string; body: string }[];
  /** Policy ufficiale pubblicata su Shopify, quando esiste: è quella che fa fede. */
  officialUrl?: string;
}

export default function LegalPage({ title, intro, sections, officialUrl }: LegalPageProps) {
  usePageMeta({ title: `${title} · Colorado Store`, description: intro || `${title} di ${STORE.legalName}.` });

  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-12">
        <h1 className="display-text text-3xl md:text-5xl mb-4">{title}</h1>
        <p className="text-sm text-carta/50 mb-8">
          {STORE.legalName} · {STORE.address}, {STORE.zip} {STORE.city} ({STORE.province}) · P.IVA {STORE.vat}
        </p>

        {officialUrl && (
          <a
            href={officialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-sabbia/30 bg-sabbia/5 px-4 py-3 mb-8 label text-sabbia hover:bg-sabbia/10 transition-colors"
          >
            Leggi la versione ufficiale <ExternalLink size={12} />
          </a>
        )}

        {intro && <p className="text-sm text-carta/70 leading-relaxed mb-8">{intro}</p>}

        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="display-text text-xl text-sabbia mb-2">{s.heading}</h2>
              <p className="text-sm text-carta/70 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-carta/10 flex flex-wrap gap-6">
          <Link to="/" className="label text-sabbia hover:text-carta transition-colors">
            Torna alla home
          </Link>
          <Link to="/contatti" className="label text-carta/50 hover:text-carta transition-colors">
            Contatti
          </Link>
        </div>
      </div>
    </div>
  );
}
