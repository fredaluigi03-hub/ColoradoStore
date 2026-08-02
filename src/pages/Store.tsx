import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, MessageCircle, Mail } from 'lucide-react';
import { STORE, SOCIAL } from '@/lib/shop/site';
import { usePageMeta, useJsonLd } from '@/lib/meta';

const MAPS_QUERY = encodeURIComponent(
  `${STORE.name}, ${STORE.address}, ${STORE.zip} ${STORE.city}`,
);

export default function StorePage() {
  usePageMeta({
    title: `Il negozio · ${STORE.city} · Colorado Store`,
    description: `Colorado Store si trova in ${STORE.address}, ${STORE.zip} ${STORE.city}. Aperto dal lunedì al sabato, 9:00–13:00 e 16:30–20:00.`,
  });

  // LocalBusiness: è il segnale che conta per un negozio fisico su Google.
  useJsonLd(
    {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: STORE.name,
      legalName: STORE.legalName,
      vatID: STORE.vat,
      telephone: STORE.phone,
      email: STORE.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: STORE.address,
        postalCode: STORE.zip,
        addressLocality: STORE.city,
        addressRegion: STORE.province,
        addressCountry: STORE.country,
      },
      openingHours: STORE.openingHoursSchema,
      sameAs: [SOCIAL.instagram, SOCIAL.tiktok],
    },
    'ld-store',
  );

  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12">
        <h1 className="display-text text-4xl md:text-6xl mb-2">Il negozio</h1>
        <p className="text-carta/60 text-sm mb-12">
          {STORE.name} · {STORE.city}, Italia
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="border border-carta/10 p-6">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div>
                  <h2 className="label-lg text-sabbia mb-1">Indirizzo</h2>
                  <address className="not-italic text-carta/80">
                    {STORE.address}
                    <br />
                    {STORE.zip} {STORE.city} ({STORE.province})
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
                    target="_blank"
                    rel="noreferrer"
                    className="label text-sabbia hover:text-carta transition-colors mt-3 inline-block"
                  >
                    Apri in Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-carta/10 p-6">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="label-lg text-sabbia mb-3">Orari di apertura</h2>
                  <ul className="space-y-1 text-sm text-carta/70">
                    {STORE.hours.map((h) => (
                      <li key={h.days} className="flex justify-between gap-4">
                        <span>{h.days}</span>
                        <span>{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-carta/10 p-6">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div>
                  <h2 className="label-lg text-sabbia mb-1">Telefono</h2>
                  <a href={STORE.phoneHref} className="text-carta/80 hover:text-carta transition-colors">
                    {STORE.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <Mail size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div>
                  <h2 className="label-lg text-sabbia mb-1">Email</h2>
                  <a href={`mailto:${STORE.email}`} className="text-carta/80 hover:text-carta transition-colors break-all">
                    {STORE.email}
                  </a>
                </div>
              </div>
              <a
                href={SOCIAL.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-sabbia/10 border border-sabbia/30 label text-sabbia hover:bg-sabbia/20 transition-colors"
              >
                <MessageCircle size={14} /> Scrivici su WhatsApp
              </a>
            </div>
          </div>

          <div className="border border-carta/10 overflow-hidden min-h-[400px]">
            <iframe
              title={`Mappa ${STORE.name} ${STORE.city}`}
              src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/collezioni/new-collection"
            className="inline-flex items-center gap-2 px-6 py-3 bg-carta text-inchiostro label hover:bg-sabbia transition-colors"
          >
            Esplora le collezioni
          </Link>
        </div>
      </div>
    </div>
  );
}
