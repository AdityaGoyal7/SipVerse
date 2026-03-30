import { useState, useEffect } from 'react'
import abi from "./contractJson/chai.json"
import { ethers } from "ethers"
import Memos from './components/Memos'
import './App.css'

// ── Beverage catalog ──────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',        emoji: '🍹', label: 'All Drinks' },
  { id: 'tops',       emoji: '🍵', label: 'Tops'       },
  { id: 'coffee',     emoji: '☕', label: 'Coffee'     },
  { id: 'tea',        emoji: '🍃', label: 'Tea'        },
  { id: 'drinks',     emoji: '🧃', label: 'Drinks'     },
  { id: 'cocktails',  emoji: '🍸', label: 'Cocktails'  },
  { id: 'mocktails',  emoji: '🍑', label: 'Mocktails'  },
  { id: 'juice',      emoji: '🍊', label: 'Fruit Juice'},
]

const BEVERAGES = [
  // TOPS
  { id: 1, cat: 'tops', emoji: '🍵', name: 'Masala Chai',      desc: 'Spiced Indian tea with ginger & cardamom',    price: '0.001', badge: 'popular' },
  { id: 2, cat: 'tops', emoji: '🫖', name: 'Kahwa',            desc: 'Kashmiri saffron & almond brew',              price: '0.001', badge: 'popular' },
  { id: 3, cat: 'tops', emoji: '🌿', name: 'Tulsi Kadha',      desc: 'Holy basil herbal immunity tonic',            price: '0.001' },
  { id: 4, cat: 'tops', emoji: '🥛', name: 'Turmeric Latte',   desc: 'Golden milk with haldi & coconut',            price: '0.001', badge: 'new' },
  { id: 5, cat: 'tops', emoji: '🍫', name: 'Hot Cocoa',        desc: 'Rich Belgian chocolate with cream',           price: '0.001' },

  // COFFEE
  { id: 6,  cat: 'coffee', emoji: '☕', name: 'Espresso',       desc: 'Double shot, bold & intense',                price: '0.001', badge: 'popular' },
  { id: 7,  cat: 'coffee', emoji: '🧋', name: 'Cold Brew',      desc: '18-hour slow steeped, silky smooth',         price: '0.001' },
  { id: 8,  cat: 'coffee', emoji: '🍦', name: 'Dalgona Coffee', desc: 'Whipped coffee cloud over iced milk',        price: '0.001', badge: 'popular' },
  { id: 9,  cat: 'coffee', emoji: '🌰', name: 'Hazelnut Latte', desc: 'Creamy latte with toasted hazelnut syrup',   price: '0.001' },
  { id: 10, cat: 'coffee', emoji: '🧊', name: 'Iced Americano', desc: 'Espresso on ice, clean & crisp',             price: '0.001', badge: 'new' },

  // TEA
  { id: 11, cat: 'tea', emoji: '🍃', name: 'Matcha Latte',     desc: 'Ceremonial grade green tea with oat milk',   price: '0.001', badge: 'popular' },
  { id: 12, cat: 'tea', emoji: '🌸', name: 'Rose Oolong',      desc: 'Floral oolong with dried rose petals',       price: '0.001' },
  { id: 13, cat: 'tea', emoji: '🫐', name: 'Berry Hibiscus',   desc: 'Tart hibiscus with blueberry & honey',       price: '0.001', badge: 'new' },
  { id: 14, cat: 'tea', emoji: '🌙', name: 'Moon Milk Tea',    desc: 'Ashwagandha & lavender calming blend',       price: '0.001' },
  { id: 15, cat: 'tea', emoji: '🍋', name: 'Lemon Ginger Tea', desc: 'Zesty citrus with fresh ginger & honey',     price: '0.001' },

  // DRINKS
  { id: 16, cat: 'drinks', emoji: '⚡', name: 'Energy Surge',  desc: 'Natural guarana & ginseng energy drink',     price: '0.001', badge: 'popular' },
  { id: 17, cat: 'drinks', emoji: '🥤', name: 'Cola Classic',  desc: 'Timeless carbonated cola perfection',        price: '0.001' },
  { id: 18, cat: 'drinks', emoji: '🌊', name: 'Ocean Blue',    desc: 'Blue spirulina & coconut water refresher',   price: '0.001', badge: 'new' },
  { id: 19, cat: 'drinks', emoji: '🍋', name: 'Nimbu Paani',   desc: 'Classic Indian lemon soda with chaat masala', price: '0.001', badge: 'popular' },
  { id: 20, cat: 'drinks', emoji: '🧃', name: 'Jaljeera',      desc: 'Cumin & mint digestive cooler',              price: '0.001' },

  // COCKTAILS
  { id: 21, cat: 'cocktails', emoji: '🍸', name: 'Negroni',      desc: 'Gin, vermouth & Campari, stir gently',     price: '0.002', badge: 'popular' },
  { id: 22, cat: 'cocktails', emoji: '🍹', name: 'Mango Mojito', desc: 'Fresh mango, rum, mint & lime',             price: '0.002' },
  { id: 23, cat: 'cocktails', emoji: '🌅', name: 'Tequila Sunrise', desc: 'Tequila, OJ & grenadine layered sunset', price: '0.002', badge: 'new' },
  { id: 24, cat: 'cocktails', emoji: '🫧', name: 'Cosmopolitan', desc: 'Vodka, cranberry, triple sec & lime',       price: '0.002' },
  { id: 25, cat: 'cocktails', emoji: '🥃', name: 'Whisky Sour',  desc: 'Bourbon, lemon juice & egg white foam',    price: '0.002', badge: 'popular' },

  // MOCKTAILS
  { id: 26, cat: 'mocktails', emoji: '🍑', name: 'Peach Fizz',    desc: 'Peach nectar, lime & sparkling water',    price: '0.001', badge: 'popular' },
  { id: 27, cat: 'mocktails', emoji: '🍉', name: 'Watermelon Wave', desc: 'Fresh watermelon with mint & basil',    price: '0.001' },
  { id: 28, cat: 'mocktails', emoji: '🥥', name: 'Tropical Storm', desc: 'Pineapple, coconut cream & mango',       price: '0.001', badge: 'new' },
  { id: 29, cat: 'mocktails', emoji: '🌹', name: 'Rose Lemonade', desc: 'Rose syrup, lemon & ginger beer',         price: '0.001' },
  { id: 30, cat: 'mocktails', emoji: '🍇', name: 'Grape Grenadine', desc: 'Concord grape & pomegranate mocktail',  price: '0.001' },

  // FRUIT JUICE
  { id: 31, cat: 'juice', emoji: '🍊', name: 'Valencia OJ',      desc: 'Cold-pressed Valencia orange, pulpy fresh', price: '0.001', badge: 'popular' },
  { id: 32, cat: 'juice', emoji: '🥭', name: 'Alphonso Mango',   desc: 'Pure Alphonso mango, thick & golden',      price: '0.001', badge: 'popular' },
  { id: 33, cat: 'juice', emoji: '🍍', name: 'Pineapple Press',  desc: 'Cold-pressed pineapple & turmeric',        price: '0.001' },
  { id: 34, cat: 'juice', emoji: '🍏', name: 'Green Detox',      desc: 'Apple, spinach, cucumber & mint press',    price: '0.001', badge: 'new' },
  { id: 35, cat: 'juice', emoji: '🍓', name: 'Berry Blast',      desc: 'Strawberry, raspberry & acai blend',       price: '0.001' },
]

// ── Toast component ───────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null
  const icons = { success: '✅', error: '❌', pending: '⏳' }
  return (
    <div className={`toast ${toast.type}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  )
}

// ── Cart Sidebar ──────────────────────────────────────────────────
function CartSidebar({ cart, onClose, onRemove, state, onSuccess }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [paying, setPaying] = useState(false)

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(4)

  const handlePay = async () => {
    if (!state.contract) {
      onSuccess('error', '⚠️ Please connect MetaMask wallet first!')
      return
    }
    if (!name.trim() || !message.trim()) {
      onSuccess('error', 'Please fill in your name and a message!')
      return
    }
    if (cart.length === 0) {
      onSuccess('error', 'Your cart is empty!')
      return
    }
    setPaying(true)
    try {
      const beverageList = cart.map(b => b.name).join(', ')
      const fullMessage = `[${beverageList}] — ${message}`
      const amount = { value: ethers.utils.parseEther(total) }
      const tx = await state.contract.buyChai(name.trim(), fullMessage, amount)
      onSuccess('pending', '⏳ Transaction submitted! Waiting for confirmation...')
      await tx.wait()
      onSuccess('success', `🎉 Payment of ${total} ETH confirmed! Enjoy your beverages, ${name}!`)
      onClose()
    } catch (err) {
      console.error(err)
      onSuccess('error', err?.reason || err?.message || 'Transaction failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2 className="cart-title">🛒 Your Cart</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🫗</div>
            <div className="cart-empty-text">Your cart is empty.<br />Add some beverages!</div>
          </div>
        ) : (
          <div className="cart-items">
            {cart.map((item, i) => (
              <div key={i} className="cart-item">
                <span className="cart-item-emoji">{item.emoji}</span>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{item.price} ETH</div>
                </div>
                <button className="cart-item-remove" onClick={() => onRemove(i)}>🗑</button>
              </div>
            ))}
          </div>
        )}

        <div className="cart-footer">
          <div className="cart-total">
            <span className="cart-total-label">Total ({cart.length} items)</span>
            <span className="cart-total-amount">{total} ETH</span>
          </div>

          <div className="checkout-section">
            <span className="checkout-label">⛓ Blockchain Checkout</span>
            <div className="input-group">
              <input
                className="form-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                className="form-input"
                type="text"
                placeholder="Leave a feedback message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
          </div>

          <button
            className="pay-btn"
            onClick={handlePay}
            disabled={paying || cart.length === 0 || !state.contract}
          >
            {paying ? (
              <><div className="spinner" /> Processing on-chain...</>
            ) : (
              <>⚡ Pay {total} ETH via MetaMask</>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Beverage Card ─────────────────────────────────────────────────
function BevCard({ bev, inCart, onToggle }) {
  return (
    <div className={`bev-card ${inCart ? 'in-cart' : ''}`} onClick={() => onToggle(bev)}>
      {bev.badge && (
        <span className={`bev-badge badge-${bev.badge}`}>
          {bev.badge === 'popular' ? '🔥 Popular' : '✨ New'}
        </span>
      )}
      <span className="bev-card-emoji">{bev.emoji}</span>
      <div className="bev-card-body">
        <div className="bev-card-name">{bev.name}</div>
        <div className="bev-card-desc">{bev.desc}</div>
        <div className="bev-card-footer">
          <span className="bev-price">{bev.price} ETH</span>
          <button className={`bev-add-btn ${inCart ? 'added' : ''}`}>
            {inCart ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────
function App() {
  const [state, setState] = useState({ provider: null, signer: null, contract: null })
  const [account, setAccount] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    if (type !== 'pending') setTimeout(() => setToast(null), 5000)
  }

  useEffect(() => {
    const init = async () => {
      const CONTRACT_ADDRESS = "0x093625eEa28fbd75dfA69b7632FcC461B8C7d25c"
      const CONTRACT_ABI = abi.abi
      try {
        const { ethereum } = window
        if (!ethereum) return
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        window.ethereum.on('accountsChanged', () => window.location.reload())
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        setState({ provider, signer, contract })
      } catch (err) {
        console.error(err)
        showToast('error', 'Could not connect wallet. Make sure MetaMask is installed.')
      }
    }
    init()
  }, [])

  const filteredBevs = activeCategory === 'all'
    ? BEVERAGES
    : BEVERAGES.filter(b => b.cat === activeCategory)

  const toggleCart = (bev) => {
    setCart(prev => {
      const idx = prev.findIndex(b => b.id === bev.id)
      if (idx >= 0) {
        return prev.filter((_, i) => i !== idx)
      }
      return [...prev, bev]
    })
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const isInCart = (bev) => cart.some(b => b.id === bev.id)

  const shortAddr = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : 'Not connected'

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">🍹</span>
          <div>
            <span className="navbar-name">SipVerse</span>
            <span className="navbar-tagline">Blockchain Beverage Hub</span>
          </div>
        </div>
        <div className="navbar-right">
          <div className="wallet-badge">
            <div className={`wallet-dot ${account ? '' : 'disconnected'}`} />
            <span className="wallet-addr">{shortAddr}</span>
          </div>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Cart
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <span className="hero-eyebrow">⛓ Powered by Ethereum Blockchain</span>
        <h1 className="hero-title">
          Sip the <span>Future</span>
        </h1>
        <p className="hero-subtitle">
          Discover 35+ premium beverages. Pay with ETH, leave your mark on the blockchain. Every sip, immortalized on-chain.
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-value">35+</div>
            <div className="stat-label">Beverages</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">7</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0.001</div>
            <div className="stat-label">ETH / Drink</div>
          </div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <div className="category-section">
        <div className="category-label">Browse By Category</div>
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-tab-emoji">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* BEVERAGES GRID */}
      <section className="beverages-section">
        <div className="section-header">
          <h2 className="section-title">
            {CATEGORIES.find(c => c.id === activeCategory)?.emoji}{' '}
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </h2>
          <span className="section-count">{filteredBevs.length} beverages</span>
        </div>
        <div className="beverages-grid">
          {filteredBevs.map((bev, i) => (
            <div key={bev.id} style={{ animationDelay: `${i * 0.04}s` }}>
              <BevCard bev={bev} inCart={isInCart(bev)} onToggle={toggleCart} />
            </div>
          ))}
        </div>
      </section>

      {/* FEEDBACK / MEMOS */}
      <Memos state={state} />

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <span className="footer-brand">SipVerse</span> — Decentralized Beverage Experience
        </div>
        <div className="footer-eth">
          ⟠ Ethereum · Built with React  +  Solidity
        </div>
      </footer>

      {/* CART SIDEBAR */}
      {cartOpen && (
        <CartSidebar
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          state={state}
          onSuccess={(type, msg) => {
            showToast(type, msg)
            if (type === 'success') {
              setCart([])
            }
          }}
        />
      )}

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  )
}

export default App
