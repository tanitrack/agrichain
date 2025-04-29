import { ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav/top-nav';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/common/language-switcher';
import { useLanguage } from '@/contexts/language-context';
import { Leaf } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen bg-earth-pale-green/50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div
        className={cn(
          'relative flex flex-1 flex-col transition-all duration-300',
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        )}
      >
        <TopNav onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden px-3 pb-16 pt-20 sm:px-4 md:px-5 lg:px-6">
          <div className="mx-auto w-full max-w-7xl space-y-5 md:space-y-6">{children}</div>
        </main>
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
      </div>
    </div>
  );
}
