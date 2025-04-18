
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle, 
  Package, 
  Plus, 
  Info, 
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { CommodityType, CommodityGrade } from "@/lib/data/types";

// Mock commodity data that farmer can offer (in a real app this would come from an API)
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

interface OrderBookAcceptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderBook: any;
  onAcceptOrderBook: () => void;
}

const OrderBookAcceptDialog = ({ 
  isOpen, 
  onOpenChange, 
  orderBook, 
  onAcceptOrderBook 
}: OrderBookAcceptDialogProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);
  const [matchingCommodities, setMatchingCommodities] = useState<any[]>([]);
  const [filteredCommodities, setFilteredCommodities] = useState<any[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [step, setStep] = useState<'select-commodity' | 'confirm'>('select-commodity');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (isOpen && orderBook) {
      // Find matching commodities if order book is loaded
      const matching = farmerCommodities.filter(
        commodity => 
          commodity.type === orderBook.commodityType && 
          commodity.quantity >= orderBook.quantity &&
          commodity.available
      );
      setMatchingCommodities(matching);
      setFilteredCommodities(matching);
      
      // Reset search and filters when dialog opens
      setSearchQuery("");
      setSelectedGrade("all");
      setSelectedLocation("all");
    } else {
      // Reset dialog state when closing
      setSelectedCommodity(null);
      setTermsAccepted(false);
      setStep('select-commodity');
      setIsFilterOpen(false);
    }
  }, [isOpen, orderBook]);

  // Apply filters and search
  useEffect(() => {
    if (matchingCommodities.length === 0) return;
    
    let filtered = [...matchingCommodities];
    
    // Apply search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        commodity => 
          commodity.name.toLowerCase().includes(query) || 
          commodity.id.toLowerCase().includes(query) ||
          commodity.location.toLowerCase().includes(query)
      );
    }
    
    // Apply grade filter
    if (selectedGrade !== "all") {
      filtered = filtered.filter(commodity => commodity.grade === selectedGrade);
    }
    
    // Apply location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(commodity => 
        commodity.location.includes(selectedLocation)
      );
    }
    
    setFilteredCommodities(filtered);
  }, [searchQuery, selectedGrade, selectedLocation, matchingCommodities]);

  // Get unique locations for filter
  const uniqueLocations = Array.from(
    new Set(matchingCommodities.map(commodity => commodity.location.split(",")[0].trim()))
  );

  // Get unique grades for filter
  const uniqueGrades = Array.from(
    new Set(matchingCommodities.map(commodity => commodity.grade))
  );

  const handleSelectCommodity = (commodityId: string) => {
    setSelectedCommodity(commodityId);
  };

  const handleAddNewCommodity = () => {
    // Close dialog and navigate to add commodity page
    onOpenChange(false);
    navigate('/komoditas/add');
  };

  const handleNext = () => {
    if (!selectedCommodity) {
      toast({
        title: language === "id" ? "Pilih komoditas" : "Select a commodity",
        description: language === "id" 
          ? "Silakan pilih komoditas yang sesuai dengan order book" 
          : "Please select a commodity that matches the order book",
        variant: "destructive"
      });
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!termsAccepted) {
      toast({
        title: language === "id" ? "Terima syarat dan ketentuan" : "Accept terms and conditions",
        description: language === "id" 
          ? "Anda harus menerima syarat dan ketentuan untuk melanjutkan" 
          : "You must accept the terms and conditions to proceed",
        variant: "destructive"
      });
      return;
    }

    // Process the order book acceptance
    toast({
      title: language === "id" ? "Order Book Diterima" : "Order Book Accepted",
      description: language === "id" 
        ? "Permintaan Anda telah dikirim ke pembeli untuk persetujuan" 
        : "Your request has been sent to the buyer for approval",
    });
    
    onAcceptOrderBook();
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('select-commodity');
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-earth-dark-green text-xl">
            {step === 'select-commodity' 
              ? (language === "id" ? "Pilih Komoditas" : "Select Commodity") 
              : (language === "id" ? "Konfirmasi Order Book" : "Confirm Order Book")}
          </DialogTitle>
          <DialogDescription>
            {step === 'select-commodity'
              ? (language === "id" 
                ? "Pilih komoditas yang sesuai dengan permintaan pembeli" 
                : "Select a commodity that matches the buyer's request")
              : (language === "id" 
                ? "Tinjau dan konfirmasi detail pesanan" 
                : "Review and confirm order details")}
          </DialogDescription>
        </DialogHeader>

        {step === 'select-commodity' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              <div className="bg-earth-pale-green/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-earth-medium-green mb-2">
                  {language === "id" ? "Permintaan Komoditas" : "Commodity Request"}
                </h3>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-earth-medium-green/20 flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-earth-medium-green" />
                  </div>
                  <div>
                    <p className="font-bold text-earth-dark-green">{orderBook?.commodityType}</p>
                    <p className="text-sm text-earth-medium-green">
                      {orderBook?.quantity.toLocaleString()} {orderBook?.unit}
                    </p>
                    <p className="text-sm text-earth-medium-green">
                      {language === "id" ? "Grade: " : "Grade: "}{orderBook?.requestedGrade}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-earth-wheat/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-earth-brown mb-2">
                  {language === "id" ? "Info Pengiriman" : "Delivery Info"}
                </h3>
                <p className="font-medium text-earth-dark-green">
                  {language === "id" ? "Tanggal Pengiriman: " : "Delivery Date: "}
                  {orderBook?.requestedDeliveryDate && new Date(orderBook.requestedDeliveryDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-earth-medium-green mt-1">
                  {language === "id" ? "Buyer: " : "Buyer: "}{orderBook?.buyerName}
                </p>
                <p className="text-sm text-earth-medium-green">
                  {language === "id" ? "Lokasi: " : "Location: "}{orderBook?.buyerLocation}
                </p>
              </div>
            </div>

            <div className="my-4">
              <h3 className="text-md font-medium text-earth-dark-green mb-3">
                {language === "id" ? "Komoditas Anda yang Tersedia" : "Your Available Commodities"}
              </h3>
              
              {matchingCommodities.length > 0 ? (
                <div className="space-y-4">
                  {/* Search and Filter UI */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earth-medium-green" />
                      <Input
                        placeholder={language === "id" ? "Cari komoditas..." : "Search commodities..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 border-earth-light-green focus-visible:ring-earth-medium-green"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={toggleFilter}
                      className={`gap-2 ${isFilterOpen ? 'bg-earth-pale-green border-earth-medium-green text-earth-dark-green' : 'border-earth-light-green text-earth-medium-green'}`}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      {language === "id" ? "Filter" : "Filter"}
                    </Button>
                  </div>

                  {/* Filter Section */}
                  {isFilterOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-earth-pale-green/20 rounded-lg border border-earth-light-green/30 mb-2">
                      <div>
                        <p className="text-sm font-medium text-earth-medium-green mb-1">
                          {language === "id" ? "Filter Grade" : "Filter by Grade"}
                        </p>
                        <Select
                          value={selectedGrade}
                          onValueChange={setSelectedGrade}
                        >
                          <SelectTrigger className="w-full border-earth-light-green focus:ring-earth-medium-green">
                            <SelectValue placeholder={language === "id" ? "Semua Grade" : "All Grades"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{language === "id" ? "Semua Grade" : "All Grades"}</SelectItem>
                            {uniqueGrades.map((grade) => (
                              <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-earth-medium-green mb-1">
                          {language === "id" ? "Filter Lokasi" : "Filter by Location"}
                        </p>
                        <Select
                          value={selectedLocation}
                          onValueChange={setSelectedLocation}
                        >
                          <SelectTrigger className="w-full border-earth-light-green focus:ring-earth-medium-green">
                            <SelectValue placeholder={language === "id" ? "Semua Lokasi" : "All Locations"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{language === "id" ? "Semua Lokasi" : "All Locations"}</SelectItem>
                            {uniqueLocations.map((location) => (
                              <SelectItem key={location} value={location}>{location}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Commodities List */}
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {filteredCommodities.length > 0 ? (
                      filteredCommodities.map((commodity) => (
                        <div 
                          key={commodity.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedCommodity === commodity.id 
                              ? 'border-earth-medium-green bg-earth-pale-green' 
                              : 'border-gray-200 hover:bg-earth-pale-green/30'
                          }`}
                          onClick={() => handleSelectCommodity(commodity.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                selectedCommodity === commodity.id 
                                  ? 'bg-earth-medium-green border-earth-dark-green' 
                                  : 'border-earth-medium-green'
                              }`}>
                                {selectedCommodity === commodity.id && (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-earth-dark-green">{commodity.name}</p>
                                <div className="flex text-sm text-earth-medium-green">
                                  <p className="mr-4">{commodity.type} - Grade {commodity.grade}</p>
                                  <p>{commodity.quantity.toLocaleString()} {commodity.unit}</p>
                                </div>
                                <p className="text-xs text-earth-medium-green/80">{commodity.location}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 bg-earth-pale-green/20 border border-earth-light-green/30 rounded-lg text-center">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                        <p className="font-medium text-earth-dark-green mb-1">
                          {language === "id" 
                            ? "Tidak ditemukan hasil yang sesuai" 
                            : "No matching results found"}
                        </p>
                        <p className="text-sm text-earth-medium-green">
                          {language === "id" 
                            ? "Coba ubah pencarian atau filter Anda" 
                            : "Try changing your search or filters"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-amber-500" />
                  <p className="font-medium text-earth-dark-green mb-2">
                    {language === "id" 
                      ? "Tidak ada komoditas yang sesuai" 
                      : "No matching commodities found"}
                  </p>
                  <p className="text-sm text-earth-medium-green mb-4">
                    {language === "id" 
                      ? "Anda belum memiliki komoditas yang sesuai dengan permintaan." 
                      : "You don't have any commodities that match the requirements."}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleAddNewCommodity}
                    className="gap-2 border-earth-medium-green text-earth-dark-green"
                  >
                    <Plus className="h-4 w-4" />
                    {language === "id" ? "Tambah Komoditas Baru" : "Add New Commodity"}
                  </Button>
                </div>
              )}
              
              {filteredCommodities.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={handleAddNewCommodity}
                    className="gap-2 border-earth-medium-green text-earth-dark-green"
                  >
                    <Plus className="h-4 w-4" />
                    {language === "id" ? "Tambah Komoditas Baru" : "Add New Commodity"}
                  </Button>
                  
                  <Button 
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-earth-dark-green to-earth-medium-green hover:from-earth-medium-green hover:to-earth-dark-green"
                    disabled={!selectedCommodity}
                  >
                    {language === "id" ? "Lanjutkan" : "Continue"}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {step === 'confirm' && (
          <>
            <div className="space-y-4">
              <div className="bg-earth-wheat/20 p-4 rounded-lg">
                <h3 className="text-md font-medium text-earth-dark-green mb-2">
                  {language === "id" ? "Ringkasan Pesanan" : "Order Summary"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-earth-medium-green">
                      {language === "id" ? "ID Pesanan:" : "Order ID:"}
                    </p>
                    <p className="font-medium text-earth-dark-green">{orderBook?.id}</p>
                    
                    <p className="text-sm text-earth-medium-green mt-2">
                      {language === "id" ? "Pembeli:" : "Buyer:"}
                    </p>
                    <p className="font-medium text-earth-dark-green">{orderBook?.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">
                      {language === "id" ? "Komoditas:" : "Commodity:"}
                    </p>
                    <p className="font-medium text-earth-dark-green">
                      {orderBook?.commodityType} - {orderBook?.quantity.toLocaleString()} {orderBook?.unit}
                    </p>
                    
                    <p className="text-sm text-earth-medium-green mt-2">
                      {language === "id" ? "Pengiriman:" : "Delivery:"}
                    </p>
                    <p className="font-medium text-earth-dark-green">
                      {orderBook?.requestedDeliveryDate && new Date(orderBook.requestedDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <div className="bg-earth-pale-green/30 p-4 rounded-lg">
                <h3 className="text-md font-medium text-earth-dark-green mb-2 flex items-center">
                  <FileCheck className="mr-2 h-5 w-5 text-earth-medium-green" />
                  {language === "id" ? "Syarat & Ketentuan" : "Terms & Conditions"}
                </h3>
                <div className="max-h-40 overflow-y-auto p-3 bg-white rounded-md border border-earth-light-green/30 mb-4">
                  <p className="text-earth-dark-green whitespace-pre-line">
                    {orderBook?.termsConditions || (language === "id" 
                      ? "Kualitas premium, kadar air maksimal 14%, bebas hama dan penyakit. Pengiriman dilakukan sesuai jadwal yang telah disepakati. Pembayaran akan dilakukan dalam 7 hari kerja setelah barang diterima."
                      : "Premium quality, maximum water content 14%, free from pests and diseases. Delivery will be made according to the agreed schedule. Payment will be made within 7 working days after the goods are received."
                    )}
                  </p>
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="accept-terms"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="accept-terms" className="text-earth-dark-green text-sm">
                    {language === "id" 
                      ? "Saya menyetujui syarat dan ketentuan yang berlaku untuk order book ini dan berkomitmen untuk memenuhi pesanan dengan komoditas yang dipilih."
                      : "I agree to the terms and conditions applicable to this order book and commit to fulfilling the order with the selected commodity."}
                  </label>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                <div className="flex">
                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    {language === "id" 
                      ? "Setelah Anda mengkonfirmasi, permintaan Anda akan dikirim ke pembeli untuk disetujui. Setelah disetujui, transaksi akan dibuat secara otomatis."
                      : "After you confirm, your request will be sent to the buyer for approval. Once approved, a transaction will be automatically created."}
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="gap-2 border-gray-300"
              >
                {language === "id" ? "Kembali" : "Back"}
              </Button>
              
              <Button 
                onClick={handleConfirm}
                className="gap-2 bg-gradient-to-r from-earth-dark-green to-earth-medium-green hover:from-earth-medium-green hover:to-earth-dark-green"
                disabled={!termsAccepted}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {language === "id" ? "Konfirmasi & Kirim" : "Confirm & Submit"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderBookAcceptDialog;
