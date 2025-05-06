import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, QrCode, Edit, Trash2, Scale, Calendar, PackageOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { formatDate } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Id } from 'convex/_generated/dataModel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for demo purposes - to be replaced with API calls
const komoditasData = [
  {
    id: 'KM001',
    name: 'Beras Putih',
    unit: 'kg',
    type: 'Padi',
    quantity: 5000,
    location: 'Cianjur, Jawa Barat',
    grade: 'Premium',
    createdAt: '2025-04-01',
    imageUrl: '/placeholder.svg',
    description:
      'Beras putih kualitas premium dengan kadar air rendah. Cocok untuk konsumsi restoran dan hotel.',
    qrCodeUrl: '/placeholder.svg',
    history: [
      { date: '2025-04-01', action: 'Created', notes: 'Komoditas baru ditambahkan' },
      { date: '2025-04-02', action: 'Inspected', notes: 'Pemeriksaan kualitas oleh petugas' },
      { date: '2025-04-03', action: 'Graded', notes: 'Dinilai dengan grade Premium' },
    ],
  },
  {
    id: 'KM002',
    name: 'Jagung Manis',
    unit: 'kg',
    type: 'Jagung',
    quantity: 2500,
    location: 'Malang, Jawa Timur',
    grade: 'A',
    createdAt: '2025-03-28',
    imageUrl: '/placeholder.svg',
    description: 'Jagung manis berkualitas tinggi. Cocok untuk industri makanan olahan.',
    qrCodeUrl: '/placeholder.svg',
    history: [
      { date: '2025-03-28', action: 'Created', notes: 'Komoditas baru ditambahkan' },
      { date: '2025-03-30', action: 'Inspected', notes: 'Pemeriksaan kualitas oleh petugas' },
      { date: '2025-04-01', action: 'Graded', notes: 'Dinilai dengan grade A' },
    ],
  },
  {
    id: 'KM003',
    name: 'Kedelai',
    unit: 'kg',
    type: 'Kedelai',
    quantity: 1800,
    location: 'Jember, Jawa Timur',
    grade: 'B',
    createdAt: '2025-03-25',
    imageUrl: '/placeholder.svg',
    description: 'Kedelai lokal berkualitas baik. Cocok untuk industri tempe dan tahu.',
    qrCodeUrl: '/placeholder.svg',
    history: [
      { date: '2025-03-25', action: 'Created', notes: 'Komoditas baru ditambahkan' },
      { date: '2025-03-27', action: 'Inspected', notes: 'Pemeriksaan kualitas oleh petugas' },
      { date: '2025-03-28', action: 'Graded', notes: 'Dinilai dengan grade B' },
    ],
  },
  {
    id: 'KM004',
    name: 'Gula Aren',
    unit: 'kg',
    type: 'Gula',
    quantity: 750,
    location: 'Bandung, Jawa Barat',
    grade: 'Premium',
    createdAt: '2025-03-20',
    imageUrl: '/placeholder.svg',
    description: 'Gula aren murni dari pohon aren. Diolah secara tradisional.',
    qrCodeUrl: '/placeholder.svg',
    history: [
      { date: '2025-03-20', action: 'Created', notes: 'Komoditas baru ditambahkan' },
      { date: '2025-03-22', action: 'Inspected', notes: 'Pemeriksaan kualitas oleh petugas' },
      { date: '2025-03-23', action: 'Graded', notes: 'Dinilai dengan grade Premium' },
    ],
  },
  {
    id: 'KM005',
    name: 'Kopi Arabika',
    unit: 'kg',
    type: 'Kopi',
    quantity: 500,
    location: 'Bali',
    grade: 'Premium',
    createdAt: '2025-03-15',
    imageUrl: '/placeholder.svg',
    description: 'Kopi arabika dari perkebunan Bali. Dipanen dan diproses dengan metode terbaik.',
    qrCodeUrl: '/placeholder.svg',
    history: [
      { date: '2025-03-15', action: 'Created', notes: 'Komoditas baru ditambahkan' },
      { date: '2025-03-18', action: 'Inspected', notes: 'Pemeriksaan kualitas oleh petugas' },
      { date: '2025-03-19', action: 'Graded', notes: 'Dinilai dengan grade Premium' },
    ],
  },
];

const KomoditasDetail = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);

  const komoditas = useQuery(api.komoditas_queries.get, {
    id: id as Id<'komoditas'>,
  });

  useEffect(() => {
    if (komoditas) {
      setLoading(false);
    }
  }, [komoditas]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="mx-auto mb-4 h-8 w-32 rounded bg-earth-light-green"></div>
            <div className="mx-auto h-4 w-64 rounded bg-earth-light-green"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!komoditas) {
    return (
      <MainLayout>
        <div className="py-12 text-center">
          <h2 className="mb-2 text-2xl font-bold text-earth-dark-green">
            {t('commodities.notfound')}
          </h2>
          <p className="mb-6 text-earth-medium-green">
            The requested commodity could not be found.
          </p>
          <Button
            onClick={() => navigate('/komoditas')}
            className="bg-earth-dark-green hover:bg-earth-medium-green"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('action.back')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Render grade badge with appropriate color
  const renderGradeBadge = (grade: string) => {
    const colorMap: Record<string, string> = {
      Premium: 'bg-green-100 text-green-800 border-green-200',
      A: 'bg-blue-100 text-blue-800 border-blue-200',
      B: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      C: 'bg-orange-100 text-orange-800 border-orange-200',
    };

    return (
      <Badge
        variant="outline"
        className={colorMap[grade] || 'border-gray-200 bg-gray-100 text-gray-800'}
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
            {t('action.back')}
          </Button>
          <h1 className="text-2xl font-bold text-earth-dark-green">{t('commodities.detail')}</h1>
          <p className="text-earth-medium-green">{komoditas._id}</p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button
            variant="outline"
            className="gap-2 border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20"
          >
            <Edit className="h-4 w-4" />
            {t('action.edit')}
          </Button>
          <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            {t('action.delete')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content area - 2/3 width on desktop */}
        <div className="space-y-6 md:col-span-2">
          {/* Commodity Details Card */}
          <Card className="overflow-hidden border-2 border-earth-light-green/70 shadow-md">
            <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green pb-3">
              <CardTitle className="text-white">{t('commodities.detail')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col md:flex-row">
                <div className="mb-4 w-full md:mb-0 md:w-1/3">
                  <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg border-2 border-earth-light-green/40 bg-earth-pale-green">
                    <img
                      src={komoditas.imageUrl}
                      alt={komoditas.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3 md:pl-6">
                  <h2 className="mb-2 text-2xl font-bold text-earth-dark-green">
                    {komoditas.name}
                  </h2>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-earth-medium-green">{t('commodities.type')}</p>
                      <p className="font-medium text-earth-dark-green">{komoditas.category}</p>
                    </div>
                    {/* <div>
                      <p className="text-sm text-earth-medium-green">{t('commodities.grade')}</p>
                      <div>{renderGradeBadge(komoditas.grade)}</div>
                    </div> */}
                    <div>
                      <p className="text-sm text-earth-medium-green">{t('commodities.quantity')}</p>
                      <p className="font-medium text-earth-dark-green">
                        {komoditas.stock.toLocaleString()} {komoditas.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-earth-medium-green">{t('commodities.created')}</p>
                      <p className="font-medium text-earth-dark-green">
                        {formatDate(new Date(komoditas._creationTime))}
                      </p>
                    </div>
                    {/* <div className="md:col-span-2">
                      <p className="text-sm text-earth-medium-green">{t('commodities.location')}</p>
                      <p className="flex items-center font-medium text-earth-dark-green">
                        <MapPin className="mr-1 h-4 w-4 text-earth-medium-green" />
                        {komoditas.location}
                      </p>
                    </div> */}
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-sm text-earth-medium-green">{'Harga Grosir'}</p>
                    <div className=" overflow-hidden rounded-lg border border-earth-light-brown/30 bg-white">
                      <Tabs defaultValue="description" className="w-full">
                        <TabsList className="w-full bg-earth-pale-green">
                          <TabsTrigger value="description" className="flex-1">
                            {`10 ${komoditas.unit}`}
                          </TabsTrigger>
                          <TabsTrigger value="nutrition" className="flex-1">
                            {`100 ${komoditas.unit}`}
                          </TabsTrigger>
                          <TabsTrigger value="storage" className="flex-1">
                            {`1000 ${komoditas.unit}`}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="space-y-4 p-4">
                          <p>
                            Harga: Rp {komoditas.pricePerUnit.toLocaleString()} / {komoditas.unit}
                          </p>
                          <p>Harga Total: Rp {(komoditas.pricePerUnit * 10).toLocaleString()}</p>
                          {/* <p>{komoditas.description}</p> */}
                        </TabsContent>
                        <TabsContent value="nutrition" className="space-y-4 p-4">
                          <p>
                            Harga: Rp {(komoditas.pricePerUnit - 2000).toLocaleString()} /{' '}
                            {komoditas.unit}
                          </p>
                          <p>
                            Harga Total: Rp{' '}
                            {((komoditas.pricePerUnit - 2000) * 100).toLocaleString()}
                          </p>
                          {/* <p>{komoditas.nutritionalInfo}</p> */}
                        </TabsContent>

                        <TabsContent value="storage" className="space-y-4 p-4">
                          <p>
                            Harga: Rp {(komoditas.pricePerUnit - 4000).toLocaleString()} /{' '}
                            {komoditas.unit}
                          </p>
                          <p>
                            Harga Total: Rp{' '}
                            {((komoditas.pricePerUnit - 4000) * 100).toLocaleString()}
                          </p>
                          {/* <p>{komoditas.storageInfo}</p> */}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-earth-light-green" />

              <div>
                <h3 className="mb-2 font-medium text-earth-dark-green">Description</h3>
                <p className="text-earth-dark-green">{komoditas.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* History Card */}
          {/* <Card className="overflow-hidden border-2 border-earth-clay/70 shadow-md">
            <CardHeader className="bg-gradient-to-r from-earth-brown to-earth-light-brown pb-3">
              <CardTitle className="text-white">History & Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {komoditas.history.map((event: any, index: number) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-earth-dark-green"></div>
                      {index < komoditas.history.length - 1 && (
                        <div className="mt-1 h-full w-0.5 bg-earth-light-green"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center">
                        <p className="font-medium text-earth-dark-green">{event.action}</p>
                        <span className="mx-2 text-earth-medium-green">•</span>
                        <p className="text-sm text-earth-medium-green">
                          {formatDate(new Date(event.date))}
                        </p>
                      </div>
                      <p className="mt-1 text-earth-dark-green">{event.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Sidebar area - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* QR Code Card */}
          <Card className="border-earth-/70 overflow-hidden border-2 shadow-md">
            <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green pb-3">
              <CardTitle className="text-white">{t('commodities.qrcode')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6">
              <div className="mb-4 rounded-lg border-2 border-earth-light-green/30 bg-earth-pale-green p-4">
                <QrCode className="mx-auto h-32 w-32 text-earth-dark-green" />
              </div>
              <p className="text-center text-sm text-earth-dark-green">
                {t('commodities.name')}: <span className="font-medium">{komoditas.name}</span>
                <br />
                ID: <span className="font-medium">{komoditas._id}</span>
                <br />
                {t('commodities.created')}:{' '}
                <span className="font-medium">{formatDate(new Date(komoditas._creationTime))}</span>
              </p>
              <Button className="mt-4 w-full bg-gradient-to-r from-earth-dark-green to-earth-medium-green transition-all duration-300 hover:from-earth-medium-green hover:to-earth-dark-green">
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card className="overflow-hidden border-2  border-earth-light-green/70 shadow-md">
            <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green pb-3">
              <CardTitle className="text-white">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center rounded-lg border border-blue-100 bg-blue-50 p-3 transition-colors hover:bg-blue-100">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <PackageOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">{t('commodities.type')}</p>
                    <p className="font-medium text-earth-dark-green">{komoditas.category}</p>
                  </div>
                </div>
                <div className="flex items-center rounded-lg border border-green-100 bg-green-50 p-3 transition-colors hover:bg-green-100">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Scale className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">{t('commodities.quantity')}</p>
                    <p className="font-medium text-earth-dark-green">
                      {komoditas.stock.toLocaleString()} {komoditas.unit}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center rounded-lg border border-purple-100 bg-purple-50 p-3 transition-colors hover:bg-purple-100">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">{t('commodities.location')}</p>
                    <p className="font-medium text-earth-dark-green">{komoditas.location}</p>
                  </div>
                </div> */}
                <div className="flex items-center rounded-lg border border-amber-100 bg-amber-50 p-3 transition-colors hover:bg-amber-100">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-earth-medium-green">{t('commodities.created')}</p>
                    <p className="font-medium text-earth-dark-green">
                      {formatDate(new Date(komoditas._creationTime))}
                    </p>
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
