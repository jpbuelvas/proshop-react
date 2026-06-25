import ProductCard from './ProductCard';

export default function Catalog({ data, onHome }) {
  const { title, catLabel, count, chips, genderChips, items, hasItems, empty } = data;

  return (
    <section style={{ padding: 'clamp(28px, 4vw, 48px) 0' }}>
      <div style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)' }}>
        <div style={{ fontSize: 12, color: '#767676', marginBottom: 18, display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <button onClick={onHome} style={{ color: '#767676', transition: 'color 0.12s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#111')} onMouseLeave={(e) => (e.currentTarget.style.color = '#767676')}>
            INICIO
          </button>
          <span>/</span>
          <span style={{ color: '#111' }}>{catLabel}</span>
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', letterSpacing: '-0.01em', textTransform: 'uppercase', margin: '0 0 5px', color: '#111' }}>{title}</h1>
        <p style={{ color: '#767676', margin: '0 0 18px', fontSize: 13.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{count} PRODUCTOS</p>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          {genderChips.map((g, i) => (
            <button
              key={i}
              onClick={g.onClick}
              style={{
                padding: '7px 16px',
                fontWeight: 700,
                fontSize: 11.5,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                border: `1px solid ${g.active ? '#111' : '#c4c4c4'}`,
                background: g.active ? '#111' : '#fff',
                color: g.active ? '#fff' : '#111',
                transition: 'all 0.12s',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 28 }}>
          {chips.map((ch, i) => (
            <button
              key={i}
              onClick={ch.onClick}
              style={{
                padding: '9px 18px',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: `1.5px solid ${ch.active ? '#111' : '#c4c4c4'}`,
                background: ch.active ? '#111' : '#fff',
                color: ch.active ? '#fff' : '#111',
                transition: 'all 0.12s',
              }}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {hasItems && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 3, background: '#ddd' }}>
            {items.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
        {empty && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#767676', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            NO ENCONTRAMOS PRODUCTOS
          </div>
        )}
      </div>
    </section>
  );
}
