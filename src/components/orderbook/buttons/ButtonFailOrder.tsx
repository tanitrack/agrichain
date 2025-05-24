import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useConvex } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useEscrowTransaction } from '@/hooks/use-escrow-transaction';
import type { OrderBookType } from '@/types/order-book';

/**
 * ButtonFailOrder
 * Renders the Fail Order button for buyers when eligible.
 * Handles its own loading state and on-chain fail logic.
 * Returns null if not buyer or status is not correct.
 */
export default function ButtonFailOrder({ order }: { order: OrderBookType }) {
  const { userProfile, wallet: dynamicWalletInfo } = useAuthCheck();
  const userId = userProfile?._id;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { failOrder, isLoading: isEscrowActionLoading } = useEscrowTransaction();
  const convex = useConvex();

  const isBuyer = order.buyerId === userId;
  const canFailOrder =
    order.status === 'escrow_funded' || order.status === 'awaiting_seller_confirmation';

  if (!isBuyer || !canFailOrder) return null;

  const handleFailOrder = async () => {
    if (!dynamicWalletInfo?.address) {
      toast({
        title: 'Error',
        description: 'Buyer Solana wallet not available.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    toast({ title: 'Processing Order Failure...', description: 'Please wait.' });
    try {
      const escrowDetails = await convex.query(api.transaction_queries.getEscrowDetailsForAction, {
        orderBookId: order._id,
      });
      if (!escrowDetails?.escrowPdaAddress) {
        throw new Error('Could not fetch escrow details for failing order.');
      }
      toast({
        title: 'Awaiting Wallet Confirmation...',
        description: 'Please confirm the failure in your wallet.',
      });
      await failOrder({
        escrowPda: escrowDetails.escrowPdaAddress,
        actorPublicKey: dynamicWalletInfo.address,
        buyerAccountForRefund: dynamicWalletInfo.address, // Refund to buyer
        onSuccess: (txSig: string) => {
          toast({
            title: 'Order Failed Successfully!',
            description: `Tx: ${txSig.substring(0, 10)}...`,
          });
        },
        onError: (err: unknown) => {
          let message = 'Could not fail order on-chain.';
          if (err instanceof Error) {
            message = err.message;
          } else {
            message = 'Unknown error occurred.';
          }
          toast({
            title: 'Order Failure Failed',
            description: message,
            variant: 'destructive',
          });
        },
        onSubmitted: (txSig: string) => {
          toast({
            title: 'Transaction Submitted',
            description: `Tx: ${txSig.substring(0, 10)}... Awaiting confirmation.`,
          });
        },
      });
    } catch (error: unknown) {
      let message = 'Failed to process order failure.';
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
      className="text-orange-600"
      onClick={handleFailOrder}
      disabled={loading || isEscrowActionLoading}
      aria-busy={loading || isEscrowActionLoading}
      aria-label="Fail Order"
      title="Fail Order"
    >
      {loading || isEscrowActionLoading ? (
        <span className="animate-pulse">…</span>
      ) : (
        <XCircle className="h-4 w-4" />
      )}
    </Button>
  );
}
