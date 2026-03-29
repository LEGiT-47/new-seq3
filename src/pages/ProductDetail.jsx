import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useCart } from '../context/CartContext';
import { productAPI, getImageUrl } from '../lib/api';
import { buildWhatsAppEnquiryLink, getDisplayProductName } from '../lib/productUtils';
import { toast } from 'sonner';
import { ShoppingCart, Truck, ShieldCheck, PackageCheck, Plus, Minus, Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const flavorColorMap = {
  BBQ: 'bg-red-500 text-white border-red-500',
  Cheese: 'bg-yellow-400 text-black border-yellow-400',
  'Cream & Onion': 'bg-lime-300 text-black border-lime-300',
  'Peri Peri': 'bg-orange-500 text-white border-orange-500',
  Pudina: 'bg-green-500 text-white border-green-500',
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
    return allProducts
      .filter((p) => p.category === product.category && (p._id || p.id) !== (product._id || product.id))
      .slice(0, 4);
  }, [allProducts, product]);

  const flavourStoryItems = useMemo(() => {
    return allProducts
      .filter((p) => p.parentProduct === 'crunchy-chana')
      .slice(0, 5)
      .map((p) => ({
        ...p,
        story:
          p.flavour === 'BBQ'
            ? 'Smoky and bold with grill-style notes.'
            : p.flavour === 'Cheese'
              ? 'Creamy cheesy crunch for comfort snacking.'
              : p.flavour === 'Cream & Onion'
                ? 'Tangy and savoury with a smooth finish.'
                : p.flavour === 'Peri Peri'
                  ? 'Spicy kick that builds with every bite.'
                  : 'Cool minty profile with masala depth.',
      }));
  }, [allProducts]);

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
    if (product?.productType === 'deliverable') points.push('Ready to ship with secure packaging and quick dispatch.');
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

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground">Loading product details...</div>;
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

  const formatPrice = (value) => new Intl.NumberFormat('en-IN').format(Math.round(value || 0));

  const goToImage = (index) => {
    if (!safeImageGallery.length) return;
    const total = safeImageGallery.length;
    const next = (index + total) % total;
    setActiveImageIndex(next);
  };

  const onAddToCart = () => {
    addToCart(product, qty, { flavor: product.flavour || null, weight: selectedWeight || product.weight || null });
    toast.success(`${displayName} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background py-8 pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-muted-foreground">
          <button onClick={() => navigate('/products')} className="transition-colors hover:text-[#E8762A]">Products</button>
          <span className="mx-2">/</span>
          <span>{displayName}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="relative overflow-hidden rounded-3xl bg-[#FDF6EC] shadow-strong">
              <img src={activeSliderImage} alt={displayName} className="h-[480px] w-full object-cover" />
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
            <p className="inline-flex items-center gap-2 rounded-full bg-[#2D5016]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#2D5016]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2D5016]" />
              Sequeira Foods
            </p>
            <h1 className="mt-3 font-display text-4xl font-black leading-tight text-[#1A0A00] sm:text-5xl">{displayName}</h1>
            {(product.tagline || product.shortDescription) && (
              <p className="mt-2 max-w-xl text-muted-foreground">{product.tagline || product.shortDescription}</p>
            )}

            {hasRating && (
              <div className="mt-4 flex items-center gap-2 text-[#E8762A]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-current' : 'stroke-current fill-none opacity-40'}`}
                  />
                ))}
                <span className="text-sm text-muted-foreground">({product.reviewCount || 0} ratings)</span>
              </div>
            )}

            {weights.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-[#1A0A00]">Size</p>
                <div className="flex flex-wrap gap-2">
                  {weights.map((size) =>
                    hasSingleWeight ? (
                      <span key={size} className="rounded-full border border-[#E8762A] bg-[#E8762A]/10 px-4 py-1.5 text-sm font-medium text-[#1A0A00]">
                        {size}
                      </span>
                    ) : (
                      <button
                        key={size}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                          selectedWeight === size
                            ? 'border-[#E8762A] bg-[#E8762A] text-white'
                            : 'border-border text-muted-foreground hover:border-[#E8762A]'
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
              const siblings = allProducts.filter(
                (p) => p.parentProduct === product.parentProduct && (p._id || p.id) !== (product._id || product.id)
              );
              const allFlavours = [product, ...siblings].sort((a, b) => (a.flavour || '').localeCompare(b.flavour || ''));
              if (allFlavours.length <= 1) return null;

              return (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-[#1A0A00]">Flavour</p>
                  <div className="flex flex-wrap gap-2">
                    {allFlavours.map((fp) => {
                      const isActive = (fp._id || fp.id) === (product._id || product.id);
                      const colorClass = flavorColorMap[fp.flavour] || 'border-border bg-muted text-foreground';

                      return (
                        <button
                          key={fp._id || fp.id}
                          onClick={() => navigate(`/product/${fp._id || fp.id}`)}
                          className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                            isActive
                              ? `${colorClass} ring-2 ring-[#E8762A] ring-offset-2`
                              : 'border-border bg-muted text-muted-foreground hover:border-[#E8762A]'
                          }`}
                        >
                          {fp.flavour}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <p className="font-display text-5xl font-black text-[#1A0A00]">Rs. {formatPrice(totalPrice)}</p>
              {originalUnitPrice > unitPrice && (
                <>
                  <p className="text-lg text-muted-foreground line-through">Rs. {formatPrice(totalOriginalPrice)}</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-700">
                    {savingsPercent}% OFF
                  </span>
                </>
              )}
            </div>
            {product.productType === 'deliverable' && (
              <p className="mt-1 text-sm text-muted-foreground">
                Rs. {formatPrice(unitPrice)} x {qty} = <span className="font-semibold text-[#1A0A00]">Rs. {formatPrice(totalPrice)}</span>
              </p>
            )}
            <p className="mt-2 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
              {product.productType === 'deliverable' ? 'Usually ships in 2-3 days' : 'Enquire for Price'}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <p className="text-sm font-semibold text-[#1A0A00]">Quantity</p>
              <div className="flex items-center rounded-full border border-border">
                <button className="px-3 py-1.5" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button className="px-3 py-1.5" onClick={() => setQty((q) => q + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {product.productType === 'deliverable' ? (
                <>
                  <Button
                    className="w-full rounded-full bg-[#E8762A] py-6 text-base font-bold shadow-medium transition-all duration-200 hover:scale-[1.02] hover:bg-[#d76b20] hover:shadow-strong active:scale-[0.98]"
                    size="lg"
                    onClick={onAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full rounded-full py-6 text-base font-bold" size="lg" onClick={() => { onAddToCart(); navigate('/checkout'); }}>
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
              <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-soft">
                <ShieldCheck className="h-5 w-5 text-[#2D5016]" />
                <span className="text-sm font-semibold text-[#1A0A00]">100% Natural</span>
              </div>
              <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-soft">
                <PackageCheck className="h-5 w-5 text-[#2D5016]" />
                <span className="text-sm font-semibold text-[#1A0A00]">Secure Packaging</span>
              </div>
              <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-soft">
                <Truck className="h-5 w-5 text-[#2D5016]" />
                <span className="text-sm font-semibold text-[#1A0A00]">Fast Dispatch</span>
              </div>
            </div>

            <div className="mt-6 space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
              {product.ingredients && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#1A0A00]">Ingredients</span>
                  <span className="text-muted-foreground">{Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients}</span>
                </div>
              )}
              {product.shelfLife && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#1A0A00]">Shelf Life</span>
                  <span className="text-muted-foreground">{product.shelfLife}</span>
                </div>
              )}
              {product.netWeight && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#1A0A00]">Net Weight</span>
                  <span className="text-muted-foreground">{product.netWeight}</span>
                </div>
              )}
              {product.countryOfOrigin && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#1A0A00]">Country of Origin</span>
                  <span className="text-muted-foreground">{product.countryOfOrigin}</span>
                </div>
              )}
              {product.manufacturer && (
                <div className="flex gap-2">
                  <span className="min-w-[120px] font-semibold text-[#1A0A00]">Manufactured by</span>
                  <span className="text-muted-foreground">{product.manufacturer}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-b border-border">
          <div className="flex gap-0 overflow-x-auto">
            {['description', 'ingredients', 'nutrition', 'storage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`-mb-px whitespace-nowrap border-b-2 px-5 py-3 text-sm font-semibold capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-[#E8762A] text-[#E8762A]'
                    : 'border-transparent text-muted-foreground hover:text-[#1A0A00]'
                }`}
              >
                {tab === 'storage' ? 'How to Store' : tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'description' && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-6">
            <h3 className="text-2xl font-bold text-[#1A0A00]">About {displayName}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{enhancedDescription}</p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/60 p-4">
                <h4 className="text-lg font-semibold text-[#1A0A00]">Why You Will Love It</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {whyLovePoints.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-muted/60 p-4">
                <h4 className="text-lg font-semibold text-[#1A0A00]">Best For</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {bestForPoints.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'ingredients' && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-6">
            <h3 className="text-2xl font-bold text-[#1A0A00]">Premium Ingredients</h3>
            <p className="mt-2 text-sm text-muted-foreground">Each ingredient is carefully selected for quality and nutritional value</p>
            <ul className="mt-6 space-y-3 text-base">
              {ingredientItems.map((item) => (
                <li key={item} className="rounded-lg border border-border/50 bg-gradient-to-r from-muted/40 to-transparent p-4 text-muted-foreground hover:border-[#E8762A]/30 hover:bg-muted/60 transition-all">
                  <span className="block">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'storage' && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-6">
            <h3 className="text-2xl font-bold text-[#1A0A00] mb-4">How to Store</h3>
            <div className="prose prose-sm max-w-none text-base text-muted-foreground leading-relaxed">
              {product.storageInfo ? (
                <p className="whitespace-pre-wrap">
                  {product.storageInfo.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <span key={idx} className="font-bold text-[#1A0A00]">
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
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="font-semibold text-[#1A0A00] mb-2">✓ Storage Tips</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use airtight containers</li>
                  <li>• Maintain cool temperature</li>
                  <li>• Avoid moisture and humidity</li>
                  <li>• Keep away from heat sources</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="font-semibold text-[#1A0A00] mb-2">✗ Avoid</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Direct sunlight exposure</li>
                  <li>• Refrigeration/Freezing</li>
                  <li>• Damp environments</li>
                  <li>• Opened containers</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-[#1A0A00] sm:text-3xl">You May Also Like</h2>
          <div className="mt-1 mb-4 h-1 w-12 rounded-full bg-[#E8762A]" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link key={item._id || item.id} to={`/product/${item._id || item.id}`}>
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
                    <p className="font-semibold text-[#1A0A00]">{getDisplayProductName(item)}</p>
                    <p className="mt-1 text-sm font-bold text-[#E8762A]">Rs. {item.price}</p>
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

        {product.parentProduct === 'crunchy-chana' && flavourStoryItems.length > 0 && (
          <section className="mt-12 pb-8">
            <h2 className="font-display text-2xl font-bold text-[#1A0A00] sm:text-3xl">Choose Your Crunch</h2>
            <div className="mt-1 mb-2 h-1 w-12 rounded-full bg-[#E8762A]" />
            <p className="mb-4 text-sm text-muted-foreground">Tap a flavour to explore its product page.</p>
            <div className="grid grid-flow-col auto-cols-[78%] gap-4 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 lg:grid-cols-5">
              {flavourStoryItems.map((item) => (
                <Link
                  key={item._id || item.id}
                  to={`/product/${item._id || item.id}`}
                  className={`group overflow-hidden rounded-3xl border-0 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-strong ${
                    (item._id || item.id) === (product._id || product.id)
                      ? 'bg-white ring-2 ring-[#E8762A]'
                      : 'bg-white'
                  }`}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-[#2D5016] to-[#4a7a24]" />
                  <img
                    src={getImageUrl(item.image)}
                    alt={getDisplayProductName(item)}
                    className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="p-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${flavorColorMap[item.flavour] || 'border-border bg-muted'}`}>
                      {item.flavour}
                    </span>
                    <p className="mt-2 text-sm font-semibold text-[#1A0A00]">{getDisplayProductName(item)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.story}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {product.productType === 'deliverable' ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background p-3 shadow-lg lg:hidden">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Total ({qty})</p>
              <p className="text-lg font-bold text-[#1A0A00]">Rs. {formatPrice(totalPrice)}</p>
            </div>
            <Button className="flex-1 bg-[#E8762A] hover:bg-[#d76b20]" size="lg" onClick={onAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background p-3 shadow-lg lg:hidden">
          <Button className="w-full bg-[#25D366] hover:bg-[#1fa959]" size="lg" asChild>
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
