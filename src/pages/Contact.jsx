import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Facebook, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LocationWithMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const lat = 19.16661319088578;
    const lng = 72.94391888725637;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        // Silently handle removal errors
      }
      mapInstanceRef.current = null;
    }

    // Clear any existing Leaflet data from the container
    if (mapRef.current._leaflet_id !== undefined) {
      delete mapRef.current._leaflet_id;
    }

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([lat, lng], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iI2NmMzMzMiIvPjwvc3ZnPg==',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    marker.bindPopup('<div class="text-sm font-semibold">Sequeira Foods</div>');

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Silently handle removal errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Card className="hover-lift cursor-pointer transition-all">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Location</h3>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
              <p className="font-semibold text-[#0B1D35]">Sequeira Foods Pvt. Ltd.</p>
              <p>Office no 15, 1st Floor,</p>
              <p>Saidham Shopping Plaza,</p>
              <p>P.K Road, Mulund West,</p>
              <p>Mumbai, 400080</p>
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-300 rounded-lg overflow-hidden h-48 sm:h-56 mb-3 relative" style={{ zIndex: 0 }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-9 sm:h-10"
          onClick={() => {
            const lat = 19.16661319088578;
            const lng = 72.94391888725637;
            window.open(`https://www.google.com/maps?q=${lat},${lng}&z=17`, '_blank');
          }}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Get Directions
        </Button>
      </CardContent>
    </Card>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const message = `Hello! Here are my contact details:

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || 'Not provided'}
Subject: ${formData.subject || 'General Inquiry'}

Message: ${formData.message}

Please get back to me. Thank you!`;
    
    const phoneNumber = '+919930709557';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Redirecting to WhatsApp...');
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone Number',
      details: [
        '+91 99307 09557'
      ],
      action: () => window.open('tel:+919930709557', '_self')
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      details: ['sequeirafoods@gmail.com'],
      action: () => window.open('mailto:sequeirafoods@gmail.com', '_blank')
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Location',
      details: ['Sequeira Foods, India'],
      action: null
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Business Hours',
      details: [
        'Monday - Saturday: 10:00 AM - 8:00 PM',
        'Sunday: Closed'
      ],
      action: null
    }
  ];

  const socialMedia = [
    {
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      handle: '@Sequeirafoods',
      url: 'https://www.facebook.com/people/Sequeirafoods/61576995125995/'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      handle: '@sequeirafoods',
      url: 'https://instagram.com/sequeirafoods'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1D35] py-6 text-[#F8F4EC] sm:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-16">
            <Badge className="mb-4 bg-gradient-primary border-0 text-primary-foreground text-xs sm:text-sm">
              Get in Touch
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Have questions about our products or need a custom quote? 
              We're here to help and would love to hear from you.
            </p>
          </div>

          {/* Contact Information */}
          <h2 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Information</h2>

          {/* Location and Follow Us Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-6 mb-6">
            {/* Location Card with Map */}
            <LocationWithMap />

            {/* Follow Us Card */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <MessageCircle className="h-5 w-5" />
                  Follow Us
                </h3>
                <div className="space-y-2 sm:space-y-3 mb-6">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {social.icon}
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{social.name}</div>
                        <div className="text-xs opacity-70">{social.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Phone Numbers */}
                <div className="border-t pt-4 sm:pt-6 mb-4 sm:mb-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Phone Numbers</h4>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          +91 99307 09557
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="border-t pt-4 sm:pt-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Business Hours</h4>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Monday - Saturday: 10:00 AM - 8:00 PM
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Main Section with Form and Assistance */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-6 mb-6">
            {/* Contact Form */}
            <Card className="shadow-medium lg:order-1 order-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Send className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs sm:text-sm">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs sm:text-sm">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-xs sm:text-sm">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs sm:text-sm">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your requirements, questions, or how we can help you..."
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="text-xs sm:text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xs sm:text-sm h-10 sm:h-11">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send via WhatsApp
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Required fields. Your message will be sent via WhatsApp for faster response.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Right Column - Email and Assistance */}
            <div className="space-y-6 sm:space-y-8 lg:order-2 order-1">
              {/* Email Card */}
              <Card
                className="hover-lift cursor-pointer transition-all"
                onClick={() => window.open('mailto:sequeirafoods@gmail.com', '_blank')}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-sm sm:text-base">Email</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">sequeirafoods@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="bg-gradient-primary text-primary-foreground">
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Need Immediate Assistance?</h3>
                  <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">
                    Call us directly or send a WhatsApp message for quick response
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => window.open('tel:+919930709557', '_self')}
                    >
                      <Phone className="mr-2 h-3 w-3" />
                      Call Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => {
                        const phoneNumber = '+919930709557';
                        const message = 'Hello! I need immediate assistance with your products.';
                        const encodedMessage = encodeURIComponent(message);
                        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      <MessageCircle className="mr-2 h-3 w-3" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>


          {/* FAQ Section */}
          <section className="bg-muted/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Frequently Asked Questions</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
                Quick answers to common questions about our products and services
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-6 max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Do you offer bulk discounts?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  Yes, we offer competitive pricing for bulk orders. Contact us for custom quotes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">What is your minimum order quantity?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  We support low MOQ for startups and growing brands. Minimum orders vary by product.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Do you provide custom packaging?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  Absolutely! We offer custom packaging solutions perfect for gifting and corporate needs.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">What are your delivery options?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  We deliver across India with various shipping options to suit your timeline and budget.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
