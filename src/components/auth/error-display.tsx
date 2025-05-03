import React from 'react';

/**
 * ErrorDisplay
 * Shows error messages from login attempts.
 */
export interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="text-red-600 text-sm mt-2" role="alert">
    {message}
  </div>
);

export default ErrorDisplay;
