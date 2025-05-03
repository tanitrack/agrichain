import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useLanguage } from '@/contexts/language-context';
import { useEffect, useState } from 'react';

interface OTPInputProps {
  otp: string;
  setOtp: (value: string) => void;
  loading: boolean;
  onVerify: () => void;
  onResend?: () => void;
  onBack?: () => void;
  title?: string;
  description?: string;
  email?: string;
}

export const OTPInput = ({
  otp,
  setOtp,
  loading,
  onVerify,
  onBack,
  onResend,
  title,
  description,
  email,
}: OTPInputProps): JSX.Element => {
  const { language } = useLanguage();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    if (onResend) {
      onResend();
      setCountdown(30);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <p className="text-center font-medium text-earth-dark-green">
          {title || (language === 'id' ? 'Masukkan 6 Digit Kode OTP' : 'Enter 6 Digit OTP Code')}
        </p>
        <p className="mb-4 text-center text-sm text-earth-dark-green">
          {description ||
            (language === 'id'
              ? 'Kode dikirim ke email ' + email
              : 'Code sent to the email ' + email)}
        </p>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  // eslint-disable-next-line @eslint-react/no-array-index-key
                  key={index}
                  index={index}
                  className="h-14 w-14 border-earth-medium-green text-xl focus-visible:ring-earth-dark-green"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          onClick={onVerify}
          className="h-12 w-full rounded-full bg-earth-dark-green text-base hover:bg-earth-medium-green"
          disabled={loading || otp.length !== 6}
        >
          {loading
            ? language === 'id'
              ? 'Memverifikasi...'
              : 'Verifying...'
            : language === 'id'
              ? 'Verifikasi'
              : 'Verify'}
        </Button>
        {onBack && (
          <Button
            variant="outline"
            className="w-full rounded-full border-earth-light-brown text-earth-dark-green hover:bg-earth-pale-green"
            onClick={onBack}
          >
            {language === 'id' ? 'Kembali' : 'Back'}
          </Button>
        )}
        {onResend && (
          <div>
            <Button
              variant="outline"
              className="w-full rounded-full border-earth-light-brown text-earth-dark-green hover:bg-earth-pale-green"
              onClick={handleResend}
              disabled={countdown > 0}
            >
              {language === 'id' ? 'Kirim Ulang Kode' : 'Resend Code'}
            </Button>
            <p
              className={`py-4 text-center text-sm ${
                countdown > 0 ? 'text-earth-dark-green' : 'text-white'
              }`}
            >
              {countdown > 0
                ? language === 'id'
                  ? `Tunggu ${countdown} detik untuk mengirim ulang`
                  : `Wait ${countdown} seconds to resend`
                : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
