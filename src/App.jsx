import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

// Layout with Navbar + Footer - ticker only shows when showTicker is true
const PublicLayout = ({ children, showTicker = false }) => {
  // Fixed navbar height - adjust based on your navbar
  const navbarHeight = 110; // Navbar height in pixels
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* Push content below the fixed navbar */}
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

// Controls WHERE chatbot shows
const AppContent = () => {
  const location = useLocation();

  // Hide chatbot on:
  // - Admin dashboard pages
  // - Customer dashboard pages
  // - Login page
  // - Register page
  const hideChatbot =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/my-orders') ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <>
      {/* Chatbot shows on all pages EXCEPT admin, customer dashboards, login, and register */}
      {!hideChatbot && <MonaSoapChatbot />}

      <Routes>
        {/* ── HOME PAGE ONLY with Ticker ── */}
        <Route path="/" element={
          <PublicLayout showTicker={true}>
            <Home />
          </PublicLayout>
        } />

        {/* ── Other Public Pages WITHOUT Ticker ── */}
        <Route path="/products" element={
          <PublicLayout showTicker={false}>
            <Products />
          </PublicLayout>
        } />

        <Route path="/product/:id" element={
          <PublicLayout showTicker={false}>
            <ProductDetail />
          </PublicLayout>
        } />

        <Route path="/contact" element={
          <PublicLayout showTicker={false}>
            <Contact />
          </PublicLayout>
        } />

        <Route path="/about" element={
          <PublicLayout showTicker={false}>
            <AboutUs />
          </PublicLayout>
        } />

        {/* ── Auth Routes (No Chatbot) ── */}
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

        {/* ── Customer Routes ── */}
        <Route path="/dashboard" element={
          <CustomerPage><CustomerDashboard /></CustomerPage>
        } />

        <Route path="/my-orders" element={
          <CustomerPage><MyOrders /></CustomerPage>
        } />

        <Route path="/place-order/:id" element={
          <CustomerPage><PlaceOrder /></CustomerPage>
        } />

        {/* ── Admin Routes ── */}
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

        {/* ── Catch all ── */}
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