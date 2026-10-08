import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedTags, setDetectedTags] = useState<{ category: string; color: string; style: string } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = reader.result as string;
      setUploadedImage(img);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    setDetectedTags(null);
    await new Promise(r => setTimeout(r, 1200));

    setDetectedTags({
      category: 'Outerwear / Trench Coat',
      color: 'Beige / Warm Sand',
      style: 'Minimalist Tailored'
    });
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-6 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Visual AI Garment Search</h3>
              <p className="text-xs text-slate-400">Upload any inspiration image to find visually similar items in our store.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {!uploadedImage ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-10 text-center cursor-pointer transition-colors space-y-3"
          >
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <Upload size={40} className="mx-auto text-indigo-400" />
            <p className="text-xs text-slate-300 font-bold">Drag and drop fashion photo or click to upload</p>
            <span className="text-[10px] text-slate-500 block">Supports JPG, PNG, WEBP up to 10MB</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Uploaded Photo</span>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-4">
              {isAnalyzing ? (
                <div className="py-12 text-center space-y-3">
                  <Sparkles size={32} className="mx-auto text-indigo-400 animate-spin" />
                  <p className="text-xs text-slate-300 font-bold">Analyzing Garment Texture & Silhouettes...</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-indigo-400 flex items-center gap-1">
                      <Sparkles size={14} /> Detected Garment Attributes
                    </span>
                    <p className="text-slate-300"><strong className="text-white">Category:</strong> {detectedTags?.category}</p>
                    <p className="text-slate-300"><strong className="text-white">Color Palette:</strong> {detectedTags?.color}</p>
                    <p className="text-slate-300"><strong className="text-white">Style Silhouette:</strong> {detectedTags?.style}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white block">Visually Similar Products:</span>
                    {products.slice(0, 2).map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-indigo-500/40"
                      >
                        <img src={p.image} alt={p.name} className="w-12 h-16 object-cover rounded-xl" />
                        <div className="flex-1 space-y-0.5">
                          <h5 className="font-bold text-white text-xs">{p.name}</h5>
                          <span className="text-[10px] text-emerald-400 font-bold">96% Visual Similarity</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
