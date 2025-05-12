import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useConvex, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useEscrowTransaction } from '@/hooks/use-escrow-transaction';
import { OrderBookType } from '@/types/order-book';

/**
 * ButtonConfirmOrder
 * Renders the Confirm Order button for sellers when the order is in a confirmable state.
 * Handles its own loading state and on-chain confirmation logic.
 * Returns null if not seller or status is not confirmable.
 */
const CONFIRMABLE_STATUSES = ['escrow_funded', 'awaiting_seller_confirmation'];

export default function ButtonConfirmOrder({ order }: { order: OrderBookType }) {
  const { userProfile, wallet: dynamicWalletInfo } = useAuthCheck();
  const userId = userProfile?._id;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const convex = useConvex();
  const recordSellerConfirmationMutation = useMutation(
    api.transaction_mutations.recordSellerConfirmation
  );
  const { confirmOrder, isLoading: isEscrowActionLoading } = useEscrowTransaction();

  const isSeller = order.sellerId === userId;
  const isConfirmable = CONFIRMABLE_STATUSES.includes(order.status);

  if (!isSeller || !isConfirmable) return null;

  const handleConfirmOrder = async () => {
    if (!dynamicWalletInfo?.address) {
      toast({
        title: 'Error',
        description: 'Seller Solana wallet not available.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    toast({ title: 'Processing Confirmation...', description: 'Please wait.' });
    try {
      const escrowDetails = await convex.query(api.transaction_queries.getEscrowDetailsForAction, {
        orderBookId: order._id,
      });
      if (!escrowDetails?.escrowPdaAddress) {
        throw new Error('Could not fetch escrow details for confirmation.');
      }
      toast({
        title: 'Awaiting Wallet Confirmation...',
        description: 'Please confirm the transaction in your wallet.',
      });
      await confirmOrder({
        escrowPda: escrowDetails.escrowPdaAddress,
        actorPublicKey: dynamicWalletInfo.address,
        onSuccess: async (txSig: string) => {
          toast({
            title: 'Order Confirmed On-Chain!',
            description: `Tx: ${txSig.substring(0, 10)}...`,
          });
          await recordSellerConfirmationMutation({
            orderBookId: order._id,
            txHash: txSig,
            onChainStatus: 'confirmed',
          });
        },
        onError: (err: unknown) => {
          let message = 'Could not confirm order on-chain.';
          if (err instanceof Error === false) {
            message = 'Unknown error occurred.';
          }

          toast({
            title: 'Confirmation Failed',
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
      let message = 'Failed to process order confirmation.';
      if (error instanceof Error === false) {
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
      onClick={handleConfirmOrder}
      disabled={loading || isEscrowActionLoading}
      aria-busy={loading || isEscrowActionLoading}
      aria-label="Confirm Order"
    >
      {loading || isEscrowActionLoading ? (
        <span className="animate-pulse">…</span>
      ) : (
        <Check className="h-4 w-4" />
      )}
    </Button>
  );
}
