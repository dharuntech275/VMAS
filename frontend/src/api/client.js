/**
 * VMAS API Client - Fetch wrapper for Django REST Framework backend
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText || 'Network response error' };
    }
    const error = new Error(
      errorData?.detail ||
      (typeof errorData === 'object' ? JSON.stringify(errorData) : 'API Request failed')
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

export const api = {
  // Fetch available food packs
  getMenu: () => request('/menu/'),

  // Create a new order
  createOrder: (orderPayload) =>
    request('/orders/', {
      method: 'POST',
      body: orderPayload,
    }),

  // Track order by id and verified phone
  getOrderStatus: (orderId, phone) =>
    request(`/orders/${orderId}/?phone=${encodeURIComponent(phone)}`),
};

export default api;
