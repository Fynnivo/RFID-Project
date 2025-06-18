import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
      // Implement actual search logic here
    } else {
      toast.error('Please enter a search term');
    }
  };

  const handleNotificationClick = () => {
    console.log('ini sudah di klik')
    toast('No new notifications', {
      icon: '❕',
    });
  };

  return (
    <header className="px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <h1 className="text-3xl font-semibold text-orange-400 flex-shrink-0">Dashboard</h1>

        {/* Center: Search Bar */}
        <div className="flex-grow flex justify-center px-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent w-full"
            />
          </form>
        </div>

        {/* Right: Notification Bell */}
        <div className="flex-shrink-0">
          <button
            onClick={handleNotificationClick}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
        </div>
      </div>
    </header>


  );
};

export default Header;
