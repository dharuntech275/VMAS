import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-[#121F19] rounded-3xl border border-slate-200/80 dark:border-emerald-900/40 shadow-sm hover:shadow-md transition-all">
      {/* Item Image & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 overflow-hidden flex-shrink-0 shadow-inner">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-emerald-700 font-bold">
              Food Pack
            </div>
          )}
          {/* Pure Veg Badge */}
          <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white rounded-md flex items-center justify-center shadow p-0.5">
            <div className="w-full h-full border border-emerald-600 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-white truncate leading-tight">
            {item.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block text-[11px] font-black text-[#14452F] dark:text-[#F2B705] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-md">
              {item.pack_size}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ₹{Number(item.price).toFixed(0)} / pack
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Controls */}
      <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0B1410] border border-slate-200 dark:border-emerald-900/60 rounded-2xl p-1 shadow-inner">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-[#16261F] hover:bg-slate-200 dark:hover:bg-emerald-900 text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm active:scale-95 transition-all"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
          <span className="w-7 text-center text-sm font-black text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= 20}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#14452F] text-[#F2B705] hover:bg-[#0E3523] disabled:opacity-40 shadow-sm cursor-pointer active:scale-95 transition-all"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Subtotal & Delete */}
        <div className="text-right min-w-[75px]">
          <div className="font-black text-lg text-[#14452F] dark:text-[#F2B705] leading-tight">
            ₹{(item.price * item.quantity).toFixed(0)}
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-[11px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 justify-end ml-auto mt-1 cursor-pointer transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
