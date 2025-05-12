import { Filter, Package, Search } from 'lucide-react';
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
import { KomoditasRow, type KomoditasItem } from './komoditas-row';
import { Input } from '../ui/input';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface KomoditasTableProps {
  data: KomoditasItem[];
  onViewDetail: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShowQR?: (id: string) => void;
}

export const KomoditasTable = ({
  data,
  onViewDetail,
  onEdit,
  onDelete,
  onShowQR,
}: KomoditasTableProps) => {
  const { t, language } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  console.log('====================================');
  console.log('DATA ---> ', data);
  console.log('====================================');

  return (
    <Card className="">
      <CardHeader className="earth-header-forest pb-3">
        <CardTitle className="mb-4 flex items-center text-lg text-white">
          <Package className="mr-2 h-5 w-5" />
          {t('commodities.list')}
        </CardTitle>
        <div className=" flex flex-col justify-between gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t('commodities.search')}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className=" flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" className="flex gap-2 text-tani-green-dark">
              <Filter className="h-4 w-4" />
              {language === 'id' ? 'Filter' : 'Filter'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="">
          <Table>
            <TableHeader className="bg-earth-light-green/30">
              <TableRow>
                <TableHead className="text-earth-dark-green">{t('commodities.name')}</TableHead>
                <TableHead className="text-earth-dark-green">{t('commodities.type')}</TableHead>
                <TableHead className="hidden text-earth-dark-green md:table-cell">
                  {t('commodities.quantity')}
                </TableHead>
                <TableHead className="hidden text-earth-dark-green lg:table-cell">
                  {t('commodities.location')}
                </TableHead>
                <TableHead className="text-earth-dark-green">{t('commodities.grade')}</TableHead>
                <TableHead className="text-right text-earth-dark-green">
                  {t('commodities.action')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <KomoditasRow
                    key={item.id}
                    item={item}
                    onViewDetail={onViewDetail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onShowQR={onShowQR}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-earth-medium-green">
                    {searchQuery
                      ? `${t('commodities.notfound')} "${searchQuery}"`
                      : `${t('commodities.notfound')}. ${t('commodities.add')} to get started.`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
