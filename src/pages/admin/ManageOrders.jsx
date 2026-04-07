import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await API.get('/orders', { params });
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
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

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'pending': return '#fef3c7';
      case 'confirmed': return '#dbeafe';
      case 'on_delivery': return '#ede9fe';
      case 'delivered': return '#d1fae5';
      case 'cancelled': return '#fee2e2';
      default: return '#f1f5f9';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'on_delivery': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading orders...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e', marginBottom: '4px' }}>Manage Orders</h1>
          <Link to="/admin" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Back to Dashboard</Link>
        </div>
        <div style={{ background: '#fff', padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>Total: {orders.length} orders</span>
        </div>
      </div>

      {/* Filter Tabs - Responsive */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '24px'
      }}>
        {[
          { value: '', label: '📋 All Orders' },
          { value: 'pending', label: '⏳ Pending' },
          { value: 'confirmed', label: '✅ Confirmed' },
          { value: 'on_delivery', label: '🚚 On Delivery' },
          { value: 'delivered', label: '📦 Delivered' },
          { value: 'cancelled', label: '❌ Cancelled' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            style={{
              padding: '8px 18px',
              border: filter === tab.value ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              borderRadius: '30px',
              background: filter === tab.value ? '#3b82f6' : '#fff',
              fontSize: '13px',
              cursor: 'pointer',
              color: filter === tab.value ? '#fff' : '#64748b',
              fontWeight: filter === tab.value ? '600' : '500',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
          <p>No orders found</p>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px' }}>Try changing the filter or check back later</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order._id} style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease'
            }}>
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px' }}>🛒</span>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: '#0c4a6e' }}>#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    📅 {new Date(order.createdAt).toLocaleDateString('en-TZ', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: getStatusBgColor(order.status),
                  color: getStatusColor(order.status),
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>{getStatusIcon(order.status)}</span>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Order Body - Responsive Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
              }} className="order-body-grid">
                
                {/* Customer Info */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>👤 Customer</h4>
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px' }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a', marginBottom: '6px' }}>{order.customer?.name || 'N/A'}</p>
                    <p style={{ fontSize: '12px', color: '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📞</span> {order.customer?.phone}
                    </p>
                    {order.customer?.whatsapp && (
                      <p style={{ fontSize: '12px', color: '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>💬</span> {order.customer?.whatsapp}
                      </p>
                    )}
                    {order.deliveryAddress && (
                      <p style={{ fontSize: '12px', color: '#475569', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📍</span> {order.deliveryAddress}
                      </p>
                    )}
                    {order.paymentNote && (
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '11px', color: '#059669', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>💳</span> {order.paymentNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Info */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>📦 Products</h4>
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px' }}>
                    {order.products.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 0',
                        borderBottom: i < order.products.length - 1 ? '1px solid #e2e8f0' : 'none'
                      }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{item.product?.name || 'Product'}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>x{item.quantity}</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>TSh {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#0c4a6e' }}>Total</span>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a8a' }}>TSh {order.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>⚙️ Update Status</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['pending', 'confirmed', 'on_delivery', 'delivered', 'cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order._id, status)}
                        disabled={updatingId === order._id || order.status === status}
                        style={{
                          padding: '8px 12px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: updatingId === order._id || order.status === status ? 'not-allowed' : 'pointer',
                          background: order.status === status ? getStatusColor(status) : '#f1f5f9',
                          color: order.status === status ? '#fff' : getStatusColor(status),
                          opacity: updatingId === order._id ? 0.7 : 1,
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                      >
                        {getStatusIcon(status)} {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  {updatingId === order._id && (
                    <p style={{ fontSize: '11px', color: '#3b82f6', textAlign: 'center', marginTop: '8px' }}>Updating...</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Desktop: 3 columns */
        @media (min-width: 769px) {
          .order-body-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        /* Tablet: 2 columns */
        @media (max-width: 768px) {
          .order-body-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        
        /* Mobile: 1 column */
        @media (max-width: 640px) {
          .order-body-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .filter-tabs {
            gap: 6px !important;
          }
          
          .filter-tab {
            padding: 6px 14px !important;
            font-size: 12px !important;
          }
        }
        
        /* Small mobile */
        @media (max-width: 480px) {
          .filter-tab {
            padding: 5px 12px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageOrders;