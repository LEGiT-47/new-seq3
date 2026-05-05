import rateLimit from 'express-rate-limit';

// General rate limiter for API endpoints
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Payment attempt rate limiter - CRITICAL for preventing duplicate payments
export const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Max 3 payment attempts per 5 minutes per IP
  message: 'Too many payment attempts. Please wait before trying again.',
  skipSuccessfulRequests: false,
  keyGenerator: (req, res) => {
    // Use orderId as the key instead of IP to prevent user circumvention
    return req.body?.orderId || req.ip;
  },
});

// Stricter limiter for payment initiation
export const paymentInitiateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1, // Only 1 payment initiation per 2 minutes per order
  message: 'Please wait before initiating another payment attempt.',
  keyGenerator: (req, res) => {
    // Key by authenticated user when available; fall back to IP for unauthenticated access.
    return req.userId || req.body?.orderId || req.ip;
  },
});
