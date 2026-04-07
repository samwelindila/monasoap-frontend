import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const defaultAboutUs = `Welcome to MonaSoap — your trusted source for premium handcrafted soaps and body care products made right here in Tanzania.

We believe that great skin care starts with pure, natural ingredients. Every product we create is carefully crafted using locally sourced natural materials that are gentle on your skin and kind to the environment.

Our mission is to provide affordable, high-quality soap products that make every Tanzanian feel confident and cared for. From our classic bar soaps to our luxurious liquid soaps and body care range, each product tells a story of craftsmanship and care.

Thank you for choosing MonaSoap — where nature meets luxury.`;

const values = [
  {
    icon: '🌿',
    title: 'Natural Ingredients',
    desc: 'All our products are made with carefully selected natural ingredients that are safe for your skin and the planet.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
  },
  {
    icon: '🤝',
    title: 'Made in Tanzania',
    desc: 'Proudly crafted in Tanzania, supporting local communities and using locally sourced materials.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)',
  },
  {
    icon: '✨',
    title: 'Premium Quality',
    desc: 'Every product goes through strict quality checks to ensure you get the best experience every time.',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.25)',
  },
  {
    icon: '💰',
    title: 'Affordable Price',
    desc: 'We believe quality skin care should be accessible to everyone, so we keep our prices fair and honest.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.25)',
  },
];

const stats = [
  { value: '100%', label: 'Natural' },
  { value: '5★', label: 'Rated' },
  { value: 'TZ', label: 'Made Here' },
  { value: '∞', label: 'Crafted with Love' },
];

const AboutUs = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.log('No settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
        <div className="ab-spinner" />
      </div>
    );
  }

  const paragraphs = (settings?.aboutUs || defaultAboutUs)
    .split('\n')
    .filter(p => p.trim());

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes ab-spin { to { transform: rotate(360deg); } }
        @keyframes ab-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ab-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
        @keyframes ab-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ab-line { from{width:0;opacity:0} to{width:56px;opacity:1} }

        .ab-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'DM Sans', system-ui, sans-serif;
          overflow-x: hidden;
        }

        /* ── SPINNER ── */
        .ab-spinner {
          width: 40px; height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: ab-spin 0.8s linear infinite;
        }

        /* ── HERO (VERY SHORT) ── */
        .ab-hero {
          position: relative;
          background: linear-gradient(155deg, #040c20 0%, #08163c 30%, #0d2060 55%, #0a1a50 75%, #06102e 100%);
          padding: 48px 24px 32px;
          text-align: center;
          overflow: hidden;
        }
        .ab-hero__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(147,197,253,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147,197,253,.04) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }
        .ab-hero__blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .ab-hero__blob--1 { width:280px;height:280px;background:rgba(30,90,220,.18);top:-140px;left:-100px;animation:ab-float 11s ease-in-out infinite; }
        .ab-hero__blob--2 { width:200px;height:200px;background:rgba(79,70,229,.14);bottom:-40px;right:-40px;animation:ab-float 13s ease-in-out infinite reverse; }

        .ab-hero__inner { position:relative; z-index:2; max-width:640px; margin:0 auto; }

        .ab-hero__badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,.06); border: 1px solid rgba(147,197,253,.2);
          backdrop-filter: blur(14px); color: #bfdbfe;
          padding: 4px 12px; border-radius: 28px;
          font-size: 9px; font-weight: 600; letter-spacing: .5px;
          margin-bottom: 12px;
        }
        .ab-hero__badge::before {
          content: '';
          width: 5px; height: 5px; border-radius: 50%;
          background: #34d399; box-shadow: 0 0 8px #34d399;
          animation: ab-blink 2s ease-in-out infinite;
          margin-right: 4px;
        }

        .ab-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800; color: #fff;
          letter-spacing: -0.5px; margin-bottom: 8px; line-height: 1.15;
          background: linear-gradient(100deg, #ffffff 20%, #93c5fd 60%, #c4b5fd 90%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ab-hero__title em { -webkit-text-fill-color: transparent; font-style: italic; }
        .ab-hero__line {
          width: 40px; height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #60a5fa, #c4b5fd);
          margin: 0 auto 10px;
          animation: ab-line 0.8s ease both 0.3s;
        }
        .ab-hero__sub {
          font-size: 12px; color: rgba(148,163,184,.85);
          line-height: 1.5; font-weight: 300; max-width: 480px; margin: 0 auto;
        }

        /* Hero stats - Horizontal on all devices */
        .ab-hero__stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          flex-wrap: wrap;
          margin-top: 24px;
          position: relative;
          z-index: 2;
        }

        .ab-hero__stat {
          padding: 0 20px;
          border-right: 1px solid rgba(147,197,253,0.12);
          text-align: center;
        }

        .ab-hero__stat:last-child { border-right: none; }

        .ab-hero__stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #93c5fd;
          margin: 0 0 2px;
        }

        .ab-hero__stat-lbl {
          font-size: 8px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        /* ── STORY SECTION ── */
        .ab-story {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .ab-story__img-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(10,15,30,0.15);
        }

        .ab-story__img-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(37,99,235,0.15), transparent 60%);
          z-index: 1;
          pointer-events: none;
          border-radius: 20px;
        }

        .ab-story__img {
          width: 100%;
          height: 100%;
          max-height: 400px;
          object-fit: cover;
          display: block;
          border-radius: 20px;
          transition: transform 0.6s ease;
        }

        .ab-story__img-wrap:hover .ab-story__img {
          transform: scale(1.03);
        }

        .ab-story__img-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          z-index: 2;
          background: rgba(10,15,30,0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(147,197,253,0.2);
          border-radius: 10px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #e2e8f0;
          font-weight: 500;
        }

        .ab-story__img-badge span {
          color: #34d399;
          font-size: 14px;
        }

        /* No image fallback */
        .ab-story__placeholder {
          width: 100%;
          height: 340px;
          background: linear-gradient(160deg, #0a0f1e 0%, #0d1f4a 50%, #102358 100%);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(147,197,253,0.12);
          gap: 12px;
        }

        .ab-story__placeholder-icon {
          font-size: 52px;
          filter: drop-shadow(0 4px 12px rgba(59,130,246,0.3));
        }

        .ab-story__placeholder-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #93c5fd;
          font-style: italic;
        }

        .ab-story__placeholder-sub {
          font-size: 11px;
          color: #475569;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Text side */
        .ab-story__kicker {
          font-size: 10px;
          font-weight: 700;
          color: #3b82f6;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0 0 10px;
        }

        .ab-story__title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 700;
          color: #0a0f1e;
          margin: 0 0 6px;
          line-height: 1.2;
        }

        .ab-story__title em {
          font-style: italic;
          color: #2563eb;
        }

        .ab-story__divider {
          width: 40px; height: 3px;
          background: linear-gradient(90deg, #1d4ed8, #93c5fd);
          border-radius: 3px;
          margin: 16px 0 20px;
        }

        .ab-story__paras {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 28px;
        }

        .ab-story__para {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
          margin: 0;
          font-weight: 400;
        }

        .ab-story__tagline {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background: linear-gradient(135deg, rgba(37,99,235,0.06), rgba(147,197,253,0.04));
          border: 1px solid rgba(37,99,235,0.12);
          border-left: 3px solid #2563eb;
          border-radius: 0 10px 10px 0;
          font-size: 13px;
          color: #1e3a8a;
          font-weight: 600;
          font-style: italic;
        }

        /* ── VALUES ── */
        .ab-values {
          background: linear-gradient(160deg, #0a0f1e 0%, #0d1f4a 50%, #102358 100%);
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
        }

        .ab-values::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(147,197,253,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .ab-values__inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .ab-values__header {
          text-align: center;
          margin-bottom: 40px;
        }

        .ab-values__kicker {
          font-size: 10px;
          font-weight: 700;
          color: #60a5fa;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0 0 8px;
        }

        .ab-values__title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 700;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.2;
        }

        .ab-values__title em {
          font-style: italic;
          color: #93c5fd;
        }

        .ab-values__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .ab-val-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(147,197,253,0.1);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          transition: transform 0.25s, background 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }

        .ab-val-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 16px 16px 0 0;
          opacity: 0;
          transition: opacity 0.25s;
        }

        .ab-val-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.05);
          border-color: rgba(147,197,253,0.2);
        }

        .ab-val-card:hover::before { opacity: 1; }

        .ab-val-icon-wrap {
          width: 50px; height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 24px;
          border: 1px solid;
          transition: transform 0.25s;
        }

        .ab-val-card:hover .ab-val-icon-wrap {
          transform: scale(1.05) rotate(-2deg);
        }

        .ab-val-title {
          font-size: 15px;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0 0 8px;
          font-family: 'Playfair Display', serif;
        }

        .ab-val-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* ── CTA ── */
        .ab-cta {
          padding: 60px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .ab-cta__card {
          background: linear-gradient(160deg, #0a0f1e 0%, #0d1f4a 50%, #102358 100%);
          border-radius: 24px;
          padding: 48px 40px;
          text-align: center;
          border: 1px solid rgba(147,197,253,0.12);
          position: relative;
          overflow: hidden;
        }

        .ab-cta__card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(37,99,235,0.15) 0%, transparent 65%);
          pointer-events: none;
        }

        .ab-cta__kicker {
          font-size: 10px;
          font-weight: 700;
          color: #60a5fa;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0 0 12px;
          position: relative;
        }

        .ab-cta__title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 700;
          color: #f1f5f9;
          margin: 0 0 12px;
          line-height: 1.2;
          position: relative;
        }

        .ab-cta__title em {
          font-style: italic;
          color: #93c5fd;
        }

        .ab-cta__desc {
          font-size: 14px;
          color: #64748b;
          max-width: 480px;
          margin: 0 auto 32px;
          line-height: 1.6;
          font-weight: 300;
          position: relative;
        }

        .ab-cta__btns {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
        }

        .ab-cta__btn-primary {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff;
          padding: 12px 32px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(37,99,235,0.35);
        }

        .ab-cta__btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(37,99,235,0.45);
        }

        .ab-cta__btn-outline {
          background: transparent;
          color: #93c5fd;
          padding: 12px 32px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          border: 2px solid rgba(147,197,253,0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .ab-cta__btn-outline:hover {
          background: rgba(147,197,253,0.08);
          border-color: rgba(147,197,253,0.5);
          transform: translateY(-2px);
        }

        /* ── RESPONSIVE - Horizontal stats on mobile ── */
        @media (max-width: 1024px) {
          .ab-values__grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 860px) {
          .ab-story {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 40px 20px;
          }
        }

        @media (max-width: 640px) {
          .ab-hero { 
            padding: 40px 20px 28px; 
          }
          /* Keep stats horizontal on mobile */
          .ab-hero__stats {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 0;
            margin-top: 20px;
          }
          .ab-hero__stat { 
            padding: 0 16px;
            border-right: 1px solid rgba(147,197,253,0.12);
            border-bottom: none;
            width: auto;
          }
          .ab-hero__stat:last-child { 
            border-right: none; 
          }
          .ab-hero__stat-val { 
            font-size: 16px; 
          }
          .ab-values__grid { 
            grid-template-columns: 1fr 1fr; 
            gap: 12px; 
          }
          .ab-val-card { 
            padding: 20px 16px; 
          }
          .ab-cta__card { 
            padding: 36px 20px; 
          }
          .ab-cta__btns { 
            flex-direction: column; 
            align-items: center; 
          }
        }

        @media (max-width: 480px) {
          .ab-hero__stat { 
            padding: 0 12px;
          }
          .ab-hero__stat-val { 
            font-size: 14px; 
          }
          .ab-hero__stat-lbl { 
            font-size: 7px; 
          }
        }

        @media (max-width: 420px) {
          .ab-values__grid { 
            grid-template-columns: 1fr; 
          }
          /* Keep stats horizontal even on very small screens */
          .ab-hero__stats {
            flex-wrap: wrap;
            gap: 8px 0;
          }
          .ab-hero__stat {
            flex: 1;
            min-width: 70px;
            padding: 0 8px;
          }
        }
      `}</style>

      <div className="ab-page">

        {/* ── HERO (VERY SHORT) ── */}
        <div className="ab-hero">
          <div className="ab-hero__grid" />
          <div className="ab-hero__blob ab-hero__blob--1" />
          <div className="ab-hero__blob ab-hero__blob--2" />
          <div className="ab-hero__inner">
            <div className="ab-hero__badge">Our Story</div>
            <h1 className="ab-hero__title">
              About <em>MonaSoap</em>
            </h1>
            <div className="ab-hero__line" />
            <p className="ab-hero__sub">
              Premium handcrafted soaps made with love, care, and natural ingredients — right here in Tanzania.
            </p>
          </div>
          <div className="ab-hero__stats">
            {stats.map((s, i) => (
              <div className="ab-hero__stat" key={i}>
                <div className="ab-hero__stat-val">{s.value}</div>
                <div className="ab-hero__stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STORY ── */}
        <div className="ab-story">
          {/* Image */}
          <div>
            {settings?.aboutUsImage ? (
              <div className="ab-story__img-wrap">
                <img
                  src={`http://localhost:5000/uploads/${settings.aboutUsImage}`}
                  alt="About MonaSoap"
                  className="ab-story__img"
                />
                <div className="ab-story__img-badge">
                  <span>🌿</span>
                  Handcrafted in Tanzania
                </div>
              </div>
            ) : (
              <div className="ab-story__placeholder">
                <div className="ab-story__placeholder-icon">🧼</div>
                <div className="ab-story__placeholder-text">Pure. Natural. Crafted.</div>
                <div className="ab-story__placeholder-sub">Handmade in Tanzania</div>
              </div>
            )}
          </div>

          {/* Text */}
          <div>
            <p className="ab-story__kicker">Who We Are</p>
            <h2 className="ab-story__title">
              Our <em>Story</em>
            </h2>
            <div className="ab-story__divider" />
            <div className="ab-story__paras">
              {paragraphs.map((para, i) => (
                <p key={i} className="ab-story__para">{para}</p>
              ))}
            </div>
            <div className="ab-story__tagline">
              "Usafi wako, Jukumu letu."
            </div>
          </div>
        </div>

        {/* ── VALUES ── */}
        <div className="ab-values">
          <div className="ab-values__inner">
            <div className="ab-values__header">
              <p className="ab-values__kicker">What Sets Us Apart</p>
              <h2 className="ab-values__title">
                Why Choose <em>MonaSoap?</em>
              </h2>
            </div>
            <div className="ab-values__grid">
              {values.map((v, i) => (
                <div className="ab-val-card" key={i}>
                  <style>{`.ab-val-card:nth-child(${i + 1})::before { background: ${v.color}; }`}</style>
                  <div
                    className="ab-val-icon-wrap"
                    style={{ background: v.bg, borderColor: v.border, color: v.color }}
                  >
                    {v.icon}
                  </div>
                  <h3 className="ab-val-title">{v.title}</h3>
                  <p className="ab-val-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="ab-cta">
          <div className="ab-cta__card">
            <p className="ab-cta__kicker">Get Started</p>
            <h2 className="ab-cta__title">
              Ready to Try <em>MonaSoap?</em>
            </h2>
            <p className="ab-cta__desc">
              Browse our full range of handcrafted products and experience the difference of truly natural soaps.
            </p>
            <div className="ab-cta__btns">
              <Link to="/" className="ab-cta__btn-primary">
                Shop Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/contact" className="ab-cta__btn-outline">
                Contact Us
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default AboutUs;