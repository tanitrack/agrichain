// src/components/orderbook/detail/OrderBookDetailsCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package, User, Calendar, Clock } from 'lucide-react';
import { OrderBookDetailType } from '@/types/order-book';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useLanguage } from '@/contexts/language-context';

// Infer UserProfile type from useAuthCheck hook
type UserProfile = ReturnType<typeof useAuthCheck>['userProfile'];

interface OrderBookDetailsCardProps {
  orderBook: OrderBookDetailType;
  userProfile: UserProfile;
  getStatusBadge: (status: string) => JSX.Element;
}

export const OrderBookDetailsCard: React.FC<OrderBookDetailsCardProps> = ({
  orderBook,
  userProfile,
  getStatusBadge,
}) => {
  const { t, language } = useLanguage();

  return (
    <Card className="overflow-hidden border-2 border-earth-light-green/70 shadow-md">
      <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{t('orderbook.detail')}</CardTitle>
          {getStatusBadge(orderBook.status)}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-medium text-earth-medium-green">
              {t('orderbook.commodity')}
            </h3>
            <div className="flex items-center rounded-lg border border-earth-light-green/30 bg-earth-pale-green/50 p-3 transition-colors hover:bg-earth-pale-green">
              <div className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-earth-light-green/30">
                <Package className="h-5 w-5 text-earth-dark-green" />
              </div>
              <div>
                <p className="font-medium text-earth-dark-green">{orderBook.komoditas?.name}</p>
                <p className="text-sm text-earth-medium-green">
                  {orderBook.quantity.toLocaleString()} {orderBook.komoditas?.unit}{' '}
                  {/* Use komoditas.unit */}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Tanggal Penting' : 'Important Dates'}
            </h3>
            <div className="space-y-1 rounded-lg border border-earth-light-green/30 bg-earth-pale-green/50 p-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-earth-medium-green" />
                <span className="text-sm text-earth-dark-green">
                  {language === 'id' ? 'Pengiriman: ' : 'Delivery: '}
                  <strong>xxxx</strong>
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-earth-medium-green" />
                <span className="text-sm text-earth-dark-green">
                  {language === 'id' ? 'Kedaluwarsa: ' : 'Expires: '}
                  <strong>xxxxx</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Removed commented out section for Requested Grade */}
        </div>

        {/* Removed commented out section for Price Offer */}

        <Separator className="my-6 bg-earth-light-green" />

        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-earth-medium-green">
            {language === 'id' ? 'Informasi Pembeli' : 'Buyer Information'}
          </h3>
          {userProfile?._id === orderBook.buyerId ? (
            <div className="flex items-start rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-earth-dark-green">{orderBook.buyer.name}</p>{' '}
                {/* Use buyer.name */}
                <p className="text-sm text-earth-medium-green">{orderBook.buyer.email}</p>{' '}
                {/* Use buyer.email */}
                <p className="text-sm text-earth-medium-green">{orderBook.buyer.phone}</p>{' '}
                {/* Use buyer.phone */}
                <p className="mt-1 text-sm text-earth-medium-green">
                  {orderBook.buyer.address} {/* Use buyer.address */}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start rounded-lg border border-green-100 bg-green-50 p-4">
              <div className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-100">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-earth-dark-green">{orderBook.seller.name}</p>{' '}
                {/* Use seller.name */}
                <p className="text-sm text-earth-medium-green">{orderBook.seller.email}</p>{' '}
                {/* Use seller.email */}
                <p className="text-sm text-earth-medium-green">{orderBook.seller.phone}</p>{' '}
                {/* Use seller.phone */}
                <p className="mt-1 text-sm text-earth-medium-green">
                  {orderBook.seller.address} {/* Use seller.address */}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6 bg-earth-light-green" />

        <div>
          {/* Removed commented out section for Requirements */}

          <h3 className="mb-2 text-sm font-medium text-earth-medium-green">{'Deskripsi'}</h3>
          <p className="mb-4 rounded-lg border border-earth-light-green/20 bg-earth-pale-green/30 p-4 text-earth-dark-green">
            {orderBook.termsAndConditions} {/* Use termsAndConditions */}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
