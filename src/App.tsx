/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DISHES } from './data/dishes';
import { Dish, CartItem, CuisineCategory, Order, OrderStatus } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DishCard } from './components/DishCard';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { KitchensSection } from './components/KitchensSection';
import { StandardsSection } from './components/StandardsSection';
import { Footer } from './components/Footer';
import { Filter, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';

const CATEGORY_TABS: { id: CuisineCategory; label: string }[] = [
  { id: 'all', label: 'All Dishes' },
  { id: 'wagyu-burgers', label: 'Wagyu & Burgers' },
  { id: 'woodfire', label: 'Wood-Fired Neapolitan' },
  { id: 'bowls-greens', label: 'Raw Bowls & Greens' },
  { id: 'patisserie', label: 'Patisserie & Sweets' },
];

export default function App() {
  // Navigation & Location state
  const [currentAddress, setCurrentAddress] = useState('742 Evergreen Terrace, Downtown');

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CuisineCategory>('all');
  const [selectedDietary, setSelectedDietary] = useState('All Dishes');
  const [selectedKitchen, setSelectedKitchen] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'speed'>('popular');

  // Cart & Order State
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Start with 1 sample item so user can immediately inspect the bag functionality
    const defaultDish = DISHES[0];
    return [
      {
        cartItemId: 'sample-wagyu-1',
        dish: defaultDish,
        quantity: 1,
        selectedChoices: {
          doneness: ['Medium Rare (Juicy center & crisp edge)'],
          sides: ['Rosemary Sea Salt Frites'],
          extras: ['Smoked Berkshire Bacon Slab'],
        },
        specialInstructions: 'Extra crispy fries please!',
        itemTotal: 22.5,
      },
    ];
  });

  // Modal Dialogs state
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Active Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Checkout payload transfer
  const [checkoutPromoTitle, setCheckoutPromoTitle] = useState<string | null>(null);
  const [checkoutPromoDiscount, setCheckoutPromoDiscount] = useState<number>(0);
  const [checkoutTip, setCheckoutTip] = useState<number>(3.38);

  // Filter and sort dishes
  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      // Category filter
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }
      // Kitchen filter
      if (selectedKitchen && dish.kitchen !== selectedKitchen) {
        return false;
      }
      // Dietary filter
      if (selectedDietary !== 'All Dishes' && !dish.dietary.includes(selectedDietary)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesKitchen = dish.kitchen.toLowerCase().includes(query);
        const matchesCuisine = dish.cuisine.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesKitchen && !matchesCuisine) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'speed') {
        const minA = parseInt(a.prepTime.split('–')[0]);
        const minB = parseInt(b.prepTime.split('–')[0]);
        return minA - minB;
      }
      // Default: popular (rating & review count)
      return b.rating * b.reviewCount - a.rating * a.reviewCount;
    });
  }, [selectedCategory, selectedKitchen, selectedDietary, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.dish.id === newItem.dish.id &&
          JSON.stringify(i.selectedChoices) === JSON.stringify(newItem.selectedChoices) &&
          i.specialInstructions === newItem.specialInstructions
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + newItem.quantity;
        const unitPrice = current.itemTotal / current.quantity;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          itemTotal: unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const handleQuickAdd = (dish: Dish) => {
    // Construct default required selections
    const defaultChoices: Record<string, string[]> = {};
    dish.customizationGroups.forEach((group) => {
      if (group.required && group.choices.length > 0) {
        defaultChoices[group.id] = [group.choices[0].label];
      } else {
        defaultChoices[group.id] = [];
      }
    });

    const newItem: CartItem = {
      cartItemId: `${dish.id}-${Date.now()}`,
      dish,
      quantity: 1,
      selectedChoices: defaultChoices,
      specialInstructions: '',
      itemTotal: dish.price,
    };

    handleAddToCart(newItem);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice = item.itemTotal / item.quantity;
          return {
            ...item,
            quantity: newQty,
            itemTotal: unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleProceedToCheckout = (
    promoTitle: string | null,
    promoDiscount: number,
    tip: number
  ) => {
    setCheckoutPromoTitle(promoTitle);
    setCheckoutPromoDiscount(promoDiscount);
    setCheckoutTip(tip);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart after successful order
    setIsCheckoutOpen(false);
    setSelectedOrderForTracking(newOrder);
    setIsOrderTrackerOpen(true);
  };

  const handleAdvanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    if (selectedOrderForTracking && selectedOrderForTracking.id === orderId) {
      setSelectedOrderForTracking((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrderCount={orders.length}
        onOpenActiveOrder={() => {
          if (orders.length > 0) {
            setSelectedOrderForTracking(orders[0]);
            setIsOrderTrackerOpen(true);
          }
        }}
        currentAddress={currentAddress}
        onChangeAddress={setCurrentAddress}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1">
        {/* Campaign Hero Showcase with Search & Fast Dietary Filters */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDietary={selectedDietary}
          onSelectDietary={setSelectedDietary}
          onExploreMenu={() => handleNavigateSection('menu-catalog')}
        />

        {/* Catalog & Filter Navigation Bar */}
        <section id="menu-catalog" className="py-8 sm:py-12 border-b border-[#E7E3DC] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F5F2EB]">
              {/* Category Segmented Controls (Interactive Filter Buttons) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#1C1917] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] hover:bg-stone-200/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Controls: Kitchen active indicator & Sort selection */}
              <div className="flex items-center gap-3">
                {selectedKitchen && (
                  <div className="flex items-center gap-2 text-xs text-[#1C1917] bg-[#FAF8F5] border border-[#E7E3DC] px-3 py-1.5 rounded-lg">
                    <span>Kitchen: <strong className="font-semibold">{selectedKitchen}</strong></span>
                    <button
                      onClick={() => setSelectedKitchen(null)}
                      className="text-stone-400 hover:text-stone-900 font-bold ml-1"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-[#57534E]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#78716C]" />
                  <span className="font-medium hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg px-2.5 py-1.5 text-xs text-[#1C1917] font-medium focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                  >
                    <option value="popular">Chef Curated (Popular)</option>
                    <option value="speed">Fastest Dispatch</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Catalog Grid Header Count */}
            <div className="flex items-center justify-between pt-6 pb-6">
              <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-[#1C1917]">
                {selectedCategory === 'all'
                  ? 'All Chef Selections'
                  : CATEGORY_TABS.find((t) => t.id === selectedCategory)?.label}
              </h2>
              <span className="text-xs text-[#78716C] font-mono tabular-nums">
                Showing {filteredDishes.length} dishes
              </span>
            </div>

            {/* Product Cards Grid: 3-column desktop / 2-column tablet */}
            {filteredDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onSelectDish={(d) => setCustomizingDish(d)}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E7E3DC] p-8">
                <UtensilsCrossed className="w-10 h-10 text-[#A8A29E] mx-auto mb-3" />
                <h3 className="font-serif-display font-bold text-lg text-[#1C1917]">
                  No culinary items found
                </h3>
                <p className="text-xs text-[#57534E] mt-1 max-w-sm mx-auto">
                  No dishes match the selected category or search term &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDietary('All Dishes');
                    setSelectedKitchen(null);
                  }}
                  className="mt-4 px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-[#D9531E] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Artisan Kitchens Spotlight Section */}
        <KitchensSection
          selectedKitchen={selectedKitchen}
          onSelectKitchen={(k) => {
            setSelectedKitchen(k);
            handleNavigateSection('menu-catalog');
          }}
        />

        {/* Thermal Dispatch Standards & FAQ */}
        <StandardsSection />
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* Dish Customization Modal */}
      <CustomizationModal
        dish={customizingDish}
        onClose={() => setCustomizingDish(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        defaultAddress={currentAddress}
        promoTitle={checkoutPromoTitle}
        promoDiscount={checkoutPromoDiscount}
        tipAmount={checkoutTip}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        order={selectedOrderForTracking}
        onAdvanceStatus={handleAdvanceOrderStatus}
      />
    </div>
  );
}
