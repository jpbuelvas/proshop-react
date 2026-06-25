import Media from './Media';

export default function Cart({ data }) {
  const { empty, hasItems, items, subtotal, savings, hasSavings, shipping, total, freeProg, freeRemaining, hasRemaining, reached, onCheckout, onShop } = data;

  return (
    <section style={{ padding: 'clamp(28px, 4vw, 48px) 0' }}>
      <div style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.6rem)', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: '0 0 28px', color: '#111' }}>TU CARRITO</h1>
        {empty && (
          <div style={{ textAlign: 'center', background: '#f0f0f0', padding: '70px 24px', borderTop: '3px solid #111' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2rem', textTransform: 'uppercase', marginBottom: 8 }}>TU CARRITO ESTÁ VACÍO</div>
            <p style={{ color: '#767676', margin: '0 0 26px', fontSize: 15 }}>Descubre nuestras ofertas y agrega tus favoritos.</p>
            <button
              onClick={onShop}
              style={{ background: '#111', color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '16px 36px', border: '2px solid #111', transition: 'background 0.12s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
            >
              EXPLORAR PRODUCTOS
            </button>
          </div>
        )}
        {hasItems && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 3, background: '#e0e0e0' }}>
              {items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 14, background: '#fff', padding: 16, alignItems: 'center' }}>
                  <div style={{ width: 88, height: 88, flexShrink: 0, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {!it.noImg && <Media src={it.img} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    {it.noImg && <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(135deg, #ebebeb, #ebebeb 8px, #e2e2e2 8px, #e2e2e2 16px)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{it.name}</div>
                    {it.hasVariant && (
                      <div style={{ fontSize: 12.5, color: '#767676', marginTop: 3, display: 'flex', alignItems: 'center', gap: 7 }}>
                        {it.variant}
                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: it.colorHex, border: '1px solid #ccc', display: 'inline-block' }} />
                      </div>
                    )}
                    <div style={{ fontWeight: 800, fontSize: 15, marginTop: 7, color: '#111' }}>{it.price}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #111' }}>
                      <button onClick={it.onDec} style={{ width: 34, height: 34, color: '#111', fontSize: 18, fontWeight: 300 }}>
                        −
                      </button>
                      <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{it.qty}</span>
                      <button onClick={it.onInc} style={{ width: 34, height: 34, color: '#111', fontSize: 18, fontWeight: 300 }}>
                        +
                      </button>
                    </div>
                    <button
                      onClick={it.onRemove}
                      style={{ fontSize: 12, color: '#767676', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.12s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#c8102e')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#767676')}
                    >
                      ELIMINAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ flex: '1 1 300px', maxWidth: 380, border: '1.5px solid #111' }}>
              <div style={{ padding: 22, borderBottom: '1px solid #e0e0e0' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>RESUMEN DEL PEDIDO</div>
                {hasRemaining && (
                  <div style={{ background: '#f0f0f0', padding: '12px 14px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12.5, color: '#555', marginBottom: 7, fontWeight: 600 }}>
                      Te faltan <strong>{freeRemaining}</strong> para envío gratis
                    </div>
                    <div style={{ height: 4, background: '#e0e0e0' }}>
                      <div style={{ height: '100%', width: `${freeProg}%`, background: '#111', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                )}
                {reached && (
                  <div style={{ background: '#f0f0f0', padding: '10px 14px', marginBottom: 14, fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ PEDIDO CON ENVÍO GRATIS</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 9 }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#111', fontWeight: 700 }}>{subtotal}</span>
                </div>
                {hasSavings && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 9 }}>
                    <span style={{ color: '#c8102e', fontWeight: 600 }}>Ahorro</span>
                    <span style={{ color: '#c8102e', fontWeight: 700 }}>−{savings}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 16 }}>
                  <span>Envío</span>
                  <span style={{ color: '#111', fontWeight: 700 }}>{shipping}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1.5px solid #111', paddingTop: 14 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{total}</span>
                </div>
              </div>
              <div style={{ padding: '18px 22px' }}>
                <button
                  onClick={onCheckout}
                  style={{ width: '100%', background: '#111', color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '0.07em', textTransform: 'uppercase', padding: 16, border: '2px solid #111', transition: 'background 0.12s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
                >
                  FINALIZAR COMPRA
                </button>
                <button
                  onClick={onShop}
                  style={{ width: '100%', marginTop: 10, color: '#767676', fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase', padding: 10, transition: 'color 0.12s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#111')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#767676')}
                >
                  SEGUIR COMPRANDO
                </button>
                <div style={{ textAlign: 'center', fontSize: 11.5, color: '#aaa', marginTop: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pago seguro · Devoluciones 30 días</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
