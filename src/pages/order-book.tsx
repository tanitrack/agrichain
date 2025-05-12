import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Fetch orders where the logged-in user is the seller
  const sellerOrders = useQuery(
    api.orderbook_queries.listBySeller,
    userId ? { sellerId: userId } : 'skip'
  );
  // Fetch orders where the logged-in user is the buyer
  const buyerOrders = useQuery(
    api.orderbook_queries.listByBuyer,
    userId ? { buyerId: userId } : 'skip'
  );

  // Combine orders
  const allOrders = [...(sellerOrders || []), ...(buyerOrders || [])];

  return (
    <MainLayout>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t('orderbook.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable orders={allOrders} />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
