import React, { useState } from 'react';
import { Plus, Star, Utensils } from 'lucide-react';
import { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
  onSelectDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  onSelectDish,
  onQuickAdd,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group bg-white rounded-xl border border-[#E7E3DC] hover:border-[#D6D3D1] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col h-full overflow-hidden">
      {/* Product Image Slot (65-70% visual focus) */}
      <div
        onClick={() => onSelectDish(dish)}
        className="relative aspect-[4/3] bg-[#EFECE6] overflow-hidden cursor-pointer"
      >
        {!imageError ? (
          <img
            src={dish.image}
            alt={dish.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <Utensils className="w-8 h-8 mb-2 opacity-50 text-[#D9531E]" />
            <span className="text-xs font-medium text-stone-600">{dish.name}</span>
          </div>
        )}

        {/* Quiet discount or signature tag - unboxed or clean label */}
        {dish.originalPrice && (
          <div className="absolute top-3 left-3 bg-[#1C1917]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
            Special Value
          </div>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold tabular-nums">{dish.rating.toFixed(2)}</span>
          <span className="text-white/70 text-[10px]">({dish.reviewCount})</span>
        </div>
      </div>

      {/* Card Content Module */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Kitchen / Artisan Attribution */}
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] mb-1">
            {dish.kitchen}
          </div>

          {/* Dish Title */}
          <h3
            onClick={() => onSelectDish(dish)}
            className="text-base sm:text-lg font-serif-display font-bold text-[#1C1917] group-hover:text-[#D9531E] transition-colors cursor-pointer leading-snug"
          >
            {dish.name}
          </h3>

          {/* Tagline / Ingredients */}
          <p className="text-xs text-[#57534E] line-clamp-2 mt-1 leading-relaxed">
            {dish.tagline}
          </p>

          {/* Clean Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs text-[#78716C] mt-2.5 font-medium">
            <span>{dish.prepTime}</span>
            <span aria-hidden="true">·</span>
            <span>{dish.calories} kcal</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{dish.cuisine}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 mt-3 border-t border-[#F5F2EB] flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold font-mono text-[#1C1917] tabular-nums">
              ${dish.price.toFixed(2)}
            </span>
            {dish.originalPrice && (
              <span className="text-xs font-mono text-[#A8A29E] line-through tabular-nums">
                ${dish.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectDish(dish)}
              className="px-3 py-1.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg transition-colors whitespace-nowrap"
            >
              Customize
            </button>
            <button
              onClick={() => onQuickAdd(dish)}
              title="Quick Add to Cart"
              className="p-1.5 bg-[#1C1917] hover:bg-[#D9531E] text-white rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
