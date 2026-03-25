import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const HERO_DEFINITIONS = [
  { name: 'Gud Chana', flavour: 'Classic' },
  { name: 'Crunchy Chana', flavour: 'BBQ' },
  { name: 'Crunchy Chana', flavour: 'Cheese' },
  { name: 'Crunchy Chana', flavour: 'Cream & Onion' },
  { name: 'Crunchy Chana', flavour: 'Peri Peri' },
  { name: 'Crunchy Chana', flavour: 'Pudina' },
];

const NUTS_FLAVOURS = {
  'Roasted California Almonds': [
    'Salt',
    'Black Pepper',
    'Peri Peri',
    'Honey Till',
    'Honey Rose',
    'Barbecue',
    'Cheese & Herbs',
    'Pudina',
    'Pizza',
    'Chilly',
    'Cream & Onion',
    'Cheese',
  ],
  'Roasted Indian Konkan Cashew': [
    'Salt',
    'Black Pepper',
    'Peri Peri',
    'Honey Till',
    'Honey Rose',
    'Barbecue',
    'Cheese & Herbs',
    'Chilly',
    'Punjabi Tadka',
    'Pudina',
  ],
  'Roasted California Pistachio': [
    'Salt',
    'Black Pepper',
    'Peri Peri',
    'Honey Till',
    'Honey Rose',
    'Barbecue',
    'Cheese & Herbs',
    'Pudina',
    'Pizza',
    'Chilly',
    'Cream & Onion',
    'Cheese',
  ],
  'Afghani Raisin': [
    'Paan',
    'Black Pepper',
    'Peri Peri',
    'Kala Khatta',
    'Honey Till',
    'Honey Rose',
    'Barbecue',
    'Cheese & Herbs',
    'Pudina',
    'Pizza',
    'Chilly',
    'Cream & Onion',
    'Cheese',
    'Others',
  ],
  Cranberry: ['Chilly', 'Salt', 'Kacha Aam', 'Masala', 'Peri Peri', 'Pudina', 'Chaat'],
  Makhana: [
    'Himalayan Salt',
    'Black Pepper',
    'Peri Peri',
    'Honey Till',
    'Honey Rose',
    'Barbecue',
    'Cheese & Herbs',
    'Chilly',
    'Punjabi Tadka',
    'Pudina',
  ],
};

const CHOCOLATE_COATINGS = ['Dark and White Chocolate', 'Milk and White Chocolate'];
const JAGGERY_COATINGS = ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'];

const PRODUCT_OPTIONS_BY_CATEGORY_AND_NAME = {
  'chocolates:Roasted California Almonds': {
    coatings: ['Dark and White Chocolate', 'Milk and White Chocolate'],
    flavors: ['Green Apple', 'Cranberry', 'Blueberry', 'Ras Malai', 'Pista', 'Coco Dust', 'Rose Petal', 'Paan', 'Mint'],
  },
  'chocolates:Roasted Indian Konkan Cashew': {
    coatings: ['Dark and White Chocolate', 'Milk and White Chocolate'],
    flavors: ['Green Apple', 'Coffee', 'Rabdi Elaichi', 'Rose Petal', 'Rasmalai', 'Blueberry', 'Cranberry', 'Coco Dust', 'Rose', 'Paan', 'Mint'],
  },
  'chocolates:Roasted Hazelnut': {
    coatings: ['Dark and White Chocolate', 'Milk and White Chocolate'],
    flavors: ['Green Apple', 'Cranberry', 'Blueberry', 'Ras Malai', 'Pista', 'Coco Dust', 'Rose Petal', 'Paan', 'Mint'],
  },
  'chocolates:Roasted California Pistachio': {
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: ['Green Apple'],
  },
  'chocolates:Afghani Raisin': {
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: [],
  },
  'chocolates:Roasted Coffee Beans': {
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: [],
  },
  'chocolates:Cranberry': {
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: [],
  },
  'chocolates:Blueberry': {
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: [],
  },
  'nuts:Roasted California Almonds': {
    coatings: [],
    flavors: ['Salt', 'Black Pepper', 'Peri Peri', 'Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Pudina', 'Pizza', 'Chilly', 'Cream & Onion', 'Cheese'],
  },
  'nuts:Roasted Indian Konkan Cashew': {
    coatings: [],
    flavors: ['Salt', 'Black Pepper', 'Peri Peri', 'Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Chilly', 'Punjabi Tadka', 'Pudina'],
  },
  'nuts:Roasted California Pistachio': {
    coatings: [],
    flavors: ['Salt', 'Black Pepper', 'Peri Peri', 'Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Pudina', 'Pizza', 'Chilly', 'Cream & Onion', 'Cheese'],
  },
  'nuts:Afghani Raisin': {
    coatings: [],
    flavors: ['Paan', 'Black Pepper', 'Peri Peri', 'Kala Khatta', 'Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Pudina', 'Pizza', 'Chilly', 'Cream & Onion', 'Cheese', 'Others'],
  },
  'nuts:Cranberry': {
    coatings: [],
    flavors: ['Chilly', 'Salt', 'Kacha Aam', 'Masala', 'Peri Peri', 'Pudina', 'Chaat'],
  },
  'nuts:Makhana': {
    coatings: [],
    flavors: ['Himalayan Salt', 'Black Pepper', 'Peri Peri', 'Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Chilly', 'Punjabi Tadka', 'Pudina'],
  },
  'jaggery:Roasted California Almonds': {
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery',
  },
  'jaggery:Roasted Indian Konkan Cashew': {
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery',
  },
  'jaggery:Roasted Chickpeas (Channa)': {
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery',
  },
  'jaggery:Roasted Peanut': {
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery',
  },
  'jaggery:Makhana': {
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery',
  },
};

const buildEnquiryText = (name, flavour) => {
  const title = flavour ? `${name} - ${flavour}` : name;
  return `Hi Sequeira Foods! I'm interested in ${title}. Could you please share pricing and availability?`;
};

const isHeroProduct = (name, flavour = '') => {
  return HERO_DEFINITIONS.some(
    (hero) => hero.name.toLowerCase() === String(name).toLowerCase() && hero.flavour.toLowerCase() === String(flavour || 'Classic').toLowerCase()
  );
};

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }
  await mongoose.connect(process.env.MONGODB_URI);
};

const enrichProduct = (product) => {
  const update = {
    productType: 'enquiry',
    isHeroProduct: false,
    parentProduct: product.parentProduct || '',
    flavour: product.flavour || '',
    whatsappEnquiryText: product.whatsappEnquiryText || buildEnquiryText(product.name, product.flavour),
    coatings: Array.isArray(product.coatings) ? product.coatings : [],
    flavors: Array.isArray(product.flavors) ? product.flavors : [],
    isDeliverable: false,
  };

  const matchKey = `${product.category}:${product.name}`;
  const matchedOptions = PRODUCT_OPTIONS_BY_CATEGORY_AND_NAME[matchKey];

  if (matchedOptions) {
    if (update.coatings.length === 0 && Array.isArray(matchedOptions.coatings)) {
      update.coatings = [...matchedOptions.coatings];
    }
    if (update.flavors.length === 0 && Array.isArray(matchedOptions.flavors)) {
      update.flavors = [...matchedOptions.flavors];
    }
    if (!product.defaultCoating && matchedOptions.defaultCoating) {
      update.defaultCoating = matchedOptions.defaultCoating;
    }
  }

  if (product.category === 'chocolates' && update.coatings.length === 0) {
    update.coatings = [...CHOCOLATE_COATINGS];
  }

  if (product.category === 'jaggery' && update.coatings.length === 0) {
    update.coatings = [...JAGGERY_COATINGS];
    if (!product.defaultCoating) {
      update.defaultCoating = 'Jaggery';
    }
  }

  if (product.category === 'nuts' && update.flavors.length === 0) {
    update.flavors = NUTS_FLAVOURS[product.name] || [];
  }

  if (isHeroProduct(product.name, update.flavour)) {
    update.productType = 'deliverable';
    update.isHeroProduct = true;
    update.isDeliverable = true;
    update.parentProduct = product.parentProduct || 'crunchy-chana';
  }

  if (String(product.name).toLowerCase().includes('gud chana') && !update.flavour) {
    update.flavour = 'Classic';
    update.parentProduct = 'gud-chana';
    update.productType = 'deliverable';
    update.isHeroProduct = true;
    update.isDeliverable = true;
  }

  if (String(product.name).toLowerCase().includes('crunchy chana') && update.flavour) {
    update.parentProduct = 'crunchy-chana';
    if (isHeroProduct('Crunchy Chana', update.flavour)) {
      update.productType = 'deliverable';
      update.isHeroProduct = true;
      update.isDeliverable = true;
    }
  }

  if (!product.whatsappEnquiryText) {
    update.whatsappEnquiryText = buildEnquiryText(product.name, update.flavour);
  }

  return update;
};

const run = async () => {
  await connectDB();

  const products = await Product.find({});
  if (!products.length) {
    console.log('No products found to enrich.');
    await mongoose.disconnect();
    return;
  }

  let modified = 0;

  for (const product of products) {
    const update = enrichProduct(product);
    await Product.updateOne({ _id: product._id }, { $set: update });
    modified += 1;
  }

  console.log(`Enriched ${modified} products with productType, hero flags, flavour/coating metadata.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Failed to enrich products:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
