import { api } from '../api/backendConfig';
import endpoints from '../config/endpoints.json';

const registerUser = async (userData: any): Promise<any> => {
  try {
    const response = await api.post(endpoints.auth.register, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error registering user');
  }
};

const loginUser = async (credentials: any): Promise<any> => {
  try {
    const response = await api.post(endpoints.auth.login, credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error logging in');
  }
};

const logoutUser = async (): Promise<any> => {
  try {
    const response = await api.post(endpoints.auth.logout);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error logging out');
  }
};

const refreshToken = async (refreshToken: string): Promise<any> => {
  try {
    const response = await api.post(endpoints.auth.refresh, { refreshToken });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error refreshing token');
  }
};

export { registerUser, loginUser, logoutUser, refreshToken };