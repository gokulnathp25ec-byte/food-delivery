import React, { useState } from 'react';
import { ShieldCheck, Thermometer, Leaf, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How do you keep hot pizzas and cold poke fresh during the same delivery?',
    a: 'Our couriers utilize dual-compartment insulated bags engineered with Phase Change Material (PCM) dividers. The hot chamber maintains a minimum of 145°F (63°C) to keep crusts blistered and cheese melted, while the cold bay stays at 38°F (3°C) with dry cooling plates to ensure sushi and crudo remain crisp and safe.',
  },
  {
    q: 'What is your delivery radius and turnaround commitment?',
    a: 'We intentionally limit our dispatch radius to a tight 3.5-mile perimeter around our kitchen partners. This guarantees that no dish is on the road longer than 18 minutes from oven to threshold.',
  },
  {
    q: 'Are your packaging materials genuinely biodegradable?',
    a: 'Yes. Every container is pressed from unbleached bagasse sugarcane fiber and FSC-certified unbleached Kraft cardboard printed with soy inks. They break down in municipal compost within 60 days without microplastic residue.',
  },
  {
    q: 'Can I request contactless delivery and specific courier notes?',
    a: 'During checkout, you can specify exact instructions (gate codes, floor drops, doorman hand-off, or "do not ring doorbell"). Once dispatched, you have direct one-click SMS and phone connectivity with your courier.',
  },
];

export const StandardsSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section id="standards" className="py-14 sm:py-20 border-b border-[#E7E3DC] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Standards Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9531E] mb-2">
            <ShieldCheck className="w-4 h-4 text-[#D9531E]" />
            <span>The Culinary Integrity Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917] tracking-tight">
            Thermal precision from kitchen pass to dining table.
          </h2>
          <p className="text-sm text-[#57534E] mt-2">
            A great dish destroyed by cold condensation or prolonged transit is a tragedy. We redesigned the logistics layer to treat food with kitchen respect.
          </p>
        </div>

        {/* 3 Pillars of Dispatch */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E7E3DC] flex items-center justify-center text-[#D9531E]">
              <Thermometer className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#1C1917]">
              Dual-Chamber PCM Heating
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Every cargo unit maintains hot items at &ge; 145°F while simultaneously isolating cold salads and tarts at 38°F. Zero steam sogginess.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E7E3DC] flex items-center justify-center text-[#D9531E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#1C1917]">
              Direct Single-Drop Routing
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Our couriers never multi-batch orders from five disparate locations. When your order is bagged, the courier rides directly to your address with zero detour stops.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E7E3DC] flex items-center justify-center text-[#D9531E]">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display font-bold text-lg text-[#1C1917]">
              Sugarcane Fiber Packaging
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              100% plant-based sugarcane pulp bowls, unbleached kraft pizza sleeves, and compostable tamper-evident adhesive seals. No styrofoam, zero single-use plastics.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div id="faq" className="max-w-3xl mx-auto pt-6 border-t border-[#E7E3DC]">
          <h3 className="font-serif-display font-bold text-xl text-[#1C1917] mb-6 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-[#E7E3DC] bg-[#FAF8F5] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-4 font-semibold text-sm text-[#1C1917] hover:text-[#D9531E] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#78716C] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#D9531E]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4.5 pb-4 pt-1 text-xs text-[#57534E] leading-relaxed border-t border-[#E7E3DC]/60 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
