import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Connection } from '@solana/web3.js';
import escrowJson from '@/lib/solana-lib/idl/escrow.json'; // Adjust the path as necessary
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider';
import { Escrow } from '@/lib/solana-lib/types/escrow';

const idl = escrowJson as Idl; // Cast to Idl type

export function getEscrowAnchorProgram(wallet: Wallet, connection: Connection): Program<Escrow> {
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  const program = new Program<Escrow>(idl as Escrow, provider);
  console.log({ wallet, program, provider, connection });
  return program;
}
