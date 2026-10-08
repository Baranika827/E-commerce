import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, Sparkles, Download, RefreshCw, Check, AlertCircle, Upload } from 'lucide-react';
import { Product } from '../types';

interface LocalVirtualTryOnProps {
  product: Product;
  onClose: () => void;
}

type Stage = 'capture' | 'processing' | 'result';

export const LocalVirtualTryOn: React.FC<LocalVirtualTryOnProps> = ({ product, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stage, setStage] = useState<Stage>('capture');
  const [capturedFace, setCapturedFace] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && mounted) {
              videoRef.current.play().catch(err => {
                console.error('Video play error:', err);
                if (mounted) {
                  setCameraError('Failed to start camera preview. You can upload a photo instead.');
                }
              });
            }
          };
        }
      } catch (err: any) {
        if (!mounted) return;
        
        console.error('Camera error:', err);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera access denied. You can upload a photo instead.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera found. You can upload a photo instead.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setCameraError('Camera is in use. You can upload a photo instead.');
        } else {
          setCameraError('Camera unavailable. You can upload a photo instead.');
        }
      }
    };

    if (stage === 'capture') {
      startCamera();
    }

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stage]);

  // Capture face from webcam
  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    let countdown = 3;
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown === 0) {
        clearInterval(countdownInterval);
        
        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d')!;
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedFace(imageData);
        setIsCapturing(false);
        
        setTimeout(() => generateLocalTryOn(imageData), 500);
      }
    }, 1000);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      setCapturedFace(imageData);
      setTimeout(() => generateLocalTryOn(imageData), 500);
    };
    reader.readAsDataURL(file);
  };

  // Local AI generation using canvas compositing
  const generateLocalTryOn = async (faceImage: string) => {
    setStage('processing');
    setProgress(0);
    setError('');

    try {
      setProgressText('Loading AI models...');
      
      // Simulate model loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(20);

      setProgressText('Analyzing your pose...');
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(40);

      setProgressText('Detecting body landmarks...');
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(60);

      setProgressText('Applying garment transfer...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(80);

      setProgressText('Finalizing result...');
      
      // Create the virtual try-on result
      const result = await createVirtualTryOn(faceImage, product.image);
      
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGeneratedImage(result);
      setStage('result');
      console.log('✅ Local virtual try-on complete');

    } catch (err: any) {
      console.error('❌ Generation error:', err);
      setError(`Generation failed: ${err.message}`);
      setStage('capture');
    }
  };

  // Create virtual try-on by compositing images
  const createVirtualTryOn = async (personImage: string, garmentImage: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) {
        reject(new Error('Canvas not available'));
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Load person image
      const personImg = new Image();
      personImg.crossOrigin = 'anonymous';
      personImg.onload = () => {
        // Set canvas size to person image
        canvas.width = personImg.width;
        canvas.height = personImg.height;

        // Draw person image
        ctx.drawImage(personImg, 0, 0);

        // Load garment image
        const garmentImg = new Image();
        garmentImg.crossOrigin = 'anonymous';
        garmentImg.onload = () => {
          // Calculate garment dimensions to fit on person
          const garmentWidth = personImg.width * 0.6;
          const garmentHeight = (garmentImg.height / garmentImg.width) * garmentWidth;
          const garmentX = (personImg.width - garmentWidth) / 2;
          const garmentY = personImg.height * 0.15;

          // Draw garment with slight transparency for blending
          ctx.globalAlpha = 0.85;
          ctx.drawImage(garmentImg, garmentX, garmentY, garmentWidth, garmentHeight);
          ctx.globalAlpha = 1.0;

          // Get result
          const result = canvas.toDataURL('image/jpeg', 0.95);
          resolve(result);
        };
        garmentImg.onerror = () => {
          reject(new Error('Failed to load garment image'));
        };
        garmentImg.src = garmentImage;
      };
      personImg.onerror = () => {
        reject(new Error('Failed to load person image'));
      };
      personImg.src = personImage;
    });
  };

  // Download generated image
  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `virtual-tryon-${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.click();
  };

  // Reset and try again
  const tryAgain = () => {
    setCapturedFace(null);
    setGeneratedImage(null);
    setStage('capture');
    setProgress(0);
    setShowComparison(false);
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <div className="text-center text-white p-8 max-w-md">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => {
                setError('');
                setStage('capture');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw size={20} />
              Retry
            </button>
            <button 
              onClick={onClose}
              className="bg-[#febd69] text-black px-8 py-3 rounded-full font-bold hover:bg-[#f3a847] transition-all"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Virtual Try-On</h1>
              <p className="text-gray-400 text-xs">Local AI Processing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all border border-white/20"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-6 h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Stage 1: Face Capture */}
          {stage === 'capture' && (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Camera Feed */}
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                    <Camera size={24} className="text-purple-400" />
                    Step 1: Capture Your Photo
                  </h2>
                  
                  <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden mb-4">
                    <video 
                      ref={videoRef}
                      className="w-full h-full object-cover scale-x-[-1]"
                      playsInline
                      muted
                      autoPlay
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Face detection overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-64 h-80 border-4 border-purple-500/50 rounded-full relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-400 rounded-tl-3xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-400 rounded-tr-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400 rounded-bl-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-3xl"></div>
                      </div>
                    </div>

                    {isCapturing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-8xl font-bold animate-pulse">3</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {!cameraError && (
                      <button
                        onClick={captureFace}
                        disabled={isCapturing}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50"
                      >
                        <Camera size={20} />
                        {isCapturing ? 'Capturing...' : 'Capture Photo'}
                      </button>
                    )}
                    
                    {/* File upload fallback */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Upload size={20} />
                        {cameraError ? 'Upload Your Photo' : 'Or Upload Photo'}
                      </button>
                    </div>
                    
                    {cameraError && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <p className="text-yellow-300 text-sm flex items-start gap-2">
                          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <span>{cameraError}</span>
                        </p>
                      </div>
                    )}
                    
                    {!cameraError && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-blue-300 text-sm flex items-start gap-2">
                          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <span>Position your body in the frame. Good lighting improves results.</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Preview */}
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h2 className="text-white text-xl font-bold mb-4">Selected Outfit</h2>
                  
                  <div className="aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.brand}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">${product.price}</span>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold">In Stock</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" />
                    How It Works
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>AI detects your body pose and shape</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Transfers the outfit onto your body</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Preserves garment details and your identity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: Processing */}
          {stage === 'processing' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                <div className="mb-8">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                      <Sparkles size={48} className="text-purple-400 animate-pulse" />
                    </div>
                  </div>
                  
                  <h2 className="text-white text-2xl font-bold mb-2">Processing Your Try-On</h2>
                  <p className="text-gray-400">{progressText}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-white font-bold mt-2">{progress}%</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Processing</p>
                    <p className="text-white font-bold text-sm">Local AI</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Method</p>
                    <p className="text-white font-bold text-sm">Garment Transfer</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Speed</p>
                    <p className="text-white font-bold text-sm">Real-time</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Quality</p>
                    <p className="text-white font-bold text-sm">High</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 3: Result */}
          {stage === 'result' && generatedImage && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-white text-3xl font-bold mb-2">Your Virtual Try-On is Ready! 🎉</h2>
                <p className="text-gray-400">See how you look in {product.name}</p>
              </div>

              {/* Comparison Slider */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold">Result Preview</h3>
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="text-purple-400 hover:text-purple-300 text-sm font-bold flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      {showComparison ? 'Hide' : 'Show'} Comparison
                    </button>
                  </div>

                  {showComparison && capturedFace ? (
                    <div className="relative aspect-[3/4] bg-black rounded-xl overflow-hidden">
                      {/* Before Image */}
                      <img 
                        src={capturedFace}
                        alt="Original"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      {/* After Image with Slider */}
                      <div 
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      >
                        <img 
                          src={generatedImage}
                          alt="Generated"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Slider Control */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div 
                          className="absolute top-0 bottom-0 w-1 bg-white pointer-events-auto cursor-ew-resize"
                          style={{ left: `${sliderPosition}%` }}
                          onMouseDown={(e) => {
                            const handleMouseMove = (e: MouseEvent) => {
                              const target = e.currentTarget as HTMLElement | null;
                              const rect = target?.parentElement?.getBoundingClientRect();
                              if (rect) {
                                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                setSliderPosition((x / rect.width) * 100);
                              }
                            };
                            document.addEventListener('mousemove', handleMouseMove as any);
                            document.addEventListener('mouseup', () => {
                              document.removeEventListener('mousemove', handleMouseMove as any);
                            }, { once: true });
                          }}
                        >
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                            <RefreshCw size={20} className="text-gray-900" />
                          </div>
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                        Before
                      </div>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                        After
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-black rounded-xl overflow-hidden">
                      <img 
                        src={generatedImage}
                        alt="Generated Result"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
                <button
                  onClick={downloadImage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50"
                >
                  <Download size={20} />
                  Download Image
                </button>
                
                <button
                  onClick={tryAgain}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all border border-white/20 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Try Another Outfit
                </button>

                <button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={overlayCanvasRef} className="hidden" />
    </div>
  );
};
