export const THEME = { sale: '#c8102e' };

export const CAT = {
  ropa: 'Ropa Deportiva',
  audio: 'Audífonos',
  termos: 'Termos',
  acc: 'Accesorios',
};

export const COLORS = {
  ropa: ['#1a1a1a', '#7d8a72', '#b9614a'],
  audio: ['#1a1a1a', '#e7e2d8', '#5a6b7d'],
  termos: ['#1a1a1a', '#d9c7a8', '#8a9a8e'],
  acc: ['#1a1a1a', '#e7e2d8', '#b9614a'],
};

export const DESC = {
  ropa: 'Tejido transpirable de secado rápido con costuras planas para máxima libertad de movimiento. Ideal para entrenamientos de alta intensidad y para tu día a día.',
  audio: 'Sonido envolvente con graves potentes y cancelación de ruido activa. Batería de larga duración y conexión estable para tus rutinas, llamadas y viajes.',
  termos: 'Acero inoxidable de doble pared que conserva la temperatura hasta 12 horas. Libre de BPA, antigoteo y muy fácil de limpiar.',
  acc: 'Diseño resistente y compacto pensado para el día a día. Materiales de alta calidad y compatibilidad con los modelos más populares.',
};

export const EDIT_TITLES = {
  ropa: 'DOMINA TU ENTRENAMIENTO',
  audio: 'SONIDO DE ALTA PERFORMANCE',
  termos: 'HIDRATACIÓN PROFESIONAL',
  acc: 'ACCESORIOS PARA CADA RUTINA',
};

export const EDIT_SUBS = {
  ropa: 'COLECCIÓN 2026',
  audio: 'AUDIO PREMIUM',
  termos: 'TERMOS E HIDRATACIÓN',
  acc: 'EQUIPAMIENTO',
};

export const EDIT_LINKS = {
  ropa: 'VER ROPA DEPORTIVA →',
  audio: 'VER AUDÍFONOS →',
  termos: 'VER TERMOS →',
  acc: 'VER ACCESORIOS →',
};

export const PRODUCTS = [
  { id: 1, name: 'Leggings Compresión Pro', cat: 'ropa', gender: ['W'], price: 89900, old: 119900, rating: 4.8, reviews: 214, sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 2, name: 'Camiseta Dry-Fit', cat: 'ropa', gender: ['M', 'U'], price: 49900, old: 69900, rating: 4.7, reviews: 168, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 3, name: 'Sudadera con Capucha', cat: 'ropa', gender: ['U'], price: 129900, old: 0, rating: 4.9, reviews: 96, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 4, name: 'Shorts Running', cat: 'ropa', gender: ['M'], price: 54900, old: 74900, rating: 4.6, reviews: 131, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 5, name: 'Top Deportivo', cat: 'ropa', gender: ['W'], price: 44900, old: 0, rating: 4.7, reviews: 88, sizes: ['XS', 'S', 'M', 'L'] },
  { id: 6, name: 'Audífonos Inalámbricos X1', cat: 'audio', gender: ['U'], price: 159900, old: 219900, rating: 4.8, reviews: 342 },
  { id: 7, name: 'Audífonos Serie 3', cat: 'audio', gender: ['U'], price: 99900, old: 139900, rating: 4.6, reviews: 205, img: '/airpodsS3.png' },
  { id: 8, name: 'Audífonos Max', cat: 'audio', gender: ['U'], price: 249900, old: 299900, rating: 4.9, reviews: 117, img: '/airpodsMax.webp' },
  { id: 9, name: 'Termo Acero 750ml', cat: 'termos', gender: ['U'], price: 59900, old: 79900, rating: 4.8, reviews: 189 },
  { id: 10, name: 'Botella Térmica 1L', cat: 'termos', gender: ['U'], price: 69900, old: 0, rating: 4.7, reviews: 142 },
  { id: 11, name: 'Termo Café To-Go', cat: 'termos', gender: ['U'], price: 39900, old: 0, rating: 4.5, reviews: 77 },
  { id: 12, name: 'Funda Antichoque', cat: 'acc', gender: ['U'], price: 29900, old: 0, rating: 4.6, reviews: 260 },
  { id: 13, name: 'Cargador Rápido 30W', cat: 'acc', gender: ['U'], price: 49900, old: 64900, rating: 4.7, reviews: 198 },
  { id: 14, name: 'Power Bank 20.000mAh', cat: 'acc', gender: ['U'], price: 89900, old: 109900, rating: 4.8, reviews: 153 },
  { id: 15, name: 'Soporte para Auto', cat: 'acc', gender: ['U'], price: 34900, old: 0, rating: 4.5, reviews: 121 },
];

export function fmt(n) {
  return '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
}
