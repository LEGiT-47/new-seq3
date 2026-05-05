import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ['initiated', 'pending', 'success', 'failed'],
      default: 'initiated',
    },
    paymentMethod: String,
    errorMessage: String,
    userIp: String,
    // To track and prevent duplicate payment attempts
    attemptNumber: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

paymentTransactionSchema.index({ orderId: 1, createdAt: -1 });
paymentTransactionSchema.index({ razorpayOrderId: 1 });
paymentTransactionSchema.index({ status: 1 });

const PaymentTransaction = mongoose.model('PaymentTransaction', paymentTransactionSchema);
export default PaymentTransaction;
