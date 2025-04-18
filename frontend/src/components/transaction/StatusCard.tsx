
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, DollarSign } from "lucide-react";

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
  if (status !== "menunggu_konfirmasi" && status !== "dikonfirmasi") {
    return null;
  }

  return (
    <Card className="earth-card-wheat overflow-hidden">
      <CardHeader className="earth-header-wheat pb-3">
        <CardTitle className="text-white">Action Required</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-4">
          {status === "menunggu_konfirmasi" && (
            <div className="p-4 bg-earth-wheat/30 rounded-lg">
              <h3 className="font-medium text-earth-dark-green mb-2">Transaction Awaiting Confirmation</h3>
              <p className="text-earth-medium-green mb-4">
                This transaction is waiting for your confirmation. Please review the details and decide whether to accept or decline this order.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button 
                  variant="farmer" 
                  onClick={onConfirmTransaction}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Check className="h-4 w-4" />
                  Confirm Transaction
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={onDeclineTransaction}
                  className="gap-2 w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Decline Transaction
                </Button>
              </div>
            </div>
          )}

          {status === "dikonfirmasi" && (
            <div className="p-4 bg-earth-wheat/30 rounded-lg">
              <h3 className="font-medium text-earth-dark-green mb-2">Transaction Confirmed - Set Price</h3>
              <p className="text-earth-medium-green mb-4">
                You have confirmed this transaction. The next step is to set a price and begin negotiation with the buyer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button 
                  variant="farmer" 
                  onClick={onProceedToNegotiation}
                  className="gap-2 w-full sm:w-auto"
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
