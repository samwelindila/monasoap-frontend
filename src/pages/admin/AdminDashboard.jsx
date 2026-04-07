import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0, pending: 0, delivered: 0,
    onDelivery: 0, cancelled: 0, totalSales: 0,
    customers: 0, products: 0, unreadMessages: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, reportRes, messagesRes] = await Promise.all([
        API.get('/orders'),
        API.get('/products'),
        API.get('/orders/reports/sales?period=month'),
        API.get('/contact')
      ]);
      const orders = ordersRes.data;
      setStats({
        totalOrders: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        onDelivery: orders.filter(o => o.status === 'on_delivery').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalSales: reportRes.data.totalSales,
        customers: [...new Set(orders.map(o => o.customer?._id))].length,
        products: productsRes.data.length,
        unreadMessages: messagesRes.data.filter(m => !m.isRead).length
      });
      setRecentOrders(orders.slice(0, 6));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-info';
      case 'on_delivery': return 'badge-purple';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-gray';
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e', marginBottom: '4px' }}>Overview</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/admin/products" style={{
          background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          + Add Product
        </Link>
      </div>

      {/* Stats Grid - Responsive */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }} className="stats-grid">
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #0c4a6e' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🛒</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>{stats.totalOrders}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Total Orders</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #f59e0b' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>{stats.pending}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Pending</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #8b5cf6' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🚚</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>{stats.onDelivery}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>On Delivery</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #10b981' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>{stats.delivered}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Delivered</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #ef4444' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>❌</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>{stats.cancelled}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Cancelled</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #10b981' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>💰</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#0c4a6e' }}>TSh {stats.totalSales?.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Monthly Sales</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #0c4a6e' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>👥</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>{stats.customers}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Customers</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '3px solid #f59e0b' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>📦</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>{stats.products}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Products</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0c4a6e', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '12px'
        }} className="quick-actions">
          <Link to="/admin/products" style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 10px', textAlign: 'center', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>📦</div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>Products</p>
            <p style={{ fontSize: '10px', color: '#94a3b8' }}>Manage</p>
          </Link>
          <Link to="/admin/orders" style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 10px', textAlign: 'center', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🛒</div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>Orders</p>
            <p style={{ fontSize: '10px', color: '#94a3b8' }}>View all</p>
          </Link>
          <Link to="/admin/reports" style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 10px', textAlign: 'center', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>📈</div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>Reports</p>
            <p style={{ fontSize: '10px', color: '#94a3b8' }}>Analytics</p>
          </Link>
          <Link to="/admin/settings" style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 10px', textAlign: 'center', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>⚙️</div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>Settings</p>
            <p style={{ fontSize: '10px', color: '#94a3b8' }}>Configure</p>
          </Link>
          <Link to="/admin/announcements" style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 10px', textAlign: 'center', textDecoration: 'none', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>📢</div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>News</p>
            <p style={{ fontSize: '10px', color: '#94a3b8' }}>Ticker</p>
          </Link>
          <Link to="/admin/messages" style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px 10px', textAlign: 'center', textDecoration: 'none', border: '1px solid #e2e8f0', position: 'relative' }}>
            {stats.unreadMessages > 0 && (
              <span style={{ position: 'absolute', top: '6px', right: '10px', background: '#ef4444', color: '#fff', fontSize: '9px', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stats.unreadMessages}</span>
            )}
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>✉️</div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>Messages</p>
            <p style={{ fontSize: '10px', color: '#94a3b8' }}>{stats.unreadMessages} unread</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0c4a6e' }}>Recent Orders</h2>
          <Link to="/admin/orders" style={{ color: '#0891b2', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>View All →</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No orders yet</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="desktop-table" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Order ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Customer</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}><strong>#{order._id.slice(-6).toUpperCase()}</strong></td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>{order.customer?.name || 'N/A'}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}><strong>TSh {order.totalAmount?.toLocaleString()}</strong></td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: getStatusBg(order.status), color: getStatusColor(order.status) }}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Orders */}
            <div className="mobile-orders">
              {recentOrders.map(order => (
                <div key={order._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '12px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>#{order._id.slice(-6).toUpperCase()}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: getStatusBg(order.status), color: getStatusColor(order.status) }}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#475569' }}>👤 {order.customer?.name || 'N/A'}</p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#0c4a6e' }}>TSh {order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Desktop styles */
        @media (min-width: 769px) {
          .desktop-table {
            display: block !important;
          }
          .mobile-orders {
            display: none !important;
          }
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .quick-actions {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .desktop-table {
            display: none !important;
          }
          .mobile-orders {
            display: block !important;
          }
        }
        
        /* Small mobile */
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .quick-actions {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

// Helper functions for status colors
const getStatusBg = (status) => {
  switch (status) {
    case 'pending': return '#fef3c7';
    case 'confirmed': return '#dbeafe';
    case 'on_delivery': return '#ede9fe';
    case 'delivered': return '#d1fae5';
    case 'cancelled': return '#fee2e2';
    default: return '#f1f5f9';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#92400e';
    case 'confirmed': return '#1e40af';
    case 'on_delivery': return '#5b21b6';
    case 'delivered': return '#065f46';
    case 'cancelled': return '#991b1b';
    default: return '#475569';
  }
};

export default AdminDashboard;