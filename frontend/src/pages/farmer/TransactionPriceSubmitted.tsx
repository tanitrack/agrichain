import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  FileText,
  MessageCircle,
  CheckCircle,
  FileCheck,
  Timer,
  Upload,
  Truck,
  Camera,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { transactions } from '@/lib/data/mockData';
import { TransactionSummary } from '@/components/transaction/TransactionSummary';
import { TransactionTimeline } from '@/components/transaction/TransactionTimeline';
import { TransactionInfo } from '@/components/transaction/TransactionInfo';
import { TransactionStatus, ShippingStatus } from '@/lib/data/types';

const TransactionPriceSubmitted = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState<File | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [shippingStarted, setShippingStarted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call with timeout
        setTimeout(() => {
          console.log('Fetching transaction with ID:', id);
          const found = transactions.find((item) => item.id === id);
          console.log('Found transaction:', found);

          if (found) {
            setTransaction(found);
          } else {
            console.error('Transaction not found with ID:', id);
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

  const handleStartWhatsAppChat = () => {
    if (!transaction) return;

    // Format WhatsApp message
    const message =
      language === 'id'
        ? `Halo ${transaction.buyerName}, saya dari ${transaction.sellerName}. Saya telah menetapkan harga ${transaction.commodityName} sebesar ${formatCurrency(transaction.price)} per ${transaction.unit}. Total harga: ${formatCurrency(transaction.totalPrice)}. Silakan konfirmasi jika setuju. Terima kasih.`
        : `Hello ${transaction.buyerName}, I'm from ${transaction.sellerName}. I have set the price for ${transaction.commodityName} at ${formatCurrency(transaction.price)} per ${transaction.unit}. Total price: ${formatCurrency(transaction.totalPrice)}. Please confirm if you agree. Thank you.`;

    // Create WhatsApp URL with phone number and message
    const whatsappUrl = `https://wa.me/${transaction.buyerPhone?.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
  };

  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignature(e.target.files[0]);
      toast({
        title: language === 'id' ? 'Tanda tangan diunggah' : 'Signature uploaded',
        description:
          language === 'id'
            ? 'Tanda tangan Anda telah berhasil diunggah'
            : 'Your signature has been successfully uploaded',
      });
    }
  };

  const handleConfirmTerms = () => {
    if (!signature) {
      toast({
        title: language === 'id' ? 'Tanda tangan diperlukan' : 'Signature required',
        description:
          language === 'id'
            ? 'Silakan unggah tanda tangan Anda terlebih dahulu'
            : 'Please upload your signature first',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: language === 'id' ? 'Syarat & Ketentuan disetujui' : 'Terms & Conditions approved',
      description:
        language === 'id'
          ? 'Anda telah menyetujui Syarat & Ketentuan. Transaksi akan dilanjutkan'
          : 'You have approved the Terms & Conditions. Transaction will proceed',
    });

    // Update transaction with dibayar status
    setTransaction((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        status: 'dibayar' as TransactionStatus,
        updatedAt: new Date(),
        history: [
          ...(prev.history || []),
          {
            date: new Date(),
            status: 'dibayar' as TransactionStatus,
            description:
              language === 'id' ? 'Syarat & Ketentuan disetujui' : 'Terms & Conditions approved',
          },
        ],
      };
    });
  };

  const handleStartDelivery = () => {
    // Important: Show a debug message to verify this function is being called
    console.log('handleStartDelivery called, current transaction:', transaction);

    setTransaction((prev) => {
      if (!prev) return null;

      const now = new Date();
      // Calculate estimated delivery date (2 days from now)
      const estimatedDate = new Date(now);
      estimatedDate.setDate(estimatedDate.getDate() + 2);

      const updatedTransaction = {
        ...prev,
        status: 'sedang_dikirim' as TransactionStatus,
        shippingStatus: 'sedang_dikirim' as ShippingStatus,
        deliveryStartedAt: now,
        estimatedDeliveryDate: estimatedDate,
        updatedAt: now,
        history: [
          ...(prev.history || []),
          {
            date: now,
            status: 'sedang_dikirim' as TransactionStatus,
            description:
              language === 'id'
                ? 'Komoditas sedang dalam pengiriman'
                : 'Commodity is being shipped',
          },
        ],
      };

      console.log('Transaction updated to:', updatedTransaction);
      return updatedTransaction;
    });

    setShippingStarted(true);

    toast({
      title: language === 'id' ? 'Pengiriman dimulai' : 'Shipping started',
      description:
        language === 'id'
          ? 'Komoditas sedang dalam pengiriman'
          : 'The commodity is now being shipped',
    });
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
          ...(prev.history || []),
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
            className="bg-earth-dark-green hover:bg-earth-medium-green rounded px-4 py-2 text-white transition-colors"
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

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => navigate('/transaksi')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'id' ? 'Kembali' : 'Back'}
          </Button>
          <h1 className="text-earth-dark-green text-2xl font-bold">
            {language === 'id' ? 'Harga Disubmit' : 'Price Submitted'}
          </h1>
          <p className="text-earth-medium-green font-medium">{transaction?.id}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
          <Button
            variant="outline"
            onClick={handleStartWhatsAppChat}
            className="border-earth-medium-green text-earth-dark-green hover:bg-earth-pale-green gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {language === 'id' ? 'Chat via WhatsApp' : 'Chat via WhatsApp'}
          </Button>
          <Button
            variant="outline"
            className="border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green gap-2"
          >
            <FileText className="h-4 w-4" />
            {language === 'id' ? 'Cetak Detail' : 'Print Details'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <TransactionInfo
            transaction={transaction}
            handleProceedToNegotiation={() => {}}
            getStatusBadge={getStatusBadge}
            calculateProgress={calculateProgress}
          />

          {/* Show different content based on transaction status */}
          {transaction?.status === 'negosiasi' && (
            <Card className="earth-card-wheat overflow-hidden">
              <CardHeader className="earth-header-wheat pb-3">
                <CardTitle className="text-white">
                  {language === 'id' ? 'Status Negosiasi' : 'Negotiation Status'}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-4">
                <div className="bg-earth-wheat/30 rounded-lg p-4">
                  <div className="mb-3 flex items-center space-x-2">
                    <CheckCircle className="text-earth-dark-green h-5 w-5" />
                    <h3 className="text-earth-dark-green font-medium">
                      {language === 'id' ? 'Harga telah disubmit' : 'Price has been submitted'}
                    </h3>
                  </div>

                  <div className="bg-earth-pale-green/40 mb-4 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-earth-brown">
                        {language === 'id' ? 'Harga per' : 'Price per'} {transaction.unit}:
                      </span>
                      <span className="text-earth-dark-green font-medium">
                        {formatCurrency(transaction.price)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-earth-brown">
                        {language === 'id' ? 'Jumlah' : 'Quantity'}:
                      </span>
                      <span className="text-earth-dark-green font-medium">
                        {transaction.quantity.toLocaleString()} {transaction.unit}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-earth-brown">
                        {language === 'id' ? 'Total' : 'Total'}:
                      </span>
                      <span className="text-earth-dark-green font-medium">
                        {formatCurrency(transaction.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <p className="text-earth-medium-green mb-4">
                    {language === 'id'
                      ? 'Harga telah dikirim ke pembeli. Silakan diskusikan harga melalui WhatsApp dan tunggu pembeli menyetujui harga tersebut.'
                      : 'Price has been sent to the buyer. Please discuss the price via WhatsApp and wait for the buyer to approve the price.'}
                  </p>

                  <div className="flex flex-col gap-3 md:flex-row">
                    <Button
                      variant="outline"
                      onClick={handleStartWhatsAppChat}
                      className="border-earth-medium-green text-earth-dark-green hover:bg-earth-pale-green gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {language === 'id' ? 'Diskusi via WhatsApp' : 'Discuss via WhatsApp'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(transaction?.status === 'negosiasi' || transaction?.status === 'dibayar') && (
            <Card className="earth-card-clay overflow-hidden">
              <CardHeader className="earth-header-clay pb-3">
                <CardTitle className="text-white">
                  {transaction?.status === 'negosiasi'
                    ? language === 'id'
                      ? 'Menunggu Syarat & Ketentuan'
                      : 'Waiting for Terms & Conditions'
                    : language === 'id'
                      ? 'Syarat & Ketentuan'
                      : 'Terms & Conditions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-4">
                <div className="bg-earth-clay/20 rounded-lg p-4">
                  {transaction?.status === 'negosiasi' && (
                    <div className="mb-3 flex items-center space-x-2">
                      <Timer className="text-earth-brown h-5 w-5" />
                      <h3 className="text-earth-dark-green font-medium">
                        {language === 'id'
                          ? 'Menunggu pembeli mengirim dokumen S&K'
                          : 'Waiting for buyer to send T&C document'}
                      </h3>
                    </div>
                  )}

                  {transaction?.status === 'dibayar' && (
                    <div className="mb-3 flex items-center space-x-2">
                      <CheckCircle className="text-earth-dark-green h-5 w-5" />
                      <h3 className="text-earth-dark-green font-medium">
                        {language === 'id'
                          ? 'Syarat & Ketentuan telah disetujui'
                          : 'Terms & Conditions approved'}
                      </h3>
                    </div>
                  )}

                  <p className="text-earth-medium-green mb-4">
                    {transaction?.status === 'negosiasi'
                      ? language === 'id'
                        ? 'Setelah pembeli menyetujui harga, pembeli akan mengirimkan dokumen Syarat & Ketentuan yang perlu Anda tanda tangani.'
                        : 'After the buyer approves the price, they will send a Terms & Conditions document that you need to sign.'
                      : language === 'id'
                        ? 'Anda telah menyetujui Syarat & Ketentuan. Silakan mulai persiapan komoditas untuk pengiriman.'
                        : 'You have approved the Terms & Conditions. Please start preparing the commodity for shipping.'}
                  </p>

                  {transaction?.termsDocUrl && transaction?.status === 'negosiasi' && (
                    <div className="bg-earth-pale-green/30 space-y-4 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <FileCheck className="text-earth-dark-green h-5 w-5" />
                        <h3 className="text-earth-dark-green font-medium">
                          {language === 'id'
                            ? 'Dokumen S&K telah tersedia'
                            : 'T&C document is available'}
                        </h3>
                      </div>

                      <p className="text-earth-medium-green">
                        {language === 'id'
                          ? 'Dokumen Syarat & Ketentuan telah dikirim oleh pembeli. Silakan tinjau dan tanda tangani dokumen tersebut.'
                          : 'Terms & Conditions document has been sent by the buyer. Please review and sign the document.'}
                      </p>

                      <div className="mt-4">
                        <h4 className="text-earth-dark-green mb-2 font-medium">
                          {language === 'id' ? 'Unggah Tanda Tangan' : 'Upload Signature'}
                        </h4>
                        <div className="border-earth-light-brown mb-4 rounded-lg border-2 border-dashed p-4 text-center">
                          <input
                            type="file"
                            id="signature-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadSignature}
                          />
                          <label
                            htmlFor="signature-upload"
                            className="flex cursor-pointer flex-col items-center justify-center"
                          >
                            <Upload className="text-earth-medium-green mb-2 h-8 w-8" />
                            <p className="text-earth-dark-green font-medium">
                              {language === 'id'
                                ? 'Klik untuk unggah tanda tangan'
                                : 'Click to upload signature'}
                            </p>
                            <p className="text-earth-medium-green mt-1 text-xs">
                              JPG, PNG, atau PDF (maks. 2MB)
                            </p>
                          </label>
                        </div>

                        {signature && (
                          <div className="bg-earth-light-green/20 mb-4 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <FileCheck className="text-earth-dark-green h-5 w-5" />
                                <p className="text-earth-dark-green font-medium">
                                  {signature.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          variant="farmer"
                          className="w-full"
                          onClick={handleConfirmTerms}
                          disabled={!signature}
                        >
                          {language === 'id'
                            ? 'Setujui Syarat & Ketentuan'
                            : 'Approve Terms & Conditions'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {!transaction?.termsDocUrl && transaction?.status === 'negosiasi' && (
                    <div className="bg-earth-wheat/20 rounded-lg p-4 text-center">
                      <Timer className="text-earth-light-brown mx-auto mb-2 h-12 w-12" />
                      <p className="text-earth-dark-green font-medium">
                        {language === 'id'
                          ? 'Menunggu dokumen dari pembeli'
                          : 'Waiting for document from buyer'}
                      </p>
                      <p className="text-earth-medium-green mt-1 text-sm">
                        {language === 'id'
                          ? 'Kami akan memberi tahu Anda ketika dokumen tersedia'
                          : "We'll notify you when the document is available"}
                      </p>
                    </div>
                  )}

                  {transaction?.status === 'dibayar' && (
                    <Button variant="farmer" className="mt-4 w-full" onClick={handleStartDelivery}>
                      <Truck className="mr-2 h-4 w-4" />
                      {language === 'id' ? 'Mulai Pengiriman' : 'Start Delivery'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping section for sedang_dikirim status */}
          {transaction?.status === 'sedang_dikirim' && (
            <Card className="earth-card-clay overflow-hidden">
              <CardHeader className="earth-header-clay pb-3">
                <CardTitle className="text-white">
                  {language === 'id' ? 'Pengiriman' : 'Shipping'}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-4">
                <div className="bg-earth-clay/20 rounded-lg p-4">
                  <div className="mb-3 flex items-center space-x-2">
                    <Truck className="text-earth-brown h-5 w-5" />
                    <h3 className="text-earth-dark-green font-medium">
                      {language === 'id' ? 'Pengiriman Sedang Berlangsung' : 'Shipping in Progress'}
                    </h3>
                  </div>

                  <div className="bg-earth-wheat/30 mb-4 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-earth-brown">
                        {language === 'id' ? 'Alamat' : 'Address'}:
                      </span>
                      <span className="text-earth-dark-green font-medium">
                        {transaction.buyerLocation || 'Jakarta Utara, DKI Jakarta'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-earth-brown">
                        {language === 'id' ? 'Tanggal Mulai' : 'Start Date'}:
                      </span>
                      <span className="text-earth-dark-green font-medium">
                        {transaction.deliveryStartedAt
                          ? formatDate(transaction.deliveryStartedAt)
                          : formatDate(new Date())}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-earth-brown">
                        {language === 'id' ? 'Estimasi Tiba' : 'Est. Arrival'}:
                      </span>
                      <span className="text-earth-dark-green font-medium">
                        {transaction.estimatedDeliveryDate
                          ? formatDate(transaction.estimatedDeliveryDate)
                          : language === 'id'
                            ? '1-2 hari'
                            : '1-2 days'}
                      </span>
                    </div>
                  </div>

                  <p className="text-earth-medium-green mb-4">
                    {language === 'id'
                      ? 'Pastikan komoditas dikemas dengan baik dan aman selama pengiriman. Hubungi pembeli untuk koordinasi waktu pengiriman.'
                      : 'Ensure commodities are well-packaged and safe during delivery. Contact the buyer to coordinate delivery time.'}
                  </p>

                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Delivery Proof Upload */}
                    <div className="border-earth-light-brown rounded-lg border border-dashed p-4">
                      <div className="mb-2 flex items-center">
                        <Camera className="text-earth-brown mr-2 h-4 w-4" />
                        <h4 className="text-earth-dark-green font-medium">
                          {language === 'id' ? 'Bukti Pengiriman' : 'Delivery Proof'}
                        </h4>
                      </div>

                      <div className="py-4 text-center">
                        <input
                          type="file"
                          id="delivery-proof"
                          className="hidden"
                          onChange={handlePhotoUpload}
                          accept="image/*"
                        />
                        <label htmlFor="delivery-proof" className="cursor-pointer">
                          <Upload className="text-earth-medium-green mx-auto mb-2 h-10 w-10" />
                          <p className="text-earth-medium-green">
                            {language === 'id'
                              ? 'Unggah foto bukti pengiriman'
                              : 'Upload delivery proof photo'}
                          </p>
                        </label>

                        {uploadedPhoto && (
                          <div className="text-earth-dark-green bg-earth-light-green/20 mt-2 rounded-lg p-2">
                            <CheckCircle className="mr-1 inline-block h-4 w-4" />
                            {uploadedPhoto.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tracking Number */}
                    <div className="border-earth-light-brown rounded-lg border p-4">
                      <div className="mb-2 flex items-center">
                        <FileText className="text-earth-brown mr-2 h-4 w-4" />
                        <h4 className="text-earth-dark-green font-medium">
                          {language === 'id' ? 'Nomor Pelacakan' : 'Tracking Number'}
                        </h4>
                      </div>

                      <input
                        type="text"
                        className="border-earth-light-brown/70 mb-2 w-full rounded-lg border p-2"
                        placeholder={
                          language === 'id'
                            ? 'Masukkan nomor resi/pelacakan'
                            : 'Enter receipt/tracking number'
                        }
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />

                      <p className="text-earth-medium-green text-xs">
                        {language === 'id'
                          ? 'Opsional: Isi jika menggunakan jasa kurir'
                          : 'Optional: Fill if using courier service'}
                      </p>
                    </div>
                  </div>

                  <Button variant="farmer" className="w-full" onClick={handleCompleteDelivery}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {language === 'id' ? 'Selesaikan Pengiriman' : 'Complete Delivery'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery completed section */}
          {transaction?.status === 'sudah_dikirim' && (
            <Card className="earth-card-clay overflow-hidden">
              <CardHeader className="earth-header-clay pb-3">
                <CardTitle className="text-white">
                  {language === 'id' ? 'Pengiriman Selesai' : 'Delivery Completed'}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-4">
                <div className="bg-earth-clay/20 rounded-lg p-4">
                  <div className="mb-3 flex items-center space-x-2">
                    <CheckCircle className="text-earth-dark-green h-5 w-5" />
                    <h3 className="text-earth-dark-green font-medium">
                      {language === 'id'
                        ? 'Pengiriman Telah Selesai'
                        : 'Delivery Has Been Completed'}
                    </h3>
                  </div>

                  <div className="bg-earth-light-green/20 mb-4 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-earth-brown">
                        {language === 'id' ? 'Tanggal Pengiriman' : 'Delivery Date'}:
                      </span>
                      <span className="text-earth-dark-green font-medium">
                        {transaction.actualDeliveryDate
                          ? formatDate(transaction.actualDeliveryDate)
                          : formatDate(new Date())}
                      </span>
                    </div>
                    {transaction.trackingNumber && (
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-earth-brown">
                          {language === 'id' ? 'No. Pelacakan' : 'Tracking No.'}:
                        </span>
                        <span className="text-earth-dark-green font-medium">
                          {transaction.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-earth-medium-green mb-4 text-center">
                    {language === 'id'
                      ? 'Komoditas telah dikirim. Menunggu konfirmasi penerimaan dari pembeli.'
                      : 'The commodity has been delivered. Waiting for receipt confirmation from the buyer.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <TransactionSummary
            transaction={transaction}
            openWhatsAppChat={handleStartWhatsAppChat}
          />

          <div className="mt-6">
            <TransactionTimeline
              history={transaction?.history || []}
              currentStatus={transaction?.status}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TransactionPriceSubmitted;
