import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';

// Mock data for units and categories
const units = ['kg', 'ton', 'gram', 'liter'];
const categories = ['Padi', 'Jagung', 'Kedelai', 'Gula', 'Kopi', 'Cabai', 'Bawang'];

interface AddKomoditasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (komoditasName: string) => void;
}

export const AddKomoditasDialog = ({ open, onOpenChange, onSuccess }: AddKomoditasDialogProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const create = useMutation(api.komoditas_mutations.create);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    pricePerUnit: '',
    stock: '',
    imageUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddKomoditas = async () => {
    try {
      setIsSubmitting(true);

      if (!formData.name) {
        toast({
          title: 'Error',
          description: 'Name is required',
          variant: 'destructive',
        });
        return;
      }

      // Convert numeric strings to numbers where needed
      const komoditasData = {
        name: formData.name,
        ...(formData.description && { description: formData.description }),
        ...(formData.category && { category: formData.category }),
        ...(formData.unit && { unit: formData.unit }),
        ...(formData.pricePerUnit && { pricePerUnit: parseFloat(formData.pricePerUnit) }),
        ...(formData.stock && { stock: parseFloat(formData.stock) }),
        ...(formData.imageUrl && { imageUrl: formData.imageUrl }),
      };

      await create(komoditasData);

      toast({
        title: 'Komoditas berhasil ditambahkan',
        description: `${formData.name} telah ditambahkan ke daftar komoditas Anda`,
      });

      onSuccess(formData.name);

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        unit: '',
        pricePerUnit: '',
        stock: '',
        imageUrl: '',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add komoditas',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-earth-dark-green hover:bg-earth-medium-green">
          <Plus className="h-4 w-4" />
          {t('commodities.add')}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-earth-light-green sm:max-w-[625px]">
        <DialogHeader className="earth-header-moss">
          <DialogTitle>{t('commodities.add')}</DialogTitle>
          <DialogDescription className="text-white">
            Isi formulir di bawah ini untuk menambahkan komoditas baru ke daftar Anda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-earth-dark-green">
                {t('commodities.name')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Masukkan nama komoditas"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border-earth-medium-green focus:border-earth-dark-green"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-earth-dark-green">
                {t('commodities.unit')}
              </Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectTrigger className="border-earth-medium-green">
                  <SelectValue placeholder="Pilih satuan" />
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
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className="border-earth-medium-green">
                  <SelectValue placeholder="Pilih kategori" />
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
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-earth-dark-green">
                {t('commodities.imageUrl')}
              </Label>
              <Input
                id="imageUrl"
                placeholder="URL gambar komoditas"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="border-earth-medium-green focus:border-earth-dark-green"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-earth-dark-green">
                {t('commodities.stock')}
              </Label>
              <Input
                id="stock"
                type="number"
                placeholder="Masukkan stok"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="border-earth-medium-green focus:border-earth-dark-green"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerUnit" className="text-earth-dark-green">
                {t('commodities.pricePerUnit')}
              </Label>
              <Input
                id="pricePerUnit"
                type="number"
                placeholder="Masukkan harga per unit"
                value={formData.pricePerUnit}
                onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                className="border-earth-medium-green focus:border-earth-dark-green"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-earth-dark-green">
              {t('commodities.description')}
            </Label>
            <Input
              id="description"
              placeholder="Deskripsi komoditas"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="border-earth-medium-green focus:border-earth-dark-green"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-earth-light-green text-earth-dark-green hover:bg-earth-light-green/20"
            disabled={isSubmitting}
          >
            {t('action.cancel')}
          </Button>
          <Button
            onClick={handleAddKomoditas}
            className="bg-earth-dark-green hover:bg-earth-medium-green"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : t('action.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
