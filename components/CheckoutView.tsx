import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, CreditCard, Truck, MapPin, ArrowRight, Lock } from 'lucide-react';
import { CartItem, Order, UserProfile } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  userProfile: UserProfile;
  onOrderComplete: (newOrder: Order) => void;
  onContinueShopping: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  userProfile,
  onOrderComplete,
  onContinueShopping,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [address, setAddress] = useState(userProfile.location || '742 Evergreen Terrace, San Francisco, CA 94107');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'upi'>('card');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const grandTotal = subtotal + (subtotal > 75 ? 0 : 9.99) + (subtotal * 0.08);

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      totalAmount: grandTotal,
      shippingAddress: address,
      paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4092' : paymentMethod === 'applepay' ? 'Apple Pay' : 'UPI Pay',
      status: 'Order Placed',
      deliveryEstimate: 'Tomorrow by 2 PM',
      trackingSteps: [
        { title: 'Order Placed', description: 'Verified and queued', timestamp: 'Just now', completed: true, current: true },
        { title: 'Confirmed', description: 'Reserved at hub', completed: false, current: false },
        { title: 'Packed', description: 'Inspected with AI fit precision tag', completed: false, current: false },
        { title: 'Shipped', description: 'In transit', completed: false, current: false },
        { title: 'Delivered', description: 'Photo verified', completed: false, current: false }
      ]
    };
    setPlacedOrder(newOrder);
    onOrderComplete(newOrder);
    setStep(4);
  };

  if (step === 4 && placedOrder) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-black text-white">Order Confirmed!</h2>
          <p className="text-xs text-slate-300">
            Thank you for shopping with OmniFit. Your order <strong className="text-indigo-400 font-mono">{placedOrder.id}</strong> has been successfully placed.
          </p>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-2">
            <p><strong className="text-white">Shipping Address:</strong> {placedOrder.shippingAddress}</p>
            <p><strong className="text-white">Total Amount Paid:</strong> ${placedOrder.totalAmount.toFixed(2)}</p>
            <p><strong className="text-white">Estimated Delivery:</strong> {placedOrder.deliveryEstimate}</p>
          </div>

          <button
            onClick={onContinueShopping}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 rounded-2xl transition-all"
          >
            Continue Shopping & Track Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-white">Secure Checkout</h1>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-3 rounded-2xl border font-bold ${step === 1 ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
            1. Shipping Address
          </div>
          <div className={`p-3 rounded-2xl border font-bold ${step === 2 ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
            2. Mock Payment
          </div>
          <div className={`p-3 rounded-2xl border font-bold ${step === 3 ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
            3. Order Review
          </div>
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin size={20} className="text-indigo-400" /> Enter Delivery Address
            </h3>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 h-24"
            />
            <button
              onClick={() => setStep(2)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard size={20} className="text-indigo-400" /> Select Payment Method (Safe Demo Mode)
            </h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <input type="radio" name="pay" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <span className="font-bold text-white">Credit / Debit Card (Demo Visa •••• 4092)</span>
              </label>
              <label className="flex items-center gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <input type="radio" name="pay" checked={paymentMethod === 'applepay'} onChange={() => setPaymentMethod('applepay')} />
                <span className="font-bold text-white">Apple Pay / Google Pay</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-2xl">
                Back
              </button>
              <button onClick={() => setStep(3)} className="bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-2xl">
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white">Review & Place Order</h3>
            <div className="bg-slate-950 p-4 rounded-2xl text-xs space-y-2">
              <p><strong className="text-white">Total Amount:</strong> ${grandTotal.toFixed(2)}</p>
              <p><strong className="text-white">Shipping to:</strong> {address}</p>
              <p><strong className="text-white">Payment Method:</strong> {paymentMethod}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(2)} className="bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-2xl">
                Back
              </button>
              <button onClick={handlePlaceOrder} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 py-3.5 rounded-2xl shadow-lg">
                Complete Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
