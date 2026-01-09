import React, { useState, useMemo } from 'react';
import Layout from '@/shared/components/Layout';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import useSchedules from '../hooks/useSchedule';
import ScheduleCard from '../components/ScheduleCard';
import ScheduleForm from '../components/ScheduleForm';
import ScheduleFilters from '../components/ScheduleFilters';
import EmptyState from '../components/EmptyState';

const Schedule = () => {
  const {
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refetch,
    clearError
  } = useSchedules();

  // Form & Filter state
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [filterActive, setFilterActive] = useState('');

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        schedule.className.toLowerCase().includes(term) ||
        schedule.subject.toLowerCase().includes(term) ||
        schedule.instructor.toLowerCase().includes(term) ||
        schedule.room.toLowerCase().includes(term);

      const matchesDay = !filterDay || schedule.dayOfWeek === filterDay;
      const matchesActive = !filterActive || schedule.isActive.toString() === filterActive;

      return matchesSearch && matchesDay && matchesActive;
    });
  }, [schedules, searchTerm, filterDay, filterActive]);

  // Statistics
  const stats = useMemo(() => {
    const total = schedules.length;
    const active = schedules.filter(s => s.isActive).length;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const todayCount = schedules.filter(s => s.dayOfWeek === today && s.isActive).length;
    return { total, active, todayCount };
  }, [schedules]);

  // Handlers
  const handleCreate = () => { 
    setEditingSchedule(null); 
    setShowForm(true); 
  };
  
  const handleEdit = (s) => { 
    setEditingSchedule(s); 
    setShowForm(true); 
  };
  
  const handleDelete = async (id) => { 
    try { 
      await deleteSchedule(id); 
    } catch (e) { 
      console.error('Delete error:', e); 
    } 
  };
  
  const handleSave = async (scheduleData) => {
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, scheduleData);
      } else {
        await createSchedule(scheduleData);
      }
      setShowForm(false);
      setEditingSchedule(null);
    } catch (e) {
      console.error('Save error:', e);
      throw e; // Re-throw to be handled by form
    }
  };
  
  const handleCancel = () => { 
    setShowForm(false); 
    setEditingSchedule(null); 
  };
  
  const handleClearFilters = () => { 
    setSearchTerm(''); 
    setFilterDay(''); 
    setFilterActive(''); 
  };
  
  const handleRefresh = () => { 
    clearError(); 
    refetch(); 
  };

  return (
    <Layout title="Manajemen Jadwal">
      <main className="p-6 space-y-8">
        
        {/* ===== STATISTICS CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Jadwal"
            value={stats.total}
            color="orange"
          />
          <StatCard
            title="Jadwal Aktif"
            value={stats.active}
            color="green"
          />
          <StatCard
            title="Kelas Hari ini"
            value={stats.todayCount}
            color="blue"
          />
        </div>

        {/* ===== ALERT ===== */}
        {error && (
          <Alert className="bg-red-50 border border-red-200">
            <AlertDescription className="flex items-center justify-between text-red-700">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="font-medium hover:text-red-900 transition"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* ===== FILTERS ===== */}
        <ScheduleFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterDay={filterDay}
          onFilterDayChange={setFilterDay}
          filterActive={filterActive}
          onFilterActiveChange={setFilterActive}
          onCreateNew={handleCreate}
          onRefresh={handleRefresh}
          isLoading={loading}
        />

        {/* ===== RESULTS ===== */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading schedules...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <EmptyState
            type={schedules.length === 0 ? 'no-data' : 'no-results'}
            onCreateNew={handleCreate}
            onReset={handleClearFilters}
          />
        ) : (
          <>
            <div className="text-sm text-gray-600 mb-2">
              Showing {filteredSchedules.length} of {schedules.length} schedules
              {(searchTerm || filterDay || filterActive) && (
                <span className="ml-2 text-blue-600 font-medium">(filtered)</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchedules.map(schedule => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        <ScheduleForm
          schedule={editingSchedule}
          onSave={handleSave}
          onCancel={handleCancel}
          isOpen={showForm}
          onOpenChange={(open) => { if (!open) handleCancel(); }}
        />
      </main>
    </Layout>
  );
};

// ====== SMALL COMPONENT: STAT CARD ======
const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    orange: 'text-orange-600 bg-orange-100 border-orange-200',
    green: 'text-green-600 bg-green-100 border-green-200',
    blue: 'text-blue-600 bg-blue-100 border-blue-200',
  }[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses.split(' ')[0]}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses.split(' ').slice(1).join(' ')}`}>
          <div className={`w-6 h-6 rounded-full ${colorClasses.split(' ')[0]}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;