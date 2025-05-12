import { useState } from 'react';
import { AuthLeftSection } from '@/components/auth/auth-left-section';
import { AuthRightSection } from '@/components/auth/auth-right-section';
import { Navigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/use-auth-check';

export default function RegisterProfile() {
  const [userType, setUserType] = useState<'farmer' | 'consumer'>('farmer');

  const { isSystemAuthenticated, userProfile, isLoadingAuth } = useAuthCheck();

  if (isSystemAuthenticated && userProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isSystemAuthenticated && !isLoadingAuth) {
    return <Navigate to="/register" replace />;
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
