import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { cartItems, clearCart, getDeliveryItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState('address'); // address, confirmation, payment
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

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

    // Fetch Razorpay key
    paymentAPI.getRazorpayKey().then((res) => {
      setRazorpayKey(res.data.data.keyId);
    }).catch(() => {
      console.log('Razorpay key not configured yet');
    });
  }, [isAuthenticated, user, navigate, deliveryItems]);

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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all fields');
      return false;
    }
    if (!/^[0-9]{10,}$/.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      toast.error('Please enter a valid pincode');
      return false;
    }
    return true;
  };

  const handleCreateOrder = async () => {
    if (!validateForm()) return;

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
        deliveryAddress: formData,
      };

      const response = await orderAPI.create(orderData);
      setOrder(response.data.data.order || response.data.data);
      setStep('confirmation');
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
          name: formData.name,
          contact: formData.phone,
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
              {step === 'address' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                    <CardDescription>Enter where you want your order delivered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleAddressChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleAddressChange}
                          placeholder="10-digit number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleAddressChange}
                        placeholder="House no, Building name"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleAddressChange}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleAddressChange}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleAddressChange}
                          placeholder="6-digit"
                          maxLength="6"
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6"
                      onClick={handleCreateOrder}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 'confirmation' && order && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Confirmation</CardTitle>
                    <CardDescription>Review your order details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="font-semibold mb-3">Delivery Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.name}<br />
                        {formData.street}<br />
                        {formData.city}, {formData.state} {formData.pincode}<br />
                        Phone: {formData.phone}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Items</h3>
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

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        Your order will be delivered in 7-8 business days. You will receive updates via WhatsApp.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep('address')}
                      >
                        Edit Address
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handlePaymentInitiate}
                        disabled={loading || !razorpayKey}
                      >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {!razorpayKey ? 'Payment Not Available' : 'Proceed to Payment'}
                      </Button>
                    </div>
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
