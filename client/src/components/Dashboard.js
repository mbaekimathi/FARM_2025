import React, { useState, useEffect } from 'react';
import { User, Phone, CreditCard, LogOut, Shield, Calendar } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    if (onLogout) {
      onLogout();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load profile</p>
          <button
            onClick={handleLogout}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Kwetu Farm Employee Portal
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center mb-6">
                {user.profile_image ? (
                  <img
                    src={`http://localhost:5000${user.profile_image}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-primary-600" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900">{user.full_names}</h2>
                <p className="text-gray-600">Employee</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Employee Code</p>
                    <p className="font-medium text-gray-900">{user.employee_code}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{user.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Welcome to Kwetu Farm!</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-primary-50 rounded-lg p-6">
                  <h4 className="font-medium text-primary-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 bg-white rounded-lg border border-primary-200 hover:border-primary-300 transition-colors">
                      <p className="font-medium text-primary-900">View Schedule</p>
                      <p className="text-sm text-primary-600">Check your work schedule</p>
                    </button>
                    <button className="w-full text-left p-3 bg-white rounded-lg border border-primary-200 hover:border-primary-300 transition-colors">
                      <p className="font-medium text-primary-900">Submit Report</p>
                      <p className="text-sm text-primary-600">Submit daily work report</p>
                    </button>
                    <button className="w-full text-left p-3 bg-white rounded-lg border border-primary-200 hover:border-primary-300 transition-colors">
                      <p className="font-medium text-primary-900">Request Leave</p>
                      <p className="text-sm text-primary-600">Submit leave request</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-green-900">Successfully logged in</p>
                        <p className="text-xs text-green-600">Just now</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-green-900">Profile updated</p>
                        <p className="text-xs text-green-600">Today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 