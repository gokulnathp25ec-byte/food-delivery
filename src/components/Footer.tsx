import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#1C1917] text-white pt-14 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-2xl font-serif-display font-bold text-white tracking-tight">
              Nourish & Fork
            </span>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Artisan food delivery connecting neighborhood culinarians with discerning diners. Engineered for thermal precision, zero single-use plastic, and peak culinary integrity.
            </p>
            <div className="text-xs text-stone-300">
              Dispatched with eco-electric fleet across metropolitan districts.
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Kitchens
            </div>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#kitchens" className="hover:text-white transition-colors">
                  Hearth & Iron Butcher
                </a>
              </li>
              <li>
                <a href="#kitchens" className="hover:text-white transition-colors">
                  Fornacella Sourdough
                </a>
              </li>
              <li>
                <a href="#kitchens" className="hover:text-white transition-colors">
                  Nami Botanica Raw
                </a>
              </li>
              <li>
                <a href="#kitchens" className="hover:text-white transition-colors">
                  Maison de Cacao
                </a>
              </li>
            </ul>
          </div>

          {/* Standards Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Logistics
            </div>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#standards" className="hover:text-white transition-colors">
                  Thermal Precision
                </a>
              </li>
              <li>
                <a href="#standards" className="hover:text-white transition-colors">
                  Compostable Fiber
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Single-Drop Route
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Delivery Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Seasonal Gazette Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Seasonal Tasting Drops
            </div>
            <p className="text-xs text-stone-300">
              Receive alerts for limited harvest batches, guest chef collaborations, and weekend reserve specials.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800">
                <Check className="w-4 h-4" />
                <span>Subscribed to tasting bulletins.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-white text-[#1C1917] rounded-lg hover:bg-stone-200 transition-colors"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-300 gap-4">
          <p>© {new Date().getFullYear()} Nourish & Fork Culinary Courier. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-stone-300 cursor-pointer">Allergen Notice</span>
            <span className="hover:text-stone-300 cursor-pointer">Courier Partner Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
