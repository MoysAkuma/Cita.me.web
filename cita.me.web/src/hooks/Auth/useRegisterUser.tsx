import { useState } from 'react';
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
      const response = await registerUser(userData);
      const { accessToken, refreshToken } = response.data;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error registering user');
    }
    setLoading(false);
  }
  return { loading, error, success, register };
};