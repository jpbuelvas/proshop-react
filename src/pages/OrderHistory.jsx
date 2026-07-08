import { useState, useEffect, useCallback } from 'react';
import { getOrders } from '../services/orders.service';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

const STATUS_CONFIG = {
  PENDING:  { label: 'Pendiente',  bg: '#f0f0f0', color: '#555' },
  APPROVED: { label: 'Pagado',     bg: '#e6f4ea', color: '#1e7e34' },
  DECLINED: { label: 'Rechazado',  bg: '#fce8e6', color: '#c8102e' },
  SHIPPED:  { label: 'Enviado',    bg: '#e8f0fe', color: '#1a56db' },
};

export default function OrderHistory({ onHome }) {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('');

  const loadOrders = useCallback(() => {
    if (!token) return Promise.resolve();
    return getOrders().then(setOrders).catch(() => setError('No se pudieron cargar tus pedidos'));
  }, [token]);

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get('id');

    if (transactionId) {
      window.history.replaceState({}, '', window.location.pathname);
      setVerifying(true);

      api.get(`/payments/verify/${transactionId}`)
        .then((res) => {
          const { transactionStatus } = res.data;
          if (transactionStatus === 'APPROVED') {
            setVerifyMsg('✓ Pago aprobado — tu orden ha sido confirmada.');
          } else if (['DECLINED', 'ERROR', 'VOIDED'].includes(transactionStatus)) {
            setVerifyMsg('✗ El pago fue rechazado. Intenta de nuevo.');
          } else {
            setVerifyMsg(`Estado del pago: ${transactionStatus}`);
          }
          return loadOrders();
        })
        .catch(() => {
          setVerifyMsg('No se pudo verificar el estado del pago.');
          return loadOrders();
        })
        .finally(() => { setVerifying(false); setLoading(false); });
    } else {
      loadOrders().finally(() => setLoading(false));
    }
  }, [token, loadOrders]);

  if (!token) {
    return (
      <section style={{ padding: 'clamp(28px, 4vw, 48px) 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2rem', textTransform: 'uppercase', marginBottom: 12 }}>
            INICIA SESIÓN
          </div>
          <p style={{ color: '#767676', marginBottom: 24 }}>Necesitas iniciar sesión para ver tus pedidos.</p>
          <button onClick={onHome} style={{ background: '#111', color: '#fff', fontWeight: 700, fontSize: 13, padding: '14px 32px', border: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            IR AL INICIO
          </button>
        </div>
      </section>
    );
  }

  const verifyBg = verifyMsg.startsWith('✓') ? '#e6f4ea' : verifyMsg.startsWith('✗') ? '#fce8e6' : '#f5f5f5';
  const verifyColor = verifyMsg.startsWith('✓') ? '#1e7e34' : verifyMsg.startsWith('✗') ? '#c8102e' : '#555';
  const verifyBorder = verifyMsg.startsWith('✓') ? '#1e7e34' : verifyMsg.startsWith('✗') ? '#c8102e' : '#ccc';

  return (
    <section style={{ padding: 'clamp(28px, 4vw, 48px) 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', textTransform: 'uppercase', margin: '0 0 28px' }}>
          MIS PEDIDOS
        </h1>

        {(verifying || verifyMsg) && (
          <div style={{ padding: '14px 20px', marginBottom: 24, fontWeight: 600, fontSize: 14, background: verifying ? '#f5f5f5' : verifyBg, color: verifying ? '#555' : verifyColor, borderLeft: `4px solid ${verifying ? '#ccc' : verifyBorder}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            {verifying && (
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #bbb', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
            )}
            {verifying ? 'Verificando tu pago con Wompi...' : verifyMsg}
          </div>
        )}

        {loading && <p style={{ color: '#767676', fontSize: 14 }}>Cargando...</p>}
        {error && <div style={{ background: '#fce8e6', color: '#c8102e', padding: '12px 16px', fontSize: 13.5, fontWeight: 600 }}>{error}</div>}

        {!loading && orders.length === 0 && !error && (
          <div style={{ background: '#f0f0f0', padding: '60px 24px', textAlign: 'center', borderTop: '3px solid #111' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: 8 }}>
              AÚN NO TIENES PEDIDOS
            </div>
            <p style={{ color: '#767676', marginBottom: 24 }}>Explora el catálogo y realiza tu primera compra.</p>
            <button onClick={onHome} style={{ background: '#111', color: '#fff', fontWeight: 700, fontSize: 13, padding: '14px 32px', border: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              VER PRODUCTOS
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => {
            const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
            return (
              <div key={order.id} style={{ border: '1.5px solid #e0e0e0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#fafafa', borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Orden #{order.id}</span>
                    <span style={{ fontSize: 12, color: '#aaa', marginLeft: 12 }}>
                      {new Date(order.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <span style={{ background: st.bg, color: st.color, padding: '4px 12px', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {st.label}
                  </span>
                </div>

                <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#333' }}>
                      <span>
                        {item.product?.nombre ?? `Producto #${item.productId}`}
                        {item.size && <span style={{ color: '#aaa', marginLeft: 8 }}>Talla {item.size}</span>}
                        <span style={{ color: '#aaa', marginLeft: 8 }}>× {item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        ${Number(item.unitPrice * item.quantity).toLocaleString('es-CO')}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '12px 20px', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.3rem' }}>
                    TOTAL ${Number(order.total).toLocaleString('es-CO')}
                  </div>
                  {order.trackingNumber && (
                    <div style={{ fontSize: 12.5, color: '#555', background: '#f0f0f0', padding: '6px 12px' }}>
                      Guía: <strong>{order.trackingNumber}</strong>
                    </div>
                  )}
                  {order.shippingCity && (
                    <div style={{ fontSize: 12, color: '#aaa' }}>
                      {order.shippingCity} · {order.shippingAddress}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
