import { Package } from 'lucide-react';
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

interface KomoditasTableProps {
  data: KomoditasItem[];
  onViewDetail: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShowQR?: (id: string) => void;
  searchQuery?: string;
}

export const KomoditasTable = ({
  data,
  onViewDetail,
  onEdit,
  onDelete,
  onShowQR,
  searchQuery,
}: KomoditasTableProps) => {
  const { t } = useLanguage();

  return (
    <Card className="earth-card-wheat">
      <CardHeader className="earth-header-forest pb-3">
        <CardTitle className="flex items-center text-lg text-white">
          <Package className="mr-2 h-5 w-5" />
          {t('commodities.list')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-earth-light-green">
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
