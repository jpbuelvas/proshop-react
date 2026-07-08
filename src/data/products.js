export const THEME = { sale: '#c8102e' };

export const CAT = {
  ropa: 'Ropa Deportiva',
  calzado: 'Calzado',
  accesorios: 'Accesorios',
  equipos: 'Equipos',
};

export const COLORS = {
  ropa: ['#1a1a1a', '#7d8a72', '#b9614a'],
  calzado: ['#1a1a1a', '#e7e2d8', '#5a6b7d'],
  accesorios: ['#1a1a1a', '#e7e2d8', '#b9614a'],
  equipos: ['#1a1a1a', '#d9c7a8', '#8a9a8e'],
};

export const DESC = {
  ropa: 'Tejido transpirable de secado rápido con costuras planas para máxima libertad de movimiento. Ideal para entrenamientos de alta intensidad y para tu día a día.',
  calzado: 'Calzado técnico de alto rendimiento con amortiguación reactiva y soporte estructural para cada tipo de entrenamiento.',
  accesorios: 'Diseño resistente y compacto pensado para el día a día. Materiales de alta calidad y rendimiento para cada rutina.',
  equipos: 'Equipamiento profesional para maximizar tu rendimiento en cada sesión de entrenamiento.',
};

export const EDIT_TITLES = {
  ropa: 'DOMINA TU ENTRENAMIENTO',
  calzado: 'RENDIMIENTO EN CADA PASO',
  accesorios: 'ACCESORIOS PARA CADA RUTINA',
  equipos: 'EQUÍPATE PARA RENDIR',
};

export const EDIT_SUBS = {
  ropa: 'COLECCIÓN 2026',
  calzado: 'CALZADO TÉCNICO',
  accesorios: 'EQUIPAMIENTO',
  equipos: 'EQUIPOS PRO',
};

export const EDIT_LINKS = {
  ropa: 'VER ROPA DEPORTIVA →',
  calzado: 'VER CALZADO →',
  accesorios: 'VER ACCESORIOS →',
  equipos: 'VER EQUIPOS →',
};

export function fmt(n) {
  return '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
