import React from 'react';
import { Award, ShieldCheck, Cpu, Handshake, MessageCircle, Phone, Mail } from 'lucide-react';

const ContractManufacturing = () => {
  const trustItems = [
    {
      icon: <Award className="h-7 w-7" />,
      title: '15+ Years Experience',
      desc: 'Proven track record in manufacturing and private labelling',
    },
    {
      icon: <ShieldCheck className="h-7 w-7" />,
      title: 'Quality Assured',
      desc: 'Stringent quality control at every step of production',
    },
    {
      icon: <Cpu className="h-7 w-7" />,
      title: 'Modern Facilities',
      desc: 'State-of-the-art infrastructure and equipment',
    },
    {
      icon: <Handshake className="h-7 w-7" />,
      title: 'Flexible Terms',
      desc: 'Customized solutions for your specific requirements',
    },
  ];

  const handleWhatsAppContact = () => {
    const phoneNumber = '+919930709557';
    const message =
      'Hello! I am interested in contract manufacturing and private labelling services. Please provide details about capabilities and pricing.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+919930709557', '_self');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0B1D35] px-4 py-16 text-center sm:py-20">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">B2B Partnership</p>
        <h1 className="font-display text-5xl tracking-wide text-white sm:text-6xl">Contract Manufacturing</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#B8C8D8]">
          Custom production, private labelling, and bulk supply built around your business needs.
        </p>
      </div>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Your Production Partner</h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
              <p className="mt-5 text-base leading-relaxed text-gray-600">
                Many companies have a strong marketing and distribution network but prefer not to manage their own
                production facilities or are looking for additional processing capacities for nuts. If that is the
                case, our company is the ideal partner to collaborate with, whether to process your existing product
                range or to develop new products on an exclusive basis.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                With our robust infrastructure, sound financial strength, dedicated R&D capabilities, and a highly
                qualified technical team, you can confidently focus on expanding your marketing and distribution
                efforts while we handle production excellence.
              </p>
            </div>
            <div className="rounded-3xl bg-[#F9F9F7] p-8">
              <h3 className="mb-5 font-sans text-base font-bold text-[#0B1D35]">What We Offer</h3>
              {[
                'Custom flavour development',
                'Private label packaging',
                'Flexible MOQ for startups',
                'Bulk supply for large orders',
                'Quality assured at every step',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-gray-100 py-2.5 last:border-0">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-[#C9A84C]" />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Why Companies Trust Us</h2>
          <div className="mx-auto mb-8 mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A84C]/10 text-[#C9A84C]">
                  {item.icon}
                </div>
                <h3 className="font-sans text-sm font-bold text-[#0B1D35]">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F9F9F7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Get In Touch</h2>
          <div className="mx-auto mb-6 mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
          <p className="mb-8 text-gray-500">Ready to start a conversation? Reach us directly.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#1fa959]"
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0B1D35] bg-transparent px-6 py-3 text-sm font-bold text-[#0B1D35] transition hover:bg-[#0B1D35] hover:text-white"
              onClick={handleCall}
            >
              <Phone className="h-4 w-4" />
              Call Now
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-transparent px-6 py-3 text-sm font-bold text-gray-600 transition hover:border-[#0B1D35]"
              onClick={() => window.open('mailto:sequeirafoods@gmail.com')}
            >
              <Mail className="h-4 w-4" />
              Email Us
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500">+91 99307 09557 | sequeirafoods@gmail.com</p>
        </div>
      </section>
    </div>
  );
};

export default ContractManufacturing;
