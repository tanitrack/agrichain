import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Package,
  User,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import OrderBookAcceptDialog from '@/components/orderbook/OrderBookAcceptDialog';
import { TransactionFlowExplorerDialog } from '@/components/transaction/TransactionFlowExplorerDialog'; // Add this import

// Mock order book data
const orderBooks = [
  {
    id: 'OB-2023-001',
    buyerId: 'BUY-001',
    buyerName: 'PT Agrimax',
    buyerDetails: {
      email: 'procurement@agrimax.co.id',
      phone: '+62811234567',
      address: 'Jl. Industri No. 123, Kawasan Industri Pulogadung, Jakarta Timur',
    },
    commodityType: 'Padi',
    quantity: 1000,
    unit: 'kg',
    requestedGrade: 'A',
    requestedDeliveryDate: new Date('2023-12-15'),
    offerExpiryDate: new Date('2023-11-30'),
    status: 'open',
    termsConditions:
      'Kualitas premium, kadar air maksimal 14%, bebas hama dan penyakit. Pengiriman dilakukan sesuai jadwal yang telah disepakati. Pembayaran akan dilakukan dalam 7 hari kerja setelah barang diterima.',
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05'),
    priceOffer: 12000, // Price per unit
    totalValue: 12000000,
    requirementDetails: [
      'Kadar air maksimal 14%',
      'Bebas hama dan penyakit',
      'Kebersihan minimum 98%',
      'Butir utuh minimal 85%',
    ],
    history: [
      {
        date: '2023-11-05T09:30:00Z',
        action: 'Created',
        notes: 'Order book created by PT Agrimax',
      },
    ],
  },
  {
    id: 'OB-2023-002',
    buyerId: 'BUY-002',
    buyerName: 'Restoran Padang Jaya',
    buyerDetails: {
      email: 'order@padangjaya.com',
      phone: '+62822987654',
      address: 'Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan',
    },
    commodityType: 'Kedelai',
    quantity: 500,
    unit: 'kg',
    requestedGrade: 'Premium',
    requestedDeliveryDate: new Date('2023-12-10'),
    offerExpiryDate: new Date('2023-11-25'),
    status: 'accepted',
    termsConditions:
      'Ukuran biji seragam, bebas kotoran. Pengiriman dilakukan sekaligus. Pembayaran akan dilakukan di muka.',
    createdAt: new Date('2023-11-08'),
    updatedAt: new Date('2023-11-15'),
    priceOffer: 15000, // Price per unit
    totalValue: 7500000,
    requirementDetails: [
      'Ukuran biji seragam',
      'Bebas kotoran dan benda asing',
      'Kadar air maksimal 12%',
      'Biji rusak maksimal 2%',
    ],
    history: [
      {
        date: '2023-11-08T10:45:00Z',
        action: 'Created',
        notes: 'Order book created by Restoran Padang Jaya',
      },
      { date: '2023-11-15T14:20:00Z', action: 'Accepted', notes: 'Order accepted by seller' },
    ],
  },
  {
    id: 'OB-2023-003',
    buyerId: 'BUY-003',
    buyerName: 'Pabrik Tepung Makmur',
    buyerDetails: {
      email: 'supply@tepungmakmur.id',
      phone: '+62833456789',
      address: 'Jl. Industri Kecil No. 88, Cibitung, Bekasi',
    },
    commodityType: 'Jagung',
    quantity: 2000,
    unit: 'kg',
    requestedGrade: 'B',
    requestedDeliveryDate: new Date('2023-12-20'),
    offerExpiryDate: new Date('2023-12-05'),
    status: 'open',
    termsConditions:
      'Jagung kering, tidak berjamur. Pengiriman dapat dilakukan dalam beberapa tahap. Pembayaran sesuai jumlah yang dikirim.',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-10'),
    priceOffer: 8000, // Price per unit
    totalValue: 16000000,
    requirementDetails: [
      'Jagung kering',
      'Tidak berjamur',
      'Kadar air maksimal 15%',
      'Butir rusak maksimal 5%',
    ],
    history: [
      {
        date: '2023-11-10T16:30:00Z',
        action: 'Created',
        notes: 'Order book created by Pabrik Tepung Makmur',
      },
    ],
  },
];

const OrderBookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [orderBook, setOrderBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      const found = orderBooks.find((item) => item.id === id);
      setOrderBook(found || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleAccept = () => {
    setAcceptDialogOpen(true);
  };

  const handleAcceptOrderBook = () => {
    toast({
      title: language === 'id' ? 'Pesanan Diterima' : 'Order Accepted',
      description:
        language === 'id'
          ? `Anda telah menerima pesanan ${orderBook.id} dari ${orderBook.buyerName}`
          : `You have accepted the order ${orderBook.id} from ${orderBook.buyerName}`,
    });
    // Here you would normally update the status via API
    setOrderBook({
      ...orderBook,
      status: 'accepted',
      history: [
        ...orderBook.history,
        {
          date: new Date().toISOString(),
          action: language === 'id' ? 'Diterima' : 'Accepted',
          notes: language === 'id' ? 'Pesanan diterima oleh penjual' : 'Order accepted by seller',
        },
      ],
    });

    // In a real application, you would redirect to transactions page after buyer approves
    // For now, we'll just simulate that the status has changed
  };

  const handleReject = () => {
    toast({
      title: language === 'id' ? 'Pesanan Ditolak' : 'Order Rejected',
      description:
        language === 'id'
          ? `Anda telah menolak pesanan ${orderBook.id} dari ${orderBook.buyerName}`
          : `You have rejected the order ${orderBook.id} from ${orderBook.buyerName}`,
      variant: 'destructive',
    });
    // Here you would normally update the status via API
    setOrderBook({
      ...orderBook,
      status: 'cancelled',
      history: [
        ...orderBook.history,
        {
          date: new Date().toISOString(),
          action: language === 'id' ? 'Ditolak' : 'Rejected',
          notes: language === 'id' ? 'Pesanan ditolak oleh penjual' : 'Order rejected by seller',
        },
      ],
    });
  };

  // Render status badge with appropriate color
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      open: {
        label: t('status.open'),
        className: 'bg-blue-100 text-blue-800',
      },
      accepted: {
        label: t('status.accepted'),
        className: 'bg-green-100 text-green-800',
      },
      completed: {
        label: t('status.completed'),
        className: 'bg-teal-100 text-teal-800',
      },
      expired: {
        label: t('status.expired'),
        className: 'bg-gray-100 text-gray-800',
      },
      cancelled: {
        label: t('status.canceled'),
        className: 'bg-red-100 text-red-800',
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return <Badge className={`${statusInfo.className}`}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="bg-earth-light-green mx-auto mb-4 h-8 w-32 rounded"></div>
            <div className="bg-earth-light-green mx-auto h-4 w-64 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!orderBook) {
    return (
      <MainLayout>
        <div className="py-12 text-center">
          <h2 className="text-earth-dark-green mb-2 text-2xl font-bold">
            {t('orderbook.notfound')}
          </h2>
          <p className="text-earth-medium-green mb-6">
            {language === 'id'
              ? 'Entri order book yang diminta tidak dapat ditemukan.'
              : 'The requested order book entry could not be found.'}
          </p>
          <Button
            onClick={() => navigate('/order-book')}
            className="bg-earth-dark-green hover:bg-earth-medium-green"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('action.back')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header with action buttons */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            variant="outline"
            size="sm"
            className="border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20 mb-4"
            onClick={() => navigate('/order-book')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('action.back')}
          </Button>
          <h1 className="text-earth-dark-green text-2xl font-bold">{t('orderbook.detail')}</h1>
          <p className="text-earth-medium-green">{orderBook.id}</p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          {/* Add Transaction Guide button */}
          <TransactionFlowExplorerDialog />

          {orderBook.status === 'open' && (
            <>
              <Button
                variant="outline"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleReject}
              >
                <XCircle className="h-4 w-4" />
                {language === 'id' ? 'Tolak Pesanan' : 'Reject Order'}
              </Button>
              <Button
                className="from-earth-dark-green to-earth-medium-green hover:from-earth-medium-green hover:to-earth-dark-green gap-2 bg-gradient-to-r"
                onClick={handleAccept}
              >
                <CheckCircle className="h-4 w-4" />
                {language === 'id' ? 'Terima Pesanan' : 'Accept Order'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main content sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content - 2/3 width on desktop */}
        <div className="space-y-6 md:col-span-2">
          {/* Order Details Card */}
          <Card className="border-earth-light-green/70 overflow-hidden border-2 shadow-md">
            <CardHeader className="from-earth-dark-green to-earth-medium-green bg-gradient-to-r pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{t('orderbook.detail')}</CardTitle>
                {getStatusBadge(orderBook.status)}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-earth-medium-green mb-1 text-sm font-medium">
                    {t('orderbook.commodity')}
                  </h3>
                  <div className="bg-earth-pale-green/50 border-earth-light-green/30 hover:bg-earth-pale-green flex items-center rounded-lg border p-3 transition-colors">
                    <div className="bg-earth-light-green/30 mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                      <Package className="text-earth-dark-green h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-earth-dark-green font-medium">{orderBook.commodityType}</p>
                      <p className="text-earth-medium-green text-sm">
                        {orderBook.quantity.toLocaleString()} {orderBook.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-earth-medium-green mb-1 text-sm font-medium">
                    {language === 'id' ? 'Grade yang Diminta' : 'Requested Grade'}
                  </h3>
                  <div className="bg-earth-pale-green/50 border-earth-light-green/30 rounded-lg border p-3">
                    <Badge
                      variant="outline"
                      className={
                        orderBook.requestedGrade === 'Premium'
                          ? 'border-green-200 bg-green-100 text-green-700'
                          : orderBook.requestedGrade === 'A'
                            ? 'border-blue-200 bg-blue-100 text-blue-700'
                            : 'border-orange-200 bg-orange-100 text-orange-700'
                      }
                    >
                      {orderBook.requestedGrade}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-earth-medium-green mb-1 text-sm font-medium">
                    {language === 'id' ? 'Penawaran Harga' : 'Price Offer'}
                  </h3>
                  <div className="bg-earth-wheat/30 border-earth-wheat rounded-lg border p-4">
                    <p className="text-earth-dark-green text-xl font-bold">
                      Rp {orderBook.priceOffer.toLocaleString()}/{orderBook.unit}
                    </p>
                    <p className="text-earth-medium-green text-sm">
                      {language === 'id' ? 'Total: ' : 'Total: '}
                      Rp {orderBook.totalValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-earth-medium-green mb-1 text-sm font-medium">
                    {language === 'id' ? 'Tanggal Penting' : 'Important Dates'}
                  </h3>
                  <div className="bg-earth-pale-green/50 border-earth-light-green/30 space-y-1 rounded-lg border p-4">
                    <div className="flex items-center">
                      <Calendar className="text-earth-medium-green mr-2 h-4 w-4" />
                      <span className="text-earth-dark-green text-sm">
                        {language === 'id' ? 'Pengiriman: ' : 'Delivery: '}
                        <strong>{formatDate(orderBook.requestedDeliveryDate)}</strong>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="text-earth-medium-green mr-2 h-4 w-4" />
                      <span className="text-earth-dark-green text-sm">
                        {language === 'id' ? 'Kedaluwarsa: ' : 'Expires: '}
                        <strong>{formatDate(orderBook.offerExpiryDate)}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-earth-light-green my-6" />

              <div className="mb-6">
                <h3 className="text-earth-medium-green mb-2 text-sm font-medium">
                  {language === 'id' ? 'Informasi Pembeli' : 'Buyer Information'}
                </h3>
                <div className="flex items-start rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-earth-dark-green font-medium">{orderBook.buyerName}</p>
                    <p className="text-earth-medium-green text-sm">
                      {orderBook.buyerDetails.email}
                    </p>
                    <p className="text-earth-medium-green text-sm">
                      {orderBook.buyerDetails.phone}
                    </p>
                    <p className="text-earth-medium-green mt-1 text-sm">
                      {orderBook.buyerDetails.address}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-earth-light-green my-6" />

              <div>
                <h3 className="text-earth-medium-green mb-2 text-sm font-medium">
                  {language === 'id' ? 'Persyaratan' : 'Requirements'}
                </h3>
                <ul className="text-earth-dark-green bg-earth-pale-green/30 border-earth-light-green/20 mb-6 list-disc space-y-1 rounded-lg border p-4 pl-5">
                  {orderBook.requirementDetails.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>

                <h3 className="text-earth-medium-green mb-2 text-sm font-medium">
                  {t('orderbook.terms')}
                </h3>
                <p className="text-earth-dark-green bg-earth-pale-green/30 border-earth-light-green/20 mb-4 rounded-lg border p-4">
                  {orderBook.termsConditions}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* History Card */}
          <Card className="border-earth-clay/70 overflow-hidden border-2 shadow-md">
            <CardHeader className="from-earth-brown to-earth-light-brown bg-gradient-to-r pb-3">
              <CardTitle className="text-white">
                {language === 'id' ? 'Riwayat' : 'History'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {orderBook.history.map((event: any, index: number) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="bg-earth-dark-green h-3 w-3 rounded-full"></div>
                      {index < orderBook.history.length - 1 && (
                        <div className="bg-earth-light-green mt-1 h-full w-0.5"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex flex-col">
                        <p className="text-earth-dark-green font-medium">{event.action}</p>
                        <p className="text-earth-medium-green text-sm">
                          {formatDate(new Date(event.date))}
                        </p>
                        <p className="text-earth-dark-green mt-1">{event.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <Card className="border-earth-wheat/70 overflow-hidden border-2 shadow-md">
            <CardHeader className="bg-gradient-to-r from-[#d4b145] to-[#e6be70] pb-3">
              <CardTitle className="text-white">
                {language === 'id' ? 'Ringkasan Pesanan' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="hover:bg-earth-pale-green/20 flex items-center justify-between rounded p-2 transition-colors">
                <span className="text-earth-medium-green">
                  {language === 'id' ? 'ID Pesanan' : 'Order ID'}
                </span>
                <span className="text-earth-dark-green font-mono">{orderBook.id}</span>
              </div>
              <div className="hover:bg-earth-pale-green/20 flex items-center justify-between rounded p-2 transition-colors">
                <span className="text-earth-medium-green">
                  {language === 'id' ? 'Tanggal Dibuat' : 'Created Date'}
                </span>
                <span className="text-earth-dark-green">{formatDate(orderBook.createdAt)}</span>
              </div>
              <div className="hover:bg-earth-pale-green/20 flex items-center justify-between rounded p-2 transition-colors">
                <span className="text-earth-medium-green">
                  {language === 'id' ? 'Status' : 'Status'}
                </span>
                {getStatusBadge(orderBook.status)}
              </div>

              <Separator className="bg-earth-light-green/50" />

              <div className="hover:bg-earth-pale-green/20 flex items-center justify-between rounded p-2 transition-colors">
                <span className="text-earth-medium-green">
                  {language === 'id' ? 'Komoditas' : 'Commodity'}
                </span>
                <span className="text-earth-dark-green">{orderBook.commodityType}</span>
              </div>
              <div className="hover:bg-earth-pale-green/20 flex items-center justify-between rounded p-2 transition-colors">
                <span className="text-earth-medium-green">
                  {language === 'id' ? 'Jumlah' : 'Quantity'}
                </span>
                <span className="text-earth-dark-green">
                  {orderBook.quantity.toLocaleString()} {orderBook.unit}
                </span>
              </div>
              <div className="hover:bg-earth-pale-green/20 flex items-center justify-between rounded p-2 transition-colors">
                <span className="text-earth-medium-green">
                  {language === 'id' ? 'Grade' : 'Grade'}
                </span>
                <span className="text-earth-dark-green">{orderBook.requestedGrade}</span>
              </div>

              <Separator className="bg-earth-light-green/50" />

              <div className="hover:bg-earth-pale-green/20 flex items-center justify-between rounded p-2 transition-colors">
                <span className="text-earth-medium-green">
                  {language === 'id' ? 'Harga Satuan' : 'Unit Price'}
                </span>
                <span className="text-earth-dark-green">
                  Rp {orderBook.priceOffer.toLocaleString()}
                </span>
              </div>
              <div className="bg-earth-wheat/30 flex items-center justify-between rounded-lg p-2 font-bold">
                <span className="text-earth-dark-green">
                  {language === 'id' ? 'Total Nilai' : 'Total Value'}
                </span>
                <span className="text-earth-dark-green">
                  Rp {orderBook.totalValue.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information Card */}
          <Card className="border-earth-light-green/70 overflow-hidden border-2 shadow-md">
            <CardHeader className="from-earth-medium-green to-earth-light-green bg-gradient-to-r pb-3">
              <CardTitle className="text-white">
                {language === 'id' ? 'Informasi Pengiriman' : 'Delivery Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-earth-pale-green/40 border-earth-light-green/20 rounded-lg border p-3">
                  <h3 className="text-earth-medium-green mb-1 text-sm font-medium">
                    {language === 'id'
                      ? 'Tanggal Pengiriman yang Diminta'
                      : 'Requested Delivery Date'}
                  </h3>
                  <div className="flex items-center">
                    <Calendar className="text-earth-medium-green mr-2 h-5 w-5" />
                    <span className="text-earth-dark-green font-medium">
                      {formatDate(orderBook.requestedDeliveryDate)}
                    </span>
                  </div>
                </div>
                <div className="bg-earth-pale-green/40 border-earth-light-green/20 rounded-lg border p-3">
                  <h3 className="text-earth-medium-green mb-1 text-sm font-medium">
                    {language === 'id' ? 'Alamat Pengiriman' : 'Delivery Address'}
                  </h3>
                  <p className="text-earth-dark-green">{orderBook.buyerDetails.address}</p>
                </div>
                <div className="bg-earth-pale-green/40 border-earth-light-green/20 rounded-lg border p-3">
                  <h3 className="text-earth-medium-green mb-1 text-sm font-medium">
                    {language === 'id' ? 'Kontak Perwakilan' : 'Contact Person'}
                  </h3>
                  <div className="flex flex-col">
                    <p className="text-earth-dark-green font-medium">{orderBook.buyerName}</p>
                    <p className="text-earth-medium-green text-sm">
                      {orderBook.buyerDetails.phone}
                    </p>
                    <p className="text-earth-medium-green text-sm">
                      {orderBook.buyerDetails.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-earth-clay/70 overflow-hidden border-2 shadow-md">
            <CardHeader className="from-earth-brown to-earth-light-brown bg-gradient-to-r pb-3">
              <CardTitle className="text-white">
                {language === 'id' ? 'Aksi Cepat' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20 w-full justify-start gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {language === 'id' ? 'Lihat Syarat & Ketentuan' : 'View Terms'}
                </Button>
                {orderBook.status === 'open' && (
                  <>
                    <Button
                      className="from-earth-dark-green to-earth-medium-green hover:from-earth-medium-green hover:to-earth-dark-green w-full justify-start gap-2 bg-gradient-to-r"
                      onClick={handleAccept}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {language === 'id' ? 'Terima Pesanan' : 'Accept Order'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleReject}
                    >
                      <XCircle className="h-4 w-4" />
                      {language === 'id' ? 'Tolak Pesanan' : 'Reject Order'}
                    </Button>
                  </>
                )}
                {orderBook.status === 'accepted' && (
                  <Button
                    className="from-earth-dark-green to-earth-medium-green hover:from-earth-medium-green hover:to-earth-dark-green w-full justify-start gap-2 bg-gradient-to-r"
                    onClick={() => navigate(`/transaction/${orderBook.id}`)}
                  >
                    <ArrowRight className="h-4 w-4" />
                    {language === 'id' ? 'Lihat Detail Transaksi' : 'View Transaction Details'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order accept dialog */}
      <OrderBookAcceptDialog
        isOpen={acceptDialogOpen}
        onOpenChange={setAcceptDialogOpen}
        orderBook={orderBook}
        onAcceptOrderBook={handleAcceptOrderBook}
      />
    </MainLayout>
  );
};

export default OrderBookDetail;
