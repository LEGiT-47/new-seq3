#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gifting from '../models/Gifting.js';

dotenv.config();

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
  }
];

async function seedGifting() {
  try {
    const dbUri = process.env.MONGODB_URI;
    
    if (!dbUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    // Check if products already exist
    const existingCount = await Gifting.countDocuments({ isFestive: true });
    
    if (existingCount > 0) {
      console.log(`✓ Found ${existingCount} existing festive gifting products`);
      console.log('Skipping seed (products already exist)');
    } else {
      // Insert new data
      const result = await Gifting.insertMany(giftingData);
      console.log(`✓ Successfully seeded ${result.length} festive gifting products`);

      // Display inserted data
      console.log('\nInserted Products:');
      result.forEach((product) => {
        console.log(`  - ${product.name} (${product.subcategory}): ₹${product.price}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding gifting products:', error.message);
    process.exit(1);
  }
}

seedGifting();
