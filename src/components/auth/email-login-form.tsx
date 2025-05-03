import React from 'react';
import { Input } from '@/components/ui/input';
import { OTPInput } from '@/components/common/otp-input';
import SubmitButton from '@/components/auth/submit-button';
import ErrorDisplay from '@/components/auth/error-display';

/**
 * EmailLoginForm
 * Handles email input, OTP sending, and OTP input.
 */
export interface EmailLoginFormProps {
  email: string;
  onEmailChange: (v: string) => void;
  otp: string;
  onOtpChange: (v: string) => void;
  showOtpInput: boolean;
  loading: boolean;
  error?: string;
  onSubmit: (e: React.FormEvent) => void;
  onVerifyOtp: () => void;
  onResendOtp: () => void;
}

const EmailLoginForm: React.FC<EmailLoginFormProps> = ({
  email,
  onEmailChange,
  otp,
  onOtpChange,
  showOtpInput,
  loading,
  error,
  onSubmit,
  onVerifyOtp,
  onResendOtp,
}) => (
  <>
    {!showOtpInput && (
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          autoComplete="email"
          required
          placeholder="Email"
          disabled={loading || showOtpInput}
        />

        {!showOtpInput && (
          <SubmitButton loading={loading} type="submit">
            Login with Email
          </SubmitButton>
        )}
        {error && <ErrorDisplay message={error} />}
      </form>
    )}
    {showOtpInput && (
      <OTPInput
        otp={otp}
        setOtp={onOtpChange}
        loading={loading}
        onVerify={onVerifyOtp}
        onResend={onResendOtp}
      />
    )}
  </>
);

export default EmailLoginForm;
