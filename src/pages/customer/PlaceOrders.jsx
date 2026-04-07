// File: PlaceOrders.jsx (not PlaceOrder.jsx)

import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const PlaceOrders = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);

  const product = state?.product;
  const [quantity, setQuantity] = useState(state?.quantity || 1);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentNote, setPaymentNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.log('No settings');
    }
  };

  if (!product) {
    navigate('/');
    return null;
  }

  const lipaNumber = settings?.lipaNumber || '+255 700 000 000';
  const totalAmount = product.price * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }
    setLoading(true);
    try {
      await API.post('/orders', {
        products: [{ productId: product._id, quantity }],
        deliveryAddress,
        paymentNote
      });
      toast.success('Order placed successfully!');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // SVG Icons
  const ProductIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );

  const LocationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const NoteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Processing your order...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 style={styles.title}>Place Your Order</h1>
          <div style={styles.headerSpacer}></div>
        </div>

        <div style={styles.layout}>
          {/* Order Summary Card */}
          <div style={styles.summaryCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>📋</span>
              <h2 style={styles.cardTitle}>Order Summary</h2>
            </div>

            {/* Product Info */}
            <div style={styles.productSection}>
              <div style={styles.productImage}>
                <ProductIcon />
              </div>
              <div style={styles.productInfo}>
                <p style={styles.productName}>{product.name}</p>
                <p style={styles.productCategory}>{product.category}</p>
              </div>
            </div>

            <div style={styles.divider} />

            {/* Quantity Control */}
            <div style={styles.row}>
              <span style={styles.rowLabel}>Quantity</span>
              <div style={styles.qtyControls}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <span style={styles.qtyValue}>{quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div style={styles.row}>
              <span style={styles.rowLabel}>Price per unit</span>
              <span style={styles.rowValue}>TSh {product.price?.toLocaleString()}</span>
            </div>

            <div style={styles.divider} />

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total Amount</span>
              <span style={styles.totalValue}>TSh {totalAmount.toLocaleString()}</span>
            </div>

            {/* Payment Instructions */}
            <div style={styles.paymentBox}>
              <div style={styles.paymentHeader}>
                <span>💳</span>
                <span style={styles.paymentTitle}>Payment Instructions</span>
              </div>
              <p style={styles.paymentText}>
                After placing your order, send payment via MIXX BY YAS:
              </p>
              <div style={styles.lipaNumberBox}>
                <span style={styles.lipaNumberIcon}>📱</span>
                <span style={styles.lipaNumber}>{lipaNumber}</span>
              </div>
              <div style={styles.amountBox}>
                <span>Amount to Pay:</span>
                <strong>TSh {totalAmount.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Delivery Details Card */}
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🚚</span>
              <h2 style={styles.cardTitle}>Delivery Details</h2>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Name - Read Only */}
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    style={styles.inputDisabled}
                  />
                </div>
              </div>

              {/* Phone - Read Only */}
              <div style={styles.field}>
                <label style={styles.label}>Phone Number</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>📞</span>
                  <input
                    type="text"
                    value={user?.phone || ''}
                    disabled
                    style={styles.inputDisabled}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div style={styles.field}>
                <label style={styles.label}>
                  Delivery Address <span style={styles.required}>*</span>
                </label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><LocationIcon /></span>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Payment Note */}
              <div style={styles.field}>
                <label style={styles.label}>Payment Reference (Optional)</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}><NoteIcon /></span>
                  <textarea
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="e.g., I have sent payment via M-Pesa transaction ID: ABC123"
                    rows={3}
                    style={styles.textarea}
                  />
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                style={loading ? styles.btnDisabled : styles.btn}
              >
                {loading ? (
                  <span>⏳ Placing Order...</span>
                ) : (
                  <span>✅ Place Order — TSh {totalAmount.toLocaleString()}</span>
                )}
              </button>

              <p style={styles.note}>
                By placing this order, you agree to pay TSh {totalAmount.toLocaleString()} via MIXX BY YAS to {lipaNumber}
              </p>
            </form>
          </div>
        </div>
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
        
        .summary-card, .form-card {
          animation: fadeInUp 0.5s ease;
        }
        
        .qty-btn:hover, .back-btn:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
        
        .qty-btn:active {
          transform: scale(0.95);
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        @media (max-width: 768px) {
          .order-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .order-header {
            flex-direction: column !important;
            text-align: center !important;
            gap: 12px !important;
          }
          
          .header-spacer {
            display: none !important;
          }
          
          .title {
            font-size: 24px !important;
          }
          
          .total-value {
            font-size: 28px !important;
          }
        }
        
        @media (max-width: 480px) {
          .summary-card, .form-card {
            padding: 20px !important;
          }
          
          .card-title {
            font-size: 18px !important;
          }
          
          .product-name {
            font-size: 16px !important;
          }
          
          .qty-controls {
            gap: 16px !important;
          }
          
          .qty-btn {
            width: 36px !important;
            height: 36px !important;
            font-size: 20px !important;
          }
          
          .qty-value {
            font-size: 18px !important;
            min-width: 40px !important;
          }
          
          .row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          
          .total-row {
            flex-direction: row !important;
            justify-content: space-between !important;
          }
          
          .payment-box {
            padding: 16px !important;
          }
          
          .lipa-number-box {
            flex-direction: column !important;
            text-align: center !important;
            gap: 8px !important;
          }
          
          .btn, .btn-disabled {
            padding: 14px !important;
            font-size: 14px !important;
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
    maxWidth: '1000px', 
    margin: '0 auto' 
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
    flexWrap: 'wrap'
  },
  headerSpacer: {
    width: '60px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  title: {
    fontSize: '28px',
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#1e3a8a',
    fontWeight: '700',
    margin: 0
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '28px'
  },
  summaryCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  formCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px'
  },
  cardIcon: {
    fontSize: '24px'
  },
  cardTitle: {
    fontSize: '20px',
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#1e3a8a',
    fontWeight: '700',
    margin: 0
  },
  productSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '16px'
  },
  productImage: {
    width: '60px',
    height: '60px',
    background: '#ffffff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1e3a8a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px'
  },
  productCategory: {
    fontSize: '12px',
    color: '#3b82f6',
    fontWeight: '500'
  },
  divider: {
    borderTop: '1px solid #e2e8f0',
    margin: '16px 0'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  rowLabel: {
    fontSize: '14px',
    color: '#64748b'
  },
  rowValue: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b'
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  qtyBtn: {
    width: '36px',
    height: '36px',
    border: '2px solid #e2e8f0',
    background: '#ffffff',
    borderRadius: '10px',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#1e3a8a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    fontWeight: '600'
  },
  qtyValue: {
    fontSize: '18px',
    fontWeight: '700',
    minWidth: '36px',
    textAlign: 'center',
    color: '#1e3a8a'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e3a8a'
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e3a8a',
    fontFamily: "'Playfair Display', Georgia, serif"
  },
  paymentBox: {
    background: '#eff6ff',
    borderRadius: '16px',
    padding: '20px',
    marginTop: '20px',
    border: '1px solid #bfdbfe'
  },
  paymentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  paymentTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e3a8a'
  },
  paymentText: {
    fontSize: '13px',
    color: '#475569',
    marginBottom: '12px'
  },
  lipaNumberBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#ffffff',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '12px'
  },
  lipaNumberIcon: {
    fontSize: '20px'
  },
  lipaNumber: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a8a',
    fontFamily: 'monospace'
  },
  amountBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid #bfdbfe'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e3a8a'
  },
  required: {
    color: '#ef4444'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '16px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    padding: '12px 14px 12px 42px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  },
  inputDisabled: {
    padding: '12px 14px 12px 42px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    background: '#f8fafc',
    color: '#94a3b8',
    width: '100%',
    cursor: 'not-allowed'
  },
  textarea: {
    padding: '12px 14px 12px 42px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    width: '100%',
    minHeight: '80px'
  },
  btn: {
    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
    color: '#ffffff',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
  },
  btnDisabled: {
    background: '#94a3b8',
    color: '#ffffff',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'not-allowed',
    width: '100%',
    marginTop: '8px'
  },
  note: {
    fontSize: '11px',
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: '1.5',
    marginTop: '12px'
  }
};

export default PlaceOrders;