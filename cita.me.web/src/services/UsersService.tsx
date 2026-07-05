import { api } from '../api/backendConfig';

export const getUsers = async (): Promise<any> => {
  const { data } = await api.get('/users');
  return data;
};

