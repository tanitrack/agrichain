import { MainLayout } from '@/components/layout/main-layout';
import TaniCard from '@/components/tani-card/tani-card';
import { Mail, Phone, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { UserProfileForm } from '@/components/auth/user-profile-form';

const Profile = () => {
  const { userProfile, wallet } = useAuthCheck();

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Profil</h1>
        <p className="text-gray-600">Kelola informasi profil Anda</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Image & Stats */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <div className="group relative mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg" alt="Pak Tani" />
                  <AvatarFallback className="text-3xl">PT</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="ghost" className="text-white">
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <h2 className="mb-1 text-xl font-bold">{userProfile?.name}</h2>
              <Badge
                variant="outline"
                className="mb-3 border-tani-green-dark bg-tani-green-light/30 text-tani-green-dark"
              >
                {userProfile?.userType === 'farmer' ? 'Petani' : 'Konsumen'}
              </Badge>

              <div className="w-full space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  <span className="text-sm">{userProfile?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  <span className="text-sm">{userProfile?.phone}</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{userProfile?.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Informasi Profil</TabsTrigger>
              <TabsTrigger value="tani-card">Tani Card</TabsTrigger>
              <TabsTrigger value="wallet">Solana Wallet</TabsTrigger>

              <TabsTrigger value="farm">Data Pertanian</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {!!userProfile && (
                <UserProfileForm
                  initialData={{
                    userId: userProfile.userId,
                    taniId: userProfile.taniId,
                    nationalIdNumber: userProfile.nationalIdNumber,
                    userType: userProfile.userType,
                    address: userProfile.address,
                    phoneNumber: userProfile.phone,
                    fullName: userProfile.name,
                  }}
                />
              )}
            </TabsContent>

            {/* TODO: Flesh out the details */}

            <TabsContent value="tani-card">
              {!!userProfile && (
                <TaniCard
                  name={userProfile.name}
                  taniId={userProfile.taniId}
                  email={userProfile.email}
                  walletAddress={wallet?.address}
                  showDownloadBtn
                  userType={userProfile.userType}
                />
              )}
            </TabsContent>
            <TabsContent value="wallet">
              {!!userProfile && <div>Wallet Address: {wallet?.address}</div>}
            </TabsContent>
            <TabsContent value="farm"></TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
