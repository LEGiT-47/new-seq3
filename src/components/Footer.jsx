import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Gifting', path: '/gifting' },
    { label: 'Contract Manufacturing', path: '/contract-manufacturing' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const productCategories = [
    { label: 'Chocolates', path: '/products/chocolates' },
    { label: 'Flavoured Nuts', path: '/products/nuts' },
    { label: 'Jaggery Coated', path: '/products/jaggery' },
    { label: 'Dry Fruits', path: '/products/dryfruits' },
    { label: 'Seeds', path: '/products/seeds' },
  ];

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Phone',
      value: '+91 9930709557',
      action: 'tel:+919930709557'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: 'sequeirafoods@gmail.com',
      action: 'mailto:sequeirafoods@gmail.com'
    },
    {
      icon: <MapPin className="h-12 w-12" />,
      label: 'Location',
      value: 'Office no 15, 1st Floor, Saidham Shopping Plaza, P.K Road, Mulund West, Mumbai, 400080'
    }
  ];

  const handleWhatsApp = () => {
    const phoneNumber = '+919930709557';
    const message = 'Hello! I would like to get more information about Sequeira Foods.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-secondary text-secondary-foreground mt-0">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary-glow mb-2">
                Sequeira Foods
              </h2>
              <p className="text-sm opacity-90">
                At Sequeira Foods, we take pride in offering an exquisite selection of premium chocolates, flavored nuts, jaggery-coated delights, and the finest dry fruits. Our unwavering commitment to quality and craftsmanship ensures that every product delivers exceptional taste, freshness, and indulgence, making Sequeira Foods a trusted name in premium gourmet treats.
              </p>
            </div>
            
            {/* Social Links intentionally left out here — moved to bottom footer */}

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-glow">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-glow">Categories</h3>
            <ul className="space-y-2">
              {productCategories.map((category) => (
                <li key={category.label}>
                  <Link 
                    to={category.path}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-glow">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((info) => (
                <li key={info.label}>
                  <a 
                    href={info.action || '#'}
                    className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                  >
                    {info.icon}
                    <span>{info.value}</span>
                  </a>
                </li>
              ))}
            </ul>
            
            {/* WhatsApp CTA */}
            <Button 
              onClick={handleWhatsApp}
              className="w-full mt-4 bg-[#25D366] hover:bg-[#128C7E] text-white"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-75">
          <p>
            &copy; {currentYear} Sequeira Foods. All rights reserved.
          </p>
          
          <div className="text-white-400">
            Designed and crafted by Vernon Rodrigues and Viraj Prabhu.
          </div>
          {/* Instagram images & links (left side, below "Designed and crafted by") */}
          <div className="w-full sm:w-auto">
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-row sm:items-center sm:gap-4">
              <a
                href="https://www.instagram.com/v_rodriguez_10"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vernon Rodrigues on Instagram"
                className="flex flex-col items-center sm:flex-row sm:items-center text-white-300 hover:text-blue-500 transition-colors"
              >
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/5 border border-gray-600">
                  <Instagram className="text-pink-400" size={20} />
                </div>
                <span className="text-sm mt-2 sm:mt-0 sm:ml-3">Vernon Rodrigues</span>
              </a>

              <a
                href="https://instagram.com/viraj_p_47"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Viraj Prabhu on Instagram"
                className="flex flex-col items-center sm:flex-row sm:items-center text-white-300 hover:text-blue-500 transition-colors"
              >
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/5 border border-gray-600">
                  <Instagram className="text-pink-400" size={20} />
                </div>
                <span className="text-sm mt-2 sm:mt-0 sm:ml-3">Viraj Prabhu</span>
              </a>

              <a
                href="https://www.linkedin.com/in/vernon-rodrigues-20393a2b8/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vernon Rodrigues on LinkedIn"
                className="flex flex-col items-center sm:flex-row sm:items-center text-white-300 hover:text-blue-500 transition-colors"
              >
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/5 border border-gray-600">
                  <Linkedin className="text-blue-500" size={20} />
                </div>
                <span className="text-sm mt-2 sm:mt-0 sm:ml-3">Vernon Rodrigues</span>
              </a>

              <a
                href="https://linkedin.com/in/viraj-prabhu-281597305/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Viraj Prabhu on LinkedIn"
                className="flex flex-col items-center sm:flex-row sm:items-center text-white-300 hover:text-blue-500 transition-colors"
              >
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/5 border border-gray-600">
                  <Linkedin className="text-blue-500" size={20} />
                </div>
                <span className="text-sm mt-2 sm:mt-0 sm:ml-3">Viraj Prabhu</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
