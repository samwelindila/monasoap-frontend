import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const [headerRef, headerVisible] = useInView(0.05);
  const [gridRef, gridVisible] = useInView(0.05);

  const categories = ['Bar Soaps', 'Liquid Soaps', 'Body Care', 'Gift Sets'];

  // eslint-disable-next-line
  useEffect(() => { fetchProducts(); }, [search, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await API.get('/products', { params });
      setProducts(res.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const n = Number(price);
    return isNaN(n) ? '0' : n.toLocaleString();
  };

  return (
    <div className="pr-page">

      {/* ── PAGE HEADER (SHORT VERSION) ── */}
      <section className="pr-header" ref={headerRef}>
        <div className="pr-header__grid" />
        <div className="pr-header__blob pr-header__blob--1" />
        <div className="pr-header__blob pr-header__blob--2" />
        <div className={`pr-header__inner ${headerVisible ? 'pr-vis' : 'pr-hid'}`}>
          <div className="pr-badge">
            <span className="pr-badge__dot" />
            100% Natural · Handcrafted in Tanzania
          </div>
          <h1 className="pr-header__h1">Our Products</h1>
          <div className="pr-header__line" />
          <p className="pr-header__sub">
            Handcrafted soaps and body care, made with love and natural ingredients sourced across Tanzania
          </p>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="pr-section" ref={gridRef}>
        <div className="pr-container">

          {/* Filters */}
          <div className={`pr-filters ${gridVisible ? 'pr-vis pr-d1' : 'pr-hid'}`}>
            <div className="pr-search-wrap">
              <svg className="pr-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pr-search"
              />
              {search && (
                <button className="pr-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            <div className="pr-cats">
              <button className={`pr-cat ${category === '' ? 'pr-cat--on' : ''}`} onClick={() => setCategory('')}>
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`pr-cat ${category === cat ? 'pr-cat--on' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <p className={`pr-count ${gridVisible ? 'pr-vis pr-d2' : 'pr-hid'}`}>
              Showing <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''}
              {category && <span> in <em>{category}</em></span>}
              {search && <span> matching "<em>{search}</em>"</span>}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="pr-status">
              <div className="pr-spinner" />
              <span>Loading products…</span>
            </div>
          ) : products.length === 0 ? (
            <div className="pr-empty">
              <div className="pr-empty__icon">🧼</div>
              <h3 className="pr-empty__title">No products found</h3>
              <p className="pr-empty__sub">Try adjusting your search or filter</p>
              <button className="pr-empty__reset" onClick={() => { setSearch(''); setCategory(''); }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="pr-grid">
              {products.map((p, i) => (
                <div
                  key={p._id}
                  className={`pr-card ${gridVisible ? 'pr-vis' : 'pr-hid'}`}
                  style={{ animationDelay: `${0.05 + i * 0.06}s` }}
                  onClick={() => navigate(`/product/${p._id}`)}
                  onMouseEnter={() => setHoveredCard(p._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="pr-card__img-box">
                    {p.images?.length > 0 ? (
                      <img
                        src={`http://localhost:5000/uploads/${p.images[0]}`}
                        alt={p.name}
                        className={`pr-card__img ${hoveredCard === p._id ? 'pr-card__img--zoom' : ''}`}
                      />
                    ) : (
                      <div className="pr-card__no-img">🧼</div>
                    )}
                    {!p.isAvailable && <div className="pr-card__oos">Out of Stock</div>}
                    {p.isAvailable && <div className="pr-card__avail">Available</div>}
                  </div>
                  <div className="pr-card__body">
                    <span className="pr-card__tag">{p.category}</span>
                    <h3 className="pr-card__name">{p.name}</h3>
                    <p className="pr-card__desc">{p.description?.substring(0, 90)}{p.description?.length > 90 ? '…' : ''}</p>
                    <div className="pr-card__footer">
                      <div className="pr-card__price-wrap">
                        <span className="pr-card__price-lbl">Price</span>
                        <span className="pr-card__price">TSh {formatPrice(p.price)}</span>
                      </div>
                      <button
                        className={`pr-card__btn ${!p.isAvailable ? 'pr-card__btn--off' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (p.isAvailable) navigate(`/product/${p._id}`);
                        }}
                      >
                        {p.isAvailable ? (
                          <>
                            Order Now
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </>
                        ) : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="pr-cta">
        <div className="pr-cta__grid" />
        <div className="pr-cta__inner">
          <h2 className="pr-cta__h2">Can't find what you're looking for?</h2>
          <p className="pr-cta__sub">Reach out to us and we'll help you find the perfect product.</p>
          <a href="/contact" className="pr-cta__btn">
            Contact Us
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      <style>{CSS}</style>
    </div>
  );
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes pr-spin  { to { transform: rotate(360deg); } }
  @keyframes pr-up    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pr-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
  @keyframes pr-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pr-line  { from{width:0;opacity:0} to{width:48px;opacity:1} }

  .pr-hid { opacity:0; transform:translateY(24px); }
  .pr-vis { animation: pr-up 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .pr-d1  { animation-delay: .08s; }
  .pr-d2  { animation-delay: .16s; }

  .pr-page {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'DM Sans', system-ui, sans-serif;
    overflow-x: hidden;
  }

  /* ── PAGE HEADER (SHORT VERSION - NO TOP SPACE) ── */
  .pr-header {
    position: relative;
    background: linear-gradient(155deg, #040c20 0%, #08163c 30%, #0d2060 55%, #0a1a50 75%, #06102e 100%);
    padding: 48px 24px 32px;
    text-align: center;
    overflow: hidden;
  }
  .pr-header__grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(147,197,253,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(147,197,253,.04) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
  }
  .pr-header__blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px); pointer-events: none;
  }
  .pr-header__blob--1 { width:280px;height:280px;background:rgba(30,90,220,.18);top:-140px;left:-100px;animation:pr-float 11s ease-in-out infinite; }
  .pr-header__blob--2 { width:200px;height:200px;background:rgba(79,70,229,.14);bottom:-40px;right:-40px;animation:pr-float 13s ease-in-out infinite reverse; }

  .pr-header__inner { position:relative;z-index:2;max-width:640px;margin:0 auto; }

  .pr-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(147,197,253,.2);
    backdrop-filter: blur(14px); color: #bfdbfe;
    padding: 4px 12px; border-radius: 28px;
    font-size: 9px; font-weight: 600; letter-spacing: .5px;
    margin-bottom: 12px;
  }
  .pr-badge__dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #34d399; box-shadow: 0 0 8px #34d399;
    animation: pr-blink 2s ease-in-out infinite;
  }

  .pr-header__h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800; color: #fff;
    letter-spacing: -0.5px; margin-bottom: 8px; line-height: 1.15;
    background: linear-gradient(100deg, #ffffff 20%, #93c5fd 60%, #c4b5fd 90%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .pr-header__line {
    width: 40px; height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, #60a5fa, #c4b5fd);
    margin: 0 auto 10px;
    animation: pr-line 0.8s ease both 0.3s;
  }
  .pr-header__sub {
    font-size: 12px; color: rgba(148,163,184,.85);
    line-height: 1.5; font-weight: 300; max-width: 480px; margin: 0 auto;
  }

  /* ── SECTION ── */
  .pr-section { padding: 48px 24px 80px; background: #f8fafc; }
  .pr-container { max-width: 1200px; margin: 0 auto; }

  /* ── FILTERS ── */
  .pr-filters {
    display: flex; flex-direction: column; gap: 16px;
    margin-bottom: 28px;
    background: #fff; border: 1px solid #e8eef4;
    border-radius: 20px; padding: 20px 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,.05);
  }
  .pr-search-wrap { position: relative; max-width: 480px; }
  .pr-search-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none; }
  .pr-search-clear { position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;display:flex;align-items:center;padding:4px;border-radius:50%;transition:color .2s,background .2s; }
  .pr-search-clear:hover { color:#ef4444;background:#fef2f2; }
  .pr-search {
    width:100%;padding:13px 40px 13px 42px;border:1.5px solid #e2e8f0;border-radius:14px;
    font-size:14px;font-family:'DM Sans',sans-serif;outline:none;background:#fff;color:#0f172a;
    transition:border-color .2s,box-shadow .2s;
  }
  .pr-search:focus { border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1); }
  .pr-cats { display:flex;gap:8px;flex-wrap:wrap; }
  .pr-cat {
    padding:8px 20px;border:1.5px solid #e2e8f0;border-radius:24px;
    background:#fff;font-size:13px;font-family:'DM Sans',sans-serif;font-weight:500;
    cursor:pointer;color:#64748b;transition:all .2s;
  }
  .pr-cat:hover { border-color:#3b82f6;color:#3b82f6;transform:translateY(-2px); }
  .pr-cat--on { background:#3b82f6;border-color:#3b82f6;color:#fff;box-shadow:0 4px 14px rgba(59,130,246,.28);transform:translateY(-2px); }

  /* ── COUNT ── */
  .pr-count { font-size:13.5px;color:#64748b;margin-bottom:28px;font-weight:500; }
  .pr-count strong { color:#1e3a8a;font-weight:700; }
  .pr-count em { font-style:italic;color:#3b82f6; }

  /* ── STATUS / EMPTY ── */
  .pr-status { display:flex;flex-direction:column;align-items:center;gap:14px;padding:80px 0;color:#64748b;font-size:14px; }
  .pr-spinner { width:36px;height:36px;border:3px solid #e2e8f0;border-top-color:#3b82f6;border-radius:50%;animation:pr-spin .8s linear infinite; }
  .pr-empty { display:flex;flex-direction:column;align-items:center;gap:12px;padding:80px 0;text-align:center; }
  .pr-empty__icon { font-size:64px;margin-bottom:8px; }
  .pr-empty__title { font-size:20px;font-weight:700;color:#0f172a;font-family:'Playfair Display',serif; }
  .pr-empty__sub { font-size:14px;color:#64748b; }
  .pr-empty__reset { margin-top:8px;padding:10px 24px;background:#3b82f6;color:#fff;border:none;border-radius:24px;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s; }
  .pr-empty__reset:hover { background:#2563eb;transform:translateY(-2px); }

  /* ── GRID ── */
  .pr-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:28px; }

  /* ── CARD ── */
  .pr-card {
    background:#fff;border-radius:24px;overflow:hidden;
    border:1px solid #e8eef4;cursor:pointer;
    transition:transform .3s cubic-bezier(0.22,1,0.36,1),box-shadow .3s,border-color .3s;
    box-shadow:0 4px 20px rgba(0,0,0,.06);
    animation: pr-up 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  .pr-card:hover { transform:translateY(-8px);box-shadow:0 24px 48px rgba(0,0,0,.12);border-color:rgba(59,130,246,.3); }

  .pr-card__img-box {
    position:relative;height:320px;background:#f8fafc;overflow:hidden;
    display:flex;align-items:center;justify-content:center;
  }
  .pr-card__img { width:100%;height:100%;object-fit:cover;object-position:center;transition:transform .5s cubic-bezier(0.22,1,0.36,1); }
  .pr-card__img--zoom { transform:scale(1.08); }
  .pr-card__no-img { display:flex;align-items:center;justify-content:center;height:100%;width:100%;font-size:72px;background:linear-gradient(135deg,#f1f5f9,#e2e8f0); }
  .pr-card__oos { position:absolute;top:14px;right:14px;background:#ef4444;color:#fff;padding:5px 12px;border-radius:30px;font-size:11px;font-weight:700;letter-spacing:.5px; }
  .pr-card__avail { position:absolute;top:14px;right:14px;background:rgba(16,185,129,.9);color:#fff;padding:5px 12px;border-radius:30px;font-size:11px;font-weight:700;letter-spacing:.5px; }

  .pr-card__body { padding:20px 22px 24px; }
  .pr-card__tag { font-size:10px;font-weight:700;color:#3b82f6;text-transform:uppercase;letter-spacing:1.5px;background:#eff6ff;padding:4px 12px;border-radius:30px;display:inline-block; }
  .pr-card__name { font-size:18px;font-weight:700;color:#0f172a;margin:12px 0 8px;font-family:'Playfair Display',serif;line-height:1.3; }
  .pr-card__desc { font-size:13px;color:#64748b;line-height:1.6;margin-bottom:18px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .pr-card__footer { display:flex;align-items:center;justify-content:space-between;margin-top:8px; }
  .pr-card__price-wrap { display:flex;flex-direction:column; }
  .pr-card__price-lbl { font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:600;margin-bottom:2px; }
  .pr-card__price { font-size:20px;font-weight:800;color:#1e3a8a;font-family:'Playfair Display',serif; }
  .pr-card__btn {
    display:inline-flex;align-items:center;gap:6px;
    background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;border:none;
    padding:10px 20px;border-radius:40px;font-size:13px;font-weight:600;
    font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;
    box-shadow:0 4px 14px rgba(37,99,235,.3);
  }
  .pr-card__btn svg { transition:transform .2s; }
  .pr-card__btn:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,.4); }
  .pr-card__btn:hover svg { transform:translateX(3px); }
  .pr-card__btn--off { background:#f1f5f9;color:#94a3b8;cursor:not-allowed;box-shadow:none; }
  .pr-card__btn--off:hover { transform:none;box-shadow:none; }

  /* ── CTA BANNER ── */
  .pr-cta {
    position:relative;
    background:linear-gradient(155deg,#040c20 0%,#08163c 30%,#0d2060 55%,#0a1a50 75%,#06102e 100%);
    padding:64px 24px;text-align:center;overflow:hidden;
  }
  .pr-cta__grid {
    position:absolute;inset:0;
    background-image:linear-gradient(rgba(147,197,253,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(147,197,253,.04) 1px,transparent 1px);
    background-size:52px 52px;pointer-events:none;
  }
  .pr-cta__inner { position:relative;z-index:1;max-width:560px;margin:0 auto; }
  .pr-cta__h2 { font-family:'Playfair Display',serif;font-size:clamp(24px,3.5vw,38px);font-weight:800;color:#f1f5f9;margin-bottom:14px;line-height:1.15; }
  .pr-cta__sub { font-size:14.5px;color:#94a3b8;line-height:1.7;margin-bottom:28px;font-weight:300; }
  .pr-cta__btn {
    display:inline-flex;align-items:center;gap:8px;
    background:#fff;color:#1e3a8a;padding:14px 32px;border-radius:50px;
    font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;
    text-decoration:none;transition:all .25s;box-shadow:0 4px 20px rgba(0,0,0,.18);
  }
  .pr-cta__btn svg { transition:transform .2s; }
  .pr-cta__btn:hover { background:#eff6ff;transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.22); }
  .pr-cta__btn:hover svg { transform:translateX(4px); }

  /* ── RESPONSIVE - NO TOP SPACE ON MOBILE ── */
  @media (max-width: 768px) {
    .pr-header { 
      padding: 40px 18px 28px;
    }
    .pr-section { 
      padding: 40px 18px 60px; 
    }
    .pr-filters { 
      padding: 16px 18px; 
    }
    .pr-grid { 
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px; 
    }
    .pr-card__img-box { 
      height: 260px; 
    }
    .pr-cta { 
      padding: 48px 18px; 
    }
  }
  
  @media (max-width: 480px) {
    .pr-header { 
      padding: 32px 16px 24px;
    }
    .pr-section { 
      padding: 32px 16px 48px;
    }
    .pr-grid { 
      grid-template-columns: 1fr; 
    }
    .pr-card__img-box { 
      height: 280px; 
    }
  }
  
  @media (min-width: 1400px) {
    .pr-grid { 
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 32px; 
    }
    .pr-card__img-box { 
      height: 360px; 
    }
  }
`;

export default Products;