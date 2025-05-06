import { Commodity, CommodityPrice, Transaction, OrderBook, User } from './types';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock user data
export const currentUser: User = {
  id: 'u1',
  name: 'Pak Tani',
  email: 'paktani@example.com',
  role: 'farmer',
  balance: 5000000,
  location: 'Kabupaten Malang, Jawa Timur',
  phoneNumber: '081234567890',
  profileImageUrl: '/placeholder.svg',
};

// Mock locations
export const farmerLocations = [
  'Kabupaten Malang, Jawa Timur',
  'Kabupaten Kediri, Jawa Timur',
  'Kabupaten Banyuwangi, Jawa Timur',
  'Kabupaten Sleman, DIY',
  'Kabupaten Karanganyar, Jawa Tengah',
  'Kabupaten Tabanan, Bali',
];

// Mock commodity units
export const commodityUnits = ['kg', 'ton', 'karung', 'kuintal', 'gram', 'ikat'];

// Mock commodity types
export const commodityTypes = [
  'Padi',
  'Jagung',
  'Kedelai',
  'Kopi',
  'Kakao',
  'Gula',
  'Sayuran',
  'Buah',
];

// Mock commodity grades
export const commodityGrades = ['A', 'B', 'C', 'Premium', 'Standar', 'Ekonomi'];

// Mock commodity data
export const commodities: Commodity[] = [
  {
    id: 'c1',
    name: 'Beras Putih',
    unit: 'kg',
    type: 'Padi',
    imageUrl: '/placeholder.svg',
    quantity: 500,
    location: 'Kabupaten Malang, Jawa Timur',
    gradingFileUrl: '/placeholder.svg',
    grade: 'Premium',
    createdAt: new Date('2025-03-10'),
    qrCodeHash: 'qr-hash-c1',
    farmerId: currentUser.id,
  },
  {
    id: 'c2',
    name: 'Jagung Manis',
    unit: 'kg',
    type: 'Jagung',
    imageUrl: '/placeholder.svg',
    quantity: 300,
    location: 'Kabupaten Malang, Jawa Timur',
    gradingFileUrl: '/placeholder.svg',
    grade: 'A',
    createdAt: new Date('2025-03-15'),
    qrCodeHash: 'qr-hash-c2',
    farmerId: currentUser.id,
  },
  {
    id: 'c3',
    name: 'Kedelai Hitam',
    unit: 'kg',
    type: 'Kedelai',
    imageUrl: '/placeholder.svg',
    quantity: 200,
    location: 'Kabupaten Malang, Jawa Timur',
    gradingFileUrl: '/placeholder.svg',
    grade: 'B',
    createdAt: new Date('2025-03-20'),
    qrCodeHash: 'qr-hash-c3',
    farmerId: currentUser.id,
  },
];

// Mock commodity prices
export const commodityPrices: CommodityPrice[] = [
  {
    id: 'p1',
    name: 'Beras',
    price: 12000,
    unit: 'kg',
    predictedChange: 5.2,
    region: 'Jawa Timur',
    grade: 'Premium',
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: 'p2',
    name: 'Beras',
    price: 10500,
    unit: 'kg',
    predictedChange: 3.5,
    region: 'Jawa Barat',
    grade: 'A',
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: 'p3',
    name: 'Jagung',
    price: 8500,
    unit: 'kg',
    predictedChange: -2.1,
    region: 'Jawa Timur',
    grade: 'A',
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: 'p4',
    name: 'Kedelai',
    price: 15000,
    unit: 'kg',
    predictedChange: 1.8,
    region: 'Jawa Tengah',
    grade: 'B',
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: 'p5',
    name: 'Kopi',
    price: 75000,
    unit: 'kg',
    predictedChange: 8.3,
    region: 'Aceh',
    grade: 'Premium',
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: 'p6',
    name: 'Gula',
    price: 16000,
    unit: 'kg',
    predictedChange: 4.0,
    region: 'Jawa Timur',
    grade: 'Standar',
    updatedAt: new Date('2025-04-01'),
  },
];

// Mock transactions
export const transactions: Transaction[] = [
  {
    id: 't1',
    type: 'regular',
    commodityId: 'c1',
    commodityName: 'Beras Putih',
    quantity: 100,
    unit: 'kg',
    price: 12000,
    totalPrice: 1200000,
    status: 'selesai',
    buyerId: 'b1',
    buyerName: 'PT Agrimax',
    sellerId: currentUser.id,
    sellerName: currentUser.name,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-18'),
    termsDocUrl: '/placeholder.svg',
    signatureUrl: '/placeholder.svg',
    shippingStatus: 'sudah_dikirim',
  },
  {
    id: 't2',
    type: 'order_book',
    commodityId: 'c2',
    commodityName: 'Jagung Manis',
    quantity: 150,
    unit: 'kg',
    price: 8500,
    totalPrice: 1275000,
    // status: 'persiapan_pengiriman',
    status: 'sedang_dikirim',
    buyerId: 'b2',
    buyerName: 'PT Indofood',
    sellerId: currentUser.id,
    sellerName: currentUser.name,
    createdAt: new Date('2025-03-28'),
    updatedAt: new Date('2025-04-01'),
    termsDocUrl: '/placeholder.svg',
    signatureUrl: '/placeholder.svg',
    shippingStatus: 'belum_dikirim',
  },
  // {
  //   id: 't3',
  //   type: 'regular',
  //   commodityId: 'c3',
  //   commodityName: 'Kedelai Hitam',
  //   quantity: 50,
  //   unit: 'kg',
  //   price: 15000,
  //   totalPrice: 750000,
  //   status: 'negosiasi',
  //   buyerId: 'b3',
  //   buyerName: 'CV Hasil Tani',
  //   sellerId: currentUser.id,
  //   sellerName: currentUser.name,
  //   createdAt: new Date('2025-04-02'),
  //   updatedAt: new Date('2025-04-02'),
  //   shippingStatus: 'belum_dikirim',
  // },
  // Add TRX-2023-005 to the transactions array for completeness
  {
    id: 'TRX-2023-005',
    type: 'regular',
    commodityId: 'c1',
    commodityName: 'Padi Organik',
    quantity: 2000,
    unit: 'kg',
    price: 10000, // Not yet set
    totalPrice: 2000 * 10000, // Not yet set
    status: 'menunggu_konfirmasi',
    buyerId: 'b5',
    buyerName: 'PT Beras Sejahtera',
    sellerId: currentUser.id,
    sellerName: currentUser.name,
    createdAt: new Date('2025-04-05'),
    updatedAt: new Date('2025-04-05'),
    termsDocUrl: null,
    signatureUrl: null,
    shippingStatus: 'belum_dikirim',
    buyerLocation: 'Surabaya, Jawa Timur',
    buyerPhone: '+628123456789',
    notes: 'Membutuhkan padi organik untuk produksi beras premium.',
    history: [
      {
        date: new Date('2025-04-05'),
        status: 'menunggu_konfirmasi',
        description: 'Pesanan dibuat oleh pembeli',
      },
    ],
  },
];

// Mock order books
export const orderBooks: OrderBook[] = [
  {
    id: 'ob1',
    buyerId: 'b1',
    buyerName: 'PT Agrimax',
    commodityType: 'Padi',
    quantity: 500,
    unit: 'kg',
    requestedGrade: 'Premium',
    requestedDeliveryDate: new Date('2025-04-30'),
    offerExpiryDate: new Date('2025-04-10'),
    status: 'open',
    termsConditions:
      'Pengiriman ke gudang PT Agrimax di Surabaya. Pembayaran 50% di muka, 50% setelah barang diterima.',
    createdAt: new Date('2025-04-01'),
  },
  {
    id: 'ob2',
    buyerId: 'b2',
    buyerName: 'PT Indofood',
    commodityType: 'Jagung',
    quantity: 1000,
    unit: 'kg',
    requestedGrade: 'A',
    requestedDeliveryDate: new Date('2025-05-15'),
    offerExpiryDate: new Date('2025-04-20'),
    status: 'open',
    termsConditions:
      'Harga pasar per tanggal pengiriman. Pengiriman ke pabrik PT Indofood di Pasuruan.',
    createdAt: new Date('2025-04-02'),
  },
];

// Function to add a new commodity
export const addCommodity = (commodity: Omit<Commodity, 'id' | 'createdAt' | 'qrCodeHash'>) => {
  const newCommodity: Commodity = {
    ...commodity,
    id: generateId(),
    createdAt: new Date(),
    qrCodeHash: `qr-hash-${generateId()}`,
  };

  // In a real app, this would make an API call
  console.log('Adding new commodity:', newCommodity);
  return newCommodity;
};

// Function to update transaction shipping status
export const updateShippingStatus = (
  transactionId: string,
  newStatus: 'belum_dikirim' | 'sedang_dikirim' | 'sudah_dikirim'
) => {
  // In a real app, this would make an API call
  console.log(`Updating shipping status for transaction ${transactionId} to ${newStatus}`);
  return {
    success: true,
    transactionId,
    newStatus,
  };
};

// Function to withdraw balance
export const withdrawBalance = (amount: number) => {
  if (amount > currentUser.balance) {
    return {
      success: false,
      message: 'Saldo tidak mencukupi',
    };
  }

  // In a real app, this would make an API call
  console.log(`Withdrawing ${amount} from balance`);
  return {
    success: true,
    amount,
    newBalance: currentUser.balance - amount,
  };
};

// Function to accept order book
export const acceptOrderBook = (orderBookId: string, commodityId: string) => {
  // In a real app, this would make an API call
  console.log(`Accepting order book ${orderBookId} with commodity ${commodityId}`);
  return {
    success: true,
    orderBookId,
    commodityId,
  };
};
