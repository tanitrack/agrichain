#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod votedapp {
    use super::*;

  pub fn close(_ctx: Context<CloseVotedapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.votedapp.count = ctx.accounts.votedapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.votedapp.count = ctx.accounts.votedapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVotedapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.votedapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVotedapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Votedapp::INIT_SPACE,
  payer = payer
  )]
  pub votedapp: Account<'info, Votedapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVotedapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub votedapp: Account<'info, Votedapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub votedapp: Account<'info, Votedapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Votedapp {
  count: u8,
}
