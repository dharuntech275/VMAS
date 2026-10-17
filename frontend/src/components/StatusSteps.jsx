import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, Home, AlertCircle } from 'lucide-react';

export default function StatusSteps({ status = 'RECEIVED' }) {
  if (status === 'CANCELLED') {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs text-rose-600 dark:text-rose-400">
            This order has been cancelled. If you need assistance, please contact support.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'RECEIVED', label: 'Order Received', icon: Clock },
    { key: 'PREPARING', label: 'Preparing Packs', icon: ChefHat },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
    { key: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  const currentIdx = steps.findIndex((s) => s.key === status);
  const activeIndex = currentIdx >= 0 ? currentIdx : 0;

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-4 gap-2 relative">
        {steps.map((step, idx) => {
          const isDone = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          const IconComponent = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center text-center relative z-10">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-[#F2B705] text-[#14452F] ring-4 ring-[#F2B705]/20 font-bold scale-110'
                    : isDone
                    ? 'bg-[#14452F] text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                }`}
              >
                {isDone && !isCurrent ? (
                  <CheckCircle2 className="w-5 h-5 text-[#F2B705]" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] sm:text-xs font-bold mt-2 leading-tight ${
                  isCurrent
                    ? 'text-[#14452F] dark:text-[#F2B705]'
                    : isDone
                    ? 'text-slate-900 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
