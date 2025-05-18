import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { UserProfileForm } from '@/components/auth/user-profile-form';
import { EmailRegistrationForm } from '@/components/auth/email-registration-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf, ShoppingBasket } from 'lucide-react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

interface AuthRightSectionProps {
  userType?: 'farmer' | 'consumer';
  setUserType?: (value: 'farmer' | 'consumer') => void;
}

// Define registration steps
const step = ['email', 'userType', 'profile', 'complete'] as const;

export function AuthRightSection({ userType, setUserType }: AuthRightSectionProps) {
  const [registrationStep, setRegistrationStep] = useQueryState(
    'registrationStep',
    parseAsStringLiteral(step).withDefault('email')
  );
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Handle email registration completion
  const handleEmailRegistrationComplete = () => {
    console.log('handleEmailRegistrationComplete');
    navigate('/register-profile?registrationStep=userType', { replace: true });
  };

  // Handle user type selection
  const handleUserTypeSelection = (type: 'farmer' | 'consumer') => {
    setUserType(type);
    setRegistrationStep('profile');
  };

  // Handle profile completion
  const handleProfileComplete = () => {
    setRegistrationStep('complete');

    // Show success toast
    toast({
      title: t('register.success'),
      description: t('register.profileSaved'),
    });

    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  // Handle going back to role selection
  const handleBackToRoleSelection = () => {
    setRegistrationStep('userType');
  };

  // Render the appropriate form based on the current step
  const renderRegistrationForm = () => {
    switch (registrationStep) {
      case 'email':
        return <EmailRegistrationForm onComplete={handleEmailRegistrationComplete} />;
      case 'userType':
        return (
          <div className="p-6">
            <h3 className="mb-4 text-center text-xl font-semibold text-earth-dark-green">
              {t('register.as')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleUserTypeSelection('farmer')}
                className="relative rounded-lg border border-earth-light-brown bg-gradient-to-br from-[#224c2a] via-[#356d3a] to-[#193c1e] p-4  transition duration-300 hover:-translate-y-4 hover:bg-earth-pale-green"
              >
                <div className="absolute left-2 top-2 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-medium text-white">{t('register.farmer')}</h4>
                <p className="mt-1 text-sm text-gray-200">{t('register.farmerDesc')}</p>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeSelection('consumer')}
                className="relative rounded-lg border border-earth-light-brown bg-gradient-to-br from-[#d79c08] via-[#e1c169] to-[#d79d08] p-4 transition duration-300 hover:-translate-y-4 hover:bg-earth-pale-green"
              >
                <div className="absolute left-2 top-2 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <ShoppingBasket className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-medium text-white">{t('register.buyer')}</h4>
                <p className="mt-1 text-sm text-gray-200">{t('register.buyerDesc')}</p>
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div>
            <div className="px-8 pt-6">
              <Button
                variant="ghost"
                onClick={handleBackToRoleSelection}
                className="mb-4 text-earth-dark-green hover:bg-earth-pale-green hover:text-earth-medium-green"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('register.backToRole')}
              </Button>

              <div className="mb-6 flex items-center justify-center">
                <div className="inline-flex items-center rounded-full bg-earth-pale-green px-4 py-2 text-earth-dark-green">
                  <span className="mr-2 text-lg">👤</span>
                  <span className="font-medium">
                    {userType === 'farmer' ? t('register.farmer') : t('register.buyer')}
                  </span>
                </div>
              </div>
            </div>
            <UserProfileForm onSuccess={handleProfileComplete} initialData={{ userType }} />
          </div>
        );
      case 'complete':
        return (
          <div className="p-6 text-center">
            <h3 className="text-xl font-semibold text-earth-dark-green">{t('register.success')}</h3>
            <p className="mt-2 text-gray-600">{t('register.redirecting')}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 md:bg-transparent">
      <Card className="w-full max-w-md overflow-hidden border-earth-light-brown/40 bg-white shadow-lg backdrop-blur-sm md:bg-white/95">
        <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green py-6 text-white">
          <CardTitle className="text-center text-2xl text-white">
            {registrationStep === 'email'
              ? t('register.title')
              : registrationStep === 'userType'
                ? t('register.as')
                : registrationStep === 'profile'
                  ? t('register.completeProfile')
                  : t('register.success')}
          </CardTitle>
          <CardDescription className="mt-2 text-center text-white/90">
            {registrationStep === 'email'
              ? t('register.withEmail')
              : registrationStep === 'userType'
                ? t('register.chooseRole')
                : registrationStep === 'profile'
                  ? t('register.completeProfileDesc')
                  : t('register.redirecting')}
          </CardDescription>
        </CardHeader>
        {renderRegistrationForm()}
      </Card>
    </div>
  );
}
