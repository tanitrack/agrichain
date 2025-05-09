#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, order_details: String, amount: u64) -> Result<()> {
        require!(order_details.len() <= 100, EscrowError::OrderDetailsTooLong);

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
            to: ctx.accounts.vault_account.to_account_info(),
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
        let escrow = &ctx.accounts.escrow_account;
        require!(
            escrow.status == EscrowStatus::Initialized,
            EscrowError::InvalidStatusForRefund
        );

        // Transfer funds from vault back to buyer
        transfer_lamports(
            &ctx.accounts.vault_account,
            &ctx.accounts.buyer,
            escrow.amount,
        )?;

        ctx.accounts.escrow_account.status = EscrowStatus::Refunded;
        Ok(())
    }

    pub fn fail_order(ctx: Context<FailOrder>) -> Result<()> {
        let escrow = &ctx.accounts.escrow_account;
        let authority_key = ctx.accounts.authority.key();

        require!(
            authority_key == escrow.buyer || authority_key == escrow.seller,
            EscrowError::Unauthorized
        );
        require!(
            escrow.status == EscrowStatus::Initialized,
            EscrowError::InvalidStatusForFailure
        );

        transfer_lamports(
            &ctx.accounts.vault_account,
            &ctx.accounts.buyer,
            escrow.amount,
        )?;

        ctx.accounts.escrow_account.status = EscrowStatus::Failed;
        Ok(())
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
        let escrow = &ctx.accounts.escrow_account;
        require!(
            escrow.status == EscrowStatus::Confirmed,
            EscrowError::InvalidStatusForWithdrawal
        );

        require!(escrow.amount > 0, EscrowError::AlreadyWithdrawn);

        transfer_lamports(
            &ctx.accounts.vault_account,
            &ctx.accounts.seller,
            escrow.amount,
        )?;

        ctx.accounts.escrow_account.status = EscrowStatus::Completed;
        ctx.accounts.escrow_account.amount = 0;
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

        **ctx.accounts.receiver.try_borrow_mut_lamports()? +=
            **ctx.accounts.vault_account.try_borrow_lamports()?;
        **ctx.accounts.vault_account.try_borrow_mut_lamports()? = 0;

        Ok(())
    }
}

// Helper to transfer lamports from a PDA
fn transfer_lamports(from: &AccountInfo, to: &AccountInfo, amount: u64) -> Result<()> {
    **from.try_borrow_mut_lamports()? -= amount;
    **to.try_borrow_mut_lamports()? += amount;
    Ok(())
}

#[account]
#[derive(InitSpace)]
pub struct EscrowAccount {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    #[max_len(100)]
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

    #[account(
        seeds = [b"vault", escrow_account.key().as_ref()],
        bump,
    )]
    pub vault_account: SystemAccount<'info>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Only needed for the address
    #[account(mut)]
    pub seller: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RefundOrder<'info> {
    #[account(mut)]
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(
        mut,
        seeds = [b"vault", escrow_account.key().as_ref()],
        bump
    )]
    pub vault_account: SystemAccount<'info>,

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
    #[account(mut)]
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(
        mut,
        seeds = [b"vault", escrow_account.key().as_ref()],
        bump
    )]
    pub vault_account: SystemAccount<'info>,

    /// CHECK: based on constraint
    #[account(
        mut,
        constraint = buyer.key() == escrow_account.buyer
    )]
    pub buyer: AccountInfo<'info>,

    #[account(
        constraint = authority.key() == escrow_account.buyer || authority.key() == escrow_account.seller
    )]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(
        mut,
        has_one = seller @ EscrowError::Unauthorized
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(
        mut,
        seeds = [b"vault", escrow_account.key().as_ref()],
        bump
    )]
    pub vault_account: SystemAccount<'info>,

    #[account(mut)]
    pub seller: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseEscrow<'info> {
    #[account(
        mut,
        close = receiver,
        seeds = [b"escrow", escrow_account.buyer.as_ref(), escrow_account.seller.as_ref(), escrow_account.order_details.as_bytes()],
        bump = escrow_account.bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    #[account(
        mut,
        seeds = [b"vault", escrow_account.key().as_ref()],
        bump
    )]
    /// CHECK: We'll send rent lamports back, so manual cleanup is needed
    pub vault_account: AccountInfo<'info>,

    /// Can be buyer or a refund receiver
    #[account(mut)]
    pub receiver: Signer<'info>,

    pub system_program: Program<'info, System>,
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
    #[msg("Order details exceed maximum length of 100 characters")]
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
