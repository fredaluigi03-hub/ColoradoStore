import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin, Clock, Mail, Phone, Send } from 'lucide-react';
import { editorialImages } from '@/lib/shop/mock-data';

export default function AboutPage() {
  const [form, setForm] = useState({ nome: '', email: '', messaggio: '' });
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src={editorialImages.store} alt="Negozio Colorado Store" width={1600} height={900} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-inchiostro via-inchiostro/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <span className="label text-sabbia">La nostra storia</span>
          <h1 className="display-text text-carta text-5xl md:text-7xl mt-2">
            Colorado <em className="text-sabbia">Store</em>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <span className="label text-sabbia">Dal 1985</span>
              <h2 className="display-text text-carta text-3xl md:text-5xl mt-2 mb-4">
                Ad <em className="text-sabbia">Avellino</em>, nel cuore dell'Irpinia
              </h2>
              <p className="text-carta/60 text-sm leading-relaxed">
                Da oltre quarant'anni vestiamo la nostra città. Quella che iniziata come piccola merceria,
                oggi è il punto di riferimento per chi cerca qualità e stile. Siamo l'unico rivenditore
                ufficiale Levi's della zona e portiamo avanti una visione: due mondi sotto lo stesso tetto.
              </p>
            </div>
            <img src={editorialImages.storeInterior} alt="Interno del negozio" width={800} height={320} className="w-full h-80 object-cover" />
          </div>

          <div className="border-l-2 border-sabbia pl-6 my-12">
            <p className="display-text text-carta text-2xl md:text-3xl italic leading-relaxed">
              "Crediamo che il vestire sia un atto di identità. Ogni capo che scegli racconta chi sei,
              da dove vieni e dove stai andando."
            </p>
            <p className="label text-sabbia mt-4">— La titolare</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { num: '40+', label: 'Anni di storia' },
              { num: '2', label: 'Anime: Streetwear & Old Money' },
              { num: '100%', label: "Autentico, rivenditore Levi's" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center border border-carta/10 p-6"
              >
                <p className="display-text text-4xl text-sabbia">{stat.num}</p>
                <p className="label text-carta/60 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-28 bg-inchiostro-400 border-y border-carta/10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="label text-sabbia">Contatti</span>
            <h2 className="display-text text-carta text-4xl md:text-6xl mt-2">
              Vieni a <em className="text-sabbia">trovarci</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-sabbia mt-1" />
                <div>
                  <h3 className="label-lg text-carta mb-1">Indirizzo</h3>
                  <p className="text-sm text-carta/60">Corso Vittorio Emanuele, 1<br />83100 Avellino (AV)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={20} className="text-sabbia mt-1" />
                <div>
                  <h3 className="label-lg text-carta mb-1">Orari</h3>
                  <p className="text-sm text-carta/60">
                    Lunedì — Sabato: 9:30 — 19:30<br />
                    Domenica: chiuso
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={20} className="text-sabbia mt-1" />
                <div>
                  <h3 className="label-lg text-carta mb-1">Telefono</h3>
                  <p className="text-sm text-carta/60">+39 0825 00000</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-sabbia mt-1" />
                <div>
                  <h3 className="label-lg text-carta mb-1">Email</h3>
                  <p className="text-sm text-carta/60">info@coloradostore.it</p>
                </div>
              </div>
              <a
                href="https://wa.me/390000000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sabbia text-inchiostro label hover:bg-carta transition-colors"
              >
                <MessageCircle size={16} /> Scrivici su WhatsApp
              </a>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="label text-carta/50 block mb-1.5">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta outline-none focus:border-sabbia transition-colors"
                  required
                />
              </div>
              <div>
                <label className="label text-carta/50 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta outline-none focus:border-sabbia transition-colors"
                  required
                />
              </div>
              <div>
                <label className="label text-carta/50 block mb-1.5">Messaggio</label>
                <textarea
                  rows={5}
                  value={form.messaggio}
                  onChange={(e) => setForm((f) => ({ ...f, messaggio: e.target.value }))}
                  className="w-full bg-transparent border border-carta/20 px-4 py-3 text-carta outline-none focus:border-sabbia transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-4 bg-carta text-inchiostro label hover:bg-sabbia transition-colors"
              >
                {sent ? 'Messaggio inviato' : 'Invia messaggio'} <Send size={14} />
              </button>
            </form>
          </div>

          {/* Map placeholder */}
          <div className="mt-12 h-64 bg-inchiostro-300 border border-carta/10 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="text-sabbia mx-auto mb-2" />
              <p className="text-sm text-carta/50">Avellino, Italia</p>
              <p className="text-xs text-carta/30">Corso Vittorio Emanuele, 1</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
