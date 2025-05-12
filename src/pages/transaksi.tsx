import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Filter, Search, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { usePaginatedQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { TransactionType } from '@/types/transaction';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 100;

/**
 * TransaksiPage
 * Shows a paginated, type-safe list of on-chain transactions from Convex DB.
 * Uses Convex's usePaginatedQuery for efficient pagination.
 * UI is strictly typed, lint-friendly, and visually sensible.
 */
const TransaksiPage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Paginated query to Convex
  const { results: transactions } = usePaginatedQuery(
    api.transaction_queries.list,
    // { paginationOpts: { numItems: PAGE_SIZE, cursor } },
    {},
    { initialNumItems: PAGE_SIZE }
  );

  // Filter by search (client-side for now)
  const filteredTransactions = (transactions as TransactionType[]).filter((tx) => {
    const q = searchQuery.toLowerCase();
    return (
      q === '' ||
      tx._id.toLowerCase().includes(q) ||
      tx.buyerSolanaPublicKey.toLowerCase().includes(q) ||
      tx.sellerSolanaPublicKey.toLowerCase().includes(q) ||
      (tx.escrowPdaAddress?.toLowerCase().includes(q) ?? false) ||
      (tx.onChainEscrowStatus?.toLowerCase().includes(q) ?? false)
    );
  });

  // Status badge (can be improved with more statuses)
  const getStatusBadge = (status: string | undefined) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      initialized: { label: t('status.pending'), className: 'bg-blue-100 text-blue-800' },
      confirmed: { label: t('status.confirmed'), className: 'bg-emerald-100 text-emerald-800' },
      completed: { label: t('status.completed'), className: 'bg-green-100 text-green-800' },
      refunded: { label: t('status.refunded'), className: 'bg-yellow-100 text-yellow-800' },
      failed: { label: t('status.failed'), className: 'bg-red-100 text-red-800' },
      closed: { label: t('status.closed'), className: 'bg-gray-100 text-gray-800' },
    };
    const info = (status && statusMap[status]) || {
      label: status ?? '-',
      className: 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={`${info.className} rounded-full px-2 py-1 text-xs`}>{info.label}</Badge>
    );
  };

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold text-earth-dark-green">{t('transactions.title')}</h1>
        <p className="text-earth-medium-green">{t('transactions.subtitle')}</p>
      </div>
      <Card>
        <CardHeader className="earth-header-forest pb-3">
          <CardTitle className="mb-4 flex items-center text-lg text-white">
            <ShoppingCart className="mr-2 h-5 w-5" />
            {t('transactions.list')}
          </CardTitle>
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-earth-dark-green" />
              <Input
                type="search"
                placeholder={t('transactions.search')}
                className="border-earth-medium-green pl-8 focus:ring-2 focus:ring-earth-dark-green"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex gap-2 border-earth-medium-green bg-earth-pale-green text-earth-dark-green hover:bg-earth-light-green/40"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md ">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex flex-col gap-4 rounded-xl border border-earth-light-green bg-white p-6 shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-earth-dark-green">
                      ID: {shortenKey(tx._id)}
                    </span>
                    <span>{getStatusBadge(tx.onChainEscrowStatus)}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <div>
                      <span className="font-semibold">Buyer:</span>{' '}
                      <span className="font-mono">{shortenKey(tx.buyerSolanaPublicKey)}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Seller:</span>{' '}
                      <span className="font-mono">{shortenKey(tx.sellerSolanaPublicKey)}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Escrow PDA:</span>{' '}
                      <span className="font-mono">{shortenKey(tx.escrowPdaAddress)}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Amount:</span>{' '}
                      <span className="font-mono">{lamportsToSol(tx.amountLamports)} SOL</span>
                    </div>
                    <div>
                      <span className="font-semibold">Created:</span>{' '}
                      {formatDate(new Date(tx._creationTime))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <SolExplorerLink hash={tx.initializeTxHash} label="Init Tx" />
                    {tx.confirmOrderTxHash && (
                      <SolExplorerLink hash={tx.confirmOrderTxHash} label="Confirm Tx" />
                    )}
                    {tx.withdrawFundsTxHash && (
                      <SolExplorerLink hash={tx.withdrawFundsTxHash} label="Withdraw Tx" />
                    )}
                    {tx.refundOrderTxHash && (
                      <SolExplorerLink hash={tx.refundOrderTxHash} label="Refund Tx" />
                    )}
                    {tx.failOrderTxHash && (
                      <SolExplorerLink hash={tx.failOrderTxHash} label="Fail Tx" />
                    )}
                    {tx.closeEscrowTxHash && (
                      <SolExplorerLink hash={tx.closeEscrowTxHash} label="Close Escrow Tx" />
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Link to={`/transaction/${tx._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> {t('transactions.details')}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400">
                {t('transactions.noResults')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default TransaksiPage;

// --- Helpers and components below ---

function shortenKey(str: string, head = 6, tail = 4) {
  if (!str) return '-';
  return `${str.slice(0, head)}...${str.slice(-tail)}`;
}

function lamportsToSol(lamports: number) {
  return (lamports / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 9 });
}

function SolExplorerLink({ hash, label }: { hash?: string; label: string }) {
  if (!hash) return null;
  const url = `https://explorer.solana.com/tx/${hash}?cluster=devnet`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-xs text-blue-600 hover:underline"
      title={hash}
    >
      {label}: {shortenKey(hash, 8, 6)}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1 inline h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 7h2a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m10-10V5a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2z"
        />
      </svg>
    </a>
  );
}
