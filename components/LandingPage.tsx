import React from 'react';
import { 
  Sparkles, Camera, SlidersHorizontal, Layers, ShieldCheck, 
  ArrowRight, CheckCircle2, Star, Play, Users, ShoppingBag, Eye 
} from 'lucide-react';
import { Product, ViewMode, DashboardTab } from '../types';

interface LandingPageProps {
  products: Product[];
  onNavigate: (view: ViewMode, dashboardTab?: DashboardTab) => void;
  onLaunchTryOn: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  products,
  onNavigate,
  onLaunchTryOn,
  onSelectProduct,
}) => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 md:py-32 border-b border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              The Next Era of Fashion E-Commerce
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Try Before You Buy. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                See Clothes On You.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience your wardrobe before it arrives. OmniFit combines computer vision, generative AI fitting, and body keypoint sizing to eliminate fit uncertainty.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.TryOnStudio)}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-indigo-400/30"
              >
                <Camera size={20} />
                Try Virtually Now
              </button>

              <button
                onClick={() => onNavigate(ViewMode.Catalog)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Explore Collections
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Micro Metrics */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-900 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-2xl font-black text-white">94%+</span>
                <p className="text-xs text-slate-400">Size Accuracy</p>
              </div>
              <div>
                <span className="text-2xl font-black text-indigo-400">0.8s</span>
                <p className="text-xs text-slate-400">VTON Fitting Speed</p>
              </div>
              <div>
                <span className="text-2xl font-black text-white">40%</span>
                <p className="text-xs text-slate-400">Lower Return Rate</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src="/Dress-1.png"
                alt="Virtual Try-On Demo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-5 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-400" /> AI Pose Match Verified
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    94% Quality Match
                  </span>
                </div>
                <p className="text-xs text-slate-300">Classic Urban Trench Coat • Size M Fit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Curated Arrivals</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Trending Garments</h2>
          </div>
          <button
            onClick={() => onNavigate(ViewMode.Catalog)}
            className="text-xs text-indigo-400 hover:underline font-bold flex items-center gap-1"
          >
            View All Garments <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-4 transition-all hover:shadow-2xl cursor-pointer space-y-3 flex flex-col group"
            >
              <div 
                className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 relative"
                onClick={() => onSelectProduct(p)}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.hasTryOn && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLaunchTryOn(p);
                    }}
                    className="absolute bottom-3 left-3 right-3 bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-md text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Camera size={14} /> Try Virtually
                  </button>
                )}
              </div>

              <div onClick={() => onSelectProduct(p)} className="space-y-1 flex-1">
                <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
                  {p.brand}
                </span>
                <h3 className="font-bold text-white text-xs line-clamp-1 group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star size={12} fill="currentColor" />
                  <span className="text-slate-300 font-bold">{p.rating}</span>
                  <span className="text-slate-500 text-[10px]">({p.reviewCount})</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
                <span className="text-base font-extrabold text-white">${p.price.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">In Stock</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
