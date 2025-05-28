import { BarChart3, ShoppingCart, Wallet, Sun, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/main-layout';
import { transactions, commodityPrices, currentUser } from '@/lib/data/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useEffect } from 'react';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { userProfile } = useAuthCheck();

  //handling browser extension errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('ethereum') ||
        event.message?.includes('runtime.lastError') ||
        event.message?.includes('Could not establish connection')) {
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('runtime.lastError') ||
        event.reason?.message?.includes('Could not establish connection')) {
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Calculate total commodities
  const getFarmOrderSummary = useQuery(api.komoditas_queries.getFarmerOrderSummary, userProfile?._id ? { farmerId: userProfile._id } : "skip");

  // Calculate completed orders summary - untuk card sales
  const getCompletedOrderSummary = useQuery(
    api.komoditas_queries.getFarmerCompletedOrderSummary,
    userProfile?._id ? { farmerId: userProfile._id } : "skip"
  );

  // Calculate pending orders summary
  const getPendingOrderSummary = useQuery(
    api.komoditas_queries.getFarmerPendingOrderSummary,
    userProfile?._id ? { farmerId: userProfile._id } : "skip"
  );

  const farmerOrdersWithDetails = useQuery(
    api.komoditas_queries.getFarmerOrdersWithDetails,
    userProfile?._id ? { farmerId: userProfile._id, limit: 5 } : "skip"
  );

  const waitingOrdersCount = getPendingOrderSummary?.waitingOrders ?? 0;
  const shippedOrdersCount = getPendingOrderSummary?.shippedOrders ?? 0;

  const totalCommoditiesFromOrder = getFarmOrderSummary?.totalQuantity ?? 0;
  const commodityTypesFromOrder = getFarmOrderSummary?.distinctCommodities ?? 0;

  // Data untuk sales card dari completed orders
  const totalSalesAmount = getCompletedOrderSummary?.totalAmount ?? 0;
  const totalSalesTransactions = getCompletedOrderSummary?.totalTransactions ?? 0;

  // Get pending transactions
  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status !== 'selesai' && transaction.status !== 'dibatalkan'
  );

  // Get trending commodities
  const trendingCommodities = [...commodityPrices]
    .sort((a, b) => b.predictedChange - a.predictedChange)
    .slice(0, 3);

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
                {formatCurrency(totalSalesAmount)}
              </div>
              <p className="mt-1 text-sm font-medium text-earth-dark-green">
                {totalSalesTransactions} {t('transactions.completed').toLowerCase()}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-earth-pale-green">
                <div
                  className="h-2 rounded-full bg-earth-dark-green"
                  style={{ width: '0%' }}
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
                <div className="text-2xl font-bold text-earth-brown">
                  {getFarmOrderSummary === undefined ? (
                    <div className="animate-pulse bg-earth-light-brown h-8 w-20 rounded"></div>
                  ) : (
                    `${totalCommoditiesFromOrder} kg`
                  )}
                </div>
                <div className="mt-1 text-sm font-medium text-earth-brown">
                  {getFarmOrderSummary === undefined ? (
                    <div className="animate-pulse bg-earth-light-brown h-4 w-16 rounded"></div>
                  ) : (
                    `${commodityTypesFromOrder} ${t('commodities.type').toLowerCase()}`
                  )}
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-earth-light-brown">
                  <div className="h-2 rounded-full bg-earth-brown" style={{ width: '10%' }}></div>
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
              <div className="text-2xl font-bold text-yellow-800">{waitingOrdersCount}</div>
              <p className="mt-1 text-sm font-medium text-yellow-700">
                {shippedOrdersCount} {t('transactions.inDelivery')}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-yellow-100">
                <div className="h-2 rounded-full bg-yellow-600" style={{ width: '20%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="earth-card-clay shadow-md">
            <div className="absolute right-0 top-0 p-3">
              <Wallet className="h-6 w-6 text-blue-700 opacity-60" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-blue-800">
                Debt Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">
                ??
              </div>
              <p className="mt-1 text-sm font-medium text-blue-700">
                Comming soon!
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-blue-100">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: '85%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div
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
                    {farmerOrdersWithDetails ? (
                      farmerOrdersWithDetails.length > 0 ? (
                        farmerOrdersWithDetails.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b transition-colors hover:bg-earth-pale-green/40"
                          >
                            <td className="p-4 align-middle font-medium text-earth-dark-green">
                              {order.commodityName}
                            </td>
                            <td className="p-4 align-middle text-earth-dark-green">
                              {order.buyerName}
                            </td>
                            <td className="p-4 align-middle text-earth-dark-green">
                              {formatDate(new Date(order.createdAt))}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center">
                                <div
                                  className={`mr-2 h-2.5 w-2.5 rounded-full ${order.status === 'completed'
                                    ? 'bg-green-600'
                                    : order.status === 'cancelled'
                                      ? 'bg-red-600'
                                      : order.status === 'shipped'
                                        ? 'bg-blue-600'
                                        : 'bg-yellow-600'
                                    }`}
                                />
                                <span
                                  className={`font-medium capitalize ${order.status === 'completed'
                                    ? 'text-green-700'
                                    : order.status === 'cancelled'
                                      ? 'text-red-700'
                                      : order.status === 'shipped'
                                        ? 'text-blue-700'
                                        : 'text-yellow-700'
                                    }`}
                                >
                                  {language === 'id'
                                    ? order.status === 'completed'
                                      ? 'selesai'
                                      : order.status === 'shipped'
                                        ? 'dikirim'
                                        : order.status === 'awaiting_escrow_payment'
                                          ? 'menunggu pembayaran'
                                          : order.status === 'awaiting_confirmation'
                                            ? 'menunggu konfirmasi'
                                            : order.status
                                    : order.status === 'awaiting_escrow_payment'
                                      ? 'awaiting payment'
                                      : order.status === 'awaiting_confirmation'
                                        ? 'awaiting confirmation'
                                        : order.status.replace('_', ' ')
                                  }
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-right align-middle font-bold text-earth-dark-green">
                              {formatCurrency(order.totalAmount || 0)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-earth-dark-green">
                            {t('transactions.noData')}
                          </td>
                        </tr>
                      )
                    ) : (
                      // Loading state
                      Array.from({ length: 3 }).map((_, index) => (
                        <tr key={index}>
                          <td className="p-4">
                            <div className="animate-pulse bg-earth-light-brown h-4 w-24 rounded"></div>
                          </td>
                          <td className="p-4">
                            <div className="animate-pulse bg-earth-light-brown h-4 w-32 rounded"></div>
                          </td>
                          <td className="p-4">
                            <div className="animate-pulse bg-earth-light-brown h-4 w-20 rounded"></div>
                          </td>
                          <td className="p-4">
                            <div className="animate-pulse bg-earth-light-brown h-4 w-16 rounded"></div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="animate-pulse bg-earth-light-brown h-4 w-24 rounded ml-auto"></div>
                          </td>
                        </tr>
                      ))
                    )}
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
