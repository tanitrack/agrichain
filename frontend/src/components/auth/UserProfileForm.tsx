import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserCircle2, User, Phone, MapPin, ArrowRightIcon } from 'lucide-react';
import { CardContent, CardFooter } from '@/components/ui/card';

interface UserProfileFormProps {
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  initialData?: {
    ktp?: string;
    name?: string;
    phone?: string;
    address?: string;
  };
  userType?: string;
}

export function UserProfileForm({
  onSubmit,
  loading,
  initialData = {},
  userType = 'petani',
}: UserProfileFormProps) {
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4 px-8 pt-6">
        <div className="space-y-2">
          <Label htmlFor="ktp" className="text-earth-dark-green flex items-center font-medium">
            <UserCircle2 className="text-earth-medium-green mr-2 h-4 w-4" />
            {language === 'id' ? 'No. KTP' : 'ID Card Number'}
          </Label>
          <Input
            id="ktp"
            placeholder={language === 'id' ? 'Masukkan nomor KTP' : 'Enter ID card number'}
            required
            defaultValue={initialData.ktp}
            className="border-earth-light-brown focus-visible:ring-earth-dark-green"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-earth-dark-green flex items-center font-medium">
            <User className="text-earth-medium-green mr-2 h-4 w-4" />
            {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
          </Label>
          <Input
            id="name"
            placeholder={language === 'id' ? 'Masukkan nama lengkap' : 'Enter full name'}
            defaultValue={initialData.name}
            className="border-earth-light-brown focus-visible:ring-earth-dark-green"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-earth-dark-green flex items-center font-medium">
            <Phone className="text-earth-medium-green mr-2 h-4 w-4" />
            {language === 'id' ? 'No. HP/Whatsapp' : 'Phone/Whatsapp Number'}
          </Label>
          <Input
            id="phone"
            placeholder={language === 'id' ? 'Masukkan nomor HP' : 'Enter phone number'}
            required
            defaultValue={initialData.phone}
            className="border-earth-light-brown focus-visible:ring-earth-dark-green"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address" className="text-earth-dark-green flex items-center font-medium">
            <MapPin className="text-earth-medium-green mr-2 h-4 w-4" />
            {language === 'id' ? 'Alamat Utama' : 'Main Address'}
          </Label>
          <Input
            id="address"
            placeholder={language === 'id' ? 'Masukkan alamat' : 'Enter address'}
            required
            defaultValue={initialData.address}
            className="border-earth-light-brown focus-visible:ring-earth-dark-green"
          />
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
              ? 'Simpan Profil'
              : 'Save Profile'}
          {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
        </Button>
      </CardFooter>
    </form>
  );
}
