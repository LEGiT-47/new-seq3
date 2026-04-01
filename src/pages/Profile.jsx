import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Check, X, Lock } from 'lucide-react';
import { toast } from 'sonner';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        const profileData = response.data.data;
        setProfile(profileData);
        setFormData({
          name: profileData.name,
          phone: profileData.phone,
        });
        setAddresses(profileData.addresses || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Name and phone cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile(formData.name, formData.phone);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone,
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1D35] px-4 py-8 text-[#F8F4EC] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and addresses</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{profile.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Email (Read-only)</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Keep your account secure by changing your password regularly.
            </p>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowChangePassword(true)}
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Addresses Card */}
        {addresses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Saved Addresses</CardTitle>
              </div>
              <CardDescription>Your delivery addresses</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {addresses.map((address, idx) => (
                  <div key={idx} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{address.name || 'Address ' + (idx + 1)}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.street}</p>
                    {address.city && (
                      <p className="text-sm text-muted-foreground">
                        {address.city}
                        {address.state && `, ${address.state}`}
                        {address.pincode && ` - ${address.pincode}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/select-address')}
              >
                Manage Addresses
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={() => {
          // Optionally refresh profile or just close the modal
          toast.success('Password updated successfully!');
        }}
      />
    </div>
  );
};

export default Profile;
