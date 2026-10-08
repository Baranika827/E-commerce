import React, { useState } from 'react';
import { 
  LayoutDashboard, User, SlidersHorizontal, Layers, Camera, 
  Heart, ShoppingBag, PackageCheck, RotateCcw, Clock, 
  Sparkles, Bell, Settings, ArrowRight, ShieldCheck, 
  Check, Plus, Trash2, ExternalLink, RefreshCw, Upload, Search, Filter
} from 'lucide-react';
import { 
  DashboardTab, UserProfile, Product, Order, TryOnResult, 
  WardrobeItem, SavedLook, StyleNotification, ColorOption 
} from '../../types';

interface UserDashboardProps {
  initialTab?: DashboardTab;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  products: Product[];
  orders: Order[];
  tryOnHistory: TryOnResult[];
  wardrobe: WardrobeItem[];
  savedLooks: SavedLook[];
  wishlist: Product[];
  notifications: StyleNotification[];
  onLaunchTryOnStudio: (product?: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption, quantity: number) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onNavigateProduct: (product: Product) => void;
  onNavigateView: (view: any) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  initialTab = DashboardTab.Overview,
  userProfile,
  onUpdateProfile,
  products,
  orders,
  tryOnHistory,
  wardrobe,
  savedLooks,
  wishlist,
  notifications,
  onLaunchTryOnStudio,
  onAddToCart,
  onRemoveFromWishlist,
  onNavigateProduct,
  onNavigateView,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Measurement state
  const [measurementForm, setMeasurementForm] = useState(userProfile.measurements);
  const [isSavedMeasurement, setIsSavedMeasurement] = useState(false);

  // Return Form State
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<string>(orders[0]?.id || '');
  const [returnReason, setReturnReason] = useState<string>('Poor Fit');
  const [fitFeedback, setFitFeedback] = useState<string>('Accurate');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  // Digital Wardrobe Outfit Builder State
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Casual');
  const [generatedOutfit, setGeneratedOutfit] = useState<Product[] | null>(null);

  const handleSaveProfile = () => {
    onUpdateProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleSaveMeasurements = () => {
    const updated = {
      ...profileForm,
      measurements: {
        ...measurementForm,
        lastUpdated: new Date().toISOString().split('T')[0],
        source: 'Manual Input' as const
      }
    };
    onUpdateProfile(updated);
    setIsSavedMeasurement(true);
    setTimeout(() => setIsSavedMeasurement(false), 2500);
  };

  const handleGenerateOutfit = () => {
    // Pick 2 random items matching occasion
    const tops = products.filter(p => p.category === 'Tops' || p.category === 'Outerwear');
    const dresses = products.filter(p => p.category === 'Dresses' || p.category === 'Tailored');
    const pick1 = tops[Math.floor(Math.random() * tops.length)] || products[0];
    const pick2 = dresses[Math.floor(Math.random() * dresses.length)] || products[1];
    setGeneratedOutfit([pick1, pick2]);
  };

  const navItems = [
    { id: DashboardTab.Overview, label: 'Overview', icon: LayoutDashboard },
    { id: DashboardTab.Profile, label: 'My Profile', icon: User },
    { id: DashboardTab.Measurements, label: 'My Measurements', icon: SlidersHorizontal },
    { id: DashboardTab.Wardrobe, label: 'My Wardrobe', icon: Layers },
    { id: DashboardTab.TryOnStudio, label: 'Virtual Try-On', icon: Camera },
    { id: DashboardTab.SavedLooks, label: 'Saved Looks', icon: Sparkles },
    { id: DashboardTab.AIRecommendations, label: 'AI Recommendations', icon: Sparkles },
    { id: DashboardTab.Shopping, label: 'Shopping Catalog', icon: ShoppingBag },
    { id: DashboardTab.Wishlist, label: 'Wishlist', icon: Heart },
    { id: DashboardTab.Orders, label: 'Orders & Tracking', icon: PackageCheck },
    { id: DashboardTab.Returns, label: 'Returns & Fit Survey', icon: RotateCcw },
    { id: DashboardTab.TryOnHistory, label: 'Try-On History', icon: Clock },
    { id: DashboardTab.StylePreferences, label: 'Style Preferences', icon: SlidersHorizontal },
    { id: DashboardTab.Notifications, label: 'Notifications', icon: Bell },
    { id: DashboardTab.Settings, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* User Welcome Banner Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-white">Welcome back, {userProfile.name}!</h1>
                <span className="bg-indigo-500/20 text-indigo-300 font-bold text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  AI Fit Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Body Profile Precision: <strong className="text-emerald-400">94% Confidence Score</strong> • Height: {userProfile.heightCm}cm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchTryOnStudio()}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Camera size={16} /> Quick Virtual Try-On
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Dashboard Sidebar Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 space-y-1 shadow-xl">
              <span className="text-[10px] font-bold text-slate-500 px-4 py-2 block uppercase tracking-wider">
                Dashboard Menu
              </span>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-bold' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-indigo-400'} />
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Content Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === DashboardTab.Overview && (
              <div className="space-y-6">
                {/* Profile Completion KPI */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl grid md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Profile Completion</span>
                    <p className="text-2xl font-extrabold text-white">92% Complete</p>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
                      <div className="bg-indigo-500 h-full w-[92%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Recent Try-Ons</span>
                    <p className="text-2xl font-extrabold text-white">{tryOnHistory.length} Sessions</p>
                    <span className="text-[11px] text-emerald-400 font-medium">94% average fit confidence</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Digital Wardrobe</span>
                    <p className="text-2xl font-extrabold text-white">{wardrobe.length} Items</p>
                    <span className="text-[11px] text-indigo-400 font-medium">3 Saved AI Outfit Combinations</span>
                  </div>
                </div>

                {/* Recent Try-Ons Peek */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Clock size={18} className="text-indigo-400" />
                      Recent Try-On Sessions
                    </h3>
                    <button 
                      onClick={() => setActiveTab(DashboardTab.TryOnHistory)}
                      className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      View All History
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {tryOnHistory.slice(0, 2).map(item => (
                      <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex gap-4 items-center">
                        <img src={item.productImage} alt={item.productName} className="w-16 h-20 object-cover rounded-xl border border-slate-800" />
                        <div className="space-y-1 flex-1">
                          <h4 className="font-bold text-white text-xs line-clamp-1">{item.productName}</h4>
                          <span className="text-[11px] text-slate-400 block">Tried on: {item.date}</span>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                              Size {item.recommendedSize} • {item.qualityMetrics.overallConfidence}% Fit
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Products Grid */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    AI Recommended For Your Body Profile
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.slice(0, 3).map(p => (
                      <div 
                        key={p.id}
                        onClick={() => onNavigateProduct(p)}
                        className="bg-slate-950 p-3 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-900">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <h4 className="font-bold text-white text-xs line-clamp-1">{p.name}</h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-white">${p.price.toFixed(2)}</span>
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded">
                            Rec Size M
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MY PROFILE */}
            {activeTab === DashboardTab.Profile && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">User Profile & Preferences</h3>
                    <p className="text-xs text-slate-400">Manage your personal information and clothing preferences.</p>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-70"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      disabled={!isEditingProfile}
                      value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-70"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Phone Number</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.phone}
                      onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-70"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Location / Shipping City</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.location}
                      onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-70"
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <button
                    onClick={handleSaveProfile}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            )}

            {/* TAB 3: MY MEASUREMENTS (AI BODY MEASUREMENT SYSTEM) */}
            {activeTab === DashboardTab.Measurements && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <SlidersHorizontal size={20} className="text-indigo-400" />
                      AI Body Measurement Profile
                    </h3>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-3 py-1 rounded-full border border-indigo-500/30">
                      Confidence: {measurementForm.confidenceScore}% • Source: {measurementForm.source}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    *Note: AI measurements are automated estimates based on keypoint ratio models and are not medically or physically exact.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <label className="text-slate-400 block font-semibold">Height (cm)</label>
                    <input
                      type="number"
                      value={measurementForm.heightCm}
                      onChange={e => setMeasurementForm({ ...measurementForm, heightCm: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <label className="text-slate-400 block font-semibold">Shoulder Width (cm)</label>
                    <input
                      type="number"
                      value={measurementForm.shoulderWidthCm}
                      onChange={e => setMeasurementForm({ ...measurementForm, shoulderWidthCm: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <label className="text-slate-400 block font-semibold">Chest / Bust (cm)</label>
                    <input
                      type="number"
                      value={measurementForm.chestCm}
                      onChange={e => setMeasurementForm({ ...measurementForm, chestCm: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <label className="text-slate-400 block font-semibold">Waist (cm)</label>
                    <input
                      type="number"
                      value={measurementForm.waistCm}
                      onChange={e => setMeasurementForm({ ...measurementForm, waistCm: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <label className="text-slate-400 block font-semibold">Hips (cm)</label>
                    <input
                      type="number"
                      value={measurementForm.hipCm}
                      onChange={e => setMeasurementForm({ ...measurementForm, hipCm: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <label className="text-slate-400 block font-semibold">Inseam (cm)</label>
                    <input
                      type="number"
                      value={measurementForm.inseamCm}
                      onChange={e => setMeasurementForm({ ...measurementForm, inseamCm: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={handleSaveMeasurements}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
                  >
                    Save Measurement Profile
                  </button>
                  {isSavedMeasurement && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check size={16} /> Saved!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: MY WARDROBE & AI OUTFIT BUILDER */}
            {activeTab === DashboardTab.Wardrobe && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers size={20} className="text-indigo-400" />
                      Digital Wardrobe Collection
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {wardrobe.map(item => (
                      <div key={item.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-900">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-white text-xs line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{item.category} • {item.color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Outfit Builder */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-400" />
                      AI Wardrobe Outfit Builder
                    </h3>
                    <button
                      onClick={handleGenerateOutfit}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      Generate AI Look
                    </button>
                  </div>

                  <div className="flex gap-3 text-xs">
                    {['Casual', 'Formal', 'Office', 'Date', 'Party'].map(occ => (
                      <button
                        key={occ}
                        onClick={() => setSelectedOccasion(occ)}
                        className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                          selectedOccasion === occ ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>

                  {generatedOutfit && (
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">Generated Look for {selectedOccasion}</span>
                        <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          89% Style Compatibility Score
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {generatedOutfit.map(item => (
                          <div key={item.id} className="flex gap-3 items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-xl border border-slate-800" />
                            <div>
                              <h5 className="font-bold text-white text-xs">{item.name}</h5>
                              <p className="text-[11px] text-slate-400">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: VIRTUAL TRY-ON STUDIO LAUNCHER */}
            {activeTab === DashboardTab.TryOnStudio && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mx-auto">
                  <Camera size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Virtual Try-On Studio</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Experience your clothes before buying with AI pose detection, garment transfer, and keypoint alignment.
                </p>
                <button
                  onClick={() => onLaunchTryOnStudio()}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
                >
                  <Camera size={18} /> Launch Try-On Studio
                </button>
              </div>
            )}

            {/* TAB 8: SHOPPING CATALOG */}
            {activeTab === DashboardTab.Shopping && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">All Store Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {products.map(p => (
                    <div
                      key={p.id}
                      onClick={() => onNavigateProduct(p)}
                      className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-950">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <h4 className="font-bold text-white text-xs line-clamp-1">{p.name}</h4>
                      <p className="text-xs text-slate-400">${p.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: WISHLIST */}
            {activeTab === DashboardTab.Wishlist && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Your Saved Wishlist</h3>
                {wishlist.length === 0 ? (
                  <p className="text-xs text-slate-400">Your wishlist is currently empty.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlist.map(p => (
                      <div key={p.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <img src={p.image} alt={p.name} className="w-full aspect-[3/4] object-cover rounded-xl" />
                        <h4 className="font-bold text-white text-xs line-clamp-1">{p.name}</h4>
                        <p className="text-xs text-slate-400">${p.price.toFixed(2)}</p>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => onLaunchTryOnStudio(p)}
                            className="flex-1 bg-indigo-600 text-white font-bold text-[11px] py-2 rounded-xl"
                          >
                            Try On
                          </button>
                          <button
                            onClick={() => onRemoveFromWishlist(p)}
                            className="p-2 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 11: ORDERS & TRACKING TIMELINE */}
            {activeTab === DashboardTab.Orders && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Order Management & Live Tracking</h3>
                {orders.map(ord => (
                  <div key={ord.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-slate-400">Order ID: </span>
                        <strong className="text-white font-mono">{ord.id}</strong>
                      </div>
                      <span className="bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full border border-indigo-500/30">
                        Status: {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <img src={ord.items[0]?.product.image} alt="Order item" className="w-16 h-20 object-cover rounded-xl border border-slate-800" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{ord.items[0]?.product.name}</h4>
                        <p className="text-xs text-slate-400">Total: ${ord.totalAmount.toFixed(2)} • Delivery: {ord.deliveryEstimate}</p>
                      </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-300 block mb-3">Shipment Progress Timeline:</span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px]">
                        {ord.trackingSteps.map((step, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className={`h-2 rounded-full ${step.completed ? 'bg-emerald-500' : step.current ? 'bg-indigo-500 animate-pulse' : 'bg-slate-800'}`} />
                            <span className={`block font-semibold ${step.completed ? 'text-emerald-400' : 'text-slate-400'}`}>{step.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 12: RETURNS & FIT FEEDBACK SURVEY */}
            {activeTab === DashboardTab.Returns && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl max-w-xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Initiate Garment Return</h3>
                  <p className="text-xs text-slate-400">Hassle-free 30-day return policy. Help improve our AI sizing recommendations.</p>
                </div>

                {returnSubmitted ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-emerald-300 text-xs font-bold">
                    Return request submitted! Our logistics partner will contact you for pickup within 24 hours.
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Select Order Item</label>
                      <select
                        value={selectedOrderForReturn}
                        onChange={e => setSelectedOrderForReturn(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                      >
                        {orders.map(o => (
                          <option key={o.id} value={o.id}>{o.id} - {o.items[0]?.product.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Reason for Return</label>
                      <select
                        value={returnReason}
                        onChange={e => setReturnReason(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                      >
                        <option value="Wrong Size">Wrong Size</option>
                        <option value="Poor Fit">Poor Fit</option>
                        <option value="Product Mismatch">Product Mismatch</option>
                        <option value="Damaged Product">Damaged Product</option>
                        <option value="Changed Mind">Changed Mind</option>
                      </select>
                    </div>

                    <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 space-y-2">
                      <label className="font-bold text-indigo-300 block">
                        Did the Virtual Try-On accurately represent the fit?
                      </label>
                      <select
                        value={fitFeedback}
                        onChange={e => setFitFeedback(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                      >
                        <option value="Accurate">Yes, accurate simulation</option>
                        <option value="Slightly Off">Slightly off in drape/tightness</option>
                        <option value="Inaccurate">Inaccurate</option>
                        <option value="Did Not Use Try-On">Did not use try-on</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setReturnSubmitted(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
                    >
                      Submit Return Request
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 13: TRY-ON HISTORY */}
            {activeTab === DashboardTab.TryOnHistory && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Virtual Try-On Session History</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {tryOnHistory.map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
                      <div className="flex gap-4">
                        <img src={item.generatedResultImage} alt={item.productName} className="w-20 h-28 object-cover rounded-2xl border border-slate-800" />
                        <div className="space-y-1 flex-1">
                          <h4 className="font-bold text-white text-sm">{item.productName}</h4>
                          <span className="text-xs text-slate-400 block">{item.date}</span>
                          <span className="text-xs font-bold text-emerald-400 block">Recommended Size: {item.recommendedSize}</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] grid grid-cols-2 gap-2">
                        <div><span className="text-slate-400">Pose Match:</span> <strong className="text-white">{item.qualityMetrics.poseCompatibility}%</strong></div>
                        <div><span className="text-slate-400">Overall Confidence:</span> <strong className="text-emerald-400">{item.qualityMetrics.overallConfidence}%</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 14: NOTIFICATIONS */}
            {activeTab === DashboardTab.Notifications && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Notifications & Alerts</h3>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0 mt-0.5">
                        <Bell size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{n.title}</h4>
                        <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
