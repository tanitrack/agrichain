import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/language-context';

export function TopNavSettingsButton() {
  const { t } = useLanguage();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="hidden h-8 w-8 md:flex">
            <Settings className="h-4 w-4 text-earth-medium-green" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('language') === 'id' ? 'Pengaturan' : 'Settings'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
