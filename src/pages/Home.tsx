import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, RotateCw, Instagram, Star } from 'lucide-react';
import { useLenis, useInView, useCountUp, useMouseParallax, use360Spin } from '@/lib/hooks';
import { getProducts, getProductsByCollection } from '@/lib/shop';
import { editorialImages, galleryImages, spinFrames } from '@/lib/shop/editorial';
import { SOCIAL, SHIPPING, formatPrice } from '@/lib/shop/site';
import type { Product } from '@/lib/shop/types';
import { usePageMeta } from '@/lib/meta';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  useLenis();
  const [levisCount, setLevisCount] = useState(0);

  usePageMeta({
    title: "Colorado Store · Rivenditore Ufficiale Levi's ad Avellino",
    description:
      "Streetwear e Old Money sotto lo stesso tetto. Rivenditore ufficiale Levi's ad Avellino: denim, sneaker Autry, New Balance, Dr. Martens e capi selezionati.",
    image: editorialImages.streetwear.url,
  });

  useEffect(() => {
    let alive = true;
    getProducts().then((all) => {
      if (alive) setLevisCount(all.filter((p) => p.tags.includes('levis')).length);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="bg-inchiostro text-carta">
      {/* 01 — HERO (il claim "Due anime" vive nel pannello Streetwear) */}
      <HeroSection />

      {/* 02 — TICKER */}
      <Ticker />

      {/* 03 — BANDA LEVI'S: è il differenziante del negozio, sta subito dopo */}
      <LevisBand levisCount={levisCount} />

      {/* 04 — CATALOGO A SCHEDE */}
      <CatalogTabs />

      {/* 05 — VETRINA SNEAKER */}
      <SneakerShowcase />

      {/* 06 — SHOP THE LOOK */}
      <OutfitBuilder />

      {/* 07 — TRE REPARTI */}
      <Departments />

      {/* 08 — MANIFESTO */}
      <Manifesto />

      {/* 09 — SOCIAL */}
      <SocialGrid />
    </div>
  );
}

// Card prodotto fluttuante nella hero. Sta dentro il proprio pannello, così
// segue l'espansione al passaggio del mouse e non finisce mai sopra il claim.
function HeroProductCard({
  product,
  tone,
  className,
  delay,
}: {
  product: Product;
  tone: 'dark' | 'light';
  className: string;
  delay: number;
}) {
  const dark = tone === 'dark';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.4 },
        y: { delay, duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ y: -16 }}
      className={`hidden lg:block absolute z-20 ${className}`}
    >
      <Link
        to={`/prodotti/${product.handle}`}
        className={`block backdrop-blur-md border p-3 w-44 group transition-colors ${
          dark
            ? 'bg-inchiostro/80 border-carta/10 hover:border-sabbia/40'
            : 'bg-carta/85 border-inchiostro/10 hover:border-rame/40'
        }`}
      >
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          width={176}
          height={128}
          className="w-full h-32 object-cover"
        />
        <p className={`label mt-2 ${dark ? 'text-sabbia' : 'text-rame'}`}>{product.vendor}</p>
        <p className={`text-xs mt-0.5 truncate ${dark ? 'text-carta' : 'text-inchiostro'}`}>{product.title}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className={`text-sm ${dark ? 'text-sabbia' : 'text-rame'}`}>
            {formatPrice(product.priceRange.minVariantPrice.amount, { round: true })}
          </span>
          <span
            className={`label transition-colors ${
              dark ? 'text-carta/50 group-hover:text-carta' : 'text-inchiostro/50 group-hover:text-inchiostro'
            }`}
          >
            Vedi
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ── 01 HERO ──
function HeroSection() {
  const [hovered, setHovered] = useState<'street' | 'old' | null>(null);
  const [streetPick, setStreetPick] = useState<Product | null>(null);
  const [oldPick, setOldPick] = useState<Product | null>(null);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Un capo per anima: Levi's è il differenziante del negozio, la maglieria
  // rappresenta il lato sartoriale. Entrambi reali e disponibili — e diversi
  // dagli scatti di sfondo dei due pannelli, altrimenti la card ripeterebbe
  // il capo che ha già dietro.
  useEffect(() => {
    let alive = true;
    const backdrops = [editorialImages.streetwear.url, editorialImages.oldMoney.url].map(
      (u) => u.split('?')[0],
    );
    const pick = (list: Product[]) =>
      list.find((p) => p.availableForSale && !backdrops.includes(p.featuredImage.url.split('?')[0])) ?? null;
    getProductsByCollection('levis').then((l) => alive && setStreetPick(pick(l)));
    getProductsByCollection('maglieria-u').then((l) => alive && setOldPick(pick(l)));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-inchiostro">
      {/* Two worlds */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* LEFT — STREETWEAR */}
        {/* Il 50/50 sta nelle classi CSS, non nell'animazione: se il tab è in
            background e requestAnimationFrame non gira, la hero resta comunque
            corretta invece di collassare a larghezza zero. */}
        <motion.div
          initial={false}
          animate={{ flexGrow: prefersReduced ? 50 : hovered === 'street' ? 65 : hovered === 'old' ? 35 : 50 }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
          className="relative overflow-hidden grow basis-0"
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
            {/* object-top: il ritaglio centrato tagliava il 12% superiore, cioè
                la testa del soggetto. Ancorando in alto si perde solo il fondo. */}
            <img
              src={editorialImages.streetwear.url}
              alt={editorialImages.streetwear.alt}
              width={600}
              height={800}
              className="w-full h-full object-cover object-top"
            />
            {/* Scrim mirato: scuro solo dove poggia il testo (fascia sinistra e
                fondo). La parte centro-destra della foto resta pulita, così i
                volti non finiscono sotto una lastra nera. */}
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(11,11,13,0.92)_0%,rgba(11,11,13,0.62)_30%,rgba(11,11,13,0.18)_52%,rgba(11,11,13,0)_72%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-inchiostro/85 via-transparent to-transparent" />
          </motion.div>

          {/* Claim — vive dentro il pannello Streetwear, non più a cavallo dei due */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="absolute top-24 left-6 md:top-32 md:left-10 z-20 max-w-[85%] md:max-w-md"
          >
            <span className="label text-sabbia">Colorado Store · Avellino</span>
            <h1 className="display-text text-carta text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 leading-[1.05]">
              Due anime,<br />
              <em className="text-sabbia">un solo negozio</em>.
            </h1>
            <span className="label text-carta mt-5 inline-flex items-center gap-2 bg-inchiostro/70 backdrop-blur-md border border-sabbia/30 px-3 py-2">
              <Star size={10} fill="currentColor" className="text-sabbia" />
              RIVENDITORE UFFICIALE LEVI'S
            </span>
          </motion.div>

          {/* Card prodotto — in basso a destra, lontana da claim ed etichetta */}
          {streetPick && (
            <HeroProductCard product={streetPick} tone="dark" delay={0.6} className="bottom-[16%] right-8" />
          )}

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
          initial={false}
          animate={{ flexGrow: prefersReduced ? 50 : hovered === 'old' ? 65 : hovered === 'street' ? 35 : 50 }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
          className="relative overflow-hidden grow basis-0"
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
              src={editorialImages.oldMoney.url}
              alt={editorialImages.oldMoney.alt}
              width={600}
              height={800}
              className="w-full h-full object-cover object-top"
            />
            {/* Speculare al pannello Streetwear, ma in chiaro: il testo qui è
                scuro e la card sta in alto a sinistra. */}
            <div className="absolute inset-0 bg-[linear-gradient(80deg,rgba(244,241,234,0.88)_0%,rgba(244,241,234,0.45)_28%,rgba(244,241,234,0.08)_50%,rgba(244,241,234,0)_70%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-carta-300/80 via-transparent to-transparent" />
          </motion.div>

          {/* Card prodotto — in alto a sinistra: sfalsata rispetto a quella
              Streetwear, per creare la diagonale attraverso la linea centrale */}
          {oldPick && (
            <HeroProductCard product={oldPick} tone="light" delay={0.75} className="top-[24%] left-8" />
          )}

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

    </section>
  );
}

// ── 02 TICKER ──
function Ticker() {
  const tickerItems = [
    `SPEDIZIONE GRATUITA DA ${SHIPPING.freeThreshold}€`,
    `CONSEGNA IN ${SHIPPING.deliveryTime}`,
    'RITIRO IN NEGOZIO AD AVELLINO',
    "RIVENDITORE UFFICIALE LEVI'S",
    'RESO 14 GIORNI',
  ];

  return (
    <div className="border-y border-carta/20 py-4.5 overflow-hidden bg-inchiostro">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="label text-white font-bold text-sm tracking-widest mx-8 flex items-center gap-8 drop-shadow-sm">
            {item}
            <span className="text-sabbia text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 03 BANDA LEVI'S ──
function LevisBand({ levisCount }: { levisCount: number }) {
  const { ref, inView } = useInView();
  const stats = [
    { value: levisCount, label: 'Capi Levi’s a catalogo', suffix: '' },
    { value: 1, label: 'Rivenditore ufficiale in zona', suffix: '' },
    { value: 100, label: 'Autentico', suffix: '%' },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Immagine di sfondo personalizzata */}
      <div className="absolute inset-0">
        <img
          src="/assets/levis/levistemplate.png"
          alt="Levi's Colorado Store"
          width={1600}
          height={900}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-denim-700/80" />
      </div>

      {/* Banner 1 — In alto a destra */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
        <span className="label text-carta/90 inline-flex items-center gap-2 bg-inchiostro/80 backdrop-blur-md border border-sabbia/40 px-4 py-2.5 shadow-lg">
          <Star size={11} fill="currentColor" className="text-sabbia" />
          IN LEVI'S WE TRUST
        </span>
      </div>

      {/* Banner 2 — In basso a sinistra */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20">
        <span className="label text-carta/90 inline-flex items-center gap-2 bg-inchiostro/80 backdrop-blur-md border border-sabbia/40 px-4 py-2.5 shadow-lg">
          <Star size={11} fill="currentColor" className="text-sabbia" />
          IN LEVI'S WE TRUST
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 md:px-8 text-center">
        <span className="label text-carta/80 inline-flex items-center gap-2 border border-carta/30 px-4 py-2 mb-6">
          <Star size={12} fill="currentColor" /> RIVENDITORE UFFICIALE
        </span>
        <h2 className="display-text text-carta text-5xl md:text-7xl mb-4">
          Levi&rsquo;s<sup className="text-2xl md:text-3xl align-super">®</sup> <em className="text-sabbia">ad Avellino</em>
        </h2>
        <p className="text-carta/70 max-w-xl mx-auto mb-16 text-sm md:text-base">
          Siamo l&rsquo;unico negozio della zona con licenza ufficiale per la rivendita Levi&rsquo;s.
          Ogni capo è garantito 100% autentico.
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
const CATALOG_TABS = [
  { label: 'Nuovi Arrivi', handle: 'new-collection' },
  { label: 'Best Seller', handle: 'best-sellers' },
  { label: "Levi's", handle: 'levis' },
  { label: 'Sneaker', handle: 'sneakers' },
  { label: 'Outlet', handle: 'outlet' },
];

function CatalogTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabProducts, setTabProducts] = useState<Product[][]>(() => CATALOG_TABS.map(() => []));
  const tabs = CATALOG_TABS;

  useEffect(() => {
    let alive = true;
    Promise.all(tabs.map((t) => getProductsByCollection(t.handle))).then((lists) => {
      if (!alive) return;
      // Prima i disponibili: una vetrina piena di "Esaurito" non vende.
      setTabProducts(
        lists.map((l) =>
          [...l].sort((a, b) => Number(b.availableForSale) - Number(a.availableForSale)).slice(0, 8),
        ),
      );
    });
    return () => {
      alive = false;
    };
  }, [tabs]);

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

// ── 06 VETRINA FOOTWEAR (3D Showcase Elegante & Lussuoso) ──
const FOOTWEAR_PALETTES: Record<string, { ambient: string; accent: string; highlight: string }> = {
  autry: { ambient: 'rgba(196, 99, 58, 0.15)', accent: '#C4633A', highlight: '#E8A98C' },
  'new balance': { ambient: 'rgba(90, 115, 147, 0.15)', accent: '#5A7393', highlight: '#A8C0E0' },
  asics: { ambient: 'rgba(176, 154, 120, 0.15)', accent: '#B09A78', highlight: '#E2DBC9' },
  reebok: { ambient: 'rgba(160, 90, 90, 0.15)', accent: '#A05A5A', highlight: '#DF9270' },
  default: { ambient: 'rgba(176, 154, 120, 0.15)', accent: '#B09A78', highlight: '#E2DBC9' },
};

function getFootwearPalette(vendor = '', title = '') {
  const v = vendor.toLowerCase();
  const t = title.toLowerCase();
  if (v.includes('autry') || t.includes('autry')) return FOOTWEAR_PALETTES.autry;
  if (v.includes('new balance') || t.includes('new balance') || t.includes('1906r') || t.includes('530')) return FOOTWEAR_PALETTES['new balance'];
  if (v.includes('asics') || t.includes('asics')) return FOOTWEAR_PALETTES.asics;
  if (v.includes('reebok') || t.includes('reebok')) return FOOTWEAR_PALETTES.reebok;
  return FOOTWEAR_PALETTES.default;
}

function SneakerShowcase() {
  const { ref } = useInView();
  const [shoeProduct, setShoeProduct] = useState<Product | null>(null);

  useEffect(() => {
    let alive = true;
    getProducts().then((all) => {
      if (!alive) return;
      const found = all.find((p) => p.handle === 'asics') ||
                    all.find((p) => p.title.toLowerCase().includes('asics new york')) ||
                    all.find((p) => p.vendor.toLowerCase().includes('asics'));
      setShoeProduct(found || null);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-36 relative overflow-hidden bg-inchiostro border-y border-carta/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="label tracking-[0.35em] text-xs font-semibold uppercase text-sabbia">
            06 · Footwear Gallery & Experience
          </span>
          <h2 className="display-text text-carta text-4xl md:text-6xl lg:text-7xl mt-3 font-normal">
            ASICS New York 2.0 <em className="text-sabbia italic font-normal">Gel-1130</em>
          </h2>
          <p className="text-carta/60 text-sm max-w-xl mx-auto mt-4">
            Silhouette Y2K iconica anni 2000 in mesh e suede beige/bianco. Comfort ammortizzato GEL per tutto il giorno.
          </p>
        </div>

        {/* Video Hero Hero.mp4 con Display Dettagli affiancati */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* VIDEO ANIMATO HERO */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-carta/15 shadow-2xl bg-black aspect-video lg:aspect-[16/10] group">
            <video
              src={`${import.meta.env.BASE_URL}assets/sneackers/hero.mp4`}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-inchiostro/80 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="label text-xs text-sabbia inline-flex items-center gap-2 bg-inchiostro/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-sabbia/30">
                ✦ 360° MOTION SHOWCASE
              </span>
            </div>
          </div>

          {/* SCHEDA DETTAGLI PRODOTTO E INFO SNEAKER */}
          <div className="lg:col-span-4 bg-carta/5 backdrop-blur-md border border-carta/10 p-8 rounded-3xl flex flex-col justify-between h-full">
            <div>
              <span className="label text-sabbia text-xs uppercase tracking-widest">ASICS · FOOTWEAR EDITION</span>
              <h3 className="display-text text-carta text-3xl md:text-4xl mt-2 mb-4">
                Gel-1130 Chunky
              </h3>
              <div className="w-12 h-px bg-sabbia/50 mb-6" />

              <ul className="space-y-4 text-sm text-carta/80">
                <li className="flex items-start gap-3">
                  <span className="text-sabbia mt-1">✦</span>
                  <span><strong>Tomaia:</strong> Mesh tecnico traspirante & inserti in pelle scamosciata beige.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sabbia mt-1">✦</span>
                  <span><strong>Tecnologia:</strong> Ammortizzazione GEL™ per un assorbimento degli urti eccezionale.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sabbia mt-1">✦</span>
                  <span><strong>Stile:</strong> Design running retro tech anni 2000 in colorazione esclusiva.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-carta/10">
              <div className="flex items-center justify-between mb-6">
                <span className="label text-carta/60">Prezzo Ufficiale</span>
                <span className="display-text text-3xl text-sabbia">
                  {shoeProduct ? formatPrice(shoeProduct.priceRange.minVariantPrice.amount, { round: true }) : '160€'}
                </span>
              </div>

              <Link
                to={shoeProduct ? `/prodotti/${shoeProduct.handle}` : '/collezioni/sneakers'}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-sabbia text-inchiostro label text-xs uppercase font-bold tracking-wider hover:bg-carta transition-all duration-300 shadow-xl"
              >
                <span>Acquista ASICS Gel-1130</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 07 SHOP THE LOOK (Full Width con Hotspot Capi Singoli + Outfit Completo) ──
function OutfitBuilder() {
  const [items, setItems] = useState<{ top?: Product; pant?: Product; shoe?: Product }>({});
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getProducts().then((allProducts) => {
      if (!alive) return;

      // Capi esatti indossati nel Lookbook
      const top = allProducts.find((p) => p.handle === 't-shirt-black-island-3') ||
                  allProducts.find((p) => p.title.toLowerCase().includes('statua della libertà')) ||
                  allProducts.find((p) => p.vendor.toLowerCase().includes('black island') && p.title.toLowerCase().includes('t-shirt'));

      const pant = allProducts.find((p) => p.handle === 'levi-s-baggy-1') ||
                   allProducts.find((p) => p.tags.includes('levis') && (p.title.toLowerCase().includes('baggy') || p.title.toLowerCase().includes('jacket') || p.title.toLowerCase().includes('jeans'))) ||
                   allProducts.find((p) => p.tags.includes('levis'));

      const shoe = allProducts.find((p) => p.handle === 'asics') ||
                   allProducts.find((p) => p.title.toLowerCase().includes('asics new york 2.0') || p.title.toLowerCase().includes('gel-1130')) ||
                   allProducts.find((p) => p.vendor.toLowerCase().includes('asics'));

      setItems({ top, pant, shoe });
    });
    return () => {
      alive = false;
    };
  }, []);

  const renderSingleHotspot = (
    id: string,
    topPos: string,
    leftPos: string,
    product: Product | undefined,
    label: string,
    colorClass: string,
  ) => {
    if (!product) return null;
    const isOpen = activeTooltip === id;

    return (
      <div className="absolute z-30 -translate-x-1/2 -translate-y-1/2" style={{ top: topPos, left: leftPos }}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveTooltip(isOpen ? null : id)}
            onMouseEnter={() => setActiveTooltip(id)}
            aria-label={`Vedi ${label}`}
            className="group/spot flex items-center justify-center p-1"
          >
            <span className="absolute w-7 h-7 rounded-full bg-carta/30 animate-ping pointer-events-none" />
            <span className={`w-7 h-7 rounded-full backdrop-blur-md border-2 border-carta flex items-center justify-center text-xs font-bold shadow-xl transition-transform hover:scale-125 ${colorClass}`}>
              +
            </span>
          </button>

          {/* Card / Tooltip al passaggio del mouse */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute left-1/2 -translate-x-1/2 top-9 w-56 sm:w-64 bg-inchiostro/95 backdrop-blur-xl border border-carta/20 p-3 shadow-2xl z-40 rounded-xl text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText}
                  className="w-12 h-12 object-cover rounded-lg shrink-0 border border-carta/10"
                />
                <div className="flex-1 min-w-0">
                  <span className="label text-[9px] text-sabbia uppercase block truncate">{label} • {product.vendor}</span>
                  <p className="text-xs font-medium text-carta truncate leading-snug">{product.title}</p>
                  <p className="text-xs text-sabbia font-semibold mt-0.5">
                    {formatPrice(product.priceRange.minVariantPrice.amount, { round: true })}
                  </p>
                </div>
              </div>
              <Link
                to={`/prodotti/${product.handle}`}
                className="mt-2.5 w-full py-1.5 bg-carta/10 hover:bg-sabbia hover:text-inchiostro label text-[10px] text-carta rounded flex items-center justify-center gap-1 transition-colors"
              >
                Vedi scheda prodotto <ArrowRight size={10} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 md:py-32 bg-inchiostro overflow-hidden">
      <div className="w-full px-2 sm:px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <span className="label text-sabbia tracking-[0.3em]">07 · Shop the Look</span>
          <h2 className="display-text text-carta text-4xl md:text-6xl mt-2">
            Clicca sui capi <em className="text-sabbia">per acquistare</em>
          </h2>
          <p className="text-carta/60 text-sm max-w-md mx-auto mt-3">
            Tocca i punti <span className="text-sabbia font-semibold">+</span> sulla T-Shirt, Jeans Baggy o Sneakers per scoprire i capi ed i dettagli dell'outfit.
          </p>
        </div>

        {/* CONTENITORE FOTO LOOKBOOK DA ASSETS */}
        <div className="relative w-full max-w-[1200px] mx-auto h-[75vh] md:h-[88vh] min-h-[550px] rounded-3xl overflow-hidden border border-carta/10 bg-[#0c0b0b] shadow-2xl group flex items-center justify-center">
          <img
            src={editorialImages.lookbook.url}
            alt={editorialImages.lookbook.alt}
            className="w-full h-full object-contain transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
          />

          {/* Overlay sfumato per far risaltare testo e hotspot */}
          <div className="absolute inset-0 bg-gradient-to-t from-inchiostro/80 via-transparent to-inchiostro/30 pointer-events-none" />

          {/* OUTFIT COMPLETO — IN ALTO A SINISTRA */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-30">
            <Link
              to="/collezioni/streetwear"
              className="inline-flex items-center gap-2 bg-inchiostro/85 border border-sabbia/40 backdrop-blur-md px-4 py-2.5 rounded-full text-carta hover:bg-sabbia hover:text-inchiostro transition-all shadow-xl group/outfit"
            >
              <span className="w-6 h-6 rounded-full bg-sabbia text-inchiostro flex items-center justify-center font-bold text-sm">
                +
              </span>
              <span className="label text-xs tracking-wider">Acquista Outfit Completo</span>
              <ArrowRight size={14} className="group-hover/outfit:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* HOTSPOT CAPI SINGOLI SUL MODELLO */}
          {/* 1. T-Shirt "Black Island" Statua della Libertà Skull */}
          {renderSingleHotspot('look-top', '32%', '50%', items.top, 'Black Island • Statua della Libertà', 'bg-sabbia text-inchiostro')}
          
          {/* 2. Levi's Baggy */}
          {renderSingleHotspot('look-pant', '65%', '48%', items.pant, 'Levi’s Baggy', 'bg-sabbia text-inchiostro')}
          
          {/* 3. ASICS New York 2.0 Beige Bianco - Gel-1130 */}
          {renderSingleHotspot('look-shoe', '89%', '42%', items.shoe, 'ASICS New York 2.0 • Gel-1130', 'bg-sabbia text-inchiostro')}

          {/* Didascalia in basso */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
            <span className="label text-carta/70 text-xs tracking-widest">COLORADO STREETWEAR LOOKBOOK</span>
            <span className="label text-sabbia text-xs uppercase">Curated Collection</span>
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
    { label: 'Sneaker', to: '/collezioni/sneakers', img: editorialImages.sneakerDept },
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
                  src={dept.img.url}
                  alt={`Reparto ${dept.label} — ${dept.img.alt}`}
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
  const words = "Ad Avellino, dagli anni Novanta, vestiamo chi cerca qualità senza compromessi. Due mondi sotto lo stesso tetto: l'energia della strada e la calma dell'eleganza. Ogni capo racconta una storia. La nostra, la tua.".split(' ');

  return (
    <section ref={ref} className="relative py-24 md:py-40 bg-inchiostro grain">
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

// ── 10 SOCIAL ──
// Le immagini sono capi reali del catalogo, non post Instagram: il collegamento
// a un feed vero richiede la Instagram Basic Display API.
function SocialGrid() {
  return (
    <section className="py-20 md:py-28 bg-inchiostro">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="label text-sabbia">10 · Seguici</span>
          <h2 className="display-text text-carta text-4xl md:text-6xl mt-2">
            <em>{SOCIAL.instagramHandle}</em>
          </h2>
          <p className="text-carta/50 text-sm mt-3">Nuovi arrivi, offerte e look dal negozio.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
          {galleryImages.map((img, i) => (
            <motion.a
              key={img.url}
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="relative aspect-square overflow-hidden group"
              data-cursor="view"
              aria-label={`${img.alt} — apri il profilo Instagram`}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-inchiostro/0 group-hover:bg-inchiostro/40 transition-colors flex items-center justify-center">
                <Instagram size={20} className="text-carta opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
