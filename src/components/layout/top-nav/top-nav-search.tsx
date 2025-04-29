import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';

export function TopNavSearch() {
  const { t } = useLanguage();
  return (
    <div className="flex max-w-md flex-1 items-center gap-4 md:ml-0">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder={t('action.search') + '...'}
          className="w-full bg-gray-50 pl-8 pr-4 focus-visible:ring-earth-medium-green"
        />
      </div>
    </div>
  );
}
