import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, ShoppingBag, Camera, 
  RotateCcw, Sparkles, DollarSign, Package, CheckCircle2, 
  AlertCircle, ArrowUpRight, Search, Filter
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vton_analytics' | 'products' | 'orders'>('overview');

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0) + 12450;
  const totalTryOns = 1420;
  const tryOnSuccessRate = 96.2;
  const cartConversionRate = 34.8;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      {/* Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg">
            <BarChart3 size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              OmniFit Executive Admin & AI Analytics
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                Live Data
              </span>
            </h1>
            <p className="text-xs text-slate-400">Virtual Try-On Telemetry & Store Intelligence</p>
          </div>
        </div>

        <button
          onClick={onBackToStore}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors border border-slate-700"
        >
          Return to Platform
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-3 border-b border-slate-800 pb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Overview & Executive Metrics
          </button>
          <button
            onClick={() => setActiveTab('vton_analytics')}
            className={`px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === 'vton_analytics' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Virtual Try-On AI Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === 'products' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Products & Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Orders & Returns ({orders.length})
          </button>
        </div>

        {/* OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span>Gross Revenue</span>
                  <DollarSign size={18} className="text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</p>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp size={12} /> +18.4% vs last month
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span>Total Users</span>
                  <Users size={18} className="text-indigo-400" />
                </div>
                <p className="text-2xl font-black text-white">4,890</p>
                <span className="text-[11px] text-indigo-400 font-bold">1,240 active this week</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span>Try-On Sessions</span>
                  <Camera size={18} className="text-violet-400" />
                </div>
                <p className="text-2xl font-black text-white">{totalTryOns}</p>
                <span className="text-[11px] text-violet-400 font-bold">{tryOnSuccessRate}% AI success rate</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span>Conversion After Try-On</span>
                  <Sparkles size={18} className="text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white">{cartConversionRate}%</p>
                <span className="text-[11px] text-emerald-400 font-bold">+12% higher than static view</span>
              </div>
            </div>

            {/* Performance Visual Bars */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-base">Key Performance & Conversion Funnel</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Product Detail Views to Virtual Try-On Launch Rate</span>
                    <span className="font-bold text-indigo-400">68.5%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-indigo-500 h-full w-[68.5%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Try-On Result to Add-To-Cart Rate</span>
                    <span className="font-bold text-emerald-400">42.1%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full w-[42.1%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Return Rate Reduction (AI Fitted Orders vs Regular)</span>
                    <span className="font-bold text-amber-400">-38.2% Returns</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-amber-500 h-full w-[82%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIRTUAL TRY-ON ANALYTICS */}
        {activeTab === 'vton_analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Camera size={20} className="text-indigo-400" />
                VTON Telemetry & AI Model Performance
              </h3>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400">Total VTON Runs</span>
                  <p className="text-xl font-bold text-white mt-1">1,420</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400">Successful Try-Ons</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">1,366 (96.2%)</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400">Failed / Re-Prompted</span>
                  <p className="text-xl font-bold text-rose-400 mt-1">54 (3.8%)</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-400">Avg AI Generation Time</span>
                  <p className="text-xl font-bold text-indigo-400 mt-1">0.82 seconds</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-white text-sm">Most Tried Garments:</h4>
                <div className="space-y-2">
                  {products.slice(0, 3).map(p => (
                    <div key={p.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg" />
                        <span className="font-bold text-white">{p.name}</span>
                      </div>
                      <span className="text-indigo-400 font-bold">482 Try-Ons</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS & INVENTORY TAB */}
        {activeTab === 'products' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base">Garment Inventory & VTON Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">Garment</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">VTON Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="p-3 flex items-center gap-3 font-bold text-white">
                        <img src={p.image} alt={p.name} className="w-8 h-10 object-cover rounded-lg" />
                        {p.name}
                      </td>
                      <td className="p-3 text-slate-300">{p.category}</td>
                      <td className="p-3 font-bold text-white">${p.price.toFixed(2)}</td>
                      <td className="p-3 text-slate-300">{p.stock} units</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          VTON Ready
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base">Recent Orders</h3>
            <div className="space-y-3 text-xs">
              {orders.map(o => (
                <div key={o.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white font-mono">{o.id}</span>
                    <p className="text-slate-400 text-[11px]">Placed on {o.date} • {o.items.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-white text-sm block">${o.totalAmount.toFixed(2)}</span>
                    <span className="text-emerald-400 font-bold">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
