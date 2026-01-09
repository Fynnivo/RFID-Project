import { useState, useEffect, useCallback, useRef } from 'react';
import { getMemberStats, getAttendanceChart } from '../services/dashboardApi';

const CHART_CACHE_KEY = 'dashboard_attendance_chart_cache';
const STATS_CACHE_KEY = 'dashboard_member_stats_cache';
const CACHE_DURATION = 5 * 60 * 1000;

export function useDashboardData() {
  const [statsData, setStatsData] = useState([]);
  const [chartData, setChartData] = useState({ daily: [], weekly: [], monthly: [] });
  const [chartMode, setChartMode] = useState('weekly');
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState(null);

  // Refs to prevent infinite loop in useCallback
  const statsDataRef = useRef(statsData);
  const chartDataRef = useRef(chartData);

  useEffect(() => { statsDataRef.current = statsData; }, [statsData]);
  useEffect(() => { chartDataRef.current = chartData; }, [chartData]);

  const loadFromCache = useCallback(() => {
    try {
      const cachedChartRaw = localStorage.getItem(CHART_CACHE_KEY);
      const cachedStatsRaw = localStorage.getItem(STATS_CACHE_KEY);
      const now = Date.now();

      let cachedChartData = { daily: [], weekly: [], monthly: [] };
      let cachedStatsData = [];

      if (cachedChartRaw) {
        const parsed = JSON.parse(cachedChartRaw);
        if (now - parsed.timestamp < CACHE_DURATION) {
          cachedChartData = {
            daily: parsed.data.daily || [],
            weekly: parsed.data.weekly || [],
            monthly: parsed.data.monthly || [],
          };
        }
      }

      if (cachedStatsRaw) {
        const parsed = JSON.parse(cachedStatsRaw);
        if (now - parsed.timestamp < CACHE_DURATION) {
          cachedStatsData = parsed.data || [];
        }
      }

      return { chart: cachedChartData, stats: cachedStatsData };
    } catch (err) {
      console.error("Error loading from cache:", err);
      return { chart: { daily: [], weekly: [], monthly: [] }, stats: [] };
    }
  }, []);

  const saveToCache = useCallback((key, data) => {
    try {
      const payload = JSON.stringify({
        data,
        timestamp: Date.now(),
      });
      localStorage.setItem(key, payload);
    } catch (err) {
      console.error(`Error saving to cache (${key}):`, err);
    }
  }, []);

  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const { chart: cachedChart, stats: cachedStats } = loadFromCache();
      if (cachedChart) {
        setChartData(cachedChart);
        setLoadingChart(false);
      }
      if (cachedStats) {
        setStatsData(cachedStats);
        setLoadingStats(false);
      }
    }

    try {
      setLoadingStats(true);
      setLoadingChart(true);

      const [statsResult, chartResult] = await Promise.allSettled([
        getMemberStats(),
        getAttendanceChart()
      ]);

      let newStatsData = [];
      let newChartData = { daily: [], weekly: [], monthly: [] };

      if (statsResult.status === 'fulfilled') {
        newStatsData = statsResult.value || [];
        setStatsData(newStatsData);
        saveToCache(STATS_CACHE_KEY, newStatsData);
      } else {
        if (!statsDataRef.current.length) setError(prev => ({ ...prev, stats: statsResult.reason.message }));
      }

      if (chartResult.status === 'fulfilled') {
        const chartVal = chartResult.value;
        if (Array.isArray(chartVal)) {
          newChartData = { daily: [], weekly: chartVal, monthly: [] };
        } else if (
          typeof chartVal === 'object' &&
          ('daily' in chartVal || 'weekly' in chartVal || 'monthly' in chartVal)
        ) {
          newChartData = {
            daily: chartVal.daily || [],
            weekly: chartVal.weekly || [],
            monthly: chartVal.monthly || [],
          };
        }
        setChartData(newChartData);
        saveToCache(CHART_CACHE_KEY, newChartData);
      } else {
        if (
          !chartDataRef.current.daily.length &&
          !chartDataRef.current.weekly.length &&
          !chartDataRef.current.monthly.length
        ) {
          setError(prev => ({ ...prev, chart: chartResult.reason.message }));
        }
      }
    } catch (err) {
      setError(prev => ({ ...prev, global: err.message }));
    } finally {
      setLoadingStats(false);
      setLoadingChart(false);
    }
  }, [loadFromCache, saveToCache]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []); // Only run on mount

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchDashboardData(true);
    }, CACHE_DURATION - 10000);
    return () => clearInterval(refreshInterval);
  }, [fetchDashboardData]);

  const refreshData = useCallback(() => {
    setLoadingStats(true);
    setLoadingChart(true);
    setError(null);
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  const currentChart = chartData[chartMode] || [];

  return {
    statsData,
    chart: currentChart,
    chartMode,
    setChartMode,
    loadingStats,
    loadingChart,
    error,
    refreshData,
  };
}