import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import Product from './models/Product.js';
import Gifting from './models/Gifting.js';

// Import routes
import authRoutes from './routes/auth.js';
import adminAuthRoutes from './routes/adminAuth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminOrderRoutes from './routes/adminOrders.js';
import adminProductRoutes from './routes/adminProducts.js';
import paymentRoutes from './routes/payments.js';
import cartRoutes from './routes/cart.js';
import giftingRoutes from './routes/gifting.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - needed for rate limiting to work correctly when behind a proxy
app.set('trust proxy', 1);

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
        frameSrc: ["'self'", "https://checkout.razorpay.com", "https://api.razorpay.com"],
        connectSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Auto-seed database with gifting products if empty
const seedGiftingIfEmpty = async () => {
  try {
    const giftingCount = await Gifting.countDocuments({ isFestive: true });

    if (giftingCount === 0) {
      console.log('No festive gifting products found. Seeding database...');

      const giftingProducts = [
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
          occasion: ["Valentine's Day", 'Anniversaries', 'Special Date'],
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

      await Gifting.insertMany(giftingProducts);
      console.log(`✓ Database seeded with ${giftingProducts.length} festive gifting products`);
    }
  } catch (error) {
    console.error('Error seeding gifting products:', error.message);
  }
};

// Auto-seed database with products if empty
const seedProductsIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      console.log('No products found. Seeding database...');

      const products = [
        { productId: 100, name: 'Gud Chana', category: 'jaggery', description: 'Traditional gud chana with a clean jaggery finish and satisfying crunch.', image: '/images/products/CHICPEAS_JAGGERY.JPG', images: ['/images/products/CHICPEAS_JAGGERY.JPG', '/images/products/gud_chana_gen_00001_.png', '/images/products/gud_chana_gen_00002_.png'], price: 199, weight: '200g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Classic', parentProduct: 'gud-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Gud Chana. Could you please share pricing and availability?", isDeliverable: true, coatings: ['Jaggery'], flavors: [] },
        { productId: 101, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana with smoky barbecue seasoning.', image: '/images/products/cashew_peri.JPG', images: ['/images/products/cashew_peri.JPG', '/images/products/crunchy_chana_bbq_gen_00001_.png', '/images/products/crunchy_chana_bbq_gen_00002_.png'], price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'BBQ', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - BBQ. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
        { productId: 102, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana with rich cheese flavouring.', image: '/images/products/salted_almond.JPG', images: ['/images/products/salted_almond.JPG', '/images/products/crunchy_chana_cheese_gen_00001_.png', '/images/products/crunchy_chana_cheese_gen_00002_.png'], price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Cheese', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Cheese. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
        { productId: 103, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana tossed in cream and onion seasoning.', image: '/images/products/cashew_peri.JPG', images: ['/images/products/cashew_peri.JPG', '/images/products/crunchy_chana_cream_onion_gen_00001_.png', '/images/products/crunchy_chana_cream_onion_gen_00002_.png'], price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Cream & Onion', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Cream & Onion. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
        { productId: 104, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana with bold peri peri spice.', image: '/images/products/raisin_chilly.JPG', images: ['/images/products/raisin_chilly.JPG', '/images/products/crunchy_chana_peri_peri_gen_00001_.png', '/images/products/crunchy_chana_peri_peri_gen_00002_.png'], price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Peri Peri', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Peri Peri. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
        { productId: 105, name: 'Crunchy Chana', category: 'nuts', description: 'Roasted crunchy chana with refreshing pudina masala.', image: '/images/products/MAKHANA_FN.JPG', images: ['/images/products/MAKHANA_FN.JPG', '/images/products/crunchy_chana_pudina_gen_00001_.png', '/images/products/crunchy_chana_pudina_gen_00002_.png'], price: 219, weight: '100g', bestseller: true, productType: 'deliverable', isHeroProduct: true, flavour: 'Pudina', parentProduct: 'crunchy-chana', whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Pudina. Could you please share pricing and availability?", isDeliverable: true, coatings: [], flavors: [] },
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

      await Product.insertMany(products);
      console.log(`✓ Database seeded with ${products.length} products`);
    }

    const savouryVariantConfigs = [
      {
        name: 'Savory Makhana',
        parentProduct: 'savory-makhana',
        description: 'Roasted makhana with bold Indian savory seasoning.',
        image: '/images/products/MAKHANA_FN.JPG',
        price: 249,
        weight: '90g',
        stockQuantity: 40,
        flavours: ['Peri Peri', 'Barbeque', 'Cream & Onion', 'Cheese', 'Cheese Herbs', 'Pudina', 'Tangy Tomato', 'Lime & Chilli', 'Black Pepper', 'Tandoori Masala', 'Himalayan Pink Salt', 'Salt & Pepper'],
      },
      {
        name: 'Savory Cashew',
        parentProduct: 'savory-cashew',
        description: 'Roasted cashew with rich and crunchy savory flavour profiles.',
        image: '/images/products/cashew_peri.JPG',
        price: 289,
        weight: '120g',
        stockQuantity: 40,
        flavours: ['Peri Peri', 'Barbeque', 'Chatpata', 'Smokey Garlic', 'Black Pepper', 'Salted Cashew', 'Pepper & Salt', 'Mint', 'Pudina', 'Cream & Onion'],
      },
      {
        name: 'Savory Almond',
        parentProduct: 'savory-almond',
        description: 'Roasted almond range with popular Indian savory flavour choices.',
        image: '/images/products/salted_almond.JPG',
        price: 299,
        weight: '120g',
        stockQuantity: 40,
        flavours: ['Peri-Peri', 'Cream & Onion', 'Cheese & Herbs', 'Tandoori Masala', 'Smoky BBQ', 'Jalapeno Cheese', 'Chilli Lime', 'Chatpata Chaat Masala', 'Maggi Masala', 'Peri-Peri Protein', 'Tandoori Smoky', 'Green Chutney'],
      },
      {
        name: 'Savory Peanut',
        parentProduct: 'savory-peanut',
        description: 'Roasted peanuts with classic spicy and tangy masala options.',
        image: '/images/products/peanut.jpg',
        price: 199,
        weight: '150g',
        stockQuantity: 40,
        flavours: ['Hing Jeera', 'Masala', 'Chilli Garlic', 'Tandoori', 'Chatpata', 'Salted'],
      },
      {
        name: 'Savory Chana',
        parentProduct: 'savory-chana',
        description: 'Protein-rich roasted chana in top-selling Indian savory flavours.',
        image: '/images/products/CHICPEAS_JAGGERY.JPG',
        price: 229,
        weight: '120g',
        stockQuantity: 40,
        flavours: ['Classic Masala', 'Chatpata', 'Peri Peri', 'Punjabi Tadka', 'Chilli Garlic', 'Nimbu', 'Pudina', 'Lime & Chilli', 'Hing Jeera', 'Salted', 'Lightly Spiced', 'Cheese Masala', 'Cream & Onion', 'BBQ', 'Smoky', 'Pizza'],
      },
    ];

    let savouryProductId = 111;
    const mustHaveSavoryProducts = savouryVariantConfigs.flatMap((config) =>
      config.flavours.map((flavour) => ({
        productId: savouryProductId++,
        name: config.name,
        category: 'nuts',
        description: `${config.description} Flavour: ${flavour}.`,
        image: config.image,
        price: config.price,
        weight: config.weight,
        productType: 'deliverable',
        isDeliverable: true,
        parentProduct: config.parentProduct,
        flavour,
        stockQuantity: config.stockQuantity,
        flavors: [],
      }))
    );

    await Promise.all(
      mustHaveSavoryProducts.map((product) =>
        Product.updateOne(
          { productId: product.productId },
          {
            $set: {
              name: product.name,
              category: product.category,
              description: product.description,
              image: product.image,
              weight: product.weight,
              productType: 'deliverable',
              isDeliverable: true,
              parentProduct: product.parentProduct,
              flavour: product.flavour,
              isHidden: false,
            },
            $setOnInsert: {
              price: product.price,
              stockQuantity: product.stockQuantity,
              flavors: [],
            },
          },
          { upsert: true }
        )
      )
    );

    // Hide deprecated single-mix products so only flavour variants are shown.
    await Product.updateMany(
      { productId: { $in: [106, 107, 108, 109, 110] } },
      { $set: { isHidden: true } }
    );

    // Hide malformed variant rows that have a parent product but no flavour.
    await Product.updateMany(
      {
        parentProduct: { $exists: true, $nin: ['', null] },
        $or: [
          { flavour: { $exists: false } },
          { flavour: '' },
          { flavour: null },
          { flavour: { $not: { $regex: '[A-Za-z0-9]' } } },
        ],
      },
      { $set: { isHidden: true } }
    );

    // Backfill missing ingredients for existing DB products.
    const ingredientTemplatesByCategory = {
      chocolates: [
        'Premium roasted base ingredient',
        'Dark/Milk chocolate compound',
        'Natural cocoa solids',
        'Cane sugar',
        'Cocoa butter or vegetable fat blend',
        'Natural flavouring',
      ],
      nuts: [
        'Premium roasted nut/seed base',
        'Signature seasoning blend',
        'Cold-pressed edible oil (light coating)',
        'Sea salt or rock salt',
        'Natural spice extracts',
        'Herbs and dehydrated aromatics',
      ],
      jaggery: [
        'Premium roasted base ingredient',
        'Organic jaggery',
        'Sesame or poppy seed coating',
        'Cold-pressed edible oil',
        'Rock salt',
        'Natural spice blend',
      ],
      dryfruits: [
        'Premium sorted whole ingredient',
        'Natural antioxidants',
        'No artificial colours',
        'No synthetic flavours',
        'Food-grade moisture barrier pack',
        'Natural taste profile',
      ],
      seeds: [
        'Premium cleaned seeds',
        'Natural omega-rich seed oils',
        'Rock salt (lightly salted variants)',
        'Natural spice blend (where applicable)',
        'Food-grade freshness lock pack',
        'No synthetic flavours',
      ],
      gifting: [
        'Assorted premium nuts and dry fruits',
        'Selected savory snack components',
        'Chocolate-coated assortment (selected packs)',
        'Natural seasoning components',
        'Food-grade freshness pouches',
        'Gift-grade packaging materials',
      ],
      services: [
        'Curated product assortment as per requirement',
        'Premium nuts and dry fruits',
        'Savory and festive snack options',
        'Custom packaging components',
        'Food-grade protective inner packs',
        'Branding and gifting accessories',
      ],
    };

    await Promise.all(
      Object.entries(ingredientTemplatesByCategory).map(([category, ingredients]) =>
        Product.updateMany(
          {
            category,
            $or: [{ ingredients: { $exists: false } }, { ingredients: { $size: 0 } }],
          },
          { $set: { ingredients } }
        )
      )
    );
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};

// Initialize database and seed if needed
(async () => {
  await connectDB();
  await seedProductsIfEmpty();
  await seedGiftingIfEmpty();
})();

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gifting', giftingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', cartRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
