import { useEffect, useState } from "react";
import { getAuditLogs } from "../services/auditLogService";

export function useAuditLogs() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((logs) => {
        console.log("Audit logs:", logs); // Debug: cek data mentah
        // Filter log yang mengandung kata 'attendance' pada action
        const attendanceLogs = logs
          .filter(
            (log) =>
              log.action && log.action.toLowerCase().includes("attendance")
          )
          .map((log) => ({
            id: log.id,
            name: log.user?.username || "-",
            time: log.createdAt
              ? new Date(log.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "-",
            status: log.status || "-",
            schedule: log.scheduleId || "-",
          }));
        setAttendanceData(attendanceLogs);
      })
      .catch(() => setAttendanceData([]))
      .finally(() => setLoading(false));
  }, []);

  return { logs: attendanceData, loading };
}
