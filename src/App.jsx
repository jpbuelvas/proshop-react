import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Catalog from './components/Catalog';
import ProductPage from './components/ProductPage';
import Cart from './components/Cart';
import Footer from './components/Footer';
import { PRODUCTS, CAT, COLORS, DESC, EDIT_TITLES, EDIT_SUBS, EDIT_LINKS, fmt, findProduct, THEME } from './data/products';

const FREE_SHIP_FROM = 150000;
const COUNTDOWN_DATE = '2026-07-26';

function App() {
  const [state, setState] = useState({
    screen: 'home',
    cat: 'todos',
    pid: 1,
    qty: 1,
    size: 'M',
    color: 0,
    cart: [],
    favs: [],
    query: '',
    toast: null,
    editTab: 'ropa',
    gender: 'todos',
  });

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const flash = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1900);
  }, []);

  const go = useCallback((screen, extra = {}) => {
    setState((s) => ({ ...s, ...extra, screen }));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const toCatalog = useCallback((cat) => {
    go('catalog', { cat: cat || 'todos', query: '', gender: 'todos' });
  }, [go]);

  const openProduct = useCallback((id) => {
    const p = findProduct(id);
    setState((s) => ({
      ...s,
      screen: 'product',
      pid: id,
      qty: 1,
      size: p.sizes ? p.sizes[Math.min(2, p.sizes.length - 1)] : null,
      color: 0,
    }));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const addToCart = useCallback((id, qty, size, color) => {
    qty = qty || 1;
    setState((s) => {
      const cart = [...s.cart];
      const k = `${id}|${size || ''}|${color || 0}`;
      const i = cart.findIndex((c) => `${c.id}|${c.size || ''}|${c.color}` === k);
      if (i >= 0) {
        cart[i] = { ...cart[i], qty: cart[i].qty + qty };
      } else {
        cart.push({ id, qty, size: size || null, color: color || 0 });
      }
      return { ...s, cart };
    });
    flash('AGREGADO AL CARRITO');
  }, [flash]);

  const setQty = useCallback((idx, delta) => {
    setState((s) => {
      const cart = [...s.cart];
      cart[idx] = { ...cart[idx], qty: Math.max(1, cart[idx].qty + delta) };
      return { ...s, cart };
    });
  }, []);

  const removeItem = useCallback((idx) => {
    setState((s) => ({ ...s, cart: s.cart.filter((_, i) => i !== idx) }));
  }, []);

  const toggleFav = useCallback((id) => {
    setState((s) => ({ ...s, favs: s.favs.includes(id) ? s.favs.filter((x) => x !== id) : s.favs.concat(id) }));
  }, []);

  const checkout = useCallback(() => {
    setState((s) => ({ ...s, cart: [] }));
    go('home');
    flash('¡PEDIDO REALIZADO! GRACIAS');
  }, [go, flash]);

  const vm = useCallback((p) => {
    const sale = !!p.old && p.old > p.price;
    const disc = sale ? Math.round((1 - p.price / p.old) * 100) : 0;
    const fav = state.favs.includes(p.id);
    return {
      id: p.id,
      name: p.name,
      tile: CAT[p.cat],
      catLabel: CAT[p.cat],
      img: p.img || '',
      noImg: !p.img,
      price: fmt(p.price),
      old: sale ? fmt(p.old) : '',
      onSale: sale,
      discText: `-${disc}%`,
      rating: p.rating.toFixed(1),
      reviews: p.reviews,
      fav,
      favIcon: fav ? '♥' : '♡',
      onView: () => openProduct(p.id),
      onAdd: () => addToCart(p.id, 1, p.sizes ? p.sizes[Math.min(2, p.sizes.length - 1)] : null, 0),
      onFav: () => toggleFav(p.id),
    };
  }, [state.favs, openProduct, addToCart, toggleFav]);

  const cartCount = useMemo(() => state.cart.reduce((a, c) => a + c.qty, 0), [state.cart]);

  const subtotalNum = useMemo(() => state.cart.reduce((a, c) => a + findProduct(c.id).price * c.qty, 0), [state.cart]);
  const savingsNum = useMemo(
    () => state.cart.reduce((a, c) => {
      const p = findProduct(c.id);
      return a + (p.old && p.old > p.price ? (p.old - p.price) * c.qty : 0);
    }, 0),
    [state.cart]
  );
  const shippingNum = subtotalNum === 0 ? 0 : subtotalNum >= FREE_SHIP_FROM ? 0 : 12900;

  const cartSummary = useMemo(() => {
    const items = state.cart.map((c, idx) => {
      const p = findProduct(c.id);
      const colorHex = (COLORS[p.cat] || ['#111'])[c.color] || '#111';
      const variant = c.size ? `Talla ${c.size}` : '';
      return {
        name: p.name,
        img: p.img || '',
        noImg: !p.img,
        variant,
        hasVariant: !!variant,
        colorHex,
        price: fmt(p.price),
        qty: c.qty,
        onInc: () => setQty(idx, 1),
        onDec: () => setQty(idx, -1),
        onRemove: () => removeItem(idx),
      };
    });
    return {
      empty: state.cart.length === 0,
      hasItems: state.cart.length > 0,
      items,
      subtotal: fmt(subtotalNum),
      savings: fmt(savingsNum),
      hasSavings: savingsNum > 0,
      shipping: shippingNum === 0 ? 'Gratis' : fmt(shippingNum),
      total: fmt(subtotalNum + shippingNum),
      freeProg: Math.min(100, Math.round((subtotalNum / FREE_SHIP_FROM) * 100)),
      freeRemaining: fmt(Math.max(0, FREE_SHIP_FROM - subtotalNum)),
      hasRemaining: FREE_SHIP_FROM - subtotalNum > 0 && subtotalNum > 0,
      reached: subtotalNum >= FREE_SHIP_FROM && subtotalNum > 0,
      onCheckout: checkout,
      onShop: () => toCatalog('todos'),
    };
  }, [state.cart, subtotalNum, savingsNum, shippingNum, setQty, removeItem, checkout, toCatalog]);

  const product = useMemo(() => {
    const cp = findProduct(state.pid);
    const sizes = (cp.sizes || []).map((sz) => ({
      label: sz,
      active: state.size === sz,
      onClick: () => setState((s) => ({ ...s, size: sz })),
    }));
    const colors = (COLORS[cp.cat] || []).map((hex, i) => ({
      hex,
      active: state.color === i,
      onClick: () => setState((s) => ({ ...s, color: i })),
    }));
    const related = PRODUCTS.filter((p) => p.cat === cp.cat && p.id !== cp.id).slice(0, 4).map((p) => vm(p));
    return {
      ...vm(cp),
      hasSizes: !!cp.sizes,
      sizes,
      colors,
      desc: DESC[cp.cat],
      qty: state.qty,
      onInc: () => setState((s) => ({ ...s, qty: s.qty + 1 })),
      onDec: () => setState((s) => ({ ...s, qty: Math.max(1, s.qty - 1) })),
      onAdd: () => addToCart(cp.id, state.qty, cp.sizes ? state.size : null, state.color),
      onHome: () => go('home'),
      onCat: () => toCatalog(cp.cat),
      related,
    };
  }, [state.pid, state.size, state.color, state.qty, vm, addToCart, toCatalog, go]);

  const catalog = useMemo(() => {
    const q = (state.query || '').trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      const catOk = state.cat === 'todos' || p.cat === state.cat;
      const genOk = state.gender === 'todos' || (p.gender || ['U']).includes(state.gender);
      const qOk = !q || p.name.toLowerCase().includes(q);
      return catOk && genOk && qOk;
    });
    const catalogItems = filtered.map((p) => vm(p));
    const chipDef = [['todos', 'TODOS'], ['ropa', 'ROPA'], ['audio', 'AUDIO'], ['termos', 'TERMOS'], ['acc', 'ACCESORIOS']];
    const chips = chipDef.map(([cat, label]) => ({
      label,
      active: state.cat === cat,
      onClick: () => setState((s) => ({ ...s, cat })),
    }));
    const genderChips = [
      { label: 'TODOS', value: 'todos' },
      { label: 'HOMBRE', value: 'M' },
      { label: 'MUJER', value: 'W' },
      { label: 'UNISEX', value: 'U' },
    ].map((g) => ({
      label: g.label,
      active: state.gender === g.value,
      onClick: () => setState((s) => ({ ...s, gender: g.value })),
    }));
    const catLabel = state.cat === 'todos' ? 'TODOS LOS PRODUCTOS' : (CAT[state.cat] || '').toUpperCase();
    return {
      title: catLabel,
      catLabel: state.cat === 'todos' ? 'TODOS' : (CAT[state.cat] || '').toUpperCase(),
      count: catalogItems.length,
      chips,
      genderChips,
      items: catalogItems,
      hasItems: catalogItems.length > 0,
      empty: catalogItems.length === 0,
    };
  }, [state.cat, state.gender, state.query, vm]);

  const homeData = useMemo(() => {
    const sp = findProduct(8);
    const spSale = sp.old && sp.old > sp.price;
    const spotlight = {
      price: fmt(sp.price),
      old: spSale ? fmt(sp.old) : '',
      disc: spSale ? `-${Math.round((1 - sp.price / sp.old) * 100)}%` : '',
      onView: () => openProduct(8),
    };
    const trust = [
      { icon: '→', title: 'Envío gratis', sub: `En pedidos desde ${fmt(FREE_SHIP_FROM)}` },
      { icon: '↺', title: '30 días', sub: 'Cambios y devoluciones' },
      { icon: '✓', title: 'Pago seguro', sub: 'Cifrado en cada transacción' },
      { icon: '★', title: '+12.000 clientes', sub: 'Califican 4.8 / 5.0' },
    ];
    const offerItems = PRODUCTS.filter((p) => p.old && p.old > p.price).slice(0, 8).map((p) => vm(p));
    const bestItems = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8).map((p) => vm(p));
    const editTabDef = [
      { label: 'ROPA', cat: 'ropa' },
      { label: 'AUDIO', cat: 'audio' },
      { label: 'TERMOS', cat: 'termos' },
      { label: 'ACCESORIOS', cat: 'acc' },
    ];
    const editTabs = editTabDef.map((et) => ({
      label: et.label,
      active: state.editTab === et.cat,
      onClick: () => setState((s) => ({ ...s, editTab: et.cat })),
    }));
    const editItems = PRODUCTS.filter((p) => p.cat === state.editTab).map((p) => vm(p));
    return {
      spotlight,
      trust,
      offerItems,
      bestItems,
      editTabs,
      editItems,
      editCampaignTitle: EDIT_TITLES[state.editTab] || 'EQUÍPATE PARA RENDIR',
      editCampaignSub: EDIT_SUBS[state.editTab] || 'COLECCIÓN 2026',
      editCampaignLink: EDIT_LINKS[state.editTab] || 'VER COLECCIÓN →',
      onEditAll: () => toCatalog(state.editTab),
      onOffersAll: () => toCatalog('todos'),
      onBestAll: () => toCatalog('todos'),
      onHeroCta: () => toCatalog('todos'),
      onHeroCta2: () => toCatalog('todos'),
      onCampaignShop: () => toCatalog('ropa'),
      countdownDate: COUNTDOWN_DATE,
    };
  }, [state.editTab, vm, openProduct, toCatalog]);

  const nav = useMemo(() => {
    const navDef = [
      { label: 'ROPA', cat: 'ropa' },
      { label: 'AUDIO', cat: 'audio' },
      { label: 'TERMOS', cat: 'termos' },
      { label: 'ACCESORIOS', cat: 'acc' },
      { label: 'OUTLET', cat: 'todos', outlet: true },
    ];
    return navDef.map((n) => {
      const active = (state.screen === 'catalog' && state.cat === n.cat && !n.outlet) || (n.outlet && state.screen === 'catalog' && state.cat === 'todos');
      return {
        label: n.label,
        active,
        onClick: () => toCatalog(n.cat),
      };
    });
  }, [state.screen, state.cat, toCatalog]);

  const onSearch = useCallback((value) => {
    setState((s) => ({ ...s, query: value, screen: value && s.screen === 'home' ? 'catalog' : s.screen }));
  }, []);

  const onSearchKey = useCallback((e) => {
    if (e.key === 'Enter') {
      setState((s) => ({ ...s, screen: 'catalog' }));
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Hanken Grotesk', sans-serif", color: '#111', background: '#fff' }}>
      <Header
        nav={nav}
        query={state.query}
        onSearch={onSearch}
        onSearchKey={onSearchKey}
        onLogo={() => go('home')}
        onCart={() => go('cart')}
        onSidebar={() => toCatalog('todos')}
        cartCount={cartCount}
        hasCart={cartCount > 0}
      />
      <main style={{ flex: 1 }}>
        {state.screen === 'home' && <Home data={homeData} />}
        {state.screen === 'catalog' && <Catalog data={catalog} onHome={() => go('home')} />}
        {state.screen === 'product' && <ProductPage data={product} />}
        {state.screen === 'cart' && <Cart data={cartSummary} />}
      </main>
      <Footer onLogo={() => go('home')} />
      {toast && (
        <div
          className="toast-animate"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 28,
            transform: 'translateX(-50%)',
            background: '#111',
            color: '#fff',
            padding: '13px 26px',
            fontWeight: 700,
            fontSize: 13.5,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
            zIndex: 60,
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
