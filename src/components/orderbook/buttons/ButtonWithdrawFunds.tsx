import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useConvex } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useEscrowTransaction } from '@/hooks/use-escrow-transaction';
import type { OrderBookType } from '@/types/order-book';

/**
 * ButtonWithdrawFunds
 * Renders the Withdraw Funds button for sellers when goods have been received.
 * Handles its own loading state and on-chain withdrawal logic.
 * Returns null if not seller or status is not correct.
 */
export default function ButtonWithdrawFunds({ order }: { order: OrderBookType }) {
  const { userProfile, wallet: dynamicWalletInfo } = useAuthCheck();
  const userId = userProfile?._id;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { withdrawFunds, isLoading: isEscrowActionLoading } = useEscrowTransaction();
  const convex = useConvex();

  const isSeller = order.sellerId === userId;
  const canWithdrawFunds = order.status === 'goods_received';

  if (!isSeller || !canWithdrawFunds) return null;

  const handleWithdrawFunds = async () => {
    if (!dynamicWalletInfo?.address) {
      toast({
        title: 'Error',
        description: 'Seller Solana wallet not available.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    toast({ title: 'Processing Withdrawal...', description: 'Please wait.' });
    try {
      const escrowDetails = await convex.query(api.transaction_queries.getEscrowDetailsForAction, {
        orderBookId: order._id,
      });
      if (!escrowDetails?.escrowPdaAddress) {
        throw new Error('Could not fetch escrow details for withdrawal.');
      }
      toast({
        title: 'Awaiting Wallet Confirmation...',
        description: 'Please confirm the withdrawal in your wallet.',
      });
      await withdrawFunds({
        escrowPda: escrowDetails.escrowPdaAddress,
        actorPublicKey: dynamicWalletInfo.address,
        onSuccess: async (txSig: string) => {
          toast({
            title: 'Withdrawal Successful!',
            description: `Tx: ${txSig.substring(0, 10)}...`,
          });
          // Call the Convex mutation to record the withdrawal (Step 19)
          await convex.mutation(api.transaction_mutations.recordFundsWithdrawn, {
            orderBookId: order._id,
            txHash: txSig,
            onChainStatus: 'completed', // As per Step 19 instructions
          });
        },
        onError: (err: unknown) => {
          let message = 'Could not withdraw funds on-chain.';
          if (err instanceof Error) {
            message = err.message;
          } else {
            message = 'Unknown error occurred.';
          }
          toast({
            title: 'Withdrawal Failed',
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
      let message = 'Failed to process withdrawal.';
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
      className="text-purple-600"
      onClick={handleWithdrawFunds}
      disabled={loading || isEscrowActionLoading}
      aria-busy={loading || isEscrowActionLoading}
      aria-label="Withdraw Funds"
    >
      {loading || isEscrowActionLoading ? (
        <span className="animate-pulse">…</span>
      ) : (
        <Wallet className="h-4 w-4" />
      )}
    </Button>
  );
}
