import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Shield, Award, Heart, Users, Truck, Star, MessageCircle, Phone } from 'lucide-react';
import about from '../assets/image.png';

const About = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Premium Quality',
      description: 'We source only the finest nuts, dry fruits, and ingredients from trusted suppliers worldwide.'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Customer First',
      description: 'Every product is crafted with love and care, ensuring the best experience for our customers.'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Trusted Excellence',
      description: 'Years of experience in delivering premium quality products with consistent excellence.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Family Values',
      description: 'We treat every customer as family, building lasting relationships through quality and service.'
    }
  ];

  const whyChooseUs = [
    {
      title: 'Complete In-House Production',
      description: 'From sourcing to packaging, everything is done under one roof ensuring quality control.'
    },
    {
      title: 'Custom Packaging Solutions',
      description: 'Beautiful, custom packaging perfect for gifting and corporate requirements.'
    },
    {
      title: 'Bulk Order Capabilities',
      description: 'We handle large orders efficiently with competitive pricing and timely delivery.'
    },
    {
      title: 'Low MOQ Support',
      description: 'Supporting startups and growing brands with flexible minimum order quantities.'
    },
    {
      title: 'New Product Development',
      description: 'Bringing your ideas to life with customized product development and flavor innovation.'
    }
  ];

  const stats = [
    { number: '250+', label: 'Happy Customers' },
    { number: '50+', label: 'Product Varieties' },
    { number: '15+', label: 'Years Experience' },
    { number: '100%', label: 'Premium Quality' }
  ];

  return (
    <div className="min-h-screen bg-[#0B1D35] py-6 text-[#F8F4EC] sm:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-16">
            <Badge className="mb-4 bg-gradient-primary border-0 text-primary-foreground text-xs sm:text-sm">
              About Sequeira Foods
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Your Trusted Private Label Partner
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              At Sequeira Foods, we take pride in offering an exquisite selection of premium chocolates, flavored nuts, jaggery-coated delights, and the finest dry fruits. Our unwavering commitment to quality and craftsmanship ensures that every product delivers exceptional taste, freshness, and indulgence, making Sequeira Foods a trusted name in premium gourmet treats.
            </p>
          </div>

          {/* Hero Image */}
                  <div className="mb-6 sm:mb-16">
                  <div className="h-48 sm:h-64 md:h-96 rounded-xl sm:rounded-2xl relative overflow-hidden bg-transparent">
                    <img src={about} alt="Sequeira Foods" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center text-white px-4" style={{color: '#ffcd78'}}>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">Premium and Unique Products</h2>
                    <p className="text-xl sm:text-2xl md:text-3xl opacity-90">At Competitive Prices</p>
                    </div>
                    </div>
                  </div>
                  </div>

                  {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission & Values */}
          <section className="mb-6 sm:mb-16">
            <div className="text-center mb-6 sm:mb-6">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Our Mission & Values</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                We believe in delivering excellence through quality, innovation, and customer satisfaction.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover-lift">
                  <CardContent className="p-4 sm:p-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-primary">
                      {value.icon}
                    </div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">{value.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-6 sm:mb-16">
            <div className="text-center mb-6 sm:mb-6">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Why Choose Us</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                Discover what makes Sequeira Foods the preferred choice for premium food products.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {whyChooseUs.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">{reason.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Company Story */}
          <section className="mb-6 sm:mb-16 bg-gradient-warm rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Our Story</h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
                <p>
                  Sequeira Foods Pvt. Ltd. (est. 2024) is a premium gourmet brand dedicated to crafting unique, high-quality, and affordable delights. We specialize in handcrafted chocolate-coated dry fruits and flavored nuts, blending taste, health, and elegance in every bite.
                </p>
                <p>
                  From corporate and festive hampers to personalized wedding and event gifts, we offer thoughtfully crafted solutions for every need, whether it is a small custom order or a large-scale bulk requirement. With consistency, creativity, and care, we ensure every gift leaves a lasting impression.
                </p>
                <p>
                  At Sequeira Foods, we believe quality should never be compromised. Our goal is to offer premium treats that are easy on the pocket and perfect for every celebration.
                </p>
              </div>
            </div>
          </section>

          {/* Trusted By */}
          <section className="mb-6 sm:mb-16">
            <div className="text-center mb-6 sm:mb-6">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Trusted By</h2>
              <p className="text-sm sm:text-base text-muted-foreground px-2">
                We are proud to serve a diverse range of customers including:
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Corporate Clients</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Bulk orders for offices and events</p>
              </div>
              
              <div className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Individual Families</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Premium products for daily consumption</p>
              </div>
              
              <div className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Retail Partners</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Private label solutions</p>
              </div>
              
              <div className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Event Planners</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Custom gifting solutions</p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center p-6 sm:p-8 bg-gradient-primary text-primary-foreground rounded-xl sm:rounded-2xl">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Experience Premium Quality?
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-6 opacity-90 px-2">
              Get in touch with us to discuss your requirements or place an order.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-xs sm:text-sm"
                onClick={() => {
                  const phoneNumber = '+919930709557';
                  const message = 'Hello! I would like to know more about Sequeira Foods and your products.';
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm"
                onClick={() => window.open('tel:+919930709557', '_self')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
