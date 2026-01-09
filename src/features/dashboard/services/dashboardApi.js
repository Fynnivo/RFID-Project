const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAttendanceChart() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/attendance-chart`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch chart data');
  return result.data;
}

export async function getMemberStats() {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch users');
  // Group by role, exclude ADMIN
  const stats = {};
  result.users.forEach(u => {
    if (u.role !== 'ADMIN') {
      stats[u.role] = (stats[u.role] || 0) + 1;
    }
  });
  return Object.entries(stats).map(([role, count]) => ({
  value: count, // <-- gunakan value angka
  title: "Peoples",
  subtitle: role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
  iconColor: role === 'MAIN_TEAM' ? 'text-blue-600'
            : role === 'MEMBER' ? 'text-green-600'
            : 'text-yellow-600',
  bgColor: role === 'MAIN_TEAM' ? 'bg-blue-100'
          : role === 'MEMBER' ? 'bg-green-100'
          : 'bg-yellow-100'
}));
}