import { useRef, useState } from 'react';
import ProductCard from './ProductCard';
import Media from './Media';
import { THEME } from '../data/products';

export default function ProductPage({ data }) {
  const {
    name, catLabel, img, noImg, price, old, onSale, discText, rating, reviews, hasSizes, sizes, colors, desc, qty,
    onInc, onDec, onAdd, onFav, favIcon, onHome, onCat, related,
  } = data;

  const zoomRef = useRef(null);
  const [zooming, setZooming] = useState(false);

  const applyZoom = (e) => {
    const c = e.currentTarget;
    if (!c || !zoomRef.current) return;
    const r = c.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    zoomRef.current.style.transformOrigin = `${x}% ${y}%`;
    zoomRef.current.style.transform = 'scale(2.6)';
  };

  const onDown = (e) => {
    if (!zoomRef.current) return;
    setZooming(true);
    e.currentTarget.style.cursor = 'crosshair';
    zoomRef.current.style.transition = 'transform 0.1s ease-out';
    applyZoom(e);
  };
  const onMove = (e) => {
    if (zooming) applyZoom(e);
  };
  const onUp = (e) => {
    setZooming(false);
    if (e && e.currentTarget) e.currentTarget.style.cursor = 'grab';
    if (zoomRef.current) {
      zoomRef.current.style.transition = 'transform 0.35s ease-out';
      zoomRef.current.style.transform = 'scale(1)';
    }
  };

  return (
    <section style={{ padding: 'clamp(20px, 3vw, 36px) 0' }}>
      <div style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)' }}>
        <div style={{ fontSize: 12, color: '#767676', marginBottom: 22, display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <button onClick={onHome} style={{ color: '#767676', transition: 'color 0.12s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#111')} onMouseLeave={(e) => (e.currentTarget.style.color = '#767676')}>
            INICIO
          </button>
          <span>/</span>
          <button onClick={onCat} style={{ color: '#767676', transition: 'color 0.12s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#111')} onMouseLeave={(e) => (e.currentTarget.style.color = '#767676')}>
            {catLabel}
          </button>
          <span>/</span>
          <span style={{ color: '#111' }}>{name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(24px, 5vw, 60px)', alignItems: 'start' }}>
          <div>
            <div
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
              style={{
                position: 'relative',
                height: 'clamp(300px, 44vw, 520px)',
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'grab',
                touchAction: 'none',
              }}
            >
              {onSale && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: THEME.sale,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 12.5,
                    padding: '6px 12px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    zIndex: 2,
                  }}
                >
                  {discText}
                </span>
              )}
              {!noImg && (
                <>
                  <div ref={zoomRef} style={{ width: '76%', height: '76%', willChange: 'transform', transition: 'transform 0.3s ease-out', pointerEvents: 'none' }}>
                    <Media src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(0,0,0,0.72)',
                      color: '#fff',
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '5px 13px',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ↔ ARRASTRA PARA ZOOM
                  </span>
                </>
              )}
              {noImg && (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, #ebebeb, #ebebeb 10px, #e2e2e2 10px, #e2e2e2 20px)' }} />
                  <span style={{ position: 'relative', fontFamily: 'monospace', fontSize: 12, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>foto producto</span>
                </>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, marginTop: 3, background: '#e0e0e0' }}>
              {[1, 0.7, 0.5].map((op, i) => (
                <div key={i} style={{ height: 88, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, opacity: op }}>
                  {!noImg && <Media src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#767676', fontWeight: 700, marginBottom: 6 }}>{catLabel}</div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.01em', textTransform: 'uppercase', margin: '0 0 10px', lineHeight: 1.02, color: '#111' }}>{name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#767676', marginBottom: 18 }}>
              <span>★</span>
              <span style={{ fontWeight: 700, color: '#111' }}>{rating}</span>
              <span>({reviews} reseñas)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', color: '#111' }}>{price}</span>
              {onSale && (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#999', fontSize: 17 }}>{old}</span>
                  <span style={{ background: THEME.sale, color: '#fff', fontWeight: 700, fontSize: 12, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{discText}</span>
                </>
              )}
            </div>

            {hasSizes && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>TALLA</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {sizes.map((sz, i) => (
                    <button
                      key={i}
                      onClick={sz.onClick}
                      style={{
                        minWidth: 50,
                        padding: '11px 10px',
                        fontWeight: 700,
                        fontSize: 14,
                        border: `1.5px solid ${sz.active ? '#111' : '#c4c4c4'}`,
                        background: sz.active ? '#111' : '#fff',
                        color: sz.active ? '#fff' : '#111',
                        transition: 'all 0.12s',
                      }}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>COLOR</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={c.onClick}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: c.hex,
                      boxShadow: c.active ? '0 0 0 2px #fff, 0 0 0 4px #111' : '0 0 0 1.5px #c4c4c4',
                      transition: 'box-shadow 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 7, alignItems: 'stretch', flexWrap: 'wrap', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #111' }}>
                <button onClick={onDec} style={{ width: 48, height: 52, fontSize: 20, color: '#111', fontWeight: 300 }}>
                  −
                </button>
                <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{qty}</span>
                <button onClick={onInc} style={{ width: 48, height: 52, fontSize: 20, color: '#111', fontWeight: 300 }}>
                  +
                </button>
              </div>
              <button
                onClick={onAdd}
                style={{
                  flex: 1,
                  minWidth: 200,
                  background: '#111',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  padding: '0 24px',
                  height: 52,
                  border: '2px solid #111',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
              >
                AGREGAR AL CARRITO
              </button>
              <button
                onClick={onFav}
                style={{
                  width: 52,
                  height: 52,
                  border: '1.5px solid #111',
                  background: '#fff',
                  fontSize: 20,
                  color: '#111',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                {favIcon}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, borderTop: '1px solid #e0e0e0', paddingTop: 20, marginBottom: 22 }}>
              <div style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#555' }}>
                <span style={{ fontWeight: 900, color: '#111', fontSize: 15 }}>→</span> Envío gratis en pedidos elegibles · llega en 2-4 días
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#555' }}>
                <span style={{ fontWeight: 900, color: '#111', fontSize: 15 }}>↺</span> 30 días para cambios y devoluciones
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#555' }}>
                <span style={{ fontWeight: 900, color: '#111', fontSize: 15 }}>✓</span> Pago 100% seguro · Garantía del fabricante
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 9, borderTop: '1px solid #e0e0e0', paddingTop: 18 }}>DESCRIPCIÓN</div>
              <p style={{ fontSize: 14.5, color: '#555', lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'clamp(48px, 7vw, 80px)' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#767676', fontWeight: 700, marginBottom: 8 }}>TAMBIÉN TE PUEDE GUSTAR</div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', textTransform: 'uppercase', margin: '0 0 20px', color: '#111' }}>PRODUCTOS RELACIONADOS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 3, background: '#ddd' }}>
            {related.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
