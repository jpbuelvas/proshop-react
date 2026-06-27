import { useState, useEffect } from 'react';
import { THEME } from '../data/products';

export default function Header({ nav, query, onSearch, onSearchKey, onLogo, onCart, onSidebar, cartCount, hasCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <div
        onClick={onSidebar}
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
          background: '#111',
          color: '#fff',
          writingMode: 'vertical-rl',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '18px 10px',
          cursor: 'pointer',
          transition: 'background 0.15s',
          userSelect: 'none',
          borderLeft: '2px solid #222',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = THEME.sale)}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
      >
        NOVEDADES →
      </div>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: '#111' }}>
        <div
          style={{
            background: THEME.sale,
            color: '#fff',
            textAlign: 'center',
            fontSize: 12.5,
            fontWeight: 700,
            padding: '9px 12px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          OUTLET · HASTA 40% OFF · ENVÍO GRATIS DESDE $150.000
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 70,
            padding: '0 clamp(18px, 4vw, 52px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            gap: 'clamp(10px, 2.5vw, 24px)',
          }}
        >
          <button onClick={onLogo} style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <img src="/proshopLogo.avif" alt="Pro Shop" style={{ height: 54, width: 'auto', objectFit: 'contain', display: 'block' }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 23, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}>
              PRO SHOP
            </span>
          </button>

          {!isMobile && (
            <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'clamp(8px, 2vw, 26px)', overflow: 'hidden' }}>
              {nav.map((n, i) => (
                <button
                  key={i}
                  onClick={n.onClick}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: n.active ? '#fff' : n.outlet ? THEME.sale : 'rgba(255,255,255,0.62)',
                    whiteSpace: 'nowrap',
                    padding: '4px 0',
                    borderBottom: n.active ? `2px solid ${THEME.sale}` : '2px solid transparent',
                    transition: 'color 0.12s',
                  }}
                >
                  {n.label}
                </button>
              ))}
            </nav>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: isMobile ? 'auto' : undefined }}>
            {!isMobile && (
              <input
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={onSearchKey}
                placeholder="Buscar..."
                style={{
                  width: 'clamp(72px, 12vw, 160px)',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.22)',
                  padding: '7px 9px',
                  fontSize: 13,
                  color: '#fff',
                  outline: 'none',
                }}
              />
            )}
            <button
              onClick={onCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '10px 16px',
                border: '1px solid rgba(255,255,255,0.16)',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              CARRITO
              {hasCart && (
                <span
                  style={{
                    background: THEME.sale,
                    color: '#fff',
                    minWidth: 20,
                    height: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    padding: '0 5px',
                    fontWeight: 700,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {isMobile && (
              <button
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 5,
                  width: 40,
                  height: 40,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: 8,
                  cursor: 'pointer',
                }}
              >
                {menuOpen ? (
                  <>
                    <span style={{ display: 'block', width: 20, height: 2, background: '#fff', transform: 'rotate(45deg) translate(5px, 5px)', transition: 'transform 0.2s' }} />
                    <span style={{ display: 'block', width: 20, height: 2, background: '#fff', opacity: 0 }} />
                    <span style={{ display: 'block', width: 20, height: 2, background: '#fff', transform: 'rotate(-45deg) translate(5px, -5px)', transition: 'transform 0.2s' }} />
                  </>
                ) : (
                  <>
                    <span style={{ display: 'block', width: 20, height: 2, background: '#fff' }} />
                    <span style={{ display: 'block', width: 20, height: 2, background: '#fff' }} />
                    <span style={{ display: 'block', width: 20, height: 2, background: '#fff' }} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {isMobile && menuOpen && (
          <div
            style={{
              background: '#111',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              padding: '12px clamp(18px, 4vw, 52px) 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {nav.map((n, i) => (
              <button
                key={i}
                onClick={() => { n.onClick(); setMenuOpen(false); }}
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: n.active ? '#fff' : n.outlet ? THEME.sale : 'rgba(255,255,255,0.62)',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  textAlign: 'left',
                  borderLeft: n.active ? `3px solid ${THEME.sale}` : '3px solid transparent',
                  paddingLeft: 12,
                  transition: 'color 0.12s',
                }}
              >
                {n.label}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={onSearchKey}
              placeholder="Buscar..."
              style={{
                marginTop: 10,
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.22)',
                padding: '10px 9px',
                fontSize: 14,
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}
      </header>
    </>
  );
}
