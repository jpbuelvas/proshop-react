import { THEME } from '../data/products';
import { useAuthStore } from '../stores/authStore';

export default function Header({
  nav, query, onSearch, onSearchKey,
  onLogo, onCart, onOrders, onSidebar,
  cartCount, hasCart,
  onLogin, onRegister, onAdmin,
}) {
  const { user, token, logout } = useAuthStore();

  return (
    <>
      <div
        onClick={onSidebar}
        style={{
          position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)',
          zIndex: 50, background: '#111', color: '#fff', writingMode: 'vertical-rl',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          padding: '18px 10px', cursor: 'pointer', transition: 'background 0.15s',
          userSelect: 'none', borderLeft: '2px solid #222',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = THEME.sale)}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
      >
        NOVEDADES →
      </div>

      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: '#111' }}>
        <div style={{
          background: THEME.sale, color: '#fff', textAlign: 'center',
          fontSize: 12.5, fontWeight: 700, padding: '9px 12px',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          OUTLET · HASTA 40% OFF · ENVÍO GRATIS DESDE $150.000
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', height: 70,
          padding: '0 clamp(18px, 4vw, 52px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          gap: 'clamp(10px, 2.5vw, 24px)',
        }}>
          {/* Logo */}
          <button onClick={onLogo} style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <img src="/proshopLogo.png" alt="Pro Shop" style={{ height: 46, width: 46, objectFit: 'contain', borderRadius: 5 }} />
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 23,
              letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', lineHeight: 1,
            }}>PRO SHOP</span>
          </button>

          {/* Nav */}
          <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'clamp(8px, 2vw, 26px)', overflow: 'hidden' }}>
            {nav.map((n, i) => (
              <button key={i} onClick={n.onClick} style={{
                fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                color: n.active ? '#fff' : n.outlet ? THEME.sale : 'rgba(255,255,255,0.62)',
                whiteSpace: 'nowrap', padding: '4px 0',
                borderBottom: n.active ? `2px solid ${THEME.sale}` : '2px solid transparent',
                transition: 'color 0.12s',
              }}>{n.label}</button>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <input
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={onSearchKey}
              placeholder="Buscar..."
              style={{
                width: 'clamp(72px, 12vw, 160px)',
                background: 'rgba(255,255,255,0.08)', border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.22)',
                padding: '7px 9px', fontSize: 13, color: '#fff', outline: 'none',
              }}
            />

            {/* Auth */}
            {token ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {user?.avatar && (
                  <img src={user.avatar} alt={user.name} style={{
                    width: 28, height: 28, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }} />
                )}
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {user?.name?.split(' ')[0] || 'Mi cuenta'}
                </span>
                {user?.role === 'admin' && (
                  <HeaderBtn onClick={onAdmin} label="ADMIN" highlight />
                )}
                <HeaderBtn onClick={onOrders} label="PEDIDOS" />
                <HeaderBtn onClick={logout} label="SALIR" muted />
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <HeaderOutlineBtn onClick={onLogin} label="ENTRAR" />
                <HeaderOutlineBtn onClick={onRegister} label="REGISTRARSE" />
              </div>
            )}

            {/* Cart */}
            <button
              onClick={onCart}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase',
                padding: '10px 16px', border: '1px solid rgba(255,255,255,0.16)', transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              CARRITO
              {hasCart && (
                <span style={{
                  background: THEME.sale, color: '#fff', minWidth: 20, height: 20,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, padding: '0 5px', fontWeight: 700,
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function HeaderBtn({ onClick, label, highlight, muted }) {
  const color = highlight ? THEME.sale : muted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.7)';
  return (
    <button
      onClick={onClick}
      style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.12s' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = color)}
    >{label}</button>
  );
}

function HeaderOutlineBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        padding: '7px 12px', border: '1px solid rgba(255,255,255,0.25)', color: '#fff',
        background: 'transparent', cursor: 'pointer', transition: 'background 0.12s', whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >{label}</button>
  );
}
