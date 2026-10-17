import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Menu as MenuIcon, X, UtensilsCrossed, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { totalItems } = useCart();
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
    <header className="sticky top-0 z-50 bg-[#14452F] text-white shadow-md border-b border-[#1D5E40]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F2B705] flex items-center justify-center text-[#14452F] shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-lg font-black tracking-wider text-[#F2B705]">
                VMAS
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-emerald-200">
                Fresh Food Packs
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                  isActive(link.path)
                    ? 'bg-[#1D5E40] text-[#F2B705] font-semibold'
                    : 'text-emerald-100 hover:text-white hover:bg-[#1D5E40]/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons: Theme toggle & Cart */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl bg-[#1D5E40]/70 hover:bg-[#1D5E40] text-emerald-100 hover:text-[#F2B705] transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-[#F2B705] hover:bg-[#DCA502] text-[#14452F] px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="bg-[#14452F] text-[#F2B705] text-xs font-black px-2 py-0.5 rounded-full min-w-5 text-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#1D5E40] text-emerald-100 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E3523] border-t border-[#1D5E40] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-[#14452F] text-[#F2B705] font-semibold'
                  : 'text-emerald-100 hover:bg-[#14452F] hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#F2B705] hover:bg-[#14452F]"
          >
            My Cart ({totalItems} items)
          </Link>
        </div>
      )}
    </header>
  );
}
