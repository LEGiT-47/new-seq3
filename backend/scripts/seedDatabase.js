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
  { productId: 100, name: 'Gud Chana', category: 'jaggery', description: 'Traditional gud chana with a clean jaggery finish and satisfying crunch.', image: '/images/products/CHICPEAS_JAGGERY.JPG', price: 199, weight: '200g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Classic', parentProduct: 'gud-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Gud Chana. Could you please share pricing and availability?", isDeliverable: true, coatings: ['Jaggery'], flavors: [] },
  { productId: 101, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana with smoky barbecue seasoning.', image: '/images/products/cashew_peri.JPG', price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'BBQ', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - BBQ. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
  { productId: 102, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana with rich cheese flavouring.', image: '/images/products/salted_almond.JPG', price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Cheese', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Cheese. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
  { productId: 103, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana tossed in cream and onion seasoning.', image: '/images/products/cashew_peri.JPG', price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Cream & Onion', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Cream & Onion. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
  { productId: 104, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana with bold peri peri spice.', image: '/images/products/raisin_chilly.JPG', price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Peri Peri', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Peri Peri. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
  { productId: 105, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana with refreshing pudina masala.', image: '/images/products/MAKHANA_FN.JPG', price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Pudina', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Pudina. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
  // CHOCOLATES (8 products - NOT deliverable)
  { productId: 1, name: 'Roasted California Almonds', category: 'chocolates', description: 'Premium California almonds coated in rich chocolate with delightful flavors', image: '/images/products/choco_almond.JPG', price: 450, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 2, name: 'Roasted Indian Konkan Cashew', category: 'chocolates', description: 'Fresh Indian Konkan cashews coated in premium chocolate with flavors', image: '/images/products/choco-cashew.jpg', price: 500, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 3, name: 'Roasted Hazelnut', category: 'chocolates', description: 'Premium hazelnuts coated in chocolate with various flavors', image: '/images/products/hazelnut_dark.JPG', price: 520, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 4, name: 'Roasted California Pistachio', category: 'chocolates', description: 'California pistachios coated in chocolate with delightful flavor options', image: '/images/products/choco_pista.jpg', price: 580, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 5, name: 'Afghani Raisin', category: 'chocolates', description: 'Premium Afghani raisins coated in chocolate with flavor varieties', image: '/images/products/choco_raisin.JPG', price: 420, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 6, name: 'Roasted Coffee Beans', category: 'chocolates', description: 'Roasted coffee beans coated in premium chocolate', image: '/images/products/COFFEE_CHOCOLATE.JPG', price: 480, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 7, name: 'Cranberry', category: 'chocolates', description: 'Tart and sweet cranberries coated in premium chocolate', image: '/images/products/CRANBERRY_CHOCOLATE.JPG', price: 420, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 8, name: 'Blueberry', category: 'chocolates', description: 'Juicy blueberries coated in premium chocolate', image: '/images/products/BLUEBERRY_CHOCOLATE.JPG', price: 430, weight: '200g', bestseller: false, isDeliverable: false },

  // FLAVORED NUTS (6 products - NOT deliverable)
  { productId: 9, name: 'Roasted California Almonds', category: 'nuts', description: 'Roasted California almonds with savory and spicy coatings', image: '/images/products/salted_almond.JPG', price: 400, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 10, name: 'Roasted Indian Konkan Cashew', category: 'nuts', description: 'Indian Konkan cashews with delicious savory coatings', image: '/images/products/cashew_peri.JPG', price: 450, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 11, name: 'Roasted California Pistachio', category: 'nuts', description: 'California pistachios with savory and tangy coatings', image: '/images/products/PISTA_FN.JPG', price: 520, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 12, name: 'Afghani Raisin', category: 'nuts', description: 'Afghani raisins with unique Indian spice coatings', image: '/images/products/raisin_chilly.JPG', price: 360, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 13, name: 'Cranberry', category: 'nuts', description: 'Cranberries with Indian flavor coatings', image: '/images/products/CRANBERRY_FN.JPG', price: 340, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 14, name: 'Makhana', category: 'nuts', description: 'Crispy fox nuts with savory coatings', image: '/images/products/MAKHANA_FN.JPG', price: 320, weight: '150g', bestseller: false, isDeliverable: false },

  // JAGGERY COATED (5 products - NOT deliverable)
  { productId: 15, name: 'Roasted California Almonds', category: 'jaggery', description: 'California almonds coated in organic jaggery with sesame or poppy seeds', image: '/images/products/ALMOND_JAGGERY.JPG', price: 400, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 16, name: 'Roasted Indian Konkan Cashew', category: 'jaggery', description: 'Indian Konkan cashews coated in organic jaggery with seeds', image: '/images/products/CASHEW_JAGGERY.JPG', price: 450, weight: '200g', bestseller: false, isDeliverable: false },
  { productId: 18, name: 'Roasted Chickpeas (Channa)', category: 'jaggery', description: 'Roasted chickpeas coated in organic jaggery with seeds', image: '/images/products/CHICPEAS_JAGGERY.JPG', price: 280, weight: '200g', bestseller: true, isDeliverable: false },
  { productId: 19, name: 'Roasted Peanut', category: 'jaggery', description: 'Roasted peanuts coated in organic jaggery with seeds', image: '/images/products/peanut.jpg', price: 250, weight: '250g', bestseller: false, isDeliverable: false },
  { productId: 20, name: 'Makhana', category: 'jaggery', description: 'Crispy fox nuts coated in organic jaggery with seeds', image: '/images/products/MAKHANA_JAGGERY.JPG', price: 320, weight: '150g', bestseller: true, isDeliverable: false },

  // DRY FRUITS (11 products - enquiry only)
  { productId: 21, name: 'California Almonds (Badam)', category: 'dryfruits', description: 'Premium quality California almonds', image: '/images/products/almond-1.jpg', price: 650, weight: '500g', bestseller: true, isDeliverable: false, productType: 'enquiry' },
  { productId: 22, name: 'Indian Konkan Cashew', category: 'dryfruits', description: 'Fresh Indian Konkan cashews', image: '/images/products/cashew-1.jpg', price: 750, weight: '500g', bestseller: true, isDeliverable: false, productType: 'enquiry' },
  { productId: 23, name: 'California Pistachio (Pista)', category: 'dryfruits', description: 'Premium quality California pistachios', image: '/images/products/pistachio.jpg', price: 800, weight: '500g', bestseller: true, isDeliverable: false, productType: 'enquiry' },
  { productId: 24, name: 'Afghani Raisin (Kishmish)', category: 'dryfruits', description: 'Premium Afghani raisins', image: '/images/products/resin.jpg', price: 380, weight: '500g', bestseller: false, isDeliverable: false, productType: 'enquiry' },
  { productId: 25, name: 'Walnut', category: 'dryfruits', description: 'Premium quality walnuts', image: '/images/products/walnut-1.jpg', price: 720, weight: '500g', bestseller: false, isDeliverable: false, productType: 'enquiry' },
  { productId: 26, name: 'Dates (Khajur)', category: 'dryfruits', description: 'Soft and sweet premium dates', image: '/images/products/dates.jpg', price: 420, weight: '500g', bestseller: false, isDeliverable: false, productType: 'enquiry' },
  { productId: 27, name: 'Dried Fig (Anjeer)', category: 'dryfruits', description: 'Premium quality dried figs', image: '/images/products/dry_fig.jpg', price: 550, weight: '500g', bestseller: false, isDeliverable: false, productType: 'enquiry' },
  { productId: 28, name: 'Apricots', category: 'dryfruits', description: 'Premium quality dried apricots', image: '/images/products/apricot.jpg', price: 480, weight: '500g', bestseller: false, isDeliverable: false, productType: 'enquiry' },
  { productId: 29, name: 'Fox Nuts (Makhana)', category: 'dryfruits', description: 'Premium quality fox nuts', image: '/images/products/makhana-1.jpg', price: 340, weight: '500g', bestseller: true, isDeliverable: false, productType: 'enquiry' },
  { productId: 30, name: 'Cranberry', category: 'dryfruits', description: 'Premium quality dried cranberries', image: '/images/products/cranberry.jpg', price: 380, weight: '500g', bestseller: false, isDeliverable: false, productType: 'enquiry' },
  { productId: 52, name: 'Blueberry', category: 'dryfruits', description: 'Premium quality blueberries', image: '/images/products/blueberry.jpg', price: 380, weight: '500g', bestseller: false, isDeliverable: false, productType: 'enquiry' },

  // SEEDS (6 products - NOT deliverable)
  { productId: 31, name: 'Sunflower Seeds', category: 'seeds', description: 'Premium quality sunflower seeds rich in nutrition', image: '/images/products/sunflower.jpg', price: 380, weight: '500g', bestseller: true, isDeliverable: false },
  { productId: 32, name: 'Watermelon Seeds', category: 'seeds', description: 'Premium quality watermelon seeds', image: '/images/products/watermelon.jpg', price: 320, weight: '500g', bestseller: false, isDeliverable: false },
  { productId: 33, name: 'Flax Seeds', category: 'seeds', description: 'Premium quality flax seeds rich in omega-3', image: '/images/products/flax.jpg', price: 400, weight: '500g', bestseller: false, isDeliverable: false },
  { productId: 34, name: 'Pumpkin Seeds', category: 'seeds', description: 'Premium quality pumpkin seeds', image: '/images/products/pumpkin.jpg', price: 420, weight: '500g', bestseller: true, isDeliverable: false },
  { productId: 35, name: 'Chia Seeds', category: 'seeds', description: 'Premium quality chia seeds', image: '/images/products/chia.jpg', price: 480, weight: '500g', bestseller: true, isDeliverable: false },
  { productId: 36, name: 'Muskmelon Seeds', category: 'seeds', description: 'Premium quality muskmelon seeds', image: '/images/products/muskmelon.jpg', price: 360, weight: '500g', bestseller: false, isDeliverable: false },
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
