import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Store,
  FileCheck,
  Leaf,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  UserCircle2,
} from 'lucide-react';
import { TaniTrackCard } from '@/components/custom/TaniTrackCard';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('petani');

  const handleRegister = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setLoading(true);

    // Simulate registration
    setTimeout(() => {
      toast({
        title:
          type === 'petani'
            ? language === 'id'
              ? 'Pendaftaran petani berhasil!'
              : 'Farmer registration successful!'
            : language === 'id'
              ? 'Pendaftaran konsumen berhasil!'
              : 'Buyer registration successful!',
        description:
          language === 'id' ? 'Silakan masuk ke akun Anda' : 'Please log in to your account',
      });
      navigate('/login');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="from-earth-pale-green flex min-h-screen flex-col overflow-hidden bg-gradient-to-br to-white md:flex-row">
      {/* Left Section - Visual & Information */}
      <div className="relative flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="bg-earth-light-green/20 absolute -bottom-64 -left-64 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-earth-wheat/30 absolute -right-64 -top-64 h-96 w-96 rounded-full blur-3xl" />

        <div className="z-10 mx-auto max-w-md">
          <div className="mb-6 flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-white/90">
              <img
                src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png"
                alt="TaniTrack Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-earth-dark-green text-4xl font-bold">TaniTrack</h1>
          </div>

          <h2 className="text-earth-dark-green mb-6 text-2xl font-bold">
            {activeTab === 'petani'
              ? language === 'id'
                ? 'Daftar sebagai Petani'
                : 'Register as Farmer'
              : language === 'id'
                ? 'Daftar sebagai Konsumen'
                : 'Register as Buyer'}
          </h2>

          <div className="border-earth-light-green/50 mb-6 rounded-lg border bg-white p-5 shadow-md">
            <h3 className="text-earth-dark-green mb-3 text-lg font-semibold">
              {activeTab === 'petani'
                ? language === 'id'
                  ? 'Manfaat untuk Petani:'
                  : 'Benefits for Farmers:'
                : language === 'id'
                  ? 'Manfaat untuk Konsumen:'
                  : 'Benefits for Buyers:'}
            </h3>

            {activeTab === 'petani' ? (
              <ul className="space-y-3">
                <li className="text-earth-dark-green flex items-center">
                  <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
                    <ShoppingBag className="text-earth-dark-green h-4 w-4" />
                  </div>
                  <span>
                    {language === 'id'
                      ? 'Jual hasil panen langsung ke konsumen'
                      : 'Sell harvest directly to buyers'}
                  </span>
                </li>
                <li className="text-earth-dark-green flex items-center">
                  <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
                    <FileCheck className="text-earth-dark-green h-4 w-4" />
                  </div>
                  <span>
                    {language === 'id'
                      ? 'Lacak pertumbuhan tanaman & hasil panen'
                      : 'Track crop growth & harvest yields'}
                  </span>
                </li>
                <li className="text-earth-dark-green flex items-center">
                  <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
                    <Store className="text-earth-dark-green h-4 w-4" />
                  </div>
                  <span>
                    {language === 'id'
                      ? 'Dapatkan harga pasar yang lebih baik'
                      : 'Get better market prices'}
                  </span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-3">
                <li className="text-earth-dark-green flex items-center">
                  <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
                    <ShoppingBag className="text-earth-dark-green h-4 w-4" />
                  </div>
                  <span>
                    {language === 'id'
                      ? 'Beli produk pertanian segar langsung dari petani'
                      : 'Buy fresh agricultural products directly from farmers'}
                  </span>
                </li>
                <li className="text-earth-dark-green flex items-center">
                  <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
                    <FileCheck className="text-earth-dark-green h-4 w-4" />
                  </div>
                  <span>
                    {language === 'id'
                      ? 'Lacak asal-usul produk yang Anda beli'
                      : 'Track the origin of products you buy'}
                  </span>
                </li>
                <li className="text-earth-dark-green flex items-center">
                  <div className="bg-earth-pale-green mr-3 rounded-full p-1.5">
                    <Store className="text-earth-dark-green h-4 w-4" />
                  </div>
                  <span>
                    {language === 'id'
                      ? 'Dukung petani lokal dan pertanian berkelanjutan'
                      : 'Support local farmers and sustainable agriculture'}
                  </span>
                </li>
              </ul>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            {activeTab === 'petani' ? (
              <TaniTrackCard type="farmer" name="AGUS SURYANA" id="F-230599-JB" />
            ) : (
              <TaniTrackCard
                type="buyer"
                name="PT PANGAN SEJAHTERA"
                id="B-451022-JK"
                location="JAKARTA"
                expiryDate="09/2025"
              />
            )}
          </div>
        </div>

        {/* Language Switcher positioned at bottom right */}
        <div className="absolute bottom-4 right-4">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 md:bg-transparent">
        <Card className="border-earth-light-brown/40 w-full max-w-md overflow-hidden bg-white shadow-lg backdrop-blur-sm md:bg-white/95">
          <Tabs defaultValue="petani" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-earth-pale-green grid w-full grid-cols-2">
              <TabsTrigger
                value="petani"
                className="data-[state=active]:bg-earth-dark-green text-earth-dark-green data-[state=active]:text-white"
              >
                {language === 'id' ? 'Petani' : 'Farmer'}
              </TabsTrigger>
              <TabsTrigger
                value="konsumen"
                className="data-[state=active]:bg-earth-dark-green text-earth-dark-green data-[state=active]:text-white"
              >
                {language === 'id' ? 'Konsumen' : 'Buyer'}
              </TabsTrigger>
            </TabsList>

            <CardHeader className="from-earth-dark-green to-earth-medium-green bg-gradient-to-r py-6 text-white">
              <CardTitle className="text-center text-2xl">
                {language === 'id' ? 'Pendaftaran' : 'Registration'}
              </CardTitle>
              <CardDescription className="mt-2 text-center text-white/90">
                {activeTab === 'petani'
                  ? language === 'id'
                    ? 'Isi formulir untuk mendaftar sebagai petani'
                    : 'Fill the form to register as a farmer'
                  : language === 'id'
                    ? 'Isi formulir untuk mendaftar sebagai konsumen'
                    : 'Fill the form to register as a buyer'}
              </CardDescription>
            </CardHeader>

            <TabsContent value="petani">
              <form onSubmit={(e) => handleRegister(e, 'petani')}>
                <CardContent className="space-y-4 px-8 pt-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="ktp"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <UserCircle2 className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'No. KTP' : 'ID Card Number'}
                    </Label>
                    <Input
                      id="ktp"
                      placeholder={
                        language === 'id' ? 'Masukkan nomor KTP' : 'Enter ID card number'
                      }
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <User className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'Nama (Opsional)' : 'Name (Optional)'}
                    </Label>
                    <Input
                      id="name"
                      placeholder={language === 'id' ? 'Masukkan nama lengkap' : 'Enter full name'}
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="hp"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <Phone className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'No. HP/Whatsapp' : 'Phone/Whatsapp Number'}
                    </Label>
                    <Input
                      id="hp"
                      placeholder={language === 'id' ? 'Masukkan nomor HP' : 'Enter phone number'}
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <MapPin className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'Alamat Utama' : 'Main Address'}
                    </Label>
                    <Input
                      id="address"
                      placeholder={language === 'id' ? 'Masukkan alamat' : 'Enter address'}
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mother" className="text-earth-dark-green font-medium">
                      {language === 'id' ? 'Nama Ibu Kandung' : "Mother's Name"}
                    </Label>
                    <Input
                      id="mother"
                      placeholder={
                        language === 'id' ? 'Masukkan nama ibu kandung' : "Enter mother's name"
                      }
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      required
                      className="border-earth-medium-green text-earth-dark-green data-[state=checked]:bg-earth-dark-green data-[state=checked]:text-white"
                    />
                    <label
                      htmlFor="terms"
                      className="text-earth-dark-green text-sm font-medium leading-none"
                    >
                      {language === 'id'
                        ? 'Saya menyetujui syarat dan ketentuan'
                        : 'I agree to the terms and conditions'}
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 px-8 pb-6">
                  <Button
                    className="bg-earth-dark-green hover:bg-earth-medium-green h-12 w-full rounded-full text-base"
                    disabled={loading}
                    type="submit"
                  >
                    {loading
                      ? language === 'id'
                        ? 'Memproses...'
                        : 'Processing...'
                      : language === 'id'
                        ? 'Daftar Sekarang'
                        : 'Register Now'}
                    {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
                  </Button>
                  <div className="text-earth-dark-green text-center text-sm">
                    {language === 'id' ? 'Sudah punya akun? ' : 'Already have an account? '}
                    <Link
                      to="/login"
                      className="text-earth-medium-green font-semibold hover:underline"
                    >
                      {language === 'id' ? 'Masuk di sini' : 'Log in here'}
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="konsumen">
              <form onSubmit={(e) => handleRegister(e, 'konsumen')}>
                <CardContent className="space-y-4 px-8 pt-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="ktp-konsumen"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <UserCircle2 className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'No. KTP' : 'ID Card Number'}
                    </Label>
                    <Input
                      id="ktp-konsumen"
                      placeholder={
                        language === 'id' ? 'Masukkan nomor KTP' : 'Enter ID card number'
                      }
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="name-konsumen"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <User className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'Nama (Opsional)' : 'Name (Optional)'}
                    </Label>
                    <Input
                      id="name-konsumen"
                      placeholder={language === 'id' ? 'Masukkan nama lengkap' : 'Enter full name'}
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="merchant"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <Store className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'Nama Perusahaan/Merchant' : 'Company/Merchant Name'}
                    </Label>
                    <Input
                      id="merchant"
                      placeholder={
                        language === 'id' ? 'Masukkan nama perusahaan' : 'Enter company name'
                      }
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="hp-konsumen"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <Phone className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'No. HP/Whatsapp' : 'Phone/Whatsapp Number'}
                    </Label>
                    <Input
                      id="hp-konsumen"
                      placeholder={language === 'id' ? 'Masukkan nomor HP' : 'Enter phone number'}
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address-konsumen"
                      className="text-earth-dark-green flex items-center font-medium"
                    >
                      <MapPin className="text-earth-medium-green mr-2 h-4 w-4" />
                      {language === 'id' ? 'Alamat Utama' : 'Main Address'}
                    </Label>
                    <Input
                      id="address-konsumen"
                      placeholder={language === 'id' ? 'Masukkan alamat' : 'Enter address'}
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mother-konsumen" className="text-earth-dark-green font-medium">
                      {language === 'id' ? 'Nama Ibu Kandung' : "Mother's Name"}
                    </Label>
                    <Input
                      id="mother-konsumen"
                      placeholder={
                        language === 'id' ? 'Masukkan nama ibu kandung' : "Enter mother's name"
                      }
                      required
                      className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    />
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Checkbox
                      id="terms-konsumen"
                      required
                      className="border-earth-medium-green text-earth-dark-green data-[state=checked]:bg-earth-dark-green data-[state=checked]:text-white"
                    />
                    <label
                      htmlFor="terms-konsumen"
                      className="text-earth-dark-green text-sm font-medium leading-none"
                    >
                      {language === 'id'
                        ? 'Saya menyetujui syarat dan ketentuan'
                        : 'I agree to the terms and conditions'}
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 px-8 pb-6">
                  <Button
                    className="bg-earth-dark-green hover:bg-earth-medium-green h-12 w-full rounded-full text-base"
                    disabled={loading}
                    type="submit"
                  >
                    {loading
                      ? language === 'id'
                        ? 'Memproses...'
                        : 'Processing...'
                      : language === 'id'
                        ? 'Daftar Sekarang'
                        : 'Register Now'}
                    {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
                  </Button>
                  <div className="text-earth-dark-green text-center text-sm">
                    {language === 'id' ? 'Sudah punya akun? ' : 'Already have an account? '}
                    <Link
                      to="/login"
                      className="text-earth-medium-green font-semibold hover:underline"
                    >
                      {language === 'id' ? 'Masuk di sini' : 'Log in here'}
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
