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
import { Plus, Eye, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/language-context';
import { formatDate, formatCurrency } from '@/lib/utils';
import { transactions } from '@/lib/data/mock-data'; // Import transactions from mockData
import { Input } from '@/components/ui/input';

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
      <div className="mb-8">
        <h1 className="text-earth-dark-green text-2xl font-bold">{t('transactions.title')}</h1>
        <p className="text-gray-600">{t('transactions.subtitle')}</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-earth-dark-green mr-2 h-5 w-5"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            {t('transactions.list')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('transactions.search')}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  {t('action.filter')}
                </Button>
                <Button className="bg-earth-dark-green hover:bg-earth-medium-green">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('transactions.new')}
                </Button>
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto py-2 sm:flex-row">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
                className={
                  activeTab === 'all' ? 'bg-earth-dark-green hover:bg-earth-medium-green' : ''
                }
              >
                {t('transactions.all')}
              </Button>
              <Button
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                onClick={() => setActiveTab('pending')}
                className={
                  activeTab === 'pending' ? 'bg-earth-dark-green hover:bg-earth-medium-green' : ''
                }
              >
                {t('transactions.pending')}
              </Button>
              <Button
                variant={activeTab === 'processed' ? 'default' : 'outline'}
                onClick={() => setActiveTab('processed')}
                className={
                  activeTab === 'processed' ? 'bg-earth-dark-green hover:bg-earth-medium-green' : ''
                }
              >
                {t('transactions.processed')}
              </Button>
              <Button
                variant={activeTab === 'completed' ? 'default' : 'outline'}
                onClick={() => setActiveTab('completed')}
                className={
                  activeTab === 'completed' ? 'bg-earth-dark-green hover:bg-earth-medium-green' : ''
                }
              >
                {t('transactions.completed')}
              </Button>
              <Button
                variant={activeTab === 'cancelled' ? 'default' : 'outline'}
                onClick={() => setActiveTab('cancelled')}
                className={
                  activeTab === 'cancelled' ? 'bg-earth-dark-green hover:bg-earth-medium-green' : ''
                }
              >
                {t('transactions.canceled')}
              </Button>
            </div>

            <div className="rounded-md border">
              {filteredTransactions.length > 0 ? (
                <Table>
                  <TableHeader className="bg-earth-dark-green/50">
                    <TableRow>
                      <TableHead className="text-earth-dark-green font-semibold">
                        {t('transactions.id')}
                      </TableHead>
                      <TableHead className="text-earth-dark-green font-semibold">
                        {t('transactions.buyer')}
                      </TableHead>
                      <TableHead className="text-earth-dark-green font-semibold">
                        {t('transactions.commodity')}
                      </TableHead>
                      <TableHead className="text-earth-dark-green font-semibold">
                        {t('transactions.quantity')}
                      </TableHead>
                      <TableHead className="text-earth-dark-green font-semibold">
                        {t('transactions.status')}
                      </TableHead>
                      <TableHead className="text-earth-dark-green font-semibold">
                        {t('transactions.date')}
                      </TableHead>
                      <TableHead className="text-earth-dark-green text-right font-semibold">
                        {t('transactions.total')}
                      </TableHead>
                      <TableHead className="text-earth-dark-green text-right font-semibold">
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
                          <div className="text-earth-medium-green mt-1 text-xs">
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
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-earth-medium-green mb-4">{t('transactions.empty')}</p>
                  <Button className="bg-earth-dark-green hover:bg-earth-medium-green">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('transactions.new')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default TransaksiPage;
