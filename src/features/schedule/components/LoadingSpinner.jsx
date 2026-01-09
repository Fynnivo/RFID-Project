// components/LoadingSpinner.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading schedules..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Calendar Icon */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <Calendar className="absolute inset-0 m-auto text-blue-600" size={24} />
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 text-lg font-medium">{message}</p>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;