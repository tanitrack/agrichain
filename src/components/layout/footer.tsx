import LanguageSwitcher from '@/components/common/language-switcher';
import { Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full border-t bg-white px-3 py-3 text-center text-sm text-earth-dark-green shadow-sm sm:px-4 md:px-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 md:flex-row md:gap-3">
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-earth-medium-green" />
          <p className="text-xs md:text-sm">
            © 2025 TaniTrack -{' '}
            {t('app.name') === 'TaniTrack'
              ? 'Blockchain-powered Agriculture Management System.'
              : 'Sistem Manajemen Pertanian berbasis Blockchain.'}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="rounded-full bg-earth-light-green/20 px-2 py-1 text-xs text-earth-dark-green">
            {t('app.name') === 'TaniTrack' ? 'Powered by Solana' : 'Didukung oleh Solana'}
          </span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
