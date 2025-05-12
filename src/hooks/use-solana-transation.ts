/* eslint-disable @typescript-eslint/no-explicit-any */
import { isSolanaWallet } from '@dynamic-labs/solana';

import {
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { useUserWallets } from '@dynamic-labs/sdk-react-core';

export const useSolanaTransacion = () => {
  const wallets = useUserWallets();

  const sendFund = async () => {
    const wallet = wallets[0];

    if (!wallet || !isSolanaWallet(wallet)) {
      return;
    }

    const address = 'Gcqeu4rwojtwiNBXeHnfqZp4nrmMdr72DBXiojqJdbTe';
    const amount = 0.001; // 0.001 SOL

    const connection = await wallet.getConnection();

    const fromKey = new PublicKey(wallet.address);
    const toKey = new PublicKey(address);
    const amountInLamports = Number(amount) * 1000000000;

    const instructions = [
      SystemProgram.transfer({
        fromPubkey: fromKey,
        lamports: amountInLamports,
        toPubkey: toKey,
      }),
    ];

    const blockhash = await connection.getLatestBlockhash();

    // create v0 compatible message
    const messageV0 = new TransactionMessage({
      instructions,
      payerKey: fromKey,
      recentBlockhash: blockhash.blockhash,
    }).compileToV0Message();

    const transferTransaction = new VersionedTransaction(messageV0);

    const signer = await wallet.getSigner();

    await signer
      .signAndSendTransaction(transferTransaction as any)
      .then((res: any) => {
        console.log(
          `Transaction successful: https://solscan.io/tx/${res.signature}?cluster=devnet`
        );
      })
      .catch((reason: any) => {
        console.error(reason);
      });
  };

  return { sendFund };
};
