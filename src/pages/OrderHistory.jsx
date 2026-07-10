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

// ── Support Modal ─────────────────────────────────────────────────────────────
function SupportModal({ user, orders, onClose }) {
  const [form, setForm] = useState({
    fromName: user?.name ?? '',
    fromEmail: user?.email ?? '',
    messageText: '',
    orderId: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const send = async (e) => {
    e.preventDefault();
    setSending(true); setError(''); setSuccess('');
    try {
      await api.post('/notifications/contact', {
        fromName: form.fromName,
        fromEmail: form.fromEmail,
        messageText: form.messageText,
        ...(form.orderId ? { orderId: Number(form.orderId) } : {}),
      });
      setSuccess('Tu mensaje fue enviado. Te responderemos a ' + form.fromEmail + ' a la brevedad.');
      setForm((f) => ({ ...f, messageText: '', orderId: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el mensaje');
    } finally { setSending(false); }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', margin: 0 }}>CONTACTAR SOPORTE</h2>
            <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>Te responderemos en soporte@proshopbaq.com.co</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', lineHeight: 1 }}>x</button>
        </div>

        <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={lbl}>
              Nombre *
              <input style={inp} value={form.fromName} onChange={(e) => setForm((f) => ({ ...f, fromName: e.target.value }))} required />
            </label>
            <label style={lbl}>
              Email *
              <input style={inp} type="email" value={form.fromEmail} onChange={(e) => setForm((f) => ({ ...f, fromEmail: e.target.value }))} required />
            </label>
          </div>

          {orders.length > 0 && (
            <label style={lbl}>
              Pedido relacionado (opcional)
              <select style={inp} value={form.orderId} onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))}>
                <option value="">-- Sin pedido especifico --</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    Pedido #{o.id} - {STATUS_CONFIG[o.status]?.label ?? o.status} - ${Number(o.total).toLocaleString('es-CO')}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label style={lbl}>
            Mensaje *
            <textarea style={{ ...inp, minHeight: 110, resize: 'vertical' }}
              placeholder="Describe tu consulta, problema o novedad..."
              value={form.messageText}
              onChange={(e) => setForm((f) => ({ ...f, messageText: e.target.value }))} required />
          </label>

          {success && <div style={{ background: '#e6f4ea', color: '#1e7e34', padding: '12px 16px', fontSize: 13, fontWeight: 600, borderLeft: '4px solid #1e7e34' }}>{success}</div>}
          {error && <div style={{ background: '#fce8e6', color: '#c8102e', padding: '12px 16px', fontSize: 13, fontWeight: 600, borderLeft: '4px solid #c8102e' }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ padding: '11px 22px', border: '1.5px solid #111', background: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer' }}>
              CANCELAR
            </button>
            <button type="submit" disabled={sending}
              style={{ padding: '11px 22px', border: 'none', background: '#111', color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer', opacity: sending ? 0.7 : 1 }}>
              {sending ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' };
const modal = { background: '#fff', width: '100%', maxWidth: 520, padding: '28px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'Hanken Grotesk', sans-serif" };
const lbl = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#555', textTransform: 'uppercase' };
const inp = { border: '1.5px solid #ddd', padding: '9px 11px', fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", outline: 'none', color: '#111', width: '100%', boxSizing: 'border-box' };

// ── Order History ─────────────────────────────────────────────────────────────
export default function OrderHistory({ onHome }) {
  const { token, user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('');
  const [showSupport, setShowSupport] = useState(false);

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
      api.get('/payments/verify/' + transactionId)
        .then((res) => {
          const { transactionStatus } = res.data;
          if (transactionStatus === 'APPROVED') setVerifyMsg('Pago aprobado - tu orden ha sido confirmada.');
          else if (['DECLINED', 'ERROR', 'VOIDED'].includes(transactionStatus)) setVerifyMsg('El pago fue rechazado. Intenta de nuevo.');
          else setVerifyMsg('Estado del pago: ' + transactionStatus);
          return loadOrders();
        })
        .catch(() => { setVerifyMsg('No se pudo verificar el estado del pago.'); return loadOrders(); })
        .finally(() => { setVerifying(false); setLoading(false); });
    } else {
      loadOrders().finally(() => setLoading(false));
    }
  }, [token, loadOrders]);

  if (!token) {
    return (
      <section style={{ padding: 'clamp(28px, 4vw, 48px) 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2rem', textTransform: 'uppercase', marginBottom: 12 }}>INICIA SESION</div>
          <p style={{ color: '#767676', marginBottom: 24 }}>Necesitas iniciar sesion para ver tus pedidos.</p>
          <button onClick={onHome} style={{ background: '#111', color: '#fff', fontWeight: 700, fontSize: 13, padding: '14px 32px', border: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }}>IR AL INICIO</button>
        </div>
      </section>
    );
  }

  const verifyBg = verifyMsg.includes('aprobado') ? '#e6f4ea' : verifyMsg.includes('rechazado') ? '#fce8e6' : '#f5f5f5';
  const verifyColor = verifyMsg.includes('aprobado') ? '#1e7e34' : verifyMsg.includes('rechazado') ? '#c8102e' : '#555';
  const verifyBorder = verifyMsg.includes('aprobado') ? '#1e7e34' : verifyMsg.includes('rechazado') ? '#c8102e' : '#ccc';

  return (
    <section style={{ padding: 'clamp(28px, 4vw, 48px) 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', textTransform: 'uppercase', margin: 0 }}>
            MIS PEDIDOS
          </h1>
          <button onClick={() => setShowSupport(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: '1.5px solid #111', background: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer', fontFamily: "'Hanken Grotesk', sans-serif" }}>
            CONTACTAR SOPORTE
          </button>
        </div>

        {(verifying || verifyMsg) && (
          <div style={{ padding: '14px 20px', marginBottom: 24, fontWeight: 600, fontSize: 14, background: verifying ? '#f5f5f5' : verifyBg, color: verifying ? '#555' : verifyColor, borderLeft: '4px solid ' + (verifying ? '#ccc' : verifyBorder), display: 'flex', alignItems: 'center', gap: 10 }}>
            {verifying && <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #bbb', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />}
            {verifying ? 'Verificando tu pago con Wompi...' : verifyMsg}
          </div>
        )}

        {loading && <p style={{ color: '#767676', fontSize: 14 }}>Cargando...</p>}
        {error && <div style={{ background: '#fce8e6', color: '#c8102e', padding: '12px 16px', fontSize: 13.5, fontWeight: 600 }}>{error}</div>}

        {!loading && orders.length === 0 && !error && (
          <div style={{ background: '#f0f0f0', padding: '60px 24px', textAlign: 'center', borderTop: '3px solid #111' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: 8 }}>AUN NO TIENES PEDIDOS</div>
            <p style={{ color: '#767676', marginBottom: 24 }}>Explora el catalogo y realiza tu primera compra.</p>
            <button onClick={onHome} style={{ background: '#111', color: '#fff', fontWeight: 700, fontSize: 13, padding: '14px 32px', border: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }}>VER PRODUCTOS</button>
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
                        {item.product?.name ?? ('Producto #' + item.productId)}
                        {item.size && item.size !== 'U' && <span style={{ color: '#aaa', marginLeft: 8 }}>Talla {item.size}</span>}
                        {item.color && item.color !== 'U' && <span style={{ color: '#aaa', marginLeft: 8 }}>{item.color}</span>}
                        <span style={{ color: '#aaa', marginLeft: 8 }}>x {item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>${Number(item.unitPrice * item.quantity).toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.3rem' }}>
                    TOTAL ${Number(order.total).toLocaleString('es-CO')}
                  </div>
                  {order.trackingNumber && (
                    <div style={{ fontSize: 12.5, color: '#555', background: '#f0f0f0', padding: '6px 12px' }}>
                      Guia: <strong>{order.trackingNumber}</strong>
                    </div>
                  )}
                  {order.shippingCity && <div style={{ fontSize: 12, color: '#aaa' }}>{order.shippingCity} - {order.shippingAddress}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {orders.length > 0 && (
          <div style={{ marginTop: 32, padding: '20px 24px', background: '#f9f9f9', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Tienes alguna pregunta sobre tus pedidos?</p>
              <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>Escribenos a soporte@proshopbaq.com.co o haz click en el boton.</p>
            </div>
            <button onClick={() => setShowSupport(true)}
              style={{ padding: '11px 22px', border: 'none', background: '#111', color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Hanken Grotesk', sans-serif" }}>
              CONTACTAR SOPORTE
            </button>
          </div>
        )}
      </div>

      {showSupport && <SupportModal user={user} orders={orders} onClose={() => setShowSupport(false)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
