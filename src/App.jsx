import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from './components/ui/sonner';

// Components
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import AddressSelection from './pages/AddressSelection';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Gifting from './pages/Gifting';
import About from './pages/About';
import Contact from './pages/Contact';
import ContractManufacturing from './pages/ContractManufacturing';
import Cart from './components/Cart';
import WhatsAppFloat from './components/WhatsAppFloat';
import FestivePopup from './components/FestivePopup';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OccasionProvider } from './context/OccasionContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <OccasionProvider>
        <CartProvider>
          <LoadingScreen minDuration={1000} />
          <div className="App min-h-screen bg-background flex flex-col">
        <BrowserRouter>
          <ScrollToTop />
          <Navigation />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:category" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/select-address" element={<AddressSelection />} />
              <Route path="/gifting" element={<Gifting />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contract-manufacturing" element={<ContractManufacturing />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
          <Footer />
          <Cart />
          <WhatsAppFloat />
          {/* <FestivePopup /> */}
          <Toaster position="top-center" />
        </BrowserRouter>
      </div>
        </CartProvider>
      </OccasionProvider>
    </AuthProvider>
  );
}

export default App;
