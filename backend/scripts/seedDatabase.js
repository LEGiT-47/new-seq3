import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Product data with isDeliverable flag, images, and bestseller status
const products = [
  // CHOCOLATES (8 products - NOT deliverable)
  { productId: 1, name: 'Roasted California Almonds', category: 'chocolates', description: 'Premium California almonds coated in rich chocolate', image: 'https://images.unsplash.com/photo-1599599810694-b308ca884cb3?w=500&h=500&fit=crop', price: 450, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 2, name: 'Roasted Indian Konkan Cashew', category: 'chocolates', description: 'Fresh Indian Konkan cashews coated in premium chocolate', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 500, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 3, name: 'Roasted Hazelnut', category: 'chocolates', description: 'Premium hazelnuts coated in chocolate', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 520, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 4, name: 'Roasted California Pistachio', category: 'chocolates', description: 'California pistachios coated in chocolate', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 580, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 5, name: 'Afghani Raisin', category: 'chocolates', description: 'Premium Afghani raisins coated in chocolate', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 420, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 6, name: 'Roasted Coffee Beans', category: 'chocolates', description: 'Roasted coffee beans coated in premium chocolate', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 480, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 7, name: 'Cranberry', category: 'chocolates', description: 'Tart and sweet cranberries coated in premium chocolate', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 420, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 8, name: 'Blueberry', category: 'chocolates', description: 'Juicy blueberries coated in premium chocolate', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 430, weight: '200g', bestseller: false, isDeliverable: false },

  // FLAVORED NUTS (6 products - NOT deliverable)
  { productId: 9, name: 'Roasted California Almonds', category: 'nuts', description: 'Roasted California almonds with savory coatings', image: 'https://images.unsplash.com/photo-1599599810694-b308ca884cb3?w=500&h=500&fit=crop', price: 400, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 10, name: 'Roasted Indian Konkan Cashew', category: 'nuts', description: 'Indian Konkan cashews with delicious savory coatings', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 450, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 11, name: 'Roasted California Pistachio', category: 'nuts', description: 'California pistachios with savory and tangy coatings', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 520, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 12, name: 'Afghani Raisin', category: 'nuts', description: 'Afghani raisins with unique Indian spice coatings', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 360, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 13, name: 'Cranberry', category: 'nuts', description: 'Cranberries with Indian flavor coatings', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 340, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 14, name: 'Makhana', category: 'nuts', description: 'Crispy fox nuts with savory coatings', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 320, weight: '150g', bestseller: false, isDeliverable: false },

  // JAGGERY COATED (5 products - NOT deliverable)
  { productId: 15, name: 'Roasted California Almonds', category: 'jaggery', description: 'California almonds coated in organic jaggery', image: 'https://images.unsplash.com/photo-1599599810694-b308ca884cb3?w=500&h=500&fit=crop', price: 400, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 16, name: 'Roasted Indian Konkan Cashew', category: 'jaggery', description: 'Indian Konkan cashews coated in organic jaggery', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 450, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 18, name: 'Roasted Chickpeas (Channa)', category: 'jaggery', description: 'Roasted chickpeas coated in organic jaggery', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 280, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 19, name: 'Roasted Peanut', category: 'jaggery', description: 'Roasted peanuts coated in organic jaggery', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 250, weight: '250g', bestseller: false, isDeliverable: false },
  { productId: 20, name: 'Makhana', category: 'jaggery', description: 'Crispy fox nuts coated in organic jaggery', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 320, weight: '150g', bestseller: false, isDeliverable: false },

  // DRY FRUITS (11 products - ALL DELIVERABLE)
  { productId: 21, name: 'California Almonds (Badam)', category: 'dryfruits', description: 'Premium quality California almonds', image: 'https://images.unsplash.com/photo-1599599810694-b308ca884cb3?w=500&h=500&fit=crop', price: 650, weight: '500g', bestseller: true, isDeliverable: true },
  { productId: 22, name: 'Indian Konkan Cashew', category: 'dryfruits', description: 'Fresh Indian Konkan cashews', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 750, weight: '500g', bestseller: true, isDeliverable: true },
  { productId: 23, name: 'California Pistachio (Pista)', category: 'dryfruits', description: 'Premium quality California pistachios', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 800, weight: '500g', bestseller: true, isDeliverable: true },
  { productId: 24, name: 'Afghani Raisin (Kishmish)', category: 'dryfruits', description: 'Premium Afghani raisins', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 380, weight: '500g', bestseller: false, isDeliverable: true },
  { productId: 25, name: 'Walnut', category: 'dryfruits', description: 'Premium quality walnuts', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 720, weight: '500g', bestseller: false, isDeliverable: true },
  { productId: 26, name: 'Dates (Khajur)', category: 'dryfruits', description: 'Soft and sweet premium dates', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 420, weight: '500g', bestseller: false, isDeliverable: true },
  { productId: 27, name: 'Dried Fig (Anjeer)', category: 'dryfruits', description: 'Premium quality dried figs', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 550, weight: '500g', bestseller: false, isDeliverable: true },
  { productId: 28, name: 'Apricots', category: 'dryfruits', description: 'Premium quality dried apricots', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 480, weight: '500g', bestseller: false, isDeliverable: true },
  { productId: 29, name: 'Fox Nuts (Makhana)', category: 'dryfruits', description: 'Premium quality fox nuts', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 340, weight: '500g', bestseller: true, isDeliverable: true },
  { productId: 30, name: 'Cranberry', category: 'dryfruits', description: 'Premium quality dried cranberries', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 380, weight: '500g', bestseller: false, isDeliverable: true },
  { productId: 52, name: 'Blueberry', category: 'dryfruits', description: 'Premium quality blueberries', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 380, weight: '500g', bestseller: false, isDeliverable: true },

  // SEEDS (6 products - NOT deliverable)
  { productId: 31, name: 'Sunflower Seeds', category: 'seeds', description: 'Premium quality sunflower seeds', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 380, weight: '500g', bestseller: false, isDeliverable: false },
  { productId: 32, name: 'Watermelon Seeds', category: 'seeds', description: 'Premium quality watermelon seeds', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 320, weight: '500g', bestseller: false, isDeliverable: false },
  { productId: 33, name: 'Flax Seeds', category: 'seeds', description: 'Premium quality flax seeds', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 400, weight: '500g', bestseller: false, isDeliverable: false },
  { productId: 34, name: 'Pumpkin Seeds', category: 'seeds', description: 'Premium quality pumpkin seeds', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 420, weight: '500g', bestseller: false, isDeliverable: false },
  { productId: 35, name: 'Chia Seeds', category: 'seeds', description: 'Premium quality chia seeds', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 480, weight: '500g', bestseller: false, isDeliverable: false },
  { productId: 36, name: 'Muskmelon Seeds', category: 'seeds', description: 'Premium quality muskmelon seeds', image: 'https://images.unsplash.com/photo-1585518419759-db4cfe83bdb4?w=500&h=500&fit=crop', price: 360, weight: '500g', bestseller: false, isDeliverable: false },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const admin = new Admin({
      username: 'Ravi@admin',
      email: 'ravi@sequeirafoods.com',
      password: 'seq@Foods1234',
      role: 'super_admin',
      permissions: ['view_orders', 'manage_orders', 'manage_products', 'view_analytics', 'manage_admins'],
    });

    await admin.save();
    console.log('Admin created successfully');

    // Create products
    await Product.insertMany(products);
    console.log(`${products.length} products created successfully`);

    console.log('\nDatabase seeding completed!');
    console.log('\nAdmin Credentials:');
    console.log('Username: Ravi@admin');
    console.log('Password: seq@Foods1234');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
