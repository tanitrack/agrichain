import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/language-context';
import { PriceRow, type PriceItem } from './price-row';
import { Filter, Search, TrendingUp } from 'lucide-react';
import { Input } from '../ui/input';
import { CommodityPrice } from '@/lib/data/types';
import { Button } from '../ui/button';

interface PriceTableProps {
  data: PriceItem[];
  onViewDetail: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShowQR?: (id: string) => void;
  searchQuery?: string;
}

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

export const PriceTable = ({
  data,
  onViewDetail,
  onEdit,
  onDelete,
  onShowQR,
  searchQuery,
}: PriceTableProps) => {
  const { t } = useLanguage();

  // const [regionFilter, setRegionFilter] = useState('all');
  // const [trendFilter, setTrendFilter] = useState('all');
  // // Get unique regions for filter
  // const regions = ['all', ...new Set(commodityPrices.map((price) => price.region))];

  return (
    <Card className="">
      <CardHeader className="earth-header-forest pb-3">
        <CardTitle className="mb-4 flex items-center text-lg text-white">
          <TrendingUp className="mr-2 h-5 w-5" />
          {t('prices.title')}
        </CardTitle>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-earth-dark-green" />
            <Input
              type="search"
              placeholder={t('prices.searchPlaceholder')}
              className="border-earth-medium-green pl-8 focus:ring-2 focus:ring-earth-dark-green"
              value={searchQuery}
              onChange={(e) => {}}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full border-earth-medium-green bg-white text-earth-dark-green sm:w-[180px]">
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
            </Select> */}
            {/* <Select value={trendFilter} onValueChange={setTrendFilter}>
              <SelectTrigger className="w-full border-earth-medium-green bg-white text-earth-dark-green sm:w-[180px]">
                <SelectValue placeholder="Filter Tren" />
              </SelectTrigger>
              <SelectContent className="border-earth-light-green">
                <SelectItem value="all">Semua Tren</SelectItem>
                <SelectItem value="rising">Naik</SelectItem>
                <SelectItem value="falling">Turun</SelectItem>
                <SelectItem value="stable">Stabil</SelectItem>
              </SelectContent>
            </Select> */}
            <Button
              variant="outline"
              className="flex gap-2 border-earth-medium-green bg-earth-pale-green text-earth-dark-green hover:bg-earth-light-green/40"
            >
              <Filter className="h-4 w-4" />
              {t('action.filter')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md ">
          <Table>
            <TableHeader className="bg-earth-light-green/30">
              <TableRow>
                <TableHead className="text-earth-dark-green">{t('prices.name')}</TableHead>
                <TableHead className="text-earth-dark-green">{t('prices.price')}</TableHead>
                <TableHead className="hidden text-earth-dark-green md:table-cell">
                  {t('prices.unit')}
                </TableHead>
                <TableHead className="hidden text-earth-dark-green lg:table-cell">
                  {t('prices.forecast')}
                </TableHead>
                <TableHead className="text-earth-dark-green">{t('prices.grade')}</TableHead>
                {/* <TableHead className="text-earth-dark-green">{t('prices.region')}</TableHead> */}
                <TableHead className="text-right text-earth-dark-green">
                  {t('prices.action')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <PriceRow
                    key={item._id}
                    item={item}
                    onViewDetail={onViewDetail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onShowQR={onShowQR}
                  />
                ))
              ) : (
                <TableCell colSpan={7} className="py-8 text-center text-earth-medium-green">
                  {searchQuery
                    ? `${t('prices.notfound')} "${searchQuery}"`
                    : `${t('prices.notfound')}.`}
                </TableCell>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
