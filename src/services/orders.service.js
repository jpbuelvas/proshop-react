import api from './api';

export const createOrder = (dto) =>
  api.post('/orders', dto).then((r) => r.data);

export const checkStock = (cartItems) =>
  api.post('/products/stock-check', {
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.qty,
      color: item.color ?? null,
      size: item.size ?? null,
    })),
  }).then((r) => r.data);

export const getOrders = () =>
  api.get('/orders').then((r) => r.data);

export const getOrder = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data);

export const initPayment = (orderId) =>
  api.post('/payments/init', { orderId }).then((r) => r.data);
