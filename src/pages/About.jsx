import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Quote, CheckCircle2 } from 'lucide-react';

const milestones = [
  { year: '2020', text: 'Small-batch premium snacks launched for local customers in Mumbai.' },
  { year: '2022', text: 'Expanded flavour R&D and introduced custom gifting programs.' },
  { year: '2024', text: 'Sequeira Foods Pvt. Ltd. established with premium positioning.' },
  { year: '2026', text: 'Hero product lineup introduced with online-first delivery model.' },
];

const promise = [
  { title: 'Quality', text: 'Ingredient-first sourcing with strict QC checks.' },
  { title: 'Freshness', text: 'Small-batch processing and controlled packaging.' },
  { title: 'Trust', text: 'Transparent ordering flow and responsive support.' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <section className="text-center">
          <Badge className="mb-4 bg-[#E8762A] text-white">About Sequeira Foods</Badge>
          <h1 className="font-display text-4xl font-bold text-[#1A0A00] sm:text-5xl">Born in Mumbai, Crafted for Real Snack Lovers</h1>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
            We build premium dry fruit and snack experiences that feel modern, flavourful, and trust-driven for every home and every gifting moment.
          </p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h2 className="font-display text-3xl font-bold text-[#1A0A00]">Brand Journey</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {milestones.map((item) => (
              <div key={item.year} className="rounded-2xl bg-muted p-4">
                <p className="text-sm font-bold text-[#E8762A]">{item.year}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border-border/80 shadow-soft">
            <CardContent className="p-8">
              <div className="mb-4 inline-flex rounded-full bg-[#E8762A]/15 p-3 text-[#E8762A]">
                <Quote className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A0A00]">Founder's Note</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                We started Sequeira Foods with one intent: create snacks that people love instantly and trust repeatedly. Every flavour and every pack should feel premium, honest, and memorable.
              </p>
              <p className="mt-4 text-sm font-semibold text-[#2D5016]">- Founder, Sequeira Foods</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/80 shadow-soft">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-[#1A0A00]">Our Promise</h3>
              <div className="mt-4 space-y-3">
                {promise.map((item) => (
                  <div key={item.title} className="rounded-xl bg-muted p-3">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A0A00]"><CheckCircle2 className="h-4 w-4 text-[#2D5016]" />{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
