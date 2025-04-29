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

export const PriceRow = ({
    item,
    onViewDetail,
    onEdit,
    onDelete,
    onShowQR,
}: PriceRowProps) => {
    const { t } = useLanguage();

    return (
        <TableRow className="hover:bg-earth-pale-green">
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-earth-light-green/20">
                        <img src={''} alt={item.name} className="h-full w-full object-cover" />
                    </div>
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
            <TableCell className="hidden text-earth-dark-green lg:table-cell">{item.prediction}</TableCell>
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
            </TableCell>
        </TableRow>
    );
};