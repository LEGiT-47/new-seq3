import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

const FestivePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds on every page load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleShopNow = () => {
    setIsOpen(false);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto bg-gradient-primary text-primary-foreground border-0">
        <DialogTitle className="sr-only">Christmas and New Year Special</DialogTitle>
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Gift className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Christmas & New Year Special!</h2>
            <p className="text-lg opacity-90">Save 20% This Season</p>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-sm opacity-80">Premium nuts, dry fruits & chocolates</p>
            <p className="text-sm opacity-80">Perfect for gifting & celebrations</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleShopNow}
              variant="secondary"
              className="w-full font-medium"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FestivePopup;
