import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Votedapp } from '../target/types/votedapp'

describe('votedapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votedapp as Program<Votedapp>

  const votedappKeypair = Keypair.generate()

  it('Initialize Votedapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        votedapp: votedappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votedappKeypair])
      .rpc()

    const currentCount = await program.account.votedapp.fetch(votedappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votedapp', async () => {
    await program.methods.increment().accounts({ votedapp: votedappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votedapp.fetch(votedappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votedapp Again', async () => {
    await program.methods.increment().accounts({ votedapp: votedappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votedapp.fetch(votedappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votedapp', async () => {
    await program.methods.decrement().accounts({ votedapp: votedappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votedapp.fetch(votedappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votedapp value', async () => {
    await program.methods.set(42).accounts({ votedapp: votedappKeypair.publicKey }).rpc()

    const currentCount = await program.account.votedapp.fetch(votedappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votedapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votedapp: votedappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votedapp.fetchNullable(votedappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
