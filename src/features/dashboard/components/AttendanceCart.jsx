import React, { useState, useMemo } from 'react'; // Tambahkan useMemo
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'; // Tambahkan CartesianGrid jika diinginkan

const MODES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' }
];

const COLORS = {
  PRESENT: '#2563eb',
  LATE: '#fbbf24',
  ABSENT: '#ef4444',
  EXCUSED: '#22c55e'
};

const LEGEND_ITEMS = [
  { key: 'PRESENT', label: 'Present', color: COLORS.PRESENT },
  { key: 'LATE', label: 'Late', color: COLORS.LATE },
  { key: 'ABSENT', label: 'Absent', color: COLORS.ABSENT },
  { key: 'EXCUSED', label: 'Excused', color: COLORS.EXCUSED }
];

// Komponen Tooltip yang dioptimalkan (diluar render utama untuk mencegah re-render)
const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

const AttendanceChart = ({ data, loading, mode, onModeChange, onRefresh }) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  // Memoize data sorting untuk mencegah perhitungan ulang pada setiap render
  const sortedData = useMemo(() => {
    if (!sortBy || !data) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
  }, [data, sortBy, sortOrder]); // Hanya hitung ulang jika data, sortBy, atau sortOrder berubah

  const handleLegendClick = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  // Indikator apakah data sedang dimuat (dari API atau hanya inisialisasi)
  const isActuallyLoading = loading || (data === null && !loading);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-orange-500 mb-1 flex items-center gap-2">
              Statistics
              {/* Indikator Refresh Otomatis (Opsional) */}
              {/* {isActuallyLoading && (
                <span className="text-xs text-gray-400">(Refreshing...)</span>
              )} */}
            </h3>
            <p className="text-sm text-gray-500">Total attendances</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Refresh Manual */}
            <button
              onClick={onRefresh}
              disabled={loading} // Disable saat loading
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {loading ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                )}
              </svg>
            </button>

            {/* Mode Toggle */}
            <div className="flex bg-gray-50 rounded-lg p-1">
              {MODES.map(m => (
                <button
                  key={m.key}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === m.key
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  onClick={() => onModeChange(m.key)}
                  disabled={loading || !data?.length} // Disable toggle saat loading
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {LEGEND_ITEMS.map(item => (
            <button
              key={item.key}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 hover:bg-gray-100 ${
                sortBy === item.key ? 'bg-gray-100 ring-2 ring-orange-200' : ''
              }`}
              onClick={() => handleLegendClick(item.key)}
              title={`Sort by ${item.label} ${sortBy === item.key ? (sortOrder === 'desc' ? '(High to Low)' : '(Low to High)') : ''}`}
              disabled={loading || !data?.length} // Disable jika loading atau tidak ada data
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              {sortBy === item.key && (
                <span className="text-xs text-gray-400">
                  {sortOrder === 'desc' ? '↓' : '↑'}
                </span>
              )}
            </button>
          ))}
          {sortBy && (
            <button
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() => setSortBy(null)}
              title="Clear sorting"
              disabled={loading.chart}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {isActuallyLoading ? ( // Gunakan indikator loading yang lebih tepat
          <div className="h-64 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              {data === null ? 'Loading initial data...' : 'Refreshing data...'} {/* Pesan loading yang lebih deskriptif */}
            </div>
          </div>
        ) : data && data.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No chart data available for this period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {/* Tambahkan grid jika diinginkan */}
              {/* <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" /> */}
              <XAxis
                dataKey="label"
                axisLine={true}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                minTickGap={10} // Cegah label tumpang tindih
              />
              <YAxis
                axisLine={true}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                gridLineWidth={1}
                gridLineColor="#F3F4F6"
                allowDecimals={false} // Untuk data count, biasanya integer
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Bungkus Bar dalam React.memo atau hindari re-render jika tidak perlu */}
              <Bar
                dataKey="PRESENT"
                fill={COLORS.PRESENT}
                name="Present"
                radius={[2, 2, 0, 0]}
                opacity={0.9}
              />
              <Bar
                dataKey="LATE"
                fill={COLORS.LATE}
                name="Late"
                radius={[2, 2, 0, 0]}
                opacity={0.9}
              />
              <Bar
                dataKey="ABSENT"
                fill={COLORS.ABSENT}
                name="Absent"
                radius={[2, 2, 0, 0]}
                opacity={0.9}
              />
              <Bar
                dataKey="EXCUSED"
                fill={COLORS.EXCUSED}
                name="Excused"
                radius={[2, 2, 0, 0]}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// Memoize komponen utama untuk mencegah re-render yang tidak perlu
// (hanya jika parent component sering re-render tapi props tidak berubah)
// export default React.memo(AttendanceChart);
// Catatan: Hati-hati dengan React.memo jika props seperti `data` atau `onModeChange`
// adalah objek/fungsi yang dibuat baru setiap render di parent.

export default AttendanceChart; // Ekspor default biasa untuk sekarang
