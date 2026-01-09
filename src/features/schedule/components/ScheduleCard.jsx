import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';

const ScheduleCard = ({ schedule, onEdit, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Format time from ISO string - extract HH:MM only
  const formatTime = (timeString) => {
    if (!timeString) return '';

    try {
      const timeMatch = timeString.match(/T(\d{2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
      }

      const date = new Date(timeString);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      console.error('Error formatting time:', e);
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
      console.error('Error formatting date:', e);
      return '';
    }
  };

  // Get day name from date
  const getDayName = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } catch (e) {
      return '';
    }
  };

  // Calculate duration between two times
  const calculateDuration = (startTime, endTime) => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);

    if (!start || !end) return 0;

    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  };

  // Check if schedule is upcoming, today, or past
  const getScheduleStatus = (scheduleDate) => {
    if (!scheduleDate) return 'unknown';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const schedDate = new Date(scheduleDate);
    schedDate.setHours(0, 0, 0, 0);
    
    if (schedDate.getTime() === today.getTime()) return 'today';
    if (schedDate > today) return 'upcoming';
    return 'past';
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(schedule);
  };

  const handleDeleteConfirm = () => {
    onDelete(schedule.id);
    setIsDeleteDialogOpen(false);
  };

  const dayName = getDayName(schedule.scheduleDate);
  const formattedDate = formatDate(schedule.scheduleDate);
  const formattedStartTime = formatTime(schedule.startTime);
  const formattedEndTime = formatTime(schedule.endTime);
  const duration = calculateDuration(schedule.startTime, schedule.endTime);
  const scheduleStatus = getScheduleStatus(schedule.scheduleDate);

  // Color based on day of week for visual variety
  const dayColors = {
    Monday: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    Tuesday: 'bg-green-50 border-green-200 hover:bg-green-100',
    Wednesday: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    Thursday: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    Friday: 'bg-red-50 border-red-200 hover:bg-red-100',
    Saturday: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    Sunday: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
  };

  const dayTextColors = {
    Monday: 'text-blue-700',
    Tuesday: 'text-green-700',
    Wednesday: 'text-purple-700',
    Thursday: 'text-orange-700',
    Friday: 'text-red-700',
    Saturday: 'text-yellow-700',
    Sunday: 'text-gray-700'
  };

  return (
    <div className={`
      p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer relative
      ${dayColors[dayName] || 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
      ${scheduleStatus === 'past' ? 'opacity-60' : ''}
    `}>
      {/* Status Badge */}
      {scheduleStatus === 'today' && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-full">
            Hari Ini
          </span>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {schedule.className}
          </h3>
          <p className={`text-sm font-medium ${dayTextColors[dayName] || 'text-gray-600'}`}>
            {schedule.subject}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="p-2 h-auto text-orange-600 hover:bg-orange-100 hover:text-orange-700 rounded-full transition-colors duration-200 hover:scale-110"
            title="Edit Schedule"
          >
            <Edit size={16} />
          </Button>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="p-2 h-auto text-red-600 hover:bg-red-100 hover:text-red-700 rounded-full transition-colors duration-200 hover:scale-110"
                title="Delete Schedule"
              >
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
                <AlertDialogDescription>
                  Yakin ingin menghapus data "{schedule.className}"? Aksi ini tidak bisa dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Schedule Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Calendar size={16} className="text-gray-500 flex-shrink-0" />
          <span className={`font-medium ${dayTextColors[dayName] || 'text-gray-700'}`}>
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Clock size={16} className="text-gray-500 flex-shrink-0" />
          <span>{formattedStartTime} - {formattedEndTime}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-700">
          <User size={16} className="text-gray-500 flex-shrink-0" />
          <span className="truncate">{schedule.instructor}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-700">
          <MapPin size={16} className="text-gray-500 flex-shrink-0" />
          <span>Ruang {schedule.room}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${schedule.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          }
        `}>
          {schedule.isActive ? 'Aktif' : 'Tidak Aktif'}
        </span>

        {/* Time Badge */}
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {duration > 0 ? `${duration} menit` : 'Data tidak valid'}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;