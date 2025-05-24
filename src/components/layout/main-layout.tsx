import { ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav/top-nav';
import { cn } from '@/lib/utils';
import { Footer } from './footer';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 768 : false
  );

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
        <Footer />
      </div>
    </div>
  );
}
