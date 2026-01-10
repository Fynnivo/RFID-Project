import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { customToast as toast } from '@/shared/utils/lib/toast';
import { ScheduleService } from '../services/scheduleService';
import {
  Loader2,
  Calendar,
  Clock,
  Users,
  BookOpen,
  RefreshCw,
  GraduationCap,
  Search,
  ListFilter,
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isYesterday, isPast, isFuture } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator.jsx';

export const ScheduleList = ({ onSelect, selectedScheduleId }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (selectedScheduleId) {
      setSelectedSchedule(selectedScheduleId);
    }
  }, [selectedScheduleId]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const result = await ScheduleService.getAllSchedules();
      if (result.success) {
        // Sort schedules by date (newest first)
        const sortedSchedules = result.schedules.sort((a, b) =>
          new Date(b.scheduleDate) - new Date(a.scheduleDate)
        );
        setSchedules(sortedSchedules);
      } else {
        toast.error(result.message || 'Gagal memuat data jadwal');
      }
    } catch (error) {
      toast.error('Kesalahan jaringan. Coba lagi nanti.');
      console.error('Fetch schedules error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSelectScheduleFromDialog = (scheduleId) => {
    const selected = schedules.find(s => s.id === scheduleId);
    setSelectedSchedule(scheduleId);
    setIsDialogOpen(false);
    setSearchQuery('');
    if (onSelect) {
      onSelect(scheduleId);
      toast.success(`Memilih ${selected?.className} - ${selected?.subject}`);
    }
  };

  const handleRefresh = () => {
    setSearchQuery('');
    fetchSchedules();
  };

  // Extract time from ISO string (HH:MM format)
  const extractTime = (isoString) => {
    if (!isoString) return '';
    try {
      const timeMatch = isoString.match(/T(\d{2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
      }
      return '';
    } catch (e) {
      return '';
    }
  };

  // Format date in Indonesian
  const getDateLabel = (dateString) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return `Hari ini, ${format(date, 'dd MMM yyyy', { locale: localeId })}`;
      }
      if (isTomorrow(date)) {
        return `Besok, ${format(date, 'dd MMM yyyy', { locale: localeId })}`;
      }
      if (isYesterday(date)) {
        return `Kemarin, ${format(date, 'dd MMM yyyy', { locale: localeId })}`;
      }
      
      // Format: Senin, 15 Jan 2025
      return format(date, 'EEEE, dd MMM yyyy', { locale: localeId });
    } catch (e) {
      console.error('Date format error:', e);
      return dateString;
    }
  };

  // Short date format for compact display
  const getShortDateLabel = (dateString) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) return 'Hari ini';
      if (isTomorrow(date)) return 'Besok';
      if (isYesterday(date)) return 'Kemarin';
      
      return format(date, 'dd MMM yyyy', { locale: localeId });
    } catch (e) {
      return dateString;
    }
  };

  // Get time range string
  const getTimeRange = (startTime, endTime) => {
    const start = extractTime(startTime);
    const end = extractTime(endTime);
    
    if (!start || !end) return '-';
    return `${start} - ${end}`;
  };

  // Get schedule status with better logic
  const getScheduleStatus = (scheduleDate, startTime, endTime) => {
    if (!scheduleDate || !startTime || !endTime) {
      return { status: 'unknown', variant: 'secondary', label: 'Tidak Diketahui' };
    }

    try {
      const now = new Date();
      const schedDate = parseISO(scheduleDate);
      
      // Set schedule date to start of day for comparison
      schedDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // If different day
      if (schedDate.getTime() !== today.getTime()) {
        if (isPast(schedDate)) {
          return { status: 'past', variant: 'secondary', label: 'Selesai' };
        } else {
          return { status: 'upcoming', variant: 'default', label: 'Akan Datang' };
        }
      }

      // Same day - check time
      const startTimeData = extractTime(startTime);
      const endTimeData = extractTime(endTime);
      
      if (!startTimeData || !endTimeData) {
        return { status: 'unknown', variant: 'secondary', label: 'Tidak Diketahui' };
      }

      const [startHours, startMinutes] = startTimeData.split(':').map(Number);
      const [endHours, endMinutes] = endTimeData.split(':').map(Number);

      const startDateTime = new Date();
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date();
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      if (now < startDateTime) {
        return { status: 'upcoming', variant: 'default', label: 'Akan Datang' };
      } else if (now >= startDateTime && now <= endDateTime) {
        return { status: 'ongoing', variant: 'destructive', label: 'Berlangsung' };
      } else {
        return { status: 'completed', variant: 'secondary', label: 'Selesai' };
      }
    } catch (e) {
      console.error('Status calculation error:', e);
      return { status: 'unknown', variant: 'secondary', label: 'Tidak Diketahui' };
    }
  };

  const selectedScheduleData = schedules.find(s => s.id === selectedSchedule);

  // Filter schedules based on search query
  const filteredSchedules = schedules.filter(schedule =>
    schedule.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getDateLabel(schedule.scheduleDate).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Schedule Selector Card */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
              Pilih Jadwal Kelas
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="h-8 w-8 p-0"
                title="Refresh Jadwal"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              
              {/* Dialog Trigger Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className="h-8 gap-1 border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                  >
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                  <DialogHeader className="shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-orange-600" />
                      Pilih Jadwal Kelas
                    </DialogTitle>
                    
                    {/* Search Input */}
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="Cari kelas, mata kuliah, instruktur..."
                        className="pl-10 pr-4 py-2 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </DialogHeader>
                  
                  {/* Schedule List in ScrollArea */}
                  <ScrollArea className="flex-grow mt-2">
                    {loading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                        <span className="ml-2 text-gray-600">Memuat jadwal...</span>
                      </div>
                    ) : filteredSchedules.length > 0 ? (
                      <div className="space-y-2 pb-2">
                        {filteredSchedules.map((schedule) => {
                          const status = getScheduleStatus(
                            schedule.scheduleDate, 
                            schedule.startTime, 
                            schedule.endTime
                          );
                          return (
                            <div
                              key={schedule.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                                selectedSchedule === schedule.id
                                  ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-100'
                                  : 'border-gray-200'
                              }`}
                              onClick={() => handleSelectScheduleFromDialog(schedule.id)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                  <GraduationCap className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                      {schedule.className}
                                    </div>
                                    <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap mt-1">
                                      <span className="flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                                        {schedule.subject}
                                      </span>
                                      <Separator orientation="vertical" className="h-3.5" />
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                                        {getTimeRange(schedule.startTime, schedule.endTime)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Badge variant={status.variant} className="text-xs flex-shrink-0">
                                  {status.label}
                                </Badge>
                              </div>
                              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2 flex-wrap ml-7">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 flex-shrink-0" />
                                  {getShortDateLabel(schedule.scheduleDate)}
                                </span>
                                {schedule.instructor && (
                                  <>
                                    <Separator orientation="vertical" className="h-3" />
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3 flex-shrink-0" />
                                      {schedule.instructor}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">Jadwal Tidak Ditemukan</p>
                        <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda.</p>
                      </div>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Display Selected Schedule */}
          {selectedScheduleData ? (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <GraduationCap className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {selectedScheduleData.className}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedScheduleData.subject} • {getTimeRange(selectedScheduleData.startTime, selectedScheduleData.endTime)}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={getScheduleStatus(
                    selectedScheduleData.scheduleDate, 
                    selectedScheduleData.startTime, 
                    selectedScheduleData.endTime
                  ).variant}
                  className="text-xs flex-shrink-0"
                >
                  {getScheduleStatus(
                    selectedScheduleData.scheduleDate, 
                    selectedScheduleData.startTime, 
                    selectedScheduleData.endTime
                  ).label}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2 flex-wrap ml-7">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  {getDateLabel(selectedScheduleData.scheduleDate)}
                </span>
                {selectedScheduleData.instructor && (
                  <>
                    <Separator orientation="vertical" className="h-3" />
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 flex-shrink-0" />
                      {selectedScheduleData.instructor}
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Belum ada jadwal yang dipilih.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};