import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ChefHat,
  Bike,
  ShoppingBag,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Star,
  Flame,
  Clock,
  Heart,
  Award,
  Zap,
} from 'lucide-react';
import api from '../api/client';
import MenuCard from '../components/MenuCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle('Hot Fresh Rotis & Food Packs Delivered');
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getMenu()
      .then((data) => {
        if (isMounted) {
          // Show top 6 items
          setPopularItems(data.slice(0, 6));
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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14452F] via-[#0E3523] to-[#081B12] text-white p-8 sm:p-14 lg:p-16 shadow-2xl border border-[#1D5E40]/80">
        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Top Pill Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-[#F2B705]/20 border border-[#F2B705]/40 text-[#F2B705] text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% WHOLE WHEAT & HEALTHY MILLETS</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5 text-[#F2B705]" />
              <span>FRESHLY COOKED ON ORDER</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]">
            Hot rotis at your door,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2B705] to-[#FFD54F]">
              ready to eat.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
            Skip tedious kneading, rolling, and cooking. Wholesome family packs of Chapathi,
            Wheat & Maida Parotta, Naan, Pooris, and nutritious Herbal rotis — delivered steaming hot to your dinner table.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F2B705] to-[#E5AC02] hover:from-[#E5AC02] hover:to-[#DCA502] text-[#14452F] font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-[#F2B705]/20 hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 group"
            >
              <span>Explore Menu Packs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              to="/track"
              className="inline-flex items-center gap-2.5 bg-[#142A1E]/80 hover:bg-[#1D3B2B] border border-emerald-600/50 text-emerald-100 font-bold text-base px-7 py-4 rounded-2xl transition-all shadow-md"
            >
              <Clock className="w-5 h-5 text-[#F2B705]" />
              <span>Track Live Order</span>
            </Link>
          </div>

          {/* Live Trust Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-800/60 max-w-lg">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#F2B705]">10,000+</div>
              <div className="text-xs text-emerald-200 font-medium">Packs Delivered</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1">
                4.9 <Star className="w-5 h-5 fill-[#F2B705] text-[#F2B705]" />
              </div>
              <div className="text-xs text-emerald-200 font-medium">Customer Rating</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#F2B705]">30 mins</div>
              <div className="text-xs text-emerald-200 font-medium">Average Delivery</div>
            </div>
          </div>
        </div>

        {/* Ambient Decorative Glowing Blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#F2B705]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Quick Category Navigation Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#14452F] dark:text-[#F2B705]">
              Fresh Choices
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Popular Bread Categories
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-xs font-bold text-[#14452F] dark:text-[#F2B705] hover:underline flex items-center gap-1"
          >
            <span>View All (10)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              title: 'Wheat & Rotis',
              desc: 'Chapathi & Soft Phulkas',
              badge: 'From ₹90',
              icon: '🌾',
              filter: 'chapathi',
            },
            {
              title: 'Layered Parottas',
              desc: 'Wheat & Classic Maida',
              badge: 'From ₹160',
              icon: '🥞',
              filter: 'parotta',
            },
            {
              title: 'Naan & Bhatura',
              desc: 'Tandoori Naan & Chola Poori',
              badge: 'From ₹110',
              icon: '🫓',
              filter: 'naan',
            },
            {
              title: 'Herbal & Millets',
              desc: 'Ragi, Bajra, Keerai & Methi',
              badge: 'From ₹110',
              icon: '🌿',
              filter: 'keerai',
            },
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/menu?q=${cat.filter}`}
              className="p-5 rounded-2xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-[11px] font-black text-[#14452F] dark:text-[#F2B705] bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                  {cat.badge}
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-[#14452F] dark:group-hover:text-[#F2B705] transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Super Saver Promotional Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 bg-black/20 text-white text-xs font-black px-3 py-1 rounded-full backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>SPECIAL OFFER FOR TODAY</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Use code <span className="underline decoration-wavy decoration-white">VMASNEW</span> at Checkout
          </h3>
          <p className="text-sm sm:text-base text-amber-100 font-medium">
            Get instant ₹30 discount on orders above ₹250 • Hot insulated delivery directly to your door!
          </p>
        </div>
        <Link
          to="/menu"
          className="z-10 whitespace-nowrap bg-white hover:bg-slate-100 text-[#14452F] font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-105"
        >
          Order Fresh Packs
        </Link>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 pointer-events-none" />
      </section>

      {/* Popular Bestseller Food Packs Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#14452F] dark:text-[#F2B705]">
              Customer Favorites
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              Popular Ready-Made Food Packs
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Cooked fresh on order in standard family packs of 10 to 15 pieces.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-black text-[#14452F] dark:text-[#F2B705] hover:underline"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-slate-100 dark:bg-emerald-950/20 animate-pulse border border-slate-200 dark:border-emerald-900/30"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center space-y-3 max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
            <p className="text-sm text-amber-800 dark:text-amber-200 font-semibold">{error}</p>
          </div>
        )}

        {/* Popular Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* How it Works / The VMAS Advantage */}
      <section className="space-y-10 py-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#14452F] dark:text-[#F2B705]">
            Hygienic • Wholesome • Reliable
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Why Families Love VMAS
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We preserve traditional tawa cooking while eliminating dinner preparation stress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ChefHat,
              title: 'Live Tawa Cooking',
              desc: 'Never frozen or re-heated. Every single roti is cooked freshly on order by expert masters.',
              badge: 'Authentic Taste',
            },
            {
              icon: ShieldCheck,
              title: '100% Wholesome Grains',
              desc: 'Finest quality whole wheat, finger millet (ragi), pearl millet (bajra), and authentic herbs.',
              badge: 'Zero Chemicals',
            },
            {
              icon: Bike,
              title: 'Thermal Insulation Pack',
              desc: 'Packed hot in multi-layer food-grade insulated packs to retain temperature and moisture.',
              badge: 'Steaming Hot',
            },
            {
              icon: Award,
              title: 'Economical Family Sizes',
              desc: 'Convenient 10, 12, and 15-piece packs priced fairly for families and dinner gatherings.',
              badge: 'Best Value',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-[#14452F] dark:text-[#F2B705] flex items-center justify-center shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real Customer Feedback Reviews */}
      <section className="space-y-8 rounded-3xl bg-slate-50 dark:bg-[#0E1B15] p-8 sm:p-12 border border-slate-200/80 dark:border-emerald-900/40">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#14452F] dark:text-[#F2B705]">
            Customer Testimonials
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Loved by Hundreds of Homes
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            See what our regular customers say about our hot food packs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'VMAS has completely changed our dinner routine! The chapathis are so soft, just like my mom makes at home. Saves us an hour every evening.',
              author: 'Priya K.',
              role: 'Working Professional, Chennai',
              stars: 5,
            },
            {
              quote: 'The wheat parotta is super layered and crispy, and not oily at all. Their Mudakathan keerai chapathi is fantastic for health. Highly recommended!',
              author: 'Anand Ramachandran',
              role: 'Fitness Enthusiast',
              stars: 5,
            },
            {
              quote: 'Ordered 3 packs of Plain Naan and Chola Poori for our family weekend get-together. They arrived hot in 35 mins. Everyone was amazed!',
              author: 'Deepika S.',
              role: 'Homemaker',
              stars: 5,
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.stars)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-[#F2B705] text-[#F2B705]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                  "{rev.quote}"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/40">
                <div className="font-black text-sm text-slate-900 dark:text-white">{rev.author}</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">{rev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
