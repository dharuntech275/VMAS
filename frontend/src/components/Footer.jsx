import React from 'react';
import { UtensilsCrossed, Phone, MapPin, Clock, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-[#0E3523] to-[#081B12] text-emerald-100 border-t border-[#1D5E40] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F2B705] flex items-center justify-center text-[#14452F] shadow-lg shadow-[#F2B705]/20">
                <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#F2B705]">
                  VMAS
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300">
                  VMA Services • Fresh Food Packs
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-md leading-relaxed">
              We specialize in freshly prepared, ready-to-eat bread packs delivered straight from our kitchen tawas to your dining table. Wholesome Chapathis, Parottas, Naan, and traditional Millet rotis packed in family portions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-bold bg-[#14452F] border border-[#1D5E40] px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-[#F2B705]" />
                <span>100% Whole Grain Flour</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-bold bg-[#14452F] border border-[#1D5E40] px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#F2B705]" />
                <span>Zero Added Preservatives</span>
              </div>
            </div>
          </div>

          {/* Quick Menu Categories */}
          <div>
            <h4 className="font-black text-white text-base mb-4 text-[#F2B705] uppercase tracking-wider text-xs">
              Bread Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-200/80">
              <li>
                <Link to="/menu?q=chapathi" className="hover:text-[#F2B705] transition-colors flex items-center gap-1.5">
                  <span>🌾</span>
                  <span>Soft Chapathi & Rotis</span>
                </Link>
              </li>
              <li>
                <Link to="/menu?q=parotta" className="hover:text-[#F2B705] transition-colors flex items-center gap-1.5">
                  <span>🥞</span>
                  <span>Crispy Layered Parottas</span>
                </Link>
              </li>
              <li>
                <Link to="/menu?q=naan" className="hover:text-[#F2B705] transition-colors flex items-center gap-1.5">
                  <span>🫓</span>
                  <span>Tandoori Naan & Pooris</span>
                </Link>
              </li>
              <li>
                <Link to="/menu?q=keerai" className="hover:text-[#F2B705] transition-colors flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>Herbal & Millet Specials</span>
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-[#F2B705] transition-colors flex items-center gap-1.5">
                  <span>📍</span>
                  <span>Live Order Tracking</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating hours & Kitchen Contact */}
          <div>
            <h4 className="font-black text-white text-base mb-4 text-[#F2B705] uppercase tracking-wider text-xs">
              Kitchen & Service
            </h4>
            <ul className="space-y-3 text-xs text-emerald-200/80">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F2B705] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Daily Kitchen Batches:</strong><br />
                  Morning: 6:30 AM - 10:30 AM<br />
                  Evening: 5:30 PM - 10:30 PM
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F2B705] flex-shrink-0" />
                <span>
                  Customer Hotline: <strong>98765 43210</strong>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F2B705] flex-shrink-0 mt-0.5" />
                <span>
                  VMAS Central Kitchen Center,<br />
                  Doorstep Delivery Across City
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment icons & Copyright */}
        <div className="border-t border-[#1D5E40] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60">
          <div className="flex items-center gap-2">
            <span>Accepted Payments:</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-200">
              <span className="bg-[#14452F] px-2 py-0.5 rounded text-[10px]">UPI</span>
              <span className="bg-[#14452F] px-2 py-0.5 rounded text-[10px]">GPay</span>
              <span className="bg-[#14452F] px-2 py-0.5 rounded text-[10px]">PhonePe</span>
              <span className="bg-[#14452F] px-2 py-0.5 rounded text-[10px]">Cash on Delivery</span>
            </div>
          </div>
          <p>© {new Date().getFullYear()} VMAS (VMA Services). Fresh Ready-Made Food Packs Delivery.</p>
        </div>
      </div>
    </footer>
  );
}
