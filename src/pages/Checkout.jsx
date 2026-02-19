import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../lib/api';
import { toast } from 'sonner';
import { Loader2, Lock, Check } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart, getDeliveryItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState('confirmation'); // confirmation, payment
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const [order, setOrder] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState(null);

  // Get only delivery items
  const deliveryItems = getDeliveryItems();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to continue with checkout');
      navigate('/login');
      return;
    }

    if (deliveryItems.length === 0) {
      toast.error('No delivery items in cart');
      navigate('/products');
      return;
    }

    // Get selected address from location state
    if (location.state?.selectedAddress) {
      setSelectedAddress(location.state.selectedAddress);
    } else {
      // If no address was passed, go back to address selection
      navigate('/select-address');
      return;
    }

    // Fetch Razorpay key
    paymentAPI.getRazorpayKey().then((res) => {
      setRazorpayKey(res.data.data.keyId);
    }).catch(() => {
      console.log('Razorpay key not configured yet');
    });
  }, [isAuthenticated, user, navigate, deliveryItems, location]);

  if (!isAuthenticated || deliveryItems.length === 0) {
    return (
      <div className="min-h-screen py-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Delivery Items in Cart</CardTitle>
            <CardDescription>Add delivery items to proceed with checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAmount = deliveryItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      toast.error('No address selected');
      navigate('/select-address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: deliveryItems.map((item) => ({
          productId: item.id || item.productId,
          quantity: item.quantity,
          selectedOptions: {
            coating: item.selectedCoating,
            flavor: item.selectedFlavor
          },
        })),
        deliveryAddress: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        },
      };

      const response = await orderAPI.create(orderData);
      setOrder(response.data.data.order || response.data.data);
      toast.success('Order created successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create order');
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentInitiate = async () => {
    if (!order) return;

    setLoading(true);
    try {
      const response = await orderAPI.initiatePayment(order.id);
      const { razorpayOrderId, amount, keyId } = response.data.data;

      // Initialize Razorpay
      if (typeof window.Razorpay === 'undefined') {
        toast.error('Payment gateway not available. Please try again later.');
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        name: 'Sequeira Foods',
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyResponse = await orderAPI.verifyPayment({
              razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order.id,
            });

            toast.success('Payment successful!');
            clearCart();
            setStep('success');
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: selectedAddress?.name || user?.name || '',
          contact: selectedAddress?.phone || user?.phone || '',
        },
        theme: {
          color: '#0066cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to initiate payment');
      console.error('Payment initiation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2">
              {step === 'confirmation' && !order && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your order details before payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-semibold mb-3">Delivery Address</h3>
                      {selectedAddress ? (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="font-medium text-foreground">{selectedAddress.name}</p>
                          <p>{selectedAddress.street}</p>
                          <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                          <p>Phone: {selectedAddress.phone}</p>
                          <button
                            onClick={() => navigate('/select-address')}
                            className="text-primary hover:underline text-xs mt-2"
                          >
                            Change Address
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Items</h3>
                      <div className="space-y-2">
                        {deliveryItems.map((item) => (
                          <div key={item.cartItemId || item.id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span className="text-lg">₹{totalAmount}</span>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        Your order will be delivered in 7-8 business days. You will receive updates via WhatsApp.
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleCreateOrder}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Proceed to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 'confirmation' && order && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ready for Payment</CardTitle>
                    <CardDescription>Complete your payment to confirm the order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-semibold mb-3">Delivery Address</h3>
                      <p className="text-sm text-muted-foreground space-y-1">
                        <div className="font-medium text-foreground">{selectedAddress.name}</div>
                        <div>{selectedAddress.street}</div>
                        <div>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</div>
                        <div>Phone: {selectedAddress.phone}</div>
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span>{item.productName} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span className="text-lg">₹{order.totalAmount}</span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handlePaymentInitiate}
                      disabled={loading || !razorpayKey}
                      size="lg"
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {!razorpayKey ? 'Payment Not Available' : 'Pay Now'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 'success' && (
                <Card className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <CardTitle>Order Placed Successfully!</CardTitle>
                    <CardDescription>
                      Your order has been confirmed and payment is complete.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-left bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                      <p className="font-semibold">{order?.orderNumber}</p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      You will receive delivery updates on your WhatsApp number shortly.
                    </p>

                    <Button className="w-full" onClick={() => navigate('/products')}>
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {deliveryItems.map((item) => (
                      <div key={item.cartItemId || item.id} className="flex justify-between text-sm">
                        <span className="flex-1 text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total</span>
                      <span className="text-lg">₹{totalAmount}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Lock className="h-3 w-3" />
                      Secure Payment
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
