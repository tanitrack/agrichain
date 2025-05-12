/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Disable any as the typesafety of Solana related codes are tricky
import { useCreateVersionedTransaction } from '@/hooks/use-create-versioned-transaction';
import { BN, Program } from '@coral-xyz/anchor';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { isSolanaWallet } from '@dynamic-labs/solana';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider'; // For Anchor provider
import { getEscrowAnchorProgram } from '@/lib/get-escrow-anchor-program';
import { Escrow } from '@/lib/solana-lib/types/escrow';

interface EscrowTransactionProps {
  onSuccess?: (signature: string, pda?: string) => void;
  onError?: (error: Error) => void;
  onSubmitted?: (signature: string) => void;
}

interface InitializeEscrowProps extends EscrowTransactionProps {
  sellerSolanaPublicKey: string;
  orderDetails: string; // This will be orderBook._id
  amountLamports: BN;
  buyerSolanaPublicKey: string; // Payer
}

interface EscrowActionProps extends EscrowTransactionProps {
  escrowPda: string; // The PDA of the escrow account
  actorPublicKey: string; // The PublicKey of the user performing the action (buyer or seller)
}

interface FailOrderProps extends EscrowActionProps {
  buyerAccountForRefund: string; // Buyer's public key to receive refund on fail
}

export const useEscrowTransaction = () => {
  const {
    createAndSendTransaction,
    isLoading,
    error: CSTEError,
    signature: CSTESignature,
  } = useCreateVersionedTransaction();
  const { primaryWallet } = useDynamicContext();

  const getProgram = async (): Promise<Program<Escrow>> => {
    if (!primaryWallet || !isSolanaWallet(primaryWallet)) {
      throw new Error('Solana wallet not connected or available.');
    }

    const signer = await primaryWallet.getSigner();
    const connection = await primaryWallet.getConnection();
    const anchorCompatibleWallet: Wallet = {
      publicKey: new PublicKey(primaryWallet.address),
      signTransaction: signer.signTransaction as any,
      signAllTransactions: signer.signAllTransactions as any,
    };
    return getEscrowAnchorProgram(anchorCompatibleWallet, connection as unknown as Connection);
  };

  const initializeEscrow = async ({
    sellerSolanaPublicKey,
    orderDetails, // This is the orderBook._id string
    amountLamports, // BN instance
    buyerSolanaPublicKey, // Payer, string
    onSuccess,
    onError,
    onSubmitted,
  }: InitializeEscrowProps) => {
    console.log('Initializing escrow with params:', {
      sellerSolanaPublicKey,
      orderDetails,
      amountLamports: amountLamports.toString(),
      buyerSolanaPublicKey,
    });
    try {
      if (
        !primaryWallet ||
        !isSolanaWallet(primaryWallet) ||
        primaryWallet.address !== buyerSolanaPublicKey
      ) {
        throw new Error("Buyer's Solana wallet not connected or mismatch.");
      }

      const program = await getProgram();
      const buyerPK = new PublicKey(buyerSolanaPublicKey);
      const sellerPK = new PublicKey(sellerSolanaPublicKey);

      // Derive the escrowAccountPDA using the same seeds as your Solana program
      const [escrowAccountPDA /* bump */] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('escrow'), // Make sure this matches your program's seed constant
          buyerPK.toBuffer(),
          sellerPK.toBuffer(),
          Buffer.from(orderDetails), // orderBook._id as string
        ],
        program.programId
      );
      console.log('Derived Escrow PDA for initialize:', escrowAccountPDA.toBase58());

      const ix = await program.methods
        .initialize(orderDetails, amountLamports) // orderDetails is string, amountLamports is BN
        .accounts({
          escrowAccount: escrowAccountPDA,
          buyer: buyerPK,
          seller: sellerPK,
          systemProgram: SystemProgram.programId,
        } as any)
        .instruction();

      const sig = await createAndSendTransaction({
        instructions: [ix],
        payer: buyerPK,
        onSuccess: (txSig) => {
          console.log(
            'Escrow initialized on-chain. Tx Signature:',
            txSig,
            'PDA:',
            escrowAccountPDA.toBase58()
          );
          onSuccess?.(txSig, escrowAccountPDA.toBase58());
        },
        onError: (err) => {
          console.error('Error in createAndSendTransaction for initializeEscrow:', err);
          onError?.(err);
        },
        onSubmitted: (txSig) => {
          console.log('InitializeEscrow tx submitted:', txSig);
          onSubmitted?.(txSig);
        },
      });

      // createAndSendTransaction now handles calling onSuccess, so we just return its result
      // if sig is not null, it implies onSubmitted and potentially onSuccess were called.
      return sig ? { signature: sig, pda: escrowAccountPDA.toBase58() } : null;
    } catch (e) {
      console.error('Error in initializeEscrow function:', e);
      onError?.(e as Error);
      return null;
    }
  };

  const confirmOrder = async ({
    escrowPda,
    actorPublicKey,
    onSuccess,
    onError,
    onSubmitted,
  }: EscrowActionProps) => {
    console.log('Confirming order for escrow:', escrowPda, 'by actor:', actorPublicKey);
    try {
      if (
        !primaryWallet ||
        !isSolanaWallet(primaryWallet) ||
        primaryWallet.address !== actorPublicKey
      ) {
        throw new Error("Seller's Solana wallet not connected or mismatch.");
      }
      const program = await getProgram();
      const escrowPK = new PublicKey(escrowPda);
      const sellerPK = new PublicKey(actorPublicKey);

      const ix = await program.methods
        .confirmOrder()
        .accounts({
          escrowAccount: escrowPK,
          seller: sellerPK,
        } as any)
        .instruction();

      const sig = await createAndSendTransaction({
        instructions: [ix],
        payer: sellerPK, // Seller pays for this action
        onSuccess: (txSig) => {
          console.log('Order confirmed on-chain. Tx Signature:', txSig);
          onSuccess?.(txSig);
        },
        onError: (err) => {
          console.error('Error in createAndSendTransaction for confirmOrder:', err);
          onError?.(err);
        },
        onSubmitted: (txSig) => {
          console.log('confirmOrder tx submitted:', txSig);
          onSubmitted?.(txSig);
        },
      });
      return sig ? { signature: sig } : null;
    } catch (e) {
      console.error('Error in confirmOrder function:', e);
      onError?.(e as Error);
      return null;
    }
  };

  const withdrawFunds = async ({
    escrowPda,
    actorPublicKey,
    onSuccess,
    onError,
    onSubmitted,
  }: EscrowActionProps) => {
    console.log('Withdrawing funds from escrow:', escrowPda, 'by actor:', actorPublicKey);
    try {
      if (
        !primaryWallet ||
        !isSolanaWallet(primaryWallet) ||
        primaryWallet.address !== actorPublicKey
      ) {
        throw new Error("Seller's Solana wallet not connected or mismatch.");
      }
      const program = await getProgram();
      const escrowPK = new PublicKey(escrowPda);
      const sellerPK = new PublicKey(actorPublicKey);

      // Ensure the on-chain escrow account's seller matches the actorPublicKey
      // This is a good client-side check before sending, though the program enforces it.
      // const escrowAccountState = await program.account.escrowAccount.fetch(escrowPK);
      // if (escrowAccountState.seller.toBase58() !== sellerPK.toBase58()) {
      //     throw new Error("Mismatch: Actor is not the designated seller for this escrow.");
      // }
      // if (escrowAccountState.status.toString() !== "Confirmed" /* Or however your enum translates */) {
      //     throw new Error("Escrow not in 'Confirmed' state for withdrawal.");
      // }

      const ix = await program.methods
        .withdrawFunds()
        .accounts({
          escrowAccount: escrowPK,
          seller: sellerPK,
        })
        .instruction();

      const sig = await createAndSendTransaction({
        instructions: [ix],
        payer: sellerPK,
        onSuccess: (txSig) => {
          console.log('Funds withdrawn on-chain. Tx Signature:', txSig);
          onSuccess?.(txSig);
        },
        onError: (err) => {
          console.error('Error in createAndSendTransaction for withdrawFunds:', err);
          onError?.(err);
        },
        onSubmitted: (txSig) => {
          console.log('withdrawFunds tx submitted:', txSig);
          onSubmitted?.(txSig);
        },
      });
      return sig ? { signature: sig } : null;
    } catch (e) {
      console.error('Error in withdrawFunds function:', e);
      onError?.(e as Error);
      return null;
    }
  };

  const refundOrder = async ({
    escrowPda,
    actorPublicKey,
    onSuccess,
    onError,
    onSubmitted,
  }: EscrowActionProps) => {
    try {
      const program = await getProgram();
      const escrowPK = new PublicKey(escrowPda);
      const buyerPK = new PublicKey(actorPublicKey); // Buyer initiates refund

      const ix = await program.methods
        .refundOrder()
        .accounts({
          escrowAccount: escrowPK,
          buyer: buyerPK,
        } as any)
        .instruction();

      const sig = await createAndSendTransaction({
        instructions: [ix],
        payer: buyerPK, // Buyer pays
        onSuccess,
        onError,
        onSubmitted,
      });
      return { signature: sig };
    } catch (e) {
      onError?.(e as Error);
      return null;
    }
  };

  const failOrder = async ({
    escrowPda,
    actorPublicKey,
    buyerAccountForRefund,
    onSuccess,
    onError,
    onSubmitted,
  }: FailOrderProps) => {
    try {
      const program = await getProgram();
      const escrowPK = new PublicKey(escrowPda);
      const authorityPK = new PublicKey(actorPublicKey); // Buyer or Seller can be authority
      const buyerRefundPK = new PublicKey(buyerAccountForRefund);

      const ix = await program.methods
        .failOrder()
        .accounts({
          escrowAccount: escrowPK,
          buyer: buyerRefundPK, // Account where funds are returned
          authority: authorityPK,
        } as any)
        .instruction();

      const sig = await createAndSendTransaction({
        instructions: [ix],
        payer: authorityPK, // Authority pays
        onSuccess,
        onError,
        onSubmitted,
      });
      return { signature: sig };
    } catch (e) {
      onError?.(e as Error);
      return null;
    }
  };

  const closeEscrow = async ({
    escrowPda,
    actorPublicKey,
    onSuccess,
    onError,
    onSubmitted,
  }: EscrowActionProps) => {
    try {
      const program = await getProgram();
      const escrowPK = new PublicKey(escrowPda);
      const receiverPK = new PublicKey(actorPublicKey); // Receiver of rent (typically buyer)

      const ix = await program.methods
        .closeEscrow()
        .accounts({
          escrowAccount: escrowPK,
          receiver: receiverPK,
        } as any)
        .instruction();

      const sig = await createAndSendTransaction({
        instructions: [ix],
        payer: receiverPK, // Receiver pays
        onSuccess,
        onError,
        onSubmitted,
      });
      return { signature: sig };
    } catch (e) {
      onError?.(e as Error);
      return null;
    }
  };

  return {
    initializeEscrow,
    confirmOrder, // <-- ADDED
    withdrawFunds, // <-- ADDED
    refundOrder,
    failOrder,
    closeEscrow,
    isLoading, // from underlying useCreateVersionedTransaction
    error: CSTEError, // from underlying
    lastSignature: CSTESignature, // from underlying
  };
};
