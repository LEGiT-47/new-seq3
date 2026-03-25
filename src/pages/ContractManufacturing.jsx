import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { MessageCircle, Package, SlidersHorizontal, Factory, Building2 } from 'lucide-react';

const offerings = [
  {
    title: 'Flavour Customisation',
    text: 'Tailor blends, seasoning notes, and crunch profile for your target market.',
    icon: <SlidersHorizontal className="h-5 w-5" />,
  },
  {
    title: 'Packaging Development',
    text: 'Pouch, jar, box, and gift-ready formats with compliant labelling support.',
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: 'MOQ and Scale Planning',
    text: 'Flexible production runs for pilot launches and larger national rollouts.',
    icon: <Factory className="h-5 w-5" />,
  },
  {
    title: 'Private Label Ready',
    text: 'End-to-end execution from formulation to dispatch under your brand.',
    icon: <Building2 className="h-5 w-5" />,
  },
];

const stats = [
  { value: '250+ Tons', label: 'Annual processing capacity' },
  { value: '40+ Brands', label: 'Private label collaborations' },
  { value: '15+ Years', label: 'Category expertise' },
];

const openWhatsApp = () => {
  const phone = '919930709557';
  const message = 'Hi Sequeira Foods! I am interested in contract manufacturing/private label support. Please share MOQ and process.';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

const ContractManufacturing = () => {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-primary px-6 py-14 text-white shadow-medium sm:px-10">
          <p className="text-sm uppercase tracking-[0.18em] text-white/80">B2B Manufacturing</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Scale Premium Snacks Under Your Brand</h1>
          <p className="mt-3 max-w-3xl text-white/90">
            Strong production backbone, quality-first process, and private-label execution for modern snack brands.
          </p>
          <Button className="mt-6 bg-[#25D366] hover:bg-[#1fa959]" onClick={openWhatsApp}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Discuss Your Requirement
          </Button>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {offerings.map((item) => (
            <Card key={item.title} className="rounded-2xl border-border/80 shadow-soft">
              <CardContent className="p-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A0A00]">
                  <span className="rounded-full bg-[#E8762A]/15 p-2 text-[#E8762A]">{item.icon}</span>
                  {item.title}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-[#1A0A00]">Trust Metrics</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-muted p-4">
                <p className="text-2xl font-bold text-[#E8762A]">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContractManufacturing;
