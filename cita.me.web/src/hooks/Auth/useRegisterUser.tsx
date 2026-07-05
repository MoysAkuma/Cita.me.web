import { useState, useEffect } from 'react';
import { registerUser } from '../../services/AuthService';

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

    const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await registerUser(userData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error registering user');
    }
    setLoading(false);
  }
  return { loading, error, success, register };
};