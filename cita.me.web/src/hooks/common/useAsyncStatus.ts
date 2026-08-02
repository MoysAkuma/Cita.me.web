import { useCallback, useState } from 'react';

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const useAsyncStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const start = useCallback(() => {
    setLoading(true);
    setError(null);
    setSuccess(false);
  }, []);

  const succeed = useCallback(() => {
    setSuccess(true);
  }, []);

  const fail = useCallback((reason: unknown, fallbackMessage: string) => {
    setError(getErrorMessage(reason, fallbackMessage));
    setSuccess(false);
  }, []);

  const finish = useCallback(() => {
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    start,
    succeed,
    fail,
    finish,
    reset,
    setError,
  };
};
