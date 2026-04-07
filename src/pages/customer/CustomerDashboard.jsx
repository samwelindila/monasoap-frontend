import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0, pending: 0, delivered: 0, cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders');
      setOrders(res.data);
      setStats({
        total: res.data.length,
        pending: res.data.filter(o => o.status === 'pending').length,
        delivered: res.data.filter(o => o.status === 'delivered').length,
        cancelled: res.data.filter(o => o.status === 'cancelled').length
      });
    } catch (err) {
      console.log('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Delete this order from your history?')) return;
    setDeletingId(orderId);
    try {
      await API.delete(`/orders/${orderId}`);
      toast.success('Order deleted');
      setOrders(orders.filter(o => o._id !== orderId));
      setStats(prev => ({
        ...prev,
        total: prev.total - 1
      }));
    } catch (err) {
      toast.error('Failed to delete order');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'on_delivery': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'on_delivery': return 'On Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // SVG Icons
  const EmailIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      <path d="M12 8v4l3 3"/>
    </svg>
  );

  const LocationIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const HomeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );

  const OrderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );

  const PendingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  const DeliveredIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  const CancelledIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: "'Playfair Display', serif", color: '#fff', marginBottom: '8px', fontWeight: '700' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#bfdbfe' }}>Here's what's happening with your orders</p>
        </div>
        <Link to="/" style={{ background: '#fff', color: '#1e3a8a', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          🛍️ Shop Now
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }} className="stats-grid">
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: '20px', padding: '24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <OrderIcon />
          </div>
          <p style={{ fontSize: '36px', fontWeight: '700', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>{stats.total}</p>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>Total Orders</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '20px', padding: '24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <PendingIcon />
          </div>
          <p style={{ fontSize: '36px', fontWeight: '700', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>{stats.pending}</p>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>Pending</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '20px', padding: '24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <DeliveredIcon />
          </div>
          <p style={{ fontSize: '36px', fontWeight: '700', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>{stats.delivered}</p>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>Delivered</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '20px', padding: '24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <CancelledIcon />
          </div>
          <p style={{ fontSize: '36px', fontWeight: '700', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>{stats.cancelled}</p>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>Cancelled</p>
        </div>
      </div>

      {/* Profile Section */}
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '28px',
        marginBottom: '28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '22px', fontFamily: "'Playfair Display', serif", color: '#1e3a8a', fontWeight: '700' }}>Profile Information</h2>
          <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Active</span>
        </div>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            fontWeight: '700',
            flexShrink: 0,
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>{user?.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', color: '#3b82f6' }}><EmailIcon /></span>
                <span>{user?.email}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', color: '#3b82f6' }}><PhoneIcon /></span>
                <span>{user?.phone}</span>
              </div>
              {user?.whatsapp && (
                <div style={{ fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', color: '#3b82f6' }}><WhatsAppIcon /></span>
                  <span>{user?.whatsapp}</span>
                </div>
              )}
              {user?.address && (
                <div style={{ fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', color: '#3b82f6' }}><HomeIcon /></span>
                  <span>{user?.address}</span>
                </div>
              )}
              {user?.location && (
                <div style={{ fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', color: '#3b82f6' }}><LocationIcon /></span>
                  <span>{user?.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '22px', fontFamily: "'Playfair Display', serif", color: '#1e3a8a', fontWeight: '700' }}>Recent Orders</h2>
          <Link to="/my-orders" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>View All →</Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <p>You haven't placed any orders yet</p>
            <Link to="/" style={{ display: 'inline-block', background: '#3b82f6', color: '#fff', padding: '10px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginTop: '16px' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.slice(0, 5).map(order => (
              <div key={order._id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', background: '#fff', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: '#1e3a8a' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-TZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: getStatusColor(order.status) + '15',
                    color: getStatusColor(order.status)
                  }}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '12px 0', marginBottom: '12px' }}>
                  {order.products.slice(0, 2).map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', padding: '6px 0' }}>
                      <span>{item.product?.name || 'Product'}</span>
                      <span>x{item.quantity}</span>
                      <span>TSh {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  {order.products.length > 2 && (
                    <div style={{ fontSize: '12px', color: '#94a3b8', paddingTop: '6px', fontStyle: 'italic' }}>
                      +{order.products.length - 2} more items
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <p style={{ fontWeight: '700', fontSize: '16px', color: '#1e3a8a', fontFamily: "'Playfair Display', serif" }}>
                    Total: TSh {order.totalAmount?.toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {order.status === 'delivered' && (
                      <button style={{ background: '#d1fae5', color: '#065f46', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>📄 Receipt</button>
                    )}
                    {order.status === 'pending' && (
                      <button style={{ background: '#fef3c7', color: '#d97706', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>💳 Pay Now</button>
                    )}
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={deletingId === order._id}
                      style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      🗑️ {deletingId === order._id ? '...' : ''}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;