import { AuthLeftSection } from '@/components/auth/auth-left-section';
import { AuthRightSection } from '@/components/auth/auth-right-section';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { Navigate } from 'react-router-dom';

export default function Register() {
  const { isSystemAuthenticated, userProfile } = useAuthCheck();

  if (isSystemAuthenticated && userProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-earth-pale-green to-white md:flex-row">
      {/* Left Section - Visual & Information */}
      <AuthLeftSection />

      {/* Right Section - Registration Form */}
      <AuthRightSection />
    </div>
  );
}
