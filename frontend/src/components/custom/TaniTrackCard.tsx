import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard, Leaf } from 'lucide-react';

interface TaniTrackCardProps {
  type: 'farmer' | 'buyer';
  name: string;
  id: string;
  location?: string;
  expiryDate?: string;
  className?: string;
  isStacked?: boolean;
  stackPosition?: 'front' | 'back';
}

export function TaniTrackCard({
  type,
  name,
  id,
  location,
  expiryDate,
  className,
  isStacked = false,
  stackPosition = 'front',
}: TaniTrackCardProps) {
  return (
    <div
      className={cn(
        'relative',
        isStacked &&
          stackPosition === 'back' &&
          'absolute left-0 top-0 z-0 translate-x-6 translate-y-4 rotate-6 transform',
        className
      )}
    >
      <div
        className={cn(
          'relative h-44 w-72 transform overflow-hidden rounded-xl p-5 shadow-lg transition-all duration-300',
          !isStacked && 'hover:scale-105',
          type === 'farmer' ? 'bg-earth-dark-green text-white' : 'bg-yellow-600 text-white'
        )}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card Header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase opacity-80">
              {type === 'farmer' ? 'FARMER ID' : 'BUYER ID'}
            </p>
            <h2 className="mt-1 text-lg font-bold">TANITRACK</h2>
          </div>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              type === 'farmer' ? 'bg-white/20' : 'bg-yellow-500/50'
            )}
          >
            {type === 'farmer' ? (
              <Leaf className="h-5 w-5 text-white" />
            ) : (
              <CreditCard className="h-5 w-5 text-white" />
            )}
          </div>
        </div>

        {/* Card Chip/Stripe (visual element) */}
        <div
          className={cn(
            'mb-3 h-10 w-full rounded-md bg-opacity-20',
            type === 'farmer' ? 'bg-white/10' : 'bg-black/10'
          )}
        ></div>

        {/* Card Info */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase opacity-80">NAMA</p>
            <p className="mt-0.5 text-sm font-bold">{name}</p>
          </div>

          {location && (
            <div className="absolute right-5 top-[107px]">
              <p className="text-xs font-medium uppercase opacity-80">LOKASI</p>
              <p className="mt-0.5 text-sm font-bold">{location}</p>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase opacity-80">ID</p>
              <p className="mt-0.5 text-sm font-bold">{id}</p>
            </div>

            {expiryDate && (
              <div>
                <p className="text-xs font-medium uppercase opacity-80">AKTIF HINGGA</p>
                <p className="mt-0.5 text-sm font-bold">{expiryDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Background pattern for visual effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
