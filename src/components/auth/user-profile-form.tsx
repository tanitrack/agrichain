import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';
import { UserCircle2, User, Phone, MapPin, ArrowRightIcon } from 'lucide-react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { useUserUpdateRequest, useDynamicContext } from '@dynamic-labs/sdk-react-core'; // Make sure this is imported
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
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/lib/convex';

const userProfileSchema = z.object({
  userId: z.string().optional(),
  taniId: z.number().optional(),
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
}

const emptyInitialData = {};

export function UserProfileForm({
  onSuccess,
  initialData = emptyInitialData,
}: UserProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { updateUser } = useUserUpdateRequest();
  const createConvexUser = useMutation(api.users_mutations.createUser);
  const updateConvexUser = useMutation(api.users_mutations.updateUser);
  const userConvex = useQuery(
    api.users_queries.getUserByUserId,
    initialData.userId ? { userId: initialData.userId } : 'skip'
  );
  const { user: dynamicUser } = useDynamicContext(); // Get the full dynamic user object

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

      // Extract Solana public key from Dynamic user context
      let userSolanaPublicKey: string | undefined = undefined;
      if (dynamicUser?.verifiedCredentials) {
        const solanaCredential = dynamicUser.verifiedCredentials.find(
          (cred) => cred.format === 'blockchain' && cred.chain === 'solana'
        );
        if (solanaCredential) {
          userSolanaPublicKey = solanaCredential.address;
        }
      }

      // Update metadata for Dynamic
      const result = await updateUser({
        // This is Dynamic's updateUser
        metadata: { ...data },
      });
      const updatedDynamicUser = result.updateUserProfileResponse.user;
      const metadataFromDynamic = updatedDynamicUser.metadata as UserProfileFormValues; // Cast assuming structure matches

      if (!initialData.taniId && userConvex?._id === undefined) {
        // Check if it's a new Convex user profile
        await createConvexUser({
          userId: updatedDynamicUser.id, // Dynamic's user ID
          email: updatedDynamicUser.email,
          name: metadataFromDynamic.fullName,
          phone: metadataFromDynamic.phoneNumber,
          address: metadataFromDynamic.address,
          nationalIdNumber: metadataFromDynamic.nationalIdNumber,
          userType: metadataFromDynamic.userType,
          solanaPublicKey: userSolanaPublicKey, // Pass it here
        });
      } else if (userConvex?._id) {
        await updateConvexUser({
          convexId: userConvex._id,
          name: metadataFromDynamic.fullName,
          phone: metadataFromDynamic.phoneNumber,
          address: metadataFromDynamic.address,
          nationalIdNumber: metadataFromDynamic.nationalIdNumber,
          userType: metadataFromDynamic.userType,
          solanaPublicKey: userSolanaPublicKey, // Pass it here for updates
        });
      }

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
                <FormLabel className="flex items-center font-medium text-earth-dark-green">
                  <UserCircle2 className="mr-2 h-4 w-4 text-earth-medium-green" />
                  {t('profile.nationalId')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('profile.nationalIdPlaceholder')}
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
                <FormLabel className="flex items-center font-medium text-earth-dark-green">
                  <User className="mr-2 h-4 w-4 text-earth-medium-green" />
                  {t('profile.fullName')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('profile.fullNamePlaceholder')}
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
                <FormLabel className="flex items-center font-medium text-earth-dark-green">
                  <Phone className="mr-2 h-4 w-4 text-earth-medium-green" />
                  {t('profile.phone')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('profile.phonePlaceholder')}
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
                <FormLabel className="flex items-center font-medium text-earth-dark-green">
                  <MapPin className="mr-2 h-4 w-4 text-earth-medium-green" />
                  {t('profile.address')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('profile.addressPlaceholder')}
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
            className="h-12 w-full rounded-full bg-earth-dark-green text-base hover:bg-earth-medium-green"
            disabled={loading}
            type="submit"
          >
            {loading ? t('profile.processing') : t('profile.save')}
            {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
