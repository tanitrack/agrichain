/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import {
  PublicKey,
  TransactionInstruction,
  VersionedTransaction,
  SendOptions,
  TransactionMessage,
} from '@solana/web3.js';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { clientEnv } from '@/lib/client-env-variables'; // Your environment variables
import { isSolanaWallet } from '@dynamic-labs/solana';

interface CreateVersionedTransactionProps {
  instructions: TransactionInstruction[];
  payer?: PublicKey; // Optional: defaults to primary wallet's public key
  options?: SendOptions;
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
  onSubmitted?: (signature: string) => void; // Callback when transaction is submitted
}

interface UseCreateVersionedTransactionReturn {
  createAndSendTransaction: (props: CreateVersionedTransactionProps) => Promise<string | null>;
  isLoading: boolean;
  error: Error | null;
  signature: string | null;
  programId: string;
}

export function useCreateVersionedTransaction(): UseCreateVersionedTransactionReturn {
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const createAndSendTransaction = useCallback(
    async ({
      instructions,
      payer,
      onSuccess,
      onError,
      onSubmitted,
    }: CreateVersionedTransactionProps): Promise<string | null> => {
      if (!primaryWallet) {
        const noWalletError = new Error('No primary wallet connected.');
        setError(noWalletError);
        onError?.(noWalletError);
        return null;
      }

      if (!isSolanaWallet(primaryWallet)) {
        const noWalletError = new Error('No Solana wallet connected.');
        setError(noWalletError);
        onError?.(noWalletError);
        return null;
      }

      if (!instructions || instructions.length === 0) {
        const noInstructionsError = new Error('No instructions provided for the transaction.');
        setError(noInstructionsError);
        onError?.(noInstructionsError);
        return null;
      }

      setIsLoading(true);
      setError(null);
      setSignature(null);

      try {
        const payerPublicKey = payer || primaryWallet.address;
        if (!payerPublicKey) {
          const noPayerError = new Error('Payer public key is not available.');
          setError(noPayerError);
          onError?.(noPayerError);
          setIsLoading(false);
          return null;
        }

        const connection = await primaryWallet.getConnection();

        // 1. Get the latest blockhash
        const { blockhash } = await connection.getLatestBlockhash('confirmed');

        // 2. Compile the message
        // const messageV0 = MessageV0.compile({
        //   payerKey: new PublicKey(payerPublicKey), // Ensure payerPublicKey is a PublicKey instance
        //   instructions,
        //   recentBlockhash: blockhash,
        // });

        const messageV0 = new TransactionMessage({
          instructions,
          payerKey: new PublicKey(payerPublicKey), // Ensure payerPublicKey is a PublicKey instance
          recentBlockhash: blockhash,
        }).compileToV0Message();

        // 3. Create a VersionedTransaction
        const transaction = new VersionedTransaction(messageV0);
        const signer = await primaryWallet.getSigner();

        // 4. Sign and send the transaction using Dynamic SDK
        //    Dynamic's signAndSendTransaction handles both signing and sending.
        //    It will prompt the user through their connected wallet.
        const result = await signer.signAndSendTransaction(transaction as any, {});
        const txSignature = result.signature; // Assuming the result contains the signature

        setSignature(txSignature);
        onSubmitted?.(txSignature); // Callback for immediate feedback

        // 5. (Optional but Recommended) Confirm the transaction
        //    Dynamic's signAndSendTransaction might not wait for full confirmation.
        //    You might want to add confirmation logic here if critical.
        //    For this hook, we'll consider submission as the primary success.
        //    Confirmation can be handled by the component using the hook.
        //
        //    Example confirmation (can be extracted to a separate utility):
        //    await connection.confirmTransaction({
        //      signature: txSignature,
        //      blockhash,
        //      lastValidBlockHeight,
        //    }, 'confirmed');

        onSuccess?.(txSignature);
        setIsLoading(false);
        return txSignature;
      } catch (e) {
        console.error('Transaction failed:', e);
        const txError =
          e instanceof Error ? e : new Error(String(e.message || 'Transaction failed'));
        setError(txError);
        onError?.(txError);
        setIsLoading(false);
        return null;
      }
    },
    [primaryWallet] // Dependencies for useCallback
  );

  return {
    createAndSendTransaction,
    isLoading,
    error,
    signature,
    programId: clientEnv.VITE_AGRICHAIN_PROGRAM_ID ?? '',
  };
}
