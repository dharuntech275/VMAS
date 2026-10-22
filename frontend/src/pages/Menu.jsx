import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Search,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  Flame,
  Wheat,
  Layers,
  CircleDot,
  Leaf,
} from 'lucide-react';
import api from '../api/client';
import MenuCard from '../components/MenuCard';
import { useCart } from '../context/CartContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Menu() {
  useDocumentTitle('Ready-to-Cook Food Packets - VMAS');
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');

  const { totalItems, totalAmount } = useCart();

  const fetchMenu = () => {
    setLoading(true);
    setError(null);
    api
      .getMenu()
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load menu. Please check your connection.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (searchParams.get('q')) {
      setSearchTerm(searchParams.get('q'));
    }
  }, [searchParams]);

  // Categories definition with clean Lucide SVG icons (no broken emojis)
  const categories = [
    { id: 'ALL', label: 'All Packets', icon: ShoppingBag },
    { id: 'ROTI', label: 'Chapathi & Rotis', icon: Wheat },
    { id: 'PAROTTA', label: 'Layered Parottas', icon: Layers },
    { id: 'POORI_NAAN', label: 'Naan & Pooris', icon: CircleDot },
    { id: 'HERBAL', label: 'Herbal & Millets', icon: Leaf },
  ];

  // Filter & Sort Logic
  const processedItems = useMemo(() => {
    let result = [...menuItems];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.pack_size.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter((item) => {
        const name = item.name.toLowerCase();
        if (selectedCategory === 'ROTI') {
          return name.includes('chapathi');
        }
        if (selectedCategory === 'PAROTTA') {
          return name.includes('parotta');
        }
        if (selectedCategory === 'POORI_NAAN') {
          return name.includes('poori') || name.includes('naan');
        }
        if (selectedCategory === 'HERBAL') {
          return (
            name.includes('keerai') ||
            name.includes('methi') ||
            name.includes('ragi') ||
            name.includes('bajra')
          );
        }
        return true;
      });
    }

    if (sortBy === 'PRICE_LOW') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'PRICE_HIGH') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'PACK_SIZE') {
      result.sort((a, b) => {
        const numA = parseInt(a.pack_size.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.pack_size.replace(/\D/g, '')) || 0;
        return numB - numA;
      });
    }

    return result;
  }, [menuItems, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-emerald-900/50 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black px-3 py-1 rounded-full mb-1">
            <Flame className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>READY-TO-COOK PACKETS • TOAST ON TAWA AT HOME</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Ready-Made Food Packets
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hygienically sealed packets of 10, 12, and 15 pieces. Order packets, roast on your home tawa, and eat hot!
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search chapathi, naan, parotta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-[#121F19] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705] shadow-sm transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchParams({});
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Sort Controls (Pure SVG icons) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-[#14452F] text-[#F2B705] shadow-md shadow-[#14452F]/20'
                    : 'bg-white dark:bg-[#121F19] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-900/50 hover:bg-slate-50 dark:hover:bg-emerald-950/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs sm:text-sm font-bold bg-white dark:bg-[#121F19] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705] cursor-pointer"
          >
            <option value="DEFAULT">Sort by: Featured</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="PACK_SIZE">Pack Size (Pieces)</option>
          </select>
        </div>
      </div>

      {/* Item Counter / Filter Status */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
        <span>Showing {processedItems.length} ready-made bread packets</span>
        {searchTerm && (
          <span className="text-[#14452F] dark:text-[#F2B705]">
            Filtered by: "{searchTerm}"
          </span>
        )}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-3xl bg-slate-100 dark:bg-emerald-950/20 animate-pulse border border-slate-200 dark:border-emerald-900/30"
            />
          ))}
        </div>
      )}

      {/* Error State with Retry */}
      {!loading && error && (
        <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            Couldn't load food packets
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-300">{error}</p>
          <button
            onClick={fetchMenu}
            className="inline-flex items-center gap-2 bg-[#14452F] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0E3523] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Menu Grid */}
      {!loading && !error && (
        <>
          {processedItems.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 text-slate-500 space-y-4 shadow-sm">
              <span className="text-4xl block">🔍</span>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  No packets match your filter
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching for Chapathi, Parotta, Naan, or Poori
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                  setSearchParams({});
                }}
                className="inline-block bg-[#14452F] text-[#F2B705] font-black text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-[#0E3523] cursor-pointer transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Floating Sticky Cart Indicator if items exist */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg">
          <Link
            to="/cart"
            className="flex items-center justify-between bg-gradient-to-r from-[#14452F] to-[#0E3523] text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-[#F2B705]/60 hover:shadow-[#F2B705]/15 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#F2B705] text-[#14452F] flex items-center justify-center font-black text-base shadow-md">
                {totalItems}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider">
                    {totalItems} {totalItems === 1 ? 'Packet' : 'Packets'} in Cart
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                </div>
                <div className="font-black text-xl text-[#F2B705] leading-none mt-0.5">
                  ₹{totalAmount.toFixed(0)}
                  <span className="text-xs text-emerald-300 font-semibold ml-1.5">
                    • Free Delivery
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F2B705] text-[#14452F] px-4 py-2 rounded-2xl font-black text-sm group-hover:bg-[#E5AC02] transition-colors shadow-sm">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
