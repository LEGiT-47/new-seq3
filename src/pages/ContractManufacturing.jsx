import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MessageCircle, Phone, Mail, CheckCircle } from 'lucide-react';

const ContractManufacturing = () => {
  const trustReasons = [
    {
      title: '15+ Years Experience',
      description: 'Proven track record in manufacturing and private labelling'
    },
    {
      title: 'Quality Assured',
      description: 'Stringent quality control at every step of production'
    },
    {
      title: 'Modern Facilities',
      description: 'State-of-the-art infrastructure and equipment'
    },
    {
      title: 'Flexible Terms',
      description: 'Customized solutions for your specific requirements'
    }
  ];

  const handleWhatsAppContact = () => {
    const phoneNumber = '+919930709557';
    const message = 'Hello! I am interested in contract manufacturing and private labelling services. Please provide details about capabilities and pricing.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+919930709557', '_self');
  };

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-gradient-primary border-0 text-primary-foreground text-xs sm:text-sm">
              Contract Manufacturing
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Contract Manufacturing / Private Labelling
            </h1>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16 space-y-6">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Many companies have a strong marketing and distribution network but prefer not to manage their own production facilities or are looking for additional processing capacities for nuts. If that's the case, our company is the ideal partner to collaborate with - whether to process your existing product range or to develop new products on an exclusive basis.
              </p>

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                With our robust infrastructure, sound financial strength, dedicated R&D capabilities, and a highly qualified technical team, you can confidently focus on expanding your marketing and distribution efforts while we handle the production excellence.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="max-w-2xl mx-auto mb-12 sm:mb-16 text-center p-6 sm:p-8 bg-muted/30 rounded-xl sm:rounded-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Get in Touch</h2>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6">
              <Button
                size="lg"
                variant="secondary"
                className="text-xs sm:text-sm"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-xs sm:text-sm"
                onClick={handleCall}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-xs sm:text-sm"
                onClick={() => window.open('mailto:sequeirafoods@gmail.com')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Us
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground">
               +91 99307 09557<br />
              Email: sequeirafoods@gmail.com
            </p>
          </div>

          {/* Why Companies Trust Us */}
          <section className="bg-gradient-warm rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Why Companies Trust Us
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {trustReasons.map((reason, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">{reason.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{reason.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContractManufacturing;
