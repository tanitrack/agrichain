import { TopNavHelpButton } from '@/components/layout/top-nav/top-nav-help-button';
import { TopNavMenuButton } from './top-nav-menu-button';
import { TopNavSearch } from './top-nav-search';
import { TopNavUserMenu } from './top-nav-user-menu';
import { DynamicWidgetButton } from '@/components/layout/top-nav/dynamic-widget-button';
import { TopNavSettingsButton } from '@/components/layout/top-nav/top-nav-settings-button';
import { TopNavNotifications } from '@/components/layout/top-nav/top-nav-notifications';
import { TopNavBlockchainStatus } from '@/components/layout/top-nav/top-nav-blockchain-status';

interface TopNavProps {
  onMenuButtonClick: () => void;
}

export function TopNav({ onMenuButtonClick }: TopNavProps) {
  return (
    <header className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <TopNavMenuButton onClick={onMenuButtonClick} />
        <TopNavSearch />
        <TopNavBlockchainStatus />
        <TopNavHelpButton />
        <TopNavSettingsButton />
        <TopNavNotifications />
        <DynamicWidgetButton />
        <TopNavUserMenu />
      </div>
    </header>
  );
}
