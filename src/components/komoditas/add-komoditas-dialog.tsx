import { useCallback, useState } from 'react'; // Added useEffect
import { DollarSign, Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Keep Input import
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
import { useMutation, useAction, useQuery } from 'convex/react'; // Added useQuery
import { api } from '@/lib/convex';
import { Id } from 'convex/_generated/dataModel'; // Import Id type
import { BulkPrice } from '@/lib/data/types';
import { formatPriceInput, parsePriceInput } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { DatePicker } from '../ui/datepicker';
import { useDropzone } from 'react-dropzone'; // Import useDropzone
// Import useDynamicContext
// Import isSolanaWallet

// Mock data for units and categories
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

  // State for image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<'_storage'> | null>(null);

  const generateUploadUrl = useAction(api.upload_mutations.generateUploadUrl); // Use the Convex action
  const saveImageMutation = useMutation(api.upload_mutations.saveKomoditasImage); // Use the Convex mutation
  const uploadedImageUrl = useQuery(
    api.upload_mutations.getImageUrl,
    uploadedStorageId ? { storageId: uploadedStorageId } : 'skip'
  ); // Use the Convex query

  // Bulk pricing state
  const [bulkPrices, setBulkPrices] = useState<BulkPrice[]>([]);
  const [newBulkPrice, setNewBulkPrice] = useState({
    commodityId: '',
    minQuantity: '',
    price: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    grade: '',
    // pricePerUnit: '',
    stock: '',
    basePrice: '',
    harvestDate: undefined as Date | undefined,
  });

  // Format display for price inputs
  const [displayPrice, setDisplayPrice] = useState('');
  const [displayBulkPrice, setDisplayBulkPrice] = useState('');
  const [bulkPricingSheetOpen, setBulkPricingSheetOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    if (field === 'basePrice') {
      // Format the input as currency
      // Ensure value is treated as string for formatting/parsing
      const formattedValue = formatPriceInput(value as string);
      setDisplayPrice(formattedValue);

      // Store raw value in formData
      const numericValue = parsePriceInput(value as string);
      setFormData((prev) => ({ ...prev, [field]: numericValue.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setUploading(true);

        try {
          // 1. Get upload URL from Convex
          const uploadUrl = await generateUploadUrl();

          // 2. Upload the file to the URL
          const result = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file,
          });

          if (!result.ok) {
            throw new Error(`Upload failed: ${result.statusText}`);
          }

          const { storageId } = await result.json();

          // 3. Save the storage ID to the database (this will be done after Komoditas creation)
          // We'll store the storageId in a state variable for now
          setUploadedStorageId(storageId); // Use setUploadedStorageId

          toast({
            title: t('commodities.uploadSuccessTitle'),
            description: t('commodities.uploadSuccessDesc'),
          });
        } catch (error) {
          console.error('Upload failed:', error);
          toast({
            title: t('commodities.error'),
            description: error instanceof Error ? error.message : t('commodities.uploadFailed'),
            variant: 'destructive',
          });
          setSelectedFile(null); // Clear selected file on error
          setUploadedStorageId(null); // Clear uploaded storage ID on error
        } finally {
          setUploading(false);
        }
      }
    },
    [generateUploadUrl, toast, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  }); // Accept only images

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
        // ...(formData.pricePerUnit && { pricePerUnit: parseFloat(formData.pricePerUnit) }),
        ...(formData.basePrice && { pricePerUnit: parseFloat(formData.basePrice) }), // Use basePrice for pricePerUnit
        ...(formData.stock && { stock: parseFloat(formData.stock) }),
        ...(uploadedStorageId && { imageUrl: uploadedStorageId }), // Use uploadedStorageId
        ...(formData.harvestDate && { harvestDate: formData.harvestDate.toDateString() }),
        ...(formData.grade && { grade: formData.grade }),
      };

      // ACTIVATE THIS AFTER 🔥🔥🔥🔥
      await createKomoditasMutation(komoditasData).then(async (createdKomoditasId) => {
        // Added async here
        // ADD BULK
        for (const value of bulkPrices) {
          // Changed to for...of for async
          const komoditasBulkData = {
            commodityId: createdKomoditasId,
            ...(value.minQuantity && { minQuantity: value.minQuantity.toString() }),
            ...(value.price && { price: value.price }), // Use basePrice for pricePerUnit
          };

          await createKomoditasBulkMutation(komoditasBulkData);
        }
        // Call saveImage mutation after Komoditas is created and we have the ID
        if (uploadedStorageId) {
          await saveImageMutation({
            storageId: uploadedStorageId,
            komoditasId: createdKomoditasId,
          }); // Pass uploadedStorageId
        }
      }); // Use the mutation

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
        // pricePerUnit: '',
        grade: '',
        stock: '',
        // imageUrl: '', // Removed imageUrl from reset
        basePrice: '',
        harvestDate: undefined,
      });
      setDisplayPrice(''); // Reset display price
      setSelectedFile(null); // Reset selected file
      setUploadedStorageId(null); // Reset uploaded storage ID
      setBulkPrices([]); // Reset bulk prices

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
        id: `bp-${Date.now()}`,
        minQuantity: Number(newBulkPrice.minQuantity),
        price: Number(newBulkPrice.price),
      };

      setBulkPrices((prev) =>
        [...prev.sort((a, b) => a.minQuantity - b.minQuantity), newPrice].sort(
          (a, b) => a.minQuantity - b.minQuantity
        )
      );

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
    setBulkPrices((prev) => prev.filter((price) => price.id !== id));
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
                  onValueChange={(value) => handleInputChange('category', value)}
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
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-earth-dark-green">
                  {t('commodities.imageUrl')}
                </Label>
                {uploadedImageUrl ? ( // Show preview if URL is available
                  <div className="space-y-2">
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded preview"
                      className="h-32 w-auto rounded-md object-cover"
                    />
                    <p className="break-all text-sm text-earth-dark-green">{uploadedImageUrl}</p>{' '}
                    {/* Display URL */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadedStorageId(null);
                      }}
                      className="border-earth-light-green text-earth-dark-green hover:bg-earth-light-green/20"
                    >
                      {t('action.remove')}
                    </Button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                      isDragActive
                        ? 'border-earth-dark-green bg-earth-light-green/20'
                        : 'border-earth-medium-green hover:border-earth-dark-green'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {uploading ? (
                      <p>{t('commodities.uploading')}</p>
                    ) : selectedFile ? (
                      <p>
                        {t('commodities.selectedFile')}: {selectedFile.name}
                      </p>
                    ) : isDragActive ? (
                      <p>{t('commodities.dropHere')}</p>
                    ) : (
                      <p>{t('commodities.dragDropOrClick')}</p>
                    )}
                  </div>
                )}
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
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  className="border-earth-medium-green focus:border-earth-dark-green"
                />
              </div>
              <DatePicker
                label={t('commodities.harvestDate')}
                date={formData.harvestDate}
                onDateChange={(date) => handleInputChange('harvestDate', date)}
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
                onChange={(e) => handleInputChange('description', e.target.value)}
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
                    onChange={(e) => handleInputChange('basePrice', e.target.value)}
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
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  className="border-earth-medium-green focus:border-earth-dark-green"
                />
              </div>
            </div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-earth-medium-green hover:bg-earth-light-green/20 hover:text-earth-dark-green"
                    onClick={handleOpenBulkPricing}
                  >
                    <Pencil className="h-5 w-5" />
                    {t('action.edit')}
                  </Button>
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

      <Sheet open={bulkPricingSheetOpen} onOpenChange={setBulkPricingSheetOpen}>
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
                          Rp {Number(formData.basePrice).toLocaleString()}/
                          {formData.unit || t('commodities.unit')}
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
                              {formData.unit || t('commodities.unit')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bulkPrice" className="text-sm text-earth-medium-green">
                          {t('commodities.bulkPricePerUnit')}{' '}
                          {formData.unit || t('commodities.unit')}
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
                                {t('commodities.bulkPricePerUnit')}{' '}
                                {formData.unit || t('commodities.unit')}
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
                                  {price.minQuantity.toLocaleString()}{' '}
                                  {formData.unit || t('commodities.unit')}
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
    </div>
  );
};
