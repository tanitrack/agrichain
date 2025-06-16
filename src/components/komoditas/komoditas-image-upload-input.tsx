import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAction, useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Id } from 'convex/_generated/dataModel';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface KomoditasImageUploadInputProps {
  onUploadSuccess: (storageId: Id<'_storage'>) => void;
  onRemove: () => void;
  uploadedStorageId: Id<'_storage'> | null;
  initialImageUrl?: string | null; // Add initialImageUrl prop
}

export const KomoditasImageUploadInput = ({
  onUploadSuccess,
  onRemove,
  uploadedStorageId,
}: KomoditasImageUploadInputProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const generateUploadUrl = useAction(api.upload_mutations.generateUploadUrl);
  const uploadedImageUrl = useQuery(
    api.upload_mutations.getImageUrl,
    uploadedStorageId ? { storageId: uploadedStorageId } : 'skip'
  );

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

          // 3. Notify parent component with the storage ID
          onUploadSuccess(storageId);

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
          onRemove(); // Notify parent to clear storage ID on error
        } finally {
          setUploading(false);
        }
      }
    },
    [generateUploadUrl, onUploadSuccess, onRemove, toast, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
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
              onRemove(); // Notify parent to clear storage ID
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
            <p>{t('commodities.uploadingImage')}</p>
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
  );
};
