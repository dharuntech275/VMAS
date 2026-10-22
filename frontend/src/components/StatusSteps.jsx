import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, Home, AlertCircle } from 'lucide-react';

export default function StatusSteps({ status = 'RECEIVED' }) {
  if (status === 'CANCELLED') {
    return (
      <div className="p-5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-3xl flex items-center gap-3.5 text-rose-700 dark:text-rose-300">
        <AlertCircle className="w-7 h-7 flex-shrink-0" />
        <div>
          <h4 className="font-black text-base">Order Cancelled</h4>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
            This order has been cancelled. For help, please contact customer support at 98765 43210.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'RECEIVED', label: 'Order Placed', desc: 'Sent to Kitchen', icon: Clock },
    { key: 'PREPARING', label: 'Tawa Cooking', desc: 'Freshly Rolled', icon: ChefHat },
    { key: 'OUT_FOR_DELIVERY', label: 'On the Way', desc: 'Hot Thermal Pack', icon: Bike },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your meal!', icon: Home },
  ];

  const currentIdx = steps.findIndex((s) => s.key === status);
  const activeIndex = currentIdx >= 0 ? currentIdx : 0;
  const progressPercent = (activeIndex / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-6 px-2">
      <div className="relative">
        {/* Background Track Line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-slate-200 dark:bg-emerald-950 -translate-y-1/2 z-0 rounded-full" />

        {/* Dynamic Progress Line */}
        <div
          className="absolute top-6 left-6 h-1 bg-gradient-to-r from-[#14452F] to-[#F2B705] -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `calc(${progressPercent}% * (100% - 48px) / 100)` }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-4 gap-2 relative z-10">
          {steps.map((step, idx) => {
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isPending = idx > activeIndex;
            const IconComponent = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                {/* Step Circle with micro-animations */}
                <div
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isCurrent
                      ? 'bg-gradient-to-br from-[#F2B705] to-[#DCA502] text-[#14452F] ring-4 ring-[#F2B705]/30 font-black scale-110 shadow-lg shadow-[#F2B705]/20 animate-pulse-glow'
                      : isDone
                      ? 'bg-[#14452F] text-[#F2B705] shadow-sm'
                      : 'bg-white dark:bg-[#121F19] border-2 border-slate-200 dark:border-emerald-900/60 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  ) : (
                    <IconComponent className="w-5 h-5 stroke-[2.2]" />
                  )}

                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#121F19] animate-ping" />
                  )}
                </div>

                {/* Step Labels */}
                <span
                  className={`text-xs sm:text-sm font-black mt-3 leading-tight ${
                    isCurrent
                      ? 'text-[#14452F] dark:text-[#F2B705]'
                      : isDone
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
