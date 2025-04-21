import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingBag, FileCheck, Store } from 'lucide-react';

interface AuthBenefitsProps {
  userType: string;
}

export function AuthBenefits({ userType }: AuthBenefitsProps) {
  const { language } = useLanguage();

  return (
    <div className="border-earth-light-green/50 mb-6 rounded-lg border bg-white p-5 shadow-md">
      <h3 className="text-earth-dark-green mb-3 text-lg font-semibold">
        {userType === 'petani'
          ? language === 'id'
            ? 'Manfaat untuk Petani:'
            : 'Benefits for Farmers:'
          : language === 'id'
            ? 'Manfaat untuk Konsumen:'
            : 'Benefits for Buyers:'}
      </h3>

      {userType === 'petani' ? (
        <ul className="space-y-3">
          <li className="text-earth-dark-green flex items-center">
            <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
              <ShoppingBag className="text-earth-dark-green h-4 w-4" />
            </div>
            <span>
              {language === 'id'
                ? 'Jual hasil panen langsung ke konsumen'
                : 'Sell harvest directly to buyers'}
            </span>
          </li>
          <li className="text-earth-dark-green flex items-center">
            <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
              <FileCheck className="text-earth-dark-green h-4 w-4" />
            </div>
            <span>
              {language === 'id'
                ? 'Lacak pertumbuhan tanaman & hasil panen'
                : 'Track crop growth & harvest yields'}
            </span>
          </li>
          <li className="text-earth-dark-green flex items-center">
            <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
              <Store className="text-earth-dark-green h-4 w-4" />
            </div>
            <span>
              {language === 'id'
                ? 'Dapatkan harga pasar yang lebih baik'
                : 'Get better market prices'}
            </span>
          </li>
        </ul>
      ) : (
        <ul className="space-y-3">
          <li className="text-earth-dark-green flex items-center">
            <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
              <ShoppingBag className="text-earth-dark-green h-4 w-4" />
            </div>
            <span>
              {language === 'id'
                ? 'Beli produk pertanian segar langsung dari petani'
                : 'Buy fresh agricultural products directly from farmers'}
            </span>
          </li>
          <li className="text-earth-dark-green flex items-center">
            <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
              <FileCheck className="text-earth-dark-green h-4 w-4" />
            </div>
            <span>
              {language === 'id'
                ? 'Lacak asal-usul produk yang Anda beli'
                : 'Track the origin of products you buy'}
            </span>
          </li>
          <li className="text-earth-dark-green flex items-center">
            <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
              <Store className="text-earth-dark-green h-4 w-4" />
            </div>
            <span>
              {language === 'id'
                ? 'Dukung petani lokal dan pertanian berkelanjutan'
                : 'Support local farmers and sustainable agriculture'}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}
