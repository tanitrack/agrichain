import { useState } from 'react';
import { AuthLeftSection } from '@/components/auth/auth-left-section';
import { AuthRightSection } from '@/components/auth/auth-right-section';

export default function Register() {
  const [userType, setUserType] = useState('');

  const handleVerifyOtp = () => {
    // Implementation of handleVerifyOtp
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-earth-pale-green to-white md:flex-row">
      {/* Left Section - Visual & Information */}
      <AuthLeftSection userType={userType} />

      {/* Right Section - Registration Form */}
      <AuthRightSection userType={userType} setUserType={setUserType} />
    </div>
  );
}
