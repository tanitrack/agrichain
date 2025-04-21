// Type definitions for our application

export type CommodityUnit = 'kg' | 'ton' | 'karung' | 'kuintal' | 'gram' | 'ikat';

export type CommodityType =
  | 'Padi'
  | 'Jagung'
  | 'Kedelai'
  | 'Kopi'
  | 'Kakao'
  | 'Gula'
  | 'Sayuran'
  | 'Buah';

export type CommodityGrade = 'A' | 'B' | 'C' | 'Premium' | 'Standar' | 'Ekonomi';

export type TransactionStatus =
  | 'menunggu_konfirmasi'
  | 'dikonfirmasi'
  | 'negosiasi'
  | 'dibayar'
  | 'persiapan_pengiriman'
  | 'sedang_dikirim'
  | 'sudah_dikirim'
  | 'diterima'
  | 'selesai'
  | 'dibatalkan';

export type TransactionType = 'regular' | 'order_book';

export type ShippingStatus = 'belum_dikirim' | 'sedang_dikirim' | 'sudah_dikirim' | 'diterima';

export interface Commodity {
  id: string;
  name: string;
  unit: CommodityUnit;
  type: CommodityType;
  imageUrl: string;
  quantity: number;
  location: string;
  gradingFileUrl: string;
  grade: CommodityGrade;
  createdAt: Date;
  qrCodeHash?: string;
  farmerId: string;
}

export interface CommodityPrice {
  id: string;
  name: string;
  price: number;
  unit: CommodityUnit;
  predictedChange: number; // In percentage (e.g., 5.2 means +5.2%)
  region: string;
  grade?: CommodityGrade;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  commodityId: string;
  commodityName: string;
  quantity: number;
  unit: CommodityUnit;
  price?: number; // Price per unit
  totalPrice?: number;
  status: TransactionStatus;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  createdAt: Date;
  updatedAt: Date;
  termsDocUrl?: string;
  signatureUrl?: string;
  shippingStatus?: ShippingStatus;
  // Buyer information
  buyerLocation?: string;
  buyerPhone?: string;
  notes?: string;
  // Transaction history
  history?: Array<{ date: Date; status: TransactionStatus; description: string }>;
  // Shipping information
  deliveryStartedAt?: Date;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  courier?: string;
  trackingNumber?: string;
}

export interface OrderBook {
  id: string;
  buyerId: string;
  buyerName: string;
  commodityType: CommodityType;
  quantity: number;
  unit: CommodityUnit;
  requestedGrade: CommodityGrade;
  requestedDeliveryDate: Date;
  offerExpiryDate: Date;
  status: 'open' | 'accepted' | 'completed' | 'expired' | 'cancelled';
  termsConditions: string;
  createdAt: Date;
  qrCodeUrl?: string; // Add qrCodeUrl field for saving generated QR code
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'consumer' | 'admin';
  balance: number;
  location: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}
