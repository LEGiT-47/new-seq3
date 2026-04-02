import React from 'react';
import { Button } from '../components/ui/button';
import { Shield, Award, Heart, Users, MessageCircle, Phone, Building2, Store, CalendarCheck } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Premium Quality',
      description: 'We source only the finest nuts, dry fruits, and ingredients from trusted suppliers worldwide.',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Customer First',
      description: 'Every product is crafted with love and care, ensuring the best experience for our customers.',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Trusted Excellence',
      description: 'Years of experience in delivering premium quality products with consistent excellence.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Family Values',
      description: 'We treat every customer as family, building lasting relationships through quality and service.',
    },
  ];

  const whyChooseUs = [
    {
      title: 'Complete In-House Production',
      description: 'From sourcing to packaging, everything is done under one roof ensuring quality control.',
    },
    {
      title: 'Custom Packaging Solutions',
      description: 'Beautiful, custom packaging perfect for gifting and corporate requirements.',
    },
    {
      title: 'Bulk Order Capabilities',
      description: 'We handle large orders efficiently with competitive pricing and timely delivery.',
    },
    {
      title: 'Low MOQ Support',
      description: 'Supporting startups and growing brands with flexible minimum order quantities.',
    },
    {
      title: 'New Product Development',
      description: 'Bringing your ideas to life with customized product development and flavor innovation.',
    },
  ];

  const stats = [
    { number: '250+', label: 'Happy Customers' },
    { number: '50+', label: 'Product Varieties' },
    { number: '15+', label: 'Years Experience' },
    { number: '100%', label: 'Premium Quality' },
  ];

  const trustedBy = [
    {
      icon: <Building2 className="h-7 w-7" />,
      title: 'Corporate Clients',
      desc: 'Bulk orders for offices and events',
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: 'Individual Families',
      desc: 'Premium products for daily consumption',
    },
    {
      icon: <Store className="h-7 w-7" />,
      title: 'Retail Partners',
      desc: 'Private label solutions',
    },
    {
      icon: <CalendarCheck className="h-7 w-7" />,
      title: 'Event Planners',
      desc: 'Custom gifting solutions',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0B1D35] px-4 py-16 text-center sm:py-20">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Our Story</p>
        <h1 className="font-display text-5xl tracking-wide text-white sm:text-6xl">Your Trusted Partner</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#B8C8D8]">
          From Mumbai kitchens to premium snack shelves, Sequeira Foods is built on craft, quality, and care.
        </p>
      </div>

      <section className="bg-[#0B1D35] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl tracking-wide text-[#C9A84C] sm:text-5xl">{stat.number}</div>
                <div className="mt-1 text-sm text-[#B8C8D8]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Mission & Values</h2>
          <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-500">
            We believe in delivering excellence through quality, innovation, and customer satisfaction.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]/15 text-[#C9A84C]">
                  {item.icon}
                </div>
                <h3 className="font-sans text-sm font-bold text-[#0B1D35]">{item.title}</h3>
                <p className="mt-2 text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F9F9F7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Why Choose Us</h2>
          <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {whyChooseUs.map((reason) => (
              <div key={reason.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
                <h3 className="font-sans text-sm font-bold text-[#0B1D35]">{reason.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Our Story</h2>
          <div className="mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
          <p className="mt-6 text-base leading-relaxed text-gray-600">
            Sequeira Foods Pvt. Ltd. (est. 2024) is a premium gourmet brand dedicated to crafting unique,
            high-quality, and affordable delights. We specialize in handcrafted snack experiences, blending taste,
            health, and elegance in every bite.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            From corporate and festive hampers to personalized wedding and event gifts, we offer thoughtfully crafted
            solutions for every need, whether it is a small custom order or a large-scale bulk requirement.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            At Sequeira Foods, we believe quality should never be compromised. Our goal is to offer premium treats
            that are easy on the pocket and perfect for every celebration.
          </p>
        </div>
      </section>

      <section className="bg-[#F9F9F7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Trusted By</h2>
          <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
          <p className="mt-4 text-center text-sm text-gray-500">We are proud to serve a diverse range of customers.</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustedBy.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1D35]/8 text-[#0B1D35]">
                  {item.icon}
                </div>
                <h3 className="font-sans text-sm font-bold text-[#0B1D35]">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1D35] px-4 py-14 text-center sm:px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Work With Us</p>
        <h2 className="font-display text-3xl tracking-wide text-white sm:text-4xl">Let's Build Something Together</h2>
        <p className="mx-auto mt-3 max-w-lg text-[#B8C8D8]">
          Reach out for bulk orders, partnerships, or private labelling.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#1fa959]"
            onClick={() => {
              const phoneNumber = '+919930709557';
              const message = 'Hello! I would like to know more about Sequeira Foods and your products.';
              const encodedMessage = encodeURIComponent(message);
              const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10"
            onClick={() => window.open('tel:+919930709557', '_self')}
          >
            <Phone className="h-4 w-4" />
            Call Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
