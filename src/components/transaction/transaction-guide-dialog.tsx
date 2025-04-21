import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/language-context';
import { InfoIcon } from 'lucide-react';
import { TransactionFlowGuide } from './transaction-flow-guide';

interface TransactionGuideDialogProps {
  currentStep?: string;
}

export const TransactionGuideDialog = ({ currentStep = 'login' }: TransactionGuideDialogProps) => {
  const { language } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-earth-light-brown/30 text-earth-brown hover:bg-earth-wheat/50"
        >
          <InfoIcon className="h-4 w-4" />
          {language === 'id' ? 'Petunjuk Transaksi' : 'Transaction Guide'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-earth-dark-green">
            {language === 'id' ? 'Panduan Alur Transaksi' : 'Transaction Flow Guide'}
          </DialogTitle>
          <DialogDescription className="text-earth-medium-green">
            {language === 'id'
              ? 'Berikut adalah langkah-langkah dalam proses transaksi reguler untuk petani:'
              : 'Here are the steps in the regular transaction process for farmers:'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <TransactionFlowGuide currentStep={currentStep} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionGuideDialog;
