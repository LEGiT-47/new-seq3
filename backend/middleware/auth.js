import jwt from 'jsonwebtoken';

// Middleware to verify user JWT token
export const verifyUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'user_secret_key');
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
    });
  }
};

// Middleware to verify admin JWT token
export const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No admin token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'admin_secret_key');
    req.adminId = decoded.id;
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired admin token.',
    });
  }
};

// Optional token verification (doesn't fail if no token)
export const verifyTokenOptional = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'user_secret_key');
      req.userId = decoded.id;
      req.user = decoded;
    } catch (error) {
      // Token is invalid but it's optional, so continue
    }
  }

  next();
};
