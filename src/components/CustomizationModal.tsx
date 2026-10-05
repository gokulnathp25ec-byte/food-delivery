import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles, ChefHat } from 'lucide-react';
import { Dish, CartItem } from '../types';

interface CustomizationModalProps {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  dish,
  onClose,
  onAddToCart,
}) => {
  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    dish.customizationGroups.forEach((group) => {
      if (group.required && group.choices.length > 0) {
        // Pre-select first choice if required single-select
        initial[group.id] = [group.choices[0].label];
      } else {
        initial[group.id] = [];
      }
    });
    return initial;
  });
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate total item price
  const calculateTotal = () => {
    let base = dish.price;
    dish.customizationGroups.forEach((group) => {
      const selectedForGroup = selectedChoices[group.id] || [];
      group.choices.forEach((choice) => {
        if (selectedForGroup.includes(choice.label)) {
          base += choice.priceDelta;
        }
      });
    });
    return base * quantity;
  };

  const handleChoiceToggle = (groupId: string, choiceLabel: string, multiSelect: boolean, maxSelect?: number) => {
    setSelectedChoices((prev) => {
      const current = prev[groupId] || [];
      if (!multiSelect) {
        return { ...prev, [groupId]: [choiceLabel] };
      }
      if (current.includes(choiceLabel)) {
        return { ...prev, [groupId]: current.filter((c) => c !== choiceLabel) };
      }
      if (maxSelect && current.length >= maxSelect) {
        return prev;
      }
      return { ...prev, [groupId]: [...current, choiceLabel] };
    });
  };

  const handleConfirm = () => {
    const itemTotal = calculateTotal();
    const cartItemId = `${dish.id}-${Date.now()}`;
    const newItem: CartItem = {
      cartItemId,
      dish,
      quantity,
      selectedChoices,
      specialInstructions: specialInstructions.trim(),
      itemTotal,
    };
    onAddToCart(newItem);
    onClose();
  };

  const finalTotal = calculateTotal();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E7E3DC] flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header Bar */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#EFECE6] overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-xs"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Kitchen Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="text-xs uppercase tracking-wider text-stone-300 font-semibold mb-0.5">
              {dish.kitchen} · {dish.prepTime}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-display font-bold leading-tight">
              {dish.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Tagline & Chef Description */}
          <div className="space-y-3">
            <p className="text-sm text-[#57534E] leading-relaxed">
              {dish.description}
            </p>

            {dish.chefQuote && (
              <div className="bg-[#FAF8F5] border-l-2 border-[#D9531E] p-3 rounded-r-lg flex items-start gap-2.5 text-xs text-[#57534E] italic">
                <ChefHat className="w-4 h-4 text-[#D9531E] shrink-0 mt-0.5 not-italic" />
                <span>&ldquo;{dish.chefQuote}&rdquo;</span>
              </div>
            )}

            {/* Dietary Tags unboxed */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C]">
              {dish.dietary.map((d, idx) => (
                <React.Fragment key={d}>
                  <span className="font-medium text-[#1C1917]">{d}</span>
                  {idx < dish.dietary.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Customization Option Groups */}
          <div className="space-y-6 pt-2 border-t border-[#F5F2EB]">
            {dish.customizationGroups.map((group) => {
              const currentSelected = selectedChoices[group.id] || [];

              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#1C1917]">
                        {group.name}
                      </h4>
                      <p className="text-xs text-[#78716C]">
                        {group.required ? 'Required choice' : group.multiSelect ? `Optional (Select up to ${group.maxSelect || 'any'})` : 'Optional'}
                      </p>
                    </div>
                    {group.required && (
                      <span className="text-[11px] font-semibold text-[#D9531E] bg-[#D9531E]/10 px-2 py-0.5 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {group.choices.map((choice) => {
                      const isSelected = currentSelected.includes(choice.label);

                      return (
                        <button
                          key={choice.label}
                          type="button"
                          onClick={() => handleChoiceToggle(group.id, choice.label, group.multiSelect, group.maxSelect)}
                          className={`w-full text-left px-3.5 py-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'border-[#1C1917] bg-[#FAF8F5] text-[#1C1917] font-medium'
                              : 'border-[#E7E3DC] hover:border-[#D6D3D1] text-[#57534E]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-${group.multiSelect ? 'md' : 'full'} border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-[#1C1917] bg-[#1C1917] text-white'
                                  : 'border-[#D6D3D1] bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{choice.label}</span>
                          </div>

                          {choice.priceDelta > 0 && (
                            <span className="font-mono text-xs font-semibold text-[#1C1917] tabular-nums">
                              +₹{choice.priceDelta.toFixed(2)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Special Instructions Note */}
            <div className="space-y-2 pt-2">
              <label htmlFor="instructions" className="block text-sm font-semibold text-[#1C1917]">
                Special Instructions
              </label>
              <textarea
                id="instructions"
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="E.g. Dressing on side, extra napkins, allergy notification..."
                className="w-full p-3 text-xs bg-white border border-[#E7E3DC] rounded-xl text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#D9531E]/20 focus:border-[#D9531E] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer Action Bar */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E7E3DC] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-[#E7E3DC]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1 text-[#57534E] hover:text-[#1C1917] disabled:opacity-30 disabled:hover:text-[#57534E]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-bold text-[#1C1917] tabular-nums min-w-[16px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-[#57534E] hover:text-[#1C1917]"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-6 bg-[#1C1917] hover:bg-[#D9531E] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Add to Order</span>
            <span>·</span>
            <span className="font-mono tabular-nums">₹{finalTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
