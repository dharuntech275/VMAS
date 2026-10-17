import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, AlertCircle, RefreshCw, Search, ArrowRight } from 'lucide-react';
import api from '../api/client';
import MenuCard from '../components/MenuCard';
import { useCart } from '../context/CartContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Menu() {
  useDocumentTitle('Our Menu Packs');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pack_size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-emerald-900/50 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#14452F] dark:text-[#F2B705]">
            Fresh Ready-Made Food Packs
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Our Menu Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Every item is packed in family portions of 4 to 6 pieces.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search chapathi, naan, poori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-[#14211B] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-slate-100 dark:bg-emerald-950/20 animate-pulse border border-slate-200 dark:border-emerald-900/30"
            />
          ))}
        </div>
      )}

      {/* Error State with Retry */}
      {!loading && error && (
        <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            Couldn't load menu
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
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 text-slate-500">
              <p className="text-base font-bold">No food packs match "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-sm text-[#14452F] dark:text-[#F2B705] font-semibold underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
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
            className="flex items-center justify-between bg-[#14452F] text-white p-4 rounded-2xl shadow-2xl border border-[#F2B705]/40 hover:bg-[#0E3523] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2B705] text-[#14452F] flex items-center justify-center font-black">
                {totalItems}
              </div>
              <div>
                <span className="text-xs text-emerald-200 uppercase font-semibold">
                  Items in Cart
                </span>
                <div className="font-bold text-base text-[#F2B705]">
                  ₹{totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-black text-sm">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4 text-[#F2B705]" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
