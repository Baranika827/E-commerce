// Utility to load model images from /public folder

export interface ModelImage {
  id: string;
  name: string;
  path: string;
  url: string;
}

// Manually define available model images
// In production, you could use a backend API to scan the folder
export const MODEL_IMAGES: ModelImage[] = [
  {
    id: 'dress-1',
    name: 'Elegant Black Dress',
    path: '/Dress-1.png',
    url: '/Dress-1.png'
  },
  {
    id: 'dress-2',
    name: 'Classic Red Dress',
    path: '/Dress-2.png',
    url: '/Dress-2.png'
  },
  {
    id: 'dress-3',
    name: 'Designer Evening Dress',
    path: '/Dress-3.png',
    url: '/Dress-3.png'
  }
];

// Get all model images
export const getModelImages = (): ModelImage[] => {
  return MODEL_IMAGES;
};

// Get model image by ID
export const getModelImageById = (id: string): ModelImage | undefined => {
  return MODEL_IMAGES.find(img => img.id === id);
};

// Get model image URL
export const getModelImageUrl = (path: string): string => {
  // In development, Vite serves public folder at root
  return path;
};

// Preload images for better performance
export const preloadModelImages = (): Promise<void[]> => {
  const promises = MODEL_IMAGES.map(model => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = model.url;
    });
  });
  
  return Promise.all(promises);
};

// Check if image exists
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
