import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, ShoppingCart, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { transactions } from '@/lib/data/mock-data'; // Import transactions from mockData
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';

const TransaksiPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((transaction) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === '' ||
      transaction.commodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.buyerName.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply tab filter
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending')
      return (
        matchesSearch &&
        ['menunggu_konfirmasi', 'dikonfirmasi', 'negosiasi'].includes(transaction.status)
      );
    if (activeTab === 'processed')
      return (
        matchesSearch &&
        ['dibayar', 'persiapan_pengiriman', 'sedang_dikirim'].includes(transaction.status)
      );
    if (activeTab === 'completed')
      return matchesSearch && ['sudah_dikirim', 'diterima', 'selesai'].includes(transaction.status);
    if (activeTab === 'cancelled') return matchesSearch && transaction.status === 'dibatalkan';
    return matchesSearch;
  });

  // Get status badge style based on status
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      menunggu_konfirmasi: {
        label: t('status.pending'),
        className: 'bg-blue-100 text-blue-800',
      },
      dikonfirmasi: {
        label: t('status.confirmed'),
        className: 'bg-earth-light-brown text-earth-brown',
      },
      negosiasi: {
        label: t('status.negotiating'),
        className: 'bg-earth-clay text-earth-brown',
      },
      dibayar: {
        label: t('status.paid'),
        className: 'bg-earth-light-green text-earth-dark-green',
      },
      persiapan_pengiriman: {
        label: t('status.processing'),
        className: 'bg-earth-light-green/70 text-earth-dark-green',
      },
      sedang_dikirim: {
        label: t('status.shipping'),
        className: 'bg-earth-medium-green/30 text-earth-dark-green',
      },
      sudah_dikirim: {
        label: t('status.shipped'),
        className: 'bg-earth-medium-green/60 text-earth-dark-green',
      },
      diterima: {
        label: t('status.received'),
        className: 'bg-earth-medium-green/90 text-white',
      },
      selesai: {
        label: t('status.completed'),
        className: 'bg-green-100 text-green-800',
      },
      dibatalkan: {
        label: t('status.canceled'),
        className: 'bg-red-100 text-red-800',
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={`${statusInfo.className} rounded-full px-2 py-1 text-xs`}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold text-earth-dark-green">{t('transactions.title')}</h1>
        <p className="text-earth-medium-green">{t('transactions.subtitle')}</p>
      </div>

      <Card className="">
        <CardHeader className="earth-header-forest pb-3">
          <CardTitle className="mb-4 flex items-center text-lg text-white">
            <ShoppingCart className="mr-2 h-5 w-5" />

            {t('transactions.list')}
          </CardTitle>
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-earth-dark-green" />
              <Input
                type="search"
                placeholder={t('transactions.search')}
                className="border-earth-medium-green pl-8 focus:ring-2 focus:ring-earth-dark-green"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md ">
            <Table>
              <TableHeader className="bg-earth-light-green/30">
                <TableRow>
                  <TableHead className="text-earth-dark-green">{t('transactions.id')}</TableHead>
                  <TableHead className="text-earth-dark-green">{t('transactions.buyer')}</TableHead>
                  <TableHead className="hidden text-earth-dark-green md:table-cell">
                    {t('transactions.commodity')}
                  </TableHead>
                  <TableHead className="hidden text-earth-dark-green lg:table-cell">
                    {t('transactions.quantity')}
                  </TableHead>
                  <TableHead className="hidden text-earth-dark-green lg:table-cell">
                    {t('transactions.status')}
                  </TableHead>
                  <TableHead className="text-earth-dark-green">{t('transactions.date')}</TableHead>
                  <TableHead className="text-earth-dark-green">{t('transactions.total')}</TableHead>
                  <TableHead className="text-right text-earth-dark-green">
                    {t('action.details')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.buyerName}</TableCell>
                    <TableCell>
                      {transaction.commodityName}
                      <div className="mt-1 text-xs text-earth-medium-green">
                        {transaction.type === 'order_book'
                          ? 'Order Book'
                          : t('transactions.regular')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.quantity.toLocaleString()} {transaction.unit}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{formatDate(new Date(transaction.createdAt))}</TableCell>
                    <TableCell className="text-right">
                      {transaction.totalPrice ? formatCurrency(transaction.totalPrice) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/transaction/${transaction.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {/* {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item) => (
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
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-earth-medium-green">
                      {searchQuery
                        ? `${t('prices.notfound')} "${searchQuery}"`
                        : `${t('prices.notfound')}.`}
                    </TableCell>
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default TransaksiPage;
