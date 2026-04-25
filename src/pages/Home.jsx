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
import { useOccasion } from '../context/OccasionContext';
import { useReveal } from '../hooks/useReveal';
import heroOne from '../assets/first.png';
import heroTwo from '../assets/second.png';
import heroThree from '../assets/third.png';
import giftingImage from '../assets/second.jpg';

const categoryTabs = [
  { id: 'deliverable', label: 'Deliverable', icon: '🚚' },
  { id: 'enquirable', label: 'Enquirable', icon: '💬' },
];

const deliverableCategoryTiles = [
  {
    id: 'chana',
    name: 'Chana',
    image: '/images/categories/Gemini_Generated_Image_1.png',
    to: '/products?tab=order&orderFilter=chana',
  },
  {
    id: 'savory-makhana',
    name: 'Savory Makhana',
    image: '/images/categories/Gemini_Generated_Image_4.png',
    to: '/products?tab=order&orderFilter=savory-makhana',
  },
  {
    id: 'savory-cashew',
    name: 'Savory Cashew',
    image: '/images/categories/Gemini_Generated_Image_5.png',
    to: '/products?tab=order&orderFilter=savory-cashew',
  },
  {
    id: 'savory-almond',
    name: 'Savory Almond',
    image: '/images/categories/Gemini_Generated_Image_3.png',
    to: '/products?tab=order&orderFilter=savory-almond',
  },
  {
    id: 'savory-peanut',
    name: 'Savory Peanut',
    image: '/images/categories/Gemini_Generated_Image_6.png',
    to: '/products?tab=order&orderFilter=savory-peanut',
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
  const { activeOccasion } = useOccasion();
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
    <div className="min-h-screen bg-white">
      <HeroCarousel slides={heroSlides} />

      <section ref={categoryRef} className="reveal bg-[#F9F9F7] px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[100rem]">
          <div className="mb-6 text-center">
            <h2 className="font-display text-4xl uppercase tracking-wide text-[#0B1D35] sm:text-5xl">Shop By Category</h2>
            <div className="mx-auto mt-2 h-0.5 w-14 rounded-full bg-[#E8762A]" />
          </div>
          <div className="space-y-3">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tab.id === activeCategoryTab
                    ? 'bg-[#0B1D35] text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-[#0B1D35] hover:text-[#0B1D35]'
                }`}
                onClick={() => setActiveCategoryTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:gap-5 xl:gap-6">
            {categoryTiles.map((tile) => (
              <Link
                key={tile.id}
                to={tile.to}
                className="group relative z-0 block h-full w-full overflow-hidden rounded-3xl bg-[#FFFBF5] shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
              >
                <div className="aspect-[2/1] w-full">
                  <img src={tile.image} alt={tile.name} className="h-full w-full object-contain object-center" />
                </div>
                <span className="absolute bottom-3 left-3 z-10 rounded-full bg-[#FFFBF5]/92 px-4 py-1.5 text-base font-semibold text-[#0B1D35] shadow-md backdrop-blur-sm">
                  {tile.name}
                </span>
              </Link>
            ))}
          </div>
          {activeCategoryTab === 'enquirable' && (
            <p className="mt-4 text-center text-sm italic text-gray-400">
              ✦ Gifting products will be added soon
            </p>
          )}
          </div>
        </div>
      </section>

      {activeOccasion && (
        <section ref={occasionRef} className="reveal bg-white px-4 py-4 shadow-[inset_0_4px_12px_rgba(0,0,0,0.04)] sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <OccasionBanner />
          </div>
        </section>
      )}

      <section ref={heroRef} className="reveal bg-white px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[100rem]">
          <div className="mb-5 text-center">
            <h2 className="font-display text-4xl uppercase tracking-wide text-[#0B1D35] sm:text-5xl">Order Online - Delivered Fresh</h2>
            <div className="mx-auto mt-2 h-0.5 w-14 rounded-full bg-[#E8762A]" />
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500">Our signature snacks, ready to ship straight to you.</p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-500">Loading hero products...</p>
          ) : (
            <div className="mx-auto grid max-w-[100rem] grid-flow-col auto-cols-[84%] gap-4 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 lg:gap-5 lg:grid-cols-3">
              {homeCards.map(({ key, products: groupedProducts, active }) => {
                const displayName = getDisplayProductName(active);
                const hasGroup = groupedProducts.length > 1;
                const activeWeightOptions = active.weightOptions?.length ? active.weightOptions : active.weight ? [active.weight] : [];

                return (
                    <Card
                    key={key}
                      className="group overflow-hidden rounded-3xl border-0 bg-[#FFFBF5] shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-strong"
                  >
                      <div className="h-1 w-full bg-gradient-to-r from-[#0B1D35] to-[#26486E]" />
                    <Link to={`/product/${active._id || active.id}`}>
                      <div className="relative overflow-hidden rounded-t-3xl bg-[#FDF6EC]">
                        <img
                          src={getImageUrl(active.image)}
                          alt={displayName}
                          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FFFBF5] to-transparent" />
                        <Badge className="absolute left-3 top-3 bg-[#0B1D35] text-xs text-white">🚚 Deliverable</Badge>
                      </div>
                    </Link>
                    <CardContent className="space-y-2.5 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-sans text-lg font-bold leading-tight text-[#0B1D35]">{displayName}</h3>
                        <p className="font-sans text-xl font-bold text-[#0B1D35]">Rs. {active.price}</p>
                      </div>

                      {hasGroup && (() => {
                        const visibleFlavours = groupedProducts.slice(0, 3);
                        const extraCount = groupedProducts.length - 3;

                        return (
                          <div className="flex flex-wrap gap-1.5">
                            {visibleFlavours.map((fp) => (
                              <button
                                key={fp._id || fp.id}
                                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                                  (selectedHomeFlavourByGroup[key] || groupedProducts[0].flavour) === fp.flavour
                                    ? 'border-[#0B1D35] bg-[#0B1D35] text-white ring-2 ring-[#0B1D35]/25 ring-offset-2'
                                    : 'border-gray-200 bg-white text-gray-500 hover:border-[#0B1D35] hover:text-[#0B1D35]'
                                }`}
                                onClick={() => setSelectedHomeFlavourByGroup((prev) => ({ ...prev, [key]: fp.flavour }))}
                              >
                                {fp.flavour}
                              </button>
                            ))}
                            {extraCount > 0 && (
                              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-400">
                                +{extraCount} more
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {activeWeightOptions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {activeWeightOptions.map((size) => (
                                <span key={size} className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
                              {size}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button className="flex-1 rounded-full bg-[#E8762A] text-xs font-bold hover:bg-[#D76219]" onClick={() => onAddHeroToCart(active)}>
                          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-full border-gray-200 px-3 text-sm text-gray-500 hover:border-[#0B1D35] hover:text-[#0B1D35]"
                          asChild
                        >
                          <Link to={`/product/${active._id || active.id}`}>View</Link>
                        </Button>
                      </div>
                      <Link
                        to={`/product/${active._id || active.id}`}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-[#E8762A]"
                      >
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-3 text-center">
            <Link to="/products?tab=order" className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-[#0B1D35] transition-colors hover:text-[#E8762A]">
              View All Deliverable Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section ref={trustRef} className="reveal bg-[#C9A84C] py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: <Leaf className="h-5 w-5" />, label: '100% Natural' },
            { icon: <Factory className="h-5 w-5" />, label: 'Made in India' },
            { icon: <Gift className="h-5 w-5" />, label: 'Custom Gifting' },
            { icon: <Truck className="h-5 w-5" />, label: 'Pan-India Delivery' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-center gap-3 rounded-xl bg-[#0B1D35]/12 px-4 py-5 text-center font-bold text-[#0B1D35]">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section ref={enquiryRef} className="reveal bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border-l-4 border-[#E8762A] bg-[#FFF8F0] px-8 py-10 shadow-soft sm:px-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8762A]">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#E8762A]">Premium Enquiry Collection</p>
                <h3 className="mt-2 font-display text-3xl tracking-wide leading-tight text-[#0B1D35] sm:text-4xl">
                  Looking for Premium Dry Fruits or Bulk Orders?
                </h3>
                <p className="mt-2 max-w-2xl text-gray-500">
                  Our premium range is available on enquiry so we can share fresh pricing, stock, and packaging options.
                </p>
                <Button
                  className="mt-5 rounded-full bg-[#25D366] px-6 font-bold text-white hover:bg-[#1fa959]"
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
            </div>
          </div>
        </div>
      </section>

        <section ref={giftingRef} className="reveal bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 lg:grid-cols-2">
        <img
          src={giftingImage}
          alt="Premium gift hampers by Sequeira Foods"
          className="h-80 w-full rounded-3xl object-cover shadow-md"
        />
        <div>
          <h3 className="font-serif text-3xl font-bold text-[#0B1D35] sm:text-4xl">Gift Something Real</h3>
          <p className="mt-3 max-w-xl text-gray-500">
            Curated hampers for family, festive moments, and corporate teams with premium packaging and personalization.
          </p>
          <Button className="mt-6 rounded-full bg-[#0B1D35] font-bold text-white hover:bg-[#1A3555]" asChild>
            <Link to="/gifting">Explore Gifting →</Link>
          </Button>
        </div>
        </div>
      </section>

      <section ref={reviewsRef} className="reveal bg-[#F9F9F7] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-4xl uppercase tracking-wide text-[#0B1D35] sm:text-5xl">Loved by Snack Fans</h2>
          <div className="mx-auto mb-8 mt-2 h-0.5 w-14 rounded-full bg-[#E8762A]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reviewCards.map((review) => (
              <Card key={review.name} className="rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-1 text-[#E8762A]">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">"{review.quote}"</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1D35] text-xs font-bold text-white">
                      {review.name.charAt(0)}
                    </div>
                    <p className="text-sm font-bold text-[#0B1D35]">{review.name}</p>
                  </div>
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
