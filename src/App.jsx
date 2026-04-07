import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import NewsTicker from './components/NewsTicker';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import MonaSoapChatbot from './components/MonaSoapChatbot';

import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyOrders from './pages/customer/MyOrders';
import PlaceOrder from './pages/customer/PlaceOrder';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import SalesReport from './pages/admin/SalesReport';
import ManageSettings from './pages/admin/ManageSettings';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageMessages from './pages/admin/ManageMessages';

/* ✅ SCROLL TO TOP COMPONENT */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

// Layout with Navbar + Footer
const PublicLayout = ({ children, showTicker = false }) => {
  const navbarHeight = 110;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ marginTop: `${navbarHeight}px` }}>
        {showTicker && <NewsTicker />}
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

// Layout without Navbar/Footer
const CleanLayout = ({ children }) => (
  <div style={{ minHeight: '100vh' }}>
    {children}
  </div>
);

// Admin Protected
const AdminPage = ({ children }) => (
  <ProtectedRoute role="admin">
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

// Customer Protected
const CustomerPage = ({ children }) => (
  <ProtectedRoute role="customer">
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

// Main App Content
const AppContent = () => {
  const location = useLocation();

  const hideChatbot =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/my-orders') ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <>
      {/* ✅ FIX ADDED HERE */}
      <ScrollToTop />

      {!hideChatbot && <MonaSoapChatbot />}

      <Routes>
        {/* HOME */}
        <Route path="/" element={
          <PublicLayout showTicker={true}>
            <Home />
          </PublicLayout>
        } />

        {/* PUBLIC */}
        <Route path="/products" element={
          <PublicLayout>
            <Products />
          </PublicLayout>
        } />

        <Route path="/product/:id" element={
          <PublicLayout>
            <ProductDetail />
          </PublicLayout>
        } />

        <Route path="/contact" element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        } />

        <Route path="/about" element={
          <PublicLayout>
            <AboutUs />
          </PublicLayout>
        } />

        {/* AUTH */}
        <Route path="/login" element={
          <CleanLayout>
            <Login />
          </CleanLayout>
        } />

        <Route path="/register" element={
          <CleanLayout>
            <Register />
          </CleanLayout>
        } />

        {/* CUSTOMER */}
        <Route path="/dashboard" element={
          <CustomerPage><CustomerDashboard /></CustomerPage>
        } />

        <Route path="/my-orders" element={
          <CustomerPage><MyOrders /></CustomerPage>
        } />

        <Route path="/place-order/:id" element={
          <CustomerPage><PlaceOrder /></CustomerPage>
        } />

        {/* ADMIN */}
        <Route path="/admin" element={
          <AdminPage><AdminDashboard /></AdminPage>
        } />

        <Route path="/admin/products" element={
          <AdminPage><ManageProducts /></AdminPage>
        } />

        <Route path="/admin/orders" element={
          <AdminPage><ManageOrders /></AdminPage>
        } />

        <Route path="/admin/reports" element={
          <AdminPage><SalesReport /></AdminPage>
        } />

        <Route path="/admin/settings" element={
          <AdminPage><ManageSettings /></AdminPage>
        } />

        <Route path="/admin/announcements" element={
          <AdminPage><ManageAnnouncements /></AdminPage>
        } />

        <Route path="/admin/messages" element={
          <AdminPage><ManageMessages /></AdminPage>
        } />

        {/* CATCH */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          pauseOnFocusLoss
          draggable
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;