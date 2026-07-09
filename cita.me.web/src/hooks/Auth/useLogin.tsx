import { useState } from 'react';
import { loginUser } from '../../services/AuthService';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await loginUser(credentials);
      const { accessToken, refreshToken } = response.data;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error logging in');
    }
    setLoading(false);
  };

  return { loading, error, success, login };
};