import React from 'react';
import { Plus, Minus, Star, Flame, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function MenuCard({ item }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { showToast } = useToast();
  const cartItem = cart.find((i) => i.id === item.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleInitialAdd = () => {
    addToCart(item, 1);
    showToast(`Added ${item.name} (${item.pack_size}) to your cart!`, 'success');
  };

  // Compute a realistic crossed-out MRP price (approx 20% higher) to highlight savings
  const itemPrice = Number(item.price);
  const mrpPrice = Math.round((itemPrice * 1.25) / 5) * 5;

  return (
    <div className="group bg-white dark:bg-[#121F19] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-emerald-900/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Item Image Container with Badges */}
        <div className="relative aspect-[16/11] w-full bg-slate-100 dark:bg-emerald-950/40 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={`${item.name} ${item.pack_size}`}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              Fresh Food Pack
            </div>
          )}

          {/* Gradient Overlay for Bottom Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Top Left: Pure Veg Badge & Pack Size Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {/* Pure Veg Badge */}
            <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-md p-0.5" title="100% Vegetarian">
              <div className="w-full h-full border border-emerald-600 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
            </div>

            {/* Pack Size Pill */}
            <span className="bg-[#14452F]/90 backdrop-blur-md text-[#F2B705] text-[11px] font-black px-2.5 py-1 rounded-full shadow-md border border-[#F2B705]/40 tracking-wide">
              {item.pack_size}
            </span>
          </div>

          {/* Top Right: Rating Pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-[#0E3523]/90 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-black text-slate-800 dark:text-emerald-200 shadow-md">
            <Star className="w-3.5 h-3.5 fill-[#F2B705] text-[#F2B705]" />
            <span>4.9</span>
          </div>

          {/* Bottom Left Badge: Freshness guarantee tag */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-bold text-emerald-200 drop-shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#F2B705]" />
            <span>Ready to Cook • 1 Min Tawa Toast</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-[#14452F] dark:group-hover:text-[#F2B705] transition-colors">
                {item.name}
              </h3>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                100% Wholesome Ingredients
              </span>
            </div>

            {/* Pricing Section */}
            <div className="text-right flex-shrink-0">
              <div className="font-black text-xl text-[#14452F] dark:text-[#F2B705] leading-tight">
                ₹{itemPrice.toFixed(0)}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 line-through">
                ₹{mrpPrice}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description || 'Hygienically sealed ready-to-cook bread packet. Simply roast on your hot tawa or fry at home in 1 minute.'}
          </p>
        </div>
      </div>

      {/* Action Footer: Modern Add Button / Stepper */}
      <div className="p-5 pt-0">
        {inCartQty > 0 ? (
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/70 border border-[#14452F]/40 dark:border-emerald-700/60 rounded-2xl p-1.5 shadow-inner">
            <button
              onClick={() => updateQuantity(item.id, inCartQty - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-[#16261F] text-[#14452F] dark:text-[#F2B705] hover:bg-slate-100 dark:hover:bg-emerald-900 shadow-sm cursor-pointer transition-transform active:scale-90"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="text-center px-2">
              <span className="block font-black text-base text-[#14452F] dark:text-[#F2B705] leading-none">
                {inCartQty}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                in cart
              </span>
            </div>
            <button
              onClick={() => updateQuantity(item.id, inCartQty + 1)}
              disabled={inCartQty >= 20}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#14452F] text-[#F2B705] hover:bg-[#0E3523] disabled:opacity-40 shadow-sm cursor-pointer transition-transform active:scale-90"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleInitialAdd}
            className="w-full py-3 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-[#14452F] to-[#0E3523] hover:from-[#0E3523] hover:to-[#0A2217] text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5 group/btn"
            aria-label={`Add ${item.name} (${item.pack_size}) to cart for Rs. ${item.price}`}
          >
            <Plus className="w-4 h-4 text-[#F2B705] group-hover/btn:rotate-90 transition-transform duration-200" />
            <span className="tracking-wide">ADD TO CART</span>
          </button>
        )}
      </div>
    </div>
  );
}
