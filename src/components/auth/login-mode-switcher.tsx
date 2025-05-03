import React from 'react';

/**
 * LoginModeSwitcher
 * Switches between email and TaniId login modes.
 * Strictly typed, accessible, and documented.
 */
export interface LoginModeSwitcherProps {
  mode: string;
  onModeChange: (mode: 'email' | 'taniId') => void;
}

export const LoginModeSwitcher: React.FC<LoginModeSwitcherProps> = ({ mode, onModeChange }) => (
  <div
    className="mb-4 flex justify-center gap-2"
    role="radiogroup"
    aria-label="Login mode selector"
  >
    <button
      type="button"
      className={`rounded px-4 py-2 ${mode === 'email' ? 'bg-primary text-white' : 'bg-muted'}`}
      aria-checked={mode === 'email'}
      onClick={() => onModeChange('email')}
    >
      Email Login
    </button>
    <button
      type="button"
      className={`rounded px-4 py-2 ${mode === 'taniId' ? 'bg-primary text-white' : 'bg-muted'}`}
      aria-checked={mode === 'taniId'}
      onClick={() => onModeChange('taniId')}
    >
      TaniId Login
    </button>
  </div>
);

export default LoginModeSwitcher;
