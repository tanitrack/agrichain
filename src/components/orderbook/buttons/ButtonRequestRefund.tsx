import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useConvex } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useEscrowTransaction } from '@/hooks/use-escrow-transaction';
import type { OrderBookListItemType } from '@/types/order-book';

/**
 * ButtonRequestRefund
 * Renders the Request Refund button for buyers when eligible.
 * Handles its own loading state and on-chain refund logic.
 * Returns null if not buyer or status is not correct.
 */
export default function ButtonRequestRefund({ order }: { order: OrderBookListItemType }) {
  const { userProfile, wallet: dynamicWalletInfo } = useAuthCheck();
  const userId = userProfile?._id;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { refundOrder, isLoading: isEscrowActionLoading } = useEscrowTransaction();
  const convex = useConvex();

  const isBuyer = order.buyerId === userId;
  const canRequestRefund =
    order.status === 'escrow_funded' || order.status === 'awaiting_seller_confirmation';

  if (!isBuyer || !canRequestRefund) return null;

  const handleRequestRefund = async () => {
    if (!dynamicWalletInfo?.address) {
      toast({
        title: 'Error',
        description: 'Buyer Solana wallet not available.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    toast({ title: 'Processing Refund...', description: 'Please wait.' });
    try {
      const escrowDetails = await convex.query(api.transaction_queries.getEscrowDetailsForAction, {
        orderBookId: order._id,
      });
      if (!escrowDetails?.escrowPdaAddress) {
        throw new Error('Could not fetch escrow details for refund.');
      }
      toast({
        title: 'Awaiting Wallet Confirmation...',
        description: 'Please confirm the refund in your wallet.',
      });
      await refundOrder({
        escrowPda: escrowDetails.escrowPdaAddress,
        actorPublicKey: dynamicWalletInfo.address,
        onSuccess: (txSig: string) => {
          toast({
            title: 'Refund Successful!',
            description: `Tx: ${txSig.substring(0, 10)}...`,
          });
        },
        onError: (err: unknown) => {
          let message = 'Could not process refund on-chain.';
          if (err instanceof Error) {
            message = err.message;
          } else {
            message = 'Unknown error occurred.';
          }
          toast({
            title: 'Refund Failed',
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
      let message = 'Failed to process refund.';
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
      className="text-red-600"
      onClick={handleRequestRefund}
      disabled={loading || isEscrowActionLoading}
      aria-busy={loading || isEscrowActionLoading}
      aria-label="Request Refund"
      title="Request Refund"
    >
      {loading || isEscrowActionLoading ? (
        <span className="animate-pulse">…</span>
      ) : (
        <Undo2 className="h-4 w-4" />
      )}
    </Button>
  );
}
