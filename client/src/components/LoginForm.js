import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const LoginForm = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast.success('Login successful!');
      
      // Call the success callback
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }
      
      reset();
      
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Login</h2>
          <p className="text-gray-600">Welcome back to Kwetu Farm</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Employee Code */}
          <div>
            <label className="form-label">
              <User className="inline w-4 h-4 mr-2" />
              Employee Code
            </label>
            <input
              type="text"
              className={`input-field ${errors.employee_code ? 'border-red-500' : ''}`}
              placeholder="Enter your 6-digit employee code"
              maxLength="6"
              {...register('employee_code', {
                required: 'Employee code is required',
                minLength: { value: 6, message: 'Employee code must be 6 digits' },
                maxLength: { value: 6, message: 'Employee code must be 6 digits' },
                pattern: {
                  value: /^\d{6}$/,
                  message: 'Employee code must be exactly 6 digits'
                }
              })}
            />
            {errors.employee_code && (
              <p className="error-message">{errors.employee_code.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="form-label">
              <Lock className="inline w-4 h-4 mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required'
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h4>
          <p className="text-sm text-blue-700">
            If you don't have your employee code, please contact your supervisor or HR department.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 