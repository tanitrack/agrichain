/* eslint-disable @typescript-eslint/no-explicit-any */
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Escrow } from '../target/types/escrow';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { assert } from 'chai';
import { BN } from 'bn.js';

describe('escrow', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Escrow as Program<Escrow>;

  // Common accounts for the first set of tests
  const buyer = Keypair.generate();
  const seller = Keypair.generate();
  const initialOrderDetails = 'a';
  const escrowAmount = new BN(1 * LAMPORTS_PER_SOL);

  let initialEscrowPDA: PublicKey;
  // eslint-disable-next-line unused-imports/no-unused-vars
  let initialEscrowBump: number;

  // Helper to get rent exemption for the escrow account
  const getEscrowRentExemption = async () => {
    // This is an estimate. For precise value, you'd calculate based on EscrowAccount::INIT_SPACE
    // or fetch an existing account's lamports before principal is added.
    // For testing, knowing it's a small positive number is often enough if exact rent isn't asserted.
    // A more robust way would be to get the space from IDL: program.account.escrowAccount.size
    // For now, let's assume it's fetched if needed, or assertions are approximate.
    const accountSpace = program.account.escrowAccount.size;
    return provider.connection.getMinimumBalanceForRentExemption(accountSpace);
  };

  before(async () => {
    await provider.connection.requestAirdrop(buyer.publicKey, 5 * LAMPORTS_PER_SOL); // Increased airdrop
    await provider.connection.requestAirdrop(seller.publicKey, 1 * LAMPORTS_PER_SOL);
    await Promise.all([
      provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(buyer.publicKey, 5 * LAMPORTS_PER_SOL)
      ),
      provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(seller.publicKey, 1 * LAMPORTS_PER_SOL)
      ),
    ]);

    [initialEscrowPDA, initialEscrowBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('escrow'),
        buyer.publicKey.toBuffer(),
        seller.publicKey.toBuffer(),
        Buffer.from(initialOrderDetails),
      ],
      program.programId
    );
    console.log(`Initial Escrow PDA in before: ${initialEscrowPDA?.toString()}`);
  });

  it('Initialize escrow', async () => {
    console.log(`Initial Escrow PDA in test: ${initialEscrowPDA?.toString()}`); // Add a log

    await program.methods
      .initialize(initialOrderDetails, escrowAmount)
      .accounts({
        buyer: buyer.publicKey,
        seller: seller.publicKey,
      })
      .signers([buyer])
      .rpc();

    const escrowAccount = await program.account.escrowAccount.fetch(initialEscrowPDA);
    assert.equal(escrowAccount.buyer.toString(), buyer.publicKey.toString());
    assert.equal(escrowAccount.seller.toString(), seller.publicKey.toString());
    assert.equal(escrowAccount.orderDetails, initialOrderDetails);
    assert.equal(escrowAccount.amount.toString(), escrowAmount.toString());
    assert.deepEqual(escrowAccount.status, { initialized: {} });

    // Fetch the actual balance of the escrow PDA after initialization
    const escrowPDABalanceActual = await provider.connection.getBalance(initialEscrowPDA);
    console.log(`Actual Escrow PDA balance after init: ${escrowPDABalanceActual}`);
    console.log(`Escrow amount transferred: ${escrowAmount.toString()}`);

    const accountSpace = program.account.escrowAccount.size;
    const expectedMinRentForEscrowPDA =
      await provider.connection.getMinimumBalanceForRentExemption(accountSpace);

    // Assert that the balance is at least escrowAmount + minimum_possible_rent (e.g., 1 lamport if rent is always > 0)
    // This is a bit more robust than just `> escrowAmount` if escrowAmount could theoretically be huge and rent very small.
    // For most cases, `> escrowAmount` is sufficient.
    // Or, more precisely, that escrowPDABalanceActual >= escrowAmount + expectedMinRentForEscrowPDA
    assert.ok(
      new BN(escrowPDABalanceActual).gte(new BN(expectedMinRentForEscrowPDA).add(escrowAmount)), // gte = greater than or equal
      `Escrow PDA balance (${escrowPDABalanceActual}) should be at least minimum rent (${expectedMinRentForEscrowPDA}) + amount (${escrowAmount})`
    );
  });

  it('Seller confirms the order', async () => {
    await program.methods
      .confirmOrder()
      .accounts({
        escrowAccount: initialEscrowPDA,
        seller: seller.publicKey,
      } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
      .signers([seller])
      .rpc();

    const escrowAccount = await program.account.escrowAccount.fetch(initialEscrowPDA);
    assert.deepEqual(escrowAccount.status, { confirmed: {} });
  });

  it('Seller withdraws funds after confirmation', async () => {
    const sellerInitialBalance = await provider.connection.getBalance(seller.publicKey);
    const escrowPDABalanceBeforeWithdraw = await provider.connection.getBalance(initialEscrowPDA);

    await program.methods
      .withdrawFunds()
      .accounts({
        escrowAccount: initialEscrowPDA,
        seller: seller.publicKey,
      })
      .signers([seller])
      .rpc();

    const escrowAccount = await program.account.escrowAccount.fetch(initialEscrowPDA);
    assert.deepEqual(escrowAccount.status, { completed: {} });
    assert.equal(
      escrowAccount.amount.toString(),
      '0',
      "Escrow account's internal amount should be 0"
    );

    const sellerFinalBalance = await provider.connection.getBalance(seller.publicKey);
    // Seller receives escrowAmount, minus tx fee for withdrawFunds
    assert.approximately(
      (sellerFinalBalance - sellerInitialBalance) / LAMPORTS_PER_SOL,
      escrowAmount.toNumber() / LAMPORTS_PER_SOL,
      0.01 // For transaction fee
    );

    const escrowPDABalanceAfterWithdraw = await provider.connection.getBalance(initialEscrowPDA);
    // Escrow PDA should now only have its rent left
    assert.equal(
      escrowPDABalanceAfterWithdraw.toString(),
      new BN(escrowPDABalanceBeforeWithdraw).sub(escrowAmount).toString(),
      'Escrow PDA balance should decrease by escrowAmount'
    );
  });

  it('Close escrow after completion', async () => {
    const receiverInitialBalance = await provider.connection.getBalance(buyer.publicKey); // Buyer is receiver
    const escrowPDARentBeforeClose = await provider.connection.getBalance(initialEscrowPDA);

    console.log(`Receiver initial balance: ${receiverInitialBalance}`);
    console.log(`Escrow PDA rent before close: ${escrowPDARentBeforeClose}`);

    const tx = await program.methods
      .closeEscrow()
      .accounts({
        receiver: buyer.publicKey, // Buyer is the receiver of the rent
        escrowAccount: initialEscrowPDA, // <--- ADD THIS LINE: Explicitly pass the PDA
      } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
      .signers([buyer]) // Buyer (receiver) must sign to pay tx fee for close
      .rpc();

    console.log(`Transaction signature: ${tx}`);

    try {
      await program.account.escrowAccount.fetch(initialEscrowPDA);
      assert.fail('Escrow account should be closed');
    } catch (error) {
      assert.include((error as Error).toString(), 'Account does not exist');
    }

    const receiverFinalBalance = await provider.connection.getBalance(buyer.publicKey);
    // Receiver gets back the rent from escrowPDA, minus tx fee for closeEscrow
    assert.approximately(
      (receiverFinalBalance - receiverInitialBalance) / LAMPORTS_PER_SOL,
      escrowPDARentBeforeClose / LAMPORTS_PER_SOL,
      0.01 // For transaction fee
    );
  });

  // --- REFUND FLOW ---
  describe('Refund flow', () => {
    // Use new keypairs or unique orderDetails for test isolation
    const refundBuyer = Keypair.generate();
    const refundSeller = Keypair.generate();
    const refundOrderDetails = 'a';
    let refundEscrowPDA: PublicKey;
    // eslint-disable-next-line unused-imports/no-unused-vars
    let refundEscrowRent: number;

    before(async () => {
      await Promise.all([
        provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(refundBuyer.publicKey, 3 * LAMPORTS_PER_SOL)
        ),
        provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(refundSeller.publicKey, 0.1 * LAMPORTS_PER_SOL)
        ),
      ]);

      [refundEscrowPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('escrow'),
          refundBuyer.publicKey.toBuffer(),
          refundSeller.publicKey.toBuffer(),
          Buffer.from(refundOrderDetails),
        ],
        program.programId
      );
      refundEscrowRent = await getEscrowRentExemption();

      await program.methods
        .initialize(refundOrderDetails, escrowAmount)
        .accounts({
          buyer: refundBuyer.publicKey,
          seller: refundSeller.publicKey,
        })
        .signers([refundBuyer])
        .rpc();
    });

    it('Refund escrow before confirmation', async () => {
      const buyerInitialBalance = await provider.connection.getBalance(refundBuyer.publicKey);
      const escrowPDABalanceBeforeRefund = await provider.connection.getBalance(refundEscrowPDA);

      await program.methods
        .refundOrder()
        .accounts({
          buyer: refundBuyer.publicKey, // Buyer is signer and receiver
          escrowAccount: refundEscrowPDA,
        } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
        .signers([refundBuyer])
        .rpc();

      const escrowAccount = await program.account.escrowAccount.fetch(refundEscrowPDA);
      assert.deepEqual(escrowAccount.status, { refunded: {} });

      assert.equal(
        escrowAccount.amount.toString(),
        '0', // Expect amount to be 0 after refund
        'Escrow account internal amount should be zero after refund'
      );

      const buyerFinalBalance = await provider.connection.getBalance(refundBuyer.publicKey);
      assert.approximately(
        (buyerFinalBalance - buyerInitialBalance) / LAMPORTS_PER_SOL,
        escrowAmount.toNumber() / LAMPORTS_PER_SOL,
        0.01 // For tx fee
      );

      const escrowPDABalanceAfterRefund = await provider.connection.getBalance(refundEscrowPDA);
      assert.equal(
        escrowPDABalanceAfterRefund.toString(),
        new BN(escrowPDABalanceBeforeRefund).sub(escrowAmount).toString(),
        'Escrow PDA balance should decrease by escrowAmount'
      );
    });

    it('Close escrow after refund', async () => {
      const receiverInitialBalance = await provider.connection.getBalance(refundBuyer.publicKey);
      const escrowPDARentBeforeClose = await provider.connection.getBalance(refundEscrowPDA);

      await program.methods
        .closeEscrow()
        .accounts({
          escrowAccount: refundEscrowPDA,
          receiver: refundBuyer.publicKey,
        } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
        .signers([refundBuyer])
        .rpc();

      try {
        await program.account.escrowAccount.fetch(refundEscrowPDA);
        assert.fail('Escrow account should be closed');
      } catch (error) {
        assert.include((error as Error).toString(), 'Account does not exist');
      }
      const receiverFinalBalance = await provider.connection.getBalance(refundBuyer.publicKey);
      assert.approximately(
        (receiverFinalBalance - receiverInitialBalance) / LAMPORTS_PER_SOL,
        escrowPDARentBeforeClose / LAMPORTS_PER_SOL,
        0.01 // For transaction fee
      );
    });
  });

  // --- FAIL ORDER FLOW ---
  describe('Fail order flow', () => {
    const failBuyer = Keypair.generate();
    const failSeller = Keypair.generate();
    const failOrderDetails = 'Order for fail test';
    let failEscrowPDA: PublicKey;

    before(async () => {
      await Promise.all([
        provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(failBuyer.publicKey, 3 * LAMPORTS_PER_SOL)
        ),
        provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(failSeller.publicKey, 0.1 * LAMPORTS_PER_SOL)
        ),
      ]);

      [failEscrowPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('escrow'),
          failBuyer.publicKey.toBuffer(),
          failSeller.publicKey.toBuffer(),
          Buffer.from(failOrderDetails),
        ],
        program.programId
      );

      await program.methods
        .initialize(failOrderDetails, escrowAmount)
        .accounts({
          buyer: failBuyer.publicKey,
          seller: failSeller.publicKey,
        })
        .signers([failBuyer])
        .rpc();
    });

    it('Fail order (by seller)', async () => {
      const buyerInitialBalance = await provider.connection.getBalance(failBuyer.publicKey);
      const escrowPDABalanceBeforeFail = await provider.connection.getBalance(failEscrowPDA);

      await program.methods
        .failOrder()
        .accounts({
          escrowAccount: failEscrowPDA,
          buyer: failBuyer.publicKey, // This is the AccountInfo for fund destination
          authority: failSeller.publicKey,
        } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
        .signers([failSeller]) // Seller is the authority failing it
        .rpc();

      const escrowAccount = await program.account.escrowAccount.fetch(failEscrowPDA);
      assert.deepEqual(escrowAccount.status, { failed: {} });

      assert.equal(
        escrowAccount.amount.toString(),
        '0', // Expect amount to be 0 after failure
        'Escrow account internal amount should be zero after order failure'
      );
      const buyerFinalBalance = await provider.connection.getBalance(failBuyer.publicKey);
      assert.approximately(
        (buyerFinalBalance - buyerInitialBalance) / LAMPORTS_PER_SOL,
        escrowAmount.toNumber() / LAMPORTS_PER_SOL,
        0.01 // For tx fee
      );

      const escrowPDABalanceAfterFail = await provider.connection.getBalance(failEscrowPDA);
      assert.equal(
        escrowPDABalanceAfterFail.toString(),
        new BN(escrowPDABalanceBeforeFail).sub(escrowAmount).toString(),
        'Escrow PDA balance should decrease by escrowAmount'
      );
    });

    it('Close escrow after failure', async () => {
      const receiverInitialBalance = await provider.connection.getBalance(failBuyer.publicKey);
      const escrowPDARentBeforeClose = await provider.connection.getBalance(failEscrowPDA);

      await program.methods
        .closeEscrow()
        .accounts({
          escrowAccount: failEscrowPDA,
          receiver: failBuyer.publicKey,
        } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
        .signers([failBuyer])
        .rpc();

      try {
        await program.account.escrowAccount.fetch(failEscrowPDA);
        assert.fail('Escrow account should be closed');
      } catch (error) {
        assert.include((error as Error).toString(), 'Account does not exist');
      }
      const receiverFinalBalance = await provider.connection.getBalance(failBuyer.publicKey);
      assert.approximately(
        (receiverFinalBalance - receiverInitialBalance) / LAMPORTS_PER_SOL,
        escrowPDARentBeforeClose / LAMPORTS_PER_SOL,
        0.01 // For transaction fee
      );
    });
  });

  // --- ERROR CONDITIONS ---
  describe('Error conditions', () => {
    // This flow will re-use an escrow.
    // For robust error testing, it's best to set up the exact state needed for each error.
    // Here, we'll initialize one and try to misuse it.
    const errorBuyer = Keypair.generate();
    const errorSeller = Keypair.generate();
    const errorOrderDetails = 'Order for error tests';
    let errorEscrowPDA: PublicKey;

    before(async () => {
      await Promise.all([
        provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(errorBuyer.publicKey, 3 * LAMPORTS_PER_SOL)
        ),
        provider.connection.confirmTransaction(
          await provider.connection.requestAirdrop(errorSeller.publicKey, 0.5 * LAMPORTS_PER_SOL)
        ), // Seller needs SOL for multiple txns
      ]);

      [errorEscrowPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('escrow'),
          errorBuyer.publicKey.toBuffer(),
          errorSeller.publicKey.toBuffer(),
          Buffer.from(errorOrderDetails),
        ],
        program.programId
      );

      await program.methods
        .initialize(errorOrderDetails, escrowAmount)
        .accounts({
          buyer: errorBuyer.publicKey,
          seller: errorSeller.publicKey,
        })
        .signers([errorBuyer])
        .rpc();
    });

    it('Unauthorized seller cannot withdraw funds', async () => {
      const unauthorizedSeller = Keypair.generate();
      await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(
          unauthorizedSeller.publicKey,
          0.1 * LAMPORTS_PER_SOL
        )
      );

      // Confirm order first with the correct seller
      await program.methods
        .confirmOrder()
        .accounts({
          escrowAccount: errorEscrowPDA,
          seller: errorSeller.publicKey, // Correct seller
        } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
        .signers([errorSeller])
        .rpc();

      try {
        await program.methods
          .withdrawFunds()
          .accounts({
            escrowAccount: errorEscrowPDA,
            seller: unauthorizedSeller.publicKey, // Unauthorized seller's AccountInfo
          })
          .signers([unauthorizedSeller]) // Unauthorized seller signs
          .rpc();
        assert.fail('Should have thrown an error for unauthorized withdrawal');
      } catch (error) {
        // Anchor wraps program errors. The actual error from the program is 'Unauthorized'.
        // The error message might contain 'AnchorError' and the error code/name.
        assert.include((error as any).toString(), 'Unauthorized');
      }
    });

    it('Cannot refund after confirmation', async () => {
      // Order is already confirmed from the previous test for errorEscrowPDA
      try {
        await program.methods
          .refundOrder()
          .accounts({
            escrowAccount: errorEscrowPDA,
            buyer: errorBuyer.publicKey,
          } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
          .signers([errorBuyer])
          .rpc();
        assert.fail('Should have thrown an error for refunding confirmed order');
      } catch (error) {
        assert.include((error as any).toString(), 'InvalidStatusForRefund');
      }
    });

    // Clean up after error tests: complete and close the errorEscrowPDA
    after(async () => {
      // Ensure escrow is in a state that can be withdrawn (it should be 'Confirmed')
      let escrowState = await program.account.escrowAccount.fetch(errorEscrowPDA);
      if (escrowState.status.confirmed) {
        await program.methods
          .withdrawFunds()
          .accounts({
            escrowAccount: errorEscrowPDA,
            seller: errorSeller.publicKey, // Correct seller
          })
          .signers([errorSeller])
          .rpc();
      } else {
        console.warn(
          "Skipping withdraw in 'Error conditions' after hook as escrow was not confirmed or already handled."
        );
      }

      // Now close
      escrowState = await program.account.escrowAccount.fetch(errorEscrowPDA);
      if (
        escrowState.status.completed ||
        escrowState.status.refunded ||
        escrowState.status.failed
      ) {
        await program.methods
          .closeEscrow()
          .accounts({
            escrowAccount: errorEscrowPDA,
            receiver: errorBuyer.publicKey,
          } as any) // TODO: Cast to any to avoid type error, check again in next version of Anchor
          .signers([errorBuyer])
          .rpc();
      } else {
        console.warn(
          "Skipping closeEscrow in 'Error conditions' after hook as escrow was not in a final state."
        );
      }
    });
  });

  it('Rejects excessively long order details', async () => {
    const longOrderDetails = 'a'.repeat(33); // 33 characters
    const tempBuyer = Keypair.generate(); // Use temp buyer to avoid PDA collision if main buyer is reused
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(tempBuyer.publicKey, 1 * LAMPORTS_PER_SOL)
    );

    try {
      await program.methods
        .initialize(longOrderDetails, escrowAmount)
        .accounts({
          buyer: tempBuyer.publicKey,
          seller: seller.publicKey,
        })
        .signers([tempBuyer])
        .rpc();
      assert.fail('Should have thrown an error for long order details');
    } catch (error) {
      assert.include((error as any).toString(), 'maximum depth');
    }
  });
});
