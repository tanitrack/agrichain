import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { Id } from 'convex/_generated/dataModel';
import { BulkPrice } from '@/lib/data/types'; // Keep BulkPrice type for state
import { KomoditasForm } from './komoditas-form';
import { KomoditasImageUploadInput } from './komoditas-image-upload-input';
import { BulkPricingSheet } from './bulk-pricing-sheet';

interface AddKomoditasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (komoditasName: string) => void;
}

export const AddKomoditasDialog = ({ open, onOpenChange, onSuccess }: AddKomoditasDialogProps) => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const createKomoditasMutation = useMutation(api.komoditas_mutations.create);
  const createKomoditasBulkMutation = useMutation(api.komoditas_bulk_mutations.create);
  const saveImageMutation = useMutation(api.upload_mutations.saveKomoditasImage);

  // State for image upload
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<'_storage'> | null>(null);

  // Bulk pricing state
  const [bulkPrices, setBulkPrices] = useState<BulkPrice[]>([]);
  const [bulkPricingSheetOpen, setBulkPricingSheetOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    grade: '',
    stock: '',
    basePrice: '',
    harvestDate: undefined as Date | undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadSuccess = (storageId: Id<'_storage'>) => {
    setUploadedStorageId(storageId);
  };

  const handleImageRemove = () => {
    setUploadedStorageId(null);
  };

  const handleBulkPricesChange = (updatedBulkPrices: BulkPrice[]) => {
    setBulkPrices(updatedBulkPrices);
  };

  const handleOpenBulkPricing = () => {
    if (!formData.basePrice || !formData.unit) {
      toast({
        title: t('commodities.attention'),
        description: t('commodities.fillBasePriceAndUnit'),
      });
      return;
    }
    setBulkPricingSheetOpen(true);
  };

  const handleAddKomoditas = async () => {
    try {
      setIsSubmitting(true);

      if (!formData.name) {
        toast({
          title: t('commodities.error'),
          description: t('commodities.nameRequired'),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Convert numeric strings to numbers where needed
      const komoditasData = {
        name: formData.name,
        ...(formData.description && { description: formData.description }),
        ...(formData.category && { category: formData.category }),
        ...(formData.unit && { unit: formData.unit }),
        ...(formData.basePrice && { pricePerUnit: parseFloat(formData.basePrice) }),
        ...(formData.stock && { stock: parseFloat(formData.stock) }),
        ...(uploadedStorageId && { imageUrl: uploadedStorageId }),
        ...(formData.harvestDate && { harvestDate: formData.harvestDate.toDateString() }),
        ...(formData.grade && { grade: formData.grade }),
      };

      const createdKomoditasId = await createKomoditasMutation(komoditasData);

      // Add bulk prices
      for (const value of bulkPrices) {
        const komoditasBulkData = {
          commodityId: createdKomoditasId,
          minQuantity: value.minQuantity.toString(), // Convert to string
          price: value.price,
        };
        await createKomoditasBulkMutation(komoditasBulkData);
      }

      // Call saveImage mutation after Komoditas is created and we have the ID
      if (uploadedStorageId) {
        await saveImageMutation({
          storageId: uploadedStorageId,
          komoditasId: createdKomoditasId,
        });
      }

      toast({
        title: t('commodities.addSuccessTitle'),
        description: `${t('commodities.addSuccessDesc')} ${formData.name}`,
      });

      onSuccess(formData.name);

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        unit: '',
        grade: '',
        stock: '',
        basePrice: '',
        harvestDate: undefined,
      });
      setUploadedStorageId(null);
      setBulkPrices([]);

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add komoditas:', error);
      toast({
        title: t('commodities.error'),
        description: error instanceof Error ? error.message : t('commodities.addFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
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
            <DialogDescription className="text-white">{t('commodities.addDesc')}</DialogDescription>
          </DialogHeader>
          {/* Main Form Component */}
          <KomoditasForm
            formData={formData}
            onInputChange={handleInputChange}
            language={language as 'id' | 'en'} // Cast language to expected type
          />

          {/* Image Upload Component */}
          <div className="px-6 py-0">
            {' '}
            {/* Adjust padding as needed */}
            <KomoditasImageUploadInput
              onUploadSuccess={handleUploadSuccess}
              onRemove={handleImageRemove}
              uploadedStorageId={uploadedStorageId}
            />
          </div>

          {/* Bulk Pricing Button and Summary */}
          <div className="grid gap-4 p-6 py-4 pt-0">
            {' '}
            {/* Adjust padding as needed */}
            <div className="flex items-end space-y-2">
              <Button
                onClick={handleOpenBulkPricing}
                variant="outline"
                className="h-10 w-full gap-2 border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20"
              >
                <Tag className="h-4 w-4" />
                {t('commodities.setBulkPrice')}
              </Button>
            </div>
            {/* Display bulk pricing summary if any */}
            {bulkPrices.length > 0 && (
              <div className="rounded-md border border-earth-light-green bg-earth-pale-green p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-earth-dark-green">Harga Grosir</h4>
                  {/* Edit button - handled in BulkPricingSheet */}
                </div>
                <div className="space-y-1">
                  {bulkPrices.slice(0, 3).map((price) => (
                    <div
                      key={price.id}
                      className="flex justify-between text-xs text-earth-dark-green"
                    >
                      <span>
                        ≥ {price.minQuantity} {formData.unit}
                      </span>
                      <span>
                        Rp {price.price.toLocaleString()}/{formData.unit}
                      </span>
                    </div>
                  ))}
                  {bulkPrices.length > 3 && (
                    <div className="mt-1 text-center text-xs text-earth-medium-green">
                      +{bulkPrices.length - 3} harga grosir lainnya
                    </div>
                  )}
                </div>
              </div>
            )}
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
              {isSubmitting ? t('action.saving') : t('action.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Pricing Sheet Component */}
      <BulkPricingSheet
        open={bulkPricingSheetOpen}
        onOpenChange={setBulkPricingSheetOpen}
        bulkPrices={bulkPrices}
        onBulkPricesChange={handleBulkPricesChange}
        basePrice={formData.basePrice}
        unit={formData.unit}
      />
    </div>
  );
};
