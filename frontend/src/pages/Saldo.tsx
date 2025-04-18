import { MainLayout } from "@/components/layout/MainLayout";
import { formatCurrency } from "@/lib/utils";
import { Wallet, ArrowDownToLine, BarChart3, AlertCircle, CreditCard, Clock, ArrowUpRight, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { TopUpDialog } from "@/components/saldo/TopUpDialog";

const Saldo = () => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const balance = 24650000; // In IDR, example value
  const solBalance = 98.6; // Example SOL balance
  const conversionRate = 250000; // Example rate: 1 SOL = 250,000 IDR

  const handleWithdraw = () => {
    toast({
      title: language === 'id' ? "Fitur dalam pengembangan" : "Feature in development",
      description: language === 'id' 
        ? "Penarikan saldo akan segera tersedia dalam waktu dekat." 
        : "Withdrawal functionality will be available soon.",
      variant: "default",
    });
    setWithdrawOpen(false);
    setWithdrawAmount("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { 
      day: 'numeric', 
      month: language === 'id' ? 'long' : 'short', 
      year: 'numeric' 
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
        <h1 className="text-2xl font-bold text-earth-dark-green mb-2">{t("balance.title")}</h1>
        <p className="text-earth-medium-green">{t("balance.title") === "Balance" ? "Manage your account balance" : "Kelola saldo akun Anda"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 shadow-md border-earth-light-green/50 overflow-hidden">
          <CardHeader className="bg-earth-pale-green border-b border-earth-light-green/30">
            <CardTitle className="flex items-center text-earth-dark-green">
              <Wallet className="h-5 w-5 mr-2 text-earth-medium-green" />
              {t("balance.available")}
            </CardTitle>
            <CardDescription className="text-earth-medium-green">{t("balance.title") === "Balance" ? "Available balance in IDR and SOL" : "Saldo tersedia dalam IDR dan SOL"}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1 p-6 rounded-lg border border-earth-light-green/50 bg-gradient-to-br from-earth-pale-green to-white shadow-sm">
                <div className="text-sm font-medium text-earth-dark-green mb-1">{language === 'id' ? 'Saldo IDR' : 'IDR Balance'}</div>
                <div className="text-3xl font-bold text-earth-dark-green mb-4">{formatCurrency(balance)}</div>
                <div className="text-xs text-earth-medium-green flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {language === 'id' ? 'Terakhir diperbarui: ' : 'Last updated: '}
                  {new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { 
                    day: 'numeric', 
                    month: language === 'id' ? 'long' : 'short', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
              
              <div className="flex-1 p-6 rounded-lg border border-earth-light-green/50 bg-gradient-to-br from-earth-pale-green to-white shadow-sm">
                <div className="text-sm font-medium text-earth-dark-green mb-1">{language === 'id' ? 'Saldo SOL' : 'SOL Balance'}</div>
                <div className="text-3xl font-bold text-earth-dark-green mb-4">{solBalance} SOL</div>
                <div className="text-xs text-earth-medium-green flex items-center">
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  {language === 'id' ? 'Setara dengan ' : 'Equivalent to '}
                  {formatCurrency(solBalance * conversionRate)}
                </div>
              </div>
            </div>
            
            <Alert className="bg-earth-clay/20 text-earth-dark-green border-earth-clay">
              <AlertCircle className="h-4 w-4 text-earth-brown" />
              <AlertTitle className="text-earth-brown">{t("info.processing") === "Processing your request" ? "Information" : "Informasi"}</AlertTitle>
              <AlertDescription className="text-earth-medium-green">
                {language === 'id' 
                  ? `Saldo SOL bisa digunakan untuk transaksi pada platform TaniTrack. Nilai tukar 1 SOL = ${formatCurrency(conversionRate)}`
                  : `SOL balance can be used for transactions on the TaniTrack platform. Exchange rate: 1 SOL = ${formatCurrency(conversionRate)}`
                }
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 p-6 bg-earth-pale-green/50">
            <TopUpDialog />
            <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-earth-medium-green text-earth-dark-green hover:bg-earth-pale-green">
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
                      : 'Withdraw your funds to your registered bank account'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-earth-dark-green">{language === 'id' ? 'Jumlah Penarikan (IDR)' : 'Withdrawal Amount (IDR)'}</Label>
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
                        : 'Withdrawal feature is under development and will be available soon.'
                      }
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setWithdrawOpen(false)} className="border-earth-light-green text-earth-dark-green">
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </Button>
                  <Button onClick={handleWithdraw} className="bg-earth-dark-green hover:bg-earth-medium-green">
                    {language === 'id' ? 'Tarik Saldo' : 'Withdraw'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card className="shadow-md border-earth-light-green/50 overflow-hidden">
          <CardHeader className="bg-earth-pale-green border-b border-earth-light-green/30">
            <CardTitle className="flex items-center text-earth-dark-green">
              <BarChart3 className="h-5 w-5 mr-2 text-earth-medium-green" />
              {language === 'id' ? 'Aktivitas Saldo' : 'Balance Activity'}
            </CardTitle>
            <CardDescription className="text-earth-medium-green">{language === 'id' ? 'Riwayat mutasi saldo terakhir' : 'Recent balance transaction history'}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {transactionHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between pb-3 border-b border-earth-light-green/30 hover:bg-earth-pale-green/30 p-2 rounded transition-colors">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      item.type === 'masuk' ? 'bg-earth-light-green/30 text-earth-dark-green' : 'bg-earth-clay/30 text-earth-brown'
                    }`}>
                      {item.type === 'masuk' ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-earth-dark-green">{item.desc}</div>
                      <div className="text-xs text-earth-medium-green">{formatDate(item.date)}</div>
                    </div>
                  </div>
                  <div className={`font-medium ${item.type === 'masuk' ? 'text-earth-dark-green' : 'text-earth-brown'}`}>
                    {item.type === 'masuk' ? '+' : '-'} {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-earth-pale-green/50">
            <Button variant="link" className="mx-auto text-earth-medium-green hover:text-earth-dark-green">
              {language === 'id' ? 'Lihat Semua Aktivitas' : 'View All Activities'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Saldo;
