import { useState } from 'react';
import { loginUser } from '../../services/AuthService';
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useLogin = () => {
  const { loading, error, success, start, succeed, fail, finish } = useAsyncStatus();
  const [userData, setUserData] = useState<any>(null);
  
  const login = async (credentials: any) => {
    start();
    setUserData(null);
    try {
      const response = await loginUser(credentials);
      const { user, accessToken, refreshToken } = response.data;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      const data = { user, accessToken, refreshToken };
      setUserData(data);
      succeed();
      return data; // Retornar los datos directamente
    } catch (err: unknown) {
      fail(err, 'Error logging in');
      throw err; // Re-lanzar el error para que se pueda manejar externamente
    } finally {
      finish();
    }
  };

  return { loading, error, success, userData, login };
};