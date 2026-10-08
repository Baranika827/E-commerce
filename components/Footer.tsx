import React from 'react';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Lock, Camera, ArrowUp } from 'lucide-react';
import { ViewMode, DashboardTab } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode, dashboardTab?: DashboardTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Top Features Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Camera size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">AI Virtual Try-On</h4>
              <p className="text-xs text-slate-400">See clothes on your body structure before buying.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">94%+ Size Precision</h4>
              <p className="text-xs text-slate-400">AI size recommendation backed by keypoint estimation.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Express Logistics</h4>
              <p className="text-xs text-slate-400">Free 1-2 day shipping on orders over $75.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400">30-day return policy with Virtual Try-On feedback.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-bold text-white font-mono">OmniFit<span className="text-indigo-400">.ai</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            OmniFit is an AI-powered fashion platform revolutionizing online shopping with computer vision, generative virtual try-on, personalized sizing intelligence, and digital wardrobe optimization.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Lock size={12} className="text-emerald-400" />
              100% Encrypted Biometric Privacy
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">AI Platform</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.TryOnStudio)} className="hover:text-white transition-colors">
                Virtual Try-On Studio
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.Measurements)} className="hover:text-white transition-colors">
                AI Body Measurements
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.Wardrobe)} className="hover:text-white transition-colors">
                Digital Wardrobe
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.AIRecommendations)} className="hover:text-white transition-colors">
                AI Style Engine
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate(ViewMode.Compare)} className="hover:text-white transition-colors">
                Product Comparison
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Account & Orders</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.Overview)} className="hover:text-white transition-colors">
                User Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.Orders)} className="hover:text-white transition-colors">
                My Orders & Tracking
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.Returns)} className="hover:text-white transition-colors">
                Returns & Fit Feedback
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.Wishlist)} className="hover:text-white transition-colors">
                Wishlist
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate(ViewMode.Cart)} className="hover:text-white transition-colors">
                Shopping Cart
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Company & Admin</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate(ViewMode.Admin)} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                Admin Analytics Dashboard
              </button>
            </li>
            <li><a href="#" className="hover:text-white transition-colors">About OmniFit AI</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sustainability & Ethics</a></li>
            <li><a href="#" className="hover:text-white transition-colors">AI Accuracy Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Back to top */}
      <div className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 OmniFit Inc. All rights reserved. Next-Gen Fashion Technology.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Notice</a>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
