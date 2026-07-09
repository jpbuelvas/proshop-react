import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const EMPTY_PRODUCT = {
  name: '', description: '', price: '', previousPrice: '',
  category: 'ropa', gender: ['U'], imageUrl: '',
};

const EMPTY_VARIANT = { color: 'U', size: 'U', available: 0, specialPrice: '', imageUrl: '' };

const CATEGORIES = ['ropa', 'calzado', 'accesorios', 'equipos'];
const GENDERS = ['U', 'M', 'W'];

export default function AdminPage({ onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // null | product obj
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // product id

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch {
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingProduct({ ...EMPTY_PRODUCT });
    setVariants([{ ...EMPTY_VARIANT }]);
    setError('');
  };

  const openEdit = (p) => {
    setEditingProduct({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price,
      previousPrice: p.previousPrice || '',
      category: p.category,
      gender: p.gender || ['U'],
      imageUrl: p.imageUrl || '',
    });
    setVariants((p.variants || []).map((v) => ({
      id: v.id,
      color: v.color,
      size: v.size,
      available: v.available,
      specialPrice: v.specialPrice || '',
      imageUrl: v.imageUrl || '',
    })));
    setError('');
  };

  const closeEdit = () => { setEditingProduct(null); setVariants([]); setError(''); };

  const handleField = (e) => {
    const { name, value } = e.target;
    setEditingProduct((p) => ({ ...p, [name]: value }));
  };

  const toggleGender = (g) => {
    setEditingProduct((p) => {
      const cur = p.gender || [];
      return { ...p, gender: cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g] };
    });
  };

  const handleVariantField = (idx, field, value) => {
    setVariants((vs) => vs.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  const addVariant = () => setVariants((vs) => [...vs, { ...EMPTY_VARIANT }]);
  const removeVariant = (idx) => setVariants((vs) => vs.filter((_, i) => i !== idx));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = {
        name: editingProduct.name,
        description: editingProduct.description || undefined,
        price: Number(editingProduct.price),
        previousPrice: editingProduct.previousPrice ? Number(editingProduct.previousPrice) : undefined,
        category: editingProduct.category,
        gender: editingProduct.gender,
        imageUrl: editingProduct.imageUrl || undefined,
        variants: variants.map((v) => ({
          ...(v.id ? { id: v.id } : {}),
          color: v.color || 'U',
          size: v.size || 'U',
          available: Number(v.available) || 0,
          specialPrice: v.specialPrice ? Number(v.specialPrice) : undefined,
          imageUrl: v.imageUrl || undefined,
        })),
      };

      if (editingProduct.id) {
        await api.put(`/products/${editingProduct.id}`, body);
      } else {
        await api.post('/products', body);
      }
      closeEdit();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setDeleteConfirm(null);
      load();
    } catch {
      setError('Error al eliminar');
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={S.panelHeader}>
          <h2 style={S.panelTitle}>ADMIN · PRODUCTOS</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={S.btnPrimary} onClick={openCreate}>+ NUEVO</button>
            <button style={S.btnClose} onClick={onClose}>✕</button>
          </div>
        </div>

        {error && <div style={S.errorBar}>{error}</div>}

        {/* Lista de productos */}
        {!editingProduct && (
          loading ? (
            <div style={S.center}>Cargando...</div>
          ) : (
            <div style={S.tableWrapper}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {['ID', 'Nombre', 'Categoría', 'Precio', 'Variantes', 'Acciones'].map((h) => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={S.tr}>
                      <td style={S.td}>{p.id}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{p.name}</td>
                      <td style={S.td}>{p.category}</td>
                      <td style={S.td}>${Number(p.price).toLocaleString('es-CO')}</td>
                      <td style={S.td}>{(p.variants || []).length}</td>
                      <td style={{ ...S.td, display: 'flex', gap: 8 }}>
                        <button style={S.btnEdit} onClick={() => openEdit(p)}>EDITAR</button>
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

        {/* Formulario editar / crear */}
        {editingProduct && (
          <form onSubmit={save} style={S.form}>
            <div style={S.formGrid}>
              <label style={S.label}>
                Nombre *
                <input style={S.input} name="name" value={editingProduct.name} onChange={handleField} required />
              </label>
              <label style={S.label}>
                Categoría *
                <select style={S.input} name="category" value={editingProduct.category} onChange={handleField}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label style={S.label}>
                Precio *
                <input style={S.input} name="price" type="number" min="0" step="100" value={editingProduct.price} onChange={handleField} required />
              </label>
              <label style={S.label}>
                Precio anterior
                <input style={S.input} name="previousPrice" type="number" min="0" step="100" value={editingProduct.previousPrice} onChange={handleField} />
              </label>
              <label style={S.label}>
                URL imagen principal
                <input style={S.input} name="imageUrl" value={editingProduct.imageUrl} onChange={handleField} placeholder="https://..." />
              </label>
              <div style={S.label}>
                Género
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  {GENDERS.map((g) => (
                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={(editingProduct.gender || []).includes(g)}
                        onChange={() => toggleGender(g)}
                      />
                      {g === 'U' ? 'Unisex' : g === 'M' ? 'Hombre' : 'Mujer'}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <label style={S.label}>
              Descripción
              <textarea style={{ ...S.input, minHeight: 72, resize: 'vertical' }} name="description" value={editingProduct.description} onChange={handleField} />
            </label>

            {/* Variantes */}
            <div style={S.variantsSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.06em' }}>VARIANTES (color + talla)</h3>
                <button type="button" style={S.btnAddVariant} onClick={addVariant}>+ AGREGAR</button>
              </div>
              <div style={S.variantHeader}>
                {['Color', 'Talla', 'Stock', 'Precio especial', 'URL imagen', ''].map((h) => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>
              {variants.map((v, idx) => (
                <div key={idx} style={S.variantRow}>
                  <input style={S.varInput} placeholder="NEGRO (U=sin color)" value={v.color} onChange={(e) => handleVariantField(idx, 'color', e.target.value)} />
                  <input style={S.varInput} placeholder="M (U=única)" value={v.size} onChange={(e) => handleVariantField(idx, 'size', e.target.value)} />
                  <input style={S.varInput} type="number" min="0" placeholder="0" value={v.available} onChange={(e) => handleVariantField(idx, 'available', e.target.value)} />
                  <input style={S.varInput} type="number" min="0" step="100" placeholder="—" value={v.specialPrice} onChange={(e) => handleVariantField(idx, 'specialPrice', e.target.value)} />
                  <input style={S.varInput} placeholder="https://..." value={v.imageUrl} onChange={(e) => handleVariantField(idx, 'imageUrl', e.target.value)} />
                  <button type="button" style={S.btnRemoveVariant} onClick={() => removeVariant(idx)}>✕</button>
                </div>
              ))}
              {variants.length === 0 && (
                <p style={{ fontSize: 12, color: '#999', margin: '8px 0' }}>
                  Sin variantes → se usará color='U', talla='U' automáticamente si dejas vacío.
                </p>
              )}
            </div>

            {error && <p style={{ color: '#e53e3e', fontSize: 13 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" style={S.btnSecondary} onClick={closeEdit}>CANCELAR</button>
              <button type="submit" style={S.btnPrimary} disabled={saving}>
                {saving ? 'GUARDANDO...' : editingProduct.id ? 'ACTUALIZAR' : 'CREAR PRODUCTO'}
              </button>
            </div>
          </form>
        )}

        {/* Confirm delete */}
        {deleteConfirm && (
          <div style={S.confirmOverlay}>
            <div style={S.confirmBox}>
              <p style={{ fontWeight: 700, marginBottom: 16 }}>¿Eliminar este producto? Esta acción no se puede deshacer.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button style={S.btnSecondary} onClick={() => setDeleteConfirm(null)}>CANCELAR</button>
                <button style={{ ...S.btnPrimary, background: '#e53e3e' }} onClick={() => deleteProduct(deleteConfirm)}>ELIMINAR</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
    zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    overflowY: 'auto', padding: '20px 16px',
  },
  panel: {
    background: '#fff', width: '100%', maxWidth: 960, minHeight: 400,
    boxShadow: '0 24px 80px rgba(0,0,0,0.35)', position: 'relative',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  panelHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 28px', borderBottom: '2px solid #111',
  },
  panelTitle: { fontSize: 18, fontWeight: 900, letterSpacing: '0.08em' },
  btnClose: {
    background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666', lineHeight: 1,
  },
  btnPrimary: {
    background: '#111', color: '#fff', border: 'none', padding: '10px 20px',
    fontWeight: 800, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  btnSecondary: {
    background: '#fff', color: '#111', border: '1.5px solid #111', padding: '10px 20px',
    fontWeight: 700, fontSize: 12, letterSpacing: '0.07em', cursor: 'pointer',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  btnEdit: {
    background: '#f5f5f5', color: '#111', border: '1px solid #ddd', padding: '5px 12px',
    fontWeight: 700, fontSize: 11, cursor: 'pointer', letterSpacing: '0.05em',
  },
  btnDelete: {
    background: '#fff0f0', color: '#e53e3e', border: '1px solid #fca5a5', padding: '5px 12px',
    fontWeight: 700, fontSize: 11, cursor: 'pointer', letterSpacing: '0.05em',
  },
  errorBar: {
    background: '#fff5f5', color: '#e53e3e', padding: '10px 28px',
    fontSize: 13, fontWeight: 600, borderBottom: '1px solid #fca5a5',
  },
  center: { textAlign: 'center', padding: '40px', color: '#888', fontSize: 14 },
  tableWrapper: { padding: '0 28px 28px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 20 },
  th: {
    textAlign: 'left', fontSize: 11, fontWeight: 800, letterSpacing: '0.07em',
    color: '#888', padding: '10px 12px', borderBottom: '2px solid #111', textTransform: 'uppercase',
  },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 12px', fontSize: 13, verticalAlign: 'middle' },
  form: { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  label: { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', color: '#444', textTransform: 'uppercase' },
  input: {
    border: '1.5px solid #ddd', padding: '9px 11px', fontSize: 13,
    fontFamily: "'Hanken Grotesk', sans-serif", outline: 'none', color: '#111',
    fontWeight: 500,
  },
  variantsSection: { borderTop: '1.5px solid #eee', paddingTop: 16 },
  variantHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 2.5fr 40px', gap: 8, marginBottom: 6 },
  variantRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 2.5fr 40px', gap: 8, marginBottom: 6 },
  varInput: {
    border: '1px solid #ddd', padding: '7px 9px', fontSize: 12,
    fontFamily: "'Hanken Grotesk', sans-serif", outline: 'none',
  },
  btnAddVariant: {
    background: 'none', border: '1.5px dashed #999', color: '#555', padding: '5px 14px',
    fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em',
  },
  btnRemoveVariant: {
    background: 'none', border: 'none', color: '#ccc', cursor: 'pointer',
    fontSize: 15, fontWeight: 700, alignSelf: 'center',
  },
  confirmOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  confirmBox: {
    background: '#fff', padding: '32px 40px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    textAlign: 'center', maxWidth: 360, fontFamily: "'Hanken Grotesk', sans-serif",
  },
};
