import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard,
  Banknote,
  MapPin,
  User,
  Phone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../api/client';

export default function Checkout() {
  useDocumentTitle('Checkout & Delivery Details - VMAS');
  const { cart, totalAmount, totalItems, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Discount and tip passed from Cart.jsx (optional)
  const discountAmount = location.state?.discount || 0;
  const tipAmount = location.state?.tip || 0;
  const couponCode = location.state?.couponCode || null;
  const cookingNotes = location.state?.cookingNotes || '';

  const finalPayable = Math.max(0, totalAmount - discountAmount + tipAmount);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    payment_method: 'COD',
  });

  const [addressType, setAddressType] = useState('Home');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  // If cart is empty, redirect or prompt
  if (cart.length === 0) {
    return (
      <div className="py-16 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/70 text-[#14452F] dark:text-[#F2B705] flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/menu"
          className="inline-block bg-[#14452F] text-white px-7 py-3.5 rounded-2xl font-black text-sm shadow-md"
        >
          Explore Menu Packs
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

    const fullAddress = addressType ? `[${addressType}] ${formData.address.trim()}` : formData.address.trim();

    const payload = {
      customer_name: formData.customer_name.trim(),
      phone: formData.phone.trim(),
      address: fullAddress,
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Back button & Title */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Return to Cart</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Delivery & Payment</h1>
          <span className="bg-[#14452F] text-[#F2B705] text-xs font-black px-2.5 py-0.5 rounded-full">
            {totalItems} {totalItems === 1 ? 'pack' : 'packs'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your location details to receive hot food packs freshly cooked from our kitchen.
        </p>
      </div>

      {generalError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">{generalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Order Form (2 columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Section 1: Contact & Delivery Address */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-900/40">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#14452F] dark:text-[#F2B705]" />
                <span>1. Delivery Destination</span>
              </h2>
              {/* Quick Tag Pills */}
              <div className="flex items-center gap-1.5">
                {['Home', 'Work', 'Other'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAddressType(t)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      addressType === t
                        ? 'bg-[#14452F] text-[#F2B705] shadow-sm'
                        : 'bg-slate-100 dark:bg-[#0B1410] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'Home' ? '🏠 Home' : t === 'Work' ? '🏢 Work' : '📍 Other'}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.customer_name}
                  onChange={(e) => {
                    setFormData({ ...formData, customer_name: e.target.value });
                    if (errors.customer_name) setErrors({ ...errors, customer_name: null });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                    errors.customer_name
                      ? 'border-rose-500 bg-rose-50/30'
                      : 'border-slate-200 dark:border-emerald-900/60 bg-slate-50 dark:bg-[#0B1410]'
                  } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]`}
                />
              </div>
              {errors.customer_name && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {errors.customer_name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Mobile Number (10 Digits) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
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
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                    errors.phone
                      ? 'border-rose-500 bg-rose-50/30'
                      : 'border-slate-200 dark:border-emerald-900/60 bg-slate-50 dark:bg-[#0B1410]'
                  } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]`}
                />
              </div>
              {errors.phone ? (
                <p className="text-xs text-rose-500 font-semibold mt-1">{errors.phone}</p>
              ) : (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  We send SMS status updates and our delivery rider will call upon arrival.
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Complete Street / Flat / Landmark Address *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Door/Flat no, Building / Apartment name, Street, Main Landmark..."
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: null });
                }}
                className={`w-full px-4 py-3 rounded-2xl border ${
                  errors.address
                    ? 'border-rose-500 bg-rose-50/30'
                    : 'border-slate-200 dark:border-emerald-900/60 bg-slate-50 dark:bg-[#0B1410]'
                } text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]`}
              />
              {errors.address && (
                <p className="text-xs text-rose-500 font-semibold mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Section 2: Payment Method Selection */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-emerald-900/40 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#14452F] dark:text-[#F2B705]" />
              <span>2. Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'COD'
                    ? 'border-[#14452F] dark:border-[#F2B705] bg-emerald-50/60 dark:bg-emerald-950/50 shadow-sm'
                    : 'border-slate-200 dark:border-emerald-900/40 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={formData.payment_method === 'COD'}
                  onChange={() => setFormData({ ...formData, payment_method: 'COD' })}
                  className="mt-1 accent-[#14452F]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pay liquid cash when the hot food packs arrive.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'UPI'
                    ? 'border-[#14452F] dark:border-[#F2B705] bg-emerald-50/60 dark:bg-emerald-950/50 shadow-sm'
                    : 'border-slate-200 dark:border-emerald-900/40 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="UPI"
                  checked={formData.payment_method === 'UPI'}
                  onChange={() => setFormData({ ...formData, payment_method: 'UPI' })}
                  className="mt-1 accent-[#14452F]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#F2B705]" />
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      Instant UPI / QR Pay
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Scan QR on delivery via Google Pay, PhonePe, or Paytm.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-[#F2B705] to-[#E5AC02] hover:from-[#E5AC02] hover:to-[#DCA502] text-[#14452F] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#F2B705]/20 hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-[#14452F]" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                <span>Confirm & Place Order (₹{finalPayable.toFixed(2)})</span>
              </>
            )}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-emerald-900/40 pb-3">
              Order Summary ({totalItems} packs)
            </h3>

            {/* Thumbnail preview list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-emerald-950/80 overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-slate-900 dark:text-white truncate">
                        {item.quantity}x {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.pack_size}</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white flex-shrink-0">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-slate-100 dark:border-emerald-900/40 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Coupon Discount ({couponCode || 'Promo'})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              {tipAmount > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Delivery Partner Tip</span>
                  <span>₹{tipAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  Delivery Fee
                  <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-black px-1 rounded">FREE</span>
                </span>
                <span className="text-emerald-600 font-black">₹0.00</span>
              </div>

              <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-emerald-900/60">
                <span>Total Payable</span>
                <span className="text-xl text-[#14452F] dark:text-[#F2B705]">
                  ₹{finalPayable.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Safe Food Promise */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-700 dark:text-emerald-400" />
            <span>
              <strong>Guaranteed Hot Delivery:</strong> Food is sealed into thermal pouches immediately upon cooking to maintain high temperature and crispness.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
