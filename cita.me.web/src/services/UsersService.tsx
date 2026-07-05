import { api } from '../api/backendConfig';
import endpoints from '../config/endpoints.json';

// Obtenemos la URL base del entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getUsers = async (): Promise<any> => {
  const url = `${BASE_URL}${endpoints.users.base}`;
  const { data } = await api.get(url);
  return data;
};

const updateUserProfile = async (userData: any): Promise<any> => {
  const url = `${BASE_URL}${endpoints.users.base}`;
  const { data } = await api.put(url, userData);
  return data;
}

export const UsersService = {
  getUsers,
  updateUserProfile
};

