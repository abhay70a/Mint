'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Heart, Star, X, Plus, Minus, Zap, Shield, Truck, ArrowLeft } from 'lucide-react'

const PRODUCTS = [
  {
    id: 1,
    name: 'Midnight Hoodie',
    category: 'Apparel',
    price: 4999,
    rating: 4.8,
    reviews: 124,
    badge: 'Best Seller',
    accent: '#00f5a0',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Quantum Sneakers',
    category: 'Footwear',
    price: 8999,
    rating: 4.9,
    reviews: 87,
    badge: 'New',
    accent: '#00d4aa',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Carbon Watch',
    category: 'Accessories',
    price: 18999,
    rating: 4.7,
    reviews: 56,
    badge: null,
    accent: '#00f5a0',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Aurora Backpack',
    category: 'Bags',
    price: 6999,
    rating: 4.6,
    reviews: 203,
    badge: 'Sale',
    accent: '#00e8b5',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Stealth Shades',
    category: 'Accessories',
    price: 3499,
    rating: 4.5,
    reviews: 91,
    badge: null,
    accent: '#00c896',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Neon Joggers',
    category: 'Apparel',
    price: 3999,
    rating: 4.7,
    reviews: 68,
    badge: 'Hot',
    accent: '#00f5a0',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Titan Cap',
    category: 'Apparel',
    price: 1499,
    rating: 4.4,
    reviews: 312,
    badge: null,
    accent: '#00d4aa',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 8,
    name: 'Lunar Earbuds',
    category: 'Tech',
    price: 12999,
    rating: 4.9,
    reviews: 445,
    badge: 'Top Rated',
    accent: '#00f5a0',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&q=80',
  },
]

const CATEGORIES = ['All', 'Apparel', 'Footwear', 'Accessories', 'Bags', 'Tech']

const fmt = (n: number) =>
  '₹' + n.toLocaleString('en-IN')

export default function DemoStorePage() {
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([])
  const [liked, setLiked] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [cartOpen, setCartOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const showNotif = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2200)
  }

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id)
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { id: product.id, qty: 1 }]
    })
    showNotif(`${product.name} added to cart`)
  }

  const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.id !== id))
  const updateQty = (id: number, delta: number) => setCart(prev =>
    prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c)
  )
  const toggleLike = (id: number) => setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const cartTotal = cart.reduce((sum, c) => {
    const p = PRODUCTS.find(p => p.id === c.id)!
    return sum + p.price * c.qty
  }, 0)
  const cartCount = cart.reduce((s, c) => s + c.qty, 0)

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="store-root">
      {notification && <div className="toast-notif">{notification}</div>}

      {/* ── Header ── */}
      <header className="store-header">
        <Link href="/" className="back-btn">
          <ArrowLeft size={14} />
          Back
        </Link>

        <div className="store-logo">
          <svg className="logo-mark" viewBox="0 0 36 36" width="36" height="36">
            <polygon points="18,3 33,12 33,24 18,33 3,24 3,12" fill="none" stroke="#00f5a0" strokeWidth="2" />
            <polygon points="18,9 27,14.5 27,21.5 18,27 9,21.5 9,14.5" fill="#00f5a0" opacity="0.15" stroke="none" />
            <line x1="18" y1="3" x2="18" y2="33" stroke="#00f5a0" strokeWidth="1" opacity="0.4" />
            <line x1="3" y1="12" x2="33" y2="24" stroke="#00f5a0" strokeWidth="1" opacity="0.4" />
            <line x1="33" y1="12" x2="3" y2="24" stroke="#00f5a0" strokeWidth="1" opacity="0.4" />
            <circle cx="18" cy="18" r="3" fill="#00f5a0" />
          </svg>
          <div className="logo-text">
            <span className="logo-name">NOVA</span>
            <span className="logo-sub">STUDIO</span>
          </div>
          <span className="demo-chip">DEMO</span>
        </div>

        <div className="header-right">
          <div className="search-wrap">
            <Search size={13} className="search-icon" />
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="store-hero">
        <div className="hero-grid-bg" />
        <div className="hero-content">
          <p className="hero-overline">New Season Collection</p>
          <h1 className="hero-headline">
            Wear the<br />
            <span className="hero-accent">Future.</span>
          </h1>
          <p className="hero-sub">
            Premium streetwear engineered for the next generation.<br />
            Free shipping on orders above ₹5,000.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Shop Collection</button>
            <button className="btn-ghost">View Lookbook</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-n">12K+</span><span className="stat-l">Customers</span></div>
            <div className="stat-div" />
            <div className="stat"><span className="stat-n">4.9</span><span className="stat-l">Avg Rating</span></div>
            <div className="stat-div" />
            <div className="stat"><span className="stat-n">48h</span><span className="stat-l">Delivery</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-ring" />
          <div className="hero-card hc-main">
            <div className="hc-img">
              <img
                src={PRODUCTS[1].image}
                alt={PRODUCTS[1].name}
                className="hc-photo"
                onError={() => setImgErrors(e => ({ ...e, [PRODUCTS[1].id]: true }))}
              />
            </div>
            <div className="hc-body">
              <span className="hc-tag">New Drop</span>
              <div className="hc-name">{PRODUCTS[1].name}</div>
              <div className="hc-price">{fmt(PRODUCTS[1].price)}</div>
            </div>
          </div>
          <div className="hero-card hc-secondary">
            <div className="hc-img">
              <img
                src={PRODUCTS[7].image}
                alt={PRODUCTS[7].name}
                className="hc-photo"
                onError={() => setImgErrors(e => ({ ...e, [PRODUCTS[7].id]: true }))}
              />
            </div>
            <div className="hc-body">
              <span className="hc-tag">Top Rated</span>
              <div className="hc-name">{PRODUCTS[7].name}</div>
              <div className="hc-price">{fmt(PRODUCTS[7].price)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <div className="cat-bar">
        <div className="cat-row">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-tab${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>
        <span className="products-count">{filtered.length} products</span>
      </div>

      {/* ── Product Grid ── */}
      <main className="products-area">
        <div className="product-grid">
          {filtered.map(product => (
            <div key={product.id} className="product-card">
              {product.badge && <span className="p-badge">{product.badge}</span>}
              <button
                className={`like-btn${liked.includes(product.id) ? ' liked' : ''}`}
                onClick={() => toggleLike(product.id)}
              >
                <Heart size={14} fill={liked.includes(product.id) ? 'currentColor' : 'none'} />
              </button>

              <div className="p-image">
                {!imgErrors[product.id] ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="p-photo"
                    onError={() => setImgErrors(e => ({ ...e, [product.id]: true }))}
                  />
                ) : (
                  <div className="p-fallback">
                    <span className="p-fallback-letter">{product.name[0]}</span>
                  </div>
                )}
                <div className="p-overlay" />
              </div>

              <div className="p-info">
                <div className="p-category">{product.category}</div>
                <div className="p-name">{product.name}</div>
                <div className="p-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill={i < Math.floor(product.rating) ? '#00f5a0' : 'none'} stroke="#00f5a0" />
                  ))}
                  <span className="p-reviews">{product.reviews} reviews</span>
                </div>
                <div className="p-footer">
                  <span className="p-price">{fmt(product.price)}</span>
                  <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Search size={32} strokeWidth={1} />
            <p>No products found for &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </main>

      {/* ── Trust Bar ── */}
      <div className="trust-bar">
        {[
          { icon: <Truck size={16} />, label: 'Free Shipping ₹5,000+' },
          { icon: <Shield size={16} />, label: 'Secure Checkout' },
          { icon: <Zap size={16} />, label: '48h Fast Delivery' },
        ].map(({ icon, label }) => (
          <div key={label} className="trust-item">
            {icon}<span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Cart <span className="cart-count-label">({cartCount})</span></h2>
              <button className="drawer-close" onClick={() => setCartOpen(false)}><X size={18} /></button>
            </div>
            <div className="cart-items">
              {cart.length === 0 && (
                <div className="cart-empty">
                  <ShoppingCart size={36} strokeWidth={1} />
                  <p>Your cart is empty</p>
                </div>
              )}
              {cart.map(c => {
                const p = PRODUCTS.find(pr => pr.id === c.id)!
                return (
                  <div key={c.id} className="cart-item">
                    <div className="ci-img">
                      {!imgErrors[p.id] ? (
                        <img src={p.image} alt={p.name} className="ci-photo" />
                      ) : (
                        <div className="ci-fallback">{p.name[0]}</div>
                      )}
                    </div>
                    <div className="ci-info">
                      <div className="ci-name">{p.name}</div>
                      <div className="ci-cat">{p.category}</div>
                      <div className="ci-price">{fmt(p.price)}</div>
                    </div>
                    <div className="ci-right">
                      <div className="ci-qty">
                        <button onClick={() => updateQty(c.id, -1)}><Minus size={11} /></button>
                        <span>{c.qty}</span>
                        <button onClick={() => updateQty(c.id, 1)}><Plus size={11} /></button>
                      </div>
                      <button className="ci-remove" onClick={() => removeFromCart(c.id)}><X size={13} /></button>
                    </div>
                  </div>
                )
              })}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span><span>{fmt(cartTotal)}</span>
                </div>
                <div className="cart-note">Shipping calculated at checkout</div>
                <button
                  className="checkout-btn"
                  onClick={() => { showNotif('This is a demo — checkout disabled'); setCartOpen(false) }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; border: none; background: none; }
        a { text-decoration: none; color: inherit; }

        .store-root {
          min-height: 100vh;
          background: #080a08;
          color: #e8f5e9;
          font-family: 'DM Sans', sans-serif;
        }

        /* Toast */
        .toast-notif {
          position: fixed;
          top: 76px;
          left: 50%;
          transform: translateX(-50%);
          background: #0d140d;
          border: 1px solid rgba(0,245,160,0.3);
          color: #00f5a0;
          padding: 10px 22px;
          border-radius: 4px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.04em;
          z-index: 9999;
          animation: fadeSlide 2.2s ease forwards;
          white-space: nowrap;
        }
        @keyframes fadeSlide {
          0%   { opacity:0; transform:translateX(-50%) translateY(-6px); }
          12%  { opacity:1; transform:translateX(-50%) translateY(0); }
          80%  { opacity:1; }
          100% { opacity:0; }
        }

        /* Header */
        .store-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 62px;
          background: rgba(8,10,8,0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,245,160,0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: #3a4a3a;
          letter-spacing: 0.02em;
          transition: color 0.15s;
        }
        .back-btn:hover { color: #00f5a0; }

        .store-logo { display: flex; align-items: center; gap: 10px; }
        .logo-mark { flex-shrink: 0; }
        .logo-text { display: flex; flex-direction: column; line-height: 1; gap: 1px; }
        .logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: 0.12em;
          color: #ffffff;
        }
        .logo-sub {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.22em;
          color: #00f5a0;
          opacity: 0.7;
        }
        .demo-chip {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(0,245,160,0.5);
          border: 1px solid rgba(0,245,160,0.2);
          padding: 2px 8px;
          border-radius: 2px;
        }

        .header-right { display: flex; align-items: center; gap: 10px; }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 10px; color: #2a3a2a; }
        .search-input {
          background: rgba(0,245,160,0.04);
          border: 1px solid rgba(0,245,160,0.1);
          border-radius: 4px;
          padding: 8px 12px 8px 30px;
          color: #e8f5e9;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          width: 200px;
          transition: border-color 0.15s;
        }
        .search-input:focus { border-color: rgba(0,245,160,0.4); }
        .search-input::placeholder { color: #2a3a2a; }
        .cart-btn {
          position: relative;
          padding: 8px 10px;
          border-radius: 4px;
          color: #4a5a4a;
          border: 1px solid rgba(0,245,160,0.1);
          transition: all 0.15s;
        }
        .cart-btn:hover { color: #00f5a0; border-color: rgba(0,245,160,0.4); }
        .cart-badge {
          position: absolute;
          top: -5px; right: -5px;
          background: #00f5a0;
          color: #080a08;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          width: 17px; height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Hero */
        .store-hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 72px 40px;
          overflow: hidden;
          border-bottom: 1px solid rgba(0,245,160,0.07);
        }
        .hero-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,245,160,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,160,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
        }
        .hero-content { position: relative; max-width: 520px; z-index: 2; }
        .hero-overline {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: #00f5a0;
          opacity: 0.7;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-size: 72px;
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          color: #ffffff;
        }
        .hero-accent { color: #00f5a0; }
        .hero-sub {
          font-size: 15px;
          line-height: 1.7;
          color: #3a5a3a;
          margin-bottom: 36px;
        }
        .hero-actions { display: flex; gap: 12px; margin-bottom: 48px; }
        .btn-primary {
          background: #00f5a0;
          color: #080a08;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 13px 26px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .btn-primary:hover { background: #00e094; transform: translateY(-1px); }
        .btn-ghost {
          background: transparent;
          color: #4a6a4a;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 13px 26px;
          border-radius: 4px;
          border: 1px solid rgba(0,245,160,0.15);
          transition: all 0.2s;
        }
        .btn-ghost:hover { color: #00f5a0; border-color: rgba(0,245,160,0.4); }
        .hero-stats { display: flex; align-items: center; gap: 24px; }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-n { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #ffffff; }
        .stat-l { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.08em; color: #3a5a3a; }
        .stat-div { width: 1px; height: 32px; background: rgba(0,245,160,0.12); }

        .hero-visual {
          position: relative;
          width: 340px;
          height: 240px;
          flex-shrink: 0;
          z-index: 2;
        }
        .hero-ring {
          position: absolute;
          top: 50%; left: 50%;
          width: 280px; height: 280px;
          border: 1px solid rgba(0,245,160,0.06);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .hero-card {
          position: absolute;
          background: rgba(0,245,160,0.04);
          border: 1px solid rgba(0,245,160,0.12);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          backdrop-filter: blur(8px);
        }
        .hc-main { top: 20px; left: 0; animation: hFloat 3.5s ease-in-out infinite; }
        .hc-secondary { bottom: 20px; right: 0; animation: hFloat 3.5s ease-in-out 1.75s infinite; }
        @keyframes hFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .hc-img { width: 52px; height: 52px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
        .hc-photo { width: 100%; height: 100%; object-fit: cover; }
        .hc-tag {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #00f5a0;
          opacity: 0.6;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }
        .hc-name { font-size: 13px; font-weight: 600; color: #d0e8d0; margin-bottom: 4px; }
        .hc-price { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #00f5a0; }

        /* Category Bar */
        .cat-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          border-bottom: 1px solid rgba(0,245,160,0.06);
          gap: 16px;
        }
        .cat-row { display: flex; gap: 4px; overflow-x: auto; }
        .cat-tab {
          padding: 7px 16px;
          border-radius: 3px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: #3a5a3a;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .cat-tab:hover { color: #e8f5e9; background: rgba(0,245,160,0.06); }
        .cat-tab.active { color: #00f5a0; background: rgba(0,245,160,0.1); }
        .products-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: #2a3a2a;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Products */
        .products-area { padding: 32px 40px; }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 16px;
        }
        .product-card {
          position: relative;
          background: rgba(0,245,160,0.02);
          border: 1px solid rgba(0,245,160,0.07);
          border-radius: 6px;
          overflow: hidden;
          transition: all 0.22s;
        }
        .product-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0,245,160,0.25);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,245,160,0.08) inset;
        }
        .p-badge {
          position: absolute;
          top: 10px; left: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #080a08;
          background: #00f5a0;
          padding: 3px 8px;
          border-radius: 2px;
          z-index: 2;
          text-transform: uppercase;
        }
        .like-btn {
          position: absolute;
          top: 10px; right: 10px;
          color: #1a2a1a;
          z-index: 2;
          padding: 6px;
          border-radius: 3px;
          transition: color 0.15s;
          background: rgba(8,10,8,0.6);
          backdrop-filter: blur(4px);
        }
        .like-btn:hover, .like-btn.liked { color: #ff6b8a; }

        /* Product Image */
        .p-image {
          position: relative;
          height: 220px;
          overflow: hidden;
          border-bottom: 1px solid rgba(0,245,160,0.06);
        }
        .p-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .product-card:hover .p-photo { transform: scale(1.05); }
        .p-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(8,10,8,0.5) 100%
          );
          pointer-events: none;
        }
        .p-fallback {
          width: 100%;
          height: 100%;
          background: rgba(0,245,160,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-fallback-letter {
          font-family: 'Syne', sans-serif;
          font-size: 64px;
          font-weight: 800;
          color: rgba(0,245,160,0.15);
        }

        .p-info { padding: 16px; }
        .p-category {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          color: #2a4a2a;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .p-name {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #d0e8d0;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .p-rating { display: flex; align-items: center; gap: 2px; margin-bottom: 14px; }
        .p-reviews { font-family: 'DM Mono', monospace; font-size: 10px; color: #2a4a2a; margin-left: 6px; }
        .p-footer { display: flex; align-items: center; justify-content: space-between; }
        .p-price {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
        }
        .add-btn {
          background: rgba(0,245,160,0.1);
          color: #00f5a0;
          border: 1px solid rgba(0,245,160,0.25);
          padding: 7px 14px;
          border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.15s;
        }
        .add-btn:hover { background: rgba(0,245,160,0.2); border-color: rgba(0,245,160,0.5); }

        .empty-state {
          text-align: center;
          padding: 80px 0;
          color: #2a4a2a;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.04em;
        }

        /* Trust Bar */
        .trust-bar {
          display: flex;
          justify-content: center;
          gap: 0;
          border-top: 1px solid rgba(0,245,160,0.06);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px 48px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: #2a4a2a;
          border-right: 1px solid rgba(0,245,160,0.06);
          transition: color 0.15s;
        }
        .trust-item:last-child { border-right: none; }
        .trust-item:hover { color: #00f5a0; }
        .trust-item svg { color: #00f5a0; opacity: 0.5; flex-shrink: 0; }
        .trust-item:hover svg { opacity: 1; }

        /* Cart Drawer */
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          z-index: 200;
        }
        .cart-drawer {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 380px;
          background: #0a0d0a;
          border-left: 1px solid rgba(0,245,160,0.1);
          display: flex;
          flex-direction: column;
          animation: drawerIn 0.22s ease;
        }
        @keyframes drawerIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(0,245,160,0.08);
        }
        .cart-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #ffffff;
        }
        .cart-count-label { color: #3a5a3a; font-weight: 400; }
        .drawer-close { color: #2a4a2a; padding: 4px; transition: color 0.15s; }
        .drawer-close:hover { color: #00f5a0; }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          height: 100%;
          color: #2a4a2a;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
        }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0,245,160,0.03);
          border: 1px solid rgba(0,245,160,0.08);
          border-radius: 6px;
          padding: 10px 12px;
        }
        .ci-img {
          width: 48px; height: 48px;
          border-radius: 5px;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(0,245,160,0.06);
        }
        .ci-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ci-fallback {
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: rgba(0,245,160,0.2);
        }
        .ci-info { flex: 1; min-width: 0; }
        .ci-name { font-size: 13px; font-weight: 500; color: #c0d8c0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ci-cat {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #2a4a2a;
          text-transform: uppercase;
          margin: 2px 0;
        }
        .ci-price { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #00f5a0; }
        .ci-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
        .ci-qty { display: flex; align-items: center; gap: 8px; font-size: 13px; font-family: 'DM Mono', monospace; }
        .ci-qty button {
          width: 22px; height: 22px;
          border-radius: 3px;
          background: rgba(0,245,160,0.08);
          color: #3a5a3a;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.12s;
        }
        .ci-qty button:hover { background: rgba(0,245,160,0.18); color: #00f5a0; }
        .ci-remove { color: #1a3a1a; transition: color 0.15s; }
        .ci-remove:hover { color: #ff6b8a; }
        .cart-footer {
          padding: 20px 24px;
          border-top: 1px solid rgba(0,245,160,0.08);
        }
        .cart-subtotal {
          display: flex;
          justify-content: space-between;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 6px;
        }
        .cart-note {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          color: #2a4a2a;
          margin-bottom: 16px;
        }
        .checkout-btn {
          width: 100%;
          background: #00f5a0;
          color: #080a08;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 14px;
          border-radius: 4px;
          transition: all 0.18s;
        }
        .checkout-btn:hover { background: #00e094; transform: translateY(-1px); }

        /* Responsive */
        @media (max-width: 768px) {
          .store-header { padding: 0 16px; }
          .store-hero { flex-direction: column; padding: 40px 16px; gap: 40px; }
          .hero-headline { font-size: 48px; }
          .hero-visual { width: 100%; height: 180px; }
          .cat-bar, .products-area { padding: 16px; }
          .trust-bar { flex-direction: column; }
          .trust-item { border-right: none; border-bottom: 1px solid rgba(0,245,160,0.06); justify-content: center; }
          .cart-drawer { width: 100%; }
        }
      `}</style>
    </div>
  )
}