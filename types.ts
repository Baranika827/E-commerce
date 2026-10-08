export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  fitFeedback?: 'Runs Small' | 'True to Size' | 'Runs Large';
}

export interface ProductMeasurements {
  chestCm?: number;
  shoulderCm?: number;
  waistCm?: number;
  hipCm?: number;
  lengthCm?: number;
  sleeveCm?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: 'Dresses' | 'Outerwear' | 'Tops' | 'Bottoms' | 'Tailored' | 'Casual';
  description: string;
  colors: ColorOption[];
  sizes: string[];
  hasTryOn: boolean;
  stock: number;
  fitType: 'Slim' | 'Regular' | 'Relaxed' | 'Oversized';
  material: string;
  seller: string;
  deliveryEstimate: string;
  measurements?: ProductMeasurements;
  reviews?: Review[];
  occasion?: string[];
  styleTags?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ColorOption;
}

export interface UserMeasurements {
  heightCm: number;
  shoulderWidthCm: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
  inseamCm: number;
  armLengthCm: number;
  unit: 'cm' | 'in';
  confidenceScore: number; // 0 to 100
  lastUpdated: string;
  source: 'AI Camera Estimation' | 'Manual Input' | 'Photo Assisted';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  preferredCategories: string[];
  preferredColors: string[];
  preferredStyles: string[];
  preferredBrands: string[];
  usualSizes: {
    tops: string;
    bottoms: string;
    dresses: string;
    shoes: string;
  };
  heightCm: number;
  weightKg?: number;
  measurements: UserMeasurements;
  privacySettings: {
    storeBodyDataLocally: boolean;
    shareMeasurementsForSizing: boolean;
    allowAIRecommendations: boolean;
  };
}

export interface TryOnResult {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  userImage: string;
  generatedResultImage: string;
  date: string;
  recommendedSize: string;
  qualityMetrics: {
    poseCompatibility: number;
    garmentAlignment: number;
    imageQuality: number;
    overallConfidence: number;
  };
  savedToWardrobe?: boolean;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear' | 'Shoes' | 'Accessories';
  color: string;
  image: string;
  tags: string[];
  brand?: string;
  dateAdded: string;
}

export interface SavedLook {
  id: string;
  title: string;
  occasion: string;
  items: Product[];
  compatibilityScore: number;
  createdAt: string;
  previewImage: string;
}

export interface OrderTrackingStep {
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  status: 'Order Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  deliveryEstimate: string;
  trackingSteps: OrderTrackingStep[];
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  reason: 'Wrong Size' | 'Poor Fit' | 'Product Mismatch' | 'Damaged Product' | 'Changed Mind' | 'Other';
  tryOnAccuracyFeedback: 'Accurate' | 'Slightly Off' | 'Inaccurate' | 'Did Not Use Try-On';
  comments: string;
  status: 'Pending Review' | 'Approved' | 'Refund Processed';
  date: string;
}

export interface StyleNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'price_drop' | 'recommendation' | 'order_update' | 'tryon_ready';
}

export enum ViewMode {
  Landing = 'landing',
  Home = 'home',
  Catalog = 'catalog',
  ProductDetail = 'product_detail',
  Cart = 'cart',
  Checkout = 'checkout',
  OrderConfirmation = 'order_confirmation',
  Dashboard = 'dashboard',
  Compare = 'compare',
  Admin = 'admin'
}

export enum DashboardTab {
  Overview = 'overview',
  Profile = 'profile',
  Measurements = 'measurements',
  Wardrobe = 'wardrobe',
  TryOnStudio = 'tryon_studio',
  SavedLooks = 'saved_looks',
  AIRecommendations = 'ai_recommendations',
  Shopping = 'shopping',
  Wishlist = 'wishlist',
  Cart = 'cart',
  Orders = 'orders',
  Returns = 'returns',
  TryOnHistory = 'tryon_history',
  StylePreferences = 'style_preferences',
  Notifications = 'notifications',
  Settings = 'settings'
}
