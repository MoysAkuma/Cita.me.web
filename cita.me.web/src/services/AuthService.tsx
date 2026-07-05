import { api } from '../api/backendConfig';
import endpoints from '../config/endpoints.json';

// Obtenemos la URL base del entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const registerUser = async (userData: any): Promise<any> => {
  try {
    const response = await api.post(`${BASE_URL}${endpoints.auth.register}`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error registering user');
  }
};

const loginUser = async (credentials: any): Promise<any> => {
  try {
    const response = await api.post(`${BASE_URL}${endpoints.auth.login}`, credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error logging in');
  }
};

const logoutUser = async (): Promise<any> => {
  try {
    const response = await api.post(`${BASE_URL}${endpoints.auth.logout}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error logging out');
  }
};

const refreshToken = async (refreshToken: string): Promise<any> => {
  try {
    const response = await api.post(`${BASE_URL}${endpoints.auth.refresh}`, { refreshToken });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error refreshing token');
  }
};

export { registerUser, loginUser, logoutUser, refreshToken };