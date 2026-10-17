import React from 'react';
import { Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function MenuCard({ item }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { showToast } = useToast();
  const cartItem = cart.find((i) => i.id === item.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleInitialAdd = () => {
    addToCart(item, 1);
    showToast(`Added ${item.name} (${item.pack_size}) to cart!`, 'success');
  };

  return (
    <div className="group bg-white dark:bg-[#14211B] rounded-2xl overflow-hidden border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Item Image with pack size badge */}
        <div className="relative h-48 w-full bg-emerald-50 dark:bg-emerald-950/40 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={`${item.name} ${item.pack_size}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium text-sm">
              Fresh Food Pack
            </div>
          )}

          {/* Pack Size Badge */}
          <span className="absolute top-3 right-3 bg-[#F2B705] text-[#14452F] text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
            {item.pack_size}
          </span>
        </div>

        {/* Content details */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
              {item.name}
            </h3>
            <span className="font-black text-lg text-[#14452F] dark:text-[#F2B705] whitespace-nowrap">
              ₹{Number(item.price).toFixed(0)}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description || 'Freshly made hygienic food pack, ready to heat & eat.'}
          </p>
        </div>
      </div>

      {/* Action Stepper / Add button */}
      <div className="p-4 pt-0">
        {inCartQty > 0 ? (
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/80 border border-[#14452F]/30 dark:border-[#1D5E40] rounded-xl p-1">
            <button
              onClick={() => updateQuantity(item.id, inCartQty - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#14211B] text-[#14452F] dark:text-[#F2B705] hover:bg-slate-100 dark:hover:bg-emerald-900 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705]"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-black text-sm text-[#14452F] dark:text-[#F2B705]">
              {inCartQty} in cart
            </span>
            <button
              onClick={() => updateQuantity(item.id, inCartQty + 1)}
              disabled={inCartQty >= 20}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#14452F] text-white hover:bg-[#0E3523] disabled:opacity-40 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705]"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleInitialAdd}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-[#14452F] hover:bg-[#0E3523] text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B705]"
            aria-label={`Add ${item.name} (${item.pack_size}) to cart for Rs. ${item.price}`}
          >
            <Plus className="w-4 h-4 text-[#F2B705]" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}
