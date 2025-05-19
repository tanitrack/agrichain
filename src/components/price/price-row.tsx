import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { useLanguage } from '@/contexts/language-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export interface PriceItem {
  // Required fields from Convex schema
  _id: string;
  _creationTime: number;
  name: string;
  price: string;
  unit: string;
  prediction: string;
  region?: string;
  updatedAt: number;
  grade: string;
}

interface PriceRowProps {
  item: PriceItem;
  onViewDetail: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShowQR?: (id: string) => void;
}

export const PriceRow = ({ item, onViewDetail, onEdit, onDelete, onShowQR }: PriceRowProps) => {
  const { t } = useLanguage();
  const [selectedCommodity, setSelectedCommodity] = useState<PriceItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Function to handle row click and show details
  const handleRowClick = (commodity: PriceItem) => {
    setSelectedCommodity(commodity);
    setIsDetailDialogOpen(true);
  };

  return (
    <>
      <TableRow className="hover:bg-earth-pale-green">
        <TableCell>
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium text-earth-dark-green">{item.name}</div>
              <div className="text-xs text-earth-medium-green">{item._id}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-earth-dark-green">{item.price}</TableCell>
        <TableCell className="hidden text-earth-dark-green md:table-cell">
          {item.prediction.toLocaleString()} {item.unit}
        </TableCell>
        <TableCell className="hidden text-earth-dark-green lg:table-cell">
          {item.prediction}
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
        <TableCell className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRowClick(item)}
                  className="hover:bg-earth-pale-green"
                >
                  <Eye className="h-4 w-4 text-earth-dark-green transition-colors hover:text-earth-medium-green" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('prices.viewDetail')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        {/* <TableCell className="text-right">
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
              onClick={() => onViewDetail(item._id)}
              className="text-earth-dark-green hover:bg-earth-light-green/20"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('action.view')}
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(item._id)}
                className="text-earth-dark-green hover:bg-earth-light-green/20"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t('action.edit')}
              </DropdownMenuItem>
            )}
            {onShowQR && (
              <DropdownMenuItem
                onClick={() => onShowQR(item._id)}
                className="text-earth-dark-green hover:bg-earth-light-green/20"
              >
                <QrCode className="mr-2 h-4 w-4" />
                {t('commodities.qrcode')}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator className="bg-earth-light-green" />
                <DropdownMenuItem
                  onClick={() => onDelete(item._id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('action.delete')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell> */}
      </TableRow>
      {/* Commodity Price Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {/* {selectedCommodity && (
            <CommodityPriceDetail
              commodity={selectedCommodity}
              priceHistory={commodityPriceHistory[selectedCommodity.id] || []}
              regionalComparison={regionalPriceComparison[selectedCommodity.id] || []}
            />
          )} */}
        </DialogContent>
      </Dialog>
    </>
  );
};
