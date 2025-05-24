import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { OrderBookType } from '@/types/order-book';

/**
 * ButtonMarkAsShipped
 * Renders the Mark as Shipped button for sellers when the order is ready to ship.
 * Handles its own loading state and mutation logic.
 * Returns null if not seller or status is not correct.
 */
export default function ButtonMarkAsShipped({ order }: { order: OrderBookType }) {
  const { userProfile } = useAuthCheck();
  const userId = userProfile?._id;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const markAsShippedMutation = useMutation(api.orderbook_mutations.markAsShipped);

  const isSeller = order.sellerId === userId;
  const canMarkAsShipped = order.status === 'seller_confirmed_awaiting_shipment';

  if (!isSeller || !canMarkAsShipped) return null;

  const handleMarkAsShipped = async () => {
    setLoading(true);
    toast({ title: 'Processing Shipment...', description: 'Please wait.' });
    try {
      await markAsShippedMutation({ orderBookId: order._id });
      toast({ title: 'Order Marked as Shipped!', description: 'Status updated in TaniTrack.' });
    } catch (error: unknown) {
      let message = 'Failed to mark order as shipped.';
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = 'Unknown error occurred.';
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-blue-600"
      onClick={handleMarkAsShipped}
      disabled={loading}
      aria-busy={loading}
      aria-label="Mark as Shipped"
      title="Mark as Shipped"
    >
      {loading ? <span className="animate-pulse">…</span> : <Package className="h-4 w-4" />}
    </Button>
  );
}
