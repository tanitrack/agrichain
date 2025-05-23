import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/language-context';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Wheat,
  MapPin,
  User,
  Package,
  ArrowLeft,
  Share2,
  Heart,
  CircleDollarSign,
  Calendar,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import necessary hooks and mutations
import { useMutation, useQuery } from 'convex/react'; // Import useQuery
import { api } from '@/lib/convex'; // Assuming api is exported from here
import { useEscrowTransaction } from '@/hooks/use-escrow-transaction';
import { useAuthCheck } from '@/hooks/use-auth-check'; // Assuming this hook exists
import { BN } from '@coral-xyz/anchor';
import { useToast } from '@/components/ui/use-toast'; // Assuming useToast is exported from here
import { useState } from 'react'; // Import useState
import { Id } from 'convex/_generated/dataModel';
import { formatDate } from '@/lib/utils';

// Removed Mock data for commodity details

const MarketDetail = () => {
  const { id } = useParams<{ id: Id<'komoditas'> }>();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Fetch the selected commodity by ID from Convex
  const commodity = useQuery(api.komoditas_queries.get, id ? { id: id } : 'skip');

  const commodity_bulks = useQuery(api.komoditas_bulk_queries.get, {
    commodityId: id,
  });

  // State for processing and selected quantity
  const [isProcessing, setIsProcessing] = useState(false);
  // Assuming a default selected quantity for now, link this to UI later
  // Use commodity?.stock or a default if commodity is not loaded yet
  const [selectedQuantity, _setSelectedQuantity] = useState(10); // Default quantity, will need UI input

  // Convex Mutations and Solana Hook
  const { userProfile } = useAuthCheck(); // Assuming this gives Convex user profile with _id
  const createOrderBookFromListing = useMutation(api.orderbook_mutations.createFromListing);
  const recordEscrowInitializationAndLink = useMutation(
    api.transaction_mutations.recordEscrowInitializationAndLink
  ); // New mutation

  const {
    initializeEscrow,
    isLoading: isEscrowLoading,
    error: _escrowError,
  } = useEscrowTransaction();
  const { toast } = useToast();

  const handlePlaceOrderAndPay = async () => {
    if (!userProfile?._id) {
      toast({
        title: t('marketDetail.error'),
        description: t('marketDetail.notLoggedIn'),
        variant: 'destructive',
      });
      return;
    }
    // Ensure commodity data is loaded and quantity is selected
    if (!commodity || !selectedQuantity) {
      toast({
        title: t('marketDetail.error'),
        description: t('marketDetail.noCommodityOrQuantity'),
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: t('marketDetail.processingOrder'), description: t('marketDetail.pleaseWait') });

    try {
      // Step 1: Call Convex to create OrderBook record (Revised Step 4)
      const orderPrepResult = await createOrderBookFromListing({
        komoditasId: commodity._id,
        quantity: selectedQuantity,
        buyerUserId: userProfile._id,
        buyerSolanaPublicKey: userProfile.solanaPublicKey,
      });

      if (!orderPrepResult || !orderPrepResult.orderBookId) {
        throw new Error(t('marketDetail.failedPrepareOrder'));
      }

      console.log('OrderBook created:', orderPrepResult.orderBookId);
      console.log('Escrow init params:', orderPrepResult);

      // Step 2: Call Solana to initialize escrow (Step 5)
      toast({
        title: t('marketDetail.awaitingPayment'),
        description: t('marketDetail.confirmInWallet'),
      });

      // TODO: Change the amount to lamport by data
      const amountLamports = new BN(0.001 * 1_000_000_000); // Example: 0.001 SOL to lamports, adjust as needed
      // TODO: truncate order details for now find better way to hash later
      const truncatedOrderDetails = orderPrepResult.orderBookId.slice(0, 20);

      const escrowResult = await initializeEscrow({
        buyerSolanaPublicKey: orderPrepResult.buyerSolanaPublicKey,
        sellerSolanaPublicKey: orderPrepResult.sellerSolanaPublicKey,
        orderDetails: truncatedOrderDetails, // Use truncatedOrderDetails instead of slicing again
        amountLamports,
        onSuccess: async (txSig, pdaAddress) => {
          console.log('Escrow initialized on-chain. Tx Signature:', txSig, 'PDA:', pdaAddress);
          toast({
            title: t('marketDetail.paymentSecured'),
            description: `${t('marketDetail.escrowInitialized')} ${txSig.substring(0, 10)}`,
          });

          // Step 3: Record escrow initialization and link in Convex (New Step 7)
          if (!pdaAddress) {
            console.error('PDA address is missing after successful transaction.');
            toast({
              title: t('marketDetail.error'),
              description: t('marketDetail.missingPda'),
              variant: 'destructive',
            });
            // Optionally call a Convex mutation to mark the orderBook as "payment_failed"
            return;
          }

          try {
            await recordEscrowInitializationAndLink({
              orderBookId: orderPrepResult.orderBookId as Id<'orderBook'>, // Cast to Id<'orderBook'>
              initializeTxHash: txSig,
              escrowPdaAddress: pdaAddress,
              onChainStatus: 'initialized',
              buyerSolanaPublicKey: orderPrepResult.buyerSolanaPublicKey,
              sellerSolanaPublicKey: orderPrepResult.sellerSolanaPublicKey,
              amountLamports: orderPrepResult.amountLamports,
            });
            console.log('Escrow initialization recorded in Convex.');
            toast({
              title: t('marketDetail.orderUpdated'),
              description: t('marketDetail.convexUpdated'),
            });
            // Navigate to a success/pending page or update UI
            // navigate(`/order/${orderPrepResult.orderBookId}/status`);
          } catch (convexErr) {
            console.error('Error recording escrow initialization in Convex:', convexErr);
            toast({
              title: t('marketDetail.error'),
              description: t('marketDetail.failedUpdateConvex'),
              variant: 'destructive',
            });
            // This is a critical state: on-chain succeeded, but off-chain failed to update.
            // Requires manual intervention or a robust retry mechanism.
          }
        },
        onError: (err) => {
          console.error('Escrow initialization failed:', err);
          toast({
            title: t('marketDetail.paymentFailed'),
            description: err.message || t('marketDetail.couldNotInitEscrow'),
            variant: 'destructive',
          });
          // Optionally: Call a Convex mutation to mark the orderBook as "payment_failed"
          // await markOrderAsFailedMutation({ orderBookId: orderPrepResult.orderBookId });
        },
        onSubmitted: (txSig) => {
          console.log('InitializeEscrow tx submitted:', txSig);
          toast({
            title: t('marketDetail.txSubmitted'),
            description: `${t('marketDetail.txAwaiting')} ${txSig.substring(0, 10)}`,
          });
        },
      });

      if (!escrowResult?.signature) {
        // Error already handled by initializeEscrow's onError, but good to double check
        // Potentially roll back or mark order as failed in Convex if initializeEscrow itself threw before calling createAndSendTransaction
        console.log('Escrow initialization did not return a signature.');
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      toast({
        title: t('marketDetail.orderFailed'),
        description: (err as Error).message || t('marketDetail.couldNotPlaceOrder'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle loading state
  if (commodity === undefined) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <p>{t('marketDetail.loading')}</p>
        </div>
      </MainLayout>
    );
  }

  // Handle not found state
  if (commodity === null) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <h2 className="mb-4 text-xl font-semibold">{t('marketDetail.notFound')}</h2>
          <Button onClick={() => navigate('/market')}>{t('marketDetail.backToMarket')}</Button>
        </div>
      </MainLayout>
    );
  }

  // Render commodity details once loaded
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/market')}
            className="border-earth-light-brown/30"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t('marketDetail.backToMarket')}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left side - Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-earth-light-brown/30 bg-white">
              {commodity.imageUrl ? (
                <img
                  src={commodity.imageUrl}
                  alt={commodity.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-muted-foreground">
                  {t('marketDetail.noImage')}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Details */}
          <div className="space-y-6">
            <div className="rounded-lg border border-earth-light-brown/30 bg-white p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl font-bold text-earth-dark-green">{commodity.name}</h1>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-earth-medium-green">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-earth-medium-green">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Wheat className="h-4 w-4 text-earth-medium-green" />
                  <span className="font-medium text-earth-medium-green">{commodity.category}</span>
                </div>

                <div className="mt-4 flex items-center">
                  <Badge className="border border-earth-clay/50 bg-[#FEF7CD] px-3 py-1 text-earth-brown">
                    <CircleDollarSign className="mr-1 h-3.5 w-3.5" />
                    Rp {commodity.pricePerUnit.toLocaleString()} / {commodity.unit}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Key info section */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-5 w-5 text-earth-medium-green" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('marketDetail.farmer')}</p>
                    <p className="font-medium">{commodity.farmersName ?? 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-5 w-5 text-earth-medium-green" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('marketDetail.location')}</p>
                    <p className="font-medium">{commodity.address ?? 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="mt-0.5 h-5 w-5 text-earth-medium-green" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('marketDetail.stock')}</p>
                    <p className="font-medium">
                      {commodity.stock} {commodity.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-5 w-5 text-earth-medium-green" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('marketDetail.harvestDate')}</p>
                    <p className="font-medium">
                      {formatDate(
                        new Date(
                          commodity?.harvestDate && commodity.harvestDate.trim() !== ''
                            ? commodity.harvestDate
                            : '2024-05-01'
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {/* Tabs for quantity/price variations */}
              {commodity_bulks === undefined && (
                <div className="overflow-hidden rounded-lg border border-earth-light-brown/30 bg-white">
                  {t('marketDetail.loadingPrice')}
                </div>
              )}
              {commodity_bulks && (
                <div className="overflow-hidden rounded-lg border border-earth-light-brown/30 bg-white">
                  <Tabs defaultValue={commodity_bulks[0]?.minQuantity ?? '10'} className="w-full">
                    <TabsList className="w-full bg-earth-pale-green">
                      {commodity_bulks?.map((bulk) => (
                        <TabsTrigger key={bulk._id} value={bulk.minQuantity} className="flex-1">
                          {`${bulk.minQuantity} ${commodity.unit}`}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {commodity_bulks?.map((bulk) => (
                      <TabsContent
                        key={bulk._id}
                        value={bulk.minQuantity}
                        className="space-y-4 p-4"
                      >
                        <p>
                          {t('marketDetail.price')}: Rp {bulk.price.toLocaleString()} /{' '}
                          {commodity.unit}
                        </p>
                        <p>
                          {t('marketDetail.totalPrice')}: Rp{' '}
                          {(bulk.price * parseInt(bulk.minQuantity)).toLocaleString()}
                        </p>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              {/* Button to trigger the purchase flow */}
              <Button
                onClick={handlePlaceOrderAndPay}
                disabled={
                  isProcessing ||
                  isEscrowLoading ||
                  !selectedQuantity ||
                  selectedQuantity > commodity.stock
                }
                className="w-full"
              >
                {isProcessing || isEscrowLoading
                  ? t('marketDetail.processing')
                  : `${t('marketDetail.placeOrder')} (${selectedQuantity} ${commodity.unit})`}
              </Button>
            </div>

            {/* Additional Information - Description */}
            <div className="overflow-hidden rounded-lg border border-earth-light-brown/30 bg-white">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full bg-earth-pale-green">
                  <TabsTrigger value="description" className="flex-1">
                    {t('marketDetail.description')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="p-4">
                  <p>{commodity.description || t('marketDetail.noDescription')}</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <Card className="border-earth-light-brown/30">
          <CardHeader className="bg-[#F2FCE2]">
            <CardTitle className="text-lg">{t('marketDetail.farmerInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-earth-light-green/30">
                  <User className="h-8 w-8 text-earth-medium-green" />
                </div>
                <div>
                  <h3 className="font-semibold">{commodity.farmersName ?? 'N/A'}</h3>
                  <p className="text-sm text-muted-foreground">{t('marketDetail.memberSince')}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="font-medium text-amber-600">★ N/A</span>
                    <span className="text-sm text-muted-foreground">
                      (N/A {t('marketDetail.transactions')})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Button
                  variant="outline"
                  className="mb-2 border-earth-medium-green/50 text-earth-dark-green"
                >
                  {t('marketDetail.contactFarmer')}
                </Button>
                <Button
                  variant="outline"
                  className="border-earth-medium-green/50 text-earth-dark-green"
                >
                  {t('marketDetail.viewAllProducts')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MarketDetail;
