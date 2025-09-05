import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductGrid } from './components/ProductGrid';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { Footer } from './components/Footer';

function HomePage() {
  return (
    <>
      <section id="home">
        <HeroCarousel />
      </section>
      <section id="products">
        <ProductGrid />
      </section>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;