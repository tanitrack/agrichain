import { useState } from 'react';
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
  Truck,
  Search,
  Calendar as CalendarIcon,
  Filter,
  Package,
  Eye,
  X,
  Check,
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
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

// Mock data for deliveries
const deliveriesData = [
  {
    id: 'DLV-20231101-001',
    date: '2023-11-01',
    origin: 'Gudang Cianjur',
    destination: 'Pasar Induk Kramat Jati',
    items: [{ name: 'Beras Putih', quantity: 500, unit: 'kg' }],
    status: 'dalam_perjalanan',
    estimatedArrival: '2023-11-02',
    transactionId: 'TX7825',
    courier: 'JNE Trucking',
    trackingNumber: 'JNE12345678',
  },
  {
    id: 'DLV-20231105-002',
    date: '2023-11-05',
    origin: 'Gudang Malang',
    destination: 'Supermarket Surabaya',
    items: [{ name: 'Jagung Manis', quantity: 300, unit: 'kg' }],
    status: 'tiba_di_tujuan',
    estimatedArrival: '2023-11-06',
    transactionId: 'TX7824',
    courier: 'SiCepat Express',
    trackingNumber: 'SICEPAT67890',
  },
  {
    id: 'DLV-20231110-003',
    date: '2023-11-10',
    origin: 'Gudang Jember',
    destination: 'Restoran Jakarta',
    items: [{ name: 'Kedelai', quantity: 1000, unit: 'kg' }],
    status: 'selesai',
    estimatedArrival: '2023-11-12',
    transactionId: 'TX7823',
    courier: 'Gojek Instant',
    trackingNumber: 'GOJEK3456789',
  },
  {
    id: 'DLV-20231115-004',
    date: '2023-11-15',
    origin: 'Gudang Bandung',
    destination: 'Toko Kue Bogor',
    items: [{ name: 'Gula Aren', quantity: 200, unit: 'kg' }],
    status: 'dalam_persiapan',
    estimatedArrival: '2023-11-16',
    transactionId: 'TX7822',
    courier: 'GrabExpress',
    trackingNumber: 'GRABEXPRESS23456',
  },
  {
    id: 'DLV-20231120-005',
    date: '2023-11-20',
    origin: 'Gudang Bali',
    destination: 'Cafe Denpasar',
    items: [{ name: 'Kopi Arabika', quantity: 50, unit: 'kg' }],
    status: 'menunggu',
    estimatedArrival: '2023-11-21',
    transactionId: 'TX7821',
    courier: 'J&T Express',
    trackingNumber: 'JNT789012345',
  },
];

const Pengiriman = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const { toast } = useToast();

  // Filter deliveries based on search query, status, and date range
  const filteredDeliveries = [...deliveriesData].filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = status === '' || delivery.status === status;

    const matchesDateRange =
      !dateRange || !dateRange.from
        ? true
        : new Date(delivery.date) >= dateRange.from &&
          (!dateRange.to || new Date(delivery.date) <= dateRange.to);

    // Match tab
    const matchesTab =
      tab === 'all' ||
      (tab === 'active' &&
        ['menunggu', 'dalam_persiapan', 'dalam_perjalanan'].includes(delivery.status)) ||
      (tab === 'completed' && ['tiba_di_tujuan', 'selesai'].includes(delivery.status));

    return matchesSearch && matchesStatus && matchesDateRange && matchesTab;
  });

  // Function to handle view delivery details
  const handleViewDelivery = (delivery: any) => {
    setSelectedDelivery(delivery);
    setViewDialogOpen(true);
  };

  // Function to handle update delivery status
  const handleUpdateStatus = (delivery: any, newStatus: string) => {
    // Find and update the delivery
    const index = deliveriesData.findIndex((d) => d.id === delivery.id);
    if (index !== -1) {
      deliveriesData[index].status = newStatus;
    }

    toast({
      title: 'Status Pengiriman Diperbarui',
      description: `Pengiriman ${delivery.id} sekarang ${getStatusLabel(newStatus)}`,
    });

    setViewDialogOpen(false);
  };

  // Function to get status label
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      menunggu: 'Menunggu',
      dalam_persiapan: 'Dalam Persiapan',
      dalam_perjalanan: 'Dalam Perjalanan',
      tiba_di_tujuan: 'Tiba di Tujuan',
      selesai: 'Selesai',
    };

    return statusMap[status] || status;
  };

  // Function to render status badge
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      menunggu: {
        label: 'Menunggu',
        className: 'bg-yellow-100 text-yellow-800',
      },
      dalam_persiapan: {
        label: 'Dalam Persiapan',
        className: 'bg-blue-100 text-blue-800',
      },
      dalam_perjalanan: {
        label: 'Dalam Perjalanan',
        className: 'bg-indigo-100 text-indigo-800',
      },
      tiba_di_tujuan: {
        label: 'Tiba di Tujuan',
        className: 'bg-green-100 text-green-800',
      },
      selesai: {
        label: 'Selesai',
        className: 'bg-teal-100 text-teal-800',
      },
    };

    const statusInfo = statusMap[status] || {
      label: status.replace(/_/g, ' '),
      className: 'bg-gray-100 text-gray-800',
    };

    return <Badge className={`${statusInfo.className}`}>{statusInfo.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Pengiriman</h1>
        <p className="text-gray-600">Kelola pengiriman komoditas Anda</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Truck className="text-tani-green-dark mr-2 h-5 w-5" />
            Daftar Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Cari pengiriman..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="menunggu">Menunggu</SelectItem>
                    <SelectItem value="dalam_persiapan">Dalam Persiapan</SelectItem>
                    <SelectItem value="dalam_perjalanan">Dalam Perjalanan</SelectItem>
                    <SelectItem value="tiba_di_tujuan">Tiba di Tujuan</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex justify-start text-left font-normal sm:w-[240px]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'dd MMM yyyy', { locale: id })} -{' '}
                            {format(dateRange.to, 'dd MMM yyyy', { locale: id })}
                          </>
                        ) : (
                          format(dateRange.from, 'dd MMM yyyy', { locale: id })
                        )
                      ) : (
                        <span>Filter Tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="completed">Selesai</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pengiriman</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Asal</TableHead>
                        <TableHead>Tujuan</TableHead>
                        <TableHead>Komoditas</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Estimasi Tiba</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeliveries.length > 0 ? (
                        filteredDeliveries.map((delivery) => (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">{delivery.id}</TableCell>
                            <TableCell>{format(new Date(delivery.date), 'dd MMM yyyy')}</TableCell>
                            <TableCell>{delivery.origin}</TableCell>
                            <TableCell>{delivery.destination}</TableCell>
                            <TableCell>
                              {delivery.items.map((item, idx) => (
                                <div key={idx}>
                                  {item.name} ({item.quantity} {item.unit})
                                </div>
                              ))}
                            </TableCell>
                            <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                            <TableCell>
                              {format(new Date(delivery.estimatedArrival), 'dd MMM yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDelivery(delivery)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {delivery.status === 'tiba_di_tujuan' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600"
                                    onClick={() => handleUpdateStatus(delivery, 'selesai')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                            Tidak ada pengiriman yang ditemukan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pengiriman</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Asal</TableHead>
                        <TableHead>Tujuan</TableHead>
                        <TableHead>Komoditas</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Estimasi Tiba</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeliveries.length > 0 ? (
                        filteredDeliveries.map((delivery) => (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">{delivery.id}</TableCell>
                            <TableCell>{format(new Date(delivery.date), 'dd MMM yyyy')}</TableCell>
                            <TableCell>{delivery.origin}</TableCell>
                            <TableCell>{delivery.destination}</TableCell>
                            <TableCell>
                              {delivery.items.map((item, idx) => (
                                <div key={idx}>
                                  {item.name} ({item.quantity} {item.unit})
                                </div>
                              ))}
                            </TableCell>
                            <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                            <TableCell>
                              {format(new Date(delivery.estimatedArrival), 'dd MMM yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDelivery(delivery)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                            Tidak ada pengiriman aktif yang ditemukan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pengiriman</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Asal</TableHead>
                        <TableHead>Tujuan</TableHead>
                        <TableHead>Komoditas</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Estimasi Tiba</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeliveries.length > 0 ? (
                        filteredDeliveries.map((delivery) => (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">{delivery.id}</TableCell>
                            <TableCell>{format(new Date(delivery.date), 'dd MMM yyyy')}</TableCell>
                            <TableCell>{delivery.origin}</TableCell>
                            <TableCell>{delivery.destination}</TableCell>
                            <TableCell>
                              {delivery.items.map((item, idx) => (
                                <div key={idx}>
                                  {item.name} ({item.quantity} {item.unit})
                                </div>
                              ))}
                            </TableCell>
                            <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                            <TableCell>
                              {format(new Date(delivery.estimatedArrival), 'dd MMM yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDelivery(delivery)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                            Tidak ada pengiriman selesai yang ditemukan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Pengiriman</DialogTitle>
            <DialogDescription>Informasi lengkap tentang pengiriman</DialogDescription>
          </DialogHeader>

          {selectedDelivery && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="font-semibold">ID Pengiriman</div>
                <div>{selectedDelivery.id}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">ID Transaksi</div>
                <div>{selectedDelivery.transactionId}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Status</div>
                <div>{getStatusBadge(selectedDelivery.status)}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Kurir</div>
                <div>{selectedDelivery.courier}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Nomor Pelacakan</div>
                <div>{selectedDelivery.trackingNumber}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Tanggal Pengiriman</div>
                <div>{format(new Date(selectedDelivery.date), 'dd MMMM yyyy', { locale: id })}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Estimasi Tiba</div>
                <div>
                  {format(new Date(selectedDelivery.estimatedArrival), 'dd MMMM yyyy', {
                    locale: id,
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Asal</div>
                <div>{selectedDelivery.origin}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Tujuan</div>
                <div>{selectedDelivery.destination}</div>
              </div>

              <div className="col-span-2 space-y-2">
                <div className="font-semibold">Daftar Komoditas</div>
                <div className="rounded-md border p-3">
                  {selectedDelivery.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-1">
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            {selectedDelivery && (
              <div className="flex gap-2">
                {selectedDelivery.status === 'dalam_perjalanan' && (
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedDelivery, 'tiba_di_tujuan')}
                  >
                    Tandai Tiba di Tujuan
                  </Button>
                )}
                {selectedDelivery.status === 'tiba_di_tujuan' && (
                  <Button onClick={() => handleUpdateStatus(selectedDelivery, 'selesai')}>
                    Tandai Selesai
                  </Button>
                )}
              </div>
            )}
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Pengiriman;
