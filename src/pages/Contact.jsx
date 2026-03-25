import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const reasons = ['General', 'Bulk Order', 'Gifting', 'Contract Manufacturing'];

const Contact = () => {
  const [reason, setReason] = useState('General');
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  const openWhatsApp = (message) => {
    const phone = '919930709557';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill name, phone and message.');
      return;
    }

    openWhatsApp(
      `Hi Sequeira Foods! Contact reason: ${reason}. Name: ${form.name}. Phone: ${form.phone}. Email: ${form.email || 'N/A'}. Message: ${form.message}`
    );
    toast.success('Opening WhatsApp...');
  };

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-primary px-6 py-12 text-white shadow-medium sm:px-10">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Contact Sequeira Foods</h1>
          <p className="mt-3 max-w-2xl text-white/90">Quick support for product enquiries, gifting, bulk orders, and B2B partnerships.</p>
          <Button className="mt-6 bg-[#25D366] hover:bg-[#1fa959]" onClick={() => openWhatsApp('Hi Sequeira Foods! I want to connect with your team.') }>
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp Quick Contact
          </Button>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border-border/80 shadow-soft">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-bold text-[#1A0A00]">Send Enquiry</h2>

              <div className="flex flex-wrap gap-2">
                {reasons.map((item) => (
                  <button
                    key={item}
                    className={`rounded-full px-3 py-1 text-sm ${reason === item ? 'bg-[#E8762A] text-white' : 'bg-muted text-muted-foreground'}`}
                    onClick={() => setReason(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <form className="space-y-3" onSubmit={submit}>
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea rows={4} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
                </div>
                <Button className="w-full bg-[#E8762A] hover:bg-[#d76b20]">Send on WhatsApp</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/80 shadow-soft">
            <CardContent className="space-y-5 p-6">
              <h2 className="text-2xl font-bold text-[#1A0A00]">Visit or Reach Us</h2>
              <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-2 font-semibold text-[#1A0A00]"><MapPin className="h-4 w-4 text-[#2D5016]" />Location</p>
                <p className="mt-2">Office no 15, 1st Floor, Saidham Shopping Plaza, P.K Road, Mulund West, Mumbai 400080</p>
                <a className="mt-3 inline-block text-[#E8762A]" href="https://www.google.com/maps?q=19.16661319088578,72.94391888725637" target="_blank" rel="noreferrer">Open in Maps</a>
              </div>
              <p className="inline-flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-[#2D5016]" />+91 99307 09557</p>
              <p className="inline-flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-[#2D5016]" />sequeirafoods@gmail.com</p>
              <Button variant="outline" className="w-full" onClick={() => openWhatsApp('Hi Sequeira Foods! I need quick assistance.') }>
                <MessageCircle className="mr-2 h-4 w-4" />
                Start WhatsApp Chat
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Contact;
