import { useLanguage } from '@/contexts/language-context';
import { ShoppingBag, FileCheck, Recycle } from 'lucide-react';

interface AuthBenefitsProps {
  userType?: string;
}

export function AuthBenefits({ userType = '' }: AuthBenefitsProps) {
  const { language } = useLanguage();

  return (
    <div className="mb-6 rounded-lg border border-earth-light-green/50 bg-white p-5 shadow-md">
      <h3 className="mb-3 text-lg font-semibold text-earth-dark-green">
        {language === 'id' ? 'Manfaat menggunakan TaniTrack:' : 'Benefits of using TaniTrack:'}
      </h3>

      <ul className="space-y-3">
        <li className="flex items-center text-earth-dark-green">
          <div className="mr-3 rounded-full bg-earth-pale-green p-1.5">
            <ShoppingBag className="h-4 w-4 text-earth-dark-green" />
          </div>
          <span>
            {language === 'id'
              ? 'Jual dan Beli produk pertanian secara langsung'
              : 'Sell ​​and Buy agricultural products directly'}
          </span>
        </li>
        <li className="flex items-center text-earth-dark-green">
          <div className="mr-3 rounded-full bg-earth-pale-green p-1.5">
            <FileCheck className="h-4 w-4 text-earth-dark-green" />
          </div>
          <span>
            {language === 'id' ? 'Asal-usul produk yang terlacak' : 'Traceable product origins'}
          </span>
        </li>
        <li className="flex items-center text-earth-dark-green">
          <div className="mr-3 rounded-full bg-earth-pale-green p-1.5">
            <Recycle className="h-4 w-4 text-earth-dark-green" />
          </div>
          <span>
            {language === 'id'
              ? 'Dukung agrikultural hingga berkelanjutan'
              : 'Support agriculture until it is sustainable'}
          </span>
        </li>
      </ul>
    </div>
  );
}
