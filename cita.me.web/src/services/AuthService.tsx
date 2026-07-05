import { api } from '../api/backendConfig';

const registerUser = async (userData: any): Promise<any> => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error registering user');
  }
};

const loginUser = async (credentials: any): Promise<any> => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error logging in');
  }
};

const logoutUser = async (): Promise<any> => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error logging out');
  }
};

const refreshToken = async (refreshToken: string): Promise<any> => {
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error refreshing token');
  }
};

export { registerUser, loginUser, logoutUser, refreshToken };