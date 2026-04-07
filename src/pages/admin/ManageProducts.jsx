import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '',
    quantity: '', category: ''
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const categories = ['Bar Soaps', 'Liquid Soaps', 'Body Care', 'Gift Sets'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', quantity: '', category: '' });
    setImages([]);
    setVideos([]);
    setPreviewImages([]);
    setEditProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category
    });
    setEditProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('quantity', formData.quantity);
      data.append('category', formData.category);
      images.forEach(img => data.append('images', img));
      videos.forEach(vid => data.append('videos', vid));

      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, data);
        toast.success('Product updated successfully!');
      } else {
        await API.post('/products', data);
        toast.success('Product added successfully!');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTopColor: '#0891b2', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '16px', color: '#64748b' }}>Loading products...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", color: '#0c4a6e', marginBottom: '4px' }}>Manage Products</h1>
          <Link to="/admin" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Back to Dashboard</Link>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{
            background: showForm ? '#f1f5f9' : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            color: showForm ? '#64748b' : '#fff',
            border: showForm ? '1px solid #e2e8f0' : 'none',
            padding: '10px 24px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add New Product'}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", color: '#1e3a8a', marginBottom: '20px' }}>
            {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Row 1 - Name & Category */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }} className="form-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Lavender Bar Soap"
                  required
                  style={{
                    padding: '10px 12px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '10px 12px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#fff'
                  }}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 - Price & Quantity */}
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  marginBottom: '16px'
}} className="form-row">
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Price (TSh) *</label>
    <input
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      placeholder="e.g. 5000"
      min="0"
      step="100"
      required
      onKeyDown={(e) => {
        // Prevent negative sign input
        if (e.key === '-' || e.key === 'e') {
          e.preventDefault();
        }
      }}
      style={{
        padding: '10px 12px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none'
      }}
    />
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Stock Quantity *</label>
    <input
      type="number"
      name="quantity"
      value={formData.quantity}
      onChange={handleChange}
      placeholder="e.g. 50"
      min="0"
      step="1"
      required
      onKeyDown={(e) => {
        // Prevent negative sign input
        if (e.key === '-' || e.key === 'e') {
          e.preventDefault();
        }
      }}
      style={{
        padding: '10px 12px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none'
      }}
    />
  </div>
</div>
            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={4}
                required
                style={{
                  padding: '10px 12px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Images & Videos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px'
            }} className="form-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ fontSize: '14px' }}
                />
                {previewImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {previewImages.map((src, idx) => (
                      <img key={idx} src={src} alt={`Preview ${idx}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    ))}
                  </div>
                )}
                <small style={{ fontSize: '11px', color: '#94a3b8' }}>Max 5 images (JPG, PNG, WEBP)</small>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>Product Videos</label>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => setVideos([...e.target.files])}
                  style={{ fontSize: '14px' }}
                />
                <small style={{ fontSize: '11px', color: '#94a3b8' }}>Max 3 videos (MP4, MOV)</small>
              </div>
            </div>

            {/* Form Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 28px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? '⏳ Saving...' : (editProduct ? '✓ Update Product' : '+ Add Product')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List - Mobile Cards + Desktop Table */}
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📦</div>
          <p>No products yet. Add your first product above!</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0c4a6e' }}>Product Inventory</h2>
            <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{products.length} products</span>
          </div>

          {/* Desktop Table */}
          <div className="desktop-table" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Image</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>
                      {product.images && product.images.length > 0 ? (
                        <img src={`https://monasoap-backend.onrender.com/uploads/${product.images[0]}`
                       } alt={product.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <div style={{ width: '45px', height: '45px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🧼</div>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>
                      <p style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>{product.description?.substring(0, 40)}...</p>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>{product.category}</td>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: '#1e3a8a' }}>TSh {product.price?.toLocaleString()}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#475569' }}>{product.quantity}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: product.isAvailable ? '#d1fae5' : '#fee2e2',
                        color: product.isAvailable ? '#065f46' : '#dc2626',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(product)} style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(product._id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Product Cards */}
          <div className="mobile-products">
            {products.map(product => (
              <div key={product._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '12px', background: '#fff' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  {product.images && product.images.length > 0 ? (
                    <img src={`https://monasoap-backend.onrender.com/uploads/${product.images[0]}`}
               alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🧼</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>{product.name}</p>
                    <p style={{ fontSize: '12px', color: '#3b82f6', marginBottom: '4px' }}>{product.category}</p>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e3a8a' }}>TSh {product.price?.toLocaleString()}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Stock: {product.quantity}</span>
                    <span style={{
                      marginLeft: '12px',
                      background: product.isAvailable ? '#d1fae5' : '#fee2e2',
                      color: product.isAvailable ? '#065f46' : '#dc2626',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {product.isAvailable ? 'In Stock' : 'Out'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(product)} style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(product._id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Desktop styles */
        @media (min-width: 769px) {
          .desktop-table {
            display: block !important;
          }
          .mobile-products {
            display: none !important;
          }
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .desktop-table {
            display: none !important;
          }
          .mobile-products {
            display: block !important;
          }
        }
        
        /* Small mobile */
        @media (max-width: 480px) {
          .form-buttons {
            flex-direction: column !important;
          }
          .form-buttons button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageProducts;