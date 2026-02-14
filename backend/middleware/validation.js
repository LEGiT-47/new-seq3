import Joi from 'joi';

// Validation schemas
export const schemas = {
  // User signup/login
  userSignup: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().lowercase().required(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,}$/).required(),
    password: Joi.string().min(6).max(50).required(),
    address: Joi.object({
      name: Joi.string().trim().max(100).allow(''),
      phone: Joi.string().allow(''),
      street: Joi.string().trim().max(200).allow(''),
      city: Joi.string().trim().max(100).allow(''),
      state: Joi.string().trim().max(100).allow(''),
      pincode: Joi.string().pattern(/^[0-9]*$/).allow(''),
    }).optional(),
  }),

  userLogin: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),

  // Admin login
  adminLogin: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  // Delivery address
  deliveryAddress: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,}$/).required(),
    street: Joi.string().trim().max(200).required(),
    city: Joi.string().trim().max(100).required(),
    state: Joi.string().trim().max(100).required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
  }),

  // Order creation
  orderCreation: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().required(),
          quantity: Joi.number().min(1).required(),
          selectedOptions: Joi.object({
            coating: Joi.string().allow(null),
            flavor: Joi.string().allow(null),
          }),
        })
      )
      .min(1)
      .required(),
    deliveryAddress: Joi.object({
      name: Joi.string().trim().min(2).max(100).required(),
      phone: Joi.string().pattern(/^\+?[0-9]{10,}$/).required(),
      street: Joi.string().trim().max(200).required(),
      city: Joi.string().trim().max(100).required(),
      state: Joi.string().trim().max(100).required(),
      pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
    }).required(),
  }),

  // Razorpay payment verification
  paymentVerification: Joi.object({
    razorpayOrderId: Joi.string().required(),
    razorpayPaymentId: Joi.string().required(),
    razorpaySignature: Joi.string().required(),
    orderId: Joi.string().required(),
  }),
};

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: messages,
      });
    }

    req.validatedBody = value;
    next();
  };
};

// Specific validation middleware
export const validateUserSignup = validate(schemas.userSignup);
export const validateUserLogin = validate(schemas.userLogin);
export const validateAdminLogin = validate(schemas.adminLogin);
export const validateDeliveryAddress = validate(schemas.deliveryAddress);
export const validateOrderCreation = validate(schemas.orderCreation);
export const validatePaymentVerification = validate(schemas.paymentVerification);
