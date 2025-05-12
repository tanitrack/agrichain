import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Eye, Check, Package, CheckCircle } from 'lucide-react'; // Added CheckCircle
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';

// Import Convex hooks and API
import { useQuery, useMutation, useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useEscrowTransaction } from '@/hooks/use-escrow-transaction';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { Id } from '../../convex/_generated/dataModel';

const OrderBook = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false); // State for seller confirmation loading
  const [isMarkingAsShipped, setIsMarkingAsShipped] = useState(false); // State for marking as shipped loading
  const [isConfirmingReceipt, setIsConfirmingReceipt] = useState(false); // State for buyer confirmation loading

  // Get logged-in user and wallet info
  const { userProfile, wallet: dynamicWalletInfo } = useAuthCheck();
  const userId = userProfile?._id; // Assuming userProfile contains the Convex user ID

  // Fetch orders where the logged-in user is the seller
  const sellerOrders = useQuery(
    api.orderbook_queries.listBySeller,
    userId ? { sellerId: userId } : 'skip' // Fetch if userId exists
  );

  // Fetch orders where the logged-in user is the buyer
  const buyerOrders = useQuery(
    api.orderbook_queries.listByBuyer,
    userId ? { buyerId: userId } : 'skip' // Fetch if userId exists
  );

  // Combine the results (handle potential undefined/null from skip)
  const allOrders = [...(sellerOrders || []), ...(buyerOrders || [])];

  // Filter order books based on search query and status (now applied to fetched data)
  const filteredOrdersToDisplay = allOrders.filter((orderBook) => {
    const matchesSearch =
      searchQuery === '' ||
      orderBook.komoditasId.toLowerCase().includes(searchQuery.toLowerCase()) || // Assuming komoditasId is searchable or fetch commodity name
      orderBook._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Need to fetch buyer/seller name based on buyerId/sellerId if not included in orderBook
      // orderBook.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // orderBook.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      false; // Placeholder until buyer/seller name is available

    const matchesStatus = statusFilter === 'all' || orderBook.status === statusFilter;

    // Adjust tab filtering to match fetched statuses
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'awaiting_confirmation' &&
        (orderBook.status === 'escrow_funded' ||
          orderBook.status === 'awaiting_seller_confirmation')) ||
      (activeTab === 'shipped' && orderBook.status === 'shipped') || // Filter for shipped status
      (activeTab === 'completed' && orderBook.status === 'goods_received'); // Filter for goods_received status

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Mutation for recording seller confirmation
  const recordSellerConfirmationMutation = useMutation(
    api.transaction_mutations.recordSellerConfirmation
  );
  // Mutation for marking order as shipped
  const markAsShippedMutation = useMutation(api.orderbook_mutations.markAsShipped);

  // Mutation for buyer confirming goods receipt
  const buyerConfirmsGoodsReceiptMutation = useMutation(
    api.orderbook_mutations.buyerConfirmsGoodsReceipt
  );

  const convex = useConvex(); // Get Convex client for direct query call

  // Function to handle viewing details
  const handleViewDetails = (id: Id<'orderBook'>) => {
    navigate(`/order-book/${id}`); // Assuming route uses Convex Id
  };

  // Function to handle accepting an order (This might be for the old flow, keep for now or remove if not needed)
  const handleAccept = (id: string) => {
    toast({
      title: 'Order Accepted',
      description: `You have accepted the order ${id}`,
    });
  };

  // Function to handle rejecting an order (This might be for the old flow, keep for now or remove if not needed)
  const handleReject = (id: string) => {
    toast({
      title: 'Order Rejected',
      description: `You have rejected the order ${id}`,
      variant: 'destructive',
    });
  };

  // Use the escrow transaction hook
  const { confirmOrder, isLoading: isEscrowActionLoading } = useEscrowTransaction();

  // Function to handle confirming an order (New function for Phase 3)
  const handleConfirmOrderClick = async (orderBookId: Id<'orderBook'>) => {
    if (!dynamicWalletInfo?.address) {
      toast({
        title: 'Error',
        description: 'Seller Solana wallet not available.',
        variant: 'destructive',
      });
      return;
    }
    setIsProcessingOrder(true); // Local state for this specific order action
    toast({ title: 'Processing Confirmation...', description: 'Please wait.' });

    try {
      const escrowDetails = await convex.query(api.transaction_queries.getEscrowDetailsForAction, {
        orderBookId,
      });
      if (!escrowDetails?.escrowPdaAddress) {
        throw new Error('Could not fetch escrow details for confirmation.');
      }

      toast({
        title: 'Awaiting Wallet Confirmation...',
        description: 'Please confirm the transaction in your wallet.',
      });
      await confirmOrder({
        escrowPda: escrowDetails.escrowPdaAddress,
        actorPublicKey: dynamicWalletInfo.address, // Seller's public key
        onSuccess: async (txSig) => {
          toast({
            title: 'Order Confirmed On-Chain!',
            description: `Tx: ${txSig.substring(0, 10)}...`,
          });
          await recordSellerConfirmationMutation({
            orderBookId: orderBookId,
            txHash: txSig,
            onChainStatus: 'confirmed',
          });
          // Optionally refetch orders or navigate
        },
        onError: (err) => {
          toast({
            title: 'Confirmation Failed',
            description: err.message || 'Could not confirm order on-chain.',
            variant: 'destructive',
          });
        },
        onSubmitted: (txSig) => {
          toast({
            title: 'Transaction Submitted',
            description: `Tx: ${txSig.substring(0, 10)}... Awaiting confirmation.`,
          });
        },
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to process order confirmation.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Function to handle marking an order as shipped (New function for Phase 4)
  const handleMarkAsShippedClick = async (orderBookId: Id<'orderBook'>) => {
    setIsMarkingAsShipped(true); // Local state for this specific order action
    toast({ title: 'Processing Shipment...', description: 'Please wait.' });

    try {
      // Call the Convex mutation to mark as shipped
      await markAsShippedMutation({ orderBookId }); // Add shippingDetails here if collecting them

      toast({ title: 'Order Marked as Shipped!', description: 'Status updated in TaniTrack.' });
      // Optionally refetch orders or rely on Convex real-time updates
    } catch (error) {
      toast({
        title: 'Failed to Mark as Shipped',
        description: (error as Error).message || 'Could not update order status.',
        variant: 'destructive',
      });
    } finally {
      setIsMarkingAsShipped(false);
    }
  };

  // Function to handle confirming goods receipt (New function for Buyer)
  const handleConfirmReceiptClick = async (orderBookId: Id<'orderBook'>) => {
    setIsConfirmingReceipt(true);
    toast({ title: 'Processing Confirmation...', description: 'Please wait.' });

    try {
      await buyerConfirmsGoodsReceiptMutation({ orderBookId });
      toast({ title: 'Goods Receipt Confirmed!', description: 'Status updated.' });
    } catch (error) {
      toast({
        title: 'Confirmation Failed',
        description: (error as Error).message || 'Could not confirm goods receipt.',
        variant: 'destructive',
      });
    } finally {
      setIsConfirmingReceipt(false);
    }
  };

  // Function to render status badge with appropriate color
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
      escrow_funded: {
        // Add new status
        label: 'Escrow Funded', // Or use translation key
        className: 'bg-yellow-100 text-yellow-800',
      },
      awaiting_seller_confirmation: {
        // Add new status
        label: 'Awaiting Confirmation', // Or use translation key
        className: 'bg-orange-100 text-orange-800',
      },
      seller_confirmed_awaiting_shipment: {
        // Add new status
        label: 'Confirmed, Awaiting Shipment', // Or use translation key
        className: 'bg-purple-100 text-purple-800',
      },
      shipped: {
        // Add new status for Phase 4
        label: 'Shipped', // Or use translation key
        className: 'bg-blue-500 text-white', // Example color
      },
      goods_received: {
        // Added new status for Buyer
        label: 'Goods Received', // Or use translation key
        className: 'bg-green-500 text-white', // Example color
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return <Badge className={`${statusInfo.className}`}>{statusInfo.label}</Badge>;
  };

  // Show loading state while fetching orders
  if (allOrders === undefined) {
    // Check loading for both queries
    return (
      <MainLayout>
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold">{t('orderbook.title')}</h1>
          <p className="text-gray-600">{t('orderbook.subtitle')}</p>
        </div>
        <Card className="">
          <CardHeader className="earth-header-forest pb-3">
            <CardTitle className="flex items-center text-lg text-white">
              <Package className="mr-2 h-5 w-5" />
              {t('commodities.list')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">Loading orders...</div> {/* Loading indicator */}
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">{t('orderbook.title')}</h1>
        <p className="text-gray-600">{t('orderbook.subtitle')}</p>
      </div>
      <Card className="">
        <CardHeader className="earth-header-forest pb-3">
          <CardTitle className="flex items-center text-lg text-white">
            <Package className="mr-2 h-5 w-5" />
            {t('commodities.list')} {/* This might need to be "Orders" */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="">
            <Table>
              <TableHeader className="bg-earth-light-green/30">
                <TableRow>
                  <TableHead className="text-earth-dark-green">Order ID</TableHead>{' '}
                  {/* Update header */}
                  <TableHead className="text-earth-dark-green">Counterparty</TableHead>{' '}
                  {/* Changed from Buyer to Counterparty */}
                  <TableHead className="text-earth-dark-green">Commodity</TableHead>{' '}
                  {/* Update header */}
                  <TableHead className="text-earth-dark-green">Quantity</TableHead>{' '}
                  {/* Update header */}
                  <TableHead className="text-earth-dark-green">Total Amount</TableHead>{' '}
                  {/* Add Total Amount */}
                  <TableHead className="text-earth-dark-green">Status</TableHead>{' '}
                  {/* Update header */}
                  <TableHead className="text-right text-earth-dark-green">
                    {t('commodities.action')} {/* Update header */}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrdersToDisplay.length > 0 ? (
                  filteredOrdersToDisplay.map((orderBook) => (
                    <TableRow key={orderBook._id}>
                      {' '}
                      {/* Use _id for key */}
                      <TableCell className="font-medium">{orderBook._id}</TableCell>
                      {/* Need to fetch buyer/seller name based on orderBook.buyerId/sellerId */}
                      <TableCell>Counterparty Name Placeholder</TableCell> {/* Placeholder */}
                      <TableCell>Commodity Name Placeholder</TableCell> {/* Placeholder */}
                      <TableCell>
                        {orderBook.quantity} {/* Unit might be in commodity details */}
                      </TableCell>
                      <TableCell>{orderBook.totalAmount}</TableCell> {/* Display total amount */}
                      <TableCell>{getStatusBadge(orderBook.status)}</TableCell>{' '}
                      {/* Use fetched status */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(orderBook._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* Show Confirm button for seller for relevant statuses */}
                          {orderBook.sellerId === userId &&
                            (orderBook.status === 'escrow_funded' ||
                              orderBook.status === 'awaiting_seller_confirmation') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600"
                                onClick={() => handleConfirmOrderClick(orderBook._id)} // Use _id
                                disabled={isProcessingOrder || isEscrowActionLoading} // Disable while processing
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          {/* Show Mark as Shipped button for seller for relevant statuses */}
                          {orderBook.sellerId === userId &&
                            orderBook.status === 'seller_confirmed_awaiting_shipment' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-600" // Use a different color, e.g., blue
                                onClick={() => handleMarkAsShippedClick(orderBook._id)} // Call new handler
                                disabled={isMarkingAsShipped} // Disable while processing
                              >
                                <Package className="h-4 w-4" /> {/* Use Package icon */}
                              </Button>
                            )}
                          {/* Show Confirm Goods Received button for buyer for 'shipped' status */}
                          {orderBook.buyerId === userId && orderBook.status === 'shipped' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600"
                              onClick={() => handleConfirmReceiptClick(orderBook._id)} // Call new handler
                              disabled={isConfirmingReceipt} // Disable while processing
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-earth-medium-green">
                      {' '}
                      {/* Adjust colspan */}
                      {/* Update empty state message */}
                      {searchQuery
                        ? `No orders found matching "${searchQuery}"`
                        : `No orders found.`}{' '}
                      {/* Updated empty state message */}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default OrderBook;
