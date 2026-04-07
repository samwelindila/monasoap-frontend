import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

/* ── useInView ── */
const useInView = (threshold = 0.08) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const WORK_HOURS = [
  { day: 'Monday',    open: '08:00', close: '20:00' },
  { day: 'Tuesday',   open: '08:00', close: '20:00' },
  { day: 'Wednesday', open: '08:00', close: '20:00' },
  { day: 'Thursday',  open: '08:00', close: '20:00' },
  { day: 'Friday',    open: '08:00', close: '20:00' },
  { day: 'Saturday',  open: '08:00', close: '20:00' },
  { day: 'Sunday',    open: '14:00', close: '20:00' },
];

const fmt = (t) => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const getBusinessStatus = () => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Dar_es_Salaam' }));
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dayName = days[now.getDay()];
  const todayHours = WORK_HOURS.find(h => h.day === dayName);
  const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const isOpen = currentMins >= toMins(todayHours.open) && currentMins < toMins(todayHours.close);
  let nextOpen = null;
  if (!isOpen) {
    if (currentMins < toMins(todayHours.open)) {
      nextOpen = `Today at ${fmt(todayHours.open)}`;
    } else {
      const nextDay = WORK_HOURS[(now.getDay() + 1) % 7];
      nextOpen = `${nextDay.day} at ${fmt(nextDay.open)}`;
    }
  }
  return { dayName, isOpen, nextOpen, closesAt: fmt(todayHours.close), opensAt: fmt(todayHours.open) };
};

/* ── SVG Icon Components ── */
const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconWhatsapp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconCreditCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const IconTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const IconSend = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

/* ── Main Component ── */
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [bizStatus, setBizStatus] = useState(getBusinessStatus());

  const [headerRef, headerVisible] = useInView(0.05);
  const [contentRef, contentVisible] = useInView(0.05);
  const [hoursRef, hoursVisible] = useInView(0.05);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.log('No settings');
      }
    };
    fetchSettings();
    const t = setInterval(() => setBizStatus(getBusinessStatus()), 60000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await API.post('/contact', formData);
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = days[new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Dar_es_Salaam' })).getDay()];

  return (
    <div className="cp-page">

      {/* ── PAGE HEADER (SHORT VERSION) ── */}
      <section className="cp-header" ref={headerRef}>
        <div className="cp-header__grid" />
        <div className="cp-header__blob cp-header__blob--1" />
        <div className="cp-header__blob cp-header__blob--2" />
        <div className={`cp-header__inner ${headerVisible ? 'cp-vis' : 'cp-hid'}`}>
          <div className="cp-badge">
            <span className="cp-badge__dot" />
            Get in Touch
          </div>
          <h1 className="cp-header__h1">Let's <em>Talk</em></h1>
          <div className="cp-header__line" />
          <p className="cp-header__sub">
            Have a question about our soaps or want to place a bulk order? 
            We're here to help — send us a message and we'll respond promptly.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="cp-section" ref={contentRef}>
        <div className="cp-container">
          <div className={`cp-grid ${contentVisible ? 'cp-vis' : 'cp-hid'}`}>
            
            {/* LEFT: Contact Form */}
            <div className="cp-card cp-card--form">
              <div className="cp-card__head">
                <span className="cp-card__label">Send a Message</span>
                <h2 className="cp-card__title">We'd Love to Hear From You</h2>
                <p className="cp-card__desc">Fill in the form and our team will be in touch within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="cp-form">
                <div className="cp-field">
                  <label className="cp-field__label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Amina Hassan"
                    required
                    className="cp-field__input"
                  />
                </div>
                <div className="cp-field">
                  <label className="cp-field__label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="cp-field__input"
                  />
                </div>
                <div className="cp-field">
                  <label className="cp-field__label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you today?"
                    rows={5}
                    required
                    className="cp-field__input cp-field__input--ta"
                  />
                </div>
                <button type="submit" disabled={loading} className="cp-btn">
                  {loading ? (
                    <span className="cp-btn__spinner" />
                  ) : (
                    <><IconSend /><span>Send Message</span></>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT: Map + Contact Info */}
            <div className="cp-info-stack">
              {/* Map Card */}
              <div className="cp-card cp-card--map">
                <div className="cp-card__map-header">
                  <div className="cp-icon-chip"><IconMapPin /></div>
                  <div>
                    <div className="cp-card__label">Our Location</div>
                    <div className="cp-card__title cp-card__title--sm">Dar es Salaam, Tanzania</div>
                  </div>
                </div>
                <iframe
                  src={settings?.locationMapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46305129946!2d39.07806993476562!3d-6.792354314488406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4bae169bd6f1%3A0x940f6b26a086a1dd!2sDar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2s!4v1699000000000!5m2!1sen!2s"}
                  className="cp-map-frame"
                  loading="lazy"
                  title="MonaSoap Location"
                  allowFullScreen=""
                />
                <p className="cp-map-addr">{settings?.location || 'Dar es Salaam, Tanzania'}</p>
              </div>

              {/* Contact Info Cards */}
              <div className="cp-card cp-card--contacts">
                <div className="cp-contact-row">
                  <div className="cp-icon-chip cp-icon-chip--emerald"><IconPhone /></div>
                  <div>
                    <div className="cp-contact-row__label">Phone</div>
                    <div className="cp-contact-row__value">{settings?.phone || '+255 700 000 000'}</div>
                  </div>
                </div>
                <div className="cp-contact-row">
                  <div className="cp-icon-chip cp-icon-chip--green"><IconWhatsapp /></div>
                  <div>
                    <div className="cp-contact-row__label">WhatsApp</div>
                    <div className="cp-contact-row__value">{settings?.whatsapp || '+255 700 000 000'}</div>
                  </div>
                </div>
                <div className="cp-contact-row">
                  <div className="cp-icon-chip cp-icon-chip--indigo"><IconMail /></div>
                  <div>
                    <div className="cp-contact-row__label">Email</div>
                    <div className="cp-contact-row__value">{settings?.email || 'info@monasoap.com'}</div>
                  </div>
                </div>
              </div>

              {/* Social + Payment */}
              <div className="cp-flex-row">
                <div className="cp-card cp-card--social">
                  <div className="cp-card__label" style={{ marginBottom: '14px' }}>Follow Us</div>
                  <div className="cp-socials">
                    {settings?.facebook && (
                      <a href={settings.facebook} target="_blank" rel="noreferrer" className="cp-social cp-social--fb">
                        <IconFacebook />
                      </a>
                    )}
                    {settings?.instagram && (
                      <a href={settings.instagram} target="_blank" rel="noreferrer" className="cp-social cp-social--ig">
                        <IconInstagram />
                      </a>
                    )}
                    {settings?.twitter && (
                      <a href={settings.twitter} target="_blank" rel="noreferrer" className="cp-social cp-social--tw">
                        <IconTwitter />
                      </a>
                    )}
                  </div>
                </div>

                {settings?.lipaNumber && (
                  <div className="cp-card cp-card--pay">
                    <div className="cp-icon-chip cp-icon-chip--white"><IconCreditCard /></div>
                    <div>
                      <div className="cp-card__label" style={{ color: 'rgba(255,255,255,.65)', marginBottom: '4px' }}>MIXX BY YAS</div>
                      <div className="cp-pay__number">{settings.lipaNumber}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUSINESS HOURS (Full Width at Bottom) ── */}
      <section className="cp-hours-section" ref={hoursRef}>
        <div className="cp-hours-container">
          <div className={`cp-hours-card ${hoursVisible ? 'cp-vis' : 'cp-hid'}`}>
            <div className="cp-hours__head">
              <div>
                <span className="cp-card__label" style={{ color: '#818cf8' }}>Availability</span>
                <h2 className="cp-hours__title">Business Hours</h2>
              </div>
              <div className={`cp-status ${bizStatus.isOpen ? 'cp-status--open' : 'cp-status--closed'}`}>
                <span className="cp-status__dot" />
                {bizStatus.isOpen ? 'Open Now' : 'Closed'}
              </div>
            </div>

            <div className="cp-hours__msg">
              <IconClock />
              {bizStatus.isOpen
                ? <span>Open until <strong>{bizStatus.closesAt}</strong> — We respond within minutes</span>
                : <span>Opens <strong>{bizStatus.nextOpen}</strong> — Leave a message and we'll reply soon</span>
              }
            </div>

            <div className="cp-hours__grid">
              {WORK_HOURS.map((row) => {
                const isToday = row.day === todayName;
                return (
                  <div key={row.day} className={`cp-hours__row ${isToday ? 'cp-hours__row--today' : ''}`}>
                    <div className="cp-hours__day">
                      {row.day}
                      {isToday && <span className="cp-badge cp-badge--today">Today</span>}
                      {row.day === 'Sunday' && <span className="cp-badge cp-badge--late">Late Open</span>}
                    </div>
                    <div className="cp-hours__time">{fmt(row.open)} – {fmt(row.close)}</div>
                  </div>
                );
              })}
            </div>

            <div className="cp-hours__tz">
              <IconClock />
              <span>All times in East Africa Time (EAT, UTC+3) — Dar es Salaam local time</span>
            </div>
          </div>
        </div>
      </section>

      <style>{CSS}</style>
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes cp-spin  { to { transform: rotate(360deg); } }
  @keyframes cp-up    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes cp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
  @keyframes cp-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes cp-line  { from{width:0;opacity:0} to{width:48px;opacity:1} }

  .cp-hid { opacity:0; transform:translateY(24px); }
  .cp-vis { animation: cp-up 0.6s cubic-bezier(0.22,1,0.36,1) both; }

  .cp-page {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'DM Sans', system-ui, sans-serif;
    overflow-x: hidden;
  }

  /* ── PAGE HEADER (SHORT VERSION) ── */
  .cp-header {
    position: relative;
    background: linear-gradient(155deg, #040c20 0%, #08163c 30%, #0d2060 55%, #0a1a50 75%, #06102e 100%);
    padding: 48px 24px 32px;
    text-align: center;
    overflow: hidden;
  }
  .cp-header__grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(147,197,253,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(147,197,253,.04) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
  }
  .cp-header__blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none;
  }
  .cp-header__blob--1 { width:280px;height:280px;background:rgba(30,90,220,.18);top:-140px;left:-100px;animation:cp-float 11s ease-in-out infinite; }
  .cp-header__blob--2 { width:200px;height:200px;background:rgba(79,70,229,.14);bottom:-40px;right:-40px;animation:cp-float 13s ease-in-out infinite reverse; }

  .cp-header__inner { position:relative;z-index:2;max-width:640px;margin:0 auto; }

  .cp-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(147,197,253,.2);
    backdrop-filter: blur(14px); color: #bfdbfe;
    padding: 4px 12px; border-radius: 28px;
    font-size: 9px; font-weight: 600; letter-spacing: .5px;
    margin-bottom: 12px;
  }
  .cp-badge__dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #34d399; box-shadow: 0 0 8px #34d399;
    animation: cp-blink 2s ease-in-out infinite;
  }

  .cp-header__h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800; color: #fff;
    letter-spacing: -0.5px; margin-bottom: 8px; line-height: 1.15;
    background: linear-gradient(100deg, #ffffff 20%, #93c5fd 60%, #c4b5fd 90%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .cp-header__h1 em { -webkit-text-fill-color: transparent; font-style: italic; }
  .cp-header__line {
    width: 40px; height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, #60a5fa, #c4b5fd);
    margin: 0 auto 10px;
    animation: cp-line 0.8s ease both 0.3s;
  }
  .cp-header__sub {
    font-size: 12px; color: rgba(148,163,184,.85);
    line-height: 1.5; font-weight: 300; max-width: 480px; margin: 0 auto;
  }

  /* ── MAIN SECTION ── */
  .cp-section { padding: 60px 24px 60px; background: #f8fafc; }
  .cp-container { max-width: 1200px; margin: 0 auto; }

  .cp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: start;
  }

  /* Cards */
  .cp-card {
    background: #fff;
    border: 1px solid #e8eef4;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0,0,0,.06);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .cp-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.1); }

  .cp-card__head { margin-bottom: 28px; }
  .cp-card__label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #4f46e5;
    margin-bottom: 8px;
  }
  .cp-card__title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }
  .cp-card__title--sm { font-size: 18px; margin-bottom: 0; }
  .cp-card__desc { font-size: 14px; color: #64748b; line-height: 1.55; }

  /* Form */
  .cp-form { display: flex; flex-direction: column; gap: 20px; }
  .cp-field { display: flex; flex-direction: column; gap: 6px; }
  .cp-field__label { font-size: 13px; font-weight: 600; color: #1e293b; }
  .cp-field__input {
    font-family: inherit;
    font-size: 14px;
    padding: 12px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    background: #fafafa;
    transition: all 0.2s;
    outline: none;
  }
  .cp-field__input:focus {
    border-color: #4f46e5;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(79,70,229,.1);
  }
  .cp-field__input--ta { resize: vertical; min-height: 120px; }

  .cp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,.3); }
  .cp-btn:disabled { background: #94a3b8; cursor: not-allowed; }
  .cp-btn__spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cp-spin .7s linear infinite;
  }

  /* Info Stack */
  .cp-info-stack { display: flex; flex-direction: column; gap: 24px; }

  /* Map Card */
  .cp-card--map { padding: 24px; }
  .cp-card__map-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .cp-map-frame { width: 100%; height: 220px; border: none; border-radius: 14px; }
  .cp-map-addr { font-size: 12px; color: #64748b; margin-top: 12px; text-align: center; }

  /* Contact Rows */
  .cp-card--contacts { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .cp-contact-row { display: flex; align-items: center; gap: 14px; }
  .cp-contact-row__label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #64748b; }
  .cp-contact-row__value { font-size: 14px; font-weight: 600; color: #0f172a; }

  /* Icon Chips */
  .cp-icon-chip {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    background: #eef2ff;
    color: #4f46e5;
    flex-shrink: 0;
  }
  .cp-icon-chip--emerald { background: #d1fae5; color: #059669; }
  .cp-icon-chip--green { background: #dcfce7; color: #16a34a; }
  .cp-icon-chip--indigo { background: #eef2ff; color: #4f46e5; }
  .cp-icon-chip--white { background: rgba(255,255,255,.18); color: #fff; }

  /* Social + Pay row */
  .cp-flex-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .cp-card--social { display: flex; flex-direction: column; }
  .cp-socials { display: flex; gap: 10px; flex-wrap: wrap; }
  .cp-social {
    width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 12px;
    text-decoration: none;
    transition: transform .18s, opacity .18s;
    color: #fff;
  }
  .cp-social:hover { transform: translateY(-3px); opacity: .88; }
  .cp-social--fb { background: #1877f2; }
  .cp-social--ig { background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); }
  .cp-social--tw { background: #18181b; }

  .cp-card--pay {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    border-color: rgba(99,102,241,.2);
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cp-pay__number {
    font-family: monospace;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  /* ── BUSINESS HOURS SECTION ── */
  .cp-hours-section {
    padding: 0 24px 80px;
    background: #f8fafc;
  }
  .cp-hours-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .cp-hours-card {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    border-radius: 28px;
    padding: 40px;
    border: 1px solid rgba(99,102,241,.2);
    box-shadow: 0 20px 35px -10px rgba(0,0,0,.2);
  }
  .cp-hours__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }
  .cp-hours__title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-top: 6px;
  }
  .cp-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 40px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .5px;
    text-transform: uppercase;
  }
  .cp-status--open { background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.35); color: #34d399; }
  .cp-status--closed { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3); color: #f87171; }
  .cp-status__dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: cp-blink 2s ease-in-out infinite;
  }
  .cp-hours__msg {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(99,102,241,.08);
    border-left: 3px solid #4f46e5;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 28px;
  }
  .cp-hours__msg svg { color: #818cf8; flex-shrink: 0; }
  .cp-hours__msg strong { color: #a5b4fc; }
  .cp-hours__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 8px;
    margin-bottom: 28px;
  }
  .cp-hours__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-radius: 12px;
    background: rgba(255,255,255,.03);
    transition: background 0.2s;
  }
  .cp-hours__row:hover { background: rgba(99,102,241,.07); }
  .cp-hours__row--today {
    background: rgba(99,102,241,.12);
    border-left: 3px solid #4f46e5;
  }
  .cp-hours__day {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 14px;
    font-weight: 500;
    color: #94a3b8;
  }
  .cp-hours__row--today .cp-hours__day { color: #fff; font-weight: 600; }
  .cp-hours__time {
    font-family: monospace;
    font-size: 13px;
    color: #64748b;
  }
  .cp-hours__row--today .cp-hours__time { color: #a5b4fc; font-weight: 600; }
  .cp-badge {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
    padding: 2px 8px;
    border-radius: 20px;
  }
  .cp-badge--today { background: #4f46e5; color: #fff; }
  .cp-badge--late { background: rgba(245,158,11,.15); border: 1px solid rgba(245,158,11,.3); color: #fbbf24; }
  .cp-hours__tz {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 20px;
    border-top: 1px solid rgba(99,102,241,.12);
    font-size: 12px;
    color: #475569;
  }
  .cp-hours__tz svg { color: #4f46e5; flex-shrink: 0; }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .cp-grid { grid-template-columns: 1fr; }
    .cp-header { padding: 40px 20px 28px; }
    .cp-section { padding: 48px 20px 48px; }
    .cp-hours-section { padding: 0 20px 60px; }
    .cp-flex-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .cp-card { padding: 24px; }
    .cp-hours-card { padding: 24px; }
    .cp-hours__grid { grid-template-columns: 1fr; }
    .cp-hours__row { flex-direction: column; align-items: flex-start; gap: 6px; }
    .cp-hours__head { flex-direction: column; }
  }
`;

export default Contact;