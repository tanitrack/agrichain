import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ClipboardList, Search, Filter, Eye, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

// Sample order book data
const orderBooks = [
  {
    id: 'OB-2023-001',
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
  },
  {
    id: 'OB-2023-002',
    buyerName: 'Restoran Padang Jaya',
    commodityType: 'Kedelai',
    quantity: 500,
    unit: 'kg',
    requestedGrade: 'Premium',
    requestedDeliveryDate: new Date('2023-12-10'),
    offerExpiryDate: new Date('2023-11-25'),
    status: 'accepted',
    termsConditions: 'Ukuran biji seragam, bebas kotoran',
    createdAt: new Date('2023-11-08'),
  },
  {
    id: 'OB-2023-003',
    buyerName: 'Pabrik Tepung Makmur',
    commodityType: 'Jagung',
    quantity: 2000,
    unit: 'kg',
    requestedGrade: 'B',
    requestedDeliveryDate: new Date('2023-12-20'),
    offerExpiryDate: new Date('2023-12-05'),
    status: 'open',
    termsConditions: 'Jagung kering, tidak berjamur',
    createdAt: new Date('2023-11-10'),
  },
  {
    id: 'OB-2023-004',
    buyerName: 'Kafe Denpasar',
    commodityType: 'Kopi',
    quantity: 200,
    unit: 'kg',
    requestedGrade: 'Premium',
    requestedDeliveryDate: new Date('2023-12-05'),
    offerExpiryDate: new Date('2023-11-20'),
    status: 'completed',
    termsConditions: 'Biji kopi arabika, roasting medium',
    createdAt: new Date('2023-11-01'),
  },
  {
    id: 'OB-2023-005',
    buyerName: 'Pabrik Gula Jawa',
    commodityType: 'Gula',
    quantity: 1500,
    unit: 'kg',
    requestedGrade: 'A',
    requestedDeliveryDate: new Date('2023-12-25'),
    offerExpiryDate: new Date('2023-12-10'),
    status: 'expired',
    termsConditions: 'Gula kristal putih, kemasan 50kg',
    createdAt: new Date('2023-10-25'),
  },
];

const OrderBook = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter order books based on search query and status
  const filteredOrderBooks = orderBooks.filter((orderBook) => {
    const matchesSearch =
      orderBook.commodityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderBook.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderBook.buyerName.toLowerCase().includes(searchQuery.toLowerCase());

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
    navigate(`/order-book/${id}`);
  };

  // Function to handle accepting an order
  const handleAccept = (id: string) => {
    toast({
      title: 'Order Accepted',
      description: `You have accepted the order ${id}`,
    });
  };

  // Function to handle rejecting an order
  const handleReject = (id: string) => {
    toast({
      title: 'Order Rejected',
      description: `You have rejected the order ${id}`,
      variant: 'destructive',
    });
  };

  // Function to render status badge with appropriate color
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      open: {
        label: t('status.open'),
        className: 'bg-blue-100 text-blue-800',
      },
      accepted: {
        label: t('status.accepted'),
        className: 'bg-green-100 text-green-800',
      },
      completed: {
        label: t('status.completed'),
        className: 'bg-teal-100 text-teal-800',
      },
      expired: {
        label: t('status.expired'),
        className: 'bg-gray-100 text-gray-800',
      },
      cancelled: {
        label: t('status.canceled'),
        className: 'bg-red-100 text-red-800',
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };

    return <Badge className={`${statusInfo.className}`}>{statusInfo.label}</Badge>;
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">{t('orderbook.title')}</h1>
        <p className="text-gray-600">{t('orderbook.subtitle')}</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <ClipboardList className="text-tani-green-dark mr-2 h-5 w-5" />
            {t('orderbook.list')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('orderbook.search')}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('orderbook.all')}</SelectItem>
                    <SelectItem value="open">{t('status.open')}</SelectItem>
                    <SelectItem value="accepted">{t('status.accepted')}</SelectItem>
                    <SelectItem value="completed">{t('status.completed')}</SelectItem>
                    <SelectItem value="expired">{t('status.expired')}</SelectItem>
                    <SelectItem value="cancelled">{t('status.canceled')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  {t('action.filter')}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">{t('orderbook.all')}</TabsTrigger>
                <TabsTrigger value="open">{t('status.open')}</TabsTrigger>
                <TabsTrigger value="accepted">{t('status.accepted')}</TabsTrigger>
                <TabsTrigger value="completed">{t('status.completed')}</TabsTrigger>
                <TabsTrigger value="expired">{t('status.expired')}</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('orderbook.id')}</TableHead>
                        <TableHead>{t('orderbook.buyer')}</TableHead>
                        <TableHead>{t('orderbook.commodity')}</TableHead>
                        <TableHead>{t('orderbook.quantity')}</TableHead>
                        <TableHead>{t('orderbook.grade')}</TableHead>
                        <TableHead>{t('orderbook.delivery')}</TableHead>
                        <TableHead>{t('orderbook.expiry')}</TableHead>
                        <TableHead>{t('orderbook.status')}</TableHead>
                        <TableHead className="text-right">{t('orderbook.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrderBooks.length > 0 ? (
                        filteredOrderBooks.map((orderBook) => (
                          <TableRow key={orderBook.id}>
                            <TableCell className="font-medium">{orderBook.id}</TableCell>
                            <TableCell>{orderBook.buyerName}</TableCell>
                            <TableCell>{orderBook.commodityType}</TableCell>
                            <TableCell>
                              {orderBook.quantity} {orderBook.unit}
                            </TableCell>
                            <TableCell>{orderBook.requestedGrade}</TableCell>
                            <TableCell>{formatDate(orderBook.requestedDeliveryDate)}</TableCell>
                            <TableCell>{formatDate(orderBook.offerExpiryDate)}</TableCell>
                            <TableCell>{getStatusBadge(orderBook.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDetails(orderBook.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {orderBook.status === 'open' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-green-600"
                                      onClick={() => handleAccept(orderBook.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-600"
                                      onClick={() => handleReject(orderBook.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="py-8 text-center text-gray-500">
                            {t('orderbook.notfound')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Other tabs have similar structure but just for display since actual filtering happens in JS */}
              <TabsContent value="open" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('orderbook.id')}</TableHead>
                        <TableHead>{t('orderbook.buyer')}</TableHead>
                        <TableHead>{t('orderbook.commodity')}</TableHead>
                        <TableHead>{t('orderbook.quantity')}</TableHead>
                        <TableHead>{t('orderbook.grade')}</TableHead>
                        <TableHead>{t('orderbook.delivery')}</TableHead>
                        <TableHead>{t('orderbook.expiry')}</TableHead>
                        <TableHead>{t('orderbook.status')}</TableHead>
                        <TableHead className="text-right">{t('orderbook.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrderBooks.length > 0 ? (
                        filteredOrderBooks.map((orderBook) => (
                          <TableRow key={orderBook.id}>
                            <TableCell className="font-medium">{orderBook.id}</TableCell>
                            <TableCell>{orderBook.buyerName}</TableCell>
                            <TableCell>{orderBook.commodityType}</TableCell>
                            <TableCell>
                              {orderBook.quantity} {orderBook.unit}
                            </TableCell>
                            <TableCell>{orderBook.requestedGrade}</TableCell>
                            <TableCell>{formatDate(orderBook.requestedDeliveryDate)}</TableCell>
                            <TableCell>{formatDate(orderBook.offerExpiryDate)}</TableCell>
                            <TableCell>{getStatusBadge(orderBook.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDetails(orderBook.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600"
                                  onClick={() => handleAccept(orderBook.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() => handleReject(orderBook.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="py-8 text-center text-gray-500">
                            {t('orderbook.notfound')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Other tabs content is similar */}
              <TabsContent value="accepted" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    {/* ... same table structure as above ... */}
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('orderbook.id')}</TableHead>
                        <TableHead>{t('orderbook.buyer')}</TableHead>
                        <TableHead>{t('orderbook.commodity')}</TableHead>
                        <TableHead>{t('orderbook.quantity')}</TableHead>
                        <TableHead>{t('orderbook.grade')}</TableHead>
                        <TableHead>{t('orderbook.delivery')}</TableHead>
                        <TableHead>{t('orderbook.expiry')}</TableHead>
                        <TableHead>{t('orderbook.status')}</TableHead>
                        <TableHead className="text-right">{t('orderbook.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrderBooks.length > 0 ? (
                        filteredOrderBooks.map((orderBook) => (
                          <TableRow key={orderBook.id}>
                            <TableCell className="font-medium">{orderBook.id}</TableCell>
                            <TableCell>{orderBook.buyerName}</TableCell>
                            <TableCell>{orderBook.commodityType}</TableCell>
                            <TableCell>
                              {orderBook.quantity} {orderBook.unit}
                            </TableCell>
                            <TableCell>{orderBook.requestedGrade}</TableCell>
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
                          <TableCell colSpan={9} className="py-8 text-center text-gray-500">
                            {t('orderbook.notfound')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                {/* ... similar structure ... */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('orderbook.id')}</TableHead>
                        <TableHead>{t('orderbook.buyer')}</TableHead>
                        <TableHead>{t('orderbook.commodity')}</TableHead>
                        <TableHead>{t('orderbook.quantity')}</TableHead>
                        <TableHead>{t('orderbook.grade')}</TableHead>
                        <TableHead>{t('orderbook.delivery')}</TableHead>
                        <TableHead>{t('orderbook.expiry')}</TableHead>
                        <TableHead>{t('orderbook.status')}</TableHead>
                        <TableHead className="text-right">{t('orderbook.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrderBooks.length > 0 ? (
                        filteredOrderBooks.map((orderBook) => (
                          <TableRow key={orderBook.id}>
                            <TableCell className="font-medium">{orderBook.id}</TableCell>
                            <TableCell>{orderBook.buyerName}</TableCell>
                            <TableCell>{orderBook.commodityType}</TableCell>
                            <TableCell>
                              {orderBook.quantity} {orderBook.unit}
                            </TableCell>
                            <TableCell>{orderBook.requestedGrade}</TableCell>
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
                          <TableCell colSpan={9} className="py-8 text-center text-gray-500">
                            {t('orderbook.notfound')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="expired" className="mt-0">
                {/* ... similar structure ... */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('orderbook.id')}</TableHead>
                        <TableHead>{t('orderbook.buyer')}</TableHead>
                        <TableHead>{t('orderbook.commodity')}</TableHead>
                        <TableHead>{t('orderbook.quantity')}</TableHead>
                        <TableHead>{t('orderbook.grade')}</TableHead>
                        <TableHead>{t('orderbook.delivery')}</TableHead>
                        <TableHead>{t('orderbook.expiry')}</TableHead>
                        <TableHead>{t('orderbook.status')}</TableHead>
                        <TableHead className="text-right">{t('orderbook.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrderBooks.length > 0 ? (
                        filteredOrderBooks.map((orderBook) => (
                          <TableRow key={orderBook.id}>
                            <TableCell className="font-medium">{orderBook.id}</TableCell>
                            <TableCell>{orderBook.buyerName}</TableCell>
                            <TableCell>{orderBook.commodityType}</TableCell>
                            <TableCell>
                              {orderBook.quantity} {orderBook.unit}
                            </TableCell>
                            <TableCell>{orderBook.requestedGrade}</TableCell>
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
                          <TableCell colSpan={9} className="py-8 text-center text-gray-500">
                            {t('orderbook.notfound')}
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
    </MainLayout>
  );
};

export default OrderBook;
