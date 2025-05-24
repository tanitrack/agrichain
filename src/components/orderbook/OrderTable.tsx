import type { OrderBookType } from '@/types/order-book';
import OrderRow from './OrderRow';
import { Filter, Package, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/language-context';
interface OrderTableProps {
  orders: OrderBookType[];
  isSeller: boolean;
  isBuyer: boolean;
}

export default function OrderTable({ orders, isBuyer, isSeller }: OrderTableProps) {
  const { t, language } = useLanguage();

  return (
    <Card className="">
      <CardHeader className="earth-header-forest pb-3">
        <CardTitle className="mb-4 flex items-center text-lg text-white">
          <Package className="mr-2 h-5 w-5" />
          {t('orderbook.list')}
        </CardTitle>
        <div className=" flex flex-col justify-between gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder={t('orderbook.search')} className="pl-8" />
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
                <TableHead className="text-earth-dark-green">{t('orderbook.id')}</TableHead>
                <TableHead className="text-earth-dark-green">
                  {isSeller && t('orderbook.seller')}
                  {isBuyer && t('orderbook.buyer')}
                </TableHead>
                <TableHead className="hidden text-earth-dark-green md:table-cell">
                  {t('orderbook.commodity')}
                </TableHead>
                <TableHead className="hidden text-earth-dark-green lg:table-cell">
                  {t('orderbook.quantity')}
                </TableHead>
                <TableHead className="text-earth-dark-green">{t('orderbook.amount')}</TableHead>
                <TableHead className="text-earth-dark-green">{t('orderbook.status')}</TableHead>
                <TableHead className="text-right text-earth-dark-green">
                  {t('orderbook.action')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => <OrderRow key={order._id} order={order} />)
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No order found.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
