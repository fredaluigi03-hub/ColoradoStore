import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-inchiostro text-carta border-t border-carta/10">
      {/* Newsletter */}
      <div className="border-b border-carta/10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="display-text text-3xl md:text-5xl mb-2">
                Iscriviti alla <em className="text-sabbia">newsletter</em>
              </h3>
              <p className="text-carta/60 text-sm">Novità, anteprime esclusive e offerte riservate.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubscribed(true);
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                className="flex-1 bg-transparent border border-carta/20 px-4 py-3 text-carta placeholder:text-carta/30 outline-none focus:border-sabbia transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-sabbia text-inchiostro label hover:bg-carta transition-colors"
              >
                {subscribed ? 'Iscritto' : 'Iscriviti'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h4 className="display-text text-2xl mb-3">COLORADO</h4>
            <p className="text-carta/50 text-sm leading-relaxed">
              Rivenditore ufficiale Levi's<br />Avellino, Italia
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-carta/60 hover:text-carta transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-carta/60 hover:text-carta transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://wa.me/390000000000" target="_blank" rel="noreferrer" className="text-carta/60 hover:text-carta transition-colors" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-4">Negozio</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/collezioni/uomo" className="text-carta/60 hover:text-carta transition-colors">Uomo</Link></li>
              <li><Link to="/collezioni/donna" className="text-carta/60 hover:text-carta transition-colors">Donna</Link></li>
              <li><Link to="/collezioni/levis" className="text-carta/60 hover:text-carta transition-colors">Levi's</Link></li>
              <li><Link to="/collezioni/sneaker" className="text-carta/60 hover:text-carta transition-colors">Sneaker</Link></li>
              <li><Link to="/collezioni/outlet" className="text-carta/60 hover:text-carta transition-colors">Outlet</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-4">Assistenza</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/spedizioni-e-resi" className="text-carta/60 hover:text-carta transition-colors">Spedizioni</Link></li>
              <li><Link to="/spedizioni-e-resi" className="text-carta/60 hover:text-carta transition-colors">Resi e cambi</Link></li>
              <li><Link to="/condizioni-di-vendita" className="text-carta/60 hover:text-carta transition-colors">Guida taglie</Link></li>
              <li><Link to="/condizioni-di-vendita" className="text-carta/60 hover:text-carta transition-colors">Metodi di pagamento</Link></li>
              <li><Link to="/contatti" className="text-carta/60 hover:text-carta transition-colors">Contatti</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-4">Il negozio</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/chi-siamo" className="text-carta/60 hover:text-carta transition-colors">Chi siamo</Link></li>
              <li><Link to="/negozio" className="text-carta/60 hover:text-carta transition-colors">Il negozio</Link></li>
              <li><Link to="/contatti" className="text-carta/60 hover:text-carta transition-colors">Lavora con noi</Link></li>
              <li><Link to="/privacy" className="text-carta/60 hover:text-carta transition-colors">Privacy</Link></li>
              <li><Link to="/cookie-policy" className="text-carta/60 hover:text-carta transition-colors">Cookie</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-carta/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-carta/40 text-xs">© 2026 Colorado Store · Avellino, Italia · P.IVA 00000000000</p>
          <div className="flex items-center gap-3">
            <span className="label text-carta/40">Pagamenti sicuri</span>
            <div className="flex gap-2">
              {['VISA', 'MC', 'AMEX', 'PAYPAL'].map((p) => (
                <span key={p} className="px-2 py-1 border border-carta/20 rounded text-[9px] text-carta/50 font-semibold">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
