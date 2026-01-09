// src/features/dashboard/components/UpcomingSchedule.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UpcomingSchedule = ({ data }) => {
  const handleScheduleClick = (scheduleName) => {
    toast.success(`Opening ${scheduleName}`);
    // Implement navigation or modal logic here
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Jadwal yang Akan Datang</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 cursor-pointer transition-colors"
            onClick={() => handleScheduleClick(item.name)}
          >
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800 mb-1">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
            <ChevronRight className="text-gray-400 hover:text-gray-600 transition-colors" size={16} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSchedule;
