import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── Replace this with your own logo image path ──
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* Grid Background Wrapper */}
      <div className="navbar-grid-wrapper">
        <div className="navbar-grid-overlay" />

        {/* Outer wrapper — transparent, provides the floating gap */}
        <div className={`nb-wrap ${scrolled ? 'nb-wrap--scrolled' : ''}`}>

          {/* The floating pill bar */}
          <nav className={`nb ${scrolled ? 'nb--scrolled' : ''}`}>

            {/* ── Logo image ── */}
            <Link to="/" className="nb__logo">
              <img
                src={logoImg}
                alt="MonaSoap Logo"
                className="nb__logo-img"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <span className="nb__logo-fallback" style={{ display: 'none' }}>
                <span className="nb__logo-mona">Mona</span><span className="nb__logo-soap">Soap</span>
              </span>
            </Link>

            {/* ── Desktop center links ── */}
            {!isMobile && (
              <div className="nb__links">
                {navLinks.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nb__link ${isActive(item.path) ? 'nb__link--active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* ── Right side ── */}
            <div className="nb__right">
              {!isMobile && (
                !user ? (
                  <>
                    <Link to="/login" className="nb__btn nb__btn--ghost">Login</Link>
                    <Link to="/register" className="nb__btn nb__btn--solid">
                      Get Started
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </>
                ) : (
                  <div className="nb__user" ref={dropRef}>
                    <button className="nb__avatar-btn" onClick={() => setDropOpen(v => !v)} aria-label="User menu">
                      <span className="nb__avatar">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                      <span className="nb__username">{user.name?.split(' ')[0]}</span>
                      <svg className={`nb__chevron ${dropOpen ? 'nb__chevron--open' : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                    </button>

                    {dropOpen && (
                      <div className="nb__drop">
                        <div className="nb__drop-head">
                          <div className="nb__drop-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                          <div>
                            <p className="nb__drop-name">{user.name}</p>
                            <p className="nb__drop-role">{user.role}</p>
                          </div>
                        </div>
                        <div className="nb__drop-divider" />
                        <Link to={dashboardPath} className="nb__drop-item">
                          <span className="nb__drop-item-icon nb__drop-item-icon--blue">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                          </span>
                          Dashboard
                          <svg className="nb__drop-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </Link>
                        <div className="nb__drop-divider" />
                        <button onClick={handleLogout} className="nb__drop-item nb__drop-item--danger">
                          <span className="nb__drop-item-icon nb__drop-item-icon--red">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          </span>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Hamburger */}
              {isMobile && (
                <button
                  className={`nb__burger ${menuOpen ? 'nb__burger--open' : ''}`}
                  onClick={() => setMenuOpen(v => !v)}
                  aria-label="Toggle menu"
                >
                  <span /><span /><span />
                </button>
              )}
            </div>
          </nav>

          {/* ── Mobile drawer ── */}
          {isMobile && (
            <div className={`nb__mobile ${menuOpen ? 'nb__mobile--open' : ''}`}>
              <div className="nb__mobile-inner">
                {navLinks.map((item, i) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nb__mlink ${isActive(item.path) ? 'nb__mlink--active' : ''}`}
                    style={{ animationDelay: `${i * 0.055}s` }}
                  >
                    {isActive(item.path) && <span className="nb__mlink-dot" />}
                    {item.label}
                  </Link>
                ))}

                <div className="nb__mdivider" />

                {!user ? (
                  <div className="nb__mauth">
                    <Link to="/login" className="nb__mbtn nb__mbtn--ghost">Login</Link>
                    <Link to="/register" className="nb__mbtn nb__mbtn--solid">Create Account</Link>
                  </div>
                ) : (
                  <div className="nb__muser">
                    <div className="nb__muser-card">
                      <div className="nb__muser-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                      <div>
                        <p className="nb__muser-name">{user.name}</p>
                        <p className="nb__muser-role">{user.role}</p>
                      </div>
                    </div>
                    <Link to={dashboardPath} className="nb__mbtn nb__mbtn--dashboard">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="nb__mbtn nb__mbtn--logout">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', system-ui, sans-serif; overflow-x: hidden; }

  @keyframes nb-slideDown {
    from { opacity: 0; transform: translateY(-10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes nb-fadeSlide {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Grid Background Wrapper ── */
  .navbar-grid-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: linear-gradient(155deg, #040c20 0%, #08163c 30%, #0d2060 55%, #0a1a50 75%, #06102e 100%);
  }

  .navbar-grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(147,197,253,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(147,197,253,.04) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
  }

  /* ── Outer wrapper ── */
  .nb-wrap {
    position: relative;
    width: 100%;
    padding: 24px 40px 0;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    transition: padding 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .nb-wrap--scrolled { padding-top: 16px; }

  /* ── The floating pill ── */
  .nb {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    gap: 24px;
    position: relative;
    background: rgba(8, 16, 50, 0.84);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.11);
    border-radius: 28px;
    box-shadow:
      0 4px 32px rgba(0,0,0,0.22),
      0 1px 0 rgba(255,255,255,0.07) inset;
    transition: background 0.35s, box-shadow 0.35s, border-color 0.35s;
  }
  .nb--scrolled {
    background: rgba(6, 12, 42, 0.97);
    box-shadow: 0 8px 48px rgba(0,0,0,0.38), 0 1px 0 rgba(255,255,255,0.06) inset;
    border-color: rgba(255,255,255,0.08);
  }

  /* ── Logo image ── */
  .nb__logo {
    display: flex; align-items: center;
    text-decoration: none; flex-shrink: 0;
    transition: opacity 0.2s;
  }
  .nb__logo:hover { opacity: 0.82; }
  .nb__logo-img { height: 64px; width: auto; object-fit: contain; display: block; }
  .nb__logo-fallback { display: flex; align-items: baseline; gap: 2px; }
  .nb__logo-mona { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; }
  .nb__logo-soap { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 800; color: #93c5fd; letter-spacing: -0.3px; }

  /* ── Centered nav links ── */
  .nb__links {
    display: flex; align-items: center; gap: 4px;
    position: absolute; left: 50%; transform: translateX(-50%);
  }
  .nb__link {
    text-decoration: none; font-size: 16px; font-weight: 500;
    color: rgba(255,255,255,0.62); padding: 10px 18px;
    border-radius: 14px; position: relative;
    transition: color 0.2s, background 0.2s; white-space: nowrap;
  }
  .nb__link:hover { color: #fff; background: rgba(255,255,255,0.08); }
  .nb__link--active { color: #fff; background: rgba(255,255,255,0.08); }
  .nb__link--active::after {
    content: ''; position: absolute;
    bottom: 6px; left: 50%; transform: translateX(-50%);
    width: 24px; height: 2px; border-radius: 2px;
    background: linear-gradient(90deg, #60a5fa, #a78bfa);
  }

  /* ── Right side ── */
  .nb__right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

  /* ── Buttons ── */
  .nb__btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; border-radius: 16px;
    font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    text-decoration: none; border: none; cursor: pointer;
    white-space: nowrap; transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
  }
  .nb__btn svg { transition: transform 0.2s; flex-shrink: 0; }
  .nb__btn:hover svg { transform: translateX(3px); }
  .nb__btn--ghost { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); }
  .nb__btn--ghost:hover { background: rgba(255,255,255,0.13); color: #fff; border-color: rgba(255,255,255,0.26); }
  .nb__btn--solid { background: #ffffff; color: #1e3a8a; box-shadow: 0 2px 12px rgba(0,0,0,0.22); }
  .nb__btn--solid:hover { background: #eff6ff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.28); }

  /* ── User avatar ── */
  .nb__user { position: relative; }
  .nb__avatar-btn {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14);
    border-radius: 16px; padding: 10px 18px 10px 10px;
    cursor: pointer; transition: background 0.2s, border-color 0.2s;
  }
  .nb__avatar-btn:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.26); }
  .nb__avatar { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .nb__username { font-size: 15px; font-weight: 600; color: #e2e8f0; }
  .nb__chevron { color: rgba(255,255,255,0.5); transition: transform 0.25s; flex-shrink: 0; }
  .nb__chevron--open { transform: rotate(180deg); }

  /* ── Dropdown ── */
  .nb__drop {
    position: absolute; top: calc(100% + 12px); right: 0;
    background: #0b1535; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px; padding: 8px; min-width: 260px;
    box-shadow: 0 20px 56px rgba(0,0,0,0.5);
    animation: nb-slideDown 0.22s cubic-bezier(0.22,1,0.36,1) both; z-index: 100;
  }
  .nb__drop::before {
    content: ''; position: absolute; top: -6px; right: 24px;
    width: 12px; height: 12px; background: #0b1535;
    border-top: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.1);
    transform: rotate(45deg);
  }
  .nb__drop-head { display: flex; align-items: center; gap: 14px; padding: 14px 16px; }
  .nb__drop-avatar { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .nb__drop-name { font-size: 16px; font-weight: 600; color: #f1f5f9; margin: 0 0 4px; }
  .nb__drop-role { font-size: 12px; color: #60a5fa; margin: 0; text-transform: capitalize; }
  .nb__drop-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 6px 0; }
  .nb__drop-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 14px; font-size: 15px; font-weight: 500; color: #cbd5e1; text-decoration: none; background: none; border: none; width: 100%; text-align: left; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s, color 0.15s; }
  .nb__drop-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .nb__drop-item--danger { color: #fca5a5; }
  .nb__drop-item--danger:hover { background: rgba(239,68,68,0.12); }
  .nb__drop-arrow { margin-left: auto; color: #60a5fa; opacity: 0; transition: opacity 0.15s, transform 0.15s; }
  .nb__drop-item:hover .nb__drop-arrow { opacity: 1; transform: translateX(2px); }
  .nb__drop-item-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0; }
  .nb__drop-item-icon--blue { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .nb__drop-item-icon--red  { background: rgba(239,68,68,0.12);  color: #fca5a5; }

  /* ── Hamburger ── */
  .nb__burger { display: flex; flex-direction: column; gap: 6px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); border-radius: 14px; padding: 12px 13px; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
  .nb__burger:hover { background: rgba(255,255,255,0.14); }
  .nb__burger span { display: block; width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s; }
  .nb__burger--open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
  .nb__burger--open span:nth-child(2) { opacity: 0; }
  .nb__burger--open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

  /* ── Mobile drawer ── */
  .nb__mobile { width: 100%; max-width: 1400px; margin: 8px auto 0; max-height: 0; overflow: hidden; opacity: 0; background: rgba(6, 12, 42, 0.97); backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px); border: 1px solid rgba(255,255,255,0.09); border-radius: 24px; transition: max-height 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.3s; }
  .nb__mobile--open { max-height: 600px; opacity: 1; margin-bottom: 12px; }
  .nb__mobile-inner { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 6px; }
  .nb__mlink { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.65); text-decoration: none; font-size: 17px; font-weight: 500; padding: 14px 20px; border-radius: 14px; transition: background 0.18s, color 0.18s; animation: nb-fadeSlide 0.3s ease both; }
  .nb__mlink:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .nb__mlink--active { color: #fff; background: rgba(255,255,255,0.07); }
  .nb__mlink-dot { width: 6px; height: 6px; border-radius: 50%; background: #60a5fa; flex-shrink: 0; }
  .nb__mdivider { height: 1px; background: rgba(255,255,255,0.08); margin: 12px 0; }
  .nb__mauth { display: flex; flex-direction: column; gap: 12px; }
  .nb__muser { display: flex; flex-direction: column; gap: 12px; }
  .nb__muser-card { display: flex; align-items: center; gap: 16px; padding: 16px 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; margin-bottom: 6px; }
  .nb__muser-avatar { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .nb__muser-name { font-size: 17px; font-weight: 600; color: #f1f5f9; margin: 0 0 3px; }
  .nb__muser-role { font-size: 12px; color: #60a5fa; margin: 0; text-transform: capitalize; }
  .nb__mbtn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 18px; border-radius: 16px; font-size: 16px; font-weight: 600; font-family: 'DM Sans', sans-serif; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s; width: 100%; }
  .nb__mbtn--ghost { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.13); color: rgba(255,255,255,0.8); }
  .nb__mbtn--ghost:hover { background: rgba(255,255,255,0.11); color: #fff; }
  .nb__mbtn--solid { background: #fff; color: #1e3a8a; }
  .nb__mbtn--solid:hover { background: #eff6ff; }
  .nb__mbtn--dashboard { background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3); color: #93c5fd; }
  .nb__mbtn--dashboard:hover { background: rgba(59,130,246,0.2); color: #bfdbfe; }
  .nb__mbtn--logout { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.22); color: #fca5a5; }
  .nb__mbtn--logout:hover { background: rgba(239,68,68,0.16); }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .nb-wrap { padding: 20px 24px 0; }
    .nb { padding: 0 28px; }
    .nb__link { font-size: 14px; padding: 8px 12px; }
    .nb__btn { padding: 10px 20px; font-size: 13px; }
  }
  @media (max-width: 768px) {
    .nb-wrap { padding: 16px 20px 0; }
    .nb { height: 80px; padding: 0 24px; }
    .nb__logo-img { height: 52px; }
  }
  @media (max-width: 480px) {
    .nb-wrap { padding: 12px 16px 0; }
    .nb { height: 72px; padding: 0 20px; }
    .nb__logo-img { height: 46px; }
  }
`;

export default Navbar;