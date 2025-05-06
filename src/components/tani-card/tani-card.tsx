import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { cn } from '@/lib/utils';
import { Leaf } from 'lucide-react';
import { TaniCardDownloadBtn } from './tani-card-download-btn';

interface TaniCardProps {
  name?: string;
  taniId?: number;
  email?: string;
  walletAddress?: string;
  showDownloadBtn?: boolean;
  userType?: 'farmer' | 'consumer';
}

const TaniCard: React.FC<TaniCardProps> = ({
  name = 'Petani Sejahtera',
  taniId = '7777777',
  email = 'petani@tanitrack.id',
  walletAddress = '123456789',
  showDownloadBtn,
  userType,
}) => {
  const site = window.location.origin;

  const isDataAvailable = taniId && email && walletAddress;
  const qrValue = isDataAvailable
    ? `${site}/login?taniId=${taniId}&mode=taniId&email=${email}&walletAddress=${walletAddress}`
    : '';
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative mx-auto flex w-full flex-col items-center justify-center space-y-3 py-6'
      )}
    >
      <div
        ref={cardRef}
        className={cn(
          `relative flex h-[220px] w-[350px] overflow-hidden rounded-2xl bg-gradient-to-br ${userType === 'farmer' ? 'from-[#224c2a] via-[#356d3a] to-[#193c1e]' : 'from-[#d79c08] via-[#e9b934] to-[#d79d08]'} text-white shadow-xl md:h-[250px] md:w-[400px]`,
          'items-stretch'
        )}
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {/* Left: Info */}
        <div className="flex flex-1 flex-col justify-between py-5 pl-6 pr-3">
          {/* Card Header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
                  {userType?.toUpperCase()} ID
                </span>
                <h2 className="-mt-1 text-lg font-bold leading-tight text-white">TANI CARD</h2>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase opacity-80">Tani ID</span>
              <div className="text-base font-bold">{taniId != null ? taniId : 'No Tani ID'}</div>
            </div>
          </div>

          {/* Card Info */}
          <div className="space-y-1">
            <div>
              <span className="text-[10px] font-medium uppercase opacity-80">Nama</span>
              <div className="truncate text-base font-bold">{name || 'No Name'}</div>
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase opacity-80">Email</span>
              <div className="truncate text-xs font-medium">{email || 'No Email'}</div>
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase opacity-80">Wallet</span>
              <div className="max-w-[140px] break-all text-[8px] font-light md:max-w-[180px]">
                {walletAddress || 'No Wallet Address'}
              </div>
            </div>
          </div>
        </div>
        {/* Right: QR code */}
        <div className="flex min-w-[110px] flex-col items-center justify-center px-4 py-5">
          {isDataAvailable ? (
            <QRCodeCanvas
              value={qrValue}
              size={85}
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#193c1e"
              style={{ borderRadius: '8px' }}
            />
          ) : (
            <div className="mt-2 text-xs text-red-500">Incomplete data for QR code</div>
          )}
        </div>
        {/* Background pattern for visual effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white" />
        </div>
      </div>
      {/* Download Button outside the card */}
      {showDownloadBtn && (
        <div className="mb-3 flex w-full max-w-[400px] justify-center">
          <TaniCardDownloadBtn cardRef={cardRef} filename={`tani-card-tani_id_${taniId}.png`} />
        </div>
      )}
    </div>
  );
};

export default TaniCard;
