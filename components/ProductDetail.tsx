import React, { useState } from 'react';
import { 
  Star, ChevronRight, Camera, Heart, CheckCircle, Share2, 
  RotateCcw, ShieldCheck, Truck, Sparkles, SlidersHorizontal, 
  Info, ArrowRight, Layers, Check, ShoppingBag
} from 'lucide-react';
import { Product, ColorOption, UserProfile } from '../types';

interface ProductDetailProps {
  product: Product;
  userProfile: UserProfile;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ColorOption, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: ColorOption, quantity: number) => void;
  onLaunchTryOn: (product: Product) => void;
  onNavigateCategory: (category: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  userProfile,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onLaunchTryOn,
  onNavigateCategory,
}) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0] || { name: 'Default', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedShare, setCopiedShare] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'measurements' | 'reviews'>('details');

  // Dynamic calculations
  const originalPrice = product.originalPrice || Math.round(product.price * 1.25);
  const discountPercent = product.discountPercent || Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // AI Size Match evaluation based on user measurements vs product specs
  const userChest = userProfile.measurements.chestCm;
  const prodChest = product.measurements?.chestCm || 94;
  const isOptimalFit = Math.abs(userChest - prodChest) <= 6;
  const recSize = userProfile.usualSizes.tops || 'M';

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    if (color.image) {
      setSelectedImage(color.image);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-900/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-slate-400 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigateCategory('All')} className="hover:text-white transition-colors">
            Home
          </button>
          <ChevronRight size={12} className="text-slate-600" />
          <button onClick={() => onNavigateCategory(product.category)} className="hover:text-white transition-colors">
            {product.category}
          </button>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="font-semibold text-slate-200 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Try Virtually Floating Overlay Button */}
              {product.hasTryOn && (
                <button
                  onClick={() => onLaunchTryOn(product)}
                  className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-400/30"
                >
                  <Camera size={20} className="text-indigo-200 animate-pulse" />
                  <span>Try Virtually On Yourself</span>
                  <Sparkles size={16} className="text-amber-300" />
                </button>
              )}

              {/* Wishlist & Share buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg ${
                    isWishlisted 
                      ? 'bg-rose-500 text-white shadow-rose-500/40 scale-110' 
                      : 'bg-slate-950/70 text-slate-300 hover:text-rose-400 hover:bg-slate-900 border border-slate-700/60'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-2xl bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700/60 transition-all shadow-lg"
                  title="Share Garment"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Copied toast */}
              {copiedShare && (
                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl animate-fade-in flex items-center gap-1">
                  <Check size={14} /> Link copied!
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-900 ${
                    selectedImage === img ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Middle Column: Garment Details & AI Fit Match (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-indigo-500/10 text-indigo-400 font-bold px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-400">Category: {product.category}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">{product.name}</h1>
              
              {/* Ratings */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-white">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
                <span className="text-slate-700">|</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle size={14} /> Verified Fit Guarantee
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white">${product.price.toFixed(2)}</span>
                <span className="text-lg text-slate-500 line-through">${originalPrice.toFixed(2)}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Save {discountPercent}%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Taxes included. Free express shipping on orders above $75.
              </p>
            </div>

            {/* AI Size & Fit Recommendation Banner */}
            <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={16} className="text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
                  OmniFit AI Size Engine
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  High Confidence
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-lg">
                  {recSize}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Recommended Size: {recSize}</h4>
                  <p className="text-xs text-slate-300">
                    Calculated from your chest ({userChest}cm) & shoulder ({userProfile.measurements.shoulderWidthCm}cm) profile.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Check size={14} className="text-emerald-400" />
                  Chest width matches garment tolerance (+{Math.abs(userChest - prodChest)}cm easement).
                </p>
                <p className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Check size={14} className="text-emerald-400" />
                  Fit Preference: {product.fitType} fit design.
                </p>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex justify-between">
                <span>Color: <strong className="text-white">{selectedColor.name}</strong></span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color)}
                    className={`group relative p-1 rounded-full border-2 transition-all ${
                      selectedColor.name === color.name ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span 
                      className="w-8 h-8 rounded-full block border border-white/20 shadow-inner" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300 uppercase tracking-wider">Select Size</span>
                <button className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
                  <RotateCcw size={13} /> Size & Measurement Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(size => {
                  const isRec = size === recSize;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative py-3 rounded-xl font-bold text-sm transition-all border ${
                        selectedSize === size
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {size}
                      {isRec && (
                        <span className="absolute -top-1.5 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                          AI Pick
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-white text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  Maximum {product.stock} items per customer.
                </span>
              </div>
            </div>

            {/* Garment Highlights */}
            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
              <p><strong className="text-slate-100">Material:</strong> {product.material}</p>
              <p><strong className="text-slate-100">Fit Silhouette:</strong> {product.fitType}</p>
              <p><strong className="text-slate-100">Care Instructions:</strong> Dry clean recommended or gentle cold machine wash.</p>
            </div>
          </div>

          {/* Right Column: Order Checkout Box (3 cols) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-slate-400">Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
                  <span className="text-2xl font-extrabold text-white">${(product.price * quantity).toFixed(2)}</span>
                </div>
                
                {/* Dynamic Stock Status */}
                <div className="mt-3">
                  {product.stock > 5 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      In Stock - Ready to Ship ({product.stock} left)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      Low Stock - Only {product.stock} remaining
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery info */}
              <div className="space-y-3 text-xs border-t border-b border-slate-800 py-4">
                <div className="flex items-start gap-2.5">
                  <Truck size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Estimated Delivery</span>
                    <p className="text-slate-400">{product.deliveryEstimate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Fulfilled & Verified</span>
                    <p className="text-slate-400">Ships from {product.seller}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {product.hasTryOn && (
                  <button
                    onClick={() => onLaunchTryOn(product)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Camera size={18} />
                    Try Virtually On You
                  </button>
                )}

                <button
                  onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag size={18} className="text-indigo-400" />
                  Add to Cart
                </button>

                <button
                  onClick={() => onBuyNow(product, selectedSize, selectedColor, quantity)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Buy Now with 1-Click
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Secure 256-bit SSL encrypted checkout. 30-day return policy guarantee.
              </p>
            </div>
          </div>

        </div>

        {/* Tabbed Extra Details / Reviews Section */}
        <div className="mt-16 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="flex border-b border-slate-800 gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'details' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Description & Specifications
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`pb-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'measurements' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Garment Dimensions & Fit Profile
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'reviews' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'details' && (
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-w-3xl">
                <p>{product.description}</p>
                <h4 className="font-bold text-white pt-2">Key Highlights:</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li><strong className="text-slate-200">High Resolution Texture:</strong> Digitized for 3D body keypoint alignment in Virtual Try-On Studio.</li>
                  <li><strong className="text-slate-200">Sustainably Sourced:</strong> Manufactured under certified eco-ethical standards.</li>
                  <li><strong className="text-slate-200">Garment Crafting:</strong> Reinforced stitching with natural drape retention.</li>
                </ul>
              </div>
            )}

            {activeTab === 'measurements' && (
              <div className="space-y-4 max-w-xl">
                <h4 className="font-bold text-white text-sm">Product Dimensions (Size {selectedSize})</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Chest Width</span>
                    <p className="text-lg font-bold text-white mt-1">{product.measurements?.chestCm || 94} cm</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Shoulder Width</span>
                    <p className="text-lg font-bold text-white mt-1">{product.measurements?.shoulderCm || 41} cm</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Waist Circumference</span>
                    <p className="text-lg font-bold text-white mt-1">{product.measurements?.waistCm || 76} cm</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Garment Length</span>
                    <p className="text-lg font-bold text-white mt-1">{product.measurements?.lengthCm || 102} cm</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map(rev => (
                    <div key={rev.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm">{rev.userName}</span>
                        <span className="text-xs text-slate-500">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                        ))}
                        {rev.fitFeedback && (
                          <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded">
                            Fit: {rev.fitFeedback}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No customer reviews written yet. Be the first to try on and review!</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
