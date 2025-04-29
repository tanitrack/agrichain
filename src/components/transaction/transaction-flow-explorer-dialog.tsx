import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/language-context';
import { BookOpen } from 'lucide-react';
import { TransactionFlowGuide } from './transaction-flow-guide';

export const TransactionFlowExplorerDialog = () => {
  const { language } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-earth-light-brown/30 text-earth-brown hover:bg-earth-wheat/50"
        >
          <BookOpen className="h-4 w-4" />
          {language === 'id' ? 'Panduan Transaksi' : 'Transaction Guide'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        {/* <DialogHeader>
          <DialogTitle className="text-xl text-earth-dark-green">
            {language === 'id' ? 'Panduan Alur Transaksi' : 'Transaction Flow Guide'}
          </DialogTitle>
          <DialogDescription className="text-earth-medium-green">
            {language === 'id'
              ? 'Berikut adalah langkah-langkah dalam proses transaksi untuk petani:'
              : 'Here are the steps in the transaction process for farmers:'}
          </DialogDescription>
        </DialogHeader> */}
        <div className="">
          <TransactionFlowGuide currentStep="login" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFlowExplorerDialog;
