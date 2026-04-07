import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

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

  const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );

  const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );

  const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );

  const TwitterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
    </svg>
  );

  return (
    <>
      <style>{`
        .mona-footer {
          background: linear-gradient(160deg, #0a0f1e 0%, #0d1f4a 45%, #102358 100%);
          color: #fff;
          padding: 72px 0 0;
          margin-top: auto;
          width: 100%;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .mona-footer__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .mona-footer__grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.2fr 1fr;
          gap: 48px;
          margin-bottom: 56px;
        }

        /* Brand column */
        .mona-footer__logo {
          font-size: 28px;
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: -0.3px;
        }

        .mona-footer__logo span {
          color: #93c5fd;
        }

        .mona-footer__tagline {
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.75;
          margin: 0 0 24px;
          max-width: 240px;
        }

        .mona-footer__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(147, 197, 253, 0.08);
          border: 1px solid rgba(147, 197, 253, 0.18);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          color: #93c5fd;
          letter-spacing: 0.3px;
        }

        .mona-footer__badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          flex-shrink: 0;
        }

        /* Section headings */
        .mona-footer__heading {
          font-size: 10.5px;
          font-weight: 600;
          color: #93c5fd;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0 0 22px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mona-footer__heading::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(147, 197, 253, 0.15);
        }

        /* Nav links */
        .mona-footer__nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mona-footer__nav a {
          font-size: 14px;
          color: #94a3b8;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s, transform 0.2s;
          width: fit-content;
        }

        .mona-footer__nav a::before {
          content: '›';
          color: #3b82f6;
          font-size: 16px;
          line-height: 1;
          transition: transform 0.2s;
        }

        .mona-footer__nav a:hover {
          color: #e2e8f0;
          transform: translateX(4px);
        }

        /* Contact items */
        .mona-footer__contact-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mona-footer__contact-item,
        .mona-footer__contact-link {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13.5px;
          color: #94a3b8;
          text-decoration: none;
          line-height: 1.4;
          transition: color 0.2s;
        }

        .mona-footer__contact-link:hover {
          color: #e2e8f0;
        }

        .mona-footer__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }

        .mona-footer__contact-link:hover .mona-footer__icon,
        a:hover .mona-footer__icon {
          background: rgba(59, 130, 246, 0.22);
          border-color: rgba(59, 130, 246, 0.4);
        }

        /* Social links */
        .mona-footer__social-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mona-footer__social-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
          padding: 6px 0;
        }

        .mona-footer__social-link:hover {
          color: #e2e8f0;
        }

        .mona-footer__social-link:hover .mona-footer__icon {
          background: rgba(59, 130, 246, 0.22);
          border-color: rgba(59, 130, 246, 0.4);
        }

        /* Map section */
        .mona-footer__map-section {
          margin-bottom: 40px;
        }

        .mona-footer__map {
          width: 100%;
          height: 200px;
          border: none;
          border-radius: 12px;
          display: block;
          margin-top: 16px;
        }

        /* Lipa section */
        .mona-footer__lipa {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(147, 197, 253, 0.07);
          border: 1px solid rgba(147, 197, 253, 0.2);
          border-radius: 12px;
          padding: 16px 28px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .mona-footer__lipa-icon {
          font-size: 20px;
        }

        .mona-footer__lipa-text {
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }

        .mona-footer__lipa-number {
          font-size: 18px;
          font-weight: 700;
          color: #93c5fd;
          letter-spacing: 0.5px;
        }

        /* Divider */
        .mona-footer__divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.15) 30%, rgba(147, 197, 253, 0.15) 70%, transparent);
          margin-bottom: 0;
        }

        /* Bottom bar */
        .mona-footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0 28px;
          font-size: 12.5px;
          color: #64748b;
          flex-wrap: wrap;
          gap: 8px;
        }

        .mona-footer__bottom span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .mona-footer__heart {
          color: #f87171;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .mona-footer__grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 640px) {
          .mona-footer {
            padding-top: 52px;
          }

          .mona-footer__inner {
            padding: 0 20px;
          }

          .mona-footer__grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .mona-footer__tagline {
            max-width: 100%;
          }

          .mona-footer__bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .mona-footer__lipa {
            text-align: center;
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>

      <footer className="mona-footer">
        <div className="mona-footer__inner">
          <div className="mona-footer__grid">

            {/* Brand */}
            <div>
              <h3 className="mona-footer__logo">
                Mona<span>Soap</span>
              </h3>
              <p className="mona-footer__tagline">
                Premium handcrafted soaps and body care products made with natural ingredients from Tanzania.
              </p>
              <span className="mona-footer__badge">Handcrafted in Tanzania</span>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mona-footer__heading">Quick Links</h4>
              <nav className="mona-footer__nav">
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/register">Create Account</Link>
                <Link to="/login">Login</Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mona-footer__heading">Contact Us</h4>
              <div className="mona-footer__contact-list">
                <div className="mona-footer__contact-item">
                  <span className="mona-footer__icon"><PhoneIcon /></span>
                  {settings?.phone || '+255 700 000 000'}
                </div>

                {settings?.whatsapp ? (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mona-footer__contact-link"
                  >
                    <span className="mona-footer__icon"><WhatsAppIcon /></span>
                    WhatsApp: {settings.whatsapp}
                  </a>
                ) : (
                  <div className="mona-footer__contact-item">
                    <span className="mona-footer__icon"><WhatsAppIcon /></span>
                    WhatsApp: +255 700 000 000
                  </div>
                )}

                <div className="mona-footer__contact-item">
                  <span className="mona-footer__icon"><EmailIcon /></span>
                  {settings?.email || 'info@monasoap.com'}
                </div>

                <div className="mona-footer__contact-item">
                  <span className="mona-footer__icon"><LocationIcon /></span>
                  {settings?.location || 'Dar es Salaam, Tanzania'}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="mona-footer__heading">Follow Us</h4>
              <div className="mona-footer__social-list">
                {settings?.facebook ? (
                  <a href={settings.facebook} target="_blank" rel="noreferrer" className="mona-footer__social-link">
                    <span className="mona-footer__icon"><FacebookIcon /></span>
                    Facebook
                  </a>
                ) : (
                  <span className="mona-footer__social-link">
                    <span className="mona-footer__icon"><FacebookIcon /></span>
                    Facebook: MonaSoap
                  </span>
                )}

                {settings?.instagram ? (
                  <a href={settings.instagram} target="_blank" rel="noreferrer" className="mona-footer__social-link">
                    <span className="mona-footer__icon"><InstagramIcon /></span>
                    Instagram
                  </a>
                ) : (
                  <span className="mona-footer__social-link">
                    <span className="mona-footer__icon"><InstagramIcon /></span>
                    Instagram: @MonaSoap
                  </span>
                )}

                {settings?.twitter ? (
                  <a href={settings.twitter} target="_blank" rel="noreferrer" className="mona-footer__social-link">
                    <span className="mona-footer__icon"><TwitterIcon /></span>
                    Twitter
                  </a>
                ) : (
                  <span className="mona-footer__social-link">
                    <span className="mona-footer__icon"><TwitterIcon /></span>
                    Twitter: @MonaSoap
                  </span>
                )}

                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mona-footer__social-link"
                  >
                    <span className="mona-footer__icon"><WhatsAppIcon /></span>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>

        

          {/* Lipa Number */}
          {settings?.lipaNumber && (
            <div className="mona-footer__lipa">
              <span className="mona-footer__lipa-icon">💳</span>
              <p className="mona-footer__lipa-text">
                Pay via MIXX BY YAS Lipa Number:
              </p>
              <strong className="mona-footer__lipa-number">{settings.lipaNumber}</strong>
            </div>
          )}

          <div className="mona-footer__divider" />

          {/* Bottom */}
          <div className="mona-footer__bottom">
            <span>© {new Date().getFullYear()} MonaSoap. All rights reserved.</span>
            <span>Designed & Built by NdillaTech</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;