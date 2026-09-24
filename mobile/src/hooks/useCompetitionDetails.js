import { useCallback, useEffect, useRef, useState } from 'react';
import { getCompetitionDetails } from '../api/competitions';

// Polling interval for re-syncing with the backend. This is what keeps
// "spots left" and open/closed states correct if another user
// registers/the window changes while this screen is open, without
// requiring websockets for the assignment's scope.
const REFRESH_INTERVAL_MS = 20000;

export default function useCompetitionDetails(competitionId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const clockOffsetRef = useRef(0); // serverTime - deviceTime, so countdowns aren't thrown off by a wrong device clock

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await getCompetitionDetails(competitionId);
      setData(res);
      clockOffsetRef.current = new Date(res.serverTime).getTime() - Date.now();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  const getServerNow = useCallback(() => Date.now() + clockOffsetRef.current, []);

  return { data, error, loading, reload: load, getServerNow };
}
