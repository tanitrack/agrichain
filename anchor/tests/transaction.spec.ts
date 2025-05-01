import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Transaction } from "../target/types/transaction";
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from 'anchor-bankrun';
const IDL = require('../target/idl/transaction.json');
const trxAddress = new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF');

describe("transaction", () => {


  const buyer = anchor.web3.Keypair.generate();
  const seller = anchor.web3.Keypair.generate();

  const productId = new anchor.BN(12345);
  const amount = new anchor.BN(LAMPORTS_PER_SOL / 10); // 0.1 SOL
  const provider = anchor.AnchorProvider.env();

  let checkoutPda: PublicKey;
  let escrowPda: PublicKey;
  let checkoutBump: number;
  let escrowBump: number;

  anchor.setProvider(provider);

  const program = anchor.workspace.Transaction as Program<Transaction>;

  it("Airdrops SOL to buyer", async () => {
    const signature = await provider.connection.requestAirdrop(
      buyer.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
    const balance = await provider.connection.getBalance(buyer.publicKey);
    expect(balance).toBeGreaterThanOrEqual(LAMPORTS_PER_SOL);
  });

  // it("Initialized checkout transaction", async () => {
  //   [checkoutPda] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from("checkout"),
  //       buyer.publicKey.toBuffer(),
  //       productId.toArrayLike(Buffer, "le", 8),
  //     ],
  //     program.programId
  //   );

  //   [escrowPda, escrowBump] = await PublicKey.findProgramAddress(
  //     [
  //       Buffer.from("escrow"),
  //       buyer.publicKey.toBuffer(),
  //       productId.toArrayLike(Buffer, "le", 8),
  //     ],
  //     program.programId
  //   );

  //   await program.methods
  //     .initializeCheckout(productId, amount)
  //     .accounts({
  //       buyer: buyer.publicKey,
  //       seller: seller.publicKey,
  //       checkout: checkoutPda,
  //       escrow: escrowPda,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .signers([buyer])
  //     .rpc();

  //   const escrowBalance = await provider.connection.getBalance(escrowPda);


  // });

});