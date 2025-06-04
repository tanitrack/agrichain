import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '../ui/datepicker';
import { useLanguage } from '@/contexts/language-context';
import { formatPriceInput, parsePriceInput } from '@/lib/utils';
import { useState } from 'react';

// Mock data for units and categories - These should probably be fetched or passed as props in a real app
const units = ['kg', 'ton', 'gram', 'liter'];
const categories = [
  'Sayuran',
  'Buah-buahan',
  'Daging',
  'Ikan',
  'Telur',
  'Susu',
  'Rempah-rempah',
  'Biji-bijian',
  'Kacang-kacangan',
  'Umbi-umbian',
  'Pupuk',
  'Pakan Ternak',
];

interface KomoditasFormProps {
  formData: {
    name: string;
    description: string;
    category: string;
    unit: string;
    grade: string;
    stock: string;
    basePrice: string;
    harvestDate: Date | undefined;
  };
  onInputChange: (field: string, value: string | Date | undefined) => void;
  language: 'id' | 'en'; // Pass language from parent
}

export const KomoditasForm = ({ formData, onInputChange, language }: KomoditasFormProps) => {
  const { t } = useLanguage(); // Use t from context
  const [displayPrice, setDisplayPrice] = useState(''); // Local state for formatted price input

  // Sync displayPrice with formData.basePrice when formData changes externally
  // This is important if the parent component resets formData
  // useEffect(() => {
  //   setDisplayPrice(formatPriceInput(formData.basePrice));
  // }, [formData.basePrice]);

  const handlePriceInputChange = (value: string) => {
    // Format the input as currency
    const formattedValue = formatPriceInput(value);
    setDisplayPrice(formattedValue);

    // Store raw value in formData
    const numericValue = parsePriceInput(value);
    onInputChange('basePrice', numericValue.toString());
  };

  return (
    <div className="grid gap-4 p-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-earth-dark-green">
            {t('commodities.name')}
          </Label>
          <Input
            id="name"
            placeholder={t('commodities.namePlaceholder')}
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="border-earth-medium-green focus:border-earth-dark-green"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit" className="text-earth-dark-green">
            {t('commodities.unit')}
          </Label>
          <Select value={formData.unit} onValueChange={(value) => onInputChange('unit', value)}>
            <SelectTrigger className="border-earth-medium-green">
              <SelectValue placeholder={t('commodities.unitPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-earth-dark-green">
            {t('commodities.category')}
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onInputChange('category', value)}
          >
            <SelectTrigger className="border-earth-medium-green">
              <SelectValue placeholder={t('commodities.categoryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Image Upload Section Placeholder - This will be a separate component */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="text-earth-dark-green">
            {t('commodities.imageUrl')}
          </Label>
          <div className="flex h-10 items-center rounded-md border border-earth-medium-green px-3 text-sm text-earth-medium-green">
            Image Upload Component Placeholder
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade" className="text-earth-dark-green">
            {t('commodities.grade')}
          </Label>
          <Input
            id="grade"
            placeholder={t('commodities.gradePlaceholder')}
            value={formData.grade}
            onChange={(e) => onInputChange('grade', e.target.value)}
            className="border-earth-medium-green focus:border-earth-dark-green"
          />
        </div>
        <DatePicker
          label={t('commodities.harvestDate')}
          date={formData.harvestDate}
          onDateChange={(date) => onInputChange('harvestDate', date)}
          placeholder={t('commodities.harvestDatePlaceholder')}
          locale={language}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-earth-dark-green">
          {t('commodities.description')}
        </Label>
        <Input
          id="description"
          placeholder={t('commodities.descriptionPlaceholder')}
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="border-earth-medium-green focus:border-earth-dark-green"
        />
      </div>

      {/* Price input section - updated with formatting */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="basePrice" className="text-earth-dark-green">
            {t('commodities.basePrice')}
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-sm text-earth-medium-green">Rp</span>
            </div>
            <Input
              id="basePrice"
              type="text"
              placeholder="0"
              value={displayPrice}
              onChange={(e) => handlePriceInputChange(e.target.value)}
              className="border-earth-medium-green pl-10 focus:border-earth-dark-green"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-earth-medium-green">
                /{formData.unit || t('commodities.unit')}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className="text-earth-dark-green">
            {t('commodities.stock')}
          </Label>
          <Input
            id="stock"
            type="number"
            placeholder={t('commodities.stockPlaceholder')}
            value={formData.stock}
            onChange={(e) => onInputChange('stock', e.target.value)}
            className="border-earth-medium-green focus:border-earth-dark-green"
          />
        </div>
      </div>
    </div>
  );
};
