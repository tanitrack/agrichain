
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Wheat, 
  ShoppingCart, 
  MapPin, 
  User, 
  Calendar, 
  Package, 
  BadgeCheck, 
  ArrowLeft, 
  Share2, 
  Heart, 
  CircleDollarSign
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for commodity details
const mockCommodities = [
  {
    id: "1",
    name: "Beras Organik Premium",
    variety: "IR 64",
    farmer: "Pak Joko",
    location: "Subang, Jawa Barat",
    farmerInfo: {
      name: "Pak Joko Sulistyo",
      since: "2018",
      rating: 4.8,
      transactions: 42,
      phone: "+6281234567890"
    },
    quantity: 500,
    unit: "kg",
    price: 12000,
    minOrder: 10,
    harvestDate: "2023-03-15",
    grade: "Premium",
    certifications: ["Organik", "SNI"],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    description: "Beras organik premium hasil panen terbaru, bebas pestisida dan bahan kimia berbahaya. Ditanam dengan metode pertanian organik yang ramah lingkungan dan berkelanjutan. Memiliki tekstur pulen dan aroma yang khas.",
    nutritionalInfo: "Karbohidrat: 78g/100g, Protein: 7g/100g, Lemak: 0.5g/100g, Serat: 0.3g/100g",
    storageInfo: "Simpan di tempat kering dan sejuk. Hindari paparan sinar matahari langsung dan kelembaban tinggi.",
    reviews: [
      { user: "Ahmad S.", rating: 5, comment: "Kualitas beras sangat baik, pulen dan wangi.", date: "2023-04-10" },
      { user: "Budi W.", rating: 4, comment: "Pengiriman cepat, beras sesuai deskripsi.", date: "2023-03-22" }
    ]
  },
  {
    id: "2",
    name: "Beras Merah",
    variety: "Red Rice",
    farmer: "Bu Siti",
    location: "Cianjur, Jawa Barat",
    farmerInfo: {
      name: "Bu Siti Aminah",
      since: "2015",
      rating: 4.9,
      transactions: 87,
      phone: "+6281234567891"
    },
    quantity: 200,
    unit: "kg",
    price: 15000,
    minOrder: 5,
    harvestDate: "2023-02-20",
    grade: "Premium",
    certifications: ["Organik"],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    description: "Beras merah organik kaya nutrisi dan serat. Diolah secara alami tanpa bahan kimia tambahan. Cocok untuk diet sehat dan membantu mengontrol gula darah.",
    nutritionalInfo: "Karbohidrat: 76g/100g, Protein: 8g/100g, Lemak: 1.5g/100g, Serat: 2g/100g",
    storageInfo: "Simpan di tempat kering dan sejuk. Tutup rapat kemasan setelah dibuka untuk menjaga kesegaran.",
    reviews: [
      { user: "Diana P.", rating: 5, comment: "Beras merah terbaik yang pernah saya coba.", date: "2023-04-15" },
      { user: "Eko S.", rating: 5, comment: "Sangat cocok untuk diet saya, rasanya enak.", date: "2023-03-27" }
    ]
  },
  {
    id: "3",
    name: "Beras Hitam",
    variety: "Black Rice",
    farmer: "Pak Budi",
    location: "Klaten, Jawa Tengah",
    farmerInfo: {
      name: "Pak Budi Santoso",
      since: "2017",
      rating: 4.7,
      transactions: 38,
      phone: "+6281234567892"
    },
    quantity: 100,
    unit: "kg",
    price: 18000,
    minOrder: 5,
    harvestDate: "2023-02-10",
    grade: "Premium",
    certifications: ["Organik", "SNI"],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    description: "Beras hitam dengan kandungan antioksidan tinggi. Dikenal juga sebagai beras ketan hitam, memiliki tekstur sedikit lengket dan aroma khas. Baik untuk kesehatan jantung dan mencegah penuaan dini.",
    nutritionalInfo: "Karbohidrat: 75g/100g, Protein: 8.5g/100g, Lemak: 1.8g/100g, Serat: 3g/100g",
    storageInfo: "Simpan di tempat kering dan sejuk. Jauhkan dari sinar matahari langsung.",
    reviews: [
      { user: "Fani R.", rating: 4, comment: "Kualitas bagus, pengiriman tepat waktu.", date: "2023-04-02" }
    ]
  },
  {
    id: "4",
    name: "Beras Ketan",
    variety: "White Glutinous",
    farmer: "Bu Maya",
    location: "Tasikmalaya, Jawa Barat",
    farmerInfo: {
      name: "Bu Maya Indriani",
      since: "2019",
      rating: 4.6,
      transactions: 27,
      phone: "+6281234567893"
    },
    quantity: 150,
    unit: "kg",
    price: 14000,
    minOrder: 5,
    harvestDate: "2023-03-05",
    grade: "Standard",
    certifications: ["SNI"],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    description: "Beras ketan putih berkualitas untuk olahan kue tradisional. Memiliki tekstur lengket dan aroma yang khas. Sangat cocok untuk membuat tape ketan, lemper, atau kue-kue tradisional Indonesia lainnya.",
    nutritionalInfo: "Karbohidrat: 81g/100g, Protein: 6.8g/100g, Lemak: 0.7g/100g, Serat: 0.2g/100g",
    storageInfo: "Simpan di tempat kering dan sejuk. Hindari paparan kelembaban tinggi.",
    reviews: [
      { user: "Gina H.", rating: 5, comment: "Keluarga saya sangat suka kue dari beras ketan ini.", date: "2023-03-18" },
      { user: "Hadi P.", rating: 4, comment: "Kualitas baik, tidak ada campuran.", date: "2023-03-10" }
    ]
  }
];

const MarketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Find the selected commodity by ID
  const commodity = mockCommodities.find(item => item.id === id);
  
  if (!commodity) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">{language === "id" ? "Komoditas tidak ditemukan" : "Commodity not found"}</h2>
          <Button onClick={() => navigate("/market")}>
            {language === "id" ? "Kembali ke Pasar" : "Back to Market"}
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const handleBuy = () => {
    // Navigate to buy transaction page
    navigate(`/buy/${commodity.id}`);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/market")}
            className="border-earth-light-brown/30"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === "id" ? "Kembali ke Pasar" : "Back to Market"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden border border-earth-light-brown/30 aspect-square">
              <img 
                src={commodity.images[selectedImage]} 
                alt={commodity.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {commodity.images.map((img, index) => (
                <div 
                  key={index}
                  className={`w-20 h-20 border-2 rounded-md overflow-hidden cursor-pointer transition-all ${
                    selectedImage === index ? 'border-earth-medium-green' : 'border-earth-light-brown/30'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${commodity.name} ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-earth-light-brown/30 p-6">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-earth-dark-green">{commodity.name}</h1>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-earth-medium-green">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-earth-medium-green">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Wheat className="h-4 w-4 text-earth-medium-green" />
                  <span className="text-earth-medium-green font-medium">{commodity.variety}</span>
                </div>
                
                <div className="mt-4 flex items-center">
                  <Badge className="bg-[#FEF7CD] text-earth-brown border border-earth-clay/50 px-3 py-1">
                    <CircleDollarSign className="h-3.5 w-3.5 mr-1" />
                    Rp {commodity.price.toLocaleString()} / {commodity.unit}
                  </Badge>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Key info section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-earth-medium-green mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "id" ? "Petani" : "Farmer"}</p>
                    <p className="font-medium">{commodity.farmer}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-earth-medium-green mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "id" ? "Lokasi" : "Location"}</p>
                    <p className="font-medium">{commodity.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="h-5 w-5 text-earth-medium-green mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "id" ? "Stok" : "Stock"}</p>
                    <p className="font-medium">{commodity.quantity} {commodity.unit}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-earth-medium-green mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "id" ? "Tanggal Panen" : "Harvest Date"}</p>
                    <p className="font-medium">{commodity.harvestDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 col-span-2">
                  <BadgeCheck className="h-5 w-5 text-earth-medium-green mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "id" ? "Sertifikasi" : "Certifications"}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {commodity.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="bg-[#F2FCE2]">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-earth-medium-green hover:bg-earth-dark-green text-white" 
                onClick={handleBuy}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {language === "id" ? "Beli Sekarang" : "Buy Now"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                {language === "id" 
                  ? `Pembelian minimum ${commodity.minOrder} ${commodity.unit}` 
                  : `Minimum order ${commodity.minOrder} ${commodity.unit}`}
              </p>
            </div>
            
            {/* Additional Information */}
            <div className="bg-white rounded-lg border border-earth-light-brown/30 overflow-hidden">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full bg-earth-pale-green">
                  <TabsTrigger value="description" className="flex-1">
                    {language === "id" ? "Deskripsi" : "Description"}
                  </TabsTrigger>
                  <TabsTrigger value="nutrition" className="flex-1">
                    {language === "id" ? "Nutrisi" : "Nutrition"}
                  </TabsTrigger>
                  <TabsTrigger value="storage" className="flex-1">
                    {language === "id" ? "Penyimpanan" : "Storage"}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="p-4">
                  <p>{commodity.description}</p>
                </TabsContent>
                <TabsContent value="nutrition" className="p-4">
                  <p>{commodity.nutritionalInfo}</p>
                </TabsContent>
                <TabsContent value="storage" className="p-4">
                  <p>{commodity.storageInfo}</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Farmer Information */}
        <Card className="border-earth-light-brown/30">
          <CardHeader className="bg-[#F2FCE2]">
            <CardTitle className="text-lg">
              {language === "id" ? "Informasi Petani" : "Farmer Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-earth-light-green/30 flex items-center justify-center">
                  <User className="h-8 w-8 text-earth-medium-green" />
                </div>
                <div>
                  <h3 className="font-semibold">{commodity.farmerInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "id" ? "Bergabung sejak" : "Member since"} {commodity.farmerInfo.since}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="font-medium text-amber-600">★ {commodity.farmerInfo.rating}</span>
                    <span className="text-sm text-muted-foreground">({commodity.farmerInfo.transactions} {language === "id" ? "transaksi" : "transactions"})</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Button variant="outline" className="mb-2 border-earth-medium-green/50 text-earth-dark-green">
                  {language === "id" ? "Hubungi Petani" : "Contact Farmer"}
                </Button>
                <Button variant="outline" className="border-earth-medium-green/50 text-earth-dark-green">
                  {language === "id" ? "Lihat Semua Produk" : "View All Products"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Reviews */}
        <Card className="border-earth-light-brown/30">
          <CardHeader className="bg-[#FDE1D3]">
            <CardTitle className="text-lg">
              {language === "id" ? "Ulasan Pembeli" : "Customer Reviews"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {commodity.reviews.length > 0 ? (
              <div className="space-y-4">
                {commodity.reviews.map((review, index) => (
                  <div key={index} className="p-4 border border-earth-light-brown/30 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{review.user}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {language === "id" ? "Belum ada ulasan" : "No reviews yet"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MarketDetail;
