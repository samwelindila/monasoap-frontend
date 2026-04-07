import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ManageSettings = () => {
  const [settings, setSettings] = useState({
    lipaNumber: '',
    phone: '',
    email: '',
    location: '',
    locationMapUrl: '',
    facebook: '',
    instagram: '',
    twitter: '',
    whatsapp: '',
    aboutUs: '',
    aboutUsImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSettings();
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings({
        lipaNumber: res.data.lipaNumber || '',
        phone: res.data.phone || '',
        email: res.data.email || '',
        location: res.data.location || '',
        locationMapUrl: res.data.locationMapUrl || '',
        facebook: res.data.facebook || '',
        instagram: res.data.instagram || '',
        twitter: res.data.twitter || '',
        whatsapp: res.data.whatsapp || '',
        aboutUs: res.data.aboutUs || '',
        aboutUsImage: res.data.aboutUsImage || ''
      });
    } catch (err) {
      console.log('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Create FormData
      const formData = new FormData();
      
      // IMPORTANT: Send as JSON string to avoid FormData issues
      const settingsData = {
        lipaNumber: settings.lipaNumber,
        phone: settings.phone,
        email: settings.email,
        location: settings.location,
        locationMapUrl: settings.locationMapUrl,
        facebook: settings.facebook,
        instagram: settings.instagram,
        twitter: settings.twitter,
        whatsapp: settings.whatsapp,
        aboutUs: settings.aboutUs
      };
      
      // Append settings as JSON string
      formData.append('data', JSON.stringify(settingsData));
      
      // Append image if exists
      if (image) {
        formData.append('aboutUsImage', image);
      }

      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/settings', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        toast.success('Settings saved successfully!');
        setImage(null);
        setImagePreview(null);
        await fetchSettings(); // Refresh data
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading settings...</p>
    </div>
  );

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e', marginBottom: '4px' }}>Manage Settings</h1>
          <Link to="/admin" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Back to Dashboard</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Payment Section */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>💳</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0c4a6e', margin: 0 }}>Payment — Lipa Number</h2>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            This Lipa number will be shown to customers when placing orders.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>M-Pesa Lipa Number</label>
            <input
              type="text"
              name="lipaNumber"
              value={settings.lipaNumber}
              onChange={handleChange}
              placeholder="e.g. +255 700 000 000"
              style={{
                padding: '10px 12px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>📞</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0c4a6e', margin: 0 }}>Contact Information</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '16px'
          }} className="contact-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                placeholder="+255 700 000 000"
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="info@monasoap.com"
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Business Location</label>
              <input
                type="text"
                name="location"
                value={settings.location}
                onChange={handleChange}
                placeholder="e.g. Kariakoo, Dar es Salaam"
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Google Maps Embed URL</label>
              <input
                type="text"
                name="locationMapUrl"
                value={settings.locationMapUrl}
                onChange={handleChange}
                placeholder="Paste Google Maps embed URL here"
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <small style={{ fontSize: '11px', color: '#94a3b8' }}>
                Go to Google Maps → Share → Embed a map → Copy the src URL
              </small>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>📱</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0c4a6e', margin: 0 }}>Social Media Links</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '16px'
          }} className="social-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>📘 Facebook URL</label>
              <input
                type="text"
                name="facebook"
                value={settings.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/monasoap"
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>📸 Instagram URL</label>
              <input
                type="text"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/monasoap"
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>🐦 X (Twitter) URL</label>
              <input
                type="text"
                name="twitter"
                value={settings.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/monasoap"
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>💬 WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="+255 700 000 000"
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>ℹ️</span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0c4a6e', margin: 0 }}>About Us Content</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>About Us Text</label>
              <textarea
                name="aboutUs"
                value={settings.aboutUs}
                onChange={handleChange}
                placeholder="Write your About Us content here..."
                rows={8}
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>About Us Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ fontSize: '14px' }}
              />
              {(imagePreview || settings.aboutUsImage) && (
                <div style={{ marginTop: '12px' }}>
                  <img
                    src={imagePreview || `http://localhost:5000/uploads/${settings.aboutUsImage}`}
                    alt="About Us"
                    style={{ width: '150px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {imagePreview && (
                    <p style={{ fontSize: '11px', color: '#10b981', marginTop: '6px' }}>✓ New image selected</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          style={{
            background: saving ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            color: '#fff',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            width: '100%',
            marginBottom: '40px',
            transition: 'all 0.3s ease'
          }}
        >
          {saving ? '⏳ Saving...' : '💾 Save All Settings'}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (min-width: 769px) {
          .contact-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .social-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .social-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageSettings;