import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import { Wheat, Info, Search, Filter, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

// Import Convex hooks and API
import { usePaginatedQuery } from 'convex/react'; // Use usePaginatedQuery
import { api } from '@/lib/convex'; // Assuming api is exported from here

const Market = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch commodities from Convex using the paginated list query
  const {
    results: commodities,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.komoditas_queries.list, // Query name
    {}, // Arguments (none needed for this basic list)
    { initialNumItems: 10 } // Options: initial number of items per page
  );

  const handleViewDetails = (commodityId: string) => {
    navigate(`/market/${commodityId}`);
  };

  // Handle loading state
  if (status === 'LoadingFirstPage') {
    return (
      <MainLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <p>{t('market.loading')}</p>
        </div>
      </MainLayout>
    );
  }

  // Handle no data state
  if (!commodities || commodities.length === 0) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <h2 className="mb-4 text-xl font-semibold">{t('market.noCommodities')}</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('market.title')}</h1>
            <p className="text-muted-foreground">{t('market.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/harga')}
            >
              <TrendingUp className="h-4 w-4" />
              {t('market.seeCurrentPrices')}
            </Button>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="flex flex-col gap-4 rounded-lg border border-earth-light-green/50 bg-[#F2FCE2] p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('market.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-earth-light-green/50 pl-9 focus-visible:ring-earth-medium-green"
            />
          </div>
          <Button
            variant="outline"
            className="border-earth-light-green/50 bg-white text-earth-dark-green"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t('market.filter')}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {commodities.map((commodity) => (
            <Card
              key={commodity._id.toString()}
              className="group overflow-hidden border border-earth-light-brown/30 transition-shadow hover:shadow-md"
            >
              <div className="relative h-40 overflow-hidden bg-gray-100">
                {commodity.imageUrl ? (
                  <img
                    src={commodity.imageUrl}
                    alt={commodity.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-muted-foreground">
                    {t('market.noImage')}
                  </div>
                )}
                <Badge className="absolute right-3 top-3  border">
                  Rp {commodity.pricePerUnit.toLocaleString()} / {commodity.unit}
                </Badge>
              </div>
              <CardHeader className="bg-gradient-to-r from-earth-pale-green to-white pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-earth-dark-green">
                      {commodity.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-earth-medium-green">
                      <Wheat className="h-3.5 w-3.5" />
                      <span>{commodity.category}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('market.farmer')}</span>
                    <span className="font-medium">{commodity.farmersName ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('market.location')}</span>
                    <span>{commodity.address ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('market.stock')}</span>
                    <span>
                      {commodity.stock} {commodity.unit}
                    </span>
                  </div>
                  {commodity.description && (
                    <p className="mt-2 line-clamp-2 text-sm">{commodity.description}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 border-t border-earth-light-brown/20 bg-white">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(commodity._id.toString())}
                  className="border-earth-medium-green/50 text-earth-dark-green hover:bg-earth-pale-green"
                >
                  <Info className="mr-1 h-4 w-4" />
                  {t('market.details')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {status === 'CanLoadMore' && (
          <div className="flex justify-center">
            <Button onClick={() => loadMore(10)} disabled={status !== 'CanLoadMore'}>
              {t('market.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Market;
