import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, FileText, Edit, QrCode, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export interface KomoditasItem {
  // Required fields from Convex schema
  _id: string;
  _creationTime: number;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  stock: number;
  createdBy: string;
  updatedAt: number;

  // Optional fields from Convex schema
  description?: string;
  imageUrl: string;

  // UI compatibility fields with default values
  id: string;
  type: string;
  quantity: number;
  location: string;
  grade: string;
  createdAt: string;
}

interface KomoditasRowProps {
  item: KomoditasItem;
  onViewDetail: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShowQR?: (id: string) => void;
}

export const KomoditasRow = ({
  item,
  onViewDetail,
  onEdit,
  onDelete,
  onShowQR,
}: KomoditasRowProps) => {
  const { t } = useLanguage();

  return (
    <TableRow className="hover:bg-earth-pale-green cursor-pointer" onClick={() => onViewDetail(item.id)}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-earth-light-green/20">
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="font-medium text-earth-dark-green">{item.name}</div>
            <div className="text-xs text-earth-medium-green">{item.id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-earth-dark-green">{item.type}</TableCell>
      <TableCell className="hidden text-earth-dark-green md:table-cell">
        {item.quantity.toLocaleString()} {item.unit}
      </TableCell>
      <TableCell className="hidden text-earth-dark-green lg:table-cell">{item.location}</TableCell>
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
              onClick={() => onViewDetail(item.id)}
              className="text-earth-dark-green hover:bg-earth-light-green/20"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('action.view')}
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem
                onClick={() => onEdit(item.id)}
                className="text-earth-dark-green hover:bg-earth-light-green/20"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t('action.edit')}
              </DropdownMenuItem>
            )}
            {onShowQR && (
              <DropdownMenuItem
                onClick={() => onShowQR(item.id)}
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
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('action.delete')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
