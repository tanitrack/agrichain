import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Package, DollarSign, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { formatCurrency } from '@/lib/utils';

interface TransactionInfoProps {
  transaction: any;
  handleProceedToNegotiation: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  calculateProgress: () => number;
}

export const TransactionInfo = ({
  transaction,
  handleProceedToNegotiation,
  getStatusBadge,
  calculateProgress,
}: TransactionInfoProps) => {
  const { t, language } = useLanguage();

  const renderPriceSection = () => {
    if (transaction.price) {
      return (
        <>
          <p className="text-xl font-bold text-earth-dark-green">
            {formatCurrency(transaction.totalPrice)}
          </p>
          <p className="text-sm text-earth-medium-green">
            @{formatCurrency(transaction.price)}/{transaction.unit}
          </p>
        </>
      );
    }

    const isPriceSettingPhase =
      transaction.status === 'dikonfirmasi' || transaction.status === 'negosiasi';

    return (
      <div className="flex items-center justify-between">
        <p className="italic text-earth-medium-green">
          {language === 'id' ? 'Harga belum ditetapkan' : 'Price not set yet'}
        </p>
        {transaction.status === 'dikonfirmasi' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleProceedToNegotiation}
            className="gap-1 border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green"
          >
            <DollarSign className="h-3 w-3" />
            {language === 'id' ? 'Tetapkan Harga' : 'Set Price'}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{t('transactions.detail')}</CardTitle>
          {getStatusBadge(transaction.status)}
        </div>
      </CardHeader>
      <CardContent className="mt-4 p-6">
        <div className="mb-6">
          <Progress value={calculateProgress()} className="h-2 bg-earth-pale-green" />
          <div className="mt-1 flex justify-between text-xs text-earth-medium-green">
            <span>{t('status.pending')}</span>
            {/* <span>{t('status.negotiating')}</span> */}
            <span>{t('status.shipping')}</span>
            <span>{t('status.completed')}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-earth-pale-green/50 p-4">
              <h3 className="mb-1 text-sm font-medium text-earth-medium-green">
                {t('transactions.commodity')}
              </h3>
              <div className="flex items-center">
                <div className="mr-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-earth-medium-green/20">
                  <Package className="h-6 w-6 text-earth-medium-green" />
                </div>
                <div>
                  <p className="font-bold text-earth-dark-green">{transaction.commodityName}</p>
                  <p className="text-sm text-earth-medium-green">
                    {transaction.quantity.toLocaleString()} {transaction.unit}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-earth-wheat/30 p-4">
              <h3 className="mb-1 text-sm font-medium text-earth-brown">
                {t('transactions.total')}
              </h3>
              {renderPriceSection()}
            </div>
          </div>

          <Separator className="bg-earth-light-brown/30" />

          <BuyerInfo transaction={transaction} />

          <Separator className="bg-earth-light-brown/30" />

          <div className="rounded-lg bg-earth-light-brown/20 p-4">
            <h3 className="mb-2 text-sm font-medium text-earth-brown">Notes</h3>
            <p className="mb-4 text-earth-dark-green">{transaction.notes}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface BuyerInfoProps {
  transaction: any;
}

export const BuyerInfo = ({ transaction }: BuyerInfoProps) => {
  const openWhatsAppChat = () => {
    if (!transaction) return;

    // Format WhatsApp message
    const message = `Halo ${transaction.buyerName}, saya dari ${transaction.sellerName}. Mari bicarakan detail lebih lanjut tentang ${transaction.commodityName} yang Anda pesan. Terima kasih.`;

    // Create WhatsApp URL with phone number and message
    const whatsappUrl = `https://wa.me/${transaction.buyerPhone.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-lg bg-earth-clay/20 p-4">
        <h3 className="mb-2 text-sm font-medium text-earth-brown">Buyer Information</h3>
        <div className="flex items-start">
          <div className="mr-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-earth-clay/30">
            <span className="h-6 w-6 text-earth-brown" />
          </div>
          <div>
            <p className="font-bold text-earth-dark-green">{transaction.buyerName}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-earth-medium-green">
              <span className="h-3 w-3" /> {transaction.buyerLocation}
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-earth-medium-green">
              <span className="h-3 w-3" /> {transaction.buyerPhone}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-1 border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green"
              onClick={openWhatsAppChat}
            >
              <MessageCircle className="h-3 w-3" />
              Chat via WhatsApp
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-earth-light-green/20 p-4">
        <h3 className="mb-2 text-sm font-medium text-earth-medium-green">Transaction Type</h3>
        <div>
          <Badge
            variant="outline"
            className="mb-2 border-earth-dark-green capitalize text-earth-dark-green"
          >
            {transaction.type === 'order_book' ? 'Order Book' : 'Regular'}
          </Badge>
          <p className="mt-2 flex items-center gap-1 text-sm text-earth-medium-green">
            <span className="h-3 w-3" /> Created:{' '}
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-earth-medium-green">
            <span className="h-3 w-3" /> Updated:{' '}
            {new Date(transaction.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
