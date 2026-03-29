import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { productAPI, getImageUrl } from '../lib/api';
import { useCart } from '../context/CartContext';
import { buildWhatsAppEnquiryLink, getDisplayProductName } from '../lib/productUtils';
import { toast } from 'sonner';
import { Filter, MessageCircle, ShoppingCart } from 'lucide-react';

const categoryNameMap = {
  chocolates: 'Chocolates',
  nuts: 'Flavoured Nuts',
  jaggery: 'Jaggery Coated',
  dryfruits: 'Dry Fruits',
  seeds: 'Seeds',
};

const flavorColorMap = {
  BBQ: 'bg-red-500 text-white border-red-500',
  Cheese: 'bg-yellow-400 text-black border-yellow-400',
  'Cream & Onion': 'bg-lime-300 text-black border-lime-300',
  'Peri Peri': 'bg-orange-500 text-white border-orange-500',
  Pudina: 'bg-green-500 text-white border-green-500',
};

const Products = () => {
  const { category: urlCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMainTab, setActiveMainTab] = useState(searchParams.get('tab') === 'enquire' ? 'enquire' : 'order');
  const [orderFilter, setOrderFilter] = useState('all');
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [selectedFlavorByParent, setSelectedFlavorByParent] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        const list = response.data.data || [];
        setProducts(list.filter((p) => !p.isHidden && p.category !== 'gifting' && p.category !== 'services'));
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (urlCategory) {
      setEnquiryFilter(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', activeMainTab);
    setSearchParams(next, { replace: true });
  }, [activeMainTab, searchParams, setSearchParams]);

  const orderProducts = useMemo(() => products.filter((p) => p.productType === 'deliverable'), [products]);
  const enquiryProducts = useMemo(() => products.filter((p) => p.productType === 'enquiry'), [products]);

  const orderGroups = useMemo(() => {
    const groups = new Map();

    orderProducts.forEach((product) => {
      const key = product.parentProduct || product.name;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(product);
    });

    return Array.from(groups.entries()).map(([key, list]) => {
      const sorted = [...list].sort((a, b) => getDisplayProductName(a).localeCompare(getDisplayProductName(b)));
      return { key, products: sorted };
    });
  }, [orderProducts]);

  const orderCards = useMemo(() => {
    return orderGroups
      .map((group) => {
        if (group.products.length === 1) return group.products[0];

        const selectedFlavor = selectedFlavorByParent[group.key] || group.products[0].flavour;
        return group.products.find((p) => p.flavour === selectedFlavor) || group.products[0];
      })
      .filter((product) => {
        if (orderFilter === 'all') return true;
        if (orderFilter === 'gud') return product.parentProduct === 'gud-chana';
        return product.parentProduct === 'crunchy-chana';
      });
  }, [orderGroups, orderFilter, selectedFlavorByParent]);

  const enquiryCategories = useMemo(() => {
    const categorySet = new Set(enquiryProducts.map((p) => p.category));
    return ['all', ...Array.from(categorySet)];
  }, [enquiryProducts]);

  const filteredEnquiryProducts = useMemo(() => {
    return enquiryProducts.filter((p) => (enquiryFilter === 'all' ? true : p.category === enquiryFilter));
  }, [enquiryFilter, enquiryProducts]);

  const heroSpotlight = useMemo(
    () => orderProducts.filter((p) => p.parentProduct === 'crunchy-chana').slice(0, 5),
    [orderProducts]
  );

  const onAddToCart = (product) => {
    addToCart(product, 1, { flavor: product.flavour || null });
    toast.success(`${getDisplayProductName(product)} added to cart`);
  };

  const renderOrderCard = (product) => {
    const groupKey = product.parentProduct || product.name;
    const group = orderGroups.find((item) => item.key === groupKey);
    const hasFlavorGroup = Boolean(group && group.products.length > 1);

    return (
      <Card key={product._id || product.id} className="group overflow-hidden rounded-3xl border-0 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-strong">
        <div className="h-1 w-full bg-gradient-to-r from-[#E8762A] to-[#f0943a]" />
        <div className="relative overflow-hidden">
          <Link to={`/product/${product._id || product.id}`}>
            <img
              src={getImageUrl(product.image)}
              alt={getDisplayProductName(product)}
              className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/5" />
          </Link>
          <Badge className="absolute left-3 top-3 bg-[#2D5016] text-white">Deliverable</Badge>
        </div>
        <CardContent className="space-y-4 p-5">
          <div>
            <h3 className="text-lg font-bold text-[#1A0A00]">{getDisplayProductName(product)}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          </div>

          {hasFlavorGroup && (
            <div className="flex flex-wrap gap-2">
              {group.products.map((flavorProduct) => (
                <button
                  key={flavorProduct._id || flavorProduct.id}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    (selectedFlavorByParent[groupKey] || group.products[0].flavour) === flavorProduct.flavour
                      ? 'border-[#E8762A] bg-[#E8762A] text-white'
                      : 'border-border text-muted-foreground'
                  }`}
                  onClick={() =>
                    setSelectedFlavorByParent((prev) => ({
                      ...prev,
                      [groupKey]: flavorProduct.flavour,
                    }))
                  }
                >
                  {flavorProduct.flavour}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-[#1A0A00]">Rs. {product.price}</p>
            <p className="text-xs text-muted-foreground">{product.weight}</p>
          </div>

          <Button className="w-full rounded-full bg-[#E8762A] hover:bg-[#d76b20]" onClick={() => onAddToCart(product)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderEnquiryCard = (product) => {
    const link = buildWhatsAppEnquiryLink(product);
    return (
      <Card key={product._id || product.id} className="group overflow-hidden rounded-3xl border-0 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-strong">
        <div className="h-1 w-full bg-gradient-to-r from-[#2D5016] to-[#4a7a24]" />
        <div className="relative overflow-hidden">
          <Link to={`/product/${product._id || product.id}`}>
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/5" />
          </Link>
          <Badge className="absolute left-3 top-3 bg-stone-500 text-white">Enquiry Only</Badge>
        </div>
        <CardContent className="space-y-4 p-5">
          <div>
            <h3 className="text-lg font-bold text-[#1A0A00]">{product.name}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          </div>

          {product.coatings?.length > 0 && (
            <p className="text-xs text-muted-foreground">Coatings: {product.coatings.slice(0, 3).join(', ')}</p>
          )}
          {product.flavors?.length > 0 && (
            <p className="text-xs text-muted-foreground">Flavours: {product.flavors.slice(0, 4).join(', ')}</p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-[#1A0A00]">Rs. {product.price}</p>
            <p className="text-xs text-muted-foreground">{product.weight}</p>
          </div>

          <Button className="w-full rounded-full bg-[#25D366] hover:bg-[#1fa959]" asChild>
            <a href={link} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Enquire on WhatsApp
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="bg-[#1A0A00] px-4 py-14 text-center sm:py-20">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#E8762A]">Everything We Make</p>
        <h1 className="font-display text-4xl font-black text-white sm:text-5xl lg:text-6xl">Our Products</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-white/70">
          Choose between ready-to-ship hero snacks and our premium enquiry-only collection.
        </p>
      </div>

      <div className="mt-0 border-b-2 border-border bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl gap-0 overflow-x-auto">
          {[
            { id: 'order', label: '🛒 Order Now', sub: 'Ready to deliver' },
            { id: 'enquire', label: '💬 Enquire via WhatsApp', sub: 'Premium collection' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={`relative flex min-w-fit flex-col items-start px-6 py-4 transition-colors sm:px-8 ${
                activeMainTab === tab.id ? 'text-[#E8762A]' : 'text-muted-foreground hover:text-[#1A0A00]'
              }`}
            >
              <span className="text-base font-bold">{tab.label}</span>
              <span className="text-xs opacity-70">{tab.sub}</span>
              {activeMainTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#E8762A]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <p className="py-12 text-center text-muted-foreground">Loading products...</p>
        ) : error ? (
          <p className="py-12 text-center text-red-600">{error}</p>
        ) : (
          <>
            {activeMainTab === 'order' && (
              <div className="space-y-8 pt-2">
                {heroSpotlight.length > 0 && (
                  <section>
                    <h2 className="font-display text-2xl font-bold text-[#1A0A00] sm:text-3xl">Hero Flavour Spotlight</h2>
                    <div className="mt-1 mb-3 h-1 w-12 rounded-full bg-[#E8762A]" />
                    <div className="grid grid-flow-col auto-cols-[78%] gap-4 overflow-x-auto pb-2 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 lg:grid-cols-5">
                      {heroSpotlight.map((product) => {
                        const colorClass = flavorColorMap[product.flavour] || 'border-border bg-muted text-foreground';
                        return (
                          <div
                            key={product._id || product.id}
                            className="group flex flex-col overflow-hidden rounded-3xl border-0 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-strong"
                          >
                            <div className="h-1 w-full bg-gradient-to-r from-[#E8762A] to-[#f0943a]" />
                            <Link to={`/product/${product._id || product.id}`} className="block overflow-hidden">
                              <img
                                src={getImageUrl(product.image)}
                                alt={getDisplayProductName(product)}
                                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-108"
                              />
                            </Link>
                            <div className="flex flex-1 flex-col gap-2 p-3">
                              <span className={`self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
                                {product.flavour}
                              </span>
                              <p className="text-sm font-semibold leading-snug text-[#1A0A00]">{getDisplayProductName(product)}</p>
                              <p className="text-sm font-bold text-[#E8762A]">Rs. {product.price}</p>
                              <Button
                                size="sm"
                                className="mt-auto w-full bg-[#E8762A] text-xs hover:bg-[#d76b20]"
                                onClick={() => onAddToCart(product)}
                              >
                                <ShoppingCart className="mr-1 h-3 w-3" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" /> Filter:
                  </span>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'gud', label: 'Gud Chana' },
                    { id: 'crunchy', label: 'Crunchy Chana' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                        orderFilter === item.id
                          ? 'border-[#E8762A] bg-[#E8762A] text-white'
                          : 'border-border bg-muted text-muted-foreground hover:border-[#E8762A]'
                      }`}
                      onClick={() => setOrderFilter(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{orderCards.map(renderOrderCard)}</div>
              </div>
            )}

            {activeMainTab === 'enquire' && (
              <div className="space-y-8 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" /> Filter:
                  </span>
                  {enquiryCategories.map((categoryId) => (
                    <button
                      key={categoryId}
                      className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                        enquiryFilter === categoryId
                          ? 'border-[#E8762A] bg-[#E8762A] text-white'
                          : 'border-border bg-muted text-muted-foreground hover:border-[#E8762A]'
                      }`}
                      onClick={() => setEnquiryFilter(categoryId)}
                    >
                      {categoryId === 'all' ? 'All' : categoryNameMap[categoryId] || categoryId}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEnquiryProducts.length === 0 ? (
                    <div className="col-span-full py-16 text-center">
                      <p className="text-muted-foreground">No products in this category yet.</p>
                      <button
                        className="mt-3 text-sm font-semibold text-[#E8762A] hover:underline"
                        onClick={() => setEnquiryFilter('all')}
                      >
                        View all enquiry products →
                      </button>
                    </div>
                  ) : (
                    filteredEnquiryProducts.map(renderEnquiryCard)
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
