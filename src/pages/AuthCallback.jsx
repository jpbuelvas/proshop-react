import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

/**
 * Página de callback OAuth.
 * El backend redirige aquí con ?token=xxx después del login social.
 * Guardamos el JWT y cargamos el perfil del usuario.
 */
export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/');
      return;
    }

    setToken(token);

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data);
        navigate('/');
      })
      .catch(() => {
        navigate('/');
      });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        fontFamily: "'Hanken Grotesk', sans-serif",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: '#555',
      }}
    >
      Iniciando sesión...
    </div>
  );
}
