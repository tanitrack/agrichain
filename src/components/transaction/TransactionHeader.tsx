import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface TransactionHeaderProps {
  id: string;
  status: string;
  onProceedToNegotiation?: () => void;
  onConfirmTransaction?: () => void;
  onDeclineTransaction?: () => void;
}

export const TransactionHeader = ({
  id,
  status,
  onProceedToNegotiation,
  onConfirmTransaction,
  onDeclineTransaction,
}: TransactionHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <Button variant="outline" size="sm" className="mb-4" onClick={() => navigate('/transaksi')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('action.back')}
        </Button>
        <h1 className="text-earth-dark-green text-2xl font-bold">{t('transactions.detail')}</h1>
        <p className="text-earth-medium-green font-medium">{id}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
        {status === 'menunggu_konfirmasi' && (
          <ActionButtons
            status={status}
            onConfirmTransaction={onConfirmTransaction}
            onDeclineTransaction={onDeclineTransaction}
          />
        )}

        {status === 'dikonfirmasi' && (
          <Button variant="farmer" onClick={onProceedToNegotiation} className="gap-2">
            <span className="h-4 w-4" />
            Set Price & Negotiate
          </Button>
        )}

        <Button
          variant="outline"
          className="border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green gap-2"
        >
          <FileText className="h-4 w-4" />
          Print Details
        </Button>
      </div>
    </div>
  );
};

const ActionButtons = ({
  status,
  onConfirmTransaction,
  onDeclineTransaction,
}: {
  status: string;
  onConfirmTransaction?: () => void;
  onDeclineTransaction?: () => void;
}) => {
  // If it's not menunggu_konfirmasi status, don't render anything
  if (status !== 'menunggu_konfirmasi') return null;

  return (
    <>
      <Button variant="farmer" onClick={onConfirmTransaction} className="gap-2">
        <span className="h-4 w-4" />
        Confirm Transaction
      </Button>
      <Button variant="destructive" onClick={onDeclineTransaction} className="gap-2">
        <span className="h-4 w-4" />
        Decline Transaction
      </Button>
    </>
  );
};

export default TransactionHeader;
