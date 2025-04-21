import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Filter,
  Package,
  MoreVertical,
  FileText,
  Edit,
  Trash2,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for demo purposes
const komoditasData = [
  {
    id: 'KM001',
    name: 'Beras Putih',
    unit: 'kg',
    type: 'Padi',
    quantity: 5000,
    location: 'Cianjur, Jawa Barat',
    grade: 'Premium',
    createdAt: '2025-04-01',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'KM002',
    name: 'Jagung Manis',
    unit: 'kg',
    type: 'Jagung',
    quantity: 2500,
    location: 'Malang, Jawa Timur',
    grade: 'A',
    createdAt: '2025-03-28',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'KM003',
    name: 'Kedelai',
    unit: 'kg',
    type: 'Kedelai',
    quantity: 1800,
    location: 'Jember, Jawa Timur',
    grade: 'B',
    createdAt: '2025-03-25',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'KM004',
    name: 'Gula Aren',
    unit: 'kg',
    type: 'Gula',
    quantity: 750,
    location: 'Bandung, Jawa Barat',
    grade: 'Premium',
    createdAt: '2025-03-20',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'KM005',
    name: 'Kopi Arabika',
    unit: 'kg',
    type: 'Kopi',
    quantity: 500,
    location: 'Bali',
    grade: 'Premium',
    createdAt: '2025-03-15',
    imageUrl: '/placeholder.svg',
  },
];

// Mock data for units and types
const units = ['kg', 'ton', 'gram', 'liter'];
const types = ['Padi', 'Jagung', 'Kedelai', 'Gula', 'Kopi', 'Cabai', 'Bawang'];
const locations = [
  'Cianjur, Jawa Barat',
  'Malang, Jawa Timur',
  'Jember, Jawa Timur',
  'Bandung, Jawa Barat',
  'Bali',
];
const grades = ['Premium', 'A', 'B', 'C'];

const Komoditas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [addKomoditasOpen, setAddKomoditasOpen] = useState(false);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [selectedKomoditas, setSelectedKomoditas] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    type: '',
    image: null as File | null,
    quantity: '',
    location: '',
    gradeFile: null as File | null,
    grade: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, files: FileList | null) => {
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [field]: files[0] }));
    }
  };

  const handleAddKomoditas = () => {
    toast({
      title: 'Komoditas berhasil ditambahkan',
      description: `${formData.name} telah ditambahkan ke daftar komoditas Anda`,
    });

    setAddKomoditasOpen(false);

    // Show QR Code dialog after success
    setSelectedKomoditas(formData.name);
    setQrCodeDialogOpen(true);

    // Reset form
    setFormData({
      name: '',
      unit: '',
      type: '',
      image: null,
      quantity: '',
      location: '',
      gradeFile: null,
      grade: '',
    });
  };

  const filteredData = komoditasData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetail = (id: string) => {
    navigate(`/komoditas/${id}`);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-earth-dark-green text-2xl font-bold">{t('commodities.title')}</h1>
          <p className="text-earth-medium-green">{t('commodities.subtitle')}</p>
        </div>
        <Dialog open={addKomoditasOpen} onOpenChange={setAddKomoditasOpen}>
          <DialogTrigger asChild>
            <Button className="bg-earth-dark-green hover:bg-earth-medium-green gap-2">
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
                    {t('commodities.name')}
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
                  <Label htmlFor="type" className="text-earth-dark-green">
                    {t('commodities.type')}
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger className="border-earth-medium-green">
                      <SelectValue placeholder="Pilih jenis komoditas" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-earth-dark-green">
                    {t('commodities.upload.image')}
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('image', e.target.files)}
                    className="border-earth-medium-green focus:border-earth-dark-green"
                  />
                  <p className="text-earth-medium-green text-xs">
                    Upload foto komoditas (maks 2MB)
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-earth-dark-green">
                    {t('commodities.quantity')}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-earth-dark-green">
                    {t('commodities.location')}
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleInputChange('location', value)}
                  >
                    <SelectTrigger className="border-earth-medium-green">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeFile" className="text-earth-dark-green">
                    {t('commodities.upload.grade')}
                  </Label>
                  <Input
                    id="gradeFile"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('gradeFile', e.target.files)}
                  />
                  <p className="text-earth-medium-green text-xs">
                    Upload file grading (PDF/Gambar)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-earth-dark-green">
                    {t('commodities.grade')}
                  </Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => handleInputChange('grade', value)}
                  >
                    <SelectTrigger className="border-earth-medium-green">
                      <SelectValue placeholder="Pilih grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddKomoditasOpen(false)}
                className="border-earth-light-green text-earth-dark-green hover:bg-earth-light-green/20"
              >
                {t('action.cancel')}
              </Button>
              <Button
                onClick={handleAddKomoditas}
                className="bg-earth-dark-green hover:bg-earth-medium-green"
              >
                {t('action.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
              <div className="bg-earth-pale-green mb-4 rounded-lg p-4">
                <QrCode className="text-earth-dark-green mx-auto h-32 w-32" />
              </div>
              <p className="text-earth-dark-green text-center text-sm">
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

      <Card className="earth-card-green mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-earth-medium-green absolute left-3 top-1/2 -translate-y-1/2 transform" />
              <Input
                className="border-earth-medium-green focus:border-earth-dark-green pl-10"
                placeholder={t('commodities.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="border-earth-medium-green text-earth-dark-green hover:bg-earth-light-green/20 gap-2"
            >
              <Filter className="h-4 w-4" />
              {t('action.filter')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="earth-card-wheat">
        <CardHeader className="earth-header-forest pb-3">
          <CardTitle className="flex items-center text-lg text-white">
            <Package className="mr-2 h-5 w-5" />
            {t('commodities.list')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-earth-light-green rounded-md border">
            <Table>
              <TableHeader className="bg-earth-light-green/30">
                <TableRow>
                  <TableHead className="text-earth-dark-green">{t('commodities.name')}</TableHead>
                  <TableHead className="text-earth-dark-green">{t('commodities.type')}</TableHead>
                  <TableHead className="text-earth-dark-green hidden md:table-cell">
                    {t('commodities.quantity')}
                  </TableHead>
                  <TableHead className="text-earth-dark-green hidden lg:table-cell">
                    {t('commodities.location')}
                  </TableHead>
                  <TableHead className="text-earth-dark-green">{t('commodities.grade')}</TableHead>
                  <TableHead className="text-earth-dark-green text-right">
                    {t('commodities.action')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-earth-pale-green">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-earth-light-green/20 flex h-10 w-10 items-center justify-center overflow-hidden rounded">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-earth-dark-green font-medium">{item.name}</div>
                            <div className="text-earth-medium-green text-xs">{item.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-earth-dark-green">{item.type}</TableCell>
                      <TableCell className="text-earth-dark-green hidden md:table-cell">
                        {item.quantity.toLocaleString()} {item.unit}
                      </TableCell>
                      <TableCell className="text-earth-dark-green hidden lg:table-cell">
                        {item.location}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.grade === 'Premium'
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : item.grade === 'A'
                                ? 'border-blue-200 bg-blue-50 text-blue-700'
                                : 'border-orange-200 bg-orange-50 text-orange-700'
                          }
                        >
                          {item.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-earth-dark-green hover:bg-earth-light-green/20"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-earth-light-green">
                            <DropdownMenuItem
                              onClick={() => handleViewDetail(item.id)}
                              className="text-earth-dark-green hover:bg-earth-light-green/20"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {t('action.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-earth-dark-green hover:bg-earth-light-green/20">
                              <Edit className="mr-2 h-4 w-4" />
                              {t('action.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-earth-dark-green hover:bg-earth-light-green/20">
                              <QrCode className="mr-2 h-4 w-4" />
                              {t('commodities.qrcode')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-earth-light-green" />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('action.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-earth-medium-green py-8 text-center">
                      {searchQuery
                        ? `${t('commodities.notfound')} "${searchQuery}"`
                        : `${t('commodities.notfound')}. ${t('commodities.add')} to get started.`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Komoditas;
