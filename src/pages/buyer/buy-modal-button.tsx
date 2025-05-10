import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useNavigate } from 'react-router-dom';
import { useEscrowTransaction } from '@/hooks/use-escrow-transaction';
import { useSolanaTransacion } from '@/hooks/use-solana-transation';

interface BuyModalButtonProps {
  commodity: {
    id: string;
    name: string;
    price: number;
    unit: string;
    quantity: number;
  };
  selectedQuantity: number;
}

export const BuyModalButton = ({ commodity, selectedQuantity }: BuyModalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const { handleCreateEscrowTransaction } = useEscrowTransaction();
  const { sendFund } = useSolanaTransacion();

  const totalPrice = commodity.price * selectedQuantity;

  const handleBuy = async () => {
    setIsOpen(false);
    const signature = await handleCreateEscrowTransaction(
      'Gcqeu4rwojtwiNBXeHnfqZp4nrmMdr72DBXiojqJdbTe',
      'a',
      0.001
    );
    // const signature = await sendFund();
    console.log(`Transaction signature: ${signature}`);
  };

  return (
    <>
      <Button
        className="w-full bg-earth-medium-green text-white hover:bg-earth-dark-green"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {language === 'id' ? 'Beli Sekarang' : 'Buy Now'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'id' ? 'Konfirmasi Pembelian' : 'Confirm Purchase'}
            </DialogTitle>
            <DialogDescription>
              {language === 'id'
                ? 'Harap periksa detail pembelian Anda'
                : 'Please review your purchase details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">{commodity.name}</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'id' ? 'Jumlah' : 'Quantity'}:
                  </span>
                  <span>
                    {selectedQuantity} {commodity.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'id' ? 'Harga per' : 'Price per'} {commodity.unit}:
                  </span>
                  <span>Rp {commodity.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>{language === 'id' ? 'Total Harga' : 'Total Price'}:</span>
                  <span>Rp {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {language === 'id' ? 'Batal' : 'Cancel'}
            </Button>
            <Button className="bg-earth-medium-green hover:bg-earth-dark-green" onClick={handleBuy}>
              {language === 'id' ? 'Lanjutkan Pembelian' : 'Continue Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
