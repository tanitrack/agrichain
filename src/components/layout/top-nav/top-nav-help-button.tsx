import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/language-context';

export function TopNavHelpButton() {
  const { t } = useLanguage();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4 text-earth-medium-green" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('language') === 'id' ? 'Bantuan' : 'Help'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
