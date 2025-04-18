
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface PriceInputFormProps {
  transaction: any;
  onPriceSubmit: (price: number) => void;
  openWhatsAppChat: () => void;
}

export const PriceInputForm = ({
  transaction,
  onPriceSubmit,
  openWhatsAppChat
}: PriceInputFormProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [price, setPrice] = useState<string>(transaction.price?.toString() || "");
  const [submitting, setSubmitting] = useState(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and one decimal point
    const value = e.target.value.replace(/[^\d.]/g, "");
    const parts = value.split(".");
    
    // Ensure only one decimal point and max 2 decimal places
    if (parts.length > 2) {
      return; // More than one decimal point, don't update
    }
    
    setPrice(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: language === "id" ? "Kesalahan" : "Error",
        description: language === "id" 
          ? "Masukkan harga yang valid" 
          : "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    setTimeout(() => {
      onPriceSubmit(Number(price));
      setSubmitting(false);
      
      toast({
        title: language === "id" ? "Harga Dikirim!" : "Price Submitted!",
        description: language === "id" 
          ? "Harga telah dikirim ke pembeli" 
          : "Price has been submitted to the buyer",
      });
      
      // Redirect to the transaction price submitted page
      navigate(`/farmer/transaction-price-submitted/${transaction.id}`);
    }, 800);
  };

  const calculateTotal = () => {
    if (!price || isNaN(Number(price))) return "-";
    return (Number(price) * transaction.quantity).toLocaleString();
  };

  return (
    <Card className="earth-card-wheat overflow-hidden">
      <CardHeader className="earth-header-wheat pb-3">
        <CardTitle className="text-white">
          {language === "id" ? "Tentukan Harga" : "Set Price"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 mt-2">
        <div className="p-4 bg-earth-wheat/30 rounded-lg">
          <h3 className="font-medium text-earth-dark-green mb-2">
            {language === "id" ? "Negosiasi Harga" : "Price Negotiation"}
          </h3>
          <p className="text-earth-medium-green mb-4 text-sm">
            {language === "id" 
              ? "Diskusikan harga melalui WhatsApp terlebih dahulu, kemudian masukkan harga yang disepakati di bawah ini."
              : "Discuss price via WhatsApp first, then enter the agreed price below."}
          </p>
          
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <Button 
              variant="outline" 
              className="gap-2 border-earth-light-brown/50 text-earth-brown hover:bg-earth-wheat/70"
              onClick={openWhatsAppChat}
            >
              <MessageCircle className="h-4 w-4" />
              {language === "id" ? "Diskusi via WhatsApp" : "Discuss via WhatsApp"}
            </Button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-earth-brown mb-1">
                  {language === "id" ? "Harga per " : "Price per "}{transaction.unit}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-earth-brown">Rp</span>
                  </div>
                  <Input
                    id="price"
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                    className="pl-10 border-earth-light-brown/50 focus:border-earth-brown focus:ring-earth-dark-green/30"
                    placeholder={language === "id" ? "Masukkan harga" : "Enter price"}
                  />
                </div>
              </div>
              
              <div className="p-3 bg-earth-pale-green/30 rounded-lg mb-4">
                <div className="flex justify-between">
                  <span className="text-earth-brown">{language === "id" ? "Jumlah" : "Quantity"}:</span>
                  <span className="text-earth-dark-green font-medium">
                    {transaction.quantity.toLocaleString()} {transaction.unit}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-earth-brown">{language === "id" ? "Total" : "Total"}:</span>
                  <span className="text-earth-dark-green font-medium">
                    Rp {calculateTotal()}
                  </span>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-earth-medium-green hover:bg-earth-dark-green text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    {language === "id" ? "Mengirim..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    {language === "id" ? "Kirim Harga" : "Submit Price"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceInputForm;
