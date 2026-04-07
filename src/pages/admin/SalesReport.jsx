import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
      toast.error('Failed to fetch report');
    } finally {
      setLoading(false);
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

  const downloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(8, 145, 178);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MonaSoap — Sales Report', 14, 16);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Period: ${getPeriodLabel()}`, 14, 25);
    doc.text(
      `Generated: ${new Date().toLocaleDateString('en-TZ', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })}`,
      14, 31
    );

    // Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, 48);

    const summaryData = [
      ['Total Sales', `TSh ${report.totalSales?.toLocaleString()}`],
      ['Total Orders', report.totalOrders],
      ['Delivered', report.delivered],
      ['On Delivery', report.onDelivery],
      ['Pending', report.pending],
      ['Average Order Value', report.totalOrders > 0
        ? `TSh ${Math.round(report.totalSales / report.totalOrders).toLocaleString()}`
        : 'TSh 0'
      ]
    ];

    autoTable(doc, {
      startY: 52,
      body: summaryData,
      bodyStyles: { fontSize: 11 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { cellWidth: 60 }
      },
      theme: 'plain',
      alternateRowStyles: { fillColor: [240, 249, 255] }
    });

    // Orders Table
    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details', 14, finalY);

    autoTable(doc, {
      startY: finalY + 4,
      head: [['Order ID', 'Customer', 'Products', 'Amount', 'Status', 'Date']],
      body: report.orders.map(order => [
        `#${order._id.slice(-6).toUpperCase()}`,
        order.customer?.name || 'N/A',
        order.products.map(p => `${p.product?.name} x${p.quantity}`).join(', '),
        `TSh ${order.totalAmount?.toLocaleString()}`,
        order.status.replace('_', ' ').toUpperCase(),
        new Date(order.createdAt).toLocaleDateString('en-TZ', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      ]),
      headStyles: {
        fillColor: [8, 145, 178],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [240, 249, 255] },
      styles: { fontSize: 8, overflow: 'linebreak' },
      columnStyles: { 2: { cellWidth: 50 } }
    });

    doc.save(`MonaSoap_Sales_Report_${period}.pdf`);
    toast.success('PDF downloaded!');
  };

  const downloadExcel = () => {
    if (!report) return;

    const summaryData = [
      ['MonaSoap — Sales Report'],
      [`Period: ${getPeriodLabel()}`],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [],
      ['SUMMARY'],
      ['Total Sales', `TSh ${report.totalSales?.toLocaleString()}`],
      ['Total Orders', report.totalOrders],
      ['Delivered', report.delivered],
      ['On Delivery', report.onDelivery],
      ['Pending', report.pending],
      ['Avg Order Value', report.totalOrders > 0
        ? `TSh ${Math.round(report.totalSales / report.totalOrders).toLocaleString()}`
        : 'TSh 0'
      ],
      [],
      ['ORDER DETAILS'],
      ['Order ID', 'Customer', 'Phone', 'Products', 'Amount', 'Status', 'Date & Time']
    ];

    report.orders.forEach(order => {
      summaryData.push([
        `#${order._id.slice(-6).toUpperCase()}`,
        order.customer?.name || 'N/A',
        order.customer?.phone || 'N/A',
        order.products.map(p => `${p.product?.name} x${p.quantity}`).join(', '),
        order.totalAmount,
        order.status.replace('_', ' ').toUpperCase(),
        new Date(order.createdAt).toLocaleString('en-TZ', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    ws['!cols'] = [
      { wch: 12 }, { wch: 20 }, { wch: 15 },
      { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 22 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(data, `MonaSoap_Sales_Report_${period}.xlsx`);
    toast.success('Excel downloaded!');
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

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading report...</p>
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
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e', marginBottom: '4px' }}>Sales Report</h1>
          <Link to="/admin" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Back to Dashboard</Link>
        </div>
        {report && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={downloadPDF}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📄 Download PDF
            </button>
            <button
              onClick={downloadExcel}
              style={{
                background: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📊 Download Excel
            </button>
          </div>
        )}
      </div>

      {/* Period Selector - Responsive */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '24px'
      }}>
        {[
          { value: 'day', label: '📅 Today' },
          { value: 'week', label: '📊 This Week' },
          { value: 'month', label: '📈 This Month' },
          { value: '6months', label: '📆 6 Months' },
          { value: 'year', label: '🎯 This Year' }
        ].map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            style={{
              padding: '8px 20px',
              border: period === p.value ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              borderRadius: '30px',
              background: period === p.value ? '#3b82f6' : '#fff',
              fontSize: '13px',
              cursor: 'pointer',
              color: period === p.value ? '#fff' : '#64748b',
              fontWeight: period === p.value ? '600' : '500',
              transition: 'all 0.2s ease'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {!report ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📊</div>
          <p>No data available for this period</p>
        </div>
      ) : (
        <>
          {/* Summary Cards - Responsive Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }} className="stats-grid">
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '4px solid #10b981' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>TSh {report.totalSales?.toLocaleString()}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Total Sales</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '4px solid #0c4a6e' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>{report.totalOrders}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Total Orders</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>{report.pending}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Pending</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '4px solid #8b5cf6' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚚</div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>{report.onDelivery}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>On Delivery</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '4px solid #10b981' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>{report.delivered}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Delivered</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #e2e8f0', borderTop: '4px solid #0891b2' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a8a', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>
                {report.totalOrders > 0 ? `TSh ${Math.round(report.totalSales / report.totalOrders).toLocaleString()}` : 'TSh 0'}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Avg Order Value</p>
            </div>
          </div>

          {/* Orders Table Section */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '18px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e' }}>Orders — {getPeriodLabel()}</h2>
              <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{report.orders.length} orders</span>
            </div>

            {report.orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No orders in this period</div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="desktop-table" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Order ID</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Customer</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Products</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Amount</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.orders.map(order => (
                        <tr key={order._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}><strong>#{order._id.slice(-6).toUpperCase()}</strong></td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>
                            <p style={{ fontWeight: '600', marginBottom: '2px' }}>{order.customer?.name || 'N/A'}</p>
                            <p style={{ fontSize: '11px', color: '#94a3b8' }}>{order.customer?.phone || ''}</p>
                          </td>
                          <td style={{ padding: '12px', fontSize: '12px', color: '#475569' }}>
                            {order.products.map((p, i) => (
                              <span key={i} style={{ display: 'block' }}>{p.product?.name} x{p.quantity}</span>
                            ))}
                          </td>
                          <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>TSh {order.totalAmount?.toLocaleString()}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              background: getStatusBgColor(order.status),
                              color: getStatusColor(order.status),
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '12px', color: '#475569' }}>
                            <p>{new Date(order.createdAt).toLocaleDateString('en-TZ', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            <p style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(order.createdAt).toLocaleTimeString('en-TZ', { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Order Cards */}
                <div className="mobile-orders">
                  {report.orders.map(order => (
                    <div key={order._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '12px', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '14px', color: '#0c4a6e' }}>#{order._id.slice(-6).toUpperCase()}</p>
                          <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span style={{
                          background: getStatusBgColor(order.status),
                          color: getStatusColor(order.status),
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <p style={{ fontWeight: '600', fontSize: '13px', color: '#0f172a' }}>{order.customer?.name || 'N/A'}</p>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>{order.customer?.phone || ''}</p>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        {order.products.map((p, i) => (
                          <p key={i} style={{ fontSize: '11px', color: '#475569' }}>{p.product?.name} x{p.quantity}</p>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>TSh {order.totalAmount?.toLocaleString()}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(order.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Desktop styles */
        @media (min-width: 769px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .desktop-table {
            display: block !important;
          }
          .mobile-orders {
            display: none !important;
          }
        }
        
        /* Tablet styles */
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
        }
        
        /* Mobile styles */
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        
        /* Small mobile */
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          
          .period-selector {
            gap: 6px !important;
          }
          
          .period-btn {
            padding: 6px 14px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SalesReport;