// src/features/dashboard/components/UserProfile.jsx
import React from 'react';

const UserProfile = ({ user = { name: 'Amcu Mabok', role: 'Super Admin', initials: 'AM', isOnline: true } }) => {
  return (
    <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">{user.initials}</span>
        </div>
        <div>
          <p className="font-medium text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
        <div className="ml-auto">
          <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
