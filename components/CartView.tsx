import React from 'react';
import { ShoppingBag, Trash2, Camera, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onLaunchTryOn: (product: Product) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onLaunchTryOn,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const taxes = subtotal * 0.08;
  const grandTotal = subtotal + shipping + taxes;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          Shopping Cart
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full border border-indigo-500/30">
            {cart.length} {cart.length === 1 ? 'Garment' : 'Garments'}
          </span>
        </h1>

        {cart.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-2xl">
            <ShoppingBag size={48} className="mx-auto text-slate-600" />
            <h3 className="text-xl font-bold text-white">Your cart is currently empty</h3>
            <p className="text-xs text-slate-400">Discover AI-recommended garments tailored for your body profile.</p>
            <button
              onClick={onContinueShopping}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item, idx) => (
                <div key={`${item.product.id}_${idx}`} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 shadow-xl">
                  <img src={item.product.image} alt={item.product.name} className="w-24 h-32 object-cover rounded-2xl border border-slate-800 shrink-0" />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
                          {item.product.brand}
                        </span>
                        <h3 className="font-bold text-white text-base mt-1">{item.product.name}</h3>
                      </div>
                      <span className="text-base font-extrabold text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Color: <strong className="text-white">{item.selectedColor.name}</strong></span>
                      <span>•</span>
                      <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <div className="flex items-center border border-slate-800 rounded-xl bg-slate-950 p-1">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center text-slate-300 font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.min(item.product.stock, item.quantity + 1))}
                          className="w-7 h-7 flex items-center justify-center text-slate-300 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.product.hasTryOn && (
                          <button
                            onClick={() => onLaunchTryOn(item.product)}
                            className="text-xs text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                          >
                            <Camera size={14} /> Try On
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-xs text-rose-400 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Box (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl sticky top-24">
              <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">Order Summary</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Express Shipping</span>
                  <span className="font-bold text-emerald-400">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-white">${taxes.toFixed(2)}</span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-extrabold text-white">
                  <span>Total Due</span>
                  <span className="text-indigo-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
