import { useState } from 'react';
import { loginUser } from '../../services/AuthService';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setUserData(null);
    try {
      const response = await loginUser(credentials);
      const { user, accessToken, refreshToken } = response.data;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      const data = { user, accessToken, refreshToken };
      setUserData(data);
      setSuccess(true);
      setLoading(false);
      return data; // Retornar los datos directamente
    } catch (err: any) {
      setError(err.message || 'Error logging in');
      setLoading(false);
      throw err; // Re-lanzar el error para que se pueda manejar externamente
    }
  };

  return { loading, error, success, userData, login };
};