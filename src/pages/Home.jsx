import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';

/* ── Typewriter ── */
const useTypewriter = (words, speed = 110, pause = 1800) => {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    let delay = deleting ? speed / 2 : speed;
    if (!deleting && charIdx === current.length) delay = pause;
    if (deleting && charIdx === 0) delay = 400;
    const t = setTimeout(() => {
      if (!deleting && charIdx === current.length) setDeleting(true);
      else if (deleting && charIdx === 0) { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
      else { setCharIdx(i => i + (deleting ? -1 : 1)); setDisplayed(current.slice(0, charIdx + (deleting ? -1 : 1))); }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return displayed;
};

/* ── useInView ── */
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ── AnimCounter ── */
const AnimCounter = ({ to, suffix = '' }) => {
  const [ref, visible] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let s = 0; const step = Math.ceil(to / 40);
    const t = setInterval(() => { s += step; if (s >= to) { setVal(to); clearInterval(t); } else setVal(s); }, 30);
    return () => clearInterval(t);
  }, [visible, to]);
  return <span ref={ref}>{val}{suffix}</span>;
};

const testimonials = [
  { name: 'Amina J.', location: 'Gongo La Mboto', text: 'It has a pleasant and refreshing fragrance.', rating: 5 },
  { name: 'Fatuma K.', location: 'Chanika', text: 'The soap is thick, effective, and perfect for maintaining cleanliness.!', rating: 5 },
  { name: 'Hassan M.', location: 'Posta', text: 'Best soap I\'ve ever used. Beautiful packaging perfect gift too.', rating: 5 },
  { name: 'Grace N.', location: 'Kariakoo', text: 'So gentle on my sensitive skin. Fast delivery too. Five stars!', rating: 5 },
];

const faqs = [
  { q: 'What ingredients do you use?', a: 'All soaps are handcrafted with 100% natural ingredients shea butter, coconut oil, essential oils, and locally sourced Tanzanian botanicals. No parabens, sulphates, or synthetic fragrances.' },
  { q: 'How long does delivery take?', a: 'We offer same-day delivery within Dar es Salaam for all orders placed during working hours. Orders placed outside working hours are delivered the next day.' },
  { q: 'How do I pay?', a: 'We accept payments via MIXX by YAS mobile money. Send the total to our Lipa number after placing your order, then it\'s confirmed and dispatched.' },
  { q: 'Safe for sensitive skin?', a: 'Yes our formulas are dermatologist-friendly and free from harsh chemicals. For specific conditions, patch-test first. Contact us and we\'ll advise the best products for your skin.' },
  { q: 'Do you have gift sets?', a: 'Yes! Curated gift sets for weddings, baby showers, and corporate gifting. Custom branding and bulk packaging available — reach out via WhatsApp.' },
  { q: 'Returns and exchanges?', a: 'Damaged or incorrect item? Contact us within 48 hours for a free replacement or refund. We stand behind every bar we make.' },
];

const FaqItem = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} className={`fq-item ${open ? 'fq-item--open' : ''} ${visible ? 'ms-vis' : 'ms-hid'}`}
      style={{ animationDelay: `${index * 0.06}s` }}>
      <button className="fq-btn" onClick={() => setOpen(v => !v)}>
        <span className="fq-q">{q}</span>
        <span className="fq-ico">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </button>
      <div className="fq-body">
        <p className="fq-a">{a}</p>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [settings, setSettings] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const navigate = useNavigate();

  const typed = useTypewriter(['MonaSoap', 'Natural Care', 'Pure Bliss', 'Made in TZ'], 100, 2000);

  const [heroRef, heroVisible] = useInView(0.05);
  const [productsRef, productsVisible] = useInView(0.05);
  const [featuresRef, featuresVisible] = useInView(0.08);
  const [testimonialsRef, testimonialsVisible] = useInView(0.08);
  const [lipaRef, lipaVisible] = useInView(0.08);
  const [ctaRef, ctaVisible] = useInView(0.08);
  const [faqRef, faqVisible] = useInView(0.08);

  const categories = ['Bar Soaps', 'Liquid Soaps', 'Body Care', 'Gift Sets'];

  // eslint-disable-next-line
  useEffect(() => { fetchProducts(); }, [search, category]);
  // eslint-disable-next-line
  useEffect(() => { fetchSettings(); }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await API.get('/products', { params });
      setProducts(res.data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const fetchSettings = async () => {
    try { const res = await API.get('/settings'); setSettings(res.data); }
    catch { console.log('No settings'); }
  };

  const lipaNumber = settings?.lipaNumber || '+255 700 000 000';
  const formatPrice = (price) => { const n = Number(price); return isNaN(n) ? '0' : n.toLocaleString(); };

  return (
    <div className="ms-page">

      {/* ── HERO (Full solid background, no slopes) ── */}
      <section className="ms-hero" ref={heroRef}>
        <div className="ms-hero__grid" />
        <div className="ms-blob ms-blob--1" />
        <div className="ms-blob ms-blob--2" />

        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className={`ms-particle ms-particle--${i % 6}`} style={{
            left: `${4 + (i * 5.1) % 92}%`,
            top: `${6 + (i * 6.7) % 88}%`,
            animationDelay: `${i * 0.35}s`,
            animationDuration: `${3.5 + (i % 4) * 0.7}s`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
          }} />
        ))}

        <div className={`ms-hero__inner ${heroVisible ? 'ms-vis' : 'ms-hid'}`}>
          <div className="ms-badge">
            <span className="ms-badge__dot" />
            100% Natural · Handcrafted in Tanzania
          </div>

          <h1 className="ms-hero__h1">
            <span className="ms-hero__typed">{typed}<span className="ms-cursor">|</span></span>
          </h1>

          <p className={`ms-hero__sub ${heroVisible ? 'ms-vis ms-d2' : 'ms-hid'}`}>
            Premium handcrafted soaps made with pure natural ingredients. Feel the difference.
          </p>

          <div className={`ms-hero__btns ${heroVisible ? 'ms-vis ms-d3' : 'ms-hid'}`}>
            <button className="ms-btn ms-btn--white"
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="/about" className="ms-btn ms-btn--ghost">Our Story</a>
          </div>

          <div className={`ms-stats ${heroVisible ? 'ms-vis ms-d4' : 'ms-hid'}`}>
            {[
              { to: 500, suffix: '+', label: 'Customers' },
              { to: 30, suffix: '+', label: 'Products' },
              { to: 100, suffix: '%', label: 'Natural' },
              { to: 5, suffix: '★', label: 'Rating' },
            ].map((s, i) => (
              <div key={i} className="ms-stat">
                <strong><AnimCounter to={s.to} suffix={s.suffix} /></strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS (White Background - Larger Images) ── */}
      <section id="products" className="ms-section" ref={productsRef}>
        <div className="ms-container">
          <div className={`ms-head ${productsVisible ? 'ms-vis' : 'ms-hid'}`}>
            <p className="ms-eyebrow">What We Offer</p>
            <h2 className="ms-h2">Our Products</h2>
            <div className="ms-line" />
            <p className="ms-sub">Handcrafted soaps and body care, made with love</p>
          </div>

          <div className={`ms-filters ${productsVisible ? 'ms-vis ms-d1' : 'ms-hid'}`}>
            <div className="ms-search-wrap">
              <svg className="ms-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Search products…" value={search}
                onChange={e => setSearch(e.target.value)} className="ms-search" />
            </div>
            <div className="ms-cats">
              <button className={`ms-cat ${category === '' ? 'ms-cat--on' : ''}`} onClick={() => setCategory('')}>All</button>
              {categories.map(cat => (
                <button key={cat} className={`ms-cat ${category === cat ? 'ms-cat--on' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="ms-status">
              <div className="ms-spinner" />
              Loading products…
            </div>
          ) : products.length === 0 ? (
            <div className="ms-status">No products found</div>
          ) : (
            <div className="ms-grid">
              {products.map((p, i) => (
                <div key={p._id}
                  className={`ms-card ${productsVisible ? 'ms-vis' : 'ms-hid'}`}
                  style={{ animationDelay: `${0.05 + i * 0.06}s` }}
                  onClick={() => navigate(`/product/${p._id}`)}
                  onMouseEnter={() => setHoveredCard(p._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="ms-card__img-box">
                    {p.images?.length > 0 ? (
                      <img src={`http://localhost:5000/uploads/${p.images[0]}`} alt={p.name}
                        className={`ms-card__img ${hoveredCard === p._id ? 'ms-card__img--zoom' : ''}`} />
                    ) : (
                      <div className="ms-card__no-img">🧼</div>
                    )}
                    {!p.isAvailable && <div className="ms-card__oos">Out of Stock</div>}
                  </div>
                  <div className="ms-card__body">
                    <span className="ms-card__tag">{p.category}</span>
                    <h3 className="ms-card__name">{p.name}</h3>
                    <p className="ms-card__desc">{p.description?.substring(0, 80)}</p>
                    <div className="ms-card__footer">
                      <div className="ms-card__price-wrap">
                        <span className="ms-card__price-lbl">Price</span>
                        <span className="ms-card__price">TSh {formatPrice(p.price)}</span>
                      </div>
                      <button
                        className={`ms-card__btn ${!p.isAvailable ? 'ms-card__btn--off' : ''}`}
                        onClick={e => { e.stopPropagation(); if (p.isAvailable) navigate(`/product/${p._id}`); }}
                      >
                        {p.isAvailable ? 'Order Now' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES (MonaSoap Difference) ── */}
      <section className="ms-features" ref={featuresRef}>
        <div className="ms-container">
          <div className={`ms-head ${featuresVisible ? 'ms-vis' : 'ms-hid'}`}>
            <p className="ms-eyebrow ms-eyebrow--lt">Why Choose Us</p>
            <h2 className="ms-h2 ms-h2--lt">The MonaSoap Difference</h2>
            <div className="ms-line ms-line--lt" />
          </div>
          <div className="ms-feat-grid">
            {[
              { icon: '✨', title: 'Premium Quality', desc: 'Strict batch control every time.', color: '#fbbf24' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Swift delivery across Tanzania.', color: '#f472b6' },
              { icon: '💚', title: 'Skin-Safe', desc: 'Gentle for all skin types.', color: '#a3e635' },
              { icon: '♻️', title: 'Eco-Conscious', desc: 'Sustainable packaging always.', color: '#6ee7b7' },
              { icon: '🎁', title: 'Gift Sets', desc: 'Perfect for every occasion.', color: '#c4b5fd' },
            ].map((f, i) => (
              <div key={i} className={`ms-feat ${featuresVisible ? 'ms-vis' : 'ms-hid'}`}
                style={{ animationDelay: `${i * 0.08}s`, '--acc': f.color }}>
                <div className="ms-feat__ico" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                  <span>{f.icon}</span>
                </div>
                <h4 className="ms-feat__title">{f.title}</h4>
                <p className="ms-feat__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (White Background) ── */}
      <section className="ms-testi-section" ref={testimonialsRef}>
        <div className="ms-container">
          <div className={`ms-head ${testimonialsVisible ? 'ms-vis' : 'ms-hid'}`}>
            <p className="ms-eyebrow">Customer Love</p>
            <h2 className="ms-h2">What People Say</h2>
            <div className="ms-line" />
            <p className="ms-sub">Trusted across Tanzania</p>
          </div>
          <div className={`ms-testi-grid ${testimonialsVisible ? 'ms-vis ms-d1' : 'ms-hid'}`}>
            {testimonials.map((t, i) => (
              <div key={i} className={`ms-testi-card ${i === testimonialIdx ? 'ms-testi-card--on' : ''}`}>
                <div className="ms-testi-quote">"</div>
                <div className="ms-testi-stars">{'★'.repeat(t.rating)}</div>
                <p className="ms-testi-text">{t.text}</p>
                <div className="ms-testi-author">
                  <div className="ms-testi-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="ms-testi-name">{t.name}</div>
                    <div className="ms-testi-loc">📍 {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ms-testi-dots">
            {testimonials.map((_, i) => (
              <button key={i} className={`ms-testi-dot ${i === testimonialIdx ? 'ms-testi-dot--on' : ''}`}
                onClick={() => setTestimonialIdx(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── LIPA ── */}
      <section className="ms-lipa-section" ref={lipaRef}>
        <div className="ms-lipa__grid" />
        <div className="ms-container">
          <div className={`ms-head ${lipaVisible ? 'ms-vis' : 'ms-hid'}`}>
            <p className="ms-eyebrow ms-eyebrow--lt">Easy Payments</p>
            <h2 className="ms-h2 ms-h2--lt">How to Pay</h2>
            <div className="ms-line ms-line--lt" />
            <p className="ms-sub ms-sub--lt">Simple mobile payments, no card needed</p>
          </div>
          <div className={`ms-lipa-card ${lipaVisible ? 'ms-vis ms-d1' : 'ms-hid'}`}>
            <div className="ms-lipa-left">
              <span className="ms-lipa-icon">📱</span>
              <div className="ms-lipa-badge">MIXX BY YAS</div>
              <p className="ms-lipa-num">{lipaNumber}</p>
            </div>
            <div className="ms-lipa-right">
              <h3 className="ms-lipa-title">Pay in 3 easy steps</h3>
              <div className="ms-lipa-steps">
                {['Place your order', 'Send payment via YAS', 'Order confirmed & dispatched'].map((s, i) => (
                  <div key={i} className="ms-lipa-step">
                    <span className="ms-lipa-step__n">{i + 1}</span>
                    <span className="ms-lipa-step__t">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ (White Background) ── */}
      <section className="ms-faq-section" ref={faqRef}>
        <div className="ms-container">
          <div className={`ms-head ${faqVisible ? 'ms-vis' : 'ms-hid'}`}>
            <p className="ms-eyebrow">Got Questions?</p>
            <h2 className="ms-h2">Frequently Asked</h2>
            <div className="ms-line" />
            <p className="ms-sub">Everything you need to know about MonaSoap</p>
          </div>
          <div className="ms-faq-grid">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ms-cta" ref={ctaRef}>
        <div className="ms-cta__grid" />
        <div className="ms-blob ms-blob--cta1" />
        <div className="ms-blob ms-blob--cta2" />
        <div className={`ms-cta__inner ${ctaVisible ? 'ms-vis' : 'ms-hid'}`}>
          <p className="ms-eyebrow ms-eyebrow--lt" style={{ color: '#93c5fd' }}>Ready to Order?</p>
          <h2 className="ms-cta__h2">Experience Natural <em>Luxury Today</em></h2>
          <p className="ms-cta__sub">Join hundreds of happy customers. Fast delivery across Tanzania.</p>
          <div className="ms-cta__btns">
            <button className="ms-btn ms-btn--white"
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
              Browse Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="/contact" className="ms-btn ms-btn--ghost">Contact Us</a>
          </div>
        </div>
      </section>

      <style>{CSS}</style>
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ms-page {
    min-height: 100vh;
    background: #0a0f1e;
    font-family: 'DM Sans', system-ui, sans-serif;
    overflow-x: hidden;
  }

  /* ── KEYFRAMES ── */
  @keyframes ms-up     { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ms-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes ms-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-24px)} }
  @keyframes ms-particle { 0%,100%{transform:translateY(0) scale(1);opacity:.6} 50%{transform:translateY(-14px) scale(1.25);opacity:1} }
  @keyframes ms-spin   { to{transform:rotate(360deg)} }
  @keyframes ms-title-line { from{width:0;opacity:0} to{width:48px;opacity:1} }
  @keyframes ms-ring-pulse { 0%{box-shadow:0 0 0 0 rgba(55,138,221,.38)} 70%{box-shadow:0 0 0 10px rgba(55,138,221,0)} 100%{box-shadow:0 0 0 0 rgba(55,138,221,0)} }

  .ms-hid { opacity:0; transform:translateY(28px); }
  .ms-vis { animation: ms-up 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .ms-d1 { animation-delay:.08s; }
  .ms-d2 { animation-delay:.18s; }
  .ms-d3 { animation-delay:.28s; }
  .ms-d4 { animation-delay:.42s; }

  /* ── SHARED ── */
  .ms-container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }

  .ms-head { text-align: center; margin-bottom: 36px; }

  .ms-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #3b82f6; margin-bottom: 8px; }
  .ms-eyebrow--lt { color: #60a5fa; }

  .ms-h2 { font-family: 'Playfair Display', serif; font-size: clamp(26px, 3.5vw, 38px); font-weight: 800; color: #0f172a; margin-bottom: 10px; letter-spacing: -.4px; }
  .ms-h2--lt { color: #f1f5f9; }

  .ms-line {
    width: 48px; height: 3px; border-radius: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    margin: 0 auto 12px;
    animation: ms-title-line 0.7s ease both;
  }
  .ms-line--lt { background: linear-gradient(90deg, #60a5fa, #c4b5fd); }

  .ms-sub { font-size: 14px; color: #64748b; max-width: 440px; margin: 0 auto; line-height: 1.65; }
  .ms-sub--lt { color: #94a3b8; }

  .ms-btn {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px;
    border-radius: 50px; font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; text-decoration: none;
    transition: all .25s cubic-bezier(0.22,1,0.36,1); border: none;
  }
  .ms-btn svg { transition: transform .2s; }
  .ms-btn:hover svg { transform: translateX(4px); }
  .ms-btn--white { background: #fff; color: #1e3a8a; box-shadow: 0 4px 20px rgba(0,0,0,.18); }
  .ms-btn--white:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,.22); }
  .ms-btn--ghost { background: transparent; color: #e2e8f0; border: 1.5px solid rgba(255,255,255,.25); }
  .ms-btn--ghost:hover { background: rgba(255,255,255,.08); transform: translateY(-3px); }

  /* ── HERO (Full solid background) ── */
  .ms-hero {
    position: relative;
    background: linear-gradient(155deg, #040c20 0%, #08163c 30%, #0d2060 55%, #0a1a50 75%, #06102e 100%);
    padding: 80px 24px 110px;
    text-align: center;
    overflow: hidden;
  }
  .ms-hero__grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(147,197,253,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(147,197,253,.04) 1px, transparent 1px);
    background-size: 52px 52px; pointer-events: none;
  }
  .ms-blob {
    position: absolute; border-radius: 50%; filter: blur(72px); pointer-events: none;
  }
  .ms-blob--1 { width:500px;height:500px;background:rgba(30,90,220,.2);top:-180px;left:-140px;animation:ms-float 11s ease-in-out infinite; }
  .ms-blob--2 { width:360px;height:360px;background:rgba(79,70,229,.16);bottom:-100px;right:-80px;animation:ms-float 13s ease-in-out infinite reverse; }

  .ms-particle { position:absolute;border-radius:50%;pointer-events:none;animation:ms-particle 4s ease-in-out infinite; }
  .ms-particle--0{background:rgba(147,197,253,.7)} .ms-particle--1{background:rgba(167,243,208,.6)}
  .ms-particle--2{background:rgba(253,186,116,.5)} .ms-particle--3{background:rgba(216,180,254,.6)}
  .ms-particle--4{background:rgba(249,168,212,.5)} .ms-particle--5{background:rgba(255,255,255,.4)}

  .ms-hero__inner { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }

  .ms-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(147,197,253,.2);
    backdrop-filter: blur(14px); color: #bfdbfe;
    padding: 7px 20px; border-radius: 28px;
    font-size: 11.5px; font-weight: 600; letter-spacing: .6px;
    margin-bottom: 24px;
  }
  .ms-badge__dot {
    width: 7px; height: 7px; border-radius: 50%; background: #34d399;
    box-shadow: 0 0 10px #34d399; animation: ms-blink 2s ease-in-out infinite;
  }

  .ms-hero__h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(40px, 7vw, 76px); font-weight: 800; color: #fff;
    line-height: 1.08; margin: 0 0 20px; letter-spacing: -1.5px; min-height: 1.08em;
  }
  .ms-hero__typed {
    background: linear-gradient(100deg, #ffffff 15%, #93c5fd 55%, #c4b5fd 85%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .ms-cursor { -webkit-text-fill-color: #60a5fa; animation: ms-blink .78s step-end infinite; font-weight: 200; }

  .ms-hero__sub {
    font-size: 16px; color: rgba(148,163,184,.88); line-height: 1.72;
    max-width: 500px; margin: 0 auto 32px; font-weight: 300;
  }
  .ms-hero__btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 44px; }

  .ms-stats {
    display: inline-flex; align-items: stretch;
    background: rgba(255,255,255,.05); border: 1px solid rgba(147,197,253,.13);
    backdrop-filter: blur(18px); border-radius: 18px; overflow: hidden; flex-wrap: wrap; justify-content: center;
  }
  .ms-stat {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 16px 28px; border-right: 1px solid rgba(255,255,255,.06);
  }
  .ms-stat:last-child { border-right: none; }
  .ms-stat strong { font-size: 24px; font-weight: 800; color: #fff; font-family: 'Playfair Display', serif; }
  .ms-stat span { font-size: 9.5px; color: #64748b; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }

  /* ── PRODUCTS (White Background - Larger Images) ── */
  .ms-section {
    background: #ffffff;
    padding: 64px 24px;
  }

  .ms-filters { margin-bottom: 32px; display: flex; flex-direction: column; gap: 14px; }
  .ms-search-wrap { position: relative; max-width: 420px; }
  .ms-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
  .ms-search {
    width: 100%; padding: 11px 14px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; background: #fff; color: #0f172a;
    transition: border-color .2s, box-shadow .2s;
  }
  .ms-search:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }

  .ms-cats { display: flex; gap: 8px; flex-wrap: wrap; }
  .ms-cat {
    padding: 7px 18px; border: 1.5px solid #e2e8f0; border-radius: 24px;
    background: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 500;
    cursor: pointer; color: #64748b; transition: all .2s;
  }
  .ms-cat:hover { border-color: #3b82f6; color: #3b82f6; transform: translateY(-2px); }
  .ms-cat--on { background: #3b82f6; border-color: #3b82f6; color: #fff; box-shadow: 0 4px 14px rgba(59,130,246,.28); transform: translateY(-2px); }

  .ms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 28px; }

  .ms-status { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 64px 0; color: #64748b; font-size: 14px; }
  .ms-spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: ms-spin .8s linear infinite; }

  .ms-card {
    background: #fff; border-radius: 24px; overflow: hidden; border: 1px solid #e8eef4;
    cursor: pointer; transition: transform .3s cubic-bezier(0.22,1,0.36,1), box-shadow .3s, border-color .3s;
    box-shadow: 0 4px 20px rgba(0,0,0,.06);
  }
  .ms-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(0,0,0,.12); border-color: rgba(59,130,246,.3); }

  .ms-card__img-box { 
    position: relative; 
    height: 320px; 
    background: #f8fafc; 
    overflow: hidden; 
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ms-card__img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    object-position: center;
    transition: transform .5s cubic-bezier(0.22,1,0.36,1); 
  }
  .ms-card__img--zoom { transform: scale(1.08); }
  .ms-card__no-img { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    height: 100%; 
    font-size: 72px; 
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0); 
  }
  .ms-card__oos { 
    position: absolute; 
    top: 16px; 
    right: 16px; 
    background: #ef4444; 
    color: #fff; 
    padding: 6px 14px; 
    border-radius: 30px; 
    font-size: 11px; 
    font-weight: 700; 
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
  }

  .ms-card__body { padding: 20px 22px 24px; }
  .ms-card__tag { 
    font-size: 10px; 
    font-weight: 700; 
    color: #3b82f6; 
    text-transform: uppercase; 
    letter-spacing: 1.5px; 
    background: #eff6ff; 
    padding: 4px 12px; 
    border-radius: 30px; 
    display: inline-block; 
    border: none;
  }
  .ms-card__name { 
    font-size: 18px; 
    font-weight: 700; 
    color: #0f172a; 
    margin: 12px 0 8px; 
    font-family: 'Playfair Display', serif; 
    line-height: 1.3; 
  }
  .ms-card__desc { 
    font-size: 13px; 
    color: #64748b; 
    line-height: 1.6; 
    margin-bottom: 18px; 
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ms-card__footer { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    margin-top: 8px;
  }
  .ms-card__price-wrap {
    display: flex;
    flex-direction: column;
  }
  .ms-card__price-lbl { 
    font-size: 10px; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    color: #94a3b8; 
    font-weight: 600; 
    margin-bottom: 2px; 
  }
  .ms-card__price { 
    font-size: 20px; 
    font-weight: 800; 
    color: #1e3a8a; 
    font-family: 'Playfair Display', serif; 
  }
  .ms-card__btn { 
    background: linear-gradient(135deg, #1d4ed8, #2563eb); 
    color: #fff; 
    border: none; 
    padding: 10px 22px; 
    border-radius: 40px; 
    font-size: 13px; 
    font-weight: 600; 
    font-family: 'DM Sans', sans-serif; 
    cursor: pointer; 
    transition: all .2s; 
    box-shadow: 0 4px 14px rgba(37,99,235,.3); 
  }
  .ms-card__btn:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 8px 24px rgba(37,99,235,.4); 
  }
  .ms-card__btn--off { 
    background: #f1f5f9; 
    color: #94a3b8; 
    cursor: not-allowed; 
    box-shadow: none; 
  }
  .ms-card__btn--off:hover { transform: none; box-shadow: none; }

  /* ── FEATURES ── */
  .ms-features {
    background: linear-gradient(155deg, #060e26 0%, #0c1e54 40%, #172a78 70%, #0c1e54 100%);
    padding: 64px 24px;
    position: relative;
    overflow: hidden;
  }
  .ms-features::before {
    content:''; position:absolute; inset:0;
    background-image: radial-gradient(circle,rgba(147,197,253,.04) 1px,transparent 1px);
    background-size: 40px 40px; pointer-events:none;
  }
  .ms-feat-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px; position: relative; z-index: 1; margin-top: 36px;
  }
  .ms-feat {
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
    backdrop-filter: blur(12px); border-radius: 20px; padding: 26px 20px; text-align: center;
    transition: transform .3s cubic-bezier(0.22,1,0.36,1), background .25s, border-color .25s;
    position: relative; overflow: hidden;
  }
  .ms-feat::before { content:''; position:absolute; top:0; left:0; right:0; height:2.5px; border-radius:20px 20px 0 0; background:var(--acc,#3b82f6); opacity:0; transition:opacity .25s; }
  .ms-feat:hover { transform: translateY(-10px); background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); }
  .ms-feat:hover::before { opacity: 1; }
  .ms-feat__ico { display: inline-flex; align-items: center; justify-content: center; width: 58px; height: 58px; border-radius: 16px; margin-bottom: 16px; transition: transform .3s; }
  .ms-feat:hover .ms-feat__ico { transform: scale(1.12) rotate(-5deg); }
  .ms-feat__ico span { font-size: 28px; }
  .ms-feat__title { font-size: 15px; font-weight: 700; color: #f1f5f9; margin: 0 0 7px; font-family: 'Playfair Display', serif; }
  .ms-feat__desc { font-size: 12.5px; color: rgba(255,255,255,.45); line-height: 1.6; margin: 0; }

  /* ── TESTIMONIALS (White Background) ── */
  .ms-testi-section {
    background: #ffffff;
    padding: 64px 24px;
  }
  .ms-testi-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 24px; margin-bottom: 24px; }
  .ms-testi-card {
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px;
    transition: all .35s cubic-bezier(0.22,1,0.36,1); position: relative; overflow: hidden;
  }
  .ms-testi-card--on { background: #fff; border-color: #3b82f6; box-shadow: 0 8px 32px rgba(37,99,235,.12); transform: translateY(-6px); }
  .ms-testi-quote { font-family: 'Playfair Display', serif; font-size: 60px; line-height: .8; color: #e2e8f0; position: absolute; top: 12px; right: 18px; font-weight: 800; }
  .ms-testi-card--on .ms-testi-quote { color: #dbeafe; }
  .ms-testi-stars { color: #fbbf24; font-size: 14px; margin-bottom: 12px; letter-spacing: 2px; }
  .ms-testi-text { font-size: 13.5px; color: #475569; line-height: 1.7; margin-bottom: 18px; font-style: italic; position: relative; z-index: 1; }
  .ms-testi-author { display: flex; align-items: center; gap: 12px; }
  .ms-testi-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg,#1d4ed8,#3b82f6); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px; flex-shrink: 0; }
  .ms-testi-name { font-size: 14px; font-weight: 700; color: #0f172a; }
  .ms-testi-loc { font-size: 11px; color: #94a3b8; }
  .ms-testi-dots { display: flex; justify-content: center; gap: 8px; margin-top: 8px; }
  .ms-testi-dot { width: 8px; height: 8px; border-radius: 50%; background: #e2e8f0; border: none; cursor: pointer; transition: all .22s; padding: 0; }
  .ms-testi-dot--on { background: #3b82f6; width: 24px; border-radius: 4px; }

  /* ── LIPA ── */
  .ms-lipa-section {
    background: linear-gradient(155deg, #040c20 0%, #08163c 30%, #0d2060 55%, #0a1a50 75%, #06102e 100%);
    padding: 64px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ms-lipa__grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(147,197,253,.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(147,197,253,.04) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
  }
  .ms-lipa-card {
    background: rgba(15,23,42,.7); backdrop-filter: blur(12px);
    border-radius: 24px; padding: 36px 44px;
    display: flex; align-items: center; gap: 40px; max-width: 720px; margin: 32px auto 0;
    border: 1px solid rgba(59,130,246,.3); box-shadow: 0 6px 40px rgba(0,0,0,.3);
    text-align: left; transition: transform .3s, box-shadow .3s;
    position: relative; z-index: 1;
  }
  .ms-lipa-card:hover { transform: translateY(-8px); box-shadow: 0 20px 52px rgba(0,0,0,.4); border-color: rgba(59,130,246,.5); }
  .ms-lipa-left { display: flex; flex-direction: column; align-items: center; gap: 12px; flex-shrink: 0; }
  .ms-lipa-icon { font-size: 52px; }
  .ms-lipa-badge { background: rgba(59,130,246,.15); border: 1px solid rgba(59,130,246,.3); color: #60a5fa; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 14px; border-radius: 20px; }
  .ms-lipa-num { font-size: 24px; font-weight: 800; color: #93c5fd; font-family: 'Playfair Display', serif; animation: ms-ring-pulse 2.5s ease-in-out infinite; white-space: nowrap; }
  .ms-lipa-right { flex: 1; }
  .ms-lipa-title { font-size: 18px; font-weight: 700; color: #f1f5f9; margin-bottom: 18px; font-family: 'Playfair Display', serif; }
  .ms-lipa-steps { display: flex; flex-direction: column; gap: 12px; }
  .ms-lipa-step { display: flex; align-items: center; gap: 14px; }
  .ms-lipa-step__n { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#1d4ed8,#3b82f6); color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ms-lipa-step__t { font-size: 13.5px; color: #cbd5e1; font-weight: 500; }

  /* ── FAQ (White Background) ── */
  .ms-faq-section {
    background: #ffffff;
    padding: 80px 24px 100px;
  }
  .ms-faq-grid {
    max-width: 1000px;
    margin: 0 auto 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .fq-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    overflow: hidden;
    transition: all .25s ease;
  }
  .fq-item:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }
  .fq-item--open {
    background: #ffffff;
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59,130,246,.08);
  }
  .fq-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 26px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .fq-q {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    line-height: 1.45;
    transition: color .18s;
    flex: 1;
  }
  .fq-item--open .fq-q,
  .fq-item:hover .fq-q {
    color: #2563eb;
  }
  .fq-ico {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: transform .3s cubic-bezier(0.22,1,0.36,1), background .2s, color .2s;
  }
  .fq-ico svg {
    width: 16px;
    height: 16px;
  }
  .fq-item--open .fq-ico {
    transform: rotate(180deg);
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #3b82f6;
  }
  .fq-item:hover .fq-ico {
    color: #3b82f6;
  }
  .fq-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height .4s cubic-bezier(0.22,1,0.36,1);
  }
  .fq-item--open .fq-body {
    max-height: 300px;
  }
  .fq-a {
    padding: 0 26px 22px;
    font-size: 14px;
    color: #475569;
    line-height: 1.7;
    border-top: 1px solid #eef2ff;
    padding-top: 16px;
  }

  /* ── CTA ── */
  .ms-cta {
    position: relative;
    background: linear-gradient(155deg, #050d24 0%, #0a1a4a 40%, #0e2266 70%, #112980 100%);
    padding: 80px 24px;
    text-align: center;
    overflow: hidden;
  }
  .ms-cta__grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(147,197,253,.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(147,197,253,.04) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
  }
  .ms-blob--cta1 {
    width: 440px; height: 440px;
    background: rgba(37,99,235,.12);
    top: -160px; left: -130px;
    animation: ms-float 9s ease-in-out infinite;
    position: absolute;
    border-radius: 50%;
    filter: blur(72px);
    pointer-events: none;
  }
  .ms-blob--cta2 {
    width: 320px; height: 320px;
    background: rgba(99,102,241,.1);
    bottom: -90px; right: -70px;
    animation: ms-float 11.5s ease-in-out infinite reverse;
    position: absolute;
    border-radius: 50%;
    filter: blur(72px);
    pointer-events: none;
  }
  .ms-cta__inner { position: relative; z-index: 1; max-width: 580px; margin: 0 auto; }
  .ms-cta__h2 { font-family: 'Playfair Display', serif; font-size: clamp(30px, 4.5vw, 52px); font-weight: 800; color: #f1f5f9; margin: 0 0 16px; line-height: 1.12; letter-spacing: -.4px; }
  .ms-cta__h2 em { font-style: italic; color: #93c5fd; }
  .ms-cta__sub { font-size: 14.5px; color: #94a3b8; line-height: 1.7; max-width: 460px; margin: 0 auto 32px; font-weight: 300; }
  .ms-cta__btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .ms-hero { padding: 64px 18px 90px; }
    .ms-section, .ms-features, .ms-testi-section, .ms-lipa-section, .ms-cta { padding: 48px 18px; }
    .ms-faq-section { padding: 60px 20px 80px; }
    .ms-stat { padding: 12px 16px; }
    .ms-lipa-card { flex-direction: column; text-align: center; padding: 28px 22px; align-items: center; gap: 22px; }
    .ms-lipa-steps { align-items: center; }
    .ms-feat-grid { grid-template-columns: repeat(2, 1fr); }
    .ms-faq-grid { padding: 0; }
    .fq-btn { padding: 16px 20px; }
    .fq-q { font-size: 14px; }
    .fq-ico { width: 28px; height: 28px; }
    .fq-a { padding: 0 20px 18px; font-size: 13px; }
    .ms-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
    .ms-card__img-box { height: 260px; }
    .ms-card__body { padding: 16px 18px 20px; }
    .ms-card__name { font-size: 16px; }
    .ms-card__price { font-size: 18px; }
    .ms-card__btn { padding: 8px 18px; font-size: 12px; }
  }
  @media (max-width: 480px) {
    .ms-feat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .ms-feat { padding: 20px 14px; }
    .ms-testi-grid { grid-template-columns: 1fr; }
    .ms-stats { width: 100%; }
    .ms-stat { flex: 1; padding: 12px 10px; }
    .ms-hero__h1 { font-size: clamp(34px, 7vw, 52px); }
    .ms-grid { grid-template-columns: 1fr; }
    .ms-card__img-box { height: 280px; }
  }
  @media (min-width: 1400px) {
    .ms-faq-grid {
      max-width: 1200px;
    }
    .ms-grid { grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px; }
    .ms-card__img-box { height: 360px; }
    .fq-btn { padding: 24px 32px; }
    .fq-q { font-size: 17px; }
    .fq-a { padding: 0 32px 24px; font-size: 15px; }
  }
`;

export default Home;