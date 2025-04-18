import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Komoditas from "./pages/Komoditas";
import KomoditasDetail from "./pages/KomoditasDetail";
import Saldo from "./pages/Saldo";
import Transaksi from "./pages/Transaksi";
import TransaksiDetail from "./pages/TransaksiDetail";
import OrderBookDetail from "./pages/OrderBookDetail";
import Harga from "./pages/Harga";
import Pengiriman from "./pages/Pengiriman";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import BlockchainVerification from "./pages/BlockchainVerification";
import TransactionDetail from "./pages/TransactionDetail";

// New buyer-specific pages
import Market from "./pages/buyer/Market";
import MarketDetail from "./pages/buyer/MarketDetail";
import BuyTransaction from "./pages/buyer/BuyTransaction";
import TransactionNegotiation from "./pages/buyer/TransactionNegotiation";
import OrderBookList from "./pages/buyer/OrderBookList"; // Buyer order book list

// New farmer-specific pages
import TransactionManagement from "./pages/farmer/TransactionManagement";
import OrderBookApproval from "./pages/farmer/OrderBookApproval";
import TransactionPriceSubmitted from "./pages/farmer/TransactionPriceSubmitted";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Simplistic auth check for demo purposes
const isAuthenticated = () => {
  // In a real app, this would check for a token, session, etc.
  // For demo, we'll assume user is authenticated unless explicitly directed to login
  return true;
};

const App = () => (
  <DynamicContextProvider
  settings={{
    environmentId: "8becfdc4-eadf-4f17-9d46-4dfff0abf098",
    walletConnectors: [SolanaWalletConnectors],
  }}
>
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root path to dashboard if authenticated, otherwise to login */}
            <Route path="/" element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Farmer routes */}
            <Route path="/komoditas" element={<Komoditas />} />
            <Route path="/komoditas/:id" element={<KomoditasDetail />} />
            <Route path="/saldo" element={<Saldo />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/transaksi/:id" element={<TransaksiDetail />} />
            <Route path="/order-book" element={<OrderBookList />} />
            <Route path="/order-book/:id" element={<OrderBookDetail />} />
            <Route path="/harga" element={<Harga />} />
            <Route path="/pengiriman" element={<Pengiriman />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blockchain/:type/:id" element={<BlockchainVerification />} />
            <Route path="/transaction/:id" element={<TransactionDetail />} /> 
            
            {/* New farmer transaction management routes */}
            <Route path="/farmer/transaction/:id" element={<TransactionManagement />} />
            <Route path="/farmer/transaction-price-submitted/:id" element={<TransactionPriceSubmitted />} />
            <Route path="/farmer/order-book/:id" element={<OrderBookApproval />} />
            
            {/* Buyer-specific routes */}
            <Route path="/market" element={<Market />} />
            <Route path="/market/:id" element={<MarketDetail />} />
            <Route path="/buy/:id" element={<BuyTransaction />} />
            <Route path="/transaction-nego/:id" element={<TransactionNegotiation />} />
            <Route path="/buyer/order-book" element={<OrderBookList />} />
            <Route path="/buyer/order-book/:id" element={<OrderBookDetail />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
  <DynamicWidget />
  </DynamicContextProvider>
);

export default App;
