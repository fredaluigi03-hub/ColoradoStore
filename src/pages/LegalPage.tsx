import { Link } from 'react-router-dom';

interface LegalPageProps {
  title: string;
  sections: { heading: string; body: string }[];
}

export default function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-12">
        <div className="border border-sabbia/30 bg-sabbia/5 px-4 py-3 mb-8">
          <p className="text-xs text-sabbia">
            TESTO SEGNAPOSTO — Questo documento è un placeholder da far validare dal consulente legale prima della pubblicazione.
          </p>
        </div>
        <h1 className="display-text text-3xl md:text-5xl mb-8">{title}</h1>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="display-text text-xl text-sabbia mb-2">{s.heading}</h2>
              <p className="text-sm text-carta/70 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-carta/10">
          <Link to="/" className="label text-sabbia hover:text-carta transition-colors">Torna alla home</Link>
        </div>
      </div>
    </div>
  );
}
