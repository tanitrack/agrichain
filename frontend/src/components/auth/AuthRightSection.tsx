import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConnectWithOtp } from '@dynamic-labs/sdk-react-core';
import { UserProfileForm } from '@/components/auth/UserProfileForm';
import { EmailRegistrationForm } from '@/components/auth/EmailRegistrationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AuthRightSectionProps {
  userType: string;
  setUserType: (value: string) => void;
}

// Define registration steps
type RegistrationStep = 'email' | 'userType' | 'profile' | 'complete';

export function AuthRightSection({ userType, setUserType }: AuthRightSectionProps) {
  const [loading, setLoading] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('email');
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();

  // Handle email registration completion
  const handleEmailRegistrationComplete = (email: string) => {
    setUserEmail(email);
    setRegistrationStep('userType');
  };

  // Handle user type selection
  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    setRegistrationStep('profile');
  };

  // Handle profile completion
  const handleProfileComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationStep('complete');

    // Show success toast
    toast({
      title: language === 'id' ? 'Registrasi Berhasil' : 'Registration Successful',
      description:
        language === 'id'
          ? 'Profil Anda telah berhasil disimpan'
          : 'Your profile has been successfully saved',
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
        return (
          <EmailRegistrationForm onComplete={handleEmailRegistrationComplete} loading={loading} />
        );
      case 'userType':
        return (
          <div className="p-6">
            <h3 className="text-earth-dark-green mb-4 text-center text-xl font-semibold">
              {language === 'id' ? 'Daftar Sebagai' : 'Register as'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleUserTypeSelection('petani')}
                className="border-earth-light-brown hover:bg-earth-pale-green rounded-lg border p-4 transition-colors"
              >
                <h4 className="text-earth-dark-green font-medium">
                  {language === 'id' ? 'Petani' : 'Farmer'}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {language === 'id'
                    ? 'Daftar sebagai petani untuk menjual produk pertanian'
                    : 'Register as a farmer to sell agricultural products'}
                </p>
              </button>
              <button
                onClick={() => handleUserTypeSelection('konsumen')}
                className="border-earth-light-brown hover:bg-earth-pale-green rounded-lg border p-4 transition-colors"
              >
                <h4 className="text-earth-dark-green font-medium">
                  {language === 'id' ? 'Konsumen' : 'Buyer'}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {language === 'id'
                    ? 'Daftar sebagai konsumen untuk membeli produk pertanian'
                    : 'Register as a buyer to purchase agricultural products'}
                </p>
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
                className="text-earth-dark-green hover:text-earth-medium-green hover:bg-earth-pale-green mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'id' ? 'Kembali ke pilihan peran' : 'Back to role selection'}
              </Button>

              <div className="mb-6 flex items-center justify-center">
                <div className="bg-earth-pale-green text-earth-dark-green inline-flex items-center rounded-full px-4 py-2">
                  <span className="mr-2 text-lg">👤</span>
                  <span className="font-medium">
                    {userType === 'petani'
                      ? language === 'id'
                        ? 'Petani'
                        : 'Farmer'
                      : language === 'id'
                        ? 'Konsumen'
                        : 'Buyer'}
                  </span>
                </div>
              </div>
            </div>
            <UserProfileForm
              onSubmit={handleProfileComplete}
              loading={loading}
              userType={userType}
            />
          </div>
        );
      case 'complete':
        return (
          <div className="p-6 text-center">
            <h3 className="text-earth-dark-green text-xl font-semibold">
              {language === 'id' ? 'Registrasi Berhasil!' : 'Registration Successful!'}
            </h3>
            <p className="mt-2 text-gray-600">
              {language === 'id' ? 'Mengalihkan ke dashboard...' : 'Redirecting to dashboard...'}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 md:bg-transparent">
      <Card className="border-earth-light-brown/40 w-full max-w-md overflow-hidden bg-white shadow-lg backdrop-blur-sm md:bg-white/95">
        <CardHeader className="from-earth-dark-green to-earth-medium-green bg-gradient-to-r py-6 text-white">
          <CardTitle className="text-center text-2xl text-white">
            {registrationStep === 'email'
              ? language === 'id'
                ? 'Pendaftaran'
                : 'Registration'
              : registrationStep === 'userType'
                ? language === 'id'
                  ? 'Daftar Sebagai'
                  : 'Register as'
                : registrationStep === 'profile'
                  ? language === 'id'
                    ? 'Lengkapi Profil'
                    : 'Complete Profile'
                  : language === 'id'
                    ? 'Registrasi Berhasil'
                    : 'Registration Successful'}
          </CardTitle>
          <CardDescription className="mt-2 text-center text-white/90">
            {registrationStep === 'email'
              ? language === 'id'
                ? 'Masukkan email Anda untuk mendaftar'
                : 'Enter your email to register'
              : registrationStep === 'userType'
                ? language === 'id'
                  ? 'Pilih peran Anda dalam platform'
                  : 'Choose your role on the platform'
                : registrationStep === 'profile'
                  ? language === 'id'
                    ? 'Lengkapi informasi profil Anda'
                    : 'Complete your profile information'
                  : language === 'id'
                    ? 'Mengalihkan ke dashboard...'
                    : 'Redirecting to dashboard...'}
          </CardDescription>
        </CardHeader>
        {renderRegistrationForm()}
      </Card>
    </div>
  );
}
