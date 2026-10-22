import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Printer,
  ShieldCheck,
  Bike,
  Star,
  Zap,
} from 'lucide-react';
import api from '../api/client';
import StatusSteps from '../components/StatusSteps';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function TrackOrder() {
  useDocumentTitle('Live Order Tracking - VMAS Food Packs');
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const initialOrderId = searchParams.get('order_id') || location.state?.newOrder?.id || '';
  const initialPhone = searchParams.get('phone') || location.state?.newOrder?.phone || '';

  const [orderId, setOrderId] = useState(initialOrderId ? String(initialOrderId) : '');
  const [phone, setPhone] = useState(initialPhone ? String(initialPhone) : '');
  const [order, setOrder] = useState(location.state?.newOrder || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successBanner, setSuccessBanner] = useState(location.state?.message || null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const refreshIntervalRef = useRef(null);

  const fetchOrderStatus = async (idToQuery, phoneToQuery, isAuto = false) => {
    if (!idToQuery || !phoneToQuery) return;

    if (!isAuto) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await api.getOrderStatus(idToQuery, phoneToQuery);
      setOrder(data);
      setLastRefreshed(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error('Track order error:', err);
      if (err.status === 404) {
        setError('Order not found or mobile number does not match. Please verify your details.');
      } else {
        setError(err.message || 'Unable to fetch order status. Please check your connection.');
      }
      if (!isAuto) {
        setOrder(null);
      }
    } finally {
      if (!isAuto) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (initialOrderId && initialPhone) {
      fetchOrderStatus(initialOrderId, initialPhone);
    }
  }, []);

  useEffect(() => {
    if (order && order.id && phone && order.status !== 'DELIVERED' && order.status !== 'CANCELLED') {
      refreshIntervalRef.current = setInterval(() => {
        fetchOrderStatus(order.id, phone, true);
      }, 15000);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [order?.id, phone, order?.status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSuccessBanner(null);
    const cleanId = orderId.trim();
    const cleanPhone = phone.trim();

    if (!cleanId || !cleanPhone) {
      setError('Please enter both Order ID and Phone Number.');
      return;
    }

    setSearchParams({ order_id: cleanId, phone: cleanPhone });
    fetchOrderStatus(cleanId, cleanPhone);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left border-b border-slate-200 dark:border-emerald-900/50 pb-5">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-black px-3 py-1 rounded-full mb-1">
          <Zap className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>REAL-TIME STATUS UPDATE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Track Your Food Packet Order
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your fresh ready-to-cook bread packets from our packing center to your door.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-3xl flex items-center gap-3 text-emerald-900 dark:text-emerald-200 shadow-sm animate-fadeIn">
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div className="text-sm font-black">{successBanner}</div>
        </div>
      )}

      {/* Search Order Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Order ID #
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-emerald-900/60 bg-slate-50 dark:bg-[#0B1410] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Registered Phone Number
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-emerald-900/60 bg-slate-50 dark:bg-[#0B1410] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#14452F] to-[#0E3523] hover:from-[#0E3523] hover:to-[#0A2217] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer h-[46px]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#F2B705]" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Live Order Details Display */}
      {order && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Card: Order ID & ETA */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-emerald-900/40">
              <div>
                <span className="text-xs font-bold text-slate-400">Order Reference</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Order #{order.id}</span>
                  <span className="bg-[#14452F] text-[#F2B705] text-xs font-black px-2.5 py-0.5 rounded-full">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Placed on {new Date(order.created_at).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons: Print & Manual Refresh */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => fetchOrderStatus(order.id, phone)}
                  className="p-2.5 rounded-2xl border border-slate-200 dark:border-emerald-900/60 hover:bg-slate-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Refresh order status"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-2.5 rounded-2xl bg-[#F2B705] hover:bg-[#DCA502] text-[#14452F] text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Print invoice"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print Receipt</span>
                </button>
              </div>
            </div>

            {/* Status Steps Stepper */}
            <div>
              <StatusSteps status={order.status} />
              {lastRefreshed && (
                <div className="text-center text-[11px] text-slate-400 pt-2">
                  Auto-checking every 15s • Last verified at {lastRefreshed}
                </div>
              )}
            </div>
          </div>

          {/* Delivery Partner & ETA Simulation Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Rider Details */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14452F] to-[#0E3523] text-[#F2B705] flex items-center justify-center font-black text-2xl shadow-md">
                <Bike className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-base text-slate-900 dark:text-white truncate">
                    Ramesh Kumar
                  </h4>
                  <span className="flex items-center gap-1 text-xs font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-current" /> 4.9
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Assigned Rider • TVS Jupiter (TN-37-AZ-1024)
                </div>
                <a
                  href="tel:9876543210"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#14452F] dark:text-[#F2B705] mt-2 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider (98765 43210)</span>
                </a>
              </div>
            </div>

            {/* Estimated Arrival / Insulation Guarantee */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F2B705] text-[#14452F] flex items-center justify-center font-black shadow-md flex-shrink-0">
                <Clock className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Estimated Delivery Time
                </span>
                <h4 className="font-black text-xl text-slate-900 dark:text-white">
                  {order.status === 'DELIVERED' ? 'Successfully Delivered!' : '25 - 35 Minutes'}
                </h4>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                  Hygienically sealed food-grade packaging preserves fresh softness. Ready to toast on tawa!
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address & Customer Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-emerald-900/40 pb-3">
              Delivery Destination
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Customer</span>
                <span className="font-black text-slate-900 dark:text-white">
                  {order.customer_name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Mobile</span>
                <span className="font-black text-slate-900 dark:text-white">{order.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Payment Method</span>
                <span className="font-black text-slate-900 dark:text-white">
                  {order.payment_method === 'COD' ? 'Cash on Delivery (COD)' : 'UPI / QR Pay'}
                </span>
              </div>
              <div className="sm:col-span-3 pt-2">
                <span className="text-slate-400 block text-xs">Delivery Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {order.address}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Bill Receipt */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121F19] border border-slate-200/80 dark:border-emerald-900/40 shadow-sm space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-emerald-900/40 pb-3">
              Items in this Order
            </h3>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs sm:text-sm pb-2 border-b border-slate-100 dark:border-emerald-900/30 last:border-0"
                >
                  <div>
                    <span className="font-black text-slate-900 dark:text-white">
                      {item.quantity}x {item.menu_item_name}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      {item.pack_size} • ₹{item.unit_price} each
                    </span>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">
                    ₹{Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-200 dark:border-emerald-900/60 pt-4 flex justify-between items-center text-lg font-black text-slate-900 dark:text-white">
              <span>Grand Total</span>
              <span className="text-2xl text-[#14452F] dark:text-[#F2B705]">
                ₹{Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
