import React from 'react';

interface TransactionHistoryItemProps {
  title: string;
  txHash?: string | null;
  status?: string | null;
  isLast: boolean; // Add isLast prop
  // Add timestamp prop if needed later
  // timestamp?: string | null;
}

export const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({
  title,
  txHash,
  status,
  isLast, // Destructure isLast prop
  // timestamp,
}) => {
  if (!txHash) {
    return null; // Don't render if there's no txHash
  }

  return (
    <div className="flex">
      <div className="mr-4 flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-earth-dark-green"></div>
        {!isLast && <div className="mt-1 h-full w-0.5 bg-earth-light-green"></div>}{' '}
        {/* Conditionally render line */}
      </div>
      <div className="pb-4">
        <div className="flex flex-col">
          <p className="font-medium text-earth-dark-green">{title}</p>
          {txHash && (
            <p className="text-sm text-earth-medium-green">
              Tx Hash:{' '}
              <a
                href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {txHash}
              </a>
            </p>
          )}
          {status && <p className="text-sm text-earth-medium-green">Status: {status}</p>}
          {/* Add timestamp if available */}
          {/* {timestamp && (
            <p className="text-sm text-earth-medium-green">
              Timestamp: {timestamp}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};
