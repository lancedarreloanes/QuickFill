import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Store, Cloud, Sparkles } from 'lucide-react';
import { ChatMessage, Order, UserAccount } from '../types';

interface ChatWidgetProps {
  currentUser: UserAccount | null;
  messages: ChatMessage[];
  customerOrders: Order[];
  onSendMessage: (text: string, orderId?: string) => void;
  onMarkRead: () => void;
  onRequireAuth: () => void;
}

const CUSTOMER_PROMPTS = [
  'Is the Eco Green QuickFill Kart (₱7,999 + Free 15L Pack) ready to ship?',
  'Can I check the status of my recent order?',
  'How do I mix the Free 15L Brightwash Dishwashing Powder?',
  'Do you offer bulk discounts for multiple QuickFill Karts?'
];

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  currentUser,
  messages,
  customerOrders,
  onSendMessage,
  onMarkRead,
  onRequireAuth
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const threadKey = currentUser?.email.toLowerCase() || '';
  const myMessages = messages.filter(m => m.threadId.toLowerCase() === threadKey);
  const unreadCount = myMessages.filter(m => !m.readByCustomer && m.senderRole === 'seller').length;

  useEffect(() => {
    if (isOpen && currentUser) {
      onMarkRead();
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, myMessages.length, currentUser]);

  // Do not show floating customer chat widget if the logged-in user is the Seller (Seller uses Seller Dashboard)
  if (currentUser?.role === 'seller') return null;

  const handleOpen = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    setIsOpen(true);
    onMarkRead();
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim(), selectedOrderId || undefined);
    setText('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={handleOpen}
          className="px-4 py-3.5 rounded-full bg-[#1b4d2e] hover:bg-[#143a22] text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2.5 border border-emerald-500/30 transition hover:scale-105 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-emerald-300" />
          <span>Chat with Seller</span>
          {unreadCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      ) : (
        <div className="w-[340px] sm:w-[390px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[540px] animate-fadeIn">
          
          {/* Top Header */}
          <div className="bg-[#1b4d2e] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white p-0.5 flex items-center justify-center flex-shrink-0">
                <img src="/images/refilla-logo.jpg" alt="Refilla Seller" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <div className="text-xs font-black flex items-center gap-1.5">
                  <span>Refilla Official Seller</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  <span>Live Cloud Chat • 09243730042</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/15 transition text-white"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Optional Order Reference Selector */}
          {customerOrders.length > 0 && (
            <div className="px-3.5 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-2 text-[11px]">
              <span className="font-bold text-emerald-900">Tag Order:</span>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="flex-1 bg-white border border-emerald-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#1b4d2e] outline-none"
              >
                <option value="">General Inquiry</option>
                {customerOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} ({o.currentStatus.toUpperCase()} • ₱{o.total.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Messages Body */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-gray-50/50 min-h-[260px] max-h-[310px]">
            {myMessages.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-xs text-gray-500">
                <Store className="w-8 h-8 text-emerald-700 mx-auto" />
                <p className="font-bold text-gray-800">Send a message to Refilla Official</p>
                <p className="text-[11px] text-gray-400">
                  Ask about the QuickFill Kart (₱7,999 + Free 15L Pack) or your order delivery.
                </p>
              </div>
            ) : (
              myMessages.map((m) => {
                const isMe = m.senderRole === 'customer';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-[#1b4d2e] text-white rounded-br-xs'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-xs'
                      }`}
                    >
                      <div className={`text-[10px] font-bold mb-0.5 ${isMe ? 'text-emerald-200' : 'text-emerald-800'}`}>
                        {isMe ? 'You' : m.senderName}
                        {m.orderId ? ` • #${m.orderId}` : ''}
                      </div>
                      <p>{m.text}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
            {CUSTOMER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(prompt)}
                className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-[#1b4d2e] border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap transition font-semibold"
              >
                {prompt.slice(0, 32)}…
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a message to Seller..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#1b4d2e] hover:bg-[#143a22] text-white transition shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

