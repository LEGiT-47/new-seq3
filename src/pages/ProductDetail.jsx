import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { productAPI } from '../lib/api';
import { ShoppingCart, MessageCircle, Heart, Share2, Truck, Shield, Star } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedCoating, setSelectedCoating] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getById(id);
        const productData = response.data.data || response.data;

        if (productData) {
          setProduct(productData);
          if (productData.defaultCoating) {
            setSelectedCoating(productData.defaultCoating);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Product Not Found'}</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or couldn't be loaded.</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      coating: selectedCoating || null,
      flavor: selectedFlavor || null,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product.isDeliverable) {
      handleWhatsAppEnquiry();
      return;
    }

    handleAddToCart();
    navigate('/cart');
  };

  const handleWhatsAppEnquiry = () => {
    const phoneNumber = '+919930709557';
    let message = `Hello! I would like to enquire about ${product.name}`;

    if (selectedCoating || selectedFlavor) {
      const details = [];
      if (selectedCoating) details.push(`Coating: ${selectedCoating}`);
      if (selectedFlavor) details.push(`Flavor: ${selectedFlavor}`);
      message += ` (${details.join(', ')})`;
    }

    message += '. Please let me know the availability and details. Thank you!';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Sample product details (these will come from database later)
  const benefits = [
    'Rich in antioxidants',
    'High in protein and fiber',
    'Helps improve digestion',
    'Good source of healthy fats',
    'Enhances immune system',
  ];

  const qualityHighlights = [
    'Premium quality sourced directly',
    'No artificial additives',
    'Carefully roasted for maximum flavor',
    'Hygienically processed',
    'Packed in food-grade materials',
  ];

  const testimonials = [
    {
      author: 'Rahul K.',
      text: 'Excellent quality and taste. Best product I have tried. Highly recommended!',
      rating: 5,
    },
    {
      author: 'Priya M.',
      text: 'Fresh and perfectly roasted. The taste is incredible. Will order again!',
      rating: 5,
    },
    {
      author: 'Amit P.',
      text: 'Great value for money. Loved the packaging and freshness.',
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <button onClick={() => navigate('/products')} className="hover:underline">
              Products
            </button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate(`/products/${product.category}`)} className="hover:underline">
              {product.category}
            </button>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </div>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
                  />
                </CardContent>
              </Card>

              {/* Product Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold">{product.name}</h1>
                  {product.bestseller && <Badge className="bg-destructive">Bestseller</Badge>}
                  {product.isDeliverable && <Badge className="bg-green-600">Deliverable</Badge>}
                </div>
                <p className="text-base text-muted-foreground mb-4">{product.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">₹{product.price}</span>
                  <span className="text-muted-foreground">per {product.weight}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(127 reviews)</span>
                </div>
              </div>

              {/* Options */}
              {(product.coatings?.length > 0 || product.flavors?.length > 0) && (
                <div className="space-y-4 border-t border-b py-4">
                  {product.coatings?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium block mb-2">Coating</label>
                      <Select value={selectedCoating} onValueChange={setSelectedCoating}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coating" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.coatings.map((coating) => (
                            <SelectItem key={coating} value={coating}>
                              {coating}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {product.flavors?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium block mb-2">Flavor</label>
                      <Select value={selectedFlavor} onValueChange={setSelectedFlavor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select flavor" />
                        </SelectTrigger>
                        <SelectContent>
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

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium block mb-2">Quantity</label>
                <div className="flex items-center gap-3 border rounded-lg w-fit">
                  <button
                    className="px-3 py-2 hover:bg-muted"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    className="px-3 py-2 hover:bg-muted"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              {product.isDeliverable && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex gap-2 items-start">
                    <Truck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Fast Delivery</p>
                      <p className="text-xs text-green-700 mt-1">Delivered in 7-8 business days</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-3 sticky bottom-0 pt-4 bg-background">
                <Button
                  size="lg"
                  className={`w-full ${
                    product.isDeliverable
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-[#25D366] hover:bg-[#128C7E]'
                  } text-white`}
                  onClick={handleBuyNow}
                >
                  {product.isDeliverable ? (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Buy Now
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Enquire on WhatsApp
                    </>
                  )}
                </Button>

                {product.isDeliverable && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="details" className="w-full mb-12">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto">
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Details
              </TabsTrigger>
              <TabsTrigger value="benefits" className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Health Benefits
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-semibold">{product.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-semibold">{product.category}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Quality Highlights</h4>
                    <ul className="space-y-2">
                      {qualityHighlights.map((highlight, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Storage & Shelf Life</h4>
                    <p className="text-sm text-muted-foreground">
                      Store in a cool, dry place. Best consumed within 3-6 months of purchase. Keep away from direct sunlight and moisture.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {testimonials.map((testimonial, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="font-semibold text-sm mb-1">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            {/* Will add related products component here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
