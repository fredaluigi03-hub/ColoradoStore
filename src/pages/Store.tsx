import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, MessageCircle, Car, Train } from 'lucide-react';

export default function StorePage() {
  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8 py-12">
        <h1 className="display-text text-4xl md:text-6xl mb-2">Il negozio</h1>
        <p className="text-carta/60 text-sm mb-12">Colorado Store · Avellino, Italia</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="border border-carta/10 p-6">
              <div className="flex items-start gap-3 mb-2">
                <MapPin size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div>
                  <h2 className="label-lg text-sabbia mb-1">Indirizzo</h2>
                  <p className="text-carta/80">Corso Vittorio Emanuele II, 42</p>
                  <p className="text-carta/80">83100 Avellino (AV)</p>
                </div>
              </div>
            </div>

            <div className="border border-carta/10 p-6">
              <div className="flex items-start gap-3 mb-2">
                <Clock size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div>
                  <h2 className="label-lg text-sabbia mb-3">Orari di apertura</h2>
                  <ul className="space-y-1 text-sm text-carta/70">
                    <li className="flex justify-between"><span>Lun – Ven</span><span>9:30 – 19:30</span></li>
                    <li className="flex justify-between"><span>Sabato</span><span>9:30 – 20:00</span></li>
                    <li className="flex justify-between"><span>Domenica</span><span>10:00 – 13:00</span></li>
                  </ul>
                  <p className="text-xs text-carta/40 mt-3">Chiuso i festivi nazionali</p>
                </div>
              </div>
            </div>

            <div className="border border-carta/10 p-6">
              <div className="flex items-start gap-3 mb-2">
                <Phone size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div>
                  <h2 className="label-lg text-sabbia mb-1">Telefono</h2>
                  <p className="text-carta/80">+39 0825 00 00 00</p>
                </div>
              </div>
              <a
                href="https://wa.me/390825000000"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-sabbia/10 border border-sabbia/30 label text-sabbia hover:bg-sabbia/20 transition-colors"
              >
                <MessageCircle size={14} /> Scrivici su WhatsApp
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-carta/10 p-6">
              <div className="flex items-start gap-3 mb-2">
                <Car size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div>
                  <h2 className="label-lg text-sabbia mb-1">Come arrivare in auto</h2>
                  <p className="text-sm text-carta/70">Uscita Avellino Est sulla A16. Parcheggio gratuito in via Cimitero, a 200 m dal negozio.</p>
                </div>
              </div>
            </div>

            <div className="border border-carta/10 p-6">
              <div className="flex items-start gap-3 mb-2">
                <Train size={20} className="text-sabbia flex-shrink-0 mt-1" />
                <div>
                  <h2 className="label-lg text-sabbia mb-1">Come arrivare in treno</h2>
                  <p className="text-sm text-carta/70">Stazione di Avellino, a 800 m a piedi (10 min) o autobus linea 1.</p>
                </div>
              </div>
            </div>

            <div className="border border-carta/10 overflow-hidden aspect-[4/3]">
              <iframe
                title="Mappa Colorado Store Avellino"
                src="https://www.openstreetmap.org/export/embed.html?bbox=14.78%2C40.90%2C14.82%2C40.92&amp;layer=mapnik&amp;marker=40.9059%2C14.7998"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="border border-carta/10 p-6 mb-12">
          <h2 className="label-lg text-sabbia mb-3">Ritira in negozio</h2>
          <p className="text-sm text-carta/70">
            Ordina online e ritira gratis in negozio ad Avellino. Pronto in 24 ore — riceverai una email di conferma quando l'ordine è disponibile per il ritiro.
          </p>
        </div>

        <div className="text-center">
          <Link to="/collezioni/uomo" className="inline-flex items-center gap-2 px-6 py-3 bg-carta text-inchiostro label hover:bg-sabbia transition-colors">
            Esplora le collezioni
          </Link>
        </div>
      </div>
    </div>
  );
}
