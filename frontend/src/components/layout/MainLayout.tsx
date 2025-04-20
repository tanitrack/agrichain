import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="bg-earth-pale-green/50 flex min-h-screen">
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
        <footer className="text-earth-dark-green w-full border-t bg-white px-3 py-3 text-center text-sm shadow-sm sm:px-4 md:px-5">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 md:flex-row md:gap-3">
            <div className="flex items-center gap-2">
              <Leaf className="text-earth-medium-green h-4 w-4" />
              <p className="text-xs md:text-sm">
                © 2025 TaniTrack -{' '}
                {t('app.name') === 'TaniTrack'
                  ? 'Blockchain-powered Agriculture Management System.'
                  : 'Sistem Manajemen Pertanian berbasis Blockchain.'}
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="bg-earth-light-green/20 text-earth-dark-green rounded-full px-2 py-1 text-xs">
                {t('app.name') === 'TaniTrack'
                  ? 'Powered by Blockchain'
                  : 'Didukung oleh Blockchain'}
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
