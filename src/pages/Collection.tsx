import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, Grid2x2, Grid3x3 } from 'lucide-react';
import { getProducts, getCollection } from '@/lib/shop';
import type { Product, CollectionFilter } from '@/lib/shop/types';
import ProductCard from '@/components/ProductCard';

const SORT_OPTIONS = [
  { value: 'raccomandati', label: 'Raccomandati' },
  { value: 'prezzo-asc', label: 'Prezzo: crescente' },
  { value: 'prezzo-desc', label: 'Prezzo: decrescente' },
  { value: 'novita', label: 'Novità' },
];

const PRODUCT_TYPES = ['Camicie', 'Capispalla', 'Magliette e polo', 'Maglie e felpe', 'Pantaloni e jeans', 'Sneaker'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '40', '41', '42', '43', '44', '45'];
const COLORS = ['Bianco', 'Blu', 'Beige', 'Sabbia', 'Crema', 'Navy', 'Rosso', 'Marrone'];
const BRANDS = ["Levi's", 'Colorado'];

export default function CollectionPage() {
  const { handle } = useParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [collectionTitle, setCollectionTitle] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [filter, setFilter] = useState<CollectionFilter>({ linea: 'all' });
  const [sort, setSort] = useState('raccomandati');
  const [columns, setColumns] = useState(4);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    getProducts().then(setAllProducts);
    if (handle) {
      getCollection(handle).then((c) => {
        if (c) {
          setCollectionTitle(c.title);
          setCollectionDesc(c.description);
        }
      });
    }
  }, [handle]);

  // Determina la linea dal handle della collezione
  useEffect(() => {
    if (handle === 'streetwear') setFilter((f) => ({ ...f, linea: 'streetwear' }));
    else if (handle === 'old-money') setFilter((f) => ({ ...f, linea: 'old-money' }));
    else setFilter((f) => ({ ...f, linea: 'all' }));
  }, [handle]);

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Filter by collection handle
    if (handle && handle !== 'streetwear' && handle !== 'old-money' && handle !== 'outlet') {
      if (handle === 'uomo') result = result.filter((p) => p.tags.includes('uomo'));
      else if (handle === 'donna') result = result.filter((p) => p.tags.includes('donna'));
      else if (handle === 'sneaker') result = result.filter((p) => p.tags.includes('sneaker'));
      else if (handle === 'levis') result = result.filter((p) => p.tags.includes('levis'));
      else if (handle === 'nuovi-arrivi') result = result.filter((p) => p.tags.includes('nuovo'));
      else if (handle === 'best-seller') result = result.filter((p) => p.tags.includes('best-seller'));
    }

    // Apply filters
    if (filter.linea && filter.linea !== 'all') result = result.filter((p) => p.tagsLine.includes(filter.linea as 'streetwear' | 'old-money'));
    if (filter.outlet) result = result.filter((p) => p.tags.includes('outlet'));
    if (filter.productType) result = result.filter((p) => p.productType === filter.productType);
    if (filter.brand) result = result.filter((p) => p.vendor === filter.brand);
    if (filter.taglia) result = result.filter((p) => p.options.some((o) => o.name === 'Taglia' && o.values.includes(filter.taglia!)));
    if (filter.colore) result = result.filter((p) => p.options.some((o) => o.name === 'Colore' && o.values.some((v) => v.toLowerCase().includes(filter.colore!.toLowerCase()))));
    if (filter.prezzoMax) result = result.filter((p) => parseFloat(p.priceRange.minVariantPrice.amount) <= filter.prezzoMax!);

    // Sort
    if (sort === 'prezzo-asc') result = [...result].sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    else if (sort === 'prezzo-desc') result = [...result].sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    else if (sort === 'novita') result = [...result].sort((a, b) => (b.tags.includes('nuovo') ? 1 : 0) - (a.tags.includes('nuovo') ? 1 : 0));

    return result;
  }, [allProducts, handle, filter, sort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const activeFilters: { key: string; label: string }[] = [];
  if (filter.productType) activeFilters.push({ key: 'productType', label: filter.productType });
  if (filter.taglia) activeFilters.push({ key: 'taglia', label: `Taglia: ${filter.taglia}` });
  if (filter.colore) activeFilters.push({ key: 'colore', label: `Colore: ${filter.colore}` });
  if (filter.brand) activeFilters.push({ key: 'brand', label: filter.brand });
  if (filter.prezzoMax) activeFilters.push({ key: 'prezzoMax', label: `Fino a ${filter.prezzoMax}€` });
  if (filter.linea && filter.linea !== 'all') activeFilters.push({ key: 'linea', label: filter.linea === 'streetwear' ? 'Streetwear' : 'Old Money' });

  const clearFilter = (key: string) => setFilter((f) => {
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
          <em>{collectionTitle || 'Catalogo'}</em>
        </h1>
        {collectionDesc && <p className="text-carta/60 mt-4 max-w-xl text-sm">{collectionDesc}</p>}
      </div>

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
            <FilterGroup label="Categoria">
              {PRODUCT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter((f) => ({ ...f, productType: f.productType === t ? undefined : t }))}
                  className={`block text-sm py-1 ${filter.productType === t ? 'text-sabbia' : 'text-carta/60 hover:text-carta'}`}
                >
                  {t}
                </button>
              ))}
            </FilterGroup>
            <FilterGroup label="Taglia">
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((s) => (
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
            <FilterGroup label="Colore">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter((f) => ({ ...f, colore: f.colore === c ? undefined : c }))}
                  className={`block text-sm py-1 ${filter.colore === c ? 'text-sabbia' : 'text-carta/60 hover:text-carta'}`}
                >
                  {c}
                </button>
              ))}
            </FilterGroup>
            <FilterGroup label="Prezzo">
              <input
                type="range"
                min={30}
                max={300}
                step={10}
                value={filter.prezzoMax || 300}
                onChange={(e) => setFilter((f) => ({ ...f, prezzoMax: parseInt(e.target.value) }))}
                className="w-full accent-sabbia"
              />
              <p className="text-sm text-carta/60 mt-2">Fino a {filter.prezzoMax || 300}€</p>
            </FilterGroup>
            <FilterGroup label="Brand">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setFilter((f) => ({ ...f, brand: f.brand === b ? undefined : b }))}
                  className={`block text-sm py-1 ${filter.brand === b ? 'text-sabbia' : 'text-carta/60 hover:text-carta'}`}
                >
                  {b}
                </button>
              ))}
            </FilterGroup>
            <FilterGroup label="Linea">
              {['streetwear', 'old-money'].map((l) => (
                <button
                  key={l}
                  onClick={() => setFilter((f) => ({ ...f, linea: f.linea === l ? 'all' : l as 'streetwear' | 'old-money' }))}
                  className={`block text-sm py-1 capitalize ${filter.linea === l ? 'text-sabbia' : 'text-carta/60 hover:text-carta'}`}
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
              onClick={() => setVisibleCount((c) => c + 8)}
              className="px-8 py-4 border border-carta/30 label text-carta hover:bg-carta/10 transition-colors"
            >
              Carica altri
            </button>
          </div>
        )}
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
