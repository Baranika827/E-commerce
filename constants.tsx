import { Product, UserProfile, Order, WardrobeItem, TryOnResult, SavedLook, StyleNotification } from './types';

export const DEFAULT_PRODUCT_IMAGE = '/Dress-1.png';

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'usr_10928',
  name: 'Sophia Vance',
  email: 'sophia.vance@omnifit.ai',
  phone: '+1 (555) 382-9102',
  location: 'San Francisco, CA',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  preferredCategories: ['Dresses', 'Tailored Blazers', 'Outerwear'],
  preferredColors: ['Deep Navy', 'Classic Black', 'Cream Beige', 'Emerald Green'],
  preferredStyles: ['Minimalist Modern', 'Smart Casual', 'Elevated Formal'],
  preferredBrands: ['OmniFit Studio', 'Atelier Luxe', 'Vance & Co.'],
  usualSizes: {
    tops: 'M',
    bottoms: '28',
    dresses: 'M',
    shoes: '8 US'
  },
  heightCm: 172,
  weightKg: 62,
  measurements: {
    heightCm: 172,
    shoulderWidthCm: 41,
    chestCm: 92,
    waistCm: 70,
    hipCm: 98,
    inseamCm: 78,
    armLengthCm: 60,
    unit: 'cm',
    confidenceScore: 94,
    lastUpdated: '2026-10-02',
    source: 'AI Camera Estimation'
  },
  privacySettings: {
    storeBodyDataLocally: true,
    shareMeasurementsForSizing: true,
    allowAIRecommendations: true
  }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Classic Urban Trench Coat',
    brand: 'OmniFit Studio',
    price: 189.99,
    originalPrice: 229.99,
    discountPercent: 17,
    rating: 4.8,
    reviewCount: 342,
    image: '/Dress-1.png',
    images: [
      '/Dress-1.png',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Outerwear',
    description: 'A timeless trench coat silhouette engineered with breathable water-resistant fabric. Designed for seamless layering and precise body contour alignment in our Virtual Try-On Studio.',
    colors: [
      { name: 'Beige', hex: '#D2B48C', image: '/Dress-1.png' },
      { name: 'Obsidian Black', hex: '#1C1C1C', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80' },
      { name: 'Midnight Navy', hex: '#191970', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    hasTryOn: true,
    stock: 14,
    fitType: 'Regular',
    material: '80% Water-Resistant Cotton, 20% Technical Polyester',
    seller: 'OmniFit Direct Atelier',
    deliveryEstimate: 'Tomorrow by 2 PM',
    measurements: {
      shoulderCm: 42,
      chestCm: 96,
      waistCm: 84,
      lengthCm: 108
    },
    occasion: ['Office', 'Casual', 'Travel'],
    styleTags: ['Minimalist', 'Timeless', 'Layering'],
    reviews: [
      {
        id: 'rev_1',
        userName: 'Elena Rostova',
        rating: 5,
        date: '2026-09-28',
        comment: 'The Virtual Try-On was spot on! The coat falls exactly as it looked on my screen.',
        verified: true,
        fitFeedback: 'True to Size'
      },
      {
        id: 'rev_2',
        userName: 'Marcus Chen',
        rating: 4.5,
        date: '2026-09-15',
        comment: 'High quality material and pristine finish. AI size recommendation of size M fit perfectly.',
        verified: true,
        fitFeedback: 'True to Size'
      }
    ]
  },
  {
    id: 'prod_2',
    name: 'Silk Silhouette Evening Dress',
    brand: 'Atelier Luxe',
    price: 145.00,
    originalPrice: 195.00,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 512,
    image: '/Dress-2.png',
    images: [
      '/Dress-2.png',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Dresses',
    description: 'Sophisticated evening wear featuring fluid draping, structured neckline, and premium satin-silk finish. Ideal for formal galas, banquets, and special celebrations.',
    colors: [
      { name: 'Emerald Green', hex: '#004B23', image: '/Dress-2.png' },
      { name: 'Royal Onyx', hex: '#0B0C10', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80' },
      { name: 'Crimson Wine', hex: '#7209B7', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    hasTryOn: true,
    stock: 6,
    fitType: 'Slim',
    material: '100% Mulberry Silk Satin',
    seller: 'Atelier Luxe Official Store',
    deliveryEstimate: '2-Day Express Delivery',
    measurements: {
      shoulderCm: 38,
      chestCm: 90,
      waistCm: 68,
      hipCm: 96,
      lengthCm: 140
    },
    occasion: ['Formal', 'Party', 'Wedding'],
    styleTags: ['Glamour', 'Elegance', 'Evening'],
    reviews: [
      {
        id: 'rev_3',
        userName: 'Chloe Bennett',
        rating: 5,
        date: '2026-10-01',
        comment: 'Felt like a custom fitting dress! The draping in real life matches the Virtual Try-On 100%.',
        verified: true,
        fitFeedback: 'True to Size'
      }
    ]
  },
  {
    id: 'prod_3',
    name: 'Designer Asymmetric Cocktail Dress',
    brand: 'Vance & Co.',
    price: 134.50,
    originalPrice: 160.00,
    discountPercent: 16,
    rating: 4.7,
    reviewCount: 289,
    image: '/Dress-3.png',
    images: [
      '/Dress-3.png',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Dresses',
    description: 'Chic cocktail dress with modern asymmetric hemline and comfortable stretch crepe weave. Makes a bold statement at dinner parties and receptions.',
    colors: [
      { name: 'Ruby Crimson', hex: '#A4161A', image: '/Dress-3.png' },
      { name: 'Midnight Black', hex: '#161A1D', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    hasTryOn: true,
    stock: 9,
    fitType: 'Regular',
    material: '92% Crepe Polyester, 8% Elastane',
    seller: 'Vance & Co. Direct',
    deliveryEstimate: 'Tomorrow by 5 PM',
    measurements: {
      shoulderCm: 40,
      chestCm: 92,
      waistCm: 72,
      hipCm: 98,
      lengthCm: 110
    },
    occasion: ['Party', 'Date', 'Casual'],
    styleTags: ['Contemporary', 'Chic', 'Statement']
  },
  {
    id: 'prod_4',
    name: 'Structured Ivory Power Blazer',
    brand: 'OmniFit Studio',
    price: 159.99,
    originalPrice: 199.99,
    discountPercent: 20,
    rating: 4.85,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Tailored',
    description: 'Impeccably tailored double-breasted blazer in crisp ivory. Featuring shoulder pads and tailored waist darts designed for an authoritative silhouette.',
    colors: [
      { name: 'Crisp Ivory', hex: '#FFFDD0', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&auto=format&fit=crop&q=80' },
      { name: 'Charcoal Grey', hex: '#36454F', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&auto=format&fit=crop&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    hasTryOn: true,
    stock: 12,
    fitType: 'Slim',
    material: '70% Fine Wool Blend, 30% Silk Satin Lining',
    seller: 'OmniFit Tailored Line',
    deliveryEstimate: 'Tomorrow by 12 PM',
    measurements: {
      shoulderCm: 41,
      chestCm: 94,
      waistCm: 76,
      lengthCm: 72
    },
    occasion: ['Office', 'Formal', 'College'],
    styleTags: ['Professional', 'Power Dressing', 'Tailored']
  },
  {
    id: 'prod_5',
    name: 'Breezy Linen Summer Sundress',
    brand: 'Coastal Bloom',
    price: 68.00,
    originalPrice: 85.00,
    discountPercent: 20,
    rating: 4.6,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Casual',
    description: 'Lightweight pure organic linen dress with delicate shoulder straps and a relaxed A-line silhouette. Perfect for warm weather excursions and coastal retreats.',
    colors: [
      { name: 'Sunlit Cream', hex: '#FDFBF7', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' },
      { name: 'Sky Azure', hex: '#87CEEB', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    hasTryOn: true,
    stock: 22,
    fitType: 'Relaxed',
    material: '100% Organic Certified Linen',
    seller: 'Coastal Bloom Eco Store',
    deliveryEstimate: 'Standard Delivery (2-3 Days)',
    measurements: {
      shoulderCm: 37,
      chestCm: 88,
      waistCm: 74,
      lengthCm: 98
    },
    occasion: ['Casual', 'Travel', 'Date'],
    styleTags: ['Linen', 'Summer', 'Boho']
  },
  {
    id: 'prod_6',
    name: 'Sleek Italian Leather Moto Jacket',
    brand: 'Atelier Luxe',
    price: 279.00,
    originalPrice: 349.00,
    discountPercent: 20,
    rating: 4.95,
    reviewCount: 164,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Outerwear',
    description: 'Handcrafted full-grain nappa leather jacket with asymmetric silver hardware and custom silk interior stitching. An edgy centerpiece for modern wardrobes.',
    colors: [
      { name: 'Jet Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    hasTryOn: true,
    stock: 5,
    fitType: 'Slim',
    material: '100% Italian Nappa Lambskin Leather',
    seller: 'Atelier Luxe Official Store',
    deliveryEstimate: 'Tomorrow by 10 AM',
    measurements: {
      shoulderCm: 42,
      chestCm: 96,
      waistCm: 82,
      lengthCm: 58
    },
    occasion: ['Casual', 'Party', 'Date'],
    styleTags: ['Leather', 'Edge', 'Iconic']
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-84920',
    date: '2026-10-04',
    items: [
      {
        id: 'item_1',
        product: MOCK_PRODUCTS[0],
        quantity: 1,
        selectedSize: 'M',
        selectedColor: MOCK_PRODUCTS[0].colors[0]
      }
    ],
    totalAmount: 189.99,
    shippingAddress: '742 Evergreen Terrace, San Francisco, CA 94107',
    paymentMethod: 'Visa ending in •••• 4092',
    status: 'Shipped',
    deliveryEstimate: 'Tomorrow by 2 PM',
    trackingSteps: [
      { title: 'Order Placed', description: 'Verified and queued for processing', timestamp: 'Oct 4, 10:14 AM', completed: true, current: false },
      { title: 'Confirmed', description: 'Item reserved at SF fulfillment hub', timestamp: 'Oct 4, 11:30 AM', completed: true, current: false },
      { title: 'Packed', description: 'Inspected with AI fit precision tag', timestamp: 'Oct 5, 08:00 AM', completed: true, current: false },
      { title: 'Shipped', description: 'In transit with OmniFit Express Express', timestamp: 'Oct 5, 02:45 PM', completed: true, current: true },
      { title: 'Out for Delivery', description: 'Local courier dispatched', completed: false, current: false },
      { title: 'Delivered', description: 'Will require signature or photo verification', completed: false, current: false }
    ]
  },
  {
    id: 'ORD-72109',
    date: '2026-09-20',
    items: [
      {
        id: 'item_2',
        product: MOCK_PRODUCTS[1],
        quantity: 1,
        selectedSize: 'M',
        selectedColor: MOCK_PRODUCTS[1].colors[0]
      }
    ],
    totalAmount: 145.00,
    shippingAddress: '742 Evergreen Terrace, San Francisco, CA 94107',
    paymentMethod: 'Apple Pay',
    status: 'Delivered',
    deliveryEstimate: 'Delivered Sept 22',
    trackingSteps: [
      { title: 'Order Placed', description: 'Verified', timestamp: 'Sep 20', completed: true, current: false },
      { title: 'Confirmed', description: 'Confirmed', timestamp: 'Sep 20', completed: true, current: false },
      { title: 'Packed', description: 'Packed', timestamp: 'Sep 21', completed: true, current: false },
      { title: 'Shipped', description: 'Shipped', timestamp: 'Sep 21', completed: true, current: false },
      { title: 'Out for Delivery', description: 'Out for delivery', timestamp: 'Sep 22', completed: true, current: false },
      { title: 'Delivered', description: 'Delivered to front door', timestamp: 'Sep 22, 01:15 PM', completed: true, current: true }
    ]
  }
];

export const MOCK_TRYON_HISTORY: TryOnResult[] = [
  {
    id: 'tryon_991',
    productId: 'prod_1',
    productName: 'Classic Urban Trench Coat',
    productImage: '/Dress-1.png',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    generatedResultImage: '/Dress-1.png',
    date: '2026-10-06 14:30',
    recommendedSize: 'M',
    qualityMetrics: {
      poseCompatibility: 94,
      garmentAlignment: 92,
      imageQuality: 96,
      overallConfidence: 94
    },
    savedToWardrobe: true
  },
  {
    id: 'tryon_992',
    productId: 'prod_2',
    productName: 'Silk Silhouette Evening Dress',
    productImage: '/Dress-2.png',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    generatedResultImage: '/Dress-2.png',
    date: '2026-10-05 18:12',
    recommendedSize: 'M',
    qualityMetrics: {
      poseCompatibility: 91,
      garmentAlignment: 89,
      imageQuality: 95,
      overallConfidence: 91
    },
    savedToWardrobe: true
  }
];

export const MOCK_WARDROBE: WardrobeItem[] = [
  {
    id: 'ward_1',
    name: 'Cashmere Ribbed Knit Sweater',
    category: 'Tops',
    color: 'Cream',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    tags: ['Cozy', 'Winter', 'Neutral'],
    brand: 'Atelier Luxe',
    dateAdded: '2026-09-10'
  },
  {
    id: 'ward_2',
    name: 'High-Waisted Tailored Trousers',
    category: 'Bottoms',
    color: 'Charcoal',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
    tags: ['Workwear', 'Tailored'],
    brand: 'OmniFit Studio',
    dateAdded: '2026-09-12'
  },
  {
    id: 'ward_3',
    name: 'Classic Urban Trench Coat',
    category: 'Outerwear',
    color: 'Beige',
    image: '/Dress-1.png',
    tags: ['Layering', 'Rainproof'],
    brand: 'OmniFit Studio',
    dateAdded: '2026-10-04'
  }
];

export const MOCK_SAVED_LOOKS: SavedLook[] = [
  {
    id: 'look_101',
    title: 'Executive Presentation Outfit',
    occasion: 'Office / Formal',
    items: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[3]],
    compatibilityScore: 94,
    createdAt: '2026-10-02',
    previewImage: '/Dress-1.png'
  },
  {
    id: 'look_102',
    title: 'Gala & Evening Reception',
    occasion: 'Party / Formal',
    items: [MOCK_PRODUCTS[1]],
    compatibilityScore: 98,
    createdAt: '2026-09-28',
    previewImage: '/Dress-2.png'
  }
];

export const MOCK_NOTIFICATIONS: StyleNotification[] = [
  {
    id: 'notif_1',
    title: 'AI Fit Alert',
    message: 'Your body measurement scan confidentially recommends size M for the Structured Ivory Power Blazer.',
    timestamp: '2 hours ago',
    read: false,
    type: 'recommendation'
  },
  {
    id: 'notif_2',
    title: 'Price Drop Alert',
    message: 'Classic Urban Trench Coat dropped by 17%! Now $189.99.',
    timestamp: '1 day ago',
    read: false,
    type: 'price_drop'
  },
  {
    id: 'notif_3',
    title: 'Order Shipped',
    message: 'Order #ORD-84920 is on the way and arrives tomorrow by 2 PM.',
    timestamp: '2 days ago',
    read: true,
    type: 'order_update'
  }
];
