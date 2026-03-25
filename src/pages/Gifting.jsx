import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { MessageCircle, Gift, Building2, Sparkles } from 'lucide-react';

const giftingTiers = [
  {
    id: 'starter',
    title: 'Starter Hamper',
    priceRange: 'Rs. 999 - Rs. 1,499',
    includes: 'Best for personal gifting with premium snack essentials and festive wrap.',
    icon: <Gift className="h-6 w-6" />,
  },
  {
    id: 'premium',
    title: 'Premium Hamper',
    priceRange: 'Rs. 1,500 - Rs. 2,499',
    includes: 'Luxury hamper with curated flavour assortments and elegant box styling.',
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    id: 'corporate',
    title: 'Corporate Gifting',
    priceRange: 'Rs. 2,500+',
    includes: 'High-volume packs with branding, custom inserts, and delivery coordination.',
    icon: <Building2 className="h-6 w-6" />,
  },
];

const openWhatsApp = (message) => {
  const phone = '919930709557';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

const Gifting = () => {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-primary px-6 py-14 text-white shadow-medium sm:px-10">
          <p className="text-sm uppercase tracking-[0.18em] text-white/80">Sequeira Foods Gifting</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">The Gift That Always Hits Right</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Premium snack hampers for festive moments, weddings, and corporate appreciation programs.
          </p>
          <Button className="mt-6 bg-[#25D366] hover:bg-[#1fa959]" onClick={() => openWhatsApp('Hi Sequeira Foods! I want to explore gifting options for an upcoming event.') }>
            <MessageCircle className="mr-2 h-4 w-4" />
            Enquire on WhatsApp
          </Button>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {giftingTiers.map((tier) => (
            <Card key={tier.id} className="rounded-2xl border-border/80 shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-full bg-[#E8762A]/15 p-3 text-[#E8762A]">{tier.icon}</div>
                <h2 className="text-2xl font-bold text-[#1A0A00]">{tier.title}</h2>
                <p className="mt-2 text-sm font-semibold text-[#2D5016]">{tier.priceRange}</p>
                <p className="mt-3 text-sm text-muted-foreground">{tier.includes}</p>
                <Button
                  className="mt-6 w-full bg-[#25D366] hover:bg-[#1fa959]"
                  onClick={() => openWhatsApp(`Hi Sequeira Foods! I am interested in the ${tier.title}. Please share options.`)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enquire
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 grid grid-cols-1 gap-8 rounded-3xl border border-border bg-card p-8 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-3xl font-bold text-[#1A0A00]">Personalisation That Feels Premium</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Custom labels with names, wishes, and festival messaging.</li>
              <li>Brand-packaging support for corporate gifting campaigns.</li>
              <li>Choice of flavour themes and gift card inserts.</li>
              <li>Pan-India dispatch planning for team gifting.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-muted p-6">
            <h4 className="text-xl font-bold text-[#1A0A00]">Bulk and Corporate Enquiry</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Share your event timeline, headcount, and budget. Our team will propose a curated gifting plan.
            </p>
            <Button
              className="mt-5 w-full bg-[#2D5016] hover:bg-[#243f12]"
              onClick={() =>
                openWhatsApp('Hi Sequeira Foods! I need a corporate gifting proposal with customized packaging and branding.')
              }
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Bulk Enquiry
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Gifting;
