// components/ScheduleForm.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, User, MapPin, BookOpen, School } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';

const ScheduleForm = ({ schedule, onSave, onCancel, isOpen, onOpenChange }) => {
  const [formData, setFormData] = useState({
    className: '',
    subject: '',
    instructor: '',
    room: '',
    scheduleDate: '',
    startTime: '',
    endTime: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract HH:MM from ISO string
  function extractTimeFromISO(isoString) {
    if (!isoString) return '';
    try {
      const timeMatch = isoString.match(/T(\d{2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
      }
      const date = new Date(isoString);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      console.error('Error extracting time:', e);
      return '';
    }
  }

  // Extract YYYY-MM-DD from ISO string or Date object
  function extractDateFromISO(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error('Error extracting date:', e);
      return '';
    }
  }

  // Convert HH:MM to ISO string (store as UTC with fixed date)
  function timeToISOString(timeStr) {
    if (!timeStr) return null;
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return `2000-01-01T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00.000Z`;
    } catch (e) {
      console.error('Error converting time to ISO:', e);
      return null;
    }
  }

  useEffect(() => {
    if (schedule) {
      setFormData({
        className: schedule.className || '',
        subject: schedule.subject || '',
        instructor: schedule.instructor || '',
        room: schedule.room || '',
        scheduleDate: extractDateFromISO(schedule.scheduleDate),
        startTime: extractTimeFromISO(schedule.startTime),
        endTime: extractTimeFromISO(schedule.endTime),
        isActive: schedule.isActive !== undefined ? schedule.isActive : true
      });
    } else {
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      
      setFormData({
        className: '',
        subject: '',
        instructor: '',
        room: '',
        scheduleDate: formattedToday,
        startTime: '',
        endTime: '',
        isActive: true
      });
    }
    setErrors({});
  }, [schedule, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.className.trim()) {
      newErrors.className = 'Nama kelas wajib diisi';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Mata pelajaran wajib diisi';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instruktur wajib diisi';
    }

    if (!formData.room.trim()) {
      newErrors.room = 'Ruangan wajib diisi';
    }

    if (!formData.scheduleDate) {
      newErrors.scheduleDate = 'Tanggal jadwal wajib diisi';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Jam mulai wajib diisi';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Jam selesai wajib diisi';
    }

    if (formData.startTime && formData.endTime) {
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
      const startMinutesTotal = startHours * 60 + startMinutes;
      const endMinutesTotal = endHours * 60 + endMinutes;

      if (endMinutesTotal <= startMinutesTotal) {
        newErrors.endTime = 'Jam selesai harus setelah jam mulai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const startTimeISO = timeToISOString(formData.startTime);
      const endTimeISO = timeToISOString(formData.endTime);

      if (!startTimeISO || !endTimeISO) {
        setErrors({ submit: 'Format waktu tidak valid' });
        setIsSubmitting(false);
        return;
      }

      const scheduleDate = new Date(formData.scheduleDate).toISOString();

      const scheduleData = {
        className: formData.className.trim(),
        subject: formData.subject.trim(),
        instructor: formData.instructor.trim(),
        room: formData.room.trim(),
        scheduleDate: scheduleDate,
        startTime: startTimeISO,
        endTime: endTimeISO,
        isActive: Boolean(formData.isActive)
      };

      await onSave(scheduleData);
      
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        className: '',
        subject: '',
        instructor: '',
        room: '',
        scheduleDate: today,
        startTime: '',
        endTime: '',
        isActive: true
      });
      setErrors({});
      
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Gagal menyimpan jadwal' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleCancel = () => {
    setErrors({});
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      className: '',
      subject: '',
      instructor: '',
      room: '',
      scheduleDate: today,
      startTime: '',
      endTime: '',
      isActive: true
    });
    onCancel();
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-700">
            <School size={20} />
            {schedule ? 'Ubah Jadwal' : 'Buat Jadwal Baru'}
          </DialogTitle>
          <DialogDescription>
            {schedule
              ? 'Perbarui informasi jadwal di bawah ini.'
              : 'Isi rincian untuk membuat jadwal kelas baru.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Class Name */}
          <div className="grid gap-2">
            <Label htmlFor="className" className="flex items-center gap-2">
              <School size={16} />
              Nama Kelas
            </Label>
            <Input
              id="className"
              name="className"
              value={formData.className}
              onChange={handleInputChange}
              placeholder="contoh: Matematika Kelas X-1"
              className={errors.className ? 'border-red-500' : ''}
            />
            {errors.className && (
              <p className="text-sm text-red-500">{errors.className}</p>
            )}
          </div>

          {/* Subject */}
          <div className="grid gap-2">
            <Label htmlFor="subject" className="flex items-center gap-2">
              <BookOpen size={16} />
              Mata Pelajaran
            </Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="contoh: Matematika"
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Instructor */}
          <div className="grid gap-2">
            <Label htmlFor="instructor" className="flex items-center gap-2">
              <User size={16} />
              Instruktur
            </Label>
            <Input
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              placeholder="contoh: Dr. Sarah Johnson"
              className={errors.instructor ? 'border-red-500' : ''}
            />
            {errors.instructor && (
              <p className="text-sm text-red-500">{errors.instructor}</p>
            )}
          </div>

          {/* Room */}
          <div className="grid gap-2">
            <Label htmlFor="room" className="flex items-center gap-2">
              <MapPin size={16} />
              Ruangan
            </Label>
            <Input
              id="room"
              name="room"
              value={formData.room}
              onChange={handleInputChange}
              placeholder="contoh: A101"
              className={errors.room ? 'border-red-500' : ''}
            />
            {errors.room && (
              <p className="text-sm text-red-500">{errors.room}</p>
            )}
          </div>

          {/* Schedule Date */}
          <div className="grid gap-2">
            <Label htmlFor="scheduleDate" className="flex items-center gap-2">
              <Calendar size={16} />
              Tanggal Jadwal
            </Label>
            <Input
              id="scheduleDate"
              name="scheduleDate"
              type="date"
              value={formData.scheduleDate}
              onChange={handleInputChange}
              className={errors.scheduleDate ? 'border-red-500' : ''}
            />
            {errors.scheduleDate && (
              <p className="text-sm text-red-500">{errors.scheduleDate}</p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock size={16} />
                Jam Mulai
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime" className="flex items-center gap-2">
                <Clock size={16} />
                Jam Selesai
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked === true)}
            />
            <Label
              htmlFor="isActive"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Jadwal Aktif
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? 'Menyimpan...' : (schedule ? 'Perbarui Jadwal' : 'Buat Jadwal')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleForm;