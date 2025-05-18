import { AuthHeader } from './auth-header';
import { AuthBenefits } from './auth-benefits';
import { AuthCardDisplay } from './auth-card-display';
import LanguageSwitcher from '@/components/common/language-switcher';

interface AuthLeftSectionProps {
  userType?: string;
}

export function AuthLeftSection({ userType }: AuthLeftSectionProps) {
  return (
    <div className="relative flex w-full items-center justify-center p-8 md:w-1/2">
      <div className="absolute -bottom-64 -left-64 h-96 w-96 rounded-full bg-earth-light-green/20 blur-3xl" />
      <div className="absolute -right-64 -top-64 h-96 w-96 rounded-full bg-earth-wheat/30 blur-3xl" />

      <div className="z-10 mx-auto max-w-md">
        <AuthHeader />

        {!!userType && (
          <>
            {/* <h2 className="mb-6 text-2xl font-bold text-earth-dark-green">
              {userType === 'petani'
                ? language === 'id'
                  ? 'Daftar sebagai Petani'
                  : 'Register as Farmer'
                : language === 'id'
                  ? 'Daftar sebagai Konsumen'
                  : 'Register as Buyer'}
            </h2> */}

            <AuthBenefits />
            <AuthCardDisplay />
          </>
        )}
      </div>

      {/* Language Switcher positioned at bottom right */}
      <div className="absolute bottom-4 right-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
