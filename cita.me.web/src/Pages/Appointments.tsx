import React from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

type Appointment = {
  id: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  preferredTime: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  notes: string;
  customFields: Record<string, string>;
  requestedByUserId: string | null;
  createdAt: string;
  status: 'pending';
};

function formatDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('es-MX', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function Appointments(): React.JSX.Element {
  const { user } = useAuth();
  const isProvider = user?.role === 'provider';

  const appointments = React.useMemo(() => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') ?? '[]') as Appointment[];

    if (isProvider) {
      return allAppointments;
    }

    if (!user?.id) {
      return [];
    }

    return allAppointments.filter((appointment) => appointment.requestedByUserId === user.id);
  }, [isProvider, user?.id]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Mis citas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isProvider
                ? 'Solicitudes de citas recibidas por proveedores.'
                : 'Citas que has solicitado con proveedores.'}
            </Typography>
          </Box>

          {appointments.length === 0 && (
            <Alert severity="info">
              {isProvider
                ? 'A\u00FAn no tienes solicitudes de cita.'
                : 'A\u00FAn no has solicitado citas.'}
            </Alert>
          )}

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
            }}
          >
            {appointments.map((appointment) => (
              <Card key={appointment.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                      <Typography variant="h6">{appointment.serviceName}</Typography>
                      <Chip label="Pendiente" size="small" color="warning" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Proveedor: {appointment.providerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {formatDate(appointment.date)}
                    </Typography>
                    {appointment.preferredTime && (
                      <Typography variant="body2" color="text.secondary">
                        Hora preferida: {appointment.preferredTime}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Solicitante: {appointment.requesterName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tel\u00E9fono: {appointment.requesterPhone}
                    </Typography>
                    {appointment.requesterEmail && (
                      <Typography variant="body2" color="text.secondary">
                        Email: {appointment.requesterEmail}
                      </Typography>
                    )}
                    {appointment.notes && (
                      <Typography variant="body2" color="text.secondary">
                        Notas: {appointment.notes}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button component={Link} to="/request-appointment" variant="contained" fullWidth>
              Solicitar nueva cita
            </Button>
            <Button component={Link} to="/search" variant="outlined" fullWidth>
              Ver proveedores
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
