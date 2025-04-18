
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRightIcon, HelpCircle, QrCode, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { TaniTrackCard } from "@/components/custom/TaniTrackCard";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

export default function Login() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      toast({
        title: language === 'id' ? "Kode OTP telah dikirim!" : "OTP code has been sent!",
        description: language === 'id' 
          ? "Silakan masukkan kode OTP yang telah dikirim ke perangkat TaniTrack Mobile Auth App Anda" 
          : "Please enter the OTP code sent to your TaniTrack Mobile Auth App",
      });
      setShowOtpInput(true);
      setLoading(false);
    }, 1000);
  };

  const verifyOtp = () => {
    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      if (otp.length === 6) {
        toast({
          title: language === 'id' ? "Login berhasil!" : "Login successful!",
          description: language === 'id' ? "Selamat datang kembali di TaniTrack" : "Welcome back to TaniTrack",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: language === 'id' ? "Gagal masuk" : "Login failed",
          description: language === 'id' ? "Kode OTP tidak valid" : "Invalid OTP code",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-earth-pale-green to-white overflow-hidden">
      {/* Left Section - Visual & Explanation */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center relative">
        <div className="absolute -bottom-64 -left-64 w-96 h-96 bg-earth-light-green/20 rounded-full blur-3xl" />
        <div className="absolute -top-64 -right-64 w-96 h-96 bg-earth-wheat/30 rounded-full blur-3xl" />
        
        <div className="max-w-md mx-auto z-10">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-md overflow-hidden flex items-center justify-center bg-white/90 mr-4">
              <img 
                src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png" 
                alt="TaniTrack Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-earth-dark-green">TaniTrack</h1>
          </div>
          
          <h2 className="text-2xl font-bold text-earth-dark-green mb-6">
            {language === 'id' 
              ? "Aplikasi Pengelolaan Pertanian untuk Kesejahteraan Petani" 
              : "Agricultural Management App for Farmers' Prosperity"}
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md border border-earth-light-green/50 flex items-start">
              <QrCode className="h-6 w-6 text-earth-medium-green mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1 text-earth-dark-green">
                  {language === 'id' ? "Cara Login" : "How to Login"}
                </h3>
                <p className="text-earth-medium-green text-sm">
                  1. {language === 'id' 
                    ? "Scan TaniTrack Card dengan TaniTrack Mobile Auth App" 
                    : "Scan your TaniTrack Card with TaniTrack Mobile Auth App"}
                </p>
                <p className="text-earth-medium-green text-sm mt-1">
                  2. {language === 'id' 
                    ? "Masukkan kode OTP dari TaniTrack Mobile Auth App ke Form Login" 
                    : "Enter the OTP code from TaniTrack Mobile Auth App to the Login Form"}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md border border-earth-light-green/50 flex items-start">
              <Smartphone className="h-6 w-6 text-earth-medium-green mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1 text-earth-dark-green">
                  {language === 'id' ? "Keamanan Tinggi" : "High Security"}
                </h3>
                <p className="text-earth-medium-green text-sm">
                  {language === 'id'
                    ? "TaniTrack Card menjamin keamanan akun Anda dengan sistem OTP yang terproteksi."
                    : "TaniTrack Card ensures your account security with protected OTP system."}
                </p>
              </div>
            </div>
            
            {/* Stacked cards in perspective view */}
            <div className="mt-8 flex justify-center">
              <div className="relative w-72 h-60 mx-auto">
                {/* Back card (Buyer card) */}
                <TaniTrackCard
                  type="buyer"
                  name="PT PANGAN SEJAHTERA"
                  id="B-451022-JK"
                  location="JAKARTA"
                  expiryDate="09/2025"
                  isStacked={true}
                  stackPosition="back"
                />
                
                {/* Front card (Farmer card) */}
                <TaniTrackCard 
                  type="farmer"
                  name="AGUS SURYANA"
                  id="F-230599-JB"
                  isStacked={true}
                  stackPosition="front"
                  className="z-10 relative transform translate-y-2 -translate-x-2 -rotate-3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Language Switcher positioned at bottom right */}
        <div className="absolute bottom-4 right-4">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-white md:bg-transparent">
        <Card className="w-full max-w-md shadow-lg border-earth-light-brown/40 overflow-hidden bg-white md:bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-earth-dark-green to-earth-medium-green text-white py-6">
            <CardTitle className="text-center text-2xl">
              {language === 'id' ? "Masuk ke TaniTrack" : "Login to TaniTrack"}
            </CardTitle>
            <CardDescription className="text-center text-white/90 mt-2">
              {showOtpInput
                ? (language === 'id' 
                  ? "Masukkan kode OTP yang dikirim ke perangkat Anda" 
                  : "Enter the OTP code sent to your device")
                : (language === 'id' 
                  ? "Masukkan ID TaniTrack untuk memulai" 
                  : "Enter your TaniTrack ID to get started")}
            </CardDescription>
          </CardHeader>

          {!showOtpInput ? (
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-5 pt-6 px-8">
                <div className="space-y-3">
                  <label htmlFor="tanitrack-id" className="text-earth-dark-green font-medium block">
                    {language === 'id' ? "ID TaniTrack" : "TaniTrack ID"}
                  </label>
                  <Input
                    id="tanitrack-id"
                    type="text"
                    placeholder={language === 'id' ? "Masukkan ID TaniTrack" : "Enter TaniTrack ID"}
                    required
                    className="border-earth-light-brown focus-visible:ring-earth-medium-green text-base h-12"
                  />
                  <div className="flex items-start text-xs text-earth-dark-green">
                    <HelpCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-earth-medium-green" />
                    <span>
                      {language === 'id'
                        ? "Format: F-XXXXXX-XX (Petani) atau B-XXXXXX-XX (Konsumen). ID ini terdapat pada kartu TaniTrack Anda."
                        : "Format: F-XXXXXX-XX (Farmer) or B-XXXXXX-XX (Buyer). This ID is on your TaniTrack card."}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8 px-8">
                <Button 
                  type="submit" 
                  className="w-full bg-earth-dark-green hover:bg-earth-medium-green rounded-full h-12 text-base"
                  disabled={loading}
                >
                  {loading 
                    ? (language === 'id' ? "Memproses..." : "Processing...") 
                    : (language === 'id' ? "Lanjutkan" : "Continue")}
                  {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
                </Button>
                <div className="text-sm text-center text-earth-dark-green">
                  {language === 'id' ? "Belum punya akun? " : "Don't have an account? "}
                  <Link
                    to="/register"
                    className="font-semibold text-earth-medium-green hover:underline"
                  >
                    {language === 'id' ? "Daftar sekarang" : "Register now"}
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <div>
              <CardContent className="space-y-6 pt-6 px-8">
                <div className="space-y-3">
                  <p className="text-earth-dark-green font-medium text-center">
                    {language === 'id' ? "Masukkan 6 Digit Kode OTP" : "Enter 6 Digit OTP Code"}
                  </p>
                  <p className="text-sm text-earth-dark-green text-center mb-4">
                    {language === 'id'
                      ? "Kode dikirim ke perangkat yang terhubung dengan TaniTrack Card Anda"
                      : "Code sent to the device connected to your TaniTrack Card"}
                  </p>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="border-earth-medium-green focus-visible:ring-earth-dark-green h-14 w-14 text-xl" />
                        <InputOTPSlot index={1} className="border-earth-medium-green focus-visible:ring-earth-dark-green h-14 w-14 text-xl" />
                        <InputOTPSlot index={2} className="border-earth-medium-green focus-visible:ring-earth-dark-green h-14 w-14 text-xl" />
                        <InputOTPSlot index={3} className="border-earth-medium-green focus-visible:ring-earth-dark-green h-14 w-14 text-xl" />
                        <InputOTPSlot index={4} className="border-earth-medium-green focus-visible:ring-earth-dark-green h-14 w-14 text-xl" />
                        <InputOTPSlot index={5} className="border-earth-medium-green focus-visible:ring-earth-dark-green h-14 w-14 text-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8 px-8">
                <Button 
                  onClick={verifyOtp} 
                  className="w-full bg-earth-dark-green hover:bg-earth-medium-green rounded-full h-12 text-base"
                  disabled={loading || otp.length !== 6}
                >
                  {loading 
                    ? (language === 'id' ? "Memverifikasi..." : "Verifying...") 
                    : (language === 'id' ? "Verifikasi & Masuk" : "Verify & Login")}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-earth-light-brown text-earth-dark-green hover:bg-earth-pale-green rounded-full"
                  onClick={() => setShowOtpInput(false)}
                >
                  {language === 'id' ? "Kembali" : "Back"}
                </Button>
              </CardFooter>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
