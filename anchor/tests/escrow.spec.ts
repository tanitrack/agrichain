import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Escrow } from '../target/types/escrow';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { assert } from 'chai';
import { BN } from 'bn.js';

describe('escrow', () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Escrow as Program<Escrow>;

  // Test accounts
  const buyer = Keypair.generate();
  const seller = Keypair.generate();

  // Test parameters
  const orderDetails = 'Sample order: 1 item';
  const escrowAmount = new BN(1 * LAMPORTS_PER_SOL); // 1 SOL

  // Account addresses to be derived
  let escrowPDA: PublicKey;
  let vaultPDA: PublicKey;
  // eslint-disable-next-line unused-imports/no-unused-vars
  let escrowBump: number;
  // eslint-disable-next-line unused-imports/no-unused-vars
  let vaultBump: number;

  before(async () => {
    // Airdrop SOL to buyer for testing
    const signature = await provider.connection.requestAirdrop(
      buyer.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    // Also airdrop to seller for transaction fees
    const sellerSignature = await provider.connection.requestAirdrop(
      seller.publicKey,
      0.1 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sellerSignature);

    // Derive PDA addresses
    [escrowPDA, escrowBump] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('escrow'),
        buyer.publicKey.toBuffer(),
        seller.publicKey.toBuffer(),
        Buffer.from(orderDetails),
      ],
      program.programId
    );

    [vaultPDA, vaultBump] = await PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), escrowPDA.toBuffer()],
      program.programId
    );

    console.log(`Escrow PDA: ${escrowPDA.toString()}`);
    console.log(`Vault PDA: ${vaultPDA.toString()}`);
  });

  it('Initialize escrow', async () => {
    // Act
    await program.methods
      .initialize(orderDetails, escrowAmount)
      .accounts({
        buyer: buyer.publicKey,
        seller: seller.publicKey,
      })
      .signers([buyer])
      .rpc();

    // Assert
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    assert.equal(escrowAccount.buyer.toString(), buyer.publicKey.toString());
    assert.equal(escrowAccount.seller.toString(), seller.publicKey.toString());
    assert.equal(escrowAccount.orderDetails, orderDetails);
    assert.equal(escrowAccount.amount.toString(), escrowAmount.toString());
    assert.deepEqual(escrowAccount.status, { initialized: {} });

    // Verify funds were transferred to vault
    const vaultBalance = await provider.connection.getBalance(vaultPDA);
    assert.equal(vaultBalance.toString(), escrowAmount.toString());
  });

  it('Seller confirms the order', async () => {
    // Act
    await program.methods
      .confirmOrder()
      .accounts({
        escrowAccount: escrowPDA,
      })
      .signers([seller])
      .rpc();

    // Assert
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    assert.deepEqual(escrowAccount.status, { confirmed: {} });
  });

  it('Seller withdraws funds after confirmation', async () => {
    // Arrange
    const sellerInitialBalance = await provider.connection.getBalance(seller.publicKey);

    // Act
    await program.methods
      .withdrawFunds()
      .accounts({
        escrowAccount: escrowPDA,
      })
      .signers([seller])
      .rpc();

    // Assert
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    assert.deepEqual(escrowAccount.status, { completed: {} });
    assert.equal(escrowAccount.amount.toString(), '0');

    // Check seller received the funds (approximately, accounting for tx fees)
    const sellerFinalBalance = await provider.connection.getBalance(seller.publicKey);
    const balanceDifference = sellerFinalBalance - sellerInitialBalance;
    // Allow for transaction fees (up to 0.01 SOL)
    assert.approximately(
      balanceDifference / LAMPORTS_PER_SOL,
      Number(escrowAmount) / LAMPORTS_PER_SOL,
      0.01
    );
  });

  it('Close escrow after completion', async () => {
    // Arrange - use buyer as receiver in this case
    const buyerInitialBalance = await provider.connection.getBalance(buyer.publicKey);
    const vaultBalance = await provider.connection.getBalance(vaultPDA);

    // Act
    await program.methods
      .closeEscrow()
      .accounts({
        receiver: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();

    // Assert
    // Verify the escrow account is closed
    try {
      await program.account.escrowAccount.fetch(escrowPDA);
      assert.fail('Escrow account should be closed');
    } catch (error) {
      assert.include((error as Error).toString(), 'Account does not exist');
    }

    // Verify any remaining rent from the vault was transferred to the receiver
    const buyerFinalBalance = await provider.connection.getBalance(buyer.publicKey);
    // Account for transaction fee (up to 0.01 SOL)
    assert.approximately(
      (buyerFinalBalance - buyerInitialBalance) / LAMPORTS_PER_SOL,
      vaultBalance / LAMPORTS_PER_SOL,
      0.01
    );
  });

  // Additional test: Create a new escrow and test refund flow
  describe('Refund flow', () => {
    before(async () => {
      // Airdrop more SOL to buyer
      const signature = await provider.connection.requestAirdrop(
        buyer.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(signature);

      // Create a new escrow
      await program.methods
        .initialize(orderDetails, escrowAmount)
        .accounts({
          buyer: buyer.publicKey,
          seller: seller.publicKey,
        })
        .signers([buyer])
        .rpc();
    });

    it('Refund escrow before confirmation', async () => {
      // Arrange
      const buyerInitialBalance = await provider.connection.getBalance(buyer.publicKey);

      // Act
      await program.methods
        .refundOrder()
        .accounts({
          buyer: buyer.publicKey,
          escrowAccount: escrowPDA,
        })
        .signers([buyer])
        .rpc();

      // Assert
      const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
      assert.deepEqual(escrowAccount.status, { refunded: {} });

      // Check buyer received the refund (accounting for tx fees)
      const buyerFinalBalance = await provider.connection.getBalance(buyer.publicKey);
      // Allow for transaction fee (up to 0.01 SOL)
      assert.approximately(
        (buyerFinalBalance - buyerInitialBalance) / LAMPORTS_PER_SOL,
        Number(escrowAmount) / LAMPORTS_PER_SOL,
        0.01
      );

      // Verify vault is empty
      const vaultBalance = await provider.connection.getBalance(vaultPDA);
      assert.equal(vaultBalance, 0);
    });

    it('Close escrow after refund', async () => {
      // Act
      await program.methods
        .closeEscrow()
        .accounts({
          receiver: buyer.publicKey,
        })
        .signers([buyer])
        .rpc();

      // Assert - verify escrow account is closed
      try {
        await program.account.escrowAccount.fetch(escrowPDA);
        assert.fail('Escrow account should be closed');
      } catch (error) {
        assert.include((error as Error).toString(), 'Account does not exist');
      }
    });
  });

  // Additional test: Create a new escrow and test fail order flow
  describe('Fail order flow', () => {
    before(async () => {
      // Airdrop more SOL to buyer
      const signature = await provider.connection.requestAirdrop(
        buyer.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(signature);

      // Create a new escrow
      await program.methods
        .initialize(orderDetails, escrowAmount)
        .accounts({
          buyer: buyer.publicKey,
          seller: seller.publicKey,
        })
        .signers([buyer])
        .rpc();
    });

    it('Fail order (by seller)', async () => {
      // Arrange
      const buyerInitialBalance = await provider.connection.getBalance(buyer.publicKey);

      // Act - Seller initiates the fail
      await program.methods
        .failOrder()
        .accounts({
          escrowAccount: escrowPDA,
          buyer: buyer.publicKey,
          authority: seller.publicKey,
        })
        .signers([seller])
        .rpc();

      // Assert
      const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
      assert.deepEqual(escrowAccount.status, { failed: {} });

      // Check buyer received the funds back
      const buyerFinalBalance = await provider.connection.getBalance(buyer.publicKey);
      assert.approximately(
        (buyerFinalBalance - buyerInitialBalance) / LAMPORTS_PER_SOL,
        Number(escrowAmount) / LAMPORTS_PER_SOL,
        0.01
      );
    });

    it('Close escrow after failure', async () => {
      // Act
      await program.methods
        .closeEscrow()
        .accounts({
          receiver: buyer.publicKey,
        })
        .signers([buyer])
        .rpc();

      // Assert - verify escrow account is closed
      try {
        await program.account.escrowAccount.fetch(escrowPDA);
        assert.fail('Escrow account should be closed');
      } catch (error) {
        assert.include((error as Error).toString(), 'Account does not exist');
      }
    });
  });

  // Error condition tests
  describe('Error conditions', () => {
    before(async () => {
      // Airdrop more SOL to buyer
      const signature = await provider.connection.requestAirdrop(
        buyer.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(signature);

      // Create a new escrow
      await program.methods
        .initialize(orderDetails, escrowAmount)
        .accounts({
          buyer: buyer.publicKey,
          seller: seller.publicKey,
        })
        .signers([buyer])
        .rpc();
    });

    it('Unauthorized seller cannot withdraw funds', async () => {
      // Arrange
      const unauthorizedSeller = Keypair.generate();

      // Airdrop some SOL for transaction fees
      const signature = await provider.connection.requestAirdrop(
        unauthorizedSeller.publicKey,
        0.1 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(signature);

      // Confirm order first
      await program.methods
        .confirmOrder()
        .accounts({
          escrowAccount: escrowPDA,
        })
        .signers([seller])
        .rpc();

      // Act & Assert
      try {
        await program.methods
          .withdrawFunds()
          .accounts({
            escrowAccount: escrowPDA,
          })
          .signers([unauthorizedSeller])
          .rpc();
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.include((error as Error).toString(), 'Unauthorized');
      }
    });

    it('Cannot refund after confirmation', async () => {
      // Already confirmed in previous test

      // Act & Assert
      try {
        await program.methods
          .refundOrder()
          .accounts({
            buyer: buyer.publicKey,
            escrowAccount: escrowPDA,
          })
          .signers([buyer])
          .rpc();
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.include((error as Error).toString(), 'InvalidStatusForRefund');
      }
    });

    // Clean up after error tests
    after(async () => {
      // Complete the escrow normally
      await program.methods
        .withdrawFunds()
        .accounts({
          escrowAccount: escrowPDA,
        })
        .signers([seller])
        .rpc();

      // Close the escrow
      await program.methods
        .closeEscrow()
        .accounts({
          receiver: buyer.publicKey,
        })
        .signers([buyer])
        .rpc();
    });
  });

  // Test long order details
  it('Rejects excessively long order details', async () => {
    // Arrange
    const longOrderDetails = 'a'.repeat(101); // Exceeds 100 char limit

    // Act & Assert
    try {
      await program.methods
        .initialize(longOrderDetails, escrowAmount)
        .accounts({
          buyer: buyer.publicKey,
          seller: seller.publicKey,
        })
        .signers([buyer])
        .rpc();
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.include((error as Error).toString(), 'OrderDetailsTooLong');
    }
  });
});
