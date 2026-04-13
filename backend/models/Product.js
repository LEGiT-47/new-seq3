import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    images: [String],
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      default: 40,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    weight: {
      type: String,
      required: true,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    isDeliverable: {
      type: Boolean,
      default: false,
      description: 'True for Gud Chana, Makhana, Dry Fruits; False for Chocolates and Coated items',
    },
    productType: {
      type: String,
      enum: ['deliverable', 'enquiry'],
      default: 'enquiry',
      index: true,
    },
    isHeroProduct: {
      type: Boolean,
      default: false,
      index: true,
    },
    flavour: {
      type: String,
      default: '',
    },
    parentProduct: {
      type: String,
      default: '',
    },
    whatsappEnquiryText: {
      type: String,
      default: '',
    },
    coatings: [String],
    flavors: [String],
    defaultCoating: String,
    isHidden: {
      type: Boolean,
      default: false,
    },
    // Additional details for product page
    benefits: [String], // Health benefits
    qualityHighlights: [String], // Quality highlights
    usageSuggestions: String, // How to use
    storageInfo: String, // Storage and shelf-life
    testimonials: [
      {
        author: String,
        text: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
