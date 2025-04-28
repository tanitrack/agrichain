import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/language-context';
import { PriceRow, type PriceItem } from './price-row';

interface PriceTableProps {
    data: PriceItem[];
    onViewDetail: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onShowQR?: (id: string) => void;
    searchQuery?: string;
}

export const PriceTable = ({
    data,
    onViewDetail,
    onEdit,
    onDelete,
    onShowQR,
    searchQuery,
}: PriceTableProps) => {
    const { t } = useLanguage();

    return (
        <Card className="earth-card-wheat">
            <CardHeader className="earth-header-forest pb-3">
                <CardTitle className="flex items-center text-lg text-white">
                    <Package className="mr-2 h-5 w-5" />
                    {t('prices.title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-earth-light-green">
                    <Table>
                        <TableHeader className="bg-earth-light-green/30">
                            <TableRow>
                                <TableHead className="text-earth-dark-green">{t('prices.name')}</TableHead>
                                <TableHead className="text-earth-dark-green">{t('prices.price')}</TableHead>
                                <TableHead className="hidden text-earth-dark-green md:table-cell">
                                    {t('prices.unit')}
                                </TableHead>
                                <TableHead className="hidden text-earth-dark-green lg:table-cell">
                                    {t('prices.forecast')}
                                </TableHead>
                                <TableHead className="text-earth-dark-green">{t('prices.grade')}</TableHead>
                                <TableHead className="text-earth-dark-green">{t('prices.region')}</TableHead>
                                <TableHead className="text-right text-earth-dark-green">
                                    {t('prices.action')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <PriceRow
                                        key={item._id}
                                        item={item}
                                        onViewDetail={onViewDetail}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onShowQR={onShowQR}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-earth-medium-green">
                                        {searchQuery
                                            ? `${t('prices.notfound')} "${searchQuery}"`
                                            : `${t('prices.notfound')}.`}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};