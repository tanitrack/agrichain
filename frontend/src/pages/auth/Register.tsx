import { useState } from 'react';
import { AuthLeftSection } from '@/components/auth/AuthLeftSection';
import { AuthRightSection } from '@/components/auth/AuthRightSection';
import { OTPInput } from '@/components/common/OTPInput';

export default function Register() {
  const [userType, setUserType] = useState('');

  const handleVerifyOtp = () => {
    // Implementation of handleVerifyOtp
  };

  return (
    <div className="from-earth-pale-green flex min-h-screen flex-col overflow-hidden bg-gradient-to-br to-white md:flex-row">
      {/* Left Section - Visual & Information */}
      <AuthLeftSection userType={userType} />

      {/* Right Section - Registration Form */}
      <AuthRightSection userType={userType} setUserType={setUserType} />
    </div>
  );
}
