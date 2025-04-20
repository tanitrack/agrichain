import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Package, DollarSign, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
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
          <p className="text-earth-dark-green text-xl font-bold">
            {formatCurrency(transaction.totalPrice)}
          </p>
          <p className="text-earth-medium-green text-sm">
            @{formatCurrency(transaction.price)}/{transaction.unit}
          </p>
        </>
      );
    }

    const isPriceSettingPhase =
      transaction.status === 'dikonfirmasi' || transaction.status === 'negosiasi';

    return (
      <div className="flex items-center justify-between">
        <p className="text-earth-medium-green italic">
          {language === 'id' ? 'Harga belum ditetapkan' : 'Price not set yet'}
        </p>
        {transaction.status === 'dikonfirmasi' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleProceedToNegotiation}
            className="border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green gap-1"
          >
            <DollarSign className="h-3 w-3" />
            {language === 'id' ? 'Tetapkan Harga' : 'Set Price'}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="earth-card-forest overflow-hidden">
      <CardHeader className="earth-header-forest pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{t('transactions.detail')}</CardTitle>
          {getStatusBadge(transaction.status)}
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="mb-6">
          <Progress value={calculateProgress()} className="bg-earth-pale-green h-2" />
          <div className="text-earth-medium-green mt-1 flex justify-between text-xs">
            <span>{t('status.pending')}</span>
            <span>{t('status.negotiating')}</span>
            <span>{t('status.shipping')}</span>
            <span>{t('status.completed')}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-earth-pale-green/50 rounded-lg p-4">
              <h3 className="text-earth-medium-green mb-1 text-sm font-medium">
                {t('transactions.commodity')}
              </h3>
              <div className="flex items-center">
                <div className="bg-earth-medium-green/20 mr-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
                  <Package className="text-earth-medium-green h-6 w-6" />
                </div>
                <div>
                  <p className="text-earth-dark-green font-bold">{transaction.commodityName}</p>
                  <p className="text-earth-medium-green text-sm">
                    {transaction.quantity.toLocaleString()} {transaction.unit}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-earth-wheat/30 rounded-lg p-4">
              <h3 className="text-earth-brown mb-1 text-sm font-medium">
                {t('transactions.total')}
              </h3>
              {renderPriceSection()}
            </div>
          </div>

          <Separator className="bg-earth-light-brown/30" />

          <BuyerInfo transaction={transaction} />

          <Separator className="bg-earth-light-brown/30" />

          <div className="bg-earth-light-brown/20 rounded-lg p-4">
            <h3 className="text-earth-brown mb-2 text-sm font-medium">Notes</h3>
            <p className="text-earth-dark-green mb-4">{transaction.notes}</p>
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
      <div className="bg-earth-clay/20 rounded-lg p-4">
        <h3 className="text-earth-brown mb-2 text-sm font-medium">Buyer Information</h3>
        <div className="flex items-start">
          <div className="bg-earth-clay/30 mr-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            <span className="text-earth-brown h-6 w-6" />
          </div>
          <div>
            <p className="text-earth-dark-green font-bold">{transaction.buyerName}</p>
            <p className="text-earth-medium-green mt-1 flex items-center gap-1 text-sm">
              <span className="h-3 w-3" /> {transaction.buyerLocation}
            </p>
            <p className="text-earth-medium-green mt-1 flex items-center gap-1 text-sm">
              <span className="h-3 w-3" /> {transaction.buyerPhone}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green mt-2 gap-1"
              onClick={openWhatsAppChat}
            >
              <MessageCircle className="h-3 w-3" />
              Chat via WhatsApp
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-earth-light-green/20 rounded-lg p-4">
        <h3 className="text-earth-medium-green mb-2 text-sm font-medium">Transaction Type</h3>
        <div>
          <Badge
            variant="outline"
            className="border-earth-dark-green text-earth-dark-green mb-2 capitalize"
          >
            {transaction.type === 'order_book' ? 'Order Book' : 'Regular'}
          </Badge>
          <p className="text-earth-medium-green mt-2 flex items-center gap-1 text-sm">
            <span className="h-3 w-3" /> Created:{' '}
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
          <p className="text-earth-medium-green mt-1 flex items-center gap-1 text-sm">
            <span className="h-3 w-3" /> Updated:{' '}
            {new Date(transaction.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
