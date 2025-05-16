import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LiffProvider } from 'react-liff';
import { CartProvider } from './components/CartContext';
import App from './App.jsx'
import { useState, useEffect } from "react";
import { useNavigation, useLocation } from 'react-router-dom';
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

import SelectReceipt from './pages/partner/SelectReceipt.jsx';

import ConfirmOrder from './pages/partner/ConfirmOrder.jsx';
import PDPA from './pages/partner/PDPA.jsx';
import RegisterPartner from './pages/partner/RegisterPartner.jsx';
import GetMoneyItems from './pages/partner/GetMoneyItems.jsx';
import AddProduct from './pages/partner/AddProduct.jsx';
import ScanQRCode from './pages/partner/ScanQRCode.jsx';
import QrReader from './pages/partner/QrReader.jsx';
import ReceiptModal from './pages/partner/ReceiptModal.jsx';
import GetRedeem from './pages/partner/GetRedeem.jsx';
import GetProductItems from './pages/partner/GetProductItems.jsx';
import Approval from './pages/partner/Approval.jsx';
import LoadingSpinner from './components/LoadingSpinner';
import UpdateShopProfile from './pages/partner/UpdateShopProfile.jsx';

const liffId = import.meta.env.VITE_LIFF_ID;

function AppWithLoader() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    // Set loading to true when navigation starts
    setLoading(true);
  }, [location]);

  useEffect(() => {
    // Set loading to false once navigation is done
    const timeout = setTimeout(() => setLoading(false), 500); // Add slight delay for smoother transition

    return () => clearTimeout(timeout);
  }, [navigation.state]);

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while loading
  }

  return <RouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/partner",
    element: <ConfirmOrder />
  },
  {
    path: "/partner/update-shop-profile",
    element: <UpdateShopProfile />
  },
  {
    path: "/partner/pdpa/:id",
    element: <PDPA />
  },
  {
    path: "/partner/approval",
    element: <Approval />
  },
  {
    path: "/partner/scan-qr-code",
    element: <ScanQRCode />
  },
  {
    path: "/partner/qr-reader",
    element: <QrReader />
  },
  {
    path: "/partner/register/:id",
    element: <RegisterPartner />
  },
  {
    path: "/partner/get-redeem/:qrCode",
    element: <GetRedeem />
  },
  {
    path: "/partner/get-money-item",
    element: <GetMoneyItems />
  },
  {
    path: "/partner/get-product-item",
    element: <GetProductItems />
  },
  {
    path: "/partner/receipt-modal",
    element: <ReceiptModal />
  },
  {
    path: "/partner/select-receipt",
    element: <SelectReceipt />
  },
  {
    path: "/partner/add-product",
    element: <AddProduct />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LiffProvider liffId={liffId}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </LiffProvider>
  </StrictMode>,
)
