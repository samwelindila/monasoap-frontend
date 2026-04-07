import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768 && selectedMsg) {
        setMobileView('detail');
      } else {
        setMobileView('list');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [selectedMsg]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await API.get('/contact');
      setMessages(res.data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (msg) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      await markAsRead(msg._id);
    }
    if (window.innerWidth <= 768) {
      setMobileView('detail');
    }
  };

  const backToList = () => {
    setMobileView('list');
    setSelectedMsg(null);
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/contact/${id}/read`);
      setMessages(prev =>
        prev.map(m => (m._id === id ? { ...m, isRead: true } : m))
      );
    } catch (err) {
      console.log('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await API.delete(`/contact/${id}`);
      toast.success('Message deleted');
      setMessages(messages.filter(m => m._id !== id));
      if (selectedMsg?._id === id) {
        setSelectedMsg(null);
        setMobileView('list');
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered =
    filter === 'unread'
      ? messages.filter(m => !m.isRead)
      : filter === 'read'
      ? messages.filter(m => m.isRead)
      : messages;

  const unreadCount = messages.filter(m => !m.isRead).length;

  // SVG Icons
  const ReplyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading messages...</p>
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
          <h1 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            Contact Messages
            {unreadCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '12px', padding: '2px 12px', borderRadius: '20px', fontWeight: '600' }}>{unreadCount} new</span>
            )}
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>View and manage customer inquiries</p>
          <Link to="/admin" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Back to Dashboard</Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 20px',
            border: filter === 'all' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
            borderRadius: '30px',
            background: filter === 'all' ? '#3b82f6' : '#fff',
            fontSize: '13px',
            cursor: 'pointer',
            color: filter === 'all' ? '#fff' : '#64748b',
            fontWeight: filter === 'all' ? '600' : '500'
          }}
        >
          📬 All ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '8px 20px',
            border: filter === 'unread' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
            borderRadius: '30px',
            background: filter === 'unread' ? '#3b82f6' : '#fff',
            fontSize: '13px',
            cursor: 'pointer',
            color: filter === 'unread' ? '#fff' : '#64748b',
            fontWeight: filter === 'unread' ? '600' : '500'
          }}
        >
          🆕 Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          style={{
            padding: '8px 20px',
            border: filter === 'read' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
            borderRadius: '30px',
            background: filter === 'read' ? '#3b82f6' : '#fff',
            fontSize: '13px',
            cursor: 'pointer',
            color: filter === 'read' ? '#fff' : '#64748b',
            fontWeight: filter === 'read' ? '600' : '500'
          }}
        >
          ✓ Read ({messages.length - unreadCount})
        </button>
      </div>

      {/* Mobile: Show back button when in detail view */}
      {mobileView === 'detail' && (
        <button
          onClick={backToList}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f1f5f9',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '10px',
            marginBottom: '16px',
            cursor: 'pointer',
            color: '#1e3a8a',
            fontWeight: '500'
          }}
        >
          <BackIcon />
          Back to Messages
        </button>
      )}

      {/* Main Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: '24px'
      }} className="messages-layout">
        
        {/* Messages List */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          display: (mobileView === 'list' || window.innerWidth > 768) ? 'block' : 'none'
        }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
              <p>No messages found</p>
            </div>
          ) : (
            filtered.map(msg => (
              <div
                key={msg._id}
                onClick={() => openMessage(msg)}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  background: selectedMsg?._id === msg._id ? '#eff6ff' : '#ffffff',
                  borderLeft: !msg.isRead ? '4px solid #3b82f6' : '4px solid transparent'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{msg.name}</span>
                      {!msg.isRead && <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block' }} />}
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>{msg.email}</span>
                    <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: 0 }}>
                      {msg.message.substring(0, 50)}{msg.message.length > 50 ? '...' : ''}
                    </p>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0, marginLeft: '12px' }}>
                  {new Date(msg.createdAt).toLocaleDateString('en-TZ', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          display: (mobileView === 'detail' || window.innerWidth > 768) ? 'block' : 'none'
        }}>
          {!selectedMsg ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>✉️</div>
              <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>Select a message to read it</p>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Click on any message from the list</p>
            </div>
          ) : (
            <div style={{ padding: '24px' }}>
              {/* Header */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {selectedMsg.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{selectedMsg.name}</h3>
                  <p style={{ fontSize: '13px', color: '#3b82f6', marginBottom: '4px' }}>{selectedMsg.email}</p>
                  {selectedMsg.phone && (
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>📞 {selectedMsg.phone}</p>
                  )}
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(selectedMsg.createdAt).toLocaleDateString('en-TZ', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit', hour12: true
                    })}
                  </p>
                </div>
                {selectedMsg.isRead ? (
                  <span style={{ background: '#d1fae5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', height: 'fit-content' }}>✓ Read</span>
                ) : (
                  <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', height: 'fit-content' }}>🆕 New</span>
                )}
              </div>

              {/* Message Body */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a', marginBottom: '12px' }}>Message:</h4>
                <div style={{
                  fontSize: '15px',
                  color: '#334155',
                  lineHeight: '1.7',
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '16px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {selectedMsg.message}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: Your message to MonaSoap`}
                  style={{ background: '#3b82f6', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <ReplyIcon />
                  Reply via Email
                </a>
                {selectedMsg.phone && (
                  <a
                    href={`https://wa.me/${selectedMsg.phone.replace(/\D/g, '')}`}
                    style={{ background: '#25d366', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                )}
                {!selectedMsg.isRead && (
                  <button
                    onClick={() => markAsRead(selectedMsg._id)}
                    style={{ background: '#f1f5f9', color: '#1e3a8a', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <CheckIcon />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMsg._id)}
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <DeleteIcon />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .messages-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageMessages;