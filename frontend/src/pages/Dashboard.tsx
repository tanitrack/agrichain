import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Truck,
  Wallet,
  Leaf,
  Sun,
  CloudRain,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { transactions, commodities, commodityPrices, currentUser } from '@/lib/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const { t, language } = useLanguage();

  // Get completed transactions
  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === 'selesai'
  );

  // Calculate total sales
  const totalSales = completedTransactions.reduce(
    (sum, transaction) => sum + (transaction.totalPrice || 0),
    0
  );

  // Get pending transactions
  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status !== 'selesai' && transaction.status !== 'dibatalkan'
  );

  // Calculate total commodities
  const totalCommodities = commodities.reduce((sum, commodity) => sum + commodity.quantity, 0);

  // Get trending commodities
  const trendingCommodities = [...commodityPrices]
    .sort((a, b) => b.predictedChange - a.predictedChange)
    .slice(0, 3);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-earth-dark-green text-2xl font-bold tracking-tight">
            {t('dashboard.title')}
          </h1>
          <Tabs
            value={timeframe}
            onValueChange={(value) => setTimeframe(value as any)}
            className="w-auto"
          >
            <TabsList className="bg-earth-pale-green grid w-[300px] grid-cols-4">
              <TabsTrigger
                value="day"
                className="data-[state=active]:bg-earth-dark-green data-[state=active]:text-white"
              >
                {t('time.today')}
              </TabsTrigger>
              <TabsTrigger
                value="week"
                className="data-[state=active]:bg-earth-dark-green data-[state=active]:text-white"
              >
                {t('time.thisWeek')}
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="data-[state=active]:bg-earth-dark-green data-[state=active]:text-white"
              >
                {t('time.thisMonth')}
              </TabsTrigger>
              <TabsTrigger
                value="year"
                className="data-[state=active]:bg-earth-dark-green data-[state=active]:text-white"
              >
                {t('time.thisYear')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="earth-card-green shadow-md">
            <div className="absolute right-0 top-0 p-3">
              <ShoppingCart className="text-earth-dark-green h-6 w-6 opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-earth-dark-green text-sm font-bold">
                {t('dashboard.summary')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-earth-dark-green text-2xl font-bold">
                {formatCurrency(totalSales)}
              </div>
              <p className="text-earth-dark-green mt-1 text-sm font-medium">
                {completedTransactions.length} {t('transactions.completed').toLowerCase()}
              </p>
              <div className="bg-earth-pale-green mt-3 h-2 w-full rounded-full">
                <div
                  className="bg-earth-dark-green h-2 rounded-full"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="earth-card-brown shadow-md">
            <div className="absolute right-0 top-0 p-3">
              <Leaf className="text-earth-brown h-6 w-6 opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-earth-brown text-sm font-bold">
                {t('commodities.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-earth-brown text-2xl font-bold">{totalCommodities} kg</div>
              <p className="text-earth-brown mt-1 text-sm font-medium">
                {commodities.length} {t('commodities.type').toLowerCase()}
              </p>
              <div className="bg-earth-light-brown mt-3 h-2 w-full rounded-full">
                <div className="bg-earth-brown h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="earth-card-wheat shadow-md">
            <div className="absolute right-0 top-0 p-3">
              <Sun className="h-6 w-6 text-yellow-700 opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-yellow-800">
                {t('transactions.pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">{pendingTransactions.length}</div>
              <p className="mt-1 text-sm font-medium text-yellow-700">
                {pendingTransactions.filter((t) => t.status === 'negosiasi').length}{' '}
                {language === 'id' ? 'dalam negosiasi' : 'in negotiation'}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-yellow-100">
                <div className="h-2 rounded-full bg-yellow-600" style={{ width: '40%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="earth-card-clay shadow-md">
            <div className="absolute right-0 top-0 p-3">
              <Wallet className="h-6 w-6 text-orange-700 opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-orange-800">
                {t('balance.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">
                {formatCurrency(currentUser.balance)}
              </div>
              <p className="mt-1 text-sm font-medium text-orange-700">
                5 SOL (≈ {formatCurrency(currentUser.balance)})
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-orange-100">
                <div className="h-2 rounded-full bg-orange-600" style={{ width: '85%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="border-none bg-white shadow-md lg:col-span-4">
            <CardHeader className="earth-header-forest">
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5" />
                {t('dashboard.recentTransactions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="bg-earth-medium-green/20">
                    <tr className="border-b transition-colors">
                      <th className="text-earth-dark-green h-12 px-4 text-left align-middle font-bold">
                        {t('transactions.commodity')}
                      </th>
                      <th className="text-earth-dark-green h-12 px-4 text-left align-middle font-bold">
                        {t('transactions.buyer')}
                      </th>
                      <th className="text-earth-dark-green h-12 px-4 text-left align-middle font-bold">
                        {t('transactions.date')}
                      </th>
                      <th className="text-earth-dark-green h-12 px-4 text-left align-middle font-bold">
                        {t('transactions.status')}
                      </th>
                      <th className="text-earth-dark-green h-12 px-4 text-right align-middle font-bold">
                        {t('transactions.total')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-earth-pale-green/40 border-b transition-colors"
                      >
                        <td className="text-earth-dark-green p-4 align-middle font-medium">
                          {transaction.commodityName}
                        </td>
                        <td className="text-earth-dark-green p-4 align-middle">
                          {transaction.buyerName}
                        </td>
                        <td className="text-earth-dark-green p-4 align-middle">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2.5 w-2.5 rounded-full ${
                                transaction.status === 'selesai'
                                  ? 'bg-green-600'
                                  : transaction.status === 'dibatalkan'
                                    ? 'bg-red-600'
                                    : 'bg-yellow-600'
                              }`}
                            />
                            <span
                              className={`font-medium capitalize ${
                                transaction.status === 'selesai'
                                  ? 'text-green-700'
                                  : transaction.status === 'dibatalkan'
                                    ? 'text-red-700'
                                    : 'text-yellow-700'
                              }`}
                            >
                              {language === 'id'
                                ? transaction.status.replace('_', ' ')
                                : transaction.status === 'selesai'
                                  ? 'completed'
                                  : transaction.status === 'dibatalkan'
                                    ? 'cancelled'
                                    : transaction.status === 'negosiasi'
                                      ? 'negotiation'
                                      : transaction.status === 'menunggu_konfirmasi'
                                        ? 'awaiting confirmation'
                                        : transaction.status === 'dikonfirmasi'
                                          ? 'confirmed'
                                          : transaction.status === 'dibayar'
                                            ? 'paid'
                                            : transaction.status === 'persiapan_pengiriman'
                                              ? 'preparing shipment'
                                              : transaction.status === 'sedang_dikirim'
                                                ? 'shipping'
                                                : transaction.status === 'sudah_dikirim'
                                                  ? 'shipped'
                                                  : transaction.status === 'diterima'
                                                    ? 'received'
                                                    : transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="text-earth-dark-green p-4 text-right align-middle font-bold">
                          {formatCurrency(transaction.totalPrice || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md lg:col-span-3">
            <CardHeader className="earth-header-brown">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                {t('prices.trends')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {trendingCommodities.map((commodity) => (
                  <div
                    key={commodity.id}
                    className="hover:bg-earth-light-brown/20 flex items-center rounded-lg p-3 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-earth-dark-green text-sm font-bold leading-none">
                        {commodity.name} ({commodity.grade})
                      </p>
                      <p className="text-earth-brown text-sm font-medium">{commodity.region}</p>
                    </div>
                    <div className="text-earth-dark-green text-sm font-bold">
                      {formatCurrency(commodity.price)}/{commodity.unit}
                    </div>
                    <div
                      className={`ml-4 flex items-center font-bold ${
                        commodity.predictedChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {commodity.predictedChange >= 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="mr-1 h-4 w-4" />
                      )}
                      <span>{Math.abs(commodity.predictedChange)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-3">
                <a
                  href="/harga"
                  className="text-earth-brown hover:text-earth-dark-green inline-flex items-center gap-1 text-sm font-bold"
                >
                  <span>{language === 'id' ? 'Lihat semua harga' : 'View all prices'}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="overflow-hidden border-none bg-white shadow-md">
            <CardHeader className="earth-header-moss">
              <CardTitle className="flex items-center gap-2 text-white">
                <Package className="h-5 w-5" />
                {t('dashboard.commodityStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {commodities.map((commodity) => (
                  <div
                    key={commodity.id}
                    className="hover:bg-earth-pale-green/30 flex items-center rounded-lg p-3 transition-colors"
                  >
                    <div className="bg-earth-medium-green/20 text-earth-dark-green mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-earth-dark-green text-sm font-bold leading-none">
                        {commodity.name}
                      </p>
                      <p className="text-earth-medium-green text-sm font-medium">
                        {commodity.type} - Grade {commodity.grade}
                      </p>
                    </div>
                    <div className="text-earth-dark-green text-sm font-bold">
                      {commodity.quantity} {commodity.unit}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-3">
                <a
                  href="/komoditas"
                  className="text-earth-medium-green hover:text-earth-dark-green inline-flex items-center gap-1 text-sm font-bold"
                >
                  <span>{language === 'id' ? 'Kelola komoditas' : 'Manage commodities'}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none bg-white shadow-md">
            <CardHeader className="earth-header-forest">
              <CardTitle className="flex items-center gap-2 text-white">
                <CloudRain className="h-5 w-5" />
                {t('dashboard.pendingOrders')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {pendingTransactions.slice(0, 4).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="hover:bg-earth-pale-green/30 flex items-center rounded-lg p-3 transition-colors"
                  >
                    <div className="bg-earth-medium-green/30 text-earth-dark-green mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-earth-dark-green text-sm font-bold leading-none">
                        {transaction.commodityName}
                      </p>
                      <p className="text-earth-medium-green text-sm font-medium">
                        {transaction.buyerName}
                      </p>
                    </div>
                    <div className="text-earth-dark-green text-sm font-bold">
                      {transaction.quantity} {transaction.unit}
                    </div>
                    <div className="bg-earth-dark-green ml-4 rounded-full px-2.5 py-1 text-xs font-medium text-white">
                      {language === 'id'
                        ? transaction.status.replace('_', ' ')
                        : transaction.status === 'negosiasi'
                          ? 'negotiation'
                          : transaction.status === 'menunggu_konfirmasi'
                            ? 'awaiting confirmation'
                            : transaction.status === 'dikonfirmasi'
                              ? 'confirmed'
                              : transaction.status === 'dibayar'
                                ? 'paid'
                                : transaction.status === 'persiapan_pengiriman'
                                  ? 'preparing shipment'
                                  : transaction.status === 'sedang_dikirim'
                                    ? 'shipping'
                                    : transaction.status === 'sudah_dikirim'
                                      ? 'shipped'
                                      : transaction.status === 'diterima'
                                        ? 'received'
                                        : transaction.status}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-3">
                <a
                  href="/transaksi"
                  className="text-earth-medium-green hover:text-earth-dark-green inline-flex items-center gap-1 text-sm font-bold"
                >
                  <span>
                    {language === 'id' ? 'Lihat semua transaksi' : 'View all transactions'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
