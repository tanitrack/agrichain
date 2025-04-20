import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, DollarSign } from 'lucide-react';

interface StatusCardProps {
  status: string;
  onConfirmTransaction?: () => void;
  onDeclineTransaction?: () => void;
  onProceedToNegotiation?: () => void;
}

export const StatusCard = ({
  status,
  onConfirmTransaction,
  onDeclineTransaction,
  onProceedToNegotiation,
}: StatusCardProps) => {
  if (status !== 'menunggu_konfirmasi' && status !== 'dikonfirmasi') {
    return null;
  }

  return (
    <Card className="earth-card-wheat overflow-hidden">
      <CardHeader className="earth-header-wheat pb-3">
        <CardTitle className="text-white">Action Required</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-4">
          {status === 'menunggu_konfirmasi' && (
            <div className="bg-earth-wheat/30 rounded-lg p-4">
              <h3 className="text-earth-dark-green mb-2 font-medium">
                Transaction Awaiting Confirmation
              </h3>
              <p className="text-earth-medium-green mb-4">
                This transaction is waiting for your confirmation. Please review the details and
                decide whether to accept or decline this order.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="farmer"
                  onClick={onConfirmTransaction}
                  className="w-full gap-2 sm:w-auto"
                >
                  <Check className="h-4 w-4" />
                  Confirm Transaction
                </Button>
                <Button
                  variant="destructive"
                  onClick={onDeclineTransaction}
                  className="w-full gap-2 sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Decline Transaction
                </Button>
              </div>
            </div>
          )}

          {status === 'dikonfirmasi' && (
            <div className="bg-earth-wheat/30 rounded-lg p-4">
              <h3 className="text-earth-dark-green mb-2 font-medium">
                Transaction Confirmed - Set Price
              </h3>
              <p className="text-earth-medium-green mb-4">
                You have confirmed this transaction. The next step is to set a price and begin
                negotiation with the buyer.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="farmer"
                  onClick={onProceedToNegotiation}
                  className="w-full gap-2 sm:w-auto"
                >
                  <DollarSign className="h-4 w-4" />
                  Set Price & Negotiate
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
