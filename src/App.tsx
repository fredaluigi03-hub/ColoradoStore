import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';
import PageTransition from '@/components/PageTransition';
import ScrollToTop from '@/components/ScrollToTop';
import CookieBanner from '@/components/CookieBanner';
import Home from '@/pages/Home';
import CollectionPage from '@/pages/Collection';
import ProductPage from '@/pages/Product';
import CheckoutPage from '@/pages/Checkout';
import AboutPage from '@/pages/About';
import NotFoundPage from '@/pages/NotFound';
import StorePage from '@/pages/Store';
import ContactPage from '@/pages/Contact';
import { PrivacyPage, CookiePolicyPage, TermsPage, WithdrawalPage, ShippingPage } from '@/pages/legal';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Preloader />
        <CustomCursor />
        <PageTransition />
        <Navbar />
        <CartDrawer />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Handle vecchi rimasti in link e segnalibri — prima della rotta
                generica, altrimenti non verrebbero mai raggiunti. */}
            <Route path="/collezioni/sneaker" element={<Navigate to="/collezioni/sneakers" replace />} />
            <Route path="/collezioni/nuovi-arrivi" element={<Navigate to="/collezioni/new-collection" replace />} />
            <Route path="/collezioni/best-seller" element={<Navigate to="/collezioni/best-sellers" replace />} />
            <Route path="/collezioni/:handle" element={<CollectionPage />} />
            <Route path="/prodotti/:handle" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/chi-siamo" element={<AboutPage />} />
            <Route path="/negozio" element={<StorePage />} />
            <Route path="/contatti" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/condizioni-di-vendita" element={<TermsPage />} />
            <Route path="/diritto-di-recesso" element={<WithdrawalPage />} />
            <Route path="/spedizioni-e-resi" element={<ShippingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </CartProvider>
    </BrowserRouter>
  );
}
