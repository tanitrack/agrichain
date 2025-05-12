import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

type Props = {
  label?: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  locale?: 'id' | 'en';
};

export function DatePicker({
  label,
  date,
  onDateChange,
  placeholder = 'Pick a date',
  locale = 'id',
}: Props) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-earth-dark-green">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start border-earth-medium-green text-left font-normal focus:border-earth-dark-green',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              locale === 'id' ? (
                format(date, 'd MMMM yyyy', { locale: localeID })
              ) : (
                format(date, 'PPP')
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            disabled={(d) => d < new Date()}
            className="pointer-events-auto p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
