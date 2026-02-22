import mongoose from 'mongoose';
import Gifting from '../models/Gifting.js';

const giftingData = [
  {
    name: "Valentine's Day Special Box",
    description: "A romantic and thoughtful gift collection perfect for your loved one. Features premium chocolate-coated almonds, roasted cashews, and specialty items beautifully packaged in an elegant box for the occasion.",
    category: 'festive',
    subcategory: "Valentine's Day",
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    weight: '600g',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=500&h=500&fit=crop',
    includes: [
      'Premium Chocolate Almonds',
      'Roasted Cashews',
      'Specialty Coated Nuts',
      'Beautiful Gift Packaging'
    ],
    occasion: ['Valentine\'s Day', 'Anniversaries', 'Special Date'],
    isFestive: true,
    isActive: true,
    isPopular: true,
    customizationOptions: {
      personalizedMessage: true,
      customPackaging: true,
      wrapping: true
    },
    contactForCustom: true
  },
  {
    name: 'Diwali Festival Box',
    description: 'Celebrate the festival of lights with our special Diwali collection. A vibrant selection of premium dry fruits, chocolate-coated nuts, and festive treats packaged in elegant Diwali-themed boxes.',
    category: 'festive',
    subcategory: 'Diwali',
    price: 1499,
    originalPrice: 1899,
    discount: 21,
    weight: '750g',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop',
    includes: [
      'Premium Dry Fruits Mix',
      'Chocolate Coated Almonds',
      'Roasted Cashews',
      'Specialty Coated Pistachios',
      'Diwali-themed Premium Packaging'
    ],
    occasion: ['Diwali', 'Festive Celebrations', 'Gifting'],
    isFestive: true,
    isActive: true,
    isPopular: true,
    customizationOptions: {
      personalizedMessage: true,
      customPackaging: true,
      wrapping: true
    },
    contactForCustom: true
  },
  {
    name: 'New Year Celebration Pack',
    description: 'Ring in the new year with our premium celebration pack. A sophisticated collection of luxury nuts and dry fruits perfect for welcoming the new year with elegance and style.',
    category: 'festive',
    subcategory: 'New Year',
    price: 1699,
    originalPrice: 1899,
    discount: 11,
    weight: '800g',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=500&h=500&fit=crop',
    includes: [
      'Premium California Almonds',
      'Indian Konkan Cashews',
      'California Pistachios',
      'Afghani Raisins',
      'Premium Walnuts',
      'Luxury New Year Packaging'
    ],
    occasion: ['New Year', 'New Beginnings', 'Celebrations'],
    isFestive: true,
    isActive: true,
    isPopular: false,
    customizationOptions: {
      personalizedMessage: true,
      customPackaging: true,
      wrapping: true
    },
    contactForCustom: true
  },
  {
    name: 'Holi Colors Special Box',
    description: 'Celebrate the festival of colors with our vibrant Holi special collection. A colorful assortment of premium nuts and treats, perfect for sharing joy with loved ones during Holi.',
    category: 'festive',
    subcategory: 'Holi',
    price: 1099,
    originalPrice: 1299,
    discount: 15,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop',
    includes: [
      'Roasted Almonds',
      'Chocolate Cashews',
      'Flavored Nuts Mix',
      'Colorful Holi Packaging'
    ],
    occasion: ['Holi', 'Festive Celebrations', 'Family Gifting'],
    isFestive: true,
    isActive: true,
    isPopular: false,
    customizationOptions: {
      personalizedMessage: true,
      customPackaging: true,
      wrapping: true
    },
    contactForCustom: true
  },
  {
    name: 'Eid Celebration Box',
    description: 'Share the joy of Eid with our special celebration box. A premium collection of dry fruits and nuts, traditionally favored during Eid celebrations and gatherings.',
    category: 'festive',
    subcategory: 'Eid',
    price: 1199,
    originalPrice: 1399,
    discount: 14,
    weight: '600g',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=500&h=500&fit=crop',
    includes: [
      'Premium Dry Fruits Selection',
      'Roasted Nuts Mix',
      'Specialty Coated Items',
      'Elegant Eid Packaging'
    ],
    occasion: ['Eid ul-Fitr', 'Eid ul-Adha', 'Family Gatherings'],
    isFestive: true,
    isActive: true,
    isPopular: false,
    customizationOptions: {
      personalizedMessage: true,
      customPackaging: false,
      wrapping: true
    },
    contactForCustom: true
  }
];

async function seedGiftingProducts() {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sequeira-foods';
    
    // Connect to MongoDB
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing gifting products
    await Gifting.deleteMany({});
    console.log('Cleared existing gifting products');

    // Insert new data
    const result = await Gifting.insertMany(giftingData);
    console.log(`Successfully seeded ${result.length} gifting products`);

    // Display inserted data
    console.log('\nInserted Gifting Products:');
    result.forEach((product) => {
      console.log(`- ${product.name} (${product.category}): ₹${product.price}`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding gifting products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedGiftingProducts();
