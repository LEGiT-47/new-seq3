import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../lib/api';
import { Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderAPI.getMyOrders();
        setOrders(response.data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 text-[#F8F4EC] sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">View all your orders and their status</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">{error}</p>
                <Button
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping now!
                </p>
                <Button onClick={() => navigate('/products')}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                        <CardDescription>
                          {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(order.paymentStatus)}>
                        {order.paymentStatus?.toUpperCase() || 'PENDING'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Items
                      </h4>
                      <div className="space-y-2 bg-muted/30 rounded-lg p-4">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-start text-sm">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.productName}</p>
                                {item.selectedOptions && (
                                  <p className="text-xs text-muted-foreground">
                                    {Object.entries(item.selectedOptions)
                                      .filter(([, v]) => v)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(', ')}
                                  </p>
                                )}
                              </div>
                              <div className="text-right ml-2">
                                <p className="text-sm">Qty: {item.quantity}</p>
                                <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No items in this order</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.deliveryAddress && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Delivery Address</h4>
                        <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                          <p>{order.deliveryAddress.street}</p>
                          <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}</p>
                          <p className="mt-1">Phone: {order.deliveryAddress.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Order Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="font-semibold">Order Total:</span>
                      <span className="text-xl font-bold text-primary">₹{order.totalAmount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
