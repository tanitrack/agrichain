import { Button } from '@/components/ui/button';
import { PiggyBank } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useConvex } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useEscrowTransaction } from '@/hooks/use-escrow-transaction';
import type { OrderBookListItemType } from '@/types/order-book';

/**
 * ButtonReclaimEscrowRent
 * Renders the Reclaim Escrow Rent button for the rent payer when eligible.
 * Handles its own loading state and on-chain reclaim logic.
 * Returns null if not eligible or status is not correct.
 */
export default function ButtonReclaimEscrowRent({ order }: { order: OrderBookListItemType }) {
  const { userProfile, wallet: dynamicWalletInfo } = useAuthCheck();
  const userId = userProfile?._id;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { closeEscrow, isLoading: isEscrowActionLoading } = useEscrowTransaction();
  const convex = useConvex();

  // TODO: Adjust this logic if your schema has a specific rent payer or reclaim eligibility flag
  const isRentPayer = order.buyerId === userId;
  const canReclaimRent = order.status === 'closed'; // Adjust if you have a more precise flag

  if (!isRentPayer || !canReclaimRent) return null;

  const handleReclaimRent = async () => {
    if (!dynamicWalletInfo?.address) {
      toast({
        title: 'Error',
        description: 'Wallet not available.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    toast({ title: 'Processing Rent Reclaim...', description: 'Please wait.' });
    try {
      const escrowDetails = await convex.query(api.transaction_queries.getEscrowDetailsForAction, {
        orderBookId: order._id,
      });
      if (!escrowDetails?.escrowPdaAddress) {
        throw new Error('Could not fetch escrow details for reclaiming rent.');
      }
      toast({
        title: 'Awaiting Wallet Confirmation...',
        description: 'Please confirm the rent reclaim in your wallet.',
      });
      await closeEscrow({
        escrowPda: escrowDetails.escrowPdaAddress,
        actorPublicKey: dynamicWalletInfo.address,
        onSuccess: (txSig: string) => {
          toast({
            title: 'Rent Reclaim Successful!',
            description: `Tx: ${txSig.substring(0, 10)}...`,
          });
        },
        onError: (err: unknown) => {
          let message = 'Could not reclaim rent on-chain.';
          if (err instanceof Error) {
            message = err.message;
          } else {
            message = 'Unknown error occurred.';
          }
          toast({
            title: 'Reclaim Failed',
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
      let message = 'Failed to process rent reclaim.';
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
      className="text-pink-600"
      onClick={handleReclaimRent}
      disabled={loading || isEscrowActionLoading}
      aria-busy={loading || isEscrowActionLoading}
      aria-label="Reclaim Escrow Rent"
      title="Reclaim Escrow Rent"
    >
      {loading || isEscrowActionLoading ? (
        <span className="animate-pulse">…</span>
      ) : (
        <PiggyBank className="h-4 w-4" />
      )}
    </Button>
  );
}
