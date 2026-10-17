import React from 'react';
import { UtensilsCrossed, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0E3523] text-emerald-100 border-t border-[#1D5E40] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F2B705] flex items-center justify-center text-[#14452F]">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-wider text-[#F2B705]">
                VMAS
              </span>
            </div>
            <p className="text-sm text-emerald-200/80 max-w-sm leading-relaxed">
              VMA Services - Fresh, hygienic, and ready-made food packs delivered right to your
              doorstep. Wholesome Chapathis, Parottas, Naans, and Pooris packed in family portions.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F2B705] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Whole Wheat & Freshly Made Daily</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-base mb-3 text-[#F2B705]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Explore Menu Packs
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  My Cart
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Live Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating hours & contact */}
          <div>
            <h4 className="font-bold text-white text-base mb-3 text-[#F2B705]">Service Info</h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/80">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F2B705] flex-shrink-0 mt-0.5" />
                <span>Morning Batch: 6:30 AM - 10:30 AM<br/>Evening Batch: 5:30 PM - 10:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F2B705] flex-shrink-0" />
                <span>Customer Support: 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F2B705] flex-shrink-0 mt-0.5" />
                <span>Kitchen Facility: VMA Services Center</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1D5E40] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60">
          <p>© {new Date().getFullYear()} VMAS (VMA Services). All rights reserved.</p>
          <p>Fresh Food Packs Delivery Platform</p>
        </div>
      </div>
    </footer>
  );
}
