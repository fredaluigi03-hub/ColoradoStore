import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { STORE, SOCIAL, SHIPPING, SHOPIFY_DOMAIN } from '@/lib/shop/site';

// Icona TikTok: lucide-react non ne ha una.
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .73-5.07v-3.1a5.65 5.65 0 0 0-.73-.05A5.68 5.68 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.24-1.48Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-inchiostro text-carta border-t border-carta/10">
      {/* Newsletter — gestita da Shopify: iscrizione reale, non un finto invio */}
      <div className="border-b border-carta/10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="display-text text-3xl md:text-5xl mb-2">
                Iscriviti alla <em className="text-sabbia">newsletter</em>
              </h3>
              <p className="text-carta/60 text-sm">Novità, anteprime esclusive e offerte riservate.</p>
            </div>
            <form action={`${SHOPIFY_DOMAIN}/contact#contact_form`} method="post" acceptCharset="UTF-8" className="flex gap-2">
              <input type="hidden" name="form_type" value="customer" />
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name="contact[tags]" value="newsletter" />
              <label htmlFor="newsletter-email" className="sr-only">
                La tua email
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="contact[email]"
                placeholder="La tua email"
                className="flex-1 bg-transparent border border-carta/20 px-4 py-3 text-carta placeholder:text-carta/30 outline-none focus:border-sabbia transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-sabbia text-inchiostro label hover:bg-carta transition-colors"
              >
                Iscriviti
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
              Rivenditore ufficiale Levi&rsquo;s
            </p>
            <address className="not-italic text-carta/50 text-sm leading-relaxed mt-3 space-y-1">
              <span className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                {STORE.address}, {STORE.zip} {STORE.city} ({STORE.province})
              </span>
              <a href={STORE.phoneHref} className="flex items-center gap-2 hover:text-carta transition-colors">
                <Phone size={14} /> {STORE.phone}
              </a>
              <a href={`mailto:${STORE.email}`} className="flex items-center gap-2 hover:text-carta transition-colors">
                <Mail size={14} /> {STORE.email}
              </a>
            </address>
            <div className="flex gap-4 mt-4">
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="text-carta/60 hover:text-carta transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer" className="text-carta/60 hover:text-carta transition-colors" aria-label="TikTok">
                <TikTokIcon size={18} />
              </a>
              <a href={SOCIAL.whatsapp} target="_blank" rel="noreferrer" className="text-carta/60 hover:text-carta transition-colors" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-4">Negozio</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/collezioni/uomo" className="text-carta/60 hover:text-carta transition-colors">Uomo</Link></li>
              <li><Link to="/collezioni/donna" className="text-carta/60 hover:text-carta transition-colors">Donna</Link></li>
              <li><Link to="/collezioni/levis" className="text-carta/60 hover:text-carta transition-colors">Levi&rsquo;s</Link></li>
              <li><Link to="/collezioni/sneakers" className="text-carta/60 hover:text-carta transition-colors">Sneaker</Link></li>
              <li><Link to="/collezioni/outlet" className="text-carta/60 hover:text-carta transition-colors">Outlet</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-4">Assistenza</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/spedizioni-e-resi" className="text-carta/60 hover:text-carta transition-colors">Spedizioni e resi</Link></li>
              <li><Link to="/diritto-di-recesso" className="text-carta/60 hover:text-carta transition-colors">Diritto di recesso</Link></li>
              <li><Link to="/condizioni-di-vendita" className="text-carta/60 hover:text-carta transition-colors">Condizioni di vendita</Link></li>
              <li><Link to="/contatti" className="text-carta/60 hover:text-carta transition-colors">Contatti</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-4">Il negozio</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/chi-siamo" className="text-carta/60 hover:text-carta transition-colors">Chi siamo</Link></li>
              <li><Link to="/negozio" className="text-carta/60 hover:text-carta transition-colors">Dove siamo</Link></li>
              <li><Link to="/privacy" className="text-carta/60 hover:text-carta transition-colors">Privacy</Link></li>
              <li><Link to="/cookie-policy" className="text-carta/60 hover:text-carta transition-colors">Cookie</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-carta/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-carta/40 text-xs text-center md:text-left">
            © {new Date().getFullYear()} {STORE.legalName} · {STORE.address}, {STORE.zip} {STORE.city} ({STORE.province}) · P.IVA {STORE.vat}
          </p>
          <div className="flex items-center gap-3">
            <span className="label text-carta/40">Spedizione gratuita da {SHIPPING.freeThreshold}€</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
