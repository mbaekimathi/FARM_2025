import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const switchToSignup = () => {
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Dashboard onLogout={handleLogout} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showSignup ? (
          <SignupForm onSwitchToLogin={switchToLogin} />
        ) : (
          <LoginForm 
            onSwitchToSignup={switchToSignup} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App; 