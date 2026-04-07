// components/NewsTicker.jsx
import { useState, useEffect } from 'react';
import API from '../utils/api';

const NewsTicker = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/announcements');
        console.log('NewsTicker - Raw announcements:', res.data);
        
        // Filter only active announcements
        const activeAnnouncements = res.data.filter(a => a.isActive === true);
        console.log('NewsTicker - Active announcements:', activeAnnouncements);
        
        setAnnouncements(activeAnnouncements);
      } catch (error) {
        console.log('NewsTicker - Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Don't show while loading or if no active announcements
  if (loading) return null;
  if (!announcements.length) return null;

  // Create scrolling text from all active announcements
  const text = announcements.map(a => a.text).join('     •     ');

  return (
    <div style={{ 
      position: 'relative', 
      zIndex: 999, 
      width: '100%',
      display: 'block',
      marginBottom: '0'
    }}>
      <style>{`
        @keyframes nt-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes nt-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }

        .nt-wrap {
          position: relative;
          display: flex !important;
          align-items: center;
          height: 52px;
          overflow: hidden;
          width: 100%;
          background: linear-gradient(135deg, #0a2448 0%, #0d2f5e 100%);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          z-index: 999;
          visibility: visible !important;
          opacity: 1 !important;
        }

        .nt-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #1565c0, #4fa3e0, #7cb8ff, #4fa3e0, #1565c0);
        }

        .nt-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 28px;
          height: 100%;
          background: linear-gradient(135deg, #0a1a3a 0%, #0a2448 100%);
          border-right: 1px solid rgba(255,255,255,0.12);
          flex-shrink: 0;
          z-index: 2;
        }

        .nt-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4fa3e0;
          animation: nt-blink 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .nt-label {
          font-family: 'Jost', 'DM Sans', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: rgba(255,255,255,0.9);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .nt-divider {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
          margin: 0 6px;
        }

        .nt-track {
          flex: 1;
          overflow: hidden;
          height: 100%;
          display: flex;
          align-items: center;
          mask-image: linear-gradient(90deg, transparent 0%, black 3%, black 97%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 3%, black 97%, transparent 100%);
        }

        .nt-belt {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: nt-scroll 42s linear infinite;
        }

        .nt-belt:hover {
          animation-play-state: paused;
        }

        .nt-text {
          font-family: 'Jost', 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.88);
          padding-left: 56px;
          letter-spacing: 0.3px;
          line-height: 1;
        }

        .nt-fade {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 80px;
          background: linear-gradient(90deg, transparent, #0d2f5e);
          pointer-events: none;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .nt-wrap { height: 46px; }
          .nt-badge { padding: 0 20px; gap: 8px; }
          .nt-label { font-size: 10px; letter-spacing: 2px; }
          .nt-text { font-size: 12.5px; padding-left: 40px; }
          .nt-divider { height: 20px; }
          .nt-fade { width: 60px; }
        }

        @media (max-width: 480px) {
          .nt-wrap { height: 42px; }
          .nt-badge { padding: 0 14px; gap: 6px; }
          .nt-label { font-size: 9px; letter-spacing: 1.5px; }
          .nt-text { font-size: 11px; padding-left: 32px; }
          .nt-dot { width: 6px; height: 6px; }
          .nt-divider { height: 16px; }
          .nt-fade { width: 50px; }
        }
      `}</style>

      <div className="nt-wrap">
        <div className="nt-badge">
          <span className="nt-dot" />
          <span className="nt-label">Announcements</span>
        </div>
        <div className="nt-divider" />
        <div className="nt-track">
          <div className="nt-belt">
            <span className="nt-text">{text}</span>
            <span className="nt-text">{text}</span>
          </div>
        </div>
        <div className="nt-fade" />
      </div>
    </div>
  );
};

export default NewsTicker;