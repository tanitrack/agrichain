import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowRightIcon, HelpCircle, QrCode, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { TaniTrackCard } from '@/components/custom/TaniTrackCard';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { OTPInput } from '@/components/common/OTPInput';

export default function Login() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      toast({
        title: language === 'id' ? 'Kode OTP telah dikirim!' : 'OTP code has been sent!',
        description:
          language === 'id'
            ? 'Silakan masukkan kode OTP yang telah dikirim ke perangkat TaniTrack Mobile Auth App Anda'
            : 'Please enter the OTP code sent to your TaniTrack Mobile Auth App',
      });
      setShowOtpInput(true);
      setLoading(false);
    }, 1000);
  };

  const verifyOtp = () => {
    setLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      if (otp.length === 6) {
        toast({
          title: language === 'id' ? 'Login berhasil!' : 'Login successful!',
          description:
            language === 'id' ? 'Selamat datang kembali di TaniTrack' : 'Welcome back to TaniTrack',
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: language === 'id' ? 'Gagal masuk' : 'Login failed',
          description: language === 'id' ? 'Kode OTP tidak valid' : 'Invalid OTP code',
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="from-earth-pale-green flex min-h-screen flex-col overflow-hidden bg-gradient-to-br to-white md:flex-row">
      {/* Left Section - Visual & Explanation */}
      <div className="relative flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="bg-earth-light-green/20 absolute -bottom-64 -left-64 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-earth-wheat/30 absolute -right-64 -top-64 h-96 w-96 rounded-full blur-3xl" />

        <div className="z-10 mx-auto max-w-md">
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-white/90">
              <img
                src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png"
                alt="TaniTrack Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-earth-dark-green text-4xl font-bold">TaniTrack</h1>
          </div>

          <h2 className="text-earth-dark-green mb-6 text-2xl font-bold">
            {language === 'id'
              ? 'Aplikasi Pengelolaan Pertanian untuk Kesejahteraan Petani'
              : "Agricultural Management App for Farmers' Prosperity"}
          </h2>

          <div className="space-y-6">
            <div className="border-earth-light-green/50 flex items-start rounded-lg border bg-white p-4 shadow-md">
              <QrCode className="text-earth-medium-green mr-3 mt-1 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-earth-dark-green mb-1 font-semibold">
                  {language === 'id' ? 'Cara Login' : 'How to Login'}
                </h3>
                <p className="text-earth-medium-green text-sm">
                  1.{' '}
                  {language === 'id'
                    ? 'Scan TaniTrack Card dengan TaniTrack Mobile Auth App'
                    : 'Scan your TaniTrack Card with TaniTrack Mobile Auth App'}
                </p>
                <p className="text-earth-medium-green mt-1 text-sm">
                  2.{' '}
                  {language === 'id'
                    ? 'Masukkan kode OTP dari TaniTrack Mobile Auth App ke Form Login'
                    : 'Enter the OTP code from TaniTrack Mobile Auth App to the Login Form'}
                </p>
              </div>
            </div>

            <div className="border-earth-light-green/50 flex items-start rounded-lg border bg-white p-4 shadow-md">
              <Smartphone className="text-earth-medium-green mr-3 mt-1 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-earth-dark-green mb-1 font-semibold">
                  {language === 'id' ? 'Keamanan Tinggi' : 'High Security'}
                </h3>
                <p className="text-earth-medium-green text-sm">
                  {language === 'id'
                    ? 'TaniTrack Card menjamin keamanan akun Anda dengan sistem OTP yang terproteksi.'
                    : 'TaniTrack Card ensures your account security with protected OTP system.'}
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
        <Card className="border-earth-light-brown/40 w-full max-w-md overflow-hidden bg-white shadow-lg backdrop-blur-sm md:bg-white/95">
          <CardHeader className="from-earth-dark-green to-earth-medium-green bg-gradient-to-r py-6 text-white">
            <CardTitle className="text-center text-2xl">
              {language === 'id' ? 'Masuk ke TaniTrack' : 'Login to TaniTrack'}
            </CardTitle>
            <CardDescription className="mt-2 text-center text-white/90">
              {showOtpInput
                ? language === 'id'
                  ? 'Masukkan kode OTP yang dikirim ke perangkat Anda'
                  : 'Enter the OTP code sent to your device'
                : language === 'id'
                  ? 'Masukkan ID TaniTrack untuk memulai'
                  : 'Enter your TaniTrack ID to get started'}
            </CardDescription>
          </CardHeader>

          {!showOtpInput ? (
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-5 px-8 pt-6">
                <div className="space-y-3">
                  <label htmlFor="tanitrack-id" className="text-earth-dark-green block font-medium">
                    {language === 'id' ? 'ID TaniTrack' : 'TaniTrack ID'}
                  </label>
                  <Input
                    id="tanitrack-id"
                    type="text"
                    placeholder={language === 'id' ? 'Masukkan ID TaniTrack' : 'Enter TaniTrack ID'}
                    required
                    className="border-earth-light-brown focus-visible:ring-earth-medium-green h-12 text-base"
                  />
                  <div className="text-earth-dark-green flex items-start text-xs">
                    <HelpCircle className="text-earth-medium-green mr-1 mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>
                      {language === 'id'
                        ? 'Format: F-XXXXXX-XX (Petani) atau B-XXXXXX-XX (Konsumen). ID ini terdapat pada kartu TaniTrack Anda.'
                        : 'Format: F-XXXXXX-XX (Farmer) or B-XXXXXX-XX (Buyer). This ID is on your TaniTrack card.'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 px-8 pb-8">
                <Button
                  type="submit"
                  className="bg-earth-dark-green hover:bg-earth-medium-green h-12 w-full rounded-full text-base"
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
                <div className="text-earth-dark-green text-center text-sm">
                  {language === 'id' ? 'Belum punya akun? ' : "Don't have an account? "}
                  <Link
                    to="/register"
                    className="text-earth-medium-green font-semibold hover:underline"
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
                />
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
