// API Configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Reservation endpoints
  RESERVATION_SEND: `${API_BASE_URL}/reservations/send`,
  
  // Cart endpoints
  CART_ADD: `${API_BASE_URL}/cart/add`,
  CART_GET: `${API_BASE_URL}/cart`,
  
  // Order endpoints
  ORDERS_PLACE: `${API_BASE_URL}/orders/place`,
  ORDERS_ALL: `${API_BASE_URL}/orders/all`,
  ORDERS_HISTORY: `${API_BASE_URL}/orders/history`,
  ORDERS_STATUS: `${API_BASE_URL}/orders/status`,
  ORDERS_MARK_DELIVERED: `${API_BASE_URL}/orders/mark-delivered`, // Secure employee-only endpoint
};

export default API_BASE_URL;
