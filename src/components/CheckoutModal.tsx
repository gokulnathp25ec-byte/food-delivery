import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote, MapPin, Phone, User, ShieldCheck } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  defaultAddress: string;
  promoTitle: string | null;
  promoDiscount: number;
  tipAmount: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  defaultAddress,
  promoTitle,
  promoDiscount,
  tipAmount,
  onOrderSuccess,
}) => {
  const [address, setAddress] = useState(defaultAddress);
  const [apartment, setApartment] = useState('Flat 302, Tower B');
  const [instructions, setInstructions] = useState('Leave with security or ring doorbell once.');
  const [customerName, setCustomerName] = useState('Gokulnath P');
  const [phone, setPhone] = useState('+91 98421 78900');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 49.0;
  const tax = subtotal * 0.05; // 5% GST
  const total = Math.max(0, subtotal + deliveryFee + tax + tipAmount - promoDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Realistic delay simulating payment gateway authorization
    setTimeout(() => {
      const orderId = `NF-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        createdAt: Date.now(),
        items: [...cart],
        subtotal,
        deliveryFee,
        tax,
        tip: tipAmount,
        discount: promoDiscount,
        total,
        status: 'placed',
        estimatedMinutes: 28,
        deliveryAddress: `${address}${apartment ? `, ${apartment}` : ''}`,
        deliveryInstructions: instructions,
        customerName,
        customerPhone: phone,
        paymentMethod,
        courier: {
          name: 'Karthik Raja',
          rating: 4.98,
          deliveriesCount: 1420,
          vehicle: 'Ather 450X Thermal Electric EV',
          phone: '+91 98400 12345',
        },
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E7E3DC] flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E3DC] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <h2 className="text-xl font-serif-display font-bold text-[#1C1917]">
              Complete Your Order
            </h2>
            <p className="text-xs text-[#78716C]">
              Boutique kitchens are notified instantly upon confirmation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#57534E] hover:text-[#1C1917] rounded-lg transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Delivery Location Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              <MapPin className="w-3.5 h-3.5 text-[#D9531E]" />
              <span>Delivery Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address / Landmark"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E3DC] rounded-xl text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Flat / Building / Floor"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E3DC] rounded-xl text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dropoff" className="block text-[11px] text-[#78716C] mb-1">
                Dropoff Instructions (Optional)
              </label>
              <input
                id="dropoff"
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="E.g. Call upon arrival, leave with security guard..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#E7E3DC] rounded-xl text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-3 border-t border-[#F5F2EB]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              <User className="w-3.5 h-3.5 text-[#D9531E]" />
              <span>Contact & SMS Updates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E3DC] rounded-xl text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8A29E]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#E7E3DC] rounded-xl text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 pt-3 border-t border-[#F5F2EB]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              <CreditCard className="w-3.5 h-3.5 text-[#D9531E]" />
              <span>Payment Option</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`py-3 px-2 rounded-xl border text-center transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  paymentMethod === 'apple_pay'
                    ? 'border-[#1C1917] bg-[#FAF8F5] text-[#1C1917] font-semibold'
                    : 'border-[#E7E3DC] text-[#57534E] hover:border-[#D6D3D1]'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#D9531E]" />
                <span className="text-xs">UPI / GPay / PhonePe</span>
                <span className="text-[10px] text-[#78716C]">Instant QR / App</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-2 rounded-xl border text-center transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#1C1917] bg-[#FAF8F5] text-[#1C1917] font-semibold'
                    : 'border-[#E7E3DC] text-[#57534E] hover:border-[#D6D3D1]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#1C1917]" />
                <span className="text-xs">Cards / NetBanking</span>
                <span className="text-[10px] text-[#78716C]">RuPay / Visa / MC</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-3 px-2 rounded-xl border text-center transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-[#1C1917] bg-[#FAF8F5] text-[#1C1917] font-semibold'
                    : 'border-[#E7E3DC] text-[#57534E] hover:border-[#D6D3D1]'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span className="text-xs">Pay on Arrival</span>
                <span className="text-[10px] text-[#78716C]">Cash or UPI scan</span>
              </button>
            </div>
          </div>

          {/* Quick Summary breakdown */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E7E3DC] space-y-1.5 text-xs text-[#57534E]">
            <div className="flex justify-between">
              <span>{cart.length} unique dish selections</span>
              <span className="font-mono tabular-nums text-[#1C1917]">₹{subtotal.toFixed(2)}</span>
            </div>
            {promoTitle && (
              <div className="flex justify-between text-emerald-700">
                <span>{promoTitle}</span>
                <span className="font-mono tabular-nums">-₹{promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Courier gratuity</span>
              <span className="font-mono tabular-nums text-[#1C1917]">₹{tipAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-mono tabular-nums text-[#1C1917]">
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#1C1917] pt-2 border-t border-[#E7E3DC]">
              <span>Final Total</span>
              <span className="font-mono tabular-nums">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#1C1917] hover:bg-[#D9531E] disabled:bg-stone-500 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Confirming Order with Kitchens...</span>
              </div>
            ) : (
              <span>Place Order · ₹{total.toFixed(2)}</span>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#78716C]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted checkout · Live courier GPS dispatched automatically</span>
          </div>
        </form>
      </div>
    </div>
  );
};
