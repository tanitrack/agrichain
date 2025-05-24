// src/components/orderbook/detail/OrderBookHeader.tsx
import { ArrowLeft } from 'lucide-react'; // Use lucide-react for icons
import { Button } from '@/components/ui/button';
import { OrderBookDetailType } from '@/types/order-book'; // Use the correct type
import { useAuthCheck } from '@/hooks/use-auth-check'; // Import useAuthCheck to get userProfile type
import { useLanguage } from '@/contexts/language-context'; // Use useLanguage for translation
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Infer UserProfile type from useAuthCheck hook
type UserProfile = ReturnType<typeof useAuthCheck>['userProfile'];

interface OrderBookHeaderProps {
  orderBook: OrderBookDetailType;
  userProfile: UserProfile; // Use the inferred type
  navigate: ReturnType<typeof useNavigate>; // Use the correct navigate type
  handleAccept: () => void;
  handleReject: () => void;
}

export const OrderBookHeader: React.FC<OrderBookHeaderProps> = ({
  orderBook,
  userProfile,
  navigate,
  handleAccept,
  handleReject,
}) => {
  const { t } = useLanguage();

  const isFarmer = userProfile?.userType === 'farmer'; // Use userType and 'farmer'

  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/order-book')}>
          {' '}
          {/* Navigate to /order-book */}
          <ArrowLeft className="h-4 w-4" /> {/* Use ArrowLeft icon */}
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {t('orderbook.detail')} {/* Use the correct translation key */}
        </h2>
        {/* Display order ID separately as in the original code */}
        <p className="text-earth-medium-green">{orderBook._id}</p> {/* Use _id */}
      </div>
      <div className="flex items-center space-x-2">
        {isFarmer &&
          orderBook.status === 'open' && ( // Use 'open' status
            <>
              <Button variant="outline" onClick={handleReject}>
                {t('rejectOrder')}
              </Button>
              <Button onClick={handleAccept}>{t('acceptOrder')}</Button>
            </>
          )}
        {/* The original code only had buttons for the 'open' status in this section.
            Keeping only the 'open' status buttons as per the original code structure.
            Other status buttons were not present in the original header section (lines 277-315).
        */}
      </div>
    </div>
  );
};
