import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import OrderBookAcceptDialog from '@/components/orderbook/order-book-accept-dialog';
import { TransactionFlowExplorerDialog } from '@/components/transaction/transaction-flow-explorer-dialog';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { OrderBookDetailType } from '@/types/order-book';
import { Id } from '../../convex/_generated/dataModel'; // Import Id

// Import the new components
import { OrderBookHeader } from '@/components/orderbook/detail/OrderBookHeader';
import { OrderBookDetailsCard } from '@/components/orderbook/detail/OrderBookDetailsCard';
import { OrderBookHistoryCard } from '@/components/orderbook/detail/OrderBookHistoryCard';
import { OrderBookDeliveryCard } from '@/components/orderbook/detail/OrderBookDeliveryCard';

const OrderBookDetail = () => {
  const { id } = useParams<{ id: Id<'orderBook'> }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const { userProfile } = useAuthCheck();

  const orderBook = useQuery(api.orderbook_queries.get, id ? { id } : 'skip') as
    | OrderBookDetailType
    | undefined; // Convert string id to Id<'orderBook'>
  const loading = orderBook === undefined;

  const handleAccept = () => {
    setAcceptDialogOpen(true);
  };

  const handleAcceptOrderBook = () => {
    // This logic will be handled by the mutation in the dialog
    setAcceptDialogOpen(false);
  };

  const handleReject = () => {
    // This logic will be handled by a mutation
    toast({
      title: language === 'id' ? 'Pesanan Ditolak' : 'Order Rejected',
      description:
        language === 'id'
          ? `Anda telah menolak pesanan ${orderBook?._id}` // Use _id
          : `You have rejected the order ${orderBook?._id}`, // Use _id
      variant: 'destructive',
    });
  };

  // Render status badge with appropriate color
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      open: {
        label: t('status.open'),
        className: 'bg-blue-100 text-blue-800',
      },
      accepted: {
        label: t('status.accepted'),
        className: 'bg-green-100 text-green-800',
      },
      completed: {
        label: t('status.completed'),
        className: 'bg-teal-100 text-teal-800',
      },
      expired: {
        label: t('status.expired'),
        className: 'bg-gray-100 text-gray-800',
      },
      cancelled: {
        label: t('status.canceled'),
        className: 'bg-red-100 text-red-800',
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return <Badge className={`${statusInfo.className}`}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="mx-auto mb-4 h-8 w-32 rounded bg-earth-light-green"></div>
            <div className="mx-auto h-4 w-64 rounded bg-earth-light-green"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!orderBook) {
    return (
      <MainLayout>
        <div className="py-12 text-center">
          <h2 className="mb-2 text-2xl font-bold text-earth-dark-green">
            {t('orderbook.notfound')}
          </h2>
          <p className="mb-6 text-earth-medium-green">
            {language === 'id'
              ? 'Entri order book yang diminta tidak dapat ditemukan.'
              : 'The requested order book entry could not be found.'}
          </p>
          <Button
            onClick={() => navigate('/order-book')}
            className="bg-earth-dark-green hover:bg-earth-medium-green"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('action.back')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header with action buttons */}
      <OrderBookHeader
        orderBook={orderBook}
        userProfile={userProfile}
        navigate={navigate}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />

      {/* Main content sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main content - 2/3 width on desktop */}
        <div className="space-y-6 md:col-span-2">
          {/* Order Details Card */}
          <OrderBookDetailsCard
            orderBook={orderBook}
            userProfile={userProfile}
            getStatusBadge={getStatusBadge}
          />

          {/* History Card */}
          <OrderBookHistoryCard orderBook={orderBook} />
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Transaction Flow Explainer Card (kept in this file) */}
          <TransactionFlowExplorerDialog />

          {/* Delivery Information Card */}
          <OrderBookDeliveryCard
            orderBook={orderBook}
            t={t}
            language={language}
            formatDate={formatDate}
          />

          {/* Removed Quick Actions Card */}
        </div>
      </div>

      {/* Order accept dialog (kept in this file) */}
      <OrderBookAcceptDialog
        isOpen={acceptDialogOpen}
        onOpenChange={setAcceptDialogOpen}
        orderBook={orderBook}
        onAcceptOrderBook={handleAcceptOrderBook}
      />
    </MainLayout>
  );
};

export default OrderBookDetail;
