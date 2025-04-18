
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { User, Mail, Phone, MapPin, Edit, Upload, Camera, Save, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  
  // Profile data (placeholder)
  const [profileData, setProfileData] = useState({
    name: "Pak Tani",
    email: "paktani@example.com",
    phone: "081234567890",
    address: "Jl. Pertanian No. 123, Cianjur, Jawa Barat",
    about: "Petani padi dan beras organik dengan pengalaman lebih dari 15 tahun. Memiliki lahan pertanian seluas 5 hektar di daerah Cianjur, Jawa Barat.",
    farmName: "Tani Sejahtera",
    farmSize: "5 hektar",
    mainCrops: "Padi, Jagung, Kedelai",
    bankAccount: {
      bank: "Bank Rakyat Indonesia (BRI)",
      accountName: "Pak Tani",
      accountNumber: "1234567890",
    },
    walletAddress: "0x1234...5678",
  });
  
  // Account statistics
  const accountStats = {
    transactions: 27,
    totalIncome: 153750000,
    rating: 4.8,
    productsListed: 8,
    memberSince: "2023-04-01",
  };
  
  // Handle updating profile data
  const handleSaveProfile = () => {
    toast({
      title: "Profil berhasil diperbarui",
      description: "Informasi profil Anda telah berhasil diperbarui",
    });
    setEditMode(false);
  };
  
  // Handle updating password
  const handleChangePassword = () => {
    toast({
      title: "Kata sandi berhasil diubah",
      description: "Kata sandi Anda telah berhasil diperbarui",
    });
  };
  
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Profil</h1>
        <p className="text-gray-600">Kelola informasi profil Anda</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Image & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative group mb-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg" alt="Pak Tani" />
                  <AvatarFallback className="text-3xl">PT</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Button size="icon" variant="ghost" className="text-white">
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
              <Badge variant="outline" className="bg-tani-green-light/30 border-tani-green-dark text-tani-green-dark mb-3">
                Petani
              </Badge>
              
              <div className="w-full space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{profileData.phone}</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm">{profileData.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Statistik Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Transaksi</span>
                <span className="font-medium">{accountStats.transactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Komoditas Terdaftar</span>
                <span className="font-medium">{accountStats.productsListed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <span className="font-medium">{accountStats.rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Anggota Sejak</span>
                <span className="font-medium">{new Date(accountStats.memberSince).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Informasi Profil</TabsTrigger>
              <TabsTrigger value="farm">Data Pertanian</TabsTrigger>
              <TabsTrigger value="payment">Informasi Pembayaran</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Informasi Profil</CardTitle>
                    <CardDescription>Informasi dasar tentang akun Anda</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? (
                      <Save className="h-4 w-4 mr-2" />
                    ) : (
                      <Edit className="h-4 w-4 mr-2" />
                    )}
                    {editMode ? "Simpan" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      disabled={!editMode}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={!editMode}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      disabled={!editMode}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      disabled={!editMode}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about">Tentang Saya</Label>
                    <Textarea
                      id="about"
                      value={profileData.about}
                      disabled={!editMode}
                      onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {editMode && (
                    <Button onClick={handleSaveProfile}>Simpan Perubahan</Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="farm">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Data Pertanian</CardTitle>
                  <CardDescription>Informasi tentang pertanian Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Nama Pertanian</Label>
                    <Input
                      id="farmName"
                      value={profileData.farmName}
                      disabled={!editMode}
                      onChange={(e) => setProfileData({...profileData, farmName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Luas Lahan</Label>
                    <Input
                      id="farmSize"
                      value={profileData.farmSize}
                      disabled={!editMode}
                      onChange={(e) => setProfileData({...profileData, farmSize: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mainCrops">Komoditas Utama</Label>
                    <Input
                      id="mainCrops"
                      value={profileData.mainCrops}
                      disabled={!editMode}
                      onChange={(e) => setProfileData({...profileData, mainCrops: e.target.value})}
                    />
                  </div>
                  
                  <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-sm font-medium mb-2">Sertifikasi</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Organik
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Good Agricultural Practices
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informasi Pembayaran</CardTitle>
                  <CardDescription>Kelola rekening bank dan dompet digital Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Rekening Bank</h3>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank</span>
                        <span className="font-medium">{profileData.bankAccount.bank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Atas Nama</span>
                        <span className="font-medium">{profileData.bankAccount.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nomor Rekening</span>
                        <span className="font-medium">{profileData.bankAccount.accountNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Dompet Digital (Web3)</h3>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alamat Dompet</span>
                        <span className="font-medium">{profileData.walletAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jaringan</span>
                        <span className="font-medium">Solana</span>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200">
                    <Lock className="h-4 w-4 text-blue-700" />
                    <AlertTitle className="text-blue-700">Informasi Sensitif</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Data pembayaran Anda dilindungi dan dienkripsi. Pastikan untuk selalu menjaga kerahasiaan dan tidak membagikan detail rekening atau dompet digital Anda.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Keamanan</CardTitle>
                  <CardDescription>Kelola keamanan akun Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleChangePassword}>Ubah Kata Sandi</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
