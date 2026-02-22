import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, Mail, Phone, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI } from '../lib/api';
import { toast } from 'sonner';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('email-phone'); // 'email-phone', 'otp', 'password'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (step === 'otp' && otpExpiresIn > 0) {
      const timer = setTimeout(() => {
        setOtpExpiresIn(otpExpiresIn - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (otpExpiresIn === 0 && step === 'otp' && otpExpiresIn !== 0) {
      setCanResendOtp(true);
    }
  }, [otpExpiresIn, step]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setPhone(value.slice(0, 10));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email || !phone || phone.length < 10) {
      toast.error('Please enter a valid email and phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPasswordInitiate({ email, phone });
      if (response.data.success) {
        setStep('otp');
        setOtpExpiresIn(900); // 15 minutes
        setCanResendOtp(false);
        toast.success('OTP sent to your email');
      } else {
        toast.error(response.data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.error || 'Failed to send OTP. Please check your email and phone.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPasswordVerifyOtp({ email, phone, otp });
      if (response.data.success) {
        setStep('password');
        toast.success('OTP verified successfully');
      } else {
        toast.error(response.data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please enter both passwords');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPasswordReset({
        email,
        phone,
        newPassword,
        confirmPassword,
      });
      if (response.data.success) {
        toast.success('Password reset successfully. You can now login with your new password.');
        handleClose();
      } else {
        toast.error(response.data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email-phone');
    setEmail('');
    setPhone('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpExpiresIn(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              {step === 'email-phone' && 'Enter your email and phone number'}
              {step === 'otp' && 'Enter the OTP sent to your email'}
              {step === 'password' && 'Create a new password'}
            </CardDescription>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent>
          {/* Step 1: Email and Phone */}
          {step === 'email-phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength="10"
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={loading || !email || phone.length < 10}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  We've sent a 6-digit OTP to your email. It will expire in {Math.floor(otpExpiresIn / 60)} minute{Math.floor(otpExpiresIn / 60) !== 1 ? 's' : ''} {otpExpiresIn % 60} seconds.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                  maxLength="6"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg tracking-widest"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={loading || otp.length < 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              {canResendOtp && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep('email-phone');
                  setOtp('');
                  setOtpExpiresIn(0);
                }}
              >
                Back
              </Button>
            </form>
          )}

          {/* Step 3: Password Reset */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">
                  Your OTP has been verified. Create a new password below.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-muted-foreground">Show password</span>
              </label>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep('otp');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                Back
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordModal;
