import { BrightwashScent, BrightwashVariant, MachineProduct, RegionOption } from '../types';

export const TERMS_AND_CONDITIONS_TEXT = `TERMS AND CONDITIONS

1. Order Confirmation – By placing an order, the customer confirms that they understand and accept the product details, specifications, and agreed price of the Pur Vendo Machine.
2. Defective or Damaged Product – If the machine arrives broken, damaged, or defective due to manufacturing or delivery issues, the customer must notify the seller within seven (7) days upon receiving the product.
3. Return Policy – Customers may request a return if the machine is proven to have manufacturing defects, technical malfunctions, or damage upon delivery. The seller must be contacted first before returning the product.
4. Refund Policy – A full refund may be granted if the machine is confirmed to be defective and cannot be repaired or replaced. Refunds will be processed through an agreed payment method.
5. Replacement Policy – If the machine is defective, the customer may request a replacement, subject to product availability.
6. Shipping Fees – Return shipping fees for verified defective or damaged products will be shouldered by the seller. For returns due to reasons not caused by the seller, shipping expenses may be shouldered by the customer, subject to applicable consumer laws.
7. Warranty Exclusions – Damages caused by misuse, negligence, unauthorized repairs, or improper handling are not covered by the seller's voluntary warranty, without affecting the customer's rights under applicable laws.
8. Customer Responsibility – The customer is encouraged to inspect the machine immediately upon delivery and provide photos or videos as proof if any damage or defect is found.

By proceeding with the order, the customer acknowledges that they have read, understood, and agreed to all the terms and conditions stated above.`;

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/19w4G2tjQh/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/refilla2026?dlrf=MWp4NDNlaTQzNGdtYQ==',
  tiktok: 'https://www.tiktok.com/@refillaaaaa?_r=1&_t=ZS-9B69RwsHnEL'
};

export const MACHINE_PRODUCT: MachineProduct = {
  id: 'quickfill-kart',
  name: 'QuickFill Kart',
  tagline: 'Refill More, Waste Less • Coin-Operated Dishwashing Liquid Vending Machine by Refilla',
  price: 7999,
  originalPrice: 10999,
  discountPercent: 27,
  colors: [
    {
      id: 'green',
      name: 'Eco Green',
      hex: '#16a34a',
      image: '/images/machine-green-v2.jpg',
      badge: 'Main Flagship Kart'
    },
    {
      id: 'blue',
      name: 'Vibrant Blue',
      hex: '#0284c7',
      image: '/images/machine-blue.jpg',
      badge: 'Classic Choice'
    },
    {
      id: 'pink',
      name: 'Pastel Pink',
      hex: '#ec4899',
      image: '/images/machine-pink.jpg',
      badge: 'Modern Aesthetic'
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      hex: '#9333ea',
      image: '/images/machine-purple.jpg',
      badge: 'Bold Edition'
    },
    {
      id: 'yellow',
      name: 'Sunny Yellow',
      hex: '#eab308',
      image: '/images/machine-yellow.jpg',
      badge: 'High Visibility'
    }
  ],
  specifications: {
    type: 'Coin-operated dishwashing liquid vending machine',
    dispensingVolumes: '₱5 = 200 ml, ₱8 = 400 ml, ₱15 = 600 ml, ₱20 = 1 L',
    counter: 'Digital counter with illuminated power switch',
    doorLock: 'Lockable front door with heavy-duty padlock included',
    cabinet: 'Heavy-duty steel cabinet on raised legs with a dedicated bottle tray',
    power: 'Standard 220V AC low-consumption power module',
    capacity: 'Built-in 30-liter internal refilling liquid reservoir',
    warranty: '1-Year Official Voluntary Factory Warranty'
  }
};

export const BRIGHTWASH_SCENTS: BrightwashScent[] = [
  {
    id: 'lemon',
    name: 'Lemon Citrus',
    colorName: 'Sunny Yellow',
    badge: 'Best Seller',
    hex: '#eab308',
    image: '/images/brightwash-yellow.jpg',
    accentBg: 'bg-yellow-50 text-yellow-900 border-yellow-200'
  },
  {
    id: 'fresh-blue',
    name: 'Fresh Blue Anti-Bac',
    colorName: 'Clean Blue',
    badge: 'Popular',
    hex: '#0284c7',
    image: '/images/brightwash-blue.jpg',
    accentBg: 'bg-blue-50 text-blue-900 border-blue-200'
  },
  {
    id: 'calamansi',
    name: 'Calamansi Fresh',
    colorName: 'Natural Green',
    badge: 'Eco Fresh',
    hex: '#16a34a',
    image: '/images/brightwash-green-v2.jpg',
    accentBg: 'bg-green-50 text-green-900 border-green-200'
  }
];

export const BRIGHTWASH_VARIANTS: BrightwashVariant[] = [
  {
    size: '15L',
    title: '15-Liter Master Commercial Pack',
    price: 299,
    originalPrice: 399,
    yieldDescription: 'Just add water, makes 15 liters of high-foaming concentrated dishwashing liquid.'
  },
  {
    size: '3L',
    title: '3-Liter Trial Starter Pack',
    price: 89,
    originalPrice: 120,
    yieldDescription: 'Just add water, makes 3 liters of gentle grease-cutting dishwashing soap.'
  }
];

export const VENDO_PRICE_TABLE = [
  { coin: '₱5.00', volume: '200 ml', bestFor: 'Small household daily refill' },
  { coin: '₱8.00', volume: '400 ml', bestFor: 'Medium bottle refill' },
  { coin: '₱15.00', volume: '600 ml', bestFor: 'Standard tumbler / dispenser' },
  { coin: '₱20.00', volume: '1 Liter (1,000 ml)', bestFor: 'Full 1-Liter family jug refill' }
];

export const DELIVERY_TIMES_TABLE = [
  { region: 'Luzon', days: '1–5 business days', note: 'Metro Manila deliveries typically arrive within 1–2 days' },
  { region: 'Visayas', days: '3–7 business days', note: 'Direct wooden-crate freight via J&T Cargo' },
  { region: 'Mindanao', days: '3–7 business days', note: 'Secured freight handling across major cities and provinces' }
];

export const REGION_SHIPPING_FEES: Record<RegionOption, number> = {
  Luzon: 250,
  Visayas: 450,
  Mindanao: 500
};

export const FAQ_LIST = [
  {
    question: 'How does the QuickFill Kart work?',
    answer: 'The QuickFill Kart by Refilla is a coin-operated liquid dispenser. Customers bring their own bottle, place it under the dispensing nozzle onto the bottle tray, insert the exact coin (₱5, ₱8, ₱15, or ₱20), and the machine automatically pours the corresponding volume.'
  },
  {
    question: 'How do you prepare the Brightwash powder refill?',
    answer: 'Preparing Brightwash is simple: just add clean tap water! Empty the powder pack into your mixing container, add 15 liters of water (for the 15L pack) or 3 liters (for the 3L pack), stir gently until dissolved, and pour into the machine’s internal reservoir.'
  },
  {
    question: 'Is Brightwash powder safe for hands and dishes?',
    answer: 'Yes! Brightwash is formulated with biodegradable plant-derived surfactants that cut through 100% of grease and food odor while remaining gentle on hands and skin.'
  },
  {
    question: 'Is the QuickFill Kart secure against theft and weather?',
    answer: 'The QuickFill Kart is built with a heavy-duty steel cabinet, elevated on sturdy raised legs, and equipped with a lockable front door featuring a secure padlock. It is engineered for indoor or covered outdoor placement.'
  },
  {
    question: 'What is the estimated delivery time for my area?',
    answer: 'For Luzon customers, delivery is 1–5 business days. For Visayas and Mindanao, delivery is 3–7 business days via reliable cargo freight partners with full wooden crating.'
  },
  {
    question: 'What warranty is included with the QuickFill Kart?',
    answer: 'Every QuickFill Kart comes with a 1-Year Voluntary Factory Warranty covering the digital counter, coin mechanism, and internal dispensing solenoid.'
  }
];

