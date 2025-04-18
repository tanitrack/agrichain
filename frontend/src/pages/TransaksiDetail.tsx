
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  PackageCheck, 
  DollarSign, 
  User, 
  ShoppingCart,
  Package,
  Truck
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { TransactionFlowExplainer } from "@/components/transaction/TransactionFlowExplainer";

// Mock transaction data for the demo
const transactionsData = [
  {
    id: "TRX-2023-001",
    type: "regular",
    commodityId: "KM001",
    commodityName: "Beras Putih",
    quantity: 1000,
    unit: "kg",
    price: 12000,
    totalPrice: 12000000,
    status: "sudah_dikirim",
    buyerId: "BUY-001",
    buyerName: "PT Agrimax Food",
    sellerId: "SEL-001",
    sellerName: "Koperasi Tani Makmur",
    createdAt: "2023-12-10T08:30:00Z",
    updatedAt: "2023-12-15T14:25:00Z",
    termsDocUrl: "/placeholder.svg",
    signatureUrl: "/placeholder.svg",
    shippingStatus: "sudah_dikirim",
    notes: "Pengiriman akan dilakukan dalam 2 batch. Pembayaran akan dilakukan setelah barang diterima.",
    shippingDetails: {
      address: "Jl. Industri No. 123, Kawasan Industri Pulogadung, Jakarta Timur",
      courier: "JNE",
      trackingNumber: "JNE12345678",
      estimatedArrival: "2023-12-20T00:00:00Z",
      shippedDate: "2023-12-15T09:00:00Z"
    },
    history: [
      { date: "2023-12-10T08:30:00Z", status: "menunggu_konfirmasi", description: "Pesanan dibuat" },
      { date: "2023-12-11T10:15:00Z", status: "dikonfirmasi", description: "Pesanan dikonfirmasi penjual" },
      { date: "2023-12-12T13:45:00Z", status: "dibayar", description: "Pembayaran diterima" },
      { date: "2023-12-15T09:00:00Z", status: "persiapan_pengiriman", description: "Barang sedang dipersiapkan" },
      { date: "2023-12-15T14:25:00Z", status: "sudah_dikirim", description: "Barang telah dikirim" }
    ]
  },
  {
    id: "TRX-2023-002",
    type: "order_book",
    commodityId: "KM002",
    commodityName: "Jagung Manis",
    quantity: 500,
    unit: "kg",
    price: 8000,
    totalPrice: 4000000,
    status: "dibayar",
    buyerId: "BUY-002",
    buyerName: "Restoran Padang Jaya",
    sellerId: "SEL-001",
    sellerName: "Koperasi Tani Makmur",
    createdAt: "2023-12-08T10:45:00Z",
    updatedAt: "2023-12-14T11:30:00Z",
    termsDocUrl: "/placeholder.svg",
    signatureUrl: "/placeholder.svg",
    shippingStatus: "belum_dikirim",
    notes: "Pembayaran telah dilakukan. Menunggu persiapan pengiriman.",
    shippingDetails: {
      address: "Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan",
      courier: "SiCepat",
      trackingNumber: "-",
      estimatedArrival: "2023-12-22T00:00:00Z",
      shippedDate: null
    },
    history: [
      { date: "2023-12-08T10:45:00Z", status: "menunggu_konfirmasi", description: "Pesanan dibuat dari Order Book" },
      { date: "2023-12-09T09:20:00Z", status: "dikonfirmasi", description: "Pesanan dikonfirmasi penjual" },
      { date: "2023-12-14T11:30:00Z", status: "dibayar", description: "Pembayaran diterima" }
    ]
  },
  {
    id: "TRX-2023-003",
    type: "regular",
    commodityId: "KM003",
    commodityName: "Kedelai",
    quantity: 800,
    unit: "kg",
    price: 15000,
    totalPrice: 12000000,
    status: "selesai",
    buyerId: "BUY-003",
    buyerName: "Pabrik Tahu Murni",
    sellerId: "SEL-002",
    sellerName: "PT Agro Nusantara",
    createdAt: "2023-12-01T14:20:00Z",
    updatedAt: "2023-12-12T09:15:00Z",
    termsDocUrl: "/placeholder.svg",
    signatureUrl: "/placeholder.svg",
    shippingStatus: "sudah_dikirim",
    notes: "Transaksi selesai. Barang telah diterima dengan kondisi baik.",
    shippingDetails: {
      address: "Jl. Industri Kecil No. 78, Cibitung, Bekasi",
      courier: "AnterAja",
      trackingNumber: "AA987654321",
      estimatedArrival: "2023-12-10T00:00:00Z",
      shippedDate: "2023-12-05T08:30:00Z"
    },
    history: [
      { date: "2023-12-01T14:20:00Z", status: "menunggu_konfirmasi", description: "Pesanan dibuat" },
      { date: "2023-12-02T08:45:00Z", status: "dikonfirmasi", description: "Pesanan dikonfirmasi penjual" },
      { date: "2023-12-03T10:30:00Z", status: "dibayar", description: "Pembayaran diterima" },
      { date: "2023-12-04T15:20:00Z", status: "persiapan_pengiriman", description: "Barang sedang dipersiapkan" },
      { date: "2023-12-05T08:30:00Z", status: "sedang_dikirim", description: "Barang sedang dalam pengiriman" },
      { date: "2023-12-10T11:45:00Z", status: "diterima", description: "Barang diterima pembeli" },
      { date: "2023-12-12T09:15:00Z", status: "selesai", description: "Transaksi selesai" }
    ]
  }
];

const TransaksiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [transaction, setTransaction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      const found = transactionsData.find(item => item.id === id);
      setTransaction(found || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-center">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!transaction) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">{t("transactions.notfound")}</h2>
          <p className="text-gray-600 mb-6">{t("transactions.empty")}</p>
          <Button onClick={() => navigate('/transaksi')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("action.back")}
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Get the status badge style based on the status
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      menunggu_konfirmasi: {
        label: t("status.pending"),
        className: "bg-earth-wheat text-earth-brown font-medium",
      },
      dikonfirmasi: {
        label: t("status.confirmed"),
        className: "bg-earth-light-brown text-earth-brown font-medium",
      },
      negosiasi: {
        label: t("status.negotiating"),
        className: "bg-earth-clay text-earth-brown font-medium",
      },
      dibayar: {
        label: t("status.paid"),
        className: "bg-earth-light-green text-earth-dark-green font-medium",
      },
      persiapan_pengiriman: {
        label: t("status.processing"),
        className: "bg-earth-light-green/70 text-earth-dark-green font-medium",
      },
      sedang_dikirim: {
        label: t("status.shipping"),
        className: "bg-earth-medium-green/30 text-earth-dark-green font-medium",
      },
      sudah_dikirim: {
        label: t("status.shipped"),
        className: "bg-earth-medium-green/60 text-earth-dark-green font-medium",
      },
      diterima: {
        label: t("status.received"),
        className: "bg-earth-medium-green/90 text-white font-medium",
      },
      selesai: {
        label: t("status.completed"),
        className: "bg-earth-dark-green text-white font-medium",
      },
      dibatalkan: {
        label: t("status.canceled"),
        className: "bg-red-100 text-red-800 font-medium",
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800 font-medium",
    };

    return (
      <Badge className={`${statusInfo.className} px-3 py-1 rounded-full`}>
        {statusInfo.label}
      </Badge>
    );
  };

  // Calculate progress percentage based on status
  const calculateProgress = () => {
    const statusOrder = [
      "menunggu_konfirmasi",
      "dikonfirmasi",
      "negosiasi",
      "dibayar",
      "persiapan_pengiriman",
      "sedang_dikirim",
      "sudah_dikirim",
      "diterima",
      "selesai"
    ];
    
    const currentIndex = statusOrder.findIndex(status => status === transaction.status);
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
            {t("action.back")}
          </Button>
          <h1 className="text-2xl font-bold text-earth-dark-green">{t("transactions.detail")}</h1>
          <p className="text-earth-medium-green font-medium">{transaction.id}</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2 border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green">
            <FileText className="h-4 w-4" />
            {t("action.print")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="earth-card-forest overflow-hidden">
            <CardHeader className="earth-header-forest pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">{t("transactions.detail")}</CardTitle>
                {getStatusBadge(transaction.status)}
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="mb-6">
                <Progress value={calculateProgress()} className="h-2 bg-earth-pale-green" />
                <div className="flex justify-between text-xs text-earth-medium-green mt-1">
                  <span>{t("status.pending")}</span>
                  <span>{t("status.processing")}</span>
                  <span>{t("status.shipped")}</span>
                  <span>{t("status.completed")}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-earth-pale-green/50">
                    <h3 className="text-sm font-medium text-earth-medium-green mb-1">{t("transactions.commodity")}</h3>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-earth-medium-green/20 flex items-center justify-center mr-3">
                        <Package className="h-6 w-6 text-earth-medium-green" />
                      </div>
                      <div>
                        <p className="font-bold text-earth-dark-green">{transaction.commodityName}</p>
                        <p className="text-sm text-earth-medium-green">{transaction.quantity.toLocaleString()} {transaction.unit}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-earth-wheat/30">
                    <h3 className="text-sm font-medium text-earth-brown mb-1">{t("transactions.total")}</h3>
                    <p className="text-xl font-bold text-earth-dark-green">
                      {formatCurrency(transaction.totalPrice)}
                    </p>
                    <p className="text-sm text-earth-medium-green">
                      @{formatCurrency(transaction.price)}/{transaction.unit}
                    </p>
                  </div>
                </div>

                <Separator className="bg-earth-light-brown/30" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-earth-clay/20">
                    <h3 className="text-sm font-medium text-earth-brown mb-2">{t("transactions.buyer")}</h3>
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-earth-clay/30 flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-earth-brown" />
                      </div>
                      <div>
                        <p className="font-bold text-earth-dark-green">{transaction.buyerName}</p>
                        <p className="text-sm text-earth-medium-green">{transaction.buyerId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-earth-light-green/20">
                    <h3 className="text-sm font-medium text-earth-medium-green mb-2">{t("transactions.seller")}</h3>
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-earth-light-green/30 flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-earth-medium-green" />
                      </div>
                      <div>
                        <p className="font-bold text-earth-dark-green">{transaction.sellerName}</p>
                        <p className="text-sm text-earth-medium-green">{transaction.sellerId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-earth-light-brown/30" />

                <div className="p-4 rounded-lg bg-earth-light-brown/20">
                  <h3 className="text-sm font-medium text-earth-brown mb-2">{t("transactions.terms")}</h3>
                  <p className="text-earth-dark-green mb-4">{transaction.notes || "-"}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1 border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green">
                      <FileText className="h-4 w-4" />
                      {t("transactions.documents")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="earth-card-moss overflow-hidden">
            <CardHeader className="earth-header-moss pb-3">
              <CardTitle className="text-white">{t("shipping.title")}</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              {transaction.shippingStatus !== "belum_dikirim" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-earth-pale-green/50">
                      <h3 className="text-sm font-medium text-earth-medium-green mb-1">{t("shipping.destination")}</h3>
                      <p className="text-earth-dark-green">{transaction.shippingDetails?.address || "-"}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-earth-pale-green/50">
                      <h3 className="text-sm font-medium text-earth-medium-green mb-1">{t("shipping.carrier")}</h3>
                      <p className="text-earth-dark-green">{transaction.shippingDetails?.courier || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-earth-light-green/20">
                      <h3 className="text-sm font-medium text-earth-medium-green mb-1">{t("shipping.tracking")}</h3>
                      <p className="text-earth-dark-green font-mono">{transaction.shippingDetails?.trackingNumber || "-"}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-earth-light-green/20">
                      <h3 className="text-sm font-medium text-earth-medium-green mb-1">{t("shipping.arrivalDate")}</h3>
                      <p className="text-earth-dark-green">
                        {transaction.shippingDetails?.estimatedArrival ? 
                          formatDate(new Date(transaction.shippingDetails.estimatedArrival)) : 
                          "-"}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-earth-wheat/30">
                    <h3 className="text-sm font-medium text-earth-brown mb-1">{t("shipping.departureDate")}</h3>
                    <p className="text-earth-dark-green">
                      {transaction.shippingDetails?.shippedDate ? 
                        formatDate(new Date(transaction.shippingDetails.shippedDate)) : 
                        t("status.notshipped")}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" className="gap-2 border-earth-light-brown text-earth-dark-green hover:bg-earth-pale-green">
                      <Truck className="h-4 w-4" />
                      {t("shipping.trackShipment")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-earth-pale-green/30 rounded-lg">
                  <Truck className="h-12 w-12 mx-auto mb-2 text-earth-light-green" />
                  <p className="mb-4 text-earth-medium-green font-medium">{t("shipping.notfound")}</p>
                  <p className="text-sm text-earth-medium-green">{t("status.notshipped")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Transaction Flow Explainer */}
          <TransactionFlowExplainer currentStatus={transaction.status} />
        </div>

        <div className="space-y-6">
          <Card className="earth-card-brown overflow-hidden">
            <CardHeader className="earth-header-brown pb-3">
              <CardTitle className="text-white">{t("transactions.summary")}</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                  <span className="text-earth-brown">{t("transactions.type")}</span>
                  <Badge variant="outline" className="capitalize border-earth-brown text-earth-brown">
                    {transaction.type === "order_book" ? "Order Book" : t("transactions.regular")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
                  <span className="text-earth-brown">{t("transactions.date")}</span>
                  <span className="text-earth-dark-green">{formatDate(new Date(transaction.createdAt))}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                  <span className="text-earth-brown">{t("transactions.updatedAt")}</span>
                  <span className="text-earth-dark-green">{formatDate(new Date(transaction.updatedAt))}</span>
                </div>

                <Separator className="bg-earth-light-brown/30" />

                <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
                  <span className="text-earth-brown">{t("transactions.commodity")}</span>
                  <span className="text-earth-dark-green">{transaction.commodityName}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                  <span className="text-earth-brown">{t("transactions.quantity")}</span>
                  <span className="text-earth-dark-green">{transaction.quantity.toLocaleString()} {transaction.unit}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
                  <span className="text-earth-brown">{t("transactions.price")}</span>
                  <span className="text-earth-dark-green">{formatCurrency(transaction.price)}/{transaction.unit}</span>
                </div>

                <Separator className="bg-earth-light-brown/30" />

                <div className="flex justify-between items-center p-3 rounded bg-earth-wheat/40 font-bold">
                  <span className="text-earth-dark-green">{t("transactions.total")}</span>
                  <span className="text-earth-dark-green">{formatCurrency(transaction.totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="earth-card-clay overflow-hidden">
            <CardHeader className="earth-header-clay pb-3">
              <CardTitle className="text-white">{t("transactions.timeline")}</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-4">
                {transaction.history?.map((event: any, index: number) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="w-4 h-4 bg-earth-brown rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-earth-clay rounded-full"></div>
                      </div>
                      {index < (transaction.history?.length || 0) - 1 && (
                        <div className="w-0.5 bg-earth-light-brown h-full mt-1"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex flex-col">
                        <p className="font-medium text-earth-dark-green">{event.description}</p>
                        <p className="text-sm text-earth-brown">{formatDate(new Date(event.date))}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!transaction.history || transaction.history.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-earth-medium-green">{t("info.noData")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="earth-card-wheat overflow-hidden">
            <CardHeader className="earth-header-wheat pb-3">
              <CardTitle className="text-white">{t("dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2 border-earth-light-brown/50 text-earth-dark-green hover:bg-earth-pale-green/50">
                  <FileText className="h-4 w-4" />
                  {t("transactions.invoice")}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-earth-light-brown/50 text-earth-dark-green hover:bg-earth-pale-green/50">
                  <ShoppingCart className="h-4 w-4" />
                  {t("transactions.commodity")}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-earth-light-brown/50 text-earth-dark-green hover:bg-earth-pale-green/50">
                  <PackageCheck className="h-4 w-4" />
                  {t("shipping.updateStatus")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TransaksiDetail;
