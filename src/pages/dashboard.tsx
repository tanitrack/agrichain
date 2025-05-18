import { BarChart3, ShoppingCart, Wallet, Sun, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { transactions, commodities, commodityPrices, currentUser } from '@/lib/data/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { useAuthCheck } from '@/hooks/use-auth-check';

export default function Dashboard() {
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

            <h2>
              {t('dashboard.welcome')} {userProfile?.name}👋
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="earth-card-green shadow-md">
            <div className="absolute right-0 top-0 p-3">
              <ShoppingCart className="h-6 w-6 text-earth-dark-green opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-earth-dark-green">
                {userProfile?.userType === 'farmer'
                  ? t('dashboard.summary')
                  : t('dashboard.expenseSummary')}
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

          {userProfile?.userType === 'farmer' && (
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
          )}

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
                {t('transactions.inDelivery')}
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
        </div>
      </div>
    </MainLayout>
  );
}
