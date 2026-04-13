import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    addresses: [
      {
        id: mongoose.Schema.Types.ObjectId,
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: Boolean,
      },
    ],
    cart: [
      {
        id: mongoose.Schema.Types.ObjectId,
        productId: Number,
        name: String,
        price: Number,
        quantity: Number,
        selectedCoating: String,
        selectedFlavor: String,
        image: String,
        category: String,
        isDeliverable: Boolean,
        stockQuantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpiresAt: Date,
    signupStep: {
      type: String,
      enum: ['email-pending', 'email-verified', 'completed'],
      default: 'email-pending',
    },
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
