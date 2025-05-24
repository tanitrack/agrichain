import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  TrendingUp,
  User,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Wheat,
  Sprout,
  Store,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { useAuthCheck } from '@/hooks/use-auth-check';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Links for farmers (default role)
const farmerLinks = [
  { name: 'dashboard', href: '/dashboard', icon: Home },
  { name: 'commodities', href: '/komoditas', icon: Wheat },
  { name: 'balance', href: '/saldo', icon: Wallet },
  { name: 'orderBook', href: '/order-book', icon: ClipboardList },
  { name: 'price', href: '/harga', icon: TrendingUp },
];

// New links specifically for buyers
const buyerLinks = [
  { name: 'dashboard', href: '/dashboard', icon: Home },
  { name: 'market', href: '/market', icon: Store },
  { name: 'orderBook', href: '/order-book', icon: ClipboardList },
  { name: 'balance', href: '/saldo', icon: Wallet },
  { name: 'price', href: '/harga', icon: TrendingUp },
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation();
  // Set initial state, checking if window is defined for SSR compatibility
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const { t } = useLanguage();
  const { userProfile } = useAuthCheck();

  // Determine which links to show based on user role
  const links = userProfile?.userType === 'farmer' ? farmerLinks : buyerLinks;

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setOpen]); // setOpen is a dependency

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r border-[#588157]/20 bg-gradient-to-b from-[#3a5a40]/95 to-[#3a5a40] transition-all duration-300',
          open ? 'w-64' : 'w-20',
          isMobile && !open && '-translate-x-full',
          isMobile && open && 'w-64 translate-x-0'
        )}
      >
        <div className="flex items-center justify-between border-b border-[#588157]/20 px-4 py-3">
          {open && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-white/90">
                <img
                  src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png"
                  alt="TaniTrack Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-lg font-bold text-white">TaniTrack</h1>
            </Link>
          )}
          {!open && !isMobile && (
            <div className="mx-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-md">
              <img
                src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png"
                alt="TaniTrack Logo"
                className=" w-full rounded-md object-cover"
              />
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-4 h-6 w-6 rounded-full border bg-white hover:bg-[#588157] hover:text-white"
              onClick={() => setOpen(!open)}
            >
              {open ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {links.map((link) => {
              const isActive =
                location.pathname === link.href ||
                (link.href === '/dashboard' && location.pathname === '/');

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'sidebar-link',
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#588157]/30 text-white'
                      : 'text-[#a3b18a] hover:bg-[#588157]/10 hover:text-white'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {open && <span>{t(`nav.${link.name}`)}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-[#588157]/20 p-4">
          {open ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-2 text-white hover:bg-[#588157]/20"
                >
                  <Avatar className="h-8 w-8 border border-[#588157]/30">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="bg-[#588157]/30 text-white">PT</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="text-wrap text-start font-medium">{userProfile?.name}</span>
                    <span className="text-xs text-[#a3b18a]">
                      {userProfile?.userType === 'farmer' ? t('nav.farmer') : t('nav.buyer')}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-[#588157]/20">
                <DropdownMenuItem>
                  <Link to="/profile" className="flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex w-full items-center">
                    <Sprout className="mr-2 h-4 w-4" />
                    <span>{t('nav.settings')}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/login" className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mx-auto flex items-center justify-center rounded-full hover:bg-[#588157]/20"
                >
                  <Avatar className="h-8 w-8 border border-[#588157]/30">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="bg-[#588157]/30 text-white">PT</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-[#588157]/20">
                <DropdownMenuItem>
                  <Link to="/profile" className="flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex w-full items-center">
                    <Sprout className="mr-2 h-4 w-4" />
                    <span>{t('nav.settings')}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/login" className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>
    </>
  );
}
