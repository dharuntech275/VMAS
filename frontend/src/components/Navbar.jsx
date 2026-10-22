import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Menu as MenuIcon, X, UtensilsCrossed, Zap, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { totalItems, totalAmount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Track Order', path: '/track' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#14452F]/95 text-white shadow-lg border-b border-[#1D5E40]/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Identity */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-102"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F2B705] to-[#DCA502] flex items-center justify-center text-[#14452F] shadow-md shadow-[#F2B705]/20 group-hover:rotate-6 transition-transform duration-300">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#14452F] animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#14452F]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#F2B705]">
                  VMAS
                </span>
                <span className="bg-[#F2B705]/20 text-[#F2B705] text-[10px] font-black px-1.5 py-0.5 rounded-md border border-[#F2B705]/30">
                  FOOD PACKS
                </span>
              </div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-200/90 -mt-0.5">
                Fresh • Hot • Ready to Eat
              </span>
            </div>
          </Link>

          {/* Center: Express Delivery Status Pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 bg-[#0E3523]/80 border border-[#1D5E40] px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-100 shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <Zap className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>Hot Delivery in <strong className="text-[#F2B705]">30-45 mins</strong> to your Doorstep</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 bg-[#0E3523]/60 p-1.5 rounded-2xl border border-[#1D5E40]/60">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold transition-all px-4 py-2 rounded-xl relative ${
                  isActive(link.path)
                    ? 'bg-[#1D5E40] text-[#F2B705] shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-[#1D5E40]/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons: Theme toggle & Dynamic Cart */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl bg-[#0E3523] border border-[#1D5E40] hover:bg-[#1D5E40] text-emerald-100 hover:text-[#F2B705] transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              {isDark ? <Sun className="w-5 h-5 text-[#F2B705]" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart Link with Live Counter & Price */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2.5 bg-gradient-to-r from-[#F2B705] to-[#E5AC02] hover:from-[#E5AC02] hover:to-[#DCA502] text-[#14452F] px-4 py-2.5 rounded-2xl font-black text-sm shadow-md shadow-[#F2B705]/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#14452F] text-[#F2B705] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F2B705] shadow-sm">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="font-extrabold tracking-wide hidden sm:inline">
                {totalItems > 0 ? `₹${totalAmount.toFixed(0)}` : 'Cart'}
              </span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#0E3523] border border-[#1D5E40] text-emerald-100 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E3523] border-t border-[#1D5E40] px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                isActive(link.path)
                  ? 'bg-[#1D5E40] text-[#F2B705] shadow-inner'
                  : 'text-emerald-100 hover:bg-[#1D5E40]/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#1D5E40]/80 flex items-center gap-2 text-xs text-emerald-200">
            <Zap className="w-4 h-4 text-[#F2B705]" />
            <span>Hot Delivery in 30-45 mins • 100% Whole Wheat</span>
          </div>
        </div>
      )}
    </header>
  );
}
