import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const PlaceOrder = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [quantity, setQuantity] = useState(state?.quantity || 1);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentNote, setPaymentNote] = useState('');
  const [loading, setLoading] = useState(false);

  const product = state?.product;

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
    return (
      <div style={{ padding: '30px 20px', minHeight: '100vh', background: '#f0f9ff' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
            <p>No product selected</p>
            <button
              onClick={() => navigate('/')}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}
            >
              ← Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  const lipaNumber = settings?.lipaNumber || '44473260';
  const totalAmount = product.price * quantity;

  const handleSubmit = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }
    setLoading(true);
    try {
      await API.post('/orders', {
        products: [{ productId: product._id, quantity }],
        deliveryAddress: deliveryAddress.trim(),
        paymentNote: paymentNote.trim()
      });
      toast.success('Order placed successfully!');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f0f9ff', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            ← Back
          </button>
          <h1 style={{
            fontSize: '28px',
            fontFamily: "'Playfair Display', serif",
            color: '#1e3a8a',
            fontWeight: '700',
            margin: 0
          }}>Place Your Order</h1>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '28px'
        }} className="order-layout">
          
          {/* Order Summary Card */}
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <h2 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", color: '#1e3a8a', fontWeight: '700', margin: 0 }}>Order Summary</h2>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '16px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#fff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <span>🧼</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{product.name}</p>
                <p style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '500' }}>{product.category}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0' }}></div>

            {/* Quantity Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '2px solid #e2e8f0',
                    background: '#fff',
                    borderRadius: '10px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#1e3a8a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  −
                </button>
                <span style={{ fontSize: '18px', fontWeight: '700', minWidth: '36px', textAlign: 'center', color: '#1e3a8a' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '2px solid #e2e8f0',
                    background: '#fff',
                    borderRadius: '10px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#1e3a8a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Unit Price</span>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>TSh {product.price?.toLocaleString()}</span>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a' }}>Total Amount</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', fontFamily: "'Playfair Display', serif" }}>TSh {totalAmount.toLocaleString()}</span>
            </div>

            {/* Payment Instructions - MIXX BY YAS */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              borderRadius: '16px',
              padding: '20px',
              marginTop: '20px',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '22px' }}>💳</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e3a8a' }}>Payment via MIXX BY YAS</span>
              </div>
              
              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', lineHeight: '1.5' }}>
                Complete your payment using MIXX BY YAS. Your order will be confirmed once payment is verified by admin.
              </p>
              
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid #bfdbfe',
                marginBottom: '16px'
              }}>
                <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', letterSpacing: '0.5px' }}>MIXX BY YAS Lipa Number</p>
                <p style={{ fontSize: '26px', fontWeight: '800', color: '#1e3a8a', letterSpacing: '1px', fontFamily: 'monospace' }}>{lipaNumber}</p>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Use your Order ID as reference</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Amount to Pay:</span>
                <strong style={{ fontSize: '18px', color: '#1e3a8a' }}>TSh {totalAmount.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Delivery Details Card */}
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <span style={{ fontSize: '24px' }}>🚚</span>
              <h2 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", color: '#1e3a8a', fontWeight: '700', margin: 0 }}>Delivery Details</h2>
            </div>

            {/* Name - Read Only */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '14px', fontSize: '16px', color: '#94a3b8' }}>👤</span>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  style={{
                    padding: '12px 14px 12px 42px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    background: '#f8fafc',
                    color: '#94a3b8',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Phone - Read Only */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Phone Number</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '14px', fontSize: '16px', color: '#94a3b8' }}>📞</span>
                <input
                  type="text"
                  value={user?.phone || ''}
                  disabled
                  style={{
                    padding: '12px 14px 12px 42px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    background: '#f8fafc',
                    color: '#94a3b8',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Delivery Address <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '14px', fontSize: '16px', color: '#94a3b8' }}>📍</span>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  style={{
                    padding: '12px 14px 12px 42px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Payment Note */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Payment Reference (Optional)</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '14px', fontSize: '16px', color: '#94a3b8' }}>📝</span>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder={`e.g., Sent TSh ${totalAmount.toLocaleString()} to ${lipaNumber} via MIXX BY YAS - Reference: YourName_OrderID`}
                  rows={3}
                  style={{
                    padding: '12px 14px 12px 42px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    width: '100%',
                    minHeight: '80px'
                  }}
                />
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                color: '#fff',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                marginBottom: '16px',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              {loading ? '⏳ Placing Order...' : `✅ Place Order — TSh ${totalAmount.toLocaleString()}`}
            </button>

            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', lineHeight: '1.5' }}>
              By placing this order, you agree to pay TSh {totalAmount.toLocaleString()} via <strong>MIXX BY YAS</strong> to <strong>{lipaNumber}</strong>
            </p>
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
        
        .summary-card, .form-card {
          animation: fadeInUp 0.5s ease;
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
          
          .title {
            font-size: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          .order-summary-card, .delivery-card {
            padding: 20px !important;
          }
          
          .qty-controls {
            gap: 16px !important;
          }
          
          .qty-btn {
            width: 36px !important;
            height: 36px !important;
            font-size: 20px !important;
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
          
          .payment-instructions {
            padding: 16px !important;
          }
          
          .lipa-number-box {
            flex-direction: column !important;
            text-align: center !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PlaceOrder;