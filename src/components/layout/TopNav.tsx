import { Bell, Search, HelpCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { DynamicWidgetButton } from '@/components/layout/DynamicWidgetButton';

interface TopNavProps {
  onMenuButtonClick: () => void;
}

export function TopNav({ onMenuButtonClick }: TopNavProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <Button variant="ghost" size="icon" onClick={onMenuButtonClick} className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="flex max-w-md flex-1 items-center gap-4 md:ml-0">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t('action.search') + '...'}
              className="focus-visible:ring-earth-medium-green w-full bg-gray-50 pl-8 pr-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-2">
          {/* Blockchain Verification Status */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-earth-light-green/20 text-earth-dark-green hidden items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 sm:flex">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                  <span className="text-xs font-medium">
                    {t('language') === 'id' ? 'Blockchain Aktif' : 'Blockchain Active'}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t('language') === 'id'
                    ? 'Semua transaksi dilacak dengan blockchain untuk transparansi'
                    : 'All transactions are tracked with blockchain for transparency'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Help Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="text-earth-medium-green h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('language') === 'id' ? 'Bantuan' : 'Help'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Settings Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden h-8 w-8 md:flex">
                  <Settings className="text-earth-medium-green h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('language') === 'id' ? 'Pengaturan' : 'Settings'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="text-earth-medium-green h-4 w-4" />
                <Badge className="bg-earth-medium-green absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] md:w-80">
              <DropdownMenuLabel>{t('nav.notifications')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {t('language') === 'id' ? 'Pesanan Baru Diterima' : 'New Order Received'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('language') === 'id'
                      ? 'PT Agrimax memesan 500kg beras.'
                      : 'PT Agrimax ordered 500kg of rice.'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t('language') === 'id' ? '2 menit yang lalu' : '2 minutes ago'}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {t('language') === 'id' ? 'Pembayaran Diterima' : 'Payment Received'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('language') === 'id'
                      ? 'Pembayaran sebesar Rp. 5.000.000 telah masuk.'
                      : 'Payment of Rp. 5,000,000 has been received.'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t('language') === 'id' ? '1 jam yang lalu' : '1 hour ago'}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {t('language') === 'id'
                      ? 'Transaksi Blockchain Berhasil'
                      : 'Blockchain Transaction Successful'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('language') === 'id'
                      ? 'Transaksi beras telah terverifikasi di blockchain.'
                      : 'Rice transaction has been verified on the blockchain.'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t('language') === 'id' ? '1 hari yang lalu' : '1 day ago'}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                <span className="text-earth-dark-green text-sm font-medium">
                  {t('language') === 'id' ? 'Lihat Semua Notifikasi' : 'View All Notifications'}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DynamicWidgetButton />
        </div>
      </div>
    </header>
  );
}
