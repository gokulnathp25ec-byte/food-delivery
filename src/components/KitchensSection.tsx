import React from 'react';
import { Star, MapPin, ChefHat, ArrowUpRight } from 'lucide-react';
import { KITCHENS } from '../data/dishes';

interface KitchensSectionProps {
  selectedKitchen: string | null;
  onSelectKitchen: (kitchenName: string | null) => void;
}

export const KitchensSection: React.FC<KitchensSectionProps> = ({
  selectedKitchen,
  onSelectKitchen,
}) => {
  return (
    <section id="kitchens" className="py-14 sm:py-20 border-b border-[#E7E3DC] bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9531E] mb-1.5">
              <ChefHat className="w-4 h-4 text-[#D9531E]" />
              <span>Independent Craft Kitchens</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917] tracking-tight">
              Partner Culinarists & Dedicated Ateliers
            </h2>
            <p className="text-sm text-[#57534E] mt-1 max-w-xl">
              We do not work with industrial ghost kitchens. Each partner is an established brick-and-mortar atelier running specialized woodfire ovens, dry-aging rooms, or cold-raw prep stations.
            </p>
          </div>

          {selectedKitchen && (
            <button
              onClick={() => onSelectKitchen(null)}
              className="text-xs text-[#D9531E] hover:underline font-semibold self-start md:self-auto"
            >
              Reset Kitchen Filter (Showing All)
            </button>
          )}
        </div>

        {/* 4-Kitchen Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {KITCHENS.map((kitchen) => {
            const isSelected = selectedKitchen === kitchen.name;

            return (
              <div
                key={kitchen.id}
                onClick={() => onSelectKitchen(isSelected ? null : kitchen.name)}
                className={`group bg-white rounded-xl border p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1C1917] ring-2 ring-[#1C1917]/10'
                    : 'border-[#E7E3DC] hover:border-[#D6D3D1]'
                }`}
              >
                <div>
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-stone-100 mb-3.5">
                    <img
                      src={kitchen.image}
                      alt={kitchen.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold tabular-nums">{kitchen.rating.toFixed(2)}</span>
                    </div>
                  </div>

                  <h3 className="font-serif-display font-bold text-base text-[#1C1917] group-hover:text-[#D9531E] transition-colors leading-snug">
                    {kitchen.name}
                  </h3>
                  <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                    {kitchen.specialty}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-[#78716C]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D9531E]" />
                    <span>{kitchen.distance}</span>
                  </div>

                  <span className="font-medium text-[#1C1917] group-hover:text-[#D9531E] flex items-center gap-0.5">
                    {isSelected ? 'Viewing' : 'View Menu'}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
