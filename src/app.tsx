import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/language-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Dashboard from './pages/dashboard';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Komoditas from './pages/farmer/commodity/komoditas';
import KomoditasDetail from './pages/farmer/commodity/komoditas-detail';
import Saldo from './pages/saldo';
import Transaksi from './pages/transaksi';
import TransaksiDetail from './pages/transaksi-detail';
import OrderBookDetail from './pages/order-book-detail';
import Harga from './pages/harga';
import Pengiriman from './pages/pengiriman';
import Profile from './pages/profile';
import NotFound from './pages/not-found';
import BlockchainVerification from './pages/blockchain-verification';
import TransactionDetail from './pages/transaction-detail';

// New buyer-specific pages
import Market from './pages/buyer/market';
import MarketDetail from './pages/buyer/market-detail';
import BuyTransaction from './pages/buyer/buy-transaction';
import TransactionNegotiation from './pages/buyer/transaction-negotiation';
import OrderBookList from './pages/buyer/order-book-list'; // Buyer order book list

// New farmer-specific pages
import TransactionManagement from './pages/farmer/transaction-management';
import OrderBookApproval from './pages/farmer/order-book-approval';
import TransactionPriceSubmitted from './pages/farmer/transaction-price-submitted';

import { ConvexDynamicProvider } from '@/contexts/convex-auth-context';
import RegisterProfile from '@/pages/auth/register-profile';

const App = () => (
  <ConvexDynamicProvider>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-profile" element={<RegisterProfile />} />

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
  </ConvexDynamicProvider>
);

export default App;
