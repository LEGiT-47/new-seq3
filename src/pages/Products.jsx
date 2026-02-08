import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { categories, getProductsByCategory } from '../data/products';
import { ShoppingCart, MessageCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';

const Products = () => {
  const { category: urlCategory } = useParams();
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'chocolates');
  const [selectedOptions, setSelectedOptions] = useState({});
  const { addToCart } = useCart();

  

  const handleOptionChange = (productId, option, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [option]: value
      }
    }));
  };

  const getProductImage = (product) => {
    return product.image;
  };

  const categoryProducts = getProductsByCategory(activeCategory).filter(
    product => product.category !== 'gifting' && product.category !== 'services' && !product.isHidden
  );

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

  const allCategories = useMemo(() => {
    const filtered = categories.filter(cat => cat.id !== 'gifting' && cat.id !== 'services');
    const validCategories = filtered.filter(cat => {
      const catProducts = getProductsByCategory(cat.id).filter(
        product => product.category !== 'gifting' && product.category !== 'services' && !product.isHidden
      );
      return catProducts.length > 0 || cat.id !== 'specials';
    });
    // Add "All Products" at the beginning
    return [{ id: 'all', name: 'All Products', description: '', icon: '🛍️', image: '' }, ...validCategories];
  }, []);

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Our Products</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Discover our complete range of premium nuts, dry fruits, and delicacies
            </p>
          </div>

          {/* Category Navigation */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            {/* Mobile Category Dropdown */}
            <div className="md:hidden mb-6 flex justify-center">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Category Tabs */}
            <div className="hidden md:block mb-8">
              <div className="flex justify-center overflow-x-auto">
                <TabsList className="flex gap-1 bg-muted p-2 rounded-lg">
                  {allCategories.map((cat) => (
                    <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm whitespace-nowrap h-9 px-3 py-1.5">
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* Products Grid */}
            {allCategories.map((cat) => {
              const tabProducts = getProductsByCategory(cat.id).filter(
                product => product.category !== 'gifting' && product.category !== 'services' && !product.isHidden
              );

              return (
                <TabsContent key={cat.id} value={cat.id}>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Showing {tabProducts.length} products
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {tabProducts.map((product) => {
                      const hasCoatings = product.coatings && product.coatings.length > 0;
                      const hasFlavors = product.flavors && product.flavors.length > 0;

                        return (
                        <Card key={product.id} className="hover-lift bg-card border-border group flex flex-col">
                          <CardContent className="p-0 flex flex-col h-full">
                          <div className="relative cursor-zoom-in">
                            <div className="overflow-hidden rounded-t-lg">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 transform hover:scale-110 group-hover:scale-105"
                              onClick={() => window.open(getProductImage(product), '_blank')}
                              role="button"
                              aria-label={`Zoom ${product.name}`}
                            />
                            </div>
                            {product.bestseller && (
                            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs sm:text-sm">
                              Bestseller
                            </Badge>
                            )}
                          </div>

                          <div className="p-3 sm:p-4 flex flex-col flex-grow">
                            <div className="mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {categories.find(c => c.id === product.category)?.name || product.category}
                            </Badge>
                            </div>

                            <h3 className="font-semibold mb-1 text-xs sm:text-sm md:text-base line-clamp-2">{product.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {product.description}
                            </p>

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

                            <p className="text-lg font-bold mb-4 hidden">₹{product.price}</p>

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

                  {tabProducts.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        We couldn't find any products in this category.
                      </p>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Bottom CTA */}
          {categoryProducts.length > 0 && (
            <div className="mt-8 sm:mt-12 text-center p-6 sm:p-8 bg-muted/30 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Need Something Custom?</h3>
              <p className="text-xs sm:text-base text-muted-foreground mb-4 px-2">
                We offer custom packaging and bulk orders for corporate gifting and special occasions.
              </p>
              <Button
                onClick={() => {
                  const phoneNumber = '+919930709557';
                  const message = 'Hello! I am interested in custom packaging and bulk orders. Please provide more details.';
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Get Custom Quote
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
