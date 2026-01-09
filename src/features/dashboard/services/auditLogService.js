const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAuditLogs() {
  const response = await fetch(`${API_BASE_URL}/api/audit-logs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch logs');
  return result.logs;
}