import { MainLayout } from '@/components/layout/main-layout';
import { useLanguage } from '@/contexts/language-context';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthCheck } from '@/hooks/use-auth-check';
import OrderTable from '@/components/orderbook/OrderTable';

/**
 * OrderBook page - lists all orders for the logged-in user (as buyer or seller)
 * Uses the new OrderTable component for display.
 */
export default function OrderBookPage() {
  const { t } = useLanguage();

  // Get logged-in user info
  const { userProfile } = useAuthCheck();
  const userId = userProfile?._id;
  const isSeller = userProfile?.userType === 'farmer';
  const isBuyer = userProfile?.userType === 'consumer';

  // Fetch orders where the logged-in user is the seller
  const sellerOrders = useQuery(
    api.orderbook_queries.listBySeller,
    isSeller ? { sellerId: userId } : 'skip'
  );
  // Fetch orders where the logged-in user is the buyer
  const buyerOrders = useQuery(
    api.orderbook_queries.listByBuyer,
    isBuyer ? { buyerId: userId } : 'skip'
  );

  // Combine orders
  const allOrders = [...(sellerOrders || []), ...(buyerOrders || [])];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-dark-green">{t('orderbook.title')}</h1>
          <p className="text-earth-medium-green">{t('orderbook.subtitle')}</p>
        </div>
      </div>
      <OrderTable orders={allOrders} isBuyer={isBuyer} isSeller={isSeller} />
    </MainLayout>
  );
}
