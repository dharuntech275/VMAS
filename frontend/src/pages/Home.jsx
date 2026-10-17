import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChefHat, Bike, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/client';
import MenuCard from '../components/MenuCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle('Hot Fresh Rotis & Food Packs');
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getMenu()
      .then((data) => {
        if (isMounted) {
          // Show top 3 or 4 popular items
          setPopularItems(data.slice(0, 4));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to load popular items');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14452F] via-[#0E3523] to-[#0A2217] text-white p-8 sm:p-14 shadow-xl border border-[#1D5E40]">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#F2B705]/20 border border-[#F2B705]/40 text-[#F2B705] text-xs font-bold px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Whole Wheat • Hygienically Made</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Hot rotis at your door,{' '}
            <span className="text-[#F2B705]">ready to eat.</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
            Freshly prepared ready-made food packs of Chapathi, Wheat Parotta, Butter Naan, and Poori.
            Cooked fresh upon your order and delivered in family-friendly portions.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-[#F2B705] hover:bg-[#DCA502] text-[#14452F] font-black text-base px-7 py-3.5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Order now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/track"
              className="inline-flex items-center gap-2 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-700/60 text-white font-bold text-base px-6 py-3.5 rounded-2xl transition-all"
            >
              <span>Track Order</span>
            </Link>
          </div>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F2B705]/15 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* How it works (3 Steps) */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#14452F] dark:text-[#F2B705]">
            Simple & Fast
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            How VMAS Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Three simple steps to enjoy steaming hot bread packs at your dinner table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              icon: ShoppingBag,
              title: 'Choose Your Food Packs',
              desc: 'Select from Chapathi, Wheat Parotta, Naan, or Poori packed in convenient packs of 4 to 6 pieces.',
            },
            {
              step: '02',
              icon: ChefHat,
              title: 'Freshly Prepared on Order',
              desc: 'Our master cooks roll and roast your rotis live in hygienic kitchen batches using 100% whole wheat.',
            },
            {
              step: '03',
              icon: Bike,
              title: 'Hot Doorstep Delivery',
              desc: 'Rushed straight to your home insulated and warm, ready to tear, dip, and eat instantly.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-7 rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-[#14452F] dark:text-[#F2B705] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 dark:text-emerald-900/40">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Items Showcase */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#14452F] dark:text-[#F2B705]">
              Customer Favorites
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              Popular Ready-Made Packs
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top-selling fresh breads ordered by families every day.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-[#14452F] dark:text-[#F2B705] hover:underline"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-slate-100 dark:bg-emerald-950/30 animate-pulse border border-slate-200 dark:border-emerald-900/30"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
