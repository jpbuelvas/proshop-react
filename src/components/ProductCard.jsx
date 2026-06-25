import Media from './Media';

export default function ProductCard({ product }) {
  const { name, tile, img, noImg, price, old, onSale, discText, rating, reviews, favIcon, onView, onAdd, onFav } = product;

  return (
    <div
      style={{
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        onClick={onView}
        style={{
          position: 'relative',
          height: 220,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {onSale && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'var(--sale)',
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
        {noImg ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(135deg, #ebebeb, #ebebeb 10px, #e2e2e2 10px, #e2e2e2 20px)',
            }}
          />
        ) : (
          <Media src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
        )}
      </div>
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#767676', fontWeight: 700, marginBottom: 4 }}>
          {tile}
        </div>
        <div
          onClick={onView}
          style={{
            fontWeight: 700,
            fontSize: 15,
            lineHeight: 1.3,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            marginBottom: 8,
            cursor: 'pointer',
            minHeight: 40,
          }}
        >
          {name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#767676', marginBottom: 10 }}>
          <span>★</span>
          <span style={{ fontWeight: 700, color: '#111' }}>{rating}</span>
          <span>({reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, color: '#111' }}>{price}</span>
          {onSale && (
            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: 14 }}>{old}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
          <button
            onClick={onAdd}
            style={{
              flex: 1,
              background: '#111',
              color: '#fff',
              fontWeight: 700,
              fontSize: 12.5,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '11px 0',
              transition: 'background var(--transition)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
          >
            Agregar
          </button>
          <button
            onClick={onFav}
            style={{
              width: 40,
              border: '1.5px solid #111',
              fontSize: 18,
              color: '#111',
              transition: 'background var(--transition)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            {favIcon}
          </button>
        </div>
      </div>
    </div>
  );
}
