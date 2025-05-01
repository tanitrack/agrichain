// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import VotedappIDL from '../target/idl/votedapp.json';
import type { Votedapp } from '../target/types/votedapp';

// Re-export the generated IDL and type
export { Votedapp, VotedappIDL };

// The programId is imported from the program IDL.
export const VOTEDAPP_PROGRAM_ID = new PublicKey(VotedappIDL.address);

// This is a helper function to get the Votedapp Anchor program.
export function getVotedappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program(
    { ...VotedappIDL, address: address ? address.toBase58() : VotedappIDL.address } as Votedapp,
    provider
  );
}

// This is a helper function to get the program ID for the Votedapp program depending on the cluster.
export function getVotedappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votedapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF');
    case 'mainnet-beta':
    default:
      return VOTEDAPP_PROGRAM_ID;
  }
}
