import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowRight, Home, Compass } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('404 Page Not Found');

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/70 text-[#14452F] dark:text-[#F2B705] flex items-center justify-center mx-auto shadow-inner">
          <UtensilsCrossed className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-[#F2B705]">404</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Oops! The food pack or page you were looking for doesn't exist or might have moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#14452F] hover:bg-[#0E3523] text-white font-bold text-sm py-3 px-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705]"
            aria-label="Return to home page"
          >
            <Home className="w-4 h-4 text-[#F2B705]" />
            <span>Go to Home</span>
          </Link>

          <Link
            to="/menu"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F2B705] hover:bg-[#DCA502] text-[#14452F] font-black text-sm py-3 px-4 rounded-xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14452F]"
            aria-label="Explore menu food packs"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
