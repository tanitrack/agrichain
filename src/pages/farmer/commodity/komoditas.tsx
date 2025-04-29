import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { MainLayout } from '@/components/layout/main-layout';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/language-context';
import { AddKomoditasDialog } from '@/components/komoditas/add-komoditas-dialog';
import { KomoditasTable } from '@/components/komoditas/komoditas-table';
import type { KomoditasItem } from '@/components/komoditas/komoditas-row';
import { api } from '@/lib/convex';

interface ConvexKomoditas {
  _id: string;
  _creationTime: number;
  name: string;
  description?: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  stock: number;
  imageUrl?: string;
  createdBy: string;
  updatedAt: number;
}

const mapToKomoditasItem = (item: ConvexKomoditas): KomoditasItem => ({
  // Pass through all Convex fields
  _id: item._id,
  _creationTime: item._creationTime,
  name: item.name,
  description: item.description,
  category: item.category,
  unit: item.unit,
  pricePerUnit: item.pricePerUnit,
  stock: item.stock,
  imageUrl: item.imageUrl ?? '/placeholder.svg', // Provide default image
  createdBy: item.createdBy,
  updatedAt: item.updatedAt,

  // Map UI compatibility fields
  id: item._id,
  type: item.category,
  quantity: item.stock,
  location: 'Indonesia', // Default location
  grade: 'Standard', // Default grade
  createdAt: new Date(item._creationTime).toISOString().split('T')[0],
});

const Komoditas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [addKomoditasOpen, setAddKomoditasOpen] = useState(false);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [selectedKomoditas, setSelectedKomoditas] = useState<string | null>(null);
  const { t } = useLanguage();

  // Fetch komoditas data using Convex query
  const komoditasData = useQuery(api.komoditas_queries.list, {
    paginationOpts: {
      numItems: 10,
      cursor: null,
    },
  }) || { page: [], isDone: true, continueCursor: null };

  // Use search query if there's a search term
  const searchResults = useQuery(
    api.komoditas_queries.search,
    searchQuery ? { query: searchQuery } : 'skip'
  );

  // Use either search results or regular list based on search query
  const displayData =
    searchQuery && searchResults
      ? searchResults.map(mapToKomoditasItem)
      : komoditasData.page.map(mapToKomoditasItem);

  const handleViewDetail = (id: string) => {
    navigate(`/komoditas/${id}`);
  };

  const handleAddSuccess = (komoditasName: string) => {
    setSelectedKomoditas(komoditasName);
    setQrCodeDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-dark-green">{t('commodities.title')}</h1>
          <p className="text-earth-medium-green">{t('commodities.subtitle')}</p>
        </div>
        <AddKomoditasDialog
          open={addKomoditasOpen}
          onOpenChange={setAddKomoditasOpen}
          onSuccess={handleAddSuccess}
        />

        {/* QR Code Dialog */}
        <Dialog open={qrCodeDialogOpen} onOpenChange={setQrCodeDialogOpen}>
          <DialogContent className="border-earth-light-green sm:max-w-[400px]">
            <DialogHeader className="earth-header-moss">
              <DialogTitle>{t('commodities.qrcode')}</DialogTitle>
              <DialogDescription className="text-white">
                Gunakan QR Code ini untuk melacak komoditas Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <div className="mb-4 rounded-lg bg-earth-pale-green p-4">
                <QrCode className="mx-auto h-32 w-32 text-earth-dark-green" />
              </div>
              <p className="text-center text-sm text-earth-dark-green">
                {t('commodities.name')}: <span className="font-medium">{selectedKomoditas}</span>
                <br />
                ID: <span className="font-medium">KM00{Math.floor(Math.random() * 1000)}</span>
                <br />
                {t('commodities.created')}:{' '}
                <span className="font-medium">{new Date().toLocaleDateString('id-ID')}</span>
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setQrCodeDialogOpen(false)}
                className="bg-earth-dark-green hover:bg-earth-medium-green"
              >
                {t('action.close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* <Card className="earth-card-green mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-earth-medium-green" />
              <Input
                className="border-earth-medium-green pl-10 focus:border-earth-dark-green"
                placeholder={t('commodities.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20"
            >
              <Filter className="h-4 w-4" />
              {t('action.filter')}
            </Button>
          </div>
        </CardContent>
      </Card> */}

      <KomoditasTable
        data={displayData}
        onViewDetail={handleViewDetail}
        onEdit={(id) => console.log('Edit', id)}
        onDelete={(id) => console.log('Delete', id)}
        onShowQR={(id) => {
          const item = displayData.find((k) => k.id === id);
          if (item) {
            setSelectedKomoditas(item.name);
            setQrCodeDialogOpen(true);
          }
        }}
      />
    </MainLayout>
  );
};

export default Komoditas;
