import { api } from '../api/backendConfig';
import endpoints from '../config/endpoints.json';

// Obtenemos la URL base del entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAppointments = async (): Promise<any> => {
  const url = `${BASE_URL}${endpoints.appointments.base}`;
  const { data } = await api.get(url);
  return data;
};

export const AppointmentsService = {
  getAppointments,
};