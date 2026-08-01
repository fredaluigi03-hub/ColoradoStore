import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useScrollDirection } from '@/lib/hooks';
import { useCart } from '@/context/CartContext';
import { collections, editorialImages } from '@/lib/shop/mock-data';

const MEGA_MENU: Record<string, { label: string; items: string[] }[]> = {
  uomo: [
    { label: 'Magliette e polo', items: ['Magliette', 'Polo', 'T-shirt'] },
    { label: 'Camicie', items: ['Oxford', 'Lino', 'Flanella'] },
    { label: 'Maglie e felpe', items: ['Cashmere', 'Cardigan', 'Felpa'] },
    { label: 'Pantaloni e jeans', items: ['Jeans', 'Chino', 'Sigaretta'] },
    { label: 'Capispalla', items: ['Giacca', 'Bomber', 'Trench'] },
  ],
  donna: [
    { label: 'Magliette e top', items: ['Top', 'T-shirt', 'Bodysuit'] },
    { label: 'Camicie', items: ['Seta', 'Lino', 'Popeline'] },
    { label: 'Maglie e felpe', items: ['Cashmere', 'Cardigan', 'Felpa'] },
    { label: 'Pantaloni e jeans', items: ['Jeans', 'Palazzo', 'Sigaretta'] },
    { label: 'Capispalla', items: ['Trench', 'Camoscio', 'Bomber'] },
  ],
};

const NAV_LINKS = [
  { label: 'Uomo', to: '/collezioni/uomo', mega: 'uomo' },
  { label: 'Donna', to: '/collezioni/donna', mega: 'donna' },
  { label: "Levi's", to: '/collezioni/levis' },
  { label: 'Streetwear', to: '/collezioni/streetwear' },
  { label: 'Old Money', to: '/collezioni/old-money' },
  { label: 'Sneaker', to: '/collezioni/sneaker' },
  { label: 'Outlet', to: '/collezioni/outlet' },
  { label: 'Chi Siamo', to: '/chi-siamo' },
];

export default function Navbar() {
  const { hidden, scrolled } = useScrollDirection();
  const { cart, openCart } = useCart();
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaImage, setMegaImage] = useState(editorialImages.uomoDept);
  const navigate = useNavigate();
  const location = useLocation();
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(null);
    setSearchOpen(false);
  }, [location.pathname]);

  const searchResults = searchQuery.length > 1
    ? collections.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
          hidden && !mobileOpen && !searchOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
        onMouseLeave={() => {
          setMegaOpen(null);
          if (closeTimer.current) clearTimeout(closeTimer.current);
        }}
      >
        <div
          className={`transition-colors duration-300 ${
            scrolled || megaOpen
              ? 'bg-inchiostro/90 backdrop-blur-md border-b border-carta/10'
              : 'bg-transparent'
          }`}
        >
          <div className="mx-auto max-w-[1600px] px-4 md:px-8">
            <div className="flex h-16 md:h-20 items-center justify-between gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden text-carta"
                onClick={() => setMobileOpen(true)}
                aria-label="Apri menu"
              >
                <Menu size={22} />
              </button>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <span className="display-text text-carta text-xl md:text-2xl tracking-wide2 font-semibold">
                  COLORADO
                </span>
                <span className="hidden md:inline label text-sabbia ml-2">STORE</span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
                {NAV_LINKS.map((link) => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (closeTimer.current) clearTimeout(closeTimer.current);
                      if (link.mega) {
                        setMegaOpen(link.mega);
                        setMegaImage(link.mega === 'uomo' ? editorialImages.uomoDept : editorialImages.donnaDept);
                      } else {
                        setMegaOpen(null);
                      }
                    }}
                  >
                    <Link
                      to={link.to}
                      className={`label-lg text-carta/80 hover:text-carta transition-colors whitespace-nowrap ${
                        location.pathname === link.to ? 'text-carta' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-carta/80 hover:text-carta transition-colors"
                  aria-label="Cerca"
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={openCart}
                  className="text-carta/80 hover:text-carta transition-colors relative"
                  aria-label="Carrello"
                >
                  <ShoppingBag size={20} />
                  {cart.totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rame text-carta text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cart.totalQuantity}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {megaOpen && MEGA_MENU[megaOpen] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden border-t border-carta/10"
              >
                <div className="mx-auto max-w-[1600px] px-8 py-8 flex gap-8">
                  <div className="flex-1 grid grid-cols-5 gap-6">
                    {MEGA_MENU[megaOpen].map((cat) => (
                      <div
                        key={cat.label}
                        onMouseEnter={() =>
                          setMegaImage(
                            megaOpen === 'uomo' ? editorialImages.uomoDept : editorialImages.donnaDept,
                          )
                        }
                      >
                        <h4 className="label-lg text-sabbia mb-3">{cat.label}</h4>
                        <ul className="space-y-2">
                          {cat.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/collezioni/${megaOpen}`}
                                className="text-sm text-carta/70 hover:text-carta transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="w-64 h-48 flex-shrink-0 overflow-hidden rounded-sm">
                    <img
                      src={megaImage}
                      alt="Anteprima reparto"
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: [0.77, 0, 0.18, 1] }}
            className="fixed inset-0 z-[60] bg-inchiostro md:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center h-16 px-4 border-b border-carta/10">
              <span className="display-text text-carta text-xl">COLORADO</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Chiudi menu">
                <X size={22} className="text-carta" />
              </button>
            </div>
            <nav className="flex flex-col p-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="block py-4 text-2xl display-text text-carta border-b border-carta/10"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-inchiostro/95 backdrop-blur-xl flex flex-col items-center pt-24"
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-carta"
              aria-label="Chiudi ricerca"
            >
              <X size={24} />
            </button>
            <div className="w-full max-w-2xl px-4">
              <div className="flex items-center gap-3 border-b border-carta/20 pb-4">
                <Search size={24} className="text-sabbia" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca un capo, una collezione..."
                  className="flex-1 bg-transparent text-carta text-xl md:text-2xl display-text placeholder:text-carta/30 outline-none"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-6 space-y-2">
                  <span className="label text-sabbia">Suggerimenti</span>
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/collezioni/${c.handle}`)}
                      className="block w-full text-left py-2 text-carta/80 hover:text-carta transition-colors"
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
              {!searchQuery && (
                <div className="mt-6">
                  <span className="label text-sabbia">Collezioni in evidenza</span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {collections.slice(0, 6).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => navigate(`/collezioni/${c.handle}`)}
                        className="px-4 py-2 border border-carta/20 rounded-full text-sm text-carta/70 hover:text-carta hover:border-carta/50 transition-all"
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
