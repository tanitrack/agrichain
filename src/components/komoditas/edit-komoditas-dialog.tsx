import { useState } from 'react';
import { Tag } from 'lucide-react';
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
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Id } from 'convex/_generated/dataModel';
import { KomoditasForm } from './komoditas-form';
import { KomoditasImageUploadInput } from './komoditas-image-upload-input';

interface EditKomoditasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  komoditasId: Id<'komoditas'>;
  onSuccess: (komoditasName: string) => void;
}

export const EditKomoditasDialog = ({
  open,
  onOpenChange,
  komoditasId,
  onSuccess,
}: EditKomoditasDialogProps) => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const updateKomoditasMutation = useMutation(api.komoditas_mutations.update);
  const saveImageMutation = useMutation(api.upload_mutations.saveKomoditasImage); // Keep for new image upload

  const komoditas = useQuery(api.komoditas_queries.get, {
    id: komoditasId,
  });

  // State for image upload
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<'_storage'> | null>(
    komoditas?.imageStorageId ? komoditas.imageStorageId : null
  );
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(
    komoditas?.imageUrl || null
  );

  // Form state
  const [formData, setFormData] = useState(() => ({
    name: komoditas?.name || '',
    description: komoditas?.description || '',
    category: komoditas?.category || '',
    unit: komoditas?.unit || '',
    grade: komoditas?.grade || '',
    stock: komoditas?.stock?.toString() || '',
    basePrice: komoditas?.pricePerUnit?.toString() || '',
    harvestDate: komoditas?.harvestDate ? new Date(komoditas.harvestDate) : undefined,
  }));

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

  const handleEditKomoditas = async () => {
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
        id: komoditasId,
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category || undefined,
        unit: formData.unit || undefined,
        pricePerUnit: formData.basePrice ? parseFloat(formData.basePrice) : undefined,
        stock: formData.stock ? parseFloat(formData.stock) : undefined,
        imageUrl: uploadedStorageId || undefined, // Use uploadedStorageId for update
        harvestDate: formData.harvestDate ? formData.harvestDate.toDateString() : undefined,
        grade: formData.grade || undefined,
      };

      await updateKomoditasMutation(komoditasData);

      // Call saveImage mutation if a new image was uploaded
      if (uploadedStorageId && uploadedStorageId !== initialImageUrl) {
        await saveImageMutation({
          storageId: uploadedStorageId,
          komoditasId: komoditasId,
        });
      }

      toast({
        title: t('commodities.editSuccessTitle'),
        description: `${t('commodities.editSuccessDesc')} ${formData.name}`,
      });

      onSuccess(formData.name);

      // Reset state
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
      setInitialImageUrl(null);

      onSuccess(formData.name);
    } catch (error) {
      console.error('Failed to edit komoditas:', error);
      toast({
        title: t('commodities.error'),
        description: error instanceof Error ? error.message : t('commodities.editFailed'),
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
            <Tag className="h-4 w-4" />
            {t('commodities.edit')}
          </Button>
        </DialogTrigger>
        <DialogContent className="border-earth-light-green sm:max-w-[625px]">
          <DialogHeader className="earth-header-moss">
            <DialogTitle>{t('commodities.edit')}</DialogTitle>
            <DialogDescription className="text-white">
              {t('commodities.editDesc')}
            </DialogDescription>
          </DialogHeader>
          {/* Main Form Component */}
          {komoditas && ( // Only render form if komoditas data is loaded
            <KomoditasForm
              formData={formData}
              onInputChange={handleInputChange}
              language={language as 'id' | 'en'}
            />
          )}

          {/* Image Upload Component */}
          <div className="px-6 py-0">
            {' '}
            {/* Adjust padding as needed */}
            <KomoditasImageUploadInput
              onUploadSuccess={handleUploadSuccess}
              onRemove={handleImageRemove}
              uploadedStorageId={uploadedStorageId}
              initialImageUrl={initialImageUrl} // Pass initial image URL
            />
          </div>

          <DialogFooter>
            {/* <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-earth-light-green text-earth-dark-green hover:bg-earth-light-green/20"
              disabled={isSubmitting}
            >
              {t('action.cancel')}
            </Button> */}
            <Button
              onClick={handleEditKomoditas}
              className="bg-earth-dark-green hover:bg-earth-medium-green"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('action.saving') : t('action.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
