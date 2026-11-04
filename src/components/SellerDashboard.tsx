import React, { useState } from 'react';
import {
  Store,
  Package,
  MessageSquare,
  TrendingUp,
  Truck,
  CheckCircle2,
  Clock,
  Send,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Gift,
  Cloud,
  Search,
  Users,
  ChevronRight,
  QrCode,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { ChatMessage, Order, OrderStatus, SellerPaymentSettings, UserAccount } from '../types';
import { BRIGHTWASH_SCENTS } from '../data/refillaData';
import { cloudStore } from '../services/cloudStore';

interface SellerDashboardProps {
  currentUser: UserAccount;
  users?: UserAccount[];
  orders: Order[];
  messages: ChatMessage[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, sellerNote?: string) => void;
  onSendSellerMessage: (threadId: string, customerName: string, customerEmail: string, text: string, orderId?: string) => void;
  onMarkThreadRead: (threadId: string) => void;
}

const STATUS_OPTIONS: { status: OrderStatus; label: string; short: string }[] = [
  { status: 'placed', label: '1. Order Placed', short: 'Placed' },
  { status: 'packed', label: '2. Packed & Crated', short: 'Packed' },
  { status: 'shipped', label: '3. Shipped to Hub', short: 'Shipped' },
  { status: 'out_for_delivery', label: '4. Out for Delivery', short: 'Out for Delivery' },
  { status: 'delivered', label: '5. Delivered', short: 'Delivered' }
];

const QUICK_REPLIES = [
  'Hello! We have received your order and verified your payment. Your QuickFill Kart and Free 15L Brightwash pack are being prepared!',
  'Good news! Your QuickFill Kart has been wooden-crated and handed over to J&T Cargo.',
  'Thank you for messaging Refilla! All 5 QuickFill Kart colors are in stock at ₱7,999 with a Free 15L Brightwash pack.',
  'Your order is now Out for Delivery! Please keep your phone lines open for our courier rider.'
];

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  currentUser,
  users = [],
  orders,
  messages,
  onUpdateOrderStatus,
  onSendSellerMessage,
  onMarkThreadRead
}) => {
  const [activeTab, setActiveTab] = useState<'customers' | 'orders' | 'delivered' | 'messages'>('customers');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [deliveredSearch, setDeliveredSearch] = useState('');
  const [sellerNotesMap, setSellerNotesMap] = useState<Record<string, string>>({});
  const [previewReceiptImage, setPreviewReceiptImage] = useState<string | null>(null);
  const [showPaymentSettingsModal, setShowPaymentSettingsModal] = useState<boolean>(false);
  const [paymentSettingsForm, setPaymentSettingsForm] = useState<SellerPaymentSettings>(
    () => cloudStore.getState().paymentSettings
  );
  const [settingsSavedBanner, setSettingsSavedBanner] = useState<boolean>(false);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          setPaymentSettingsForm(prev => ({
            ...prev,
            gcashQrImage: canvas.toDataURL('image/jpeg', 0.82)
          }));
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    cloudStore.updatePaymentSettings(paymentSettingsForm);
    setSettingsSavedBanner(true);
    setTimeout(() => setSettingsSavedBanner(false), 2500);
  };

  // Build Customer Directory (registered customers + customers who placed orders)
  const customerDirectoryMap = new Map<
    string,
    {
      email: string;
      fullName: string;
      phone: string;
      region?: string;
      address?: string;
      orders: Order[];
      totalSpent: number;
    }
  >();

  for (const u of users) {
    if (u.role === 'seller') continue;
    const key = u.email.toLowerCase();
    customerDirectoryMap.set(key, {
      email: key,
      fullName: u.fullName,
      phone: u.phone || '—',
      orders: [],
      totalSpent: 0
    });
  }

  for (const o of orders) {
    const key = o.customer.email.toLowerCase();
    const existing = customerDirectoryMap.get(key);
    if (!existing) {
      customerDirectoryMap.set(key, {
        email: key,
        fullName: o.customer.fullName,
        phone: o.customer.phone,
        region: o.region,
        address: `${o.customer.completeAddress}, ${o.customer.cityProvince}`,
        orders: [o],
        totalSpent: o.total
      });
    } else {
      existing.fullName = o.customer.fullName || existing.fullName;
      existing.phone = o.customer.phone || existing.phone;
      existing.region = o.region;
      existing.address = `${o.customer.completeAddress}, ${o.customer.cityProvince}`;
      existing.orders.push(o);
      existing.totalSpent += o.total;
    }
  }

  const customersList = Array.from(customerDirectoryMap.values());
  const filteredCustomersList = customersList.filter((c) => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string>(
    customersList[0]?.email || 'customer@quickfill.ph'
  );
  const selectedCustomer =
    customersList.find(c => c.email === selectedCustomerEmail) || customersList[0] || null;

  // Group messages into customer threads
  const threadsMap = new Map<
    string,
    {
      threadId: string;
      customerName: string;
      customerEmail: string;
      lastMessage: ChatMessage;
      unreadCount: number;
      messages: ChatMessage[];
    }
  >();

  for (const msg of messages) {
    const key = msg.threadId.toLowerCase();
    const existing = threadsMap.get(key);
    const isUnread = !msg.readBySeller && msg.senderRole === 'customer';
    if (!existing) {
      threadsMap.set(key, {
        threadId: key,
        customerName: msg.customerName,
        customerEmail: msg.customerEmail,
        lastMessage: msg,
        unreadCount: isUnread ? 1 : 0,
        messages: [msg]
      });
    } else {
      existing.messages.push(msg);
      existing.lastMessage = msg;
      if (isUnread) existing.unreadCount += 1;
    }
  }

  // Also ensure every customer who placed an order has a thread selectable
  for (const o of orders) {
    const key = o.customer.email.toLowerCase();
    if (!threadsMap.has(key)) {
      const dummyMsg: ChatMessage = {
        id: `init-${o.id}`,
        threadId: key,
        customerName: o.customer.fullName,
        customerEmail: key,
        senderRole: 'seller',
        senderName: 'Refilla Official Seller',
        text: `Order #${o.id} placed.`,
        orderId: o.id,
        createdAt: o.createdAt,
        readBySeller: true,
        readByCustomer: true
      };
      threadsMap.set(key, {
        threadId: key,
        customerName: o.customer.fullName,
        customerEmail: key,
        lastMessage: dummyMsg,
        unreadCount: 0,
        messages: [dummyMsg]
      });
    }
  }

  const threads = Array.from(threadsMap.values()).sort(
    (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.threadId || 'customer@quickfill.ph');
  const [replyText, setReplyText] = useState('');

  const activeThread = threads.find(t => t.threadId === selectedThreadId) || threads[0];

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(o => o.currentStatus !== 'delivered').length;
  const deliveredOrdersCount = orders.filter(o => o.currentStatus === 'delivered').length;
  const totalUnreadMessages = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.currentStatus === statusFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.trackingNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;
    onSendSellerMessage(
      activeThread.threadId,
      activeThread.customerName,
      activeThread.customerEmail,
      replyText.trim()
    );
    setReplyText('');
  };

  return (
    <div className="py-8 bg-gray-50/80 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Seller Header Banner */}
        <div className="bg-gradient-to-r from-[#12351f] via-[#1b4d2e] to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
              <Cloud className="w-3.5 h-3.5 text-emerald-300" />
              <span>Refilla Cloud Storage • Seller Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <Store className="w-7 h-7 text-emerald-300" />
              <span>Seller Order &amp; Customer Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90">
              Signed in as <strong>{currentUser.fullName}</strong> ({currentUser.email}). Update customer order statuses and reply to customer messages in real time.
            </p>
          </div>

          {/* Switch Tabs: Customers vs Orders vs Live Chat */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm ${
                activeTab === 'customers'
                  ? 'bg-white text-[#1b4d2e]'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers ({customersList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm ${
                activeTab === 'orders'
                  ? 'bg-white text-[#1b4d2e]'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>All Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('delivered')}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm ${
                activeTab === 'delivered'
                  ? 'bg-white text-[#1b4d2e]'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Delivered History ({deliveredOrdersCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('messages');
                if (activeThread) onMarkThreadRead(activeThread.threadId);
              }}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm relative ${
                activeTab === 'messages'
                  ? 'bg-white text-[#1b4d2e]'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Chat</span>
              {totalUnreadMessages > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {totalUnreadMessages} new
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowPaymentSettingsModal(true)}
              className="px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm bg-[#0057E7] hover:bg-blue-600 text-white border border-blue-400/40"
            >
              <QrCode className="w-4 h-4" />
              <span>My GCash Settings</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards (Interactive Tab Switchers) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('customers')}
            className={`cursor-pointer bg-white hover:border-[#1b4d2e] transition rounded-2xl p-5 border shadow-xs space-y-1 ${
              activeTab === 'customers' ? 'border-[#1b4d2e] ring-2 ring-emerald-600/15' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Registered Customers</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-[#1b4d2e]">
              {customersList.length}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              ₱{totalRevenue.toLocaleString()} total revenue • Manage →
            </div>
          </div>

          <div
            onClick={() => setActiveTab('orders')}
            className={`cursor-pointer bg-white hover:border-[#1b4d2e] transition rounded-2xl p-5 border shadow-xs space-y-1 ${
              activeTab === 'orders' ? 'border-[#1b4d2e] ring-2 ring-emerald-600/15' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Active Shipments</span>
              <Truck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {activeOrdersCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              Update status &amp; verify payments →
            </div>
          </div>

          <div
            onClick={() => setActiveTab('delivered')}
            className={`cursor-pointer bg-white hover:border-[#1b4d2e] transition rounded-2xl p-5 border shadow-xs space-y-1 ${
              activeTab === 'delivered' ? 'border-[#1b4d2e] ring-2 ring-emerald-600/15' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Completed / Delivered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {deliveredOrdersCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">Click to view Delivered History →</div>
          </div>

          <div
            onClick={() => {
              setActiveTab('messages');
              if (activeThread) onMarkThreadRead(activeThread.threadId);
            }}
            className={`cursor-pointer bg-white hover:border-[#1b4d2e] transition rounded-2xl p-5 border shadow-xs space-y-1 ${
              activeTab === 'messages' ? 'border-[#1b4d2e] ring-2 ring-emerald-600/15' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Customer Threads</span>
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {threads.length}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              {totalUnreadMessages > 0 ? `${totalUnreadMessages} unread customer message(s)` : 'Open Customer Chat →'}
            </div>
          </div>
        </div>

        {/* ─── TAB 0: CUSTOMERS DIRECTORY (CLICK CUSTOMER TO VIEW THEIR ORDERS) ─── */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Customer List (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/60 space-y-3">
                <div>
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1b4d2e]" />
                    <span>Registered Customers ({customersList.length})</span>
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Click any customer below to inspect their ordered items, verify GCash receipts, and update delivery status.
                  </p>
                </div>

                {/* Customer Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search customer name, email, phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredCustomersList.map((cust) => {
                  const isSelected = selectedCustomer?.email === cust.email;
                  return (
                    <button
                      key={cust.email}
                      type="button"
                      onClick={() => setSelectedCustomerEmail(cust.email)}
                      className={`w-full p-4 text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/90 border-l-4 border-[#1b4d2e]'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                            isSelected ? 'bg-[#1b4d2e] text-white' : 'bg-emerald-100 text-[#1b4d2e]'
                          }`}
                        >
                          {cust.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-gray-900 truncate">{cust.fullName}</div>
                          <div className="text-[11px] text-gray-500 truncate">{cust.email}</div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] font-bold">
                            <span className="text-[#1b4d2e] bg-white px-2 py-0.5 rounded border border-emerald-200">
                              {cust.orders.length} Order(s)
                            </span>
                            <span className="text-gray-600">
                              ₱{cust.totalSpent.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-[#1b4d2e]' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Customer's Orders & Live Status Controls (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              {selectedCustomer ? (
                <>
                  {/* Customer Profile Summary Card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Selected Customer Profile
                      </span>
                      <h3 className="text-xl font-black text-gray-900">{selectedCustomer.fullName}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-emerald-700" />
                          {selectedCustomer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-700" />
                          {selectedCustomer.phone}
                        </span>
                        {selectedCustomer.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                            {selectedCustomer.address}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <div className="text-right pr-2 border-r border-gray-200">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Total Spent</span>
                        <span className="text-lg font-black text-[#1b4d2e]">
                          ₱{selectedCustomer.totalSpent.toLocaleString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedThreadId(selectedCustomer.email);
                          setActiveTab('messages');
                          onMarkThreadRead(selectedCustomer.email);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#1b4d2e] hover:bg-[#143a22] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Chat with Customer</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer's Orders List */}
                  {selectedCustomer.orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 space-y-2">
                      <Package className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-sm font-bold text-gray-800">
                        {selectedCustomer.fullName} has not placed any orders yet
                      </p>
                      <p className="text-xs text-gray-400">
                        Once this customer completes checkout, their ordered items will appear here immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider px-1">
                        Orders Placed by {selectedCustomer.fullName} ({selectedCustomer.orders.length})
                      </h4>

                      {selectedCustomer.orders.map((order) => {
                        const noteVal = sellerNotesMap[order.id] ?? (order.sellerNote || '');
                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4"
                          >
                            {/* Order Top Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                                <span className="font-black text-gray-900 font-mono text-sm bg-gray-100 px-3 py-1 rounded-xl">
                                  Order #{order.id}
                                </span>
                                <span className="font-mono text-gray-500">
                                  Tracking: <strong className="text-gray-800">{order.trackingNumber}</strong>
                                </span>
                                <span className="text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {order.createdAt}
                                </span>
                              </div>

                              <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 text-[#1b4d2e]">
                                Status: {STATUS_OPTIONS.find(s => s.status === order.currentStatus)?.short || order.currentStatus}
                              </span>
                            </div>

                            {/* Ordered Items + Free Pack */}
                            <div className="divide-y divide-gray-100 text-xs">
                              {order.items.map((item) => {
                                const freeScent = item.productId === 'machine'
                                  ? (BRIGHTWASH_SCENTS.find(s => s.id === (item.includedFreeScent || 'lemon')) || BRIGHTWASH_SCENTS[0])
                                  : null;
                                return (
                                  <div key={item.id} className="py-2.5 space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3">
                                        <img src={item.image} alt={item.title} className="w-12 h-14 object-contain bg-gray-50 rounded-xl border p-1" />
                                        <div>
                                          <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                                          <div className="text-gray-500">
                                            Qty: {item.quantity} × ₱{item.price.toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                      <strong className="text-gray-900 text-sm">
                                        ₱{(item.price * item.quantity).toLocaleString()}
                                      </strong>
                                    </div>

                                    {item.productId === 'machine' && freeScent && (
                                      <div className="ml-14 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-2">
                                          <img src={freeScent.image} alt={freeScent.name} className="w-7 h-9 object-contain bg-white rounded border p-0.5" />
                                          <span className="font-bold text-emerald-950 flex items-center gap-1">
                                            <Gift className="w-3.5 h-3.5 text-emerald-700" />
                                            <span>Included Free Pack: Brightwash 15L Powder ({freeScent.name}) × {item.quantity}</span>
                                          </span>
                                        </div>
                                        <span className="font-black text-emerald-700">FREE (₱0)</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Delivery & Payment Row */}
                            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="text-gray-600">
                                <span className="font-bold text-gray-900">Address:</span> {order.customer.completeAddress}, {order.customer.cityProvince} ({order.region})
                              </div>
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="font-bold text-gray-700 uppercase">
                                  {order.paymentMethod} {order.paymentReference ? `(${order.paymentReference})` : ''}
                                </span>
                                {order.paymentSenderNumber && (
                                  <span className="text-[11px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                                    Sender: {order.paymentSenderNumber}
                                  </span>
                                )}
                                {order.paymentProofImage && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewReceiptImage(order.paymentProofImage || null)}
                                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition"
                                  >
                                    <ImageIcon className="w-3 h-3" />
                                    <span>View Receipt</span>
                                  </button>
                                )}
                                {(order.paymentMethod === 'gcash' || order.paymentMethod === 'maya') && (
                                  order.paymentVerified ? (
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                      <span>Payment Verified</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => cloudStore.verifyOrderPayment(order.id, true)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-2xs"
                                    >
                                      ✓ Verify Payment
                                    </button>
                                  )
                                )}
                                <span className="text-sm font-black text-[#1b4d2e]">
                                  Total: ₱{order.total.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Seller Status Controls for this Customer's Order */}
                            <div className="pt-3 border-t border-gray-100 space-y-2.5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                <span className="font-bold text-gray-900">
                                  ⚡ Advance / Update Order Status:
                                </span>
                                <input
                                  type="text"
                                  placeholder="Optional courier / seller note..."
                                  value={noteVal}
                                  onChange={(e) => setSellerNotesMap({ ...sellerNotesMap, [order.id]: e.target.value })}
                                  className="w-full sm:w-72 px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:border-[#1b4d2e]"
                                />
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {STATUS_OPTIONS.map((step) => {
                                  const isCurrent = order.currentStatus === step.status;
                                  return (
                                    <button
                                      key={step.status}
                                      type="button"
                                      onClick={() => onUpdateOrderStatus(order.id, step.status, noteVal)}
                                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                                        isCurrent
                                          ? 'bg-[#1b4d2e] text-white border-[#1b4d2e] shadow-xs'
                                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#1b4d2e] hover:text-[#1b4d2e]'
                                      }`}
                                    >
                                      {isCurrent && <CheckCircle2 className="w-3 h-3 text-emerald-300 flex-shrink-0" />}
                                      <span className="truncate">{step.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-xs text-gray-400">
                  Select a customer on the left to inspect their orders.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ─── TAB 1: LIVE ORDER MANAGEMENT ─────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    statusFilter === 'all'
                      ? 'bg-[#1b4d2e] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({orders.length})
                </button>
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st.status}
                    type="button"
                    onClick={() => setStatusFilter(st.status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      statusFilter === st.status
                        ? 'bg-[#1b4d2e] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st.short} ({orders.filter(o => o.currentStatus === st.status).length})
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Order #, Customer, Email..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-2">
                <Package className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-sm font-bold text-gray-700">No matching orders found</p>
                <p className="text-xs text-gray-400">New customer orders placed at checkout will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((order) => {
                  const noteVal = sellerNotesMap[order.id] ?? (order.sellerNote || '');
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-5"
                    >
                      {/* Order Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm sm:text-base font-black text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded-xl">
                            {order.id}
                          </span>
                          <span className="text-xs font-mono text-gray-500">
                            Tracking: <strong className="text-gray-800">{order.trackingNumber}</strong>
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {order.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 text-[#1b4d2e]">
                            Status: {STATUS_OPTIONS.find(s => s.status === order.currentStatus)?.short || order.currentStatus}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const threadKey = order.customer.email.toLowerCase();
                              setSelectedThreadId(threadKey);
                              setActiveTab('messages');
                              onMarkThreadRead(threadKey);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b4d2e] border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Message Customer</span>
                          </button>
                        </div>
                      </div>

                      {/* Customer & Payment Details Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                        {/* Customer Info (5 cols) */}
                        <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                          <div className="font-bold text-gray-900 uppercase tracking-wider text-[11px] text-emerald-800">
                            Customer &amp; Delivery Destination
                          </div>
                          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                            <User className="w-4 h-4 text-emerald-700" />
                            <span>{order.customer.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{order.customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{order.customer.email}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-700 pt-1 border-t border-gray-200/60">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                            <div>
                              <div>
                                {order.customer.completeAddress}
                                {order.customer.barangay ? `, ${order.customer.barangay}` : ''}
                              </div>
                              <div className="font-semibold">
                                {order.customer.cityProvince} • {order.region}
                                {order.customer.postalCode ? ` (${order.customer.postalCode})` : ''}
                              </div>
                              {order.customer.notes && (
                                <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded mt-1 border border-amber-200">
                                  Note: &ldquo;{order.customer.notes}&rdquo;
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Items & Free Pack Breakdown (7 cols) */}
                        <div className="lg:col-span-7 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between space-y-3">
                          <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-800">
                                Ordered Items &amp; Free Bundle
                              </span>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-200 font-bold text-gray-800">
                                  <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>{order.paymentMethod.toUpperCase()}</span>
                                  {order.paymentReference && (
                                    <span className="text-emerald-700 font-mono">({order.paymentReference})</span>
                                  )}
                                </span>
                                {order.paymentSenderNumber && (
                                  <span className="text-[11px] font-mono bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
                                    Sender: {order.paymentSenderNumber}
                                  </span>
                                )}
                                {order.paymentProofImage && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewReceiptImage(order.paymentProofImage || null)}
                                    className="px-2.5 py-1 rounded-lg bg-[#0057E7] hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition"
                                  >
                                    <ImageIcon className="w-3 h-3" />
                                    <span>View Receipt</span>
                                  </button>
                                )}
                                {(order.paymentMethod === 'gcash' || order.paymentMethod === 'maya') && (
                                  order.paymentVerified ? (
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                      <span>Verified</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => cloudStore.verifyOrderPayment(order.id, true)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-2xs"
                                    >
                                      ✓ Verify Payment
                                    </button>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="divide-y divide-gray-200/70">
                              {order.items.map((item) => {
                                const freeScent = item.productId === 'machine'
                                  ? (BRIGHTWASH_SCENTS.find(s => s.id === (item.includedFreeScent || 'lemon')) || BRIGHTWASH_SCENTS[0])
                                  : null;
                                return (
                                  <div key={item.id} className="py-2 space-y-1.5">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2.5">
                                        <img src={item.image} alt={item.title} className="w-10 h-12 object-contain bg-white rounded-lg border p-0.5" />
                                        <div>
                                          <div className="font-bold text-gray-900">{item.title}</div>
                                          <div className="text-[11px] text-gray-500">Qty: {item.quantity} × ₱{item.price.toLocaleString()}</div>
                                        </div>
                                      </div>
                                      <strong className="text-gray-900">₱{(item.price * item.quantity).toLocaleString()}</strong>
                                    </div>

                                    {item.productId === 'machine' && freeScent && (
                                      <div className="ml-12 px-3 py-1.5 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-between text-[11px]">
                                        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                                          <Gift className="w-3.5 h-3.5 text-emerald-700" />
                                          <span>FREE PACK: Brightwash 15L Powder ({freeScent.name}) × {item.quantity}</span>
                                        </span>
                                        <span className="font-black text-emerald-800">FREE (₱0)</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-gray-500">
                              Subtotal: ₱{order.subtotal.toLocaleString()} + Freight ({order.region}): ₱{order.shippingFee}
                            </span>
                            <span className="text-base font-black text-[#1b4d2e]">
                              Total: ₱{order.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Seller Live Status Controls */}
                      <div className="pt-4 border-t border-gray-100 bg-emerald-50/40 -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 p-5 rounded-b-3xl space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-gray-900">
                            ⚡ Seller Action: Update Live Order Status (Customer sees this immediately)
                          </span>
                          <input
                            type="text"
                            placeholder="Optional courier / seller note (e.g., Dispatched via J&T Cargo)..."
                            value={noteVal}
                            onChange={(e) => setSellerNotesMap({ ...sellerNotesMap, [order.id]: e.target.value })}
                            className="w-full sm:w-80 px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:border-[#1b4d2e]"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {STATUS_OPTIONS.map((step) => {
                            const isCurrent = order.currentStatus === step.status;
                            return (
                              <button
                                key={step.status}
                                type="button"
                                onClick={() => onUpdateOrderStatus(order.id, step.status, noteVal)}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                                  isCurrent
                                    ? 'bg-[#1b4d2e] text-white border-[#1b4d2e] shadow-sm ring-2 ring-emerald-600/20'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#1b4d2e] hover:text-[#1b4d2e]'
                                }`}
                              >
                                {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />}
                                <span className="truncate">{step.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: DELIVERED PRODUCTS HISTORY ───────────────────────────── */}
        {activeTab === 'delivered' && (() => {
          const deliveredOrders = orders.filter(o => o.currentStatus === 'delivered');
          const filteredDelivered = deliveredOrders.filter(o => {
            const q = deliveredSearch.trim().toLowerCase();
            if (!q) return true;
            return (
              o.id.toLowerCase().includes(q) ||
              o.trackingNumber.toLowerCase().includes(q) ||
              o.customer.fullName.toLowerCase().includes(q) ||
              o.customer.email.toLowerCase().includes(q) ||
              o.customer.cityProvince.toLowerCase().includes(q) ||
              o.items.some(it => it.title.toLowerCase().includes(q))
            );
          });

          const totalDeliveredRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
          const totalDeliveredKarts = deliveredOrders.reduce(
            (sum, o) => sum + o.items.filter(i => i.productId === 'machine').reduce((s, i) => s + i.quantity, 0),
            0
          );
          const totalDeliveredPacks = deliveredOrders.reduce(
            (sum, o) =>
              sum +
              o.items.reduce((s, i) => s + i.quantity, 0),
            0
          );

          return (
            <div className="space-y-6">
              {/* Delivered Products Summary Banner */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block">
                    Completed Fulfillment Archive
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>History of Delivered Products ({deliveredOrders.length})</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Complete archive of all orders and products that have been delivered to customers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Delivered Karts (+ Free Packs)</span>
                    <strong className="text-base font-black text-[#1b4d2e]">{totalDeliveredKarts} Unit(s)</strong>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Total Items Fulfilled</span>
                    <strong className="text-base font-black text-[#1b4d2e]">{totalDeliveredPacks} Item(s)</strong>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-[#1b4d2e] text-white">
                    <span className="text-emerald-200 block text-[10px] uppercase font-bold">Fulfilled Revenue</span>
                    <strong className="text-base font-black">₱{totalDeliveredRevenue.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-700">
                  Showing {filteredDelivered.length} delivered order record(s)
                </span>
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Delivered Product, Customer, Order #..."
                    value={deliveredSearch}
                    onChange={(e) => setDeliveredSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Delivered Products List */}
              {filteredDelivered.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-800">No delivered product records yet</p>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    When you mark any customer order as <strong>&ldquo;5. Delivered&rdquo;</strong> in the Customers or All Orders tab, it will automatically be archived here in your Delivered Products History.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredDelivered.map((order) => {
                    const deliveredStep = order.timeline.find(t => t.status === 'delivered');
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-xs space-y-4"
                      >
                        {/* Top Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1.5 bg-emerald-700 text-white font-black px-3 py-1 rounded-full uppercase text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Delivered
                            </span>
                            <span className="font-black text-gray-900 font-mono text-sm bg-gray-100 px-3 py-1 rounded-xl">
                              Order #{order.id}
                            </span>
                            <span className="font-mono text-gray-500">
                              Tracking: <strong className="text-gray-800">{order.trackingNumber}</strong>
                            </span>
                          </div>

                          <div className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                            Delivered on: {deliveredStep?.timestamp || order.createdAt}
                          </div>
                        </div>

                        {/* Delivered Products Breakdown */}
                        <div className="divide-y divide-gray-100 text-xs">
                          {order.items.map((item) => {
                            const freeScent = item.productId === 'machine'
                              ? (BRIGHTWASH_SCENTS.find(s => s.id === (item.includedFreeScent || 'lemon')) || BRIGHTWASH_SCENTS[0])
                              : null;

                            return (
                              <div key={item.id} className="py-3 space-y-2">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3.5">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-14 h-16 object-contain bg-gray-50 rounded-xl border border-gray-200 p-1"
                                    />
                                    <div>
                                      <div className="text-sm font-bold text-gray-900">{item.title}</div>
                                      <div className="text-gray-500 mt-0.5">
                                        Delivered Qty: <strong>{item.quantity} unit(s)</strong> • ₱{item.price.toLocaleString()} each
                                      </div>
                                    </div>
                                  </div>
                                  <strong className="text-sm sm:text-base font-black text-[#1b4d2e]">
                                    ₱{(item.price * item.quantity).toLocaleString()}
                                  </strong>
                                </div>

                                {item.productId === 'machine' && freeScent && (
                                  <div className="ml-0 sm:ml-16 px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={freeScent.image}
                                        alt={freeScent.name}
                                        className="w-8 h-10 object-contain bg-white rounded border p-0.5"
                                      />
                                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                                        <Gift className="w-3.5 h-3.5 text-emerald-700" />
                                        <span>Delivered Free Bundle: Brightwash 15L Powder ({freeScent.name}) × {item.quantity}</span>
                                      </span>
                                    </div>
                                    <span className="font-black text-emerald-700">FREE (₱0)</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Recipient & Payment Summary Footer */}
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                          <div className="space-y-1 text-gray-600">
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Recipient: {order.customer.fullName} ({order.customer.phone} • {order.customer.email})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                              <span>
                                Delivered to: {order.customer.completeAddress}, {order.customer.cityProvince} ({order.region})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                                Paid via {order.paymentMethod.toUpperCase()} {order.paymentReference ? `(${order.paymentReference})` : ''}
                              </span>
                              <span className="text-lg font-black text-[#1b4d2e]">
                                ₱{order.total.toLocaleString()}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomerEmail(order.customer.email.toLowerCase());
                                setActiveTab('customers');
                              }}
                              className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-[#1b4d2e] border border-emerald-200 font-bold transition"
                            >
                              View Customer
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ─── TAB 3: SELLER ↔ CUSTOMER LIVE CHAT ───────────────────────────── */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
            
            {/* Left Sidebar: Customer Threads (4 cols) */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/60 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-white">
                <h3 className="text-sm font-black text-gray-900">Customer Conversations</h3>
                <p className="text-[11px] text-gray-500">Real-time cloud chat with customers</p>
              </div>

              <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
                {threads.map((t) => {
                  const isSelected = activeThread?.threadId === t.threadId;
                  return (
                    <button
                      key={t.threadId}
                      type="button"
                      onClick={() => {
                        setSelectedThreadId(t.threadId);
                        onMarkThreadRead(t.threadId);
                      }}
                      className={`w-full p-4 text-left transition flex items-start justify-between gap-3 ${
                        isSelected ? 'bg-emerald-50/90 border-l-4 border-[#1b4d2e]' : 'hover:bg-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">{t.customerName}</div>
                        <div className="text-[10px] text-gray-500 truncate">{t.customerEmail}</div>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {t.lastMessage.senderRole === 'seller' ? 'You: ' : ''}
                          {t.lastMessage.text}
                        </p>
                      </div>
                      {t.unreadCount > 0 && (
                        <span className="bg-[#1b4d2e] text-white text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0">
                          {t.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Active Conversation (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-white">
              {activeThread ? (
                <>
                  {/* Thread Header */}
                  <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{activeThread.customerName}</h4>
                      <p className="text-xs text-gray-500">{activeThread.customerEmail}</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Orders: {orders.filter(o => o.customer.email.toLowerCase() === activeThread.threadId).length}
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="p-5 space-y-3 overflow-y-auto max-h-[360px] flex-1 bg-gray-50/20">
                    {activeThread.messages.map((m) => {
                      const isSeller = m.senderRole === 'seller';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                              isSeller
                                ? 'bg-[#1b4d2e] text-white rounded-br-xs'
                                : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-xs'
                            }`}
                          >
                            <div className={`text-[10px] font-bold mb-0.5 ${isSeller ? 'text-emerald-200' : 'text-emerald-800'}`}>
                              {m.senderName} {m.orderId ? `• Order #${m.orderId}` : ''}
                            </div>
                            <p>{m.text}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 px-1">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Replies + Input Box */}
                  <div className="p-4 border-t border-gray-100 space-y-3 bg-white">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase flex-shrink-0">Quick Reply:</span>
                      {QUICK_REPLIES.map((qr, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReplyText(qr)}
                          className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-[#1b4d2e] border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap transition"
                        >
                          {qr.slice(0, 42)}…
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSendReply} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Reply to ${activeThread.customerName}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#1b4d2e] hover:bg-[#143a22] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-gray-400 text-xs">
                  Select a customer conversation on the left to start chatting.
                </div>
              )}
            </div>

          </div>
        )}

        {/* RECEIPT SCREENSHOT PREVIEW MODAL */}
        {previewReceiptImage && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs p-4 flex items-center justify-center">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn">
              <div className="bg-[#1b4d2e] text-white p-4 flex items-center justify-between">
                <span className="text-sm font-black">Customer Payment Receipt Screenshot</span>
                <button
                  type="button"
                  onClick={() => setPreviewReceiptImage(null)}
                  className="p-1 rounded-full hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 text-center space-y-4">
                <img
                  src={previewReceiptImage}
                  alt="Customer GCash Receipt"
                  className="max-h-[65vh] mx-auto object-contain rounded-2xl border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setPreviewReceiptImage(null)}
                  className="w-full py-2.5 rounded-xl bg-[#1b4d2e] text-white font-bold text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SELLER GCASH & PAYMENT SETTINGS MODAL */}
        {showPaymentSettingsModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs p-4 flex items-center justify-center">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-fadeIn">
              <div className="bg-gradient-to-r from-[#0057E7] to-[#1b4d2e] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  <h3 className="text-base font-black">Seller GCash &amp; E-Payment Receiving Account</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentSettingsModal(false)}
                  className="p-1 rounded-full hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePaymentSettings} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                <p className="text-gray-600 leading-relaxed">
                  Configure your official <strong>GCash Number</strong>, <strong>Account Name</strong>, and <strong>GCash QR Code</strong> below. Any changes saved here will immediately appear on the Customer Checkout Page.
                </p>

                {settingsSavedBanner && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>GCash receiving account updated! Customers will now see this at checkout.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Your GCash Mobile Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0924-373-0042"
                      value={paymentSettingsForm.gcashNumber}
                      onChange={(e) => setPaymentSettingsForm({ ...paymentSettingsForm, gcashNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">GCash Account Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kristine / Refilla Official"
                      value={paymentSettingsForm.gcashAccountName}
                      onChange={(e) => setPaymentSettingsForm({ ...paymentSettingsForm, gcashAccountName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                {/* Upload GCash QR Code Image */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Your GCash InstaPay / Personal QR Code Image</span>
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#0057E7] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload QR Screenshot</span>
                      <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
                    </label>
                  </div>

                  {paymentSettingsForm.gcashQrImage ? (
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-blue-200/60">
                      <img
                        src={paymentSettingsForm.gcashQrImage}
                        alt="GCash QR Preview"
                        className="w-20 h-20 object-contain bg-white rounded-xl border p-1"
                      />
                      <button
                        type="button"
                        onClick={() => setPaymentSettingsForm({ ...paymentSettingsForm, gcashQrImage: '' })}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Remove QR Image
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500">
                      Open your GCash App → Tap <strong>QR</strong> → <strong>Generate QR</strong> → Save to phone and upload it here so customers can scan your exact GCash QR at checkout.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Maya Mobile Number</label>
                    <input
                      type="text"
                      value={paymentSettingsForm.mayaNumber}
                      onChange={(e) => setPaymentSettingsForm({ ...paymentSettingsForm, mayaNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Maya Account Name</label>
                    <input
                      type="text"
                      value={paymentSettingsForm.mayaAccountName}
                      onChange={(e) => setPaymentSettingsForm({ ...paymentSettingsForm, mayaAccountName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                {/* Real-Life PayMongo Live Webhook / API Key */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <label className="block font-bold text-emerald-950">
                    PayMongo Live Secret API Key (For Real-Time Automatic Bank Detection)
                  </label>
                  <input
                    type="password"
                    placeholder="sk_live_..."
                    value={paymentSettingsForm.paymongoSecretKey || ''}
                    onChange={(e) => setPaymentSettingsForm({ ...paymentSettingsForm, paymongoSecretKey: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white font-mono text-xs"
                  />
                  <p className="text-[10px] text-emerald-800 leading-relaxed">
                    Paste your <strong>PayMongo Live Secret Key (`sk_live_...`)</strong> here so the website connects directly to PayMongo&apos;s banking network (`/api/paymongo/create` &amp; `/api/paymongo/status`). When a customer pays via GCash, the bank notifies your website in real time and the order proceeds automatically.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentSettingsModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1b4d2e] hover:bg-[#143a22] text-white font-black shadow-md"
                  >
                    Save GCash Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

