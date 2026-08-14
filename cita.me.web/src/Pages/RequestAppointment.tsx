import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { SolictudCitaForm } from '../data/appointments';
import { useRequestAppointment } from '../hooks/Appointments/useRequestAppointment';
import { useGetProvider } from '../hooks/Provider/useGetProvider';

type CalendarEvent = {
  id: string;
  appointmentId: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  providerId: string;
  serviceId: number;
  createdAt: string;
};

type LocalAppointment = {
  id: string;
  providerId: string;
  providerName: string;
  serviceId: number;
  serviceName: string;
  date: string;
  preferredTime: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  notes: string;
  requestedByUserId: string | null;
  createdAt: string;
  status: 'pending';
};

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return -1;
  }
  return hours * 60 + minutes;
};

const toHourLabel = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const durationToMinutes = (duration: unknown): number => {
  if (typeof duration === 'number' && Number.isFinite(duration)) {
    return duration > 0 ? duration : 60;
  }

  if (typeof duration === 'object' && duration !== null) {
    const record = duration as Record<string, unknown>;
    const numericValue = record.value ?? record.minutes ?? record.minutos ?? record.duracion;
    if (typeof numericValue === 'number' && Number.isFinite(numericValue) && numericValue > 0) {
      return numericValue;
    }

    const textValue = record.text ?? record.label ?? record.descripcion;
    if (typeof textValue === 'string') {
      return durationToMinutes(textValue);
    }
  }

  if (typeof duration !== 'string') {
    return 60;
  }

  const value = duration.toLowerCase().trim();

  if (/^\d+$/.test(value)) {
    const parsed = Number(value);
    return parsed > 0 ? parsed : 60;
  }

  const hourMatch = value.match(/(\d+(?:[\.,]\d+)?)\s*h/);
  const minuteMatch = value.match(/(\d+)\s*m/);

  const hours = hourMatch ? Number(hourMatch[1].replace(',', '.')) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  const total = Math.round(hours * 60) + minutes;

  return total > 0 ? total : 60;
};

const formatIcsDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

const escapeIcsText = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

const downloadIcsFile = (event: CalendarEvent): void => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const uid = `${event.id}@cita.me.web`;
  const now = formatIcsDate(new Date());
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cita.me//Appointment//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cita-${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

type BaseFormData = {
  fullName: string;
  phone: string;
  email: string;
  preferredTime: string;
  notes: string;
};

const buildUserFullName = (user: {
  nombre: string;
  segundo_nombre?: string;
  apellido_paterno: string;
  apellido_materno?: string;
}): string => {
  return [user.nombre, user.segundo_nombre, user.apellido_paterno, user.apellido_materno]
    .filter((part) => typeof part === 'string' && part.trim() !== '')
    .join(' ')
    .trim();
};

const weekdayLabelByDay: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo'
};

export default function RequestAppointment(): React.JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    loading: isRequestingAppointment,
    error: requestError,
    success: requestSuccess,
    requestAppointment,
  } = useRequestAppointment();
  const { provider: selectedProvider, loading: providerLoading, error: providerError } = useGetProvider(id ?? '');
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>('');
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [dateError, setDateError] = React.useState<string | null>(null);
  const [baseForm, setBaseForm] = React.useState<BaseFormData>({
    fullName: '',
    phone: '',
    email: '',
    preferredTime: '',
    notes: ''
  });

  React.useEffect(() => {
    if (!user) {
      return;
    }

    const fullName = buildUserFullName(user);
    const phone = user.telefono_whatsapp ?? user.telefono ?? '';
    const email = user.correo ?? '';

    setBaseForm((current) => ({
      ...current,
      fullName: current.fullName.trim() !== '' ? current.fullName : fullName,
      phone: current.phone.trim() !== '' ? current.phone : phone,
      email: current.email.trim() !== '' ? current.email : email,
    }));
  }, [user]);

  const isLoggedIn = Boolean(user);

  const resolvedRequesterName = (baseForm.fullName.trim() !== ''
    ? baseForm.fullName
    : user
      ? buildUserFullName(user)
      : '').trim();

  const resolvedRequesterPhone = (baseForm.phone.trim() !== ''
    ? baseForm.phone
    : user
      ? user.telefono_whatsapp ?? user.telefono ?? ''
      : '').trim();

  const resolvedRequesterEmail = (baseForm.email.trim() !== ''
    ? baseForm.email
    : user
      ? user.correo ?? ''
      : '').trim();

  const availableWeekdayLabels = React.useMemo(() => {
    if (!selectedProvider) {
      return [];
    }

    const normalizedDays = Array.from(
      new Set(selectedProvider.horario.map((item) => (item.dia_semana === 7 ? 0 : item.dia_semana)))
    ).sort((left, right) => left - right);

    return normalizedDays.map((day) => weekdayLabelByDay[day] ?? `Día ${day}`);
  }, [selectedProvider]);

  const availableServices = selectedProvider?.servicios ?? [];

  const selectedService = availableServices.find((service) => String(service.id) === selectedServiceId);

  const selectedWeekday = React.useMemo(() => {
    if (selectedDate === '') {
      return null;
    }

    const jsDay = new Date(`${selectedDate}T12:00:00`).getDay();
    return {
      jsDay,
      // Some APIs use Sunday as 7 instead of 0.
      normalizedDay: jsDay === 0 ? 7 : jsDay,
    };
  }, [selectedDate]);

  const selectedDayHorario = React.useMemo(() => {
    if (!selectedProvider || !selectedWeekday) {
      return null;
    }

    return (
      selectedProvider.horario.find(
        (item) => item.dia_semana === selectedWeekday.jsDay || item.dia_semana === selectedWeekday.normalizedDay
      ) ?? null
    );
  }, [selectedProvider, selectedWeekday]);

  const isSelectedDateOnDayOff = selectedDate !== '' && !selectedDayHorario;

  const isDateAvailableForProvider = React.useCallback(
    (isoDate: string): boolean => {
      if (!selectedProvider || isoDate === '') {
        return false;
      }

      const jsDay = new Date(`${isoDate}T12:00:00`).getDay();
      const normalizedDay = jsDay === 0 ? 7 : jsDay;

      return selectedProvider.horario.some(
        (item) => item.dia_semana === jsDay || item.dia_semana === normalizedDay
      );
    },
    [selectedProvider]
  );

  const handleDateChange = (nextDate: string) => {
    if (nextDate === '') {
      setSelectedDate('');
      setDateError(null);
      return;
    }

    if (!isDateAvailableForProvider(nextDate)) {
      setDateError('Este proveedor no atiende en el día seleccionado.');
      setSelectedDate('');
      return;
    }

    setDateError(null);
    setSelectedDate(nextDate);
  };

  const availableTimeSlots = React.useMemo(() => {
    if (!selectedProvider || !selectedService || selectedDate === '' || isSelectedDateOnDayOff) {
      return [];
    }

    if (!selectedDayHorario) {
      return [];
    }

    const openingMinutes = toMinutes(selectedDayHorario.hora_apertura);
    const closingMinutes = toMinutes(selectedDayHorario.hora_cierre);
    const durationMinutes = durationToMinutes(selectedService.duration);

    if (openingMinutes < 0 || closingMinutes < 0 || durationMinutes <= 0 || closingMinutes <= openingMinutes) {
      return [];
    }

    const slots: string[] = [];
    for (let start = openingMinutes; start + durationMinutes <= closingMinutes; start += 30) {
      slots.push(toHourLabel(start));
    }

    return slots;
  }, [
    isSelectedDateOnDayOff,
    selectedDate,
    selectedDayHorario?.hora_apertura,
    selectedDayHorario?.hora_cierre,
    selectedService
  ]);

  React.useEffect(() => {
    if (!availableTimeSlots.includes(baseForm.preferredTime)) {
      setBaseForm((current) => ({
        ...current,
        preferredTime: ''
      }));
    }
  }, [availableTimeSlots, baseForm.preferredTime]);

  const handleBaseChange = (field: keyof BaseFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBaseForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const canConfirmAppointment =
    selectedServiceId !== '' &&
    selectedDate !== '' &&
    !isSelectedDateOnDayOff &&
    baseForm.preferredTime.trim() !== '' &&
    resolvedRequesterName !== '' &&
    resolvedRequesterPhone !== '';

  const saveAppointment = async () => {
    if (!selectedProvider || !selectedService || !canConfirmAppointment) {
      return;
    }

    const appointmentPayload: SolictudCitaForm = {
      proveedorId: selectedProvider.id,
      servicioId: selectedService.id,
      userId: user?.id,
      nombreSolicitante: resolvedRequesterName,
      whatsappSolicitante: resolvedRequesterPhone,
      correoSolicitante: resolvedRequesterEmail,
      fechaSolicitada: `${selectedDate}T${baseForm.preferredTime}:00`,
      notas: baseForm.notes,
    };

    try {
      await requestAppointment(appointmentPayload);
    } catch {
      return;
    }

    const existingAppointments = JSON.parse(localStorage.getItem('appointments') ?? '[]') as LocalAppointment[];
    const appointment: LocalAppointment = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      providerId: selectedProvider.id,
      providerName: selectedProvider.nombre_comercial,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate,
      preferredTime: baseForm.preferredTime,
      requesterName: resolvedRequesterName,
      requesterPhone: resolvedRequesterPhone,
      requesterEmail: resolvedRequesterEmail,
      notes: baseForm.notes,
      requestedByUserId: user?.id ?? null,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const start = new Date(`${appointment.date}T${appointment.preferredTime}:00`);
    const end = new Date(start.getTime() + durationToMinutes(selectedService.duration) * 60 * 1000);
    const event: CalendarEvent = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      appointmentId: appointment.id,
      title: `Cita: ${selectedService.name}`,
      description: [
        `Proveedor: ${selectedProvider.nombre_comercial}`,
        `Servicio: ${selectedService.name}`,
        `Solicitante: ${appointment.requesterName}`,
        `Teléfono: ${appointment.requesterPhone}`,
        appointment.requesterEmail ? `Email: ${appointment.requesterEmail}` : '',
        appointment.notes ? `Notas: ${appointment.notes}` : ''
      ]
        .filter((line) => line !== '')
        .join('\n'),
      location: `${selectedProvider.nombre_comercial}, ${selectedProvider.ciudad.name}`,
      start: start.toISOString(),
      end: end.toISOString(),
      providerId: selectedProvider.id,
      serviceId: selectedService.id,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('appointments', JSON.stringify([appointment, ...existingAppointments]));
    const existingCalendarEvents = JSON.parse(localStorage.getItem('calendarEvents') ?? '[]') as CalendarEvent[];
    localStorage.setItem('calendarEvents', JSON.stringify([event, ...existingCalendarEvents]));
    downloadIcsFile(event);
    navigate('/appointments');
  };

  if (providerLoading) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 }, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (providerError) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Alert severity="error">{providerError}</Alert>
      </Container>
    );
  }

  if (!selectedProvider) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Alert severity="warning">No hay proveedores registrados todavía.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Solicitar cita
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Agenda con {selectedProvider.nombre_comercial}: selecciona servicio, día y hora disponible.
            </Typography>
          </Box>

          <Chip
            label={`Proveedor: ${selectedProvider.nombre_comercial} · ${selectedProvider.ciudad.name}, ${selectedProvider.estado.name}`}
            sx={{ width: 'fit-content' }}
          />

          <TextField
            select
            label="Servicio"
            value={selectedServiceId}
            onChange={(event) => {
              setSelectedServiceId(event.target.value);
            }}
            fullWidth
          >
            {availableServices.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Día"
            type="date"
            value={selectedDate}
            onChange={(event) => handleDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            error={Boolean(dateError)}
            helperText={dateError ?? 'Solo se permiten días disponibles en el horario del proveedor.'}
            fullWidth
          />

          {availableWeekdayLabels.length > 0 && (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {availableWeekdayLabels.map((dayLabel) => (
                <Chip key={dayLabel} size="small" variant="outlined" label={dayLabel} />
              ))}
            </Stack>
          )}

          {selectedService && (
            <Stack direction="row" spacing={1}>
              <Chip size="small" color="primary" label={`Duración: ${selectedService.duration}`} />
              <Chip size="small" label={`Precio: ${selectedService.precio}`} />
            </Stack>
          )}

          {selectedDate !== '' && isSelectedDateOnDayOff && (
            <Alert severity="warning">
              Este proveedor no atiende el día seleccionado. Elige otra fecha.
            </Alert>
          )}

          {selectedDate !== '' && selectedService && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Datos de tu solicitud
              </Typography>

              <Stack spacing={2}>
                {!isLoggedIn && (
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Nombre completo"
                      value={baseForm.fullName}
                      onChange={handleBaseChange('fullName')}
                      fullWidth
                    />
                    <TextField
                      label="Teléfono"
                      value={baseForm.phone}
                      onChange={handleBaseChange('phone')}
                      fullWidth
                    />
                  </Stack>
                )}

                {isLoggedIn && (resolvedRequesterName === '' || resolvedRequesterPhone === '') && (
                  <Alert severity="warning">
                    Completa tu nombre y teléfono en tu perfil para poder confirmar la cita.
                  </Alert>
                )}

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  {!isLoggedIn && (
                    <TextField
                      label="Email (opcional)"
                      value={baseForm.email}
                      onChange={handleBaseChange('email')}
                      fullWidth
                    />
                  )}
                  <TextField
                    select
                    label="Hora disponible"
                    value={baseForm.preferredTime}
                    onChange={handleBaseChange('preferredTime')}
                    disabled={availableTimeSlots.length === 0}
                    fullWidth
                  >
                    {availableTimeSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <TextField
                  label="Indicaciones adicionales"
                  value={baseForm.notes}
                  onChange={handleBaseChange('notes')}
                  multiline
                  minRows={3}
                  fullWidth
                />
              </Stack>
            </Box>
          )}

          {!selectedDate && (
            <Alert severity="info">
              Selecciona un día para mostrar el formulario personalizable.
            </Alert>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="outlined" component={Link} to="/search" fullWidth>
              Ver más proveedores
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!canConfirmAppointment || isRequestingAppointment}
              onClick={() => {
                void saveAppointment();
              }}
              fullWidth
            >
              {isRequestingAppointment ? 'Enviando solicitud...' : 'Confirmar cita'}
            </Button>
          </Stack>

          {requestError && <Alert severity="error">{requestError}</Alert>}
          {requestSuccess && <Alert severity="success">Solicitud de cita enviada correctamente.</Alert>}
        </Stack>
      </Paper>
    </Container>
  );
}
