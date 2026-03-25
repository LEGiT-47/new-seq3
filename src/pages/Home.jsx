import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { productAPI, getImageUrl } from '../lib/api';
import { getDisplayProductName, openWhatsAppEnquiry } from '../lib/productUtils';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { ArrowRight, Star, Truck, Gift, Leaf, Factory, MessageCircle } from 'lucide-react';

const categoryTabs = [
  { id: 'snacks', label: 'Snacks', icon: 'SNK', categories: ['nuts', 'jaggery', 'chocolates'] },
  { id: 'dryfruits', label: 'Dry Fruits', icon: 'DRF', categories: ['dryfruits', 'seeds'] },
  { id: 'gifting', label: 'Gifting', icon: 'GFT', categories: ['gifting', 'services'] },
];

const reviewCards = [
  {
    name: 'Aarav M.',
    quote: 'Crunchy Chana Peri Peri is addictive. Clean ingredients and super fresh every time.',
  },
  {
    name: 'Shivani R.',
    quote: 'The gifting hampers looked premium and the team handled customization smoothly.',
  },
  {
    name: 'Rohan D.',
    quote: 'Loved that the site clearly shows what can be ordered instantly and what is enquiry based.',
  },
  {
    name: 'Neha S.',
    quote: 'Great flavour variety and very responsive support on WhatsApp for bulk orders.',
  },
];

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState('snacks');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        const list = response.data.data || [];
        setProducts(list.filter((p) => !p.isHidden));
      } catch (error) {
        toast.error('Could not load products right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const heroProducts = useMemo(() => {
    return products
      .filter((p) => p.productType === 'deliverable' || p.isHeroProduct)
      .sort((a, b) => Number(b.isHeroProduct) - Number(a.isHeroProduct));
  }, [products]);

  const enquiryProducts = useMemo(() => {
    return products.filter((p) => p.productType === 'enquiry');
  }, [products]);

  const categoryTiles = useMemo(() => {
    const selected = categoryTabs.find((tab) => tab.id === activeCategoryTab);
    if (!selected) return [];

    const grouped = selected.categories
      .map((categoryId) => {
        const product = products.find((p) => p.category === categoryId);
        if (!product) return null;

        const prettyName =
          categoryId === 'dryfruits'
            ? 'Dry Fruits'
            : categoryId === 'nuts'
              ? 'Flavoured Nuts'
              : categoryId === 'jaggery'
                ? 'Jaggery Coated'
                : categoryId === 'services'
                  ? 'Gifting Services'
                  : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

        return {
          id: categoryId,
          name: prettyName,
          image: getImageUrl(product.image),
        };
      })
      .filter(Boolean);

    return grouped;
  }, [activeCategoryTab, products]);

  const onAddHeroToCart = (product) => {
    addToCart(product, 1, { flavor: product.flavour || null });
    toast.success(`${getDisplayProductName(product)} added to cart`);
  };

  const heroVisual = heroProducts[0] ? getImageUrl(heroProducts[0].image) : '';

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-warm" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20 lg:px-8">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-[#E8762A]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#E8762A]">
              Mumbai's Favourite Crunchy Chana
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-[#1A0A00] sm:text-5xl lg:text-6xl">
              Snack Bold. Snack Real.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Handcrafted snacks, real flavours, and a premium crunch delivered straight to your door.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="bg-[#E8762A] hover:bg-[#d76b20]" asChild>
                <Link to="/products?tab=order">
                  Order Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/products">Explore All Products</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-[#E8762A]/15 blur-3xl" />
            {heroVisual ? (
              <img
                src={heroVisual}
                alt="Sequeira Foods hero"
                className="relative h-[360px] w-full rounded-3xl object-cover shadow-large"
              />
            ) : (
              <div className="relative flex h-[360px] items-center justify-center rounded-3xl bg-card shadow-large">
                <p className="text-muted-foreground">Premium snack visuals loading...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl text-[#1A0A00]">Order Online - Delivered Fresh</h2>
          <p className="mt-2 text-muted-foreground">Our signature snacks, ready to ship straight to you.</p>
        </div>

        {loading ? (
          <p className="py-10 text-center text-muted-foreground">Loading hero products...</p>
        ) : (
          <div className="grid grid-flow-col auto-cols-[78%] gap-4 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 lg:grid-cols-3">
            {heroProducts.map((product) => {
              const displayName = getDisplayProductName(product);
              return (
                <Card key={product._id || product.id} className="group overflow-hidden rounded-2xl border-border/80 shadow-soft">
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(product.image)}
                      alt={displayName}
                      className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute left-3 top-3 bg-[#2D5016] text-white">Deliverable</Badge>
                  </div>
                  <CardContent className="space-y-4 p-5">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A0A00]">{displayName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{product.flavour ? `${product.flavour} flavour` : 'Signature variant'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['100g', '200g', '500g'].map((size) => (
                        <span key={size} className="rounded-full border border-border px-3 py-1 text-xs font-medium">
                          {size}
                        </span>
                      ))}
                    </div>
                    <Button className="w-full bg-[#E8762A] hover:bg-[#d76b20]" onClick={() => onAddHeroToCart(product)}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white/80 p-6 shadow-soft">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab.id === activeCategoryTab ? 'bg-[#E8762A] text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveCategoryTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTiles.map((tile) => (
              <Link key={tile.id} to={`/products/${tile.id}`} className="group relative block h-48 overflow-hidden rounded-2xl">
                <img src={tile.image} alt={tile.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <span className="absolute bottom-3 left-3 text-lg font-semibold text-white">{tile.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto my-10 grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {[
          { icon: <Leaf className="h-5 w-5" />, label: '100% Natural' },
          { icon: <Factory className="h-5 w-5" />, label: 'Made in India' },
          { icon: <Gift className="h-5 w-5" />, label: 'Custom Gifting' },
          { icon: <Truck className="h-5 w-5" />, label: 'Pan-India Delivery' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-4 text-center text-sm font-semibold text-[#1A0A00] shadow-soft">
            <span className="text-[#2D5016]">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-primary px-6 py-10 text-white shadow-medium sm:px-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">Premium Enquiry Collection</p>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
            Looking for premium dry fruits, cashews, or custom bulk orders?
          </h3>
          <p className="mt-2 max-w-3xl text-white/90">
            Our premium range is available on enquiry so we can share fresh pricing, stock, and packaging options.
          </p>
          <Button
            className="mt-6 bg-[#25D366] text-white hover:bg-[#1fa959]"
            onClick={() => {
              if (enquiryProducts[0]) {
                openWhatsAppEnquiry(enquiryProducts[0]);
              }
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Enquire on WhatsApp
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <img
          src={heroVisual}
          alt="Gifting teaser"
          className="h-72 w-full rounded-3xl object-cover shadow-soft"
        />
        <div>
          <h3 className="font-display text-3xl font-bold text-[#1A0A00]">Gift Something Real</h3>
          <p className="mt-3 text-muted-foreground">
            Curated hampers for family, festive moments, and corporate teams with premium packaging and personalization.
          </p>
          <Button className="mt-6 bg-[#2D5016] hover:bg-[#243f12]" asChild>
            <Link to="/gifting">Explore Gifting</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h3 className="mb-6 text-center font-display text-3xl font-bold text-[#1A0A00]">Loved by Snack Fans</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviewCards.map((review) => (
            <Card key={review.name} className="rounded-2xl border-border/70 shadow-soft">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-1 text-[#E8762A]">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">"{review.quote}"</p>
                <p className="mt-4 text-sm font-semibold text-[#1A0A00]">{review.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
