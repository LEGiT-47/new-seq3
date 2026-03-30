import React from 'react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, ShoppingBag, MessageCircle, Truck, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateCartItemOptions,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    generateWhatsAppMessage,
    getDeliveryItems,
    getWhatsAppItems
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const phoneNumber = '+919930709557';

  const deliveryItems = getDeliveryItems();
  const whatsappItems = getWhatsAppItems();

  const deliveryTotal = deliveryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const whatsappTotal = whatsappItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleBuyNowDelivery = () => {
    if (deliveryItems.length === 0) {
      toast.error('No delivery items in cart!');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to proceed with delivery');
      setIsCartOpen(false);
      navigate('/login');
      return;
    }

    // Redirect to address selection page for delivery items
    setIsCartOpen(false);
    navigate('/select-address');
  };

  const handleBuyNowWhatsApp = () => {
    if (whatsappItems.length === 0) {
      toast.error('No items to order via WhatsApp!');
      return;
    }

    const message = generateWhatsAppMessage(whatsappItems);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success('Redirecting to WhatsApp!');
    setIsCartOpen(false);
  };

  const handleRemoveItem = (cartItemId, productName) => {
    removeFromCart(cartItemId);
    toast.success(`${productName} removed from cart`);
  };

  const renderCartItems = (items, itemType) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No {itemType} items in cart</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => {
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
                  <p className="text-sm font-bold mt-1">₹{item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        if (item.quantity <= 1) {
                          removeFromCart(item.cartItemId);
                        } else {
                          updateQuantity(item.cartItemId, item.quantity - 1);
                        }
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
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
                <div className="space-y-3 pt-2.5 border-t border-border">
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
                        <SelectContent sideOffset={6} className="z-[1200]">
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
                        <SelectContent sideOffset={6} className="z-[1200]">
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
    );
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
              {/* Delivery Items Section */}
              {(deliveryItems.length > 0 || whatsappItems.length > 0) && (
                <>
                  {deliveryItems.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Truck className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-sm">Delivery Items</h3>
                        <Badge variant="outline" className="ml-auto">
                          {deliveryItems.length}
                        </Badge>
                      </div>
                      {renderCartItems(deliveryItems, 'delivery')}
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">Delivery Total:</span>
                          <span className="text-lg font-bold">₹{deliveryTotal}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {whatsappItems.length > 0 && deliveryItems.length > 0 && (
                    <Separator className="my-6" />
                  )}

                  {/* WhatsApp Items Section */}
                  {whatsappItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-sm">WhatsApp Order Items</h3>
                        <Badge variant="outline" className="ml-auto">
                          {whatsappItems.length}
                        </Badge>
                      </div>
                      {renderCartItems(whatsappItems, 'whatsapp')}
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">WhatsApp Total:</span>
                          <span className="text-lg font-bold">₹{whatsappTotal}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </ScrollArea>

            {/* Action Buttons */}
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

              {/* Show total price */}
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Grand Total:</span>
                  <span className="text-xl font-bold text-primary">₹{deliveryTotal + whatsappTotal}</span>
                </div>
              </div>

              {/* Action buttons based on items */}
              {deliveryItems.length > 0 && whatsappItems.length > 0 ? (
                // Both sections have items - show both buttons
                <div className="space-y-2">
                  <Button
                    onClick={handleBuyNowDelivery}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Buy Delivery Items
                  </Button>
                  <Button
                    onClick={handleBuyNowWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                    size="lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Order via WhatsApp
                  </Button>
                </div>
              ) : deliveryItems.length > 0 ? (
                // Only delivery items
                <Button
                  onClick={handleBuyNowDelivery}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              ) : (
                // Only WhatsApp items
                <Button
                  onClick={handleBuyNowWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Order via WhatsApp
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
