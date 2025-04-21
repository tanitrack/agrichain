import { MainLayout } from '@/components/layout/MainLayout';
import { formatCurrency } from '@/lib/utils';
import {
  Wallet,
  ArrowDownToLine,
  BarChart3,
  AlertCircle,
  Clock,
  ArrowUpRight,
  RefreshCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { TopUpDialog } from '@/components/saldo/TopUpDialog';

const Saldo = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const balance = 24650000; // In IDR, example value
  const solBalance = 98.6; // Example SOL balance
  const conversionRate = 250000; // Example rate: 1 SOL = 250,000 IDR

  const handleWithdraw = () => {
    toast({
      title: language === 'id' ? 'Fitur dalam pengembangan' : 'Feature in development',
      description:
        language === 'id'
          ? 'Penarikan saldo akan segera tersedia dalam waktu dekat.'
          : 'Withdrawal functionality will be available soon.',
      variant: 'default',
    });
    setWithdrawOpen(false);
    setWithdrawAmount('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: language === 'id' ? 'long' : 'short',
      year: 'numeric',
    });
  };

  const transactionHistory = [
    { type: 'masuk', date: '2025-04-25', amount: 5000000, desc: 'Pembayaran Transaksi #TX7821' },
    { type: 'masuk', date: '2025-04-18', amount: 3250000, desc: 'Pembayaran Transaksi #TX7643' },
    { type: 'keluar', date: '2025-04-10', amount: 1500000, desc: 'Penarikan ke BCA ****6789' },
    { type: 'masuk', date: '2025-04-05', amount: 7450000, desc: 'Pembayaran Order Book #OB221' },
  ];

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-earth-dark-green mb-2 text-2xl font-bold">{t('balance.title')}</h1>
        <p className="text-earth-medium-green">
          {t('balance.title') === 'Balance'
            ? 'Manage your account balance'
            : 'Kelola saldo akun Anda'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-earth-light-green/50 col-span-1 overflow-hidden shadow-md lg:col-span-2">
          <CardHeader className="bg-earth-pale-green border-earth-light-green/30 border-b">
            <CardTitle className="text-earth-dark-green flex items-center">
              <Wallet className="text-earth-medium-green mr-2 h-5 w-5" />
              {t('balance.available')}
            </CardTitle>
            <CardDescription className="text-earth-medium-green">
              {t('balance.title') === 'Balance'
                ? 'Available balance in IDR and SOL'
                : 'Saldo tersedia dalam IDR dan SOL'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col gap-6 md:flex-row">
              <div className="border-earth-light-green/50 from-earth-pale-green flex-1 rounded-lg border bg-gradient-to-br to-white p-6 shadow-sm">
                <div className="text-earth-dark-green mb-1 text-sm font-medium">
                  {language === 'id' ? 'Saldo IDR' : 'IDR Balance'}
                </div>
                <div className="text-earth-dark-green mb-4 text-3xl font-bold">
                  {formatCurrency(balance)}
                </div>
                <div className="text-earth-medium-green flex items-center text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  {language === 'id' ? 'Terakhir diperbarui: ' : 'Last updated: '}
                  {new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                    day: 'numeric',
                    month: language === 'id' ? 'long' : 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="border-earth-light-green/50 from-earth-pale-green flex-1 rounded-lg border bg-gradient-to-br to-white p-6 shadow-sm">
                <div className="text-earth-dark-green mb-1 text-sm font-medium">
                  {language === 'id' ? 'Saldo SOL' : 'SOL Balance'}
                </div>
                <div className="text-earth-dark-green mb-4 text-3xl font-bold">
                  {solBalance} SOL
                </div>
                <div className="text-earth-medium-green flex items-center text-xs">
                  <RefreshCcw className="mr-1 h-3 w-3" />
                  {language === 'id' ? 'Setara dengan ' : 'Equivalent to '}
                  {formatCurrency(solBalance * conversionRate)}
                </div>
              </div>
            </div>

            <Alert className="bg-earth-clay/20 text-earth-dark-green border-earth-clay">
              <AlertCircle className="text-earth-brown h-4 w-4" />
              <AlertTitle className="text-earth-brown">
                {t('info.processing') === 'Processing your request' ? 'Information' : 'Informasi'}
              </AlertTitle>
              <AlertDescription className="text-earth-medium-green">
                {language === 'id'
                  ? `Saldo SOL bisa digunakan untuk transaksi pada platform TaniTrack. Nilai tukar 1 SOL = ${formatCurrency(conversionRate)}`
                  : `SOL balance can be used for transactions on the TaniTrack platform. Exchange rate: 1 SOL = ${formatCurrency(conversionRate)}`}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="bg-earth-pale-green/50 flex justify-end gap-4 p-6">
            <TopUpDialog />
            <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-earth-medium-green text-earth-dark-green hover:bg-earth-pale-green gap-2"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  {language === 'id' ? 'Tarik Saldo' : 'Withdraw'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{language === 'id' ? 'Tarik Saldo' : 'Withdraw Funds'}</DialogTitle>
                  <DialogDescription>
                    {language === 'id'
                      ? 'Tarik saldo Anda ke rekening bank yang terdaftar'
                      : 'Withdraw your funds to your registered bank account'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-earth-dark-green">
                      {language === 'id' ? 'Jumlah Penarikan (IDR)' : 'Withdrawal Amount (IDR)'}
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={language === 'id' ? 'Masukkan jumlah' : 'Enter amount'}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="border-earth-light-green focus:border-earth-medium-green"
                    />
                  </div>
                  <Alert className="bg-earth-wheat/30 text-earth-brown border-earth-wheat">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {language === 'id'
                        ? 'Fitur penarikan saldo sedang dalam pengembangan dan akan segera tersedia.'
                        : 'Withdrawal feature is under development and will be available soon.'}
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setWithdrawOpen(false)}
                    className="border-earth-light-green text-earth-dark-green"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleWithdraw}
                    className="bg-earth-dark-green hover:bg-earth-medium-green"
                  >
                    {language === 'id' ? 'Tarik Saldo' : 'Withdraw'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card className="border-earth-light-green/50 overflow-hidden shadow-md">
          <CardHeader className="bg-earth-pale-green border-earth-light-green/30 border-b">
            <CardTitle className="text-earth-dark-green flex items-center">
              <BarChart3 className="text-earth-medium-green mr-2 h-5 w-5" />
              {language === 'id' ? 'Aktivitas Saldo' : 'Balance Activity'}
            </CardTitle>
            <CardDescription className="text-earth-medium-green">
              {language === 'id'
                ? 'Riwayat mutasi saldo terakhir'
                : 'Recent balance transaction history'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {transactionHistory.map((item, i) => (
                <div
                  key={i}
                  className="border-earth-light-green/30 hover:bg-earth-pale-green/30 flex items-center justify-between rounded border-b p-2 pb-3 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full ${
                        item.type === 'masuk'
                          ? 'bg-earth-light-green/30 text-earth-dark-green'
                          : 'bg-earth-clay/30 text-earth-brown'
                      }`}
                    >
                      {item.type === 'masuk' ? (
                        <ArrowDownToLine className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-earth-dark-green text-sm font-medium">{item.desc}</div>
                      <div className="text-earth-medium-green text-xs">{formatDate(item.date)}</div>
                    </div>
                  </div>
                  <div
                    className={`font-medium ${item.type === 'masuk' ? 'text-earth-dark-green' : 'text-earth-brown'}`}
                  >
                    {item.type === 'masuk' ? '+' : '-'} {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-earth-pale-green/50">
            <Button
              variant="link"
              className="text-earth-medium-green hover:text-earth-dark-green mx-auto"
            >
              {language === 'id' ? 'Lihat Semua Aktivitas' : 'View All Activities'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Saldo;
