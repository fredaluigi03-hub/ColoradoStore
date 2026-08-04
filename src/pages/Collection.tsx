import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, Grid2x2, Grid3x3 } from 'lucide-react';
import { getProducts, getProductsByCollection, getCollection, matchesFilter } from '@/lib/shop';
import { editorialImages } from '@/lib/shop/editorial';
import { usePageMeta } from '@/lib/meta';
import type { Product, CollectionFilter } from '@/lib/shop/types';
import ProductCard from '@/components/ProductCard';
import { scrollToTop } from '@/lib/hooks';

const SORT_OPTIONS = [
  { value: 'raccomandati', label: 'Raccomandati' },
  { value: 'prezzo-asc', label: 'Prezzo: crescente' },
  { value: 'prezzo-desc', label: 'Prezzo: decrescente' },
  { value: 'sconto', label: 'Sconto maggiore' },
];

// I reparti che hanno senso filtrare per stile.
const STYLE_CHOICE_HANDLES = ['uomo', 'donna', 'abbigliamento', 'abbigliamento-u', 'abbigliamento-d'];

// Streetwear e Old Money sono linee editoriali nostre, non collection Shopify:
// si costruiscono filtrando l'intero catalogo.
const EDITORIAL_LINES: Record<string, { title: string; description: string; line: 'streetwear' | 'old-money' }> = {
  streetwear: {
    title: 'Streetwear',
    description: 'Denim, felpe, sneaker e capi urban. Il lato giovane del negozio.',
    line: 'streetwear',
  },
  'old-money': {
    title: 'Old Money',
    description: 'Camicie, maglieria, coordinati. Eleganza senza tempo.',
    line: 'old-money',
  },
};

const discountOf = (p: Product) => {
  const before = p.compareAtPriceRange && parseFloat(p.compareAtPriceRange.minVariantCompareAtPrice.amount);
  if (!before) return 0;
  const now = parseFloat(p.priceRange.minVariantPrice.amount);
  return before > now ? 1 - now / before : 0;
};

export default function CollectionPage() {
  const { handle } = useParams();
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [collectionTitle, setCollectionTitle] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [filter, setFilter] = useState<CollectionFilter>({ linea: 'all' });
  const [sort, setSort] = useState('raccomandati');
  const [columns, setColumns] = useState(4);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const showStyleChoice = STYLE_CHOICE_HANDLES.includes(handle || '');

  usePageMeta({
    title: collectionTitle ? `${collectionTitle} · Colorado Store Avellino` : 'Catalogo · Colorado Store',
    description:
      collectionDesc ||
      `${collectionTitle || 'Catalogo'} — Colorado Store, rivenditore ufficiale Levi's ad Avellino. Spedizione in 24/48h.`,
  });

  useEffect(() => {
    if (!handle) return;
    let alive = true;
    setNotFound(false);
    setVisibleCount(12);

    const editorial = EDITORIAL_LINES[handle];
    if (editorial) {
      getProducts().then((all) => {
        if (!alive) return;
        setCollectionTitle(editorial.title);
        setCollectionDesc(editorial.description);
        setCollectionProducts(all.filter((p) => p.tagsLine.includes(editorial.line)));
      });
    } else {
      Promise.all([getCollection(handle), getProductsByCollection(handle)]).then(([c, list]) => {
        if (!alive) return;
        setCollectionTitle(c?.title || '');
        setCollectionDesc(c?.description || '');
        setCollectionProducts(list);
        setNotFound(!c);
      });
    }
    return () => {
      alive = false;
    };
  }, [handle]);

  // Sulle pagine di linea il filtro è già applicato dalla collezione stessa:
  // riapplicarlo nel pannello sarebbe ridondante.
  useEffect(() => {
    setFilter({ linea: 'all' });
  }, [handle]);

  // I valori dei filtri escono dai prodotti realmente presenti: niente taglie
  // o colori che non darebbero risultati.
  const facets = useMemo(() => {
    const types = new Set<string>();
    const sizes = new Set<string>();
    const colors = new Set<string>();
    const brands = new Set<string>();
    let maxPrice = 0;
    for (const p of collectionProducts) {
      if (p.productType) types.add(p.productType);
      if (p.vendor) brands.add(p.vendor);
      for (const o of p.options) {
        if (o.name === 'Taglia') o.values.forEach((v) => sizes.add(v));
        if (o.name === 'Colore') o.values.forEach((v) => colors.add(v));
      }
      maxPrice = Math.max(maxPrice, parseFloat(p.priceRange.maxVariantPrice.amount));
    }
    const numeric = (a: string, b: string) => {
      const na = parseFloat(a);
      const nb = parseFloat(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    };
    return {
      types: [...types].sort(),
      sizes: [...sizes].sort(numeric),
      colors: [...colors].sort(),
      brands: [...brands].sort(),
      maxPrice: Math.ceil(maxPrice / 10) * 10 || 300,
    };
  }, [collectionProducts]);

  const filteredProducts = useMemo(() => {
    const result = collectionProducts.filter((p) => matchesFilter(p, filter));

    if (sort === 'prezzo-asc')
      result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    else if (sort === 'prezzo-desc')
      result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    else if (sort === 'sconto') result.sort((a, b) => discountOf(b) - discountOf(a));
    // Di default i disponibili vengono prima: gli esauriti non convertono.
    else result.sort((a, b) => Number(b.availableForSale) - Number(a.availableForSale));

    return result;
  }, [collectionProducts, filter, sort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const activeFilters: { key: string; label: string }[] = [];
  if (filter.productType) activeFilters.push({ key: 'productType', label: filter.productType });
  if (filter.taglia) activeFilters.push({ key: 'taglia', label: `Taglia: ${filter.taglia}` });
  if (filter.colore) activeFilters.push({ key: 'colore', label: `Colore: ${filter.colore}` });
  if (filter.brand) activeFilters.push({ key: 'brand', label: filter.brand });
  if (filter.prezzoMax) activeFilters.push({ key: 'prezzoMax', label: `Fino a ${filter.prezzoMax}€` });
  if (filter.linea && filter.linea !== 'all') activeFilters.push({ key: 'linea', label: filter.linea === 'streetwear' ? 'Streetwear' : 'Old Money' });

  // "linea" non ha uno stato assente: azzerarla significa riportarla a 'all'.
  const clearFilter = (key: string) => setFilter((f) => {
    if (key === 'linea') return { ...f, linea: 'all' };
    const next = { ...f };
    delete (next as Record<string, unknown>)[key];
    return next;
  });

  const gridCols = columns === 3 ? 'md:grid-cols-3' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-5';

  return (
    <div className="bg-inchiostro text-carta min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-12 md:py-16">
        <span className="label text-sabbia">Collezione</span>
        <h1 className="display-text text-carta text-5xl md:text-7xl mt-2">
          <em>{collectionTitle || (notFound ? 'Collezione non trovata' : 'Catalogo')}</em>
        </h1>
        {collectionDesc && <p className="text-carta/60 mt-4 max-w-xl text-sm">{collectionDesc}</p>}
        {notFound && (
          <p className="text-carta/60 mt-4 max-w-xl text-sm">
            Questa collezione non esiste più.{' '}
            <Link to="/collezioni/new-collection" className="text-sabbia hover:text-carta transition-colors">
              Vedi i nuovi arrivi
            </Link>
            .
          </p>
        )}
      </div>

      {showStyleChoice && (
        <section className="mx-auto max-w-[1600px] px-4 md:px-8 pb-10 md:pb-14">
          <div className="border-t border-carta/10 pt-8 md:pt-10"><div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6"><div><span className="label text-sabbia">Due anime</span><h2 className="display-text text-3xl md:text-5xl mt-1">Quale stile scegli <em className="text-sabbia">oggi?</em></h2></div><button onClick={() => setFilter((current) => ({ ...current, linea: 'all' }))} className="label text-carta/60 hover:text-carta">Mostra tutto il reparto</button></div>
            <div className="grid md:grid-cols-2 gap-4"><button type="button" onClick={() => setFilter((current) => ({ ...current, linea: 'streetwear' }))} className={`relative min-h-[250px] overflow-hidden text-left group border ${filter.linea === 'streetwear' ? 'border-sabbia' : 'border-carta/10'}`}><img src={editorialImages.streetwear.url} alt={editorialImages.streetwear.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-inchiostro/90 via-inchiostro/15 to-inchiostro/20" /><div className="absolute bottom-0 p-6"><span className="label text-carta/60">Energia urbana</span><span className="block display-text text-carta text-4xl mt-1"><em>Streetwear</em></span></div></button><button type="button" onClick={() => setFilter((current) => ({ ...current, linea: 'old-money' }))} className={`relative min-h-[250px] overflow-hidden text-left group border ${filter.linea === 'old-money' ? 'border-sabbia' : 'border-carta/10'}`}><img src={editorialImages.oldMoney.url} alt={editorialImages.oldMoney.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-carta/90 via-carta/10 to-carta/20" /><div className="absolute bottom-0 p-6 text-inchiostro"><span className="label opacity-60">Eleganza senza tempo</span><span className="block display-text text-4xl mt-1"><em>Old Money</em></span></div></button></div>
          </div>
        </section>
      )}

      {/* Toolbar */}
      <div className="sticky top-16 md:top-20 z-30 bg-inchiostro/90 backdrop-blur-md border-y border-carta/10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 label text-carta/80 hover:text-carta transition-colors"
          >
            <SlidersHorizontal size={16} /> Filtri
          </button>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative hidden md:block">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-transparent border border-carta/20 px-4 py-2 label text-carta/70 outline-none cursor-pointer hover:border-carta/50 transition-colors pr-8"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-inchiostro text-carta">{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-carta/50" />
            </div>

            {/* Grid density */}
            <div className="hidden md:flex items-center gap-1 border border-carta/20 p-1">
              <button onClick={() => setColumns(3)} className={`p-1.5 ${columns === 3 ? 'bg-carta/10' : ''}`} aria-label="3 colonne"><Grid2x2 size={16} /></button>
              <button onClick={() => setColumns(4)} className={`p-1.5 ${columns === 4 ? 'bg-carta/10' : ''}`} aria-label="4 colonne"><LayoutGrid size={16} /></button>
              <button onClick={() => setColumns(5)} className={`p-1.5 ${columns === 5 ? 'bg-carta/10' : ''}`} aria-label="5 colonne"><Grid3x3 size={16} /></button>
            </div>

            <span className="label text-carta/50">{filteredProducts.length} articoli</span>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="mx-auto max-w-[1600px] px-4 md:px-8 pb-3 flex flex-wrap gap-2">
            {activeFilters.map((af) => (
              <button
                key={af.key}
                onClick={() => clearFilter(af.key)}
                className="flex items-center gap-1 px-3 py-1 bg-carta/10 label text-carta/80 hover:bg-carta/20 transition-colors"
              >
                {af.label} <X size={10} />
              </button>
            ))}
            <button onClick={() => setFilter({ linea: filter.linea })} className="label text-sabbia hover:text-carta transition-colors">
              Cancella tutto
            </button>
          </div>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-carta/10 bg-inchiostro-400"
        >
          <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-6 grid md:grid-cols-6 gap-6">
            {facets.types.length > 1 && (
              <FilterGroup label="Categoria">
                {facets.types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter((f) => ({ ...f, productType: f.productType === t ? undefined : t }))}
                    className={`block text-sm py-1 ${filter.productType === t ? 'text-sabbia' : 'text-carta/60 hover:text-carta'}`}
                  >
                    {t}
                  </button>
                ))}
              </FilterGroup>
            )}
            {facets.sizes.length > 0 && (
              <FilterGroup label="Taglia">
                <div className="flex flex-wrap gap-1.5">
                  {facets.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter((f) => ({ ...f, taglia: f.taglia === s ? undefined : s }))}
                      className={`px-2.5 py-1.5 text-xs border ${filter.taglia === s ? 'border-sabbia text-sabbia' : 'border-carta/20 text-carta/60 hover:border-carta/50'} transition-colors`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            )}
            {facets.colors.length > 0 && (
              <FilterGroup label="Colore">
                <div className="max-h-48 overflow-y-auto no-scrollbar">
                  {facets.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilter((f) => ({ ...f, colore: f.colore === c ? undefined : c }))}
                      className={`block text-sm py-1 text-left ${filter.colore === c ? 'text-sabbia' : 'text-carta/60 hover:text-carta'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            )}
            <FilterGroup label="Prezzo">
              <input
                type="range"
                min={10}
                max={facets.maxPrice}
                step={10}
                value={filter.prezzoMax || facets.maxPrice}
                onChange={(e) => setFilter((f) => ({ ...f, prezzoMax: parseInt(e.target.value) }))}
                className="w-full accent-sabbia"
                aria-label="Prezzo massimo"
              />
              <p className="text-sm text-carta/60 mt-2">Fino a {filter.prezzoMax || facets.maxPrice}€</p>
            </FilterGroup>
            {facets.brands.length > 1 && (
              <FilterGroup label="Brand">
                <div className="max-h-48 overflow-y-auto no-scrollbar">
                  {facets.brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setFilter((f) => ({ ...f, brand: f.brand === b ? undefined : b }))}
                      className={`block text-sm py-1 text-left ${filter.brand === b ? 'text-sabbia' : 'text-carta/60 hover:text-carta'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            )}
            <FilterGroup label="Linea">
              {(['streetwear', 'old-money'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setFilter((f) => ({ ...f, linea: f.linea === l ? 'all' : l }))}
                  className={`block text-sm py-1 ${filter.linea === l ? 'text-sabbia' : 'text-carta/60 hover:text-carta'}`}
                >
                  {l === 'old-money' ? 'Old Money' : 'Streetwear'}
                </button>
              ))}
            </FilterGroup>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-8">
        {visibleProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="display-text text-3xl text-carta/50">Nessun articolo trovato</p>
            <button onClick={() => setFilter({ linea: 'all' })} className="mt-4 label text-sabbia hover:text-carta transition-colors">
              Cancella filtri
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-2 ${gridCols} gap-4 md:gap-6`}>
            {visibleProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((c) => c + 12)}
              className="btn-3d btn-3d-gold px-8 py-4 rounded-full bg-sabbia text-inchiostro label font-bold tracking-widest transition-all"
            >
              CARICA ALTRI PRODOTTI
            </button>
          </div>
        )}

        {/* CONTROLI 3D NAVIGAZIONE A FINE CATEGORIA */}
        <div className="mt-16 pt-8 border-t border-carta/10 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-3d px-6 py-3 rounded-full border border-carta/20 bg-inchiostro-300 text-carta label text-xs tracking-widest flex items-center gap-2"
          >
            <span>🏠 TORNA ALLA HOME</span>
          </Link>
          <button
            onClick={scrollToTop}
            className="btn-3d btn-3d-gold px-6 py-3 rounded-full bg-sabbia text-inchiostro label text-xs font-bold tracking-widest flex items-center gap-2 shadow-xl"
          >
            <span>⬆ TORNA IN CIMA</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="label-lg text-sabbia mb-3">{label}</h4>
      {children}
    </div>
  );
}
