import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Loader2, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../api/client';

export default function Checkout() {
  useDocumentTitle('Checkout & Delivery');
  const { cart, totalAmount, totalItems, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    payment_method: 'COD',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  // If cart is empty, redirect or prompt
  if (cart.length === 0) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-[#14452F] dark:text-[#F2B705] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/menu"
          className="inline-block bg-[#14452F] text-white px-6 py-3 rounded-xl font-bold text-sm"
        >
          Menu-ku po
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs = {};

    // Customer Name
    if (!formData.customer_name.trim()) {
      errs.customer_name = 'Please enter your full name.';
    }

    // Phone: 10-digit Indian mobile starting with 6, 7, 8, or 9
    const phoneClean = formData.phone.trim();
    if (!phoneClean) {
      errs.phone = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).';
    }

    // Address: minimum 8 characters
    const addressClean = formData.address.trim();
    if (!addressClean) {
      errs.address = 'Delivery address is required.';
    } else if (addressClean.length < 8) {
      errs.address = 'Address must be at least 8 characters long (include street/flat/landmark).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    setSubmitting(true);

    const payload = {
      customer_name: formData.customer_name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      payment_method: formData.payment_method,
      items: cart.map((item) => ({
        menu_item: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const createdOrder = await api.createOrder(payload);

      // Trigger success toast
      showToast(`Order #${createdOrder.id} placed successfully!`, 'success', 5000);

      // Clear cart
      clearCart();

      // Redirect to /track with state and query parameters
      navigate(
        `/track?order_id=${createdOrder.id}&phone=${encodeURIComponent(createdOrder.phone)}`,
        {
          state: {
            newOrder: createdOrder,
            message: `Order #${createdOrder.id} placed successfully!`,
          },
        }
      );
    } catch (err) {
      console.error('Order creation error:', err);
      // Backend error response format: { phone: [...], address: [...], detail: ... }
      if (err.data && typeof err.data === 'object') {
        const backendErrors = {};
        for (const [key, val] of Object.entries(err.data)) {
          backendErrors[key] = Array.isArray(val) ? val.join(' ') : String(val);
        }
        setErrors(backendErrors);
        if (backendErrors.non_field_errors || backendErrors.detail) {
          setGeneralError(backendErrors.non_field_errors || backendErrors.detail);
        }
      } else {
        setGeneralError(err.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Back button & Title */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Delivery Checkout</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete your delivery details to place your fresh bread packs order.
        </p>
      </div>

      {generalError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">{generalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-emerald-900/40">
              1. Customer Information
            </h2>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={formData.customer_name}
                onChange={(e) => {
                  setFormData({ ...formData, customer_name: e.target.value });
                  if (errors.customer_name) setErrors({ ...errors, customer_name: null });
                }}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.customer_name
                    ? 'border-rose-500 bg-rose-50/30'
                    : 'border-slate-200 dark:border-emerald-900/60 bg-[#FBFBFA] dark:bg-[#0B1510]'
                } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]`}
              />
              {errors.customer_name && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {errors.customer_name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Mobile Number (10 Digits) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, phone: val });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                    errors.phone
                      ? 'border-rose-500 bg-rose-50/30'
                      : 'border-slate-200 dark:border-emerald-900/60 bg-[#FBFBFA] dark:bg-[#0B1510]'
                  } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]`}
                />
              </div>
              {errors.phone ? (
                <p className="text-xs text-rose-500 font-semibold mt-1">{errors.phone}</p>
              ) : (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Used for order verification & status tracking.
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Delivery Address *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Door/Flat no, Apartment name, Street, Area landmark..."
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: null });
                }}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.address
                    ? 'border-rose-500 bg-rose-50/30'
                    : 'border-slate-200 dark:border-emerald-900/60 bg-[#FBFBFA] dark:bg-[#0B1510]'
                } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]`}
              />
              {errors.address && (
                <p className="text-xs text-rose-500 font-semibold mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-emerald-900/40">
              2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'COD'
                    ? 'border-[#14452F] dark:border-[#F2B705] bg-emerald-50/50 dark:bg-emerald-950/40'
                    : 'border-slate-200 dark:border-emerald-900/40 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={formData.payment_method === 'COD'}
                  onChange={() => setFormData({ ...formData, payment_method: 'COD' })}
                  className="accent-[#14452F]"
                />
                <Banknote className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Cash on Delivery
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Pay cash upon receiving food
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'UPI'
                    ? 'border-[#14452F] dark:border-[#F2B705] bg-emerald-50/50 dark:bg-emerald-950/40'
                    : 'border-slate-200 dark:border-emerald-900/40 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="UPI"
                  checked={formData.payment_method === 'UPI'}
                  onChange={() => setFormData({ ...formData, payment_method: 'UPI' })}
                  className="accent-[#14452F]"
                />
                <CreditCard className="w-5 h-5 text-[#F2B705]" />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">UPI Payment</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Pay via GPay / PhonePe on delivery
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl bg-[#F2B705] hover:bg-[#DCA502] text-[#14452F] font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Placing Your Order...</span>
              </>
            ) : (
              <span>Confirm & Place Order (₹{totalAmount.toFixed(2)})</span>
            )}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-emerald-900/40 pb-3">
              Order Summary ({totalItems} packs)
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-slate-400 block text-[10px]">{item.pack_size}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 dark:border-emerald-900/40 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-emerald-900/60">
                <span>Total Amount</span>
                <span className="text-[#14452F] dark:text-[#F2B705]">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-700 dark:text-emerald-400 mt-0.5" />
            <span>
              Orders are prepared fresh. Backend calculates final bill securely using current rates.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
