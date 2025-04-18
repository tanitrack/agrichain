import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Home, 
  Package, 
  Wallet, 
  ShoppingCart, 
  ClipboardList, 
  TrendingUp, 
  Truck,
  User,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Leaf,
  Wheat,
  Sprout,
  Receipt,
  History,
  CheckCircle,
  ShoppingBasket,
  CreditCard,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Links for farmers (default role)
const farmerLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Komoditas", href: "/komoditas", icon: Wheat },
  { name: "Saldo", href: "/saldo", icon: Wallet },
  { name: "Transaksi", href: "/transaksi", icon: ShoppingCart },
  { name: "Order Book", href: "/order-book", icon: ClipboardList },
  { name: "Harga Komoditas", href: "/harga", icon: TrendingUp },
  { name: "Pengiriman", href: "/pengiriman", icon: Truck },
  { name: "Profil", href: "/profile", icon: User },
];

// New links specifically for buyers
const buyerLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Market", href: "/market", icon: Store },
  { name: "Order Book", href: "/order-book", icon: ClipboardList },
  { name: "Saldo", href: "/saldo", icon: Wallet },
  { name: "Transaksi", href: "/transaksi", icon: ShoppingCart },
  { name: "Pengiriman", href: "/pengiriman", icon: Truck },
  { name: "Harga Komoditas", href: "/harga", icon: TrendingUp },
  { name: "Profil", href: "/profile", icon: User },
];

export function Sidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useLanguage();
  
  // Use localStorage to persist the user role
  const [userRole, setUserRole] = useState<"farmer" | "buyer">(() => {
    const savedRole = localStorage.getItem("userRole");
    return (savedRole === "buyer" ? "buyer" : "farmer");
  });
  
  // Save role to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userRole", userRole);
  }, [userRole]);
  
  // Determine which links to show based on user role
  const links = userRole === "farmer" ? farmerLinks : buyerLinks;

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", checkIfMobile);
    checkIfMobile();

    return () => window.removeEventListener("resize", checkIfMobile);
  }, [setOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-gradient-to-b from-[#3a5a40]/95 to-[#3a5a40] border-r border-[#588157]/20 z-50 transition-all duration-300 flex flex-col",
          open ? "w-64" : "w-20",
          isMobile && !open && "-translate-x-full",
          isMobile && open && "translate-x-0 w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#588157]/20">
          {open && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-white/90">
                <img 
                  src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png" 
                  alt="TaniTrack Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-lg font-bold text-white">TaniTrack</h1>
            </Link>
          )}
          {!open && !isMobile && (
            <div className="h-10 w-10 mx-auto rounded-md overflow-hidden flex items-center justify-center bg-white/90">
              <img 
                src="/lovable-uploads/f7fb75ca-ee07-4d12-a8ab-4e5152e13679.png" 
                alt="TaniTrack Logo" 
                className="h-full w-full object-contain"
              />
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-[#588157]/20"
              onClick={() => setOpen(!open)}
            >
              {open ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          )}
        </div>

        {/* Role Switcher - For demonstration purposes */}
        {open && (
          <div className="px-3 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full bg-[#588157]/20 border-[#588157]/30 text-white hover:bg-[#588157]/30 hover:text-white"
                >
                  {userRole === "farmer" ? "Petani" : "Pembeli"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Pilih Peran</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className={cn(userRole === "farmer" && "bg-accent")}
                  onClick={() => setUserRole("farmer")}
                >
                  <Wheat className="mr-2 h-4 w-4" />
                  <span>Petani</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(userRole === "buyer" && "bg-accent")}
                  onClick={() => setUserRole("buyer")}
                >
                  <ShoppingBasket className="mr-2 h-4 w-4" />
                  <span>Pembeli</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.href || 
                (link.href === "/dashboard" && location.pathname === "/");
              
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "sidebar-link",
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#588157]/30 text-white" 
                      : "text-[#a3b18a] hover:bg-[#588157]/10 hover:text-white"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {open && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#588157]/20">
          {open ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-white hover:bg-[#588157]/20">
                  <Avatar className="h-8 w-8 border border-[#588157]/30">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="bg-[#588157]/30 text-white">PT</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">Pak Tani</span>
                    <span className="text-[#a3b18a] text-xs">{userRole === "farmer" ? "Petani" : "Pembeli"}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-[#588157]/20">
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center w-full">
                    <User className="h-4 w-4 mr-2" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center w-full">
                    <Sprout className="h-4 w-4 mr-2" />
                    <span>Pengaturan</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/login" className="flex items-center w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Keluar</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full mx-auto flex justify-center items-center hover:bg-[#588157]/20">
                  <Avatar className="h-8 w-8 border border-[#588157]/30">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="bg-[#588157]/30 text-white">PT</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-[#588157]/20">
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center w-full">
                    <User className="h-4 w-4 mr-2" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center w-full">
                    <Sprout className="h-4 w-4 mr-2" />
                    <span>Pengaturan</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/login" className="flex items-center w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Keluar</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>
    </>
  );
}
