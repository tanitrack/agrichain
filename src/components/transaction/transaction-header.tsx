import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import TransactionFlowExplorerDialog from './transaction-flow-explorer-dialog';
import { useAuthCheck } from '@/hooks/use-auth-check';

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
        <h1 className="text-2xl font-bold text-earth-dark-green">{t('transactions.detail')}</h1>
        <p className="font-medium text-earth-medium-green">{id}</p>
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

        {/* <Button
          variant="outline"
          className="border-earth-light-brown/70 text-earth-dark-green hover:bg-earth-pale-green gap-2"
        >
          <FileText className="h-4 w-4" />
          Print Details
        </Button> */}
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
  const { language } = useLanguage();
  const { userProfile } = useAuthCheck();

  // If it's not menunggu_konfirmasi status, don't render anything
  if (status !== 'menunggu_konfirmasi') return null;

  return (
    <div className="mt-4 flex space-x-2 md:mt-0">
      {/* Add Transaction Guide button */}
      <TransactionFlowExplorerDialog />

      {userProfile.userType === 'farmer' && (
        <>
          <Button
            variant="outline"
            className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
            onClick={onDeclineTransaction}
          >
            <XCircle className="h-4 w-4" />
            {language === 'id' ? 'Tolak Pesanan' : 'Reject Order'}
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-earth-dark-green to-earth-medium-green hover:from-earth-medium-green hover:to-earth-dark-green"
            onClick={onConfirmTransaction}
          >
            <CheckCircle className="h-4 w-4" />
            {language === 'id' ? 'Terima Pesanan' : 'Accept Order'}
          </Button>
        </>
      )}
    </div>
  );
};

export default TransactionHeader;
