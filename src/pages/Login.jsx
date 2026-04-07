import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import soap1 from '../assets/images/soap1.jpg';
import soap2 from '../assets/images/soap2.jpg';
import soap3 from '../assets/images/soap3.jpg';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const res = await API.post('/auth/login', formData);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lx-wrap {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #fff;
        }

        /* ── LEFT: FORM ── */
        .lx-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 48px;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .lx-left::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 0% 0%, rgba(37,99,235,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 55% 50% at 100% 100%, rgba(147,197,253,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .lx-card {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
          animation: lxUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes lxUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lx-brand { margin-bottom: 44px; }

        .lx-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 34px;
          font-weight: 700;
          color: #0a0f1e;
          line-height: 1;
          margin-bottom: 6px;
        }
        .lx-logo span { color: #2563eb; }

        .lx-logo-sub {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.8px;
        }

        .lx-welcome { margin-bottom: 36px; }

        .lx-welcome h2 {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 700;
          color: #0a0f1e;
          margin-bottom: 7px;
          line-height: 1.2;
        }
        .lx-welcome h2 span { color: #2563eb; }
        .lx-welcome p { font-size: 14px; color: #94a3b8; }

        .lx-form { display: flex; flex-direction: column; gap: 20px; }

        .lx-field { display: flex; flex-direction: column; gap: 7px; }

        .lx-label {
          font-size: 11.5px;
          font-weight: 700;
          color: #1e3a8a;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .lx-input-wrap { position: relative; display: flex; align-items: center; }

        .lx-icon {
          position: absolute; left: 14px;
          color: #94a3b8; display: flex; align-items: center;
          pointer-events: none; transition: color 0.2s;
        }
        .lx-input-wrap:focus-within .lx-icon { color: #3b82f6; }

        .lx-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14.5px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lx-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
        .lx-input::placeholder { color: #cbd5e1; }

        .lx-pw-btn {
          position: absolute; right: 12px;
          background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center;
          padding: 4px; border-radius: 6px; transition: color 0.2s;
        }
        .lx-pw-btn:hover { color: #3b82f6; }

        .lx-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff; font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: none; border-radius: 50px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 6px 20px rgba(37,99,235,0.28);
          margin-top: 8px; letter-spacing: 0.2px;
        }
        .lx-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(37,99,235,0.38);
          background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
        }
        .lx-submit:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
        .lx-submit svg { transition: transform 0.2s; }
        .lx-submit:hover:not(:disabled) svg { transform: translateX(4px); }

        .lx-footer {
          text-align: center; margin-top: 28px;
          font-size: 13.5px; color: #94a3b8;
        }
        .lx-footer a { color: #2563eb; font-weight: 700; text-decoration: none; transition: color 0.2s; }
        .lx-footer a:hover { color: #1d4ed8; text-decoration: underline; }

        /* ── RIGHT: SLIDESHOW ── */
        .lx-right {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #0a0f1e, #0d1f4a);
        }

        .lx-slide {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.1s ease-in-out;
        }
        .lx-slide.active { opacity: 1; }

        .lx-slide::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5,10,28,0.3) 0%,
            rgba(8,18,52,0.4) 40%,
            rgba(5,10,28,0.78) 100%
          );
        }

        /* Brand on slide */
        .lx-slide-brand {
          position: absolute;
          top: 36px; left: 40px; z-index: 3;
          display: flex; align-items: center; gap: 12px;
        }

        .lx-slide-brand__logo {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700; color: #fff;
        }
        .lx-slide-brand__logo span { color: #93c5fd; }

        .lx-slide-brand__badge {
          display: flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border-radius: 20px; padding: 4px 13px;
          font-size: 11px; color: #bfdbfe; font-weight: 600; letter-spacing: 0.5px;
        }

        .lx-slide-brand__dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #34d399;
          animation: lxPulse 2s infinite;
        }

        @keyframes lxPulse {
          0%,100%{ opacity:1; transform:scale(1); }
          50%    { opacity:.5; transform:scale(1.4); }
        }

        /* Slide content */
        .lx-slide-content {
          position: absolute;
          bottom: 92px; left: 0; right: 0;
          text-align: center; z-index: 2;
          padding: 0 48px;
        }

        .lx-slide-content h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 30px; font-weight: 700; color: #fff;
          margin-bottom: 10px; letter-spacing: -0.3px;
        }

        .lx-slide-content p {
          font-size: 15px; color: rgba(255,255,255,0.7);
          line-height: 1.6; max-width: 360px; margin: 0 auto;
        }

        /* Progress bars */
        .lx-progress {
          position: absolute;
          bottom: 40px; left: 40px; right: 40px; z-index: 3;
        }

        .lx-progress__bars { display: flex; gap: 8px; }

        .lx-progress__bar {
          flex: 1; height: 3px;
          background: rgba(255,255,255,0.2);
          border-radius: 3px; overflow: hidden;
          cursor: pointer;
        }

        .lx-progress__fill {
          height: 100%; background: #fff;
          border-radius: 3px; width: 0%;
        }

        .lx-progress__bar.active .lx-progress__fill {
          width: 100%;
          transition: width 4s linear;
        }

        .lx-progress__bar.done .lx-progress__fill { width: 100%; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .lx-right { display: none; }
          .lx-left { min-height: 100vh; }
        }

        @media (max-width: 560px) {
          .lx-left { padding: 36px 22px; }
        }
      `}</style>

      <div className="lx-wrap">

        {/* ── FORM ── */}
        <div className="lx-left">
          <div className="lx-card">

            <div className="lx-brand">
              <div className="lx-logo">Mona<span>Soap</span></div>
              <div className="lx-logo-sub">Multipurpose Liquid Soap</div>
            </div>

            <div className="lx-welcome">
              <h2>Welcome <span>back</span></h2>
              <p>Sign in to your account to continue.</p>
            </div>

            <form className="lx-form" onSubmit={handleSubmit}>

              <div className="lx-field">
                <label className="lx-label">Email</label>
                <div className="lx-input-wrap">
                  <span className="lx-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="hello@monasoap.com"
                    required className="lx-input" />
                </div>
              </div>

              <div className="lx-field">
                <label className="lx-label">Password</label>
                <div className="lx-input-wrap">
                  <span className="lx-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input type={showPassword ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="••••••••" required className="lx-input"
                    style={{ paddingRight: '40px' }} />
                  <button type="button" className="lx-pw-btn" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="lx-submit">
                {loading ? 'Signing in…' : (
                  <>
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="lx-footer">
              Don't have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </div>

        {/* ── SLIDESHOW ── */}
        <div className="lx-right">

          <div className="lx-slide-brand">
            <div className="lx-slide-brand__logo">Mona<span>Soap</span></div>
            <div className="lx-slide-brand__badge">
              <span className="lx-slide-brand__dot" />
              Handcrafted in Tanzania
            </div>
          </div>

          {images.map((img, i) => (
            <div key={i}
              className={`lx-slide ${currentImage === i ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img.url})` }}>
              <div className="lx-slide-content">
                <h3>{img.title}</h3>
                <p>{img.description}</p>
              </div>
            </div>
          ))}

          <div className="lx-progress">
            <div className="lx-progress__bars">
              {images.map((_, i) => (
                <div key={i}
                  className={`lx-progress__bar ${currentImage === i ? 'active' : ''} ${i < currentImage ? 'done' : ''}`}
                  onClick={() => setCurrentImage(i)}>
                  <div className="lx-progress__fill" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;