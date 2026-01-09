import { useEffect, useState } from "react";
import { scheduleService } from "../services/scheduleService";

export function useSchedule() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(!!scheduleId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scheduleId) return;

    async function fetchSchedule() {
      try {
        setLoading(true);
        const data = await scheduleService.getScheduleById(scheduleId);
        setSchedule(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [scheduleId]);

  return { schedule, loading, error };
}
