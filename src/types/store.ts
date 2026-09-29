export type ProductCategory = 
  | 'phones' 
  | 'audio' 
  | 'chargers' 
  | 'powerbanks' 
  | 'cables' 
  | 'cases' 
  | 'watches' 
  | 'accessories';

export type ProductStatus = 'in_stock' | 'out_of_stock' | 'coming_soon';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  brand: string;
  category: ProductCategory;
  price: number; // in Iraqi Dinars (IQD)
  oldPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  status: ProductStatus;
  image: string;
  description: string;
  specs: string[];
  warranty: string;
  badge?: string;
  featured?: boolean;
}

export type OrderStatus = 
  | 'new' 
  | 'reviewing' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. MNR-20260929-001
  customerName: string;
  phone: string;
  governorate: string;
  city: string;
  district: string;
  address: string;
  nearestLandmark: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number; // Fixed at 5,000 IQD
  total: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'zaincash' | 'card';
  createdAt: string;
  updatedAt: string;
  timelineNotes?: { status: OrderStatus; timestamp: string; note: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  targetCategory?: ProductCategory | 'all';
  targetProductId?: string;
  code?: string;
  active: boolean;
  expiresAt?: string;
}

export interface StoreSettings {
  storeName: string;
  subtitle: string;
  phone: string;
  whatsapp: string;
  address: string;
  fixedDeliveryFee: number; // 5,000 IQD
  adminPin: string; // default "1234"
  audioNotifications: boolean;
}
