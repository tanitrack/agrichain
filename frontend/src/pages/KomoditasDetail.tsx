
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, QrCode, Edit, Trash2, MapPin, Scale, Calendar, PackageOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils";

// Mock data for demo purposes - to be replaced with API calls
const komoditasData = [
  { 
    id: "KM001", 
    name: "Beras Putih", 
    unit: "kg", 
    type: "Padi", 
    quantity: 5000, 
    location: "Cianjur, Jawa Barat", 
    grade: "Premium", 
    createdAt: "2025-04-01",
    imageUrl: "/placeholder.svg",
    description: "Beras putih kualitas premium dengan kadar air rendah. Cocok untuk konsumsi restoran dan hotel.",
    qrCodeUrl: "/placeholder.svg",
    history: [
      { date: "2025-04-01", action: "Created", notes: "Komoditas baru ditambahkan" },
      { date: "2025-04-02", action: "Inspected", notes: "Pemeriksaan kualitas oleh petugas" },
      { date: "2025-04-03", action: "Graded", notes: "Dinilai dengan grade Premium" }
    ]
  },
  { 
    id: "KM002", 
    name: "Jagung Manis", 
    unit: "kg", 
    type: "Jagung", 
    quantity: 2500, 
    location: "Malang, Jawa Timur", 
    grade: "A", 
    createdAt: "2025-03-28",
    imageUrl: "/placeholder.svg",
    description: "Jagung manis berkualitas tinggi. Cocok untuk industri makanan olahan.",
    qrCodeUrl: "/placeholder.svg",
    history: [
      { date: "2025-03-28", action: "Created", notes: "Komoditas baru ditambahkan" },
      { date: "2025-03-30", action: "Inspected", notes: "Pemeriksaan kualitas oleh petugas" },
      { date: "2025-04-01", action: "Graded", notes: "Dinilai dengan grade A" }
    ]
  },
  { 
    id: "KM003", 
    name: "Kedelai", 
    unit: "kg", 
    type: "Kedelai", 
    quantity: 1800, 
    location: "Jember, Jawa Timur", 
    grade: "B", 
    createdAt: "2025-03-25",
    imageUrl: "/placeholder.svg",
    description: "Kedelai lokal berkualitas baik. Cocok untuk industri tempe dan tahu.",
    qrCodeUrl: "/placeholder.svg",
    history: [
      { date: "2025-03-25", action: "Created", notes: "Komoditas baru ditambahkan" },
      { date: "2025-03-27", action: "Inspected", notes: "Pemeriksaan kualitas oleh petugas" },
      { date: "2025-03-28", action: "Graded", notes: "Dinilai dengan grade B" }
    ]
  },
  { 
    id: "KM004", 
    name: "Gula Aren", 
    unit: "kg", 
    type: "Gula", 
    quantity: 750, 
    location: "Bandung, Jawa Barat", 
    grade: "Premium", 
    createdAt: "2025-03-20",
    imageUrl: "/placeholder.svg",
    description: "Gula aren murni dari pohon aren. Diolah secara tradisional.",
    qrCodeUrl: "/placeholder.svg",
    history: [
      { date: "2025-03-20", action: "Created", notes: "Komoditas baru ditambahkan" },
      { date: "2025-03-22", action: "Inspected", notes: "Pemeriksaan kualitas oleh petugas" },
      { date: "2025-03-23", action: "Graded", notes: "Dinilai dengan grade Premium" }
    ]
  },
  { 
    id: "KM005", 
    name: "Kopi Arabika", 
    unit: "kg", 
    type: "Kopi", 
    quantity: 500, 
    location: "Bali", 
    grade: "Premium", 
    createdAt: "2025-03-15",
    imageUrl: "/placeholder.svg",
    description: "Kopi arabika dari perkebunan Bali. Dipanen dan diproses dengan metode terbaik.",
    qrCodeUrl: "/placeholder.svg",
    history: [
      { date: "2025-03-15", action: "Created", notes: "Komoditas baru ditambahkan" },
      { date: "2025-03-18", action: "Inspected", notes: "Pemeriksaan kualitas oleh petugas" },
      { date: "2025-03-19", action: "Graded", notes: "Dinilai dengan grade Premium" }
    ]
  }
];

const KomoditasDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [komoditas, setKomoditas] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      const found = komoditasData.find(item => item.id === id);
      setKomoditas(found || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-center">
            <div className="h-8 w-32 bg-earth-light-green rounded mb-4 mx-auto"></div>
            <div className="h-4 w-64 bg-earth-light-green rounded mx-auto"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!komoditas) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2 text-earth-dark-green">{t("commodities.notfound")}</h2>
          <p className="text-earth-medium-green mb-6">The requested commodity could not be found.</p>
          <Button onClick={() => navigate('/komoditas')} className="bg-earth-dark-green hover:bg-earth-medium-green">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("action.back")}
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Render grade badge with appropriate color
  const renderGradeBadge = (grade: string) => {
    const colorMap: Record<string, string> = {
      "Premium": "bg-green-100 text-green-800 border-green-200",
      "A": "bg-blue-100 text-blue-800 border-blue-200",
      "B": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "C": "bg-orange-100 text-orange-800 border-orange-200"
    };

    return (
      <Badge 
        variant="outline" 
        className={colorMap[grade] || "bg-gray-100 text-gray-800 border-gray-200"}
      >
        {grade}
      </Badge>
    );
  };

  return (
    <MainLayout>
      {/* Top action bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20" 
            onClick={() => navigate('/komoditas')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("action.back")}
          </Button>
          <h1 className="text-2xl font-bold text-earth-dark-green">{t("commodities.detail")}</h1>
          <p className="text-earth-medium-green">{komoditas.id}</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2 border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20">
            <QrCode className="h-4 w-4" />
            {t("commodities.qrcode")}
          </Button>
          <Button variant="outline" className="gap-2 border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20">
            <Edit className="h-4 w-4" />
            {t("action.edit")}
          </Button>
          <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            {t("action.delete")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content area - 2/3 width on desktop */}
        <div className="md:col-span-2 space-y-6">
          {/* Commodity Details Card */}
          <Card className="overflow-hidden border-2 border-earth-light-green/70 shadow-md">
            <CardHeader className="pb-3 bg-gradient-to-r from-earth-dark-green to-earth-medium-green">
              <CardTitle className="text-white">{t("commodities.detail")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row mb-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <div className="bg-earth-pale-green rounded-lg overflow-hidden h-64 flex items-center justify-center border-2 border-earth-light-green/40">
                    <img 
                      src={komoditas.imageUrl} 
                      alt={komoditas.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3 md:pl-6">
                  <h2 className="text-2xl font-bold mb-2 text-earth-dark-green">{komoditas.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-sm text-earth-medium-green">{t("commodities.type")}</p>
                      <p className="font-medium text-earth-dark-green">{komoditas.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-earth-medium-green">{t("commodities.grade")}</p>
                      <div>{renderGradeBadge(komoditas.grade)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-earth-medium-green">{t("commodities.quantity")}</p>
                      <p className="font-medium text-earth-dark-green">{komoditas.quantity.toLocaleString()} {komoditas.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-earth-medium-green">{t("commodities.created")}</p>
                      <p className="font-medium text-earth-dark-green">{formatDate(new Date(komoditas.createdAt))}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-earth-medium-green">{t("commodities.location")}</p>
                      <p className="font-medium text-earth-dark-green flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-earth-medium-green" />
                        {komoditas.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-earth-light-green" />
              
              <div>
                <h3 className="font-medium mb-2 text-earth-dark-green">Description</h3>
                <p className="text-earth-dark-green">{komoditas.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* History Card */}
          <Card className="overflow-hidden border-2 border-earth-clay/70 shadow-md">
            <CardHeader className="pb-3 bg-gradient-to-r from-earth-brown to-earth-light-brown">
              <CardTitle className="text-white">History & Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {komoditas.history.map((event: any, index: number) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="w-3 h-3 bg-earth-dark-green rounded-full"></div>
                      {index < komoditas.history.length - 1 && (
                        <div className="w-0.5 bg-earth-light-green h-full mt-1"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center">
                        <p className="font-medium text-earth-dark-green">{event.action}</p>
                        <span className="mx-2 text-earth-medium-green">•</span>
                        <p className="text-sm text-earth-medium-green">{formatDate(new Date(event.date))}</p>
                      </div>
                      <p className="text-earth-dark-green mt-1">{event.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar area - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* QR Code Card */}
          <Card className="overflow-hidden border-2 border-earth-wheat/70 shadow-md">
            <CardHeader className="pb-3 bg-gradient-to-r from-[#d4b145] to-[#e6be70]">
              <CardTitle className="text-white">{t("commodities.qrcode")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6">
              <div className="bg-earth-pale-green p-4 rounded-lg mb-4 border-2 border-earth-light-green/30">
                <QrCode className="h-32 w-32 text-earth-dark-green mx-auto" />
              </div>
              <p className="text-center text-sm text-earth-dark-green">
                {t("commodities.name")}: <span className="font-medium">{komoditas.name}</span><br />
                ID: <span className="font-medium">{komoditas.id}</span><br />
                {t("commodities.created")}: <span className="font-medium">{formatDate(new Date(komoditas.createdAt))}</span>
              </p>
              <Button className="mt-4 w-full bg-gradient-to-r from-earth-dark-green to-earth-medium-green hover:from-earth-medium-green hover:to-earth-dark-green transition-all duration-300">
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card className="overflow-hidden border-2 border-earth-light-green/70 shadow-md">
            <CardHeader className="pb-3 bg-gradient-to-r from-earth-medium-green to-earth-light-green">
              <CardTitle className="text-white">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <PackageOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">{t("commodities.type")}</p>
                    <p className="font-medium text-earth-dark-green">{komoditas.type}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-100 hover:bg-green-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Scale className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">{t("commodities.quantity")}</p>
                    <p className="font-medium text-earth-dark-green">{komoditas.quantity.toLocaleString()} {komoditas.unit}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">{t("commodities.location")}</p>
                    <p className="font-medium text-earth-dark-green">{komoditas.location}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">{t("commodities.created")}</p>
                    <p className="font-medium text-earth-dark-green">{formatDate(new Date(komoditas.createdAt))}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default KomoditasDetail;
