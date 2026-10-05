export type CuisineCategory =
  | 'all'
  | 'woodfire'
  | 'wagyu-burgers'
  | 'bowls-greens'
  | 'patisserie'
  | 'artisan-drinks';

export interface CustomizationChoice {
  label: string;
  priceDelta: number;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  required: boolean;
  multiSelect: boolean;
  maxSelect?: number;
  choices: CustomizationChoice[];
}

export interface Dish {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  kitchen: string;
  kitchenDistance: string;
  prepTime: string;
  category: CuisineCategory;
  cuisine: string;
  dietary: string[];
  calories: number;
  rating: number;
  reviewCount: number;
  image: string;
  chefQuote?: string;
  customizationGroups: CustomizationGroup[];
}

export interface CartItem {
  cartItemId: string;
  dish: Dish;
  quantity: number;
  selectedChoices: Record<string, string[]>;
  specialInstructions: string;
  itemTotal: number;
}

export type OrderStatus = 'placed' | 'kitchen_prep' | 'courier_picked' | 'delivered';

export interface Order {
  id: string;
  createdAt: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  status: OrderStatus;
  estimatedMinutes: number;
  deliveryAddress: string;
  deliveryInstructions: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'card' | 'apple_pay' | 'cash';
  courier: {
    name: string;
    rating: number;
    deliveriesCount: number;
    vehicle: string;
    phone: string;
  };
}
