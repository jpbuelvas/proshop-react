export const THEME = { sale: '#c8102e' };

// Mapeo de nombre de color (como viene del backend) a hex para mostrar swatches
export const COLOR_MAP = {
  NEGRO:   '#1a1a1a',
  BLANCO:  '#f5f5f5',
  GRIS:    '#8a8a8a',
  AZUL:    '#1e40af',
  VERDE:   '#166534',
  ROJO:    '#dc2626',
  CORAL:   '#f97316',
  MORADO:  '#7c3aed',
  PLATA:   '#c0c0c0',
  DORADO:  '#d97706',
  ROSADO:  '#ec4899',
  NARANJA: '#ea580c',
  CAFE:    '#92400e',
  BEIGE:   '#d4b896',
};

export const CAT = {
  ropa: 'Ropa Deportiva',
  accesorios: 'Accesorios',
  equipos: 'Equipos',
  outlet: 'Outlet',
};

export const COLORS = {
  ropa: ['#1a1a1a', '#7d8a72', '#b9614a'],
  accesorios: ['#1a1a1a', '#e7e2d8', '#b9614a'],
  equipos: ['#1a1a1a', '#d9c7a8', '#8a9a8e'],
  outlet: ['#1a1a1a', '#c8102e', '#8a8a8a'],
};

export const DESC = {
  ropa: 'Tejido transpirable de secado rápido con costuras planas para máxima libertad de movimiento. Ideal para entrenamientos de alta intensidad y para tu día a día.',
  accesorios: 'Diseño resistente y compacto pensado para el día a día. Materiales de alta calidad y rendimiento para cada rutina.',
  equipos: 'Equipamiento profesional para maximizar tu rendimiento en cada sesión de entrenamiento.',
  outlet: 'Selección con descuento por tiempo limitado. Mismos estándares de calidad, precios rebajados.',
};

export const EDIT_TITLES = {
  ropa: 'DOMINA TU ENTRENAMIENTO',
  accesorios: 'ACCESORIOS PARA CADA RUTINA',
  equipos: 'EQUÍPATE PARA RENDIR',
  outlet: 'OFERTAS POR TIEMPO LIMITADO',
};

export const EDIT_SUBS = {
  ropa: 'COLECCIÓN 2026',
  accesorios: 'EQUIPAMIENTO',
  equipos: 'EQUIPOS PRO',
  outlet: 'HASTA 40% OFF',
};

export const EDIT_LINKS = {
  ropa: 'VER ROPA DEPORTIVA →',
  accesorios: 'VER ACCESORIOS →',
  equipos: 'VER EQUIPOS →',
  outlet: 'VER OUTLET →',
};

export function fmt(n) {
  return '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
