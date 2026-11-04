// ─── AUTH & ROLE TYPES ─────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'seller';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role?: UserRole;
  phone?: string;
  createdAt: string;
  agreedToPrivacy: boolean;
}

export type AuthView = 'sign-in' | 'sign-up';

// ─── PRODUCT / CART TYPES ───────────────────────────────────────────────────────
export type ScentOption = 'lemon' | 'fresh-blue' | 'calamansi';
export type MachineColor = 'blue' | 'pink' | 'purple' | 'yellow' | 'green';
export type BrightwashSize = '15L' | '3L';
export type RegionOption = 'Luzon' | 'Visayas' | 'Mindanao';

export interface BrightwashScent {
  id: ScentOption;
  name: string;
  colorName: string;
  badge: string;
  hex: string;
  image: string;
  accentBg: string;
}

export interface BrightwashVariant {
  size: BrightwashSize;
  title: string;
  price: number;
  originalPrice: number;
  yieldDescription: string;
}

export interface MachineProduct {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  colors: {
    id: MachineColor;
    name: string;
    hex: string;
    image: string;
    badge: string;
  }[];
  specifications: {
    type: string;
    dispensingVolumes: string;
    counter: string;
    doorLock: string;
    cabinet: string;
    power: string;
    capacity: string;
    warranty: string;
  };
}

export interface CartItem {
  id: string; // unique item id in cart
  productId: 'machine' | 'brightwash';
  title: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: MachineColor;
  includedFreeScent?: ScentOption;
  selectedScent?: ScentOption;
  selectedSize?: BrightwashSize;
}

export type PaymentMethod = 'card' | 'gcash' | 'maya' | 'cod';

export interface SellerPaymentSettings {
  gcashNumber: string;
  gcashAccountName: string;
  gcashQrImage?: string;
  mayaNumber: string;
  mayaAccountName: string;
  paymongoSecretKey?: string;
}

export interface CustomerDeliveryDetails {
  fullName: string;
  phone: string;
  email: string;
  region: RegionOption;
  cityProvince: string;
  barangay?: string;
  postalCode?: string;
  completeAddress: string;
  notes?: string;
}

export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  region: RegionOption;
  estimatedDeliveryDate: string;
  customer: CustomerDeliveryDetails;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentSenderNumber?: string;
  paymentProofImage?: string;
  paymentVerified?: boolean;
  agreedToTerms: boolean;
  currentStatus: OrderStatus;
  sellerNote?: string;
  timeline: TrackingStep[];
}

// ─── CLOUD CHAT / MESSAGING TYPES ───────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  threadId: string; // customer email (lowercase)
  customerName: string;
  customerEmail: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  orderId?: string;
  createdAt: string;
  readBySeller: boolean;
  readByCustomer: boolean;
}

export type NavigationPage = 
  | 'home' 
  | 'shop-machine' 
  | 'shop-brightwash' 
  | 'how-it-works' 
  | 'faq' 
  | 'my-orders'
  | 'track-order' 
  | 'checkout' 
  | 'procurement'
  | 'seller-dashboard';
