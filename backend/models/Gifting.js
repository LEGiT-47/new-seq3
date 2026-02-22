import mongoose from 'mongoose';

const giftingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['festive', 'corporate', 'personalized', 'wedding'],
      required: true,
    },
    subcategory: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    discount: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
    },
    weight: {
      type: String,
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    includes: [
      {
        type: String,
        trim: true,
      },
    ],
    occasion: [
      {
        type: String,
        trim: true,
      },
    ],
    isFestive: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    customizationOptions: {
      personalizedMessage: {
        type: Boolean,
        default: false,
      },
      customPackaging: {
        type: Boolean,
        default: false,
      },
      wrapping: {
        type: Boolean,
        default: false,
      },
    },
    contactForCustom: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Gifting', giftingSchema);
