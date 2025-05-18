import { useState } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs'; // nuqs for URL query state management
import { useNavigate, Link, Navigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import TaniTrackCard from '@/components/tani-card/tani-card';
import LanguageSwitcher from '@/components/common/language-switcher';
import { useConnectWithOtp } from '@dynamic-labs/sdk-react-core';
import { api } from '@/lib/convex';
import { Spinner } from '@/components/ui/spinner';
import { useAuthCheck } from '@/hooks/use-auth-check';
// Modularized components
import LoginModeSwitcher from '@/components/auth/login-mode-switcher';
import EmailLoginForm from '@/components/auth/email-login-form';
import TaniIdLoginForm from '@/components/auth/taniid-login-form';
import { clientEnv } from '@/lib/client-env-variables';
import React from 'react';
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner';

export default function Login() {
  // State for login mode and form fields (mode, email, taniId now managed by nuqs)
  const [email, setEmail] = useQueryState('email');
  const [taniId, setTaniId] = useQueryState('taniId', parseAsInteger);
  const [mode, setMode] = useQueryState('mode', {
    defaultValue: Number.isNaN(Number.parseInt(taniId?.toString())) ? 'email' : 'taniId',
  });
  const [qrCodeRawValue, setQrCodeRawValue] = useState<string | null>(null);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { connectWithEmail, verifyOneTimePassword, retryOneTimePassword } = useConnectWithOtp();
  const { convex, isLoadingAuth, isSystemAuthenticated, userProfile } = useAuthCheck();

  // Email login handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleEmailLogin();
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setError(undefined);
    try {
      await connectWithEmail(email);
      toast({
        title: t('login.otpSentTitle'),
        description: t('login.otpSentDesc'),
      });
      setShowOtpInput(true);
    } catch (error) {
      setError(t('login.emailFailed'));
      toast({
        variant: 'destructive',
        title: t('login.emailFailed'),
        description: t('login.emailFailedDesc'),
      });
      console.error('Email login failed', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await verifyOneTimePassword(otp);
      const responseNotNull = response as Exclude<typeof response, void>;
      const { user } = responseNotNull;
      const userProfile = await convex.query(api.users_queries.getUserByUserId, {
        userId: user?.id,
      });
      if (!userProfile) {
        toast({
          title: t('login.profileNotRegistered'),
          description: t('login.completeProfileFirst'),
        });
        navigate('/register-profile?registrationStep=userType', { replace: true });
        return;
      }
      toast({
        title: t('login.success'),
        description: t('login.welcome'),
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(t('login.invalidOtp'));
      toast({
        variant: 'destructive',
        title: t('login.failed'),
        description: t('login.invalidOtp'),
      });
      console.error('OTP verification failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError(undefined);
    try {
      await retryOneTimePassword();
      toast({
        title: t('login.otpResentTitle'),
        description: t('login.otpResentDesc'),
      });
    } catch (error) {
      setError(t('login.otpResendFailed'));
      toast({
        variant: 'destructive',
        title: t('login.otpResendFailed'),
        description: t('login.otpResendFailedDesc'),
      });
      console.error('OTP resend failed', error);
    } finally {
      setLoading(false);
    }
  };

  const serverSideTaniIdLogin = async () => {
    const result = await fetch(`${clientEnv.VITE_CONVEX_SITE_URL}/auth/tani-id-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taniId }),
    });

    if (!result.ok) {
      throw new Error('Failed to login with TaniId');
    }

    const data = await result.json();

    if (!data.taniId || !data.email) {
      throw new Error('User not found');
    }

    await connectWithEmail(data.email);

    toast({
      title: t('login.otpSentTitle'),
      description: t('login.otpSentDesc'),
    });

    setShowOtpInput(true);
  };

  const handleTaniIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taniId) {
      setError(t('login.taniIdRequired'));
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      await serverSideTaniIdLogin();
    } catch (error) {
      setError(t('login.taniIdFailed'));
      toast({
        variant: 'destructive',
        title: t('login.taniIdFailed'),
        description: t('login.taniIdFailedDesc'),
      });
      console.error('TaniId login failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQrLogin = async (qrTaniId: string) => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await fetch(`${clientEnv.VITE_CONVEX_SITE_URL}/auth/tani-id-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taniId: qrTaniId }),
      });

      if (!result.ok) {
        throw new Error('Failed to login with TaniId');
      }

      const data = await result.json();

      if (!data.taniId || !data.email) {
        throw new Error('User not found');
      }

      await connectWithEmail(data.email);

      toast({
        title: t('login.otpSentTitle'),
        description: t('login.otpSentDesc'),
      });

      setShowOtpInput(true);
    } catch (error) {
      setError(t('login.emailFailed'));
      toast({
        variant: 'destructive',
        title: t('login.emailFailed'),
        description: t('login.emailFailedDesc'),
      });
      console.error('Email login failed', error);
    } finally {
      setLoading(false);
    }
  };

  // Auth redirects
  if (isSystemAuthenticated && userProfile) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isSystemAuthenticated && !userProfile) {
    return <Navigate to="/register-profile" replace />;
  }
  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" />
        <span className="sr-only">loading</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-earth-pale-green to-white md:flex-row">
      {/* Left Section - Visual & Explanation */}
      <div className="relative hidden w-full items-center justify-center p-8 md:flex md:w-1/2">
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
            <h1 className="text-4xl font-bold text-earth-dark-green">{t('app.name')}</h1>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-earth-dark-green">
            {t('login.description')}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start rounded-lg border border-earth-light-green/50 bg-white p-4 shadow-md">
              <QrCode className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-earth-medium-green" />
              <div>
                <h3 className="mb-1 font-semibold text-earth-dark-green">{t('login.howTo')}</h3>
                <p className="text-sm text-earth-medium-green">
                  1.{' '}
                  {t(
                    mode === 'email'
                      ? 'login.step1.email'
                      : mode === 'taniId'
                        ? 'login.step1.taniId'
                        : 'login.step1.qr'
                  )}
                </p>
                <p className="mt-1 text-sm text-earth-medium-green">2. {t('login.step2')}</p>
              </div>
            </div>
            {/* Stacked cards in perspective view */}
            <div className="mt-8 flex justify-center">
              <div className="relative mx-auto h-60 w-72">
                {/* Front card (Farmer card) */}
                <div className="absolute -left-32 rotate-6">
                  <TaniTrackCard userType="consumer" />
                </div>
                <div className="absolute -rotate-6">
                  <TaniTrackCard userType="farmer" />
                </div>
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
      <div className="flex w-full flex-1 items-center justify-center bg-white p-8 md:w-1/2 md:bg-transparent">
        <Card className="w-full max-w-md overflow-hidden border-earth-light-brown/40 bg-white shadow-lg backdrop-blur-sm md:bg-white/95">
          <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green py-6 text-white">
            <CardTitle className="text-center text-2xl text-white">{t('login.title')}</CardTitle>
            <CardDescription className="mt-2 text-center text-white/90">
              {mode === 'email'
                ? showOtpInput
                  ? t('login.otpPrompt')
                  : t('login.emailPrompt')
                : t('login.taniIdPrompt')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pt-6">
            {/* Mode Switcher */}
            <LoginModeSwitcher
              mode={mode}
              onModeChange={(m) => {
                if (m === 'email') {
                  setTaniId(null);
                }

                setMode(m);
                setShowOtpInput(false);
                setError(undefined);
              }}
            />
            {/* Email Login Form */}
            {mode === 'email' && (
              <EmailLoginForm
                email={email}
                onEmailChange={setEmail}
                otp={otp}
                onOtpChange={setOtp}
                showOtpInput={showOtpInput}
                loading={loading}
                error={error}
                onSubmit={handleLogin}
                onVerifyOtp={verifyOtp}
                onResendOtp={handleResendOTP}
              />
            )}
            {/* TaniId Login Form */}
            {mode === 'taniId' && (
              <TaniIdLoginForm
                taniId={taniId}
                onTaniIdChange={(v) => setTaniId(parseInt(v))}
                loading={loading}
                error={error}
                onSubmit={handleTaniIdLogin}
                showOtpInput={showOtpInput}
                otp={otp}
                onOtpChange={setOtp}
                onVerifyOtp={verifyOtp}
                onResendOtp={handleResendOTP}
              />
            )}
            {/* QR Code Login Mode */}
            {mode === 'qrcode' && (
              <div className="flex flex-col items-center gap-6 py-8">
                <h2 className="text-xl font-semibold text-earth-dark-green">
                  {t('login.qrscan.title')}
                </h2>
                <div className="w-full max-w-xs overflow-hidden rounded-lg border-2 border-earth-medium-green">
                  <QrScanner
                    onScan={async (detectedCodes) => {
                      for (const code of detectedCodes) {
                        // Parse taniId from QR value (expecting .../login?taniId=XXX&mode=taniId)
                        const rawValue = code.rawValue;
                        setQrCodeRawValue(rawValue);
                        const url = new URL(rawValue);
                        // check if card is for current host
                        if (url.origin !== window.location.origin) {
                          console.log('QR code host is not valid');
                          return;
                        }
                        const taniIdParam = url.searchParams.get('taniId');
                        const modeParam = url.searchParams.get('mode');
                        const emailParam = url.searchParams.get('email');
                        if (modeParam === 'taniId' && taniIdParam && emailParam) {
                          await setTaniId(parseInt(taniIdParam));
                          await setEmail(emailParam);
                          await setMode('taniId');
                          await handleQrLogin(taniIdParam);
                        }
                      }
                    }}
                    onError={(error) => {
                      console.log(error);
                    }}
                  />
                </div>
                <p className="text-xs text-earth-brown">{qrCodeRawValue}</p>
                <div className="text-center text-sm text-earth-dark-green">
                  {t('login.qrscan.command')}
                  <br />
                  <span className="text-xs text-earth-brown">{t('login.qrscan.result')}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-8 py-8">
            <div className="text-center text-sm text-earth-dark-green">
              {t('login.noAccount')}
              <Link
                to="/register"
                className="font-semibold text-earth-medium-green hover:underline"
              >
                {t('login.registerNow')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
