export default function Footer({ onLogo }) {
  return (
    <footer style={{ background: '#111', color: '#fff', borderTop: '3px solid #c8102e', padding: 'clamp(36px, 5vw, 56px) 0 20px' }}>
      <div style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <button onClick={onLogo} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
              <img src="/proshopLogo.avif" alt="Pro Shop" style={{ height: 38, width: 38, objectFit: 'contain', borderRadius: 5, display: 'block' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 21, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff' }}>PRO SHOP</span>
            </button>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, maxWidth: '26ch', margin: 0 }}>Tu tienda de ropa deportiva, audio y accesorios. Calidad real para gente real.</p>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.36)', marginBottom: 14 }}>TIENDA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <FooterBtn onClick={onLogo}>Inicio</FooterBtn>
              <FooterBtn>Novedades</FooterBtn>
              <FooterBtn>Outlet</FooterBtn>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.36)', marginBottom: 14 }}>AYUDA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <FooterBtn>Envíos y devoluciones</FooterBtn>
              <FooterBtn>Garantía</FooterBtn>
              <FooterBtn>Contáctanos</FooterBtn>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.36)', marginBottom: 14 }}>REDES</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SocialIcon>📸</SocialIcon>
              <SocialIcon>📱</SocialIcon>
              <SocialIcon>▶</SocialIcon>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>© 2026 Pro Shop. Todos los derechos reservados.</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>Hecho con ♥ en Colombia</div>
        </div>
      </div>
    </footer>
  );
}

function FooterBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ textAlign: 'left', fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: 500, transition: 'color 0.12s' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
    >
      {children}
    </button>
  );
}

function SocialIcon({ children }) {
  return (
    <div
      style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer', transition: 'background 0.12s' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
    >
      {children}
    </div>
  );
}
