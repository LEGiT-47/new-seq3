export const BUSINESS_WHATSAPP_NUMBER = '919930709557';

export const HERO_PRODUCT_KEYS = [
  { parentProduct: 'gud-chana', flavour: 'Classic' },
  { parentProduct: 'crunchy-chana', flavour: 'BBQ' },
  { parentProduct: 'crunchy-chana', flavour: 'Cheese' },
  { parentProduct: 'crunchy-chana', flavour: 'Cream & Onion' },
  { parentProduct: 'crunchy-chana', flavour: 'Peri Peri' },
  { parentProduct: 'crunchy-chana', flavour: 'Pudina' },
];

const defaultFlavourByName = [
  { match: /bbq/i, flavour: 'BBQ' },
  { match: /cheese/i, flavour: 'Cheese' },
  { match: /cream\s*&\s*onion/i, flavour: 'Cream & Onion' },
  { match: /peri\s*peri/i, flavour: 'Peri Peri' },
  { match: /pudina/i, flavour: 'Pudina' },
  { match: /gud\s*chana/i, flavour: 'Classic' },
];

const normalizeParentProduct = (product) => {
  if (product.parentProduct) return product.parentProduct;

  const name = String(product.name || '').toLowerCase();
  if (name.includes('crunchy chana')) return 'crunchy-chana';
  if (name.includes('gud chana')) return 'gud-chana';
  return '';
};

const normalizeFlavour = (product) => {
  if (product.flavour) return product.flavour;

  const name = String(product.name || '');
  for (const item of defaultFlavourByName) {
    if (item.match.test(name)) return item.flavour;
  }

  return '';
};

const isHeroByKey = (parentProduct, flavour) => {
  return HERO_PRODUCT_KEYS.some(
    (hero) =>
      hero.parentProduct === parentProduct &&
      hero.flavour.toLowerCase() === String(flavour || '').toLowerCase()
  );
};

export const normalizeProduct = (rawProduct) => {
  const parentProduct = normalizeParentProduct(rawProduct);
  const flavour = normalizeFlavour(rawProduct);

  const explicitType = rawProduct.productType;
  const heroFromMetadata = Boolean(rawProduct.isHeroProduct);
  const heroFromDerivedKey = isHeroByKey(parentProduct, flavour);

  const productType = explicitType || (heroFromMetadata || heroFromDerivedKey ? 'deliverable' : 'enquiry');
  const isHeroProduct = heroFromMetadata || heroFromDerivedKey;

  const whatsappEnquiryText =
    rawProduct.whatsappEnquiryText ||
    `Hi Sequeira Foods! I'm interested in ${getDisplayProductName({ ...rawProduct, flavour })}. Could you please share pricing and availability?`;

  return {
    ...rawProduct,
    parentProduct,
    flavour,
    productType,
    isHeroProduct,
    isDeliverable: productType === 'deliverable',
    images: Array.isArray(rawProduct.images) && rawProduct.images.length > 0 ? rawProduct.images : rawProduct.image ? [rawProduct.image] : [],
    coatings: Array.isArray(rawProduct.coatings) ? rawProduct.coatings : [],
    flavors: Array.isArray(rawProduct.flavors) ? rawProduct.flavors : [],
    stockQuantity: Number.isFinite(Number(rawProduct.stockQuantity)) ? Math.max(0, Math.floor(Number(rawProduct.stockQuantity))) : 40,
    lowStockThreshold: Number.isFinite(Number(rawProduct.lowStockThreshold)) ? Math.max(0, Math.floor(Number(rawProduct.lowStockThreshold))) : 10,
    whatsappEnquiryText,
  };
};

export const normalizeProducts = (products = []) => products.map(normalizeProduct);

export const getDisplayProductName = (product) => {
  if (!product) return '';
  if (product.flavour && product.parentProduct) {
    if (product.parentProduct === 'gud-chana' && product.flavour === 'Classic') {
      return product.name || '';
    }
    return `${product.name || ''} - ${product.flavour}`.trim();
  }
  return product.name || '';
};

export const buildWhatsAppEnquiryLink = (product, overrideText) => {
  const text = overrideText || product.whatsappEnquiryText;
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const openWhatsAppEnquiry = (product, overrideText) => {
  const link = buildWhatsAppEnquiryLink(product, overrideText);
  window.open(link, '_blank');
};
