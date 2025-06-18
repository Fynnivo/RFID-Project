import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AttendanceChart = ({ data = [], loading = false }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    toast.success(`Switched to ${period} view`);
  };

  const maxValue = data.length > 0 
    ? Math.max(...data.flatMap(d => [d.present, d.permission, d.sick, d.absent]))
    : 350;

  const legendItems = [
    { color: 'bg-blue-500', label: 'Present' },
    { color: 'bg-yellow-500', label: 'Permission' },
    { color: 'bg-green-500', label: 'Sick' },
    { color: 'bg-red-500', label: 'Absent' }
  ];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
          <p className="text-orange-600 font-medium">Total attendances</p>
        </div>
        <div className="flex space-x-2">
          {['Daily', 'Weekly', 'Monthly'].map((period) => (
            <button 
              key={period}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedPeriod === period 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handlePeriodChange(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 mb-6">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
        <button className="text-orange-600 text-sm font-medium ml-auto hover:text-orange-700">
          All Categories
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        <div className="flex items-end justify-between h-full space-x-4">
          {data.map((dayData, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center space-x-1 mb-2" style={{ height: '200px' }}>
                <div 
                  className="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ 
                    height: `${(dayData.present / maxValue) * 180}px`,
                    width: '8px'
                  }}
                  title={`Present: ${dayData.present}`}
                ></div>
                <div 
                  className="bg-yellow-500 rounded-t hover:bg-yellow-600 transition-colors cursor-pointer"
                  style={{ 
                    height: `${(dayData.permission / maxValue) * 180}px`,
                    width: '8px'
                  }}
                  title={`Permission: ${dayData.permission}`}
                ></div>
                <div 
                  className="bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                  style={{ 
                    height: `${(dayData.sick / maxValue) * 180}px`,
                    width: '8px'
                  }}
                  title={`Sick: ${dayData.sick}`}
                ></div>
                <div 
                  className="bg-red-500 rounded-t hover:bg-red-600 transition-colors cursor-pointer"
                  style={{ 
                    height: `${(dayData.absent / maxValue) * 180}px`,
                    width: '8px'
                  }}
                  title={`Absent: ${dayData.absent}`}
                ></div>
              </div>
              <span className="text-xs text-gray-600">{dayData.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
