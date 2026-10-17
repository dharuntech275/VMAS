import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-[#14211B] rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
      {/* Item Image & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-16 h-16 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 overflow-hidden flex-shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-emerald-700">
              Food
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
            {item.name}
          </h4>
          <span className="inline-block text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md mt-0.5">
            {item.pack_size}
          </span>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ₹{item.price} each
          </div>
        </div>
      </div>

      {/* Quantity & Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#FBFBFA] dark:bg-[#0B1510] border border-slate-200 dark:border-emerald-900/60 rounded-xl p-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-emerald-900 text-slate-700 dark:text-slate-200 cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-bold text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= 20}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-emerald-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[70px]">
          <div className="font-black text-base text-[#14452F] dark:text-[#F2B705]">
            ₹{(item.price * item.quantity).toFixed(0)}
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 justify-end ml-auto mt-0.5 cursor-pointer"
            title="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
