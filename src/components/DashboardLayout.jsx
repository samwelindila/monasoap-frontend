import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close sidebar when switching to desktop
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Close sidebar when navigating
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenu = [
    { path: '/admin', icon: '📊', label: 'Overview', exact: true },
    { path: '/admin/products', icon: '📦', label: 'Products' },
    { path: '/admin/orders', icon: '🛒', label: 'Orders' },
    { path: '/admin/reports', icon: '📈', label: 'Reports' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
    { path: '/admin/announcements', icon: '📢', label: 'Announcements' },
    { path: '/admin/messages', icon: '✉️', label: 'Messages' }
  ];

  const customerMenu = [
    { path: '/dashboard', icon: '🏠', label: 'Overview', exact: true },
    { path: '/my-orders', icon: '📦', label: 'My Orders' }
  ];

  const menuItems = user?.role === 'admin' ? adminMenu : customerMenu;

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname === path;
  };

  const currentLabel = menuItems.find(m =>
    m.exact ? location.pathname === m.path : location.pathname === m.path
  )?.label || 'Dashboard';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '8px 12px',
          boxShadow: '0 -2px 20px rgba(0,0,0,0.1)',
          zIndex: 100,
          borderTop: '1px solid #e2e8f0'
        }}>
          {menuItems.map(item => {
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  color: active ? '#3b82f6' : '#64748b'
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: '500' }}>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '10px',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '20px' }}>🚪</span>
            <span style={{ fontSize: '10px', fontWeight: '500' }}>Logout</span>
          </button>
        </div>
      )}

      {/* ===== MOBILE HEADER ===== */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          zIndex: 90,
          borderBottom: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e3a8a'
            }}
          >
            ☰
          </button>
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: "'Playfair Display', serif",
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '22px' }}>🧼</span>
            <span>Mona<span style={{ color: '#3b82f6' }}>Soap</span></span>
          </div>
          <div 
            onClick={() => setSidebarOpen(true)} 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* ===== MOBILE SIDEBAR DRAWER ===== */}
      {isMobile && sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 998,
              backdropFilter: 'blur(4px)',
              animation: 'fadeIn 0.3s ease'
            }}
          />
          
          {/* Drawer */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '280px',
            height: '100vh',
            background: '#ffffff',
            zIndex: 999,
            boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '24px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{user?.name}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Drawer Menu */}
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
              {menuItems.map(item => {
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: active ? '#1e3a8a' : '#475569',
                      background: active ? 'linear-gradient(90deg, #eff6ff, transparent)' : 'transparent',
                      borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent'
                    }}
                  >
                    <span style={{ fontSize: '20px', width: '28px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#475569'
                }}
              >
                <span style={{ fontSize: '20px', width: '28px' }}>🌐</span>
                <span>Website</span>
              </Link>
              
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#dc2626',
                  background: '#fef2f2',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '20px',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '20px', width: '28px' }}>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== DESKTOP SIDEBAR ===== */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '260px',
          height: '100vh',
          zIndex: 100,
          boxShadow: '2px 0 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            background: '#ffffff',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #e2e8f0'
          }}>
            {/* Brand */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <span style={{ fontSize: '28px' }}>🧼</span>
                <div>
                  <p style={{ fontSize: '18px', fontFamily: "'Playfair Display', serif", fontWeight: '700', color: '#0f172a' }}>Mona<span style={{ color: '#60a5fa' }}>Soap</span></p>
                  <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</p>
                </div>
              </Link>
            </div>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                <p style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1.5px', padding: '12px 12px 8px', textTransform: 'uppercase' }}>MAIN MENU</p>
              {menuItems.map(item => {
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      background: active ? 'linear-gradient(90deg, #eff6ff, transparent)' : 'transparent',
                      borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
                      color: active ? '#1e3a8a' : '#475569'
                    }}
                  >
                    <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                    <span style={{ fontSize: '14px', whiteSpace: 'nowrap', fontWeight: '500' }}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <div style={{ padding: '16px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: '500' }}>
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>🌐</span>
                <span>Website</span>
              </Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: '#fef2f2', border: 'none', color: '#dc2626', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT AREA ===== */}
      <div style={{
        flex: 1,
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
        width: '100%',
        marginLeft: !isMobile ? '260px' : '0',
        paddingTop: isMobile ? '70px' : '0',
        paddingBottom: isMobile ? '70px' : '0'
      }}>
        {/* Desktop Topbar */}
        {!isMobile && (
          <div style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', fontFamily: "'Playfair Display', serif", margin: 0 }}>{currentLabel}</h1>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', margin: 0 }}>{user?.role === 'admin' ? 'Admin' : 'Account'} / {currentLabel}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '700'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>{user?.name?.split(' ')[0]}</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0, marginTop: '2px' }}>{user?.role === 'admin' ? 'Admin' : 'Customer'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div style={{ padding: '24px', maxWidth: '100%', overflowX: 'auto' }}>
          {children}
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Responsive content padding */
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-content {
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;