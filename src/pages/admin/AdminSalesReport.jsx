import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const SalesReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/orders/reports/sales?period=${period}`);
      setReport(res.data);
    } catch (err) {
      console.log('Failed to fetch report');
    } finally {
      setLoading(false);
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

  const getPeriodLabel = () => {
    switch (period) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '6months': return 'Last 6 Months';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Sales Report</h1>
            <Link to="/admin" style={styles.backBtn}>← Back to Dashboard</Link>
          </div>
        </div>

        {/* Period Selector */}
        <div style={styles.periodBar}>
          <button
            style={period === 'day' ? styles.periodBtnActive : styles.periodBtn}
            onClick={() => setPeriod('day')}
          >
            📅 Today
          </button>
          <button
            style={period === 'week' ? styles.periodBtnActive : styles.periodBtn}
            onClick={() => setPeriod('week')}
          >
            📊 This Week
          </button>
          <button
            style={period === 'month' ? styles.periodBtnActive : styles.periodBtn}
            onClick={() => setPeriod('month')}
          >
            📈 This Month
          </button>
          <button
            style={period === '6months' ? styles.periodBtnActive : styles.periodBtn}
            onClick={() => setPeriod('6months')}
          >
            📆 6 Months
          </button>
          <button
            style={period === 'year' ? styles.periodBtnActive : styles.periodBtn}
            onClick={() => setPeriod('year')}
          >
            🎯 This Year
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading report data...</p>
          </div>
        ) : !report ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📊</div>
            <p>No data available for this period</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div style={styles.statsGrid}>
              <div style={{...styles.statCard, borderTop: '4px solid #10b981'}}>
                <div style={styles.statIcon}>💰</div>
                <p style={styles.statNumber}>
                  TSh {report.totalSales?.toLocaleString()}
                </p>
                <p style={styles.statLabel}>Total Sales</p>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #1e3a8a'}}>
                <div style={styles.statIcon}>🛒</div>
                <p style={styles.statNumber}>{report.totalOrders}</p>
                <p style={styles.statLabel}>Total Orders</p>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #f59e0b'}}>
                <div style={styles.statIcon}>⏳</div>
                <p style={styles.statNumber}>{report.pending}</p>
                <p style={styles.statLabel}>Pending</p>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #8b5cf6'}}>
                <div style={styles.statIcon}>🚚</div>
                <p style={styles.statNumber}>{report.onDelivery}</p>
                <p style={styles.statLabel}>On Delivery</p>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #10b981'}}>
                <div style={styles.statIcon}>✅</div>
                <p style={styles.statNumber}>{report.delivered}</p>
                <p style={styles.statLabel}>Delivered</p>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #3b82f6'}}>
                <div style={styles.statIcon}>📊</div>
                <p style={styles.statNumber}>
                  {report.totalOrders > 0
                    ? `TSh ${Math.round(report.totalSales / report.totalOrders).toLocaleString()}`
                    : 'TSh 0'
                  }
                </p>
                <p style={styles.statLabel}>Avg Order Value</p>
              </div>
            </div>

            {/* Orders Table */}
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h2 style={styles.tableTitle}>
                  📋 Orders — {getPeriodLabel()}
                </h2>
                <span style={styles.orderCount}>
                  {report.orders.length} orders
                </span>
              </div>

              {report.orders.length === 0 ? (
                <div style={styles.emptySmall}>
                  <p>No orders in this period</p>
                </div>
              ) : (
                <>
                  {/* Mobile View */}
                  <div style={styles.mobileOrders}>
                    {report.orders.map(order => (
                      <div key={order._id} style={styles.mobileOrderCard}>
                        <div style={styles.mobileOrderHeader}>
                          <div>
                            <p style={styles.mobileOrderId}>
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p style={styles.mobileOrderDate}>
                              {new Date(order.createdAt).toLocaleDateString('en-TZ', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </p>
                          </div>
                          <span style={{
                            ...styles.statusBadge,
                            background: getStatusBgColor(order.status),
                            color: getStatusColor(order.status)
                          }}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div style={styles.mobileOrderBody}>
                          <p style={styles.mobileCustomer}>
                            👤 {order.customer?.name || 'N/A'}
                          </p>
                          <p style={styles.mobileProducts}>
                            {order.products.map((p, i) => (
                              <span key={i}>
                                {p.product?.name} x{p.quantity}
                                {i < order.products.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </p>
                          <p style={styles.mobileAmount}>
                            Total: <strong>TSh {order.totalAmount?.toLocaleString()}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div style={styles.desktopTable}>
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr style={styles.tableHead}>
                            <th style={styles.th}>Order ID</th>
                            <th style={styles.th}>Customer</th>
                            <th style={styles.th}>Products</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.orders.map(order => (
                            <tr key={order._id} style={styles.tableRow}>
                              <td style={styles.td}>
                                <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                              </td>
                              <td style={styles.td}>
                                {order.customer?.name || 'N/A'}
                              </td>
                              <td style={styles.td}>
                                {order.products.map((p, i) => (
                                  <span key={i}>
                                    {p.product?.name} x{p.quantity}
                                    {i < order.products.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </td>
                              <td style={styles.td}>
                                <strong>TSh {order.totalAmount?.toLocaleString()}</strong>
                              </td>
                              <td style={styles.td}>
                                <span style={{
                                  ...styles.badge,
                                  background: getStatusBgColor(order.status),
                                  color: getStatusColor(order.status)
                                }}>
                                  {order.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td style={styles.td}>
                                {new Date(order.createdAt).toLocaleDateString('en-TZ', {
                                  year: 'numeric', month: 'short', day: 'numeric'
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .stat-card {
          animation: fadeInUp 0.4s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .period-btn:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
        
        .loading-spinner {
          animation: spin 0.8s linear infinite;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .desktop-table {
            display: none !important;
          }
          
          .mobile-orders {
            display: block !important;
          }
          
          .period-bar {
            gap: 8px !important;
          }
          
          .period-btn, .period-btn-active {
            padding: 6px 14px !important;
            font-size: 12px !important;
          }
        }
        
        @media (min-width: 769px) {
          .desktop-table {
            display: block !important;
          }
          
          .mobile-orders {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          
          .header {
            text-align: center !important;
          }
          
          .title {
            font-size: 24px !important;
          }
          
          .period-bar {
            justify-content: center !important;
          }
          
          .period-btn, .period-btn-active {
            padding: 4px 12px !important;
            font-size: 11px !important;
          }
          
          .table-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    background: '#f0f9ff',
    minHeight: '100vh',
    padding: '30px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px'
  },
  title: {
    fontSize: '28px',
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#1e3a8a',
    marginBottom: '6px',
    fontWeight: '700'
  },
  backBtn: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600'
  },
  periodBar: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '28px',
    justifyContent: 'center'
  },
  periodBtn: {
    padding: '8px 24px',
    border: '2px solid #e2e8f0',
    borderRadius: '30px',
    background: '#ffffff',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#64748b',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  periodBtnActive: {
    padding: '8px 24px',
    border: '2px solid #3b82f6',
    borderRadius: '30px',
    background: '#3b82f6',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#ffffff',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    color: '#64748b',
    gap: '16px'
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%'
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: '#64748b',
    background: '#ffffff',
    borderRadius: '20px',
    border: '1px solid #e2e8f0'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5
  },
  emptySmall: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '28px'
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '12px'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e3a8a',
    fontFamily: "'Playfair Display', Georgia, serif",
    marginBottom: '6px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  tableCard: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  tableTitle: {
    fontSize: '18px',
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#1e3a8a',
    fontWeight: '700'
  },
  orderCount: {
    background: '#eff6ff',
    color: '#1e3a8a',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  desktopTable: {
    overflowX: 'auto'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHead: {
    background: '#f8fafc',
    borderBottom: '2px solid #e2e8f0'
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e3a8a'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background 0.2s ease'
  },
  td: {
    padding: '14px 16px',
    fontSize: '13px',
    color: '#475569'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600'
  },
  // Mobile Styles
  mobileOrders: {
    display: 'none'
  },
  mobileOrderCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '12px',
    background: '#ffffff'
  },
  mobileOrderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  mobileOrderId: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#1e3a8a'
  },
  mobileOrderDate: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '2px'
  },
  mobileOrderBody: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '12px'
  },
  mobileCustomer: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: '8px'
  },
  mobileProducts: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '8px',
    lineHeight: '1.5'
  },
  mobileAmount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e3a8a',
    marginTop: '8px'
  }
};

export default SalesReport;