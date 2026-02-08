import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { categories, getBestsellerProducts } from '../data/products';
import { ArrowRight, Star, Shield, Gift, Truck, MessageCircle, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import HeroCarousel from '../components/HeroCarousel';
import partner from '../assets/partner.jpg';
import first from '../assets/first.jpg';
import second from '../assets/second.jpg';
import fifth from '../assets/fifth.png';
import fourth from '../assets/fourth.png';

const Home = () => {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState({});
  const bestsellerProducts = getBestsellerProducts();

  const handleOptionChange = (productId, option, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [option]: value
      }
    }));
  };

  const handleAddToCart = (product) => {
    const options = selectedOptions[product.id] || {};
    addToCart(product, 1, {
      coating: options.coating || null,
      flavor: options.flavor || null
    });
    toast.success(`${product.name} added to cart!`);
    setSelectedOptions(prev => ({
      ...prev,
      [product.id]: {}
    }));
  };

  const handleBuyNow = (product) => {
    const options = selectedOptions[product.id] || {};
    let message = `Hello! I would like to order ${product.name}`;

    if (options.coating || options.flavor) {
      const details = [];
      if (options.coating) details.push(`Coating: ${options.coating}`);
      if (options.flavor) details.push(`Flavor: ${options.flavor}`);
      message += ` (${details.join(', ')})`;
    }

    message += '. Please let me know the price and availability. Thank you!';

    const phoneNumber = '+919930709557';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const highlights = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Premium Quality',
      description: 'Sourced from the finest producers worldwide'
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: 'Custom Packaging',
      description: 'Beautiful packaging perfect for gifting'
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery across India'
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Trusted Brand',
      description: 'Serving customers with excellence'
    }
  ];

  const heroSlides = [
    {
      image: first,
      badge: '🤎 Premium Delicacies',
      title: 'Taste the Finest',
      subtitle: 'Premium Delicacies',
      description: 'Discover our exquisite collection of chocolates, flavored nuts, and handpicked dry fruits crafted to perfection for indulgence and gifting.',
      ctaButton: {
        label: 'Shop Now',
        onClick: () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
      },
      quoteButton: {
        label: 'Get a Quote',
        onClick: () => {
          const phoneNumber = '+919930709557';
          const message = 'Hello! I would like to get a quote for bulk orders. Please share your catalog and pricing.';
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        }
      }
    },
    {
      image: second,
      badge: '🎁 Gifting Made Elegant',
      title: 'Elevate Every Occasion',
      subtitle: 'with Thoughtful Gifting',
      description: 'Choose from Corporate, Festive, Personalized, or Event & Wedding Gifting options. Curate your perfect pack from classic assortments to bespoke creations.',
      ctaButton: {
        label: 'Explore Gifting Solutions',
        onClick: () => window.location.href = '/gifting'
      },
      quoteButton: {
        label: 'Create Your Pack',
        onClick: () => {
          const phoneNumber = '+919930709557';
          const message = 'Hello! I want to create a custom gift pack. Please provide details about customization options.';
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        }
      }
    },
    {
      image: partner,
      badge: '📦 Bulk Orders & Job Work',
      title: 'Partner with Us for ',
      subtitle: 'Premium Bulk Orders',
      description: 'Whether you\'re a retailer, distributor, or brand, we offer custom bulk production and packaging solutions for nuts, chocolates, and festive treats.',
      ctaButton: {
        label: 'Enquire for Bulk Orders',
        onClick: () => {
          const phoneNumber = '+919930709557';
          const message = 'Hello! I am interested in bulk orders and custom production. Please provide details about MOQ and pricing.';
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        }
      },
      quoteButton: {
        label: 'Get a Quote',
        onClick: () => {
          const phoneNumber = '+919930709557';
          const message = 'Hello! I would like to get a quote for bulk orders. Please share your catalog and pricing.';
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank');
        }
      }
    },
    // {
    //   image: fourth,
    //   badge: '🎄 Christmas Kuswar Collection',
    //   title: 'Celebrate Christmas with',
    //   subtitle: 'Sweet Traditions',
    //   description: 'Explore our festive Kuswar range from classic delights to curated small, medium, and large Kuswar boxes. Perfect for sharing the joy this season.',
    //   ctaButton: {
    //     label: 'Shop Kuswar',
    //     onClick: () => window.location.href = '/products/specials'
    //   },
    //   quoteButton: {
    //     label: 'Pre-Order Now',
    //     onClick: () => {
    //       const phoneNumber = '+919930709557';
    //       const message = 'Hello! I would like to pre-order your Christmas Kuswar collection. Please share available options and pricing.';
    //       const encodedMessage = encodeURIComponent(message);
    //       const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    //       window.open(whatsappUrl, '_blank');
    //     }
    //   }
    // },
    // {
    //   image: fifth,
    //   badge: '🎉 New Year Specials',
    //   title: 'Ring in the New Year with',
    //   subtitle: 'Premium Goodness',
    //   description: 'Welcome the new year with indulgent dry fruits, gourmet nuts, and exclusive gifting hampers crafted to make celebrations memorable.',
    //   ctaButton: {
    //     label: 'Shop Now',
    //     onClick: () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
    //   },
    //   quoteButton: {
    //     label: 'Pre-Order Now',
    //     onClick: () => {
    //       const phoneNumber = '+919930709557';
    //       const message = 'Hello! I would like to pre-order for New Year celebrations. Please share available options.';
    //       const encodedMessage = encodeURIComponent(message);
    //       const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    //       window.open(whatsappUrl, '_blank');
    //     }
    //   }
    // }
  ];

  return (
    <div className="min-h-screen">
      <HeroCarousel slides={heroSlides} />

      {/* Key Highlights */}
      <section className="py-12 sm:py-16 bg-gradient-warm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-primary">
                    {highlight.icon}
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-3 sm:mb-4">{highlight.title}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

     {} {/* Featured Categories */}
      <section id="products" className="py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Shop by Categories</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                Explore our premium collection across different categories
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {categories.filter(cat => !['gifting', 'services'].includes(cat.id)).map((category, index) => (
                <Link
                  key={category.id}
                  to={`/products/${category.id}`}
                  className="group"
                >
                  <Card className="hover-lift bg-card border-border h-full">
                    <CardContent className="p-3 sm:p-4 md:p-6 text-center flex flex-col h-full">
                      {/* Zoomed image: keep inside overflow-hidden and increase default scale */}
                <div className="w-full h-24 sm:h-28 md:h-40 mb-3 sm:mb-3 md:mb-6 rounded-lg overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center"
                    style={{ transform: 'scale(1.5)', transition: 'transform 0.45s ease' }}
                  />
                </div>
                      <div className="text-2xl sm:text-2xl md:text-4xl mb-2 sm:mb-2 md:mb-3">{category.icon}</div>
                      <h3 className="font-semibold mb-2 text-xs sm:text-sm md:text-lg line-clamp-2">{category.name}</h3>
                      <p className="text-xs sm:text-xs md:text-sm text-muted-foreground mb-310m:mb-4 md:mb-6 flex-grow line-clamp-2">{category.description}</p>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors w-full text-xs md:text-sm md:h-10">
                        Browse
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bestseller Products */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Bestsellers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our most loved products that customers can't get enough of
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {bestsellerProducts.map((product, index) => {
                  const hasCoatings = product.coatings && product.coatings.length > 0;
                  const hasFlavors = product.flavors && product.flavors.length > 0;

                  return (
                    <Card key={product.id} className="hover-lift bg-card border-border group flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs sm:text-sm">
                            Bestseller
                          </Badge>
                        </div>

                        <div className="p-3 sm:p-4 flex flex-col flex-grow">
                          <div className="mb-2">
                                                      <Badge variant="secondary" className="text-xs">
                                                        {categories.find(c => c.id === product.category)?.name || product.category}
                                                      </Badge>
                                                      </div>
                          <h3 className="font-semibold mb-1 text-xs sm:text-sm md:text-base line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                          <p className="text-lg font-bold mb-4 hidden">₹{product.price}</p>

                          {(hasCoatings || hasFlavors) && (
                            <div className="mb-3 space-y-2">
                              {hasCoatings && (
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                                    Coating
                                  </label>
                                  <Select
                                    value={selectedOptions[product.id]?.coating || ''}
                                    onValueChange={(value) => handleOptionChange(product.id, 'coating', value === '__none__' ? null : value)}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue placeholder="Select a coating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__">No coating</SelectItem>
                                      {product.coatings.map((coating) => (
                                        <SelectItem key={coating} value={coating}>
                                          {coating}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {hasFlavors && (
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                                    Flavor
                                  </label>
                                  <Select
                                    value={selectedOptions[product.id]?.flavor || ''}
                                    onValueChange={(value) => handleOptionChange(product.id, 'flavor', value === '__none__' ? null : value)}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue placeholder="Select a flavor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__">No flavor</SelectItem>
                                      {product.flavors.map((flavor) => (
                                        <SelectItem key={flavor} value={flavor}>
                                          {flavor}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-col gap-2 mt-auto">
                            <Button
                              size="sm"
                              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xs sm:text-sm h-9 sm:h-10"
                              onClick={() => handleBuyNow(product)}
                            >
                              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Buy Now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs sm:text-sm h-9 sm:h-10"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-primary text-primary-foreground">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Place Your Order?
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 px-2">
              Get in touch with us for bulk orders, custom packaging, or any special requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  const phoneNumber = '+919930709557';
                  const message = 'Hello! I am interested in your products. Please share more details.';
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact on WhatsApp
              </Button>

              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
