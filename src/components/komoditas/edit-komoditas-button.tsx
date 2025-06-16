import { useState } from 'react';
import { Id } from 'convex/_generated/dataModel';

import { EditKomoditasDialog } from '@/components/komoditas/edit-komoditas-dialog';

interface EditKomoditasButtonProps {
  komoditasId: Id<'komoditas'>;
}

export const EditKomoditasButton = ({ komoditasId }: EditKomoditasButtonProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <EditKomoditasDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        komoditasId={komoditasId}
        onSuccess={() => setIsEditDialogOpen(false)}
        key={komoditasId.toString() + isEditDialogOpen.toString()} // Ensure dialog updates when komoditasId changes
      />
    </>
  );
};
