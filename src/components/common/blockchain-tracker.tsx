import { useState } from 'react';
import { BlockchainCard, BlockchainCardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LinkIcon, Check, Clock, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

interface BlockchainTrackerProps {
  itemId: string;
  itemType: string;
  transactionHash?: string;
  verificationDate?: string;
  blockNumber?: number;
  status: 'verified' | 'pending' | 'untracked';
}

export function BlockchainTracker({
  itemId,
  itemType,
  transactionHash = '0x8e23c90e34d6b3f51cb9806dbf147131436590f8661f98f6f9bdaf4c0f8d35b8',
  verificationDate,
  blockNumber = 15784321,
  status = 'verified',
}: BlockchainTrackerProps) {
  const { t } = useLanguage();
  const [showFullHash, setShowFullHash] = useState(false);

  const displayHash = showFullHash
    ? transactionHash
    : `${transactionHash.slice(0, 12)}...${transactionHash.slice(-8)}`;

  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="flex items-center gap-1 border border-green-200 bg-green-100 px-2 py-1 text-green-800">
            <Check className="h-3 w-3" />
            {t('language') === 'id' ? 'Terverifikasi' : 'Verified'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="flex items-center gap-1 border border-amber-200 bg-amber-100 px-2 py-1 text-amber-800">
            <Clock className="h-3 w-3" />
            {t('language') === 'id' ? 'Menunggu' : 'Pending'}
          </Badge>
        );
      case 'untracked':
        return (
          <Badge className="flex items-center gap-1 border border-gray-200 bg-gray-100 px-2 py-1 text-gray-800">
            {t('language') === 'id' ? 'Belum Dilacak' : 'Not Tracked'}
          </Badge>
        );
    }
  };

  return (
    <BlockchainCard>
      <BlockchainCardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5" />
            {t('language') === 'id' ? 'Verifikasi Blockchain' : 'Blockchain Verification'}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </BlockchainCardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="bg-earth-pale-green/50 rounded-lg p-3">
              <p className="text-earth-medium-green text-sm font-medium">
                {t('language') === 'id' ? 'ID Item' : 'Item ID'}
              </p>
              <p className="text-earth-dark-green font-mono">{itemId}</p>
            </div>
            <div className="bg-earth-pale-green/50 rounded-lg p-3">
              <p className="text-earth-medium-green text-sm font-medium">
                {t('language') === 'id' ? 'Tipe Item' : 'Item Type'}
              </p>
              <p className="text-earth-dark-green capitalize">{itemType}</p>
            </div>
          </div>

          {status !== 'untracked' && (
            <>
              <div className="bg-earth-light-green/20 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <p className="text-earth-medium-green text-sm font-medium">
                    {t('language') === 'id' ? 'Hash Transaksi' : 'Transaction Hash'}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-earth-medium-green hover:text-earth-dark-green h-6 text-xs"
                    onClick={() => setShowFullHash(!showFullHash)}
                  >
                    {showFullHash
                      ? t('language') === 'id'
                        ? 'Sembunyikan'
                        : 'Hide'
                      : t('language') === 'id'
                        ? 'Tampilkan'
                        : 'Show'}
                  </Button>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-earth-dark-green truncate font-mono text-sm">{displayHash}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      navigator.clipboard.writeText(transactionHash);
                      // We would normally show a toast here
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="bg-earth-light-green/10 rounded-lg p-3">
                  <p className="text-earth-medium-green text-sm font-medium">
                    {t('language') === 'id' ? 'Nomor Blok' : 'Block Number'}
                  </p>
                  <p className="text-earth-dark-green font-mono">{blockNumber.toLocaleString()}</p>
                </div>
                <div className="bg-earth-light-green/10 rounded-lg p-3">
                  <p className="text-earth-medium-green text-sm font-medium">
                    {t('language') === 'id' ? 'Tanggal Verifikasi' : 'Verification Date'}
                  </p>
                  <p className="text-earth-dark-green">
                    {verificationDate ? formatDate(new Date(verificationDate)) : '-'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <Button variant="tracking" className="w-full gap-2" size="sm">
          <LinkIcon className="h-4 w-4" />
          {status === 'untracked'
            ? t('language') === 'id'
              ? 'Lacak di Blockchain'
              : 'Track on Blockchain'
            : t('language') === 'id'
              ? 'Lihat di Blockchain Explorer'
              : 'View on Blockchain Explorer'}
        </Button>
      </CardContent>
    </BlockchainCard>
  );
}
