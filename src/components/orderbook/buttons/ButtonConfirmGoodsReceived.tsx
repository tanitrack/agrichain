import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { OrderBookType } from '@/types/order-book';

/**
 * ButtonConfirmGoodsReceived
 * Renders the Confirm Goods Received button for buyers when the order is shipped.
 * Handles its own loading state and mutation logic.
 * Returns null if not buyer or status is not correct.
 */
export default function ButtonConfirmGoodsReceived({ order }: { order: OrderBookType }) {
  const { userProfile } = useAuthCheck();
  const userId = userProfile?._id;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const buyerConfirmsGoodsReceiptMutation = useMutation(api.orderbook_mutations.buyerConfirmsGoodsReceipt);

  const isBuyer = order.buyerId === userId;
  const canConfirmReceipt = order.status === 'shipped';

  if (!isBuyer || !canConfirmReceipt) return null;

  const handleConfirmReceipt = async () => {
    setLoading(true);
    toast({ title: 'Processing Confirmation...', description: 'Please wait.' });
    try {
      await buyerConfirmsGoodsReceiptMutation({ orderBookId: order._id });
      toast({ title: 'Goods Receipt Confirmed!', description: 'Thank you for confirming receipt.' });
    } catch (error: unknown) {
      let message = 'Failed to confirm goods receipt.';
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
      className="text-green-600"
      onClick={handleConfirmReceipt}
      disabled={loading}
      aria-busy={loading}
      aria-label="Confirm Goods Received"
    >
      {loading ? (
        <span className="animate-pulse">…</span>
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
    </Button>
  );
}
