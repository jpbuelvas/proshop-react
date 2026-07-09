import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { createOrder, initPayment } from '../services/orders.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * CheckoutPage
 * Recibe cartSummary y cartItems desde App.jsx
 * Flujo: formulario de envío → POST /orders → POST /payments/init → widget Wompi
 */
export default function CheckoutPage({ cartItems, total, onBack, onSuccess }) {
  const { token } = useAuthStore();
  const [form, setForm] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wompiData, setWompiData] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Debes iniciar sesión para continuar');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Crear orden en backend
      const orderDto = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.qty,
          unitPrice: item.price,
          size: item.size ?? null,
          color: item.color || null,
        })),
        total,
        ...form,
      };
      const order = await createOrder(orderDto);

      // 2. Inicializar pago — obtener datos para el widget Wompi
      const paymentData = await initPayment(order.id);
      setWompiData(paymentData);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  // Una vez que tenemos los datos de Wompi, inyectar el widget
  const launchWompi = () => {
    // Limpiar widget anterior si existe
    const container = document.getElementById('wompi-container');
    if (!container) return;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.setAttribute('data-render', 'button');
    script.setAttribute('data-public-key', wompiData.publicKey);
    script.setAttribute('data-currency', wompiData.currency);
    script.setAttribute('data-amount-in-cents', String(wompiData.amountInCents));
    script.setAttribute('data-reference', wompiData.reference);
    script.setAttribute('data-signature:integrity', wompiData.signature);
    const redirectUrl = import.meta.env.VITE_REDIRECT_URL || `${window.location.origin}/orders`;
    script.setAttribute('data-redirect-url', redirectUrl);
    container.appendChild(script);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #ccc',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.12s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: '#555',
    marginBottom: 6,
  };

  return (
    <section style={{ padding: 'clamp(28px, 4vw, 48px) 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(24px, 5vw, 60px)' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', textTransform: 'uppercase', margin: '0 0 32px' }}>
          DATOS DE ENVÍO
        </h1>

        {!wompiData ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Dirección</label>
              <input
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                required
                placeholder="Calle 123 # 45-67"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#111')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              />
            </div>
            <div>
              <label style={labelStyle}>Ciudad</label>
              <input
                name="shippingCity"
                value={form.shippingCity}
                onChange={handleChange}
                required
                placeholder="Bogotá"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#111')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              />
            </div>
            <div>
              <label style={labelStyle}>Teléfono de contacto</label>
              <input
                name="shippingPhone"
                value={form.shippingPhone}
                onChange={handleChange}
                required
                placeholder="+57 300 000 0000"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#111')}
                onBlur={(e) => (e.target.style.borderColor = '#ccc')}
              />
            </div>

            {error && (
              <div style={{ background: '#fce8e6', color: '#c8102e', padding: '12px 16px', fontSize: 13.5, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={onBack}
                style={{ flex: 1, padding: 15, border: '1.5px solid #111', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', background: '#fff', color: '#111' }}
              >
                VOLVER
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ flex: 2, padding: 15, background: loading ? '#666' : '#111', color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', border: 'none' }}
              >
                {loading ? 'PROCESANDO...' : 'IR A PAGAR'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#f0f0f0', padding: '20px 24px', marginBottom: 24, borderLeft: '4px solid #111' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Pedido creado ✓</div>
              <div style={{ fontSize: 13, color: '#555' }}>
                Referencia: <strong>{wompiData.reference}</strong>
              </div>
              <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
                Total: <strong>${Number(wompiData.amountInCents / 100).toLocaleString('es-CO')}</strong>
              </div>
            </div>

            <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
              Haz clic para abrir el pago seguro con Wompi:
            </p>

            <div id="wompi-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }} />

            <button
              onClick={launchWompi}
              style={{ background: '#111', color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '16px 40px', border: 'none' }}
            >
              PAGAR CON WOMPI
            </button>

            <p style={{ fontSize: 11.5, color: '#aaa', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pago seguro · SSL cifrado · Wompi by Bancolombia
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
