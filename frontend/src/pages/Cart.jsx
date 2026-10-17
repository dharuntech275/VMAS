import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Cart() {
  useDocumentTitle('Your Cart');
  const { cart, totalItems, totalAmount, clearCart } = useCart();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-900/50 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Your Cart</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {totalItems} {totalItems === 1 ? 'pack' : 'packs'} ready for order
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-[#14452F] dark:text-[#F2B705] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Your Cart is Empty
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Ready-made chapathis, naans, and parottas are waiting for you!
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-[#14452F] hover:bg-[#0E3523] text-white font-black text-base px-7 py-3.5 rounded-2xl shadow-md transition-all"
          >
            <span>Menu-ku po</span>
            <ArrowRight className="w-5 h-5 text-[#F2B705]" />
          </Link>
        </div>
      ) : (
        /* Cart With Items */
        <div className="space-y-6">
          {/* Item List */}
          <div className="space-y-3">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Bill Summary Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-emerald-900/40 pb-3">
              Bill Details
            </h3>

            <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
              <span>Item Total ({totalItems} packs)</span>
              <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
              <span>Delivery Charges</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide">
                Free Delivery
              </span>
            </div>

            <div className="border-t border-dashed border-slate-200 dark:border-emerald-900/60 pt-3 flex justify-between items-center text-lg font-black text-slate-900 dark:text-white">
              <span>Grand Total</span>
              <span className="text-[#14452F] dark:text-[#F2B705]">₹{totalAmount.toFixed(2)}</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/menu"
                className="w-full sm:w-1/3 py-3.5 px-4 rounded-xl border border-[#14452F]/30 dark:border-[#1D5E40] text-[#14452F] dark:text-emerald-200 font-bold text-sm text-center hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                + Add More Items
              </Link>

              <Link
                to="/checkout"
                className="w-full sm:w-2/3 py-3.5 px-6 rounded-xl bg-[#F2B705] hover:bg-[#DCA502] text-[#14452F] font-black text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Hygienic Preparation • Freshly Packed • Safe Delivery</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
