import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Badge } from '@/components/ui/badge';

import { useLanguage } from '@/contexts/language-context';
import { OrderBook } from '@/lib/data/types';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { KomoditasItem } from '@/components/komoditas/komoditas-row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Eye, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TransactionFlowExplorerDialog from '@/components/transaction/transaction-flow-explorer-dialog';
import { AddOrderBookDialog } from '@/components/orderbook/add-order-book-dialog';
import { formatDate } from '@/lib/utils';
import { useAuthCheck } from '@/hooks/use-auth-check';

// Sample order book data for buyer view
const orderBooks: OrderBook[] = [
  {
    id: 'OB-2023-001',
    buyerId: 'buyer-123',
    buyerName: 'PT Agrimax',
    commodityType: 'Padi',
    quantity: 1000,
    unit: 'kg',
    requestedGrade: 'A',
    requestedDeliveryDate: new Date('2023-12-15'),
    offerExpiryDate: new Date('2023-11-30'),
    status: 'open',
    termsConditions: 'Kualitas premium, kadar air maksimal 14%',
    createdAt: new Date('2023-11-05'),
    qrCodeUrl: '/placeholder.svg',
  },
  {
    id: 'OB-2023-002',
    buyerId: 'buyer-123',
    buyerName: 'PT Agrimax',
    commodityType: 'Kedelai',
    quantity: 500,
    unit: 'kg',
    requestedGrade: 'Premium',
    requestedDeliveryDate: new Date('2023-12-10'),
    offerExpiryDate: new Date('2023-11-25'),
    status: 'accepted',
    termsConditions: 'Ukuran biji seragam, bebas kotoran',
    createdAt: new Date('2023-11-08'),
    qrCodeUrl: '/placeholder.svg',
  },
  {
    id: 'OB-2023-003',
    buyerId: 'buyer-123',
    buyerName: 'PT Agrimax',
    commodityType: 'Jagung',
    quantity: 2000,
    unit: 'kg',
    requestedGrade: 'B',
    requestedDeliveryDate: new Date('2023-12-20'),
    offerExpiryDate: new Date('2023-12-05'),
    status: 'open',
    termsConditions: 'Jagung kering, tidak berjamur',
    createdAt: new Date('2023-11-10'),
    qrCodeUrl: '/placeholder.svg',
  },
];

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

const OrderBookList = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter order books based on search query and status
  const filteredOrderBooks = orderBooks.filter((orderBook) => {
    const matchesSearch =
      orderBook.commodityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderBook.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || orderBook.status === statusFilter;

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'open' && orderBook.status === 'open') ||
      (activeTab === 'accepted' && orderBook.status === 'accepted') ||
      (activeTab === 'completed' && orderBook.status === 'completed') ||
      (activeTab === 'expired' &&
        (orderBook.status === 'expired' || orderBook.status === 'cancelled'));

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Function to handle viewing details
  const handleViewDetails = (id: string) => {
    navigate(`/buyer/order-book/${id}`);
  };

  // Function to navigate to create new order book
  const handleCreateOrderBook = () => {
    navigate('/order-book/create');
  };

  // Function to render status badge with appropriate color
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      open: {
        label: language === 'id' ? 'Terbuka' : 'Open',
        className: 'bg-blue-100 text-blue-800',
      },
      accepted: {
        label: language === 'id' ? 'Diterima' : 'Accepted',
        className: 'bg-green-100 text-green-800',
      },
      completed: {
        label: language === 'id' ? 'Selesai' : 'Completed',
        className: 'bg-teal-100 text-teal-800',
      },
      expired: {
        label: language === 'id' ? 'Kedaluwarsa' : 'Expired',
        className: 'bg-gray-100 text-gray-800',
      },
      cancelled: {
        label: language === 'id' ? 'Dibatalkan' : 'Cancelled',
        className: 'bg-red-100 text-red-800',
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return <Badge className={`${statusInfo.className}`}>{statusInfo.label}</Badge>;
  };

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

  const displayData =
    searchQuery && searchResults
      ? searchResults.map(mapToKomoditasItem)
      : komoditasData.page.map(mapToKomoditasItem);

  const { userProfile } = useAuthCheck();

  return (
    <MainLayout>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-dark-green">{'Daftar Order Book'}</h1>
          <p className="text-earth-medium-green">{'Kelola permintaan pembelian komoditas Anda'}</p>
        </div>

        <div className="flex gap-2">
          <TransactionFlowExplorerDialog />
          {userProfile.userType === 'consumer' && <AddOrderBookDialog />}
        </div>
      </div>
      <Card className="">
        <CardHeader className="earth-header-forest pb-3">
          <CardTitle className="mb-4 flex items-center text-lg text-white">
            <ClipboardList className="mr-2 h-5 w-5" />
            {'Daftar Order Book'}
          </CardTitle>
          <div className=" flex flex-col justify-between gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder={'Cari berdasarkan ID atau komoditas'}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className=" flex flex-col gap-4 sm:flex-row">
              <Button variant="outline" className="flex gap-2 text-tani-green-dark">
                <Filter className="h-4 w-4" />
                {language === 'id' ? 'Filter' : 'Filter'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="">
            <Table>
              <TableHeader className="bg-earth-light-green/30">
                <TableRow>
                  <TableHead className="text-earth-dark-green">
                    {language === 'id' ? 'ID' : 'ID'}
                  </TableHead>
                  <TableHead className="text-earth-dark-green">
                    {language === 'id' ? 'Komoditas' : 'Commodity'}
                  </TableHead>
                  <TableHead className="text-earth-dark-green">
                    {language === 'id' ? 'Jumlah' : 'Quantity'}
                  </TableHead>
                  {/* <TableHead className="text-earth-dark-green">
                    {language === 'id' ? 'Grade' : 'Grade'}
                  </TableHead> */}
                  <TableHead className="text-earth-dark-green">
                    {language === 'id' ? 'Tanggal Pengiriman' : 'Delivery Date'}
                  </TableHead>
                  <TableHead className="text-earth-dark-green">
                    {language === 'id' ? 'Tanggal Kedaluwarsa' : 'Expiry Date'}
                  </TableHead>
                  <TableHead className="text-earth-dark-green">
                    {language === 'id' ? 'Status' : 'Status'}
                  </TableHead>
                  <TableHead className="text-right text-earth-dark-green">
                    {language === 'id' ? 'Aksi' : 'Action'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrderBooks.length > 0 ? (
                  filteredOrderBooks.map((orderBook) => (
                    <TableRow key={orderBook.id}>
                      <TableCell className="font-medium">{orderBook.id}</TableCell>
                      <TableCell>{orderBook.commodityType}</TableCell>
                      <TableCell>
                        {orderBook.quantity} {orderBook.unit}
                      </TableCell>
                      {/* <TableCell>{orderBook.requestedGrade}</TableCell> */}
                      <TableCell>{formatDate(orderBook.requestedDeliveryDate)}</TableCell>
                      <TableCell>{formatDate(orderBook.offerExpiryDate)}</TableCell>
                      <TableCell>{getStatusBadge(orderBook.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(orderBook.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                      {language === 'id' ? 'Tidak ada data yang ditemukan' : 'No data found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
    // <MainLayout>
    //   <div className="mb-8 flex items-start justify-between">
    //     <div>
    //       <h1 className="mb-2 text-2xl font-bold">
    //         {language === 'id' ? 'Daftar Order Book' : 'Order Book List'}
    //       </h1>
    //       <p className="text-gray-600">
    //         {language === 'id'
    //           ? 'Kelola permintaan pembelian komoditas Anda'
    //           : 'Manage your commodity purchase requests'}
    //       </p>
    //     </div>
    //     <div className="flex gap-2">
    //       <TransactionFlowExplorerDialog />
    //       <AddOrderBookDialog />
    //     </div>
    //   </div>

    //   <Card className="earth-card-green mb-6">
    //     <CardHeader className="pb-3">
    //       <CardTitle className="flex items-center text-lg">
    //         <ClipboardList className="mr-2 h-5 w-5 text-tani-green-dark" />
    //         {language === 'id' ? 'Daftar Order Book' : 'Order Book List'}
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="flex flex-col gap-4">
    //         <div className="flex flex-col justify-between gap-4 sm:flex-row">
    //           <div className="relative flex-1">
    //             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
    //             <Input
    //               type="search"
    //               placeholder={
    //                 language === 'id'
    //                   ? 'Cari berdasarkan ID atau komoditas'
    //                   : 'Search by ID or commodity'
    //               }
    //               className="pl-8"
    //               value={searchQuery}
    //               onChange={(e) => setSearchQuery(e.target.value)}
    //             />
    //           </div>
    //           <div className="flex flex-col gap-4 sm:flex-row">
    //             <Select value={statusFilter} onValueChange={setStatusFilter}>
    //               <SelectTrigger className="w-full sm:w-[180px]">
    //                 <SelectValue
    //                   placeholder={language === 'id' ? 'Filter Status' : 'Filter Status'}
    //                 />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="all">{language === 'id' ? 'Semua' : 'All'}</SelectItem>
    //                 <SelectItem value="open">{language === 'id' ? 'Terbuka' : 'Open'}</SelectItem>
    //                 <SelectItem value="accepted">
    //                   {language === 'id' ? 'Diterima' : 'Accepted'}
    //                 </SelectItem>
    //                 <SelectItem value="completed">
    //                   {language === 'id' ? 'Selesai' : 'Completed'}
    //                 </SelectItem>
    //                 <SelectItem value="expired">
    //                   {language === 'id' ? 'Kedaluwarsa' : 'Expired'}
    //                 </SelectItem>
    //                 <SelectItem value="cancelled">
    //                   {language === 'id' ? 'Dibatalkan' : 'Cancelled'}
    //                 </SelectItem>
    //               </SelectContent>
    //             </Select>
    //             <Button variant="outline" className="flex gap-2">
    //               <Filter className="h-4 w-4" />
    //               {language === 'id' ? 'Filter' : 'Filter'}
    //             </Button>
    //           </div>
    //         </div>

    //         <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
    //           <TabsList className="mb-4">
    //             <TabsTrigger value="all">{language === 'id' ? 'Semua' : 'All'}</TabsTrigger>
    //             <TabsTrigger value="open">{language === 'id' ? 'Terbuka' : 'Open'}</TabsTrigger>
    //             <TabsTrigger value="accepted">
    //               {language === 'id' ? 'Diterima' : 'Accepted'}
    //             </TabsTrigger>
    //             <TabsTrigger value="completed">
    //               {language === 'id' ? 'Selesai' : 'Completed'}
    //             </TabsTrigger>
    //             <TabsTrigger value="expired">
    //               {language === 'id' ? 'Kedaluwarsa/Batal' : 'Expired/Cancelled'}
    //             </TabsTrigger>
    //           </TabsList>
    //           <TabsContent value="all" className="mt-0">
    //             <div className="rounded-md border">
    //               <Table>
    //                 <TableHeader>
    //                   <TableRow>
    //                     <TableHead>{language === 'id' ? 'ID' : 'ID'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Komoditas' : 'Commodity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Jumlah' : 'Quantity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Grade' : 'Grade'}</TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Pengiriman' : 'Delivery Date'}
    //                     </TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Kedaluwarsa' : 'Expiry Date'}
    //                     </TableHead>
    //                     <TableHead>{language === 'id' ? 'Status' : 'Status'}</TableHead>
    //                     <TableHead className="text-right">
    //                       {language === 'id' ? 'Aksi' : 'Action'}
    //                     </TableHead>
    //                   </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                   {filteredOrderBooks.length > 0 ? (
    //                     filteredOrderBooks.map((orderBook) => (
    //                       <TableRow key={orderBook.id}>
    //                         <TableCell className="font-medium">{orderBook.id}</TableCell>
    //                         <TableCell>{orderBook.commodityType}</TableCell>
    //                         <TableCell>
    //                           {orderBook.quantity} {orderBook.unit}
    //                         </TableCell>
    //                         <TableCell>{orderBook.requestedGrade}</TableCell>
    //                         <TableCell>{formatDate(orderBook.requestedDeliveryDate)}</TableCell>
    //                         <TableCell>{formatDate(orderBook.offerExpiryDate)}</TableCell>
    //                         <TableCell>{getStatusBadge(orderBook.status)}</TableCell>
    //                         <TableCell className="text-right">
    //                           <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             onClick={() => handleViewDetails(orderBook.id)}
    //                           >
    //                             <Eye className="h-4 w-4" />
    //                           </Button>
    //                         </TableCell>
    //                       </TableRow>
    //                     ))
    //                   ) : (
    //                     <TableRow>
    //                       <TableCell colSpan={8} className="py-8 text-center text-gray-500">
    //                         {language === 'id' ? 'Tidak ada data yang ditemukan' : 'No data found'}
    //                       </TableCell>
    //                     </TableRow>
    //                   )}
    //                 </TableBody>
    //               </Table>
    //             </div>
    //           </TabsContent>

    //           <TabsContent value="open" className="mt-0">
    //             <div className="rounded-md border">
    //               <Table>
    //                 <TableHeader>
    //                   <TableRow>
    //                     <TableHead>{language === 'id' ? 'ID' : 'ID'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Komoditas' : 'Commodity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Jumlah' : 'Quantity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Grade' : 'Grade'}</TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Pengiriman' : 'Delivery Date'}
    //                     </TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Kedaluwarsa' : 'Expiry Date'}
    //                     </TableHead>
    //                     <TableHead>{language === 'id' ? 'Status' : 'Status'}</TableHead>
    //                     <TableHead className="text-right">
    //                       {language === 'id' ? 'Aksi' : 'Action'}
    //                     </TableHead>
    //                   </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                   {filteredOrderBooks.length > 0 ? (
    //                     filteredOrderBooks.map((orderBook) => (
    //                       <TableRow key={orderBook.id}>
    //                         <TableCell className="font-medium">{orderBook.id}</TableCell>
    //                         <TableCell>{orderBook.commodityType}</TableCell>
    //                         <TableCell>
    //                           {orderBook.quantity} {orderBook.unit}
    //                         </TableCell>
    //                         <TableCell>{orderBook.requestedGrade}</TableCell>
    //                         <TableCell>{formatDate(orderBook.requestedDeliveryDate)}</TableCell>
    //                         <TableCell>{formatDate(orderBook.offerExpiryDate)}</TableCell>
    //                         <TableCell>{getStatusBadge(orderBook.status)}</TableCell>
    //                         <TableCell className="text-right">
    //                           <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             onClick={() => handleViewDetails(orderBook.id)}
    //                           >
    //                             <Eye className="h-4 w-4" />
    //                           </Button>
    //                         </TableCell>
    //                       </TableRow>
    //                     ))
    //                   ) : (
    //                     <TableRow>
    //                       <TableCell colSpan={8} className="py-8 text-center text-gray-500">
    //                         {language === 'id' ? 'Tidak ada data yang ditemukan' : 'No data found'}
    //                       </TableCell>
    //                     </TableRow>
    //                   )}
    //                 </TableBody>
    //               </Table>
    //             </div>
    //           </TabsContent>

    //           <TabsContent value="accepted" className="mt-0">
    //             <div className="rounded-md border">
    //               <Table>
    //                 <TableHeader>
    //                   <TableRow>
    //                     <TableHead>{language === 'id' ? 'ID' : 'ID'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Komoditas' : 'Commodity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Jumlah' : 'Quantity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Grade' : 'Grade'}</TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Pengiriman' : 'Delivery Date'}
    //                     </TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Kedaluwarsa' : 'Expiry Date'}
    //                     </TableHead>
    //                     <TableHead>{language === 'id' ? 'Status' : 'Status'}</TableHead>
    //                     <TableHead className="text-right">
    //                       {language === 'id' ? 'Aksi' : 'Action'}
    //                     </TableHead>
    //                   </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                   {filteredOrderBooks.length > 0 ? (
    //                     filteredOrderBooks.map((orderBook) => (
    //                       <TableRow key={orderBook.id}>
    //                         <TableCell className="font-medium">{orderBook.id}</TableCell>
    //                         <TableCell>{orderBook.commodityType}</TableCell>
    //                         <TableCell>
    //                           {orderBook.quantity} {orderBook.unit}
    //                         </TableCell>
    //                         <TableCell>{orderBook.requestedGrade}</TableCell>
    //                         <TableCell>{formatDate(orderBook.requestedDeliveryDate)}</TableCell>
    //                         <TableCell>{formatDate(orderBook.offerExpiryDate)}</TableCell>
    //                         <TableCell>{getStatusBadge(orderBook.status)}</TableCell>
    //                         <TableCell className="text-right">
    //                           <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             onClick={() => handleViewDetails(orderBook.id)}
    //                           >
    //                             <Eye className="h-4 w-4" />
    //                           </Button>
    //                         </TableCell>
    //                       </TableRow>
    //                     ))
    //                   ) : (
    //                     <TableRow>
    //                       <TableCell colSpan={8} className="py-8 text-center text-gray-500">
    //                         {language === 'id' ? 'Tidak ada data yang ditemukan' : 'No data found'}
    //                       </TableCell>
    //                     </TableRow>
    //                   )}
    //                 </TableBody>
    //               </Table>
    //             </div>
    //           </TabsContent>

    //           <TabsContent value="completed" className="mt-0">
    //             <div className="rounded-md border">
    //               <Table>
    //                 <TableHeader>
    //                   <TableRow>
    //                     <TableHead>{language === 'id' ? 'ID' : 'ID'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Komoditas' : 'Commodity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Jumlah' : 'Quantity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Grade' : 'Grade'}</TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Pengiriman' : 'Delivery Date'}
    //                     </TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Kedaluwarsa' : 'Expiry Date'}
    //                     </TableHead>
    //                     <TableHead>{language === 'id' ? 'Status' : 'Status'}</TableHead>
    //                     <TableHead className="text-right">
    //                       {language === 'id' ? 'Aksi' : 'Action'}
    //                     </TableHead>
    //                   </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                   {filteredOrderBooks.length > 0 ? (
    //                     filteredOrderBooks.map((orderBook) => (
    //                       <TableRow key={orderBook.id}>
    //                         <TableCell className="font-medium">{orderBook.id}</TableCell>
    //                         <TableCell>{orderBook.commodityType}</TableCell>
    //                         <TableCell>
    //                           {orderBook.quantity} {orderBook.unit}
    //                         </TableCell>
    //                         <TableCell>{orderBook.requestedGrade}</TableCell>
    //                         <TableCell>{formatDate(orderBook.requestedDeliveryDate)}</TableCell>
    //                         <TableCell>{formatDate(orderBook.offerExpiryDate)}</TableCell>
    //                         <TableCell>{getStatusBadge(orderBook.status)}</TableCell>
    //                         <TableCell className="text-right">
    //                           <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             onClick={() => handleViewDetails(orderBook.id)}
    //                           >
    //                             <Eye className="h-4 w-4" />
    //                           </Button>
    //                         </TableCell>
    //                       </TableRow>
    //                     ))
    //                   ) : (
    //                     <TableRow>
    //                       <TableCell colSpan={8} className="py-8 text-center text-gray-500">
    //                         {language === 'id' ? 'Tidak ada data yang ditemukan' : 'No data found'}
    //                       </TableCell>
    //                     </TableRow>
    //                   )}
    //                 </TableBody>
    //               </Table>
    //             </div>
    //           </TabsContent>

    //           <TabsContent value="expired" className="mt-0">
    //             <div className="rounded-md border">
    //               <Table>
    //                 <TableHeader>
    //                   <TableRow>
    //                     <TableHead>{language === 'id' ? 'ID' : 'ID'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Komoditas' : 'Commodity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Jumlah' : 'Quantity'}</TableHead>
    //                     <TableHead>{language === 'id' ? 'Grade' : 'Grade'}</TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Pengiriman' : 'Delivery Date'}
    //                     </TableHead>
    //                     <TableHead>
    //                       {language === 'id' ? 'Tanggal Kedaluwarsa' : 'Expiry Date'}
    //                     </TableHead>
    //                     <TableHead>{language === 'id' ? 'Status' : 'Status'}</TableHead>
    //                     <TableHead className="text-right">
    //                       {language === 'id' ? 'Aksi' : 'Action'}
    //                     </TableHead>
    //                   </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                   {filteredOrderBooks.length > 0 ? (
    //                     filteredOrderBooks.map((orderBook) => (
    //                       <TableRow key={orderBook.id}>
    //                         <TableCell className="font-medium">{orderBook.id}</TableCell>
    //                         <TableCell>{orderBook.commodityType}</TableCell>
    //                         <TableCell>
    //                           {orderBook.quantity} {orderBook.unit}
    //                         </TableCell>
    //                         <TableCell>{orderBook.requestedGrade}</TableCell>
    //                         <TableCell>{formatDate(orderBook.requestedDeliveryDate)}</TableCell>
    //                         <TableCell>{formatDate(orderBook.offerExpiryDate)}</TableCell>
    //                         <TableCell>{getStatusBadge(orderBook.status)}</TableCell>
    //                         <TableCell className="text-right">
    //                           <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             onClick={() => handleViewDetails(orderBook.id)}
    //                           >
    //                             <Eye className="h-4 w-4" />
    //                           </Button>
    //                         </TableCell>
    //                       </TableRow>
    //                     ))
    //                   ) : (
    //                     <TableRow>
    //                       <TableCell colSpan={8} className="py-8 text-center text-gray-500">
    //                         {language === 'id' ? 'Tidak ada data yang ditemukan' : 'No data found'}
    //                       </TableCell>
    //                     </TableRow>
    //                   )}
    //                 </TableBody>
    //               </Table>
    //             </div>
    //           </TabsContent>
    //         </Tabs>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </MainLayout>
  );
};

export default OrderBookList;
