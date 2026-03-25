import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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

  const displayName = getDisplayProductName(product);
  const whatsappLink = buildWhatsAppEnquiryLink(product);
  const activeSliderImage = safeImageGallery[activeImageIndex] || safeImageGallery[0] || '';

  const goToImage = (index) => {
    if (!safeImageGallery.length) return;
    const total = safeImageGallery.length;
    const next = (index + total) % total;
    setActiveImageIndex(next);
  };

  const onAddToCart = () => {
    addToCart(product, qty, { flavor: product.flavour || null });
    toast.success(`${displayName} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-muted-foreground">
          <button onClick={() => navigate('/products')} className="hover:text-foreground">Products</button>
          <span className="mx-2">/</span>
          <span>{displayName}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
              <img src={activeSliderImage} alt={displayName} className="h-[420px] w-full object-cover transition duration-300 hover:scale-105" />
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
            <div className="mt-4 grid grid-cols-4 gap-3">
              {safeImageGallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={`overflow-hidden rounded-xl border ${activeImageIndex === index ? 'border-[#E8762A]' : 'border-border'}`}
                  onClick={() => goToImage(index)}
                >
                  <img src={image} alt={`${displayName}-${index}`} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D5016]">Sequeira Foods</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-[#1A0A00]">{displayName}</h1>
            <p className="mt-2 text-muted-foreground">Bold, crunchy, addictive. The snack that started it all.</p>

            <div className="mt-4 flex items-center gap-2 text-[#E8762A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="text-sm text-muted-foreground">(128 ratings)</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {['100g', '250g', '500g'].map((size) => (
                <button
                  key={size}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                    selectedWeight === size ? 'border-[#E8762A] bg-[#E8762A] text-white' : 'border-border text-muted-foreground'
                  }`}
                  onClick={() => setSelectedWeight(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {product.parentProduct === 'crunchy-chana' && product.flavour && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-[#1A0A00]">Flavour</p>
                <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${flavorColorMap[product.flavour] || 'border-border bg-muted'}`}>
                  {product.flavour}
                </span>
              </div>
            )}

            <p className="mt-6 text-4xl font-bold text-[#1A0A00]">Rs. {product.price}</p>
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
                  <Button className="w-full bg-[#E8762A] hover:bg-[#d76b20]" size="lg" onClick={onAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                    Buy Now
                  </Button>
                </>
              ) : (
                <Button className="w-full bg-[#25D366] hover:bg-[#1fa959]" size="lg" asChild>
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Enquire on WhatsApp
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <p className="inline-flex items-center gap-2 rounded-lg bg-card p-2 text-xs"><ShieldCheck className="h-4 w-4 text-[#2D5016]" /> Natural</p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-card p-2 text-xs"><PackageCheck className="h-4 w-4 text-[#2D5016]" /> Secure Packaging</p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-card p-2 text-xs"><Truck className="h-4 w-4 text-[#2D5016]" /> Fast Dispatch</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-xl bg-muted p-1 sm:grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="storage">How to Store</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            {product.description}
          </TabsContent>
          <TabsContent value="ingredients" className="mt-4 rounded-2xl border border-border bg-card p-5">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(product.ingredients || ['Roasted chana', 'Natural seasoning', 'Cold-pressed oil', 'Sea salt']).map((item) => (
                <li key={item} className="rounded-lg bg-muted px-3 py-2">{item}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="nutrition" className="mt-4 rounded-2xl border border-border bg-card p-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Protein', '19g'],
                ['Fiber', '11g'],
                ['Energy', '410 kcal'],
                ['Fat', '12g'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground">{label}</p>
                  <p className="font-bold text-[#1A0A00]">{value}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="storage" className="mt-4 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Store in an airtight container away from sunlight and moisture. Best enjoyed within 90 days for peak crunch.
          </TabsContent>
        </Tabs>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#1A0A00]">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Card key={item._id || item.id} className="overflow-hidden rounded-2xl border-border/70 shadow-soft">
                <img src={getImageUrl(item.image)} alt={item.name} className="h-40 w-full object-cover" />
                <CardContent className="p-4">
                  <p className="font-semibold text-[#1A0A00]">{getDisplayProductName(item)}</p>
                  <p className="text-sm text-muted-foreground">Rs. {item.price}</p>
                  {item.productType === 'deliverable' ? (
                    <Button className="mt-3 w-full bg-[#E8762A] hover:bg-[#d76b20]" onClick={() => addToCart(item, 1, { flavor: item.flavour || null })}>
                      Add to Cart
                    </Button>
                  ) : (
                    <Button className="mt-3 w-full bg-[#25D366] hover:bg-[#1fa959]" asChild>
                      <a href={buildWhatsAppEnquiryLink(item)} target="_blank" rel="noreferrer">Enquire</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {product.parentProduct === 'crunchy-chana' && flavourStoryItems.length > 0 && (
          <section className="mt-12 pb-8">
            <h2 className="mb-2 text-2xl font-bold text-[#1A0A00]">Choose Your Crunch</h2>
            <p className="mb-4 text-sm text-muted-foreground">Tap a flavour to explore its product page.</p>
            <div className="grid grid-flow-col auto-cols-[78%] gap-4 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 lg:grid-cols-5">
              {flavourStoryItems.map((item) => (
                <Link
                  key={item._id || item.id}
                  to={`/product/${item._id || item.id}`}
                  className="rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <p className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${flavorColorMap[item.flavour] || 'border-border bg-muted'}`}>
                    {item.flavour}
                  </p>
                  <p className="mt-3 font-semibold text-[#1A0A00]">{getDisplayProductName(item)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.story}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
