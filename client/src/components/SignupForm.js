import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Upload, User, Phone, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const SignupForm = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const password = watch('password');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_names', data.full_names);
      formData.append('phone_number', data.phone_number);
      formData.append('identification_number', data.identification_number);
      formData.append('password', data.password);
      formData.append('confirm_password', data.confirm_password);
      
      if (selectedImage) {
        formData.append('profile_image', selectedImage);
      }

      const response = await authAPI.signup(formData);
      
      toast.success('Registration successful! Please save your employee code.');
      
      // Show employee code in a modal or alert
      alert(`Registration successful!\n\nYour Employee Code: ${response.data.employee_code}\n\nPlease save this code - you'll need it to login!`);
      
      reset();
      setSelectedImage(null);
      setImagePreview(null);
      
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Signup</h2>
          <p className="text-gray-600">Join Kwetu Farm Team</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Names */}
          <div>
            <label className="form-label">
              <User className="inline w-4 h-4 mr-2" />
              Full Names
            </label>
            <input
              type="text"
              className={`input-field ${errors.full_names ? 'border-red-500' : ''}`}
              placeholder="Enter your full names"
              {...register('full_names', {
                required: 'Full names are required',
                minLength: { value: 2, message: 'Names must be at least 2 characters' },
                maxLength: { value: 255, message: 'Names must be less than 255 characters' }
              })}
            />
            {errors.full_names && (
              <p className="error-message">{errors.full_names.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="form-label">
              <Phone className="inline w-4 h-4 mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              className={`input-field ${errors.phone_number ? 'border-red-500' : ''}`}
              placeholder="e.g., 0712345678 or +254712345678"
              {...register('phone_number', {
                required: 'Phone number is required',
                pattern: {
                  value: /^(\+254|0)[17]\d{8}$/,
                  message: 'Please enter a valid Kenyan phone number'
                }
              })}
            />
            {errors.phone_number && (
              <p className="error-message">{errors.phone_number.message}</p>
            )}
          </div>

          {/* Identification Number */}
          <div>
            <label className="form-label">
              <CreditCard className="inline w-4 h-4 mr-2" />
              Identification Number
            </label>
            <input
              type="text"
              className={`input-field ${errors.identification_number ? 'border-red-500' : ''}`}
              placeholder="Enter your ID number"
              {...register('identification_number', {
                required: 'Identification number is required',
                minLength: { value: 5, message: 'ID must be at least 5 characters' },
                maxLength: { value: 50, message: 'ID must be less than 50 characters' }
              })}
            />
            {errors.identification_number && (
              <p className="error-message">{errors.identification_number.message}</p>
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
                placeholder="Create a strong password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number'
                  }
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

          {/* Confirm Password */}
          <div>
            <label className="form-label">
              <Lock className="inline w-4 h-4 mr-2" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`input-field pr-10 ${errors.confirm_password ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
                {...register('confirm_password', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="error-message">{errors.confirm_password.message}</p>
            )}
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="form-label">
              <Upload className="inline w-4 h-4 mr-2" />
              Profile Image (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
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
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm; 