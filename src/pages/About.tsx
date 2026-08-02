import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin, ArrowRight } from 'lucide-react';
import { editorialImages } from '@/lib/shop/editorial';
import { STORE, SOCIAL } from '@/lib/shop/site';
import { usePageMeta } from '@/lib/meta';

export default function AboutPage() {
  usePageMeta({
    title: "Chi siamo · Colorado Store Avellino · Rivenditore Ufficiale Levi's",
    description:
      "Dagli anni Novanta ad Avellino. Unico negozio della zona con licenza ufficiale per la rivendita Levi's. Streetwear e Old Money sotto lo stesso tetto.",
  });

  return (
    <div className="min-h-screen bg-inchiostro text-carta pt-20 md:pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src={editorialImages.levis.url}
          alt={editorialImages.levis.alt}
          width={1600}
          height={900}
          className="w-full h-full object-cover"
        />
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
          <span className="label text-sabbia">Dagli anni Novanta</span>
          <h2 className="display-text text-carta text-3xl md:text-5xl mt-2 mb-6">
            Ad <em className="text-sabbia">Avellino</em>, nel cuore dell&rsquo;Irpinia
          </h2>
          <div className="space-y-4 text-carta/60 text-sm md:text-base leading-relaxed">
            <p>
              Il nostro viaggio nel mondo della moda è iniziato agli inizi degli anni Novanta, quando
              il team di Colorado Store ha deciso di trasformare una passione in una realtà. Fin
              dall&rsquo;inizio l&rsquo;obiettivo è stato creare un negozio che non offrisse solo abbigliamento,
              ma uno stile di vita fatto di autenticità, creatività e individualità.
            </p>
            <p>
              Oggi, anche se siamo cresciuti, l&rsquo;impegno resta lo stesso: capi che uniscono comfort e
              design, scelti uno a uno. E siamo orgogliosi di essere l&rsquo;unico negozio della zona con
              la licenza ufficiale per la rivendita dei prodotti Levi&rsquo;s&nbsp;&mdash; un&rsquo;icona che
              rappresenta stile e qualità senza tempo.
            </p>
          </div>

          <div className="border-l-2 border-sabbia pl-6 my-12">
            <p className="display-text text-carta text-2xl md:text-3xl italic leading-relaxed">
              Tradizione e innovazione, mescolate in un&rsquo;unica visione: il nostro stile non si ferma
              mai, online e in negozio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            {[
              { num: '30+', label: 'Anni ad Avellino' },
              { num: '40+', label: 'Brand a catalogo' },
              { num: "Levi's", label: 'Rivenditore ufficiale' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
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

      {/* Vieni a trovarci */}
      <section className="py-20 md:py-28 bg-inchiostro-400 border-y border-carta/10">
        <div className="mx-auto max-w-3xl px-4 md:px-8 text-center">
          <span className="label text-sabbia">Il negozio</span>
          <h2 className="display-text text-carta text-4xl md:text-6xl mt-2 mb-4">
            Vieni a <em className="text-sabbia">trovarci</em>
          </h2>
          <p className="text-carta/60 text-sm inline-flex items-center gap-2 justify-center">
            <MapPin size={16} className="text-sabbia" />
            {STORE.address}, {STORE.zip} {STORE.city} ({STORE.province})
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link
              to="/negozio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-carta text-inchiostro label hover:bg-sabbia transition-colors"
            >
              Orari e indicazioni <ArrowRight size={14} />
            </Link>
            <a
              href={SOCIAL.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-sabbia/40 text-sabbia label hover:bg-sabbia/10 transition-colors"
            >
              <MessageCircle size={16} /> Scrivici su WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
