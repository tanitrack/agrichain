import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/language-context';

export function TopNavNotifications() {
  const { t } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4 text-earth-medium-green" />
          <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-earth-medium-green p-0">
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
          <span className="text-sm font-medium text-earth-dark-green">
            {t('language') === 'id' ? 'Lihat Semua Notifikasi' : 'View All Notifications'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
