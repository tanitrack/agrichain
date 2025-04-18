
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, ShoppingCart } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface TransactionSummaryProps {
  transaction: any;
  openWhatsAppChat: () => void;
}

export const TransactionSummary = ({ transaction, openWhatsAppChat }: TransactionSummaryProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Card className="earth-card-brown overflow-hidden">
        <CardHeader className="earth-header-brown pb-3">
          <CardTitle className="text-white">Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
              <span className="text-earth-brown">Transaction Type</span>
              <Badge variant="outline" className="capitalize border-earth-brown text-earth-brown">
                {transaction.type === "order_book" ? "Order Book" : "Regular"}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
              <span className="text-earth-brown">Date</span>
              <span className="text-earth-dark-green">{formatDate(transaction.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
              <span className="text-earth-brown">Last Updated</span>
              <span className="text-earth-dark-green">{formatDate(transaction.updatedAt)}</span>
            </div>

            <Separator className="bg-earth-light-brown/30" />

            <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
              <span className="text-earth-brown">Commodity</span>
              <span className="text-earth-dark-green">{transaction.commodityName}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/20">
              <span className="text-earth-brown">Quantity</span>
              <span className="text-earth-dark-green">{transaction.quantity.toLocaleString()} {transaction.unit}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-earth-light-brown/10">
              <span className="text-earth-brown">Unit Price</span>
              <span className="text-earth-dark-green">
                {transaction.price ? `${formatCurrency(transaction.price)}/${transaction.unit}` : "Not set"}
              </span>
            </div>

            <Separator className="bg-earth-light-brown/30" />

            <div className="flex justify-between items-center p-3 rounded bg-earth-wheat/40 font-bold">
              <span className="text-earth-dark-green">Total Amount</span>
              <span className="text-earth-dark-green">
                {transaction.totalPrice ? formatCurrency(transaction.totalPrice) : "Not set"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="earth-card-wheat overflow-hidden">
        <CardHeader className="earth-header-wheat pb-3">
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 border-earth-light-brown/50 text-earth-dark-green hover:bg-earth-pale-green/50">
              <FileText className="h-4 w-4" />
              View Invoice
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 border-earth-light-brown/50 text-earth-dark-green hover:bg-earth-pale-green/50"
              onClick={openWhatsAppChat}
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Buyer
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 border-earth-light-brown/50 text-earth-dark-green hover:bg-earth-pale-green/50"
              onClick={() => navigate(`/komoditas/${transaction.commodityId}`)}
            >
              <ShoppingCart className="h-4 w-4" />
              View Commodity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSummary;
