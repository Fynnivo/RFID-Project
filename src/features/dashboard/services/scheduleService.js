const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to extract time from ISO string
const extractTime = (isoString) => {
  if (!isoString) return '';
  try {
    const timeMatch = isoString.match(/T(\d{2}):(\d{2})/);
    if (timeMatch) {
      return `${timeMatch[1]}:${timeMatch[2]}`;
    }
    return '';
  } catch (e) {
    console.error('Error extracting time:', e);
    return '';
  }
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return '';
  }
};

// Get relative time label (Today, Tomorrow, etc)
const getRelativeLabel = (dateString) => {
  if (!dateString) return '';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const schedDate = new Date(dateString);
  schedDate.setHours(0, 0, 0, 0);
  
  const diffTime = schedDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1 && diffDays <= 7) return `in ${diffDays} days`;
  if (diffDays > 7) {
    const weeks = Math.floor(diffDays / 7);
    return `in ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }
  return '';
};

export async function getUpcomingSchedules() {
  const response = await fetch(`${API_BASE_URL}/api/schedules?upcoming=true`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch schedules');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter and enhance schedules with display data
  const enhancedSchedules = result.schedules
    .filter(schedule => {
      if (!schedule.isActive) return false;
      
      const schedDate = new Date(schedule.scheduleDate);
      schedDate.setHours(0, 0, 0, 0);
      
      // Only include today and future schedules
      return schedDate >= today;
    })
    .map(schedule => {
      const schedDate = new Date(schedule.scheduleDate);
      schedDate.setHours(0, 0, 0, 0);
      
      const daysUntil = Math.ceil((schedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...schedule,
        daysUntil,
        displayDate: formatDate(schedule.scheduleDate),
        displayTime: extractTime(schedule.startTime),
        relativeLabel: getRelativeLabel(schedule.scheduleDate)
      };
    })
    .sort((a, b) => {
      // Sort by date first, then by time
      const dateCompare = new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // If same date, sort by start time
      const aTime = extractTime(a.startTime);
      const bTime = extractTime(b.startTime);
      return aTime.localeCompare(bTime);
    });

  return enhancedSchedules;
}

export async function getScheduleById(scheduleId) {
  const response = await fetch(`${API_BASE_URL}/api/schedules/${scheduleId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch schedule');
  return result.schedule;
}