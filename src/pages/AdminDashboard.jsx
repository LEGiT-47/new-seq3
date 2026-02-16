import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { adminAuthAPI, adminOrderAPI } from '../lib/api';
import { toast } from 'sonner';
import { LogOut, TrendingUp, Package, DollarSign, Clock, CheckCircle, Loader2, Search, X } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    loadDashboardData();
  }, [adminToken, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Verify token
      await adminAuthAPI.verifyToken();

      // Load analytics
      const analyticsRes = await adminOrderAPI.getDashboardAnalytics();
      setAnalytics(analyticsRes.data.data);

      // Load orders
      const ordersRes = await adminOrderAPI.getAll({ limit: 100 });
      setOrders(ordersRes.data.data.orders || []);
      setFilteredOrders(ordersRes.data.data.orders || []);
    } catch (error) {
      console.error('Dashboard load error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/admin/login');
      } else {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const handleFilterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.deliveryStatus === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter((order) => order.paymentStatus === paymentFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerDetails.phone.includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    handleFilterOrders();
  }, [statusFilter, paymentFilter, searchTerm, orders]);

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminOrderAPI.updateStatus(orderId, { deliveryStatus: newStatus });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
        )
      );

      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleViewDetails = async (orderId) => {
    setModalLoading(true);
    try {
      const response = await adminOrderAPI.getById(orderId);
      setSelectedOrder(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {admin?.username}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.summary.totalOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{analytics.summary.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">From paid orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Paid Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.summary.paidOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">Payment completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.summary.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Section */}
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <TabsList className="grid w-auto grid-cols-3">
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending">Pending Delivery</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                </TabsList>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by order #, customer name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Delivery Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4 mt-4">
              <OrdersList
                orders={filteredOrders}
                onStatusChange={handleOrderStatusUpdate}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-4">
              <OrdersList
                orders={filteredOrders.filter((o) => o.deliveryStatus === 'pending')}
                onStatusChange={handleOrderStatusUpdate}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="shipped" className="space-y-4 mt-4">
              <OrdersList
                orders={filteredOrders.filter((o) => o.deliveryStatus === 'shipped')}
                onStatusChange={handleOrderStatusUpdate}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background border-b">
              <CardTitle>Order Details</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {modalLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : selectedOrder ? (
                <>
                  {/* Order Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{selectedOrder.order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedOrder.order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={selectedOrder.order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {selectedOrder.order.paymentStatus}
                      </Badge>
                      <Badge variant="outline">
                        {selectedOrder.order.deliveryStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h4 className="font-semibold mb-3">Customer Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Name</p>
                        <p className="font-medium">{selectedOrder.order.customerDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Email</p>
                        <p className="font-medium">{selectedOrder.order.customerDetails.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Phone</p>
                        <p className="font-medium">{selectedOrder.order.customerDetails.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h4 className="font-semibold mb-3">Delivery Address</h4>
                    <div className="text-sm bg-muted/50 rounded-lg p-3 space-y-1">
                      <p className="font-medium">{selectedOrder.order.deliveryAddress.name}</p>
                      <p>{selectedOrder.order.deliveryAddress.street}</p>
                      <p>{selectedOrder.order.deliveryAddress.city}, {selectedOrder.order.deliveryAddress.state} {selectedOrder.order.deliveryAddress.pincode}</p>
                      <p>Phone: {selectedOrder.order.deliveryAddress.phone}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-3">Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start text-sm border-b pb-3">
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {Object.entries(item.selectedOptions)
                                  .filter(([, v]) => v)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-2">
                            <p>Qty: {item.quantity}</p>
                            <p className="font-medium">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h4 className="font-semibold mb-3">Payment Information</h4>
                    <div className="space-y-2 text-sm bg-muted/50 rounded-lg p-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>₹{selectedOrder.order.totalAmount}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total Amount:</span>
                        <span>₹{selectedOrder.order.totalAmount}</span>
                      </div>
                      {selectedOrder.order.paymentMethod && (
                        <div className="flex justify-between text-xs pt-2">
                          <span className="text-muted-foreground">Payment Method:</span>
                          <span>{selectedOrder.order.paymentMethod}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Transactions */}
                  {selectedOrder.paymentTransactions && selectedOrder.paymentTransactions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Payment Transactions</h4>
                      <div className="space-y-2">
                        {selectedOrder.paymentTransactions.map((tx, index) => (
                          <div key={index} className="text-sm bg-muted/50 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium capitalize">{tx.status}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(tx.createdAt).toLocaleDateString('en-IN')} - Attempt #{tx.attemptNumber}
                              </p>
                            </div>
                            <Badge variant={tx.status === 'success' ? 'default' : 'secondary'}>
                              ₹{tx.amount}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Notes */}
                  {selectedOrder.order.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                        {selectedOrder.order.notes}
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Orders List Component
const OrdersList = ({ orders, onStatusChange, onViewDetails }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Order #</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Payment</th>
              <th className="px-4 py-3 text-left font-semibold">Delivery</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-semibold">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{order.customerDetails.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customerDetails.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">₹{order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={order.deliveryStatus}
                      onValueChange={(value) => onStatusChange(order._id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(order._id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
