import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// Adjunta el JWT en cada request automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token expiró o es inválido, limpiar sesión
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthAttempt = ['/auth/login', '/auth/register'].some((path) =>
      err.config?.url?.includes(path),
    );
    if (err.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  },
);

export default api;
