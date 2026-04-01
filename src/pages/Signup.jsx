import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Mail, Phone, Lock, UserPlus, MapPin, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';
import { toast } from 'sonner';

const Signup = () => { 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  
  // Step tracking: 'signup-form' | 'verification' | 'address'
  const [step, setStep] = useState('signup-form');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+91',
    verificationToken: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  // Check if we have a verification token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (token && email) {
      setFormData(prev => ({
        ...prev,
        email,
        verificationToken: token
      }));
      setStep('verification');
    }
  }, [searchParams]);

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
    } else if (name === 'phone') {
      const cleanedValue = value.replace(/[^\d]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate signup form
  const validateSignupForm = () => {
    if (!formData.email || !formData.name || !formData.password || !formData.phone) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
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

    if (formData.email.includes(formData.phone) || formData.phone.includes(formData.email.split('@')[0])) {
      toast.error('Email and phone must be different');
      return false;
    }

    return true;
  };

  // Step 1: Send verification email
  const handleSendVerificationEmail = async (e) => {
    e.preventDefault();

    if (!validateSignupForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.sendVerificationEmail({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phone: formData.phone,
        countryCode: formData.countryCode
      });

      if (response.data.success || response.status === 200) {
        toast.success('Verification email sent! Check your inbox.');
        setStep('verification');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      if (error.response?.status === 409) {
        toast.error(error.response?.data?.message || 'Email or phone already registered');
      } else {
        toast.error(error.response?.data?.message || 'Failed to send verification email');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify email
  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!formData.verificationToken) {
      toast.error('Please enter verification token');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.verifyEmail({
        email: formData.email,
        token: formData.verificationToken
      });

      if (response.data.success || response.status === 200) {
        toast.success('Email verified successfully!');
        setStep('address');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      toast.error(error.response?.data?.message || 'Invalid verification token');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete signup with optional address
  const handleCompleteSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await authAPI.signupComplete({
        email: formData.email,
        address: (formData.address.street || formData.address.city) ? {
          name: formData.name,
          phone: formData.phone,
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode,
        } : undefined,
      });

      if (response.data.success || response.status === 201) {
        const { user: userData, token: newToken } = response.data.data || response.data;
        if (newToken && userData) {
          localStorage.setItem('userToken', newToken);
          localStorage.setItem('user', JSON.stringify(userData));
        }

        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error completing signup:', error);
      toast.error(error.response?.data?.message || 'Failed to complete signup');
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendEmail = async () => {
    try {
      setLoading(true);
      await authAPI.sendVerificationEmail({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phone: formData.phone,
        countryCode: formData.countryCode
      });
      toast.success('Verification email resent!');
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Sign up to get started with Sequeira Foods
          </CardDescription>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs">
            <div className={`flex items-center gap-1 ${step === 'signup-form' || step === 'verification' || step === 'address' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </div>
            <div className="h-1 w-4 bg-muted"></div>
            <div className={`flex items-center gap-1 ${step === 'verification' || step === 'address' ? 'text-primary' : 'text-muted-foreground'}`}>
              <CheckCircle className="h-4 w-4" />
              <span>Verify</span>
            </div>
            <div className="h-1 w-4 bg-muted"></div>
            <div className={`flex items-center gap-1 ${step === 'address' ? 'text-primary' : 'text-muted-foreground'}`}>
              <MapPin className="h-4 w-4" />
              <span>Address</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Step 1: Signup Form */}
          {step === 'signup-form' && (
            <form onSubmit={handleSendVerificationEmail} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#0B1D35]">
                  Email Address *
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

              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-[#0B1D35]">
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

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-[#0B1D35]">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#0B1D35]">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-[#0B1D35] disabled:opacity-50"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">At least 6 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-[#0B1D35]">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-[#0B1D35] disabled:opacity-50"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
              >
                {loading ? 'Sending email...' : 'Continue'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </form>
          )}

          {/* Step 2: Email Verification */}
          {step === 'verification' && (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  We've sent a verification link to <strong>{formData.email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="token" className="text-sm font-medium text-[#0B1D35]">
                  Verification Code/Token
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Paste the token from the verification email
                </p>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="token"
                    name="verificationToken"
                    type="text"
                    placeholder="Paste verification token"
                    value={formData.verificationToken}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email?
                </p>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  className="text-xs text-primary hover:underline disabled:opacity-50"
                  disabled={loading}
                >
                  Resend Verification Email
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('signup-form');
                  setFormData(prev => ({ ...prev, verificationToken: '' }));
                }}
                className="w-full text-sm text-muted-foreground hover:underline"
              >
                Change email address
              </button>
            </form>
          )}

          {/* Step 3: Address Form */}
          {step === 'address' && (
            <form onSubmit={handleCompleteSignup} className="space-y-4 max-h-96 overflow-y-auto pr-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Email verified successfully!
                </p>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Add your address to complete your account (optional)
              </p>

              {/* Street Address */}
              <div className="space-y-2">
                <label htmlFor="street" className="text-sm font-medium text-[#0B1D35]">
                  Street Address
                </label>
                <input
                  id="street"
                  name="address_street"
                  type="text"
                  placeholder="House no, Building name"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-[#0B1D35]">
                  City
                </label>
                <input
                  id="city"
                  name="address_city"
                  type="text"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium text-[#0B1D35]">
                  State
                </label>
                <input
                  id="state"
                  name="address_state"
                  type="text"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label htmlFor="pincode" className="text-sm font-medium text-[#0B1D35]">
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
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              <button
                type="button"
                onClick={() => handleCompleteSignup({ preventDefault: () => {} })}
                className="w-full text-sm text-muted-foreground hover:underline"
              >
                Skip and create account now
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
