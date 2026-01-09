import { useAttendance } from '../hooks/useAttendance';
import { AttendanceStats } from './AttendanceStats';
import { AttendanceTable } from './AttendanceTable';
import { AssignUserDialog } from '@/shared/components/AssignUserDialog';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Users,
  RefreshCw,
  UserPlus,
  Clock,
  CheckCircle,
  PlayCircle,
  Loader2,
  Calendar,
  BookOpen,
  User,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, isBefore, isAfter } from 'date-fns';

export const AttendanceManager = ({ scheduleId, selectedDate, setSelectedDate }) => {
  const {
    data,
    loading,
    error,
    fetchAttendance,
    updateAttendance,
    deleteAttendance,
    createManualAttendance,
    assignUser,
    removeAssignment,
    lastAttendance,
  } = useAttendance(scheduleId);

  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [classStatus, setClassStatus] = useState('NOT_STARTED');

  const last = lastAttendance?.lastAttendances?.[0];
  const lastDate = last ? new Date(last.scanTime).toLocaleString() : '-';
  const lastUser = last ? last.user?.username : '-';
  const lastStatus = last ? last.status : '-';

  useEffect(() => {
    if (!data?.schedule) return;
    const checkStatus = () => {
      const now = new Date();
      const startTime = parseISO(data.schedule.startTime);
      const endTime = parseISO(data.schedule.endTime);
      if (isBefore(now, startTime)) {
        setClassStatus('NOT_STARTED');
      } else if (isAfter(now, endTime)) {
        setClassStatus('COMPLETED');
      } else {
        setClassStatus('IN_PROGRESS');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, [data?.schedule]);

  useEffect(() => {
    if (scheduleId && selectedDate) {
      fetchAttendance(selectedDate);
    }
  }, [scheduleId, selectedDate, fetchAttendance]);

  const handleEdit = (attendance) => {
    setEditId(attendance.id);
    setEditStatus(attendance.status);
    setEditNotes(attendance.notes || '');
  };

  const handleSave = async (attendanceId) => {
    await updateAttendance(attendanceId, {
      status: editStatus,
      notes: editNotes,
      isLate: editStatus === 'LATE',
    }, selectedDate);
    setEditId(null);
  };

  const handleCreateManual = async (userId, status, notes) => {
    await createManualAttendance(userId, status, notes, selectedDate);
  };

  const handleRefresh = () => {
    fetchAttendance(selectedDate);
  };

  const getStatusBadge = () => {
    switch (classStatus) {
      case 'NOT_STARTED':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Belum Dimulai
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
            Sedang Berlangsung
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
            Sudah Selesai
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDateLabel = (dateString) => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return format(date, 'EEEE, dd MMMM yyyy');
  };

  const getTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    return `${format(parseISO(startTime), 'HH:mm')} - ${format(parseISO(endTime), 'HH:mm')}`;
  };

  // --- Loading State ---
  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                <div className="h-12 bg-gray-100 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Card className="shadow-sm border-0 bg-white">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  // --- Empty State (No Data Loaded) ---
  if (!data) {
    return (
      <Card className="shadow-sm border-0 bg-white">
        <CardContent className="p-12 text-center">
          <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tidak Ada Data
          </h3>
          <p className="text-gray-500">
            Tidak ada data kehadiran yang tersedia untuk jadwal ini
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- Main Render ---
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Data Kehadiran
                </CardTitle>
                {getStatusBadge()}
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {data.schedule?.className} - {data.schedule?.subject}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAssignModal(true)}
                variant="outline"
                disabled={loading}
                className="bg-white border-orange-200 text-orange-700 hover:text-orange-700 hover:bg-orange-50 hover:border-orange-300"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah Peserta
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Calendar className="h-8 w-8 text-blue-600 p-1.5 bg-blue-100 rounded-lg" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Tanggal Kelas
                </p>
                <p className="font-semibold text-gray-900">
                  {data.schedule?.startTime ? getDateLabel(data.schedule.startTime) : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <Clock className="h-8 w-8 text-green-600 p-1.5 bg-green-100 rounded-lg" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Waktu Kelas
                </p>
                <p className="font-semibold text-gray-900">
                  {data.schedule?.startTime && data.schedule?.endTime
                    ? getTimeRange(data.schedule.startTime, data.schedule.endTime)
                    : '-'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <User className="h-8 w-8 text-purple-600 p-1.5 bg-purple-100 rounded-lg" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Instruktur
                </p>
                <p className="font-semibold text-gray-900">
                  {data.schedule?.instructor || 'Belum ditentukan'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Picker + Absensi Terakhir */}
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="attendance-date" className="text-sm font-medium">Tanggal Absensi:</label>
          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-2 md:ml-6">
          <span className="text-sm font-medium text-gray-700">Absensi Terakhir:</span>
          {last ? (
            <span className="text-gray-900">
              {lastDate} &mdash; <span className="font-medium">{lastUser}</span> ({lastStatus})
            </span>
          ) : (
            <span className="text-gray-400">Belum ada absensi</span>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <AttendanceStats stats={data.stats} />

      {/* Table Section */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600" />
            Daftar Kehadiran
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AttendanceTable
            selectedDate={selectedDate}
            data={data}
            loading={loading}
            editId={editId}
            editStatus={editStatus}
            editNotes={editNotes}
            setEditStatus={setEditStatus}
            setEditNotes={setEditNotes}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={() => setEditId(null)}
            onDelete={deleteAttendance}
            onCreateManual={handleCreateManual}
            onRemoveAssignment={removeAssignment}
          />
        </CardContent>
      </Card>

      {/* Assign User Dialog */}
      <AssignUserDialog
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
        onAssign={async (userId) => {
          await assignUser(userId);
          handleRefresh();
        }}
        scheduleId={scheduleId}
        assignedUserIds={data.attendance?.map(item => item.userId) || []}
      />
    </div>
  );
};
