// components/EmptyState.jsx
import React from 'react';
import { Calendar, Search, Plus } from 'lucide-react';

const EmptyState = ({ 
  type = 'no-data', // 'no-data', 'no-results', 'error'
  onCreateNew,
  onReset 
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: <Search size={48} className="mx-auto text-gray-400 mb-4" />,
          title: "No schedules found",
          description: "No schedules match your current search and filter criteria. Try adjusting your filters or search terms.",
          actionText: "Clear Filters",
          onAction: onReset
        };
      
      case 'error':
        return {
          icon: <Calendar size={48} className="mx-auto text-red-400 mb-4" />,
          title: "Unable to load schedules",
          description: "There was an error loading the schedule data. Please try refreshing the page or contact support if the problem persists.",
          actionText: "Try Again",
          onAction: onReset
        };
      
      default: // 'no-data'
        return {
          icon: <Calendar size={48} className="mx-auto text-gray-400 mb-4" />,
          title: "No schedules yet",
          description: "Get started by creating your first class schedule. You can add class details, assign instructors, and set time slots.",
          actionText: "Create First Schedule",
          onAction: onCreateNew
        };
    }
  };

  const { icon, title, description, actionText, onAction } = getEmptyStateContent();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      {icon}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
        >
          {type === 'no-data' && <Plus size={20} />}
          {actionText}
        </button>
      )}
      
      {/* Decorative Elements */}
      <div className="mt-8 flex justify-center space-x-2 opacity-30">
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default EmptyState;