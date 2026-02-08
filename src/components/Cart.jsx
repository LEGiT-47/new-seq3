import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateCartItemOptions,
    removeFromCart,
    clearCart,
    getTotalItems,
    generateWhatsAppMessage
  } = useCart();

  const phoneNumber = '+919930709557';

  const handleBuyNow = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success('Redirecting to WhatsApp!');
    setIsCartOpen(false);
  };

  const handleRemoveItem = (cartItemId, productName) => {
    removeFromCart(cartItemId);
    toast.success(`${productName} removed from cart`);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {getTotalItems() > 0 && (
              <Badge variant="secondary">
                {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
            <Button onClick={() => setIsCartOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const hasCoatings = item.coatings && item.coatings.length > 0;
                  const hasFlavors = item.flavors && item.flavors.length > 0;

                  return (
                    <div key={item.cartItemId} className="flex flex-col space-y-2 p-4 rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                          <p className="text-sm font-medium mt-1 hidden">
                            ₹{item.price} each
                          </p>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.cartItemId, item.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Options Selectors */}
                      {(hasCoatings || hasFlavors) && (
                        <div className="space-y-2 pt-2 border-t border-border">
                          {hasCoatings && (
                            <div>
                              <label className="text-xs font-medium text-muted-foreground block mb-1">
                                Coating
                              </label>
                              <Select
                                value={item.selectedCoating || ''}
                                onValueChange={(value) =>
                                  updateCartItemOptions(item.cartItemId, {
                                    coating: value === '__none__' ? null : value
                                  })
                                }
                              >
                                <SelectTrigger className="h-8 text-xs w-full">
                                  <SelectValue placeholder="Select a coating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__">No coating</SelectItem>
                                  {item.coatings.map((coating) => (
                                    <SelectItem key={coating} value={coating}>
                                      {coating}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {hasFlavors && (
                            <div>
                              <label className="text-xs font-medium text-muted-foreground block mb-1">
                                Flavor
                              </label>
                              <Select
                                value={item.selectedFlavor || ''}
                                onValueChange={(value) =>
                                  updateCartItemOptions(item.cartItemId, {
                                    flavor: value === '__none__' ? null : value
                                  })
                                }
                              >
                                <SelectTrigger className="h-8 text-xs w-full">
                                  <SelectValue placeholder="Select a flavor" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__">No flavor</SelectItem>
                                  {item.flavors.map((flavor) => (
                                    <SelectItem key={flavor} value={flavor}>
                                      {flavor}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in cart
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </div>
              
              <Button
                onClick={handleBuyNow}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                size="lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Order via WhatsApp
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
