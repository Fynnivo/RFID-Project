import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/dashboardApi';
import toast from 'react-hot-toast';

export const useDashboardData = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await dashboardApi.getStats();
        setStatsData(data);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        toast.error('Failed to load dashboard statistics');
        
        // Set fallback data
        setStatsData([
          {
            title: 'Peoples',
            value: '7',
            subtitle: 'Member',
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            title: 'Peoples',
            value: '2',
            subtitle: 'Cadet Team',
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
          },
          {
            title: 'Peoples',
            value: '9',
            subtitle: 'Main Team',
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-100'
          },
          {
            title: 'Peoples',
            value: '18',
            subtitle: 'All Member',
            iconColor: 'text-green-600',
            bgColor: 'bg-green-100'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshData = async () => {
    toast.promise(
      fetchDashboardData(),
      {
        loading: 'Refreshing dashboard data...',
        success: 'Dashboard data updated!',
        error: 'Failed to refresh data'
      }
    );
  };

  return {
    statsData,
    loading,
    error,
    refreshData
  };
};
