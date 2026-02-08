import axios from 'axios';

// Set API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  addAddress: (data) => apiClient.post('/auth/addresses', data),
};

// Admin Auth API calls
export const adminAuthAPI = {
  login: (username, password) => apiClient.post('/admin/auth/login', { username, password }),
  getProfile: () => apiClient.get('/admin/auth/profile'),
  verifyToken: () => apiClient.get('/admin/auth/verify'),
};

// Product API calls
export const productAPI = {
  getAll: () => apiClient.get('/products'),
  getByCategory: (category) => apiClient.get(`/products/category/${category}`),
  getById: (id) => apiClient.get(`/products/${id}`),
  getBestsellers: () => apiClient.get('/products/bestseller/products'),
  getDeliverable: () => apiClient.get('/products/deliverable/list'),
};

// Order API calls
export const orderAPI = {
  create: (data) => apiClient.post('/orders/create', data),
  getMyOrders: () => apiClient.get('/orders/my-orders'),
  getOrderById: (orderId) => apiClient.get(`/orders/${orderId}`),
  initiatePayment: (orderId) => apiClient.post('/orders/payment/initiate', { orderId }),
  verifyPayment: (data) => apiClient.post('/orders/payment/verify', data),
};

// Payment API calls
export const paymentAPI = {
  getRazorpayKey: () => apiClient.get('/payments/config/razorpay-key'),
  getPaymentStatus: (orderId) => apiClient.get(`/payments/status/${orderId}`),
};

// Admin API calls (requires admin token)
const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminOrderAPI = {
  getAll: (params = {}) => adminApiClient.get('/admin/orders', { params }),
  getById: (orderId) => adminApiClient.get(`/admin/orders/${orderId}`),
  updateStatus: (orderId, data) => adminApiClient.put(`/admin/orders/${orderId}/status`, data),
  getDashboardAnalytics: (params = {}) => adminApiClient.get('/admin/orders/analytics/dashboard', { params }),
  getPaymentAnalytics: (params = {}) => adminApiClient.get('/admin/orders/analytics/payments', { params }),
  getDeliveryOverview: () => adminApiClient.get('/admin/orders/delivery/overview'),
};

export default apiClient;
