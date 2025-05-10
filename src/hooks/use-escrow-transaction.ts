import { useCreateVersionedTransaction } from '@/hooks/use-create-versioned-transaction';
import { getEscrowAnchorProgram } from '@/lib/get-escrow-anchor-program';
import { BN } from '@coral-xyz/anchor';
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { isSolanaWallet } from '@dynamic-labs/solana';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';

export const useEscrowTransaction = () => {
  const { createAndSendTransaction } = useCreateVersionedTransaction();
  const { primaryWallet } = useDynamicContext();

  const handleCreateEscrowTransaction = async (
    sellerAddress: string,
    orderDetails: string,
    amount: number
  ) => {
    if (!primaryWallet) {
      throw new Error('No primary wallet connected.');
    }

    // Not solana
    if (!isSolanaWallet(primaryWallet)) {
      throw new Error('Primary wallet is not a Solana wallet.');
    }

    const signerWallet = await primaryWallet.getSigner();
    const connection = await primaryWallet.getConnection();
    if (!signerWallet) {
      throw new Error('No signer wallet found.');
    }
    // Dynamic's primaryWallet can often be directly used as an Anchor Wallet
    // as it should expose publicKey, signTransaction, and signAllTransactions.
    const anchorCompatibleWallet: Wallet = {
      publicKey: new PublicKey(primaryWallet.address),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signTransaction: signerWallet.signTransaction as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signAllTransactions: signerWallet.signAllTransactions as any,
    };
    const program = getEscrowAnchorProgram(
      anchorCompatibleWallet,
      connection as unknown as Connection
    );

    const buyerPublicKey = new PublicKey(signerWallet.publicKey);
    const sellerPublicKey = new PublicKey(sellerAddress);
    const amountInLamports = Number(amount) * 1000000000; // Convert SOL to lamports
    // Derive the escrow account PDA
    const [escrowAccountPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('escrow'),
        buyerPublicKey.toBuffer(),
        sellerPublicKey.toBuffer(),
        Buffer.from(orderDetails),
      ],
      program.programId
    );

    console.log('Attempting to initialize escrow with PDA:', escrowAccountPDA.toString());
    console.log('Buyer:', buyerPublicKey.toString());
    console.log('Seller:', sellerPublicKey.toString());
    console.log('Order Details:', orderDetails);
    console.log('Amount (Lamports):', amountInLamports.toString());
    console.log('Program ID:', program.programId.toString());

    // Create the instruction using the Anchor program instance
    const initializeInstruction = await program.methods
      .initialize(orderDetails, new BN(amountInLamports))
      .accounts({
        escrowAccount: escrowAccountPDA, // THIS WAS MISSING/COMMENTED
        buyer: buyerPublicKey,
        seller: sellerPublicKey,
        systemProgram: SystemProgram.programId, // THIS WAS MISSING
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .instruction();

    try {
      const signature = await createAndSendTransaction({
        instructions: [initializeInstruction],
        payer: buyerPublicKey,
        onSuccess: (signature) => {
          console.log(`Transaction successful: https://solscan.io/tx/${signature}?cluster=devnet`);
        },
        onError: (error) => {
          console.error('Transaction failed:', error);
        },
      });

      return signature;
    } catch (error) {
      console.error('Error creating escrow transaction:', error);
      throw error;
    }
  };

  return {
    handleCreateEscrowTransaction,
  };
};
