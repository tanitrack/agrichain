// src/components/orderbook/detail/OrderBookDeliveryCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderBookDetailType } from '@/types/order-book';
import { useLanguage } from '@/contexts/language-context';

interface OrderBookDeliveryCardProps {
  orderBook: OrderBookDetailType;
  t: ReturnType<typeof useLanguage>['t'];
  language: ReturnType<typeof useLanguage>['language'];
  formatDate: (date: Date) => string;
}

export const OrderBookDeliveryCard: React.FC<OrderBookDeliveryCardProps> = ({
  orderBook,
  language,
}) => {
  return (
    <Card className="overflow-hidden border-2 border-earth-light-green/70 shadow-md">
      <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green pb-3">
        <CardTitle className="text-white">
          {language === 'id' ? 'Informasi Pengiriman' : 'Delivery Information'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 text-earth-dark-green">
          <div>
            <p className="text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Alamat Pengiriman' : 'Shipping Address'}
            </p>
            <p className="text-earth-dark-green">{orderBook.shippingAddress}</p>{' '}
          </div>
          <div>
            <p className="text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Nama Penerima' : 'Recipient Name'}
            </p>
            <p className="font-medium text-earth-dark-green">{orderBook.buyer.name}</p>{' '}
            {/* Use buyer.name */}
          </div>
          <div>
            <p className="text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Nomor Telepon Penerima' : 'Recipient Phone Number'}
            </p>
            <p className="text-earth-dark-green">{orderBook.buyer.phone}</p> {/* Use buyer.phone */}
          </div>
          <div>
            <p className="text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Email Penerima' : 'Recipient Email'}
            </p>
            <p className="text-earth-dark-green">{orderBook.buyer.email}</p> {/* Use buyer.email */}
          </div>
          <div>
            <p className="text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Catatan Pengiriman' : 'Shipping Notes'}
            </p>
            <p className="text-earth-dark-green">{orderBook.shippingNotes}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Kurir Pengiriman' : 'Shipping Courier'}
            </p>
            <p className="text-earth-dark-green">{orderBook.shippingCourier}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Nomor Resi' : 'Tracking Number'}
            </p>
            <p className="text-earth-dark-green">{orderBook.shippingTrackingNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-earth-medium-green">
              {language === 'id' ? 'Estimasi Pengiriman' : 'Estimated Delivery'}
            </p>
            <p className="text-earth-dark-green">{orderBook.shippingEstimatedDelivery}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
