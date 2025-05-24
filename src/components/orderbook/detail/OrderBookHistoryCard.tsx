// src/components/orderbook/detail/OrderBookHistoryCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderBookDetailType } from '@/types/order-book';
import { useLanguage } from '@/contexts/language-context';
import { TransactionHistoryItem } from './TransactionHistoryItem'; // Import the new component

interface OrderBookHistoryCardProps {
  orderBook: OrderBookDetailType;
}

export const OrderBookHistoryCard: React.FC<OrderBookHistoryCardProps> = ({ orderBook }) => {
  const { language } = useLanguage();

  return (
    <Card className="overflow-hidden border-2 border-earth-light-green/70 shadow-md">
      <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green pb-3">
        <CardTitle className="text-white">
          {language === 'id' ? 'Riwayat Transaksi On-Chain' : 'On-Chain Transaction History'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {orderBook.transaction ? (
            <>
              {orderBook.transaction.initializeTxHash && (
                <TransactionHistoryItem
                  title={language === 'id' ? 'Inisialisasi Escrow' : 'Escrow Initialization'}
                  txHash={orderBook.transaction.initializeTxHash}
                  status={orderBook.transaction.onChainEscrowStatus}
                  isLast={
                    !orderBook.transaction.confirmOrderTxHash &&
                    !orderBook.transaction.markAsShippedTxHash &&
                    !orderBook.transaction.confirmGoodsReceivedTxHash &&
                    !orderBook.transaction.withdrawTxHash &&
                    !orderBook.transaction.failOrderTxHash
                  }
                />
              )}
              {orderBook.transaction.confirmOrderTxHash && (
                <TransactionHistoryItem
                  title={language === 'id' ? 'Konfirmasi Pesanan' : 'Order Confirmation'}
                  txHash={orderBook.transaction.confirmOrderTxHash}
                  status={orderBook.transaction.onChainEscrowStatus}
                  isLast={
                    !orderBook.transaction.markAsShippedTxHash &&
                    !orderBook.transaction.confirmGoodsReceivedTxHash &&
                    !orderBook.transaction.withdrawTxHash &&
                    !orderBook.transaction.failOrderTxHash
                  }
                />
              )}
              {orderBook.transaction.markAsShippedTxHash && (
                <TransactionHistoryItem
                  title={language === 'id' ? 'Tandai Dikirim' : 'Marked as Shipped'}
                  txHash={orderBook.transaction.markAsShippedTxHash}
                  status={orderBook.transaction.onChainEscrowStatus}
                  isLast={
                    !orderBook.transaction.confirmGoodsReceivedTxHash &&
                    !orderBook.transaction.withdrawTxHash &&
                    !orderBook.transaction.failOrderTxHash
                  }
                />
              )}
              {orderBook.transaction.confirmGoodsReceivedTxHash && (
                <TransactionHistoryItem
                  title={
                    language === 'id' ? 'Konfirmasi Barang Diterima' : 'Goods Received Confirmed'
                  }
                  txHash={orderBook.transaction.confirmGoodsReceivedTxHash}
                  status={orderBook.transaction.onChainEscrowStatus}
                  isLast={
                    !orderBook.transaction.withdrawTxHash && !orderBook.transaction.failOrderTxHash
                  }
                />
              )}
              {orderBook.transaction.withdrawTxHash && (
                <TransactionHistoryItem
                  title={language === 'id' ? 'Penarikan Dana' : 'Funds Withdrawal'}
                  txHash={orderBook.transaction.withdrawTxHash}
                  status={orderBook.transaction.onChainEscrowStatus}
                  isLast={!orderBook.transaction.failOrderTxHash}
                />
              )}
              {orderBook.transaction.failOrderTxHash && (
                <TransactionHistoryItem
                  title={language === 'id' ? 'Pesanan Gagal' : 'Order Failed'}
                  txHash={orderBook.transaction.failOrderTxHash}
                  status={orderBook.transaction.onChainEscrowStatus}
                  isLast={true} // This is always the last if it exists
                />
              )}
            </>
          ) : (
            <p className="text-earth-medium-green">
              {language === 'id'
                ? 'Belum ada riwayat transaksi on-chain untuk pesanan ini.'
                : 'No on-chain transaction history available for this order yet.'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
