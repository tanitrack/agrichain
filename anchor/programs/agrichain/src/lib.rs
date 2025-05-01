#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

// Removed unresolved import
use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod transaction {
    use super::*;

    pub fn initialize_checkout(
        ctx: Context<InitializeCheckout>,
        product_id: u64,
        amount: u64,
    ) -> Result<()> {
        let checkout = &mut ctx.accounts.checkout;
        checkout.buyer = *ctx.accounts.buyer.key;
        checkout.seller = *ctx.accounts.seller.key;
        checkout.amount = amount;
        checkout.product_id = product_id;
        checkout.is_confirmed = false;
        checkout.is_refunded = false;

        // transfer lamports to escrow account
        **ctx.accounts.buyer.try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.escrow.try_borrow_mut_lamports()? += amount;

        msg!(
            "Checkout initialized for product {} with amount {}",
            product_id,
            amount
        );
        Ok(())
    }

    pub fn confirm_order(ctx: Context<ConfirmOrder>) -> Result<()> {
        let checkout = &mut ctx.accounts.checkout;
        require!(!checkout.is_confirmed, CustomError::AlreadyConfirmed);
        require!(!checkout.is_refunded, CustomError::AlreadyRefunded);

        checkout.is_confirmed = true;

        // Transfer lamports from escrow to seller
        **ctx.accounts.escrow.try_borrow_mut_lamports()? -= checkout.amount;
        **ctx.accounts.seller.try_borrow_mut_lamports()? += checkout.amount;

        msg!("Order confirmed and funds transferred to seller");
        Ok(())
    }

    pub fn refund_order(ctx: Context<RefundOrder>) -> Result<()> {
        let checkout = &mut ctx.accounts.checkout;
        require!(!checkout.is_refunded, CustomError::AlreadyRefunded);
        require!(!checkout.is_confirmed, CustomError::AlreadyConfirmed); // can't refund if already confirmed

        checkout.is_refunded = true;

        // Return funds to buyer from escrow
        **ctx.accounts.escrow.try_borrow_mut_lamports()? -= checkout.amount;
        **ctx.accounts.buyer.try_borrow_mut_lamports()? += checkout.amount;

        msg!("Order refunded to buyer");
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(product_id: u64)]
pub struct InitializeCheckout<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Seller digunakan sebagai alamat tujuan; validasi dilakukan offchain
    pub seller: AccountInfo<'info>,
    #[account(
        init,
        payer = buyer,
        space = 8 + Checkout::INIT_SPACE,
        seeds = [b"checkout", buyer.key().as_ref(), &product_id.to_le_bytes()],
        bump,
    )]
    pub checkout: Account<'info, Checkout>,

    #[account(
        mut,
        seeds = [b"escrow", buyer.key().as_ref(), &product_id.to_le_bytes()],
        bump,
    )]
    pub escrow: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ConfirmOrder<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        mut,
        seeds = [b"checkout", checkout.buyer.as_ref(), &checkout.product_id.to_le_bytes()],
        bump,
        has_one = seller,
        )]
    pub checkout: Account<'info, Checkout>,

    #[account(
        mut,
        seeds = [b"escrow", checkout.buyer.as_ref(), &checkout.product_id.to_le_bytes()],
        bump,
    )]
    pub escrow: SystemAccount<'info>,

    /// CHECK: Seller digunakan sebagai alamat tujuan; validasi dilakukan offchain
    #[account(mut)]
    pub seller_fund: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RefundOrder<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"checkout", buyer.key().as_ref(), &checkout.product_id.to_le_bytes()],
        bump,
        has_one = buyer,
    )]
    pub checkout: Account<'info, Checkout>,

    #[account(
        mut,
        seeds = [b"escrow", buyer.key().as_ref(), &checkout.product_id.to_le_bytes()],
        bump,
    )]
    pub escrow: SystemAccount<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Checkout {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub amount: u64,
    pub product_id: u64,
    pub is_confirmed: bool,
    pub is_refunded: bool,
}

#[error_code]
pub enum CustomError {
    #[msg("Order already confirmed")]
    AlreadyConfirmed,
    #[msg("Order already refunded")]
    AlreadyRefunded,
}
