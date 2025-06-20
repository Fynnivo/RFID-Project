import React from 'react';
import { 
  Users, 
  Calendar, 
  Settings, 
  BarChart3,
  Clock,
  LogOut // Import the Logout icon
} from 'lucide-react';
import Logo from '../../../assets/logo-iotcampus-transparent.png';

const Sidebar = () => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: Calendar, label: 'Attendances', active: false },
    { icon: Users, label: 'Users', active: false },
    { icon: Clock, label: 'Schedules', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ];

  // User details
  const user = {
    name: '',
    avatar: 'path-to-avatar-image.jpg' // Replace with the actual path to the avatar image
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white z-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center space-x-4 mt-5 items-center mb-8">
        <img src={Logo} alt="IOTCampus Logo" className="w-12 h-auto" />
        <h1 className="text-orange-500 font-semibold text-xl">IoT Campus</h1>
      </div>

      {/* Navigation */}
      <nav className="px-4 flex-grow">
        <ul>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-orange-50 text-orange-600 font-bold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Information Section */}
<div className="px-4 py-3 border-t border-gray-200 mt-auto flex items-center justify-between">
  <div className="flex items-center space-x-3">
    <img 
      src={user.avatar} 
      alt={`${user.name} Avatar`} 
      className="w-10 h-10 rounded-full" 
    />
    <span className="text-gray-800 font-semibold">{user.name}</span>
  </div>
  <button className="text-gray-600 hover:text-orange-500">
    <LogOut size={20} />
  </button>
</div>

    </div>
  );
};

export default Sidebar;

