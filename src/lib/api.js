import axios from 'axios';

// Set API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ROOT_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath; // Already a full URL (e.g., from Unsplash)
  }
  // For image paths like /images/products/*, return as-is (served from public folder)
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  // For other relative paths, prepend API root URL
  return `${API_ROOT_URL}${imagePath}`;
};

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
  checkPhone: (data) => apiClient.post('/auth/check-phone', data),
  sendOTP: (data) => apiClient.post('/auth/send-otp', data),
  verifyOTP: (data) => apiClient.post('/auth/verify-otp', data),
  signupComplete: (data) => apiClient.post('/auth/signup-complete', data),
  login: (data) => apiClient.post('/auth/login', data),
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

// Product API calls with fallback to local data
export const productAPI = {
  getAll: async () => {
    try {
      return await apiClient.get('/products');
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      // Fallback to local products data
      const { products } = await import('../data/products.jsx');
      return { data: { data: products } };
    }
  },

  getByCategory: async (category) => {
    try {
      return await apiClient.get(`/products/category/${category}`);
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      const { getProductsByCategory } = await import('../data/products.jsx');
      const products = getProductsByCategory(category);
      return { data: { data: products } };
    }
  },

  getById: async (id) => {
    try {
      return await apiClient.get(`/products/${id}`);
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      const { getProductById } = await import('../data/products.jsx');
      const product = getProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return { data: { data: product } };
    }
  },

  getBestsellers: async () => {
    try {
      return await apiClient.get('/products/bestseller/products');
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      const { getBestsellerProducts } = await import('../data/products.jsx');
      const products = getBestsellerProducts();
      return { data: { data: products } };
    }
  },

  getDeliverable: async () => {
    try {
      return await apiClient.get('/products/deliverable/list');
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      const { getProductsByCategory } = await import('../data/products.jsx');
      const allProducts = getProductsByCategory('all');
      const deliverable = allProducts.filter(p => p.isDeliverable);
      return { data: { data: deliverable } };
    }
  },
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

// Cart API calls
export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (data) => apiClient.post('/cart/add', data),
  updateCart: (productId, data) => apiClient.patch(`/cart/update/${productId}`, data),
  removeFromCart: (productId, selectedCoating, selectedFlavor) => {
    const params = {};
    if (selectedCoating) params.selectedCoating = selectedCoating;
    if (selectedFlavor) params.selectedFlavor = selectedFlavor;
    return apiClient.delete(`/cart/remove/${productId}`, { params });
  },
  clearCart: () => apiClient.delete('/cart/clear'),
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
