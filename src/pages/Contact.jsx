import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
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
      iconUrl:
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iI2NmMzMzMiIvPjwvc3ZnPg==',
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

  const lat = 19.16661319088578;
  const lng = 72.94391888725637;
  const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}&z=17`;

  return (
    <Card className="rounded-2xl border border-gray-100 bg-white shadow-soft">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B1D35]/10 text-[#0B1D35]">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-[#0B1D35]">Location</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              <p className="font-semibold text-[#0B1D35]">Sequeira Foods Pvt. Ltd.</p>
              <p>Office no 15, 1st Floor,</p>
              <p>Saidham Shopping Plaza,</p>
              <p>P.K Road, Mulund West,</p>
              <p>Mumbai, 400080</p>
            </div>
          </div>
        </div>

        <div className="relative mb-3 h-56 overflow-hidden rounded-xl border border-gray-200" style={{ zIndex: 0 }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
        </div>

        <a
          href={googleMapsLink}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1D35] py-3 text-sm font-bold text-white transition hover:bg-[#1A3555]"
        >
          <MapPin className="h-4 w-4" />
          Get Directions
        </a>
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
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      message: '',
    });
  };

  const socialMedia = [
    {
      name: 'Facebook',
      handle: '@Sequeirafoods',
      href: 'https://www.facebook.com/people/Sequeirafoods/61576995125995/',
      bg: '#1877F2',
    },
    {
      name: 'Instagram',
      handle: '@sequeirafoods',
      href: 'https://instagram.com/sequeirafoods',
      bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
    },
  ];

  const faqs = [
    {
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer competitive pricing for bulk orders. Contact us for custom quotes.',
    },
    {
      question: 'What is your minimum order quantity?',
      answer: 'We support low MOQ for startups and growing brands. Minimum orders vary by product.',
    },
    {
      question: 'Do you provide custom packaging?',
      answer: 'Absolutely! We offer custom packaging solutions perfect for gifting and corporate needs.',
    },
    {
      question: 'What are your delivery options?',
      answer: 'We deliver across India with various shipping options to suit your timeline and budget.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0B1D35] px-4 py-14 text-center sm:py-20">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Say Hello</p>
        <h1 className="font-display text-5xl tracking-wide text-white sm:text-6xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-[#B8C8D8]">
          Have questions or need a custom quote? We'd love to hear from you.
        </p>
      </div>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Contact Information</h2>
          <div className="mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LocationWithMap />

            <Card className="rounded-2xl border border-gray-100 bg-white shadow-soft">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-sans text-base font-bold text-[#0B1D35]">
                  <MessageCircle className="h-5 w-5" />
                  Follow Us
                </h3>
                <div className="mb-6 space-y-3">
                  {socialMedia.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                        style={{ background: social.bg }}
                      >
                        {social.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0B1D35]">{social.name}</p>
                        <p className="text-xs text-gray-500">{social.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mb-5 border-t border-gray-100 pt-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B1D35]/10 text-[#0B1D35]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-[#0B1D35]">Phone Number</h4>
                      <p className="mt-1 text-sm text-gray-500">+91 99307 09557</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B1D35]/10 text-[#0B1D35]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-[#0B1D35]">Business Hours</h4>
                      <p className="mt-1 text-sm text-gray-500">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                      <p className="text-sm text-gray-500">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-[#F9F9F7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl border border-gray-100 bg-white shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-[#0B1D35]">
                  <Send className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm text-[#0B1D35]">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm text-[#0B1D35]">
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm text-[#0B1D35]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm text-[#0B1D35]">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm text-[#0B1D35]">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your requirements, questions, or how we can help you..."
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="h-11 w-full bg-[#25D366] text-sm text-white hover:bg-[#128C7E]">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send via WhatsApp
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    * Required fields. Your message will be sent via WhatsApp for faster response.
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card
                className="cursor-pointer rounded-2xl border border-gray-100 bg-white shadow-soft"
                onClick={() => window.open('mailto:sequeirafoods@gmail.com', '_blank')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B1D35]/10 text-[#0B1D35]">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-bold text-[#0B1D35]">Email</h3>
                      <p className="mt-1 text-sm text-gray-500">sequeirafoods@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl bg-[#0B1D35] text-white shadow-soft">
                <CardContent className="p-6 text-center">
                  <h3 className="font-sans text-base font-bold">Need Immediate Assistance?</h3>
                  <p className="mb-4 mt-1 text-sm text-[#B8C8D8]">
                    Call us directly or send a WhatsApp message for quick response.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open('tel:+919930709557', '_self')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                      onClick={() => {
                        const phoneNumber = '+919930709557';
                        const message = 'Hello! I need immediate assistance with your products.';
                        const encodedMessage = encodeURIComponent(message);
                        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F9F9F7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Frequently Asked Questions</h2>
          <div className="mx-auto mb-8 mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
              <h3 className="font-sans text-sm font-bold text-[#0B1D35]">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
