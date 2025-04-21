import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';
import { UserCircle2, User, Phone, MapPin, ArrowRightIcon } from 'lucide-react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { useDynamicContext, useUserUpdateRequest } from '@dynamic-labs/sdk-react-core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const userProfileSchema = z.object({
  nationalIdNumber: z
    .string()
    .min(16, { message: 'ID number must be 16 digits' })
    .max(16, { message: 'ID number must be 16 digits' })
    .regex(/^\d+$/, { message: 'ID number must contain only numbers' }),
  userType: z.enum(['farmer', 'consumer']),
  address: z
    .string()
    .min(10, { message: 'Address must be at least 10 characters' })
    .max(200, { message: 'Address must not exceed 200 characters' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must not exceed 15 digits' })
    .regex(/^[+]?[\d\s-]+$/, { message: 'Invalid phone number format' }),
  fullName: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' })
    .regex(/^[a-zA-Z\s]*$/, { message: 'Name can only contain letters and spaces' }),
});

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

interface UserProfileFormProps {
  onSuccess?: () => void;
  initialData?: Partial<UserProfileFormValues>;
  userType?: string;
}

export function UserProfileForm({
  onSuccess,
  initialData = {},
  userType = 'petani',
}: UserProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const { user } = useDynamicContext();
  const { updateUser } = useUserUpdateRequest();

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      nationalIdNumber: initialData.nationalIdNumber || '',
      userType: initialData.userType || 'farmer',
      address: initialData.address || '',
      phoneNumber: initialData.phoneNumber || '',
      fullName: initialData.fullName || '',
    },
  });

  const handleSubmit = async (data: UserProfileFormValues) => {
    try {
      setLoading(true);

      if (userType === 'petani') {
        data.userType = 'farmer';
      } else {
        data.userType = 'consumer';
      }

      const updatedUser = await updateUser({
        metadata: data,
      });

      console.log({ updatedUser });

      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <CardContent className="space-y-4 px-8 pt-6">
          <FormField
            control={form.control}
            name="nationalIdNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earth-dark-green flex items-center font-medium">
                  <UserCircle2 className="text-earth-medium-green mr-2 h-4 w-4" />
                  {language === 'id' ? 'No. KTP' : 'ID Card Number'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={language === 'id' ? 'Masukkan nomor KTP' : 'Enter ID card number'}
                    className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earth-dark-green flex items-center font-medium">
                  <User className="text-earth-medium-green mr-2 h-4 w-4" />
                  {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={language === 'id' ? 'Masukkan nama lengkap' : 'Enter full name'}
                    className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earth-dark-green flex items-center font-medium">
                  <Phone className="text-earth-medium-green mr-2 h-4 w-4" />
                  {language === 'id' ? 'No. HP/Whatsapp' : 'Phone/Whatsapp Number'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={language === 'id' ? 'Masukkan nomor HP' : 'Enter phone number'}
                    className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-earth-dark-green flex items-center font-medium">
                  <MapPin className="text-earth-medium-green mr-2 h-4 w-4" />
                  {language === 'id' ? 'Alamat Utama' : 'Main Address'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={language === 'id' ? 'Masukkan alamat' : 'Enter address'}
                    className="border-earth-light-brown focus-visible:ring-earth-dark-green"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </Form>
  );
}
