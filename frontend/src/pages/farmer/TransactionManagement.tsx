
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  PackageCheck, 
  DollarSign,
  User, 
  ShoppingCart,
  Package,
  Truck,
  Check,
  X,
  MessageCircle,
  Upload,
  FileCheck,
  CheckCircle,
  Pen,
  Phone,
  MapPin,
  Calendar,
  CloudDownload
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Mock transaction data for the demo
const transactionsData = [
  {
    id: "TRX-2023-001",
    type: "regular",
    commodityId: "KM001",
    commodityName: "Beras Putih",
    quantity: 1000,
    unit: "kg",
    price: null, // Not yet set
    totalPrice: null, // Not yet set
    status: "menunggu_konfirmasi",
    buyerId: "BUY-001",
    buyerName: "PT Agrimax Food",
    sellerId: "SEL-001",
    sellerName: "Koperasi Tani Makmur",
    createdAt: "2023-12-10T08:30:00Z",
    updatedAt: "2023-12-15T14:25:00Z",
    termsDocUrl: null,
    signatureUrl: null,
    shippingStatus: null,
    buyerLocation: "Jakarta Timur",
    buyerPhone: "+6281234567890",
    notes: "Membutuhkan beras kualitas premium untuk restoran kami.",
    history: [
      { date: "2023-12-10T08:30:00Z", status: "menunggu_konfirmasi", description: "Pesanan dibuat oleh pembeli" }
    ]
  },
  {
    id: "TRX-2023-002",
    type: "order_book",
    commodityId: "KM002",
    commodityName: "Jagung Manis",
    quantity: 500,
    unit: "kg",
    price: 8000, // Price already set
    totalPrice: 4000000,
    status: "negosiasi",
    buyerId: "BUY-002",
    buyerName: "Restoran Padang Jaya",
    sellerId: "SEL-001",
    sellerName: "Koperasi Tani Makmur",
    createdAt: "2023-12-08T10:45:00Z",
    updatedAt: "2023-12-14T11:30:00Z",
    termsDocUrl: "/placeholder.svg",
    signatureUrl: null,
    shippingStatus: null,
    buyerLocation: "Jakarta Selatan",
    buyerPhone: "+6287654321098",
    notes: "Dari order book untuk kebutuhan restoran. Butuh pengiriman dalam 1 minggu.",
    history: [
      { date: "2023-12-08T10:45:00Z", status: "menunggu_konfirmasi", description: "Pesanan dari Order Book" },
      { date: "2023-12-09T09:20:00Z", status: "dikonfirmasi", description: "Pesanan dikonfirmasi penjual" },
      { date: "2023-12-10T14:20:00Z", status: "negosiasi", description: "Negosiasi harga dimulai" }
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
    status: "sedang_dikirim",
    buyerId: "BUY-003",
    buyerName: "Pabrik Tahu Murni",
    sellerId: "SEL-002",
    sellerName: "PT Agro Nusantara",
    createdAt: "2023-12-01T14:20:00Z",
    updatedAt: "2023-12-12T09:15:00Z",
    termsDocUrl: "/placeholder.svg",
    signatureUrl: "/placeholder.svg",
    shippingStatus: "sedang_dikirim",
    buyerLocation: "Bekasi",
    buyerPhone: "+6282345678901",
    notes: "Kedelai untuk produksi tahu bulan ini.",
    history: [
      { date: "2023-12-01T14:20:00Z", status: "menunggu_konfirmasi", description: "Pesanan dibuat" },
      { date: "2023-12-02T08:45:00Z", status: "dikonfirmasi", description: "Pesanan dikonfirmasi penjual" },
      { date: "2023-12-03T10:30:00Z", status: "negosiasi", description: "Negosiasi harga" },
      { date: "2023-12-05T15:20:00Z", status: "dibayar", description: "Pembayaran diterima" },
      { date: "2023-12-10T08:30:00Z", status: "persiapan_pengiriman", description: "Persiapan pengiriman" },
      { date: "2023-12-12T09:15:00Z", status: "sedang_dikirim", description: "Sedang dalam pengiriman" }
    ]
  }
];

// Define schema for price form
const priceFormSchema = z.object({
  pricePerUnit: z.string().min(1, "Price is required"),
  notes: z.string().optional(),
});

const TransactionManagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  // Price form
  const priceForm = useForm<z.infer<typeof priceFormSchema>>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      pricePerUnit: "",
      notes: "",
    },
  });

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      const found = transactionsData.find(item => item.id === id);
      setTransaction(found || null);
      
      // If price is already set, populate the form
      if (found && found.price) {
        priceForm.setValue("pricePerUnit", found.price.toString());
      }
      
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, priceForm]);

  const onPriceSubmit = (values: z.infer<typeof priceFormSchema>) => {
    if (!transaction) return;
    
    // Convert price to number
    const price = parseFloat(values.pricePerUnit);
    const totalPrice = price * transaction.quantity;
    
    // In a real app, this would be an API call
    // For now, we'll update the local state
    setTransaction(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        price,
        totalPrice,
        status: "negosiasi",
        updatedAt: new Date().toISOString(),
        history: [
          ...prev.history,
          {
            date: new Date().toISOString(),
            status: "negosiasi",
            description: "Harga ditentukan oleh penjual"
          }
        ]
      };
    });
    
    toast({
      title: "Price submitted",
      description: `Price set to ${formatCurrency(price)} per ${transaction.unit}`,
    });
  };

  const handleApproveTerms = () => {
    if (!signature) {
      toast({
        title: "Signature required",
        description: "Please upload your signature first",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call to upload the signature
    // For now, we'll update the local state
    setTransaction(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        status: "dibayar",
        signatureUrl: "/placeholder.svg", // In a real app, this would be the uploaded signature URL
        updatedAt: new Date().toISOString(),
        history: [
          ...prev.history,
          {
            date: new Date().toISOString(),
            status: "dibayar",
            description: "Terms and conditions approved by penjual"
          }
        ]
      };
    });
    
    toast({
      title: "Terms approved",
      description: "Transaction has been approved and is now in progress",
    });
  };

  const handleInitiateShipping = () => {
    // In a real app, this would be an API call
    setTransaction(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        status: "persiapan_pengiriman",
        shippingStatus: "belum_dikirim",
        updatedAt: new Date().toISOString(),
        history: [
          ...prev.history,
          {
            date: new Date().toISOString(),
            status: "persiapan_pengiriman",
            description: "Persiapan pengiriman dimulai"
          }
        ]
      };
    });
    
    toast({
      title: "Shipping initiated",
      description: "The shipping process has been initiated",
    });
  };

  const handleConfirmTransaction = () => {
    // In a real app, this would be an API call
    setTransaction(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        status: "dikonfirmasi",
        updatedAt: new Date().toISOString(),
        history: [
          ...prev.history,
          {
            date: new Date().toISOString(),
            status: "dikonfirmasi",
            description: "Transaksi dikonfirmasi oleh penjual"
          }
        ]
      };
    });
    
    toast({
      title: "Transaction confirmed",
      description: "The transaction has been confirmed",
    });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignature(e.target.files[0]);
      toast({
        title: "Signature uploaded",
        description: "Your signature has been uploaded",
      });
    }
  };

  const handleStartWhatsAppChat = () => {
    if (!transaction) return;
    
    // Format WhatsApp message
    const message = `Halo ${transaction.buyerName}, saya dari ${transaction.sellerName}. Mari bicarakan detail lebih lanjut tentang ${transaction.commodityName} yang Anda pesan. Terima kasih.`;
    
    // Create WhatsApp URL with phone number and message
    const whatsappUrl = `https://wa.me/${transaction.buyerPhone.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
  };

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
          <p className="text-gray-600 mb-6">The requested transaction could not be found.</p>
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
          <h1 className="text-2xl font-bold text-earth-dark-green">{t("transactions.management")}</h1>
          <p className="text-earth-medium-green font-medium">{transaction.id}</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {transaction.status === "menunggu_konfirmasi" && (
            <Button 
              variant="farmer" 
              onClick={handleConfirmTransaction}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Confirm Transaction
            </Button>
          )}
          
          {(transaction.status === "dikonfirmasi" || transaction.status === "negosiasi") && !transaction.price && (
            <Button 
              variant="farmer" 
              onClick={() => setActiveTab("pricing")}
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Set Price
            </Button>
          )}
          
          {transaction.status === "negosiasi" && transaction.price && (
            <Button 
              variant="outline" 
              onClick={handleStartWhatsAppChat}
              className="gap-2 border-earth-medium-green text-earth-dark-green"
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Buyer
            </Button>
          )}
          
          {transaction.status === "dibayar" && (
            <Button 
              variant="farmer" 
              onClick={handleInitiateShipping}
              className="gap-2"
            >
              <Truck className="h-4 w-4" />
              Initiate Shipping
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="gap-2 border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green"
          >
            <FileText className="h-4 w-4" />
            Print Details
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-earth-pale-green/50 border border-earth-light-brown/30">
          <TabsTrigger value="details" className="data-[state=active]:bg-earth-medium-green data-[state=active]:text-white">
            Transaction Details
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-earth-medium-green data-[state=active]:text-white">
            Pricing & Negotiation
          </TabsTrigger>
          <TabsTrigger value="terms" className="data-[state=active]:bg-earth-medium-green data-[state=active]:text-white">
            Terms & Conditions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
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
                      <span>{t("status.negotiating")}</span>
                      <span>{t("status.shipping")}</span>
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
                        {transaction.price ? (
                          <>
                            <p className="text-xl font-bold text-earth-dark-green">
                              {formatCurrency(transaction.totalPrice)}
                            </p>
                            <p className="text-sm text-earth-medium-green">
                              @{formatCurrency(transaction.price)}/{transaction.unit}
                            </p>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-earth-medium-green italic">Price not set yet</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setActiveTab("pricing")}
                              className="gap-1 border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green"
                            >
                              <Pen className="h-3 w-3" />
                              Set Price
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-earth-light-brown/30" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg bg-earth-clay/20">
                        <h3 className="text-sm font-medium text-earth-brown mb-2">Buyer Information</h3>
                        <div className="flex items-start">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-earth-clay/30 flex items-center justify-center mr-3">
                            <User className="h-6 w-6 text-earth-brown" />
                          </div>
                          <div>
                            <p className="font-bold text-earth-dark-green">{transaction.buyerName}</p>
                            <p className="text-sm text-earth-medium-green flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> {transaction.buyerLocation}
                            </p>
                            <p className="text-sm text-earth-medium-green flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" /> {transaction.buyerPhone}
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleStartWhatsAppChat}
                              className="mt-2 gap-1 border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green"
                            >
                              <MessageCircle className="h-3 w-3" />
                              Chat via WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-earth-light-green/20">
                        <h3 className="text-sm font-medium text-earth-medium-green mb-2">Transaction Type</h3>
                        <div>
                          <Badge variant="outline" className="capitalize border-earth-dark-green text-earth-dark-green mb-2">
                            {transaction.type === "order_book" ? "Order Book" : "Regular"}
                          </Badge>
                          <p className="text-sm text-earth-medium-green flex items-center gap-1 mt-2">
                            <Calendar className="h-3 w-3" /> Created: {formatDate(new Date(transaction.createdAt))}
                          </p>
                          <p className="text-sm text-earth-medium-green flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" /> Updated: {formatDate(new Date(transaction.updatedAt))}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-earth-light-brown/30" />

                    <div className="p-4 rounded-lg bg-earth-light-brown/20">
                      <h3 className="text-sm font-medium text-earth-brown mb-2">Notes</h3>
                      <p className="text-earth-dark-green mb-4">{transaction.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="earth-card-brown overflow-hidden">
                <CardHeader className="earth-header-brown pb-3">
                  <CardTitle className="text-white">Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent className="mt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                      <span className="text-earth-brown">Transaction Type</span>
                      <Badge variant="outline" className="capitalize border-earth-brown text-earth-brown">
                        {transaction.type === "order_book" ? "Order Book" : "Regular"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
                      <span className="text-earth-brown">{t("transactions.date")}</span>
                      <span className="text-earth-dark-green">{formatDate(new Date(transaction.createdAt))}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                      <span className="text-earth-brown">Last Updated</span>
                      <span className="text-earth-dark-green">{formatDate(new Date(transaction.updatedAt))}</span>
                    </div>

                    <Separator className="bg-earth-light-brown/30" />

                    <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
                      <span className="text-earth-brown">Commodity</span>
                      <span className="text-earth-dark-green">{transaction.commodityName}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                      <span className="text-earth-brown">Quantity</span>
                      <span className="text-earth-dark-green">{transaction.quantity.toLocaleString()} {transaction.unit}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
                      <span className="text-earth-brown">Unit Price</span>
                      <span className="text-earth-dark-green">{transaction.price ? `${formatCurrency(transaction.price)}/${transaction.unit}` : "Not set"}</span>
                    </div>

                    <Separator className="bg-earth-light-brown/30" />

                    <div className="flex justify-between items-center p-3 rounded bg-earth-wheat/40 font-bold">
                      <span className="text-earth-dark-green">Total Amount</span>
                      <span className="text-earth-dark-green">{transaction.totalPrice ? formatCurrency(transaction.totalPrice) : "Not set"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="earth-card-clay overflow-hidden">
                <CardHeader className="earth-header-clay pb-3">
                  <CardTitle className="text-white">Transaction Timeline</CardTitle>
                </CardHeader>
                <CardContent className="mt-4">
                  <div className="space-y-4">
                    {transaction.history.map((event: any, index: number) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="w-4 h-4 bg-earth-brown rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-earth-clay rounded-full"></div>
                          </div>
                          {index < transaction.history.length - 1 && (
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4">
          <Card className="earth-card-forest overflow-hidden">
            <CardHeader className="earth-header-forest pb-3">
              <CardTitle className="text-white">Pricing & Negotiation</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-earth-pale-green/50">
                  <h3 className="text-md font-medium text-earth-dark-green mb-3">Commodity Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-earth-medium-green">Commodity:</p>
                      <p className="font-bold text-earth-dark-green">{transaction.commodityName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-earth-medium-green">Quantity:</p>
                      <p className="font-bold text-earth-dark-green">{transaction.quantity.toLocaleString()} {transaction.unit}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-earth-light-brown/30" />
                
                <Form {...priceForm}>
                  <form onSubmit={priceForm.handleSubmit(onPriceSubmit)} className="space-y-6">
                    <FormField
                      control={priceForm.control}
                      name="pricePerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-earth-dark-green">Price per {transaction.unit}</FormLabel>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-earth-medium-green">Rp</span>
                            </div>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder={`Enter price per ${transaction.unit}`} 
                                type="number"
                                className="pl-10"
                                disabled={transaction.status === "dibayar" || transaction.status === "persiapan_pengiriman" || transaction.status === "sedang_dikirim" || transaction.status === "selesai"} 
                              />
                            </FormControl>
                          </div>
                          <p className="text-xs text-earth-medium-green mt-1">
                            This is the price you are offering for each {transaction.unit} of {transaction.commodityName}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={priceForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-earth-dark-green">Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Add any additional information about the pricing" 
                              disabled={transaction.status === "dibayar" || transaction.status === "persiapan_pengiriman" || transaction.status === "sedang_dikirim" || transaction.status === "selesai"} 
                            />
                          </FormControl>
                          <p className="text-xs text-earth-medium-green mt-1">
                            Include any details about quality, delivery, or other factors that influence the price
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="farmer"
                        className="gap-2"
                        disabled={transaction.status === "dibayar" || transaction.status === "persiapan_pengiriman" || transaction.status === "sedang_dikirim" || transaction.status === "selesai"}
                      >
                        <DollarSign className="h-4 w-4" />
                        Submit Price
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terms" className="space-y-4">
          <Card className="earth-card-forest overflow-hidden">
            <CardHeader className="earth-header-forest pb-3">
              <CardTitle className="text-white">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-6">
                {transaction.termsDocUrl ? (
                  <div className="border rounded-lg p-4 bg-earth-pale-green/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-earth-dark-green" />
                        <h3 className="font-medium text-earth-dark-green">Terms Document Available</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1 border-earth-medium-green text-earth-dark-green"
                      >
                        <CloudDownload className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    
                    <p className="text-sm text-earth-medium-green mb-2">
                      Please review the terms and conditions document carefully before approving.
                    </p>
                    
                    {transaction.signatureUrl ? (
                      <div className="p-3 rounded bg-earth-light-green/20 mt-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-earth-dark-green" />
                          <p className="font-medium text-earth-dark-green">Terms approved and signed</p>
                        </div>
                        <p className="text-sm text-earth-medium-green mt-1">
                          You have already approved the terms and conditions for this transaction.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 space-y-4 border-t pt-4">
                        <h4 className="font-medium text-earth-dark-green">Upload Signature to Approve</h4>
                        <p className="text-sm text-earth-medium-green">
                          To approve the terms and conditions, please upload your signature below.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                          <div className="p-4 border-2 border-dashed border-earth-light-brown rounded-lg text-center">
                            <input
                              type="file"
                              id="signature-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={handleSignatureUpload}
                            />
                            <label
                              htmlFor="signature-upload"
                              className="flex flex-col items-center justify-center cursor-pointer"
                            >
                              <Upload className="h-8 w-8 text-earth-medium-green mb-2" />
                              <p className="font-medium text-earth-dark-green">Click to upload signature</p>
                              <p className="text-xs text-earth-medium-green mt-1">
                                JPG, PNG or PDF (max. 2MB)
                              </p>
                            </label>
                          </div>
                          
                          {signature && (
                            <div className="p-3 rounded bg-earth-light-green/20 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileCheck className="h-5 w-5 text-earth-dark-green" />
                                <p className="font-medium text-earth-dark-green">{signature.name}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSignature(null)}
                                className="h-8 w-8 p-0 text-earth-medium-green hover:text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          
                          <Button
                            variant="farmer"
                            className="gap-2 w-full sm:w-auto"
                            onClick={handleApproveTerms}
                            disabled={!signature}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve Terms & Conditions
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border rounded-lg p-6 bg-earth-wheat/20 text-center">
                    <div className="flex flex-col items-center gap-2 mb-4">
                      <FileText className="h-12 w-12 text-earth-light-brown" />
                      <h3 className="font-medium text-earth-dark-green">No Terms Document Yet</h3>
                    </div>
                    <p className="text-earth-medium-green max-w-md mx-auto mb-4">
                      The buyer has not yet uploaded a terms and conditions document for this transaction.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleStartWhatsAppChat}
                      className="gap-2 border-earth-medium-green text-earth-dark-green"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Contact Buyer
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default TransactionManagement;
