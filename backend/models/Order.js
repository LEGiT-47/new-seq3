import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: Number,
        productName: String,
        quantity: Number,
        price: Number,
        selectedOptions: {
          coating: String,
          flavor: String,
        },
      },
    ],
    customerDetails: {
      name: String,
      email: String,
      phone: String,
    },
    deliveryAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    // Payment Transaction Reference
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'whatsapp'],
      default: 'razorpay',
    },
    // Delivery Timeline
    deliveryTimeline: {
      type: String,
      default: '7-8 business days',
    },
    notes: String,
    // Track payment attempts to prevent duplicates
    paymentAttempts: {
      type: Number,
      default: 0,
    },
    lastPaymentAttemptAt: Date,
  },
  { timestamps: true }
);

// Create index for orderNumber for quick lookups
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
