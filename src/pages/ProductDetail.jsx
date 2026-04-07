import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const getSafeRating = (rating) => {
    const num = Number(rating);
    return !isNaN(num) && isFinite(num) ? num : 0;
  };

  const formatPrice = (price) => {
    const num = Number(price);
    return !isNaN(num) ? num.toLocaleString() : '0';
  };

  // ✅ Safely get reviewer name from any possible field
  const getReviewerName = (review) => {
    return (
      review?.customer?.name ||
      review?.customer?.email?.split('@')[0] ||  // fallback to email prefix
      'Customer'
    );
  };

  // ✅ Safely get reviewer initial for avatar
  const getReviewerInitial = (review) => {
    const name = getReviewerName(review);
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      toast.error('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data.reviews || []);
      setAvgRating(getSafeRating(res.data.avgRating));
    } catch (err) {
      console.log('No reviews yet');
      setReviews([]);
      setAvgRating(0);
    }
  };

  const handleOrder = () => {
    if (!user) {
      toast.info('Please login to place an order');
      navigate('/login');
      return;
    }
    navigate(`/place-order/${id}`, { state: { product, quantity } });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to leave a review');
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await API.post('/reviews', {
        productId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    const safeRating = getSafeRating(rating);
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{
        width: '48px', height: '48px',
        border: '3px solid #e2e8f0',
        borderTopColor: '#0891b2',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto'
      }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Product not found</div>
  );

  const safeAvgRating = getSafeRating(avgRating);
  const displayRating = safeAvgRating.toFixed(1);

  return (
    <div className="product-detail-page" style={{ background: '#f0f9ff', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', color: '#3b82f6',
            fontSize: '14px', cursor: 'pointer', marginBottom: '24px',
            fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px'
          }}
        >
          ← Back to Products
        </button>

        {/* Product Section */}
        <div className="product-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px',
          background: '#fff', borderRadius: '24px', padding: '30px',
          marginBottom: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>

          {/* Images */}
          <div>
            <div className="main-image" style={{
              height: '350px', background: '#f8fafc',
              borderRadius: '16px', overflow: 'hidden', marginBottom: '16px'
            }}>
              {product.images && product.images.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${product.images[activeImage]}`}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', height: '100%', fontSize: '80px'
                }}>🧼</div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="thumbnails" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000/uploads/${img}`}
                    alt={`thumb-${i}`}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: '70px', height: '70px', objectFit: 'cover',
                      borderRadius: '10px', cursor: 'pointer',
                      border: i === activeImage ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            )}

            {product.videos && product.videos.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1e3a8a' }}>
                  Product Videos
                </h4>
                {product.videos.map((vid, i) => (
                  <video key={i} controls style={{ width: '100%', borderRadius: '12px', marginBottom: '12px' }}>
                    <source src={`http://localhost:5000/uploads/${vid}`} />
                  </video>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{
              fontSize: '12px', color: '#3b82f6', fontWeight: '600',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>{product.category}</span>

            <h1 className="product-title" style={{
              fontSize: '28px', fontFamily: "'Playfair Display', serif",
              color: '#0c4a6e', margin: 0
            }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#f59e0b', fontSize: '18px' }}>{renderStars(safeAvgRating)}</span>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                {displayRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <p className="product-price" style={{
              fontSize: '32px', fontWeight: '700', color: '#1e3a8a',
              fontFamily: "'Playfair Display', serif", margin: 0
            }}>
              TSh {formatPrice(product.price)}
            </p>

            <div>
              {product.isAvailable ? (
                <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
                  ✓ In Stock ({product.quantity || product.stock || 0} available)
                </span>
              ) : (
                <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '14px' }}>
                  ✗ Out of Stock
                </span>
              )}
            </div>

            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>{product.description}</p>

            {product.isAvailable && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '34px', height: '34px', border: '1px solid #e2e8f0',
                      background: '#fff', borderRadius: '8px', fontSize: '18px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.background = '#fff'}
                  >-</button>
                  <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity || product.stock || 10, quantity + 1))}
                    style={{
                      width: '34px', height: '34px', border: '1px solid #e2e8f0',
                      background: '#fff', borderRadius: '8px', fontSize: '18px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.target.style.background = '#fff'}
                  >+</button>
                </div>
              </div>
            )}

            {product.isAvailable && (
              <p style={{ fontSize: '18px', fontWeight: '700', color: '#1e3a8a', marginTop: '8px' }}>
                Total: TSh {formatPrice(product.price * quantity)}
              </p>
            )}

            <button
              onClick={handleOrder}
              disabled={!product.isAvailable}
              style={{
                background: product.isAvailable ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : '#94a3b8',
                color: '#fff', border: 'none', padding: '14px', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600',
                cursor: product.isAvailable ? 'pointer' : 'not-allowed',
                width: '100%', marginTop: '8px', transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                if (product.isAvailable) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37,99,235,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {product.isAvailable ? 'Place Order' : 'Out of Stock'}
            </button>

            <div style={{
              background: '#eff6ff', borderRadius: '12px', padding: '16px',
              border: '1px solid #bfdbfe', marginTop: '8px'
            }}>
              <p style={{ fontWeight: '600', color: '#1e3a8a', marginBottom: '4px' }}>💳 How to Pay</p>
              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                After placing your order, pay via MIXX BY YAS Lipa Number:
              </p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: '#1e3a8a' }}>44473260</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{
          background: '#fff', borderRadius: '24px', padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '24px', fontFamily: "'Playfair Display', serif",
            color: '#0c4a6e', marginBottom: '24px'
          }}>Customer Reviews</h2>

          {/* Review Form */}
          {user && user.role === 'customer' && (
            <div style={{
              background: '#f8fafc', borderRadius: '16px',
              padding: '24px', marginBottom: '28px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e3a8a' }}>
                Leave a Review
              </h3>
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '13px', fontWeight: '600', color: '#1e3a8a',
                    marginBottom: '6px', display: 'block'
                  }}>Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    style={{
                      padding: '10px 12px', border: '1px solid #e2e8f0',
                      borderRadius: '8px', fontSize: '14px', width: '100%'
                    }}
                  >
                    <option value={5}>★★★★★ Excellent</option>
                    <option value={4}>★★★★☆ Good</option>
                    <option value={3}>★★★☆☆ Average</option>
                    <option value={2}>★★☆☆☆ Poor</option>
                    <option value={1}>★☆☆☆☆ Terrible</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '13px', fontWeight: '600', color: '#1e3a8a',
                    marginBottom: '6px', display: 'block'
                  }}>Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    style={{
                      padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px',
                      fontSize: '14px', width: '100%', resize: 'vertical', fontFamily: 'inherit'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{
                    background: submittingReview ? '#94a3b8' : '#3b82f6',
                    color: '#fff', border: 'none', padding: '10px 24px',
                    borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                    cursor: submittingReview ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
                  }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map((review) => (
                <div key={review._id} style={{
                  border: '1px solid #e2e8f0', borderRadius: '16px',
                  padding: '20px', transition: 'box-shadow 0.2s'
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: '12px', flexWrap: 'wrap'
                  }}>
                    {/* ✅ Avatar using getReviewerInitial */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                      color: '#fff', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '18px', fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {getReviewerInitial(review)}
                    </div>

                    <div>
                      {/* ✅ Name using getReviewerName */}
                      <p style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a', marginBottom: '4px' }}>
                        {getReviewerName(review)}
                      </p>
                      <span style={{ color: '#f59e0b', fontSize: '14px' }}>
                        {renderStars(review.rating)}
                      </span>
                    </div>

                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#94a3b8' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .product-title { font-size: 24px !important; }
          .product-price { font-size: 28px !important; }
          .main-image { height: 280px !important; }
          .thumbnails img { width: 55px !important; height: 55px !important; }
        }
        @media (max-width: 480px) {
          .product-detail-page { padding: 16px !important; }
          .product-grid { padding: 20px !important; }
          .main-image { height: 220px !important; }
          .thumbnails img { width: 50px !important; height: 50px !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;