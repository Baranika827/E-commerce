import React, { useRef, useEffect, useState } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';
import { Product } from '../types';
import { Camera } from '@mediapipe/camera_utils';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

interface VirtualTryOnProps {
  product: Product;
  onClose: () => void;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [productImage, setProductImage] = useState<HTMLImageElement | null>(null);
  const [poseActive, setPoseActive] = useState(false);
  const [fps, setFps] = useState(0);
  
  const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() });

  // Load product image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ Product image loaded');
      setProductImage(img);
    };
    
    img.onerror = () => {
      console.warn('⚠️ CORS issue, trying without crossOrigin');
      const img2 = new Image();
      img2.onload = () => setProductImage(img2);
      img2.onerror = () => setError('Failed to load product image');
      img2.src = product.image;
    };
    
    img.src = product.image;
  }, [product.image]);

  // Initialize MediaPipe Pose
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    console.log('🚀 Initializing MediaPipe Pose...');

    // Initialize Pose
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onPoseResults);
    poseRef.current = pose;

    // Initialize Camera
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (poseRef.current && videoRef.current) {
          await poseRef.current.send({ image: videoRef.current });
        }
      },
      width: 1280,
      height: 720,
    });

    camera.start()
      .then(() => {
        console.log('✅ Camera started');
        setIsLoading(false);
        setPoseActive(true);
      })
      .catch((err) => {
        console.error('❌ Camera error:', err);
        setError('Camera access denied. Please allow camera access.');
        setIsLoading(false);
      });

    cameraRef.current = camera;

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, []);

  // Pose results handler with garment overlay
  const onPoseResults = (results: Results) => {
    if (!canvasRef.current || !productImage) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    const canvas = canvasRef.current;

    // Update canvas size to match video
    if (canvas.width !== results.image.width || canvas.height !== results.image.height) {
      canvas.width = results.image.width;
      canvas.height = results.image.height;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mirrored video feed
    canvasCtx.scale(-1, 1);
    canvasCtx.translate(-canvas.width, 0);
    canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    canvasCtx.restore();

    // Draw pose landmarks and garment overlay
    if (results.poseLandmarks) {
      canvasCtx.save();
      canvasCtx.scale(-1, 1);
      canvasCtx.translate(-canvas.width, 0);

      // Optional: Draw skeleton for debugging (comment out for production)
      // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      //   color: 'rgba(0, 255, 0, 0.3)',
      //   lineWidth: 2,
      // });
      // drawLandmarks(canvasCtx, results.poseLandmarks, {
      //   color: 'rgba(255, 0, 0, 0.5)',
      //   lineWidth: 1,
      //   radius: 2,
      // });

      canvasCtx.restore();

      // Overlay garment
      overlayGarment(canvasCtx, results.poseLandmarks, canvas);
    }

    // Calculate FPS
    const counter = fpsCounterRef.current;
    counter.frames++;
    const now = performance.now();
    if (now - counter.lastTime >= 1000) {
      setFps(counter.frames);
      counter.frames = 0;
      counter.lastTime = now;
    }
  };

  // Smart garment overlay with body tracking
  const overlayGarment = (ctx: CanvasRenderingContext2D, landmarks: any[], canvas: HTMLCanvasElement) => {
    if (!productImage) return;

    // Key landmarks (MediaPipe Pose indices)
    const leftShoulder = landmarks[11];   // Left shoulder
    const rightShoulder = landmarks[12];  // Right shoulder
    const leftHip = landmarks[23];        // Left hip
    const rightHip = landmarks[24];       // Right hip
    const nose = landmarks[0];            // Nose

    // Check if key landmarks are visible
    if (!leftShoulder || !rightShoulder || 
        leftShoulder.visibility < 0.5 || rightShoulder.visibility < 0.5) {
      return;
    }

    // Convert normalized coordinates to pixel coordinates (mirrored)
    const lsx = (1 - leftShoulder.x) * canvas.width;
    const rsx = (1 - rightShoulder.x) * canvas.width;
    const lsy = leftShoulder.y * canvas.height;
    const rsy = rightShoulder.y * canvas.height;

    // Calculate shoulder width and center
    const shoulderWidth = Math.abs(lsx - rsx);
    const shoulderCenterX = (lsx + rsx) / 2;
    const shoulderCenterY = (lsy + rsy) / 2;

    // Calculate torso height using hips
    let torsoHeight = shoulderWidth * 2.5;
    if (leftHip?.visibility > 0.5 && rightHip?.visibility > 0.5) {
      const hipY = ((leftHip.y + rightHip.y) / 2) * canvas.height;
      torsoHeight = Math.abs(hipY - shoulderCenterY) * 1.4;
    }

    // Smart garment sizing with drape factor
    const drapeFactor = 1.5; // Adjust for looser/tighter fit
    const garmentWidth = shoulderWidth * drapeFactor;
    const garmentHeight = (garmentWidth / productImage.width) * productImage.height;

    // Position garment - align with upper chest/neck area
    let topY = shoulderCenterY - 50;
    if (nose?.visibility > 0.5) {
      const noseY = nose.y * canvas.height;
      topY = noseY + (shoulderCenterY - noseY) * 0.75;
    }

    const garmentX = shoulderCenterX - garmentWidth / 2;
    const garmentY = topY;

    // Calculate body tilt angle for natural rotation
    const angle = Math.atan2(rsy - lsy, rsx - lsx);

    // Apply transformation and draw garment
    ctx.save();
    
    // Rotate around shoulder center
    ctx.translate(shoulderCenterX, shoulderCenterY);
    ctx.rotate(angle);
    ctx.translate(-shoulderCenterX, -shoulderCenterY);

    // Enhanced rendering with shadows and blending
    ctx.globalAlpha = 0.93;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;
    ctx.shadowOffsetX = 0;

    // Draw the garment
    ctx.drawImage(productImage, garmentX, garmentY, garmentWidth, garmentHeight);

    ctx.restore();
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <div className="text-center text-white p-8 max-w-md">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-4">Setup Required</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button 
            onClick={onClose}
            className="bg-[#febd69] text-black px-8 py-3 rounded-full font-bold hover:bg-[#f3a847] transition-all"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <video 
        ref={videoRef} 
        className="hidden" 
        playsInline 
        muted 
        autoPlay
      />
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <Loader className="animate-spin mx-auto mb-4 text-[#febd69]" size={64} />
            <p className="text-xl font-bold mb-2">Initializing MediaPipe Pose...</p>
            <p className="text-sm text-gray-400">Loading AI body tracking model</p>
          </div>
        </div>
      )}

      <button 
        onClick={onClose}
        className="absolute top-8 right-8 bg-black/60 hover:bg-black p-4 rounded-full text-white backdrop-blur-xl border border-white/30 z-50 transition-all"
      >
        <X size={24} />
      </button>

      {!isLoading && (
        <>
          <div className="absolute top-8 left-8 flex flex-col gap-3">
            <div className="bg-green-600 px-4 py-2 rounded text-white text-xs font-bold flex items-center gap-2 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              MEDIAPIPE POSE TRACKING
            </div>
            
            <div className="bg-blue-600/90 px-4 py-2 rounded text-white text-xs font-bold flex items-center gap-2 shadow-lg">
              📊 {fps} FPS
            </div>

            <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded text-white text-xs border border-white/20">
              <div className="font-bold mb-1">{product.name}</div>
              <div className="text-gray-400">{product.brand}</div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full text-white text-sm border border-white/20">
            💡 Move around - clothing tracks your shoulders in real-time
          </div>
        </>
      )}
    </div>
  );
};
