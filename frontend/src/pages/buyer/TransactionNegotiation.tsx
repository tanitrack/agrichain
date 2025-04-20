import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeft,
  Clock,
  Package,
  User,
  MessageSquare,
  CheckCircle,
  FileCheck,
  Upload,
  DownloadCloud,
  MapPin,
} from 'lucide-react';

// Mock transaction data
const mockTransaction = {
  id: 'TRX-20231234',
  commodityId: '1',
  commodityName: 'Beras Organik Premium',
  variety: 'IR 64',
  quantity: 20,
  unit: 'kg',
  initialPrice: 12000,
  status: 'negosiasi',
  farmer: {
    id: 'FARM001',
    name: 'Pak Joko',
    phone: '+6282145678901',
    location: 'Subang, Jawa Barat',
  },
  buyer: {
    id: 'BUY001',
    name: 'PT Agro Nusantara',
  },
  createdAt: '2023-12-15T08:30:00Z',
  notes: 'Pengiriman diharapkan bisa sampai dalam waktu 3 hari.',
  priceNegoStatus: 'waiting', // waiting, offered, accepted
  negotiatedPrice: null,
  termsAccepted: false,
  signatureUrl: null,
  history: [
    {
      date: '2023-12-15T08:30:00Z',
      status: 'menunggu_konfirmasi',
      description: 'Permintaan pembelian dibuat',
    },
    {
      date: '2023-12-15T10:15:00Z',
      status: 'dikonfirmasi',
      description: 'Permintaan dikonfirmasi oleh petani',
    },
    {
      date: '2023-12-15T10:30:00Z',
      status: 'negosiasi',
      description: 'Proses negosiasi harga dimulai',
    },
  ],
};

const TransactionNegotiation = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [transaction, setTransaction] = useState(mockTransaction);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [signature, setSignature] = useState<File | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  // Mock the change in price negotiation status after component mount
  useEffect(() => {
    // Simulate receiving a price offer after 3 seconds
    const timer = setTimeout(() => {
      setTransaction((prev) => ({
        ...prev,
        priceNegoStatus: 'offered',
        negotiatedPrice: 11500,
      }));

      toast({
        title: language === 'id' ? 'Tawaran Harga Diterima!' : 'Price Offer Received!',
        description:
          language === 'id'
            ? `${transaction.farmer.name} telah menawarkan harga Rp 11.500/kg`
            : `${transaction.farmer.name} has offered a price of Rp 11,500/kg`,
        variant: 'default',
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenWhatsapp = () => {
    const message =
      language === 'id'
        ? `Halo ${transaction.farmer.name}, saya tertarik dengan ${transaction.commodityName} Anda. Mari kita diskusikan harga untuk pembelian ${transaction.quantity} ${transaction.unit}.`
        : `Hello ${transaction.farmer.name}, I'm interested in your ${transaction.commodityName}. Let's discuss the price for purchasing ${transaction.quantity} ${transaction.unit}.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${transaction.farmer.phone.replace(/\+/g, '')}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleAcceptPrice = () => {
    setTransaction((prev) => ({
      ...prev,
      priceNegoStatus: 'accepted',
    }));

    toast({
      title: language === 'id' ? 'Harga Diterima!' : 'Price Accepted!',
      description:
        language === 'id'
          ? `Anda telah menerima tawaran harga Rp ${transaction.negotiatedPrice?.toLocaleString()}/kg`
          : `You have accepted the price offer of Rp ${transaction.negotiatedPrice?.toLocaleString()}/kg`,
      variant: 'default',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignature(e.target.files[0]);
    }
  };

  const handleSubmitAgreement = () => {
    setIsAccepting(true);

    // Simulate API request
    setTimeout(() => {
      setTransaction((prev) => ({
        ...prev,
        status: 'dibayar',
        termsAccepted: true,
        signatureUrl: '/placeholder.svg',
        history: [
          ...prev.history,
          {
            date: new Date().toISOString(),
            status: 'dibayar',
            description:
              language === 'id'
                ? 'Syarat dan ketentuan disetujui, menunggu pengiriman'
                : 'Terms and conditions agreed, waiting for shipment',
          },
        ],
      }));

      toast({
        title: language === 'id' ? 'Persetujuan Terkirim!' : 'Agreement Submitted!',
        description:
          language === 'id'
            ? 'Syarat dan ketentuan telah disetujui. Transaksi akan diproses.'
            : 'Terms and conditions have been agreed. Transaction will be processed.',
        variant: 'default',
      });

      // Redirect to transaction detail
      navigate(`/transaksi/${id}`);
      setIsAccepting(false);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/transaksi-pending')}
            className="border-earth-light-brown/30"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {language === 'id' ? 'Kembali ke Daftar' : 'Back to List'}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main transaction content */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-earth-light-brown/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#FEF7CD] to-[#FDE1D3]">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-earth-brown">
                      {language === 'id' ? 'Negosiasi Transaksi' : 'Transaction Negotiation'}
                    </CardTitle>
                    <p className="text-earth-brown/80 mt-1 text-sm">{transaction.id}</p>
                  </div>
                  <Badge className="text-earth-brown border-earth-clay/50 border bg-[#FEF7CD] px-3 py-1">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {language === 'id' ? 'Negosiasi' : 'Negotiation'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Commodity information */}
                <div className="flex items-center gap-4 rounded-lg bg-[#FEF7CD]/30 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#FEF7CD]/50">
                    <Package className="text-earth-brown h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-earth-brown text-lg font-semibold">
                      {transaction.commodityName}
                    </h3>
                    <p className="text-earth-clay">{transaction.variety}</p>
                    <p className="text-earth-brown mt-1 text-sm">
                      {transaction.quantity.toLocaleString()} {transaction.unit} • Rp{' '}
                      {transaction.initialPrice.toLocaleString()}/{transaction.unit}
                      <span className="text-earth-clay ml-1 text-xs">
                        {language === 'id' ? '(harga awal)' : '(initial price)'}
                      </span>
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="negotiation" className="w-full">
                  <TabsList className="w-full bg-[#FDE1D3]/30">
                    <TabsTrigger value="negotiation" className="flex-1">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {language === 'id' ? 'Negosiasi Harga' : 'Price Negotiation'}
                    </TabsTrigger>
                    <TabsTrigger value="agreement" className="flex-1">
                      <FileCheck className="mr-2 h-4 w-4" />
                      {language === 'id' ? 'Persetujuan' : 'Agreement'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="negotiation" className="mt-4 space-y-6">
                    <div className="bg-earth-pale-green/30 rounded-lg p-4">
                      <h3 className="text-earth-dark-green mb-3 font-medium">
                        {language === 'id' ? 'Status Negosiasi' : 'Negotiation Status'}
                      </h3>

                      {transaction.priceNegoStatus === 'waiting' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 rounded-lg bg-[#FEF7CD]/50 p-3">
                            <Clock className="text-earth-brown h-5 w-5" />
                            <p className="text-earth-brown">
                              {language === 'id'
                                ? 'Menunggu tawaran harga dari petani. Silakan hubungi petani melalui WhatsApp.'
                                : 'Waiting for price offer from farmer. Please contact the farmer via WhatsApp.'}
                            </p>
                          </div>

                          <Button
                            className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E]"
                            onClick={handleOpenWhatsapp}
                          >
                            <svg
                              className="h-5 w-5 fill-current"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            {language === 'id' ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp'}
                          </Button>
                        </div>
                      )}

                      {transaction.priceNegoStatus === 'offered' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 rounded-lg bg-[#F2FCE2]/70 p-3">
                            <CheckCircle className="text-earth-dark-green h-5 w-5" />
                            <div>
                              <p className="text-earth-dark-green font-medium">
                                {language === 'id'
                                  ? 'Tawaran harga diterima!'
                                  : 'Price offer received!'}
                              </p>
                              <p className="text-earth-medium-green text-sm">
                                {language === 'id'
                                  ? `${transaction.farmer.name} menawarkan harga Rp ${transaction.negotiatedPrice?.toLocaleString()}/kg`
                                  : `${transaction.farmer.name} has offered a price of Rp ${transaction.negotiatedPrice?.toLocaleString()}/kg`}
                              </p>
                            </div>
                          </div>

                          <div className="border-earth-light-brown/30 rounded-lg border bg-white p-4">
                            <h4 className="text-earth-brown mb-3 font-medium">
                              {language === 'id' ? 'Detail Tawaran' : 'Offer Details'}
                            </h4>

                            <div className="mb-4 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-muted-foreground text-sm">
                                  {language === 'id' ? 'Harga Awal' : 'Initial Price'}
                                </p>
                                <p className="text-earth-brown line-through">
                                  Rp {transaction.initialPrice.toLocaleString()}/{transaction.unit}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-sm">
                                  {language === 'id' ? 'Harga Ditawarkan' : 'Offered Price'}
                                </p>
                                <p className="text-earth-dark-green font-bold">
                                  Rp {transaction.negotiatedPrice?.toLocaleString()}/
                                  {transaction.unit}
                                </p>
                              </div>
                            </div>

                            <div className="mb-4 rounded-lg bg-[#F2FCE2]/50 p-3">
                              <p className="text-earth-medium-green text-sm">
                                {language === 'id'
                                  ? 'Total harga setelah negosiasi:'
                                  : 'Total price after negotiation:'}
                              </p>
                              <p className="text-earth-dark-green text-lg font-bold">
                                Rp{' '}
                                {(
                                  (transaction.negotiatedPrice || 0) * transaction.quantity
                                ).toLocaleString()}
                              </p>
                              <p className="text-earth-medium-green text-xs">
                                {transaction.quantity.toLocaleString()} {transaction.unit} × Rp{' '}
                                {transaction.negotiatedPrice?.toLocaleString()}/{transaction.unit}
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                className="text-earth-brown border-earth-light-brown/50 flex-1 border bg-white hover:bg-[#FEF7CD]/50"
                                onClick={handleOpenWhatsapp}
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {language === 'id' ? 'Negosiasi Lagi' : 'Negotiate More'}
                              </Button>
                              <Button
                                className="bg-earth-medium-green hover:bg-earth-dark-green flex-1"
                                onClick={handleAcceptPrice}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {language === 'id' ? 'Terima Harga' : 'Accept Price'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {transaction.priceNegoStatus === 'accepted' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 rounded-lg bg-[#F2FCE2]/70 p-3">
                            <CheckCircle className="text-earth-dark-green h-5 w-5" />
                            <div>
                              <p className="text-earth-dark-green font-medium">
                                {language === 'id'
                                  ? 'Harga telah disetujui!'
                                  : 'Price has been agreed!'}
                              </p>
                              <p className="text-earth-medium-green text-sm">
                                {language === 'id'
                                  ? 'Silakan lanjutkan ke tab Persetujuan untuk menyelesaikan transaksi'
                                  : 'Please continue to the Agreement tab to complete the transaction'}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-lg bg-[#F2FCE2]/50 p-4">
                            <div className="mb-3 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-muted-foreground text-sm">
                                  {language === 'id' ? 'Harga yang Disetujui' : 'Agreed Price'}
                                </p>
                                <p className="text-earth-dark-green font-bold">
                                  Rp {transaction.negotiatedPrice?.toLocaleString()}/
                                  {transaction.unit}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-sm">
                                  {language === 'id' ? 'Total Harga' : 'Total Price'}
                                </p>
                                <p className="text-earth-dark-green font-bold">
                                  Rp{' '}
                                  {(
                                    (transaction.negotiatedPrice || 0) * transaction.quantity
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="agreement" className="mt-4 space-y-6">
                    <div className="bg-earth-pale-green/30 space-y-4 rounded-lg p-4">
                      <h3 className="text-earth-dark-green mb-3 font-medium">
                        {language === 'id' ? 'Syarat dan Ketentuan' : 'Terms and Conditions'}
                      </h3>

                      {transaction.priceNegoStatus !== 'accepted' ? (
                        <div className="rounded-lg bg-[#FEF7CD]/50 p-3">
                          <p className="text-earth-brown">
                            {language === 'id'
                              ? 'Anda perlu menyelesaikan negosiasi harga terlebih dahulu sebelum melanjutkan ke persetujuan.'
                              : 'You need to complete price negotiation first before proceeding to agreement.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="border-earth-light-brown/30 max-h-60 overflow-y-auto rounded-lg border bg-white p-4">
                            <h4 className="mb-2 font-medium">
                              {language === 'id' ? 'Ketentuan Transaksi' : 'Transaction Terms'}
                            </h4>
                            <p className="text-muted-foreground mb-3 text-sm">
                              {language === 'id'
                                ? 'Dengan menyetujui ketentuan ini, Anda setuju untuk membeli komoditas dengan ketentuan berikut:'
                                : 'By agreeing to these terms, you agree to purchase the commodity with the following terms:'}
                            </p>

                            <ol className="list-decimal space-y-2 pl-5 text-sm">
                              <li>
                                {language === 'id'
                                  ? `Pembeli setuju untuk membeli ${transaction.commodityName} sebanyak ${transaction.quantity} ${transaction.unit} dengan harga Rp ${transaction.negotiatedPrice?.toLocaleString()} per ${transaction.unit}.`
                                  : `Buyer agrees to purchase ${transaction.commodityName} in the amount of ${transaction.quantity} ${transaction.unit} at a price of Rp ${transaction.negotiatedPrice?.toLocaleString()} per ${transaction.unit}.`}
                              </li>
                              <li>
                                {language === 'id'
                                  ? 'Pembayaran akan dilakukan sesuai dengan metode yang disepakati setelah barang diterima dalam kondisi baik.'
                                  : 'Payment will be made according to the agreed method after the goods are received in good condition.'}
                              </li>
                              <li>
                                {language === 'id'
                                  ? 'Pengiriman akan dilakukan dalam waktu 3-5 hari kerja setelah persetujuan.'
                                  : 'Delivery will be made within 3-5 working days after approval.'}
                              </li>
                              <li>
                                {language === 'id'
                                  ? 'Pembeli berhak mengembalikan barang jika tidak sesuai dengan spesifikasi yang disepakati.'
                                  : 'Buyer has the right to return goods if they do not match the agreed specifications.'}
                              </li>
                              <li>
                                {language === 'id'
                                  ? 'Petani berhak membatalkan transaksi jika terjadi force majeure yang mempengaruhi ketersediaan komoditas.'
                                  : 'Farmer has the right to cancel the transaction if there is a force majeure affecting the availability of commodities.'}
                              </li>
                            </ol>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="agree-terms"
                                checked={termsAgreed}
                                onChange={(e) => setTermsAgreed(e.target.checked)}
                                className="border-earth-light-brown/50 text-earth-medium-green h-4 w-4 rounded"
                              />
                              <Label htmlFor="agree-terms" className="cursor-pointer text-sm">
                                {language === 'id'
                                  ? 'Saya telah membaca dan menyetujui syarat dan ketentuan transaksi ini.'
                                  : 'I have read and agree to the terms and conditions of this transaction.'}
                              </Label>
                            </div>

                            <div className="rounded-lg bg-[#F2FCE2]/50 p-3">
                              <Label className="mb-2 block text-sm">
                                {language === 'id' ? 'Unggah Tanda Tangan' : 'Upload Signature'}
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={handleFileChange}
                                  className="border-earth-light-brown/30 focus-visible:ring-earth-medium-green"
                                />
                                {signature && (
                                  <p className="text-earth-medium-green text-xs">
                                    {language === 'id' ? 'File dipilih: ' : 'File selected: '}
                                    {signature.name}
                                  </p>
                                )}
                              </div>
                              <p className="text-muted-foreground mt-1 text-xs">
                                {language === 'id'
                                  ? 'Unggah tanda tangan digital atau fisik yang sudah dipindai (format JPG, PNG, atau PDF).'
                                  : 'Upload a digital or scanned physical signature (JPG, PNG, or PDF format).'}
                              </p>
                            </div>

                            <Button
                              className="bg-earth-medium-green hover:bg-earth-dark-green w-full"
                              disabled={!termsAgreed || !signature || isAccepting}
                              onClick={handleSubmitAgreement}
                            >
                              {isAccepting ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                  {language === 'id' ? 'Memproses...' : 'Processing...'}
                                </div>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  {language === 'id' ? 'Kirim Persetujuan' : 'Submit Agreement'}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Transaction Timeline */}
            <Card className="border-earth-light-brown/30">
              <CardHeader className="bg-[#FDE1D3]/60">
                <CardTitle className="text-earth-brown">
                  {language === 'id' ? 'Riwayat Transaksi' : 'Transaction Timeline'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {transaction.history.map((event, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="bg-earth-brown flex h-4 w-4 items-center justify-center rounded-full">
                          <div className="bg-earth-clay h-2 w-2 rounded-full"></div>
                        </div>
                        {index < transaction.history.length - 1 && (
                          <div className="bg-earth-light-brown/50 mt-1 h-full w-0.5"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex flex-col">
                          <p className="text-earth-brown font-medium">{event.description}</p>
                          <p className="text-earth-clay text-sm">
                            {new Date(event.date).toLocaleString(
                              language === 'id' ? 'id-ID' : 'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side information */}
          <div className="space-y-6">
            <Card className="border-earth-light-brown/30">
              <CardHeader className="bg-[#F2FCE2]">
                <CardTitle className="text-earth-dark-green">
                  {language === 'id' ? 'Informasi Transaksi' : 'Transaction Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="bg-earth-pale-green/20 flex items-center justify-between rounded p-2">
                  <span className="text-earth-medium-green">
                    {language === 'id' ? 'ID Transaksi' : 'Transaction ID'}
                  </span>
                  <span className="text-earth-dark-green font-mono">{transaction.id}</span>
                </div>
                <div className="bg-earth-pale-green/10 flex items-center justify-between rounded p-2">
                  <span className="text-earth-medium-green">
                    {language === 'id' ? 'Status' : 'Status'}
                  </span>
                  <Badge className="text-earth-brown border-earth-clay/50 border bg-[#FEF7CD] px-2">
                    {language === 'id' ? 'Negosiasi' : 'Negotiation'}
                  </Badge>
                </div>
                <div className="bg-earth-pale-green/20 flex items-center justify-between rounded p-2">
                  <span className="text-earth-medium-green">
                    {language === 'id' ? 'Tanggal Dibuat' : 'Created Date'}
                  </span>
                  <span className="text-earth-dark-green">
                    {new Date(transaction.createdAt).toLocaleDateString(
                      language === 'id' ? 'id-ID' : 'en-US'
                    )}
                  </span>
                </div>

                <Separator className="bg-earth-light-brown/20" />

                <div className="space-y-3 rounded-lg bg-[#F2FCE2]/70 p-3">
                  <div className="flex items-center gap-3">
                    <User className="text-earth-medium-green h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {language === 'id' ? 'Petani' : 'Farmer'}
                      </p>
                      <p className="text-earth-dark-green font-medium">{transaction.farmer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-earth-medium-green h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {language === 'id' ? 'Lokasi' : 'Location'}
                      </p>
                      <p className="text-earth-dark-green">{transaction.farmer.location}</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="border-earth-light-brown/50 text-earth-brown w-full hover:bg-[#FEF7CD]/30"
                  onClick={handleOpenWhatsapp}
                >
                  <svg
                    className="mr-2 h-4 w-4 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {language === 'id' ? 'Hubungi Petani' : 'Contact Farmer'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-earth-light-brown/30">
              <CardHeader className="bg-earth-wheat">
                <CardTitle className="text-earth-brown">
                  {language === 'id' ? 'Ringkasan Pembelian' : 'Purchase Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'id' ? 'Komoditas' : 'Commodity'}
                    </span>
                    <span className="text-earth-brown font-medium">
                      {transaction.commodityName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'id' ? 'Varietas' : 'Variety'}
                    </span>
                    <span className="text-earth-brown">{transaction.variety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'id' ? 'Jumlah' : 'Quantity'}
                    </span>
                    <span className="text-earth-brown">
                      {transaction.quantity} {transaction.unit}
                    </span>
                  </div>
                </div>

                <Separator className="bg-earth-light-brown/20" />

                <div className="rounded-lg bg-[#FEF7CD]/50 p-3">
                  <div className="mb-1 flex justify-between">
                    <span className="text-earth-brown">
                      {language === 'id' ? 'Harga Awal' : 'Initial Price'}
                    </span>
                    <span className="text-earth-brown">
                      Rp {transaction.initialPrice.toLocaleString()}/{transaction.unit}
                    </span>
                  </div>

                  {transaction.negotiatedPrice && (
                    <>
                      <div className="mb-1 flex justify-between">
                        <span className="text-earth-brown">
                          {language === 'id' ? 'Harga Negosiasi' : 'Negotiated Price'}
                        </span>
                        <span className="text-earth-brown font-medium">
                          Rp {transaction.negotiatedPrice.toLocaleString()}/{transaction.unit}
                        </span>
                      </div>
                      <div className="border-earth-light-brown/20 flex justify-between border-t pt-2">
                        <span className="text-earth-brown font-medium">
                          {language === 'id' ? 'Total' : 'Total'}
                        </span>
                        <span className="text-earth-brown font-bold">
                          Rp {(transaction.negotiatedPrice * transaction.quantity).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}

                  {!transaction.negotiatedPrice && (
                    <div className="border-earth-light-brown/20 flex justify-between border-t pt-2">
                      <span className="text-earth-brown font-medium">
                        {language === 'id' ? 'Total Estimasi' : 'Estimated Total'}
                      </span>
                      <span className="text-earth-brown font-bold">
                        Rp {(transaction.initialPrice * transaction.quantity).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-earth-clay text-xs italic">
                  {language === 'id'
                    ? '* Harga final akan ditentukan setelah negosiasi.'
                    : '* Final price will be determined after negotiation.'}
                </div>
              </CardContent>
            </Card>

            <Card className="border-earth-light-brown/30">
              <CardHeader className="bg-[#FDE1D3]/60">
                <CardTitle className="text-earth-brown text-base">
                  {language === 'id' ? 'Dokumen & Berkas' : 'Documents & Files'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="border-earth-light-brown/50 text-earth-brown w-full justify-start gap-2 hover:bg-[#FDE1D3]/30"
                    disabled
                  >
                    <DownloadCloud className="h-4 w-4" />
                    {language === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions'}
                  </Button>

                  <Button
                    variant="outline"
                    className="border-earth-light-brown/50 text-earth-brown w-full justify-start gap-2 hover:bg-[#FDE1D3]/30"
                    disabled={!transaction.signatureUrl}
                  >
                    <DownloadCloud className="h-4 w-4" />
                    {language === 'id' ? 'Tanda Tangan' : 'Signature'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TransactionNegotiation;
