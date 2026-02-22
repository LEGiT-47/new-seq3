import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { giftingAPI } from '../lib/api';
import { MessageCircle, Gift, Heart } from 'lucide-react';
import { toast } from 'sonner';

const Gifting = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [giftingSolutions, setGiftingSolutions] = useState([]);
  const [festiveProducts, setFestiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [festiveLoading, setFestiveLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchGiftingProducts = async () => {
      try {
        setLoading(true);
        // For now, use local gift packs
        // This would normally fetch from DB for normal gifting
        setGiftingSolutions([]);
      } catch (error) {
        console.error('Error fetching gifting solutions:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFestiveProducts = async () => {
      try {
        setFestiveLoading(true);
        const response = await giftingAPI.getFestive();
        const festive = response.data.data || [];
        setFestiveProducts(festive);
      } catch (error) {
        console.error('Error fetching festive products:', error);
        setFestiveProducts([]);
        // Don't show error toast - gracefully handle missing data
      } finally {
        setFestiveLoading(false);
      }
    };

    fetchGiftingProducts();
    fetchFestiveProducts();
  }, []);

  // Get tab from URL params, default to 'normal'
  const activeTab = searchParams.get('tab') || 'normal';

  const giftingCategories = [
    {
      id: 'corporate',
      name: 'Corporate Gifting',
      description: 'Premium gift solutions for your corporate needs and employee appreciation',
      occasions: [
        'New Year',
        'Women\'s Day',
        'Financial Year Closing / New Financial Year',
        'Eid-ul-Fitr',
        'Raksha Bandhan',
        'Diwali',
        'Christmas & Year-End',
        'Corporate Awards / Annual Events',
      ]
    },
    {
      id: 'personalized',
      name: 'Personalized Gifting',
      description: 'Thoughtfully curated gifts perfect for personal celebrations and milestones',
      occasions: [
        'Valentine\'s Day',
        'Birthdays',
        'Work Anniversaries',
        'Raksha Bandhan',
        'Mother\'s Day',
        'Father\'s Day',
        'Naming Ceremony / Baptism',
        'Christmas / New Year',
      ]
    },
    {
      id: 'events',
      name: 'Event & Wedding Gifting',
      description: 'Elegant and memorable gifts for weddings and special life events',
      occasions: [
        'Wedding & Engagement',
        'Pre-Wedding Functions',
        'Anniversaries',
        'Naming Ceremony',
        'Baby Shower',
        'Housewarming',
        'Return Gifts',
        'Corporate Events & Milestones',
      ]
    }
  ];

  const giftPacks = [
    {
      id: 'classic',
      name: 'Classic Assorted Pack',
      description: 'A timeless selection of our finest nuts and dry fruits, perfect for any occasion. Includes a variety of premium quality products carefully curated for excellence.',
      price: '₹999',
      includes: ['Premium Almonds', 'Cashews', 'Raisins', 'Dates'],
      icon: '🎁'
    },
    {
      id: 'premium',
      name: 'Premium Gourmet Pack',
      description: 'Our most luxurious selection featuring chocolate-coated nuts, specialty flavored items, and premium dry fruits. Perfect for the discerning gift-giver.',
      price: '₹1,499',
      includes: ['Chocolate Almonds', 'Chocolate Cashews', 'Assorted Coated Nuts', 'Premium Dry Fruits'],
      icon: '✨'
    },
    {
      id: 'deluxe',
      name: 'Deluxe Festive Pack',
      description: 'An exquisite collection ideal for festival seasons. Beautifully packaged with our finest selections and seasonal specialties.',
      price: '₹1,999',
      includes: ['All Premium Items', 'Seasonal Specials', 'Festive Packaging', 'Personalization Option'],
      icon: '👑'
    }
  ];

  const handleContactSeller = (product) => {
    let message = `Hello! I would like to inquire about the ${product.name || product.id}`;
    message += '. Please let me know the availability, pricing, and customization options. Thank you!';

    const phoneNumber = '+919930709557';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1, {});
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block mb-4">
              <Gift className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Gifting Solutions</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Explore our curated gift collections for every occasion. From corporate gifting to festive celebrations, we have the perfect gift for everyone.
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="normal">Normal Gifting</TabsTrigger>
              <TabsTrigger value="festive">Festive Gifting</TabsTrigger>
            </TabsList>

            {/* Normal Gifting Tab */}
            <TabsContent value="normal" className="space-y-8">
              <div className="space-y-6">
                {giftingCategories.map((category) => (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {/* Occasions List */}
                      <div>
                        <p className="text-sm font-semibold mb-3">Perfect for:</p>
                        <div className="flex flex-wrap gap-2">
                          {category.occasions.map((occasion) => (
                            <Badge key={occasion} variant="secondary">
                              {occasion}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Gift Packs Grid */}
                      <div>
                        <p className="text-sm font-semibold mb-4">Choose your pack:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {giftPacks.map((pack) => (
                            <Card key={pack.id} className="flex flex-col hover:shadow-lg transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between mb-2">
                                  <span className="text-2xl">{pack.icon}</span>
                                  <Badge className="bg-primary/20 text-primary border-primary/30">{pack.price}</Badge>
                                </div>
                                <CardTitle className="text-lg">{pack.name}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-1 flex flex-col gap-4 pb-4">
                                <p className="text-sm text-muted-foreground">{pack.description}</p>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-muted-foreground mb-2">Includes:</p>
                                  <ul className="text-xs space-y-1">
                                    {pack.includes.map((item) => (
                                      <li key={item} className="flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-primary" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="flex flex-col gap-2 pt-4 border-t">
                                  <Button
                                    size="sm"
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                                    onClick={() => handleContactSeller(pack)}
                                  >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Contact Seller
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleAddToCart(pack)}
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Festive Gifting Tab */}
            <TabsContent value="festive" className="space-y-6">
              {festiveLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading festive collections...</p>
                </div>
              ) : festiveProducts && festiveProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {festiveProducts.map((product) => {
                    const productId = product._id || product.id;
                    return (
                      <Card key={productId} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3 bg-gradient-to-r from-rose-50 to-orange-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg text-rose-700">{product.name}</CardTitle>
                              {product.discount && (
                                <Badge className="bg-rose-500 text-white mt-2 animate-pulse">
                                  Save {product.discount}%
                                </Badge>
                              )}
                            </div>
                          </div>
                          {product.subcategory && (
                            <p className="text-xs text-muted-foreground mt-2">{product.subcategory}</p>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                          <p className="text-sm text-muted-foreground">{product.description}</p>

                          {product.includes && product.includes.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Includes:</p>
                              <ul className="text-xs space-y-1">
                                {product.includes.slice(0, 3).map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-rose-500" />
                                    {item}
                                  </li>
                                ))}
                                {product.includes.length > 3 && (
                                  <li className="text-muted-foreground">+{product.includes.length - 3} more items</li>
                                )}
                              </ul>
                            </div>
                          )}

                          {product.price && (
                            <div className="flex items-baseline gap-2 pt-2">
                              <span className="text-2xl font-bold text-rose-600">₹{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
                          )}

                          {product.weight && (
                            <p className="text-xs text-muted-foreground">{product.weight}</p>
                          )}

                          <div className="flex flex-col gap-2 pt-4 border-t">
                            <Button
                              size="sm"
                              className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                              onClick={() => handleContactSeller(product)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Order on WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => handleAddToCart(product)}
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Save for Later
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg border border-dashed">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Festive Products Available Yet</h3>
                  <p className="text-muted-foreground mb-4">Check back soon for our special festive collections!</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const phoneNumber = '+919930709557';
                      const message = 'Hello! I am interested in your festive gifting solutions. Please let me know about upcoming collections.';
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Notify Me
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <div className="mt-12 text-center p-6 sm:p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <h3 className="text-lg sm:text-2xl font-semibold mb-2">Need Custom Gifting Solutions?</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 px-2">
              We offer personalized packaging, bulk orders, and bespoke gifting solutions for your special needs.
            </p>
            <Button
              size="lg"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white"
              onClick={() => {
                const phoneNumber = '+919930709557';
                const message = 'Hello! I am interested in custom gifting solutions for a special occasion. Please provide details and pricing.';
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Get in Touch via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gifting;
