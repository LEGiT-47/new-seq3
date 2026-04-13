import axios from 'axios';
import { normalizeProduct, normalizeProducts } from './productUtils';

// Set API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ROOT_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath; // Already a full URL (e.g., from Unsplash)
  }

  // Keep root-relative URLs on the current origin.
  // This covers both public assets (/images/*) and bundled assets (/assets/*).
  if (imagePath.startsWith('/')) {
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
  sendVerificationEmail: (data) => apiClient.post('/auth/send-verification-email', data),
  verifyEmail: (data) => apiClient.post('/auth/verify-email', data),
  signupComplete: (data) => apiClient.post('/auth/signup-complete', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  addAddress: (data) => apiClient.post('/auth/addresses', data),
  // Forgot password endpoints
  forgotPasswordInitiate: (data) => apiClient.post('/auth/forgot-password/initiate', data),
  forgotPasswordVerifyOtp: (data) => apiClient.post('/auth/forgot-password/verify-otp', data),
  forgotPasswordReset: (data) => apiClient.post('/auth/forgot-password/reset', data),
  // Change password endpoint
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};

// Admin Auth API calls (will use adminApiClient after it's defined below)
export const adminAuthAPI = {
  login: (username, password) => apiClient.post('/admin/auth/login', { username, password }),
  getProfile: null, // Will be set below after adminApiClient is created
  verifyToken: null, // Will be set below after adminApiClient is created
};

// Create a mapping of local product metadata
const createLocalProductMap = async () => {
  const { products: localProducts } = await import('../data/products.jsx');
  const productMap = {};

  localProducts.forEach(product => {
    const normalizedName = String(product.name || '').toLowerCase();

    if (product.id !== undefined && product.id !== null) {
      productMap[`id:${product.id}`] = product;
    }

    if (normalizedName) {
      productMap[`name:${normalizedName}`] = product;
    }

    if (product.image && typeof product.image === 'string') {
      const filename = product.image.split('/').pop().toLowerCase();
      productMap[`file:${filename}`] = product;
    }
  });

  return productMap;
};

// Helper function to merge local images with backend products
const enrichProductsWithImages = async (products, options = {}) => {
  const { includeLocalOnly = false } = options;
  const productMap = await createLocalProductMap();
  const { products: localProducts } = await import('../data/products.jsx');

  const enrichedProducts = products.map(product => {
    const lookupKeys = [];

    if (product.productId !== undefined && product.productId !== null) {
      lookupKeys.push(`id:${product.productId}`);
    }
    if (product.id !== undefined && product.id !== null) {
      lookupKeys.push(`id:${product.id}`);
    }
    if (product.name) {
      lookupKeys.push(`name:${String(product.name).toLowerCase()}`);
    }
    if (product.image) {
      const filename = product.image.split('/').pop().toLowerCase();
      lookupKeys.push(`file:${filename}`);
    }

    const localProduct = lookupKeys.map((key) => productMap[key]).find(Boolean);

    if (localProduct) {
      return normalizeProduct({
        ...product,
        image: localProduct.image || product.image,
        images:
          Array.isArray(localProduct.images) && localProduct.images.length > 0
            ? localProduct.images
            : product.images,
        ingredients: localProduct.ingredients || product.ingredients,
        nutrition: localProduct.nutrition || product.nutrition,
        storageInfo: localProduct.storageInfo || product.storageInfo,
        shelfLife: localProduct.shelfLife || product.shelfLife,
        netWeight: localProduct.netWeight || product.netWeight,
      });
    }

    if (product.image && typeof product.image === 'string') {
      const filename = product.image.split('/').pop().toLowerCase();
      const fallbackProduct = productMap[`file:${filename}`];
      if (fallbackProduct) {
        return normalizeProduct({
          ...product,
          image: fallbackProduct.image || product.image,
          images: fallbackProduct.images || product.images,
          ingredients: fallbackProduct.ingredients || product.ingredients,
          nutrition: fallbackProduct.nutrition || product.nutrition,
          storageInfo: fallbackProduct.storageInfo || product.storageInfo,
          shelfLife: fallbackProduct.shelfLife || product.shelfLife,
          netWeight: fallbackProduct.netWeight || product.netWeight,
        });
      }
    }

    return normalizeProduct(product);
  });

  if (!includeLocalOnly) {
    return enrichedProducts;
  }

  const backendIds = new Set(enrichedProducts.map((product) => product.productId ?? product.id).filter((id) => id !== undefined && id !== null));
  const localOnlyProducts = localProducts.filter((product) => !backendIds.has(product.id)).map((product) => normalizeProduct(product));

  return [...enrichedProducts, ...localOnlyProducts];
};

// Product API calls with fallback to local data
export const productAPI = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/products');
      // Enrich with local images
      const data = response.data.data || response.data;
      const enriched = await enrichProductsWithImages(Array.isArray(data) ? data : [data], { includeLocalOnly: true });
      return { data: { data: enriched } };
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      // Fallback to local products data
      const { products } = await import('../data/products.jsx');
      return { data: { data: normalizeProducts(products) } };
    }
  },

  getByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      const data = response.data.data || response.data;
      const enriched = await enrichProductsWithImages(Array.isArray(data) ? data : [data]);
      return { data: { data: enriched } };
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      const { getProductsByCategory } = await import('../data/products.jsx');
      const products = getProductsByCategory(category);
      return { data: { data: normalizeProducts(products) } };
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      const product = response.data.data || response.data;
      const enriched = await enrichProductsWithImages([product]);
      return { data: { data: enriched[0] } };
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      const { getProductById } = await import('../data/products.jsx');
      const product = getProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return { data: { data: normalizeProduct(product) } };
    }
  },

  getBestsellers: async () => {
    try {
      const response = await apiClient.get('/products/bestseller/products');
      const data = response.data.data || response.data;
      const enriched = await enrichProductsWithImages(Array.isArray(data) ? data : [data]);
      return { data: { data: enriched } };
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      const { getBestsellerProducts } = await import('../data/products.jsx');
      const products = getBestsellerProducts();
      return { data: { data: normalizeProducts(products) } };
    }
  },

  getDeliverable: async () => {
    try {
      const response = await apiClient.get('/products/deliverable/list');
      const data = response.data.data || response.data;
      const enriched = await enrichProductsWithImages(Array.isArray(data) ? data : [data]);
      return { data: { data: enriched } };
    } catch (error) {
      console.warn('Backend API unavailable, using local data', error.message);
      const { getProductsByCategory } = await import('../data/products.jsx');
      const allProducts = getProductsByCategory('all');
      const deliverable = normalizeProducts(allProducts).filter((p) => p.productType === 'deliverable');
      return { data: { data: deliverable } };
    }
  },
};

// Order API calls
export const orderAPI = {
  create: (data) => apiClient.post('/orders/create', data),
  getMyOrders: () => apiClient.get('/orders/my-orders'),
  getOrderById: (orderId) => apiClient.get(`/orders/${orderId}`),
  prepareOrder: (data) => apiClient.post('/orders/prepare', data),
  initiatePayment: (data) => apiClient.post('/orders/payment/initiate', data),
  verifyPayment: (data) => apiClient.post('/orders/payment/verify', data),
};

// Payment API calls
export const paymentAPI = {
  getRazorpayKey: () => apiClient.get('/payments/config/razorpay-key'),
  getPaymentStatus: (orderId) => apiClient.get(`/payments/status/${orderId}`),
};

// Gifting API calls
export const giftingAPI = {
  getAll: (params = {}) => apiClient.get('/gifting', { params }),
  getById: (id) => apiClient.get(`/gifting/${id}`),
  getFestive: () => apiClient.get('/gifting/festive/all'),
  getByCategory: (category) => apiClient.get(`/gifting/category/${category}`),
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

// Now set the admin auth API methods that need the adminApiClient
adminAuthAPI.getProfile = () => adminApiClient.get('/admin/auth/profile');
adminAuthAPI.verifyToken = () => adminApiClient.get('/admin/auth/verify');

export const adminOrderAPI = {
  getAll: (params = {}) => adminApiClient.get('/admin/orders', { params }),
  getById: (orderId) => adminApiClient.get(`/admin/orders/${orderId}`),
  updateStatus: (orderId, data) => adminApiClient.put(`/admin/orders/${orderId}/status`, data),
  getDashboardAnalytics: (params = {}) => adminApiClient.get('/admin/orders/analytics/dashboard', { params }),
  getPaymentAnalytics: (params = {}) => adminApiClient.get('/admin/orders/analytics/payments', { params }),
  getDeliveryOverview: () => adminApiClient.get('/admin/orders/delivery/overview'),
};

export const adminProductAPI = {
  getAll: () => adminApiClient.get('/admin/products'),
  updateInventory: (productId, data) => adminApiClient.patch(`/admin/products/${productId}`, data),
};

export default apiClient;
