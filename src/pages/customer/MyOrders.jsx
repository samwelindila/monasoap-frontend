import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API from '../../utils/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setDeletingId(orderId);
    try {
      await API.delete(`/orders/${orderId}`);
      toast.success('Order deleted successfully');
      setOrders(orders.filter(o => o._id !== orderId));
    } catch (err) {
      toast.error('Failed to delete order');
    } finally {
      setDeletingId(null);
    }
  };

  const downloadReceipt = async (orderId) => {
    setDownloadingId(orderId);
    try {
      const res = await API.get(`/orders/${orderId}/receipt`);
      const { receipt } = res.data;

      const doc = new jsPDF();

      // Header
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, 210, 38, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('MonaSoap', 14, 14);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Premium Handcrafted Soaps — Dar es Salaam, Tanzania', 14, 22);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL DELIVERY RECEIPT', 14, 32);

      // Receipt info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Receipt No: ${receipt.receiptNumber}`, 14, 48);
      doc.setFont('helvetica', 'normal');
      doc.text(`Order Date: ${receipt.orderDate}`, 14, 55);
      doc.text(`Delivered: ${receipt.deliveredAt}`, 14, 62);

      // Divider
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.5);
      doc.line(14, 68, 196, 68);

      // Customer info
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information:', 14, 76);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Name: ${receipt.customer.name}`, 14, 84);
      doc.text(`Phone: ${receipt.customer.phone}`, 14, 91);
      if (receipt.customer.whatsapp) {
        doc.text(`WhatsApp: ${receipt.customer.whatsapp}`, 14, 98);
      }
      if (receipt.deliveryAddress) {
        doc.text(`Delivery Address: ${receipt.deliveryAddress}`, 14, 105);
      }
      if (receipt.customer.location) {
        doc.text(`Location: ${receipt.customer.location}`, 14, 112);
      }

      // Products table
      autoTable(doc, {
        startY: 120,
        head: [['#', 'Product', 'Category', 'Qty', 'Unit Price (TSh)', 'Total (TSh)']],
        body: receipt.products.map((p, i) => [
          i + 1,
          p.name,
          p.category || '-',
          p.quantity,
          p.unitPrice.toLocaleString(),
          p.total.toLocaleString()
        ]),
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: { fontSize: 10 },
        alternateRowStyles: { fillColor: [240, 249, 255] },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 35, halign: 'right' },
          5: { cellWidth: 35, halign: 'right' }
        }
      });

      const finalY = doc.lastAutoTable.finalY + 10;

      // Total box
      doc.setFillColor(30, 58, 138);
      doc.rect(120, finalY, 76, 16, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(
        `TOTAL PAID: TSh ${receipt.totalAmount.toLocaleString()}`,
        124, finalY + 10
      );

      // Payment note
      if (receipt.paymentNote) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(
          `Payment Note: ${receipt.paymentNote}`,
          14, finalY + 26
        );
      }

      // Footer
      const footerY = finalY + 38;
      doc.setFillColor(240, 249, 255);
      doc.rect(0, footerY, 210, 30, 'F');
      doc.setFontSize(9);
      doc.setTextColor(30, 58, 138);
      doc.setFont('helvetica', 'bold');
      doc.text(
        'Thank you for shopping with MonaSoap!',
        105, footerY + 8,
        { align: 'center' }
      );
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(
        'This is an official receipt confirming successful delivery of your order.',
        105, footerY + 15,
        { align: 'center' }
      );
      doc.text(
        'For support: monasoap@gmail.com | WhatsApp: +255 613 374 380',
        105, footerY + 21,
        { align: 'center' }
      );

      doc.save(`MonaSoap_Receipt_${receipt.receiptNumber}.pdf`);
      toast.success('✅ Receipt downloaded successfully!');
    } catch (err) {
      console.error('Receipt error:', err);
      toast.error(
        err.response?.data?.message || 'Failed to download receipt'
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadOrderHistory = () => {
    if (filtered.length === 0) {
      toast.error('No orders to download');
      return;
    }
    const doc = new jsPDF();

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('MonaSoap — My Order History', 14, 20);

    autoTable(doc, {
      startY: 38,
      head: [['Order ID', 'Products', 'Total (TSh)', 'Status', 'Date & Time']],
      body: filtered.map(o => [
        `#${o._id.slice(-8).toUpperCase()}`,
        o.products.map(p =>
          `${p.product?.name || 'Product'} x${p.quantity}`
        ).join(', '),
        o.totalAmount?.toLocaleString(),
        o.status.replace('_', ' ').toUpperCase(),
        new Date(o.createdAt).toLocaleString('en-TZ', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        })
      ]),
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [240, 249, 255] },
      styles: { fontSize: 9 }
    });

    doc.save('MonaSoap_My_Orders.pdf');
    toast.success('Order history downloaded!');
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

  const filtered = filter
    ? orders.filter(o => o.status === filter)
    : orders;

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading your orders...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontFamily: "'Playfair Display', serif", color: '#1e3a8a', marginBottom: '6px', fontWeight: '700' }}>My Orders</h1>
          <Link to="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>← Back to Dashboard</Link>
        </div>
        {filtered.length > 0 && (
          <button
            onClick={downloadOrderHistory}
            style={{
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
            }}
          >
            📥 Download All (PDF)
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '28px'
      }}>
        {[
          { value: '', label: 'All Orders', icon: '📋' },
          { value: 'pending', label: 'Pending', icon: '⏳' },
          { value: 'confirmed', label: 'Confirmed', icon: '✅' },
          { value: 'on_delivery', label: 'On Delivery', icon: '🚚' },
          { value: 'delivered', label: 'Delivered', icon: '📦' },
          { value: 'cancelled', label: 'Cancelled', icon: '❌' }
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
          <p>No orders found</p>
          <Link to="/" style={{ display: 'inline-block', background: '#3b82f6', color: '#fff', padding: '12px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', marginTop: '16px' }}>🛍️ Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map(order => (
            <div key={order._id} style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}>
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>🛒</span>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: '#1e3a8a', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    📅 {new Date(order.createdAt).toLocaleDateString('en-TZ', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })} • {new Date(order.createdAt).toLocaleTimeString('en-TZ', {
                      hour: '2-digit', minute: '2-digit', hour12: true
                    })}
                  </p>
                </div>
                <span style={{
                  padding: '6px 16px',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: getStatusColor(order.status) + '15',
                  color: getStatusColor(order.status)
                }}>
                  <span>{getStatusIcon(order.status)}</span>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {/* Products */}
              <div style={{
                borderTop: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                padding: '16px 0',
                marginBottom: '16px'
              }}>
                {order.products.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px' }}>🧼</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{item.product?.name || 'Product'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>x{item.quantity}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>TSh {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                    Total: <strong>TSh {order.totalAmount?.toLocaleString()}</strong>
                  </p>
                  {order.deliveryAddress && (
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>📍 Delivery: {order.deliveryAddress}</p>
                  )}
                  {order.status === 'pending' && (
                    <p style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '500', marginTop: '8px' }}>💳 Please complete payment via Lipa Number</p>
                  )}
                  {order.status === 'delivered' && (
                    <p style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '8px' }}>✅ Order delivered successfully</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => downloadReceipt(order._id)}
                      disabled={downloadingId === order._id}
                      style={{
                        background: downloadingId === order._id ? '#94a3b8' : '#10b981',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: downloadingId === order._id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {downloadingId === order._id ? '⏳ Downloading...' : '📄 Receipt'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(order._id)}
                    disabled={deletingId === order._id}
                    style={{
                      background: deletingId === order._id ? '#f1f5f9' : '#fef2f2',
                      color: deletingId === order._id ? '#94a3b8' : '#dc2626',
                      border: deletingId === order._id ? '1px solid #e2e8f0' : '1px solid #fecaca',
                      padding: '8px 20px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: deletingId === order._id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {deletingId === order._id ? '...' : '🗑️ Delete'}
                  </button>
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
        
        @media (max-width: 768px) {
          .order-header {
            flex-direction: column !important;
            gap: 12px !important;
          }
          
          .order-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          
          .action-buttons {
            width: 100% !important;
          }
          
          .action-buttons button {
            flex: 1 !important;
          }
          
          .filter-tabs {
            gap: 8px !important;
          }
        }
        
        @media (max-width: 480px) {
          .filter-tabs {
            gap: 6px !important;
          }
          
          .filter-tab {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
          
          .product-item {
            flex-direction: column !important;
            gap: 8px !important;
          }
          
          .product-details {
            justify-content: flex-start !important;
          }
          
          .action-buttons {
            flex-direction: column !important;
          }
          
          .orders-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;