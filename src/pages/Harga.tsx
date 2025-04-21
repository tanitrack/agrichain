import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TrendingUp, Search, Filter, ArrowDown, ArrowUp, MapPin, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { type CommodityPrice } from '@/lib/data/types';
import { CommodityPriceDetail } from '@/components/commodity/CommodityPriceDetail';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Sample commodity price data
const commodityPrices: CommodityPrice[] = [
  {
    id: 'PRICE-001',
    name: 'Beras Putih',
    price: 10500,
    unit: 'kg',
    predictedChange: 2.5,
    region: 'Jawa Barat',
    grade: 'A',
    updatedAt: new Date('2023-11-20'),
  },
  {
    id: 'PRICE-002',
    name: 'Jagung Manis',
    price: 8000,
    unit: 'kg',
    predictedChange: -1.2,
    region: 'Jawa Timur',
    grade: 'B',
    updatedAt: new Date('2023-11-19'),
  },
  {
    id: 'PRICE-003',
    name: 'Kedelai',
    price: 12500,
    unit: 'kg',
    predictedChange: 3.8,
    region: 'Jawa Tengah',
    grade: 'Premium',
    updatedAt: new Date('2023-11-18'),
  },
  {
    id: 'PRICE-004',
    name: 'Kopi Arabika',
    price: 85000,
    unit: 'kg',
    predictedChange: 5.2,
    region: 'Aceh',
    grade: 'Premium',
    updatedAt: new Date('2023-11-17'),
  },
  {
    id: 'PRICE-005',
    name: 'Cabai Merah',
    price: 35000,
    unit: 'kg',
    predictedChange: -3.5,
    region: 'Sumatera Utara',
    grade: 'A',
    updatedAt: new Date('2023-11-20'),
  },
  {
    id: 'PRICE-006',
    name: 'Bawang Merah',
    price: 28000,
    unit: 'kg',
    predictedChange: 1.8,
    region: 'Jawa Barat',
    grade: 'A',
    updatedAt: new Date('2023-11-19'),
  },
  {
    id: 'PRICE-007',
    name: 'Gula Pasir',
    price: 14500,
    unit: 'kg',
    predictedChange: 0.5,
    region: 'Lampung',
    grade: 'A',
    updatedAt: new Date('2023-11-18'),
  },
  {
    id: 'PRICE-008',
    name: 'Minyak Goreng',
    price: 18000,
    unit: 'kg',
    predictedChange: -0.8,
    region: 'Nasional',
    updatedAt: new Date('2023-11-17'),
  },
];

// Add historical price data for sample visualization
const commodityPriceHistory = {
  'PRICE-001': [
    { date: '2023-06', price: 9800 },
    { date: '2023-07', price: 9900 },
    { date: '2023-08', price: 10100 },
    { date: '2023-09', price: 10300 },
    { date: '2023-10', price: 10400 },
    { date: '2023-11', price: 10500 },
  ],
  'PRICE-002': [
    { date: '2023-06', price: 8500 },
    { date: '2023-07', price: 8300 },
    { date: '2023-08', price: 8200 },
    { date: '2023-09', price: 8100 },
    { date: '2023-10', price: 8000 },
    { date: '2023-11', price: 8000 },
  ],
  'PRICE-003': [
    { date: '2023-06', price: 11000 },
    { date: '2023-07', price: 11200 },
    { date: '2023-08', price: 11500 },
    { date: '2023-09', price: 11800 },
    { date: '2023-10', price: 12200 },
    { date: '2023-11', price: 12500 },
  ],
  'PRICE-004': [
    { date: '2023-06', price: 80000 },
    { date: '2023-07', price: 81000 },
    { date: '2023-08', price: 82000 },
    { date: '2023-09', price: 83000 },
    { date: '2023-10', price: 84000 },
    { date: '2023-11', price: 85000 },
  ],
  'PRICE-005': [
    { date: '2023-06', price: 38000 },
    { date: '2023-07', price: 37500 },
    { date: '2023-08', price: 37000 },
    { date: '2023-09', price: 36500 },
    { date: '2023-10', price: 36000 },
    { date: '2023-11', price: 35000 },
  ],
  'PRICE-006': [
    { date: '2023-06', price: 25000 },
    { date: '2023-07', price: 25500 },
    { date: '2023-08', price: 26000 },
    { date: '2023-09', price: 26500 },
    { date: '2023-10', price: 27000 },
    { date: '2023-11', price: 28000 },
  ],
  'PRICE-007': [
    { date: '2023-06', price: 14000 },
    { date: '2023-07', price: 14100 },
    { date: '2023-08', price: 14200 },
    { date: '2023-09', price: 14300 },
    { date: '2023-10', price: 14400 },
    { date: '2023-11', price: 14500 },
  ],
  'PRICE-008': [
    { date: '2023-06', price: 19000 },
    { date: '2023-07', price: 18800 },
    { date: '2023-08', price: 18600 },
    { date: '2023-09', price: 18400 },
    { date: '2023-10', price: 18200 },
    { date: '2023-11', price: 18000 },
  ],
};

// Add regional price comparison data
const regionalPriceComparison = {
  'PRICE-001': [
    { region: 'Jawa Barat', price: 10500 },
    { region: 'Jawa Tengah', price: 10300 },
    { region: 'Jawa Timur', price: 10400 },
    { region: 'Sumatra Utara', price: 10800 },
    { region: 'Sulawesi Selatan', price: 10200 },
  ],
  'PRICE-002': [
    { region: 'Jawa Barat', price: 8100 },
    { region: 'Jawa Tengah', price: 8000 },
    { region: 'Jawa Timur', price: 8000 },
    { region: 'Sumatra Utara', price: 8300 },
    { region: 'Sulawesi Selatan', price: 7900 },
  ],
  // ... add similar data for other commodities
};

const Harga = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [trendFilter, setTrendFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityPrice | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Get unique regions for filter
  const regions = ['all', ...new Set(commodityPrices.map((price) => price.region))];

  // Filter commodity prices based on search query, region and trend
  const filteredCommodityPrices = commodityPrices.filter((price) => {
    const matchesSearch =
      price.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = regionFilter === 'all' || price.region === regionFilter;

    const matchesTrend =
      trendFilter === 'all' ||
      (trendFilter === 'rising' && price.predictedChange > 0) ||
      (trendFilter === 'falling' && price.predictedChange < 0) ||
      (trendFilter === 'stable' && price.predictedChange >= -0.5 && price.predictedChange <= 0.5);

    // Match tab
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pangan' &&
        [
          'Beras Putih',
          'Jagung Manis',
          'Kedelai',
          'Cabai Merah',
          'Bawang Merah',
          'Gula Pasir',
          'Minyak Goreng',
        ].includes(price.name)) ||
      (activeTab === 'perkebunan' && ['Kopi Arabika'].includes(price.name));

    return matchesSearch && matchesRegion && matchesTrend && matchesTab;
  });

  // Function to render trend indicator
  const getTrendIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 font-medium text-green-700">
          <ArrowUp className="h-4 w-4" />
          <span>{change.toFixed(1)}%</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 font-medium text-red-700">
          <ArrowDown className="h-4 w-4" />
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      );
    } else {
      return <span className="font-medium text-gray-700">0%</span>;
    }
  };

  // Function to handle row click and show details
  const handleRowClick = (commodity: CommodityPrice) => {
    setSelectedCommodity(commodity);
    setIsDetailDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-earth-dark-green mb-2 text-2xl font-bold">Harga Komoditas</h1>
        <p className="text-earth-medium-green font-medium">
          Pantau harga komoditas pertanian terkini
        </p>
      </div>

      <Card className="earth-card-forest mb-6 shadow-md">
        <CardHeader className="earth-header-forest">
          <CardTitle className="flex items-center text-lg text-white">
            <TrendingUp className="mr-2 h-5 w-5" />
            Daftar Harga Komoditas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="text-earth-dark-green absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Cari komoditas atau wilayah..."
                  className="border-earth-medium-green focus:ring-earth-dark-green pl-8 focus:ring-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="border-earth-medium-green text-earth-dark-green w-full bg-white sm:w-[180px]">
                    <SelectValue placeholder="Pilih Wilayah" />
                  </SelectTrigger>
                  <SelectContent className="border-earth-light-green">
                    <SelectItem value="all">Semua Wilayah</SelectItem>
                    {regions
                      .filter((r) => r !== 'all')
                      .map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Select value={trendFilter} onValueChange={setTrendFilter}>
                  <SelectTrigger className="border-earth-medium-green text-earth-dark-green w-full bg-white sm:w-[180px]">
                    <SelectValue placeholder="Filter Tren" />
                  </SelectTrigger>
                  <SelectContent className="border-earth-light-green">
                    <SelectItem value="all">Semua Tren</SelectItem>
                    <SelectItem value="rising">Naik</SelectItem>
                    <SelectItem value="falling">Turun</SelectItem>
                    <SelectItem value="stable">Stabil</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="border-earth-medium-green text-earth-dark-green bg-earth-pale-green hover:bg-earth-light-green/40 flex gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filter Lanjutan
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-earth-pale-green mb-4">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-earth-dark-green data-[state=active]:text-white"
                >
                  Semua
                </TabsTrigger>
                <TabsTrigger
                  value="pangan"
                  className="data-[state=active]:bg-earth-dark-green data-[state=active]:text-white"
                >
                  Pangan
                </TabsTrigger>
                <TabsTrigger
                  value="perkebunan"
                  className="data-[state=active]:bg-earth-dark-green data-[state=active]:text-white"
                >
                  Perkebunan
                </TabsTrigger>
              </TabsList>

              {['all', 'pangan', 'perkebunan'].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="mt-0">
                  <div className="border-earth-medium-green overflow-hidden rounded-md border-2 shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-earth-medium-green/20">
                          <TableHead className="text-earth-dark-green font-bold">
                            Komoditas
                          </TableHead>
                          <TableHead className="text-earth-dark-green font-bold">Harga</TableHead>
                          <TableHead className="text-earth-dark-green font-bold">Grade</TableHead>
                          <TableHead className="text-earth-dark-green font-bold">
                            Prediksi Perubahan
                          </TableHead>
                          <TableHead className="text-earth-dark-green font-bold">Wilayah</TableHead>
                          <TableHead className="text-earth-dark-green font-bold">
                            Terakhir Diperbarui
                          </TableHead>
                          <TableHead className="text-earth-dark-green text-center font-bold">
                            Detail
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCommodityPrices.length > 0 ? (
                          filteredCommodityPrices.map((price) => (
                            <TableRow key={price.id} className="hover:bg-earth-pale-green/50">
                              <TableCell className="text-earth-dark-green font-medium">
                                {price.name}
                              </TableCell>
                              <TableCell className="text-earth-dark-green font-medium">
                                {formatCurrency(price.price)}/{price.unit}
                              </TableCell>
                              <TableCell className="text-earth-dark-green font-medium">
                                {price.grade || '-'}
                              </TableCell>
                              <TableCell>{getTrendIndicator(price.predictedChange)}</TableCell>
                              <TableCell className="text-earth-dark-green flex items-center gap-1">
                                <MapPin className="text-earth-dark-green h-4 w-4" />
                                {price.region}
                              </TableCell>
                              <TableCell className="text-earth-dark-green">
                                {formatDate(price.updatedAt)}
                              </TableCell>
                              <TableCell className="text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRowClick(price)}
                                        className="hover:bg-earth-pale-green"
                                      >
                                        <Eye className="text-earth-dark-green hover:text-earth-medium-green h-4 w-4 transition-colors" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Lihat detail harga</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-earth-dark-green py-8 text-center font-medium"
                            >
                              Tidak ada harga komoditas yang ditemukan
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Commodity Price Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {selectedCommodity && (
            <CommodityPriceDetail
              commodity={selectedCommodity}
              priceHistory={commodityPriceHistory[selectedCommodity.id] || []}
              regionalComparison={regionalPriceComparison[selectedCommodity.id] || []}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Harga;
