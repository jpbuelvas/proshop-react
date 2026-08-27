import { useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_URL}/auth/google`;

export default function RegisterPage({ onSuccess, onGoLogin, onClose }) {
  const { setToken, setUser } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successName, setSuccessName] = useState('');

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      setToken(res.data.token);
      setUser(res.data.user);
      setSuccessName(res.data.user?.name?.split(' ')[0] || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (successName) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.card} onClick={(e) => e.stopPropagation()}>
          <button style={styles.close} onClick={onClose}>✕</button>
          <div style={styles.successWrap}>
            <SuccessIcon />
            <h2 style={styles.successTitle}>CUENTA CREADA</h2>
            <p style={styles.successText}>¡Bienvenido, {successName}! Ya estás dentro.</p>
            <button style={{ ...styles.btn, width: '100%' }} onClick={onSuccess}>CONTINUAR</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>✕</button>
        <h2 style={styles.title}>CREAR CUENTA</h2>

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            name="name"
            type="text"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handle}
            required
          />
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handle}
            required
          />
          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={form.password}
            onChange={handle}
            minLength={6}
            required
          />
          {error && (
            <div style={styles.errorBanner}>
              <ErrorIcon />
              <p style={styles.errorText}>{error}</p>
            </div>
          )}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
          </button>
        </form>

        <div style={styles.divider}><span>O</span></div>

        <a href={GOOGLE_LOGIN_URL} style={styles.googleBtn}>
          <GoogleIcon /> CONTINUAR CON GOOGLE
        </a>

        <p style={styles.switch}>
          ¿Ya tienes cuenta?{' '}
          <button style={styles.link} onClick={onGoLogin}>Inicia sesión</button>
        </p>
      </div>
    </div>
  );
}

function SuccessIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" style={{ marginBottom: 18 }}>
      <circle cx="26" cy="26" r="25" fill="none" stroke="#111" strokeWidth="2" />
      <path d="M15 27l7 7 15-15" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="7" fill="none" stroke="#c8102e" strokeWidth="1.6" />
      <line x1="8" y1="4.5" x2="8" y2="8.5" stroke="#c8102e" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.2" r="0.9" fill="#c8102e" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  card: {
    background: '#fff', padding: '40px 36px', width: '100%', maxWidth: 400,
    position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  close: {
    position: 'absolute', top: 14, right: 16, background: 'none',
    border: 'none', fontSize: 18, cursor: 'pointer', color: '#888',
  },
  title: {
    fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 20, fontWeight: 800,
    letterSpacing: '0.08em', marginBottom: 24, textAlign: 'center',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    border: '1.5px solid #ddd', padding: '12px 14px', fontSize: 14,
    fontFamily: "'Hanken Grotesk', sans-serif", outline: 'none',
  },
  errorBanner: {
    display: 'flex', alignItems: 'flex-start', gap: 9,
    background: '#fce8e6', padding: '12px 14px',
  },
  errorText: { color: '#c8102e', fontSize: 13.5, fontWeight: 600, margin: 0, lineHeight: 1.4 },
  successWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', padding: '8px 0 4px',
  },
  successTitle: {
    fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 20, fontWeight: 800,
    letterSpacing: '0.08em', margin: '0 0 8px', textTransform: 'uppercase',
  },
  successText: { fontSize: 13, color: '#666', margin: '0 0 28px', lineHeight: 1.5 },
  btn: {
    background: '#111', color: '#fff', border: 'none', padding: '13px',
    fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', cursor: 'pointer',
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
  divider: {
    textAlign: 'center', margin: '18px 0', fontSize: 12, color: '#999',
    borderTop: '1px solid #eee', lineHeight: 0,
  },
  googleBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1.5px solid #ddd', padding: '11px', textDecoration: 'none',
    color: '#333', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
    fontFamily: "'Hanken Grotesk', sans-serif", cursor: 'pointer',
    marginTop: 12,
  },
  switch: { textAlign: 'center', fontSize: 13, color: '#666', marginTop: 18 },
  link: {
    background: 'none', border: 'none', color: '#111', fontWeight: 700,
    cursor: 'pointer', textDecoration: 'underline', fontSize: 13,
    fontFamily: "'Hanken Grotesk', sans-serif",
  },
};
