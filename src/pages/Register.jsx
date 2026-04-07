import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import soap1 from '../assets/images/soap1.jpg';
import soap2 from '../assets/images/soap2.jpg';
import soap3 from '../assets/images/soap3.jpg';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    phone: '', whatsapp: '', address: '', location: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    { 
      url: soap1, 
      title: 'Place Your Order', 
      description: 'Browse our products and place your order quickly and securely in just a few simple steps.' 
    },
    { 
      url: soap2, 
      title: 'Fast & Reliable Delivery', 
      description: 'We deliver your order straight to your doorstep with speed, care, and reliability you can trust.' 
    },
    { 
      url: soap3, 
      title: 'Track Your Order', 
      description: 'Stay updated in real-time and track your order easily from dispatch to final delivery.' 
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentImage(p => (p + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/register', formData);
      login(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rx-wrap {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #fff;
        }

        /* ── SLIDESHOW ── */
        .rx-right {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #0a0f1e, #0d1f4a);
        }

        .rx-slide {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0; transition: opacity 1.1s ease-in-out;
        }
        .rx-slide.active { opacity: 1; }

        .rx-slide::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(5,10,28,.3) 0%, rgba(8,18,52,.4) 40%, rgba(5,10,28,.78) 100%);
        }

        .rx-slide-brand {
          position: absolute; top: 36px; left: 40px; z-index: 3;
          display: flex; align-items: center; gap: 12px;
        }
        .rx-slide-brand__logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #fff; }
        .rx-slide-brand__logo span { color: #93c5fd; }

        .rx-slide-brand__badge {
          display: flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
          backdrop-filter: blur(8px); border-radius: 20px; padding: 4px 13px;
          font-size: 11px; color: #bfdbfe; font-weight: 600; letter-spacing: .5px;
        }
        .rx-slide-brand__dot { width: 5px; height: 5px; border-radius: 50%; background: #34d399; animation: rxPulse 2s infinite; }

        @keyframes rxPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

        .rx-slide-content {
          position: absolute; bottom: 92px; left: 0; right: 0;
          text-align: center; z-index: 2; padding: 0 48px;
        }
        .rx-slide-content h3 { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: #fff; margin-bottom: 10px; letter-spacing: -.3px; }
        .rx-slide-content p { font-size: 15px; color: rgba(255,255,255,.7); line-height: 1.6; max-width: 360px; margin: 0 auto; }

        .rx-progress { position: absolute; bottom: 40px; left: 40px; right: 40px; z-index: 3; }
        .rx-progress__bars { display: flex; gap: 8px; }
        .rx-progress__bar { flex: 1; height: 3px; background: rgba(255,255,255,.2); border-radius: 3px; overflow: hidden; cursor: pointer; }
        .rx-progress__fill { height: 100%; background: #fff; border-radius: 3px; width: 0%; }
        .rx-progress__bar.active .rx-progress__fill { width: 100%; transition: width 4s linear; }
        .rx-progress__bar.done .rx-progress__fill { width: 100%; }

        /* ── FORM ── */
        .rx-left {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 48px 44px; background: #ffffff;
          position: relative; overflow-y: auto;
        }
        .rx-left::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 100% 0%, rgba(37,99,235,.06) 0%, transparent 60%),
            radial-gradient(ellipse 55% 50% at 0% 100%, rgba(147,197,253,.07) 0%, transparent 60%);
          pointer-events: none;
        }

        .rx-card {
          width: 100%; max-width: 560px;
          position: relative; z-index: 1;
          animation: rxUp .55s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes rxUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .rx-brand { margin-bottom: 32px; }
        .rx-logo { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; color: #0a0f1e; line-height: 1; margin-bottom: 6px; }
        .rx-logo span { color: #2563eb; }
        .rx-logo-sub { font-size: 11.5px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1.8px; }

        .rx-header { margin-bottom: 28px; }
        .rx-header h2 { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #0a0f1e; margin-bottom: 6px; line-height: 1.2; }
        .rx-header h2 span { color: #2563eb; }
        .rx-header p { font-size: 13.5px; color: #94a3b8; }

        .rx-form { display: flex; flex-direction: column; gap: 14px; }
        .rx-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .rx-field { display: flex; flex-direction: column; gap: 6px; }

        .rx-label { font-size: 11px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 1px; }
        .rx-label span { color: #ef4444; margin-left: 2px; }

        .rx-input-wrap { position: relative; display: flex; align-items: center; }
        .rx-icon { position: absolute; left: 13px; color: #94a3b8; display: flex; align-items: center; pointer-events: none; transition: color .2s; }
        .rx-input-wrap:focus-within .rx-icon { color: #3b82f6; }

        .rx-input {
          width: 100%; padding: 11px 14px 11px 40px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #0f172a; background: #f8fafc; outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .rx-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .rx-input::placeholder { color: #cbd5e1; }

        .rx-pw-btn { position: absolute; right: 11px; background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; align-items: center; padding: 4px; border-radius: 6px; transition: color .2s; }
        .rx-pw-btn:hover { color: #3b82f6; }

        .rx-hint { font-size: 11px; color: #94a3b8; padding-left: 2px; }

        .rx-divider { position: relative; margin: 6px 0; }
        .rx-divider hr { border: none; height: 1px; background: #f1f5f9; }
        .rx-divider span { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px; background: #fff; padding: 0 12px; white-space: nowrap; }

        .rx-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff; font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; border: none; border-radius: 50px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform .2s, box-shadow .2s, background .2s;
          box-shadow: 0 6px 20px rgba(37,99,235,.28); margin-top: 6px; letter-spacing: .2px;
        }
        .rx-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,.38); background: linear-gradient(135deg, #1e3a8a, #1d4ed8); }
        .rx-submit:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
        .rx-submit svg { transition: transform .2s; }
        .rx-submit:hover:not(:disabled) svg { transform: translateX(4px); }

        .rx-footer { text-align: center; margin-top: 22px; font-size: 13.5px; color: #94a3b8; }
        .rx-footer a { color: #2563eb; font-weight: 700; text-decoration: none; }
        .rx-footer a:hover { color: #1d4ed8; text-decoration: underline; }

        @media (max-width: 900px) {
          .rx-right { display: none; }
          .rx-left { min-height: 100vh; padding: 48px 24px; }
        }
        @media (max-width: 560px) {
          .rx-left { padding: 36px 20px; }
          .rx-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rx-wrap">

        {/* ── FORM ── */}
        <div className="rx-left">
          <div className="rx-card">

            <div className="rx-brand">
              <div className="rx-logo">Mona<span>Soap</span></div>
              <div className="rx-logo-sub">Multipurpose Liquid Soap</div>
            </div>

            <div className="rx-header">
              <h2>Create your <span>account</span></h2>
              <p>Fill in your details to get started — it only takes a minute.</p>
            </div>

            <form className="rx-form" onSubmit={handleSubmit}>

              <div className="rx-row">
                <div className="rx-field">
                  <label className="rx-label">Full Name <span>*</span></label>
                  <div className="rx-input-wrap">
                    <span className="rx-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Amina Hassan" required className="rx-input" />
                  </div>
                </div>

                <div className="rx-field">
                  <label className="rx-label">Email <span>*</span></label>
                  <div className="rx-input-wrap">
                    <span className="rx-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="amina@monasoap.com" required className="rx-input" />
                  </div>
                </div>
              </div>

              <div className="rx-row">
                <div className="rx-field">
                  <label className="rx-label">Password <span>*</span></label>
                  <div className="rx-input-wrap">
                    <span className="rx-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input type={showPassword ? 'text' : 'password'} name="password"
                      value={formData.password} onChange={handleChange}
                      placeholder="Min. 6 characters" required className="rx-input"
                      style={{ paddingRight: '38px' }} />
                    <button type="button" className="rx-pw-btn" onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="rx-field">
                  <label className="rx-label">Phone <span>*</span></label>
                  <div className="rx-input-wrap">
                    <span className="rx-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="+255 700 000 000" required className="rx-input" />
                  </div>
                </div>
              </div>

              <div className="rx-divider">
                <hr />
                <span>Optional Details</span>
              </div>

              <div className="rx-row">
                <div className="rx-field">
                  <label className="rx-label">WhatsApp</label>
                  <div className="rx-input-wrap">
                    <span className="rx-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </span>
                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                      placeholder="+255 700 000 000" className="rx-input" />
                  </div>
                </div>

                <div className="rx-field">
                  <label className="rx-label">Street Address</label>
                  <div className="rx-input-wrap">
                    <span className="rx-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </span>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                      placeholder="Kariakoo, Dar es Salaam" className="rx-input" />
                  </div>
                </div>
              </div>

              <div className="rx-field">
                <label className="rx-label">Delivery Location <span>*</span></label>
                <div className="rx-input-wrap">
                  <span className="rx-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <input type="text" name="location" value={formData.location} onChange={handleChange}
                    placeholder="e.g. Dar es Salaam, Tanzania" required className="rx-input" />
                </div>
                <p className="rx-hint">📦 Used for delivery estimates</p>
              </div>

              <button type="submit" disabled={loading} className="rx-submit">
                {loading ? 'Creating account…' : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="rx-footer">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>

        {/* ── SLIDESHOW ── */}
        <div className="rx-right">
          <div className="rx-slide-brand">
            <div className="rx-slide-brand__logo">Mona<span>Soap</span></div>
            <div className="rx-slide-brand__badge">
              <span className="rx-slide-brand__dot" />
              Handcrafted in Tanzania
            </div>
          </div>

          {images.map((img, i) => (
            <div key={i} className={`rx-slide ${currentImage === i ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img.url})` }}>
              <div className="rx-slide-content">
                <h3>{img.title}</h3>
                <p>{img.description}</p>
              </div>
            </div>
          ))}

          <div className="rx-progress">
            <div className="rx-progress__bars">
              {images.map((_, i) => (
                <div key={i}
                  className={`rx-progress__bar ${currentImage === i ? 'active' : ''} ${i < currentImage ? 'done' : ''}`}
                  onClick={() => setCurrentImage(i)}>
                  <div className="rx-progress__fill" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Register;