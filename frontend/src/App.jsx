import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#FBFBFA] dark:bg-[#0D1612] text-slate-800 dark:text-slate-100 transition-colors duration-200">
              {/* Top Navigation */}
              <Navbar />

              {/* Main Page Content */}
              <main className="flex-1 w-full" id="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/track" element={<TrackOrder />} />
                  {/* 404 Catch-All Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Bottom Footer */}
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
