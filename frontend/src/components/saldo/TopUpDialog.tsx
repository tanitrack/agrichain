
import { useState } from "react";
import { Plus, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function TopUpDialog() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would normally send the data to your API
      console.log("Top up amount:", amount);
      
      toast({
        title: language === "id" ? "Berhasil" : "Success",
        description: language === "id" 
          ? "Permintaan top up sedang diproses" 
          : "Top up request is being processed",
      });
      
      setOpen(false);
      setAmount("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === "id" ? "Gagal" : "Error",
        description: language === "id" 
          ? "Terjadi kesalahan saat memproses top up" 
          : "An error occurred while processing your top up request",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setAmount("");
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {language === "id" ? "Top Up Saldo" : "Top Up Balance"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {language === "id" ? "Top Up Saldo" : "Top Up Balance"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">
              {language === "id" ? "Jumlah Top Up" : "Top Up Amount"}
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder={language === "id" ? "Masukkan jumlah" : "Enter amount"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="10000"
              className="border-earth-light-green focus:border-earth-medium-green"
            />
            <p className="text-xs text-earth-medium-green">
              {language === "id" ? "Minimal top up Rp 10.000" : "Minimum top up amount is Rp 10,000"}
            </p>
          </div>

          <div className="rounded-lg border border-earth-light-green/50 p-4 bg-earth-pale-green/20">
            <div className="flex items-center gap-2 text-sm text-earth-dark-green">
              <CreditCard className="h-4 w-4" />
              {language === "id" 
                ? "Pembayaran akan diproses melalui gateway pembayaran yang aman" 
                : "Payment will be processed through secure payment gateway"}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button 
                variant="outline" 
                type="button"
                className="border-earth-light-green text-earth-dark-green"
              >
                {language === "id" ? "Batal" : "Cancel"}
              </Button>
            </DialogClose>
            <Button 
              type="submit"
              className="bg-earth-dark-green hover:bg-earth-medium-green"
            >
              {language === "id" ? "Top Up" : "Top Up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
