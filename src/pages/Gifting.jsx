import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { productAPI } from '../lib/api';
import { MessageCircle, Gift } from 'lucide-react';
import { toast } from 'sonner';

const Gifting = () => {
  const [serviceSelections, setServiceSelections] = useState({});
  const { addToCart } = useCart();
  const [giftingSolutions, setGiftingSolutions] = useState([]);
  const [giftingServices, setGiftingServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftingProducts = async () => {
      try {
        setLoading(true);
        const allProductsResponse = await productAPI.getAll();
        const allProducts = allProductsResponse.data.data || allProductsResponse.data;

        const solutions = allProducts.filter(p => p.category === 'gifting');
        const services = allProducts.filter(p => p.category === 'services');

        setGiftingSolutions(solutions);
        setGiftingServices(services);
      } catch (error) {
        console.error('Error fetching gifting products:', error);
        toast.error('Failed to load gifting products');
      } finally {
        setLoading(false);
      }
    };

    fetchGiftingProducts();
  }, []);

  const festivalOptions = {
    'Corporate Gifting': [
      'New Year',
      'Women\'s Day',
      'Financial Year Closing / New Financial Year',
      'Eid-ul-Fitr',
      'Raksha Bandhan',
      'Diwali',
      'Christmas & Year-End',
      'Corporate Awards / Annual Events',
      'Other'
    ],
    'Festive Gifting': [
      'Makar Sankranti / Pongal / Lohri',
      'Holi',
      'Eid-ul-Fitr',
      'Raksha Bandhan',
      'Onam / Ganesh Chaturthi',
      'Navratri / Dussehra',
      'Diwali',
      'Christmas',
      'Other'
    ],
    'Personalized Gifting': [
      'Valentine\'s Day',
      'Birthdays',
      'Work Anniversaries',
      'Raksha Bandhan',
      'Mother\'s Day',
      'Father\'s Day',
      'Naming Ceremony / Baptism / Naamkaran',
      'Christmas / New Year',
      'Other'
    ],
    'Event & Wedding Gifting': [
      'Wedding & Engagement',
      'Pre-Wedding Functions (Haldi / Mehendi / Sangeet)',
      'Anniversaries',
      'Naming Ceremony (Naamkaran / Baptism / Cradle Ceremony)',
      'Baby Shower (Godh Bharai / Seemantham)',
      'Housewarming (Griha Pravesh)',
      'Return Gifts',
      'Corporate Events & Milestones',
      'Other'
    ]
  };

  const handleServiceSelection = (serviceId, selectionType, value) => {
    setServiceSelections(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [selectionType]: value
      }
    }));
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1, {});
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    let message = `Hello! I would like to inquire about ${product.name}`;
    message += '. Please let me know the price, availability, and any customization options. Thank you!';

    const phoneNumber = '+919930709557';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block mb-4">
              <Gift className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Gifting Solutions</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Explore our premium gift packs and specialized gifting services for every occasion.
              Perfect for corporate gifting, festive celebrations, and special events.
            </p>
          </div>

          {/* Services with Selection Dropdowns */}
          <div className="space-y-4 sm:space-y-6 mb-12">
            {giftingServices.length > 0 ? (
              giftingServices.map((service) => (
                <div key={service.id} className="bg-card border border-border rounded-lg p-4 sm:p-6">
                  {/* Service Header */}
                  <h2 className="text-lg sm:text-xl font-bold mb-2">{service.name}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6">{service.description}</p>

                  {/* Selection Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Festival/Occasion Dropdown */}
                    {festivalOptions[service.name] && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-2">
                          {service.name.includes('Festive') ? 'Select Festival' : 'Select Occasion'}
                        </label>
                        <Select
                          value={serviceSelections[service.id]?.festival || ''}
                          onValueChange={(value) => handleServiceSelection(service.id, 'festival', value)}
                        >
                          <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue placeholder={`Choose a ${service.name.includes('Festive') ? 'festival' : 'occasion'}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {festivalOptions[service.name]?.map((festival) => (
                              <SelectItem key={festival} value={festival}>
                                {festival}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Other Occasion Input */}
                    {serviceSelections[service.id]?.festival === 'Other' && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-2">
                          Please specify the occasion
                        </label>
                        <input
                          type="text"
                          value={serviceSelections[service.id]?.otherOccasion || ''}
                          onChange={(e) => handleServiceSelection(service.id, 'otherOccasion', e.target.value)}
                          placeholder="Enter your occasion"
                          className="w-full h-9 sm:h-10 px-3 rounded-md border border-input bg-background text-xs sm:text-sm"
                        />
                      </div>
                    )}

                    {/* Pack Type Dropdown */}
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-2">
                        Select Pack
                      </label>
                      <Select
                        value={serviceSelections[service.id]?.packType || ''}
                        onValueChange={(value) => handleServiceSelection(service.id, 'packType', value)}
                      >
                        <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue placeholder="Choose a pack" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Packs</SelectItem>
                          {giftingSolutions.map((pack) => {
                            const packId = pack.id || pack._id;
                            return (
                              <SelectItem key={packId} value={packId.toString()}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{pack.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Display Selected Pack Details */}
                  {serviceSelections[service.id]?.packType && serviceSelections[service.id]?.packType !== 'all' && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                      {giftingSolutions
                        .filter(pack => {
                          const packId = pack.id || pack._id;
                          return packId.toString() === serviceSelections[service.id].packType;
                        })
                        .map((pack) => {
                          const packId = pack.id || pack._id;
                          return (
                            <div key={packId}>
                              <h3 className="font-semibold text-sm sm:text-base mb-2">{pack.name}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground mb-4">{pack.description}</p>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs sm:text-sm h-9 sm:h-10"
                                  onClick={() => handleBuyNow(pack)}
                                >
                                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                  Buy Now
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                                  onClick={() => handleAddToCart(pack)}
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {serviceSelections[service.id]?.packType === 'all' && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                      <p className="text-xs sm:text-sm text-muted-foreground">Select a specific pack to view details and purchase options.</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 sm:py-16">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No services available</h3>
                <p className="text-muted-foreground text-sm">Please check back soon for specialized gifting services.</p>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center p-6 sm:p-8 bg-gradient-primary text-primary-foreground rounded-lg">
            <h3 className="text-lg sm:text-2xl font-semibold mb-2">Ready to Send the Perfect Gift?</h3>
            <p className="text-xs sm:text-base mb-4 opacity-90 px-2">
              Contact us for bulk orders, custom packaging, and personalized gifting solutions.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                const phoneNumber = '+919930709557';
                const message = 'Hello! I am interested in your gifting solutions. Please provide more details and pricing.';
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
