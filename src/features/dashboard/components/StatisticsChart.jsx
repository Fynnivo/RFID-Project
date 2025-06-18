import React, { useState } from 'react';

const StatisticsChart = ({ data }) => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState('all'); // new

  const maxValue = 300;
  const chartData = data[activeTab] || data.weekly;

  const legend = [
    { color: 'bg-orange-500', label: 'All', key: 'all' },
    { color: 'bg-blue-400', label: 'Present', key: 0 },
    { color: 'bg-yellow-400', label: 'Permission', key: 1 },
    { color: 'bg-gray-300', label: 'Sick', key: 2 },
    { color: 'bg-red-400', label: 'Absent', key: 3 },
  ];

  return (
    <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
          <p className="text-sm text-gray-500">Total attendances</p>
        </div>

        {/* Tab Switch */}
        <div className="flex gap-2">
          {['weekly', 'monthly'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filter per Kategori */}
      <div className="flex flex-wrap gap-2 mb-4">
        {legend.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(item.key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${
              activeCategory === item.key
                ? 'bg-orange-100 text-orange-600 border-orange-400'
                : 'text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <div className={`w-2 h-2 ${item.color} rounded-full`} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end justify-between gap-2">
        {chartData.map((item, index) => {
          const valuesToRender =
            activeCategory === 'all' ? item.values : [item.values[activeCategory]];

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end justify-center gap-1 mb-2" style={{ height: '200px' }}>
                {valuesToRender.map((value, i) => {
                  const barIndex = activeCategory === 'all' ? i : activeCategory;
                  const colors = ['bg-orange-500', 'bg-blue-400', 'bg-yellow-400', 'bg-gray-300', 'bg-red-400'];
                  const height = (value / maxValue) * 180;

                  return (
                    <div key={i} className="flex flex-col items-center">
                      {/* Show number */}
                      <span className="text-xs text-gray-700 font-medium mb-1">{value}</span>
                      <div
                        className={`${colors[barIndex]} rounded-t-sm transition-all duration-300 hover:opacity-80`}
                        style={{ width: '10px', height: `${height}px` }}
                        title={`${value} attendances`}
                      />
                    </div>
                  );
                })}
              </div>
              <span className="text-xs text-gray-500 font-medium">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatisticsChart;

