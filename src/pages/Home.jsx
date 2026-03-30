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
import { useReveal } from '../hooks/useReveal';
import heroOne from '../assets/first.jpg';
import heroTwo from '../assets/second.jpg';
import heroThree from '../assets/partner.jpg';

const categoryTabs = [
  { id: 'deliverable', label: 'Deliverable', icon: '🚚' },
  { id: 'enquirable', label: 'Enquirable', icon: '💬' },
];

const deliverableCategoryTiles = [
  {
    id: 'gud-chana',
    name: 'Gud Chana',
    image: '/images/categories/Gemini_Generated_Image_1.png',
    to: '/products?tab=order',
  },
  {
    id: 'crunchy-chana',
    name: 'Crunchy Chana',
    image: '/images/categories/Gemini_Generated_Image_2.png',
    to: '/products?tab=order',
  },
];

const enquirableCategoryTiles = [
  {
    id: 'chocolates',
    name: 'Chocolates',
    image: '/images/categories/Gemini_Generated_Image_3.png',
    to: '/products/chocolates',
  },
  {
    id: 'seeds',
    name: 'Seeds',
    image: '/images/categories/Gemini_Generated_Image_4.png',
    to: '/products/seeds',
  },
  {
    id: 'nuts',
    name: 'Flavoured Nuts',
    image: '/images/categories/Gemini_Generated_Image_5.png',
    to: '/products/nuts',
  },
  {
    id: 'jaggery',
    name: 'Jaggery Coated',
    image: '/images/categories/Gemini_Generated_Image_6.png',
    to: '/products/jaggery',
  },
  {
    id: 'dryfruits',
    name: 'Dry Fruits',
    image: '/images/categories/Gemini_Generated_Image_7.png',
    to: '/products/dryfruits',
  },
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
  const [activeCategoryTab, setActiveCategoryTab] = useState('deliverable');
  const [selectedHomeFlavourByGroup, setSelectedHomeFlavourByGroup] = useState({});
  const occasionRef = useReveal();
  const heroRef = useReveal();
  const categoryRef = useReveal();
  const trustRef = useReveal();
  const enquiryRef = useReveal();
  const giftingRef = useReveal();
  const reviewsRef = useReveal();

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
    return activeCategoryTab === 'deliverable' ? deliverableCategoryTiles : enquirableCategoryTiles;
  }, [activeCategoryTab]);

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
      <HeroCarousel slides={heroSlides} />

      <section ref={categoryRef} className="reveal bg-white py-5 px-2 sm:px-3 sm:py-8 lg:px-2">
        <div className="mx-auto max-w-[110rem]">
          <div className="mb-5 text-center">
            <h2 className="font-display text-2xl font-bold text-[#1A0A00] sm:text-3xl">Shop By Category</h2>
            <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#E8762A]" />
          </div>
          <div className="rounded-3xl border border-[#f0e3d4] bg-white p-2 shadow-soft transition-all duration-200 hover:shadow-md sm:p-3 lg:p-4">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-4 xl:gap-5">
            {categoryTiles.map((tile) => (
              <Link
                key={tile.id}
                to={tile.to}
                className="group relative block h-72 overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium sm:h-80 lg:h-[30rem] xl:h-[32rem]"
              >
                <img src={tile.image} alt={tile.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-4 py-1.5 text-base font-semibold text-[#1A0A00] shadow-md backdrop-blur-sm">
                  {tile.name}
                </span>
              </Link>
            ))}
          </div>
          {activeCategoryTab === 'enquirable' && (
            <div className="mt-4 rounded-2xl border border-dashed border-[#E8762A]/40 bg-[#FDF6EC] px-4 py-3 text-sm font-medium text-[#1A0A00]">
              Gifting products will be added soon.
            </div>
          )}
          </div>
        </div>
      </section>

      <section ref={occasionRef} className="reveal bg-white py-2 px-2 sm:px-4 sm:py-3 lg:px-5">
        <div className="mx-auto max-w-[92rem]">
          <OccasionBanner />
        </div>
      </section>

      <section ref={heroRef} className="reveal relative overflow-hidden bg-[#FDF6EC] py-5 px-2 sm:px-4 sm:py-8 lg:px-5">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#E8762A]/6 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#2D5016]/5 blur-3xl" />
        <div className="relative mx-auto max-w-[92rem]">
          <div className="mb-5 text-center">
            <h2 className="font-display text-2xl font-bold text-[#1A0A00] sm:text-3xl">Order Online - Delivered Fresh</h2>
            <div className="mx-auto mt-1 h-1 w-12 rounded-full bg-[#E8762A]" />
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Our signature snacks, ready to ship straight to you.</p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-muted-foreground">Loading hero products...</p>
          ) : (
            <div className="mx-auto grid max-w-5xl grid-flow-col auto-cols-[82%] gap-4 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 lg:grid-cols-2">
              {homeCards.map(({ key, products: groupedProducts, active }) => {
                const displayName = getDisplayProductName(active);
                const hasGroup = groupedProducts.length > 1;
                const activeWeightOptions = active.weightOptions?.length ? active.weightOptions : active.weight ? [active.weight] : [];

                return (
                  <Card
                    key={key}
                    className="group overflow-hidden rounded-3xl border-0 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-strong"
                  >
                    <Link to={`/product/${active._id || active.id}`}>
                      <div className="relative overflow-hidden rounded-t-3xl">
                        <img
                          src={getImageUrl(active.image)}
                          alt={displayName}
                          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                        <Badge className="absolute left-3 top-3 bg-[#2D5016] text-white">🚚 Deliverable</Badge>
                      </div>
                    </Link>
                    <CardContent className="space-y-2.5 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold leading-tight text-[#1A0A00]">{displayName}</h3>
                        <p className="text-xl font-black text-[#E8762A]">Rs. {active.price}</p>
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
                            <span key={size} className="rounded-full border border-border px-2.5 py-1 text-xs font-medium">
                              {size}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button className="flex-1 rounded-full bg-[#E8762A] text-xs hover:bg-[#d76b20]" onClick={() => onAddHeroToCart(active)}>
                          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                          Add to Cart
                        </Button>
                        <Button variant="outline" className="rounded-full px-3 text-xs" asChild>
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

          <div className="mt-3 text-center">
            <Link to="/products?tab=order" className="inline-flex items-center gap-1 text-sm font-semibold text-[#E8762A] hover:underline">
              View All Deliverable Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section ref={trustRef} className="reveal bg-[#FDF6EC] py-3 px-2 sm:px-4 sm:py-6 lg:px-5">
        <div className="mx-auto grid max-w-[92rem] grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: <Leaf className="h-5 w-5" />, label: '100% Natural' },
            { icon: <Factory className="h-5 w-5" />, label: 'Made in India' },
            { icon: <Gift className="h-5 w-5" />, label: 'Custom Gifting' },
            { icon: <Truck className="h-5 w-5" />, label: 'Pan-India Delivery' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-center gap-2 rounded-2xl border border-[#ead8c3] bg-white px-3 py-4 text-center text-sm font-semibold text-[#1A0A00] shadow-sm">
              <span className="text-[#E8762A]">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section ref={enquiryRef} className="reveal bg-[#FDF6EC] py-5 px-2 sm:px-4 sm:py-8 lg:px-5">
        <div className="mx-auto max-w-[92rem] rounded-3xl bg-gradient-primary px-5 py-8 text-white shadow-medium sm:px-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">Premium Enquiry Collection</p>
          <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Looking for premium dry fruits, cashews, or custom bulk orders?
          </h3>
          <p className="mt-2 max-w-3xl text-white/90">
            Our premium range is available on enquiry so we can share fresh pricing, stock, and packaging options.
          </p>
          <Button
            className="mt-6 rounded-full bg-[#25D366] text-white hover:bg-[#1fa959]"
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

        <section ref={giftingRef} className="reveal bg-white py-7 px-2 sm:px-4 sm:py-10 lg:px-5">
          <div className="mx-auto grid max-w-[92rem] grid-cols-1 items-center gap-6 lg:grid-cols-2">
        <img
          src={heroVisual}
          alt="Gifting teaser"
          className="h-72 w-full rounded-3xl object-cover shadow-soft"
        />
        <div>
          <h3 className="font-display text-3xl font-bold text-[#1A0A00]">Gift Something Real</h3>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Curated hampers for family, festive moments, and corporate teams with premium packaging and personalization.
          </p>
          <Button className="mt-6 rounded-full bg-[#2D5016] hover:bg-[#243f12]" asChild>
            <Link to="/gifting">Explore Gifting</Link>
          </Button>
        </div>
        </div>
      </section>

      <section ref={reviewsRef} className="reveal bg-[#FDF6EC] px-2 pb-6 pt-5 sm:px-4 sm:pb-8 sm:pt-8 lg:px-5">
        <div className="mx-auto max-w-[92rem]">
          <h2 className="text-center font-display text-2xl font-bold text-[#1A0A00] sm:text-3xl">Loved by Snack Fans</h2>
          <div className="mx-auto mt-1 mb-6 h-1 w-12 rounded-full bg-[#E8762A]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reviewCards.map((review) => (
              <Card key={review.name} className="rounded-3xl border-0 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-medium">
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
        </div>
      </section>
    </div>
  );
};

export default Home;
