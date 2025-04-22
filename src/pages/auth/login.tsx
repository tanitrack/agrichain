import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRightIcon, HelpCircle, QrCode, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { TaniTrackCard } from '@/components/custom/tani-track-card';
import LanguageSwitcher from '@/components/common/language-switcher';
import { OTPInput } from '@/components/common/otp-input';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { useConnectWithOtp } from '@dynamic-labs/sdk-react-core';
import { Spinner } from '@/components/ui/spinner';

interface LocationState {
  from: {
    pathname: string;
  };
}

export default function Login() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { sdkHasLoaded } = useDynamicContext();
  const { connectWithEmail, verifyOneTimePassword, retryOneTimePassword } = useConnectWithOtp();

  // Get the redirect path from location state or default to dashboard
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const isLoggedIn = useIsLoggedIn();

  // If already authenticated, redirect to the intended destination
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Connect with email using Dynamic SDK
      await connectWithEmail(email);

      toast({
        title: language === 'id' ? 'Kode OTP telah dikirim!' : 'OTP code has been sent!',
        description:
          language === 'id'
            ? 'Silakan masukkan kode OTP yang telah dikirim ke email Anda'
            : 'Please enter the OTP code sent to your email',
      });
      setShowOtpInput(true);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: language === 'id' ? 'Gagal mengirim OTP' : 'Failed to send OTP',
        description:
          language === 'id'
            ? 'Terjadi kesalahan saat mengirim OTP'
            : 'An error occurred while sending OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);

    try {
      // Verify OTP using Dynamic SDK
      await verifyOneTimePassword(otp);

      toast({
        title: language === 'id' ? 'Login berhasil!' : 'Login successful!',
        description:
          language === 'id' ? 'Selamat datang kembali di TaniTrack' : 'Welcome back to TaniTrack',
      });
      // Redirect to the intended destination after successful login
      navigate(from, { replace: true });
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        variant: 'destructive',
        title: language === 'id' ? 'Gagal masuk' : 'Login failed',
        description: language === 'id' ? 'Kode OTP tidak valid' : 'Invalid OTP code',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);

    try {
      await retryOneTimePassword();
      toast({
        title: language === 'id' ? 'Kode OTP telah dikirim ulang' : 'OTP has been resent',
        description: language === 'id' ? 'Silakan cek email Anda' : 'Please check your email',
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast({
        variant: 'destructive',
        title: language === 'id' ? 'Gagal mengirim ulang OTP' : 'Failed to resend OTP',
        description:
          language === 'id'
            ? 'Terjadi kesalahan saat mengirim ulang OTP'
            : 'An error occurred while resending OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn || !sdkHasLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-earth-pale-green to-white md:flex-row">
        <Spinner size='xl' />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-earth-pale-green to-white md:flex-row">
      {/* Left Section - Visual & Explanation */}
      <div className="relative flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="absolute -bottom-64 -left-64 h-96 w-96 rounded-full bg-earth-light-green/20 blur-3xl" />
        <div className="absolute -right-64 -top-64 h-96 w-96 rounded-full bg-earth-wheat/30 blur-3xl" />

        <div className="z-10 mx-auto max-w-md">
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-white/90">
              <img
                src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png"
                alt="TaniTrack Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-earth-dark-green">TaniTrack</h1>
          </div>

          <h2 className="mb-6 text-2xl font-bold text-earth-dark-green">
            {language === 'id'
              ? 'Aplikasi Pengelolaan Pertanian untuk Kesejahteraan Petani'
              : "Agricultural Management App for Farmers' Prosperity"}
          </h2>

          <div className="space-y-6">
            <div className="flex items-start rounded-lg border border-earth-light-green/50 bg-white p-4 shadow-md">
              <QrCode className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-earth-medium-green" />
              <div>
                <h3 className="mb-1 font-semibold text-earth-dark-green">
                  {language === 'id' ? 'Cara Login' : 'How to Login'}
                </h3>
                <p className="text-sm text-earth-medium-green">
                  1.{' '}
                  {language === 'id'
                    ? 'Masukkan email yang terdaftar di TaniTrack'
                    : 'Enter your registered email in TaniTrack'}
                </p>
                <p className="mt-1 text-sm text-earth-medium-green">
                  2.{' '}
                  {language === 'id'
                    ? 'Masukkan kode OTP yang dikirim ke email Anda'
                    : 'Enter the OTP code sent to your email'}
                </p>
              </div>
            </div>

            <div className="flex items-start rounded-lg border border-earth-light-green/50 bg-white p-4 shadow-md">
              <Smartphone className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-earth-medium-green" />
              <div>
                <h3 className="mb-1 font-semibold text-earth-dark-green">
                  {language === 'id' ? 'Keamanan Tinggi' : 'High Security'}
                </h3>
                <p className="text-sm text-earth-medium-green">
                  {language === 'id'
                    ? 'TaniTrack menjamin keamanan akun Anda dengan sistem OTP yang terproteksi.'
                    : 'TaniTrack ensures your account security with protected OTP system.'}
                </p>
              </div>
            </div>

            {/* Stacked cards in perspective view */}
            <div className="mt-8 flex justify-center">
              <div className="relative mx-auto h-60 w-72">
                {/* Back card (Buyer card) */}
                <TaniTrackCard
                  type="buyer"
                  name="PT PANGAN SEJAHTERA"
                  id="B-451022-JK"
                  location="JAKARTA"
                  expiryDate="09/2025"
                  isStacked={true}
                  stackPosition="back"
                />

                {/* Front card (Farmer card) */}
                <TaniTrackCard
                  type="farmer"
                  name="AGUS SURYANA"
                  id="F-230599-JB"
                  isStacked={true}
                  stackPosition="front"
                  className="relative z-10 -translate-x-2 translate-y-2 -rotate-3 transform"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Language Switcher positioned at bottom right */}
        <div className="absolute bottom-4 right-4">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 md:bg-transparent">
        <Card className="w-full max-w-md overflow-hidden border-earth-light-brown/40 bg-white shadow-lg backdrop-blur-sm md:bg-white/95">
          <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green py-6 text-white">
            <CardTitle className="text-center text-2xl">
              {language === 'id' ? 'Masuk ke TaniTrack' : 'Login to TaniTrack'}
            </CardTitle>
            <CardDescription className="mt-2 text-center text-white/90">
              {showOtpInput
                ? language === 'id'
                  ? 'Masukkan kode OTP yang dikirim ke email Anda'
                  : 'Enter the OTP code sent to your email'
                : language === 'id'
                  ? 'Masukkan email untuk memulai'
                  : 'Enter your email to get started'}
            </CardDescription>
          </CardHeader>

          {!showOtpInput ? (
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-5 px-8 pt-6">
                <div className="space-y-3">
                  <label htmlFor="email" className="block font-medium text-earth-dark-green">
                    {language === 'id' ? 'Email' : 'Email'}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'id' ? 'Masukkan email' : 'Enter email'}
                    required
                    className="h-12 border-earth-light-brown text-base focus-visible:ring-earth-medium-green"
                  />
                  <div className="flex items-start text-xs text-earth-dark-green">
                    <HelpCircle className="mr-1 mt-0.5 h-4 w-4 flex-shrink-0 text-earth-medium-green" />
                    <span>
                      {language === 'id'
                        ? 'Masukkan email yang terdaftar di TaniTrack Anda.'
                        : 'Enter the email registered in your TaniTrack account.'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 px-8 pb-8">
                <Button
                  type="submit"
                  className="h-12 w-full rounded-full bg-earth-dark-green text-base hover:bg-earth-medium-green"
                  disabled={loading}
                >
                  {loading
                    ? language === 'id'
                      ? 'Memproses...'
                      : 'Processing...'
                    : language === 'id'
                      ? 'Lanjutkan'
                      : 'Continue'}
                  {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
                </Button>
                <div className="text-center text-sm text-earth-dark-green">
                  {language === 'id' ? 'Belum punya akun? ' : "Don't have an account? "}
                  <Link
                    to="/register"
                    className="font-semibold text-earth-medium-green hover:underline"
                  >
                    {language === 'id' ? 'Daftar sekarang' : 'Register now'}
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <div>
              <CardContent className="px-8 pt-6">
                <OTPInput
                  otp={otp}
                  setOtp={setOtp}
                  loading={loading}
                  onVerify={verifyOtp}
                  onBack={() => setShowOtpInput(false)}
                  onResend={handleResendOTP}
                  email={email}
                />
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
