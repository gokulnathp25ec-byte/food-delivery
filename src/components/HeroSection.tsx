import React from 'react';
import { Search, Flame, Sparkles, ShieldCheck, Timer } from 'lucide-react';
import { HERO_IMAGE } from '../data/dishes';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDietary: string;
  onSelectDietary: (tag: string) => void;
  onExploreMenu: () => void;
}

const DIETARY_TAGS = ['All Dishes', 'Chef Signature', 'Vegetarian', 'High Protein', 'Gluten-Free Option'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedDietary,
  onSelectDietary,
  onExploreMenu,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-[#E7E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Value Proposition & Search */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quiet 1-line kicker (no pill boxes) */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9531E]">
              <Flame className="w-4 h-4 text-[#D9531E]" />
              <span>Independent Chef Kitchens · Dispatched Fresh</span>
            </div>

            {/* Display Headline with balanced text */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif-display font-bold tracking-tight text-[#1C1917] leading-[1.12] [text-wrap:balance]">
              Artisan dining, prepared to order & delivered warm.
            </h1>

            {/* Body Prose with strict measure */}
            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-xl font-normal">
              Skip industrial conveyor kitchens. We partner exclusively with boutique culinarians—48-hour fermented sourdough, prime dry-aged Wagyu, and wild glacier salmon—transported in climate-controlled thermal bags within 35 minutes.
            </p>

            {/* Interactive Search Bar */}
            <div className="space-y-3 pt-2">
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search dishes, ingredients (e.g. Wagyu, Truffle, Burrata)..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E7E3DC] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#D9531E]/20 focus:border-[#D9531E] transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#1C1917] px-2 py-0.5"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Segmented Dietary Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {DIETARY_TAGS.map((tag) => {
                  const isActive = selectedDietary === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => onSelectDietary(tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#1C1917] text-white shadow-xs'
                          : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#E7E3DC] hover:border-[#D6D3D1]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Claim-to-Proof Adjacency: Quantitative rigor & units */}
            <div className="pt-4 border-t border-[#E7E3DC] grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#57534E] font-medium mb-0.5">
                  <Timer className="w-3.5 h-3.5 text-[#D9531E]" />
                  <span>Door-to-door</span>
                </div>
                <div className="text-lg font-serif-display font-bold text-[#1C1917] tabular-nums">
                  28–34 min
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#57534E] font-medium mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D9531E]" />
                  <span>Oven Heat</span>
                </div>
                <div className="text-lg font-serif-display font-bold text-[#1C1917] tabular-nums">
                  145°F Held
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#57534E] font-medium mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9531E]" />
                  <span>Packaging</span>
                </div>
                <div className="text-lg font-serif-display font-bold text-[#1C1917]">
                  100% Eco
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E7E3DC] aspect-[16/10] bg-[#EFECE6] group">
              <img
                src={HERO_IMAGE}
                alt="Artisanal food delivery spread featuring Neapolitan wood-fired pizza and Wagyu smash burger"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-white/80 uppercase tracking-wider font-semibold mb-1">
                    Featured Collection
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-white leading-tight">
                    Seasonal Autumn Craft Menu
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-sm">
                    Handmade Neapolitan crusts, dry-aged beef & chilled wild salmon.
                  </p>
                </div>

                <button
                  onClick={onExploreMenu}
                  className="shrink-0 px-4 py-2.5 text-xs font-semibold text-[#1C1917] bg-white hover:bg-stone-100 rounded-lg shadow-md transition-colors whitespace-nowrap"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
