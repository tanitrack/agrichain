import React from 'react';
import { Spinner } from '@/components/ui/spinner';

/**
 * SubmitButton
 * Reusable button with loading spinner.
 */
export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, children, ...props }) => (
  <button {...props} disabled={loading || props.disabled} className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-white disabled:opacity-50">
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);

export default SubmitButton;
