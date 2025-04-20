import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useLanguage } from '@/contexts/LanguageContext';

interface OTPInputProps {
  otp: string;
  setOtp: (value: string) => void;
  loading: boolean;
  onVerify: () => void;
  onBack?: () => void;
  title?: string;
  description?: string;
}

export const OTPInput = ({
  otp,
  setOtp,
  loading,
  onVerify,
  onBack,
  title,
  description,
}: OTPInputProps): JSX.Element => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-3">
        <p className="text-earth-dark-green text-center font-medium">
          {title || (language === 'id' ? 'Masukkan 6 Digit Kode OTP' : 'Enter 6 Digit OTP Code')}
        </p>
        <p className="text-earth-dark-green mb-4 text-center text-sm">
          {description ||
            (language === 'id'
              ? 'Kode dikirim ke perangkat yang terhubung dengan TaniTrack Card Anda'
              : 'Code sent to the device connected to your TaniTrack Card')}
        </p>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="border-earth-medium-green focus-visible:ring-earth-dark-green h-14 w-14 text-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          onClick={onVerify}
          className="bg-earth-dark-green hover:bg-earth-medium-green h-12 w-full rounded-full text-base"
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
            className="border-earth-light-brown text-earth-dark-green hover:bg-earth-pale-green w-full rounded-full"
            onClick={onBack}
          >
            {language === 'id' ? 'Kembali' : 'Back'}
          </Button>
        )}
      </div>
    </div>
  );
};
