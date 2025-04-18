
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  Package,
  Calendar,
  User, 
  Check,
  X,
  FileCheck,
  Info,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CommodityType, CommodityGrade } from "@/lib/data/types";

// Mock order book data
const orderBookData = [
  {
    id: "OB-2023-001",
    buyerId: "BUY-001",
    buyerName: "PT Agrimax Food",
    commodityType: "Padi" as CommodityType,
    quantity: 1000,
    unit: "kg",
    requestedGrade: "A" as CommodityGrade,
    requestedDeliveryDate: "2024-01-15T00:00:00Z",
    offerExpiryDate: "2023-12-25T00:00:00Z",
    status: "open",
    termsConditions: "Membutuhkan beras kualitas premium untuk restoran kami. Pengiriman harus tepat waktu dan kualitas harus konsisten.",
    createdAt: "2023-12-10T08:30:00Z",
    buyerLocation: "Jakarta Timur",
    buyerPhone: "+6281234567890"
  },
  {
    id: "OB-2023-002",
    buyerId: "BUY-002",
    buyerName: "Restoran Padang Jaya",
    commodityType: "Jagung" as CommodityType,
    quantity: 500,
    unit: "kg",
    requestedGrade: "A" as CommodityGrade,
    requestedDeliveryDate: "2024-01-20T00:00:00Z",
    offerExpiryDate: "2023-12-30T00:00:00Z",
    status: "open",
    termsConditions: "Jagung manis segar untuk kebutuhan restoran. Kualitas harus baik dan pengiriman dapat dilakukan secara bertahap.",
    createdAt: "2023-12-08T10:45:00Z",
    buyerLocation: "Jakarta Selatan",
    buyerPhone: "+6287654321098"
  }
];

// Mock commodity data that farmer can offer
const farmerCommodities = [
  {
    id: "KM001",
    name: "Beras Putih Premium",
    type: "Padi" as CommodityType,
    quantity: 2000,
    unit: "kg",
    grade: "A" as CommodityGrade,
    location: "Subang, Jawa Barat",
    imageUrl: "/placeholder.svg",
    available: true
  },
  {
    id: "KM005",
    name: "Beras Merah Organik",
    type: "Padi" as CommodityType,
    quantity: 500,
    unit: "kg",
    grade: "A" as CommodityGrade,
    location: "Subang, Jawa Barat",
    imageUrl: "/placeholder.svg",
    available: true
  },
  {
    id: "KM002",
    name: "Jagung Manis",
    type: "Jagung" as CommodityType,
    quantity: 1500,
    unit: "kg",
    grade: "B" as CommodityGrade,
    location: "Malang, Jawa Timur",
    imageUrl: "/placeholder.svg",
    available: true
  }
];

const OrderBookApproval = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [orderBook, setOrderBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);
  const [matchingCommodities, setMatchingCommodities] = useState<any[]>([]);
  const [step, setStep] = useState<'review' | 'select-commodity' | 'confirm'>('review');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      const found = orderBookData.find(item => item.id === id);
      setOrderBook(found || null);
      
      // Find matching commodities if order book is found
      if (found) {
        const matching = farmerCommodities.filter(
          commodity => 
            commodity.type === found.commodityType && 
            commodity.quantity >= found.quantity &&
            commodity.available
        );
        setMatchingCommodities(matching);
      }
      
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleCommoditySelection = (commodityId: string) => {
    setSelectedCommodity(commodityId);
  };

  const handleAcceptOrderBook = () => {
    setStep('select-commodity');
  };

  const handleRejectOrderBook = () => {
    toast({
      title: "Order book rejected",
      description: "The order book has been rejected",
      variant: "destructive",
    });
    navigate('/order-book');
  };

  const handleProceedToConfirmation = () => {
    if (!selectedCommodity) {
      toast({
        title: "Select a commodity",
        description: "Please select a commodity to proceed",
        variant: "destructive",
      });
      return;
    }
    
    setStep('confirm');
  };

  const handleConfirmOffer = () => {
    if (!termsAccepted) {
      toast({
        title: "Accept terms required",
        description: "Please accept the terms and conditions to proceed",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call
    toast({
      title: "Offer confirmed",
      description: "Your offer has been submitted to the buyer for approval",
    });
    
    // Redirect to transactions
    navigate('/transaksi');
  };

  const handleGoBack = () => {
    if (step === 'select-commodity') {
      setStep('review');
    } else if (step === 'confirm') {
      setStep('select-commodity');
    } else {
      navigate('/order-book');
    }
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

  if (!orderBook) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">{t("orderbook.notfound")}</h2>
          <p className="text-gray-600 mb-6">The requested order book could not be found.</p>
          <Button onClick={() => navigate('/order-book')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("action.back")}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 'review' ? t("action.back") : "Previous Step"}
          </Button>
          <h1 className="text-2xl font-bold text-earth-dark-green">
            {step === 'review' ? 'Order Book Review' : 
             step === 'select-commodity' ? 'Select Commodity' : 
             'Confirm Offer'}
          </h1>
          <p className="text-earth-medium-green font-medium">{orderBook.id}</p>
        </div>
        {step === 'review' && (
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              className="border-red-400 text-red-600 hover:bg-red-50"
              onClick={handleRejectOrderBook}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="farmer"
              onClick={handleAcceptOrderBook}
            >
              <Check className="mr-2 h-4 w-4" />
              Accept Order Book
            </Button>
          </div>
        )}
      </div>

      {step === 'review' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="earth-card-forest overflow-hidden">
              <CardHeader className="earth-header-forest pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Order Book Details</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">
                    {orderBook.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-earth-pale-green/50">
                      <h3 className="text-sm font-medium text-earth-medium-green mb-1">Commodity Requested</h3>
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-earth-medium-green/20 flex items-center justify-center mr-3">
                          <Package className="h-6 w-6 text-earth-medium-green" />
                        </div>
                        <div>
                          <p className="font-bold text-earth-dark-green">{orderBook.commodityType}</p>
                          <p className="text-sm text-earth-medium-green">{orderBook.quantity.toLocaleString()} {orderBook.unit}</p>
                          <p className="text-sm text-earth-medium-green">Grade: {orderBook.requestedGrade}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-earth-wheat/30">
                      <h3 className="text-sm font-medium text-earth-brown mb-1">Delivery Information</h3>
                      <p className="flex items-center gap-2 text-earth-dark-green font-medium">
                        <Calendar className="h-4 w-4 text-earth-medium-green" />
                        Requested by: {formatDate(new Date(orderBook.requestedDeliveryDate))}
                      </p>
                      <p className="flex items-center gap-2 text-earth-medium-green mt-2">
                        <Clock className="h-4 w-4" />
                        Offer expires: {formatDate(new Date(orderBook.offerExpiryDate))}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-earth-light-brown/30" />

                  <div className="p-4 rounded-lg bg-earth-clay/20">
                    <h3 className="text-sm font-medium text-earth-brown mb-2">Buyer Information</h3>
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-earth-clay/30 flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-earth-brown" />
                      </div>
                      <div>
                        <p className="font-bold text-earth-dark-green">{orderBook.buyerName}</p>
                        <p className="text-sm text-earth-medium-green">{orderBook.buyerId}</p>
                        <p className="text-sm text-earth-medium-green mt-1">{orderBook.buyerLocation}</p>
                        <p className="text-sm text-earth-medium-green">{orderBook.buyerPhone}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-earth-light-brown/30" />

                  <div className="p-4 rounded-lg bg-earth-light-brown/20">
                    <h3 className="text-sm font-medium text-earth-brown mb-2">Terms & Conditions</h3>
                    <p className="text-earth-dark-green whitespace-pre-line">{orderBook.termsConditions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="earth-card-brown overflow-hidden">
              <CardHeader className="earth-header-brown pb-3">
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                    <span className="text-earth-brown">Order ID</span>
                    <span className="text-earth-dark-green font-mono">{orderBook.id}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
                    <span className="text-earth-brown">Created On</span>
                    <span className="text-earth-dark-green">{formatDate(new Date(orderBook.createdAt))}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                    <span className="text-earth-brown">Commodity</span>
                    <span className="text-earth-dark-green">{orderBook.commodityType}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
                    <span className="text-earth-brown">Quantity</span>
                    <span className="text-earth-dark-green">{orderBook.quantity.toLocaleString()} {orderBook.unit}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
                    <span className="text-earth-brown">Grade</span>
                    <span className="text-earth-dark-green">{orderBook.requestedGrade}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Alert className="bg-earth-pale-green border-earth-medium-green">
                <Info className="h-4 w-4 text-earth-dark-green" />
                <AlertTitle className="text-earth-dark-green">Information</AlertTitle>
                <AlertDescription className="text-earth-medium-green">
                  If you accept this order book, you'll need to select a suitable commodity from your inventory to fulfill the request.
                </AlertDescription>
              </Alert>
            </div>

            <div className="mt-4">
              <Alert className="bg-amber-50 border-amber-200">
                <Clock className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Offer Expiry</AlertTitle>
                <AlertDescription className="text-amber-600">
                  This order book will expire on {formatDate(new Date(orderBook.offerExpiryDate))}. Make sure to respond before then.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      )}

      {step === 'select-commodity' && (
        <div className="space-y-6">
          <Card className="earth-card-forest overflow-hidden">
            <CardHeader className="earth-header-forest pb-3">
              <CardTitle className="text-white">Select Commodity from Your Inventory</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              {matchingCommodities.length > 0 ? (
                <>
                  <p className="text-earth-medium-green mb-4">
                    Select a commodity from your inventory that matches the order book requirements.
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Commodity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchingCommodities.map((commodity) => (
                        <TableRow 
                          key={commodity.id}
                          className={selectedCommodity === commodity.id ? "bg-earth-pale-green" : ""}
                          onClick={() => handleCommoditySelection(commodity.id)}
                        >
                          <TableCell>
                            <div className="flex justify-center">
                              <div className={`w-5 h-5 rounded-full border ${selectedCommodity === commodity.id ? 'bg-earth-medium-green border-earth-dark-green' : 'border-earth-medium-green'} flex items-center justify-center`}>
                                {selectedCommodity === commodity.id && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{commodity.name}</TableCell>
                          <TableCell>{commodity.type}</TableCell>
                          <TableCell>{commodity.grade}</TableCell>
                          <TableCell>{commodity.quantity.toLocaleString()} {commodity.unit}</TableCell>
                          <TableCell>{commodity.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <div className="text-center py-8 bg-earth-pale-green/30 rounded-lg">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 text-amber-500" />
                  <p className="mb-4 text-earth-medium-green font-medium">No matching commodities found</p>
                  <p className="text-sm text-earth-medium-green mb-4">
                    You don't have any commodities in your inventory that match the requirements of this order book.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/komoditas')}
                    className="gap-2 border-earth-medium-green text-earth-dark-green"
                  >
                    <Package className="h-4 w-4" />
                    Add New Commodity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="gap-2 border-earth-light-brown text-earth-dark-green"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Review
            </Button>
            
            <Button 
              variant="farmer" 
              onClick={handleProceedToConfirmation}
              disabled={!selectedCommodity}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="space-y-6">
          <Card className="earth-card-forest overflow-hidden">
            <CardHeader className="earth-header-forest pb-3">
              <CardTitle className="text-white">Confirm Order Book Fulfillment</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="space-y-6">
                <Alert className="bg-earth-pale-green border-earth-medium-green">
                  <CheckCircle2 className="h-4 w-4 text-earth-dark-green" />
                  <AlertTitle className="text-earth-dark-green">Ready to Submit</AlertTitle>
                  <AlertDescription className="text-earth-medium-green">
                    You're about to commit to fulfilling this order book. Please review the details before confirming.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-earth-clay/20">
                    <h3 className="text-md font-medium text-earth-dark-green mb-3">Order Book Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-earth-medium-green">Buyer:</span>
                        <span className="text-earth-dark-green font-medium">{orderBook.buyerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-earth-medium-green">Commodity:</span>
                        <span className="text-earth-dark-green font-medium">{orderBook.commodityType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-earth-medium-green">Quantity:</span>
                        <span className="text-earth-dark-green font-medium">{orderBook.quantity.toLocaleString()} {orderBook.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-earth-medium-green">Grade:</span>
                        <span className="text-earth-dark-green font-medium">{orderBook.requestedGrade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-earth-medium-green">Delivery by:</span>
                        <span className="text-earth-dark-green font-medium">{formatDate(new Date(orderBook.requestedDeliveryDate))}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-earth-pale-green/50">
                    <h3 className="text-md font-medium text-earth-dark-green mb-3">Selected Commodity</h3>
                    <div className="space-y-2">
                      {selectedCommodity && (
                        <>
                          {farmerCommodities
                            .filter(c => c.id === selectedCommodity)
                            .map(commodity => (
                              <div key={commodity.id} className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-earth-medium-green">Name:</span>
                                  <span className="text-earth-dark-green font-medium">{commodity.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-earth-medium-green">Type:</span>
                                  <span className="text-earth-dark-green font-medium">{commodity.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-earth-medium-green">Available:</span>
                                  <span className="text-earth-dark-green font-medium">{commodity.quantity.toLocaleString()} {commodity.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-earth-medium-green">Grade:</span>
                                  <span className="text-earth-dark-green font-medium">{commodity.grade}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-earth-medium-green">Location:</span>
                                  <span className="text-earth-dark-green font-medium">{commodity.location}</span>
                                </div>
                              </div>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-earth-light-brown/30" />
                
                <div className="p-4 rounded-lg bg-earth-light-brown/20">
                  <h3 className="text-md font-medium text-earth-dark-green mb-3">Terms & Conditions Agreement</h3>
                  <div className="space-y-4">
                    <div className="p-3 border border-earth-light-brown/50 rounded-md bg-white">
                      <p className="text-earth-dark-green whitespace-pre-line">{orderBook.termsConditions}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms-agreement"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        className="rounded border-earth-medium-green text-earth-dark-green h-4 w-4 mr-2"
                      />
                      <label htmlFor="terms-agreement" className="text-earth-dark-green">
                        I agree to the terms and conditions of this order book
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="gap-2 border-earth-light-brown text-earth-dark-green"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Selection
            </Button>
            
            <Button 
              variant="farmer" 
              onClick={handleConfirmOffer}
              disabled={!termsAccepted}
              className="gap-2"
            >
              <FileCheck className="h-4 w-4" />
              Confirm & Submit Offer
            </Button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default OrderBookApproval;
