import React, { useState } from 'react';
import { ShoppingBag, MapPin, Clock, ChevronDown, Check } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeOrderCount: number;
  onOpenActiveOrder: () => void;
  currentAddress: string;
  onChangeAddress: (newAddress: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

const ADDRESS_OPTIONS = [
  '742 Evergreen Terrace, Downtown',
  '1204 Pinecrest Ave, Apt 4B',
  '500 Tech Hub Blvd, Suite 210',
  '310 Oceanview Boulevard',
];

export const Header: React.FC<HeaderProps> = ({
  cart,
  onOpenCart,
  activeOrderCount,
  onOpenActiveOrder,
  currentAddress,
  onChangeAddress,
  onNavigateSection,
}) => {
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E3DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl sm:text-3xl font-serif-display font-bold tracking-tight text-[#1C1917] hover:text-[#D9531E] transition-colors whitespace-nowrap"
          >
            Nourish & Fork
          </a>

          {/* Delivery Location Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
              className="flex items-center gap-2 text-xs text-[#57534E] hover:text-[#1C1917] px-3 py-1.5 rounded-lg border border-[#E7E3DC] bg-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D9531E] shrink-0" />
              <span className="font-medium text-[#1C1917] max-w-[160px] truncate">{currentAddress}</span>
              <ChevronDown className="w-3 h-3 text-[#A8A29E]" />
            </button>

            {isAddressDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E7E3DC] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#A8A29E] border-b border-[#F5F2EB]">
                  Deliver To
                </div>
                <div className="py-1">
                  {ADDRESS_OPTIONS.map((address) => (
                    <button
                      key={address}
                      onClick={() => {
                        onChangeAddress(address);
                        setIsAddressDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                    >
                      <span className="truncate">{address}</span>
                      {currentAddress === address && (
                        <Check className="w-3.5 h-3.5 text-[#D9531E] shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: 4-5 Clean Nav links (Single-line, unboxed, subtle hover) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
          <button
            onClick={() => onNavigateSection('menu-catalog')}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap hover:underline underline-offset-4"
          >
            Curated Menu
          </button>
          <button
            onClick={() => onNavigateSection('kitchens')}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap hover:underline underline-offset-4"
          >
            Artisan Kitchens
          </button>
          <button
            onClick={() => onNavigateSection('standards')}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap hover:underline underline-offset-4"
          >
            Thermal Standards
          </button>
          <button
            onClick={() => onNavigateSection('faq')}
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap hover:underline underline-offset-4"
          >
            How We Deliver
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Action Buttons */}
        <div className="flex items-center gap-3">
          {activeOrderCount > 0 && (
            <button
              onClick={onOpenActiveOrder}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#D9531E] bg-[#D9531E]/10 rounded-lg hover:bg-[#D9531E]/15 transition-colors whitespace-nowrap border border-[#D9531E]/20"
            >
              <Clock className="w-3.5 h-3.5 animate-pulse text-[#D9531E]" />
              <span>Track Live ({activeOrderCount})</span>
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded-lg transition-colors shadow-sm whitespace-nowrap group"
          >
            <ShoppingBag className="w-4 h-4 text-[#FAF8F5] group-hover:scale-105 transition-transform" />
            <span>Bag</span>
            <span className="bg-[#D9531E] text-white text-[11px] font-bold px-1.5 py-0.5 rounded tabular-nums min-w-[20px] text-center">
              {totalCartCount}
            </span>
            {cartSubtotal > 0 && (
              <span className="hidden sm:inline border-l border-white/20 pl-2 text-stone-300 font-mono tabular-nums">
                ${cartSubtotal.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
