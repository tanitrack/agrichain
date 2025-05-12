#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_lang::system_program;
// declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF"); // localnet
declare_id!("49BKpDeZKKAGt6cRn5fGb3DizL64XSyHpbta3xdbSEKq"); // devnet

#[program]
pub mod escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, order_details: String, amount: u64) -> Result<()> {
        require!(order_details.len() <= 32, EscrowError::OrderDetailsTooLong);
        require!(amount > 0, EscrowError::ZeroAmount);

        let escrow_account = &mut ctx.accounts.escrow_account;

        escrow_account.buyer = ctx.accounts.buyer.key();
        escrow_account.seller = ctx.accounts.seller.key();
        escrow_account.order_details = order_details;
        escrow_account.amount = amount;
        escrow_account.status = EscrowStatus::Initialized;
        escrow_account.bump = ctx.bumps.escrow_account;

        // Transfer funds to the vault PDA
        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.escrow_account.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
        system_program::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn confirm_order(ctx: Context<ConfirmOrder>) -> Result<()> {
        ctx.accounts.escrow_account.status = EscrowStatus::Confirmed;
        Ok(())
    }

    pub fn refund_order(ctx: Context<RefundOrder>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow_account;

        require!(
            escrow.status == EscrowStatus::Initialized,
            EscrowError::InvalidStatusForRefund
        );
        require!(escrow.amount > 0, EscrowError::ZeroAmount);

        // Transfer funds from escrow back to buyer
        transfer_lamports(
            &escrow.to_account_info(),
            &ctx.accounts.buyer.to_account_info(),
            escrow.amount,
        )?;

        escrow.status = EscrowStatus::Refunded;
        escrow.amount = 0; // Set amount to zero after refund
        Ok(())
    }

    pub fn fail_order(ctx: Context<FailOrder>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow_account;
        let authority_key = ctx.accounts.authority.key();

        require!(
            authority_key == escrow.buyer || authority_key == escrow.seller,
            EscrowError::Unauthorized
        );
        require!(
            escrow.status == EscrowStatus::Initialized,
            EscrowError::InvalidStatusForFailure
        );
        require!(escrow.amount > 0, EscrowError::ZeroAmount);

        transfer_lamports(
            &escrow.to_account_info(),
            &ctx.accounts.buyer,
            escrow.amount,
        )?;

        escrow.status = EscrowStatus::Failed;
        escrow.amount = 0; // Set amount to zero after failure
        Ok(())
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow_account;
        require!(
            escrow.status == EscrowStatus::Confirmed,
            EscrowError::InvalidStatusForWithdrawal
        );
        require!(
            escrow.status == EscrowStatus::Confirmed,
            EscrowError::InvalidStatusForWithdrawal
        );

        require!(escrow.amount > 0, EscrowError::AlreadyWithdrawn);

        transfer_lamports(
            &escrow.to_account_info(),
            &ctx.accounts.seller,
            escrow.amount,
        )?;

        escrow.status = EscrowStatus::Completed;
        escrow.amount = 0;
        Ok(())
    }

    pub fn close_escrow(ctx: Context<CloseEscrow>) -> Result<()> {
        let escrow = &ctx.accounts.escrow_account;

        // Optional: only allow closing when status is final
        require!(
            matches!(
                escrow.status,
                EscrowStatus::Completed | EscrowStatus::Refunded | EscrowStatus::Failed
            ),
            EscrowError::InvalidStatusForClose
        );

        Ok(())
    }
}

// Helper to transfer lamports from a PDA
fn transfer_lamports(from: &AccountInfo, to: &AccountInfo, amount: u64) -> Result<()> {
    let from_lamports = **from.try_borrow_lamports()?;

    require!(from_lamports >= amount, EscrowError::InsufficientFunds);

    **from.try_borrow_mut_lamports()? -= amount;
    **to.try_borrow_mut_lamports()? += amount;
    Ok(())
}

#[account]
#[derive(InitSpace)]
pub struct EscrowAccount {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    #[max_len(32)]
    pub order_details: String,
    pub amount: u64,
    pub status: EscrowStatus,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(order_details: String, amount: u64)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        payer = buyer,
        space = EscrowAccount::INIT_SPACE,
        seeds = [b"escrow", buyer.key().as_ref(), seller.key().as_ref(), order_details.as_bytes()],
        bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: This is the seller's account, only need address
    #[account()]
    pub seller: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RefundOrder<'info> {
    #[account(
        mut, // Escrow account state and lamports will change
        seeds = [b"escrow", escrow_account.buyer.as_ref(), escrow_account.seller.as_ref(), escrow_account.order_details.as_bytes()],
        bump = escrow_account.bump,
        // Constraint for buyer already exists if needed, but signer implies authority
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(
        mut,
        constraint = buyer.key() == escrow_account.buyer
    )]
    pub buyer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ConfirmOrder<'info> {
    #[account(
        mut,
        has_one = seller @ EscrowError::Unauthorized
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(mut)]
    pub seller: Signer<'info>,
}

#[derive(Accounts)]
pub struct FailOrder<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow_account.buyer.as_ref(), escrow_account.seller.as_ref(), escrow_account.order_details.as_bytes()],
        bump = escrow_account.bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    /// CHECK: Destination for lamports refund
    #[account(
        mut,
        constraint = buyer.key() == escrow_account.buyer @ EscrowError::OnlyBuyerAllowed
    )]
    pub buyer: AccountInfo<'info>,

    #[account(
        constraint = authority.key() == escrow_account.buyer || authority.key() == escrow_account.seller @ EscrowError::Unauthorized
    )]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(
        mut,
        has_one = seller @ EscrowError::Unauthorized, // Ensures only the correct seller can call
        seeds = [b"escrow", escrow_account.buyer.as_ref(), escrow_account.seller.as_ref(), escrow_account.order_details.as_bytes()],
        bump = escrow_account.bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(mut)] // Seller receives the funds
    pub seller: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseEscrow<'info> {
    #[account(
        mut,
        close = receiver, // Closes escrow_account and sends its lamports to receiver
        seeds = [b"escrow", escrow_account.buyer.as_ref(), escrow_account.seller.as_ref(), escrow_account.order_details.as_bytes()],
        bump = escrow_account.bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    /// Can be buyer or a refund receiver
    #[account(mut)]
    pub receiver: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum EscrowStatus {
    Initialized,
    Confirmed,
    Completed,
    Refunded,
    Failed,
}

#[error_code]
pub enum EscrowError {
    // Input validation errors
    #[msg("Order details exceed maximum length of 32 characters")]
    OrderDetailsTooLong,

    #[msg("Escrow amount must be greater than zero")]
    ZeroAmount,

    // Authorization errors
    #[msg("Only the buyer can perform this operation")]
    OnlyBuyerAllowed,

    #[msg("Only the seller can perform this operation")]
    OnlySellerAllowed,

    #[msg("Unauthorized access: signer is neither buyer nor seller")]
    Unauthorized,

    // State transition errors
    #[msg("Cannot confirm escrow that is not in Initialized state")]
    InvalidStatusForConfirmation,

    #[msg("Cannot refund escrow that is not in Initialized state")]
    InvalidStatusForRefund,

    #[msg("Cannot mark as failed if escrow is not in Initialized state")]
    InvalidStatusForFailure,

    #[msg("Cannot withdraw funds if escrow is not in Confirmed state")]
    InvalidStatusForWithdrawal,

    #[msg("Cannot close escrow that is not in Completed, Refunded, or Failed state")]
    InvalidStatusForClose,

    // Fund-related errors
    #[msg("Insufficient funds in escrow account")]
    InsufficientFunds,

    #[msg("Funds have already been withdrawn")]
    AlreadyWithdrawn,

    #[msg("Fund transfer failed")]
    TransferFailed,

    // System errors
    #[msg("Failed to calculate PDA for escrow account")]
    PdaDerivationError,

    #[msg("Failed to calculate PDA for vault account")]
    VaultDerivationError,

    // Operational errors
    #[msg("Escrow has expired and can no longer be confirmed")]
    EscrowExpired,

    #[msg("Escrow is locked due to an ongoing dispute")]
    EscrowLocked,

    // Generic fallback error
    #[msg("An unexpected error occurred in the escrow program")]
    InternalError,
}
