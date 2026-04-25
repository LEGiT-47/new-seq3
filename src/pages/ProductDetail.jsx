import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useCart } from '../context/CartContext';
import { productAPI, getImageUrl } from '../lib/api';
import { buildWhatsAppEnquiryLink, getDisplayProductName } from '../lib/productUtils';
import { toast } from 'sonner';
import { ShoppingCart, Truck, ShieldCheck, PackageCheck, Plus, Minus, Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const isValidFlavour = (value) => {
  const normalized = String(value || '').trim();
  return normalized.length > 0 && /[A-Za-z0-9]/.test(normalized);
};

const fallbackNutritionByParent = {
  'gud-chana': {
    serving: 'Per 100g',
    calories: '380 kcal',
    protein: '17 g',
    carbs: '62 g',
    sugar: '23 g',
    fiber: '13 g',
    fat: '6 g',
    sodium: '210 mg',
  },
  'crunchy-chana': {
    serving: 'Per 100g',
    calories: '365 kcal',
    protein: '20 g',
    carbs: '58 g',
    sugar: '5 g',
    fiber: '16 g',
    fat: '7 g',
    sodium: '340 mg',
  },
  'savoury-almond': {
    serving: 'Per 100g',
    calories: '579 kcal',
    protein: '21 g',
    carbs: '22 g',
    sugar: '4 g',
    fiber: '12 g',
    fat: '50 g',
    sodium: '280 mg',
  },
  'savoury-cashew': {
    serving: 'Per 100g',
    calories: '553 kcal',
    protein: '18 g',
    carbs: '30 g',
    sugar: '6 g',
    fiber: '3 g',
    fat: '44 g',
    sodium: '290 mg',
  },
  'savoury-peanut': {
    serving: 'Per 100g',
    calories: '567 kcal',
    protein: '26 g',
    carbs: '16 g',
    sugar: '5 g',
    fiber: '9 g',
    fat: '49 g',
    sodium: '310 mg',
  },
  'savoury-makhana': {
    serving: 'Per 100g',
    calories: '347 kcal',
    protein: '10 g',
    carbs: '77 g',
    sugar: '1 g',
    fiber: '14 g',
    fat: '1 g',
    sodium: '220 mg',
  },
  'savoury-chana': {
    serving: 'Per 100g',
    calories: '362 kcal',
    protein: '19 g',
    carbs: '60 g',
    sugar: '4 g',
    fiber: '15 g',
    fat: '6 g',
    sodium: '300 mg',
  },
};

const fallbackNutritionByCategory = {
  nuts: {
    serving: 'Per 100g',
    calories: '575 kcal',
    protein: '21 g',
    carbs: '21 g',
    sugar: '5 g',
    fiber: '9 g',
    fat: '49 g',
    sodium: '220 mg',
  },
  seeds: {
    serving: 'Per 100g',
    calories: '520 kcal',
    protein: '20 g',
    carbs: '18 g',
    sugar: '2 g',
    fiber: '11 g',
    fat: '42 g',
    sodium: '140 mg',
  },
  dryfruits: {
    serving: 'Per 100g',
    calories: '355 kcal',
    protein: '6 g',
    carbs: '78 g',
    sugar: '55 g',
    fiber: '7 g',
    fat: '1 g',
    sodium: '15 mg',
  },
  chocolates: {
    serving: 'Per 100g',
    calories: '540 kcal',
    protein: '7 g',
    carbs: '56 g',
    sugar: '47 g',
    fiber: '6 g',
    fat: '33 g',
    sodium: '95 mg',
  },
  jaggery: {
    serving: 'Per 100g',
    calories: '380 kcal',
    protein: '6 g',
    carbs: '84 g',
    sugar: '56 g',
    fiber: '6 g',
    fat: '3 g',
    sodium: '120 mg',
  },
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [productResponse, allResponse] = await Promise.all([productAPI.getById(id), productAPI.getAll()]);
        const item = productResponse.data.data;
        const list = allResponse.data.data || [];

        setProduct(item);
        setAllProducts(list.filter((p) => !p.isHidden));
        setSelectedWeight(item.weight || '');
      } catch (error) {
        toast.error('Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const productId = product._id || product.id;
    const currentCategory = product.category;
    const candidates = allProducts.filter(
      (p) => (p._id || p.id) !== productId && p.productType === 'deliverable'
    );

    const usedIds = new Set();
    const usedCategories = new Set();
    const result = [];

    const pickUniqueCategory = (pool) => {
      for (const item of pool) {
        const itemId = item._id || item.id;
        const itemCategory = item.category || 'other';
        if (usedIds.has(itemId)) continue;
        if (usedCategories.has(itemCategory)) continue;

        usedIds.add(itemId);
        usedCategories.add(itemCategory);
        result.push(item);
        if (result.length >= 4) break;
      }
    };

    const differentCategory = candidates.filter((p) => p.category && p.category !== currentCategory);
    const sameCategory = candidates.filter((p) => p.category === currentCategory);
    const noCategory = candidates.filter((p) => !p.category);

    pickUniqueCategory(differentCategory);
    if (result.length < 4) pickUniqueCategory(sameCategory);
    if (result.length < 4) pickUniqueCategory(noCategory);

    if (result.length < 4) {
      const remaining = candidates.filter((p) => !usedIds.has(p._id || p.id));
      result.push(...remaining.slice(0, 4 - result.length));
    }

    return result.slice(0, 4);
  }, [allProducts, product]);

  const flavourVariants = useMemo(() => {
    if (!product?.parentProduct) return [];

    return allProducts
      .filter((p) => p.parentProduct === product.parentProduct && isValidFlavour(p.flavour))
      .sort((a, b) => (a.flavour || '').localeCompare(b.flavour || ''));
  }, [allProducts, product]);

  const safeImageGallery = useMemo(() => {
    if (!product) return [];

    const imageGallery = (product.images && product.images.length > 0 ? product.images : [product.image])
      .map((img) => getImageUrl(img))
      .filter(Boolean);

    return imageGallery;
  }, [product]);

  useEffect(() => {
    if (!safeImageGallery.length) {
      setActiveImageIndex(0);
      return;
    }

    setActiveImageIndex((prev) => {
      if (prev >= safeImageGallery.length) return 0;
      return prev;
    });
  }, [safeImageGallery]);

  const productDisplayName = getDisplayProductName(product);

  const ingredientItems = useMemo(() => {
    const fallback = ['Roasted chana', 'Natural seasoning', 'Cold-pressed oil', 'Sea salt'];

    if (!product?.ingredients) return fallback;
    if (Array.isArray(product.ingredients)) return product.ingredients;

    return String(product.ingredients)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [product]);

  const enhancedDescription = useMemo(() => {
    if (product?.description) return product.description;

    const base = `${productDisplayName} is crafted for a satisfying crunch and bold taste.`;
    const flavourText = product?.flavour ? ` The ${product.flavour} profile makes it easy to enjoy as an anytime snack.` : '';
    const categoryText = product?.category ? ` A great pick from our ${product.category} collection.` : '';
    return `${base}${flavourText}${categoryText}`;
  }, [productDisplayName, product]);

  const whyLovePoints = useMemo(() => {
    const points = [];

    if (ingredientItems.length) points.push('Made using carefully selected ingredients.');
    if (product?.weight || product?.netWeight) points.push(`Packed in ${product.netWeight || product.weight} for consistent portioning.`);
    if (product?.productType === 'deliverable') points.push('Healthy snacks, no oil and all, crafted for cleaner everyday snacking.');
    if (product?.flavour) points.push(`${product.flavour} flavour profile for balanced everyday snacking.`);

    if (!points.length) {
      points.push('Balanced taste with a crunchy texture.');
      points.push('Crafted with quality-focused ingredient selection.');
      points.push('Suitable for regular snacking and sharing.');
    }

    return points.slice(0, 3);
  }, [ingredientItems, product]);

  const bestForPoints = useMemo(() => {
    const points = [];

    points.push('Tea-time snacking and office breaks');
    points.push('Travel-friendly munching');
    if (product?.parentProduct === 'crunchy-chana') points.push('Trying multiple flavours from the Crunchy Chana range');
    else points.push('Family sharing and light evening cravings');

    return points.slice(0, 3);
  }, [product]);

  const nutritionData = useMemo(() => {
    const normalize = (input) => {
      if (!input) return null;
      if (typeof input === 'string') {
        return {
          serving: 'Per 100g',
          notes: input,
        };
      }
      if (typeof input === 'object') return input;
      return null;
    };

    const fromProduct = normalize(product?.nutritionInfo);
    const fallbackByFamily = product?.parentProduct ? fallbackNutritionByParent[product.parentProduct] : null;
    const fallbackByCategory = product?.category ? fallbackNutritionByCategory[product.category] : null;

    const resolved = fromProduct || fallbackByFamily || fallbackByCategory || {
      serving: 'Per 100g',
      calories: '360 kcal',
      protein: '14 g',
      carbs: '52 g',
      sugar: '8 g',
      fiber: '8 g',
      fat: '10 g',
      sodium: '220 mg',
    };

    return [
      { label: 'Serving Size', value: resolved.serving || 'Per 100g' },
      { label: 'Energy', value: resolved.calories || resolved.energy || 'NA' },
      { label: 'Protein', value: resolved.protein || 'NA' },
      { label: 'Carbohydrates', value: resolved.carbs || resolved.carbohydrates || 'NA' },
      { label: 'Total Sugar', value: resolved.sugar || resolved.totalSugar || 'NA' },
      { label: 'Dietary Fiber', value: resolved.fiber || resolved.dietaryFiber || 'NA' },
      { label: 'Total Fat', value: resolved.fat || resolved.totalFat || 'NA' },
      { label: 'Sodium', value: resolved.sodium || 'NA' },
    ];
  }, [product]);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-lg font-semibold">Product not found.</p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const displayName = productDisplayName;
  const whatsappLink = buildWhatsAppEnquiryLink(product);
  const activeSliderImage = safeImageGallery[activeImageIndex] || safeImageGallery[0] || '';
  const hasRating = Number(product.rating) > 0;
  const weights = product.weightOptions?.length ? product.weightOptions : product.weight ? [product.weight] : [];
  const hasSingleWeight = weights.length === 1;
  const unitPrice = Number(product.price) || 0;
  const originalUnitPrice = Number(product.originalPrice) || 0;
  const totalPrice = unitPrice * qty;
  const totalOriginalPrice = originalUnitPrice * qty;
  const savingsPercent = originalUnitPrice > unitPrice ? Math.round((1 - unitPrice / originalUnitPrice) * 100) : 0;
  const stockQuantity = Number(product.stockQuantity ?? 0);
  const isOutOfStock = stockQuantity <= 0;

  const formatPrice = (value) => new Intl.NumberFormat('en-IN').format(Math.round(value || 0));

  const goToImage = (index) => {
    if (!safeImageGallery.length) return;
    const total = safeImageGallery.length;
    const next = (index + total) % total;
    setActiveImageIndex(next);
  };

  const onAddToCart = () => {
    if (isOutOfStock) {
      toast.error(`${displayName} is out of stock`);
      return;
    }

    addToCart(product, qty, { flavor: product.flavour || null, weight: selectedWeight || product.weight || null });
    toast.success(`${displayName} added to cart`);
  };

  return (
    <div className="min-h-screen bg-white py-8 pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-gray-400">
          <button onClick={() => navigate('/products')} className="transition-colors hover:text-[#E8762A]">Products</button>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{displayName}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#26486E] bg-[#FFFBF5] p-5 sm:p-6">
            <div className="relative overflow-hidden rounded-3xl bg-[#FDF6EC] shadow-strong">
              <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[480px]">
                {safeImageGallery.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={displayName}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
                      index === activeImageIndex
                        ? 'translate-x-0 scale-100 opacity-100'
                        : index < activeImageIndex
                          ? '-translate-x-2 scale-[1.01] opacity-0'
                          : 'translate-x-2 scale-[1.01] opacity-0'
                    }`}
                  />
                ))}
              </div>
              {safeImageGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
                    onClick={() => goToImage(activeImageIndex - 1)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
                    onClick={() => goToImage(activeImageIndex + 1)}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {safeImageGallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                    activeImageIndex === index
                      ? 'scale-105 border-[#E8762A] shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => goToImage(index)}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#0B1D35]/15 bg-[#0B1D35]/[0.08] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#0B1D35]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B1D35]" />
              Sequeira Foods
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#0B1D35] sm:text-5xl">{displayName}</h1>
            {(product.tagline || product.shortDescription) && (
              <p className="mt-2 max-w-xl text-gray-500">{product.tagline || product.shortDescription}</p>
            )}

            {hasRating && (
              <div className="mt-4 flex items-center gap-2 text-[#E8762A]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-current' : 'stroke-current fill-none opacity-40'}`}
                  />
                ))}
                <span className="text-sm text-gray-500">({product.reviewCount || 0} ratings)</span>
              </div>
            )}

            {weights.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-[#0B1D35]">Size</p>
                <div className="flex flex-wrap gap-2">
                  {weights.map((size) =>
                    hasSingleWeight ? (
                      <span key={size} className="rounded-full border border-[#E8762A] bg-[#E8762A] px-4 py-1.5 text-sm font-medium text-white">
                        {size}
                      </span>
                    ) : (
                      <button
                        key={size}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                          selectedWeight === size
                            ? 'border-[#E8762A] bg-[#E8762A] text-white'
                            : 'border-gray-200 text-gray-500 hover:border-[#E8762A]'
                        }`}
                        onClick={() => setSelectedWeight(size)}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {product.parentProduct && (() => {
              if (flavourVariants.length <= 1) return null;

              return (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-[#0B1D35]">Choose Variant</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {flavourVariants.map((fp) => {
                      const isActive = (fp._id || fp.id) === (product._id || product.id);
                      const variantLabel = fp.flavour || getDisplayProductName(fp);

                      return (
                        <button
                          key={fp._id || fp.id}
                          onClick={() => navigate(`/product/${fp._id || fp.id}`)}
                          className={`min-w-[150px] shrink-0 overflow-hidden rounded-2xl border bg-white text-left transition ${
                            isActive
                              ? 'border-[#0B1D35] ring-2 ring-[#0B1D35]/25 ring-offset-2'
                              : 'border-gray-200 hover:border-[#E8762A]'
                          }`}
                        >
                          <div className="h-20 w-full overflow-hidden bg-gray-50">
                            <img src={getImageUrl(fp.image)} alt={variantLabel} className="h-full w-full object-cover" />
                          </div>
                          <div className="p-2.5">
                            <p className="line-clamp-1 text-xs font-semibold text-[#0B1D35]">{variantLabel}</p>
                            <p className="mt-1 text-sm font-bold text-[#0B1D35]">Rs. {formatPrice(fp.price)}</p>
                            {fp.weight && <p className="mt-0.5 text-[11px] text-gray-500">{fp.weight}</p>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <p className="font-serif text-5xl font-bold text-[#0B1D35]">Rs. {formatPrice(totalPrice)}</p>
              {originalUnitPrice > unitPrice && (
                <>
                  <p className="text-lg text-gray-500 line-through">Rs. {formatPrice(totalOriginalPrice)}</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-700">
                    {savingsPercent}% OFF
                  </span>
                </>
              )}
            </div>
            {product.productType === 'deliverable' && (
              <p className="mt-1 text-sm text-gray-500">
                Rs. {formatPrice(unitPrice)} x {qty} = <span className="font-semibold text-[#0B1D35]">Rs. {formatPrice(totalPrice)}</span>
              </p>
            )}
            <p className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
              {product.productType === 'deliverable' ? 'Usually ships in 2-3 days' : 'Enquire for Price'}
            </p>
            {product.productType === 'deliverable' && (
              <p className="mt-2 text-sm font-medium text-gray-500">
                Live stock: <span className="text-[#0B1D35]">{stockQuantity}</span>
              </p>
            )}

            <div className="mt-5 flex items-center gap-3">
              <p className="text-sm font-semibold text-[#0B1D35]">Quantity</p>
              <div className="flex items-center rounded-full border border-gray-200 text-[#0B1D35]">
                <button className="px-3 py-1.5" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button
                  className="px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => setQty((q) => Math.min(stockQuantity || 1, q + 1))}
                  disabled={isOutOfStock || qty >= stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {product.productType === 'deliverable' ? (
                <>
                  <Button
                    className="w-full rounded-full bg-[#E8762A] py-6 text-base font-bold shadow-medium transition-all duration-200 hover:scale-[1.02] hover:bg-[#D76219] hover:shadow-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
                    size="lg"
                    onClick={onAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full py-6 text-base font-bold"
                    size="lg"
                    disabled={isOutOfStock}
                    onClick={() => {
                      onAddToCart();
                      if (!isOutOfStock) navigate('/checkout');
                    }}
                  >
                    Buy Now
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full rounded-full bg-[#25D366] py-6 text-base font-bold shadow-medium transition-all duration-200 hover:scale-[1.02] hover:bg-[#1fa959]"
                  size="lg"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Enquire on WhatsApp
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="inline-flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <ShieldCheck className="h-5 w-5 text-[#2D5016]" />
                <span className="text-sm font-semibold text-[#0B1D35]">100% Natural</span>
              </div>
              <div className="inline-flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <PackageCheck className="h-5 w-5 text-[#2D5016]" />
                <span className="text-sm font-semibold text-[#0B1D35]">Healthy Snacks, No Oil and All</span>
              </div>
              <div className="inline-flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <Truck className="h-5 w-5 text-[#2D5016]" />
                <span className="text-sm font-semibold text-[#0B1D35]">Fast Dispatch</span>
              </div>
            </div>

            <div className="mt-6 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
              {product.ingredients && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#0B1D35]">Ingredients</span>
                  <span className="text-gray-500">{Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients}</span>
                </div>
              )}
              {product.shelfLife && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#0B1D35]">Shelf Life</span>
                  <span className="text-gray-500">{product.shelfLife}</span>
                </div>
              )}
              {product.netWeight && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#0B1D35]">Net Weight</span>
                  <span className="text-gray-500">{product.netWeight}</span>
                </div>
              )}
              {product.countryOfOrigin && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#0B1D35]">Country of Origin</span>
                  <span className="text-gray-500">{product.countryOfOrigin}</span>
                </div>
              )}
              {product.manufacturer && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#0B1D35]">Manufactured by</span>
                  <span className="text-gray-500">{product.manufacturer}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-b border-gray-100">
          <div className="flex gap-0 overflow-x-auto">
            {['description', 'ingredients', 'nutrition', 'storage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-display -mb-px whitespace-nowrap border-b-2 px-5 py-3 text-sm tracking-wider uppercase transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-[#E8762A] text-[#E8762A]'
                    : 'border-transparent text-gray-400 hover:text-[#0B1D35]'
                }`}
              >
                {tab === 'storage' ? 'HOW TO STORE' : tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'description' && (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h3 className="font-serif text-xl font-bold text-[#0B1D35]">About {displayName}</h3>
            <p className="mt-3 text-base leading-relaxed text-gray-500">{enhancedDescription}</p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <h4 className="text-lg font-semibold text-[#0B1D35]">Why You Will Love It</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-500">
                  {whyLovePoints.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <h4 className="text-lg font-semibold text-[#0B1D35]">Best For</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-500">
                  {bestForPoints.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'ingredients' && (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h3 className="text-2xl font-bold text-[#0B1D35]">Premium Ingredients</h3>
            <p className="mt-2 text-sm text-gray-500">Each ingredient is carefully selected for quality and nutritional value</p>
            <ul className="mt-6 space-y-3 text-base">
              {ingredientItems.map((item) => (
                <li key={item} className="rounded-lg border border-gray-100 bg-white p-4 text-gray-500 transition-all hover:border-[#E8762A]/30">
                  <span className="block">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'nutrition' && (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h3 className="text-2xl font-bold text-[#0B1D35]">Nutrition Information</h3>
            <p className="mt-2 text-sm text-gray-500">Approximate values based on product family and publicly available nutrition references.</p>
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-100 bg-white">
              {nutritionData.map((item, idx) => (
                <div
                  key={item.label}
                  className={`grid grid-cols-2 gap-3 px-4 py-3 text-sm ${idx !== nutritionData.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <span className="font-semibold text-[#0B1D35]">{item.label}</span>
                  <span className="text-right text-gray-500">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">Values may vary slightly by flavour and batch.</p>
          </div>
        )}
        {activeTab === 'storage' && (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h3 className="mb-4 text-2xl font-bold text-[#0B1D35]">How to Store</h3>
            <div className="prose prose-sm max-w-none text-base leading-relaxed text-gray-500">
              {product.storageInfo ? (
                <p className="whitespace-pre-wrap">
                  {product.storageInfo.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <span key={idx} className="font-bold text-[#0B1D35]">
                          {part.slice(2, -2)}
                        </span>
                      );
                    }
                    return part;
                  })}
                </p>
              ) : (
                'Store in a cool, dry place away from direct sunlight. Keep sealed after opening for best freshness.'
              )}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-white p-4">
                <p className="mb-2 font-semibold text-[#0B1D35]">✓ Storage Tips</p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li>• Use airtight containers</li>
                  <li>• Maintain cool temperature</li>
                  <li>• Avoid moisture and humidity</li>
                  <li>• Keep away from heat sources</li>
                </ul>
              </div>
              <div className="rounded-lg border border-gray-100 bg-white p-4">
                <p className="mb-2 font-semibold text-[#0B1D35]">✗ Avoid</p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li>• Direct sunlight exposure</li>
                  <li>• Refrigeration/Freezing</li>
                  <li>• Damp environments</li>
                  <li>• Opened containers</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-bold text-[#0B1D35] sm:text-3xl">You May Also Like</h2>
          <div className="mb-5 mt-1 h-0.5 w-12 rounded-full bg-[#E8762A]" />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {relatedProducts.map((item) => (
              <Link key={item._id || item.id} to={`/product/${item._id || item.id}`} className="min-w-full shrink-0 sm:min-w-[48%] lg:min-w-[25%]">
                <Card className="group overflow-hidden rounded-3xl border-0 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-strong">
                  <div className="h-1 w-full bg-gradient-to-r from-[#E8762A] to-[#f0943a]" />
                  <div className="overflow-hidden">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="font-sans text-lg font-bold text-[#0B1D35]">{getDisplayProductName(item)}</p>
                    <p className="mt-1 text-base font-bold text-[#0B1D35]">Rs. {item.price}</p>
                    {item.productType === 'deliverable' ? (
                      <Button
                        className="mt-3 w-full rounded-full bg-[#E8762A] hover:bg-[#d76b20]"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(item, 1, { flavor: item.flavour || null });
                        }}
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <Button className="mt-3 w-full rounded-full bg-[#25D366] hover:bg-[#1fa959]" asChild>
                        <a href={buildWhatsAppEnquiryLink(item)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                          Enquire
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {product.productType === 'deliverable' ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-strong lg:hidden">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-lg font-bold text-[#0B1D35]">Rs. {formatPrice(totalPrice)}</p>
            </div>
            <Button className="flex-1 rounded-full bg-[#E8762A] font-bold text-white hover:bg-[#D76219]" size="lg" onClick={onAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-strong lg:hidden">
          <Button className="w-full rounded-full bg-[#25D366] font-bold hover:bg-[#1fa959]" size="lg" asChild>
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Enquire on WhatsApp
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
