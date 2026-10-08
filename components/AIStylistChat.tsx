import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, UserProfile } from '../types';
import { geminiService } from '../services/geminiService';

interface AIStylistChatProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'stylist';
  text: string;
  timestamp: string;
  recommendedProduct?: Product;
}

export const AIStylistChat: React.FC<AIStylistChatProps> = ({
  isOpen,
  onClose,
  userProfile,
  products,
  onSelectProduct,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'stylist',
      text: `Hello ${userProfile.name}! I am your personal OmniFit AI Stylist. Tell me what event or look you are preparing for today (e.g. "I have a presentation tomorrow" or "What pairs best with a trench coat?")`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setIsTyping(true);

    // Call Gemini API or smart recommendation logic
    let responseText = '';
    let recProd: Product | undefined = undefined;

    try {
      const advice = await geminiService.getStylingAdvice(
        products[0]?.name || 'Classic Trench Coat',
        `user preferences: ${userProfile.preferredStyles.join(', ')}`
      );
      
      // Match relevant product based on user text keywords
      const lower = query.toLowerCase();
      if (lower.includes('coat') || lower.includes('outerwear') || lower.includes('presentation')) {
        recProd = products.find(p => p.category === 'Outerwear') || products[0];
        responseText = `For your presentation, I highly recommend our ${recProd.name}. Its structured silhouette communicates executive authority while maintaining comfort. ${advice}`;
      } else if (lower.includes('dress') || lower.includes('formal') || lower.includes('evening') || lower.includes('party')) {
        recProd = products.find(p => p.category === 'Dresses') || products[1];
        responseText = `For formal receptions and evening events, the ${recProd.name} in silk drape is an ideal match for your ${userProfile.preferredColors[0]} color preference. ${advice}`;
      } else if (lower.includes('blazer') || lower.includes('office') || lower.includes('work')) {
        recProd = products.find(p => p.category === 'Tailored') || products[3];
        responseText = `The ${recProd.name} offers crisp power tailoring that aligns perfectly with your ${userProfile.heightCm}cm height and chest measurements. ${advice}`;
      } else {
        recProd = products[0];
        responseText = `Based on your profile preferences for ${userProfile.preferredStyles.join(', ')}, I suggest pairing neutral tone outerwear with tailored trousers. ${advice}`;
      }
    } catch (err) {
      recProd = products[0];
      responseText = `I recommend styling elevated minimalist pieces with neutral tones for a timeless aesthetic.`;
    }

    setIsTyping(false);

    const stylistMsg: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'stylist',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProduct: recProd
    };

    setMessages(prev => [...prev, stylistMsg]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              OmniFit Stylist AI
              <Sparkles size={12} className="text-amber-400" />
            </h3>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Context-Aware Fashion Engine
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
              }`}
            >
              <p>{m.text}</p>

              {m.recommendedProduct && (
                <div 
                  onClick={() => {
                    onSelectProduct(m.recommendedProduct!);
                    onClose();
                  }}
                  className="mt-2 bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3 cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <img src={m.recommendedProduct.image} alt="rec" className="w-12 h-16 object-cover rounded-lg" />
                  <div className="flex-1 space-y-0.5">
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-bold">Recommended Pick</span>
                    <h5 className="font-bold text-white text-xs line-clamp-1">{m.recommendedProduct.name}</h5>
                    <p className="text-[11px] text-slate-400">${m.recommendedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-950 p-3 rounded-2xl w-fit border border-slate-800">
            <Sparkles size={14} className="animate-spin text-indigo-400" />
            <span>OmniFit Stylist is composing recommendations...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask for outfit advice, event recommendations..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full transition-colors shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
