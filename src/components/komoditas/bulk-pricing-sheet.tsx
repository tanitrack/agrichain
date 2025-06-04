import { useState } from 'react';
import { DollarSign, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/language-context';
import { BulkPrice } from '@/lib/data/types';
import { formatPriceInput, parsePriceInput } from '@/lib/utils';

interface BulkPricingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bulkPrices: BulkPrice[];
  onBulkPricesChange: (bulkPrices: BulkPrice[]) => void;
  basePrice: string;
  unit: string;
}

export const BulkPricingSheet = ({
  open,
  onOpenChange,
  bulkPrices,
  onBulkPricesChange,
  basePrice,
  unit,
}: BulkPricingSheetProps) => {
  const { t } = useLanguage();

  const [newBulkPrice, setNewBulkPrice] = useState({
    commodityId: '', // This will be set in the parent component before saving
    minQuantity: '',
    price: '',
  });

  const [displayBulkPrice, setDisplayBulkPrice] = useState('');

  const handleBulkPriceChange = (field: string, value: string) => {
    if (field === 'price') {
      // Format the input as currency with thousand separators
      const formattedValue = formatPriceInput(value);
      setDisplayBulkPrice(formattedValue);

      // Store raw numeric value
      const numericValue = parsePriceInput(value);
      setNewBulkPrice((prev) => ({ ...prev, [field]: numericValue.toString() }));
    } else {
      setNewBulkPrice((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddBulkPrice = () => {
    if (newBulkPrice.minQuantity && newBulkPrice.price) {
      const newPrice: BulkPrice = {
        id: `bp-${Date.now()}`, // Client-side ID for list management
        minQuantity: Number(newBulkPrice.minQuantity),
        price: Number(newBulkPrice.price),
      };

      // Add new price and sort by minQuantity
      const updatedBulkPrices = [...bulkPrices, newPrice].sort(
        (a, b) => a.minQuantity - b.minQuantity
      );
      onBulkPricesChange(updatedBulkPrices);

      // Reset form
      setNewBulkPrice({
        minQuantity: '',
        price: '',
        commodityId: '',
      });
      setDisplayBulkPrice('');
    }
  };

  const handleRemoveBulkPrice = (id: string) => {
    const updatedBulkPrices = bulkPrices.filter((price) => price.id !== id);
    onBulkPricesChange(updatedBulkPrices);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="border-l border-earth-light-green p-0 sm:max-w-[500px]">
        <div className="flex h-full flex-col">
          <SheetHeader className="earth-header-forest rounded-t-md p-6">
            <SheetTitle className="flex items-center gap-2 text-white">
              <Tag className="h-5 w-5" />
              {t('commodities.setBulkPrice')}
            </SheetTitle>
            <SheetDescription className="text-white/80">
              {t('commodities.addBulkPriceHint')}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-6 px-6 py-4">
                {/* Pricing info */}
                <div className="rounded-md border border-earth-light-green bg-earth-pale-green p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-earth-dark-green" />
                    <h3 className="font-medium text-earth-dark-green">
                      {t('commodities.basePrice')}
                    </h3>
                  </div>
                  <div className="pl-7">
                    <p className="text-sm text-earth-medium-green">
                      {t('commodities.basePrice')}:{' '}
                      <span className="font-medium text-earth-dark-green">
                        Rp {Number(basePrice).toLocaleString()}/{unit || t('commodities.unit')}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-earth-medium-green">
                      {t('commodities.basePriceInfo')}
                    </p>
                  </div>
                </div>

                {/* Add bulk price form */}
                <div className="space-y-4">
                  <h3 className="font-medium text-earth-dark-green">
                    {t('commodities.addBulkPrice')}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="minQuantity" className="text-sm text-earth-medium-green">
                        {t('commodities.minQuantity')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="minQuantity"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder={t('commodities.minQuantityPlaceholder')}
                          value={newBulkPrice.minQuantity}
                          onChange={(e) => {
                            // Only allow numeric input
                            const value = e.target.value.replace(/\D/g, '');
                            handleBulkPriceChange('minQuantity', value);
                          }}
                          className="border-earth-medium-green focus:border-earth-dark-green"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-sm text-earth-medium-green">
                            {unit || t('commodities.unit')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulkPrice" className="text-sm text-earth-medium-green">
                        {t('commodities.bulkPricePerUnit')} {unit || t('commodities.unit')}
                      </Label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-sm text-earth-medium-green">Rp</span>
                        </div>
                        <Input
                          id="bulkPrice"
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={displayBulkPrice}
                          onChange={(e) => handleBulkPriceChange('price', e.target.value)}
                          className="border-earth-medium-green pl-10 focus:border-earth-dark-green"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleAddBulkPrice}
                    className="w-full bg-earth-dark-green hover:bg-earth-medium-green"
                  >
                    {t('commodities.addBulkPrice')}
                  </Button>
                </div>

                {/* Bulk prices list */}
                {bulkPrices.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="font-medium text-earth-dark-green">
                      {t('commodities.bulkPriceList')}
                    </h3>
                    <div className="overflow-hidden rounded-md border border-earth-light-green">
                      <table className="w-full">
                        <thead className="bg-earth-light-green/30">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-earth-dark-green">
                              {t('commodities.minQuantity')}
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-earth-dark-green">
                              {t('commodities.bulkPricePerUnit')} {unit || t('commodities.unit')}
                            </th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-earth-dark-green">
                              {t('action.action')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bulkPrices.map((price) => (
                            <tr key={price.id} className="border-t border-earth-light-green">
                              <td className="px-4 py-2 text-sm text-earth-dark-green">
                                {price.minQuantity.toLocaleString()} {unit || t('commodities.unit')}
                              </td>
                              <td className="px-4 py-2 text-sm text-earth-dark-green">
                                Rp {price.price.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleRemoveBulkPrice(price.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-earth-medium-green">
                      {t('commodities.bulkPriceAuto')}
                    </p>
                  </div>
                ) : (
                  <div className="py-6 text-center text-earth-medium-green">
                    <Tag className="mx-auto mb-2 h-10 w-10 opacity-50" />
                    <p>{t('commodities.noBulkPrice')}</p>
                    <p className="mt-1 text-xs">{t('commodities.addBulkPriceHint')}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <SheetFooter className="mt-auto border-t border-earth-light-green p-4">
            <SheetClose asChild>
              <Button className="bg-earth-dark-green hover:bg-earth-medium-green">
                {t('commodities.saveBulkPrice')}
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
