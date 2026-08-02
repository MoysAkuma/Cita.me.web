import { api } from '../api/backendConfig';
import endpoints from '../config/endpoints.json';
import { SolictudCitaForm } from '../data/appointments';

// Obtenemos la URL base del entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAppointments = async (): Promise<any> => {
  const url = `${BASE_URL}${endpoints.appointments.base}`;
  const { data } = await api.get(url);
  return data;
};

const requestAppointment = async (appointmentData: SolictudCitaForm): Promise<any> => {
  const url = `${BASE_URL}${endpoints.appointments.base}`;
  const { data } = await api.post(url, appointmentData);
  return data;
}
export const AppointmentsService = {
  getAppointments,
  requestAppointment,
};