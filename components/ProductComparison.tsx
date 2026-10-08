import React from 'react';
import { Product } from '../types';
import { Camera, Check, Star, ArrowRight } from 'lucide-react';

interface ProductComparisonProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onLaunchTryOn: (product: Product) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onSelectProduct,
  onLaunchTryOn,
}) => {
  const compareList = products.slice(0, 4);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white">Product & Fit Comparison</h1>
          <p className="text-xs text-slate-400 mt-1">Side-by-side breakdown of price, materials, AI size recommendations, and VTON compatibility.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4 bg-slate-900 font-bold text-slate-400 min-w-[160px]">Attribute</th>
                {compareList.map(p => (
                  <th key={p.id} className="p-4 bg-slate-900 font-bold text-white min-w-[220px]">
                    <div className="space-y-2">
                      <img src={p.image} alt={p.name} className="w-full aspect-[3/4] object-cover rounded-2xl border border-slate-800" />
                      <h4 className="font-bold text-xs line-clamp-1">{p.name}</h4>
                      <p className="text-sm font-extrabold text-white">${p.price.toFixed(2)}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-900/40">Brand & Seller</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-slate-200">{p.brand} ({p.seller})</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-900/40">Rating & Reviews</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-amber-400 font-bold">★ {p.rating} ({p.reviewCount})</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-900/40">Silhouette & Fit</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-slate-200">{p.fitType} Fit</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-900/40">Material Composition</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-slate-300">{p.material}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-900/40">AI Recommended Size</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 font-bold text-indigo-400">Size M (94% Fit)</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-400 bg-slate-900/40">Virtual Try-On</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4">
                    <button
                      onClick={() => onLaunchTryOn(p)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Camera size={14} /> Try On
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
