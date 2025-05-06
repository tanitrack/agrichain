import { useState } from 'react';
import { BarChart3, ShoppingCart, Wallet, Leaf, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { transactions, commodities, commodityPrices, currentUser } from '@/lib/data/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { useAuthCheck } from '@/hooks/use-auth-check';

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

  const { userProfile } = useAuthCheck();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-earth-dark-green">
              {t('dashboard.title')}
            </h1>
            <h2>Selamat datang kembali {userProfile.name}👋</h2>
          </div>
          {/* <Tabs
            value={timeframe}
            onValueChange={(value) => setTimeframe(value as any)}
            className="w-auto"
          >
            <TabsList className="grid w-[300px] grid-cols-4 bg-earth-pale-green">
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
          </Tabs> */}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="earth-card-green shadow-md">
            <div className="absolute right-0 top-0 p-3">
              <ShoppingCart className="h-6 w-6 text-earth-dark-green opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-earth-dark-green">
                {t('dashboard.summary')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-earth-dark-green">
                {formatCurrency(totalSales)}
              </div>
              <p className="mt-1 text-sm font-medium text-earth-dark-green">
                {completedTransactions.length} {t('transactions.completed').toLowerCase()}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-earth-pale-green">
                <div
                  className="h-2 rounded-full bg-earth-dark-green"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="earth-card-brown shadow-md">
            <div className="absolute right-0 top-0 p-3">
              <Leaf className="h-6 w-6 text-earth-brown opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-earth-brown">
                {t('commodities.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-earth-brown">{totalCommodities} kg</div>
              <p className="mt-1 text-sm font-medium text-earth-brown">
                {commodities.length} {t('commodities.type').toLowerCase()}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-earth-light-brown">
                <div className="h-2 rounded-full bg-earth-brown" style={{ width: '60%' }}></div>
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
              <Wallet className="h-6 w-6 text-blue-700 opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-blue-800">
                {t('balance.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(currentUser.balance)}
              </div>
              <p className="mt-1 text-sm font-medium text-blue-700">
                5 SOL (≈ {formatCurrency(currentUser.balance)})
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-blue-100">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: '85%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          // className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-1"
        >
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
                      <th className="h-12 px-4 text-left align-middle font-bold text-earth-dark-green">
                        {t('transactions.commodity')}
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-bold text-earth-dark-green">
                        {t('transactions.buyer')}
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-bold text-earth-dark-green">
                        {t('transactions.date')}
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-bold text-earth-dark-green">
                        {t('transactions.status')}
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-bold text-earth-dark-green">
                        {t('transactions.total')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b transition-colors hover:bg-earth-pale-green/40"
                      >
                        <td className="p-4 align-middle font-medium text-earth-dark-green">
                          {transaction.commodityName}
                        </td>
                        <td className="p-4 align-middle text-earth-dark-green">
                          {transaction.buyerName}
                        </td>
                        <td className="p-4 align-middle text-earth-dark-green">
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
                        <td className="p-4 text-right align-middle font-bold text-earth-dark-green">
                          {formatCurrency(transaction.totalPrice || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {/* <Card className="border-none shadow-md lg:col-span-3">
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
                    className="flex items-center rounded-lg p-3 transition-colors hover:bg-earth-light-brown/20"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold leading-none text-earth-dark-green">
                        {commodity.name} ({commodity.grade})
                      </p>
                      <p className="text-sm font-medium text-earth-brown">{commodity.region}</p>
                    </div>
                    <div className="text-sm font-bold text-earth-dark-green">
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
                  className="inline-flex items-center gap-1 text-sm font-bold text-earth-brown hover:text-earth-dark-green"
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
          </Card> */}
        </div>

        {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    className="flex items-center rounded-lg p-3 transition-colors hover:bg-earth-pale-green/30"
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-earth-medium-green/20 text-earth-dark-green">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold leading-none text-earth-dark-green">
                        {commodity.name}
                      </p>
                      <p className="text-sm font-medium text-earth-medium-green">
                        {commodity.type} - Grade {commodity.grade}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-earth-dark-green">
                      {commodity.quantity} {commodity.unit}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-3">
                <a
                  href="/komoditas"
                  className="inline-flex items-center gap-1 text-sm font-bold text-earth-medium-green hover:text-earth-dark-green"
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
                    className="flex items-center rounded-lg p-3 transition-colors hover:bg-earth-pale-green/30"
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-earth-medium-green/30 text-earth-dark-green">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold leading-none text-earth-dark-green">
                        {transaction.commodityName}
                      </p>
                      <p className="text-sm font-medium text-earth-medium-green">
                        {transaction.buyerName}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-earth-dark-green">
                      {transaction.quantity} {transaction.unit}
                    </div>
                    <div className="ml-4 rounded-full bg-earth-dark-green px-2.5 py-1 text-xs font-medium text-white">
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
                  className="inline-flex items-center gap-1 text-sm font-bold text-earth-medium-green hover:text-earth-dark-green"
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
        </div> */}
      </div>
    </MainLayout>
  );
}
