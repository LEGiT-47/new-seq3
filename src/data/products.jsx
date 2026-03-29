import choco_cashew from '../assets/products/choco-cashew.jpg';
import cashew_peri from '../assets/products/cashew_peri.JPG';
import Almond from '../assets/products/Almond.JPG';
import choco_almond from '../assets/products/choco_almond.JPG';
import coffee_dark from '../assets/products/COFFEE_CHOCOLATE.JPG';
import hazelnut_dark from '../assets/products/hazelnut_dark.JPG';
import raisin_chilly from '../assets/products/raisin_chilly.JPG';
import salted_almond from '../assets/products/salted_almond.JPG';
import cashew from '../assets/products/cashew-1.jpg';
import dry_fig from '../assets/products/dry_fig.jpg';
import dates from '../assets/products/dates.jpg';
import cranberry from '../assets/products/cranberry.jpg';
import blueberry from '../assets/products/blueberry.jpg';
import resin from '../assets/products/resin.jpg';
import walnut_1 from '../assets/products/walnut-1.jpg';
import pistachio from '../assets/products/pistachio.jpg';
import almond from '../assets/products/almond-1.jpg';
import sunflower from '../assets/products/sunflower.jpg';
import flax from '../assets/products/flax.jpg';
import watermelon from '../assets/products/watermelon.jpg';
import pumpkin from '../assets/products/pumpkin.jpg';
import chia from '../assets/products/chia.jpg';
import muskmelon from '../assets/products/muskmelon.jpg';
import apricot from '../assets/products/apricot.jpg';
import makhana_1 from '../assets/products/makhana-1.jpg';
import choco_pista from '../assets/products/choco_pista.jpg';
import choco_raisin from '../assets/products/choco_raisin.JPG';
import peanut from '../assets/products/peanut.jpg';
import Almond_jaggery from '../assets/products/ALMOND_JAGGERY.JPG';
import Cashew_jaggery from '../assets/products/CASHEW_JAGGERY.JPG';
import Chicpeas_jaggery from '../assets/products/CHICPEAS_JAGGERY.JPG';
import Makhana_jaggery from '../assets/products/MAKHANA_JAGGERY.JPG';
import Blueberry_chocolate from '../assets/products/BLUEBERRY_CHOCOLATE.JPG';
import Cranberry_chocolate from '../assets/products/CRANBERRY_CHOCOLATE.JPG';
import Cranberry_fn from '../assets/products/CRANBERRY_FN.JPG';
import Pista_fn from '../assets/products/PISTA_FN.JPG';
import Makhana_fn from '../assets/products/MAKHANA_FN.JPG';
// Product data for Sequeira Foods
export const categories = [
  {
    id: 'chocolates',
    name: 'Chocolates',
    description: 'Premium chocolate-coated nuts and delicacies',
    icon: '🤎',
    image: choco_cashew
  },
  {
    id: 'nuts',
    name: 'Flavoured Nuts',
    description: 'Deliciously seasoned and roasted nuts',
    icon: '🥜',
    image: cashew_peri
  },
  {
    id: 'jaggery',
    name: 'Jaggery Coated',
    description: 'Natural sweetness with sesame and poppy seeds',
    icon: '🍯',
    image: Chicpeas_jaggery
  },
  {
    id: 'dryfruits',
    name: 'Dry Fruits',
    description: 'Premium quality dried fruits and nuts',
    icon: '🌰',
    image: Almond
  },
  {
    id: 'seeds',
    name: 'Seeds',
    description: 'Premium quality seeds rich in nutrition',
    icon: '🌻',
    image: flax
  },
  {
    id: 'gifting',
    name: 'Gifting Solutions',
    description: 'Curated gift packs for every occasion',
    icon: '🎁',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Nnww&ixlib=rb-4.1.0&q=85'
  },
  {
    id: 'services',
    name: 'Gifting Services',
    description: 'Specialized gifting and corporate solutions',
    icon: '🎀',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85'
  },
  // {
  //   id: 'specials',
  //   name: 'Christmas and New Year Special',
  //   description: 'Limited time festive and seasonal special boxes',
  //   icon: '🎉',
  //   image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85'
  // }
];

export const products = [
  {
    id: 100,
    name: 'Gud Chana',
    category: 'jaggery',
    description: 'Traditional gud chana with a clean jaggery finish and satisfying crunch.',
    image: Chicpeas_jaggery,
    images: [
      Chicpeas_jaggery,
      '/images/products/gud_chana_gen_00001_.png',
      '/images/products/gud_chana_gen_00002_.png',
    ],
    price: 199,
    weight: '200g',
    bestseller: true,
    productType: 'deliverable',
    isHeroProduct: true,
    flavour: 'Classic',
    parentProduct: 'gud-chana',
    whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Gud Chana. Could you please share pricing and availability?",
    isDeliverable: true,
    coatings: ['Jaggery'],
    flavors: [],
    ingredients: [
      'Roasted Chickpeas (Chana) - Rich source of protein and fiber',
      'Organic Jaggery - Natural sweetener with minerals and antioxidants',
      'Sesame Seeds (Til) - High in calcium and essential minerals',
      'Cold-Pressed Groundnut Oil - Adds richness without refined oils',
      'Rock Salt - Natural seasoning for enhanced taste',
      'Turmeric Powder - Natural spice with anti-inflammatory properties',
      'Natural Gum Arabic - Coating agent for texture (food-grade)'
    ],
    nutrition: {
      'Calories (per 100g)': '385 kcal',
      'Protein': '18g',
      'Carbohydrates': '52g',
      'Fat': '10g',
      'Fiber': '8g',
      'Iron': '4.2mg',
      'Calcium': '120mg'
    },
    storageInfo: 'Store in an **airtight container** in a **cool, dry place** away from direct sunlight and moisture. Keep away from heat sources. Best consumed within **2 months** of opening. Do not refrigerate as it may cause condensation. Once opened, reseal the package immediately to maintain crunchiness.'
  },
  {
    id: 101,
    name: 'Crunchy Chana',
    category: 'nuts',
    description: 'Roasted crunchy chana with smoky barbecue seasoning.',
    image: cashew_peri,
    images: [
      cashew_peri,
      '/images/products/crunchy_chana_bbq_gen_00001_.png',
      '/images/products/crunchy_chana_bbq_gen_00002_.png',
    ],
    price: 219,
    weight: '100g',
    bestseller: true,
    productType: 'deliverable',
    isHeroProduct: true,
    flavour: 'BBQ',
    parentProduct: 'crunchy-chana',
    whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - BBQ. Could you please share pricing and availability?",
    isDeliverable: true,
    coatings: [],
    flavors: [],
    ingredients: [
      'Roasted Chickpeas (Chana) - Prime protein source with complete amino acids',
      'Smoky BBQ Seasoning - Paprika, garlic, and smoke-infused spices',
      'Cold-Pressed Vegetable Oil - For light coating without trans fats',
      'Black Pepper - Natural flavor enhancer with digestive benefits',
      'Garlic Powder - Adds umami depth to the smoky profile',
      'Sea Salt - Pure mineral-rich salt for salting',
      'Onion Powder - Complements the smoky BBQ flavor',
      'Natural Maltodextrin - Carries flavor without additives'
    ],
    nutrition: {
      'Calories (per 100g)': '390 kcal',
      'Protein': '19g',
      'Carbohydrates': '50g',
      'Fat': '11g',
      'Fiber': '9g',
      'Iron': '4.5mg',
      'Calcium': '100mg'
    },
    storageInfo: 'Store in an **airtight container** at room temperature for **maximum freshness**. Keep in a **dry, cool place** away from direct sunlight, heat, and humidity. Ideal storage temperature is **15-25°C**. Consume within **45 days** of opening for best taste and texture. Keep the container sealed after each use to prevent moisture absorption and maintain crunchiness.'
  },
  {
    id: 102,
    name: 'Crunchy Chana',
    category: 'nuts',
    description: 'Roasted crunchy chana with rich cheese flavouring.',
    image: salted_almond,
    images: [
      salted_almond,
      '/images/products/crunchy_chana_cheese_gen_00001_.png',
      '/images/products/crunchy_chana_cheese_gen_00002_.png',
    ],
    price: 219,
    weight: '100g',
    bestseller: true,
    productType: 'deliverable',
    isHeroProduct: true,
    flavour: 'Cheese',
    parentProduct: 'crunchy-chana',
    whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Cheese. Could you please share pricing and availability?",
    isDeliverable: true,
    coatings: [],
    flavors: [],
    ingredients: [
      'Roasted Chickpeas (Chana) - Excellent plant-based protein with dietary fiber',
      'Cheese Powder - Natural cheddar flavor with real cheese taste',
      'Nutritional Yeast - Rich in B vitamins and adds savory depth',
      'Cold-Pressed Vegetable Oil - Light carrier for flavor coating',
      'Sea Salt - Pure mineral content for flavor balance',
      'Garlic Powder - Enhances the cheese complexity',
      'Butter Powder - Adds creamy richness to cheese profile',
      'Onion Powder - Balances savory cheese notes'
    ],
    nutrition: {
      'Calories (per 100g)': '388 kcal',
      'Protein': '18g',
      'Carbohydrates': '51g',
      'Fat': '10g',
      'Fiber': '8g',
      'Iron': '4.3mg',
      'Calcium': '140mg'
    },
    storageInfo: 'Keep in an **airtight, moisture-proof container** at **room temperature**. Store in a **cool, dark place** away from heat sources and direct sunlight. **High humidity** may soften the texture, so use silica gel packets in the container if needed. Best consumed within **6 weeks** of opening. Seal tightly after each use to preserve the **creamy cheese flavor** and crispy texture.'
  },
  {
    id: 103,
    name: 'Crunchy Chana',
    category: 'nuts',
    description: 'Roasted crunchy chana tossed in cream and onion seasoning.',
    image: cashew_peri,
    images: [
      cashew_peri,
      '/images/products/crunchy_chana_cream_onion_gen_00001_.png',
      '/images/products/crunchy_chana_cream_onion_gen_00002_.png',
    ],
    price: 219,
    weight: '100g',
    bestseller: true,
    productType: 'deliverable',
    isHeroProduct: true,
    flavour: 'Cream & Onion',
    parentProduct: 'crunchy-chana',
    whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Cream & Onion. Could you please share pricing and availability?",
    isDeliverable: true,
    coatings: [],
    flavors: [],
    ingredients: [
      'Roasted Chickpeas (Chana) - Rich in protein and vegetarian iron',
      'Cream Powder - Adds smooth, luxurious creamy base',
      'Dried Onion - Layered savory and slightly sweet notes',
      'Cold-Pressed Vegetable Oil - Light carrier without artificial additives',
      'Sea Salt - Enhances all flavor components',
      'Butter Powder - Creamy, rich undertone',
      'Garlic Powder - Complements onion with depth',
      'White Pepper - Subtle heat without darkness',
      'Sour Cream Powder - Tangy complexity'
    ],
    nutrition: {
      'Calories (per 100g)': '392 kcal',
      'Protein': '19g',
      'Carbohydrates': '51g',
      'Fat': '11.5g',
      'Fiber': '8.5g',
      'Iron': '4.4mg',
      'Calcium': '110mg'
    },
    storageInfo: 'Store in a **sealed airtight container** at **room temperature** in a **cool, dry location**. Keep away from direct sunlight and heat sources. Avoid storing near open water or damp areas as the cream and onion flavoring is **moisture-sensitive**. Best consumed within **8 weeks** of opening. Always ensure the container is **tightly sealed** after consumption to preserve the creamy and oniony flavors.'
  },
  {
    id: 104,
    name: 'Crunchy Chana',
    category: 'nuts',
    description: 'Roasted crunchy chana with bold peri peri spice.',
    image: raisin_chilly,
    images: [
      raisin_chilly,
      '/images/products/crunchy_chana_peri_peri_gen_00001_.png',
      '/images/products/crunchy_chana_peri_peri_gen_00002_.png',
    ],
    price: 219,
    weight: '100g',
    bestseller: true,
    productType: 'deliverable',
    isHeroProduct: true,
    flavour: 'Peri Peri',
    parentProduct: 'crunchy-chana',
    whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Peri Peri. Could you please share pricing and availability?",
    isDeliverable: true,
    coatings: [],
    flavors: [],
    ingredients: [
      'Roasted Chickpeas (Chana) - Plant-based protein powerhouse with antioxidants',
      'Peri Peri Chili - African red chilies with bold, layered heat (Capsaicin-rich)',
      'Paprika - Smoky undertone with vitamin C and antioxidants',
      'Garlic & Onion - Aromatic base with sulfur compounds for immunity',
      'Cold-Pressed Vegetable Oil - Clean carrier for spice coating',
      'Sea Salt - Mineral-rich sodium chloride for balance',
      'Black Pepper - Enhances capsaicin absorption',
      'Cayenne & Chili Extract - Concentrated spicy heat'
    ],
    nutrition: {
      'Calories (per 100g)': '395 kcal',
      'Protein': '19.5g',
      'Carbohydrates': '50g',
      'Fat': '12g',
      'Fiber': '9g',
      'Iron': '4.6mg',
      'Calcium': '105mg'
    },
    storageInfo: 'Store in an **airtight container** at **room temperature** in a **dark, cool place**. Keep away from direct sunlight and heat exposure. **Keep away from moisture** as peri peri seasoning is hygroscopic. Best consumed within **6 weeks** of opening. Ensure the container is **tightly sealed** after each use to maintain the **bold spicy flavor**. Store separately from other products if they are mild-flavored.'
  },
  {
    id: 105,
    name: 'Crunchy Chana',
    category: 'nuts',
    description: 'Roasted crunchy chana with refreshing pudina masala.',
    image: Makhana_fn,
    images: [
      Makhana_fn,
      '/images/products/crunchy_chana_pudina_gen_00001_.png',
      '/images/products/crunchy_chana_pudina_gen_00002_.png',
    ],
    price: 219,
    weight: '100g',
    bestseller: true,
    productType: 'deliverable',
    isHeroProduct: true,
    flavour: 'Pudina',
    parentProduct: 'crunchy-chana',
    whatsappEnquiryText: "Hi Sequeira Foods! I'm interested in Crunchy Chana - Pudina. Could you please share pricing and availability?",
    isDeliverable: true,
    coatings: [],
    flavors: [],
    ingredients: [
      'Roasted Chickpeas (Chana) - High-quality legume protein with complete amino acids',
      'Dried Pudina (Mint) - Cooling menthol with digestive and antimicrobial properties',
      'Amchur (Dry Mango Powder) - Tangy notes with natural tartness',
      'Cumin (Jeera) - Warm spice with digestive benefits and anti-inflammatory compounds',
      'Coriander (Dhania) - Aromatic with cooling properties',
      'Black Salt (Kala Namak) - Contains sulfur compounds for unique sulphury taste',
      'Cold-Pressed Vegetable Oil - Light, clean carrier oil',
      'Dried Cilantro - Fresh herbal notes'
    ],
    nutrition: {
      'Calories (per 100g)': '388 kcal',
      'Protein': '19g',
      'Carbohydrates': '52g',
      'Fat': '10g',
      'Fiber': '8.5g',
      'Iron': '4.1mg',
      'Calcium': '115mg'
    },
    storageInfo: 'Store in a **cool, dry place** in an **airtight container** at **room temperature**. Keep away from direct sunlight and heat sources which can fade the refreshing mint flavor. **Store away from moisture** as pudina masala is sensitive to humidity. Best consumed within **2 months** of opening for optimal **minty freshness and masala aroma**. Seal the container tightly after each use to preserve the delicate mint essence and prevent flavor dissipation.'
  },
  // CHOCOLATES (8 products)
  {
    id: 1,
    name: 'Roasted California Almonds',
    category: 'chocolates',
    description: 'Premium California almonds coated in rich chocolate with delightful flavors',
    image: choco_almond,
    price: 450,
    weight: '200g',
    bestseller: true,
    coatings: ['Dark and White Chocolate', 'Milk and White Chocolate'],
    flavors: ['Green Apple', 'Cranberry', 'Blueberry', 'Ras Malai', 'Pista', 'Coco Dust', 'Rose Petal', 'Paan', 'Mint']
  },
  {
    id: 2,
    name: 'Roasted Indian Konkan Cashew',
    category: 'chocolates',
    description: 'Fresh Indian Konkan cashews coated in premium chocolate with flavors',
    image: choco_cashew,
    price: 500,
    weight: '200g',
    bestseller: true,
    coatings: ['Dark and White Chocolate', 'Milk and White Chocolate'],
    flavors: ['Green Apple', 'Coffee', 'Rabdi Elaichi', 'Rose Petal', 'Rasmalai', 'Blueberry', 'Cranberry', 'Coco Dust', 'Rose', 'Paan', 'Mint']
  },
  {
    id: 3,
    name: 'Roasted Hazelnut',
    category: 'chocolates',
    description: 'Premium hazelnuts coated in chocolate with various flavors',
    image: hazelnut_dark,
    price: 520,
    weight: '200g',
    bestseller: true,
    coatings: ['Dark and White Chocolate', 'Milk and White Chocolate'],
    flavors: ['Green Apple', 'Cranberry', 'Blueberry', 'Ras Malai', 'Pista', 'Coco Dust', 'Rose Petal', 'Paan', 'Mint']
  },
  {
    id: 4,
    name: 'Roasted California Pistachio',
    category: 'chocolates',
    description: 'California pistachios coated in chocolate with delightful flavor options',
    image: choco_pista,
    price: 580,
    weight: '200g',
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: ['Green Apple']
  },
  {
    id: 5,
    name: 'Afghani Raisin',
    category: 'chocolates',
    description: 'Premium Afghani raisins coated in chocolate with flavor varieties',
    image: choco_raisin,
    price: 420,
    weight: '200g',
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: []
  },
  {
    id: 6,
    name: 'Roasted Coffee Beans',
    category: 'chocolates',
    description: 'Roasted coffee beans coated in premium chocolate',
    image: coffee_dark,
    price: 480,
    weight: '200g',
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: []
  },
  {
    id: 7,
    name: 'Cranberry',
    category: 'chocolates',
    description: 'Tart and sweet cranberries coated in premium chocolate',
    image: Cranberry_chocolate,
    price: 420,
    weight: '200g',
    bestseller: true,
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: []
  },
  {
    id: 8,
    name: 'Blueberry',
    category: 'chocolates',
    description: 'Juicy blueberries coated in premium chocolate',
    image: Blueberry_chocolate,
    price: 430,
    weight: '200g',
    coatings: ['Dark with White Chocolate', 'Milk with White Chocolate'],
    flavors: []
  },

  // FLAVORED NUTS (6 products)
  {
    id: 9,
    name: 'Roasted California Almonds',
    category: 'nuts',
    description: 'Roasted California almonds with savory and spicy coatings',
    image: salted_almond,
    price: 400,
    weight: '200g',
    bestseller: true,
    coatings: [],
    flavors: ['Salt','Black Pepper','Peri Peri','Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Pudina', 'Pizza', 'Chilly', 'Cream & Onion', 'Cheese']
  },
  {
    id: 10,
    name: 'Roasted Indian Konkan Cashew',
    category: 'nuts',
    description: 'Indian Konkan cashews with delicious savory coatings',
    image: cashew_peri,
    price: 450,
    weight: '200g',
    bestseller: true,
    coatings: [],
    flavors: ['Salt','Black Pepper','Peri Peri','Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Chilly', 'Punjabi Tadka', 'Pudina']
  },
  {
    id: 11,
    name: 'Roasted California Pistachio',
    category: 'nuts',
    description: 'California pistachios with savory and tangy coatings',
    image: Pista_fn,
    price: 520,
    weight: '200g',
    coatings: [],
    flavors: ['Salt','Black Pepper','Peri Peri','Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Pudina', 'Pizza', 'Chilly', 'Cream & Onion', 'Cheese']
  },
  {
    id: 12,
    name: 'Afghani Raisin',
    category: 'nuts',
    description: 'Afghani raisins with unique Indian spice coatings',
    image: raisin_chilly,
    price: 360,
    weight: '200g',
    bestseller: true,
    coatings: [],
    flavors: ['Paan','Black Pepper','Peri Peri','Kala Khatta','Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Pudina', 'Pizza', 'Chilly', 'Cream & Onion', 'Cheese', 'Others']
  },
  {
    id: 13,
    name: 'Cranberry',
    category: 'nuts',
    description: 'Cranberries with Indian flavor coatings',
    image: Cranberry_fn,
    price: 340,
    weight: '200g',
    coatings: [],
    flavors: ['Chilly','Salt','Kacha Aam','Masala','Peri Peri','Pudina','Chaat']
  },
  {
    id: 14,
    name: 'Makhana',
    category: 'nuts',
    description: 'Crispy fox nuts with savory coatings',
    image: Makhana_fn,
    price: 320,
    weight: '150g',
    coatings: [],
    flavors: ['Himalayan Salt','Black Pepper','Peri Peri','Honey Till', 'Honey Rose', 'Barbecue', 'Cheese & Herbs', 'Chilly', 'Punjabi Tadka', 'Pudina']
  },

  // JAGGERY COATED (6 products)
  {
    id: 15,
    name: 'Roasted California Almonds',
    category: 'jaggery',
    description: 'California almonds coated in organic jaggery with sesame or poppy seeds',
    image: Almond_jaggery,
    price: 400,
    weight: '200g',
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery'
  },
  {
    id: 16,
    name: 'Roasted Indian Konkan Cashew',
    category: 'jaggery',
    description: 'Indian Konkan cashews coated in organic jaggery with seeds',
    image: Cashew_jaggery,
    price: 450,
    weight: '200g',
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery'
  },
  {
    id: 18,
    name: 'Roasted Chickpeas (Channa)',
    category: 'jaggery',
    description: 'Roasted chickpeas coated in organic jaggery with seeds',
    image: Chicpeas_jaggery,
    price: 280,
    weight: '200g',
    bestseller: true,
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery'
  },
  {
    id: 19,
    name: 'Roasted Peanut',
    category: 'jaggery',
    description: 'Roasted peanuts coated in organic jaggery with seeds',
    image: peanut,
    price: 250,
    weight: '250g',
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery'
  },
  {
    id: 20,
    name: 'Makhana',
    category: 'jaggery',
    description: 'Crispy fox nuts coated in organic jaggery with seeds',
    image: Makhana_jaggery,
    price: 320,
    weight: '150g',
    bestseller: true,
    coatings: ['Jaggery', 'Jaggery with Sesame Seeds', 'Jaggery with Poppy Seeds'],
    flavors: [],
    defaultCoating: 'Jaggery'
  },

  // DRY FRUITS (11 products - no dropdowns)
  {
    id: 21,
    name: 'California Almonds (Badam)',
    category: 'dryfruits',
    description: 'Premium quality California almonds',
    image: almond,
    price: 650,
    weight: '500g',
    bestseller: true,
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 22,
    name: 'Indian Konkan Cashew',
    category: 'dryfruits',
    description: 'Fresh Indian Konkan cashews',
    image: cashew,
    price: 750,
    weight: '500g',
    bestseller: true,
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 23,
    name: 'California Pistachio (Pista)',
    category: 'dryfruits',
    description: 'Premium quality California pistachios',
    image:pistachio,
    price: 800,
    weight: '500g',
    bestseller: true,
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 24,
    name: 'Afghani Raisin (Kishmish)',
    category: 'dryfruits',
    description: 'Premium Afghani raisins',
    image: resin,
    price: 380,
    weight: '500g',
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 25,
    name: 'Walnut',
    category: 'dryfruits',
    description: 'Premium quality walnuts',
    image: walnut_1,
    price: 720,
    weight: '500g',
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 26,
    name: 'Dates (Khajur)',
    category: 'dryfruits',
    description: 'Soft and sweet premium dates',
    image: dates ,
    price: 420,
    weight: '500g',
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 27,
    name: 'Dried Fig (Anjeer)',
    category: 'dryfruits',
    description: 'Premium quality dried figs',
    image: dry_fig,
    price: 550,
    weight: '500g',
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 28,
    name: 'Apricots',
    category: 'dryfruits',
    description: 'Premium quality dried apricots',
    image: apricot,
    price: 480,
    weight: '500g',
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 29,
    name: 'Fox Nuts (Makhana)',
    category: 'dryfruits',
    description: 'Premium quality fox nuts',
    image: makhana_1,
    price: 340,
    weight: '500g',
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 30,
    name: 'Cranberry',
    category: 'dryfruits',
    description: 'Premium quality dried cranberries',
    image:cranberry,
    price: 380,
    weight: '500g',
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },
  {
    id: 52,
    name: 'Blueberry',
    category: 'dryfruits',
    description: 'Premium quality blueberries',
    image: blueberry,
    price: 380,
    weight: '500g',
    isDeliverable: false,
    productType: 'enquiry',
    coatings: [],
    flavors: []
  },


  // SEEDS (6 products)
  {
    id: 31,
    name: 'Sunflower Seeds',
    category: 'seeds',
    description: 'Premium quality sunflower seeds rich in nutrition',
    image: sunflower,
    price: 380,
    weight: '500g',
    bestseller: true,
    coatings: [],
    flavors: []
  },
  {
    id: 32,
    name: 'Watermelon Seeds',
    category: 'seeds',
    description: 'Premium quality watermelon seeds',
    image: watermelon,
    price: 320,
    weight: '500g',
    coatings: [],
    flavors: []
  },
  {
    id: 33,
    name: 'Flax Seeds',
    category: 'seeds',
    description: 'Premium quality flax seeds rich in omega-3',
    image: flax,
    price: 400,
    weight: '500g',
    coatings: [],
    flavors: []
  },
  {
    id: 34,
    name: 'Pumpkin Seeds',
    category: 'seeds',
    description: 'Premium quality pumpkin seeds',
    image: pumpkin,
    price: 420,
    weight: '500g',
    bestseller: true,
    coatings: [],
    flavors: []
  },
  {
    id: 35,
    name: 'Chia Seeds',
    category: 'seeds',
    description: 'Premium quality chia seeds',
    image: chia,
    price: 480,
    weight: '500g',
    bestseller: true,
    coatings: [],
    flavors: []
  },
  {
    id: 36,
    name: 'Muskmelon Seeds',
    category: 'seeds',
    description: 'Premium quality muskmelon seeds',
    image: muskmelon,
    price: 360,
    weight: '500g',
    coatings: [],
    flavors: []
  },

  // GIFTING SOLUTIONS (7 products)
  {
    id: 37,
    name: 'Classic Assorted Pack',
    category: 'gifting',
    description: 'A mix of popular dry fruits like almonds, cashews, pistachios, raisins, and walnuts',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Nnww&ixlib=rb-4.1.0&q=85',
    price: 1200,
    weight: '800g',
    bestseller: true,
    coatings: [],
    flavors: []
  },
  {
    id: 38,
    name: 'Premium Assorted Pack',
    category: 'gifting',
    description: 'Feature luxurious options like macadamia nuts, pecans, and dried figs',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1800,
    weight: '1kg',
    bestseller: true,
    coatings: [],
    flavors: []
  },
  {
    id: 39,
    name: 'Customized Pack',
    category: 'gifting',
    description: 'Tailored to the recipient\'s specific preferences and desired portion sizes',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1500,
    weight: '800g',
    coatings: [],
    flavors: []
  },
  {
    id: 40,
    name: 'Chocolate Covered Dry Fruits Pack',
    category: 'gifting',
    description: 'A delightful option combining chocolate with dry fruits',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1400,
    weight: '800g',
    coatings: [],
    flavors: []
  },
  {
    id: 41,
    name: 'Flavored Coated Dry Fruits Pack',
    category: 'gifting',
    description: 'A tasty twist on dry fruits, coated with delicious flavors for a crunchy treat',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1300,
    weight: '800g',
    bestseller: true,
    coatings: [],
    flavors: []
  },
  {
    id: 42,
    name: 'Jaggery Coated Dry Fruits Pack',
    category: 'gifting',
    description: 'A natural blend of jaggery and dry fruits, offering a sweet and healthy bite',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHhjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1250,
    weight: '800g',
    coatings: [],
    flavors: []
  },
  {
    id: 43,
    name: 'Healthy Snack Pack',
    category: 'gifting',
    description: 'Include unsalted or organic dry fruits along with seeds such as chia, flax, or sunflower seeds',
    image: 'https://images.unsplash.com/photo-1602948750761-97ea79ee42ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxkcnklMjBmcnVpdHN8ZW58MHx8fHwxNzYxNDIyODcxfDA&ixlib=rb-4.1.0&q=85',
    price: 1100,
    weight: '800g',
    coatings: [],
    flavors: []
  },

  // GIFTING SERVICES (4 products)
  {
    id: 44,
    name: 'Corporate Gifting',
    category: 'services',
    description: 'Professional gifting solutions for corporate occasions, events, and client appreciation',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 2500,
    weight: 'Custom',
    coatings: [],
    flavors: []
  },
  {
    id: 45,
    name: 'Festive Gifting',
    category: 'services',
    description: 'Special festive collections for Diwali, Christmas, Eid, and other celebrations',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1500,
    weight: 'Custom',
    bestseller: true,
    coatings: [],
    flavors: []
  },
  {
    id: 46,
    name: 'Personalized Gifting',
    category: 'services',
    description: 'Customized gift packages with personalized packaging and branding',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 2000,
    weight: 'Custom',
    coatings: [],
    flavors: []
  },
  {
    id: 47,
    name: 'Event & Wedding Gifting',
    category: 'services',
    description: 'Premium gifting solutions for weddings, anniversaries, and special events',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHhjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 3000,
    weight: 'Custom',
    bestseller: true,
    coatings: [],
    flavors: []
  },

  // SPECIAL OFFERS (4 products)
  {
    id: 48,
    name: 'Christmas Special Box',
    category: 'specials',
    description: 'Delightful festive collection perfect for Christmas celebrations. Premium mix of chocolate-coated nuts, roasted almonds, and seasonal treats.',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHhjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1599,
    weight: '1kg',
    bestseller: true,
    isHidden: true,
    coatings: [],
    flavors: []
  },
  {
    id: 49,
    name: 'Christmas Kuswar - Small',
    category: 'specials',
    description: 'Premium small Kuswar box with assorted festive delicacies. Perfect for individuals or small families during Christmas celebrations.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop',
    price: 599,
    weight: '400g',
    bestseller: true,
    isHidden: true,
    coatings: [],
    flavors: []
  },
  {
    id: 50,
    name: 'Christmas Kuswar - Medium',
    category: 'specials',
    description: 'Medium-sized Kuswar box with an excellent selection of premium nuts, dry fruits, and festive treats. Ideal for small families and gifting.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop',
    price: 999,
    weight: '750g',
    bestseller: true,
    isHidden: true,
    coatings: [],
    flavors: []
  },
  {
    id: 51,
    name: 'Christmas Kuswar - Large',
    category: 'specials',
    description: 'Large deluxe Kuswar box featuring premium varieties of nuts, dry fruits, chocolates, and seasonal treats. Perfect for large families and corporate gifting.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop',
    price: 1499,
    weight: '1.2kg',
    bestseller: true,
    isHidden: true,
    coatings: [],
    flavors: []
  },

  // FESTIVE GIFTING PRODUCTS
  {
    id: 53,
    name: 'Valentine\'s Day Special Box',
    category: 'gifting',
    description: 'A romantic and thoughtful gift collection perfect for your loved one on Valentine\'s Day. Features premium chocolate-coated nuts, roasted almonds, and specialty items beautifully packaged for the occasion.',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1299,
    weight: '600g',
    bestseller: true,
    isFestive: true,
    discount: 15,
    originalPrice: 1499,
    coatings: [],
    flavors: []
  },
  {
    id: 54,
    name: 'Diwali Festival Box',
    category: 'gifting',
    description: 'Celebrate the festival of lights with our special Diwali collection. A vibrant selection of premium dry fruits, chocolate-coated nuts, and festive treats packaged in elegant Diwali-themed boxes.',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1499,
    weight: '750g',
    bestseller: true,
    isFestive: true,
    discount: 20,
    originalPrice: 1899,
    coatings: [],
    flavors: []
  },
  {
    id: 55,
    name: 'New Year Celebration Pack',
    category: 'gifting',
    description: 'Ring in the new year with our premium celebration pack. A sophisticated collection of luxury nuts and dry fruits perfect for welcoming the new year with elegance and style.',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1699,
    weight: '800g',
    bestseller: true,
    isFestive: true,
    discount: 10,
    originalPrice: 1899,
    coatings: [],
    flavors: []
  },
  {
    id: 56,
    name: 'Holi Colors Special Box',
    category: 'gifting',
    description: 'Celebrate the festival of colors with our vibrant Holi special collection. A colorful assortment of premium nuts and treats, perfect for sharing joy with loved ones during Holi.',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1099,
    weight: '500g',
    isFestive: true,
    discount: 12,
    originalPrice: 1299,
    coatings: [],
    flavors: []
  },
  {
    id: 57,
    name: 'Eid Celebration Box',
    category: 'gifting',
    description: 'Share the joy of Eid with our special celebration box. A premium collection of dry fruits and nuts, traditionally favored during Eid celebrations and gatherings.',
    image: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzfGVufDB8fHx8MTc2MTQyMjg3Ynww&ixlib=rb-4.1.0&q=85',
    price: 1199,
    weight: '600g',
    isFestive: true,
    discount: 15,
    originalPrice: 1399,
    coatings: [],
    flavors: []
  }
];

// Helper functions
export const getProductsByCategory = (categoryId) => {
  if (!categoryId || categoryId === 'all') {
    return products;
  }
  return products.filter(product => product.category === categoryId);
};

export const getBestsellerProducts = () => {
  return products.filter(product => product.bestseller).slice(0, 8);
};

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

export const getFeaturedCategories = () => {
  return categories.slice(0, 4);
};
