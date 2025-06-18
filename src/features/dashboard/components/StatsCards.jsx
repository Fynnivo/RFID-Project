import React from 'react';
import { Users } from 'lucide-react';

const StatsCard = ({ 
  title = "Peoples", 
  value = "0", 
  subtitle = "Member", 
  iconColor = "text-blue-600", 
  bgColor = "bg-orange-100",
  loading = false,
  borderColor = "border-orange-400",
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-md  transition-shadow cursor-pointer `}>
      <div className="flex items-center">
        {/* Moved the icon before the texts */}
        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mr-4`}>
          <Users className={iconColor} size={24} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value} {title}</p>
          <p className="text-gray-500 text-xs">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

