import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [text, setText] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await API.get('/announcements');
      console.log('✅ Fetched announcements:', res.data);
      // Make sure we're setting the array correctly
      const announcementsData = Array.isArray(res.data) ? res.data : [];
      setAnnouncements(announcementsData);
    } catch (err) {
      console.error('❌ Error fetching:', err);
      toast.error('Failed to load announcements');
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setText('');
    setIsActive(true);
    setOrder(0);
    setEditItem(null);
  };

  const handleEdit = (item) => {
    setText(item.text);
    setIsActive(item.isActive);
    setOrder(item.order || 0);
    setEditItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error('Please enter announcement text');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        text: text.trim(),
        isActive,
        order: Number(order) || 0
      };

      console.log('📤 Sending payload:', payload);

      let response;
      if (editItem) {
        response = await API.put(`/announcements/${editItem._id}`, payload);
        console.log('✅ Update response:', response.data);
        toast.success('Announcement updated!');
      } else {
        response = await API.post('/announcements', payload);
        console.log('✅ Create response:', response.data);
        
        // If the response contains the new announcement, add it to the list
        if (response.data && response.data.announcement) {
          toast.success('Announcement added!');
        } else {
          toast.success('Announcement added!');
        }
      }

      resetForm();
      // Wait a moment before fetching to ensure backend has saved
      setTimeout(() => {
        fetchAnnouncements();
      }, 500);

    } catch (err) {
      console.error('❌ Save error:', err);
      console.error('Error details:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;

    try {
      await API.delete(`/announcements/${id}`);
      toast.success('Deleted successfully');
      await fetchAnnouncements();
    } catch (err) {
      console.error('❌ Delete error:', err);
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (item) => {
    try {
      const response = await API.patch(`/announcements/${item._id}`, {
        isActive: !item.isActive
      });
      console.log('✅ Toggle response:', response.data);
      toast.success(!item.isActive ? 'Activated' : 'Deactivated');
      await fetchAnnouncements();
    } catch (err) {
      console.error('❌ Toggle error:', err);
      toast.error('Failed to update status');
    }
  };

  // SVG Icons
  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3l4 4-7 7H10v-4l7-7z"/>
      <path d="M4 20h16"/>
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading announcements...</p>
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
          <h1 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e', marginBottom: '4px' }}>Manage Announcements</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Create and manage news ticker announcements</p>
          <Link to="/admin" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Back to Dashboard</Link>
        </div>
        <div style={{ background: '#eff6ff', padding: '8px 16px', borderRadius: '12px' }}>
          <span style={{ fontSize: '13px', color: '#1e3a8a' }}>
            📢 {announcements.filter(a => a.isActive).length} active / {announcements.length} total
          </span>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '28px' }}>{editItem ? '✏️' : '➕'}</span>
          <h2 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", color: '#1e3a8a', fontWeight: '700', margin: 0 }}>
            {editItem ? 'Edit Announcement' : 'Add New Announcement'}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Announcement Text *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., 🎉 New products available! Free delivery on orders over TSh 50,000"
              rows={4}
              required
              style={{
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>HTML and emojis are supported</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '24px'
          }} className="form-row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Display Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                min="0"
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
                placeholder="0"
              />
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Lower numbers appear first</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Status</label>
              <select
                value={isActive}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="true">✅ Active (shows on website)</option>
                <option value="false">⛔ Inactive (hidden)</option>
              </select>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Inactive announcements won't show in the ticker</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            {editItem && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? '⏳ Saving...' : (editItem ? '✓ Update Announcement' : '+ Add Announcement')}
            </button>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e', fontWeight: '700', margin: 0 }}>All Announcements</h2>
          <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{announcements.length} total</span>
        </div>

        {announcements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📢</div>
            <p>No announcements yet</p>
            <p style={{ fontSize: '13px', marginTop: '8px', color: '#94a3b8' }}>Create your first announcement using the form above</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map((item, index) => (
              <div key={item._id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }} className="announcement-card">
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#eff6ff',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: '#1e3a8a',
                  fontSize: '14px',
                  flexShrink: 0
                }} className="announcement-number">
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', color: '#0f172a', marginBottom: '8px', lineHeight: '1.5' }}>{item.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: item.isActive ? '#d1fae5' : '#fee2e2',
                      color: item.isActive ? '#059669' : '#dc2626'
                    }}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span style={{ padding: '2px 10px', background: '#f1f5f9', borderRadius: '20px', fontSize: '11px', color: '#64748b' }}>Order: {item.order || 0}</span>
                    <span style={{ padding: '2px 10px', background: '#f1f5f9', borderRadius: '20px', fontSize: '11px', color: '#64748b' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleActive(item)}
                    style={{
                      background: item.isActive ? '#fee2e2' : '#d1fae5',
                      color: item.isActive ? '#dc2626' : '#059669',
                      border: 'none',
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                    title={item.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {item.isActive ? '⛔' : '✅'}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      background: '#eff6ff',
                      color: '#3b82f6',
                      border: 'none',
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: 'none',
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>
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
        
        @media (min-width: 769px) {
          .form-row {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .announcement-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          
          .announcement-number {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .form-buttons {
            flex-direction: column !important;
          }
          
          .form-buttons button {
            width: 100% !important;
          }
          
          .announcement-actions {
            align-self: flex-end !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageAnnouncements;