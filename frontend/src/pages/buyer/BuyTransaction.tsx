
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Package, 
  ShoppingCart, 
  AlertCircle, 
  ArrowLeft, 
  FileText,
  User,
  MapPin,
  Calendar,
  Scale
} from "lucide-react";

// Mock data for commodity marketplace (same as in Market.tsx)
const mockCommodities = [
  {
    id: "1",
    name: "Beras Organik Premium",
    variety: "IR 64",
    farmer: "Pak Joko",
    farmerId: "FARM001",
    location: "Subang, Jawa Barat",
    quantity: 500,
    unit: "kg",
    price: 12000,
    imageUrl: "/placeholder.svg",
    description: "Beras organik premium hasil panen terbaru, bebas pestisida."
  },
  {
    id: "2",
    name: "Beras Merah",
    variety: "Red Rice",
    farmer: "Bu Siti",
    farmerId: "FARM002",
    location: "Cianjur, Jawa Barat",
    quantity: 200,
    unit: "kg",
    price: 15000,
    imageUrl: "/placeholder.svg",
    description: "Beras merah organik kaya nutrisi dan serat."
  },
  {
    id: "3",
    name: "Beras Hitam",
    variety: "Black Rice",
    farmer: "Pak Budi",
    farmerId: "FARM003",
    location: "Klaten, Jawa Tengah",
    quantity: 100,
    unit: "kg",
    price: 18000,
    imageUrl: "/placeholder.svg",
    description: "Beras hitam dengan kandungan antioksidan tinggi."
  },
  {
    id: "4",
    name: "Beras Ketan",
    variety: "White Glutinous",
    farmer: "Bu Maya",
    farmerId: "FARM004",
    location: "Tasikmalaya, Jawa Barat",
    quantity: 150,
    unit: "kg",
    price: 14000,
    imageUrl: "/placeholder.svg",
    description: "Beras ketan putih berkualitas untuk olahan kue tradisional."
  }
];

const BuyTransaction = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState<number>(10);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Find the commodity data
  const commodity = mockCommodities.find(item => item.id === id);
  
  if (!commodity) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">{language === "id" ? "Komoditas tidak ditemukan" : "Commodity not found"}</h2>
          <p className="text-muted-foreground mb-6">{language === "id" ? "Komoditas yang Anda cari tidak tersedia" : "The commodity you're looking for is not available"}</p>
          <Button onClick={() => navigate("/market")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "id" ? "Kembali ke Pasar" : "Back to Market"}
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Generate a random transaction ID
      const transactionId = `TRX-${Date.now().toString().slice(-8)}`;
      
      toast({
        title: language === "id" ? "Permintaan Terkirim!" : "Request Sent!",
        description: language === "id" 
          ? `Permintaan pembelian telah dikirim ke ${commodity.farmer}. Silakan tunggu konfirmasi.` 
          : `Purchase request has been sent to ${commodity.farmer}. Please wait for confirmation.`,
        variant: "default",
      });
      
      // Redirect to pending transactions page
      navigate(`/transaksi-pending`);
      setLoading(false);
    }, 1500);
  };
  
  const totalPrice = commodity.price * quantity;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/market/${id}`)}
            className="border-earth-light-brown/30"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === "id" ? "Kembali ke Detail" : "Back to Details"}
          </Button>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main transaction card */}
          <div className="md:col-span-2">
            <Card className="border-earth-light-brown/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-earth-medium-green to-earth-pale-green">
                <CardTitle className="text-white">{language === "id" ? "Pesan Komoditas" : "Order Commodity"}</CardTitle>
                <CardDescription className="text-white/80">
                  {language === "id" 
                    ? "Lengkapi informasi pembelian di bawah ini" 
                    : "Complete the purchase information below"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Commodity information */}
                <div className="flex items-center gap-4 p-4 bg-earth-pale-green/30 rounded-lg">
                  <div className="h-16 w-16 bg-earth-pale-green/50 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-earth-dark-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-earth-dark-green">{commodity.name}</h3>
                    <p className="text-earth-medium-green">{commodity.variety}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-[#F2FCE2]/50 flex items-start gap-3">
                    <User className="h-5 w-5 text-earth-medium-green mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">{language === "id" ? "Petani" : "Farmer"}</p>
                      <p className="font-medium">{commodity.farmer}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F2FCE2]/50 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-earth-medium-green mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">{language === "id" ? "Lokasi" : "Location"}</p>
                      <p className="font-medium">{commodity.location}</p>
                    </div>
                  </div>
                </div>
              
                <Separator className="bg-earth-light-brown/20" />
                
                <div className="space-y-4">
                  <h3 className="font-medium text-earth-dark-green">
                    {language === "id" ? "Detail Pesanan" : "Order Details"}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-[#FEF7CD]/50 flex items-start gap-3">
                      <Scale className="h-5 w-5 text-earth-brown mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">{language === "id" ? "Jumlah" : "Quantity"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 w-7 p-0 border-earth-light-brown/30"
                            onClick={() => setQuantity(Math.max(1, quantity - 5))}
                          >-</Button>
                          <input
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-16 text-center border border-earth-light-brown/30 rounded-md h-8"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 w-7 p-0 border-earth-light-brown/30"
                            onClick={() => setQuantity(quantity + 5)}
                          >+</Button>
                          <span className="text-earth-medium-green ml-1">{commodity.unit}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-[#FEF7CD]/50 flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-earth-brown mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === "id" ? "Tanggal Pengiriman" : "Delivery Date"}
                        </p>
                        <p className="font-medium">{language === "id" ? "Akan ditentukan" : "To be determined"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-earth-dark-green">
                      {language === "id" ? "Catatan Tambahan" : "Additional Notes"}
                    </label>
                    <Textarea
                      placeholder={language === "id" 
                        ? "Tulis pesan atau permintaan khusus di sini..." 
                        : "Write any message or special requests here..."}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="resize-none border-earth-light-brown/30"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-earth-pale-green/20 p-6 flex flex-col sm:flex-row gap-3 justify-between">
                <div>
                  <p className="text-sm text-earth-medium-green">
                    {language === "id" ? "Estimasi harga awal:" : "Initial price estimate:"}
                  </p>
                  <p className="text-earth-dark-green font-bold text-lg">
                    Rp {totalPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "id" 
                      ? "Harga final akan ditentukan setelah negosiasi" 
                      : "Final price will be determined after negotiation"}
                  </p>
                </div>
                <Button
                  className="min-w-32 bg-earth-medium-green hover:bg-earth-dark-green"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      {language === "id" ? "Memproses..." : "Processing..."}
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {language === "id" ? "Kirim Permintaan" : "Send Request"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Side information card */}
          <div className="space-y-5">
            <Card className="border-earth-light-brown/30">
              <CardHeader className="bg-[#FDE1D3]">
                <CardTitle className="text-earth-brown text-lg">
                  {language === "id" ? "Informasi Pembelian" : "Purchase Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="bg-[#FDE1D3]/20 p-4 rounded-lg">
                  <h4 className="font-medium text-earth-brown mb-2">
                    {language === "id" ? "Alur Transaksi" : "Transaction Flow"}
                  </h4>
                  <ol className="space-y-2 pl-5 list-decimal text-sm">
                    <li className="text-earth-brown">
                      {language === "id" 
                        ? "Kirim permintaan pembelian ke petani" 
                        : "Send purchase request to farmer"}
                    </li>
                    <li className="text-earth-brown">
                      {language === "id" 
                        ? "Tunggu konfirmasi dari petani" 
                        : "Wait for confirmation from farmer"}
                    </li>
                    <li className="text-earth-brown">
                      {language === "id" 
                        ? "Negosiasi harga melalui WhatsApp" 
                        : "Negotiate price via WhatsApp"}
                    </li>
                    <li className="text-earth-brown">
                      {language === "id" 
                        ? "Setujui syarat dan ketentuan" 
                        : "Agree to terms and conditions"}
                    </li>
                    <li className="text-earth-brown">
                      {language === "id" 
                        ? "Tunggu pengiriman dari petani" 
                        : "Wait for delivery from farmer"}
                    </li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <Badge className="bg-[#F2FCE2] text-earth-dark-green border border-earth-medium-green/50 px-3 py-1">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    {language === "id" ? "Nego Harga" : "Price Negotiation"}
                  </Badge>
                  <p className="text-sm text-earth-medium-green">
                    {language === "id" 
                      ? "Harga final akan ditentukan setelah negosiasi dengan petani melalui WhatsApp." 
                      : "The final price will be determined after negotiation with the farmer via WhatsApp."}
                  </p>
                </div>
                
                <Separator className="bg-earth-light-brown/20" />
                
                <div className="space-y-2">
                  <Badge className="bg-[#FEF7CD] text-earth-brown border border-earth-clay/50 px-3 py-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {language === "id" ? "Penting" : "Important"}
                  </Badge>
                  <p className="text-sm text-earth-brown">
                    {language === "id" 
                      ? "Pastikan jumlah pesanan sesuai dengan kebutuhan Anda. Minimal pembelian adalah 5 kg." 
                      : "Make sure the order quantity matches your needs. Minimum purchase is 5 kg."}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-earth-light-brown/30">
              <CardHeader className="bg-earth-pale-green">
                <CardTitle className="text-earth-dark-green text-lg">
                  {language === "id" ? "Detail Komoditas" : "Commodity Details"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{language === "id" ? "Nama" : "Name"}</span>
                    <span className="text-earth-dark-green font-medium">{commodity.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{language === "id" ? "Varietas" : "Variety"}</span>
                    <span className="text-earth-dark-green">{commodity.variety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{language === "id" ? "Harga" : "Price"}</span>
                    <span className="text-earth-dark-green">Rp {commodity.price.toLocaleString()}/{commodity.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{language === "id" ? "Stok" : "Stock"}</span>
                    <span className="text-earth-dark-green">{commodity.quantity} {commodity.unit}</span>
                  </div>
                  
                  <Separator className="bg-earth-light-brown/20" />
                  
                  <p className="text-xs text-muted-foreground">
                    {language === "id"
                      ? "* Harga dapat berubah tergantung hasil negosiasi"
                      : "* Price may change depending on negotiation result"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BuyTransaction;
