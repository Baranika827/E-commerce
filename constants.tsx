
import { Product } from './types';

export const DEFAULT_PRODUCT_IMAGE = '/Dress-1.png';

// Model-worn clothing images from /public folder
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Urban Trench Coat',
    brand: 'OmniLux',
    price: 189.99,
    rating: 4.8,
    reviewCount: 1240,
    image: '/Dress-1.png',
    category: 'Outerwear',
    description: 'A timeless silhouette engineered for the modern professional. Water-resistant and breathable.',
    colors: ['Beige', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    hasTryOn: true
  },
  {
    id: '2',
    name: 'Elegant Evening Dress',
    brand: 'Elegance Elite',
    price: 85.00,
    rating: 4.5,
    reviewCount: 890,
    image: '/Dress-2.png',
    category: 'Dresses',
    description: 'Sophisticated evening wear with elegant draping and premium fabric.',
    colors: ['Black', 'Navy', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L'],
    hasTryOn: true
  },
  {
    id: '3',
    name: 'Designer Cocktail Dress',
    brand: 'Velocity',
    price: 134.50,
    rating: 4.9,
    reviewCount: 2300,
    image: '/Dress-3.png',
    category: 'Dresses',
    description: 'Perfect for special occasions with stunning silhouette and premium materials.',
    colors: ['Red', 'Black', 'Gold'],
    sizes: ['S', 'M', 'L', 'XL'],
    hasTryOn: true
  },
  {
    id: '4',
    name: 'Casual Summer Dress',
    brand: 'Heritage',
    price: 59.99,
    rating: 4.4,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop',
    category: 'Casual',
    description: 'Light and breezy summer dress perfect for warm weather.',
    colors: ['White', 'Blue', 'Pink'],
    sizes: ['XS', 'S', 'M', 'L'],
    hasTryOn: true
  },
  {
    id: '5',
    name: 'Professional Blazer Dress',
    brand: 'EcoFit',
    price: 120.00,
    rating: 4.7,
    reviewCount: 450,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=1200&fit=crop',
    category: 'Professional',
    description: 'Sophisticated blazer dress for the modern professional woman.',
    colors: ['Black', 'Navy', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL'],
    hasTryOn: true
  },
  {
    id: '6',
    name: 'Bohemian Maxi Dress',
    brand: 'Coastal',
    price: 75.00,
    rating: 4.2,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1200&fit=crop',
    category: 'Casual',
    description: 'Flowing maxi dress with bohemian prints and comfortable fit.',
    colors: ['Floral', 'Paisley', 'Solid'],
    sizes: ['S', 'M', 'L', 'XL'],
    hasTryOn: true
  }
];
