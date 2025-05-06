import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { TransactionInfo } from '@/components/transaction/transaction-info';
import { TransactionTimeline } from '@/components/transaction/transaction-timeline';
import { TransactionSummary } from '@/components/transaction/transaction-summary';
import { PriceInputForm } from '@/components/transaction/price-input-form';
import { transactions } from '@/lib/data/mock-data'; // Import directly from mockData
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  Truck,
  FileText,
  ClipboardCheck,
  Calendar,
  MessageCircle,
  CheckCircle2,
  Camera,
  UploadCloud,
  BookCheck,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { TransactionStatus, ShippingStatus } from '@/lib/data/types';
import TransactionHeader from '@/components/transaction/transaction-header';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingActive, setProcessingActive] = useState<string>('preparation'); // preparation, delivery, documents
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo, use setTimeout to simulate API call
        setTimeout(() => {
          console.log('Fetching transaction with ID:', id);
          // Use the imported transactions from mockData instead of the local array
          const found = transactions.find((item) => item.id === id);
          console.log('Found transaction:', found);

          if (found) {
            setTransaction(found);
          } else {
            console.error('Transaction not found with ID:', id);
            // Log all available transaction IDs for debugging
            console.log(
              'Available transaction IDs:',
              transactions.map((t) => t.id)
            );
          }

          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleConfirmTransaction = () => {
    // In a real app, this would be an API call
    setTransaction((prev) => {
      if (!prev) return null;

      const updated = {
        ...prev,
        status: 'dikonfirmasi',
        updatedAt: new Date(),
        history: [
          ...prev.history,
          {
            date: new Date(),
            status: 'dikonfirmasi',
            description:
              language === 'id'
                ? 'Transaksi dikonfirmasi oleh penjual'
                : 'Transaction confirmed by seller',
          },
        ],
      };

      console.log('Transaction updated:', updated);
      return updated;
    });

    toast({
      title: language === 'id' ? 'Transaksi dikonfirmasi' : 'Transaction confirmed',
      description:
        language === 'id' ? 'Transaksi telah dikonfirmasi' : 'The transaction has been confirmed',
    });
  };

  const handleDeclineTransaction = () => {
    // In a real app, this would be an API call
    setTransaction((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        status: 'dibatalkan',
        updatedAt: new Date(),
        history: [
          ...prev.history,
          {
            date: new Date(),
            status: 'dibatalkan',
            description:
              language === 'id'
                ? 'Transaksi ditolak oleh penjual'
                : 'Transaction declined by seller',
          },
        ],
      };
    });

    toast({
      title: language === 'id' ? 'Transaksi ditolak' : 'Transaction declined',
      description:
        language === 'id' ? 'Transaksi telah ditolak' : 'The transaction has been declined',
    });
  };

  const handleSubmitPrice = (price: number) => {
    // In a real app, this would be an API call
    setTransaction((prev) => {
      if (!prev) return null;

      const totalPrice = price * prev.antity;

      return {
        ...prev,
        status: 'negosiasi',
        price: price,
        totalPrice: totalPrice,
        updatedAt: new Date(),
        history: [
          ...prev.history,
          {
            date: new Date(),
            status: 'negosiasi',
            description:
              language === 'id'
                ? `Harga ditetapkan: Rp ${price.toLocaleString()}/${prev.unit}`
                : `Price set: Rp ${price.toLocaleString()}/${prev.unit}`,
          },
        ],
      };
    });
  };

  const handleProceedToNegotiation = () => {
    // Scroll to the price input form if on the same page
    const priceFormElement = document.getElementById('price-input-form');
    if (priceFormElement) {
      priceFormElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Redirect to the transaction management page where price can be set
      navigate(`/farmer/transaction/${id}`);
    }
  };

  const openWhatsAppChat = () => {
    if (!transaction) return;

    // Format WhatsApp message
    const message =
      language === 'id'
        ? `Halo ${transaction.buyerName}, saya dari ${transaction.sellerName}. Mari bicarakan detail lebih lanjut tentang ${transaction.commodityName} yang Anda pesan. Terima kasih.`
        : `Hello ${transaction.buyerName}, I'm from ${transaction.sellerName}. Let's discuss the details of the ${transaction.commodityName} you ordered. Thank you.`;

    // Create WhatsApp URL with phone number and message
    const whatsappUrl = `https://wa.me/${transaction.buyerPhone.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
  };

  const handleStartPreparation = () => {
    setTransaction((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        status: 'persiapan_pengiriman',
        updatedAt: new Date(),
        history: [
          ...prev.history,
          {
            date: new Date(),
            status: 'persiapan_pengiriman',
            description:
              language === 'id' ? 'Mulai persiapan pengiriman' : 'Started order preparation',
          },
        ],
      };
    });

    toast({
      title: language === 'id' ? 'Persiapan dimulai' : 'Preparation started',
      description:
        language === 'id' ? 'Persiapan pengiriman telah dimulai' : 'Order preparation has started',
    });
  };

  const handleStartDelivery = () => {
    console.log(
      'handleStartDelivery called in TransactionDetail, current transaction:',
      transaction
    );

    // Create a new transaction object with updated status
    const now = new Date();
    // Calculate estimated delivery date (2 days from now)
    const estimatedDate = new Date(now);
    estimatedDate.setDate(estimatedDate.getDate() + 2);

    const updatedTransaction = {
      ...transaction,
      status: 'sedang_dikirim' as TransactionStatus,
      shippingStatus: 'sedang_dikirim' as ShippingStatus,
      deliveryStartedAt: now,
      estimatedDeliveryDate: estimatedDate,
      updatedAt: now,
      history: [
        ...(transaction?.history || []),
        {
          date: now,
          status: 'sedang_dikirim' as TransactionStatus,
          description:
            language === 'id' ? 'Komoditas sedang dalam pengiriman' : 'Commodity is being shipped',
        },
      ],
    };

    console.log('Transaction updated to:', updatedTransaction);
    setTransaction(updatedTransaction);

    // Switch to delivery tab to show shipping interface
    setProcessingActive('delivery');

    toast({
      title: language === 'id' ? 'Pengiriman dimulai' : 'Shipping started',
      description:
        language === 'id'
          ? 'Komoditas sedang dalam pengiriman'
          : 'The commodity is now being shipped',
    });
  };

  const handleCompleteDelivery = () => {
    if (!uploadedPhoto && !trackingNumber) {
      toast({
        title: language === 'id' ? 'Informasi dibutuhkan' : 'Information needed',
        description:
          language === 'id'
            ? 'Harap unggah bukti pengiriman atau masukkan nomor pelacakan'
            : 'Please upload delivery proof or enter tracking number',
        variant: 'destructive',
      });
      return;
    }

    setTransaction((prev) => {
      if (!prev) return null;

      const now = new Date();
      return {
        ...prev,
        status: 'sudah_dikirim' as TransactionStatus,
        shippingStatus: 'sudah_dikirim' as ShippingStatus,
        actualDeliveryDate: now,
        trackingNumber: trackingNumber || prev.trackingNumber,
        updatedAt: now,
        history: [
          ...prev.history,
          {
            date: now,
            status: 'sudah_dikirim' as TransactionStatus,
            description:
              language === 'id' ? 'Komoditas telah dikirim' : 'Commodity has been delivered',
          },
        ],
      };
    });

    toast({
      title: language === 'id' ? 'Pengiriman selesai' : 'Delivery completed',
      description:
        language === 'id'
          ? 'Komoditas telah dikirim ke pembeli'
          : 'The commodity has been delivered to the buyer',
    });

    // Reset form fields
    setTrackingNumber('');
    setUploadedPhoto(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedPhoto(e.target.files[0]);
      toast({
        title: language === 'id' ? 'Foto diunggah' : 'Photo uploaded',
        description:
          language === 'id'
            ? 'Bukti pengiriman telah diunggah'
            : 'Delivery proof has been uploaded',
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="mx-auto mb-4 h-8 w-32 rounded bg-gray-200"></div>
            <div className="mx-auto h-4 w-64 rounded bg-gray-200"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!transaction) {
    return (
      <MainLayout>
        <div className="py-12 text-center">
          <h2 className="mb-2 text-2xl font-bold">{t('transactions.notfound')}</h2>
          <p className="mb-6 text-gray-600">
            {language === 'id'
              ? 'Transaksi yang diminta tidak dapat ditemukan.'
              : 'The requested transaction could not be found.'}
          </p>
          <button
            onClick={() => navigate('/transaksi')}
            className="rounded bg-earth-dark-green px-4 py-2 text-white transition-colors hover:bg-earth-medium-green"
          >
            {language === 'id' ? 'Kembali ke Transaksi' : 'Back to Transactions'}
          </button>
        </div>
      </MainLayout>
    );
  }

  // Get the status badge style based on the status
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      menunggu_konfirmasi: {
        label: t('status.pending'),
        className: 'bg-earth-wheat text-earth-brown font-medium',
      },
      dikonfirmasi: {
        label: t('status.confirmed'),
        className: 'bg-earth-light-brown text-earth-brown font-medium',
      },
      negosiasi: {
        label: t('status.negotiating'),
        className: 'bg-earth-clay text-earth-brown font-medium',
      },
      dibayar: {
        label: t('status.paid'),
        className: 'bg-earth-light-green text-earth-dark-green font-medium',
      },
      persiapan_pengiriman: {
        label: t('status.processing'),
        className: 'bg-earth-light-green/70 text-earth-dark-green font-medium',
      },
      sedang_dikirim: {
        label: t('status.shipping'),
        className: 'bg-earth-medium-green/30 text-earth-dark-green font-medium',
      },
      sudah_dikirim: {
        label: t('status.shipped'),
        className: 'bg-earth-medium-green/60 text-earth-dark-green font-medium',
      },
      diterima: {
        label: t('status.received'),
        className: 'bg-earth-medium-green/90 text-white font-medium',
      },
      selesai: {
        label: t('status.completed'),
        className: 'bg-earth-dark-green text-white font-medium',
      },
      dibatalkan: {
        label: t('status.canceled'),
        className: 'bg-red-100 text-red-800 font-medium',
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800 font-medium',
    };

    return (
      <Badge className={`${statusInfo.className} rounded-full px-3 py-1`}>{statusInfo.label}</Badge>
    );
  };

  // Calculate progress percentage based on status
  const calculateProgress = () => {
    const statusOrder = [
      'menunggu_konfirmasi',
      'dikonfirmasi',
      'negosiasi',
      'dibayar',
      'persiapan_pengiriman',
      'sedang_dikirim',
      'sudah_dikirim',
      'diterima',
      'selesai',
    ];

    const currentIndex = statusOrder.findIndex((status) => status === transaction.status);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  // Determine whether to show the price input form
  const shouldShowPriceInput =
    transaction?.status === 'dikonfirmasi' || transaction?.status === 'negosiasi';

  // Check if status is in processing stage
  const isProcessingStage = [
    'dibayar',
    'persiapan_pengiriman',
    'sedang_dikirim',
    'sudah_dikirim',
  ].includes(transaction?.status);

  return (
    <MainLayout>
      <TransactionHeader
        id={transaction.id}
        status={transaction.status}
        onProceedToNegotiation={handleProceedToNegotiation}
        onConfirmTransaction={handleConfirmTransaction}
        onDeclineTransaction={handleDeclineTransaction}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <TransactionInfo
            transaction={transaction}
            handleProceedToNegotiation={handleProceedToNegotiation}
            getStatusBadge={getStatusBadge}
            calculateProgress={calculateProgress}
          />

          {/* {(transaction.status === 'menunggu_konfirmasi' ||
            transaction.status === 'dikonfirmasi') && (
            <StatusCard
              status={transaction.status}
              onConfirmTransaction={handleConfirmTransaction}
              onDeclineTransaction={handleDeclineTransaction}
              onProceedToNegotiation={handleProceedToNegotiation}
            />
          )} */}

          {shouldShowPriceInput && (
            <div id="price-input-form">
              <PriceInputForm
                transaction={transaction}
                onPriceSubmit={handleSubmitPrice}
                openWhatsAppChat={openWhatsAppChat}
              />
            </div>
          )}

          {/* Processing Stage Cards */}
          {isProcessingStage && (
            <div className="space-y-6">
              <div className="flex space-x-2 border-b pb-4">
                <Button
                  variant={processingActive === 'preparation' ? 'farmer' : 'outline'}
                  onClick={() => setProcessingActive('preparation')}
                  className="flex-1"
                >
                  <Package className="mr-2 h-4 w-4" />
                  {language === 'id' ? 'Persiapan' : 'Preparation'}
                </Button>
                <Button
                  variant={processingActive === 'delivery' ? 'farmer' : 'outline'}
                  onClick={() => setProcessingActive('delivery')}
                  className="flex-1"
                >
                  <Truck className="mr-2 h-4 w-4" />
                  {language === 'id' ? 'Pengiriman' : 'Delivery'}
                </Button>
                <Button
                  variant={processingActive === 'documents' ? 'farmer' : 'outline'}
                  onClick={() => setProcessingActive('documents')}
                  className="flex-1"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {language === 'id' ? 'Dokumen' : 'Documents'}
                </Button>
              </div>

              {/* Preparation Card */}
              {processingActive === 'preparation' && (
                <Card className="earth-card-wheat overflow-hidden">
                  <CardHeader className="earth-header-wheat pb-3">
                    <CardTitle className="text-white">
                      {language === 'id' ? 'Persiapan Pengiriman' : 'Order Preparation'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-2 space-y-4">
                    <div className="rounded-lg bg-earth-wheat/30 p-4">
                      <div className="mb-3 flex items-center space-x-2">
                        <Package className="h-5 w-5 text-earth-brown" />
                        <h3 className="font-medium text-earth-dark-green">
                          {language === 'id' ? 'Persiapan Komoditas' : 'Commodity Preparation'}
                        </h3>
                      </div>

                      <p className="mb-4 text-earth-medium-green">
                        {language === 'id'
                          ? `Siapkan ${transaction.quantity} ${transaction.unit} ${transaction.commodityName} sesuai dengan pesanan.`
                          : `Prepare ${transaction.quantity} ${transaction.unit} of ${transaction.commodityName} as per order.`}
                      </p>

                      <div className="mb-4 rounded-lg bg-earth-pale-green/40 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-earth-brown">
                            {language === 'id' ? 'Jumlah' : 'Quantity'}:
                          </span>
                          <span className="font-medium text-earth-dark-green">
                            {transaction.quantity.toLocaleString()} {transaction.unit}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-earth-brown">
                            {language === 'id' ? 'Harga' : 'Price'}:
                          </span>
                          <span className="font-medium text-earth-dark-green">
                            {formatCurrency(transaction.price)} / {transaction.unit}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-earth-brown">
                            {language === 'id' ? 'Total' : 'Total'}:
                          </span>
                          <span className="font-medium text-earth-dark-green">
                            {formatCurrency(transaction.totalPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-lg bg-earth-light-green/20 p-3">
                          <h4 className="mb-1 font-medium text-earth-dark-green">
                            {language === 'id' ? 'Checklist Persiapan' : 'Preparation Checklist'}
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center text-earth-medium-green">
                              <ClipboardCheck className="mr-2 h-4 w-4" />
                              {language === 'id'
                                ? 'Periksa kualitas komoditas'
                                : 'Check commodity quality'}
                            </li>
                            <li className="flex items-center text-earth-medium-green">
                              <ClipboardCheck className="mr-2 h-4 w-4" />
                              {language === 'id'
                                ? 'Siapkan kemasan yang sesuai'
                                : 'Prepare appropriate packaging'}
                            </li>
                            <li className="flex items-center text-earth-medium-green">
                              <ClipboardCheck className="mr-2 h-4 w-4" />
                              {language === 'id'
                                ? 'Pastikan jumlah sesuai pesanan'
                                : 'Ensure quantity matches order'}
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-earth-light-green/10 p-3">
                          <h4 className="mb-1 font-medium text-earth-dark-green">
                            {language === 'id' ? 'Tenggat Waktu' : 'Timeline'}
                          </h4>
                          <div className="mb-2 flex items-center text-sm text-earth-medium-green">
                            <Calendar className="mr-2 h-4 w-4" />
                            {language === 'id' ? 'Siapkan dalam 3 hari' : 'Prepare within 3 days'}
                          </div>
                          <div className="flex items-center text-sm text-earth-medium-green">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {language === 'id'
                              ? 'Hubungi pembeli untuk konfirmasi'
                              : 'Contact buyer for confirmation'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        {transaction.status === 'dibayar' && (
                          <Button
                            variant="farmer"
                            className="w-full"
                            onClick={handleStartPreparation}
                          >
                            {language === 'id' ? 'Mulai Persiapan' : 'Start Preparation'}
                          </Button>
                        )}

                        {transaction.status === 'persiapan_pengiriman' && (
                          <Button variant="farmer" className="w-full" onClick={handleStartDelivery}>
                            {language === 'id' ? 'Mulai Pengiriman' : 'Start Delivery'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Card */}
              {processingActive === 'delivery' && (
                <Card className="earth-card-clay overflow-hidden">
                  <CardHeader className="earth-header-clay pb-3">
                    <CardTitle className="text-white">
                      {language === 'id' ? 'Informasi Pengiriman' : 'Delivery Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-2 space-y-4">
                    <div className="rounded-lg bg-earth-clay/20 p-4">
                      <div className="mb-3 flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-earth-brown" />
                        <h3 className="font-medium text-earth-dark-green">
                          {language === 'id' ? 'Status Pengiriman' : 'Delivery Status'}
                        </h3>
                      </div>

                      <div className="mb-4 rounded-lg bg-earth-wheat/30 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-earth-brown">
                            {language === 'id' ? 'Alamat' : 'Address'}:
                          </span>
                          <span className="font-medium text-earth-dark-green">
                            {transaction.buyerLocation || 'Jakarta Utara, DKI Jakarta'}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-earth-brown">
                            {language === 'id' ? 'Kurir' : 'Courier'}:
                          </span>
                          <span className="font-medium text-earth-dark-green">
                            {transaction.courier || 'Pengiriman Sendiri'}
                          </span>
                        </div>

                        {transaction.status === 'sedang_dikirim' && (
                          <>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-earth-brown">
                                {language === 'id' ? 'Tanggal Mulai' : 'Start Date'}:
                              </span>
                              <span className="font-medium text-earth-dark-green">
                                {transaction.deliveryStartedAt
                                  ? formatDate(transaction.deliveryStartedAt)
                                  : formatDate(new Date())}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-earth-brown">
                                {language === 'id' ? 'Estimasi Tiba' : 'Est. Arrival'}:
                              </span>
                              <span className="font-medium text-earth-dark-green">
                                {transaction.estimatedDeliveryDate
                                  ? formatDate(transaction.estimatedDeliveryDate)
                                  : language === 'id'
                                    ? '1-2 hari'
                                    : '1-2 days'}
                              </span>
                            </div>
                          </>
                        )}

                        {transaction.status === 'sudah_dikirim' && (
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-earth-brown">
                              {language === 'id' ? 'Tanggal Kirim' : 'Delivery Date'}:
                            </span>
                            <span className="font-medium text-earth-dark-green">
                              {transaction.actualDeliveryDate
                                ? formatDate(transaction.actualDeliveryDate)
                                : formatDate(new Date())}
                            </span>
                          </div>
                        )}

                        {transaction.trackingNumber && (
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-earth-brown">
                              {language === 'id' ? 'No. Pelacakan' : 'Tracking No.'}:
                            </span>
                            <span className="font-medium text-earth-dark-green">
                              {transaction.trackingNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      {transaction.status === 'sedang_dikirim' && (
                        <div className="space-y-4">
                          <p className="mb-2 text-earth-medium-green">
                            {language === 'id'
                              ? 'Pastikan komoditas dikemas dengan baik dan aman selama pengiriman. Hubungi pembeli untuk koordinasi waktu pengiriman.'
                              : 'Ensure commodities are well-packaged and safe during delivery. Contact the buyer to coordinate delivery time.'}
                          </p>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Delivery Proof Upload */}
                            <div className="rounded-lg border border-dashed border-earth-light-brown p-4">
                              <div className="mb-2 flex items-center">
                                <Camera className="mr-2 h-4 w-4 text-earth-brown" />
                                <h4 className="font-medium text-earth-dark-green">
                                  {language === 'id' ? 'Bukti Pengiriman' : 'Delivery Proof'}
                                </h4>
                              </div>

                              <div className="py-6 text-center">
                                <input
                                  type="file"
                                  id="delivery-proof"
                                  className="hidden"
                                  onChange={handlePhotoUpload}
                                  accept="image/*"
                                />
                                <label htmlFor="delivery-proof" className="cursor-pointer">
                                  <UploadCloud className="mx-auto mb-2 h-10 w-10 text-earth-medium-green" />
                                  <p className="text-earth-medium-green">
                                    {language === 'id'
                                      ? 'Unggah foto bukti pengiriman'
                                      : 'Upload delivery proof photo'}
                                  </p>
                                </label>

                                {uploadedPhoto && (
                                  <div className="mt-2 rounded-lg bg-earth-light-green/20 p-2 text-earth-dark-green">
                                    <CheckCircle2 className="mr-1 inline-block h-4 w-4" />
                                    {uploadedPhoto.name}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Tracking Number */}
                            <div className="rounded-lg border border-earth-light-brown p-4">
                              <div className="mb-2 flex items-center">
                                <BookCheck className="mr-2 h-4 w-4 text-earth-brown" />
                                <h4 className="font-medium text-earth-dark-green">
                                  {language === 'id' ? 'Nomor Pelacakan' : 'Tracking Number'}
                                </h4>
                              </div>

                              <input
                                type="text"
                                className="mb-2 w-full rounded-lg border border-earth-light-brown/70 p-2"
                                placeholder={
                                  language === 'id'
                                    ? 'Masukkan nomor resi/pelacakan'
                                    : 'Enter receipt/tracking number'
                                }
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                              />

                              <p className="text-xs text-earth-medium-green">
                                {language === 'id'
                                  ? 'Opsional: Isi jika menggunakan jasa kurir'
                                  : 'Optional: Fill if using courier service'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6">
                            <Button
                              variant="farmer"
                              className="w-full"
                              onClick={handleCompleteDelivery}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              {language === 'id' ? 'Selesaikan Pengiriman' : 'Complete Delivery'}
                            </Button>
                          </div>
                        </div>
                      )}

                      {transaction.status === 'persiapan_pengiriman' && (
                        <div className="mt-6">
                          <p className="mb-4 text-earth-medium-green">
                            {language === 'id'
                              ? 'Pastikan komoditas sudah disiapkan dengan baik dan siap untuk dikirim ke pembeli.'
                              : 'Make sure the commodity is well prepared and ready to be shipped to the buyer.'}
                          </p>
                          <Button variant="farmer" className="w-full" onClick={handleStartDelivery}>
                            <Truck className="mr-2 h-4 w-4" />
                            {language === 'id' ? 'Mulai Pengiriman' : 'Start Delivery'}
                          </Button>
                        </div>
                      )}

                      {transaction.status === 'sudah_dikirim' && (
                        <div className="rounded-lg bg-earth-light-green/20 p-3 text-center">
                          <p className="font-medium text-earth-dark-green">
                            {language === 'id'
                              ? 'Pengiriman telah selesai. Menunggu konfirmasi penerimaan dari pembeli.'
                              : 'Delivery completed. Waiting for receipt confirmation from buyer.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Documents Card */}
              {processingActive === 'documents' && (
                <Card className="earth-card-forest overflow-hidden">
                  <CardHeader className="earth-header-forest pb-3">
                    <CardTitle className="text-white">
                      {language === 'id' ? 'Dokumen Transaksi' : 'Transaction Documents'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-2 space-y-4">
                    <div className="rounded-lg bg-earth-pale-green/30 p-4">
                      <div className="mb-3 flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-earth-dark-green" />
                        <h3 className="font-medium text-earth-dark-green">
                          {language === 'id' ? 'Dokumen Penting' : 'Important Documents'}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-lg border border-earth-light-green bg-white p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-5 w-5 text-earth-dark-green" />
                              <span className="font-medium text-earth-dark-green">
                                {language === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions'}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-earth-light-green text-earth-dark-green"
                            >
                              {language === 'id' ? 'Lihat' : 'View'}
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-lg border border-earth-light-green bg-white p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-5 w-5 text-earth-dark-green" />
                              <span className="font-medium text-earth-dark-green">
                                {language === 'id' ? 'Invoice Transaksi' : 'Transaction Invoice'}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-earth-light-green text-earth-dark-green"
                            >
                              {language === 'id' ? 'Unduh' : 'Download'}
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-lg border border-earth-light-green bg-white p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-5 w-5 text-earth-dark-green" />
                              <span className="font-medium text-earth-dark-green">
                                {language === 'id' ? 'Tanda Terima' : 'Receipt'}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-earth-light-green text-earth-dark-green"
                            >
                              {language === 'id' ? 'Cetak' : 'Print'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-earth-medium-green">
                        {language === 'id'
                          ? 'Semua dokumen transaksi dapat diakses dan diunduh dari halaman ini untuk referensi Anda.'
                          : 'All transaction documents can be accessed and downloaded from this page for your reference.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <TransactionSummary transaction={transaction} openWhatsAppChat={openWhatsAppChat} />

          <div className="mt-6">
            <TransactionTimeline history={transaction.history} currentStatus={transaction.status} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TransactionDetail;
