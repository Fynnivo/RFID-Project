// components/ScheduleFilters.jsx
import React from 'react';
import { Search, Filter, Plus, RefreshCw } from 'lucide-react';

const ScheduleFilters = ({
  searchTerm,
  onSearchChange,
  filterDay,
  onFilterDayChange,
  filterActive,
  onFilterActiveChange,
  onCreateNew,
  onRefresh,
  isLoading
}) => {
  const daysOfWeek = [
    'Senin', 'Selasa', 'Rabu', 'Kamis',
    'Jumat', 'Sabtu', 'Minggu'
  ];

  const handleClearFilters = () => {
    onSearchChange('');
    onFilterDayChange('');
    onFilterActiveChange('');
  };

  const hasActiveFilters = searchTerm || filterDay || filterActive;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari jadwal, mata pelajaran, atau instruktur..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-colors"
            />
          </div>

          {/* Day Filter */}
          <div className="relative">
            <select
              value={filterDay}
              onChange={(e) => onFilterDayChange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none pr-10 min-w-[140px]"
            >
              <option value="">Semua Hari</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterActive}
              onChange={(e) => onFilterActiveChange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none pr-10 min-w-[120px]"
            >
              <option value="">Semua Status</option>
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <RefreshCw size={16} />
              Hapus Filter
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full lg:w-auto">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`
              px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
              ${isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Perbarui
          </button>

          <button
            onClick={onCreateNew}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all duration-200 flex items-center gap-2 whitespace-nowrap hover:shadow-lg"
          >
            <Plus size={20} />
            Tambah Jadwal
          </button>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filter aktif:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Cari: "{searchTerm}"
              </span>
            )}
            {filterDay && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Hari: {filterDay}
              </span>
            )}
            {filterActive && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Status: {filterActive === 'true' ? 'Aktif' : 'Tidak Aktif'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleFilters;