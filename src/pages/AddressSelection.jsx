import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';
import { MapPin, Plus, Edit2, Check } from 'lucide-react';
import { toast } from 'sonner';

const AddressSelection = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, user, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      const userAddresses = response.data.data.addresses || [];
      setAddresses(userAddresses);

      // Auto-select first address or default address
      if (userAddresses.length > 0) {
        const defaultAddress = userAddresses.find(addr => addr.isDefault);
        setSelectedAddressId(defaultAddress?._id || userAddresses[0]._id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAddressForm = () => {
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all address fields');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/[^\d]/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (!validateAddressForm()) return;

    try {
      setLoading(true);
      await authAPI.addAddress(formData);
      toast.success('Address added successfully');
      setFormData({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
      });
      setShowNewAddressForm(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error(error.response?.data?.error || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error('Please select or add an address');
      return;
    }

    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
    // Pass selected address to checkout
    navigate('/checkout', { state: { selectedAddress } });
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-screen py-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Select Delivery Address</h1>
            <p className="text-muted-foreground">Choose where you want your order delivered</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Addresses List */}
            <div className="lg:col-span-2 space-y-4">
              {addresses.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                    <p className="text-muted-foreground mb-6">Add a delivery address to continue</p>
                  </CardContent>
                </Card>
              ) : (
                addresses.map((address) => (
                  <Card
                    key={address._id}
                    className={`cursor-pointer transition-all ${
                      selectedAddressId === address._id
                        ? 'border-primary border-2 bg-primary/5'
                        : 'hover:border-primary'
                    }`}
                    onClick={() => setSelectedAddressId(address._id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{address.name}</h3>
                            {address.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                            {selectedAddressId === address._id && (
                              <Badge className="text-xs bg-primary">
                                <Check className="h-3 w-3 mr-1" />
                                Selected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {address.street}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Phone: {address.phone}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddressId(address._id);
                            setFormData(address);
                            setShowNewAddressForm(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              {/* Add New Address Form */}
              {showNewAddressForm && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleAddressChange}
                            placeholder="Your name"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleAddressChange}
                            placeholder="10-digit number"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium block mb-1">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleAddressChange}
                          placeholder="House no, Building name"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          disabled={loading}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleAddressChange}
                            placeholder="City"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleAddressChange}
                            placeholder="State"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleAddressChange}
                            placeholder="6-digit"
                            maxLength="6"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={loading}
                        >
                          {editingAddressId ? 'Update Address' : 'Add Address'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowNewAddressForm(false);
                            setEditingAddressId(null);
                            setFormData({
                              name: '',
                              phone: '',
                              street: '',
                              city: '',
                              state: '',
                              pincode: ''
                            });
                          }}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Add New Address Button */}
              {!showNewAddressForm && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowNewAddressForm(true);
                    setEditingAddressId(null);
                    setFormData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      street: '',
                      city: '',
                      state: '',
                      pincode: ''
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAddressId && addresses.length > 0 ? (
                    (() => {
                      const selected = addresses.find(addr => addr._id === selectedAddressId);
                      return (
                        <>
                          <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                            <p className="font-semibold text-sm">{selected.name}</p>
                            <p className="text-xs text-muted-foreground">{selected.street}</p>
                            <p className="text-xs text-muted-foreground">
                              {selected.city}, {selected.state} {selected.pincode}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Phone: {selected.phone}
                            </p>
                          </div>
                          <Button
                            className="w-full"
                            onClick={handleContinue}
                            disabled={loading}
                          >
                            Continue to Payment
                          </Button>
                        </>
                      );
                    })()
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Select or add an address to continue
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;
