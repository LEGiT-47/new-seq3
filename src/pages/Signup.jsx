import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Mail, Phone, Lock, UserPlus, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  // Step tracking
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'details'
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  // Handle phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(value);
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.sendOTP({ phone: phoneNumber });
      
      if (response.data.success || response.status === 200) {
        toast.success('OTP sent to your phone');
        setStep('otp');
        // Start OTP timer (10 minutes)
        setOtpTimer(600);
        const interval = setInterval(() => {
          setOtpTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.verifyOTP({ phone: phoneNumber, otp });
      
      if (response.data.success || response.status === 200) {
        toast.success('Phone verified successfully');
        setStep('details');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address_')) {
      const addressField = name.replace('address_', '');
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate details form
  const validateDetailsForm = () => {
    if (!formData.name || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Step 3: Complete signup
  const handleCompleteSignup = async (e) => {
    e.preventDefault();

    if (!validateDetailsForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.signupComplete({
        phone: phoneNumber,
        name: formData.name,
        password: formData.password,
        email: formData.email || undefined,
        address: (formData.address.street || formData.address.city) ? {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode,
        } : undefined,
      });

      if (response.data.success || response.status === 201) {
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error completing signup:', error);
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (otpTimer > 0) {
      toast.error(`Please wait ${otpTimer} seconds before resending`);
      return;
    }

    try {
      setLoading(true);
      await authAPI.sendOTP({ phone: phoneNumber });
      toast.success('OTP resent to your phone');
      setOtpTimer(600);
      const interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up to get started with Sequeira Foods</CardDescription>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs">
            <div className={`flex items-center gap-1 ${step === 'phone' || step === 'otp' || step === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </div>
            <div className="h-1 w-4 bg-muted"></div>
            <div className={`flex items-center gap-1 ${step === 'otp' || step === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
              <CheckCircle className="h-4 w-4" />
              <span>Verify</span>
            </div>
            <div className="h-1 w-4 bg-muted"></div>
            <div className={`flex items-center gap-1 ${step === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
              <User className="h-4 w-4" />
              <span>Details</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Step 1: Phone Number */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    maxLength="10"
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">We'll send you a verification code</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={loading || phoneNumber.length < 10}
                size="lg"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-foreground">
                  Verification Code
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                    maxLength="6"
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg tracking-widest"
                    disabled={loading}
                  />
                </div>
              </div>

              {otpTimer > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Code expires in {formatTime(otpTimer)}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={loading || otp.length !== 6}
                size="lg"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <div className="text-center">
                {otpTimer > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Resend code in {formatTime(otpTimer)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-xs text-primary hover:underline"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setOtpTimer(0);
                }}
                className="w-full text-sm text-muted-foreground hover:underline"
              >
                Change phone number
              </button>
            </form>
          )}

          {/* Step 3: Complete Details */}
          {step === 'details' && (
            <form onSubmit={handleCompleteSignup} className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field (Optional) */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">At least 6 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Address Section (Optional) */}
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-3"
                >
                  <MapPin className="h-4 w-4" />
                  {showAddressForm ? 'Hide Address' : 'Add Address (Optional)'}
                </button>

                {showAddressForm && (
                  <div className="space-y-3 p-3 bg-muted/30 rounded-lg text-sm">
                    <div>
                      <label htmlFor="street" className="text-xs font-medium text-foreground block mb-1">
                        Street Address
                      </label>
                      <input
                        id="street"
                        name="address_street"
                        type="text"
                        placeholder="House no, Building name"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={loading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="city" className="text-xs font-medium text-foreground block mb-1">
                          City
                        </label>
                        <input
                          id="city"
                          name="address_city"
                          type="text"
                          placeholder="City"
                          value={formData.address.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="text-xs font-medium text-foreground block mb-1">
                          State
                        </label>
                        <input
                          id="state"
                          name="address_state"
                          type="text"
                          placeholder="State"
                          value={formData.address.state}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pincode" className="text-xs font-medium text-foreground block mb-1">
                        Pincode
                      </label>
                      <input
                        id="pincode"
                        name="address_pincode"
                        type="text"
                        placeholder="6-digit pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        maxLength="6"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white mt-6"
                disabled={loading}
                size="lg"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
