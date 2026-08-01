import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Plus, RotateCw, MessageCircle, Star } from 'lucide-react';
import { useLenis, useInView, useCountUp, useMouseParallax, use360Spin } from '@/lib/hooks';
import { products, collections, editorialImages, instagramImages, spinFrames } from '@/lib/shop/mock-data';
import ProductCard from '@/components/ProductCard';

const HERO_STREETWEAR = 'https://images.pexels.com/photos/30510956/pexels-photo-30510956.jpeg?auto=compress&cs=tinysrgb&w=1200';
const HERO_OLD_MONEY = 'https://images.pexels.com/photos/36397385/pexels-photo-36397385.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function Home() {
  useLenis();

  return (
    <div className="bg-inchiostro text-carta">
      {/* 01 — HERO */}
      <HeroSection />

      {/* 02 — TICKER */}
      <Ticker />

      {/* 03 — BANDA LEVI'S (subito dopo il ticker: è il differenziante del negozio) */}
      <LevisBand />

      {/* 04 — NUOVI ARRIVI */}
      <NewArrivalsCascade />

      {/* La vecchia sezione "Due anime" è stata rimossa: ripeteva la hero.
          La scelta fra Streetwear e Old Money ora sta nelle pagine di reparto
          (uomo/donna/sneaker), dove filtra davvero i prodotti mostrati. */}

      {/* 05 — CATALOGO A SCHEDE */}
      <CatalogTabs />

      {/* 06 — VETRINA 360° */}
      <Spin360 />

      {/* 07 — COMPONI IL TUO OUTFIT */}
      <OutfitBuilder />

      {/* 08 — TRE REPARTI */}
      <Departments />

      {/* 09 — MANIFESTO */}
      <Manifesto />

      {/* 10 — INSTAGRAM */}
      <InstagramGrid />

      {/* 11 — FOOTER */}
      <FooterSection />
    </div>
  );
}

// ── 01 HERO ──
function HeroSection() {
  const [hovered, setHovered] = useState<'street' | 'old' | null>(null);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const streetProduct = products.find((p) => p.id === 'p-501-original')!;
  const oldMoneyProduct = products.find((p) => p.id === 'p-maglioncino-crema')!;

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-inchiostro">
      <h1 className="sr-only">Colorado Store — abbigliamento a Avellino, rivenditore ufficiale Levi's</h1>
      {/* Two worlds */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* LEFT — STREETWEAR */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { x: '-100%' }}
          animate={prefersReduced ? { opacity: 1, flexGrow: 50 } : { x: 0, flexGrow: hovered === 'street' ? 65 : hovered === 'old' ? 35 : 50 }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
          className="relative overflow-hidden"
          style={{ flexBasis: 0 }}
          data-cursor="view"
          onMouseEnter={() => setHovered('street')}
          onMouseLeave={() => setHovered(null)}
        >
          <motion.div
            animate={{
              filter: hovered === 'old' ? 'grayscale(80%) brightness(0.4)' : 'grayscale(0%) brightness(1)',
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full h-full overflow-hidden"
          >
            <img
              src={HERO_STREETWEAR}
              alt="Modello in felpa e jeans, contesto urbano notturno"
              width={600}
              height={800}
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-inchiostro/80 via-inchiostro/10 to-inchiostro/30" />
          </motion.div>

          {/* Label */}
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10">
            <span className="label text-carta/60">La linea</span>
            <h2 className="display-text text-carta text-4xl md:text-6xl mt-1">
              <em>Streetwear</em>
            </h2>
            <Link to="/collezioni/streetwear" className="inline-flex items-center gap-2 mt-3 label text-carta/80 hover:text-carta transition-colors">
              Esplora <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* RIGHT — OLD MONEY */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { x: '100%' }}
          animate={prefersReduced ? { opacity: 1, flexGrow: 50 } : { x: 0, flexGrow: hovered === 'old' ? 65 : hovered === 'street' ? 35 : 50 }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
          className="relative overflow-hidden"
          style={{ flexBasis: 0 }}
          data-cursor="view"
          onMouseEnter={() => setHovered('old')}
          onMouseLeave={() => setHovered(null)}
        >
          <motion.div
            animate={{
              filter: hovered === 'street' ? 'grayscale(80%) brightness(0.4)' : 'grayscale(0%) brightness(1)',
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full h-full overflow-hidden"
          >
            <img
              src={HERO_OLD_MONEY}
              alt="Modello in camicia e pantalone a sigaretta, luce calda naturale"
              width={600}
              height={800}
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carta-300/70 via-carta-300/5 to-carta-300/20" />
          </motion.div>

          {/* Label */}
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10">
            <span className="label text-inchiostro/60">La linea</span>
            <h2 className="display-text text-inchiostro text-4xl md:text-6xl mt-1">
              <em className="text-rame">Old Money</em>
            </h2>
            <Link to="/collezioni/old-money" className="inline-flex items-center gap-2 mt-3 label text-inchiostro/80 hover:text-inchiostro transition-colors">
              Esplora <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* CENTER LINE — luminous thread with gold particles */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-sabbia/30 to-transparent pointer-events-none z-10">
        {prefersReduced ? null : Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-sabbia"
            style={{ width: 2, height: 2 }}
            initial={{ bottom: '-5%', opacity: 0 }}
            animate={{ bottom: '105%', opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* TOP CENTER — Levi's badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-20"
      >
        <span className="label text-carta inline-flex items-center gap-2 bg-inchiostro/70 backdrop-blur-md border border-sabbia/30 px-4 py-2 whitespace-nowrap">
          <Star size={10} fill="currentColor" className="text-sabbia" />
          RIVENDITORE UFFICIALE LEVI'S · AVELLINO
        </span>
      </motion.div>

      {/* TOP CENTER — tagline, sotto il badge Levi's.
          Stava in basso a sinistra, dove copriva l'etichetta "La linea /
          Streetwear" che ha esattamente la stessa posizione. */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute top-32 md:top-40 left-1/2 -translate-x-1/2 z-20 w-full px-4 text-center pointer-events-none"
      >
        <p className="display-text text-carta text-2xl md:text-4xl drop-shadow-[0_2px_12px_rgba(11,11,13,0.85)]">
          Due anime, <em className="text-sabbia">un solo negozio</em>.
        </p>
      </motion.div>

      {/* Floating product card — Streetwear side */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { delay: 0.6, duration: 0.4 },
          y: { delay: 0.6, duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="hidden md:block absolute top-[28%] right-[54%] z-[15]"
        whileHover={{ y: -16 }}
      >
        <Link to={`/prodotti/${streetProduct.handle}`} className="block bg-inchiostro/80 backdrop-blur-md border border-carta/10 p-3 w-44 group hover:border-sabbia/30 transition-colors">
          <img src={streetProduct.featuredImage.url} alt={streetProduct.featuredImage.altText} width={176} height={128} className="w-full h-32 object-cover" />
          <p className="text-xs text-carta mt-2 truncate">{streetProduct.title}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-sabbia">{parseFloat(streetProduct.priceRange.minVariantPrice.amount).toFixed(0)}€</span>
            <span className="label text-carta/50 group-hover:text-carta transition-colors">Aggiungi</span>
          </div>
        </Link>
      </motion.div>

      {/* Floating product card — Old Money side */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { delay: 0.7, duration: 0.4 },
          y: { delay: 0.7, duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="hidden md:block absolute top-[45%] left-[54%] z-[15]"
        whileHover={{ y: -16 }}
      >
        <Link to={`/prodotti/${oldMoneyProduct.handle}`} className="block bg-carta/80 backdrop-blur-md border border-inchiostro/10 p-3 w-44 group hover:border-sabbia/30 transition-colors">
          <img src={oldMoneyProduct.featuredImage.url} alt={oldMoneyProduct.featuredImage.altText} width={176} height={128} className="w-full h-32 object-cover" />
          <p className="text-xs text-inchiostro mt-2 truncate">{oldMoneyProduct.title}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-rame">{parseFloat(oldMoneyProduct.priceRange.minVariantPrice.amount).toFixed(0)}€</span>
            <span className="label text-inchiostro/50 group-hover:text-inchiostro transition-colors">Aggiungi</span>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}

// ── 02 TICKER ──
function Ticker() {
  const tickerItems = [
    'SPEDIZIONE GRATUITA DA 99€',
    'RITIRO IN NEGOZIO AD AVELLINO',
    "RIVENDITORE UFFICIALE LEVI'S",
    'RESO 14 GIORNI',
  ];

  return (
    <div className="border-y border-carta/10 py-4 overflow-hidden bg-inchiostro">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="label text-carta/60 mx-8 flex items-center gap-8">
            {item}
            <span className="text-sabbia">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 04 NUOVI ARRIVI ──
function NewArrivalsCascade() {
  const cascadeProducts = products.slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-inchiostro">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {cascadeProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 04 BANDA LEVI'S ──
function LevisBand() {
  const { ref, inView } = useInView();
  const stats = [
    { value: 1853, label: 'Anno di fondazione', suffix: '' },
    { value: 501, label: 'Il modello iconico', suffix: '®' },
    { value: 100, label: 'Autentico', suffix: '%' },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={editorialImages.denimBg} alt="Tessuto denim" width={1600} height={900} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-denim-700/70" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 md:px-8 text-center">
        <span className="label text-carta/80 inline-flex items-center gap-2 border border-carta/30 px-4 py-2 mb-6">
          <Star size={12} fill="currentColor" /> RIVENDITORE UFFICIALE
        </span>
        <h2 className="display-text text-carta text-5xl md:text-7xl mb-4">
          Levi's® · <em className="text-sabbia">1853</em>
        </h2>
        <p className="text-carta/70 max-w-xl mx-auto mb-16 text-sm md:text-base">
          Siamo l'unico rivenditore ufficiale Levi's della zona. Ogni capo è garantito 100% autentico.
        </p>

        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="display-text text-carta text-4xl md:text-7xl">
                <CountUpNumber target={stat.value} start={inView} suffix={stat.suffix} />
              </p>
              <p className="label text-carta/60 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <Link
          to="/collezioni/levis"
          className="inline-flex items-center gap-2 mt-12 px-8 py-4 bg-carta text-inchiostro label hover:bg-sabbia transition-colors"
        >
          Scopri la selezione <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function CountUpNumber({ target, start, suffix }: { target: number; start: boolean; suffix?: string }) {
  const count = useCountUp(target, 2000, start);
  return <span>{count.toLocaleString('it-IT')}{suffix}</span>;
}

// ── 05 CATALOGO A SCHEDE ──
function CatalogTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: 'Nuovi Arrivi', handle: 'nuovi-arrivi' },
    { label: 'Best Seller', handle: 'best-seller' },
    { label: "Levi's", handle: 'levis' },
    { label: 'Sneaker', handle: 'sneaker' },
  ];

  const tabProducts = tabs
    .map((tab) => {
      const col = collections.find((c) => c.handle === tab.handle);
      return col ? products.filter((p) => col.productIds.includes(p.id)) : [];
    })
    .slice(0, 8);

  return (
    <section className="py-20 md:py-28 bg-inchiostro">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="label text-sabbia">05 · Catalogo</span>
            <h2 className="display-text text-carta text-4xl md:text-6xl mt-2">In vetrina</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab, i) => (
              <button
                key={tab.handle}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 label whitespace-nowrap transition-colors ${
                  activeTab === i
                    ? 'bg-carta text-inchiostro'
                    : 'text-carta/50 border border-carta/20 hover:border-carta/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {tabProducts[activeTab].map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={`/collezioni/${tabs[activeTab].handle}`}
            className="inline-flex items-center gap-2 label text-carta border border-carta/30 px-8 py-4 hover:bg-carta/10 transition-colors"
          >
            Vedi tutto <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── 06 VETRINA 360° ──
function Spin360() {
  const { ref, inView } = useInView();
  const { frameIndex, isDragging, loaded, onPointerDown, onPointerMove, onPointerUp } = use360Spin(spinFrames, inView);
  const spinProduct = products.find((p) => p.id === 'p-sneaker-navy')!;

  return (
    <section ref={ref} className="py-20 md:py-28 bg-carta-200 text-inchiostro">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="label text-rame">06 · Vetrina 360°</span>
            <h2 className="display-text text-inchiostro text-4xl md:text-6xl mt-2 mb-4">
              Guarda da <em className="text-rame">ogni</em> angolo
            </h2>
            <p className="text-inchiostro/60 text-sm md:text-base max-w-md mb-6">
              Trascina per ruotare il capo a 360 gradi. Esamina i dettagli, le cuciture, i materiali.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <span className="label text-inchiostro/50 flex items-center gap-2">
                <RotateCw size={14} /> Trascina per ruotare
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-inchiostro/70">{spinProduct.title}</p>
              <p className="display-text text-3xl text-inchiostro">{parseFloat(spinProduct.priceRange.minVariantPrice.amount).toFixed(0)}€</p>
              <Link
                to={`/prodotti/${spinProduct.handle}`}
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-inchiostro text-carta label hover:bg-rame transition-colors"
              >
                Vedi prodotto <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Piedistallo illuminato */}
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Glow */}
                <div className="absolute w-3/4 h-3/4 rounded-full bg-gradient-to-br from-sabbia/30 to-rame/20 blur-3xl" />
                {/* Pedestal */}
                <div className="absolute bottom-8 w-2/3 h-4 bg-inchiostro/10 rounded-[50%] blur-md" />
              </div>

              {/* Frame image */}
              <div
                className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                data-cursor="drag"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                {spinFrames.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Sneaker angolo ${i * 45} gradi`}
                    className="absolute max-w-[80%] max-h-[80%] object-contain transition-opacity duration-100"
                    style={{ opacity: i === frameIndex ? 1 : 0, userSelect: 'none' }}
                    draggable={false}
                  />
                ))}
                {/* Loading indicator */}
                {!loaded.every(Boolean) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RotateCw size={24} className="text-rame animate-spin" />
                  </div>
                )}
              </div>

              {/* Angle indicator */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
                {spinFrames.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 h-1 rounded-full transition-colors ${i === frameIndex ? 'bg-rame' : 'bg-inchiostro/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 07 SHOP THE LOOK ──
function ShopTheLook() {
  const lookProducts = products.filter((p) => ['p-501-original', 'p-tshirt-white', 'p-sneaker-navy'].includes(p.id));
  const totalPrice = lookProducts.reduce((sum, p) => sum + parseFloat(p.priceRange.minVariantPrice.amount), 0);
  const [hotspotActive, setHotspotActive] = useState<number | null>(null);
  const parallax = useMouseParallax(0.015);

  return (
    <section className="py-20 md:py-28 bg-inchiostro">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="label text-sabbia">07 · Shop the Look</span>
          <h2 className="display-text text-carta text-4xl md:text-6xl mt-2">
            Completa il <em className="text-sabbia">look</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Lookbook image with hotspots */}
          <div className="relative aspect-[4/5] overflow-hidden" data-cursor="view">
            <img
              src={editorialImages.lookbook}
              alt="Lookbook total look"
              className="w-full h-full object-cover"
              style={{ transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.05)` }}
            />
            {lookProducts.map((_, i) => {
              const positions = [
                { top: '30%', left: '50%' },
                { top: '60%', left: '45%' },
                { top: '85%', left: '55%' },
              ];
              return (
                <button
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={positions[i]}
                  onMouseEnter={() => setHotspotActive(i)}
                  onMouseLeave={() => setHotspotActive(null)}
                  aria-label={`Prodotto ${i + 1}`}
                >
                  <span className="block w-6 h-6 rounded-full bg-carta/80 backdrop-blur-sm border-2 border-carta flex items-center justify-center">
                    <Plus size={12} className="text-inchiostro" />
                  </span>
                  {hotspotActive === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-8 top-0 bg-inchiostro/90 backdrop-blur-sm px-4 py-2 whitespace-nowrap"
                    >
                      <p className="text-xs text-carta">{lookProducts[i].title}</p>
                      <p className="text-xs text-sabbia">{parseFloat(lookProducts[i].priceRange.minVariantPrice.amount).toFixed(0)}€</p>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Product list */}
          <div>
            <div className="space-y-4 mb-8">
              {lookProducts.map((product, i) => (
                <Link
                  key={product.id}
                  to={`/prodotti/${product.handle}`}
                  className="flex items-center gap-4 group"
                >
                  <span className="label text-sabbia w-6">{String(i + 1).padStart(2, '0')}</span>
                  <img src={product.featuredImage.url} alt={product.featuredImage.altText} width={60} height={80} className="w-16 h-20 object-cover" />
                  <div className="flex-1">
                    <p className="text-sm text-carta group-hover:text-sabbia transition-colors">{product.title}</p>
                    <p className="text-xs text-carta/50">{product.vendor}</p>
                  </div>
                  <span className="text-sm text-carta">{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}€</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-carta/10 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="label text-carta/60">Totale look</span>
                <span className="display-text text-3xl text-carta">{totalPrice.toFixed(0)}€</span>
              </div>
              <button className="w-full py-4 bg-carta text-inchiostro label hover:bg-sabbia transition-colors">
                Aggiungi tutto al carrello
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 08 TRE REPARTI ──
function Departments() {
  const depts = [
    { label: 'Uomo', to: '/collezioni/uomo', img: editorialImages.uomoDept },
    { label: 'Donna', to: '/collezioni/donna', img: editorialImages.donnaDept },
    { label: 'Sneaker', to: '/collezioni/sneaker', img: editorialImages.sneakerDept },
  ];

  return (
    <section className="py-20 md:py-28 bg-inchiostro">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="label text-sabbia">08 · Reparti</span>
          <h2 className="display-text text-carta text-4xl md:text-6xl mt-2">
            Esplora per <em className="text-sabbia">reparto</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {depts.map((dept, i) => (
            <Link
              key={dept.label}
              to={dept.to}
              className="relative h-[70vh] md:h-[80vh] overflow-hidden group"
              data-cursor="view"
            >
              <motion.div
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0 0)' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.77, 0, 0.18, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={dept.img}
                  alt={`Reparto ${dept.label}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-inchiostro/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="display-text text-carta text-5xl md:text-6xl">
                  <em>{dept.label}</em>
                </h3>
                <span className="inline-flex items-center gap-2 mt-3 label text-carta/80 group-hover:gap-3 transition-all">
                  Scopri <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 09 MANIFESTO ──
function Manifesto() {
  const { ref, inView } = useInView();
  const words = "Ad Avellino, dal 1985, vestiamo chi cerca qualità senza compromessi. Due mondi sotto lo stesso tetto: l'energia della strada e la calma dell'eleganza. Ogni capo racconta una storia. La nostra, la tua.".split(' ');

  return (
    <section ref={ref} className="py-24 md:py-40 bg-inchiostro grain">
      <div className="mx-auto max-w-4xl px-4 md:px-8 text-center">
        <span className="label text-sabbia">09 · Manifesto</span>
        <div className="mt-8 flex flex-wrap justify-center gap-x-2 gap-y-1">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.15 }}
              animate={{ opacity: inView ? 1 : 0.15 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="display-text text-carta text-3xl md:text-5xl lg:text-6xl leading-tight"
            >
              {word === 'Avellino,' || word === 'strada' || word === 'eleganza.' ? (
                <em className="text-sabbia">{word}</em>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </div>
        <Link
          to="/chi-siamo"
          className="inline-flex items-center gap-2 mt-12 label text-carta border border-carta/30 px-8 py-4 hover:bg-carta/10 transition-colors"
        >
          La nostra storia <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

// ── 10 INSTAGRAM ──
function InstagramGrid() {
  return (
    <section className="py-20 md:py-28 bg-inchiostro">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="label text-sabbia">10 · Instagram</span>
          <h2 className="display-text text-carta text-4xl md:text-6xl mt-2">
            <em>@coloradostore</em>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {instagramImages.map((img, i) => (
            <motion.a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative aspect-square overflow-hidden group"
              data-cursor="view"
            >
              <img
                src={img}
                alt={`Instagram post ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-inchiostro/0 group-hover:bg-inchiostro/30 transition-colors flex items-center justify-center">
                <MessageCircle size={20} className="text-carta opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 11 FOOTER (inline, full footer is in layout) ──
function FooterSection() {
  return (
    <section className="bg-inchiostro border-t border-carta/10 py-16">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h4 className="label-lg text-sabbia mb-3">Spedizioni</h4>
            <p className="text-sm text-carta/60">Gratuite oltre 99€<br />Consegna 2-4 giorni</p>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-3">Resi</h4>
            <p className="text-sm text-carta/60">Entro 30 giorni<br />Cambio gratuito</p>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-3">Pagamenti</h4>
            <p className="text-sm text-carta/60">Carta, PayPal<br />Pagamento sicuro</p>
          </div>
          <div>
            <h4 className="label-lg text-sabbia mb-3">WhatsApp</h4>
            <a href="https://wa.me/390000000000" className="text-sm text-carta/60 hover:text-carta transition-colors inline-flex items-center gap-2">
              <MessageCircle size={16} /> Scrivici su WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
