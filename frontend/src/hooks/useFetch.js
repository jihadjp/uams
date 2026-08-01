import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import toast from 'react-hot-toast';

const useFetch = (url, options = { manual: false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    setData(null); // Clear stale data before new fetch
    try {
      const response = await client.get(url, { params });
      setData(response.data);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      // Use message as ID to prevent duplicate toasts for the same error
      toast.error(msg, { id: msg });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!options.manual) {
      fetchData();
    }
  }, [fetchData, options.manual]);

  return { data, loading, error, refetch: fetchData, setData };
};

export default useFetch;
