import React from 'react';
import { Input } from '@/components/ui/input';
import SubmitButton from './submit-button';
import ErrorDisplay from './error-display';
import { OTPInput } from '@/components/common/otp-input';

/**
 * TaniIdLoginForm
 * Handles TaniId input and triggers backend flow (placeholder).
 */
export interface TaniIdLoginFormProps {
  taniId: number;
  onTaniIdChange: (v: string) => void;
  loading: boolean;
  error?: string;
  onSubmit: (e: React.FormEvent) => void;
  showOtpInput: boolean;
  otp: string;
  onOtpChange: (v: string) => void;
  onVerifyOtp: () => void;
  onResendOtp: () => void;
}

const TaniIdLoginForm: React.FC<TaniIdLoginFormProps> = ({
  taniId,
  onTaniIdChange,
  loading,
  error,
  onSubmit,
  showOtpInput,
  otp,
  onOtpChange,
  onVerifyOtp,
  onResendOtp,
}) => (
  <>
    {!showOtpInput && (
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label htmlFor="taniId" className="sr-only">
          Tani Id
        </label>
        <Input
          id="taniId"
          type="text"
          value={taniId}
          onChange={(e) => onTaniIdChange(e.target.value)}
          autoComplete="off"
          required
          placeholder="Tani Id"
          disabled={loading}
        />
        <SubmitButton loading={loading} type="submit">
          Login with TaniId
        </SubmitButton>
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

export default TaniIdLoginForm;
