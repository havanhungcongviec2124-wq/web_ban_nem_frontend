import React from 'react';
import Header from './components/Header';
import Foodter from './components/Foodter';
import { Outlet, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import SpiceModal from './components/SpiceModal';
import { IconCheck } from './components/Icons';

const ToastNotification = () => {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-nep-ink text-nep-cream px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm">
        <span className="w-6 h-6 rounded-full bg-nep-green text-white flex items-center justify-center">
          <IconCheck className="w-4 h-4" />
        </span>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-nep-cream text-nep-ink antialiased">
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdmin && <Foodter />}
      <SpiceModal />
      <ToastNotification />
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
};

export default App;
