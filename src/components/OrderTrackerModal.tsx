import React, { useState, useEffect } from 'react';
import { X, Check, Clock, Phone, MessageSquare, ChevronRight, Navigation, Bike, ChefHat, Sparkles } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStatus?: (orderId: string, nextStatus: OrderStatus) => void;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'placed', label: 'Order Sent', desc: 'Boutique kitchen acknowledged order' },
  { key: 'kitchen_prep', label: 'Kitchen Firing', desc: 'Sourdough baking & Wagyu searing' },
  { key: 'courier_picked', label: 'En Route', desc: 'Thermal insulated transport active' },
  { key: 'delivered', label: 'Delivered', desc: 'Handed off fresh and warm' },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  onAdvanceStatus,
}) => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!order) return;
    const index = STATUS_STEPS.findIndex((s) => s.key === order.status);
    setCurrentStepIndex(index !== -1 ? index : 0);
  }, [order?.status]);

  if (!isOpen || !order) return null;

  const handleNextStage = () => {
    if (!onAdvanceStatus) return;
    const nextIdx = Math.min(STATUS_STEPS.length - 1, currentStepIndex + 1);
    const nextStatus = STATUS_STEPS[nextIdx].key;
    onAdvanceStatus(order.id, nextStatus);
  };

  const getEstimatedMinutesLeft = () => {
    switch (order.status) {
      case 'placed':
        return 28;
      case 'kitchen_prep':
        return 20;
      case 'courier_picked':
        return 9;
      case 'delivered':
        return 0;
      default:
        return 25;
    }
  };

  const minutesLeft = getEstimatedMinutesLeft();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E7E3DC] flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E3DC] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif-display font-bold text-[#1C1917]">
                  Order {order.id}
                </h2>
                <span className="text-xs text-[#78716C] font-mono">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-[#57534E]">
                {order.items.length} items · Total ₹{order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#57534E] hover:text-[#1C1917] rounded-lg transition-colors"
            aria-label="Close order tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracker Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Real-time Status Card & Countdown */}
          <div className="bg-[#1C1917] text-white p-5 rounded-2xl relative overflow-hidden shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-stone-300 font-semibold mb-1">
                  Estimated Arrival
                </div>
                <div className="text-3xl font-serif-display font-bold text-white tabular-nums">
                  {order.status === 'delivered' ? 'Arrived!' : `${minutesLeft} Minutes`}
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  {order.status === 'delivered'
                    ? 'Delivered to your address'
                    : `Dispatched to ${order.deliveryAddress}`}
                </p>
              </div>

              {/* Status Stepper Button for interactive preview */}
              {order.status !== 'delivered' && onAdvanceStatus && (
                <button
                  onClick={handleNextStage}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium border border-white/20 transition-colors flex items-center gap-1.5"
                  title="Simulate next delivery stage"
                >
                  <span>Fast Forward Stage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Visual Step Progress Indicator */}
            <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/10">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="space-y-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isPassed ? 'bg-[#D9531E]' : 'bg-white/20'
                      }`}
                    />
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[11px] font-semibold truncate ${
                          isCurrent ? 'text-white' : isPassed ? 'text-stone-300' : 'text-stone-300/60'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulated Route Map */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E7E3DC] bg-[#FAF8F5] p-4">
            <div className="flex items-center justify-between text-xs text-[#57534E] mb-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#D9531E]" />
                <span>Live Courier Route Tracking</span>
              </div>
              <span className="text-[11px] font-mono text-[#78716C]">GPS Active · 30s ping</span>
            </div>

            {/* Stylized SVG Map Canvas */}
            <div className="relative h-44 w-full bg-[#EDE8DF] rounded-xl overflow-hidden border border-[#DED9CF] flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Background street grids */}
                <defs>
                  <pattern id="street-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DED8CE" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#street-grid)" />

                {/* Parks / Green spaces */}
                <rect x="30" y="20" width="80" height="50" rx="6" fill="#DCE5D8" />
                <rect x="240" y="80" width="90" height="60" rx="8" fill="#DCE5D8" />

                {/* Major avenues */}
                <path d="M 0 60 Q 200 40 400 90 T 700 80" fill="none" stroke="#FFFFFF" strokeWidth="12" />
                <path d="M 120 0 L 140 180" fill="none" stroke="#FFFFFF" strokeWidth="10" />
                <path d="M 380 0 L 370 180" fill="none" stroke="#FFFFFF" strokeWidth="10" />

                {/* Active delivery path line */}
                <path
                  d="M 60 70 C 140 70, 220 50, 320 95 C 400 130, 460 110, 520 85"
                  fill="none"
                  stroke="#D9531E"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </svg>

              {/* Kitchen Node */}
              <div className="absolute left-[12%] top-[40%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-[#1C1917] flex items-center justify-center text-[#1C1917]">
                  <ChefHat className="w-4 h-4 text-[#D9531E]" />
                </div>
                <span className="text-[10px] font-semibold text-[#1C1917] bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1 whitespace-nowrap">
                  Artisan Kitchen
                </span>
              </div>

              {/* Moving Courier Marker */}
              <div
                className="absolute z-20 flex flex-col items-center transition-all duration-700"
                style={{
                  left:
                    order.status === 'placed'
                      ? '14%'
                      : order.status === 'kitchen_prep'
                      ? '26%'
                      : order.status === 'courier_picked'
                      ? '62%'
                      : '86%',
                  top:
                    order.status === 'placed'
                      ? '42%'
                      : order.status === 'kitchen_prep'
                      ? '42%'
                      : order.status === 'courier_picked'
                      ? '60%'
                      : '48%',
                }}
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#1C1917] text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <Bike className="w-4 h-4 text-[#FAF8F5]" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D9531E] rounded-full ring-2 ring-white" />
                </div>
                <span className="text-[10px] font-semibold text-[#1C1917] bg-white px-2 py-0.5 rounded-full shadow-xs mt-1 whitespace-nowrap">
                  {order.courier.name}
                </span>
              </div>

              {/* Destination Customer Pin */}
              <div className="absolute right-[12%] top-[45%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#D9531E] text-white shadow-md border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-bold">You</span>
                </div>
                <span className="text-[10px] font-semibold text-[#1C1917] bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1 whitespace-nowrap">
                  Delivery Point
                </span>
              </div>
            </div>
          </div>

          {/* Courier Card & Quick Contact */}
          <div className="bg-white p-4 rounded-xl border border-[#E7E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] flex items-center justify-center text-lg font-serif-display font-bold text-[#1C1917]">
                MV
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[#1C1917]">{order.courier.name}</h4>
                  <span className="text-xs font-medium text-[#78716C]">
                    ★ {order.courier.rating.toFixed(2)} ({order.courier.deliveriesCount}+)
                  </span>
                </div>
                <p className="text-xs text-[#57534E]">{order.courier.vehicle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${order.courier.phone}`}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#FAF8F5] hover:bg-stone-200/60 border border-[#E7E3DC] rounded-lg text-[#1C1917] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D9531E]" />
                <span>Call Courier</span>
              </a>

              <button
                onClick={() =>
                  setActiveMessage(
                    activeMessage ? null : 'Courier notified: "Please leave package by front doorstep."'
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#FAF8F5]" />
                <span>Send Note</span>
              </button>
            </div>
          </div>

          {activeMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{activeMessage}</span>
            </div>
          )}

          {/* Receipt Breakdown */}
          <div className="border-t border-[#E7E3DC] pt-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
              Order Summary
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between text-xs text-[#57534E]">
                  <div>
                    <span className="font-semibold text-[#1C1917]">{item.quantity}x</span> {item.dish.name}
                  </div>
                  <span className="font-mono tabular-nums text-[#1C1917]">₹{item.itemTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#F5F2EB] space-y-1 text-xs text-[#57534E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thermal Delivery</span>
                <span className="font-mono tabular-nums">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Courier Tip</span>
                <span className="font-mono tabular-nums">₹{order.tip.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotion Savings</span>
                  <span className="font-mono tabular-nums">-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#1C1917] pt-1">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E7E3DC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
