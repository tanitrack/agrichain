import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Votedapp } from '../target/types/votedapp';
import { PublicKey } from '@solana/web3.js';
import { BankrunProvider, startAnchor } from 'anchor-bankrun';

const IDL = require('../target/idl/votedapp.json');
const voteAddress = new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF');

describe('votedapp', () => {
  let context;
  let provider;
  let voteProgram: Program<Votedapp>;

  beforeAll(async () => {
    context = await startAnchor('', [{ name: 'votedapp', programId: voteAddress }], []);
    provider = new BankrunProvider(context);
    voteProgram = new Program<Votedapp>(IDL, provider);
  });

  it('Initialize Votedapp', async () => {
    await voteProgram.methods
      .initializePoll(
        new anchor.BN(1),
        'Poll Description',
        new anchor.BN(0),
        new anchor.BN(1742352787)
      )
      .rpc();

    const [pollAdress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      voteAddress
    );
    const poll = await voteProgram.account.poll.fetch(pollAdress);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.pollDescription).toEqual('Poll Description');
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it('Initialize Candidate', async () => {
    await voteProgram.methods.initCandidate('Budi', new anchor.BN(1)).rpc();

    await voteProgram.methods.initCandidate('Telo', new anchor.BN(1)).rpc();

    const [budiAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Budi')],
      voteAddress
    );
    const budiCandidate = await voteProgram.account.candidate.fetch(budiAddress);

    const [teloAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Telo')],
      voteAddress
    );
    const teloCandidate = await voteProgram.account.candidate.fetch(teloAddress);

    expect(budiCandidate.candidateName).toEqual('Budi');
    expect(budiCandidate.voteCount.toNumber()).toEqual(0);
    expect(teloCandidate.candidateName).toEqual('Telo');
    expect(teloCandidate.voteCount.toNumber()).toEqual(0);
  });

  it('Vote', async () => {
    await voteProgram.methods.vote('Budi', new anchor.BN(1)).rpc();

    const [budiAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Budi')],
      voteAddress
    );
    const budiCandidate = await voteProgram.account.candidate.fetch(budiAddress);

    expect(budiCandidate.candidateName).toEqual('Budi');
    expect(budiCandidate.voteCount.toNumber()).toEqual(1);
  });
});
