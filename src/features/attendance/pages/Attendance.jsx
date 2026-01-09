import { useState } from 'react';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle.js';
import { ScheduleList } from '../components/ScheduleList';
import { AttendanceManager } from '../components/AttendanceManager';
import { Card } from '@/shared/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import QuickStats from '../components/QuickStats'
import Layout from '@/shared/components/Layout'

const Attendance = () => {
  useDocumentTitle('IoT - Attendance Management');
  const [scheduleId, setScheduleId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  return (
    <Layout title={"Manajemen Kehadiran"}>
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">

            {/* Quick Stats */}
            <QuickStats selectedScheduleId={scheduleId} selectedDate={selectedDate} />
          </div>
          {/* Schedule Selection */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ScheduleList
                onSelect={setScheduleId}
                selectedScheduleId={scheduleId}
              />
            </div>

            {/* Quick Info Panel */}
            <div className="space-y-4">
              <Card className="p-4 bg-white border-0 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Tips Penggunaan</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                    Pilih jadwal untuk melihat data kehadiran
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                    Gunakan tombol refresh untuk memperbarui data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                    Tambah peserta dengan tombol "Tambah Peserta"
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                    Edit status kehadiran dengan klik icon pensil
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Attendance Manager */}
          {scheduleId ? (
            <div className="animate-in fade-in-50 duration-300">
              <AttendanceManager
                scheduleId={scheduleId}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          ) : (
            <Card className="p-12 text-center bg-white border-0 shadow-sm">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pilih Jadwal Kelas
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Silakan pilih jadwal kelas dari dropdown di atas untuk mulai mengelola kehadiran siswa
              </p>
            </Card>
          )}
        </main>
      </Layout>
  );
};

export default Attendance;