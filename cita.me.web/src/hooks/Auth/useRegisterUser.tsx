import { registerUser } from '../../services/AuthService';
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useRegisterUser = () => {
  const { loading, error, success, start, succeed, fail, finish } = useAsyncStatus();

  const register = async (userData: any) => {
    start();
    try {
      const response = await registerUser(userData);
      const { accessToken, refreshToken } = response.data;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      succeed();
    } catch (err: unknown) {
      fail(err, 'Error registering user');
    } finally {
      finish();
    }
  }
  return { loading, error, success, register };
};