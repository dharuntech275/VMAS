import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Cart() {
  useDocumentTitle('Your Cart - VMAS Food Packs');
  const { cart, totalItems, totalAmount, clearCart } = useCart();

  // Promo code state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  // Tip state
  const [selectedTip, setSelectedTip] = useState(0);

  // Special instructions
  const [cookingNotes, setCookingNotes] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (code === 'VMASNEW' || code === 'FIRST30') {
      if (totalAmount < 200) {
        setCouponError('Coupon is valid only on orders above ₹200.');
        return;
      }
      setAppliedCoupon({ code, discount: 30 });
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try "VMASNEW" for ₹30 off!');
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPayable = Math.max(0, totalAmount - discountAmount + selectedTip);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-900/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Your Cart</h1>
            <span className="bg-[#14452F] text-[#F2B705] text-xs font-black px-2.5 py-0.5 rounded-full">
              {totalItems} {totalItems === 1 ? 'pack' : 'packs'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fresh ready-to-cook food packets. Simply roast or fry on your home tawa in 1 minute!
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Cart</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 space-y-6 shadow-sm max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/70 text-[#14452F] dark:text-[#F2B705] flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Your Food Cart is Empty
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Authentic chapathis, parottas, and naan packs are freshly waiting for you!
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#14452F] to-[#0E3523] hover:from-[#0E3523] hover:to-[#0A2217] text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <span>Explore Menu Packs</span>
            <ArrowRight className="w-5 h-5 text-[#F2B705]" />
          </Link>
        </div>
      ) : (
        /* Modern 2-Column Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Cart Items + Extra Preferences (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items List */}
            <div className="space-y-3.5">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Special Cooking Instructions Box */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                <MessageSquare className="w-4 h-4 text-[#14452F] dark:text-[#F2B705]" />
                <span>Cooking / Packaging Instructions (Optional)</span>
              </div>
              <textarea
                value={cookingNotes}
                onChange={(e) => setCookingNotes(e.target.value)}
                placeholder="e.g. Please make chapathis extra soft, less oil for elder person..."
                rows={2}
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 dark:border-emerald-900/60 bg-slate-50 dark:bg-[#0B1410] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705] resize-none"
              />
            </div>

            {/* Delivery Partner Tip Selector */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                  <HeartHandshake className="w-4 h-4 text-[#F2B705]" />
                  <span>Tip your Delivery Partner</span>
                </div>
                {selectedTip > 0 && (
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    +₹{selectedTip} added
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% of this tip goes straight to your hard-working delivery partner.
              </p>
              <div className="flex items-center gap-2.5">
                {[0, 10, 20, 30, 50].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setSelectedTip(tip)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedTip === tip
                        ? 'bg-[#14452F] text-[#F2B705] shadow-sm'
                        : 'bg-slate-100 dark:bg-[#0B1410] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-emerald-950/60'
                    }`}
                  >
                    {tip === 0 ? 'No Tip' : `₹${tip}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Thermal Packaging & Hygiene Pledge Seal */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#14452F] dark:text-[#F2B705] flex-shrink-0" />
              <div className="text-xs leading-relaxed text-emerald-900 dark:text-emerald-200 font-medium">
                <strong>VMAS Freshness Seal Guarantee:</strong> Food packets are hygienically packed into food-grade sealed pouches to preserve authentic softness and moisture. Simply toast or fry on your home tawa!
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Bill Breakdown Card */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Promo Code Input Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                <Tag className="w-4 h-4 text-[#F2B705]" />
                <span>Apply Coupon Code</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-black text-emerald-800 dark:text-emerald-300">
                      '{appliedCoupon.code}' applied (-₹{appliedCoupon.discount})
                    </span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Try 'VMASNEW'"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full text-xs uppercase font-bold p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-slate-50 dark:bg-[#0B1410] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]"
                    />
                    <button
                      type="submit"
                      className="bg-[#14452F] hover:bg-[#0E3523] text-[#F2B705] font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-semibold">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Bill Summary Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-emerald-900/40 pb-3">
                Bill Summary
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>Item Total ({totalItems} packs)</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}

                {selectedTip > 0 && (
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Delivery Partner Tip</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{selectedTip.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1">
                    <span>Delivery Fee</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-black px-1.5 py-0.5 rounded">
                      FREE
                    </span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase text-xs">
                    ₹0.00
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="border-t border-dashed border-slate-200 dark:border-emerald-900/60 pt-3 flex justify-between items-center text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                <div>
                  <span>To Pay</span>
                  <div className="text-[11px] font-normal text-slate-400">
                    Incl. all taxes & fresh packing
                  </div>
                </div>
                <span className="text-2xl text-[#14452F] dark:text-[#F2B705]">
                  ₹{finalPayable.toFixed(2)}
                </span>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2 space-y-2">
                <Link
                  to="/checkout"
                  state={{
                    discount: discountAmount,
                    tip: selectedTip,
                    couponCode: appliedCoupon?.code,
                    cookingNotes,
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F2B705] to-[#E5AC02] hover:from-[#E5AC02] hover:to-[#DCA502] text-[#14452F] font-black text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#F2B705]/20 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </Link>

                <Link
                  to="/menu"
                  className="w-full py-2.5 text-center block text-xs font-bold text-[#14452F] dark:text-emerald-300 hover:underline"
                >
                  + Add more food packs
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
