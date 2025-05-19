import { useState } from 'react';
import { useQuery } from 'convex/react';
import { MainLayout } from '@/components/layout/main-layout';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { type CommodityPrice } from '@/lib/data/types';
import { CommodityPriceDetail } from '@/components/commodity/commodity-price-detail';
import type { PriceItem } from '@/components/price/price-row';
import { PriceTable } from '@/components/price/price-table';
import { api } from '@/lib/convex';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/language-context';

interface ConvexPrice {
  _id: string;
  _creationTime: number;
  name: string;
  price: string;
  unit: string;
  prediction: string;
  region?: string;
  grade: string;
  updatedAt: number;
}

const mapToPriceItem = (item: ConvexPrice): PriceItem => ({
  // Pass through all Convex fields
  _id: item._id,
  _creationTime: item._creationTime,
  name: item.name,
  price: item.price,
  unit: item.unit,
  prediction: item.prediction,
  region: item.region,
  updatedAt: item.updatedAt,
  grade: item.grade,
});

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
};

const Harga = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<CommodityPrice | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);

  // Fetch komoditas data using Convex query
  const priceData = useQuery(api.harga_komoditas_queries.list, {
    paginationOpts: {
      numItems: 10,
      cursor: null,
    },
  }) || { page: [], isDone: true, continueCursor: null };

  // Use search query if there's a search term
  const searchResults = useQuery(
    api.harga_komoditas_queries.search,
    searchQuery ? { query: searchQuery } : 'skip'
  );

  const displayData =
    searchQuery && searchResults
      ? searchResults.map(mapToPriceItem)
      : priceData.page.map(mapToPriceItem);

  const handleViewDetail = (id: string) => {
    navigate(`/harga/${id}`);
  };

  // Get unique regions for filter

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
    setSelectedPrice(commodity);
    setIsDetailDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-earth-dark-green">{t('prices.title')}</h1>
        <p className="font-medium text-earth-medium-green">{t('prices.subtitle')}</p>
      </div>

      <PriceTable
        data={displayData}
        onViewDetail={handleViewDetail}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
        onShowQR={(id) => {
          const item = displayData.find((k) => k._id === id);
          if (item) {
            setQrCodeDialogOpen(true);
          }
        }}
        searchQuery={searchQuery}
      />

      {/* Commodity Price Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {selectedPrice && (
            <CommodityPriceDetail
              commodity={selectedPrice}
              priceHistory={commodityPriceHistory[selectedPrice.id] || []}
              regionalComparison={regionalPriceComparison[selectedPrice.id] || []}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Harga;
