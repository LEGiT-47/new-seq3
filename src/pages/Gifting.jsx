import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { getProductsByCategory } from '../data/products';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Gifting = () => {
  const [serviceSelections, setServiceSelections] = useState({});
  const { addToCart } = useCart();

  const giftingSolutions = getProductsByCategory('gifting');
  const giftingServices = getProductsByCategory('services');

  const festivalOptions = {
    'Corporate Gifting': [
      'New Year',
      "Women's Day",
      'Financial Year Closing / New Financial Year',
      'Eid-ul-Fitr',
      'Raksha Bandhan',
      'Diwali',
      'Christmas & Year-End',
      'Corporate Awards / Annual Events',
      'Other',
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
      'Other',
    ],
    'Personalized Gifting': [
      "Valentine's Day",
      'Birthdays',
      'Work Anniversaries',
      'Raksha Bandhan',
      "Mother's Day",
      "Father's Day",
      'Naming Ceremony / Baptism / Naamkaran',
      'Christmas / New Year',
      'Other',
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
      'Other',
    ],
  };

  const handleServiceSelection = (serviceId, selectionType, value) => {
    setServiceSelections((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [selectionType]: value,
      },
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
    <div className="min-h-screen bg-white">
      <div className="bg-[#0B1D35] px-4 py-16 text-center sm:py-24">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Premium Gifting</p>
        <h1 className="font-display text-5xl tracking-wide text-white sm:text-6xl lg:text-7xl">Gift Something Real</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#B8C8D8]">
          Curated hampers for festive occasions, corporate gifting, and every celebration worth remembering.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            className="rounded-full bg-[#C9A84C] px-7 py-3 text-sm font-bold text-[#0B1D35] transition hover:bg-[#DAC06E]"
            onClick={() => document.getElementById('gifting-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Plan My Gift →
          </button>
          <a
            href="https://wa.me/919930709557?text=Hi, I'd like to enquire about gifting options"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-white/30 bg-white/10 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/20"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Choose Your Gifting Type</h2>
            <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: '🏢',
                title: 'Corporate Gifting',
                desc: 'Bulk orders for offices, events, and client appreciation.',
                colour: '#0B1D35',
              },
              {
                icon: '🪔',
                title: 'Festive Gifting',
                desc: 'Diwali, Christmas, Eid, and every celebration.',
                colour: '#C9A84C',
              },
              {
                icon: '🎨',
                title: 'Personalized Gifting',
                desc: 'Custom packaging and branding for your special touch.',
                colour: '#E8762A',
              },
              {
                icon: '💍',
                title: 'Event & Wedding',
                desc: 'Premium favours for weddings, anniversaries, and milestones.',
                colour: '#2D5016',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-soft transition-all duration-200 hover:-translate-y-2 hover:shadow-md"
              >
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                  style={{ background: `${item.colour}18`, border: `1.5px solid ${item.colour}30` }}
                >
                  {item.icon}
                </div>
                <h3 className="mb-2 font-sans text-base font-bold text-[#0B1D35]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gifting-form" className="bg-[#F9F9F7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl tracking-wide text-[#0B1D35] sm:text-4xl">Plan Your Gift</h2>
            <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-[#E8762A]" />
            <p className="mt-3 text-gray-500">Tell us what you need and we'll create the perfect hamper.</p>
          </div>

          <div className="space-y-5">
            {giftingServices.length > 0 ? (
              giftingServices.map((service) => (
                <div key={service.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                  <h3 className="mb-1 font-sans text-base font-bold text-[#0B1D35]">{service.name}</h3>
                  <p className="mb-4 text-sm text-gray-500">{service.description}</p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {festivalOptions[service.name] && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">
                          {service.name.includes('Festive') ? 'Select Festival' : 'Select Occasion'}
                        </label>
                        <Select
                          value={serviceSelections[service.id]?.festival || ''}
                          onValueChange={(value) => handleServiceSelection(service.id, 'festival', value)}
                        >
                          <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#0B1D35] focus:outline-none focus:ring-1 focus:ring-[#0B1D35]">
                            <SelectValue placeholder={`Choose a ${service.name.includes('Festive') ? 'festival' : 'occasion'}`} />
                          </SelectTrigger>
                            <SelectContent className="border border-gray-200 bg-white p-1 shadow-lg">
                            {festivalOptions[service.name]?.map((festival) => (
                              <SelectItem
                                key={festival}
                                value={festival}
                                  className="cursor-pointer rounded-md bg-white text-gray-700 outline-none transition-colors data-[highlighted]:bg-[#F7EED2] data-[highlighted]:text-[#0B1D35] data-[highlighted]:shadow-sm data-[state=checked]:bg-[#C9A84C]/15 data-[state=checked]:text-[#0B1D35] data-[state=checked]:font-semibold"
                              >
                                {festival}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {serviceSelections[service.id]?.festival === 'Other' && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">Please specify the occasion</label>
                        <input
                          type="text"
                          value={serviceSelections[service.id]?.otherOccasion || ''}
                          onChange={(e) => handleServiceSelection(service.id, 'otherOccasion', e.target.value)}
                          placeholder="Enter your occasion"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-[#0B1D35] focus:outline-none focus:ring-1 focus:ring-[#0B1D35]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-600">Select Pack</label>
                      <Select
                        value={serviceSelections[service.id]?.packType || ''}
                        onValueChange={(value) => handleServiceSelection(service.id, 'packType', value)}
                      >
                        <SelectTrigger className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#0B1D35] focus:outline-none focus:ring-1 focus:ring-[#0B1D35]">
                          <SelectValue placeholder="Choose a pack" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200 bg-white p-1 shadow-lg">
                          <SelectItem
                            value="all"
                            className="cursor-pointer rounded-md bg-white text-gray-700 outline-none transition-colors data-[highlighted]:bg-[#F7EED2] data-[highlighted]:text-[#0B1D35] data-[highlighted]:shadow-sm data-[state=checked]:bg-[#C9A84C]/15 data-[state=checked]:text-[#0B1D35] data-[state=checked]:font-semibold"
                          >
                            All Packs
                          </SelectItem>
                          {giftingSolutions.map((pack) => (
                            <SelectItem
                              key={pack.id}
                              value={pack.id.toString()}
                              className="cursor-pointer rounded-md bg-white text-gray-700 outline-none transition-colors data-[highlighted]:bg-[#F7EED2] data-[highlighted]:text-[#0B1D35] data-[highlighted]:shadow-sm data-[state=checked]:bg-[#C9A84C]/15 data-[state=checked]:text-[#0B1D35] data-[state=checked]:font-semibold"
                            >
                              {pack.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {serviceSelections[service.id]?.packType && serviceSelections[service.id]?.packType !== 'all' && (
                    <div className="mt-5 rounded-xl border border-gray-100 bg-[#F9F9F7] p-4">
                      {giftingSolutions
                        .filter((pack) => pack.id.toString() === serviceSelections[service.id].packType)
                        .map((pack) => (
                          <div key={pack.id}>
                            <h4 className="text-sm font-semibold text-[#0B1D35]">{pack.name}</h4>
                            <p className="mb-4 mt-1 text-sm text-gray-500">{pack.description}</p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                              <Button
                                size="sm"
                                className="flex-1 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E]"
                                onClick={() => handleBuyNow(pack)}
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Buy Now
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 rounded-full border-[#0B1D35] text-[#0B1D35] hover:bg-[#0B1D35] hover:text-white"
                                onClick={() => handleAddToCart(pack)}
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {serviceSelections[service.id]?.packType === 'all' && (
                    <div className="mt-5 rounded-xl border border-gray-100 bg-[#F9F9F7] p-4">
                      <p className="text-sm text-gray-500">Select a specific pack to view details and purchase options.</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center shadow-soft">
                <p className="text-sm text-gray-500">No specialized gifting services available right now.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1D35] px-4 py-14 text-center sm:px-6 lg:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Ready to order?</p>
        <h2 className="font-display text-3xl tracking-wide text-white sm:text-4xl">Let's Create Your Perfect Hamper</h2>
        <p className="mx-auto mt-3 max-w-lg text-[#B8C8D8]">
          Reach out on WhatsApp and we'll help you plan, package, and deliver.
        </p>
        <a
          href="https://wa.me/919930709557?text=Hi, I'd like to plan a gift hamper"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#1fa959]"
        >
          <MessageCircle className="h-4 w-4" />
          Get in Touch via WhatsApp
        </a>
      </section>
    </div>
  );
};

export default Gifting;
