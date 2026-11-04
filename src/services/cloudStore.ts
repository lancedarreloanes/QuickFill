import { ChatMessage, Order, OrderStatus, SellerPaymentSettings, UserAccount, UserRole } from '../types';

export interface CloudDatabaseState {
  users: UserAccount[];
  passwords: Record<string, string>;
  orders: Order[];
  messages: ChatMessage[];
  paymentSettings: SellerPaymentSettings;
  updatedAt: number;
}

const STORAGE_KEY = 'refilla_cloud_db_v1';
const CHANNEL_NAME = 'refilla_cloud_realtime_channel';
const CLOUD_ENDPOINT = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CLOUD_DB_URL || '/api/cloud';

const OFFICIAL_SELLER_EMAIL = 'refilla_quickffill.2026@gmail.com';

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr-seller-official',
    fullName: 'Refilla Official Seller',
    email: OFFICIAL_SELLER_EMAIL,
    role: 'seller',
    phone: '09243730042',
    createdAt: '2026-11-01T08:00:00.000Z',
    agreedToPrivacy: true
  },
  {
    id: 'usr-demo-customer',
    fullName: 'Maria Santos',
    email: 'customer@quickfill.ph',
    role: 'customer',
    phone: '0917 123 4567',
    createdAt: '2026-11-01T09:00:00.000Z',
    agreedToPrivacy: true
  }
];

const DEFAULT_PASSWORDS: Record<string, string> = {
  [OFFICIAL_SELLER_EMAIL]: 'Seller2026!',
  'customer@quickfill.ph': 'QuickFill2026!'
};

const DEFAULT_PAYMENT_SETTINGS: SellerPaymentSettings = {
  gcashNumber: '+63 977 265 ••••',
  gcashAccountName: 'VI*****A M. (Refilla Official)',
  gcashQrImage: '/images/gcash-qr.jpg',
  mayaNumber: '0924-373-0042',
  mayaAccountName: 'Refilla QuickFill Official',
  paymongoSecretKey: ''
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'REF-PH-982140',
    trackingNumber: 'JNT-PH-74819201',
    createdAt: '2026-11-03 10:30 AM',
    region: 'Luzon',
    estimatedDeliveryDate: '1–5 business days (Estimated Nov 5 – Nov 8, 2026)',
    customer: {
      fullName: 'Maria Santos',
      phone: '0917 123 4567',
      email: 'customer@quickfill.ph',
      region: 'Luzon',
      cityProvince: 'Quezon City, Metro Manila',
      barangay: 'Barangay Loyola Heights',
      postalCode: '1108',
      completeAddress: 'Unit 402 Green Residences, Katipunan Ave',
      notes: 'Please call before arrival'
    },
    items: [
      {
        id: 'demo-item-green',
        productId: 'machine',
        title: 'QuickFill Kart (Eco Green) + Free 15L Brightwash Lemon Citrus',
        image: '/images/machine-green-v2.jpg',
        price: 7999,
        quantity: 1,
        selectedColor: 'green',
        includedFreeScent: 'lemon'
      }
    ],
    subtotal: 7999,
    shippingFee: 250,
    total: 8249,
    paymentMethod: 'cod',
    paymentReference: 'COD-VERIFIED',
    agreedToTerms: true,
    currentStatus: 'placed',
    sellerNote: 'Order received by Refilla Warehouse. Preparing wooden crate and Free 15L Brightwash pack.',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        description: 'Order registered and verified in Refilla Cloud.',
        timestamp: 'Nov 03, 2026 10:30 AM',
        completed: true,
        current: true
      },
      {
        status: 'packed',
        title: 'Packed & Wooden Crated',
        description: 'QuickFill Kart & Free 15L Brightwash pack prepared in secure freight packaging.',
        timestamp: 'Within 24 hours',
        completed: false,
        current: false
      },
      {
        status: 'shipped',
        title: 'Shipped to Region Hub',
        description: 'Dispatched to courier hub servicing Luzon.',
        timestamp: 'Pending dispatch',
        completed: false,
        current: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Designated courier vehicle en route to delivery address.',
        timestamp: 'Pending arrival',
        completed: false,
        current: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Customer accepts machine and receives official delivery receipt.',
        timestamp: 'Nov 5 – Nov 8, 2026',
        completed: false,
        current: false
      }
    ]
  },
  {
    id: 'REF-PH-841029',
    trackingNumber: 'JNT-PH-61920488',
    createdAt: '2026-10-28 09:15 AM',
    region: 'Luzon',
    estimatedDeliveryDate: 'Delivered on Nov 01, 2026',
    customer: {
      fullName: 'Maria Santos',
      phone: '0917 123 4567',
      email: 'customer@quickfill.ph',
      region: 'Luzon',
      cityProvince: 'Quezon City, Metro Manila',
      barangay: 'Barangay Loyola Heights',
      postalCode: '1108',
      completeAddress: 'Unit 402 Green Residences, Katipunan Ave',
      notes: 'Received at lobby guardhouse'
    },
    items: [
      {
        id: 'delivered-item-green',
        productId: 'machine',
        title: 'QuickFill Kart (Eco Green) + Free 15L Brightwash Calamansi Fresh',
        image: '/images/machine-green-v2.jpg',
        price: 7999,
        quantity: 1,
        selectedColor: 'green',
        includedFreeScent: 'calamansi'
      },
      {
        id: 'delivered-item-refill',
        productId: 'brightwash',
        title: 'Brightwash Dishwashing Powder (Calamansi Fresh) – 15L Pack',
        image: '/images/brightwash-green-v2.jpg',
        price: 299,
        quantity: 2,
        selectedScent: 'calamansi',
        selectedSize: '15L'
      }
    ],
    subtotal: 8597,
    shippingFee: 250,
    total: 8847,
    paymentMethod: 'gcash',
    paymentReference: 'GCASH-849201743',
    agreedToTerms: true,
    currentStatus: 'delivered',
    sellerNote: 'Successfully delivered and signed by Maria Santos.',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        description: 'Order registered and GCash payment verified.',
        timestamp: 'Oct 28, 2026 09:15 AM',
        completed: true,
        current: false
      },
      {
        status: 'packed',
        title: 'Packed & Wooden Crated',
        description: 'QuickFill Kart & Free 15L Brightwash pack prepared in wooden crate.',
        timestamp: 'Oct 29, 2026 02:10 PM',
        completed: true,
        current: false
      },
      {
        status: 'shipped',
        title: 'Shipped to Region Hub',
        description: 'Dispatched to J&T Cargo Quezon City Hub.',
        timestamp: 'Oct 30, 2026 11:00 AM',
        completed: true,
        current: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier rider en route to Katipunan Ave.',
        timestamp: 'Nov 01, 2026 09:40 AM',
        completed: true,
        current: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Successfully delivered and signed by Maria Santos.',
        timestamp: 'Nov 01, 2026 03:25 PM',
        completed: true,
        current: true
      }
    ]
  }
];

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome-1',
    threadId: 'customer@quickfill.ph',
    customerName: 'Maria Santos',
    customerEmail: 'customer@quickfill.ph',
    senderRole: 'seller',
    senderName: 'Refilla Official Seller',
    text: 'Welcome to Refilla! Feel free to message us here anytime about your QuickFill Kart (₱7,999 with Free 15L Brightwash Pack) or your order tracking.',
    orderId: 'REF-PH-982140',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    readBySeller: true,
    readByCustomer: false
  }
];

type Listener = (state: CloudDatabaseState) => void;

class CloudStoreService {
  private state: CloudDatabaseState;
  private listeners: Set<Listener> = new Set();
  private channel: BroadcastChannel | null = null;
  private isSyncing = false;

  constructor() {
    this.state = this.loadLocal();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (ev) => {
          if (ev.data && ev.data.updatedAt && ev.data.updatedAt > this.state.updatedAt) {
            this.state = ev.data;
            this.saveLocalOnly(this.state);
            this.notify();
          }
        };
      } catch {
        // Ignore if BroadcastChannel is blocked
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (ev) => {
        if (ev.key === STORAGE_KEY && ev.newValue) {
          try {
            const incoming: CloudDatabaseState = JSON.parse(ev.newValue);
            if (incoming.updatedAt > this.state.updatedAt) {
              this.state = incoming;
              this.notify();
            }
          } catch { }
        }
      });

      // Initial pull from Cloud Server endpoint + periodic 2.5s real-time poll
      this.pullFromCloudServer();
      setInterval(() => {
        this.pullFromCloudServer();
      }, 2500);
    }
  }

  private createInitialState(): CloudDatabaseState {
    return {
      users: DEFAULT_USERS,
      passwords: DEFAULT_PASSWORDS,
      orders: DEFAULT_ORDERS,
      messages: DEFAULT_MESSAGES,
      paymentSettings: DEFAULT_PAYMENT_SETTINGS,
      updatedAt: Date.now()
    };
  }

  private ensureDefaults(raw: CloudDatabaseState): CloudDatabaseState {
    // Only the single official company email may hold the 'seller' role
    const users: UserAccount[] = [...(raw.users || [])]
      .filter(u => u.email.toLowerCase() !== 'seller@refilla.ph')
      .map(u => ({
        ...u,
        role: (u.email.toLowerCase() === OFFICIAL_SELLER_EMAIL ? 'seller' : 'customer') as UserRole
      }));
    for (const defUser of DEFAULT_USERS) {
      if (!users.some(u => u.email.toLowerCase() === defUser.email.toLowerCase())) {
        users.push(defUser);
      }
    }
    const passwords = { ...DEFAULT_PASSWORDS, ...(raw.passwords || {}) };
    const rawOrders = raw.orders && raw.orders.length > 0 ? [...raw.orders] : [...DEFAULT_ORDERS];
    for (const defOrder of DEFAULT_ORDERS) {
      if (!rawOrders.some(o => o.id === defOrder.id)) {
        rawOrders.push(defOrder);
      }
    }
    const orders = rawOrders.map(o => ({
      ...o,
      items: o.items.map(it =>
        it.productId === 'machine'
          ? {
              ...it,
              price: 7999,
              image: it.selectedColor === 'green' ? '/images/machine-green-v2.jpg' : it.image
            }
          : it.image === '/images/brightwash-green.jpg'
            ? { ...it, image: '/images/brightwash-green-v2.jpg' }
            : it
      )
    }));
    const messages = raw.messages && raw.messages.length > 0 ? raw.messages : DEFAULT_MESSAGES;
    const rawPay = raw.paymentSettings || ({} as Partial<SellerPaymentSettings>);
    const paymentSettings: SellerPaymentSettings = {
      gcashNumber:
        !rawPay.gcashNumber || rawPay.gcashNumber === '0924-373-0042'
          ? DEFAULT_PAYMENT_SETTINGS.gcashNumber
          : rawPay.gcashNumber,
      gcashAccountName:
        !rawPay.gcashAccountName || rawPay.gcashAccountName === 'Refilla QuickFill Official'
          ? DEFAULT_PAYMENT_SETTINGS.gcashAccountName
          : rawPay.gcashAccountName,
      gcashQrImage: rawPay.gcashQrImage || DEFAULT_PAYMENT_SETTINGS.gcashQrImage,
      mayaNumber: rawPay.mayaNumber || DEFAULT_PAYMENT_SETTINGS.mayaNumber,
      mayaAccountName: rawPay.mayaAccountName || DEFAULT_PAYMENT_SETTINGS.mayaAccountName,
      paymongoSecretKey: rawPay.paymongoSecretKey || ''
    };

    return {
      users,
      passwords,
      orders,
      messages,
      paymentSettings,
      updatedAt: raw.updatedAt || Date.now()
    };
  }

  private loadLocal(): CloudDatabaseState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return this.ensureDefaults(JSON.parse(saved));
      }
    } catch { }
    const init = this.createInitialState();
    this.saveLocalOnly(init);
    return init;
  }

  private saveLocalOnly(nextState: CloudDatabaseState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      localStorage.setItem('refilla_orders', JSON.stringify(nextState.orders));
    } catch { }
  }

  private async pullFromCloudServer() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      const res = await fetch(CLOUD_ENDPOINT, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.empty && typeof data.updatedAt === 'number') {
          if (data.updatedAt > this.state.updatedAt) {
            this.state = this.ensureDefaults(data);
            this.saveLocalOnly(this.state);
            this.notify();
          } else if (data.updatedAt < this.state.updatedAt) {
            await this.pushToCloudServer(this.state);
          }
        } else if (data && data.empty) {
          await this.pushToCloudServer(this.state);
        }
      }
    } catch {
      // Offline / static fallback works seamlessly via localStorage + BroadcastChannel
    } finally {
      this.isSyncing = false;
    }
  }

  private async pushToCloudServer(nextState: CloudDatabaseState) {
    try {
      await fetch(CLOUD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextState)
      });
    } catch {
      // Offline fallback already saved in localStorage
    }
  }

  private commit(updater: (prev: CloudDatabaseState) => CloudDatabaseState) {
    const updated = updater(this.state);
    this.state = {
      ...updated,
      updatedAt: Date.now()
    };
    this.saveLocalOnly(this.state);
    if (this.channel) {
      try {
        this.channel.postMessage(this.state);
      } catch { }
    }
    this.pushToCloudServer(this.state);
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public getState(): CloudDatabaseState {
    return this.state;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // ─── AUTHENTICATION & USERS ────────────────────────────────────────────────
  public authenticate(email: string, password: string): UserAccount | null {
    const key = email.trim().toLowerCase();
    const expectedPw = this.state.passwords[key];
    if (!expectedPw || expectedPw !== password) return null;
    const found = this.state.users.find(u => u.email.toLowerCase() === key);
    return found || null;
  }

  public findUserByEmail(email: string): UserAccount | undefined {
    const key = email.trim().toLowerCase();
    return this.state.users.find(u => u.email.toLowerCase() === key);
  }

  public registerUser(
    fullName: string,
    email: string,
    password: string,
    phone?: string
  ): UserAccount {
    const key = email.trim().toLowerCase();
    // Public registration is strictly for Customer accounts only (1 single official Seller account is company-owned)
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: fullName.trim(),
      email: key,
      role: 'customer',
      phone: phone?.trim(),
      createdAt: new Date().toISOString(),
      agreedToPrivacy: true
    };

    const welcomeMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      threadId: key,
      customerName: newUser.fullName,
      customerEmail: key,
      senderRole: 'seller',
      senderName: 'Refilla Official Seller',
      text: `Hello ${newUser.fullName}! Welcome to Refilla. Let us know if you have any questions about the QuickFill Kart (₱7,999 with Free 15L Brightwash Pack) or your orders.`,
      createdAt: new Date().toISOString(),
      readBySeller: true,
      readByCustomer: false
    };

    this.commit(prev => ({
      ...prev,
      users: [...prev.users.filter(u => u.email.toLowerCase() !== key), newUser],
      passwords: {
        ...prev.passwords,
        [key]: password
      },
      messages: [...prev.messages, welcomeMsg]
    }));

    return newUser;
  }

  // ─── ORDERS (CUSTOMER PLACEMENT & SELLER STATUS UPDATES) ───────────────────
  public addOrder(order: Order) {
    const customerEmail = order.customer.email.trim().toLowerCase();
    const autoConfirmMsg: ChatMessage = {
      id: `msg-order-${Date.now()}`,
      threadId: customerEmail,
      customerName: order.customer.fullName,
      customerEmail,
      senderRole: 'seller',
      senderName: 'Refilla Official Seller',
      text: `Order Confirmed! We received your order #${order.id} (Total: ₱${order.total.toLocaleString()} via ${order.paymentMethod.toUpperCase()}). Your QuickFill Kart and Free 15L Brightwash pack are now queued for packing.`,
      orderId: order.id,
      createdAt: new Date().toISOString(),
      readBySeller: true,
      readByCustomer: false
    };

    this.commit(prev => ({
      ...prev,
      orders: [order, ...prev.orders],
      messages: [...prev.messages, autoConfirmMsg]
    }));
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, sellerNote?: string) {
    const statusOrder: OrderStatus[] = ['placed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const targetIdx = statusOrder.indexOf(newStatus);
    if (targetIdx === -1) return;

    const nowFormatted = new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const statusLabels: Record<OrderStatus, string> = {
      placed: 'Order Placed',
      packed: 'Packed & Wooden Crated',
      shipped: 'Shipped to Region Hub',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered'
    };

    this.commit(prev => {
      let targetOrder: Order | undefined;
      const updatedOrders = prev.orders.map(order => {
        if (order.id !== orderId) return order;
        targetOrder = order;
        const newTimeline = order.timeline.map((step, idx) => {
          if (idx <= targetIdx) {
            return {
              ...step,
              completed: true,
              current: idx === targetIdx,
              timestamp: idx === targetIdx ? `${nowFormatted} (Seller Updated)` : step.timestamp,
              description: idx === targetIdx && sellerNote ? sellerNote : step.description
            };
          }
          return {
            ...step,
            completed: false,
            current: false
          };
        });

        return {
          ...order,
          currentStatus: newStatus,
          sellerNote: sellerNote !== undefined ? sellerNote : order.sellerNote,
          timeline: newTimeline
        };
      });

      const nextMessages = [...prev.messages];
      if (targetOrder) {
        const custEmail = targetOrder.customer.email.trim().toLowerCase();
        nextMessages.push({
          id: `msg-status-${Date.now()}`,
          threadId: custEmail,
          customerName: targetOrder.customer.fullName,
          customerEmail: custEmail,
          senderRole: 'seller',
          senderName: 'Refilla Official Seller',
          text: `📦 Order #${targetOrder.id} Update: Status is now "${statusLabels[newStatus]}".${sellerNote ? ` Note: ${sellerNote}` : ''}`,
          orderId: targetOrder.id,
          createdAt: new Date().toISOString(),
          readBySeller: true,
          readByCustomer: false
        });
      }

      return {
        ...prev,
        orders: updatedOrders,
        messages: nextMessages
      };
    });
  }

  public verifyOrderPayment(orderId: string, verified: boolean) {
    this.commit(prev => {
      let targetOrder: Order | undefined;
      const updatedOrders = prev.orders.map(o => {
        if (o.id !== orderId) return o;
        targetOrder = o;
        return {
          ...o,
          paymentVerified: verified
        };
      });

      const nextMessages = [...prev.messages];
      if (targetOrder && verified) {
        const custEmail = targetOrder.customer.email.trim().toLowerCase();
        nextMessages.push({
          id: `msg-pay-${Date.now()}`,
          threadId: custEmail,
          customerName: targetOrder.customer.fullName,
          customerEmail: custEmail,
          senderRole: 'seller',
          senderName: 'Refilla Official Seller',
          text: `✅ Payment Verified! Your ${targetOrder.paymentMethod.toUpperCase()} payment (Ref: ${targetOrder.paymentReference || 'N/A'}) for Order #${targetOrder.id} (₱${targetOrder.total.toLocaleString()}) has been verified by Refilla.`,
          orderId: targetOrder.id,
          createdAt: new Date().toISOString(),
          readBySeller: true,
          readByCustomer: false
        });
      }

      return {
        ...prev,
        orders: updatedOrders,
        messages: nextMessages
      };
    });
  }

  public updatePaymentSettings(settings: SellerPaymentSettings) {
    this.commit(prev => ({
      ...prev,
      paymentSettings: settings
    }));
  }

  // ─── LIVE CHAT MESSAGING (SELLER ↔ CUSTOMER) ───────────────────────────────
  public sendMessage(params: {
    threadId: string;
    customerName: string;
    customerEmail: string;
    senderRole: UserRole;
    senderName: string;
    text: string;
    orderId?: string;
  }) {
    if (!params.text.trim()) return;
    const threadKey = params.threadId.trim().toLowerCase();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      threadId: threadKey,
      customerName: params.customerName,
      customerEmail: params.customerEmail.trim().toLowerCase(),
      senderRole: params.senderRole,
      senderName: params.senderName,
      text: params.text.trim(),
      orderId: params.orderId,
      createdAt: new Date().toISOString(),
      readBySeller: params.senderRole === 'seller',
      readByCustomer: params.senderRole === 'customer'
    };

    this.commit(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));
  }

  public markThreadRead(threadId: string, viewerRole: UserRole) {
    const key = threadId.trim().toLowerCase();
    const hasUnread = this.state.messages.some(m =>
      m.threadId === key && (viewerRole === 'seller' ? !m.readBySeller : !m.readByCustomer)
    );
    if (!hasUnread) return;

    this.commit(prev => ({
      ...prev,
      messages: prev.messages.map(m => {
        if (m.threadId !== key) return m;
        return viewerRole === 'seller'
          ? { ...m, readBySeller: true }
          : { ...m, readByCustomer: true };
      })
    }));
  }
}

export const cloudStore = new CloudStoreService();

