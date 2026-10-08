import React, { useState } from 'react';
import { 
  Sparkles, Search, ShoppingBag, Heart, User, Camera, 
  Layers, SlidersHorizontal, ChevronDown, Bot, LayoutDashboard, 
  ShoppingBasket, Clock, PackageCheck, LogOut, ArrowRight, Upload
} from 'lucide-react';
import { ViewMode, DashboardTab } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onNavigate: (view: ViewMode, dashboardTab?: DashboardTab) => void;
  activeView: ViewMode;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenImageSearch: () => void;
  onOpenStylist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onNavigate,
  activeView,
  searchQuery,
  onSearchChange,
  onOpenImageSearch,
  onOpenStylist,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 px-4 py-1.5 text-xs text-slate-300 border-b border-indigo-500/20 flex justify-between items-center">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-500/30">
              <Sparkles size={12} className="text-indigo-400 animate-pulse" />
              OmniFit AI 2.0 Engine
            </span>
            <span className="hidden md:inline text-slate-400">
              Real-time pose estimation & hyper-realistic garment fitting initialized.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.Measurements)}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <SlidersHorizontal size={12} className="text-indigo-400" />
              <span>AI Body Profile: <strong className="text-indigo-300">94% Fit Score</strong></span>
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <button 
              onClick={() => onNavigate(ViewMode.Admin)}
              className="hover:text-indigo-300 text-slate-400 transition-colors hidden sm:inline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate(ViewMode.Landing)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="text-white" size={22} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-white font-mono">OmniFit</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              Virtual Try-On & Fashion
            </span>
          </div>
        </div>

        {/* Global AI Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full flex items-center">
            <div className="absolute left-3.5 text-slate-400 flex items-center gap-1 pointer-events-none">
              <Search size={18} />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigate(ViewMode.Catalog);
              }}
              placeholder="Search garments or try AI prompt e.g. 'Black formal dress under $150'..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-full pl-10 pr-28 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
            
            {/* Visual Image Search & AI Stylist triggers */}
            <div className="absolute right-2 flex items-center gap-1">
              <button 
                onClick={onOpenImageSearch}
                title="Search by uploading an image"
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <Upload size={15} />
              </button>
              <button
                onClick={() => onNavigate(ViewMode.Catalog)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3 py-1.5 rounded-full transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex items-center gap-3">
          {/* Virtual Try-On Studio CTA Button */}
          <button
            onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.TryOnStudio)}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 border border-indigo-400/30"
          >
            <Camera size={16} className="text-indigo-200" />
            <span>Try-On Studio</span>
          </button>

          {/* AI Stylist Assistant */}
          <button
            onClick={onOpenStylist}
            title="Chat with OmniFit AI Stylist"
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-full transition-colors"
          >
            <Bot size={16} className="text-violet-400" />
            <span className="hidden lg:inline">AI Stylist</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.Wishlist)}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => onNavigate(ViewMode.Cart)}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors flex items-center gap-1"
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Sophia Vance"
                className="w-8 h-8 rounded-full object-cover border border-indigo-400/50"
              />
              <span className="hidden lg:inline text-xs font-semibold text-slate-200">Sophia</span>
              <ChevronDown size={14} className="text-slate-400 hidden lg:inline" />
            </button>

            {isUserMenuOpen && (
              <div 
                onMouseLeave={() => setIsUserMenuOpen(false)}
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-800/80"
              >
                <div className="px-4 py-3">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate">Sophia Vance</p>
                  <span className="inline-block mt-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-indigo-500/30">
                    Pro AI Membership
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate(ViewMode.Dashboard, DashboardTab.Overview);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                  >
                    <LayoutDashboard size={16} className="text-indigo-400" />
                    User Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onNavigate(ViewMode.Dashboard, DashboardTab.Measurements);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                  >
                    <SlidersHorizontal size={16} className="text-indigo-400" />
                    My Measurements
                  </button>
                  <button
                    onClick={() => {
                      onNavigate(ViewMode.Dashboard, DashboardTab.Wardrobe);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                  >
                    <Layers size={16} className="text-indigo-400" />
                    My Digital Wardrobe
                  </button>
                  <button
                    onClick={() => {
                      onNavigate(ViewMode.Dashboard, DashboardTab.Orders);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                  >
                    <PackageCheck size={16} className="text-indigo-400" />
                    Orders & Tracking
                  </button>
                  <button
                    onClick={() => {
                      onNavigate(ViewMode.Dashboard, DashboardTab.TryOnHistory);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                  >
                    <Clock size={16} className="text-indigo-400" />
                    Try-On History
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate(ViewMode.Admin);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-indigo-400 hover:bg-slate-800 flex items-center gap-2 font-semibold"
                  >
                    <Sparkles size={16} />
                    Admin Analytics Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub Header Category Menu Bar */}
      <nav className="bg-slate-950/80 px-4 py-2 border-t border-slate-800/60 overflow-x-auto whitespace-nowrap scrollbar-hide text-xs text-slate-300 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6 font-medium">
          <button 
            onClick={() => onNavigate(ViewMode.Home)}
            className={`hover:text-indigo-400 transition-colors ${activeView === ViewMode.Home ? 'text-indigo-400 font-bold' : ''}`}
          >
            Home Overview
          </button>
          <button 
            onClick={() => onNavigate(ViewMode.Catalog)}
            className={`hover:text-indigo-400 transition-colors ${activeView === ViewMode.Catalog ? 'text-indigo-400 font-bold' : ''}`}
          >
            All Collections
          </button>
          <button 
            onClick={() => onNavigate(ViewMode.Catalog)}
            className="hover:text-indigo-400 transition-colors"
          >
            Dresses
          </button>
          <button 
            onClick={() => onNavigate(ViewMode.Catalog)}
            className="hover:text-indigo-400 transition-colors"
          >
            Outerwear & Coats
          </button>
          <button 
            onClick={() => onNavigate(ViewMode.Catalog)}
            className="hover:text-indigo-400 transition-colors"
          >
            Tailored Blazers
          </button>
          <button 
            onClick={() => onNavigate(ViewMode.Catalog)}
            className="hover:text-indigo-400 transition-colors"
          >
            Casual & Tops
          </button>
          <button 
            onClick={() => onNavigate(ViewMode.Compare)}
            className={`hover:text-indigo-400 transition-colors ${activeView === ViewMode.Compare ? 'text-indigo-400 font-bold' : ''}`}
          >
            Compare Products
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 text-slate-400 font-medium">
          <button 
            onClick={() => onNavigate(ViewMode.Dashboard, DashboardTab.AIRecommendations)}
            className="hover:text-indigo-300 flex items-center gap-1 text-indigo-400 font-semibold"
          >
            <Sparkles size={14} />
            AI Recommended For You
          </button>
        </div>
      </nav>
    </header>
  );
};
