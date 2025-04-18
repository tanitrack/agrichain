
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wheat, Info, ShoppingCart, ExternalLink, Search, Filter, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Mock data for commodity marketplace
const mockCommodities = [
  {
    id: "1",
    name: "Beras Organik Premium",
    variety: "IR 64",
    farmer: "Pak Joko",
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
    location: "Tasikmalaya, Jawa Barat",
    quantity: 150,
    unit: "kg",
    price: 14000,
    imageUrl: "/placeholder.svg",
    description: "Beras ketan putih berkualitas untuk olahan kue tradisional."
  }
];

// Color classes for category badges
const categoryColors = [
  "bg-[#F2FCE2] text-earth-dark-green border-earth-medium-green/50",
  "bg-[#FEF7CD] text-earth-brown border-earth-clay/50",
  "bg-[#FEC6A1] text-earth-brown border-earth-clay/50",
  "bg-[#E5DEFF] text-indigo-800 border-indigo-300",
  "bg-[#FFDEE2] text-rose-700 border-rose-300",
  "bg-[#FDE1D3] text-amber-800 border-amber-300",
  "bg-[#D3E4FD] text-sky-800 border-sky-300"
];

const Market = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleBuy = (commodityId: string) => {
    // Navigate to the buy transaction page
    navigate(`/buy/${commodityId}`);
  };
  
  const handleViewDetails = (commodityId: string) => {
    navigate(`/market/${commodityId}`);
  };

  const getRandomColorClass = (id: string) => {
    // Use the ID as a seed to get a consistent color for each commodity
    const index = parseInt(id, 10) % categoryColors.length;
    return categoryColors[index];
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{language === "id" ? "Pasar Komoditas" : "Commodity Market"}</h1>
            <p className="text-muted-foreground">
              {language === "id" 
                ? "Jelajahi dan beli komoditas pertanian berkualitas langsung dari petani."
                : "Explore and purchase quality agricultural commodities directly from farmers."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/harga")}>
              <TrendingUp className="h-4 w-4" />
              {language === "id" ? "Lihat Harga Terkini" : "See Current Prices"}
            </Button>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="flex flex-col sm:flex-row gap-4 bg-[#F2FCE2] p-4 rounded-lg border border-earth-light-green/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={language === "id" ? "Cari komoditas..." : "Search commodities..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-earth-light-green/50 focus-visible:ring-earth-medium-green"
            />
          </div>
          <Button variant="outline" className="bg-white border-earth-light-green/50 text-earth-dark-green">
            <Filter className="h-4 w-4 mr-2" />
            {language === "id" ? "Filter" : "Filter"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCommodities.map((commodity) => (
            <Card 
              key={commodity.id} 
              className="overflow-hidden border border-earth-light-brown/30 hover:shadow-md transition-shadow group"
            >
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <img 
                  src={commodity.imageUrl} 
                  alt={commodity.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-3 right-3 ${getRandomColorClass(commodity.id)} border`}>
                  Rp {commodity.price.toLocaleString()} / {commodity.unit}
                </Badge>
              </div>
              <CardHeader className="bg-gradient-to-r from-earth-pale-green to-white pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-earth-dark-green">{commodity.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-earth-medium-green">
                      <Wheat className="h-3.5 w-3.5" />
                      <span>{commodity.variety}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === "id" ? "Petani:" : "Farmer:"}</span>
                    <span className="font-medium">{commodity.farmer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === "id" ? "Lokasi:" : "Location:"}</span>
                    <span>{commodity.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === "id" ? "Stok:" : "Stock:"}</span>
                    <span>{commodity.quantity} {commodity.unit}</span>
                  </div>
                  <p className="text-sm mt-2 line-clamp-2">{commodity.description}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-white border-t border-earth-light-brown/20 flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(commodity.id)}
                  className="border-earth-medium-green/50 text-earth-dark-green hover:bg-earth-pale-green"
                >
                  <Info className="h-4 w-4 mr-1" />
                  {language === "id" ? "Detail" : "Details"}
                </Button>
                <Button 
                  size="sm" 
                  className="bg-earth-medium-green hover:bg-earth-dark-green" 
                  onClick={() => handleBuy(commodity.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {language === "id" ? "Beli" : "Buy"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Market;
