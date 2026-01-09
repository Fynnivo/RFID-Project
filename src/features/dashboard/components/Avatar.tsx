import React from 'react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  role?: string;
}

const UserAvatar = ({ name, avatarUrl, role }: UserAvatarProps) => {
  // Generate inisial dari nama (contoh: "John Doe" → "JD")
  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    return names
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2); // Ambil maksimal 2 huruf
  };

  // Warna acak berdasarkan inisial (agar konsisten)
  const getColor = (initials: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-red-500', 'bg-teal-500'
    ];
    const charCodeSum = initials
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const initials = getInitials(name);
  const colorClass = getColor(initials);

  return (
    <div className="flex items-center space-x-3">
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={`${name} Avatar`} 
          className="w-10 h-10 rounded-full object-cover" 
        />
      ) : (
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${colorClass}`}
        >
          {initials}
        </div>
      )}
      <div>
        <span className="text-gray-800 font-semibold">{name}</span>
        {role && (
          <div className="text-xs text-gray-500 capitalize">{role.replace('_', ' ').toLowerCase()}</div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;