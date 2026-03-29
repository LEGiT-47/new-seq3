import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { productAPI, getImageUrl } from '../lib/api';
import { getDisplayProductName, openWhatsAppEnquiry } from '../lib/productUtils';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { ArrowRight, Star, Truck, Gift, Leaf, Factory, MessageCircle, ShoppingCart } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import OccasionBanner from '../components/OccasionBanner';
import AnnouncementBar from '../components/AnnouncementBar';
import heroOne from '../assets/first.jpg';
import heroTwo from '../assets/second.jpg';
import heroThree from '../assets/partner.jpg';

const categoryTabs = [
  { id: 'snacks', label: 'Snacks', icon: '🍿', categories: ['nuts', 'jaggery', 'chocolates'] },
  { id: 'dryfruits', label: 'Dry Fruits', icon: '🥜', categories: ['dryfruits', 'seeds'] },
  { id: 'gifting', label: 'Gifting', icon: '🎁', categories: ['gifting', 'services'] },
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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState('snacks');
  const [selectedHomeFlavourByGroup, setSelectedHomeFlavourByGroup] = useState({});

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

  const homeOrderGroups = useMemo(() => {
    const groups = new Map();

    heroProducts.forEach((p) => {
      const key = p.parentProduct || p.name;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    });

    return Array.from(groups.entries()).map(([key, list]) => ({ key, products: list }));
  }, [heroProducts]);

  const homeCards = useMemo(() => {
    return homeOrderGroups.map(({ key, products: groupProducts }) => {
      const selected = selectedHomeFlavourByGroup[key] || groupProducts[0].flavour;

      return {
        key,
        products: groupProducts,
        active: groupProducts.find((p) => p.flavour === selected) || groupProducts[0],
      };
    });
  }, [homeOrderGroups, selectedHomeFlavourByGroup]);

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
  const heroSlides = useMemo(
    () => [
      {
        image: heroOne,
        badge: "Mumbai's Favourite Crunchy Chana",
        title: 'Snack Bold.',
        subtitle: 'Snack Real.',
        description: 'Handcrafted snacks, real flavours, and a premium crunch delivered straight to your door.',
        ctaButton: {
          label: 'Order Now',
          onClick: () => navigate('/products?tab=order'),
        },
        quoteButton: {
          label: 'Explore All Products',
          onClick: () => navigate('/products'),
        },
      },
      {
        image: heroTwo,
        badge: 'Festive and Gifting Update',
        title: 'Premium Gift Packs',
        subtitle: 'Now Live',
        description: 'Explore curated gifting collections for festivals, milestones, and premium celebrations.',
        ctaButton: {
          label: 'Explore Gifting',
          onClick: () => navigate('/gifting'),
        },
        quoteButton: {
          label: 'Enquire Gifts',
          onClick: () => navigate('/gifting'),
        },
      },
      {
        image: heroThree,
        badge: 'Business Updates',
        title: 'Bulk Orders and',
        subtitle: 'Private Label Support',
        description: 'Partner with Sequeira Foods for custom production, premium packaging, and B2B scale programs.',
        ctaButton: {
          label: 'Contract Manufacturing',
          onClick: () => navigate('/contract-manufacturing'),
        },
        quoteButton: {
          label: 'Enquire on WhatsApp',
          onClick: () => {
            if (enquiryProducts[0]) {
              openWhatsAppEnquiry(enquiryProducts[0]);
            }
          },
        },
      },
    ],
    [navigate, enquiryProducts]
  );

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <HeroCarousel slides={heroSlides} />

      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <OccasionBanner />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-[#1A0A00] sm:text-3xl">Order Online - Delivered Fresh</h2>
          <div className="mx-auto mt-1 h-1 w-12 rounded-full bg-[#E8762A]" />
          <p className="mt-2 text-muted-foreground">Our signature snacks, ready to ship straight to you.</p>
        </div>

        {loading ? (
          <p className="py-10 text-center text-muted-foreground">Loading hero products...</p>
        ) : (
          <div className="grid grid-flow-col auto-cols-[78%] gap-4 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 lg:grid-cols-3">
            {homeCards.map(({ key, products: groupedProducts, active }) => {
              const displayName = getDisplayProductName(active);
              const hasGroup = groupedProducts.length > 1;
              const activeWeightOptions = active.weightOptions?.length ? active.weightOptions : active.weight ? [active.weight] : [];

              return (
                <Card
                  key={key}
                  className="group overflow-hidden rounded-2xl border-border/80 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <Link to={`/product/${active._id || active.id}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(active.image)}
                        alt={displayName}
                        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge className="absolute left-3 top-3 bg-[#2D5016] text-white">🚚 Deliverable</Badge>
                    </div>
                  </Link>
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold leading-tight text-[#1A0A00]">{displayName}</h3>
                      <p className="ml-2 shrink-0 text-xl font-bold text-[#E8762A]">Rs. {active.price}</p>
                    </div>

                    {hasGroup && (
                      <div className="flex flex-wrap gap-1.5">
                        {groupedProducts.map((fp) => (
                          <button
                            key={fp._id || fp.id}
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                              (selectedHomeFlavourByGroup[key] || groupedProducts[0].flavour) === fp.flavour
                                ? 'border-[#E8762A] bg-[#E8762A] text-white'
                                : 'border-border text-muted-foreground hover:border-[#E8762A]'
                            }`}
                            onClick={() => setSelectedHomeFlavourByGroup((prev) => ({ ...prev, [key]: fp.flavour }))}
                          >
                            {fp.flavour}
                          </button>
                        ))}
                      </div>
                    )}

                    {activeWeightOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {activeWeightOptions.map((size) => (
                          <span key={size} className="rounded-full border border-border px-3 py-1 text-xs font-medium">
                            {size}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-[#E8762A] text-sm hover:bg-[#d76b20]" onClick={() => onAddHeroToCart(active)}>
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" className="px-3 text-sm" asChild>
                        <Link to={`/product/${active._id || active.id}`}>View</Link>
                      </Button>
                    </div>
                    <Link to={`/product/${active._id || active.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#E8762A] hover:underline">
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/products?tab=order" className="inline-flex items-center gap-1 text-sm font-semibold text-[#E8762A] hover:underline">
            View All Deliverable Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white/80 p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
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
              <Link
                key={tile.id}
                to={`/products/${tile.id}`}
                className="group relative block h-48 overflow-hidden rounded-2xl shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
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
          <div key={item.label} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-4 text-center text-sm font-semibold text-[#1A0A00] shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
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
        <h2 className="text-center font-display text-2xl font-bold text-[#1A0A00] sm:text-3xl">Loved by Snack Fans</h2>
        <div className="mx-auto mt-1 mb-6 h-1 w-12 rounded-full bg-[#E8762A]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviewCards.map((review) => (
            <Card key={review.name} className="rounded-2xl border-border/70 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
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
