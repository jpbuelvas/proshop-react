import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const EMPTY_PRODUCT = {
  name: '', description: '', price: '', previousPrice: '',
  category: 'ropa', gender: ['U'], imageUrl: '',
};
const EMPTY_VARIANT = { color: 'U', size: 'U', available: 0, specialPrice: '', imageUrl: '' };
const CATEGORIES = ['ropa', 'calzado', 'accesorios', 'equipos', 'belleza', 'general', 'otro'];
const GENDERS = ['U', 'M', 'W'];

const STATUS_LABEL = { PENDING: 'Pendiente', APPROVED: 'Aprobado', DECLINED: 'Rechazado', SHIPPED: 'Enviado' };
const STATUS_COLOR = { PENDING: '#f59e0b', APPROVED: '#22c55e', DECLINED: '#ef4444', SHIPPED: '#3b82f6' };

// ── Order Email Modal ────────────────────────────────────────────────────────
function OrderEmailModal({ order, onClose }) {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const send = async (e) => {
    e.preventDefault();
    setSending(true); setError(''); setSuccess('');
    try {
      await api.post('/notifications/order', { orderId: order.id, subject: form.subject, message: form.message });
      setSuccess('Email enviado a ' + (order.user?.email ?? 'cliente'));
      setForm({ subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar');
    } finally { setSending(false); }
  };

  const clientName = order.user?.name ?? 'Cliente';
  const clientEmail = order.user?.email ?? '-';
  const items = order.items ?? [];

  return (
    <div style={S.syncOverlay} onClick={onClose}>
      <div style={{ ...S.syncPanel, maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div style={S.panelHeader}>
          <div>
            <h2 style={S.panelTitle}>EMAIL A CLIENTE</h2>
            <p style={{ fontSize: 12, color: '#666', marginTop: 3 }}>Pedido #{order.id} - {clientName} ({clientEmail})</p>
          </div>
          <button style={S.btnClose} onClick={onClose}>x</button>
        </div>

        <div style={{ padding: '12px 24px', background: '#fafafa', borderBottom: '1px solid #eee', fontSize: 13 }}>
          <strong>Productos:</strong>{' '}
          {items.map((i) => (i.product?.name ?? 'Producto') + ' x' + i.quantity).join(', ')}
          <span style={{ marginLeft: 12, fontWeight: 700 }}>Total: ${Number(order.total).toLocaleString('es-CO')}</span>
        </div>

        <form onSubmit={send} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={S.label}>
            Asunto *
            <input style={S.input} placeholder="Novedad sobre tu pedido" value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required />
          </label>
          <label style={S.label}>
            Mensaje *
            <textarea style={{ ...S.input, minHeight: 100, resize: 'vertical' }}
              placeholder="Hola, te escribimos para informarte sobre tu pedido..."
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required />
          </label>
          {success && <div style={S.successBar}>{success}</div>}
          {error && <div style={S.errorBar}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" style={S.btnSecondary} onClick={onClose}>CERRAR</button>
            <button type="submit" style={S.btnPrimary} disabled={sending}>
              {sending ? 'ENVIANDO...' : 'ENVIAR EMAIL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Notify Product Modal ──────────────────────────────────────────────────────
function NotifyModal({ product, onClose }) {
  const [form, setForm] = useState({ toEmail: '', toName: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const send = async (e) => {
    e.preventDefault(); setSending(true); setError(''); setSuccess('');
    try {
      await api.post('/notifications/product', { productId: product.id, toEmail: form.toEmail, toName: form.toName, message: form.message || undefined });
      setSuccess('Email enviado a ' + form.toEmail);
      setForm({ toEmail: '', toName: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar');
    } finally { setSending(false); }
  };

  return (
    <div style={S.syncOverlay} onClick={onClose}>
      <div style={{ ...S.syncPanel, maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div style={S.panelHeader}>
          <div>
            <h2 style={S.panelTitle}>NOTIFICAR PRODUCTO</h2>
            <p style={{ fontSize: 12, color: '#666', marginTop: 3 }}>Envia un email sobre este producto a un cliente.</p>
          </div>
          <button style={S.btnClose} onClick={onClose}>x</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name}
              style={{ width: 56, height: 56, objectFit: 'cover', background: '#f0f0f0', flexShrink: 0 }}
              onError={(e) => { e.target.style.display = 'none'; }} />
          )}
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{product.name}</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>${Number(product.price).toLocaleString('es-CO')}</div>
          </div>
        </div>
        <form onSubmit={send} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={S.label}>
            Email del cliente *
            <input style={S.input} name="toEmail" type="email" placeholder="cliente@email.com" value={form.toEmail}
              onChange={(e) => setForm((f) => ({ ...f, toEmail: e.target.value }))} required />
          </label>
          <label style={S.label}>
            Nombre del cliente *
            <input style={S.input} name="toName" placeholder="Juan" value={form.toName}
              onChange={(e) => setForm((f) => ({ ...f, toName: e.target.value }))} required />
          </label>
          <label style={S.label}>
            Mensaje personalizado (opcional)
            <textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} placeholder="Ej: Este producto esta disponible de nuevo..."
              value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
          </label>
          {success && <div style={S.successBar}>{success}</div>}
          {error && <div style={S.errorBar}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" style={S.btnSecondary} onClick={onClose}>CERRAR</button>
            <button type="submit" style={S.btnPrimary} disabled={sending}>{sending ? 'ENVIANDO...' : 'ENVIAR EMAIL'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Sync Modal ───────────────────────────────────────────────────────────────
function SyncModal({ onClose }) {
  const [status, setStatus] = useState({ syncing: false, lastCount: 0, lastErrors: 0, lastSync: null, recentLog: [] });
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const logRef = useRef(null);
  const pollRef = useRef(null);

  const poll = useCallback(async () => {
    try {
      const res = await api.get('/sync/status');
      setStatus(res.data);
      if (!res.data.syncing && started) { setDone(true); clearInterval(pollRef.current); }
    } catch {}
  }, [started]);

  useEffect(() => {
    if (started) { pollRef.current = setInterval(poll, 1000); poll(); }
    return () => clearInterval(pollRef.current);
  }, [started, poll]);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = 0; }, [status.recentLog?.length]);

  const startSync = async () => {
    setError(''); setDone(false); setStarted(true);
    try { await api.post('/sync/products'); }
    catch (e) { setError(e.response?.data?.message || 'Error al iniciar sync'); setStarted(false); }
  };

  const syncing = status.syncing;
  const log = status.recentLog || [];

  return (
    <div style={S.syncOverlay} onClick={onClose}>
      <div style={S.syncPanel} onClick={(e) => e.stopPropagation()}>
        <div style={S.panelHeader}>
          <div>
            <h2 style={S.panelTitle}>SINCRONIZAR - DROPI</h2>
            <p style={{ fontSize: 12, color: '#666', marginTop: 3 }}>Importa productos desde WooCommerce bridge.</p>
          </div>
          <button style={S.btnClose} onClick={onClose}>x</button>
        </div>
        <div style={S.syncStatsBar}>
          {[['sincronizados', status.lastCount, '#111'], ['errores', status.lastErrors, status.lastErrors > 0 ? '#e53e3e' : '#22c55e'],
            ['nuevos', log.filter((e) => e.action === 'creado').length, '#111'],
            ['actualizados', log.filter((e) => e.action === 'actualizado').length, '#111']].map(([label, num, color]) => (
            <div key={label} style={S.statBox}>
              <span style={{ ...S.statNum, color }}>{num}</span>
              <span style={S.statLabel}>{label}</span>
            </div>
          ))}
        </div>
        {syncing && (
          <div style={S.progressWrap}>
            <div style={S.progressBar}><div style={{ ...S.progressFill, animation: 'syncPulse 1.2s ease-in-out infinite' }} /></div>
            <span style={S.progressLabel}>Sincronizando... {status.lastCount} productos procesados</span>
          </div>
        )}
        {done && !syncing && <div style={S.doneBar}>Sync completo - {status.lastCount} productos - {status.lastErrors} errores</div>}
        {error && <div style={S.errorBar}>{error}</div>}
        <div style={S.logHeader}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', color: '#888' }}>
            PRODUCTOS PROCESADOS {log.length > 0 ? '(' + log.length + ')' : ''}
          </span>
        </div>
        <div ref={logRef} style={S.logList}>
          {log.length === 0 && !syncing && <div style={S.logEmpty}>{started ? 'Esperando datos...' : 'Inicia el sync para ver los productos importados.'}</div>}
          {log.map((entry, i) => (
            <div key={i} style={S.logRow}>
              <img src={entry.imageUrl || 'https://via.placeholder.com/36x36?text=?'} alt="" style={S.logImg}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/36x36?text=?'; }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.logName}>{entry.name}</div>
                <div style={S.logMeta}>{entry.category} - ${Number(entry.price).toLocaleString('es-CO')}</div>
              </div>
              <span style={{ ...S.logBadge, background: entry.action === 'creado' ? '#dcfce7' : '#f0f9ff', color: entry.action === 'creado' ? '#15803d' : '#0369a1' }}>
                {entry.action === 'creado' ? 'NUEVO' : 'YA EXISTE'}
              </span>
            </div>
          ))}
        </div>
        <div style={S.syncFooter}>
          {status.lastSync && <span style={{ fontSize: 11, color: '#999' }}>Ultimo sync: {new Date(status.lastSync).toLocaleString('es-CO')}</span>}
          <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
            <button style={S.btnSecondary} onClick={onClose}>CERRAR</button>
            <button style={{ ...S.btnPrimary, opacity: syncing ? 0.6 : 1 }} onClick={startSync} disabled={syncing}>
              {syncing ? 'SINCRONIZANDO...' : started ? 'SINCRONIZAR DE NUEVO' : 'INICIAR SYNC'}
            </button>
          </div>
        </div>
        <style>{`@keyframes syncPulse { 0%,100% { width:30%;margin-left:0; } 50% { width:60%;margin-left:20%; } }`}</style>
      </div>
    </div>
  );
}

// ── Pedidos Tab ───────────────────────────────────────────────────────────────
function PedidosTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailOrder, setEmailOrder] = useState(null);
  const [filter, setFilter] = useState('todos');

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get('/orders/admin'); setOrders(res.data); }
    catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'todos' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <div style={S.center}>Cargando pedidos...</div>;

  return (
    <div style={{ padding: '0 28px 28px' }}>
      {/* Filtros de estado */}
      <div style={{ display: 'flex', gap: 8, margin: '20px 0 16px', flexWrap: 'wrap' }}>
        {['todos', 'PENDING', 'APPROVED', 'SHIPPED', 'DECLINED'].map((s) => (
          <button key={s} style={{
            padding: '6px 14px', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
            border: '1.5px solid ' + (filter === s ? '#111' : '#ddd'),
            background: filter === s ? '#111' : '#fff', color: filter === s ? '#fff' : '#666',
            cursor: 'pointer',
          }} onClick={() => setFilter(s)}>
            {s === 'todos' ? 'TODOS' : STATUS_LABEL[s]?.toUpperCase() ?? s}
            {s !== 'todos' && <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>
              ({orders.filter((o) => o.status === s).length})
            </span>}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#888', alignSelf: 'center' }}>
          {filtered.length} pedido{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 && <p style={S.center}>No hay pedidos.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((order) => {
          const client = order.user;
          const items = order.items ?? [];
          return (
            <div key={order.id} style={{ border: '1.5px solid #eee', padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start' }}>
              <div>
                {/* Encabezado */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontWeight: 900, fontSize: 15 }}>Pedido #{order.id}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 9px', letterSpacing: '0.06em',
                    background: STATUS_COLOR[order.status] + '22',
                    color: STATUS_COLOR[order.status],
                    border: '1px solid ' + STATUS_COLOR[order.status] + '55',
                  }}>{STATUS_LABEL[order.status] ?? order.status}</span>
                  <span style={{ fontSize: 12, color: '#999' }}>{new Date(order.createdAt).toLocaleDateString('es-CO')}</span>
                </div>

                {/* Cliente */}
                <div style={{ fontSize: 13, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>{client?.name ?? 'Desconocido'}</span>
                  {client?.email && <span style={{ color: '#666', marginLeft: 8 }}>{client.email}</span>}
                  {order.shippingCity && <span style={{ color: '#888', marginLeft: 8 }}>- {order.shippingCity}</span>}
                </div>

                {/* Productos */}
                <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
                  {items.map((i, idx) => {
                    const v = [i.size, i.color].filter((x) => x && x !== 'U').join('/');
                    return (idx > 0 ? ', ' : '') + (i.product?.name ?? 'Producto') + (v ? ' (' + v + ')' : '') + ' x' + i.quantity;
                  })}
                </div>

                {/* Total y tracking */}
                <div style={{ display: 'flex', gap: 16, fontSize: 12, marginTop: 4 }}>
                  <span style={{ fontWeight: 700 }}>Total: ${Number(order.total).toLocaleString('es-CO')}</span>
                  {order.trackingNumber && <span style={{ color: '#3b82f6' }}>Guia: {order.trackingNumber}</span>}
                  {order.dropiOrderId && <span style={{ color: '#888' }}>Dropi: {order.dropiOrderId}</span>}
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                <button style={S.btnNotify} onClick={() => setEmailOrder(order)}>ENVIAR EMAIL</button>
              </div>
            </div>
          );
        })}
      </div>

      {emailOrder && <OrderEmailModal order={emailOrder} onClose={() => setEmailOrder(null)} />}
    </div>
  );
}

// ── Admin Page Principal ──────────────────────────────────────────────────────
export default function AdminPage({ onClose }) {
  const [tab, setTab] = useState('productos');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showSync, setShowSync] = useState(false);
  const [notifyProduct, setNotifyProduct] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get('/products'); setProducts(res.data); }
    catch { setError('Error cargando productos'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditingProduct({ ...EMPTY_PRODUCT }); setVariants([{ ...EMPTY_VARIANT }]); setError(''); };
  const openEdit = (p) => {
    setEditingProduct({ id: p.id, name: p.name, description: p.description || '', price: p.price, previousPrice: p.previousPrice || '', category: p.category, gender: p.gender || ['U'], imageUrl: p.imageUrl || '' });
    setVariants((p.variants || []).map((v) => ({ id: v.id, color: v.color, size: v.size, available: v.available, specialPrice: v.specialPrice || '', imageUrl: v.imageUrl || '' })));
    setError('');
  };
  const closeEdit = () => { setEditingProduct(null); setVariants([]); setError(''); };
  const handleField = (e) => { const { name, value } = e.target; setEditingProduct((p) => ({ ...p, [name]: value })); };
  const toggleGender = (g) => { setEditingProduct((p) => { const cur = p.gender || []; return { ...p, gender: cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g] }; }); };
  const handleVariantField = (idx, field, value) => { setVariants((vs) => vs.map((v, i) => i === idx ? { ...v, [field]: value } : v)); };
  const addVariant = () => setVariants((vs) => [...vs, { ...EMPTY_VARIANT }]);
  const removeVariant = (idx) => setVariants((vs) => vs.filter((_, i) => i !== idx));

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const body = {
        name: editingProduct.name, description: editingProduct.description || undefined,
        price: Number(editingProduct.price),
        previousPrice: editingProduct.previousPrice ? Number(editingProduct.previousPrice) : undefined,
        category: editingProduct.category, gender: editingProduct.gender,
        imageUrl: editingProduct.imageUrl || undefined,
        variants: variants.map((v) => ({ ...(v.id ? { id: v.id } : {}), color: v.color || 'U', size: v.size || 'U', available: Number(v.available) || 0, specialPrice: v.specialPrice ? Number(v.specialPrice) : undefined, imageUrl: v.imageUrl || undefined })),
      };
      if (editingProduct.id) { await api.put('/products/' + editingProduct.id, body); } else { await api.post('/products', body); }
      closeEdit(); load();
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (id) => {
    try { await api.delete('/products/' + id); setDeleteConfirm(null); load(); }
    catch { setError('Error al eliminar'); }
  };

  return (
    <>
      <div style={S.overlay} onClick={onClose}>
        <div style={S.panel} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={S.panelHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {[['productos', 'PRODUCTOS'], ['pedidos', 'PEDIDOS']].map(([key, label]) => (
                <button key={key} style={{
                  padding: '10px 22px', fontSize: 13, fontWeight: 900, letterSpacing: '0.07em',
                  border: 'none', borderBottom: tab === key ? '3px solid #111' : '3px solid transparent',
                  background: 'none', cursor: 'pointer', color: tab === key ? '#111' : '#999',
                }} onClick={() => { setTab(key); setEditingProduct(null); }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {tab === 'productos' && <>
                <button style={S.btnSync} onClick={() => setShowSync(true)}>SINCRONIZAR</button>
                <button style={S.btnPrimary} onClick={openCreate}>+ NUEVO</button>
              </>}
              <button style={S.btnClose} onClick={onClose}>x</button>
            </div>
          </div>

          {error && <div style={S.errorBar}>{error}</div>}

          {/* Tab Productos */}
          {tab === 'productos' && !editingProduct && (
            loading ? <div style={S.center}>Cargando...</div> : (
              <div style={S.tableWrapper}>
                <table style={S.table}>
                  <thead>
                    <tr>{['ID', 'Nombre', 'Categoria', 'Precio', 'Variantes', 'Acciones'].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} style={S.tr}>
                        <td style={S.td}>{p.id}</td>
                        <td style={{ ...S.td, fontWeight: 600 }}>{p.name}</td>
                        <td style={S.td}>{p.category}</td>
                        <td style={S.td}>${Number(p.price).toLocaleString('es-CO')}</td>
                        <td style={S.td}>{(p.variants || []).length}</td>
                        <td style={{ ...S.td, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button style={S.btnEdit} onClick={() => openEdit(p)}>EDITAR</button>
                          <button style={S.btnNotify} onClick={() => setNotifyProduct(p)}>EMAIL</button>
                          <button style={S.btnDelete} onClick={() => setDeleteConfirm(p.id)}>ELIMINAR</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && <p style={S.center}>No hay productos.</p>}
              </div>
            )
          )}

          {/* Formulario edicion */}
          {tab === 'productos' && editingProduct && (
            <form onSubmit={save} style={S.form}>
              <div style={S.formGrid}>
                <label style={S.label}>Nombre *<input style={S.input} name="name" value={editingProduct.name} onChange={handleField} required /></label>
                <label style={S.label}>Categoria *<select style={S.input} name="category" value={editingProduct.category} onChange={handleField}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
                <label style={S.label}>Precio *<input style={S.input} name="price" type="number" min="0" step="100" value={editingProduct.price} onChange={handleField} required /></label>
                <label style={S.label}>Precio anterior<input style={S.input} name="previousPrice" type="number" min="0" step="100" value={editingProduct.previousPrice} onChange={handleField} /></label>
                <label style={S.label}>URL imagen<input style={S.input} name="imageUrl" value={editingProduct.imageUrl} onChange={handleField} placeholder="https://..." /></label>
                <div style={S.label}>Genero
                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                    {GENDERS.map((g) => (
                      <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        <input type="checkbox" checked={(editingProduct.gender || []).includes(g)} onChange={() => toggleGender(g)} />
                        {g === 'U' ? 'Unisex' : g === 'M' ? 'Hombre' : 'Mujer'}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <label style={S.label}>Descripcion<textarea style={{ ...S.input, minHeight: 72, resize: 'vertical' }} name="description" value={editingProduct.description} onChange={handleField} /></label>
              <div style={S.variantsSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.06em' }}>VARIANTES (color + talla)</h3>
                  <button type="button" style={S.btnAddVariant} onClick={addVariant}>+ AGREGAR</button>
                </div>
                <div style={S.variantHeader}>{['Color', 'Talla', 'Stock', 'Precio especial', 'URL imagen', ''].map((h) => <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{h}</span>)}</div>
                {variants.map((v, idx) => (
                  <div key={idx} style={S.variantRow}>
                    <input style={S.varInput} placeholder="NEGRO" value={v.color} onChange={(e) => handleVariantField(idx, 'color', e.target.value)} />
                    <input style={S.varInput} placeholder="M" value={v.size} onChange={(e) => handleVariantField(idx, 'size', e.target.value)} />
                    <input style={S.varInput} type="number" min="0" placeholder="0" value={v.available} onChange={(e) => handleVariantField(idx, 'available', e.target.value)} />
                    <input style={S.varInput} type="number" min="0" step="100" placeholder="--" value={v.specialPrice} onChange={(e) => handleVariantField(idx, 'specialPrice', e.target.value)} />
                    <input style={S.varInput} placeholder="https://..." value={v.imageUrl} onChange={(e) => handleVariantField(idx, 'imageUrl', e.target.value)} />
                    <button type="button" style={S.btnRemoveVariant} onClick={() => removeVariant(idx)}>x</button>
                  </div>
                ))}
                {variants.length === 0 && <p style={{ fontSize: 12, color: '#999', margin: '8px 0' }}>Sin variantes - se usara color='U', talla='U' automaticamente.</p>}
              </div>
              {error && <p style={{ color: '#e53e3e', fontSize: 13 }}>{error}</p>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" style={S.btnSecondary} onClick={closeEdit}>CANCELAR</button>
                <button type="submit" style={S.btnPrimary} disabled={saving}>{saving ? 'GUARDANDO...' : editingProduct.id ? 'ACTUALIZAR' : 'CREAR PRODUCTO'}</button>
              </div>
            </form>
          )}

          {/* Tab Pedidos */}
          {tab === 'pedidos' && <PedidosTab />}

          {deleteConfirm && (
            <div style={S.confirmOverlay}>
              <div style={S.confirmBox}>
                <p style={{ fontWeight: 700, marginBottom: 16 }}>Eliminar este producto? Esta accion no se puede deshacer.</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button style={S.btnSecondary} onClick={() => setDeleteConfirm(null)}>CANCELAR</button>
                  <button style={{ ...S.btnPrimary, background: '#e53e3e' }} onClick={() => deleteProduct(deleteConfirm)}>ELIMINAR</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSync && <SyncModal onClose={() => { setShowSync(false); load(); }} />}
      {notifyProduct && <NotifyModal product={notifyProduct} onClose={() => setNotifyProduct(null)} />}
    </>
  );
}

const S = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '20px 16px' },
  panel: { background: '#fff', width: '100%', maxWidth: 980, minHeight: 400, boxShadow: '0 24px 80px rgba(0,0,0,0.35)', position: 'relative', fontFamily: "'Hanken Grotesk', sans-serif" },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 28px 0 12px', borderBottom: '2px solid #111', minHeight: 60 },
  panelTitle: { fontSize: 18, fontWeight: 900, letterSpacing: '0.08em' },
  btnClose: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' },
  btnPrimary: { background: '#111', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 800, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer', fontFamily: "'Hanken Grotesk', sans-serif" },
  btnSecondary: { background: '#fff', color: '#111', border: '1.5px solid #111', padding: '10px 20px', fontWeight: 700, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer', fontFamily: "'Hanken Grotesk', sans-serif" },
  btnSync: { background: '#f0fdf4', color: '#15803d', border: '1.5px solid #86efac', padding: '10px 18px', fontWeight: 800, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer', fontFamily: "'Hanken Grotesk', sans-serif" },
  btnEdit: { background: '#f5f5f5', color: '#111', border: '1px solid #ddd', padding: '5px 12px', fontWeight: 700, fontSize: 11, cursor: 'pointer', letterSpacing: '0.05em' },
  btnNotify: { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '5px 12px', fontWeight: 700, fontSize: 11, cursor: 'pointer', letterSpacing: '0.05em' },
  btnDelete: { background: '#fff0f0', color: '#e53e3e', border: '1px solid #fca5a5', padding: '5px 12px', fontWeight: 700, fontSize: 11, cursor: 'pointer', letterSpacing: '0.05em' },
  successBar: { background: '#f0fdf4', color: '#15803d', padding: '10px 14px', fontSize: 13, fontWeight: 600, border: '1px solid #86efac' },
  errorBar: { background: '#fff5f5', color: '#e53e3e', padding: '10px 28px', fontSize: 13, fontWeight: 600, borderBottom: '1px solid #fca5a5' },
  center: { textAlign: 'center', padding: '40px', color: '#888', fontSize: 14 },
  tableWrapper: { padding: '0 28px 28px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 20 },
  th: { textAlign: 'left', fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', color: '#888', padding: '10px 12px', borderBottom: '2px solid #111', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 12px', fontSize: 13, verticalAlign: 'middle' },
  form: { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  label: { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', color: '#444', textTransform: 'uppercase' },
  input: { border: '1.5px solid #ddd', padding: '9px 11px', fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", outline: 'none', color: '#111', fontWeight: 500 },
  variantsSection: { borderTop: '1.5px solid #eee', paddingTop: 16 },
  variantHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 2.5fr 40px', gap: 8, marginBottom: 6 },
  variantRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 2.5fr 40px', gap: 8, marginBottom: 6 },
  varInput: { border: '1px solid #ddd', padding: '7px 9px', fontSize: 12, fontFamily: "'Hanken Grotesk', sans-serif", outline: 'none' },
  btnAddVariant: { background: 'none', border: '1.5px dashed #999', color: '#555', padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' },
  btnRemoveVariant: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 15, fontWeight: 700, alignSelf: 'center' },
  confirmOverlay: { position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  confirmBox: { background: '#fff', padding: '32px 40px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', textAlign: 'center', maxWidth: 360, fontFamily: "'Hanken Grotesk', sans-serif" },
  syncOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '20px 16px' },
  syncPanel: { background: '#fff', width: '100%', maxWidth: 680, boxShadow: '0 24px 80px rgba(0,0,0,0.4)', fontFamily: "'Hanken Grotesk', sans-serif", display: 'flex', flexDirection: 'column' },
  syncStatsBar: { display: 'flex', borderBottom: '1px solid #eee' },
  statBox: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px', borderRight: '1px solid #eee' },
  statNum: { fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: '#111' },
  statLabel: { fontSize: 10, fontWeight: 700, color: '#999', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 },
  progressWrap: { padding: '12px 24px', background: '#f8fffe', borderBottom: '1px solid #e2f8f0' },
  progressBar: { height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #22c55e, #4ade80)', borderRadius: 2 },
  progressLabel: { fontSize: 12, color: '#15803d', fontWeight: 600 },
  doneBar: { background: '#f0fdf4', color: '#15803d', padding: '10px 24px', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #86efac' },
  logHeader: { padding: '12px 24px 8px', borderBottom: '1px solid #f0f0f0' },
  logList: { flex: 1, overflowY: 'auto', maxHeight: 420, minHeight: 200 },
  logEmpty: { padding: '40px 24px', textAlign: 'center', color: '#aaa', fontSize: 13 },
  logRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', borderBottom: '1px solid #f5f5f5' },
  logImg: { width: 36, height: 36, objectFit: 'cover', flexShrink: 0, background: '#f0f0f0' },
  logName: { fontSize: 13, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  logMeta: { fontSize: 11, color: '#888', marginTop: 2 },
  logBadge: { fontSize: 10, fontWeight: 800, padding: '3px 8px', letterSpacing: '0.06em', flexShrink: 0, whiteSpace: 'nowrap' },
  syncFooter: { display: 'flex', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #eee', gap: 12 },
};
