import { useEffect, useState } from 'react';
import { AuthLeftSection } from '@/components/auth/auth-left-section';
import { AuthRightSection } from '@/components/auth/auth-right-section';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Spinner } from '@/components/ui/spinner';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  const [userType, setUserType] = useState('');
  
  const { sdkHasLoaded } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn]);

  const handleVerifyOtp = () => {
    // Implementation of handleVerifyOtp
  };

  if (isLoggedIn || !sdkHasLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-earth-pale-green to-white md:flex-row">
        <Spinner size='xl'/>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-earth-pale-green to-white md:flex-row">
      {/* Left Section - Visual & Information */}
      <AuthLeftSection userType={userType} />

      {/* Right Section - Registration Form */}
      <AuthRightSection userType={userType} setUserType={setUserType} />
    </div>
  );
}
