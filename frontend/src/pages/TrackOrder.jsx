import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { Search, Loader2, AlertCircle, CheckCircle, Clock, MapPin, Phone, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../api/client';
import StatusSteps from '../components/StatusSteps';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function TrackOrder() {
  useDocumentTitle('Track Live Order');
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

  // Interval reference for 15s auto-refresh
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
        setError('Order not found or mobile number does not match. Please verify both details.');
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

  // Initial fetch if query params are present
  useEffect(() => {
    if (initialOrderId && initialPhone) {
      fetchOrderStatus(initialOrderId, initialPhone);
    }
  }, []);

  // 15 seconds auto-refresh interval setup
  useEffect(() => {
    if (order && order.id && phone && order.status !== 'DELIVERED' && order.status !== 'CANCELLED') {
      refreshIntervalRef.current = setInterval(() => {
        fetchOrderStatus(order.id, phone, true);
      }, 15000); // 15 seconds auto refresh
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

    // Update query params
    setSearchParams({ order_id: cleanId, phone: cleanPhone });
    fetchOrderStatus(cleanId, cleanPhone);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left border-b border-slate-200 dark:border-emerald-900/50 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#14452F] dark:text-[#F2B705]">
          Live Order Status
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
          Track Your Delivery
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your Order ID and 10-digit mobile number for real-time live kitchen & delivery updates.
        </p>
      </div>

      {/* Success Notification Banner on New Order Placement */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 dark:text-emerald-200 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">{successBanner}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Your food packs are currently in the queue. Auto-refreshing every 15s.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Lookup Form */}
      <form
        onSubmit={handleSearch}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Order ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-[#FBFBFA] dark:bg-[#0B1510] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-[#FBFBFA] dark:bg-[#0B1510] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#14452F] dark:focus:ring-[#F2B705]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-[#14452F] hover:bg-[#0E3523] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#F2B705]" />
              <span>Checking Order Status...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-[#F2B705]" />
              <span>Track Order</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Order Details Display Card */}
      {order && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#14211B] border border-emerald-100 dark:border-emerald-900/40 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-emerald-900/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Order #{order.id}
                </h2>
                <span className="bg-[#F2B705] text-[#14452F] text-xs font-black px-2.5 py-0.5 rounded-full">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Placed on {new Date(order.created_at).toLocaleString('en-IN')}
              </p>
            </div>

            {lastRefreshed && (
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Auto-refresh active (updated: {lastRefreshed})</span>
              </span>
            )}
          </div>

          {/* Stepper Timeline */}
          <div className="py-2">
            <StatusSteps status={order.status} />
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FBFBFA] dark:bg-[#0B1510] border border-slate-200 dark:border-emerald-900/60 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                Customer Details
              </span>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {order.customer_name}
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-[#14452F] dark:text-[#F2B705]" />
                <span>+91 {order.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <CreditCard className="w-3.5 h-3.5 text-[#14452F] dark:text-[#F2B705]" />
                <span>Payment Mode: {order.payment_method}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                Delivery Address
              </span>
              <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-200 leading-relaxed">
                <MapPin className="w-4 h-4 text-[#14452F] dark:text-[#F2B705] flex-shrink-0 mt-0.5" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Ordered Food Packs
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-emerald-900/40">
              {order.items?.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.quantity}x {item.menu_item_name}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">({item.pack_size})</span>
                    <span className="text-xs text-slate-500 block">₹{item.unit_price} each</span>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">
                    ₹{Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-slate-200 dark:border-emerald-900/60 pt-3 flex justify-between items-center text-lg font-black text-slate-900 dark:text-white">
              <span>Total Bill</span>
              <span className="text-[#14452F] dark:text-[#F2B705]">₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
