import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (appliedPromo: string | null, promoDiscount: number, selectedTip: number) => void;
}

const FREE_DELIVERY_THRESHOLD = 499.0;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<number>(50);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : 49.0;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // 5% GST (Standard restaurant rate in India)
  const tax = subtotal * 0.05;
  const total = Math.max(0, subtotal + deliveryFee + tax + selectedTip - promoDiscount);

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (code === 'TASTE20') {
      const discount = subtotal * 0.2;
      setPromoDiscount(discount);
      setAppliedPromo('TASTE20 (20% Off)');
      setPromoCode('');
    } else if (code === 'CHEF10') {
      const discount = subtotal * 0.1;
      setPromoDiscount(discount);
      setAppliedPromo('CHEF10 (10% Off)');
      setPromoCode('');
    } else if (code === 'FREEDELIVERY') {
      setPromoDiscount(deliveryFee);
      setAppliedPromo('FREEDELIVERY (Free Delivery)');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try "TASTE20" for 20% off.');
    }
  };

  const handleCheckoutClick = () => {
    onProceedToCheckout(appliedPromo, promoDiscount, selectedTip);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E7E3DC] animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E7E3DC] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
            <h2 className="text-lg font-serif-display font-bold text-[#1C1917]">
              Your Order Bag
            </h2>
            <span className="text-xs text-[#78716C] font-mono tabular-nums">
              ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#57534E] hover:text-[#1C1917] rounded-lg hover:bg-stone-200/50 transition-colors"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-[#FAF8F5] px-6 py-3 border-b border-[#E7E3DC]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#57534E]">
              {isFreeDelivery
                ? '✨ Unlocked Free Thermal Delivery'
                : `Add ₹${remainingForFree.toFixed(0)} more for Free Delivery`}
            </span>
            <span className="font-mono tabular-nums text-[#1C1917]">
              ₹{subtotal.toFixed(0)} / ₹{FREE_DELIVERY_THRESHOLD.toFixed(0)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E7E3DC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D9531E] transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Itemized Order List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#78716C]">
              <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6 text-[#A8A29E]" />
              </div>
              <h3 className="font-serif-display text-base font-bold text-[#1C1917] mb-1">
                Your bag is empty
              </h3>
              <p className="text-xs text-[#78716C] max-w-xs mb-4">
                Explore our seasonal woodfire pizzas, dry-aged burgers, and fresh bowls to begin.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-[#D9531E] transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const allCustomizations = Object.values(item.selectedChoices)
                .flat()
                .filter(Boolean);

              return (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-xl border border-[#E7E3DC] bg-white flex gap-3.5"
                >
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-[#1C1917] truncate leading-tight">
                        {item.dish.name}
                      </h4>
                      <span className="font-mono text-xs font-bold text-[#1C1917] tabular-nums whitespace-nowrap">
                        ₹{item.itemTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#78716C] mt-0.5">
                      {item.dish.kitchen}
                    </div>

                    {allCustomizations.length > 0 && (
                      <p className="text-[11px] text-[#57534E] mt-1 line-clamp-2">
                        {allCustomizations.join(' · ')}
                      </p>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[11px] italic text-[#A8A29E] mt-0.5">
                        Note: &ldquo;{item.specialInstructions}&rdquo;
                      </p>
                    )}

                    {/* Stepper & Delete */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F5F2EB]">
                      <div className="flex items-center gap-2 bg-[#FAF8F5] px-2 py-1 rounded-md border border-[#E7E3DC]">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity(item.cartItemId, item.quantity - 1);
                            } else {
                              onRemoveItem(item.cartItemId);
                            }
                          }}
                          className="text-[#57534E] hover:text-[#1C1917]"
                          aria-label="Decrease item quantity"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="font-mono text-xs font-bold text-[#1C1917] tabular-nums min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="text-[#57534E] hover:text-[#1C1917]"
                          aria-label="Increase item quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        className="text-[11px] text-[#A8A29E] hover:text-rose-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Module (if cart has items) */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#FAF8F5] border-t border-[#E7E3DC] space-y-4">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Applied: {appliedPromo}</span>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedPromo(null);
                      setPromoDiscount(0);
                    }}
                    className="font-medium hover:underline text-emerald-900"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. TASTE20)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E7E3DC] rounded-lg text-[#1C1917] uppercase placeholder-normal placeholder-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#1C1917] text-white rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
            </div>

            {/* Courier Tip Selection in Rupees */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#57534E]">
                <span>Artisan Courier Tip</span>
                <span className="font-mono tabular-nums font-semibold text-[#1C1917]">
                  ₹{selectedTip.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[30, 50, 100, 0].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedTip(amt)}
                    className={`py-1 text-xs font-medium rounded-md transition-colors ${
                      selectedTip === amt
                        ? 'bg-[#1C1917] text-white shadow-xs'
                        : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#E7E3DC]'
                    }`}
                  >
                    {amt === 0 ? 'None' : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-[#E7E3DC] text-xs text-[#57534E]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono tabular-nums text-[#1C1917]">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thermal Delivery</span>
                <span className="font-mono tabular-nums text-[#1C1917]">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant GST (5%)</span>
                <span className="font-mono tabular-nums text-[#1C1917]">₹{tax.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promotion Savings</span>
                  <span className="font-mono tabular-nums">-₹{promoDiscount.toFixed(2)}</span>
                </div>
              )}
              {selectedTip > 0 && (
                <div className="flex justify-between">
                  <span>Courier Gratuity</span>
                  <span className="font-mono tabular-nums text-[#1C1917]">₹{selectedTip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1C1917] pt-2 border-t border-[#E7E3DC]">
                <span>Total Due</span>
                <span className="font-mono tabular-nums">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 bg-[#1C1917] hover:bg-[#D9531E] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Review & Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#78716C] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Temperature & Freshness Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
