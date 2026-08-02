import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import { STORE, SOCIAL, SHOPIFY_DOMAIN } from '@/lib/shop/site';
import { usePageMeta } from '@/lib/meta';

export default function ContactPage() {
  usePageMeta({
    title: 'Contatti · Colorado Store Avellino',
    description: `Colorado Store, ${STORE.address}, ${STORE.zip} ${STORE.city}. Telefono ${STORE.phone}, WhatsApp e email. Aperti dal lunedì al sabato.`,
  });

  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12">
        <h1 className="display-text text-4xl md:text-6xl mb-2">Contatti</h1>
        <p className="text-carta/60 text-sm mb-12">Ci piacerebbe sentirti — scrivici per qualsiasi informazione.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="border border-carta/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={18} className="text-sabbia" />
                <h2 className="label-lg text-sabbia">Negozio</h2>
              </div>
              <address className="not-italic text-carta/80">
                {STORE.address}
                <br />
                {STORE.zip} {STORE.city} ({STORE.province})
              </address>
            </div>

            <div className="border border-carta/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={18} className="text-sabbia" />
                <h2 className="label-lg text-sabbia">Orari</h2>
              </div>
              <ul className="space-y-1 text-sm text-carta/80">
                {STORE.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span>{h.days}</span>
                    <span className="text-carta/60">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-carta/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Phone size={18} className="text-sabbia" />
                <h2 className="label-lg text-sabbia">Telefono</h2>
              </div>
              <a href={STORE.phoneHref} className="text-carta/80 hover:text-carta transition-colors">
                {STORE.phone}
              </a>
            </div>

            <div className="border border-carta/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail size={18} className="text-sabbia" />
                <h2 className="label-lg text-sabbia">Email</h2>
              </div>
              <a href={`mailto:${STORE.email}`} className="text-carta/80 hover:text-carta transition-colors break-all">
                {STORE.email}
              </a>
            </div>

            <a
              href={SOCIAL.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 bg-sabbia/10 border border-sabbia/30 label text-sabbia hover:bg-sabbia/20 transition-colors"
            >
              <MessageCircle size={16} /> WhatsApp {SOCIAL.whatsappNumber}
            </a>
          </div>

          {/* Il form posta al modulo contatti Shopify: il messaggio arriva
              davvero in casella, non è un finto invio. */}
          <div className="border border-carta/10 p-6 h-fit">
            <h2 className="display-text text-2xl mb-6">Inviaci un messaggio</h2>
            <form action={`${SHOPIFY_DOMAIN}/contact#contact_form`} method="post" acceptCharset="UTF-8" className="space-y-4">
              <input type="hidden" name="form_type" value="contact" />
              <input type="hidden" name="utf8" value="✓" />
              <div>
                <label htmlFor="c-name" className="label text-carta/50 block mb-1.5">
                  Nome
                </label>
                <input
                  id="c-name"
                  type="text"
                  name="contact[name]"
                  required
                  autoComplete="name"
                  className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta outline-none focus:border-sabbia transition-colors"
                />
              </div>
              <div>
                <label htmlFor="c-email" className="label text-carta/50 block mb-1.5">
                  Email
                </label>
                <input
                  id="c-email"
                  type="email"
                  name="contact[email]"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta outline-none focus:border-sabbia transition-colors"
                />
              </div>
              <div>
                <label htmlFor="c-body" className="label text-carta/50 block mb-1.5">
                  Messaggio
                </label>
                <textarea
                  id="c-body"
                  name="contact[body]"
                  required
                  rows={5}
                  className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta outline-none focus:border-sabbia transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 w-full py-3 bg-carta text-inchiostro label hover:bg-sabbia transition-colors justify-center"
              >
                Invia <Send size={14} />
              </button>
              <p className="text-xs text-carta/40">
                Inviando accetti il trattamento dei dati come descritto nella privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
