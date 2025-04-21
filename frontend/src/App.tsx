import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Komoditas from './pages/Komoditas';
import KomoditasDetail from './pages/KomoditasDetail';
import Saldo from './pages/Saldo';
import Transaksi from './pages/Transaksi';
import TransaksiDetail from './pages/TransaksiDetail';
import OrderBookDetail from './pages/OrderBookDetail';
import Harga from './pages/Harga';
import Pengiriman from './pages/Pengiriman';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import BlockchainVerification from './pages/BlockchainVerification';
import TransactionDetail from './pages/TransactionDetail';

// New buyer-specific pages
import Market from './pages/buyer/Market';
import MarketDetail from './pages/buyer/MarketDetail';
import BuyTransaction from './pages/buyer/BuyTransaction';
import TransactionNegotiation from './pages/buyer/TransactionNegotiation';
import OrderBookList from './pages/buyer/OrderBookList'; // Buyer order book list

// New farmer-specific pages
import TransactionManagement from './pages/farmer/TransactionManagement';
import OrderBookApproval from './pages/farmer/OrderBookApproval';
import TransactionPriceSubmitted from './pages/farmer/TransactionPriceSubmitted';

const App = () => (
  <DynamicContextProvider
    settings={{
      environmentId: '8becfdc4-eadf-4f17-9d46-4dfff0abf098',
      walletConnectors: [SolanaWalletConnectors],
    }}
  >
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Farmer routes */}
            <Route
              path="/komoditas"
              element={
                <ProtectedRoute>
                  <Komoditas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/komoditas/:id"
              element={
                <ProtectedRoute>
                  <KomoditasDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saldo"
              element={
                <ProtectedRoute>
                  <Saldo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaksi"
              element={
                <ProtectedRoute>
                  <Transaksi />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaksi/:id"
              element={
                <ProtectedRoute>
                  <TransaksiDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/harga"
              element={
                <ProtectedRoute>
                  <Harga />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengiriman"
              element={
                <ProtectedRoute>
                  <Pengiriman />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blockchain-verification"
              element={
                <ProtectedRoute>
                  <BlockchainVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transaction/:id"
              element={
                <ProtectedRoute>
                  <TransactionDetail />
                </ProtectedRoute>
              }
            />

            {/* Farmer routes */}
            <Route
              path="/farmer/transaction/:id"
              element={
                <ProtectedRoute>
                  <TransactionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/transaction-price-submitted/:id"
              element={
                <ProtectedRoute>
                  <TransactionPriceSubmitted />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/order-book/:id"
              element={
                <ProtectedRoute>
                  <OrderBookApproval />
                </ProtectedRoute>
              }
            />

            {/* Buyer routes */}
            <Route
              path="/buyer/market"
              element={
                <ProtectedRoute>
                  <Market />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/market/:id"
              element={
                <ProtectedRoute>
                  <MarketDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/transaction"
              element={
                <ProtectedRoute>
                  <BuyTransaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/transaction/:id/negotiation"
              element={
                <ProtectedRoute>
                  <TransactionNegotiation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/order-book"
              element={
                <ProtectedRoute>
                  <OrderBookList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/order-book/:id"
              element={
                <ProtectedRoute>
                  <OrderBookDetail />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </DynamicContextProvider>
);

export default App;
