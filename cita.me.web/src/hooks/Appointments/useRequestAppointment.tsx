import { AppointmentsService } from '../../services/AppointmentsService';
import { SolictudCitaForm } from '../../data/appointments';
import { useAsyncStatus } from '../common/useAsyncStatus';

export const useRequestAppointment = () => {
  const { loading, error, success, start, succeed, fail, finish, reset } = useAsyncStatus();

  const requestAppointment = async (appointmentData: SolictudCitaForm) => {
    start();
    try {
      const response = await AppointmentsService.requestAppointment(appointmentData);
      succeed();
      return response;
    } catch (err: unknown) {
      fail(err, 'Error al solicitar la cita');
      throw err;
    } finally {
      finish();
    }
  };

  return {
    loading,
    error,
    success,
    reset,
    requestAppointment,
  };
};
